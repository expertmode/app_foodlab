'use client';
import { useEffect } from 'react';

const CONCURRENCY = 4;
const STORAGE_KEY = 'foodlab_warmup_v2';

export default function WarmupCache() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.location.pathname.startsWith('/admin')) return;
        if (sessionStorage.getItem(STORAGE_KEY) === 'done') return;

        const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
        idle(async () => {
            try {
                const res = await fetch('/api/precache');
                if (!res.ok) return;
                const { images = [], pages = [] } = await res.json();

                if (Array.isArray(images) && images.length) {
                    const queue = [...images];
                    const workers = Array.from({ length: CONCURRENCY }, async () => {
                        while (queue.length) {
                            const url = queue.shift();
                            try {
                                await fetch(url, { cache: 'force-cache', mode: 'no-cors' });
                            } catch { /* ignore */ }
                        }
                    });
                    await Promise.all(workers);
                }

                let pagesWarmed = true;
                if (Array.isArray(pages) && pages.length && 'serviceWorker' in navigator) {
                    try {
                        await navigator.serviceWorker.ready;
                        if (navigator.serviceWorker.controller) {
                            navigator.serviceWorker.controller.postMessage({
                                type: 'WARMUP_PAGES',
                                urls: pages,
                            });
                        } else {
                            // SW ainda não controla esta página; tentamos no próximo carregamento
                            pagesWarmed = false;
                        }
                    } catch {
                        pagesWarmed = false;
                    }
                }

                if (pagesWarmed) sessionStorage.setItem(STORAGE_KEY, 'done');
            } catch { /* ignore */ }
        });
    }, []);
    return null;
}
