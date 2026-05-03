import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
    const dir = path.join(process.cwd(), 'public', 'images', 'pictos');
    try {
        const files = await fs.readdir(dir);
        const icons = files
            .filter((f) => f.endsWith('.svg'))
            .map((f) => ({
                name: f.replace(/\.svg$/, ''),
                path: `/images/pictos/${f}`,
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
        return NextResponse.json(icons);
    } catch {
        return NextResponse.json([]);
    }
}
