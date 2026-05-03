import { NextResponse } from 'next/server';
import { readFilters, createFilter } from '@/lib/filters';

export async function GET() {
    return NextResponse.json(await readFilters());
}

export async function POST(req) {
    try {
        const body = await req.json();
        return NextResponse.json(await createFilter(body));
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
