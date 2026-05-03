'use client';
import { useEffect } from 'react';

const POLL_INTERVAL = 30 * 1000; // 30 segundos
const STORAGE_KEY = 'foodlab_v';

export default function VersionPoller() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Não corre em /admin
        if (window.location.pathname.startsWith('/admin')) return;

        async function check() {
            try {
                const res = await fetch('/api/version', { cache: 'no-store' });
                if (!res.ok) return;
                const { v } = await res.json();
                const last = sessionStorage.getItem(STORAGE_KEY);
                if (last === null) {
                    sessionStorage.setItem(STORAGE_KEY, String(v));
                    return;
                }
                if (String(v) !== last) {
                    sessionStorage.setItem(STORAGE_KEY, String(v));
                    // Limpa cache de imagens via SW e recarrega
                    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                        navigator.serviceWorker.controller.postMessage({ type: 'FORCE_REFRESH_ALL' });
                        // FORCE_REFRESH_ALL em si manda postMessage para todos os clientes recarregarem
                        // mas se o SW não estiver activo, fazemos fallback directo:
                        setTimeout(() => window.location.reload(), 500);
                    } else {
                        window.location.reload();
                    }
                }
            } catch { /* ignore */ }
        }

        check(); // inicial
        const id = setInterval(check, POLL_INTERVAL);
        return () => clearInterval(id);
    }, []);
    return null;
}
