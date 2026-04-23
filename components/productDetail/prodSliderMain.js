'use client';
import styled from "styled-components";
import { motion } from "framer-motion";
import { useState } from "react";
import ProdSliderCard from "./prodSliderCard";

export default function ProdSliderMain({ data }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardWidth = 664;
    const gap = 32;
    const kioskWidth = 1080;
    const containerPadding = 44;
    const viewportWidth = kioskWidth - (containerPadding * 2); // 992px
    const nextCardVisible = cardWidth * 0.1; // ~66px
    const totalVisible = cardWidth + gap + nextCardVisible; // 762px
    const centerPadding = (viewportWidth - totalVisible) / 2; // ~115px
    const totalWidth = data.infoCards.length * (cardWidth + gap);

    const handleDotClick = (index) => {
        setCurrentIndex(index);
    };

    let offset = 0;
    if (currentIndex === 0) {
        // Primeiro slide: encostado à esquerda
        offset = 0;
    } else if (currentIndex === data.infoCards.length - 1) {
        // Último slide: encostado à direita
        offset = -(totalWidth - viewportWidth);
    } else {
        // Slides intermédios: centrados
        offset = -(currentIndex * (cardWidth + gap)) + centerPadding;
    }

    return (
        <SliderMainBox>
            <SliderTitle>{data.sliderTitle}</SliderTitle>
            <SliderContainer>
                <SliderContent
                    drag="x"
                    dragConstraints={{
                        right: 0,
                        left: -(totalWidth - viewportWidth)
                    }}
                    dragElastic={0.2}
                    initial={{ x: 0 }}
                    animate={{ x: offset }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onDragEnd={(e, info) => {
                        const newIndex = Math.round(Math.abs(info.offset.x / (cardWidth + gap)));
                        const clampedIndex = Math.min(Math.max(0, newIndex), data.infoCards.length - 1);
                        setCurrentIndex(clampedIndex);
                    }}
                >
                    {data.infoCards.map((card, index) => (
                        <CardWrapper key={index}>
                            <ProdSliderCard desc={card.desc} img={card.image} />
                        </CardWrapper>
                    ))}
                </SliderContent>
            </SliderContainer>
            <DotsContainer>
                {data.infoCards.map((_, index) => (
                    <Dot
                        key={index}
                        $isActive={currentIndex === index}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </DotsContainer>
        </SliderMainBox>
    )
};

const SliderMainBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow: hidden;
    background-color: #f0f0eb;
`;

const SliderTitle = styled.h2`
    font-size: 90px;
    font-weight: 600;
    white-space: pre-line;
    color: #005E81;
    line-height: 1;
    margin: 0 0 80px 0;
    padding: 0 44px 0 44px;
`;

const SliderContainer = styled.div`
    width: 100%;
    overflow: hidden;
    padding: 0 44px 72px 44px;
`;

const SliderContent = styled(motion.div)`
    display: flex;
    gap: 32px;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }
`;

const CardWrapper = styled.div`
    flex: 0 0 664px;
    display: flex;
`;

const DotsContainer = styled.div`
    display: flex;
    gap: 12px;
    justify-content: center;
    padding: 32px 0;
`;

const Dot = styled.button`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background-color: ${(props) => (props.$isActive ? "#005E81" : "#ccc")};
    transition: background-color 0.3s ease;

    &:hover {
        background-color: ${(props) => (props.$isActive ? "#005E81" : "#999")};
    }
`;