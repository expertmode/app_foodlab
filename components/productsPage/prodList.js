'use client';
import styled from "styled-components";
import Link from "next/link";
import data from "../../data/productsData.json";
import ProdCard from "./prodCard";
import { useFilter } from "@/contexts/FilterContext";

const filterMap = {
    0: null, // Todos os produtos
    1: [14],
    2: [13, 33],
    3: [24, 30],
    4: [4, 6],
    5: [2, 3, 22],
    6: [17],
};

export default function ProdList() {
    const { selectedFilterId } = useFilter();

    const filterCodes = filterMap[selectedFilterId];

    const filteredProducts = filterCodes === null
        ? data
        : data.filter((product) => {
            const ppsCodeArray = Array.isArray(product.ppsCode) ? product.ppsCode : [product.ppsCode];
            return ppsCodeArray.some((code) => filterCodes.includes(code));
        });

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
    padding: 0 40px 40px 40px;
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