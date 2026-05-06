import { NextResponse } from 'next/server';
import { readProducts } from '@/lib/products';
import { readBanners } from '@/lib/banners';

export async function GET() {
    const [products, banners] = await Promise.all([readProducts(), readBanners()]);
    const images = new Set();
    const pages = new Set(['/', '/produtos']);

    for (const b of banners) if (b.image) images.add(b.image);

    for (const p of products) {
        if (p.imgProd) images.add(p.imgProd);
        if (p.imgBg) images.add(p.imgBg);
        if (p.bottomImg) images.add(p.bottomImg);
        for (const c of p.infoCards || []) if (c.image) images.add(c.image);
        if (!p.hidden && p.keyName) pages.add(`/produtos/${p.keyName}`);
    }

    images.add('/images/logo.png');
    images.add('/images/logoSmall.png');
    images.add('/images/barralogos.png');
    images.add('/images/triangleInv.png');
    images.add('/images/triangleWhite.png');
    images.add('/images/via_food_logo.png');
    images.add('/images/produtos/triangle.png');
    images.add('/images/produtos/geral.png');

    const imagesArr = Array.from(images);
    const pagesArr = Array.from(pages);

    return NextResponse.json({
        images: imagesArr,
        pages: pagesArr,
        // backward-compat: clientes antigos liam só `urls` (eram imagens)
        urls: imagesArr,
    });
}
