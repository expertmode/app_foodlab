import styled from "styled-components";
import ImageComp from "../global/imageComp";

export default function ProdPictoCard({ text, img }) {
    return (
        <CardBox>
            <ImageBox>
                <ImageComp image={img} />
            </ImageBox>
            <Text>{text}</Text>
        </CardBox>
    )
}

const CardBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 24px;
`;

const ImageBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    aspect-ratio: 1;
    border-radius: 500px;
    background-color: #005E81;
    padding: 28px;
    box-sizing: border-box;
    overflow: hidden;
`;

const Text = styled.p`
    font-size: 22px;
    font-weight: 600;
    margin: 0;
    text-align: center;
    white-space: pre-line;
    color: #005E81;
    line-height: 1.2;
`;