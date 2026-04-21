import styled from "styled-components";

export default function ImageComp(props) {
    return (
        <ImgBox src={props.image} alt="" />
    )
};

const ImgBox = styled.img`
    width: 100%;
    height: auto;
    max-width: 100%;
    margin: 0;
    display: block;
`;