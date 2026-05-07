'use client';
import { useEffect } from 'react';

export default function PwaRegister() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!('serviceWorker' in navigator)) return;
        if (window.location.hostname === 'localhost' && !window.location.search.includes('sw=1')) return;

        // Reloads (SW update + FORCE_RELOAD broadcast) interromperiam edição em admin.
        // Admin precisa que o SW continue registado mas nunca reinicie a tab.
        const isAdmin = window.location.pathname.startsWith('/admin');

        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .then((reg) => {
                // Verifica updates ao SW periodicamente (a cada 5min)
                setInterval(() => reg.update().catch(() => {}), 5 * 60 * 1000);
                if (isAdmin) return;
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

        if (isAdmin) return;

        // Mensagens enviadas pelo SW (ex: forçar reload de admin)
        navigator.serviceWorker.addEventListener('message', (e) => {
            if (e.data?.type === 'FORCE_RELOAD') window.location.reload();
        });
    }, []);
    return null;
}
