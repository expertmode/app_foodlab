'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import AdminHeader from '@/components/admin/adminHeader';

export default function CatalogHistory() {
    const [list, setList] = useState(null);
    const [busy, setBusy] = useState(null);

    const load = () => fetch('/api/admin/catalog/pdfs').then((r) => r.json()).then(setList);
    useEffect(() => { load(); }, []);

    const del = async (id) => {
        if (!confirm('Apagar este PDF do histórico?')) return;
        setBusy(id);
        try {
            const r = await fetch(`/api/admin/catalog/pdfs?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
            if (!r.ok) {
                const data = await r.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${r.status}`);
            }
            await load();
        } catch (e) {
            alert('Erro: ' + e.message);
        } finally {
            setBusy(null);
        }
    };

    return (
        <Wrap>
            <AdminHeader current="historico" />
            <PageTitle>Histórico de PDFs</PageTitle>
            <Intro>
                Cada PDF criado em <b>Produtos</b> fica aqui guardado. Podes descarregar de novo sem ter de regenerar,
                ou apagar os que já não precisas.
            </Intro>

            {!list && <Loading>A carregar…</Loading>}
            {list && list.length === 0 && (
                <Empty>Ainda não foi criado nenhum PDF. Vai a <b>Produtos</b>, selecciona alguns, e carrega em <b>↓ Criar PDF</b>.</Empty>
            )}

            {list && list.length > 0 && (
                <List>
                    {list.map((p) => (
                        <Row key={p.id}>
                            <RowMain>
                                <RowDate>{formatDate(p.createdAt)}</RowDate>
                                <RowFile>{p.filename}</RowFile>
                                <RowMeta>
                                    {p.productCount} produto{p.productCount === 1 ? '' : 's'}
                                    {p.productIds?.length > 0 && (
                                        <RowIds title={p.productIds.join(', ')}>
                                            · ids: {p.productIds.slice(0, 8).join(', ')}{p.productIds.length > 8 ? '…' : ''}
                                        </RowIds>
                                    )}
                                </RowMeta>
                            </RowMain>
                            <RowActions>
                                <ViewLink href={p.url} target="_blank" rel="noopener">
                                    ↗ Ver
                                </ViewLink>
                                <DownloadLink href={p.url} download={p.filename}>
                                    ↓ Descarregar
                                </DownloadLink>
                                <DelBtn disabled={busy === p.id} onClick={() => del(p.id)}>
                                    {busy === p.id ? '…' : '✕'}
                                </DelBtn>
                            </RowActions>
                        </Row>
                    ))}
                </List>
            )}
        </Wrap>
    );
}

function formatDate(iso) {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        return d.toLocaleString('pt-PT', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });
    } catch { return iso; }
}

const Wrap = styled.div`
    width: 100%;
    max-width: 1400px;
    padding: 24px 32px 32px 32px;
    box-sizing: border-box;
    font-family: var(--font-dm-sans), system-ui, sans-serif;
`;

const PageTitle = styled.h1`
    margin: 0 0 16px 0;
    color: #005E81;
    font-size: 24px;
    font-weight: 700;
`;

const Intro = styled.p`
    color: #444;
    background: #f6fafc;
    border: 1px solid #d6e7ee;
    padding: 12px 14px;
    border-radius: 8px;
    line-height: 1.5;
    font-size: 14px;
    margin: 8px 0 24px 0;
`;

const Loading = styled.div`
    color: #666;
    padding: 32px 0;
`;

const Empty = styled.div`
    color: #666;
    background: #fff;
    border: 1px dashed #cbd9df;
    border-radius: 10px;
    padding: 24px;
    text-align: center;
    line-height: 1.5;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    padding: 14px 18px;
`;

const RowMain = styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const RowDate = styled.div`
    color: #005E81;
    font-weight: 700;
    font-size: 14px;
`;

const RowFile = styled.div`
    color: #333;
    font-size: 13px;
    font-family: ui-monospace, SFMono-Regular, monospace;
`;

const RowMeta = styled.div`
    color: #888;
    font-size: 12px;
    margin-top: 2px;
`;

const RowIds = styled.span`
    margin-left: 2px;
`;

const RowActions = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
    flex-shrink: 0;
`;

const ViewLink = styled.a`
    padding: 8px 14px;
    border-radius: 8px;
    background: #fff;
    border: 1.5px solid #005E81;
    color: #005E81;
    text-decoration: none;
    font-weight: 700;
    font-size: 13px;
    white-space: nowrap;
    &:hover { background: #f0f8fb; }
`;

const DownloadLink = styled.a`
    padding: 8px 14px;
    border-radius: 8px;
    background: #005E81;
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: 13px;
    white-space: nowrap;
    &:hover { background: #004a66; }
`;

const DelBtn = styled.button`
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #c0392b;
    background: #fff;
    color: #c0392b;
    cursor: pointer;
    font-weight: 700;
    &:hover:not(:disabled) { background: #fff5f5; }
    &:disabled { opacity: 0.5; cursor: wait; }
`;
