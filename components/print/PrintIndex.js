'use client';
import styled from 'styled-components';
import PrintPage from './PrintPage';

// Renders index entries split across as many A4 pages as needed.
// Estimate: ~22 rows per page after header.
const ROWS_PER_PAGE = 22;

export default function PrintIndex({ title, items, footer, startPage = 4 }) {
    const pages = [];
    for (let i = 0; i < items.length; i += ROWS_PER_PAGE) {
        pages.push(items.slice(i, i + ROWS_PER_PAGE));
    }
    if (!pages.length) pages.push([]);

    return (
        <>
            {pages.map((chunk, pi) => (
                <PrintPage key={pi} $padded $bg="#fff">
                    {pi === 0 && <IndexTitle>{title || 'Índice'}</IndexTitle>}
                    <Table>
                        {chunk.map((item) => (
                            <Row key={item.id}>
                                <RowNum>#{item.id}</RowNum>
                                <RowTitle>
                                    {(item.title || '').replace(/\n/g, ' ')}
                                    {item.partner ? <RowPartner> · {item.partner}</RowPartner> : null}
                                </RowTitle>
                                <RowDots />
                                <RowPage>{item.page}</RowPage>
                            </Row>
                        ))}
                    </Table>
                    <Footer>{footer}</Footer>
                </PrintPage>
            ))}
        </>
    );
}

const IndexTitle = styled.h2`
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    font-size: 36pt;
    color: #005E81;
    margin: 0 0 12mm 0;
    line-height: 1;
`;

const Table = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5mm;
`;

const Row = styled.div`
    display: flex;
    align-items: baseline;
    gap: 3mm;
    font-size: 11pt;
    color: #005E81;
    padding: 1.2mm 0;
    border-bottom: 0.4mm dotted #d6e7ee;
`;

const RowNum = styled.span`
    color: #88a8b5;
    font-weight: 600;
    font-size: 9pt;
    min-width: 14mm;
`;

const RowTitle = styled.span`
    font-weight: 600;
    flex: 0 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 130mm;
`;

const RowPartner = styled.span`
    font-weight: 400;
    color: #88a8b5;
    font-size: 10pt;
`;

const RowDots = styled.span`
    flex: 1;
    border-bottom: 0.4mm dotted #c0d3db;
    transform: translateY(-2mm);
    min-width: 6mm;
`;

const RowPage = styled.span`
    font-weight: 700;
    min-width: 12mm;
    text-align: right;
`;

const Footer = styled.div`
    position: absolute;
    bottom: 8mm;
    left: 12mm;
    right: 12mm;
    text-align: center;
    font-size: 8pt;
    color: #88a8b5;
    letter-spacing: 1px;
`;
