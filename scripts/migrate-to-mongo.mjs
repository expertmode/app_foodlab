#!/usr/bin/env node
// Importa data/productsData.json para a coleção `products` no MongoDB.
// Uso: node scripts/migrate-to-mongo.mjs

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MongoClient } from 'mongodb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

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

const uri = env.MONGODB_URI;
const dbName = env.MONGODB_DB || 'foodlab';
if (!uri) {
    console.error('MONGODB_URI não definido em .env.local');
    process.exit(1);
}

const data = JSON.parse(
    await fs.readFile(path.join(ROOT, 'data/productsData.json'), 'utf8'),
);

console.log(`A migrar ${data.length} produtos para Mongo (DB: ${dbName})...`);

const client = new MongoClient(uri);
try {
    await client.connect();
    const col = client.db(dbName).collection('products');

    // Index único por id
    await col.createIndex({ id: 1 }, { unique: true });
    await col.createIndex({ keyName: 1 }, { unique: true });

    // Upsert produto a produto (idempotente)
    let inserted = 0;
    let updated = 0;
    for (const p of data) {
        const r = await col.replaceOne({ id: p.id }, p, { upsert: true });
        if (r.upsertedCount) inserted++;
        else if (r.modifiedCount) updated++;
    }

    console.log(`Inseridos: ${inserted}`);
    console.log(`Atualizados: ${updated}`);
    console.log(`Total na BD: ${await col.countDocuments()}`);
} catch (e) {
    console.error('Erro:', e.message);
    process.exitCode = 1;
} finally {
    await client.close();
}
