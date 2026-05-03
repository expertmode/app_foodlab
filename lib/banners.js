import fs from 'node:fs/promises';
import path from 'node:path';
import { getCollection } from './db';
import { bumpVersion } from './version';

const DATA_PATH = path.join(process.cwd(), 'data', 'bannersData.json');
const useMongo = !!process.env.MONGODB_URI;

async function readJson() {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const obj = JSON.parse(raw);
    return obj.banners || [];
}

async function writeJson(banners) {
    await fs.writeFile(DATA_PATH, JSON.stringify({ banners }, null, 4) + '\n', 'utf8');
}

export async function readBanners() {
    if (useMongo) {
        const col = await getCollection('banners');
        return col.find({}, { projection: { _id: 0 } }).sort({ order: 1, id: 1 }).toArray();
    }
    return readJson();
}

export async function getBanner(id) {
    if (useMongo) {
        const col = await getCollection('banners');
        return col.findOne({ id: Number(id) }, { projection: { _id: 0 } });
    }
    const all = await readJson();
    return all.find((b) => b.id === Number(id));
}

export async function createBanner({ image, text1 = '', text2 = '', text3 = '' }) {
    const banners = await readBanners();
    const nextId = (banners.reduce((m, b) => Math.max(m, b.id || 0), 0)) + 1;
    const banner = {
        id: nextId,
        type: 1,
        image: image || '',
        text1, text2, text3,
        order: banners.length + 1,
    };
    if (useMongo) {
        const col = await getCollection('banners');
        await col.insertOne(banner);
    } else {
        banners.push(banner);
        await writeJson(banners);
    }
    await bumpVersion();
    return banner;
}

export async function updateBanner(id, patch) {
    let result;
    if (useMongo) {
        const col = await getCollection('banners');
        const { _id, ...clean } = patch;
        const r = await col.findOneAndUpdate(
            { id: Number(id) },
            { $set: clean },
            { returnDocument: 'after', projection: { _id: 0 } },
        );
        if (!r) throw new Error(`Banner ${id} not found`);
        result = r;
    } else {
        const banners = await readJson();
        const idx = banners.findIndex((b) => b.id === Number(id));
        if (idx === -1) throw new Error(`Banner ${id} not found`);
        banners[idx] = { ...banners[idx], ...patch };
        await writeJson(banners);
        result = banners[idx];
    }
    await bumpVersion();
    return result;
}

export async function deleteBanner(id) {
    if (useMongo) {
        const col = await getCollection('banners');
        await col.deleteOne({ id: Number(id) });
    } else {
        const banners = (await readJson()).filter((b) => b.id !== Number(id));
        await writeJson(banners);
    }
    await bumpVersion();
}
