'use client';
import styled from "styled-components";
import LogoCompMain from "@/components/global/logoCompMain";
import ProdList from "@/components/productsPage/prodList";
import ProdFooter from "@/components/productsPage/prodFooter";
import ProdListBanner from "@/components/productsPage/prodListBanner";
import { FilterProvider } from "@/contexts/FilterContext";

export default function ProdutosContent({ products, filters }) {
    return (
        <FilterProvider>
            <MainBox>
                <LogoCompMain />
                <ProdListBanner filters={filters} />
                <ProdList products={products} />
                <ProdFooter />
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
