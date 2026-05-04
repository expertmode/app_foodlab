import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { getProduct, updateProduct } from '@/lib/products';
import { cardPrompt, productPrompt, aspectFor, formatFor, clean } from '@/lib/imagePrompts';
import { generateImage } from '@/lib/replicate';
import { putBlob, contentTypeFor } from '@/lib/blob';
import { bumpVersion } from '@/lib/version';

// Optimize a buffer in-memory (sem tocar no disco)
async function optimizeBuffer(buffer, ext) {
    let pipeline = sharp(buffer).rotate().resize({ width: 2048, withoutEnlargement: true });
    if (ext === 'jpg' || ext === 'jpeg') return pipeline.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    if (ext === 'png') return pipeline.png({ compressionLevel: 9 }).toBuffer();
    if (ext === 'webp') return pipeline.webp({ quality: 88 }).toBuffer();
    return buffer;
}

export async function POST(req) {
    try {
        const { productId, kind, cardId, customPrompt, model = 'flux-dev', referenceImage, referenceStrength } = await req.json();
        const product = await getProduct(productId);
        if (!product) return NextResponse.json({ error: 'product not found' }, { status: 404 });

        let prompt;
        let key; // path-like key for blob
        let fieldKey; // field on product to update

        if (kind === 'card') {
            const card = (product.infoCards || []).find((c) => c.id === Number(cardId));
            if (!card) return NextResponse.json({ error: 'card not found' }, { status: 404 });
            prompt = customPrompt || cardPrompt(
                clean(card.desc),
                clean(product.title).replace(/\n/g, ' '),
                clean(product.subTitle).replace(/\n/g, ' '),
                clean(product.description),
            );
            const ext = formatFor(card.image || 'jpg');
            key = `produtos/prod${product.id}/cards/card${card.id}.${ext}`;
            fieldKey = `card-${card.id}`;
        } else if (kind === 'img_main' || kind === 'img_bg' || kind === 'bottom_img') {
            prompt = customPrompt || productPrompt(product, kind);
            const fileKey = kind === 'img_main' ? 'imgProd' : kind === 'img_bg' ? 'imgBg' : 'bottomImg';
            const currentPath = product[fileKey] || '';
            const ext = formatFor(currentPath || (kind === 'img_main' ? '.png' : '.jpg'));
            const baseName = kind === 'img_main' ? 'img_main' : kind === 'img_bg' ? 'img_bg' : 'bottom_img';
            key = `produtos/prod${product.id}/${baseName}.${ext}`;
            fieldKey = fileKey;
        } else {
            return NextResponse.json({ error: 'invalid kind' }, { status: 400 });
        }

        const rawBuf = await generateImage({
            prompt,
            aspectRatio: aspectFor(kind),
            outputFormat: formatFor(key),
            model,
            referenceImage,
            referenceStrength,
        });
        const ext = key.split('.').pop();
        const buf = await optimizeBuffer(rawBuf, ext);
        const url = await putBlob(key, buf, contentTypeFor(key));

        // Update product: push old URL into versions, set new
        const updates = {};
        if (kind === 'card') {
            const cards = (product.infoCards || []).map((c) => {
                if (c.id !== Number(cardId)) return c;
                const versions = Array.isArray(c.versions) ? c.versions : [];
                if (c.image) versions.unshift({ url: c.image, ts: Date.now() });
                return { ...c, image: url, versions: versions.slice(0, 30) };
            });
            updates.infoCards = cards;
        } else {
            const fileKey = kind === 'img_main' ? 'imgProd' : kind === 'img_bg' ? 'imgBg' : 'bottomImg';
            const versionsKey = `${fileKey}Versions`;
            const versions = Array.isArray(product[versionsKey]) ? product[versionsKey] : [];
            if (product[fileKey]) versions.unshift({ url: product[fileKey], ts: Date.now() });
            updates[fileKey] = url;
            updates[versionsKey] = versions.slice(0, 30);
        }
        await updateProduct(product.id, updates);
        await bumpVersion();

        return NextResponse.json({ ok: true, url, prompt, ts: Date.now() });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
