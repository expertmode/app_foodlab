import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { putBlob, contentTypeFor } from '@/lib/blob';
import { getProduct, updateProduct } from '@/lib/products';
import { bumpVersion } from '@/lib/version';

async function optimizeBuffer(buffer, ext) {
    if (!['jpg','jpeg','png','webp'].includes(ext)) return buffer;
    let pipeline = sharp(buffer).rotate().resize({ width: 2048, withoutEnlargement: true });
    if (ext === 'jpg' || ext === 'jpeg') return pipeline.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    if (ext === 'png') return pipeline.png({ compressionLevel: 9 }).toBuffer();
    if (ext === 'webp') return pipeline.webp({ quality: 88 }).toBuffer();
    return buffer;
}

export async function POST(req) {
    try {
        const form = await req.formData();
        const file = form.get('file');
        const targetPath = form.get('path');
        const productId = form.get('productId');
        const kind = form.get('kind');
        const cardId = form.get('cardId');

        if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 });

        const ext = (file.name || 'image.jpg').split('.').pop().toLowerCase();
        const rawBuf = Buffer.from(await file.arrayBuffer());
        const buf = ext === 'svg' ? rawBuf : await optimizeBuffer(rawBuf, ext);

        // Build blob key
        let key;
        if (productId && kind) {
            const baseFolder = `produtos/prod${productId}`;
            if (kind === 'card') key = `${baseFolder}/cards/card${cardId}.${ext}`;
            else if (kind === 'img_main') key = `${baseFolder}/img_main.${ext}`;
            else if (kind === 'img_bg') key = `${baseFolder}/img_bg.${ext}`;
            else if (kind === 'bottom_img') key = `${baseFolder}/bottom_img.${ext}`;
        } else if (targetPath) {
            const safeRel = String(targetPath).replace(/^\/+/, '').replace(/\.\.+/g, '');
            key = safeRel.replace(/^images\//, '');
        }
        if (!key) return NextResponse.json({ error: 'key not derivable' }, { status: 400 });

        const url = await putBlob(key, buf, contentTypeFor(key));

        // Update product DB if context given
        if (productId && kind) {
            const p = await getProduct(productId);
            if (p) {
                if (kind === 'card') {
                    const cards = (p.infoCards || []).map((c) => {
                        if (c.id !== Number(cardId)) return c;
                        const versions = Array.isArray(c.versions) ? c.versions : [];
                        if (c.image) versions.unshift({ url: c.image, ts: Date.now() });
                        return { ...c, image: url, versions: versions.slice(0, 30) };
                    });
                    await updateProduct(p.id, { infoCards: cards });
                } else {
                    const fileKey = kind === 'img_main' ? 'imgProd' : kind === 'img_bg' ? 'imgBg' : 'bottomImg';
                    const versionsKey = `${fileKey}Versions`;
                    const versions = Array.isArray(p[versionsKey]) ? p[versionsKey] : [];
                    if (p[fileKey]) versions.unshift({ url: p[fileKey], ts: Date.now() });
                    await updateProduct(p.id, { [fileKey]: url, [versionsKey]: versions.slice(0, 30) });
                }
            }
        }

        await bumpVersion();
        return NextResponse.json({ ok: true, url, path: url, ts: Date.now() });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
