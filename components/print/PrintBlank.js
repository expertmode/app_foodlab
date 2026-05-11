'use client';
import styled from 'styled-components';
import PrintPage from './PrintPage';

export default function PrintBlank({ note }) {
    return (
        <PrintPage $bg="#fff">
            {note ? (
                <NoteText>{note}</NoteText>
            ) : null}
        </PrintPage>
    );
}

const NoteText = styled.div`
    position: absolute;
    top: 28mm;
    left: 22mm;
    font-size: 10pt;
    color: #999;
    letter-spacing: 1px;
    text-transform: uppercase;
`;
