'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

export default function FiltersAdmin() {
    const [filters, setFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const reload = async () => {
        const [f, p] = await Promise.all([
            fetch('/api/admin/filters').then((r) => r.json()),
            fetch('/api/admin/products').then((r) => r.json()),
        ]);
        setFilters(f);
        setProducts(p);
        setLoading(false);
    };

    useEffect(() => { reload(); }, []);

    const create = async () => {
        const name = prompt('Nome do filtro:');
        if (!name) return;
        await fetch('/api/admin/filters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, icon: '/images/icons/tudo.svg' }),
        });
        reload();
    };

    const update = async (id, patch) => {
        await fetch(`/api/admin/filters/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
        });
        reload();
    };

    const remove = async (id) => {
        if (id === 0) { alert('Não podes apagar o filtro "Tudo"'); return; }
        if (!confirm('Apagar filtro? Os produtos associados perdem essa associação.')) return;
        await fetch(`/api/admin/filters/${id}`, { method: 'DELETE' });
        reload();
    };

    const uploadIcon = async (id, file) => {
        if (!file) return;
        const targetPath = `images/icons/filter-${id}-${Date.now()}.${file.name.split('.').pop()}`;
        const fd = new FormData();
        fd.append('file', file);
        fd.append('path', targetPath);
        const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!r.ok) { alert('Erro upload'); return; }
        const data = await r.json();
        await update(id, { icon: data.path });
    };

    const productsInFilter = (id) =>
        products.filter((p) => Array.isArray(p.filter) && p.filter.includes(id));

    return (
        <Wrap>
            <Header>
                <Link href="/admin">← Admin</Link>
                <h1>Filtros</h1>
                <NewBtn onClick={create}>+ Novo filtro</NewBtn>
            </Header>
            <Note>
                Os filtros aparecem na página `/produtos`. Cada produto pode estar em vários filtros (define-se na página do produto).
                Para alterar o ícone, sobe um SVG ou PNG (recomendado: SVG branco/azul, 64×64).
            </Note>

            {loading && <p>A carregar…</p>}

            <List>
                {filters.map((f) => {
                    const productCount = productsInFilter(f.id).length;
                    return (
                        <Row key={f.id}>
                            <IconWrap>
                                <IconImg style={{ backgroundImage: `url(${f.icon}?t=${Date.now()})` }} />
                                <label>
                                    <input
                                        type="file"
                                        accept="image/svg+xml,image/png"
                                        style={{ display: 'none' }}
                                        onChange={(e) => uploadIcon(f.id, e.target.files?.[0])}
                                    />
                                    <small>trocar ícone</small>
                                </label>
                            </IconWrap>
                            <Fields>
                                <Field>
                                    <label>Nome</label>
                                    <input
                                        defaultValue={f.name || ''}
                                        onBlur={(e) => e.target.value !== f.name && update(f.id, { name: e.target.value })}
                                    />
                                </Field>
                                <Field>
                                    <label>id</label>
                                    <input value={f.id} disabled />
                                </Field>
                                <Field>
                                    <label>Produtos</label>
                                    <ProductsInfo>{productCount}</ProductsInfo>
                                </Field>
                            </Fields>
                            {f.id !== 0 && (
                                <DangerBtn onClick={() => remove(f.id)}>Remover</DangerBtn>
                            )}
                        </Row>
                    );
                })}
            </List>
        </Wrap>
    );
}

const Wrap = styled.div`
    width: 100%;
    max-width: 1200px;
    padding: 32px;
    box-sizing: border-box;
    font-family: var(--font-dm-sans), system-ui, sans-serif;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    a { color: #005E81; text-decoration: none; }
    h1 { margin: 0; flex: 1; color: #005E81; }
`;

const NewBtn = styled.button`
    padding: 10px 18px;
    background: #005E81;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
`;

const Note = styled.p`
    color: #666;
    font-size: 13px;
    margin: 0 0 24px 0;
    font-style: italic;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px;
`;

const IconWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    label { cursor: pointer; }
    small { color: #005E81; font-size: 11px; text-decoration: underline; }
`;

const IconImg = styled.div`
    width: 80px;
    height: 80px;
    background-color: #005E81;
    background-size: 50%;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
    border: 2px solid #005E81;
`;

const Fields = styled.div`
    flex: 1;
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 120px;

    label { font-size: 12px; color: #666; font-weight: 600; }
    input {
        font-family: inherit;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 14px;
    }
`;

const ProductsInfo = styled.div`
    padding: 8px 12px;
    background: #f5f5f0;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #005E81;
    min-width: 60px;
    text-align: center;
`;

const DangerBtn = styled.button`
    padding: 8px 14px;
    border: 1px solid #c0392b;
    background: #fff;
    color: #c0392b;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    font-weight: 600;
`;
