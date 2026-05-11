import { NextResponse } from 'next/server';
import { readCatalogConfig, writeCatalogConfig } from '@/lib/catalog';

export async function GET() {
    try {
        const cfg = await readCatalogConfig();
        return NextResponse.json(cfg);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const next = await writeCatalogConfig(body);
        return NextResponse.json(next);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
