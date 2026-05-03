import fs from 'node:fs/promises';
import path from 'node:path';
import { getCollection } from './db';
import { bumpVersion } from './version';

const DATA_PATH = path.join(process.cwd(), 'data', 'productsData.json');
const useMongo = !!process.env.MONGODB_URI;

// === JSON fallback ===
async function readJson() {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
}

async function writeJson(products) {
    await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 4) + '\n', 'utf8');
}

// === Public API ===
export async function readProducts() {
    if (useMongo) {
        const col = await getCollection('products');
        return col.find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
    }
    return readJson();
}

export async function writeProducts(products) {
    if (useMongo) {
        const col = await getCollection('products');
        const ops = products.map((p) => ({
            replaceOne: { filter: { id: p.id }, replacement: p, upsert: true },
        }));
        if (ops.length) await col.bulkWrite(ops);
        return;
    }
    return writeJson(products);
}

export async function getProduct(id) {
    if (useMongo) {
        const col = await getCollection('products');
        return col.findOne({ id: Number(id) }, { projection: { _id: 0 } });
    }
    const products = await readJson();
    return products.find((p) => p.id === Number(id));
}

export async function updateProduct(id, patch) {
    let result;
    if (useMongo) {
        const col = await getCollection('products');
        const { _id, ...clean } = patch;
        const r = await col.findOneAndUpdate(
            { id: Number(id) },
            { $set: clean },
            { returnDocument: 'after', projection: { _id: 0 } },
        );
        if (!r) throw new Error(`Product ${id} not found`);
        result = r;
    } else {
        const products = await readJson();
        const idx = products.findIndex((p) => p.id === Number(id));
        if (idx === -1) throw new Error(`Product ${id} not found`);
        products[idx] = { ...products[idx], ...patch };
        await writeJson(products);
        result = products[idx];
    }
    await bumpVersion();
    return result;
}

function slugify(s) {
    return (s || '')
        .toLowerCase()
        .normalize('NFKD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'produto';
}

export async function createProduct({ title, partner }) {
    const products = await readProducts();
    const nextId = (products.reduce((m, p) => Math.max(m, p.id || 0), 0)) + 1;
    const baseSlug = slugify(title);
    const existing = new Set(products.map((p) => p.keyName));
    let unique = baseSlug;
    let suffix = 1;
    while (existing.has(unique)) {
        suffix++;
        unique = `${baseSlug}-${suffix}`;
    }
    const folder = `/images/produtos/prod${nextId}`;
    const newProduct = {
        id: nextId,
        keyName: unique,
        partner: partner || '',
        title: title || '',
        subTitle: '',
        pps: '',
        ppsCode: [],
        description: '',
        pictos: [],
        infoCards: [],
        sliderTitle: '',
        imgProd: `${folder}/img_main.png`,
        imgBg: `${folder}/img_bg.jpg`,
        bottomImg: `${folder}/bottom_img.png`,
        filter: [],
        imgSize: '',
    };

    if (useMongo) {
        const col = await getCollection('products');
        await col.insertOne(newProduct);
    } else {
        products.push(newProduct);
        await writeJson(products);
    }
    await bumpVersion();
    return newProduct;
}
