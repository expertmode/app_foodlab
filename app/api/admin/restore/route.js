import { NextResponse } from 'next/server';
import { getProduct, updateProduct } from '@/lib/products';
import { getBanner, updateBanner } from '@/lib/banners';
import { bumpVersion } from '@/lib/version';

export async function POST(req) {
    try {
        const { productId, kind, cardId, bannerId, url } = await req.json();
        if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

        if (bannerId) {
            const b = await getBanner(bannerId);
            if (!b) return NextResponse.json({ error: 'banner not found' }, { status: 404 });
            const versions = (b.versions || []).filter((v) => v.url !== url);
            if (b.image) versions.unshift({ url: b.image, ts: Date.now() });
            await updateBanner(bannerId, { image: url, versions: versions.slice(0, 30) });
            await bumpVersion();
            return NextResponse.json({ ok: true });
        }

        const p = await getProduct(productId);
        if (!p) return NextResponse.json({ error: 'product not found' }, { status: 404 });

        if (kind === 'card') {
            const cards = (p.infoCards || []).map((c) => {
                if (c.id !== Number(cardId)) return c;
                const versions = (c.versions || []).filter((v) => v.url !== url);
                if (c.image) versions.unshift({ url: c.image, ts: Date.now() });
                return { ...c, image: url, versions: versions.slice(0, 30) };
            });
            await updateProduct(p.id, { infoCards: cards });
        } else {
            const fileKey = kind === 'img_main' ? 'imgProd' : kind === 'img_bg' ? 'imgBg' : 'bottomImg';
            const versionsKey = `${fileKey}Versions`;
            const versions = (p[versionsKey] || []).filter((v) => v.url !== url);
            if (p[fileKey]) versions.unshift({ url: p[fileKey], ts: Date.now() });
            await updateProduct(p.id, { [fileKey]: url, [versionsKey]: versions.slice(0, 30) });
        }
        await bumpVersion();
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
