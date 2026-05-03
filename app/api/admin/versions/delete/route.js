import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST(req) {
    try {
        const { path: target } = await req.json();
        if (!target) return NextResponse.json({ error: 'path required' }, { status: 400 });
        // Só permitir apagar dentro de /versions/
        if (!target.includes('/versions/')) {
            return NextResponse.json({ error: 'só é possível apagar ficheiros dentro de /versions/' }, { status: 400 });
        }
        const abs = path.join(process.cwd(), 'public', target.replace(/^\//, ''));
        await fs.unlink(abs);
        return NextResponse.json({ ok: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
