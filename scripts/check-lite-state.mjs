#!/usr/bin/env node
// Read-only: confirma se as imagens em Mongo já apontam para /lite/ ou ainda originais
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const env = {};
const txt = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8');
for (const line of txt.split('\n')) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const client = new MongoClient(env.MONGODB_URI);
await client.connect();
const db = client.db(env.MONGODB_DB || 'foodlab');

const products = await db.collection('products').find({}, { projection: { _id: 0 } }).toArray();
const banners = await db.collection('banners').find({}, { projection: { _id: 0 } }).toArray();

let lite = 0, orig = 0, other = 0, total = 0;
const tally = (u) => {
    if (!u || typeof u !== 'string') return;
    total++;
    if (u.includes('/lite/')) lite++;
    else if (u.includes('blob.vercel-storage.com')) orig++;
    else other++;
};

const origs = [];
const note = (u, src) => {
    if (u && typeof u === 'string' && u.includes('blob.vercel-storage.com') && !u.includes('/lite/')) {
        origs.push(`${src}: ${u}`);
    }
};

for (const p of products) {
    tally(p.imgProd); tally(p.imgBg); tally(p.bottomImg);
    note(p.imgProd, `prod ${p.id} imgProd`);
    note(p.imgBg, `prod ${p.id} imgBg`);
    note(p.bottomImg, `prod ${p.id} bottomImg`);
    (p.infoCards || []).forEach((c, i) => { tally(c.image); note(c.image, `prod ${p.id} infoCards[${i}]`); });
}
for (const b of banners) { tally(b.image); note(b.image, `banner ${b.id}`); }

console.log(`products=${products.length} banners=${banners.length}`);
console.log(`image refs: total=${total} lite=${lite} originais_blob=${orig} outros=${other}`);
console.log(`\n--- originais ainda por comprimir ---`);
origs.forEach((o) => console.log(o));
await client.close();
