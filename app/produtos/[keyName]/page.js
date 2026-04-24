import styled from "styled-components";
import data from "../../../data/productsData.json";
import LogoCompMain from "@/components/global/logoCompMain";
import ProdBanner from "@/components/productDetail/prodBanner";
import ProdTitleBox from "@/components/productDetail/prodTitleBox";
import ProdPictos from "@/components/productDetail/prodPictos";
import ProdSliderMain from "@/components/productDetail/prodSliderMain";
import ProdDescription from "@/components/productDetail/prodDescription";

export function generateStaticParams() {
    return data.map((product) => ({
        keyName: product.keyName,
    }));
}

export default async function ProductDetail({ params }) {
    const { keyName } = await params;
    const product = data.find((p) => p.keyName === keyName);

    if (!product) {
        return (
            <MainBox>
                <div>Produto não encontrado</div>
            </MainBox>
        );
    }

    return (
        <MainBox>
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
  height: 100%;
`;
