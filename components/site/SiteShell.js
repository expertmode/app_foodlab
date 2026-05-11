'use client';
import styled from 'styled-components';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function SiteShell({ children }) {
    return (
        <Shell>
            <SiteHeader />
            <Main>{children}</Main>
            <SiteFooter />
        </Shell>
    );
}

const Shell = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #fafbfc;
`;

const Main = styled.main`
    flex: 1;
    width: 100%;
`;
