'use client';
import styled from 'styled-components';
import PrintPage from './PrintPage';

export default function PrintCover({ cover }) {
    const hasBg = !!cover.image;
    return (
        <PrintPage $bg="#005E81">
            {hasBg && <BgImage $img={cover.image} />}
            <Overlay $hasBg={hasBg} />

            {cover.showLogo && (
                <HeaderBadge>
                    <FoodlabLogo>
                        <img src="/images/logoSmall.png" alt="Foodlab" />
                    </FoodlabLogo>
                    <Divider />
                    <ViaFoodLogo>
                        <img src="/images/via_food_logo.png" alt="Via Food" />
                    </ViaFoodLogo>
                </HeaderBadge>
            )}

            <Content>
                <Title>{cover.title || 'Catálogo'}</Title>
                {cover.subtitle && <Subtitle>{cover.subtitle}</Subtitle>}
                {cover.date && <DateText>{cover.date}</DateText>}
            </Content>

            <PartnerBar>
                <img src="/images/barralogos.png" alt="" />
            </PartnerBar>
        </PrintPage>
    );
}

const BgImage = styled.div`
    position: absolute;
    inset: 0;
    background-image: url(${(p) => p.$img});
    background-size: cover;
    background-position: center;
`;

const Overlay = styled.div`
    position: absolute;
    inset: 0;
    background: ${(p) => (p.$hasBg
        ? 'linear-gradient(180deg, rgba(0, 94, 129, 0.45) 0%, rgba(0, 94, 129, 0.92) 100%)'
        : 'linear-gradient(180deg, #007299 0%, #005E81 60%, #00475F 100%)'
    )};
`;

const HeaderBadge = styled.div`
    position: absolute;
    top: 22mm;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 8mm;
    padding: 4mm 10mm 4mm 6mm;
    background: #fff;
    border-radius: 1000px;
    box-shadow: 0 4mm 16mm rgba(0, 0, 0, 0.18);
    width: 140mm;
    max-width: 80%;
`;

const FoodlabLogo = styled.div`
    display: flex;
    align-items: center;
    width: 50mm;
    flex-shrink: 0;

    img {
        width: 100%;
        height: auto;
        display: block;
    }
`;

const Divider = styled.div`
    width: 0.4mm;
    height: 14mm;
    background: rgba(0, 94, 129, 0.18);
    flex-shrink: 0;
`;

const ViaFoodLogo = styled.div`
    display: flex;
    align-items: center;
    flex: 1;

    img {
        width: 100%;
        height: auto;
        display: block;
        max-height: 18mm;
        object-fit: contain;
        object-position: left center;
    }
`;

const Content = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0 24mm;
    color: #fff;
`;

const Title = styled.h1`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    font-size: 64pt;
    line-height: 1;
    margin: 0 0 8mm 0;
    color: #fff;
    white-space: pre-line;
    max-width: 95%;
    letter-spacing: -1px;
`;

const Subtitle = styled.p`
    font-size: 22pt;
    font-weight: 600;
    margin: 0 0 12mm 0;
    color: rgba(255, 255, 255, 0.94);
    line-height: 1.15;
`;

const DateText = styled.p`
    font-size: 11pt;
    font-weight: 600;
    margin: 0;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 3px;
    text-transform: uppercase;
    padding: 2mm 6mm;
    border: 0.4mm solid rgba(255, 255, 255, 0.5);
    border-radius: 1000px;
`;

const PartnerBar = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    height: 22mm;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20mm;

    img {
        height: 12mm;
        width: auto;
        max-width: 100%;
        object-fit: contain;
        object-position: center;
        display: block;
    }
`;
