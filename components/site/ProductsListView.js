'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { productHasPicto } from '@/lib/pictos';

export default function ProductsListView({ products, filters }) {
    const [activeKey, setActiveKey] = useState(null);
    const [query, setQuery] = useState('');

    const visible = useMemo(() => {
        return products.filter((p) => {
            if (activeKey && !productHasPicto(p, activeKey)) return false;
            if (query) {
                const q = query.toLowerCase();
                const hay = `${p.title || ''} ${p.subTitle || ''} ${p.partner || ''} ${p.description || ''}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [products, activeKey, query]);

    return (
        <Wrap>
            <Inner>
                <Head>
                    <Eyebrow>Produtos</Eyebrow>
                    <h1>Catálogo Foodlab</h1>
                    <Lead>
                        {products.length} produtos desenvolvidos no laboratório.
                        Filtra por característica ou pesquisa pelo nome.
                    </Lead>
                </Head>

                <ControlBar>
                    <SearchInput
                        type="search"
                        placeholder="Pesquisar produtos…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Count>{visible.length} / {products.length}</Count>
                </ControlBar>

                {filters.length > 0 && (
                    <FilterRow>
                        <FilterChip $on={!activeKey} onClick={() => setActiveKey(null)}>
                            Todos
                        </FilterChip>
                        {filters.map((f) => (
                            <FilterChip
                                key={f.key}
                                $on={activeKey === f.key}
                                onClick={() => setActiveKey((k) => (k === f.key ? null : f.key))}
                            >
                                {f.label} <Counter>{f.count}</Counter>
                            </FilterChip>
                        ))}
                    </FilterRow>
                )}

                {visible.length === 0 ? (
                    <Empty>Sem resultados.</Empty>
                ) : (
                    <Grid>
                        {visible.map((p) => (
                            <Card key={p.id} href={`/site/produtos/${p.keyName}`}>
                                <Thumb style={{ backgroundImage: `url(${p.imgProd})` }} />
                                <Body>
                                    <Partner>{p.partner}</Partner>
                                    <Title>{(p.title || '').replace(/\n/g, ' ')}</Title>
                                    {p.subTitle && <Subtitle>{p.subTitle.replace(/\n/g, ' ')}</Subtitle>}
                                </Body>
                            </Card>
                        ))}
                    </Grid>
                )}
            </Inner>
        </Wrap>
    );
}

const Wrap = styled.section`
    width: 100%;
    padding: clamp(32px, 6vw, 64px) 24px clamp(48px, 8vw, 96px);
`;

const Inner = styled.div`
    max-width: 1240px;
    margin: 0 auto;
`;

const Head = styled.header`
    margin-bottom: 32px;
`;

const Eyebrow = styled.p`
    margin: 0 0 8px 0;
    color: #88a8b5;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 12px;
    font-weight: 700;
`;

const Lead = styled.p`
    color: #34556a;
    font-size: 15px;
    line-height: 1.55;
    margin: 12px 0 0 0;
    max-width: 60ch;
`;

const ControlBar = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
`;

const SearchInput = styled.input`
    flex: 1;
    padding: 12px 18px;
    border: 1.5px solid #d6e7ee;
    border-radius: 1000px;
    font-size: 15px;
    font-family: inherit;
    background: #fff;
    color: #005E81;

    &:focus {
        outline: none;
        border-color: #005E81;
        box-shadow: 0 0 0 4px rgba(0, 94, 129, 0.1);
    }

    &::placeholder { color: #9bafb8; }
`;

const Count = styled.span`
    color: #88a8b5;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
`;

const FilterRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 32px;
`;

const FilterChip = styled.button`
    background: ${(p) => (p.$on ? '#005E81' : '#fff')};
    color: ${(p) => (p.$on ? '#fff' : '#005E81')};
    border: 1.5px solid ${(p) => (p.$on ? '#005E81' : '#d6e7ee')};
    padding: 8px 16px;
    border-radius: 1000px;
    cursor: pointer;
    font-weight: 600;
    font-size: 13px;
    font-family: inherit;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s, border-color 0.15s;

    &:hover {
        border-color: #005E81;
    }
`;

const Counter = styled.span`
    background: rgba(255, 255, 255, 0.25);
    border-radius: 1000px;
    padding: 2px 7px;
    font-size: 11px;

    ${FilterChip}:not([class*='$on']) & {
        background: #f0f6f8;
        color: #88a8b5;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 18px;

    @media (min-width: 1000px) {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
`;

const Card = styled(Link)`
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #e0ebf0;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    transition: transform 0.15s, box-shadow 0.2s, border-color 0.15s;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 28px rgba(0, 94, 129, 0.12);
        border-color: #005E81;
    }
`;

const Thumb = styled.div`
    width: 100%;
    aspect-ratio: 1;
    background-color: #f5f5f0;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
`;

const Body = styled.div`
    padding: 16px 18px 20px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Partner = styled.span`
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1px;
    color: #88a8b5;
    font-weight: 600;
`;

const Title = styled.h3`
    margin: 0;
    color: #005E81;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.25;
`;

const Subtitle = styled.p`
    margin: 4px 0 0 0;
    color: #4a6976;
    font-size: 13px;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const Empty = styled.div`
    color: #88a8b5;
    text-align: center;
    padding: 64px 0;
    font-size: 15px;
`;
