"use client";

import styled from "styled-components";
import { usePathname } from "next/navigation";

export default function MainLayoutComp({ children }) {
    const pathname = usePathname();
    // /print routes are A4 layouts rendered by puppeteer — they need to escape the fixed kiosk width
    if (pathname?.startsWith('/print')) return <>{children}</>;
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

`;