'use client';
import { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';

export default function SiteHeader() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <Header>
            <Inner>
                <Link href="/site" onClick={() => setMenuOpen(false)}>
                    <LogoBox>
                        <img src="/images/logoSmall.png" alt="Foodlab" />
                        <Divider />
                        <img src="/images/via_food_logo.png" alt="Via Food" />
                    </LogoBox>
                </Link>

                <Nav $open={menuOpen}>
                    <NavItem href="/site" onClick={() => setMenuOpen(false)}>Início</NavItem>
                    <NavItem href="/site/produtos" onClick={() => setMenuOpen(false)}>Produtos</NavItem>
                </Nav>

                <Burger
                    aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                    onClick={() => setMenuOpen((x) => !x)}
                    $open={menuOpen}
                >
                    <span /><span /><span />
                </Burger>
            </Inner>
        </Header>
    );
}

const Header = styled.header`
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #e5edf0;
    position: sticky;
    top: 0;
    z-index: 80;
    backdrop-filter: saturate(180%) blur(8px);
`;

const Inner = styled.div`
    width: 100%;
    max-width: 1240px;
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 640px) {
        padding: 12px 16px;
    }
`;

const LogoBox = styled.div`
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;

    img {
        height: 32px;
        width: auto;
        display: block;
    }
    img:nth-child(3) {
        height: 22px;
    }

    @media (max-width: 480px) {
        gap: 10px;
        img { height: 26px; }
        img:nth-child(3) { height: 18px; }
    }
`;

const Divider = styled.span`
    width: 1px;
    height: 22px;
    background: rgba(0, 94, 129, 0.2);
    flex-shrink: 0;
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;

    @media (max-width: 720px) {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: #fff;
        border-bottom: 1px solid #e5edf0;
        padding: ${(p) => (p.$open ? '8px 16px 16px' : '0 16px')};
        max-height: ${(p) => (p.$open ? '400px' : '0')};
        overflow: hidden;
        transition: max-height 0.25s ease, padding 0.25s ease;
        align-items: stretch;
    }
`;

const NavItem = styled(Link)`
    color: #005E81;
    font-weight: 600;
    font-size: 15px;
    padding: 10px 16px;
    border-radius: 1000px;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;

    &:hover { background: #f0f8fb; }

    @media (max-width: 720px) {
        text-align: left;
        border-radius: 8px;
    }
`;

const Burger = styled.button`
    display: none;
    background: transparent;
    border: 1.5px solid #005E81;
    width: 38px;
    height: 38px;
    border-radius: 1000px;
    cursor: pointer;
    margin-left: auto;
    position: relative;

    span {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 16px;
        height: 1.6px;
        background: #005E81;
        border-radius: 1px;
        transform: translate(-50%, -50%);
        transition: transform 0.2s, opacity 0.2s;
    }
    span:nth-child(1) {
        transform: translate(-50%, calc(-50% - 5px));
        ${(p) => p.$open && 'transform: translate(-50%, -50%) rotate(45deg);'}
    }
    span:nth-child(2) {
        opacity: ${(p) => (p.$open ? 0 : 1)};
    }
    span:nth-child(3) {
        transform: translate(-50%, calc(-50% + 5px));
        ${(p) => p.$open && 'transform: translate(-50%, -50%) rotate(-45deg);'}
    }

    @media (max-width: 720px) {
        display: block;
    }
`;
