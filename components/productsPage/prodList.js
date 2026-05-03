'use client';
import styled from "styled-components";
import Link from "next/link";
import ProdCard from "./prodCard";
import { useFilter } from "@/contexts/FilterContext";

export default function ProdList({ products = [] }) {
    const { selectedFilterId } = useFilter();

    const filteredProducts = selectedFilterId === 0
        ? products
        : products.filter((p) => Array.isArray(p.filter) && p.filter.includes(selectedFilterId));

    return (
        <ProdListContainer>
            <Grid>
                {filteredProducts.map((product) => (
                    <ProdCard key={product.id} product={product} />
                ))}
            </Grid>
        </ProdListContainer>
    );
}

const ProdListContainer = styled.div`
    width: 100%;
    padding: 0 40px 88px 40px;
    display: flex;
    justify-content: center;
    background-color: #f0f0eb;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    max-width: 1200px;
    width: 100%;
`;

const ProductCardOld = styled.div`
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