import { NextResponse } from 'next/server';
import { getFilter, updateFilter, deleteFilter } from '@/lib/filters';

export async function GET(_req, { params }) {
    const { id } = await params;
    const f = await getFilter(id);
    if (!f) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(f);
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const patch = await req.json();
    return NextResponse.json(await updateFilter(id, patch));
}

export async function DELETE(_req, { params }) {
    const { id } = await params;
    await deleteFilter(id);
    return NextResponse.json({ ok: true });
}
