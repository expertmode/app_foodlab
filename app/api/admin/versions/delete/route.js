import { NextResponse } from 'next/server';
import { getProduct, updateProduct } from '@/lib/products';
import { getBanner, updateBanner } from '@/lib/banners';
import { deleteBlob } from '@/lib/blob';
import { bumpVersion } from '@/lib/version';

export async function POST(req) {
    try {
        const { productId, kind, cardId, bannerId, url } = await req.json();
        if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

        if (bannerId) {
            const b = await getBanner(bannerId);
            if (!b) return NextResponse.json({ error: 'banner not found' }, { status: 404 });
            const versions = (b.versions || []).filter((v) => v.url !== url);
            await updateBanner(bannerId, { versions });
            await deleteBlob(url);
            await bumpVersion();
            return NextResponse.json({ ok: true });
        }

        const p = await getProduct(productId);
        if (!p) return NextResponse.json({ error: 'product not found' }, { status: 404 });

        if (kind === 'card') {
            const cards = (p.infoCards || []).map((c) => {
                if (c.id !== Number(cardId)) return c;
                return { ...c, versions: (c.versions || []).filter((v) => v.url !== url) };
            });
            await updateProduct(p.id, { infoCards: cards });
        } else {
            const fileKey = kind === 'img_main' ? 'imgProd' : kind === 'img_bg' ? 'imgBg' : 'bottomImg';
            const versionsKey = `${fileKey}Versions`;
            await updateProduct(p.id, {
                [versionsKey]: (p[versionsKey] || []).filter((v) => v.url !== url),
            });
        }
        await deleteBlob(url);
        await bumpVersion();
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
