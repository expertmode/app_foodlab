import { NextResponse } from 'next/server';
import { getBanner, updateBanner, deleteBanner } from '@/lib/banners';

export async function GET(_req, { params }) {
    const { id } = await params;
    const b = await getBanner(id);
    if (!b) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(b);
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const patch = await req.json();
    const updated = await updateBanner(id, patch);
    return NextResponse.json(updated);
}

export async function DELETE(_req, { params }) {
    const { id } = await params;
    await deleteBanner(id);
    return NextResponse.json({ ok: true });
}
