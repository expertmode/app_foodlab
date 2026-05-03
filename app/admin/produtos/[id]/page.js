'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

export default function ProductAdmin({ params }) {
    const { id } = use(params);
    const [p, setP] = useState(null);
    const [saving, setSaving] = useState(false);
    const [busy, setBusy] = useState({}); // { 'main': true, 'card-1': true, ... }
    const [bump, setBump] = useState(0); // cache buster

    const reload = async () => {
        const r = await fetch(`/api/admin/products/${id}`);
        setP(await r.json());
    };

    useEffect(() => { reload(); }, [id]);

    if (!p) return <Wrap><p>A carregar…</p></Wrap>;

    const updateField = (key, value) => setP({ ...p, [key]: value });

    const updateCard = (cardId, key, value) => {
        setP({
            ...p,
            infoCards: p.infoCards.map((c) =>
                c.id === cardId ? { ...c, [key]: value } : c,
            ),
        });
    };

    const updatePicto = (pictoId, key, value) => {
        setP({
            ...p,
            pictos: p.pictos.map((pi) =>
                pi.id === pictoId ? { ...pi, [key]: value } : pi,
            ),
        });
    };

    const addCard = () => {
        const cards = p.infoCards || [];
        const nextId = (cards.reduce((m, c) => Math.max(m, c.id || 0), 0)) + 1;
        setP({
            ...p,
            infoCards: [...cards, {
                id: nextId,
                image: `/images/produtos/prod${p.id}/cards/card${nextId}.jpg`,
                desc: '',
            }],
        });
    };

    const removeCard = (cardId) => {
        if (!confirm('Remover este card?')) return;
        setP({
            ...p,
            infoCards: (p.infoCards || []).filter((c) => c.id !== cardId),
        });
    };

    const addPicto = () => {
        const pictos = p.pictos || [];
        const nextId = (pictos.reduce((m, pi) => Math.max(m, pi.id || 0), 0)) + 1;
        setP({
            ...p,
            pictos: [...pictos, {
                id: nextId,
                image: `/images/produtos/prod${p.id}/pictos/picto${nextId}.jpg`,
                text: '',
            }],
        });
    };

    const removePicto = (pictoId) => {
        if (!confirm('Remover este picto?')) return;
        setP({
            ...p,
            pictos: (p.pictos || []).filter((pi) => pi.id !== pictoId),
        });
    };

    const save = async () => {
        setSaving(true);
        try {
            const r = await fetch(`/api/admin/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(p),
            });
            if (!r.ok) throw new Error(await r.text());
            await reload();
        } catch (e) {
            alert('Erro a guardar: ' + e.message);
        } finally { setSaving(false); }
    };

    const generate = async (kind, cardId, customPrompt, referenceImage, referenceStrength) => {
        const key = kind === 'card' ? `card-${cardId}` : kind;
        setBusy({ ...busy, [key]: true });
        try {
            const r = await fetch('/api/admin/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: p.id, kind, cardId, customPrompt, referenceImage, referenceStrength }),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'erro');
            setBump((b) => b + 1);
        } catch (e) {
            alert('Erro a gerar: ' + e.message);
        } finally { setBusy((b) => ({ ...b, [key]: false })); }
    };

    const upload = async (kind, file, cardId) => {
        if (!file) return;
        const key = kind === 'card' ? `card-${cardId}` : kind;
        const path =
            kind === 'card'
                ? p.infoCards.find((c) => c.id === cardId)?.image
                : kind === 'img_main' ? p.imgProd
                    : kind === 'img_bg' ? p.imgBg
                        : kind === 'bottom_img' ? p.bottomImg
                            : null;
        if (!path) return;
        setBusy({ ...busy, [key]: true });
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('path', path);
            const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'erro');
            setBump((b) => b + 1);
        } catch (e) {
            alert('Erro upload: ' + e.message);
        } finally { setBusy((b) => ({ ...b, [key]: false })); }
    };

    const cb = (path) => `${path}?t=${bump}`;

    return (
        <Wrap>
            <TopBar>
                <Link href="/admin">← Voltar</Link>
                <h1>#{p.id} — {(p.title || '').replace(/\n/g, ' ')}</h1>
                <SaveBtn onClick={save} disabled={saving}>
                    {saving ? 'A guardar…' : 'Guardar alterações'}
                </SaveBtn>
            </TopBar>

            <Section>
                <h2>Texto</h2>
                <Row>
                    <Field $flex={1}>
                        <label>Título</label>
                        <textarea rows={2} value={p.title || ''} onChange={(e) => updateField('title', e.target.value)} />
                    </Field>
                    <Field $flex={1}>
                        <label>Subtítulo</label>
                        <textarea rows={2} value={p.subTitle || ''} onChange={(e) => updateField('subTitle', e.target.value)} />
                    </Field>
                </Row>
                <Field>
                    <label>Descrição (storytelling)</label>
                    <textarea rows={3} value={p.description || ''} onChange={(e) => updateField('description', e.target.value)} />
                </Field>
                <Row>
                    <Field $flex={1}>
                        <label>PPS</label>
                        <input value={p.pps || ''} onChange={(e) => updateField('pps', e.target.value)} />
                    </Field>
                    <Field $flex={1}>
                        <label>Parceiro</label>
                        <input value={p.partner || ''} onChange={(e) => updateField('partner', e.target.value)} />
                    </Field>
                    <Field $flex={1}>
                        <label>Frase destaque (slider)</label>
                        <input value={p.sliderTitle || ''} onChange={(e) => updateField('sliderTitle', e.target.value)} />
                    </Field>
                </Row>
            </Section>

            <Section>
                <h2>Imagens principais</h2>
                <Row>
                    <ImageBlock
                        label="img_main (PNG transparente)"
                        path={p.imgProd}
                        cb={cb}
                        busy={busy.img_main}
                        onGenerate={(prompt, ref, refS) => generate('img_main', null, prompt, ref, refS)}
                        onUpload={(f) => upload('img_main', f)}
                        fetchPrompt={async () => (await fetch(`/api/admin/prompt?productId=${p.id}&kind=img_main`).then(r => r.json())).prompt}
                        onRestore={() => setBump((b) => b + 1)}
                    />
                    <ImageBlock
                        label="img_bg (banner)"
                        path={p.imgBg}
                        cb={cb}
                        busy={busy.img_bg}
                        onGenerate={(prompt, ref, refS) => generate('img_bg', null, prompt, ref, refS)}
                        onUpload={(f) => upload('img_bg', f)}
                        fetchPrompt={async () => (await fetch(`/api/admin/prompt?productId=${p.id}&kind=img_bg`).then(r => r.json())).prompt}
                        onRestore={() => setBump((b) => b + 1)}
                    />
                    <ImageBlock
                        label="bottom_img"
                        path={p.bottomImg}
                        cb={cb}
                        busy={busy.bottom_img}
                        onGenerate={(prompt, ref, refS) => generate('bottom_img', null, prompt, ref, refS)}
                        onUpload={(f) => upload('bottom_img', f)}
                        fetchPrompt={async () => (await fetch(`/api/admin/prompt?productId=${p.id}&kind=bottom_img`).then(r => r.json())).prompt}
                        onRestore={() => setBump((b) => b + 1)}
                    />
                </Row>
            </Section>

            <Section>
                <h2>Cards ({p.infoCards?.length || 0})</h2>
                {p.infoCards?.map((c) => (
                    <CardEdit key={c.id}>
                        <ImageBlock
                            label={`card${c.id}`}
                            path={c.image}
                            cb={cb}
                            busy={busy[`card-${c.id}`]}
                            onGenerate={(prompt, ref, refS) => generate('card', c.id, prompt, ref, refS)}
                            onUpload={(f) => upload('card', f, c.id)}
                            fetchPrompt={async () => (await fetch(`/api/admin/prompt?productId=${p.id}&kind=card&cardId=${c.id}`).then(r => r.json())).prompt}
                            onRestore={() => setBump((b) => b + 1)}
                        />
                        <Field $flex={1}>
                            <label>Texto do card</label>
                            <textarea
                                rows={4}
                                value={c.desc || ''}
                                onChange={(e) => updateCard(c.id, 'desc', e.target.value)}
                            />
                            <RemoveItemBtn onClick={() => removeCard(c.id)}>Remover card</RemoveItemBtn>
                        </Field>
                    </CardEdit>
                ))}
                <AddItemBtn onClick={addCard}>+ Adicionar card</AddItemBtn>
            </Section>

            <Section>
                <h2>Pictos ({p.pictos?.length || 0})</h2>
                <Note>
                    Os pictos usam SVGs partilhados — apenas o texto é editável (o ícone é mapeado automaticamente por palavras-chave).
                    {(p.pictos?.length || 0) > 4 && (
                        <strong style={{ color: '#c0392b', display: 'block', marginTop: 4 }}>
                            ⚠️ Mais de 4 pictos: o layout do site mostra 4 por linha, os restantes aparecem na linha seguinte centrados.
                        </strong>
                    )}
                </Note>
                {p.pictos?.map((pi) => (
                    <PictoRow key={pi.id}>
                        <Field $flex={1}>
                            <label>picto{pi.id}</label>
                            <input value={pi.text || ''} onChange={(e) => updatePicto(pi.id, 'text', e.target.value)} />
                        </Field>
                        <RemoveItemBtn onClick={() => removePicto(pi.id)}>Remover</RemoveItemBtn>
                    </PictoRow>
                ))}
                <AddItemBtn onClick={addPicto}>+ Adicionar picto</AddItemBtn>
            </Section>
        </Wrap>
    );
}

function ImageBlock({ label, path, cb, busy, onGenerate, onUpload, fetchPrompt, onRestore }) {
    const [drag, setDrag] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [historyOpen, setHistoryOpen] = useState(false);

    return (
        <ImgWrap>
            <ImgLabel>{label}</ImgLabel>
            <DropZone
                $drag={drag}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f) onUpload(f);
                }}
                style={{ backgroundImage: `url(${cb(path)})` }}
            >
                {busy && <Overlay>a processar…</Overlay>}
                {!path && <NoImg>sem imagem</NoImg>}
            </DropZone>
            <Btns>
                <button disabled={busy} onClick={() => setModalOpen(true)} title="Abrir modal de geração">✨ Gerar</button>
                <button disabled={busy} onClick={() => onGenerate()} title="Regenerar com o mesmo prompt automático (variação)">↻</button>
                <label title="Upload de ficheiro local">
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => onUpload(e.target.files?.[0])}
                    />
                    <span>⬆ Upload</span>
                </label>
                <button disabled={busy} onClick={() => setHistoryOpen(true)} title="Versões anteriores">⟲</button>
            </Btns>
            <Path>{path}</Path>

            {modalOpen && (
                <GenerateModal
                    label={label}
                    fetchPrompt={fetchPrompt}
                    currentImagePath={path}
                    cb={cb}
                    onClose={() => setModalOpen(false)}
                    onConfirm={(prompt, refs, strength) => {
                        onGenerate(prompt, refs[0] || undefined, refs[0] ? strength : undefined);
                        setModalOpen(false);
                    }}
                />
            )}

            {historyOpen && (
                <HistoryModal
                    label={label}
                    targetPath={path}
                    onClose={() => setHistoryOpen(false)}
                    onRestored={() => { onRestore?.(); setHistoryOpen(false); }}
                />
            )}
        </ImgWrap>
    );
}

function HistoryModal({ label, targetPath, onClose, onRestored }) {
    const [versions, setVersions] = useState(null);
    const [busy, setBusy] = useState(false);

    const reload = () => {
        fetch(`/api/admin/versions?path=${encodeURIComponent(targetPath)}`)
            .then((r) => r.json())
            .then(setVersions);
    };

    useEffect(() => { reload(); }, [targetPath]);

    const restore = async (from) => {
        if (!confirm('Restaurar esta versão? A actual fica guardada como nova versão.')) return;
        setBusy(true);
        try {
            const r = await fetch('/api/admin/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from, to: targetPath }),
            });
            if (!r.ok) throw new Error(await r.text());
            onRestored();
        } catch (e) {
            alert('Erro: ' + e.message);
            setBusy(false);
        }
    };

    const remove = async (versionPath) => {
        if (!confirm('Apagar esta versão definitivamente?')) return;
        setBusy(true);
        try {
            const r = await fetch('/api/admin/versions/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ path: versionPath }),
            });
            if (!r.ok) throw new Error(await r.text());
            reload();
        } catch (e) {
            alert('Erro a apagar: ' + e.message);
        } finally { setBusy(false); }
    };

    return (
        <ModalBackdrop onClick={() => !busy && onClose()}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h3>Histórico — {label}</h3>
                    <CloseBtn onClick={onClose}>×</CloseBtn>
                </ModalHeader>
                <ExplainBox>
                    <strong>Como funciona o histórico</strong>
                    <ul>
                        <li>Cada vez que clicas <b>✨ Gerar</b>, <b>↻</b> ou <b>⬆ Upload</b>, a imagem actual é guardada automaticamente aqui antes de ser substituída.</li>
                        <li>Para <b>experimentar variações</b>: clica <b>↻</b> várias vezes — cada gera uma nova com o mesmo prompt e a anterior fica neste histórico.</li>
                        <li>Para <b>restaurar</b>: clica numa versão. A actual passa para o histórico, a antiga volta ao site.</li>
                        <li>Para <b>apagar</b>: clica no <b>×</b> em cima da versão (irreversível). A actual nunca pode ser apagada — só substituída.</li>
                        <li>Para <b>refinar</b> em vez de gerar do zero: usa <b>✨ Gerar</b> → "⟳ Usar actual" para usar a actual como referência + ajustar prompt.</li>
                    </ul>
                </ExplainBox>
                {versions === null && <p>A carregar…</p>}
                {versions && versions.length === 0 && (
                    <p style={{ color: '#666', fontSize: 13 }}>Sem versões anteriores ainda.</p>
                )}
                {versions && versions.length > 0 && (
                    <>
                        <VersionsGrid>
                            {versions.map((v) => (
                                <Version key={v.path} title={`Restaurar ${new Date(v.ts).toLocaleString()}`}>
                                    <VersionThumb
                                        style={{ backgroundImage: `url(${v.path})` }}
                                        onClick={() => !busy && restore(v.path)}
                                    />
                                    <VersionFooter>
                                        <VersionDate>{new Date(v.ts).toLocaleString()}</VersionDate>
                                        <DeleteBtn
                                            disabled={busy}
                                            onClick={(e) => { e.stopPropagation(); remove(v.path); }}
                                            title="Apagar esta versão"
                                        >
                                            ×
                                        </DeleteBtn>
                                    </VersionFooter>
                                </Version>
                            ))}
                        </VersionsGrid>
                    </>
                )}
            </ModalCard>
        </ModalBackdrop>
    );
}

function GenerateModal({ label, fetchPrompt, currentImagePath, cb, onClose, onConfirm }) {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(true);
    const [refs, setRefs] = useState([]); // array of data URLs
    const [strength, setStrength] = useState(0.7);

    useEffect(() => {
        fetchPrompt().then((p) => {
            setPrompt(p);
            setLoading(false);
        });
    }, []);

    const addRefs = (files) => {
        if (!files || !files.length) return;
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => setRefs((r) => [...r, reader.result]);
            reader.readAsDataURL(file);
        });
    };

    const useCurrentAsRef = async () => {
        if (!currentImagePath) return;
        try {
            const res = await fetch(cb ? cb(currentImagePath) : currentImagePath);
            const blob = await res.blob();
            const reader = new FileReader();
            reader.onload = () => setRefs((r) => [...r, reader.result]);
            reader.readAsDataURL(blob);
        } catch (e) {
            alert('Não consegui carregar a imagem actual: ' + e.message);
        }
    };

    const removeRef = (idx) => setRefs((r) => r.filter((_, i) => i !== idx));

    return (
        <ModalBackdrop onClick={onClose}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <h3>Gerar imagem — {label}</h3>
                    <CloseBtn onClick={onClose}>×</CloseBtn>
                </ModalHeader>

                <ModalSection>
                    <SectionTitle>Prompt</SectionTitle>
                    <PromptBox
                        rows={8}
                        value={loading ? 'A carregar prompt…' : prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={loading}
                    />
                </ModalSection>

                <ModalSection>
                    <SectionTitle>Imagens de referência (opcional)</SectionTitle>
                    <small>Apenas a primeira é usada (Flux Dev limita a 1 por geração)</small>
                    <RefList>
                        {refs.map((src, idx) => (
                            <RefThumb key={idx} style={{ backgroundImage: `url(${src})` }}>
                                <RefRemove onClick={() => removeRef(idx)}>×</RefRemove>
                                {idx === 0 && <RefBadge>usada</RefBadge>}
                            </RefThumb>
                        ))}
                        <label>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => addRefs(e.target.files)}
                            />
                            <RefAdd>+ Adicionar</RefAdd>
                        </label>
                        {currentImagePath && (
                            <RefAdd onClick={useCurrentAsRef} title="Refinar a partir da imagem actual">
                                ⟳ Usar actual
                            </RefAdd>
                        )}
                    </RefList>
                    {refs.length > 0 && (
                        <RefSlider>
                            <span>fidelidade à referência: {strength.toFixed(2)}</span>
                            <input
                                type="range"
                                min="0.3"
                                max="0.95"
                                step="0.05"
                                value={strength}
                                onChange={(e) => setStrength(parseFloat(e.target.value))}
                            />
                        </RefSlider>
                    )}
                </ModalSection>

                <ModalActions>
                    <CancelBtn onClick={onClose}>Cancelar</CancelBtn>
                    <ConfirmBtn
                        disabled={loading}
                        onClick={() => onConfirm(prompt, refs, strength)}
                    >
                        Gerar agora
                    </ConfirmBtn>
                </ModalActions>
            </ModalCard>
        </ModalBackdrop>
    );
}

const Wrap = styled.div`
    width: 100%;
    max-width: 1400px;
    padding: 32px;
    box-sizing: border-box;
    font-family: var(--font-dm-sans), system-ui, sans-serif;
`;

const TopBar = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 32px;

    a { color: #005E81; text-decoration: none; }
    h1 { margin: 0; color: #005E81; flex: 1; font-size: 22px; }
`;

const SaveBtn = styled.button`
    padding: 10px 20px;
    background: #005E81;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    &:disabled { opacity: 0.5; cursor: wait; }
`;

const Section = styled.section`
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;

    h2 { margin: 0 0 16px 0; color: #005E81; font-size: 18px; }
`;

const Note = styled.p`
    color: #666;
    font-size: 13px;
    margin: 0 0 16px 0;
    font-style: italic;
`;

const Row = styled.div`
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    flex-wrap: wrap;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: ${(p) => p.$flex || 'none'};
    min-width: 240px;
    margin-bottom: 12px;

    label { font-size: 12px; color: #666; font-weight: 600; }
    input, textarea {
        font-family: inherit;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 14px;
        resize: vertical;
    }
`;

const CardEdit = styled.div`
    display: flex;
    gap: 24px;
    padding: 16px;
    background: #f9f9f7;
    border-radius: 8px;
    margin-bottom: 12px;
`;

const PictoRow = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 12px;
    padding: 8px 0;
`;

const AddItemBtn = styled.button`
    margin-top: 12px;
    padding: 8px 16px;
    border: 2px dashed #005E81;
    background: #fff;
    color: #005E81;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;

    &:hover { background: #f0f8fb; }
`;

const RemoveItemBtn = styled.button`
    align-self: flex-start;
    margin-top: 8px;
    padding: 4px 10px;
    border: 1px solid #c0392b;
    background: #fff;
    color: #c0392b;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
    font-weight: 600;
    white-space: nowrap;

    &:hover { background: #c0392b; color: #fff; }
`;

const ImgWrap = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 220px;
    gap: 8px;
`;

const ImgLabel = styled.div`
    font-size: 12px;
    color: #666;
    font-weight: 600;
`;

const DropZone = styled.div`
    width: 100%;
    aspect-ratio: 1;
    background-color: #f5f5f0;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    border: 2px dashed ${(p) => p.$drag ? '#005E81' : 'transparent'};
    border-radius: 8px;
    position: relative;
    transition: border-color 0.15s;
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    background: rgba(0,94,129,0.7);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 13px;
`;

const NoImg = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 13px;
`;

const Btns = styled.div`
    display: flex;
    gap: 4px;
    align-items: stretch;

    button, label > span {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
        height: 30px;
        font-size: 12px;
        line-height: 1;
        border: 1px solid #005E81;
        border-radius: 6px;
        background: #fff;
        color: #005E81;
        cursor: pointer;
        font-weight: 600;
        white-space: nowrap;
        box-sizing: border-box;
    }
    button:disabled { opacity: 0.5; cursor: wait; }
    label { display: inline-flex; flex: 0 0 auto; }

    /* Botões com texto ficam flex 1, botões só com ícone ficam compactos */
    > button:first-child { flex: 1; }
    > label { flex: 1; }
    > label > span { width: 100%; }
`;

const PromptBox = styled.textarea`
    font-family: inherit;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 12px;
    resize: vertical;
`;

const Options = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
    background: #f9f9f7;
    border-radius: 6px;
`;

const RefRow = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`;

const RefPick = styled.span`
    display: inline-block;
    padding: 6px 10px;
    border: 1px dashed #005E81;
    border-radius: 6px;
    font-size: 11px;
    color: #005E81;
    cursor: pointer;
    background: #fff;
`;

const RefPreview = styled.div`
    width: 56px;
    height: 56px;
    background-size: cover;
    background-position: center;
    border-radius: 6px;
    border: 2px solid #005E81;
    cursor: pointer;
    position: relative;
`;

const RefRemove = styled.span`
    position: absolute;
    top: -8px;
    right: -8px;
    background: #c0392b;
    color: #fff;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
`;

const RefSlider = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 11px;
    color: #666;

    input { width: 100%; }
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
    max-width: 720px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ModalHeader = styled.div`
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
    padding: 0 8px;

    &:hover { color: #333; }
`;

const ModalSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    small { color: #999; font-size: 11px; }
`;

const SectionTitle = styled.div`
    font-size: 13px;
    font-weight: 700;
    color: #333;
`;

const RefList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
`;

const RefThumb = styled.div`
    width: 80px;
    height: 80px;
    background-size: cover;
    background-position: center;
    border-radius: 8px;
    border: 2px solid #ccc;
    position: relative;
`;

const RefBadge = styled.div`
    position: absolute;
    bottom: 4px;
    left: 4px;
    background: #005E81;
    color: #fff;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
`;

const RefAdd = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border: 2px dashed #005E81;
    border-radius: 8px;
    color: #005E81;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;

    &:hover { background: #f0f8fb; }
`;

const ModalActions = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    border-top: 1px solid #eee;
    padding-top: 16px;
`;

const CancelBtn = styled.button`
    padding: 10px 18px;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
`;

const ConfirmBtn = styled.button`
    padding: 10px 18px;
    border: none;
    background: #005E81;
    color: #fff;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 14px;

    &:disabled { opacity: 0.5; cursor: wait; }
`;

const VersionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
`;

const Version = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.15s;

    &:hover { border-color: #005E81; }
`;

const VersionThumb = styled.div`
    width: 100%;
    aspect-ratio: 1;
    background-color: #f5f5f0;
    background-size: cover;
    background-position: center;
    border-radius: 6px;
`;

const VersionDate = styled.div`
    font-size: 11px;
    color: #666;
    flex: 1;
`;

const VersionFooter = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const DeleteBtn = styled.button`
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #c0392b;
    background: #fff;
    color: #c0392b;
    border-radius: 50%;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    padding: 0;

    &:hover { background: #c0392b; color: #fff; }
    &:disabled { opacity: 0.5; cursor: wait; }
`;

const ExplainBox = styled.div`
    background: #f0f8fb;
    border-left: 3px solid #005E81;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 12px;
    color: #333;
    line-height: 1.5;

    strong {
        display: block;
        color: #005E81;
        margin-bottom: 6px;
        font-size: 13px;
    }
    ul { margin: 0; padding-left: 18px; }
    li { margin-bottom: 4px; }
    b { color: #005E81; }
`;

const Path = styled.div`
    font-size: 10px;
    color: #999;
    word-break: break-all;
`;
