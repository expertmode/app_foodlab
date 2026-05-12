import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { putBlob, contentTypeFor, deleteBlob } from '@/lib/blob';
import { getProduct, updateProduct } from '@/lib/products';
import { bumpVersion } from '@/lib/version';

export const runtime = 'nodejs';
// Allow large request bodies for video upload. Without this Next/Vercel caps at ~4.5MB.
export const maxDuration = 60;

const RASTER_EXTS = ['jpg', 'jpeg', 'png', 'webp'];
const VIDEO_EXTS = ['mp4', 'webm', 'mov', 'm4v'];
const VIDEO_MAX_BYTES = 50 * 1024 * 1024; // 50MB hard cap per video

async function optimizeBuffer(buffer, ext) {
    if (!RASTER_EXTS.includes(ext)) return buffer;
    let pipeline = sharp(buffer).rotate().resize({ width: 2048, withoutEnlargement: true });
    if (ext === 'jpg' || ext === 'jpeg') return pipeline.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    if (ext === 'png') return pipeline.png({ compressionLevel: 9 }).toBuffer();
    if (ext === 'webp') return pipeline.webp({ quality: 88 }).toBuffer();
    return buffer;
}

// 1080px WebP q85 — same recipe as scripts/compress-blob-images.mjs.
// Used for product images (imgProd/imgBg/bottomImg/cards) so kiosk loads stay fast.
async function optimizeToLiteWebp(buffer) {
    return sharp(buffer)
        .rotate()
        .resize({ width: 1080, withoutEnlargement: true, fit: 'inside' })
        .webp({ quality: 85 })
        .toBuffer();
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

        const origExt = (file.name || 'image.jpg').split('.').pop().toLowerCase();
        const isVideo = kind === 'video' || VIDEO_EXTS.includes(origExt);

        if (isVideo) {
            if (!VIDEO_EXTS.includes(origExt)) {
                return NextResponse.json({ error: `Formato não suportado: .${origExt}. Usa mp4, webm ou mov.` }, { status: 400 });
            }
            if (file.size > VIDEO_MAX_BYTES) {
                const mb = (file.size / 1024 / 1024).toFixed(1);
                return NextResponse.json({ error: `Vídeo demasiado grande (${mb} MB). Limite: 50 MB.` }, { status: 413 });
            }
            if (!productId) {
                return NextResponse.json({ error: 'productId required for video upload' }, { status: 400 });
            }

            const rawBuf = Buffer.from(await file.arrayBuffer());
            const p = await getProduct(productId);
            if (!p) return NextResponse.json({ error: 'product not found' }, { status: 404 });

            const videos = Array.isArray(p.videos) ? p.videos : [];
            const nextId = (videos.reduce((m, v) => Math.max(m, v.id || 0), 0)) + 1;
            const key = `produtos/prod${productId}/videos/video${nextId}-${Date.now()}.${origExt}`;
            const url = await putBlob(key, rawBuf, contentTypeFor(key));

            const newVideo = {
                id: nextId,
                url,
                filename: file.name || `video${nextId}.${origExt}`,
                size: file.size,
                ts: Date.now(),
            };
            await updateProduct(p.id, { videos: [...videos, newVideo] });
            await bumpVersion();
            return NextResponse.json({ ok: true, url, video: newVideo, ts: Date.now() });
        }

        const rawBuf = Buffer.from(await file.arrayBuffer());
        const useLite = !!(productId && kind) && RASTER_EXTS.includes(origExt);
        const buf = useLite
            ? await optimizeToLiteWebp(rawBuf)
            : (origExt === 'svg' ? rawBuf : await optimizeBuffer(rawBuf, origExt));
        const ext = useLite ? 'webp' : origExt;

        // Build blob key
        let key;
        if (productId && kind) {
            const baseFolder = `${useLite ? 'lite/' : ''}produtos/prod${productId}`;
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

// Delete a video from a product: removes the blob and drops the entry from videos[].
// Other media kinds use the versioning flow; videos are a flat list, so this is the
// only way to remove them.
export async function DELETE(req) {
    try {
        const { searchParams } = req.nextUrl;
        const productId = searchParams.get('productId');
        const videoId = searchParams.get('videoId');
        if (!productId || !videoId) {
            return NextResponse.json({ error: 'productId and videoId required' }, { status: 400 });
        }
        const p = await getProduct(productId);
        if (!p) return NextResponse.json({ error: 'product not found' }, { status: 404 });

        const videos = Array.isArray(p.videos) ? p.videos : [];
        const target = videos.find((v) => String(v.id) === String(videoId));
        if (!target) return NextResponse.json({ error: 'video not found' }, { status: 404 });

        const nextVideos = videos.filter((v) => String(v.id) !== String(videoId));
        await updateProduct(p.id, { videos: nextVideos });
        if (target.url) await deleteBlob(target.url);
        await bumpVersion();
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
