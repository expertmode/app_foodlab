'use client';
import styled from "styled-components";
import { useState, useEffect } from "react";
import BannerTypeOne from "./bannerTypeOne";

export default function BannersMain({ array }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!array || array.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % array.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [array]);

    if (!array || array.length === 0) return null;

    const currentBanner = array[currentIndex];

    return (
        <BannersContainer>
            <BannerTypeOne data={currentBanner} />
        </BannersContainer>
    );
}

const BannersContainer = styled.div`
    width: 100%;
    position: relative;
    overflow: hidden;
    height: 100%;
`;