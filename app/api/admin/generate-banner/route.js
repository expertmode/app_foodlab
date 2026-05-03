import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getBanner, updateBanner } from '@/lib/banners';
import { generateImage } from '@/lib/replicate';

export async function POST(req) {
    try {
        const { bannerId, prompt, referenceImage, referenceStrength, model = 'flux-dev' } = await req.json();
        if (!bannerId) return NextResponse.json({ error: 'bannerId required' }, { status: 400 });
        if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400 });

        const banner = await getBanner(bannerId);
        if (!banner) return NextResponse.json({ error: 'banner not found' }, { status: 404 });

        const buf = await generateImage({
            prompt,
            aspectRatio: '16:9',
            outputFormat: 'jpg',
            model,
            referenceImage,
            referenceStrength,
        });

        const rel = `images/banners/banner-${bannerId}-${Date.now()}.jpg`;
        const abs = path.join(process.cwd(), 'public', rel);
        await fs.mkdir(path.dirname(abs), { recursive: true });
        await fs.writeFile(abs, buf);

        const updated = await updateBanner(bannerId, { image: '/' + rel });
        return NextResponse.json({ ok: true, banner: updated });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
