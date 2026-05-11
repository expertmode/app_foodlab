'use client';
import Link from 'next/link';
import styled from 'styled-components';

const STORES = [
    'Antas', 'Cascais', 'CoimbraShopping', 'Colombo', 'Gaia Jardim',
    'GaiaShopping', 'Matosinhos', 'Oeiras', 'Telheiras', 'Vasco da Gama',
    'Amadora', 'Leiria',
];

export default function SiteFooter() {
    return (
        <Footer>
            <Top>
                <Inner>
                    <Brand>
                        <BrandLogos>
                            <img src="/images/logoSmall.png" alt="Foodlab" />
                            <Sep />
                            <img src="/images/via_food_logo.png" alt="Via Food" />
                        </BrandLogos>
                        <Tagline>
                            Experimenta hoje os produtos de amanhã.
                        </Tagline>
                    </Brand>

                    <Col>
                        <ColTitle>Navegação</ColTitle>
                        <ColLink href="/site">Início</ColLink>
                        <ColLink href="/site#sobre">Sobre o Foodlab</ColLink>
                        <ColLink href="/site/produtos">Produtos</ColLink>
                    </Col>

                    <Col>
                        <ColTitle>Contacto</ColTitle>
                        <ColLink as="a" href="mailto:foodlab@mc.pt">foodlab@mc.pt</ColLink>
                        <ColLink as="a" href="https://www.continente.pt" target="_blank" rel="noopener">
                            continente.pt ↗
                        </ColLink>
                        <ColLink as="a" href="https://feed.continente.pt/food-lab" target="_blank" rel="noopener">
                            feed.continente.pt/food-lab ↗
                        </ColLink>
                    </Col>

                    <Col $wide>
                        <ColTitle>Onde encontrar</ColTitle>
                        <Stores>
                            {STORES.map((s) => <Store key={s}>{s}</Store>)}
                        </Stores>
                        <ColNote>
                            Disponível online no Continente Online — Porto, Lisboa, Coimbra e Leiria.
                        </ColNote>
                    </Col>
                </Inner>
            </Top>

            <PartnerBand>
                <Inner>
                    <PartnerLabel>Parceiros</PartnerLabel>
                    <PartnerImg>
                        <img src="/images/barralogos.png" alt="Parceiros" />
                    </PartnerImg>
                </Inner>
            </PartnerBand>

            <Bottom>
                <Inner $row>
                    <Small>© {new Date().getFullYear()} Foodlab · Via Food · Continente Hipermercados, S.A.</Small>
                    <Socials>
                        <SocialLink href="https://www.facebook.com/continenteoficial" target="_blank" rel="noopener">Facebook</SocialLink>
                        <SocialLink href="https://www.instagram.com/continente" target="_blank" rel="noopener">Instagram</SocialLink>
                        <SocialLink href="https://www.youtube.com/channel/UCopBsxnA8zM4N8Fu4P6gPcA" target="_blank" rel="noopener">YouTube</SocialLink>
                    </Socials>
                </Inner>
            </Bottom>
        </Footer>
    );
}

const Footer = styled.footer`
    width: 100%;
    background: #003a52;
    color: #fff;
    margin-top: 96px;
`;

const Top = styled.div`
    padding: clamp(40px, 6vw, 64px) 24px clamp(28px, 4vw, 48px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.10);
`;

const Inner = styled.div`
    max-width: 1240px;
    margin: 0 auto;
    display: ${(p) => (p.$row ? 'flex' : 'grid')};
    ${(p) => p.$row && 'justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;'}
    grid-template-columns: 1.4fr 1fr 1fr 1.6fr;
    gap: 32px;
    align-items: start;

    @media (max-width: 880px) {
        grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`;

const Brand = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const BrandLogos = styled.div`
    background: #fff;
    border-radius: 1000px;
    padding: 8px 18px;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    width: fit-content;

    img {
        height: 28px;
        width: auto;
        display: block;
    }
    img:nth-child(3) { height: 20px; }
`;

const Sep = styled.span`
    width: 1.5px;
    height: 24px;
    background: rgba(0, 94, 129, 0.18);
`;

const Tagline = styled.p`
    margin: 0;
    color: rgba(255, 255, 255, 0.80);
    font-size: 14px;
    line-height: 1.5;
    max-width: 28ch;
`;

const Col = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    ${(p) => p.$wide && '@media (min-width: 881px) { grid-column: span 1; }'}
`;

const ColTitle = styled.h4`
    margin: 0 0 6px 0;
    color: #FFB40F;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.6px;
    text-transform: uppercase;
`;

const ColLink = styled(Link)`
    color: rgba(255, 255, 255, 0.85);
    font-size: 14px;
    text-decoration: none;
    transition: color 0.15s;

    &:hover { color: #FFB40F; }
`;

const ColNote = styled.p`
    margin: 12px 0 0 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 12.5px;
    line-height: 1.5;
`;

const Stores = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;
`;

const Store = styled.span`
    display: inline-block;
    padding: 4px 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 1000px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 12px;
    font-weight: 500;
`;

const PartnerBand = styled.div`
    background: #fff;
    padding: 18px 24px;
`;

const PartnerLabel = styled.span`
    color: #88a8b5;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.6px;
    font-weight: 700;
    flex-shrink: 0;
    grid-column: span 4;
    margin: 0;
    text-align: center;

    @media (max-width: 880px) { grid-column: span 2; }
    @media (max-width: 520px) { grid-column: span 1; }
`;

const PartnerImg = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: span 4;

    img {
        max-width: 100%;
        max-height: 56px;
        height: auto;
        object-fit: contain;
        display: block;
    }

    @media (max-width: 880px) {
        grid-column: span 2;
        img { max-height: 44px; }
    }
    @media (max-width: 520px) { grid-column: span 1; }
`;

const Bottom = styled.div`
    padding: 18px 24px;
    background: rgba(0, 0, 0, 0.18);
`;

const Small = styled.p`
    margin: 0;
    font-size: 12.5px;
    color: rgba(255, 255, 255, 0.65);
`;

const Socials = styled.div`
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
`;

const SocialLink = styled.a`
    color: rgba(255, 255, 255, 0.82);
    font-size: 12.5px;
    padding: 6px 12px;
    border-radius: 1000px;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.20);
    transition: background 0.15s, border-color 0.15s, color 0.15s;

    &:hover {
        background: #FFB40F;
        color: #1a1a1a;
        border-color: #FFB40F;
    }
`;
