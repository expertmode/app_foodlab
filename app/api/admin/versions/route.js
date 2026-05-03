import { NextResponse } from 'next/server';
import { listVersions } from '@/lib/imageBackup';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    if (!path) return NextResponse.json({ error: 'path required' }, { status: 400 });
    const versions = await listVersions(path);
    return NextResponse.json(versions);
}
