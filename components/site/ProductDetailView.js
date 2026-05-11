'use client';
import Link from 'next/link';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getPictoIcon } from '@/lib/pictos';

// Reusable scroll-triggered fade-up that runs once.
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
};
const viewportOnce = { once: true, amount: 0.25 };

export default function ProductDetailView({ product }) {
    const pictos = product.pictos || [];
    const cards = (product.infoCards || []).filter((c) => c.image);

    return (
        <Wrap>
            <BackBar>
                <Inner>
                    <BackLink href="/site/produtos">← Voltar aos produtos</BackLink>
                </Inner>
            </BackBar>

            <Hero>
                {product.imgBg && (
                    <HeroBg
                        $img={product.imgBg}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.0, ease: 'easeOut' }}
                    />
                )}
                <HeroInner>
                    <HeroText>
                        <Eyebrow
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                        >
                            {product.partner}
                        </Eyebrow>
                        <Title
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.25, ease: 'easeOut' }}
                        >
                            {(product.title || '').replace(/\n/g, ' ')}
                        </Title>
                        {product.subTitle && (
                            <Subtitle
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay: 0.40 }}
                            >
                                {product.subTitle}
                            </Subtitle>
                        )}
                        {product.pps && (
                            <PpsBox
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.55 }}
                            >
                                {product.pps}
                            </PpsBox>
                        )}
                    </HeroText>
                    {product.imgProd && (
                        <HeroImg
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <img src={product.imgProd} alt="" />
                        </HeroImg>
                    )}
                </HeroInner>
            </Hero>

            {pictos.length > 0 && (
                <Section>
                    <SectionInner>
                        <SectionLabel
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={{ duration: 0.5 }}
                        >
                            Características
                        </SectionLabel>
                        <PictoGrid
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
                            }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            {pictos.map((p, i) => {
                                const icon = getPictoIcon(p.text);
                                return (
                                    <PictoCard
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: 24, scale: 0.96 },
                                            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
                                        }}
                                    >
                                        <PictoCircle>{icon && <img src={icon} alt="" />}</PictoCircle>
                                        <PictoText>{p.text}</PictoText>
                                    </PictoCard>
                                );
                            })}
                        </PictoGrid>
                    </SectionInner>
                </Section>
            )}

            {cards.length > 0 && (
                <Section $alt>
                    <SectionInner>
                        <SectionLabel
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={{ duration: 0.5 }}
                        >
                            {product.sliderTitle || 'Sobre o produto'}
                        </SectionLabel>
                        <CardsGrid
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
                            }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            {cards.map((c, i) => (
                                <InfoCard
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 32 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
                                    }}
                                >
                                    <InfoImg $img={c.image} />
                                    {c.desc && <InfoDesc>{c.desc}</InfoDesc>}
                                </InfoCard>
                            ))}
                        </CardsGrid>
                    </SectionInner>
                </Section>
            )}

            {product.description && (
                <Section>
                    <SectionInner>
                        <DescriptionRow
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.15 } },
                            }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                        >
                            <DescriptionText
                                variants={fadeUp}
                                transition={{ duration: 0.6 }}
                            >
                                {product.description}
                            </DescriptionText>
                            {product.bottomImg && (
                                <DescriptionImage
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.9 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } },
                                    }}
                                >
                                    <img src={product.bottomImg} alt="" />
                                </DescriptionImage>
                            )}
                        </DescriptionRow>
                    </SectionInner>
                </Section>
            )}
        </Wrap>
    );
}

const Wrap = styled.article`
    width: 100%;
`;

const BackBar = styled.div`
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #e5edf0;
`;

const Inner = styled.div`
    max-width: 1240px;
    margin: 0 auto;
    padding: 16px 24px;
`;

const BackLink = styled(Link)`
    color: #005E81;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    &:hover { text-decoration: underline; }
`;

const Hero = styled.section`
    width: 100%;
    background: #f0f0eb;
    position: relative;
    overflow: hidden;
    padding: clamp(40px, 8vw, 80px) 24px clamp(40px, 8vw, 80px);
`;

const HeroBg = styled(motion.div)`
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 60%;
    background-image: url(${(p) => p.$img});
    background-size: cover;
    background-position: center;
    border-radius: 0 0 50% 50%;
    z-index: 1;
    opacity: 0.92;

    @media (max-width: 720px) {
        height: 40%;
    }
`;

const HeroInner = styled.div`
    max-width: 1240px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 40px;

    @media (max-width: 880px) {
        grid-template-columns: 1fr;
        gap: 24px;
        text-align: left;
    }
`;

const HeroText = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    order: 2;

    @media (min-width: 881px) {
        order: 1;
    }
`;

const Eyebrow = styled(motion.span)`
    text-transform: uppercase;
    color: #005E81;
    letter-spacing: 2px;
    font-size: 12px;
    font-weight: 700;
    opacity: 0.7;
`;

const Title = styled(motion.h1)`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    color: #005E81;
    font-size: clamp(32px, 5.5vw, 64px);
    line-height: 1.05;
    margin: 0;
    letter-spacing: -0.5px;
    white-space: pre-line;
`;

const Subtitle = styled(motion.p)`
    color: #005E81;
    font-size: clamp(16px, 1.7vw, 20px);
    font-weight: 600;
    line-height: 1.4;
    margin: 4px 0 8px 0;
    white-space: pre-line;
`;

const PpsBox = styled(motion.div)`
    display: inline-block;
    align-self: flex-start;
    border: 1.5px solid #005E81;
    border-radius: 1000px;
    padding: 6px 18px;
    font-size: 14px;
    font-weight: 600;
    color: #005E81;
`;

const HeroImg = styled(motion.div)`
    order: 1;
    width: 100%;
    aspect-ratio: 1;
    max-width: 420px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 16px 40px rgba(0, 94, 129, 0.18));

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    @media (min-width: 881px) {
        order: 2;
        max-width: 100%;
    }
`;

const Section = styled.section`
    width: 100%;
    padding: clamp(40px, 6vw, 80px) 24px;
    background: ${(p) => (p.$alt ? '#f8fbfc' : '#fff')};
`;

const SectionInner = styled.div`
    max-width: 1240px;
    margin: 0 auto;
`;

const SectionLabel = styled(motion.h2)`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    font-size: clamp(24px, 3.5vw, 36px);
    color: #005E81;
    margin: 0 0 32px 0;
    line-height: 1.1;
    letter-spacing: -0.5px;
`;

const PictoGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 24px;
`;

const PictoCard = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
`;

const PictoCircle = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #005E81;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 22px;
    box-sizing: border-box;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: brightness(0) invert(1);
    }
`;

const PictoText = styled.p`
    margin: 0;
    color: #005E81;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
    max-width: 16ch;
    white-space: pre-line;
`;

const CardsGrid = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 18px;
`;

const InfoCard = styled(motion.div)`
    background: #fff;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #e0ebf0;
    display: flex;
    flex-direction: column;
`;

const InfoImg = styled.div`
    width: 100%;
    aspect-ratio: 4 / 3;
    background-image: url(${(p) => p.$img});
    background-size: cover;
    background-position: center;
`;

const InfoDesc = styled.p`
    margin: 0;
    padding: 18px 22px 22px;
    color: #005E81;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.4;
    text-align: center;
    white-space: pre-line;
`;

const DescriptionRow = styled(motion.div)`
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 40px;
    align-items: center;

    @media (max-width: 720px) {
        grid-template-columns: 1fr;
        gap: 24px;
    }
`;

const DescriptionText = styled(motion.p)`
    color: #005E81;
    font-size: clamp(18px, 2.2vw, 26px);
    font-weight: 600;
    line-height: 1.4;
    margin: 0;
    white-space: pre-line;
`;

const DescriptionImage = styled(motion.div)`
    width: 100%;
    max-width: 360px;
    aspect-ratio: 1;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;
