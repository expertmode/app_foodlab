import styled from "styled-components";
import Link from "next/link";

export default function ProdCard({ product }) {
    return (
        <CardMainBox>
            <CardImgArea>
                <CircleBox />
                <ImageBox src={product.imgProd || "/images/produtos/geral.png"} alt="produto" onError={(e) => { e.target.src = "/images/produtos/geral.png" }} />
            </CardImgArea>
        </CardMainBox>
    )
};

const CardMainBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const CardImgArea = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1.2;
    /* background-color: pink; */
`;

const ImageBox = styled.img`
    position: absolute;
    bottom: 0;
    width: 55%;
    height: auto;
    z-index: 10;
    object-fit: contain;
`;

const CircleBox = styled.div`
    position: absolute;
    bottom: 0;
    width: 250px;
    aspect-ratio: 1 / 1;
    border-radius: 1000px;
    background-color: #fff;
`;  