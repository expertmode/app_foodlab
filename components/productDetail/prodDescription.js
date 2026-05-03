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
                    <CircleImage>
                        <ImageComp image={data.bottomImg} />
                    </CircleImage>
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
    padding-bottom: 96px;
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

const ImagesMainBox = styled.div`
    width: 100%;
    padding: 64px 0;
    display: flex;
    justify-content: center;
`;

const CircleImage = styled.div`
    width: 600px;
    aspect-ratio: 1 / 1;
    border-radius: 50%;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
`;