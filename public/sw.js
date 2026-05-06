// Service Worker — cache para modo quiosque/offline
const VERSION = 'foodlab-v5';
const APP_SHELL_CACHE = `${VERSION}-shell`;
const STATIC_CACHE = `${VERSION}-static`;
const IMAGE_CACHE = `${VERSION}-images`;

const APP_SHELL_URLS = [
    '/',
    '/produtos',
    '/manifest.json',
];

const WARMUP_CONCURRENCY = 4;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_URLS).catch(() => {})),
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)),
            ),
        ),
    );
    self.clients.claim();
});

self.addEventListener('message', (event) => {
    if (event.data?.type === 'FORCE_REFRESH_ALL') {
        event.waitUntil((async () => {
            const keys = await caches.keys();
            await Promise.all(keys.map((k) => caches.delete(k)));
            const clients = await self.clients.matchAll({ type: 'window' });
            for (const c of clients) c.postMessage({ type: 'FORCE_RELOAD' });
        })());
        return;
    }
    if (event.data?.type === 'WARMUP_PAGES') {
        const urls = Array.isArray(event.data.urls) ? event.data.urls : [];
        if (urls.length) event.waitUntil(warmupPages(urls));
    }
});

async function warmupPages(urls) {
    const cache = await caches.open(APP_SHELL_CACHE);
    const queue = [...urls];
    await Promise.all(Array.from({ length: WARMUP_CONCURRENCY }, async () => {
        while (queue.length) {
            const url = queue.shift();
            try {
                const res = await fetch(url, { credentials: 'same-origin', cache: 'no-store' });
                if (res && res.ok) await cache.put(url, await stripNoStore(res));
            } catch { /* ignore */ }
        }
    }));
}

// Páginas force-dynamic do Next vêm com Cache-Control: no-store.
// O Cache.put deveria aceitar segundo a spec, mas alguns browsers rejeitam
// silenciosamente. Reescrevemos a Response sem esse header.
async function stripNoStore(res) {
    const headers = new Headers(res.headers);
    headers.delete('cache-control');
    headers.delete('pragma');
    headers.delete('expires');
    const body = await res.clone().arrayBuffer();
    return new Response(body, { status: res.status, statusText: res.statusText, headers });
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // Admin e API: sempre rede, sem cache
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) {
        return;
    }

    // Imagens: stale-while-revalidate
    if (request.destination === 'image' || url.pathname.startsWith('/images/')) {
        event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
        return;
    }

    // Estáticos do Next, fontes, css, js: cache-first
    if (
        url.pathname.startsWith('/_next/static/') ||
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'font'
    ) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    // HTML / navegação: stale-while-revalidate (serve do cache instantâneo, refresca atrás)
    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(navigationHandler(request));
        return;
    }

    // Default
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

async function navigationHandler(request) {
    const cache = await caches.open(APP_SHELL_CACHE);
    const cached = await cache.match(request, { ignoreSearch: true });
    const fetchPromise = fetch(request)
        .then(async (res) => {
            if (res && res.ok) {
                const cacheable = await stripNoStore(res.clone());
                cache.put(request, cacheable);
            }
            return res;
        })
        .catch(async () => cached || (await cache.match('/', { ignoreSearch: true })) || new Response('offline', { status: 503 }));
    return cached || fetchPromise;
}

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
        const res = await fetch(request);
        if (res && res.ok) cache.put(request, res.clone());
        return res;
    } catch {
        return cached || new Response('offline', { status: 503 });
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    const fetchPromise = fetch(request)
        .then((res) => {
            if (res && res.ok) cache.put(request, res.clone());
            return res;
        })
        .catch(() => cached);
    return cached || fetchPromise;
}
