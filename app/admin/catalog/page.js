'use client';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import AdminHeader from '@/components/admin/adminHeader';
import PrintCover from '@/components/print/PrintCover';

export default function AdminCatalog() {
    const [cfg, setCfg] = useState(null);
    const [busy, setBusy] = useState(false);
    const [savedAt, setSavedAt] = useState(0);
    const fileRef = useRef(null);
    const previewBoxRef = useRef(null);
    const [previewScale, setPreviewScale] = useState(0.4);

    useEffect(() => {
        fetch('/api/admin/catalog').then((r) => r.json()).then(setCfg);
    }, []);

    // Recompute preview scale whenever the preview box changes size — 794px is the
    // pixel width of A4 portrait at 96dpi, so scale = boxWidth / 794.
    useEffect(() => {
        const el = previewBoxRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const update = () => {
            const w = el.clientWidth;
            if (w > 0) setPreviewScale(w / 794);
        };
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [cfg]);

    if (!cfg) {
        return <Wrap><AdminHeader current="catalog" /><PageTitle>Catálogo PDF</PageTitle><Loading>A carregar…</Loading></Wrap>;
    }

    const patch = (section, key, value) => {
        setCfg((c) => ({ ...c, [section]: { ...c[section], [key]: value } }));
    };

    const save = async () => {
        setBusy(true);
        try {
            const r = await fetch('/api/admin/catalog', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cfg),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'erro');
            setCfg(data);
            setSavedAt(Date.now());
        } catch (e) {
            alert('Erro ao guardar: ' + e.message);
        } finally {
            setBusy(false);
        }
    };

    const uploadCover = async (file) => {
        if (!file) return;
        setBusy(true);
        try {
            const form = new FormData();
            form.append('file', file);
            form.append('path', `catalog/cover-${Date.now()}.webp`);
            const r = await fetch('/api/admin/upload', { method: 'POST', body: form });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'erro');
            patch('cover', 'image', data.url);
        } catch (e) {
            alert('Erro upload: ' + e.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <Wrap>
            <AdminHeader current="catalog" />
            <PageTitle>Catálogo PDF</PageTitle>
            <Intro>
                Configura a aparência do PDF gerado a partir da seleção de produtos no <b>Admin → Produtos</b>.
                A ordem do PDF: <b>Capa</b> → <b>Página em branco</b> (opcional) → <b>Índice</b> → uma página por produto selecionado.
            </Intro>

            <SplitLayout>
                <FormCol>
            <Section>
                <SectionTitle>Capa</SectionTitle>
                <FieldRow>
                    <Field>
                        <label>Título</label>
                        <input value={cfg.cover.title} onChange={(e) => patch('cover', 'title', e.target.value)} placeholder="Catálogo" />
                    </Field>
                    <Field>
                        <label>Subtítulo</label>
                        <input value={cfg.cover.subtitle} onChange={(e) => patch('cover', 'subtitle', e.target.value)} placeholder="Foodlab" />
                    </Field>
                </FieldRow>
                <FieldRow>
                    <Field>
                        <label>Data / Edição</label>
                        <input value={cfg.cover.date} onChange={(e) => patch('cover', 'date', e.target.value)} placeholder="Ex: 2026 · Primavera" />
                    </Field>
                    <Field>
                        <label>Logo Foodlab na capa</label>
                        <ToggleRow>
                            <input
                                id="showLogo"
                                type="checkbox"
                                checked={!!cfg.cover.showLogo}
                                onChange={(e) => patch('cover', 'showLogo', e.target.checked)}
                            />
                            <label htmlFor="showLogo">Mostrar logo</label>
                        </ToggleRow>
                    </Field>
                </FieldRow>
                <Field>
                    <label>Imagem de fundo da capa</label>
                    <CoverPreview $img={cfg.cover.image} onClick={() => fileRef.current?.click()}>
                        {!cfg.cover.image && <span>Clica para escolher imagem</span>}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={(e) => uploadCover(e.target.files?.[0])}
                        />
                    </CoverPreview>
                    {cfg.cover.image && (
                        <MiniRow>
                            <SmallBtn onClick={() => fileRef.current?.click()}>Substituir</SmallBtn>
                            <SmallBtn $danger onClick={() => patch('cover', 'image', '')}>Remover</SmallBtn>
                        </MiniRow>
                    )}
                </Field>
            </Section>

            <Section>
                <SectionTitle>Página em branco (após a capa)</SectionTitle>
                <ToggleRow>
                    <input
                        id="blankEnabled"
                        type="checkbox"
                        checked={!!cfg.blankPage.enabled}
                        onChange={(e) => patch('blankPage', 'enabled', e.target.checked)}
                    />
                    <label htmlFor="blankEnabled">Incluir página em branco entre capa e índice</label>
                </ToggleRow>
                <Field>
                    <label>Texto pequeno (opcional, ex: "Notas:")</label>
                    <input
                        value={cfg.blankPage.note}
                        onChange={(e) => patch('blankPage', 'note', e.target.value)}
                        placeholder="Vazio = página totalmente em branco"
                        disabled={!cfg.blankPage.enabled}
                    />
                </Field>
            </Section>

            <Section>
                <SectionTitle>Índice</SectionTitle>
                <Field>
                    <label>Título da página de índice</label>
                    <input value={cfg.index.title} onChange={(e) => patch('index', 'title', e.target.value)} placeholder="Índice" />
                </Field>
                <Note>A lista é gerada automaticamente com os produtos selecionados (na ordem definida no admin).</Note>
            </Section>

            <Section>
                <SectionTitle>Rodapé das páginas de produto</SectionTitle>
                <Field>
                    <label>Texto do rodapé</label>
                    <input value={cfg.footer.text} onChange={(e) => patch('footer', 'text', e.target.value)} placeholder="foodlab.pt" />
                </Field>
            </Section>

            <SaveBar>
                {savedAt > 0 && <Saved>Guardado às {new Date(savedAt).toLocaleTimeString()}</Saved>}
                <SaveBtn disabled={busy} onClick={save}>{busy ? 'A guardar…' : 'Guardar alterações'}</SaveBtn>
            </SaveBar>
                </FormCol>

                <PreviewCol>
                    <PreviewLabel>Pré-visualização da capa</PreviewLabel>
                    <PreviewBox ref={previewBoxRef}>
                        <PreviewScale style={{ transform: `scale(${previewScale})` }}>
                            <PrintCover cover={cfg.cover} />
                        </PreviewScale>
                    </PreviewBox>
                    <PreviewHint>Atualiza automaticamente a cada alteração.</PreviewHint>
                </PreviewCol>
            </SplitLayout>
        </Wrap>
    );
}

const Wrap = styled.div`
    width: 100%;
    max-width: 1400px;
    padding: 24px 32px 32px 32px;
    box-sizing: border-box;
    font-family: var(--font-dm-sans), system-ui, sans-serif;
`;

const SplitLayout = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 32px;
    align-items: start;

    @media (max-width: 980px) {
        grid-template-columns: 1fr;
    }
`;

const FormCol = styled.div`
    min-width: 0;
`;

const PreviewCol = styled.aside`
    position: sticky;
    top: 24px;
    align-self: start;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const PreviewLabel = styled.div`
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.4px;
    color: #9bafb8;
    font-weight: 700;
`;

const PreviewBox = styled.div`
    width: 100%;
    aspect-ratio: 210 / 297;
    background: #f5f5f0;
    border: 1px solid #e0ebf0;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 6px 24px rgba(0, 94, 129, 0.10);

    /* Render the real PrintCover (210mm × 297mm) at a scaled size to fit the box.
       The inner element uses the actual print dimensions; CSS scale shrinks it visually. */
`;

const PreviewScale = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 210mm;
    height: 297mm;
    transform-origin: top left;
    /* transform is set inline based on the container width (see ResizeObserver above) */
`;

const PreviewHint = styled.p`
    margin: 0;
    font-size: 11px;
    color: #88a8b5;
    line-height: 1.4;
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

const Section = styled.section`
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 18px 20px;
    margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
    margin: 0 0 14px 0;
    color: #005E81;
    font-size: 16px;
`;

const FieldRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
    label { font-size: 12px; color: #666; font-weight: 600; }
    input[type="text"], input:not([type]) {
        font-family: inherit;
        padding: 10px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 14px;
    }
`;

const ToggleRow = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
    input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
    label { cursor: pointer; }
`;

const CoverPreview = styled.div`
    width: 100%;
    aspect-ratio: 1 / 1.414;
    max-width: 240px;
    background-image: ${(p) => (p.$img ? `url(${p.$img})` : 'none')};
    background-color: #f5f5f0;
    background-size: cover;
    background-position: center;
    border: 2px dashed #c5d6dd;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888;
    font-size: 13px;
    text-align: center;
    padding: 12px;
    box-sizing: border-box;

    &:hover { border-color: #005E81; }
`;

const MiniRow = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`;

const SmallBtn = styled.button`
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid ${(p) => (p.$danger ? '#c0392b' : '#005E81')};
    background: #fff;
    color: ${(p) => (p.$danger ? '#c0392b' : '#005E81')};
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    &:hover { background: ${(p) => (p.$danger ? '#fff5f5' : '#f0f8fb')}; }
`;

const Note = styled.p`
    font-size: 12px;
    color: #888;
    margin: 4px 0 0 0;
`;

const SaveBar = styled.div`
    position: sticky;
    bottom: 0;
    background: #fff;
    border-top: 1px solid #e0e0e0;
    padding: 12px 0;
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
`;

const SaveBtn = styled.button`
    padding: 10px 24px;
    border: none;
    background: #005E81;
    color: #fff;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;
    &:disabled { opacity: 0.5; cursor: wait; }
    &:hover:not(:disabled) { background: #004a66; }
`;

const Saved = styled.span`
    color: #2a7;
    font-size: 12px;
`;

const Loading = styled.div`
    color: #666;
    padding: 32px 0;
`;
