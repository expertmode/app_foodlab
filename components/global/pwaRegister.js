'use client';
import { useEffect } from 'react';

export default function PwaRegister() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!('serviceWorker' in navigator)) return;
        if (window.location.hostname === 'localhost' && !window.location.search.includes('sw=1')) return;
        navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .catch(() => {});
    }, []);
    return null;
}
