'use client';
import styled from "styled-components";
import ImageComp from "../global/imageComp";
import { motion } from "framer-motion";

export default function ProdFooter() {
    return (
        <AnimBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <MainBox>
                <ImageBox>
                    <ImageComp image="/images/barralogos.png" />
                </ImageBox>
            </MainBox>
        </AnimBox>
    )
}

const MainBox = styled.div`
    display: flex;
    width: 100%;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #005E81;
`;

const AnimBox = styled(motion.div)`
    width: 100%;
    position: fixed;
    bottom: 0;
    z-index: 10;
`;

const ImageBox = styled.div`
    display: flex;
    width: 312px;
`;