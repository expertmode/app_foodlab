'use client';
import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomeBannersHero({ banners }) {
    const [index, setIndex] = useState(0);

    // Auto-rotation is intentionally NOT applied here — that's a kiosk-only behaviour.
    // The site only flips when the user clicks a dot below.

    if (!banners || !banners.length) {
        return (
            <Wrap $bg="#005E81">
                <Inner>
                    <Title style={{ color: '#fff' }}>Foodlab</Title>
                </Inner>
            </Wrap>
        );
    }

    const current = banners[index];

    return (
        <Wrap data-site-hero>
            <AnimatePresence mode="sync">
                <BgImage
                    key={`bg-${current.id}`}
                    $img={current.image}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.0, ease: 'easeOut' }}
                />
            </AnimatePresence>
            <Overlay />

            <Inner>
                <AnimatePresence mode="wait">
                    <TextStack key={`txt-${current.id}`}>
                        <Line1
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
                        >
                            {[current.text1, current.text2].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()}
                        </Line1>
                        <Line2
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.30 }}
                        >
                            {(current.text3 || '').replace(/\s+/g, ' ').trim()}
                        </Line2>
                    </TextStack>
                </AnimatePresence>

                <CtaRow
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                >
                    <Cta href="/site/produtos">Ver produtos</Cta>
                </CtaRow>

                {banners.length > 1 && (
                    <Dots>
                        {banners.map((_, i) => (
                            <Dot
                                key={i}
                                $active={i === index}
                                onClick={() => setIndex(i)}
                                aria-label={`Banner ${i + 1}`}
                            />
                        ))}
                    </Dots>
                )}
            </Inner>
        </Wrap>
    );
}

// Keep the keyframe placeholder for non-image fallback
const Title = styled.h1`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    font-size: clamp(40px, 7vw, 96px);
    margin: 0;
    line-height: 1;
`;

const Wrap = styled.section`
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    max-height: 85vh;
    min-height: clamp(420px, 60vh, 720px);
    overflow: hidden;
    background: ${(p) => p.$bg || '#0c0c10'};
    margin-top: -88px;
    padding-top: 88px;

    @media (max-width: 720px) {
        aspect-ratio: 4 / 5;
        min-height: 560px;
        max-height: none;
    }
`;

const BgImage = styled(motion.div)`
    position: absolute;
    inset: 0;
    background-image: url(${(p) => p.$img});
    background-size: cover;
    background-position: center;
    z-index: 1;
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    background:
        linear-gradient(180deg, rgba(0, 28, 38, 0.35) 0%, rgba(0, 28, 38, 0.0) 30%, rgba(0, 28, 38, 0.45) 100%),
        linear-gradient(90deg, rgba(0, 28, 38, 0.55) 0%, rgba(0, 28, 38, 0.10) 60%, rgba(0, 28, 38, 0.0) 100%);
    z-index: 2;
`;

const Inner = styled.div`
    position: relative;
    z-index: 3;
    width: 100%;
    max-width: 1240px;
    height: 100%;
    margin: 0 auto;
    /* Text + CTA grouped around the vertical middle, biased upward —
       well clear of the bottom edge / partner band. */
    padding: clamp(72px, 10vw, 100px) clamp(24px, 4vw, 40px) clamp(180px, 26vw, 280px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    color: #fff;
    gap: clamp(14px, 2vw, 24px);
`;

const TextStack = styled.div`
    display: flex;
    flex-direction: column;
    gap: clamp(2px, 0.6vw, 10px);
    max-width: 100%;
    width: 100%;
`;

const Line1 = styled(motion.p)`
    margin: 0;
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    /* Smaller scale overall — keeps things readable without dominating the banner. */
    font-size: clamp(20px, 3.6vw, 52px);
    line-height: 1.08;
    letter-spacing: -1px;
    color: #fff;
    text-transform: uppercase;
    text-shadow: 0 6px 30px rgba(0, 0, 0, 0.55);
    text-wrap: balance;
    overflow-wrap: break-word;
`;

const Line2 = styled(motion.p)`
    margin: 0;
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    font-size: clamp(20px, 3.6vw, 52px);
    line-height: 1.08;
    letter-spacing: -1px;
    color: #FFB40F;
    text-transform: uppercase;
    text-shadow: 0 4px 22px rgba(0, 0, 0, 0.45);
    text-wrap: balance;
    overflow-wrap: break-word;
`;

const CtaRow = styled(motion.div)`
    display: flex;
    gap: 10px;
`;

const Cta = styled(Link)`
    background: #FFB40F;
    color: #1a1a1a;
    font-weight: 700;
    font-size: 15px;
    padding: 14px 28px;
    border-radius: 1000px;
    text-decoration: none;
    box-shadow: 0 8px 24px rgba(255, 180, 15, 0.32);
    transition: background 0.15s, transform 0.1s;

    &:hover { background: #ffc638; transform: translateY(-1px); }
`;

const Dots = styled.div`
    position: absolute;
    bottom: 22px;
    right: clamp(24px, 4vw, 40px);
    display: flex;
    gap: 8px;
    z-index: 4;
`;

const Dot = styled.button`
    width: ${(p) => (p.$active ? '24px' : '8px')};
    height: 8px;
    border-radius: 1000px;
    border: none;
    background: ${(p) => (p.$active ? '#fff' : 'rgba(255,255,255,0.45)')};
    cursor: pointer;
    transition: width 0.25s ease, background 0.2s ease;
    padding: 0;

    &:hover { background: #fff; }
`;
