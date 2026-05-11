'use client';
import Link from 'next/link';
import styled from 'styled-components';

export default function HomeProductsTeaser({ products }) {
    const featured = products.slice(0, 6);

    return (
        <Wrap>
            <Inner>
                <HeadRow>
                    <h2>Produtos</h2>
                    <ViewAll href="/site/produtos">Ver todos →</ViewAll>
                </HeadRow>
                <Grid>
                    {featured.map((p) => (
                        <Card key={p.id} href={`/site/produtos/${p.keyName}`}>
                            <ImageFrame>
                                <img src={p.imgProd} alt="" loading="lazy" />
                            </ImageFrame>
                            <CardBody>
                                <Partner>{p.partner}</Partner>
                                <Title>{(p.title || '').replace(/\n/g, ' ')}</Title>
                            </CardBody>
                        </Card>
                    ))}
                </Grid>
            </Inner>
        </Wrap>
    );
}

const Wrap = styled.section`
    width: 100%;
    padding: clamp(48px, 8vw, 96px) 24px;
    background: #f0f6f8;
`;

const Inner = styled.div`
    max-width: 1240px;
    margin: 0 auto;
`;

const HeadRow = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 32px;
    gap: 16px;
    flex-wrap: wrap;

    h2 {
        font-family: "Boldonse", system-ui;
        font-weight: 400;
        font-size: clamp(28px, 4.5vw, 48px);
        color: #005E81;
        margin: 0;
        letter-spacing: -0.5px;
        line-height: 1;
    }
`;

const ViewAll = styled(Link)`
    color: #005E81;
    font-weight: 600;
    font-size: 15px;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 1000px;
    border: 1.5px solid #005E81;
    transition: background 0.15s, color 0.15s;
    &:hover { background: #005E81; color: #fff; }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 32px 20px;
    padding-top: 24px;
`;

const Card = styled(Link)`
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    height: 100%;
    transition: transform 0.18s ease;

    &:hover { transform: translateY(-6px); }
`;

const ImageFrame = styled.div`
    width: 64%;
    margin: 0 auto;
    aspect-ratio: 1;
    position: relative;
    z-index: 2;
    /* Anchor PNGs to the bottom of the frame so tall and short product shapes
       sit on the same baseline — keeps the overhang consistent across cards. */
    display: flex;
    align-items: flex-end;
    justify-content: center;
    pointer-events: none;
    flex-shrink: 0;

    img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        object-position: center bottom;
        filter: drop-shadow(0 14px 22px rgba(0, 94, 129, 0.22));
    }
`;

const CardBody = styled.div`
    background: #fff;
    border-radius: 22px;
    border: 1px solid rgba(0, 94, 129, 0.06);
    box-shadow: 0 6px 18px rgba(0, 94, 129, 0.06);
    /* Pull body up so the bottom of the image overlaps the top edge.
       Smaller offset = less overhang above the card, more grounded look. */
    margin-top: -16%;
    padding: calc(16% + 22px) 20px 28px 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    flex: 1;
    min-height: 170px;
    transition: box-shadow 0.18s ease;

    ${Card}:hover & {
        box-shadow: 0 16px 36px rgba(0, 94, 129, 0.16);
    }
`;

const Partner = styled.span`
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1px;
    color: #88a8b5;
    font-weight: 600;
`;

const Title = styled.h3`
    margin: 0;
    color: #005E81;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.3;
    min-height: 2.6em;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;
