'use client';
import { useEffect } from 'react';

export default function PwaRegister() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!('serviceWorker' in navigator)) return;
        if (window.location.hostname === 'localhost' && !window.location.search.includes('sw=1')) return;

        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then((reg) => {
                // Verifica updates ao SW periodicamente (a cada 5min)
                setInterval(() => reg.update().catch(() => {}), 5 * 60 * 1000);
                // Quando um SW novo activa, recarrega a página para o cliente apanhar tudo fresco
                reg.addEventListener('updatefound', () => {
                    const newSw = reg.installing;
                    if (newSw) {
                        newSw.addEventListener('statechange', () => {
                            if (newSw.state === 'activated' && navigator.serviceWorker.controller) {
                                window.location.reload();
                            }
                        });
                    }
                });
            })
            .catch(() => {});

        // Mensagens enviadas pelo SW (ex: forçar reload de admin)
        navigator.serviceWorker.addEventListener('message', (e) => {
            if (e.data?.type === 'FORCE_RELOAD') window.location.reload();
        });
    }, []);
    return null;
}
