#!/usr/bin/env node
// Cria versões "lite" (WebP qualidade 85, max 1080px) das imagens em blob storage
// referenciadas por produtos e banners. Os originais ficam intactos no blob.
// Mapping de original→lite é guardado em data/lite-images-map.json para rastreio
// e reversão.
//
// Uso:
//   node scripts/compress-blob-images.mjs                    # dry-run (lista, não toca em nada)
//   node scripts/compress-blob-images.mjs --upload           # comprime + upload (DB intacto)
//   node scripts/compress-blob-images.mjs --upload --apply   # também actualiza DB
//   node scripts/compress-blob-images.mjs --limit 5 --upload # só processa 5 imagens
//
// Para reverter: ler data/lite-images-map.json e correr com --restore (TODO se preciso)

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';
import sharp from 'sharp';
import { put } from '@vercel/blob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MAP_PATH = path.join(ROOT, 'data/lite-images-map.json');

// CLI flags
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const flagVal = (name) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : null;
};
const DO_UPLOAD = flag('upload');
const DO_APPLY = flag('apply');
const LIMIT = flagVal('limit') ? Number(flagVal('limit')) : Infinity;
const ONLY_PRODUCT = flagVal('product'); // id do produto

// Config compressão
const MAX_WIDTH = 1080;
const QUALITY = 85;
const LITE_PREFIX = 'lite/';

// .env.local
const env = {};
try {
    const txt = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8');
    for (const line of txt.split('\n')) {
        const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
} catch {
    console.error('Não consegui ler .env.local');
    process.exit(1);
}

const MONGO_URI = env.MONGODB_URI;
const BLOB_TOKEN = env.BLOB_READ_WRITE_TOKEN;
if (!MONGO_URI) { console.error('MONGODB_URI em falta'); process.exit(1); }
if (DO_UPLOAD && !BLOB_TOKEN) { console.error('BLOB_READ_WRITE_TOKEN em falta'); process.exit(1); }
if (DO_UPLOAD) process.env.BLOB_READ_WRITE_TOKEN = BLOB_TOKEN;

const DB_NAME = env.MONGODB_DB || 'foodlab';
const client = new MongoClient(MONGO_URI);

const isBlobUrl = (u) => typeof u === 'string' && u.startsWith('http') && u.includes('blob.vercel-storage.com');
const isAlreadyLite = (u) => typeof u === 'string' && u.includes('/lite/');

// Recolhe alvos: { url, ownerType, ownerId, field, infoCardIdx? }
function collectTargets(products, banners) {
    const targets = [];
    for (const p of products) {
        if (ONLY_PRODUCT && String(p.id) !== String(ONLY_PRODUCT)) continue;
        for (const f of ['imgProd', 'imgBg', 'bottomImg']) {
            if (isBlobUrl(p[f]) && !isAlreadyLite(p[f])) {
                targets.push({ url: p[f], ownerType: 'product', ownerId: p.id, field: f });
            }
        }
        (p.infoCards || []).forEach((c, idx) => {
            if (isBlobUrl(c.image) && !isAlreadyLite(c.image)) {
                targets.push({ url: c.image, ownerType: 'product', ownerId: p.id, field: 'infoCards', infoCardIdx: idx });
            }
        });
    }
    for (const b of banners) {
        if (isBlobUrl(b.image) && !isAlreadyLite(b.image)) {
            targets.push({ url: b.image, ownerType: 'banner', ownerId: b.id, field: 'image' });
        }
    }
    return targets;
}

async function loadMap() {
    try { return JSON.parse(await fs.readFile(MAP_PATH, 'utf8')); }
    catch { return { entries: [] }; }
}

async function saveMap(map) {
    await fs.mkdir(path.dirname(MAP_PATH), { recursive: true });
    await fs.writeFile(MAP_PATH, JSON.stringify(map, null, 2) + '\n', 'utf8');
}

function liteKeyFor(originalUrl) {
    // ex: https://xxy.../produtos/prod1/img_main-XXXX.png → lite/produtos/prod1/img_main.webp
    try {
        const u = new URL(originalUrl);
        const filePath = u.pathname.replace(/^\//, '');
        // remove o suffix random "-XXXXXXXX" inserido pelo @vercel/blob
        const trimmed = filePath.replace(/-[A-Za-z0-9]{16,}\.[a-z]+$/i, (m) => {
            const ext = m.split('.').pop();
            return `.${ext}`;
        });
        const noExt = trimmed.replace(/\.[^.]+$/, '');
        return `${LITE_PREFIX}${noExt}.webp`;
    } catch {
        return `${LITE_PREFIX}${Date.now()}.webp`;
    }
}

async function downloadAndCompress(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const before = Buffer.from(await res.arrayBuffer());
    const after = await sharp(before)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: QUALITY })
        .toBuffer();
    return { before, after };
}

async function main() {
    await client.connect();
    const db = client.db(DB_NAME);
    const products = await db.collection('products').find({}, { projection: { _id: 0 } }).toArray();
    const banners = await db.collection('banners').find({}, { projection: { _id: 0 } }).toArray();

    const targets = collectTargets(products, banners).slice(0, LIMIT);
    const map = await loadMap();
    const seen = new Map(map.entries.map((e) => [e.original, e]));

    console.log(`Modo: ${DO_UPLOAD ? (DO_APPLY ? 'UPLOAD + APPLY DB' : 'UPLOAD (DB intacto)') : 'DRY-RUN'}`);
    console.log(`Targets: ${targets.length} imagens (limite ${LIMIT === Infinity ? '∞' : LIMIT})`);
    console.log(`Compressão: WebP q=${QUALITY} max ${MAX_WIDTH}px largura`);
    console.log(`Mapping: ${MAP_PATH}\n`);

    let totalBefore = 0;
    let totalAfter = 0;
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const tag = `[${i + 1}/${targets.length}]`;
        try {
            // já no mapping? salta o upload mas mantém disponível para apply
            if (seen.has(t.url)) {
                const existing = seen.get(t.url);
                console.log(`${tag} skip (já comprimido): ${shortUrl(t.url)}`);
                t._liteUrl = existing.lite;
                skipped++;
                continue;
            }

            const { before, after } = await downloadAndCompress(t.url);
            totalBefore += before.length;
            totalAfter += after.length;
            const pct = ((1 - after.length / before.length) * 100).toFixed(1);
            const kbB = (before.length / 1024).toFixed(0);
            const kbA = (after.length / 1024).toFixed(0);

            if (DO_UPLOAD) {
                const key = liteKeyFor(t.url);
                const r = await put(key, after, {
                    access: 'public',
                    contentType: 'image/webp',
                    addRandomSuffix: true,
                });
                t._liteUrl = r.url;
                map.entries.push({
                    original: t.url,
                    lite: r.url,
                    ownerType: t.ownerType,
                    ownerId: t.ownerId,
                    field: t.field,
                    infoCardIdx: t.infoCardIdx,
                    sizeBefore: before.length,
                    sizeAfter: after.length,
                    at: new Date().toISOString(),
                });
                seen.set(t.url, { lite: r.url });
                uploaded++;
                console.log(`${tag} ${kbB}KB → ${kbA}KB (-${pct}%) → ${shortUrl(r.url)}`);
            } else {
                console.log(`${tag} ${kbB}KB → ${kbA}KB (-${pct}%) [dry-run]`);
            }
        } catch (e) {
            failed++;
            console.error(`${tag} FAIL ${shortUrl(t.url)} — ${e.message}`);
        }
    }

    if (DO_UPLOAD) await saveMap(map);

    if (DO_APPLY) {
        console.log('\nA actualizar DB...');
        let dbUpdates = 0;
        for (const t of targets) {
            if (!t._liteUrl) continue;
            if (t.ownerType === 'product') {
                const update = {};
                if (t.field === 'infoCards') {
                    const prod = await db.collection('products').findOne({ id: t.ownerId });
                    if (!prod) continue;
                    const cards = [...(prod.infoCards || [])];
                    if (cards[t.infoCardIdx]) {
                        cards[t.infoCardIdx] = { ...cards[t.infoCardIdx], image: t._liteUrl };
                        await db.collection('products').updateOne({ id: t.ownerId }, { $set: { infoCards: cards } });
                        dbUpdates++;
                    }
                } else {
                    update[t.field] = t._liteUrl;
                    await db.collection('products').updateOne({ id: t.ownerId }, { $set: update });
                    dbUpdates++;
                }
            } else if (t.ownerType === 'banner') {
                await db.collection('banners').updateOne({ id: t.ownerId }, { $set: { [t.field]: t._liteUrl } });
                dbUpdates++;
            }
        }
        console.log(`DB: ${dbUpdates} registos actualizados.`);
        // bump version para invalidar cache nos quiosques
        await db.collection('meta').updateOne({ _id: 'version' }, { $inc: { v: 1 } }, { upsert: true });
        console.log('version bumped.');
    }

    const mbB = (totalBefore / 1024 / 1024).toFixed(2);
    const mbA = (totalAfter / 1024 / 1024).toFixed(2);
    const pct = totalBefore ? ((1 - totalAfter / totalBefore) * 100).toFixed(1) : 0;
    console.log(`\n=== Resumo ===`);
    console.log(`Processadas: ${targets.length}  uploaded: ${uploaded}  skipped: ${skipped}  failed: ${failed}`);
    console.log(`Tamanho: ${mbB} MB → ${mbA} MB (poupança ${pct}%)`);
    if (!DO_UPLOAD) console.log(`(dry-run, nada foi alterado. Corre com --upload para gravar.)`);
    if (DO_UPLOAD && !DO_APPLY) console.log(`(blobs comprimidos foram gravados, DB intacto. Corre com --upload --apply para apontar produtos para os lite.)`);

    await client.close();
}

function shortUrl(u) {
    try {
        const x = new URL(u);
        const last = x.pathname.split('/').slice(-2).join('/');
        return `…/${last}`;
    } catch { return u; }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
