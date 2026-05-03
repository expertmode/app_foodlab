import fs from 'node:fs/promises';
import sharp from 'sharp';

// Optimiza uma imagem in-place. Mantém formato (jpg ou png).
// jpg: comprime com mozjpeg-style até ~80% qualidade
// png: aplica compressão eficiente
export async function optimizeImage(absPath, options = {}) {
    const { jpegQuality = 88, pngLevel = 9, maxWidth = 2048 } = options;
    try {
        const stat = await fs.stat(absPath);
        if (!stat.isFile()) return null;
        const original = await fs.readFile(absPath);
        const ext = absPath.toLowerCase().split('.').pop();

        let pipeline = sharp(original).rotate(); // honra EXIF

        // Resize se muito grande (sem upscale)
        if (maxWidth) {
            pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
        }

        let outBuffer;
        if (ext === 'jpg' || ext === 'jpeg') {
            outBuffer = await pipeline.jpeg({ quality: jpegQuality, mozjpeg: true }).toBuffer();
        } else if (ext === 'png') {
            outBuffer = await pipeline.png({ compressionLevel: pngLevel }).toBuffer();
        } else if (ext === 'webp') {
            outBuffer = await pipeline.webp({ quality: jpegQuality }).toBuffer();
        } else {
            return null; // formato desconhecido — não toca
        }

        // Só substitui se ficar mais pequeno
        if (outBuffer.length < original.length) {
            await fs.writeFile(absPath, outBuffer);
            return { before: original.length, after: outBuffer.length };
        }
        return { before: original.length, after: original.length };
    } catch (e) {
        console.error('optimizeImage failed:', e.message);
        return null;
    }
}
