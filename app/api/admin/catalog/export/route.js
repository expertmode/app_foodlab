import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

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
        // Larger viewport so images / styles load at full quality before PDF render
        // Match A4 at 96dpi (210mm × 297mm ≈ 794 × 1123). Scale 1.5× for crisp text/images without blowing up file size.
        await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1.5 });
        await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 50000 });
        // Wait a touch more for fonts (Boldonse from Google Fonts) and images to settle
        await page.evaluateHandle('document.fonts.ready');
        await new Promise((r) => setTimeout(r, 300));

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

        return new NextResponse(buf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="catalogo-foodlab-${new Date().toISOString().slice(0, 10)}.pdf"`,
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
