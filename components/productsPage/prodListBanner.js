'use client';
import { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import data from "@/data/generalData.json";
import ButtonFilter from "./buttonFilter";
import ImageComp from "../global/imageComp";
import ProdListFilterComp from "./prodListFilterComp";

export default function ProdListBanner() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <BackColorDiv>
            <BannerMainBox $isOpen={isDrawerOpen}>
                <ImageWrapper>
                    <BannerImageBox>
                        <BannerText>{data.prodListPage.bannerText}</BannerText>
                    </BannerImageBox>
                </ImageWrapper>
                <StyledDrawerMainBox
                    initial={{ y: -900 }}
                    animate={{ y: isDrawerOpen ? 0 : -900 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <ProdListFilterComp isOpen={isDrawerOpen} />
                    <ImageBox>
                        <ImageComp image={"/images/triangleInv.png"} />
                    </ImageBox>
                </StyledDrawerMainBox>
                <ButtonFilter title={data.prodListPage.buttonText} onClickFilter={toggleDrawer} isOpen={isDrawerOpen} />
            </BannerMainBox>
        </BackColorDiv>
    )
};

const BackColorDiv = styled.div`
    width: 100%;
    background-color: #f0f0eb;
`;

const StyledDrawerMainBox = styled(motion.div)`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: flex-end;
    align-items: flex-start;
    height: 100%;
    position: absolute;
    background-color: white;
    z-index: 5;
    top: 0;
`;

const ImageBox = styled.div`
    display: flex;
    width: 100%;
`;

const BannerMainBox = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    min-height: ${props => props.$isOpen ? '1360px' : '744px'};
    position: relative;
    overflow: visible;
    transition: min-height 0.3s ease;
`;

const ImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    height: 744px;
`;

const BannerImageBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 110%;
    height: 696px;
    overflow: hidden;
    position: absolute;
    background-color: #005E81;
    top: 0;
    border-radius: 0 0 1000px 1000px;
    padding-top: 160px;
    z-index: 10;
`;

const BannerText = styled.div`
    font-size: 80px;
    font-weight: 600;
    color: #fff;
    text-align: center;
    white-space: pre-line;
    margin: 0;
`;