'use client';
import styled from 'styled-components';

export default function HomeAbout() {
    return (
        <Wrap id="sobre">
            <Inner>
                <Eyebrow>O que é o Foodlab?</Eyebrow>
                <Lead>
                    Produtos únicos e inovadores, de alto teor nutricional e orientados
                    para a <Highlight>sustentabilidade do planeta</Highlight>.
                </Lead>
                <Body>
                    O Foodlab é um espaço pioneiro do Continente onde é possível experimentar
                    tendências alimentares globais. O foco está na inovação alimentar, na
                    sustentabilidade e na riqueza nutricional dos produtos —
                    <em> &quot;experimenta hoje os produtos de amanhã&quot;</em>.
                </Body>

                <Stats>
                    <Stat>
                        <StatNum>12</StatNum>
                        <StatLabel>hipermercados Continente</StatLabel>
                    </Stat>
                    <Stat>
                        <StatNum>4</StatNum>
                        <StatLabel>cidades online (Porto, Lisboa, Coimbra, Leiria)</StatLabel>
                    </Stat>
                    <Stat>
                        <StatNum>∞</StatNum>
                        <StatLabel>produtos do futuro a serem testados</StatLabel>
                    </Stat>
                </Stats>
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
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`;

const Eyebrow = styled.p`
    margin: 0 0 12px 0;
    color: #88a8b5;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-size: 12px;
    font-weight: 700;
`;

const Lead = styled.h2`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    color: #005E81;
    font-size: clamp(26px, 4vw, 44px);
    line-height: 1.2;
    margin: 0 0 24px 0;
    letter-spacing: -0.3px;
    max-width: 22ch;
`;

const Highlight = styled.span`
    background: linear-gradient(120deg, transparent 0% 55%, rgba(255, 180, 15, 0.55) 55% 100%);
    padding: 0 4px;
`;

const Body = styled.p`
    color: #34556a;
    font-size: clamp(15px, 1.5vw, 18px);
    line-height: 1.6;
    margin: 0 0 40px 0;
    max-width: 64ch;

    em { font-style: italic; color: #005E81; }
`;

const Stats = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    padding-top: 24px;
    border-top: 1px solid #e5edf0;
`;

const Stat = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const StatNum = styled.span`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    color: #005E81;
    font-size: clamp(36px, 4vw, 52px);
    line-height: 1;
`;

const StatLabel = styled.span`
    color: #4a6976;
    font-size: 13.5px;
    line-height: 1.4;
    font-weight: 500;
`;
