'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const IDLE_MS = 60 * 1000; // 1 minuto

export default function IdleRedirect() {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (pathname.startsWith('/admin')) return;
        if (pathname === '/') return; // já está na home

        let timer = null;
        const reset = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                router.push('/');
            }, IDLE_MS);
        };

        const events = ['touchstart', 'pointerdown', 'click', 'keydown', 'wheel', 'scroll'];
        events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
        reset();

        return () => {
            if (timer) clearTimeout(timer);
            events.forEach((ev) => window.removeEventListener(ev, reset));
        };
    }, [pathname, router]);

    return null;
}
