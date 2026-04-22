import styled from "styled-components";
import LogoCompMain from "@/components/global/logoCompMain";
import ProdList from "@/components/productsPage/prodList";

export const metadata = {
    title: "Lista de Produtos",
    description: "",
}

export default function Produtos() {
    return (
        <MainBox>
            <LogoCompMain />
            <ProdList />
        </MainBox>
    );
};

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 100%;
  height: 100%;
`;