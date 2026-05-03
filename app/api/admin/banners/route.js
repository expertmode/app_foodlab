import { NextResponse } from 'next/server';
import { readBanners, createBanner } from '@/lib/banners';

export async function GET() {
    const banners = await readBanners();
    return NextResponse.json(banners);
}

export async function POST(req) {
    try {
        const body = await req.json();
        const created = await createBanner(body);
        return NextResponse.json(created);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
