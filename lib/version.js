import fs from 'node:fs/promises';
import path from 'node:path';
import { getCollection } from './db';

const FILE_PATH = path.join(process.cwd(), 'data', 'version.json');
const useMongo = !!process.env.MONGODB_URI;

export async function getVersion() {
    if (useMongo) {
        const col = await getCollection('meta');
        const doc = await col.findOne({ _id: 'site-version' });
        return doc?.value || 0;
    }
    try {
        const txt = await fs.readFile(FILE_PATH, 'utf8');
        return JSON.parse(txt).value || 0;
    } catch { return 0; }
}

export async function bumpVersion() {
    const v = Date.now();
    if (useMongo) {
        const col = await getCollection('meta');
        await col.updateOne({ _id: 'site-version' }, { $set: { value: v } }, { upsert: true });
    } else {
        await fs.writeFile(FILE_PATH, JSON.stringify({ value: v }) + '\n');
    }
    return v;
}
