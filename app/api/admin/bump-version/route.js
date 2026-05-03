import { NextResponse } from 'next/server';
import { bumpVersion } from '@/lib/version';

export async function POST() {
    const v = await bumpVersion();
    return NextResponse.json({ ok: true, v });
}
