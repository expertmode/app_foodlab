'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export default function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [overHero, setOverHero] = useState(false);
    const pathname = usePathname() || '';
    const isHome = pathname === '/site' || pathname === '/site/';
    const isProdutos = pathname === '/site/produtos' || pathname.startsWith('/site/produtos/');

    // Watch any `[data-site-hero]` element on the page (e.g. HomeBannersHero)
    // and flip the header into a transparent / white-text mode while it's in view.
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const hero = document.querySelector('[data-site-hero]');
        if (!hero) { setOverHero(false); return; }
        // Threshold based on header height — switch when most of the hero is gone.
        const obs = new IntersectionObserver(
            (entries) => setOverHero(entries[0].isIntersecting),
            { rootMargin: '-100px 0px 0px 0px', threshold: 0 },
        );
        obs.observe(hero);
        return () => obs.disconnect();
    }, []);

    return (
        <Header $overHero={overHero}>
            <Inner>
                <Link href="/site" onClick={() => setMenuOpen(false)} style={{ flex: 1, minWidth: 0 }}>
                    <LogoPill
                        initial={{ scale: 0.96, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        <FoodlabLogo>
                            <img src="/images/logoSmall.png" alt="Foodlab" />
                        </FoodlabLogo>
                        <Divider />
                        <ViaFoodLogo>
                            <img src="/images/via_food_logo.png" alt="Via Food" />
                        </ViaFoodLogo>
                    </LogoPill>
                </Link>

                <Nav $open={menuOpen} $overHero={overHero}>
                    <NavItem
                        href="/site"
                        onClick={() => setMenuOpen(false)}
                        $overHero={overHero}
                        $active={isHome}
                    >
                        Início
                    </NavItem>
                    <NavItem
                        href="/site/produtos"
                        onClick={() => setMenuOpen(false)}
                        $overHero={overHero}
                        $active={isProdutos}
                    >
                        Produtos
                    </NavItem>
                </Nav>

                <Burger
                    aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                    onClick={() => setMenuOpen((x) => !x)}
                    $open={menuOpen}
                    $overHero={overHero}
                >
                    <span /><span /><span />
                </Burger>
            </Inner>
        </Header>
    );
}

const Header = styled.header`
    width: 100%;
    background: transparent;
    position: sticky;
    top: 0;
    z-index: 80;
    padding-top: 16px;
`;

const Inner = styled.div`
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;

    @media (max-width: 640px) {
        padding: 0 14px;
    }
`;

const LogoPill = styled(motion.div)`
    display: inline-flex;
    align-items: center;
    gap: clamp(16px, 3vw, 36px);
    background: #fff;
    border: 6px solid #fff;
    border-radius: 1000px;
    padding: 10px clamp(20px, 3vw, 36px) 10px 10px;
    box-shadow: 0 8px 28px rgba(0, 94, 129, 0.10);
    width: fit-content;
    max-width: 100%;
`;

const FoodlabLogo = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;

    img {
        height: clamp(36px, 6vw, 64px);
        width: auto;
        display: block;
    }
`;

const Divider = styled.span`
    width: 1.5px;
    align-self: stretch;
    background: rgba(0, 94, 129, 0.15);
    flex-shrink: 0;
    margin: 4px 0;
`;

const ViaFoodLogo = styled.div`
    display: flex;
    align-items: center;
    flex-shrink: 0;

    img {
        height: clamp(28px, 4.5vw, 48px);
        width: auto;
        display: block;
    }

    @media (max-width: 380px) {
        display: none;
    }
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;

    @media (max-width: 720px) {
        position: absolute;
        top: calc(100% + 8px);
        right: 24px;
        left: auto;
        flex-direction: column;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 12px 32px rgba(0, 94, 129, 0.14);
        padding: ${(p) => (p.$open ? '10px' : '0')};
        max-height: ${(p) => (p.$open ? '400px' : '0')};
        overflow: hidden;
        transition: max-height 0.25s ease, padding 0.25s ease;
        align-items: stretch;
        min-width: 160px;
    }
`;

const NavItem = styled(Link)`
    color: ${(p) => {
        if (p.$active) return p.$overHero ? '#1a1a1a' : '#fff';
        return p.$overHero ? '#fff' : '#005E81';
    }};
    background: ${(p) => {
        if (p.$active) return p.$overHero ? '#fff' : '#005E81';
        return 'transparent';
    }};
    border: 1.5px solid ${(p) => {
        if (p.$active) return p.$overHero ? '#fff' : '#005E81';
        return p.$overHero ? 'rgba(255, 255, 255, 0.55)' : 'transparent';
    }};
    font-weight: 700;
    font-size: 14px;
    padding: 8px 18px;
    border-radius: 1000px;
    text-decoration: none;
    transition: background 0.25s, color 0.25s, border-color 0.25s;
    letter-spacing: 0.2px;
    text-shadow: ${(p) => (p.$overHero && !p.$active ? '0 2px 12px rgba(0, 0, 0, 0.35)' : 'none')};

    &:hover {
        background: ${(p) => {
            if (p.$active) return p.$overHero ? '#fff' : '#005E81';
            return p.$overHero ? 'rgba(255, 255, 255, 0.18)' : '#005E81';
        }};
        color: ${(p) => {
            if (p.$active) return p.$overHero ? '#1a1a1a' : '#fff';
            return '#fff';
        }};
        border-color: ${(p) => (p.$overHero ? '#fff' : '#005E81')};
        text-shadow: none;
    }

    @media (max-width: 720px) {
        text-align: left;
        border-radius: 10px;
        padding: 12px 16px;
        /* Inside the mobile dropdown the header is on white — always use the normal style. */
        color: ${(p) => (p.$active ? '#fff' : '#005E81')};
        background: ${(p) => (p.$active ? '#005E81' : 'transparent')};
        border-color: ${(p) => (p.$active ? '#005E81' : 'transparent')};
        text-shadow: none;
    }
`;

const Burger = styled.button`
    display: none;
    background: ${(p) => (p.$overHero ? 'transparent' : '#fff')};
    border: 1.5px solid ${(p) => (p.$overHero ? '#fff' : '#005E81')};
    width: 44px;
    height: 44px;
    border-radius: 1000px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    transition: background 0.25s, border-color 0.25s;

    span {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 18px;
        height: 2px;
        background: ${(p) => (p.$overHero ? '#fff' : '#005E81')};
        border-radius: 2px;
        transform: translate(-50%, -50%);
        transition: transform 0.2s, opacity 0.2s, background 0.25s;
    }
    span:nth-child(1) {
        transform: translate(-50%, calc(-50% - 6px));
        ${(p) => p.$open && 'transform: translate(-50%, -50%) rotate(45deg);'}
    }
    span:nth-child(2) { opacity: ${(p) => (p.$open ? 0 : 1)}; }
    span:nth-child(3) {
        transform: translate(-50%, calc(-50% + 6px));
        ${(p) => p.$open && 'transform: translate(-50%, -50%) rotate(-45deg);'}
    }

    @media (max-width: 720px) {
        display: block;
    }
`;
