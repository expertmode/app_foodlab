'use client';
import styled from 'styled-components';

export default function SiteFooter() {
    return (
        <Footer>
            <Inner>
                <PartnerBar>
                    <img src="/images/barralogos.png" alt="Parceiros" />
                </PartnerBar>
                <Small>
                    © {new Date().getFullYear()} Foodlab · Via Food
                </Small>
            </Inner>
        </Footer>
    );
}

const Footer = styled.footer`
    width: 100%;
    background: #005E81;
    color: #fff;
    padding: 32px 24px 24px 24px;
    margin-top: 80px;
`;

const Inner = styled.div`
    max-width: 1240px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 18px;
`;

const PartnerBar = styled.div`
    width: 100%;
    background: #fff;
    border-radius: 12px;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        max-width: 100%;
        max-height: 56px;
        height: auto;
        object-fit: contain;
        display: block;
    }

    @media (max-width: 640px) {
        padding: 10px 14px;
        img { max-height: 40px; }
    }
`;

const Small = styled.p`
    font-size: 12px;
    margin: 0;
    color: rgba(255, 255, 255, 0.75);
    letter-spacing: 0.5px;
`;
