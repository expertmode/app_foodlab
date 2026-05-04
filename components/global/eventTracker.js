'use client';
import { useEffect } from 'react';

// Dispara um evento de analytics
async function send(type, ref, meta) {
    try {
        await fetch('/api/analytics/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, ref, meta }),
            keepalive: true,
        });
    } catch { /* ignore */ }
}

export function trackEvent(type, ref, meta) {
    if (typeof window === 'undefined') return;
    if (window.location.pathname.startsWith('/admin')) return;
    send(type, ref, meta);
}

// Wrapper component to fire on mount
export default function EventTracker({ type, ref: refValue, meta }) {
    useEffect(() => {
        trackEvent(type, refValue, meta);
    }, [type, refValue]);
    return null;
}
