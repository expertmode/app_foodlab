'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import AdminHeader from '@/components/admin/adminHeader';

const SELECTION_KEY = 'catalog_selection';

export default function AdminIndex() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('');
    const [creating, setCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newPartner, setNewPartner] = useState('');
    const [busy, setBusy] = useState(false);
    const [selection, setSelection] = useState([]);
    const [reordering, setReordering] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetch('/api/admin/products').then((r) => r.json()).then(setProducts);
        try {
            const raw = localStorage.getItem(SELECTION_KEY);
            if (raw) setSelection(JSON.parse(raw));
        } catch {}
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(SELECTION_KEY, JSON.stringify(selection));
        } catch {}
    }, [selection]);

    const selectedSet = useMemo(() => new Set(selection), [selection]);

    const toggleSelected = (e, p) => {
        e.preventDefault();
        e.stopPropagation();
        setSelection((arr) => (arr.includes(p.id) ? arr.filter((x) => x !== p.id) : [...arr, p.id]));
    };

    const selectAllVisible = () => {
        setSelection((arr) => {
            const set = new Set(arr);
            const next = [...arr];
            for (const p of visible) {
                if (!set.has(p.id)) next.push(p.id);
            }
            return next;
        });
    };

    const clearSelection = () => setSelection([]);

    const exportPdf = async () => {
        if (!selection.length) return;
        setExporting(true);
        try {
            const ids = selection.join(',');
            const r = await fetch(`/api/admin/catalog/export?ids=${ids}`, { method: 'POST' });
            if (!r.ok) {
                const data = await r.json().catch(() => ({}));
                throw new Error(data.error || `HTTP ${r.status}`);
            }
            const blob = await r.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `catalogo-foodlab-${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('Erro ao exportar PDF: ' + e.message);
        } finally {
            setExporting(false);
        }
    };

    const visible = products.filter((p) => {
        if (!filter) return true;
        const q = filter.toLowerCase();
        return (
            String(p.id).includes(q) ||
            (p.title || '').toLowerCase().includes(q) ||
            (p.partner || '').toLowerCase().includes(q)
        );
    });

    const toggleHidden = async (e, p) => {
        e.preventDefault();
        e.stopPropagation();
        const newHidden = !p.hidden;
        // optimistic update
        setProducts((arr) => arr.map((x) => x.id === p.id ? { ...x, hidden: newHidden } : x));
        try {
            await fetch(`/api/admin/products/${p.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hidden: newHidden }),
            });
        } catch (err) {
            // revert on failure
            setProducts((arr) => arr.map((x) => x.id === p.id ? { ...x, hidden: p.hidden } : x));
            alert('Erro: ' + err.message);
        }
    };

    const handleCreate = async () => {
        if (!newTitle.trim()) return;
        setBusy(true);
        try {
            const r = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle, partner: newPartner }),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'erro');
            router.push(`/admin/produtos/${data.id}`);
        } catch (e) {
            alert('Erro ao criar: ' + e.message);
            setBusy(false);
        }
    };

    return (
        <Wrap>
            <AdminHeader current="produtos" />
            <PageTitle>Produtos</PageTitle>
            <FilterRow>
                <input
                    type="text"
                    placeholder="Filtrar por id, título, parceiro…"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <Count>{visible.length} / {products.length}</Count>
            </FilterRow>

            <Grid>
                {visible.map((p) => {
                    const isSelected = selectedSet.has(p.id);
                    const orderIdx = isSelected ? selection.indexOf(p.id) + 1 : 0;
                    return (
                        <Card key={p.id} href={`/admin/produtos/${p.id}`} $hidden={p.hidden} $selected={isSelected}>
                            <SelToggle
                                onClick={(e) => toggleSelected(e, p)}
                                $on={isSelected}
                                title={isSelected ? `Selecionado (#${orderIdx}) — clica para remover` : 'Adicionar ao PDF'}
                            >
                                {isSelected ? `✓ ${orderIdx}` : '+'}
                            </SelToggle>
                            <VisToggle
                                onClick={(e) => toggleHidden(e, p)}
                                $on={!p.hidden}
                                title={p.hidden ? 'Escondido — clica para publicar' : 'Visível — clica para esconder'}
                            >
                                {p.hidden ? 'Escondido' : 'Visível'}
                            </VisToggle>
                            <Thumb style={{ backgroundImage: `url(${p.imgProd})` }} loading="lazy" />
                            <Info>
                                <Pid>#{p.id}</Pid>
                                <Title>{(p.title || '').replace(/\n/g, ' ')}</Title>
                                <Partner>{p.partner}</Partner>
                                <Stats>
                                    {p.pictos?.length || 0} pictos · {p.infoCards?.length || 0} cards
                                </Stats>
                            </Info>
                        </Card>
                    );
                })}
                <NewCard onClick={() => setCreating(true)}>
                    <Plus>+</Plus>
                    <NewLabel>Novo produto</NewLabel>
                </NewCard>
            </Grid>

            {selection.length > 0 && (
                <SelectionBar>
                    <SelCount>
                        <strong>{selection.length}</strong> selecionado{selection.length === 1 ? '' : 's'} para o PDF
                    </SelCount>
                    <SelSpacer />
                    <SelBtn onClick={selectAllVisible}>Selecionar todos visíveis</SelBtn>
                    <SelBtn onClick={() => setReordering(true)}>Reordenar</SelBtn>
                    <SelBtn $danger onClick={clearSelection}>Limpar</SelBtn>
                    <SelBtnPrimary disabled={exporting} onClick={exportPdf}>
                        {exporting ? 'A gerar PDF…' : '↓ Exportar PDF'}
                    </SelBtnPrimary>
                </SelectionBar>
            )}

            {reordering && (
                <ReorderModal
                    products={products}
                    order={selection}
                    onClose={() => setReordering(false)}
                    onSave={(next) => { setSelection(next); setReordering(false); }}
                />
            )}

            {creating && (
                <ModalBackdrop onClick={() => !busy && setCreating(false)}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <h3>Novo produto</h3>
                        <Field>
                            <label>Título</label>
                            <input
                                autoFocus
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Ex: Pesto com microalgas"
                            />
                        </Field>
                        <Field>
                            <label>Parceiro</label>
                            <input
                                value={newPartner}
                                onChange={(e) => setNewPartner(e.target.value)}
                                placeholder="Ex: MC, TAGUSVALLEY, …"
                            />
                        </Field>
                        <ModalNote>
                            Vai ser criado com o próximo id disponível e redirecionas para a página de edição
                            onde podes preencher subtítulo, descrição, pictos, cards e gerar imagens.
                        </ModalNote>
                        <ModalActions>
                            <CancelBtn disabled={busy} onClick={() => setCreating(false)}>Cancelar</CancelBtn>
                            <ConfirmBtn disabled={busy || !newTitle.trim()} onClick={handleCreate}>
                                {busy ? 'A criar…' : 'Criar'}
                            </ConfirmBtn>
                        </ModalActions>
                    </ModalCard>
                </ModalBackdrop>
            )}

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

const PageTitle = styled.h1`
    margin: 0 0 16px 0;
    color: #005E81;
    font-size: 24px;
    font-weight: 700;
`;

const FilterRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;

    input {
        flex: 1;
        padding: 10px 14px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
    }
`;

const Count = styled.span`
    color: #666;
    font-size: 14px;
    white-space: nowrap;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
`;

const Card = styled(Link)`
    display: flex;
    flex-direction: column;
    background: #fff;
    border: ${(p) => (p.$selected ? '2px solid #005E81' : '1px solid #e0e0e0')};
    border-radius: 12px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative;
    opacity: ${(p) => (p.$hidden ? 0.45 : 1)};
    box-shadow: ${(p) => (p.$selected ? '0 0 0 3px rgba(0, 94, 129, 0.15)' : 'none')};

    &:hover {
        transform: translateY(-2px);
        box-shadow: ${(p) => (p.$selected ? '0 0 0 3px rgba(0, 94, 129, 0.2), 0 8px 16px rgba(0,0,0,0.08)' : '0 8px 16px rgba(0,0,0,0.08)')};
    }
`;

const SelToggle = styled.button`
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 5;
    min-width: 28px;
    height: 28px;
    padding: 0 8px;
    font-size: 13px;
    font-weight: 700;
    border-radius: 14px;
    border: 1.5px solid #005E81;
    background: ${(p) => (p.$on ? '#005E81' : '#fff')};
    color: ${(p) => (p.$on ? '#fff' : '#005E81')};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;

    &:hover { background: ${(p) => (p.$on ? '#004a66' : '#f0f8fb')}; }
`;

const VisToggle = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 5;
    padding: 4px 8px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 6px;
    border: 1px solid ${(p) => (p.$on ? '#2a7' : '#c0392b')};
    background: ${(p) => (p.$on ? '#fff' : '#fff5f5')};
    color: ${(p) => (p.$on ? '#2a7' : '#c0392b')};
    cursor: pointer;

    &:hover { background: ${(p) => (p.$on ? '#e6f7ec' : '#ffeaea')}; }
`;

const Thumb = styled.div`
    width: 100%;
    aspect-ratio: 1;
    background-color: #f5f5f0;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
`;

const Info = styled.div`
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

const Pid = styled.div`
    color: #999;
    font-size: 11px;
`;

const Title = styled.div`
    color: #005E81;
    font-weight: 600;
    font-size: 14px;
    line-height: 1.3;
`;

const Partner = styled.div`
    color: #666;
    font-size: 12px;
`;

const Stats = styled.div`
    color: #999;
    font-size: 11px;
    margin-top: 4px;
`;

const NewCard = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    background: #fff;
    border: 2px dashed #005E81;
    border-radius: 12px;
    cursor: pointer;
    color: #005E81;
    transition: background 0.15s;

    &:hover { background: #f0f8fb; }
`;

const Plus = styled.div`
    font-size: 64px;
    line-height: 1;
    font-weight: 300;
`;

const NewLabel = styled.div`
    font-size: 14px;
    font-weight: 600;
    margin-top: 8px;
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
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    h3 { margin: 0; color: #005E81; }
`;

const HeaderRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
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

const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;

    label { font-size: 12px; color: #666; font-weight: 600; }
    input {
        font-family: inherit;
        padding: 10px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 14px;
    }
`;

const ModalNote = styled.p`
    font-size: 12px;
    color: #666;
    margin: 0;
    line-height: 1.5;
`;

const ModalActions = styled.div`
    display: flex;
    gap: 12px;
    justify-content: flex-end;
`;

const CancelBtn = styled.button`
    padding: 10px 18px;
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 8px;
    cursor: pointer;
`;

const ConfirmBtn = styled.button`
    padding: 10px 18px;
    border: none;
    background: #005E81;
    color: #fff;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;

    &:disabled { opacity: 0.5; cursor: wait; }
`;

// === Selection bar (sticky bottom, shown when 1+ produtos selected for PDF) ===
const SelectionBar = styled.div`
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border: 1px solid #005E81;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 900;
    max-width: 95vw;
    flex-wrap: wrap;
`;

const SelCount = styled.div`
    font-size: 14px;
    color: #005E81;

    strong { font-size: 18px; }
`;

const SelSpacer = styled.div`
    width: 12px;
`;

const SelBtn = styled.button`
    padding: 8px 12px;
    border-radius: 8px;
    border: 1.5px solid ${(p) => (p.$danger ? '#c0392b' : '#005E81')};
    background: #fff;
    color: ${(p) => (p.$danger ? '#c0392b' : '#005E81')};
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    &:hover { background: ${(p) => (p.$danger ? '#fff5f5' : '#f0f8fb')}; }
`;

const SelBtnPrimary = styled.button`
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    background: #005E81;
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;
    &:hover:not(:disabled) { background: #004a66; }
    &:disabled { opacity: 0.6; cursor: wait; }
`;

// === Reorder modal ===
function ReorderModal({ products, order, onClose, onSave }) {
    const [items, setItems] = useState(order);
    const [dragIdx, setDragIdx] = useState(null);

    const productMap = useMemo(() => {
        const m = new Map();
        for (const p of products) m.set(p.id, p);
        return m;
    }, [products]);

    const move = (from, to) => {
        if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return;
        const next = [...items];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        setItems(next);
    };

    const handleDragStart = (e, idx) => {
        setDragIdx(idx);
        e.dataTransfer.effectAllowed = 'move';
    };
    const handleDragOver = (e, idx) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === idx) return;
        move(dragIdx, idx);
        setDragIdx(idx);
    };
    const handleDragEnd = () => setDragIdx(null);

    const remove = (id) => setItems((arr) => arr.filter((x) => x !== id));

    return (
        <ModalBackdrop onClick={onClose}>
            <ReorderCard onClick={(e) => e.stopPropagation()}>
                <HeaderRow>
                    <h3>Reordenar produtos no PDF</h3>
                    <CloseBtn onClick={onClose}>×</CloseBtn>
                </HeaderRow>
                <ReorderNote>
                    Arrasta para reordenar. A 1ª página do PDF será o primeiro produto desta lista.
                </ReorderNote>
                <ReorderList>
                    {items.map((id, idx) => {
                        const p = productMap.get(id);
                        if (!p) return null;
                        return (
                            <ReorderRow
                                key={id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragOver={(e) => handleDragOver(e, idx)}
                                onDragEnd={handleDragEnd}
                                $dragging={dragIdx === idx}
                            >
                                <DragHandle>⋮⋮</DragHandle>
                                <RowIdx>{idx + 1}</RowIdx>
                                <RowThumb style={{ backgroundImage: `url(${p.imgProd})` }} />
                                <RowInfo>
                                    <RowTitle>{(p.title || '').replace(/\n/g, ' ')}</RowTitle>
                                    <RowSub>#{p.id} · {p.partner}</RowSub>
                                </RowInfo>
                                <RowActions>
                                    <ArrowBtn onClick={() => move(idx, idx - 1)} disabled={idx === 0} title="Subir">↑</ArrowBtn>
                                    <ArrowBtn onClick={() => move(idx, idx + 1)} disabled={idx === items.length - 1} title="Descer">↓</ArrowBtn>
                                    <ArrowBtn $danger onClick={() => remove(id)} title="Remover da seleção">×</ArrowBtn>
                                </RowActions>
                            </ReorderRow>
                        );
                    })}
                </ReorderList>
                <ModalActions>
                    <CancelBtn onClick={onClose}>Cancelar</CancelBtn>
                    <ConfirmBtn onClick={() => onSave(items)}>Aplicar ordem</ConfirmBtn>
                </ModalActions>
            </ReorderCard>
        </ModalBackdrop>
    );
}

const ReorderCard = styled.div`
    background: #fff;
    border-radius: 12px;
    width: 100%;
    max-width: 720px;
    max-height: 85vh;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    h3 { margin: 0; color: #005E81; font-size: 18px; }
`;

const ReorderNote = styled.p`
    margin: 0;
    font-size: 13px;
    color: #666;
`;

const ReorderList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const ReorderRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: ${(p) => (p.$dragging ? '#e8f3f7' : '#f8f9fa')};
    border: 1px solid ${(p) => (p.$dragging ? '#005E81' : '#e0e0e0')};
    border-radius: 8px;
    cursor: grab;
    user-select: none;

    &:active { cursor: grabbing; }
`;

const DragHandle = styled.span`
    color: #999;
    font-size: 16px;
    letter-spacing: -2px;
    font-weight: 700;
`;

const RowIdx = styled.div`
    min-width: 24px;
    text-align: center;
    color: #005E81;
    font-weight: 700;
    font-size: 14px;
`;

const RowThumb = styled.div`
    width: 40px;
    height: 40px;
    background-color: #f5f5f0;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 6px;
    flex-shrink: 0;
`;

const RowInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const RowTitle = styled.div`
    color: #333;
    font-weight: 600;
    font-size: 13px;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const RowSub = styled.div`
    color: #888;
    font-size: 11px;
    margin-top: 2px;
`;

const RowActions = styled.div`
    display: flex;
    gap: 4px;
`;

const ArrowBtn = styled.button`
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: 1px solid ${(p) => (p.$danger ? '#c0392b' : '#ccc')};
    background: #fff;
    color: ${(p) => (p.$danger ? '#c0392b' : '#444')};
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover:not(:disabled) { background: ${(p) => (p.$danger ? '#fff5f5' : '#f0f0f0')}; }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
`;
