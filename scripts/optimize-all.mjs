#!/usr/bin/env node
// Optimiza todas as imagens em /public/images/{produtos,banners}
// Uso: node scripts/optimize-all.mjs

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

async function* walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            // skip versions folder — não vale a pena recomprimir backups
            if (entry.name === 'versions') continue;
            yield* walk(full);
        } else {
            yield full;
        }
    }
}

async function optimize(abs) {
    const ext = abs.toLowerCase().split('.').pop();
    if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return null;
    try {
        const original = await fs.readFile(abs);
        let pipeline = sharp(original).rotate().resize({ width: 2048, withoutEnlargement: true });

        let outBuffer;
        if (ext === 'jpg' || ext === 'jpeg') {
            outBuffer = await pipeline.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
        } else if (ext === 'png') {
            outBuffer = await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer();
        } else if (ext === 'webp') {
            outBuffer = await pipeline.webp({ quality: 82 }).toBuffer();
        }

        if (outBuffer.length < original.length) {
            await fs.writeFile(abs, outBuffer);
            return { before: original.length, after: outBuffer.length };
        }
        return { before: original.length, after: original.length };
    } catch (e) {
        console.error(`fail ${abs}: ${e.message}`);
        return null;
    }
}

const dirs = [
    path.join(ROOT, 'public/images/produtos'),
    path.join(ROOT, 'public/images/banners'),
];

let totalBefore = 0;
let totalAfter = 0;
let count = 0;
let saved = 0;

for (const dir of dirs) {
    try {
        await fs.access(dir);
    } catch { continue; }
    for await (const file of walk(dir)) {
        const r = await optimize(file);
        if (!r) continue;
        count++;
        totalBefore += r.before;
        totalAfter += r.after;
        if (r.after < r.before) saved++;
        if (count % 20 === 0) {
            const pct = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
            console.log(`[${count}] poupados ${pct}% (${saved} imagens menores)`);
        }
    }
}

const pct = totalBefore ? ((1 - totalAfter / totalBefore) * 100).toFixed(1) : 0;
const mbBefore = (totalBefore / 1024 / 1024).toFixed(1);
const mbAfter = (totalAfter / 1024 / 1024).toFixed(1);
console.log(`\n=== Total ===`);
console.log(`Imagens: ${count}`);
console.log(`Antes: ${mbBefore} MB → Depois: ${mbAfter} MB (-${pct}%)`);
