'use client';
import styled from "styled-components";
import ImageComp from "./imageComp";
import { motion } from "framer-motion";

export default function LogoCompMain() {
    return (
        <HeaderBox
            initial={{ scaleX: 0.3, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{
                scaleX: { type: "spring", stiffness: 120, damping: 13 },
                opacity: { duration: 0.5, ease: "easeOut" }
            }}
            style={{ transformOrigin: "center" }}
        >
            <LogoBox
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.5 }}
            >
                <ImageComp image={"/images/logoSmall.png"} />
            </LogoBox>
            <OtherLogoBox
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.7 }}
            >
                <ImageComp image={"/images/via_food_logo.png"} />
            </OtherLogoBox>
        </HeaderBox>
    )
};

const HeaderBox = styled(motion.div)`
    display: flex;
    position: absolute;
    align-items: center;
    top: 48px;
    width: 90%;
    border: 8px solid white;
    border-radius: 1000px;
    background-color: white;
    overflow: hidden;
    gap: 48px;
    padding: 0 48px;
    box-sizing: border-box;
    z-index: 20;
`;

const LogoBox = styled(motion.div)`
    display: flex;
    width: 208px;
`;

const OtherLogoBox = styled(motion.div)`
    display: flex;
    width: 304px;
    height: fit-content;
    margin-left: auto;
`;