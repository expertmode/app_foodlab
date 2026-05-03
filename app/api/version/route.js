import { NextResponse } from 'next/server';
import { getVersion } from '@/lib/version';

export const dynamic = 'force-dynamic';

export async function GET() {
    const v = await getVersion();
    return NextResponse.json({ v }, {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
}
