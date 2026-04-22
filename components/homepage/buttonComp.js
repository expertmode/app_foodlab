"use client";

import styled from "styled-components";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ButtonComp(props) {
    return (

        <CenterBox>
            <Link href={props.link}>
                <ButtonBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    whileHover={{ backgroundColor: "#005E81" }}
                    whileTap={{ scale: 0.95, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                >
                    {props.title}
                </ButtonBox>
            </Link>
        </CenterBox>
    )
};

const CenterBox = styled.div`
    display: flex;
    position: absolute;
    bottom: 10vh;
    z-index: 15;
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