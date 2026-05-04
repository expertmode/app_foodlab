import { NextResponse } from 'next/server';
import { getStats } from '@/lib/analytics';
import { readProducts } from '@/lib/products';
import { readFilters } from '@/lib/filters';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const [stats, products, filters] = await Promise.all([
        getStats({ days }),
        readProducts(),
        readFilters(),
    ]);
    const productMap = Object.fromEntries(products.map((p) => [p.id, { id: p.id, title: (p.title || '').replace(/\n/g, ' '), partner: p.partner }]));
    const filterMap = Object.fromEntries(filters.map((f) => [f.id, f.name]));
    return NextResponse.json({ ...stats, productMap, filterMap });
}
