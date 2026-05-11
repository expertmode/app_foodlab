'use client';
import styled from 'styled-components';

const PILLARS = [
    {
        title: 'Ingredientes locais',
        body: 'Microalgas, tremoço, frutos secos nacionais — aproveitamos os recursos da nossa região.',
    },
    {
        title: 'Mais nutritivo',
        body: 'Reformular receitas clássicas para que tenham mais proteína, mais fibra e menos açúcar.',
    },
    {
        title: 'Pensado no futuro',
        body: 'Alternativas vegetais sustentáveis e cadeias de fornecimento curtas e transparentes.',
    },
];

export default function HomeIntro() {
    return (
        <Wrap id="sobre">
            <Inner>
                <h2>O que é o Foodlab?</h2>
                <Lead>
                    Foodlab é um laboratório de inovação alimentar do projeto Via Food. Desenvolvemos
                    produtos que aliam técnicas tradicionais a ingredientes do futuro — testados em
                    parceria com universidades e empresas portuguesas.
                </Lead>
                <Pillars>
                    {PILLARS.map((p) => (
                        <Pillar key={p.title}>
                            <PillarTitle>{p.title}</PillarTitle>
                            <PillarBody>{p.body}</PillarBody>
                        </Pillar>
                    ))}
                </Pillars>
            </Inner>
        </Wrap>
    );
}

const Wrap = styled.section`
    width: 100%;
    padding: clamp(48px, 8vw, 96px) 24px;
    background: #fff;
`;

const Inner = styled.div`
    max-width: 1240px;
    margin: 0 auto;

    h2 {
        font-family: "Boldonse", system-ui;
        font-weight: 400;
        font-size: clamp(28px, 4.5vw, 48px);
        color: #005E81;
        margin: 0 0 16px 0;
        line-height: 1.1;
        letter-spacing: -0.5px;
    }
`;

const Lead = styled.p`
    color: #34556a;
    font-size: clamp(15px, 1.4vw, 18px);
    line-height: 1.6;
    margin: 0 0 40px 0;
    max-width: 60ch;
`;

const Pillars = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
`;

const Pillar = styled.div`
    padding: 24px;
    border: 1px solid #e0ebf0;
    border-radius: 16px;
    background: #f8fbfc;
    transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(0, 94, 129, 0.08);
        border-color: #005E81;
    }
`;

const PillarTitle = styled.h3`
    margin: 0 0 10px 0;
    color: #005E81;
    font-size: 18px;
    font-weight: 700;
`;

const PillarBody = styled.p`
    margin: 0;
    color: #4a6976;
    font-size: 14.5px;
    line-height: 1.55;
`;
