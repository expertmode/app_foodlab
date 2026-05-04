'use client';
import styled from "styled-components";
import { motion } from "framer-motion";

export default function ProdTitleBox({ data }) {
    return (
        <MainBox>
            <TitleText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {data.title}
            </TitleText>
            <SubTitleText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                {data.subTitle}
            </SubTitleText>
            <PpsBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
                <PpsText>
                    {data.pps}
                </PpsText>
            </PpsBox>
        </MainBox>
    )
};

const MainBox = styled.div`
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    padding: 64px 0 64px 0;
    background-color: #f0f0eb;
    padding: 0 44px;
`;

const TitleText = styled(motion.p)`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    font-size: 90px;
    color: #005E81;
    margin: 0;
    line-height: 1.5;
    white-space: pre-line;
`;

const SubTitleText = styled(motion.p)`
    font-weight: 600;
    font-size: 40px;
    margin: 48px 0 24px 0;
    white-space: pre-line;
    color: #005E81;
`;

const PpsBox = styled(motion.div)`
    display: flex;
    width: fit-content;
    padding: 8px 24px;
    border:  2px solid #005E81;
    border-radius: 500px;
`;

const PpsText = styled.p`
    font-weight: 600;
    font-size: 24px;
    margin: 0;
    color: #005E81;
`;