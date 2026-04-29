'use client';
import styled from "styled-components";
import data from "@/data/generalData.json";
import ButtonFilter from "./buttonFilter";

export default function ProdListBanner() {
    return (
        <BannerMainBox>
            <BannerImageBox>
                <BannerText>{data.prodListPage.bannerText}</BannerText>
            </BannerImageBox>
            <ButtonFilter title={data.prodListPage.buttonText} />
        </BannerMainBox>
    )
};

const BannerMainBox = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    height: 744px;
    position: relative;
    overflow: hidden;
    background-color: #f0f0eb;
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
`;

const BannerText = styled.div`
    font-size: 80px;
    font-weight: 600;
    color: #fff;
    text-align: center;
    white-space: pre-line;
    margin: 0;
`;