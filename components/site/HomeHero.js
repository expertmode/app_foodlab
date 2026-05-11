'use client';
import Link from 'next/link';
import styled from 'styled-components';

export default function HomeHero() {
    return (
        <Hero>
            <Inner>
                <Eyebrow>Inovação alimentar</Eyebrow>
                <Title>
                    Sabor de sempre <Highlight>pensado no futuro</Highlight>
                </Title>
                <Subtitle>
                    Conhece os produtos desenvolvidos pelo Foodlab no âmbito do projeto
                    Via Food — ingredientes locais, técnicas novas e mais sustentabilidade.
                </Subtitle>
                <CtaRow>
                    <CtaPrimary href="/site/produtos">Ver produtos</CtaPrimary>
                    <CtaSecondary href="#sobre">Saber mais</CtaSecondary>
                </CtaRow>
            </Inner>
            <Decoration aria-hidden />
        </Hero>
    );
}

const Hero = styled.section`
    position: relative;
    width: 100%;
    padding: clamp(48px, 9vw, 120px) 24px clamp(56px, 11vw, 140px);
    overflow: hidden;
    background:
        radial-gradient(circle at 20% 20%, rgba(255, 180, 15, 0.10), transparent 50%),
        linear-gradient(180deg, #ffffff 0%, #f0f6f8 100%);
`;

const Inner = styled.div`
    max-width: 1240px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
`;

const Eyebrow = styled.p`
    margin: 0;
    color: #005E81;
    text-transform: uppercase;
    letter-spacing: 2.5px;
    font-size: 12px;
    font-weight: 700;
    opacity: 0.7;
`;

const Title = styled.h1`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    color: #005E81;
    font-size: clamp(34px, 6.5vw, 78px);
    line-height: 1.02;
    letter-spacing: -1px;
    margin: 0;
    max-width: 14ch;
`;

const Highlight = styled.span`
    background: linear-gradient(120deg, transparent 0% 50%, #FFB40F 50% 100%);
    padding: 0 6px;
`;

const Subtitle = styled.p`
    color: #34556a;
    font-size: clamp(15px, 1.6vw, 19px);
    line-height: 1.55;
    margin: 8px 0 24px 0;
    max-width: 56ch;
`;

const CtaRow = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
`;

const CtaPrimary = styled(Link)`
    background: #005E81;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    padding: 14px 26px;
    border-radius: 1000px;
    text-decoration: none;
    transition: background 0.15s, transform 0.1s;

    &:hover { background: #004a66; transform: translateY(-1px); }
`;

const CtaSecondary = styled.a`
    color: #005E81;
    font-weight: 600;
    font-size: 15px;
    padding: 14px 26px;
    border-radius: 1000px;
    border: 1.5px solid #005E81;
    text-decoration: none;
    transition: background 0.15s;

    &:hover { background: #005E81; color: #fff; }
`;

const Decoration = styled.div`
    position: absolute;
    right: -120px;
    top: 40px;
    width: clamp(280px, 40vw, 480px);
    height: clamp(280px, 40vw, 480px);
    border-radius: 50%;
    background:
        radial-gradient(circle at 30% 30%, #FFB40F 0%, transparent 65%),
        radial-gradient(circle at 70% 70%, #005E81 0%, transparent 60%);
    opacity: 0.18;
    z-index: 1;
    pointer-events: none;
    filter: blur(40px);

    @media (max-width: 720px) {
        right: -180px;
        top: 80px;
    }
`;
