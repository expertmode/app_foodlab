'use client';
import { useEffect } from 'react';

export default function KioskGuard() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('kiosk') === '1') localStorage.setItem('kiosk', '1');
        if (params.get('kiosk') === '0') localStorage.removeItem('kiosk');
        const isKiosk = localStorage.getItem('kiosk') === '1';
        if (!isKiosk) return;

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
        window.addEventListener('beforeunload', (e) => {
            e.preventDefault();
            e.returnValue = '';
        });

        return () => {
            document.removeEventListener('contextmenu', blockEvent);
            document.removeEventListener('selectstart', blockEvent);
            document.removeEventListener('dragstart', blockEvent);
            document.removeEventListener('keydown', blockKey, true);
        };
    }, []);

    return null;
}
