"use client";

import styled from "styled-components";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function ButtonFilter(props) {
    const containerRef = useRef(null);

    return (
        <CenterBox ref={containerRef}>
            <ButtonBox
                onClick={props.onClickFilter}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: props.isOpen ? "#00749e" : "#FFB40F"
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 17 } }}
            >
                {props.isOpen ? "Fechar" : props.title}
            </ButtonBox>
        </CenterBox>
    )
};

const CenterBox = styled.div`
    display: flex;
    position: absolute;
    top: 560px;
    z-index: 20;
`;

const ButtonBox = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 88px;
    background-color: #FFB40F;
    border-radius: 300px;
    font-size: 32px;
    color: #FFFFFF;
    cursor: pointer;
`;