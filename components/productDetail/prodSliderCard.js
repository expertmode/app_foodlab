import styled from "styled-components";
import ImageComp from "../global/imageComp";

export default function ProdSliderCard({ desc, img }) {
    return (
        <CardBox>
            <ImageBox $img={img} />
            <Text>{desc}</Text>
        </CardBox>
    )
};

const CardBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 664px;
    overflow: hidden;
    border-radius: 48px;
    background-color: #fff;
    gap: 40px;
    padding-bottom: 40px;
`;

const ImageBox = styled.div`
    display: flex;
    width: 100%;
    height: 448px;
    background-image: url(${(props) => props.$img});
    background-size: cover;
    background-position: center;
`;

const Text = styled.p`
    font-size: 40px;
    font-weight: 600;
    margin: 0;
    text-align: center;
    white-space: pre-line;
    color: #005E81;
    line-height: 1.2;
`;