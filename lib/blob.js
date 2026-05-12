import fs from 'node:fs/promises';
import path from 'node:path';

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

// Guarda um buffer numa key (path-like). Devolve a URL pública.
// Em produção (Vercel) usa @vercel/blob. Em dev sem token, escreve em /public/<key> e devolve /<key>.
export async function putBlob(key, buffer, contentType = 'image/jpeg') {
    if (useBlob) {
        const { put } = await import('@vercel/blob');
        const r = await put(key, buffer, {
            access: 'public',
            contentType,
            addRandomSuffix: true,
        });
        return r.url;
    }
    const abs = path.join(process.cwd(), 'public', key);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, buffer);
    return '/' + key;
}

// Apaga um blob por URL (opcional). Em filesystem fallback, ignora.
export async function deleteBlob(url) {
    if (!url) return;
    if (useBlob && url.includes('blob.vercel-storage.com')) {
        const { del } = await import('@vercel/blob');
        await del(url).catch(() => {});
    }
}

// Lê um buffer a partir de uma URL (Blob ou caminho local /public)
export async function fetchBlob(url) {
    if (url.startsWith('http')) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        return Buffer.from(await res.arrayBuffer());
    }
    const abs = path.join(process.cwd(), 'public', url.replace(/^\//, ''));
    return fs.readFile(abs);
}

export const isBlobEnabled = () => useBlob;

// Detecta o content-type a partir da extensão
export function contentTypeFor(pathOrKey) {
    const ext = pathOrKey.toLowerCase().split('.').pop();
    return {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        webp: 'image/webp',
        svg: 'image/svg+xml',
        gif: 'image/gif',
        pdf: 'application/pdf',
        mp4: 'video/mp4',
        webm: 'video/webm',
        mov: 'video/quicktime',
        m4v: 'video/mp4',
    }[ext] || 'application/octet-stream';
}
