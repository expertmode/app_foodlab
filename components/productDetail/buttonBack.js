"use client";

import styled from "styled-components";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function ButtonBack(props) {
    const containerRef = useRef(null);

    return (
        <CenterBox ref={containerRef}>
            <LinkAnchor href={props.link}>
                <ButtonBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    whileHover={{ backgroundColor: "#005E81" }}
                    whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                >
                    {props.title}
                </ButtonBox>
            </LinkAnchor>
        </CenterBox>
    )
};

const LinkAnchor = styled.a`
    text-decoration: none;
    color: inherit;
`;

const CenterBox = styled.div`
    display: flex;
    position: fixed;
    top: 100px;
    right: 64px;
    z-index: 50;
`;

const ButtonBox = styled(motion.div)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 40px;
    background-color: #FFB40F;
    border-radius: 300px;
    font-size: 32px;
    color: #FFFFFF;
`;