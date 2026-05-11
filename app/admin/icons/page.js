'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import AdminHeader from '@/components/admin/adminHeader';

export default function IconsAdmin() {
    const [icons, setIcons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');

    const reload = async () => {
        const r = await fetch('/api/admin/icons');
        setIcons(await r.json());
        setLoading(false);
    };

    useEffect(() => { reload(); }, []);

    const upload = async (file) => {
        if (!file) return;
        if (!file.name.endsWith('.svg')) {
            alert('Só ficheiros .svg são suportados');
            return;
        }
        const finalName = (name || file.name.replace(/\.svg$/, ''))
            .toLowerCase()
            .replace(/[^a-z0-9-]+/g, '-')
            .replace(/^-|-$/g, '');
        if (!finalName) { alert('Nome inválido'); return; }
        const fd = new FormData();
        fd.append('file', file);
        fd.append('path', `images/pictos/${finalName}.svg`);
        const r = await fetch('/api/admin/upload', { method: 'POST', body: fd });
        if (!r.ok) {
            alert('Erro upload: ' + (await r.text()));
            return;
        }
        setName('');
        reload();
    };

    return (
        <Wrap>
            <AdminHeader current="icons" />
            <PageTitle>Ícones (pictos)</PageTitle>
            <Note>
                Os pictos são SVGs partilhados que aparecem nos pictos do detalhe de cada produto.
                Brancos sobre fundo azul. O texto do picto é mapeado a um destes SVGs por palavras-chave (ver <code>components/productDetail/pictoIcons.js</code>).
                Para adicionar um novo, sobe um SVG com o nome correspondente à palavra-chave (ex.: <code>vegan</code> → <code>vegan.svg</code>).
            </Note>

            <UploadBox>
                <input
                    type="text"
                    placeholder="Nome (sem extensão), ex: vegan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <label>
                    <input
                        type="file"
                        accept="image/svg+xml"
                        style={{ display: 'none' }}
                        onChange={(e) => upload(e.target.files?.[0])}
                    />
                    <UploadBtn>+ Subir SVG</UploadBtn>
                </label>
                <Tip>SVG branco em fundo transparente (viewBox 0 0 120 120 ideal)</Tip>
            </UploadBox>

            {loading && <p>A carregar…</p>}

            <Grid>
                {icons.map((ic) => (
                    <Card key={ic.name}>
                        <Circle>
                            <img src={ic.path} alt={ic.name} />
                        </Circle>
                        <Name>{ic.name}</Name>
                        <Path>{ic.path}</Path>
                    </Card>
                ))}
            </Grid>
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

const PageTitle = styled.h1`
    margin: 0 0 16px 0;
    color: #005E81;
    font-size: 24px;
    font-weight: 700;
`;

const Note = styled.p`
    color: #666;
    font-size: 13px;
    margin: 0 0 24px 0;
    line-height: 1.5;

    code {
        background: #f5f5f0;
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 12px;
    }
`;

const UploadBox = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: #f9f9f7;
    border-radius: 8px;
    margin-bottom: 24px;

    input[type="text"] {
        flex: 0 0 240px;
        padding: 8px 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-family: inherit;
        font-size: 14px;
    }
`;

const UploadBtn = styled.span`
    display: inline-block;
    padding: 8px 16px;
    background: #005E81;
    color: #fff;
    border-radius: 6px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;

    &:hover { background: #004a68; }
`;

const Tip = styled.span`
    color: #999;
    font-size: 12px;
    font-style: italic;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
`;

const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 16px;
`;

const Circle = styled.div`
    width: 100px;
    height: 100px;
    background-color: #005E81;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 60%;
        height: 60%;
    }
`;

const Name = styled.div`
    color: #005E81;
    font-weight: 600;
    font-size: 14px;
`;

const Path = styled.div`
    color: #999;
    font-size: 10px;
    word-break: break-all;
    text-align: center;
`;
