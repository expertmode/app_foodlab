'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import AdminHeader from '@/components/admin/adminHeader';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export default function AnalyticsAdmin() {
    const [stats, setStats] = useState(null);
    const [days, setDays] = useState(30);

    const reload = async () => {
        const r = await fetch(`/api/admin/analytics?days=${days}`);
        setStats(await r.json());
    };

    useEffect(() => { reload(); }, [days]);

    if (!stats) return <Wrap><p>A carregar…</p></Wrap>;

    const dayChart = Object.entries(stats.byDay)
        .map(([day, count]) => ({ day, count }))
        .sort((a, b) => a.day.localeCompare(b.day));

    const topProducts = stats.productViews.slice(0, 10).map((p) => ({
        name: stats.productMap[p.id]?.title || `Prod ${p.id}`,
        partner: stats.productMap[p.id]?.partner || '',
        views: p.count,
    }));

    const topFilters = stats.filterClicks.map((f) => ({
        name: stats.filterMap[f.id] || `Filtro ${f.id}`,
        clicks: f.count,
    }));

    return (
        <Wrap>
            <AdminHeader current="analytics" />
            <TitleRow>
                <PageTitle>Analytics</PageTitle>
                <select value={days} onChange={(e) => setDays(parseInt(e.target.value, 10))}>
                    <option value={7}>Últimos 7 dias</option>
                    <option value={30}>Últimos 30 dias</option>
                    <option value={90}>Últimos 90 dias</option>
                    <option value={365}>Último ano</option>
                </select>
                <PrintBtn onClick={() => window.print()}>↓ Imprimir / PDF</PrintBtn>
            </TitleRow>

            <KPIs>
                <KPI><KPILabel>Total de eventos</KPILabel><KPIValue>{stats.total}</KPIValue></KPI>
                <KPI><KPILabel>Vistas a produtos</KPILabel><KPIValue>{stats.byType.product_view || 0}</KPIValue></KPI>
                <KPI><KPILabel>Cliques em filtros</KPILabel><KPIValue>{stats.byType.filter_click || 0}</KPIValue></KPI>
                <KPI><KPILabel>Banner cliques</KPILabel><KPIValue>{stats.byType.banner_view || 0}</KPIValue></KPI>
            </KPIs>

            <Section>
                <h2>Eventos por dia</h2>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={dayChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#005E81" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </Section>

            <Section>
                <h2>Top 10 produtos mais vistos</h2>
                {topProducts.length === 0 && <Empty>Sem dados ainda.</Empty>}
                {topProducts.length > 0 && (
                    <>
                        <ResponsiveContainer width="100%" height={Math.max(280, topProducts.length * 32)}>
                            <BarChart data={topProducts} layout="vertical" margin={{ left: 200 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis type="number" tick={{ fontSize: 11 }} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={200} />
                                <Tooltip />
                                <Bar dataKey="views" fill="#005E81" />
                            </BarChart>
                        </ResponsiveContainer>
                        <Table>
                            <thead><tr><th>Produto</th><th>Parceiro</th><th>Vistas</th></tr></thead>
                            <tbody>
                                {topProducts.map((p, i) => (
                                    <tr key={i}><td>{p.name}</td><td>{p.partner}</td><td>{p.views}</td></tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </Section>

            <Section>
                <h2>Filtros mais clicados</h2>
                {topFilters.length === 0 && <Empty>Sem dados ainda.</Empty>}
                {topFilters.length > 0 && (
                    <Table>
                        <thead><tr><th>Filtro</th><th>Cliques</th></tr></thead>
                        <tbody>
                            {topFilters.map((f, i) => (
                                <tr key={i}><td>{f.name}</td><td>{f.clicks}</td></tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Section>

            <PrintNote>Janela de tempo: últimos {stats.days} dias · Gerado em {new Date().toLocaleString('pt-PT')}</PrintNote>
        </Wrap>
    );
}

const Wrap = styled.div`
    width: 100%;
    max-width: 1200px;
    padding: 32px;
    box-sizing: border-box;
    font-family: var(--font-dm-sans), system-ui, sans-serif;

    @media print {
        max-width: 100%;
        padding: 0;
    }
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
    flex-wrap: wrap;

    select {
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 13px;
    }

    @media print {
        select, button { display: none; }
    }
`;

const PageTitle = styled.h1`
    margin: 0;
    flex: 1;
    color: #005E81;
    font-size: 24px;
    font-weight: 700;
`;

const PrintBtn = styled.button`
    padding: 8px 16px;
    border: 1.5px solid #FFB40F;
    background: #fff;
    color: #b88200;
    border-radius: 6px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;

    &:hover { background: #FFB40F; color: #fff; }
`;

const KPIs = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;

    @media print {
        page-break-inside: avoid;
    }
`;

const KPI = styled.div`
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 20px;
`;

const KPILabel = styled.div`
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const KPIValue = styled.div`
    font-size: 36px;
    font-weight: 700;
    color: #005E81;
    margin-top: 8px;
`;

const Section = styled.section`
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;

    h2 { margin: 0 0 16px 0; color: #005E81; font-size: 18px; }

    @media print {
        page-break-inside: avoid;
        border: 1px solid #ccc;
    }
`;

const Empty = styled.p`
    color: #999;
    font-style: italic;
`;

const Table = styled.table`
    width: 100%;
    margin-top: 16px;
    border-collapse: collapse;
    font-size: 13px;

    th, td {
        text-align: left;
        padding: 8px 12px;
        border-bottom: 1px solid #eee;
    }
    th { color: #666; font-weight: 600; }
    td:last-child, th:last-child { text-align: right; font-weight: 600; }
`;

const PrintNote = styled.p`
    color: #999;
    font-size: 11px;
    text-align: center;
    margin-top: 32px;
`;
