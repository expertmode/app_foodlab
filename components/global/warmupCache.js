'use client';
import { useEffect } from 'react';

const CONCURRENCY = 4;
const STORAGE_KEY = 'foodlab_warmup_v1';

export default function WarmupCache() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Skip in admin
        if (window.location.pathname.startsWith('/admin')) return;
        // Run only once per browser/session combo
        if (sessionStorage.getItem(STORAGE_KEY) === 'done') return;

        const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
        idle(async () => {
            try {
                const res = await fetch('/api/precache');
                if (!res.ok) return;
                const { urls } = await res.json();
                if (!Array.isArray(urls) || urls.length === 0) return;

                // Fetch em paralelo limitado
                const queue = [...urls];
                const workers = Array.from({ length: CONCURRENCY }, async () => {
                    while (queue.length) {
                        const url = queue.shift();
                        try {
                            await fetch(url, { cache: 'force-cache', mode: 'no-cors' });
                        } catch { /* ignore */ }
                    }
                });
                await Promise.all(workers);
                sessionStorage.setItem(STORAGE_KEY, 'done');
            } catch { /* ignore */ }
        });
    }, []);
    return null;
}
