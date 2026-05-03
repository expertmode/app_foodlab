import path from 'node:path';
import archiver from 'archiver';
import { Readable } from 'node:stream';

export async function GET() {
    const archive = archiver('zip', { zlib: { level: 6 } });
    const root = path.join(process.cwd(), 'public', 'images');
    archive.directory(path.join(root, 'produtos'), 'produtos');
    archive.directory(path.join(root, 'banners'), 'banners', { allowEmpty: true });
    archive.directory(path.join(root, 'pictos'), 'pictos', { allowEmpty: true });
    archive.finalize();

    const stream = Readable.toWeb(archive);
    return new Response(stream, {
        headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="foodlab-images-${Date.now()}.zip"`,
        },
    });
}
