"use client";
import styled from "styled-components";
import { motion } from "framer-motion";
import ProdPictoCard from "./prodPictoCard";
import { getPictoIcon } from "./pictoIcons";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

export default function ProdPictos({ data }) {
    return (
        <MainBox
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
            {data.pictos.map((picto, index) => (
                <PictoItem key={index} variants={itemVariants}>
                    <ProdPictoCard text={picto.text} img={getPictoIcon(picto.text)} />
                </PictoItem>
            ))}
        </MainBox>
    )
};

const MainBox = styled(motion.div)`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #f0f0eb;
    width: 100%;
    padding: 128px 44px;
    gap: 32px;
    box-sizing: border-box;

    > * {
        flex: 0 0 calc(25% - 24px);
        max-width: calc(25% - 24px);
    }
`;

const PictoItem = styled(motion.div)`
    display: flex;
`;