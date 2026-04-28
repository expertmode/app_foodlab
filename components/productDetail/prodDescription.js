'use client';
import styled from "styled-components";
import { motion } from "framer-motion";
import ImageComp from "../global/imageComp";

export default function ProdDescription({ data }) {
    return (
        <MainBox>
            <DescText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {data.description}
            </DescText>
            {data.bottomImg && (
                <ImagesMainBox>
                    <CircleBox />
                    <ImgBox>
                        <ImageComp image={data.bottomImg} />
                    </ImgBox>
                </ImagesMainBox>
            )}
        </MainBox>
    )
};

const MainBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 96px;
`;

const DescText = styled(motion.p)`
    width: 90%;
    padding: 0 44px;
    font-size: 70px;
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
    color: #005E81;
`;

const CircleBox = styled.div`
    border-radius: 1000px;
    width: 754px;
    aspect-ratio: 1/1;
    background-color: #f0f0eb;
    position: absolute;
    bottom: -400px;
    left: -48px;
`;

const ImgBox = styled.div`
    display: flex;
    width: 576px;
    position: absolute;
    bottom: -128px;
    left: 0;
    transform: rotate(18deg);
`;

const ImagesMainBox = styled.div`
    width: 100%;
    height: 480px;
    overflow: hidden;
    position: relative;
`;