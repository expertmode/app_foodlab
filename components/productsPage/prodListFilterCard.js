import styled from "styled-components";
import { motion } from "framer-motion";
import ImageComp from "../global/imageComp";
import { useFilter } from "../../contexts/FilterContext";

export default function ProdListFilterCard(props) {
    const { selectedPicto } = useFilter();
    const isSelected = selectedPicto === props.pictoKey;

    return (
        <CardBox>
            <IconBoxMotion
                $isSelected={isSelected}
                animate={{
                    backgroundColor: isSelected ? "#005E81" : "#fff",
                    borderColor: "#005E81",
                }}
                transition={{ duration: 0.3 }}
            >
                <IconImg $isSelected={isSelected}>
                    <ImageComp image={props.icon} />
                </IconImg>
            </IconBoxMotion>
            <Title>{props.title}</Title>
        </CardBox>
    );
};

const CardBox = styled.div`
    display: flex;
    width: 224px;
    flex-direction: column;
    gap: 24px;
    flex-shrink: 0;
`;

const IconBoxMotion = styled(motion.div)`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1;
    border-radius: 1000px;
    background-color: #fff;
    border: 5px solid #005E81;
    cursor: pointer;
`;

const IconImg = styled.div`
    display: flex;
    width: 35%;

    ${(props) =>
        props.$isSelected &&
        `
        filter: brightness(0) invert(1);
    `}
`;

const Title = styled.p`
    font-size: 24px;
    font-weight: 600;
    color: #005E81;
    text-align: center;
    margin: 0;
`;