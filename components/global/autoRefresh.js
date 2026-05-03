'use client';
import { useEffect } from 'react';

// Hora a que o quiosque faz auto-refresh (formato 24h)
const REFRESH_HOUR = 4;
const REFRESH_MIN = 0;

export default function AutoRefresh() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Só corre no site público, não no admin
        if (window.location.pathname.startsWith('/admin')) return;

        function scheduleNext() {
            const now = new Date();
            const next = new Date(now);
            next.setHours(REFRESH_HOUR, REFRESH_MIN, 0, 0);
            if (next <= now) next.setDate(next.getDate() + 1);
            const delay = next.getTime() - now.getTime();

            const id = setTimeout(async () => {
                try {
                    // Força o SW a verificar updates antes do reload
                    if ('serviceWorker' in navigator) {
                        const reg = await navigator.serviceWorker.getRegistration();
                        if (reg) await reg.update();
                    }
                } catch { /* ignore */ }
                window.location.reload();
            }, delay);

            return id;
        }

        const id = scheduleNext();
        return () => clearTimeout(id);
    }, []);

    return null;
}
