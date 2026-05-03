'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

export default function HomeAdmin() {
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [picker, setPicker] = useState(null); // { bannerId } when picking from product

    const reload = async () => {
        const [b, p] = await Promise.all([
            fetch('/api/admin/banners').then((r) => r.json()),
            fetch('/api/admin/products').then((r) => r.json()),
        ]);
        setBanners(b);
        setProducts(p);
        setLoading(false);
    };

    useEffect(() => { reload(); }, []);

    const create = async () => {
        await fetch('/api/admin/banners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: '/images/bg1.jpg', text1: 'Texto 1', text2: 'Texto 2', text3: 'Texto 3' }),
        });
        reload();
    };

    const update = async (id, patch) => {
        await fetch(`/api/admin/banners/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
        });
        reload();
    };

    const remove = async (id) => {
        if (!confirm('Remover banner?')) return;
        await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
        reload();
    };

    const upload = async (id, file) => {
        if (!file) return;
        const targetPath = `images/banners/banner-${id}-${Date.now()}.${file.name.split('.').pop()}`;
        const fd = new FormData();
        fd.append('file', file);
        fd.append('path', targetPath);
        const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!r.ok) {
            // Fallback: direct upload to images/banners
            const fallback = `images/banners/banner-${id}.jpg`;
            const fd2 = new FormData();
            fd2.append('file', file);
            fd2.append('path', fallback);
            await fetch('/api/admin/upload', { method: 'POST', body: fd2 });
            await update(id, { image: '/' + fallback });
            return;
        }
        const data = await r.json();
        await update(id, { image: data.path });
    };

    const pickFromProduct = (productImage) => {
        if (!picker) return;
        update(picker.bannerId, { image: productImage });
        setPicker(null);
    };

    return (
        <Wrap>
            <Header>
                <Link href="/admin">← Admin</Link>
                <h1>Banners da Home</h1>
                <NewBtn onClick={create}>+ Novo banner</NewBtn>
            </Header>
            <Note>
                Os banners rodam automaticamente na home a cada 10 segundos. Recomendado: 5–6 banners.
                Cada um tem 3 linhas de texto (texto1 menor, texto2 grande, texto3 médio).
            </Note>

            {loading && <p>A carregar…</p>}

            <List>
                {banners.map((b) => (
                    <BannerRow key={b.id}>
                        <Preview style={{ backgroundImage: `url(${b.image}?t=${Date.now()})` }} />
                        <Fields>
                            <Field>
                                <label>Imagem</label>
                                <small>{b.image || '(vazio)'}</small>
                                <Btns>
                                    <label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => upload(b.id, e.target.files?.[0])}
                                        />
                                        <span>Upload</span>
                                    </label>
                                    <button onClick={() => setPicker({ bannerId: b.id })}>Escolher de produto</button>
                                </Btns>
                            </Field>
                            <Field>
                                <label>Texto 1 (pequeno)</label>
                                <input
                                    defaultValue={b.text1 || ''}
                                    onBlur={(e) => e.target.value !== b.text1 && update(b.id, { text1: e.target.value })}
                                />
                            </Field>
                            <Field>
                                <label>Texto 2 (grande)</label>
                                <input
                                    defaultValue={b.text2 || ''}
                                    onBlur={(e) => e.target.value !== b.text2 && update(b.id, { text2: e.target.value })}
                                />
                            </Field>
                            <Field>
                                <label>Texto 3 (médio)</label>
                                <input
                                    defaultValue={b.text3 || ''}
                                    onBlur={(e) => e.target.value !== b.text3 && update(b.id, { text3: e.target.value })}
                                />
                            </Field>
                            <Field>
                                <label>Ordem</label>
                                <input
                                    type="number"
                                    defaultValue={b.order || b.id}
                                    onBlur={(e) => {
                                        const v = parseInt(e.target.value, 10);
                                        if (!isNaN(v) && v !== (b.order || b.id)) update(b.id, { order: v });
                                    }}
                                />
                            </Field>
                            <DangerBtn onClick={() => remove(b.id)}>Remover</DangerBtn>
                        </Fields>
                    </BannerRow>
                ))}
            </List>

            {picker && (
                <ModalBackdrop onClick={() => setPicker(null)}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <h3>Escolher imagem de um produto</h3>
                        <small>Recomendado: img_bg (panorâmica) é mais adequada para banner</small>
                        <ProductGrid>
                            {products.map((p) => (
                                <ProductOptions key={p.id}>
                                    <ProductLabel>#{p.id} {(p.title || '').replace(/\n/g, ' ')}</ProductLabel>
                                    <Opts>
                                        {p.imgBg && (
                                            <OptThumb
                                                style={{ backgroundImage: `url(${p.imgBg}?t=${Date.now()})` }}
                                                onClick={() => pickFromProduct(p.imgBg)}
                                                title="img_bg (banner)"
                                            >
                                                <Tag>bg</Tag>
                                            </OptThumb>
                                        )}
                                        {p.imgProd && (
                                            <OptThumb
                                                style={{ backgroundImage: `url(${p.imgProd}?t=${Date.now()})` }}
                                                onClick={() => pickFromProduct(p.imgProd)}
                                                title="img_main (produto)"
                                            >
                                                <Tag>main</Tag>
                                            </OptThumb>
                                        )}
                                        {p.bottomImg && (
                                            <OptThumb
                                                style={{ backgroundImage: `url(${p.bottomImg}?t=${Date.now()})` }}
                                                onClick={() => pickFromProduct(p.bottomImg)}
                                                title="bottom_img"
                                            >
                                                <Tag>bottom</Tag>
                                            </OptThumb>
                                        )}
                                    </Opts>
                                </ProductOptions>
                            ))}
                        </ProductGrid>
                        <CloseBtn onClick={() => setPicker(null)}>Cancelar</CloseBtn>
                    </ModalCard>
                </ModalBackdrop>
            )}
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
    gap: 16px;
`;

const BannerRow = styled.div`
    display: flex;
    gap: 24px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px;
`;

const Preview = styled.div`
    width: 320px;
    aspect-ratio: 16/9;
    background-color: #f5f5f0;
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    flex: 0 0 auto;
`;

const Fields = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;

    label { font-size: 12px; color: #666; font-weight: 600; }
    small { color: #999; font-size: 11px; }
    input {
        font-family: inherit;
        padding: 6px 10px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 13px;
    }
`;

const Btns = styled.div`
    display: flex;
    gap: 6px;
    margin-top: 4px;

    button, label > span {
        flex: 0 0 auto;
        padding: 6px 12px;
        border: 1px solid #005E81;
        background: #fff;
        color: #005E81;
        border-radius: 6px;
        font-size: 12px;
        cursor: pointer;
        font-weight: 600;
    }
`;

const DangerBtn = styled.button`
    align-self: flex-start;
    margin-top: 6px;
    padding: 6px 12px;
    border: 1px solid #c0392b;
    background: #fff;
    color: #c0392b;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
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
    max-width: 1000px;
    max-height: 85vh;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    h3 { margin: 0; color: #005E81; }
    small { color: #999; font-size: 12px; }
`;

const ProductGrid = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const ProductOptions = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
`;

const ProductLabel = styled.div`
    flex: 1;
    color: #005E81;
    font-size: 13px;
    font-weight: 600;
`;

const Opts = styled.div`
    display: flex;
    gap: 6px;
`;

const OptThumb = styled.div`
    width: 80px;
    height: 60px;
    background-size: cover;
    background-position: center;
    border-radius: 6px;
    cursor: pointer;
    border: 2px solid transparent;
    position: relative;

    &:hover { border-color: #005E81; }
`;

const Tag = styled.div`
    position: absolute;
    bottom: 2px;
    left: 2px;
    background: rgba(0,94,129,0.85);
    color: #fff;
    font-size: 9px;
    padding: 1px 4px;
    border-radius: 3px;
`;

const CloseBtn = styled.button`
    align-self: flex-end;
    padding: 8px 16px;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 6px;
    cursor: pointer;
`;
