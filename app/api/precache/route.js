import { NextResponse } from 'next/server';
import { readProducts } from '@/lib/products';
import { readBanners } from '@/lib/banners';

export async function GET() {
    const [products, banners] = await Promise.all([readProducts(), readBanners()]);
    const urls = new Set();

    // Banner images
    for (const b of banners) if (b.image) urls.add(b.image);

    // Per product: detail page HTML + all images
    for (const p of products) {
        if (p.hidden) continue;
        if (p.keyName) urls.add(`/produtos/${p.keyName}`);
        if (p.imgProd) urls.add(p.imgProd);
        if (p.imgBg) urls.add(p.imgBg);
        if (p.bottomImg) urls.add(p.bottomImg);
        for (const c of p.infoCards || []) if (c.image) urls.add(c.image);
    }

    // Static assets do site
    urls.add('/images/logo.png');
    urls.add('/images/logoSmall.png');
    urls.add('/images/barralogos.png');
    urls.add('/images/triangleInv.png');
    urls.add('/images/triangleWhite.png');
    urls.add('/images/via_food_logo.png');
    urls.add('/images/produtos/triangle.png');
    urls.add('/images/produtos/geral.png');

    return NextResponse.json({ urls: Array.from(urls) });
}
