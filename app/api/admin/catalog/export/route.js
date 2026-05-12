import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import { putBlob } from '@/lib/blob';
import { addPdf } from '@/lib/catalogPdfs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 90;

const DEV_CHROME_PATHS = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
].filter(Boolean);

async function findDevChrome() {
    const fs = await import('node:fs/promises');
    for (const p of DEV_CHROME_PATHS) {
        try {
            await fs.access(p);
            return p;
        } catch {}
    }
    throw new Error(
        'Chrome não encontrado para Puppeteer em desenvolvimento. ' +
        'Define a env var CHROME_PATH para o executável do Chrome/Chromium.',
    );
}

async function launchBrowser() {
    const isVercel = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

    if (isVercel) {
        const { default: chromium } = await import('@sparticuz/chromium');
        return puppeteer.launch({
            args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport,
        });
    }

    return puppeteer.launch({
        executablePath: await findDevChrome(),
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
}

async function generatePdf(req, ids) {
    const origin = req.nextUrl.origin;
    const printUrl = `${origin}/print/catalog?ids=${encodeURIComponent(ids)}`;

    const browser = await launchBrowser();
    try {
        const page = await browser.newPage();
        // Match A4 at 96dpi (210mm × 297mm ≈ 794 × 1123). Scale 1.5× for crisp text/images without blowing up file size.
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1.5 });

        // 'load' fires once DOM + initial resources are ready. We don't use 'networkidle0'
        // because that requires zero network activity for 500ms — Vercel Blob can take a
        // while to settle, and any stray client poller would prevent it from ever firing.
        await page.goto(printUrl, { waitUntil: 'load', timeout: 75000 });

        // Wait for webfonts to be ready (Boldonse from Google Fonts).
        try { await page.evaluate(() => document.fonts && document.fonts.ready); } catch {}

        // Wait for every <img> on the page to actually have decoded a frame. PDF rendering
        // happens before the network is idle otherwise, leaving images blank.
        await page.evaluate(async () => {
            const imgs = Array.from(document.images);
            await Promise.all(imgs.map((img) => {
                if (img.complete && img.naturalHeight > 0) return Promise.resolve();
                return new Promise((res) => {
                    img.addEventListener('load', res, { once: true });
                    img.addEventListener('error', res, { once: true });
                    setTimeout(res, 8000); // hard cap per image
                });
            }));
        });

        const buf = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });
        return buf;
    } finally {
        await browser.close().catch(() => {});
    }
}

export async function POST(req) {
    try {
        const { searchParams } = req.nextUrl;
        let ids = searchParams.get('ids') || '';
        if (!ids) {
            const body = await req.json().catch(() => ({}));
            if (Array.isArray(body.ids)) ids = body.ids.join(',');
        }
        if (!ids) return NextResponse.json({ error: 'no ids' }, { status: 400 });

        const buf = await generatePdf(req, ids);

        const now = new Date();
        const filename = `catalogo-foodlab-${now.toISOString().slice(0, 10)}.pdf`;

        // Archive the PDF so it stays downloadable from the admin "histórico" page
        // without re-running Puppeteer. Don't fail the response if archiving fails —
        // the user still gets the download.
        try {
            const id = String(now.getTime());
            const url = await putBlob(`pdfs/catalog-${id}.pdf`, Buffer.from(buf), 'application/pdf');
            const productIds = ids.split(',').map((s) => s.trim()).filter(Boolean);
            await addPdf({
                id,
                url,
                filename,
                createdAt: now.toISOString(),
                productIds,
                productCount: productIds.length,
            });
        } catch (archiveErr) {
            console.error('[catalog/export] failed to archive PDF', archiveErr);
        }

        return new NextResponse(buf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': String(buf.length),
                'Cache-Control': 'no-store',
            },
        });
    } catch (e) {
        console.error('[catalog/export] error', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(req) {
    return POST(req);
}
