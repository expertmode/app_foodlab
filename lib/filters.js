import fs from 'node:fs/promises';
import path from 'node:path';
import { getCollection } from './db';
import { bumpVersion } from './version';

const DATA_PATH = path.join(process.cwd(), 'data', 'filtersData.json');
const useMongo = !!process.env.MONGODB_URI;

async function readJson() {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
}

async function writeJson(filters) {
    await fs.writeFile(DATA_PATH, JSON.stringify(filters, null, 4) + '\n', 'utf8');
}

export async function readFilters() {
    if (useMongo) {
        const col = await getCollection('filters');
        return col.find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
    }
    return readJson();
}

export async function getFilter(id) {
    if (useMongo) {
        const col = await getCollection('filters');
        return col.findOne({ id: Number(id) }, { projection: { _id: 0 } });
    }
    return (await readJson()).find((f) => f.id === Number(id));
}

export async function createFilter({ name, icon }) {
    const filters = await readFilters();
    const nextId = (filters.reduce((m, f) => Math.max(m, f.id || 0), 0)) + 1;
    const filter = { id: nextId, name: name || 'Filtro', icon: icon || '' };
    if (useMongo) {
        const col = await getCollection('filters');
        await col.insertOne(filter);
    } else {
        filters.push(filter);
        await writeJson(filters);
    }
    await bumpVersion();
    return filter;
}

export async function updateFilter(id, patch) {
    let result;
    if (useMongo) {
        const col = await getCollection('filters');
        const { _id, ...clean } = patch;
        const r = await col.findOneAndUpdate(
            { id: Number(id) },
            { $set: clean },
            { returnDocument: 'after', projection: { _id: 0 } },
        );
        if (!r) throw new Error(`Filter ${id} not found`);
        result = r;
    } else {
        const filters = await readJson();
        const idx = filters.findIndex((f) => f.id === Number(id));
        if (idx === -1) throw new Error(`Filter ${id} not found`);
        filters[idx] = { ...filters[idx], ...patch };
        await writeJson(filters);
        result = filters[idx];
    }
    await bumpVersion();
    return result;
}

export async function deleteFilter(id) {
    if (useMongo) {
        const col = await getCollection('filters');
        await col.deleteOne({ id: Number(id) });
    } else {
        const filters = (await readJson()).filter((f) => f.id !== Number(id));
        await writeJson(filters);
    }
    await bumpVersion();
}
