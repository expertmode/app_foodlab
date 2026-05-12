import fs from 'node:fs/promises';
import path from 'node:path';
import { getCollection } from './db';

const DATA_PATH = path.join(process.cwd(), 'data', 'catalogConfig.json');
const useMongo = !!process.env.MONGODB_URI;
const SINGLETON_ID = 'default';

const DEFAULTS = {
    cover: { title: 'Catálogo', subtitle: 'Foodlab', date: '', image: '', showLogo: true },
    blankPage: { enabled: true, note: '' },
    index: { title: 'Índice' },
    footer: { text: '' },
};

function mergeDefaults(cfg) {
    return {
        cover: { ...DEFAULTS.cover, ...(cfg?.cover || {}) },
        blankPage: { ...DEFAULTS.blankPage, ...(cfg?.blankPage || {}) },
        index: { ...DEFAULTS.index, ...(cfg?.index || {}) },
        footer: { ...DEFAULTS.footer, ...(cfg?.footer || {}) },
    };
}

async function readJson() {
    try {
        const raw = await fs.readFile(DATA_PATH, 'utf8');
        return JSON.parse(raw);
    } catch {
        return { ...DEFAULTS };
    }
}

async function writeJson(cfg) {
    await fs.writeFile(DATA_PATH, JSON.stringify(cfg, null, 4) + '\n', 'utf8');
}

export async function readCatalogConfig() {
    if (useMongo) {
        const col = await getCollection('catalog_config');
        const doc = await col.findOne({ _id: SINGLETON_ID });
        const { _id, ...clean } = doc || {};
        return mergeDefaults(clean);
    }
    return mergeDefaults(await readJson());
}

export async function writeCatalogConfig(patch) {
    const current = await readCatalogConfig();
    const next = mergeDefaults({
        cover: { ...current.cover, ...(patch?.cover || {}) },
        blankPage: { ...current.blankPage, ...(patch?.blankPage || {}) },
        index: { ...current.index, ...(patch?.index || {}) },
        footer: { ...current.footer, ...(patch?.footer || {}) },
    });
    if (useMongo) {
        const col = await getCollection('catalog_config');
        await col.updateOne(
            { _id: SINGLETON_ID },
            { $set: next },
            { upsert: true },
        );
    } else {
        await writeJson(next);
    }
    return next;
}
