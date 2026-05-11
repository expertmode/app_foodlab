'use client';
import styled from 'styled-components';
import PrintPage from './PrintPage';
import { getPictoIcon } from '@/lib/pictos';

// One A4 portrait page per product.
// Compresses the kiosk product detail layout: banner + title/PPS + pictos + cards strip + description + footer.
export default function PrintProduct({ product, pageNumber, footer }) {
    const pictos = product.pictos || [];
    const cards = (product.infoCards || []).filter((c) => c.image);

    return (
        <PrintPage $bg="#f0f0eb">
            <BannerArea>
                {product.imgBg && <BannerBg $img={product.imgBg} />}
                {product.imgProd && (
                    <ProdImg
                        src={product.imgProd}
                        $imgSize={product.imgSize}
                        $scale={product.imgScaleDetail ?? 1}
                        $offX={product.imgOffsetXDetail ?? 0}
                        $offY={product.imgOffsetYDetail ?? 0}
                        alt=""
                    />
                )}
            </BannerArea>

            <TitleBlock>
                <Title>{(product.title || '').replace(/\n/g, ' ')}</Title>
                {product.subTitle && <Subtitle>{product.subTitle}</Subtitle>}
                {product.pps && <PpsBox>{product.pps}</PpsBox>}
            </TitleBlock>

            {pictos.length > 0 && (
                <PictosRow $count={pictos.length}>
                    {pictos.slice(0, 4).map((p, i) => (
                        <PictoCard key={i}>
                            <PictoCircle>
                                {getPictoIcon(p.text) && (
                                    <img src={getPictoIcon(p.text)} alt="" />
                                )}
                            </PictoCircle>
                            <PictoText>{p.text}</PictoText>
                        </PictoCard>
                    ))}
                </PictosRow>
            )}

            {cards.length > 0 && (
                <CardsRow $count={Math.min(cards.length, 3)}>
                    {cards.slice(0, 3).map((c, i) => (
                        <SmallCard key={i}>
                            <CardImg $img={c.image} />
                            {c.desc && <CardDesc>{c.desc}</CardDesc>}
                        </SmallCard>
                    ))}
                </CardsRow>
            )}

            {product.description && (
                <Description>{product.description}</Description>
            )}

            <FooterBar>
                <FooterLeft>{footer}</FooterLeft>
                <FooterRight>#{product.id} · pág. {pageNumber}</FooterRight>
            </FooterBar>
        </PrintPage>
    );
}

const BannerArea = styled.div`
    width: 100%;
    height: 105mm;
    position: relative;
    overflow: hidden;
    background: #f0f0eb;
    flex-shrink: 0;
`;

const BannerBg = styled.div`
    position: absolute;
    top: 0;
    left: -5%;
    width: 110%;
    height: 80mm;
    background-image: url(${(p) => p.$img});
    background-size: cover;
    background-position: center;
    border-radius: 0 0 1000px 1000px;
`;

const ProdImg = styled.img`
    position: absolute;
    bottom: 4mm;
    left: 12mm;
    width: ${(p) => mmFromKioskSize(p.$imgSize) || '60mm'};
    transform: translate(${(p) => p.$offX ?? 0}%, ${(p) => -(p.$offY ?? 0)}%) scale(${(p) => p.$scale ?? 1});
    transform-origin: bottom left;
    object-fit: contain;
`;

// Helper to translate kiosk px sizes (e.g. "420px") to mm for A4 print.
// Kiosk width 1080px ≈ 186mm in print (we use 6mm/35px ratio).
function mmFromKioskSize(s) {
    if (!s) return null;
    const m = String(s).match(/^(\d+(?:\.\d+)?)\s*px$/i);
    if (!m) return null;
    const px = parseFloat(m[1]);
    // Scale roughly: kiosk image is on a 1080px wide container, A4 ~186mm wide
    return `${Math.round((px / 1080) * 186)}mm`;
}

const TitleBlock = styled.div`
    padding: 4mm 14mm 4mm 14mm;
    background: #f0f0eb;
`;

const Title = styled.h2`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    font-size: 28pt;
    color: #005E81;
    margin: 0;
    line-height: 1.05;
    white-space: pre-line;
`;

const Subtitle = styled.p`
    font-size: 13pt;
    font-weight: 600;
    color: #005E81;
    margin: 3mm 0 3mm 0;
    line-height: 1.2;
    white-space: pre-line;
`;

const PpsBox = styled.div`
    display: inline-block;
    border: 0.5mm solid #005E81;
    border-radius: 100px;
    padding: 1mm 5mm;
    font-size: 11pt;
    font-weight: 600;
    color: #005E81;
    margin-top: 1mm;
`;

const PictosRow = styled.div`
    display: flex;
    justify-content: ${(p) => (p.$count < 4 ? 'flex-start' : 'space-between')};
    gap: 4mm;
    padding: 4mm 14mm;
    background: #f0f0eb;
`;

const PictoCard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2mm;
    flex: 0 0 36mm;
    max-width: 36mm;
`;

const PictoCircle = styled.div`
    width: 22mm;
    height: 22mm;
    border-radius: 50%;
    background: #005E81;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4mm;
    box-sizing: border-box;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: brightness(0) invert(1);
    }
`;

const PictoText = styled.p`
    font-size: 8.5pt;
    font-weight: 600;
    color: #005E81;
    text-align: center;
    line-height: 1.15;
    margin: 0;
    white-space: pre-line;
`;

const CardsRow = styled.div`
    display: flex;
    gap: 4mm;
    padding: 4mm 14mm;
    background: #f0f0eb;
`;

const SmallCard = styled.div`
    flex: 1;
    background: #fff;
    border-radius: 6mm;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

const CardImg = styled.div`
    width: 100%;
    aspect-ratio: 4 / 3;
    background-image: url(${(p) => p.$img});
    background-size: cover;
    background-position: center;
`;

const CardDesc = styled.p`
    font-size: 8.5pt;
    font-weight: 600;
    color: #005E81;
    text-align: center;
    padding: 2mm 3mm 3mm 3mm;
    margin: 0;
    line-height: 1.2;
    white-space: pre-line;
`;

const Description = styled.p`
    font-size: 13pt;
    font-weight: 600;
    color: #005E81;
    padding: 4mm 14mm 6mm 14mm;
    margin: 0;
    line-height: 1.25;
    background: #fff;
    flex: 1;
`;

const FooterBar = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #005E81;
    color: #fff;
    height: 8mm;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12mm;
    font-size: 9pt;
    font-weight: 500;
    letter-spacing: 1px;
`;

const FooterLeft = styled.span`
    text-transform: uppercase;
`;

const FooterRight = styled.span``;
