import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { backupImage } from '@/lib/imageBackup';

export async function POST(req) {
    try {
        const form = await req.formData();
        const file = form.get('file');
        const targetPath = form.get('path');
        if (!file || !targetPath) {
            return NextResponse.json({ error: 'file and path required' }, { status: 400 });
        }
        const safeRel = String(targetPath).replace(/^\/+/, '').replace(/\.\.+/g, '');
        const allowedPrefixes = ['images/produtos/', 'images/banners/', 'images/icons/', 'images/pictos/'];
        if (!allowedPrefixes.some((prefix) => safeRel.startsWith(prefix))) {
            return NextResponse.json({ error: 'invalid path' }, { status: 400 });
        }
        const abs = path.join(process.cwd(), 'public', safeRel);
        await fs.mkdir(path.dirname(abs), { recursive: true });
        await backupImage(abs);
        const buf = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(abs, buf);
        return NextResponse.json({ ok: true, path: '/' + safeRel, ts: Date.now() });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
