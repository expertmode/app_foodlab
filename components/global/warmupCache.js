'use client';
import { useEffect } from 'react';

const CONCURRENCY = 4;
const STORAGE_KEY = 'foodlab_warmup_v2';

export default function WarmupCache() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Skip in admin
        if (window.location.pathname.startsWith('/admin')) return;
        // ?warmup=1 força nova ronda mesmo que já esteja done — útil para preparar quiosques
        const force = new URLSearchParams(window.location.search).get('warmup') === '1';
        if (!force && sessionStorage.getItem(STORAGE_KEY) === 'done') return;
        if (force) sessionStorage.removeItem(STORAGE_KEY);

        const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
        idle(async () => {
            try {
                const res = await fetch('/api/precache');
                if (!res.ok) return;
                const { urls } = await res.json();
                if (!Array.isArray(urls) || urls.length === 0) return;

                // Fetch em paralelo limitado.
                // Same-origin (HTML de produtos) precisa de fetch normal — com no-cors a
                // resposta vem opaca e o SW não a consegue servir depois ao navegar offline.
                const isSameOrigin = (u) => {
                    try { return new URL(u, location.href).origin === location.origin; }
                    catch { return false; }
                };
                const queue = [...urls];
                const workers = Array.from({ length: CONCURRENCY }, async () => {
                    while (queue.length) {
                        const url = queue.shift();
                        const opts = isSameOrigin(url)
                            ? { cache: 'force-cache' }
                            : { cache: 'force-cache', mode: 'no-cors' };
                        try { await fetch(url, opts); } catch { /* ignore */ }
                    }
                });
                await Promise.all(workers);
                sessionStorage.setItem(STORAGE_KEY, 'done');
            } catch { /* ignore */ }
        });
    }, []);
    return null;
}
