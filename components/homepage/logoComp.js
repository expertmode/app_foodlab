"use client";
import styled from "styled-components";
import ImageComp from "../global/imageComp";
import { motion } from "framer-motion";

export default function LogoComp(props) {
    return (
        <LogoBox>
            <AnimatedImage
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 150, damping: 10 }}
            >
                <ImageComp image={"/images/logo.png"} />
            </AnimatedImage>
        </LogoBox>
    )
};

const LogoBox = styled.div`
    display: flex;
    position: absolute;
    top: 48px;
    width: 292px;
    z-index: 15;
`;

const AnimatedImage = styled(motion.div)`
    width: 100%;
    display: flex;
    will-change: transform;
`;