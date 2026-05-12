'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import InstallButton from '@/components/global/installButton';

// Shared admin header with grouped navigation.
// Pages pass `current` ('produtos' | 'catalog' | 'historico' | 'banners' | 'filtros' | 'icons' | 'analytics' | 'edit')
// so the active item can be highlighted without route-string matching.
export default function AdminHeader({ current, title = 'Foodlab Admin' }) {
    const [showHelp, setShowHelp] = useState(false);
    const pathname = usePathname();

    const active = current || (
        pathname?.includes('/admin/catalog/historico') ? 'historico' :
        pathname?.includes('/admin/catalog') ? 'catalog' :
        pathname?.includes('/admin/home') ? 'banners' :
        pathname?.includes('/admin/filtros') ? 'filtros' :
        pathname?.includes('/admin/icons') ? 'icons' :
        pathname?.includes('/admin/analytics') ? 'analytics' :
        pathname?.includes('/admin/produtos') ? 'edit' :
        pathname === '/admin' ? 'produtos' : null
    );

    const refreshKiosks = async () => {
        const r = await fetch('/api/admin/bump-version', { method: 'POST' });
        if (r.ok) alert('Quiosques vão recarregar nos próximos 30s');
    };

    return (
        <>
            <Wrap>
                <TopBar>
                    <Brand>{title}</Brand>
                    <TopActions>
                        <InstallButton label="Instalar" />
                        <HelpBtn onClick={() => setShowHelp(true)} title="Ajuda">?</HelpBtn>
                    </TopActions>
                </TopBar>

                <Group>
                    <GroupLabel>Ver</GroupLabel>
                    <GroupItems>
                        <NavLink href="/site" target="_blank" $tone="site">
                            Site online <Arrow>↗</Arrow>
                        </NavLink>
                        <NavLink href="/?kiosk=1" target="_blank" $tone="kiosk">
                            Quiosque <Arrow>↗</Arrow>
                        </NavLink>
                    </GroupItems>
                </Group>

                <Group>
                    <GroupLabel>Catálogo PDF</GroupLabel>
                    <GroupItems>
                        <NavLink href="/admin/catalog" $active={active === 'catalog'}>
                            Configurar capa / índice
                        </NavLink>
                        <NavLink href="/admin" $active={active === 'produtos'}>
                            Escolher produtos
                        </NavLink>
                        <NavLink href="/admin/catalog/historico" $active={active === 'historico'}>
                            Histórico de PDFs
                        </NavLink>
                    </GroupItems>
                </Group>

                <Group>
                    <GroupLabel>Conteúdo</GroupLabel>
                    <GroupItems>
                        <NavLink href="/admin" $active={active === 'produtos' || active === 'edit'}>
                            Produtos
                        </NavLink>
                        <NavLink href="/admin/home" $active={active === 'banners'}>
                            Banners
                        </NavLink>
                        <NavLink href="/admin/filtros" $active={active === 'filtros'}>
                            Filtros
                        </NavLink>
                        <NavLink href="/admin/icons" $active={active === 'icons'}>
                            Ícones
                        </NavLink>
                    </GroupItems>
                </Group>

                <Group>
                    <GroupLabel>Sistema</GroupLabel>
                    <GroupItems>
                        <NavLink href="/admin/analytics" $active={active === 'analytics'}>
                            Analytics
                        </NavLink>
                        <NavLink as="a" href="/api/admin/download-all" $tone="warning">
                            Backup
                        </NavLink>
                        <NavLink as="button" onClick={refreshKiosks} $tone="warning">
                            Refrescar quiosques
                        </NavLink>
                    </GroupItems>
                </Group>
            </Wrap>

            {showHelp && (
                <HelpBackdrop onClick={() => setShowHelp(false)}>
                    <HelpCard onClick={(e) => e.stopPropagation()}>
                        <HelpHeader>
                            <h3>Como navegar no admin</h3>
                            <CloseBtn onClick={() => setShowHelp(false)}>×</CloseBtn>
                        </HelpHeader>
                        <HelpBody>
                            <h4>Ver</h4>
                            <ul>
                                <li><b>Site online</b> — abre a versão pública (responsive). Limpa o flag de quiosque do browser.</li>
                                <li><b>Quiosque</b> — abre como se fosses o quiosque (com lockdown, sem cursor, fullscreen).</li>
                            </ul>
                            <h4>Catálogo PDF</h4>
                            <ul>
                                <li><b>Configurar</b> — capa, página em branco, título do índice, rodapé.</li>
                                <li><b>Escolher produtos</b> — vai a Produtos, carrega no <b>+</b> dos cards para os juntar à seleção. Em baixo aparece a barra com "Exportar PDF".</li>
                                <li><b>Histórico</b> — todos os PDFs criados ficam guardados aqui para voltares a descarregar sem regenerar.</li>
                            </ul>
                            <h4>Conteúdo</h4>
                            <ul>
                                <li><b>Produtos</b> — lista + edição (imagens, pictos, cards, texto).</li>
                                <li><b>Banners</b> — banners da homepage do quiosque.</li>
                                <li><b>Filtros</b> — categorias da página /produtos.</li>
                                <li><b>Ícones</b> — SVGs dos pictos (vegan, etc.).</li>
                            </ul>
                            <h4>Sistema</h4>
                            <ul>
                                <li><b>Analytics</b> — métricas de uso (eventos, vistas, filtros).</li>
                                <li><b>Backup .zip</b> — exporta toda a config e imagens.</li>
                                <li><b>Refrescar quiosques</b> — força os quiosques abertos a recarregar nos próximos 30s.</li>
                            </ul>
                        </HelpBody>
                    </HelpCard>
                </HelpBackdrop>
            )}
        </>
    );
}

const Wrap = styled.div`
    background: transparent;
    border-bottom: 1px solid #e5edf0;
    padding: 14px 0 18px 0;
    margin-bottom: 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
`;

const Brand = styled.div`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    color: #005E81;
    font-size: 18px;
    letter-spacing: -0.5px;
`;

const TopActions = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const HelpBtn = styled.button`
    width: 30px;
    height: 30px;
    border-radius: 1000px;
    border: 1.5px solid #005E81;
    background: transparent;
    color: #005E81;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    line-height: 1;
    transition: background 0.15s, color 0.15s;

    &:hover { background: #005E81; color: #fff; }
`;

const Group = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 32px;
`;

const GroupLabel = styled.div`
    flex: 0 0 110px;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.4px;
    color: #9bafb8;
`;

const GroupItems = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
`;

const TONE = {
    site: { bd: '#2a7', fg: '#1f6a52' },
    kiosk: { bd: '#FFB40F', fg: '#a16b00' },
    warning: { bd: '#c79100', fg: '#7a5500' },
    default: { bd: '#005E81', fg: '#005E81' },
};

const NavLink = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 7px 16px;
    border-radius: 1000px;
    border: 1.5px solid ${(p) => (TONE[p.$tone] || TONE.default).bd};
    background: ${(p) => p.$active ? (TONE[p.$tone] || TONE.default).bd : 'transparent'};
    color: ${(p) => p.$active ? '#fff' : (TONE[p.$tone] || TONE.default).fg};
    font-weight: 600;
    font-size: 12.5px;
    cursor: pointer;
    text-decoration: none;
    font-family: inherit;
    line-height: 1.3;
    letter-spacing: 0.1px;
    transition: background 0.15s, color 0.15s, transform 0.1s;

    &:hover {
        background: ${(p) => (TONE[p.$tone] || TONE.default).bd};
        color: #fff;
        transform: translateY(-1px);
    }
`;

const Arrow = styled.span`
    font-size: 11px;
    opacity: 0.7;
    margin-left: 2px;
`;

// === Help modal ===
const HelpBackdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 24px;
`;

const HelpCard = styled.div`
    background: #fff;
    border-radius: 12px;
    width: 100%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const HelpHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 { margin: 0; color: #005E81; }
`;

const CloseBtn = styled.button`
    background: none;
    border: none;
    font-size: 28px;
    line-height: 1;
    color: #999;
    cursor: pointer;
    &:hover { color: #333; }
`;

const HelpBody = styled.div`
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    h4 { color: #005E81; margin: 14px 0 6px 0; }
    ul { margin: 0; padding-left: 20px; }
    li { margin-bottom: 4px; }
    b { color: #005E81; }
`;
