'use client';
import styled from "styled-components";
import Link from "next/link";
import data from "../../data/productsData.json";

export default function ProdList() {
    const products = data;

    return (
        <ProdListContainer>
            <Grid>
                {products.map((product) => (
                    <ProductCard key={product.id}>
                        <Link href={`/produtos/${product.keyName}`}>
                            {product.imgProd && <ProductImage src={product.imgProd} alt={product.title} />}
                            <ProductTitle>{product.title}</ProductTitle>
                        </Link>
                    </ProductCard>
                ))}
            </Grid>
        </ProdListContainer>
    );
}

const ProdListContainer = styled.div`
    width: 100%;
    margin-top: 400px;
    padding: 0 40px 40px 40px;
    display: flex;
    justify-content: center;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    max-width: 1200px;
    width: 100%;
`;

const ProductCard = styled.div`
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover {
        transform: translateY(-10px);
    }

    a {
        display: flex;
        flex-direction: column;
        gap: 20px;
        text-decoration: none;
    }
`;

const ProductImage = styled.img`
    width: 100%;
    height: 300px;
    object-fit: contain;
    background-color: #f5f5f5;
    border-radius: 8px;
`;

const ProductTitle = styled.h2`
    font-size: 24px;
    color: #333;
    font-family: var(--font-boldonse), sans-serif;
    text-align: center;
    margin: 0;
    white-space: pre-wrap;
`;