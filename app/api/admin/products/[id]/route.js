import { NextResponse } from 'next/server';
import { getProduct, updateProduct } from '@/lib/products';

export async function GET(_req, { params }) {
    const { id } = await params;
    const p = await getProduct(id);
    if (!p) return NextResponse.json({ error: 'not found' }, { status: 404 });
    return NextResponse.json(p);
}

export async function PUT(req, { params }) {
    const { id } = await params;
    const patch = await req.json();
    const updated = await updateProduct(id, patch);
    return NextResponse.json(updated);
}
