import styled from "styled-components";
import ImageComp from "../global/imageComp";

export default function ProdListFilterCard(props) {
    return (
        <CardBox>
            <IconBox>
                <IconImg>
                    <ImageComp image={props.icon} />
                </IconImg>
            </IconBox>
            <Title>{props.title}</Title>
        </CardBox>
    );
};

const CardBox = styled.div`
    display: flex;
    width: 248px;
    flex-direction: column;
    gap: 24px;
    flex-shrink: 0;
`;

const IconBox = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1 / 1;
    border-radius: 1000px;
    background-color: #fff;
    border: 2px solid #005E81;
    cursor: pointer;
`;

const IconImg = styled.div`
    display: flex;
    width: 35%;
`;

const Title = styled.p`
    font-size: 24px;
    font-weight: 600;
    color: #005E81;
    text-align: center;
    margin: 0;
`;