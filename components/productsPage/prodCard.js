import { useState } from "react";
import styled from "styled-components";
import Link from "next/link";

export default function ProdCard({ product }) {
    const [hidden, setHidden] = useState(!product.imgProd);

    return (
        <CardMainBox href={`/produtos/${product.keyName}`}>
            <CardImgArea>
                {!hidden && (
                    <>
                        <CircleBox />
                        <ImageBox
                            src={product.imgProd}
                            alt={product.title || "produto"}
                            onError={() => setHidden(true)}
                        />
                    </>
                )}
            </CardImgArea>
            <CardTitle>{product.title}</CardTitle>
        </CardMainBox>
    )
};

const CardMainBox = styled(Link)`
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

const CardTitle = styled.h3`
    margin: 16px 0 0 0;
    color: #005E81;
    text-align: center;
    font-size: 26px;
    font-weight: 600;
    white-space: pre-wrap;
`;