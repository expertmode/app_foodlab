import fs from 'node:fs/promises';
import path from 'node:path';
import { getCollection } from './db';

const DATA_PATH = path.join(process.cwd(), 'data', 'catalogPdfs.json');
const useMongo = !!process.env.MONGODB_URI;

async function readJson() {
    try {
        const raw = await fs.readFile(DATA_PATH, 'utf8');
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

async function writeJson(list) {
    await fs.writeFile(DATA_PATH, JSON.stringify(list, null, 4) + '\n', 'utf8');
}

function sortDesc(list) {
    return [...list].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export async function listPdfs() {
    if (useMongo) {
        const col = await getCollection('catalog_pdfs');
        const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
        return docs.map(({ _id, ...d }) => d);
    }
    return sortDesc(await readJson());
}

export async function addPdf(entry) {
    if (useMongo) {
        const col = await getCollection('catalog_pdfs');
        await col.insertOne({ ...entry });
        return entry;
    }
    const list = await readJson();
    list.push(entry);
    await writeJson(list);
    return entry;
}

export async function removePdf(id) {
    if (useMongo) {
        const col = await getCollection('catalog_pdfs');
        const doc = await col.findOne({ id });
        if (!doc) return null;
        await col.deleteOne({ id });
        const { _id, ...rest } = doc;
        return rest;
    }
    const list = await readJson();
    const idx = list.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const [removed] = list.splice(idx, 1);
    await writeJson(list);
    return removed;
}
