'use client';
import styled from 'styled-components';

// A4 portrait page wrapper — 210mm × 297mm.
// Forces a page break after each instance so puppeteer's PDF engine paginates correctly.
export default function PrintPage({ children, $bg = '#fff', $padded = false, ...rest }) {
    return (
        <Page $bg={$bg} $padded={$padded} {...rest}>
            {children}
        </Page>
    );
}

const Page = styled.div`
    width: 210mm;
    height: 297mm;
    background: ${(p) => p.$bg};
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    break-inside: avoid;
    padding: ${(p) => (p.$padded ? '14mm 12mm' : '0')};
    color: #005E81;
    font-family: var(--font-dm-sans), system-ui, sans-serif;

    &:last-child {
        page-break-after: auto;
        break-after: auto;
    }

    /* Make sure images don't exceed the page */
    img {
        max-width: 100%;
        height: auto;
    }
`;
