import { NextResponse } from 'next/server';
import { restoreVersion } from '@/lib/imageBackup';

export async function POST(req) {
    try {
        const { from, to } = await req.json();
        if (!from || !to) return NextResponse.json({ error: 'from and to required' }, { status: 400 });
        const allowed = ['/images/produtos/', '/images/banners/', '/images/icons/', '/images/pictos/'];
        if (!allowed.some((p) => to.startsWith(p)) || !allowed.some((p) => from.startsWith(p))) {
            return NextResponse.json({ error: 'invalid path' }, { status: 400 });
        }
        await restoreVersion(from, to);
        return NextResponse.json({ ok: true, ts: Date.now() });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
