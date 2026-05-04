'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const STORAGE_KEY = 'foodlab_touch_hint_shown';

export default function TouchHint() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Apenas em modo quiosque
        if (localStorage.getItem('kiosk') !== '1') return;
        // Mostra uma vez por sessão
        if (sessionStorage.getItem(STORAGE_KEY) === '1') return;
        setShow(true);
        sessionStorage.setItem(STORAGE_KEY, '1');
        const t = setTimeout(() => setShow(false), 5000);
        return () => clearTimeout(t);
    }, []);

    if (!show) return null;

    return (
        <Backdrop onClick={() => setShow(false)} onTouchStart={() => setShow(false)}>
            <Card>
                <Icon>👆</Icon>
                <Title>Toca com um dedo</Title>
                <Sub>Usa apenas um dedo para navegar e fazer scroll vertical</Sub>
                <Hint>(toca para fechar)</Hint>
            </Card>
        </Backdrop>
    );
}

const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 94, 129, 0.92);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    animation: fadeIn 0.4s ease;

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const Card = styled.div`
    text-align: center;
    color: #fff;
    padding: 48px;
`;

const Icon = styled.div`
    font-size: 96px;
    line-height: 1;
    margin-bottom: 24px;
`;

const Title = styled.h2`
    font-size: 56px;
    margin: 0 0 16px 0;
    font-weight: 600;
`;

const Sub = styled.p`
    font-size: 28px;
    margin: 0 0 32px 0;
    opacity: 0.9;
    line-height: 1.4;
`;

const Hint = styled.p`
    font-size: 18px;
    opacity: 0.6;
    margin: 0;
`;
