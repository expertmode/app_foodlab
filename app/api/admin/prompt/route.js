import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';
import { cardPrompt, productPrompt, clean } from '@/lib/imagePrompts';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const kind = searchParams.get('kind');
    const cardId = searchParams.get('cardId');

    const product = await getProduct(productId);
    if (!product) return NextResponse.json({ error: 'product not found' }, { status: 404 });

    let prompt = '';
    if (kind === 'card') {
        const card = (product.infoCards || []).find((c) => c.id === Number(cardId));
        if (!card) return NextResponse.json({ error: 'card not found' }, { status: 404 });
        prompt = (card.customPrompt && card.customPrompt.trim()) || cardPrompt(
            clean(card.desc),
            clean(product.title).replace(/\n/g, ' '),
            clean(product.subTitle).replace(/\n/g, ' '),
            clean(product.description),
        );
    } else if (kind === 'img_main' || kind === 'img_bg' || kind === 'bottom_img') {
        prompt = productPrompt(product, kind);
    } else {
        return NextResponse.json({ error: 'invalid kind' }, { status: 400 });
    }

    return NextResponse.json({ prompt });
}
