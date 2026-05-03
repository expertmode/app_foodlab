'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

function detectPlatform() {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isMacSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua) && /Mac/.test(navigator.platform);
    const isAndroid = /Android/.test(ua);
    const isFirefox = /Firefox/.test(ua);
    const isEdgeChrome = /Chrome|Edg/.test(ua) && !isIOS && !isAndroid;
    if (isIOS) return 'ios';
    if (isMacSafari) return 'safari';
    if (isFirefox) return 'firefox';
    if (isEdgeChrome) return 'chromium';
    if (isAndroid) return 'android';
    return 'unknown';
}

export default function InstallButton({ label = 'Instalar app' }) {
    const [deferred, setDeferred] = useState(null);
    const [installed, setInstalled] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [platform, setPlatform] = useState('unknown');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        setPlatform(detectPlatform());
        if (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone) {
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

    const click = async () => {
        if (deferred) {
            deferred.prompt();
            const { outcome } = await deferred.userChoice;
            if (outcome === 'accepted') setDeferred(null);
            return;
        }
        setShowHelp(true);
    };

    return (
        <>
            <Btn onClick={click}>{label}</Btn>
            {showHelp && (
                <ModalBackdrop onClick={() => setShowHelp(false)}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <h3>Como instalar a app</h3>
                        {platform === 'ios' && (
                            <Steps>
                                <p>No <b>iPhone/iPad</b> (Safari):</p>
                                <ol>
                                    <li>Toca no botão <b>Partilhar</b> (□↑) na barra inferior</li>
                                    <li>Desce e escolhe <b>Adicionar ao ecrã principal</b></li>
                                    <li>Confirma com <b>Adicionar</b></li>
                                </ol>
                            </Steps>
                        )}
                        {platform === 'safari' && (
                            <Steps>
                                <p>No <b>Safari</b> (macOS):</p>
                                <ol>
                                    <li>Vai a <b>Ficheiro → Adicionar ao Dock</b></li>
                                    <li>Confirma com <b>Adicionar</b></li>
                                </ol>
                                <p>Em alternativa, abre o site no <b>Edge</b> ou <b>Chrome</b> e usa o botão "Instalar app".</p>
                            </Steps>
                        )}
                        {platform === 'firefox' && (
                            <Steps>
                                <p>O <b>Firefox</b> não suporta instalação de PWA.</p>
                                <p>Abre o site no <b>Edge</b>, <b>Chrome</b> ou <b>Brave</b> para instalar.</p>
                            </Steps>
                        )}
                        {(platform === 'chromium' || platform === 'android') && (
                            <Steps>
                                <p>Procura o ícone <b>Instalar</b> (📥) na barra de endereço.</p>
                                <p>Se não aparecer, é porque o site ainda não está totalmente "qualificado" como instalável (faltam alguns critérios PWA — visita umas vezes ou aguarda o service worker activar).</p>
                            </Steps>
                        )}
                        {platform === 'unknown' && (
                            <Steps>
                                <p>Para instalar, abre o site no <b>Edge</b> ou <b>Chrome</b> e vai ao menu → "Instalar Foodlab".</p>
                            </Steps>
                        )}
                        <ModalActions>
                            <CloseBtn onClick={() => setShowHelp(false)}>Fechar</CloseBtn>
                        </ModalActions>
                    </ModalCard>
                </ModalBackdrop>
            )}
        </>
    );
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
    color: #2a7;
    font-size: 12px;
    font-weight: 600;
`;

const ModalBackdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;
`;

const ModalCard = styled.div`
    background: #fff;
    border-radius: 12px;
    width: 100%;
    max-width: 520px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    h3 { margin: 0; color: #005E81; }
`;

const Steps = styled.div`
    color: #333;
    line-height: 1.6;

    p { margin: 8px 0; }
    ol { margin: 8px 0; padding-left: 20px; }
    li { margin-bottom: 6px; }
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const CloseBtn = styled.button`
    padding: 10px 18px;
    border: 1px solid #005E81;
    background: #fff;
    color: #005E81;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
`;
