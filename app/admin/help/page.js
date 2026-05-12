'use client';
import { useMemo, useState } from 'react';
import styled from 'styled-components';
import AdminHeader from '@/components/admin/adminHeader';

const SECTIONS = [
    {
        group: 'Visão geral',
        items: [
            {
                id: 'organizacao',
                title: 'Como está organizado o admin',
                what: 'O admin é a tua consola para gerir tudo o que aparece no quiosque, no site público e no catálogo PDF. O topo tem o menu agrupado por área (Ver, Catálogo PDF, Conteúdo, Sistema).',
                how: [
                    'Carrega no nome do grupo para perceberes o que cada link faz.',
                    'O botão "?" no canto superior direito traz-te sempre de volta a esta página de ajuda.',
                    'Em "Ver" tens atalhos para abrir o quiosque (com lockdown) ou o site público em separadores novos.',
                ],
                tip: 'Em qualquer momento, "Refrescar quiosques" obriga os quiosques abertos a recarregar nos 30 segundos seguintes — útil depois de mudanças grandes.',
            },
            {
                id: 'quiosque-vs-site',
                title: 'Quiosque vs site online',
                what: 'A mesma base de dados serve dois modos. Quiosque é a versão para o ecrã táctil (lockdown, sem cursor, idle redirect), site online é a versão pública responsive.',
                how: [
                    'Quiosque: abre com "?kiosk=1" ou no menu "Ver → Quiosque". Fica fixo: sem voltar atrás do browser, sem rato, redireciona à inactividade.',
                    'Site: abre em "/site" ou "Ver → Site online". Layout adaptado a desktop/mobile.',
                    'Os conteúdos (produtos, banners, filtros) são partilhados — qualquer alteração no admin aparece em ambos.',
                ],
            },
        ],
    },
    {
        group: 'Produtos',
        items: [
            {
                id: 'lista',
                title: 'Lista, procura e filtros',
                what: 'O Admin → Produtos mostra a grelha de todos os produtos (visíveis e escondidos). Em cima tens uma caixa de procura por id/título/parceiro e um filtro por picto.',
                how: [
                    'Escreve na caixa para filtrar por id, título ou parceiro.',
                    'Carrega numa pílula de picto (Vegan, Bio, etc.) para mostrar só produtos com esse picto. Clica de novo para limpar.',
                    'O contador à direita mostra "visíveis / total".',
                    '"👁 Mostra escondidos" alterna a visibilidade dos produtos escondidos na grelha.',
                ],
                tip: 'Quando tens um filtro de picto activo, aparece um botão "+ Selecionar X produtos para PDF" — selecciona de uma vez todos os produtos do filtro.',
            },
            {
                id: 'criar',
                title: 'Criar produto',
                what: 'Cria um produto novo com o próximo id livre e abre logo a página de edição.',
                how: [
                    'Carrega no card "+" no fim da grelha de produtos.',
                    'Preenche título e parceiro (parceiro pode ficar vazio).',
                    'Confirma — vais ser redirecionado para a página de edição completa.',
                    'Lá preenches subtítulo, descrição, pictos, cards, e geras as imagens.',
                ],
            },
            {
                id: 'esconder',
                title: 'Esconder ou mostrar produto',
                what: 'Um produto escondido não aparece no quiosque nem no site, mas continua editável no admin. Útil para preparar produtos com antecedência.',
                how: [
                    'No card do produto, carrega no botão verde "Visível" ou vermelho "Escondido" no canto superior direito.',
                    'A mudança é gravada imediatamente.',
                    'Produtos escondidos aparecem com transparência na grelha.',
                ],
            },
            {
                id: 'textos',
                title: 'Editar texto e dados básicos',
                what: 'Na página do produto tens secções para Título, Subtítulo, Descrição, PPS (preço), Parceiro e Frase destaque.',
                how: [
                    'Carrega num card de produto para abrir a edição.',
                    'Escreve nos campos de texto — podes usar quebras de linha (Enter) onde fizer sentido (ex: título a duas linhas).',
                    'Carrega "Guardar alterações" no topo para persistir.',
                ],
                tip: 'A "Frase destaque (slider)" é só usada no slider principal — fica vazia se não quiseres mostrar texto à imagem.',
            },
            {
                id: 'imagens-principais',
                title: 'Imagens principais (img_main, img_bg, bottom_img)',
                what: 'Cada produto tem três imagens: img_main (PNG transparente do produto), img_bg (banner de fundo) e bottom_img (imagem circular no fim do detalhe). Geras com AI, fazes upload, ou restauras de versões anteriores.',
                how: [
                    '"✨ Gerar" abre um modal com prompt automático + extras + imagens de referência. Carrega "Gerar agora" para criar.',
                    '"↻" regera com o mesmo prompt automático (variação rápida).',
                    '"⬆ Upload" faz upload de um ficheiro local (jpg/png/webp/svg). É optimizado para WebP 1080px automaticamente.',
                    '"⟲" abre o histórico — clica numa versão para restaurar; "×" para apagar definitivamente.',
                    'Podes arrastar uma imagem para a zona de pré-visualização para fazer upload directo.',
                ],
                tip: 'Para refinar uma imagem em vez de gerar do zero: "✨ Gerar" → "⟳ Usar actual" no painel de referências — a imagem actual é usada como base e ajustas o prompt.',
            },
            {
                id: 'posicionar',
                title: 'Posicionar a imagem do produto',
                what: 'A img_main pode ser escalada e deslocada para encaixar perfeitamente nos diferentes layouts. Há controlos separados para a listagem (cards pequenos) e para o detalhe (banner grande).',
                how: [
                    'Arrasta a imagem dentro da pré-visualização circular para a centrar.',
                    'Usa os sliders "Escala (listagem)" e "Escala (detalhe)" para o tamanho em cada contexto.',
                    'Os "Deslocar X/Y (detalhe)" só afectam a página de detalhe; os "Deslocar X/Y" sem sufixo afectam ambos.',
                    'Carrega "Guardar alterações" no topo.',
                ],
            },
            {
                id: 'cards',
                title: 'Cards de informação',
                what: 'Cada produto pode ter 0 a 3 cards de info — imagem + texto curto — que aparecem no detalhe abaixo dos pictos.',
                how: [
                    '"+ Adicionar card" cria um card novo com id sequencial.',
                    'Cada card tem o mesmo painel de imagem que as principais (gerar/upload/histórico).',
                    'O "Texto do card" é a descrição curta que aparece por baixo da imagem.',
                    '"Prompt custom" é opcional — só usado em vez do automático quando carregas em "✨ Gerar".',
                    '"Remover card" apaga-o (com confirmação).',
                ],
            },
            {
                id: 'pictos',
                title: 'Pictos do produto',
                what: 'Etiquetas com ícone (Vegan, Sem glúten, Bio, etc.) que aparecem no card do produto e na página de detalhe. O ícone é mapeado automaticamente a partir do texto.',
                how: [
                    '"+ Adicionar picto" cria um picto novo.',
                    'Escreve o texto (ex: "Vegan", "Sem glúten") — o ícone correspondente aparece automaticamente se houver mapeamento.',
                    'Para ver e editar o mapeamento texto → ícone, vai a "Conteúdo → Ícones".',
                    'Limite visual: 4 pictos por linha no detalhe. Mais que 4 vão para uma linha extra centrada.',
                ],
            },
            {
                id: 'videos',
                title: 'Vídeos do produto (novo)',
                what: 'Cada produto pode ter um ou mais vídeos que aparecem no fim da página de detalhe no quiosque, a tocar em sequência.',
                how: [
                    '"+ Adicionar vídeo" abre o selector de ficheiros (mp4, webm, mov).',
                    'Cada vídeo aparece com pré-visualização própria, nome, tamanho e data.',
                    '"↑" / "↓" reordenam — carrega "Guardar alterações" no topo para persistir a ordem.',
                    '"Remover" apaga o ficheiro definitivamente (com confirmação).',
                    'No quiosque, o utilizador vê um play grande, carrega para começar, e os vídeos passam em sequência.',
                ],
                tip: 'Para um quiosque rápido e barato: 720p H.264, até 30 segundos, máximo ~15 MB. Limite duro: 50 MB por vídeo.',
            },
        ],
    },
    {
        group: 'Catálogo PDF',
        items: [
            {
                id: 'catalogo-capa',
                title: 'Configurar capa, índice e rodapé',
                what: 'Define a aparência do PDF gerado a partir dos produtos seleccionados: título, subtítulo, data, imagem de fundo da capa, página em branco opcional, título do índice, rodapé das páginas de produto.',
                how: [
                    'Menu "Catálogo PDF → Configurar capa / índice".',
                    'Preenche os campos. A pré-visualização da capa à direita actualiza em tempo real.',
                    '"Imagem de fundo da capa" — clica para escolher ficheiro; "Substituir" ou "Remover" para mudar.',
                    'Carrega "Guardar alterações" — fica disponível para todos os PDFs futuros.',
                ],
            },
            {
                id: 'catalogo-escolher',
                title: 'Escolher produtos para o PDF',
                what: 'Selecciona quais os produtos vão entrar no próximo PDF, e por que ordem.',
                how: [
                    'No Admin → Produtos, carrega no "+" no canto superior esquerdo de cada card.',
                    'O card fica destacado com um "✓ N" (N = posição actual).',
                    'Em baixo aparece uma barra com o total seleccionado e botões: "Selecionar todos visíveis", "Reordenar", "Limpar".',
                    '"Reordenar" abre um modal onde arrastas os produtos para a ordem certa.',
                    'A selecção fica guardada no browser — podes sair e voltar.',
                ],
                tip: 'Quando tens um filtro de picto activo aparece "+ Selecionar X produtos para PDF" — adiciona todos os do filtro de uma só vez à selecção.',
            },
            {
                id: 'catalogo-criar',
                title: 'Criar o PDF',
                what: 'Gera o PDF a partir da configuração + selecção. Pode demorar 10-60 segundos consoante o número de produtos e imagens.',
                how: [
                    'Com pelo menos 1 produto seleccionado, carrega no botão azul "↓ Criar PDF" na barra inferior.',
                    'O botão fica em "A criar PDF…" enquanto o servidor renderiza.',
                    'Quando termina, o ficheiro é descarregado automaticamente.',
                    'Ao mesmo tempo o PDF é arquivado no histórico (ver abaixo).',
                ],
            },
            {
                id: 'catalogo-historico',
                title: 'Histórico de PDFs (novo)',
                what: 'Todos os PDFs criados ficam guardados. Podes voltar a descarregar ou abrir online sem ter de regenerar (o que poupa tempo de Puppeteer).',
                how: [
                    'Menu "Catálogo PDF → Histórico de PDFs".',
                    'A lista mostra data, nome do ficheiro, nº de produtos e IDs.',
                    '"↗ Ver" abre no separador (preview do browser).',
                    '"↓ Descarregar" força o download.',
                    '"✕" apaga a entrada e o ficheiro do storage (definitivo).',
                ],
            },
        ],
    },
    {
        group: 'Conteúdo',
        items: [
            {
                id: 'banners',
                title: 'Banners da homepage',
                what: 'Banners rotativos que aparecem na homepage do quiosque e do site. Cada banner tem imagem, título, subtítulo e link.',
                how: [
                    'Menu "Conteúdo → Banners".',
                    'Cria, edita, reordena e apaga banners.',
                    'A imagem pode ser gerada com AI ou feita upload directo.',
                    'O link aponta para um produto ou página interna.',
                ],
            },
            {
                id: 'filtros',
                title: 'Filtros / categorias',
                what: 'As categorias da página /produtos do site público. Não afectam o quiosque (que mostra tudo).',
                how: [
                    'Menu "Conteúdo → Filtros".',
                    'Cria filtros com nome e ícone.',
                    'Associa produtos ao filtro pelo campo "filter" do produto.',
                    'A ordem dos filtros aqui é a ordem em que aparecem na barra do site.',
                ],
            },
            {
                id: 'icons',
                title: 'Ícones dos pictos',
                what: 'O mapeamento entre o texto do picto (ex: "Vegan", "Sem glúten") e o SVG que aparece no quiosque/site.',
                how: [
                    'Menu "Conteúdo → Ícones".',
                    'Cada linha é uma palavra-chave + SVG. Quando um produto tem um picto com essa palavra (ou variação), o SVG é mostrado.',
                    'Faz upload de um SVG novo (a cor é forçada a branco no quiosque).',
                    'Ao editar o texto-chave, todos os produtos com esse texto passam a usar o novo ícone automaticamente.',
                ],
            },
        ],
    },
    {
        group: 'Sistema',
        items: [
            {
                id: 'analytics',
                title: 'Analytics',
                what: 'Métricas de uso do quiosque — quantas vistas por produto, filtros mais usados, eventos no tempo.',
                how: [
                    'Menu "Sistema → Analytics".',
                    'Tens gráficos por período (hoje, semana, mês).',
                    'Os dados são recolhidos sem identificação pessoal — só contagem de eventos.',
                ],
            },
            {
                id: 'backup',
                title: 'Backup .zip',
                what: 'Exporta toda a configuração e imagens num único ficheiro .zip — usa para guardar uma cópia de segurança antes de mudanças grandes.',
                how: [
                    'Menu "Sistema → Backup" (link directo).',
                    'O browser descarrega um .zip com produtos, banners, filtros, configs e imagens.',
                    'Guarda numa pasta segura — não há ainda restauro automático, é referência manual.',
                ],
                tip: 'Faz backup antes de fazeres mudanças grandes ou apagares conteúdo, para teres como voltar atrás se necessário.',
            },
            {
                id: 'refrescar',
                title: 'Refrescar quiosques',
                what: 'Força todos os quiosques abertos a recarregarem a página dentro dos próximos 30 segundos.',
                how: [
                    'Menu "Sistema → Refrescar quiosques".',
                    'Confirma o alerta.',
                    'Os quiosques têm um poller a verificar uma versão — quando muda, recarregam.',
                ],
                tip: 'Usa depois de mudanças visuais grandes (banners, filtros, capas). Para alterações de texto/imagem pontuais não é necessário — o quiosque actualiza nas próximas visitas a produtos.',
            },
        ],
    },
];

const ALL_ITEMS = SECTIONS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));

export default function AdminHelp() {
    const [activeId, setActiveId] = useState(SECTIONS[0].items[0].id);
    const [query, setQuery] = useState('');

    const filteredSections = useMemo(() => {
        if (!query.trim()) return SECTIONS;
        const q = query.toLowerCase();
        return SECTIONS.map((g) => ({
            ...g,
            items: g.items.filter((it) =>
                it.title.toLowerCase().includes(q) ||
                it.what.toLowerCase().includes(q) ||
                it.how.some((s) => s.toLowerCase().includes(q)),
            ),
        })).filter((g) => g.items.length > 0);
    }, [query]);

    const active = ALL_ITEMS.find((i) => i.id === activeId) || ALL_ITEMS[0];

    return (
        <Wrap>
            <AdminHeader current="help" />
            <PageTitle>Ajuda</PageTitle>
            <Intro>
                Esta página explica todas as áreas do admin. Procura à esquerda, lê a explicação e o passo a passo à direita.
            </Intro>

            <SplitLayout>
                <Sidebar>
                    <Search
                        type="text"
                        placeholder="Procurar… (ex: vídeo, banner, pictos)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {filteredSections.length === 0 && (
                        <NoMatch>Sem resultados para "{query}"</NoMatch>
                    )}
                    {filteredSections.map((g) => (
                        <GroupBlock key={g.group}>
                            <GroupLabel>{g.group}</GroupLabel>
                            {g.items.map((it) => (
                                <SidebarItem
                                    key={it.id}
                                    $active={activeId === it.id}
                                    onClick={() => setActiveId(it.id)}
                                >
                                    {it.title}
                                </SidebarItem>
                            ))}
                        </GroupBlock>
                    ))}
                </Sidebar>

                <Content>
                    <Crumb>{active.group}</Crumb>
                    <ContentTitle>{active.title}</ContentTitle>

                    <Block>
                        <BlockHeader>O que é</BlockHeader>
                        <Para>{active.what}</Para>
                    </Block>

                    <Block>
                        <BlockHeader>Como se faz</BlockHeader>
                        <Steps>
                            {active.how.map((s, i) => (
                                <Step key={i}>
                                    <StepNum>{i + 1}</StepNum>
                                    <StepText>{s}</StepText>
                                </Step>
                            ))}
                        </Steps>
                    </Block>

                    {active.tip && (
                        <TipBlock>
                            <TipLabel>💡 Dica</TipLabel>
                            <Para>{active.tip}</Para>
                        </TipBlock>
                    )}
                </Content>
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

const SplitLayout = styled.div`
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 32px;
    align-items: start;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const Sidebar = styled.aside`
    position: sticky;
    top: 24px;
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-right: 4px;

    @media (max-width: 900px) {
        position: static;
        max-height: none;
    }
`;

const Search = styled.input`
    font-family: inherit;
    padding: 10px 14px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;

    &:focus { outline: none; border-color: #005E81; box-shadow: 0 0 0 3px rgba(0,94,129,0.12); }
`;

const NoMatch = styled.div`
    color: #888;
    font-size: 13px;
    padding: 8px 4px;
`;

const GroupBlock = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const GroupLabel = styled.div`
    text-transform: uppercase;
    letter-spacing: 1.4px;
    font-size: 11px;
    font-weight: 700;
    color: #9bafb8;
    margin: 8px 6px 4px 6px;
`;

const SidebarItem = styled.button`
    text-align: left;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: ${(p) => (p.$active ? '#005E81' : 'transparent')};
    color: ${(p) => (p.$active ? '#fff' : '#005E81')};
    font-family: inherit;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    line-height: 1.3;
    transition: background 0.15s, color 0.15s;

    &:hover { background: ${(p) => (p.$active ? '#005E81' : '#f0f8fb')}; }
`;

const Content = styled.section`
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 28px 32px;
    min-width: 0;
`;

const Crumb = styled.div`
    text-transform: uppercase;
    letter-spacing: 1.4px;
    font-size: 11px;
    font-weight: 700;
    color: #9bafb8;
    margin-bottom: 6px;
`;

const ContentTitle = styled.h2`
    margin: 0 0 20px 0;
    color: #005E81;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
`;

const Block = styled.div`
    margin-bottom: 20px;
`;

const BlockHeader = styled.h3`
    margin: 0 0 8px 0;
    color: #005E81;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
`;

const Para = styled.p`
    margin: 0;
    color: #333;
    font-size: 15px;
    line-height: 1.55;
`;

const Steps = styled.ol`
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Step = styled.li`
    display: flex;
    gap: 12px;
    align-items: flex-start;
`;

const StepNum = styled.span`
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #005E81;
    color: #fff;
    font-weight: 700;
    font-size: 13px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;

const StepText = styled.span`
    color: #333;
    font-size: 15px;
    line-height: 1.5;
    padding-top: 2px;
`;

const TipBlock = styled.div`
    background: #fff8e6;
    border-left: 4px solid #FFB40F;
    padding: 14px 18px;
    border-radius: 8px;
    margin-top: 8px;
`;

const TipLabel = styled.div`
    color: #a16b00;
    font-weight: 700;
    font-size: 13px;
    margin-bottom: 4px;
`;
