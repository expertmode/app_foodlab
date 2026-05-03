import styled from "styled-components";
import { readProducts } from "@/lib/products";
import LogoCompMain from "@/components/global/logoCompMain";
import ProdBanner from "@/components/productDetail/prodBanner";
import ProdTitleBox from "@/components/productDetail/prodTitleBox";
import ProdPictos from "@/components/productDetail/prodPictos";
import ProdSliderMain from "@/components/productDetail/prodSliderMain";
import ProdDescription from "@/components/productDetail/prodDescription";
import ButtonBack from "@/components/productDetail/buttonBack";

export default async function ProductDetail({ params }) {
    const { keyName } = await params;
    const products = await readProducts();
    const product = products.find((p) => p.keyName === keyName);

    if (!product || product.hidden) {
        return (
            <MainBox>
                <div>Produto não encontrado</div>
            </MainBox>
        );
    }

    return (
        <MainBox>
            <ButtonBackWrapper>
                <ButtonBack link="/produtos" title="Voltar" />
            </ButtonBackWrapper>
            <LogoCompMain />
            <ProdBanner data={product} />
            <ProdTitleBox data={product} />
            <ProdPictos data={product} />
            <ProdSliderMain data={product} />
            <ProdDescription data={product} />
        </MainBox>
    );
}

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;

const ButtonBackWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 64px;
  height: 100%;
  display: flex;
  align-items: flex-start;
  padding-top: calc(50vh - 40px);
  pointer-events: none;
  z-index: 50;

  > * {
    pointer-events: auto;
    position: sticky;
    top: calc(50vh - 40px);
  }
`;
