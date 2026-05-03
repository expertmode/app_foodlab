#!/usr/bin/env node
// Migra filtros para Mongo + popula product.filter[] baseado no filterMap actual.

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

const filterMap = {
    1: [14],
    2: [13, 33, 5, 19],
    3: [24, 30, 27],
    4: [4, 6],
    5: [2, 3, 22],
    6: [17, 16],
};

const filters = JSON.parse(await fs.readFile(path.join(ROOT, 'data/filtersData.json'), 'utf8'));

const client = new MongoClient(env.MONGODB_URI);
await client.connect();
const db = client.db(env.MONGODB_DB || 'foodlab');

const filtersCol = db.collection('filters');
await filtersCol.createIndex({ id: 1 }, { unique: true });
for (const f of filters) {
    await filtersCol.replaceOne({ id: f.id }, f, { upsert: true });
}
console.log(`filters: ${await filtersCol.countDocuments()}`);

const productsCol = db.collection('products');
const products = await productsCol.find({}).toArray();
let updated = 0;
for (const p of products) {
    const filterIds = [];
    for (const [fid, codes] of Object.entries(filterMap)) {
        const id = Number(fid);
        const matches = (p.ppsCode || []).some((c) => codes.includes(c));
        if (matches) filterIds.push(id);
    }
    await productsCol.updateOne({ id: p.id }, { $set: { filter: filterIds } });
    updated++;
}
console.log(`products updated with filter[]: ${updated}`);

await client.close();
