'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styled from 'styled-components';
import InstallButton from '@/components/global/installButton';

export default function AdminIndex() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState('');
    const [showHelp, setShowHelp] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newPartner, setNewPartner] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        fetch('/api/admin/products').then((r) => r.json()).then(setProducts);
    }, []);

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
            <Header>
                <h1>Admin — Produtos</h1>
                <Spacer />
                <Link href="/" target="_blank"><MiniLink>Ver site ↗</MiniLink></Link>
                <Link href="/admin/home"><MiniLink>Banners</MiniLink></Link>
                <Link href="/admin/filtros"><MiniLink>Filtros</MiniLink></Link>
                <Link href="/admin/icons"><MiniLink>Ícones</MiniLink></Link>
                <a href="/api/admin/download-all"><MiniDownload>↓ .zip</MiniDownload></a>
                <MiniLink onClick={async () => {
                    const r = await fetch('/api/admin/bump-version', { method: 'POST' });
                    if (r.ok) alert('Quiosques vão recarregar nos próximos 30s');
                }}>↻ Refrescar quiosques</MiniLink>
                <InstallButton label="Instalar" />
                <HelpBtn onClick={() => setShowHelp(true)} title="Ajuda">?</HelpBtn>
            </Header>
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
                {visible.map((p) => (
                    <Card key={p.id} href={`/admin/produtos/${p.id}`} $hidden={p.hidden}>
                        <VisToggle
                            onClick={(e) => toggleHidden(e, p)}
                            $on={!p.hidden}
                            title={p.hidden ? 'Escondido — clica para publicar' : 'Visível — clica para esconder'}
                        >
                            {p.hidden ? 'Escondido' : 'Visível'}
                        </VisToggle>
                        <Thumb style={{ backgroundImage: `url(${p.imgProd}?t=${Date.now()})` }} />
                        <Info>
                            <Pid>#{p.id}</Pid>
                            <Title>{(p.title || '').replace(/\n/g, ' ')}</Title>
                            <Partner>{p.partner}</Partner>
                            <Stats>
                                {p.pictos?.length || 0} pictos · {p.infoCards?.length || 0} cards
                            </Stats>
                        </Info>
                    </Card>
                ))}
                <NewCard onClick={() => setCreating(true)}>
                    <Plus>+</Plus>
                    <NewLabel>Novo produto</NewLabel>
                </NewCard>
            </Grid>

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

            {showHelp && (
                <ModalBackdrop onClick={() => setShowHelp(false)}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <HeaderRow>
                            <h3>Como usar este admin</h3>
                            <CloseBtn onClick={() => setShowHelp(false)}>×</CloseBtn>
                        </HeaderRow>
                        <Help>
                            <h4>Lista de produtos</h4>
                            <ul>
                                <li><b>Filtro</b>: filtra por id, título ou parceiro.</li>
                                <li><b>Clicar num cartão</b>: abre a página de edição completa.</li>
                                <li><b>Cartão "+"</b>: cria um produto novo com todos os campos vazios prontos a preencher.</li>
                            </ul>
                            <h4>Página de edição</h4>
                            <ul>
                                <li><b>Texto</b>: editas título, subtítulo, descrição, PPS, parceiro, frase destaque. Carrega <i>Guardar alterações</i> no fim.</li>
                                <li><b>Imagens principais</b> (img_main, img_bg, bottom_img):
                                    <ul>
                                        <li><b>Gerar</b> — abre popup com o prompt automático (editável) + área para arrastar imagens de referência. Apenas a 1ª referência é usada (limite Flux Dev).</li>
                                        <li><b>Upload</b> — escolhes ficheiro local (substitui a imagem actual).</li>
                                        <li><b>Drag & Drop</b> — arrasta uma imagem para cima da preview.</li>
                                    </ul>
                                </li>
                                <li><b>Cards (slider)</b>: o mesmo, mais o texto editável.</li>
                                <li><b>Pictos</b>: só texto editável — o ícone SVG é mapeado automaticamente conforme as palavras-chave do texto.</li>
                            </ul>
                            <h4>Gerar com referência</h4>
                            <ul>
                                <li>No popup, adicionas 1+ imagens com <b>+ Adicionar</b>. Só a primeira é usada como base.</li>
                                <li><b>⟳ Usar actual</b>: usa a imagem actualmente publicada como referência — útil para refinar.</li>
                                <li><b>Fidelidade</b>: 0.30 = ignora bastante a referência / 0.95 = quase cópia. Recomendo 0.6–0.8.</li>
                            </ul>
                            <h4>Versões e iteração</h4>
                            <ul>
                                <li>Cada vez que geras ou fazes upload, a imagem anterior fica guardada automaticamente.</li>
                                <li>O botão <b>⟲</b> em cada imagem mostra o histórico — clica numa versão antiga para a restaurar.</li>
                                <li>Workflow recomendado para iterar: Geras imagem <b>A</b> → não gostas → no novo "Gerar" clicas <b>⟳ Usar actual</b> e ajustas o prompt → a nova <b>B</b> é uma variação refinada de A.</li>
                                <li>Se a B for pior, abre o histórico (⟲) e restaura a A.</li>
                            </ul>
                        </Help>
                    </ModalCard>
                </ModalBackdrop>
            )}
        </Wrap>
    );
}

const Wrap = styled.div`
    width: 100%;
    max-width: 1400px;
    padding: 32px;
    box-sizing: border-box;
    font-family: var(--font-dm-sans), system-ui, sans-serif;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;

    h1 { margin: 0; color: #005E81; flex: 0 0 auto; font-size: 22px; }
`;

const Spacer = styled.div`
    flex: 1;
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

const HelpBtn = styled.button`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1.5px solid #005E81;
    background: #fff;
    color: #005E81;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;

    &:hover { background: #005E81; color: #fff; }
`;

const MiniLink = styled.span`
    display: inline-block;
    padding: 6px 10px;
    border: 1.5px solid #005E81;
    background: #fff;
    color: #005E81;
    border-radius: 6px;
    font-weight: 600;
    font-size: 11px;
    cursor: pointer;

    &:hover { background: #005E81; color: #fff; }
`;

const MiniDownload = styled.span`
    display: inline-block;
    padding: 6px 10px;
    border: 1.5px solid #FFB40F;
    background: #fff;
    color: #b88200;
    border-radius: 6px;
    font-weight: 600;
    font-size: 11px;
    cursor: pointer;

    &:hover { background: #FFB40F; color: #fff; }
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
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative;
    opacity: ${(p) => (p.$hidden ? 0.45 : 1)};

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.08);
    }
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

const Help = styled.div`
    font-size: 14px;
    line-height: 1.6;
    color: #333;

    h4 { color: #005E81; margin: 16px 0 8px 0; }
    ul { margin: 0; padding-left: 20px; }
    li { margin-bottom: 6px; }
    a { color: #005E81; }
`;
