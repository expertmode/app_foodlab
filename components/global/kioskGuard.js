'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function KioskGuard() {
    const pathname = usePathname();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('kiosk') === '1') localStorage.setItem('kiosk', '1');
        if (params.get('kiosk') === '0') localStorage.removeItem('kiosk');
        const isKiosk = localStorage.getItem('kiosk') === '1';
        const inAdmin = pathname?.startsWith('/admin');
        const inSite = pathname?.startsWith('/site');
        const inPrint = pathname?.startsWith('/print');

        // Admin / /site (public responsive) / /print need cursor + scroll + interaction;
        // never apply kiosk lockdown there.
        if (!isKiosk || inAdmin || inSite || inPrint) {
            document.documentElement.classList.remove('kiosk');
            return;
        }

        document.documentElement.classList.add('kiosk');

        const blockEvent = (e) => { e.preventDefault(); e.stopPropagation(); };

        const blockKey = (e) => {
            const blocked = [
                'F1', 'F3', 'F4', 'F5', 'F6', 'F7', 'F10', 'F11', 'F12',
                'BrowserBack', 'BrowserForward', 'BrowserRefresh',
            ];
            if (blocked.includes(e.key)) return blockEvent(e);
            if (e.ctrlKey && ['r', 'R', 'w', 'W', 'n', 'N', 't', 'T', 'p', 'P', 'u', 'U', 'f', 'F', 'h', 'H', 'j', 'J', 's', 'S'].includes(e.key))
                return blockEvent(e);
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'J', 'C'].includes(e.key))
                return blockEvent(e);
            if (e.altKey && ['F4', 'Tab', 'Home', 'ArrowLeft', 'ArrowRight'].includes(e.key))
                return blockEvent(e);
        };

        document.addEventListener('contextmenu', blockEvent);
        document.addEventListener('selectstart', blockEvent);
        document.addEventListener('dragstart', blockEvent);
        document.addEventListener('keydown', blockKey, true);

        // Bloquear multi-touch (zoom/pinch)
        const blockMultiTouch = (e) => {
            if (e.touches && e.touches.length > 1) e.preventDefault();
        };
        document.addEventListener('touchstart', blockMultiTouch, { passive: false });
        document.addEventListener('touchmove', blockMultiTouch, { passive: false });
        // Safari/iOS: bloquear gesture events (pinch-zoom)
        document.addEventListener('gesturestart', blockEvent);
        document.addEventListener('gesturechange', blockEvent);
        document.addEventListener('gestureend', blockEvent);
        // Bloquear double-tap zoom
        let lastTap = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTap < 350) e.preventDefault();
            lastTap = now;
        }, { passive: false });
        // Pedir fullscreen no primeiro toque/click (necessário gesto do utilizador)
        const tryFullscreen = () => {
            const el = document.documentElement;
            const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
            if (req && !document.fullscreenElement) {
                req.call(el).catch(() => {});
            }
            document.removeEventListener('touchstart', tryFullscreen);
            document.removeEventListener('click', tryFullscreen);
        };
        document.addEventListener('touchstart', tryFullscreen, { once: true });
        document.addEventListener('click', tryFullscreen, { once: true });

        return () => {
            document.removeEventListener('contextmenu', blockEvent);
            document.removeEventListener('selectstart', blockEvent);
            document.removeEventListener('dragstart', blockEvent);
            document.removeEventListener('keydown', blockKey, true);
        };
    }, [pathname]);

    return null;
}
