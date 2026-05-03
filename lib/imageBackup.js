import fs from 'node:fs/promises';
import path from 'node:path';

// Antes de sobrescrever uma imagem, guarda a versão actual em ./versions/
export async function backupImage(absPath) {
    try {
        const stat = await fs.stat(absPath);
        if (!stat.isFile()) return null;
    } catch {
        return null; // não existe
    }
    const dir = path.dirname(absPath);
    const ext = path.extname(absPath);
    const basename = path.basename(absPath, ext);
    const versionsDir = path.join(dir, 'versions');
    await fs.mkdir(versionsDir, { recursive: true });
    const versionPath = path.join(versionsDir, `${basename}-${Date.now()}${ext}`);
    await fs.copyFile(absPath, versionPath);
    return versionPath;
}

// Listar versões de uma imagem (relativo a /public)
export async function listVersions(relPath) {
    const abs = path.join(process.cwd(), 'public', relPath.replace(/^\//, ''));
    const dir = path.dirname(abs);
    const ext = path.extname(abs);
    const basename = path.basename(abs, ext);
    const versionsDir = path.join(dir, 'versions');
    try {
        const files = await fs.readdir(versionsDir);
        const matches = files
            .filter((f) => f.startsWith(basename + '-') && f.endsWith(ext))
            .map((f) => {
                const m = f.match(new RegExp(`^${basename}-(\\d+)${ext.replace('.', '\\.')}$`));
                const ts = m ? Number(m[1]) : 0;
                return {
                    file: f,
                    path: '/' + path.relative(path.join(process.cwd(), 'public'), path.join(versionsDir, f)),
                    ts,
                };
            })
            .sort((a, b) => b.ts - a.ts);
        return matches;
    } catch {
        return [];
    }
}

export async function restoreVersion(fromRel, toRel) {
    const fromAbs = path.join(process.cwd(), 'public', fromRel.replace(/^\//, ''));
    const toAbs = path.join(process.cwd(), 'public', toRel.replace(/^\//, ''));
    await backupImage(toAbs);
    await fs.copyFile(fromAbs, toAbs);
    return toRel;
}
