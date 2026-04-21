"use client";

import styled from "styled-components";

export default function MainLayoutComp({ children }) {
    return (
        <MainBox>
            {children}
        </MainBox>
    )
};

const MainBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1080px;
    height: 1920px;
`;