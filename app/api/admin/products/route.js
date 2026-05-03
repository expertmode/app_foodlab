import { NextResponse } from 'next/server';
import { readProducts, createProduct } from '@/lib/products';

export async function GET() {
    const products = await readProducts();
    return NextResponse.json(products);
}

export async function POST(req) {
    try {
        const body = await req.json();
        if (!body.title || !body.title.trim()) {
            return NextResponse.json({ error: 'title required' }, { status: 400 });
        }
        const created = await createProduct({ title: body.title.trim(), partner: body.partner });
        return NextResponse.json(created);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
