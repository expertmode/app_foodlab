'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function InstallButton({ label = 'Instalar app', compact = false }) {
    const [deferred, setDeferred] = useState(null);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia?.('(display-mode: standalone)').matches) {
            setInstalled(true);
            return;
        }
        const onPrompt = (e) => {
            e.preventDefault();
            setDeferred(e);
        };
        const onInstalled = () => {
            setInstalled(true);
            setDeferred(null);
        };
        window.addEventListener('beforeinstallprompt', onPrompt);
        window.addEventListener('appinstalled', onInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', onPrompt);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    if (installed) return <Status>App instalada ✓</Status>;
    if (!deferred) return <Status>{compact ? '—' : 'Browser não suporta ou já instalada'}</Status>;

    const click = async () => {
        deferred.prompt();
        const { outcome } = await deferred.userChoice;
        if (outcome === 'accepted') setDeferred(null);
    };

    return <Btn onClick={click}>{label}</Btn>;
}

const Btn = styled.button`
    padding: 10px 18px;
    border: 2px solid #005E81;
    background: #005E81;
    color: #fff;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;

    &:hover { background: #004a68; }
`;

const Status = styled.span`
    color: #999;
    font-size: 12px;
    font-style: italic;
`;
