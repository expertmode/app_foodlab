'use client';
import styled from "styled-components";
import LogoCompMain from "@/components/global/logoCompMain";
import ProdList from "@/components/productsPage/prodList";
import ProdListBanner from "@/components/productsPage/prodListBanner";
import { FilterProvider } from "@/contexts/FilterContext";

export default function ProdutosContent({ products, pictoFilters }) {
    return (
        <FilterProvider>
            <MainBox>
                <LogoCompMain />
                <ProdListBanner pictoFilters={pictoFilters} />
                <ProdList products={products} />
            </MainBox>
        </FilterProvider>
    );
}

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 100%;
  height: 100%;
`;
