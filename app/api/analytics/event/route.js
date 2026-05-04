import { NextResponse } from 'next/server';
import { track } from '@/lib/analytics';

export async function POST(req) {
    try {
        const body = await req.json();
        const allowedTypes = ['product_view', 'filter_click', 'banner_view', 'home_view'];
        if (!allowedTypes.includes(body.type)) {
            return NextResponse.json({ error: 'invalid type' }, { status: 400 });
        }
        await track({ type: body.type, ref: body.ref, meta: body.meta });
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
