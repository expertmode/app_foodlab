import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getProduct } from '@/lib/products';
import { cardPrompt, productPrompt, aspectFor, formatFor, clean } from '@/lib/imagePrompts';
import { generateImage } from '@/lib/replicate';
import { backupImage } from '@/lib/imageBackup';

export async function POST(req) {
    try {
        const { productId, kind, cardId, customPrompt, model = 'flux-dev', referenceImage, referenceStrength } = await req.json();
        const product = await getProduct(productId);
        if (!product) return NextResponse.json({ error: 'product not found' }, { status: 404 });

        let outPath;
        let prompt;

        if (kind === 'card') {
            const card = (product.infoCards || []).find((c) => c.id === Number(cardId));
            if (!card) return NextResponse.json({ error: 'card not found' }, { status: 404 });
            outPath = card.image;
            prompt = customPrompt || cardPrompt(
                clean(card.desc),
                clean(product.title).replace(/\n/g, ' '),
                clean(product.subTitle).replace(/\n/g, ' '),
                clean(product.description),
            );
        } else if (kind === 'img_main' || kind === 'img_bg' || kind === 'bottom_img') {
            const fileKey = kind === 'img_main' ? 'imgProd' : kind === 'img_bg' ? 'imgBg' : 'bottomImg';
            outPath = product[fileKey];
            prompt = customPrompt || productPrompt(product, kind);
        } else {
            return NextResponse.json({ error: 'invalid kind' }, { status: 400 });
        }

        if (!outPath) return NextResponse.json({ error: 'no path defined' }, { status: 400 });

        const buf = await generateImage({
            prompt,
            aspectRatio: aspectFor(kind),
            outputFormat: formatFor(outPath),
            model,
            referenceImage,
            referenceStrength,
        });

        const abs = path.join(process.cwd(), 'public', outPath);
        await fs.mkdir(path.dirname(abs), { recursive: true });
        await backupImage(abs);
        await fs.writeFile(abs, buf);

        return NextResponse.json({ ok: true, path: outPath, prompt, ts: Date.now() });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
