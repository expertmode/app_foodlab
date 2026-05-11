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
                            <Thumb style={{ backgroundImage: `url(${p.imgProd})` }} />
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
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
`;

const Card = styled(Link)`
    background: #fff;
    border-radius: 18px;
    overflow: hidden;
    border: 1px solid #e0ebf0;
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    transition: transform 0.15s, box-shadow 0.15s;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 28px rgba(0, 94, 129, 0.12);
    }
`;

const Thumb = styled.div`
    width: 100%;
    aspect-ratio: 1;
    background-color: #f5f5f0;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
`;

const CardBody = styled.div`
    padding: 16px 18px 20px 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
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
    line-height: 1.25;
`;
