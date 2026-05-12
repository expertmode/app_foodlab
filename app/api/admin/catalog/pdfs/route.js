import { NextResponse } from 'next/server';
import { listPdfs, removePdf } from '@/lib/catalogPdfs';
import { deleteBlob } from '@/lib/blob';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const list = await listPdfs();
        return NextResponse.json(list);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const id = req.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'no id' }, { status: 400 });
        const removed = await removePdf(id);
        if (removed?.url) await deleteBlob(removed.url);
        return NextResponse.json({ ok: true, removed: !!removed });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
