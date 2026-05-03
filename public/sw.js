// Service Worker — cache para modo quiosque/offline
const VERSION = 'foodlab-v2';
const APP_SHELL_CACHE = `${VERSION}-shell`;
const STATIC_CACHE = `${VERSION}-static`;
const IMAGE_CACHE = `${VERSION}-images`;

const APP_SHELL_URLS = [
    '/',
    '/produtos',
    '/manifest.json',
];

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

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // Skip admin and API routes — always go to network
    if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/')) {
        return;
    }

    // Images: stale-while-revalidate — serve cache instantly but refresh in background
    if (request.destination === 'image' || url.pathname.startsWith('/images/')) {
        event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
        return;
    }

    // Static assets (Next chunks, fonts, css): cache-first
    if (
        url.pathname.startsWith('/_next/static/') ||
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'font'
    ) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    // HTML / navigation: network-first com fallback ao cache
    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(networkFirst(request, APP_SHELL_CACHE));
        return;
    }

    // Default: stale-while-revalidate
    event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
});

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

async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    try {
        const res = await fetch(request);
        if (res && res.ok) cache.put(request, res.clone());
        return res;
    } catch {
        const cached = await cache.match(request) || await cache.match('/');
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
