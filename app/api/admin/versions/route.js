import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';
import { getBanner } from '@/lib/banners';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const kind = searchParams.get('kind');
    const cardId = searchParams.get('cardId');
    const bannerId = searchParams.get('bannerId');

    if (bannerId) {
        const b = await getBanner(bannerId);
        return NextResponse.json(b?.versions || []);
    }
    if (!productId || !kind) {
        return NextResponse.json([], { status: 200 });
    }
    const p = await getProduct(productId);
    if (!p) return NextResponse.json([], { status: 200 });

    if (kind === 'card') {
        const card = (p.infoCards || []).find((c) => c.id === Number(cardId));
        return NextResponse.json(card?.versions || []);
    }
    const fileKey = kind === 'img_main' ? 'imgProd' : kind === 'img_bg' ? 'imgBg' : 'bottomImg';
    const versionsKey = `${fileKey}Versions`;
    return NextResponse.json(p[versionsKey] || []);
}
