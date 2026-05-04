import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { getBanner, updateBanner } from '@/lib/banners';
import { generateImage } from '@/lib/replicate';
import { putBlob, contentTypeFor } from '@/lib/blob';
import { bumpVersion } from '@/lib/version';

async function optimizeBuffer(buffer) {
    return sharp(buffer)
        .rotate()
        .resize({ width: 2048, withoutEnlargement: true })
        .jpeg({ quality: 88, mozjpeg: true })
        .toBuffer();
}

export async function POST(req) {
    try {
        const { bannerId, prompt, referenceImage, referenceStrength, model = 'flux-dev' } = await req.json();
        if (!bannerId) return NextResponse.json({ error: 'bannerId required' }, { status: 400 });
        if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 });

        const banner = await getBanner(bannerId);
        if (!banner) return NextResponse.json({ error: 'banner not found' }, { status: 404 });

        const rawBuf = await generateImage({
            prompt,
            aspectRatio: '16:9',
            outputFormat: 'jpg',
            model,
            referenceImage,
            referenceStrength,
        });
        const buf = await optimizeBuffer(rawBuf);
        const key = `banners/banner-${bannerId}.jpg`;
        const url = await putBlob(key, buf, contentTypeFor(key));

        // Push old image into versions array
        const versions = Array.isArray(banner.versions) ? banner.versions : [];
        if (banner.image) versions.unshift({ url: banner.image, ts: Date.now() });

        const updated = await updateBanner(bannerId, {
            image: url,
            versions: versions.slice(0, 30),
        });
        await bumpVersion();
        return NextResponse.json({ ok: true, banner: updated });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
