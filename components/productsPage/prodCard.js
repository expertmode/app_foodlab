import { useState } from "react";
import styled from "styled-components";

export default function ProdCard({ product }) {
    const [hidden, setHidden] = useState(!product.imgProd);

    return (
        <CardMainBox href={`/produtos/${product.keyName}`}>
            <CardImgArea>
                <CircleBox />
                {!hidden && (
                    <ImageBox
                        src={product.imgProd}
                        alt={product.title || "produto"}
                        onError={() => setHidden(true)}
                        $scale={product.imgScale ?? 1}
                        $offsetX={product.imgOffsetX ?? 0}
                        $offsetY={product.imgOffsetY ?? 0}
                    />
                )}
            </CardImgArea>
            <CardTitle>{product.title}</CardTitle>
        </CardMainBox>
    )
};

const CardMainBox = styled.a`
    display: flex;
    flex-direction: column;
    width: 100%;
    text-decoration: none;
    cursor: pointer;
`;

const CardImgArea = styled.div`
    display: flex;
    position: relative;
    width: 100%;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1.2;
`;

const ImageBox = styled.img`
    position: absolute;
    bottom: 0;
    width: 80%;
    height: auto;
    z-index: 10;
    object-fit: contain;
    transform: translate(${(p) => p.$offsetX ?? 0}%, ${(p) => -(p.$offsetY ?? 0)}%) scale(${(p) => p.$scale ?? 1});
    transform-origin: bottom center;
`;

const CircleBox = styled.div`
    position: absolute;
    bottom: 0;
    width: 320px;
    aspect-ratio: 1 / 1;
    border-radius: 1000px;
    background-color: #fff;
`;

const CardTitle = styled.h3`
    margin: 16px 0 0 0;
    color: #005E81;
    text-align: center;
    font-size: 26px;
    font-weight: 600;
    white-space: pre-wrap;
`;