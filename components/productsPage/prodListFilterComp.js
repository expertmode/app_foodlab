import styled from "styled-components";
import data from "@/data/filtersData.json";
import ProdListFilterCard from "./prodListFilterCard";

export default function ProdListFilterComp({ isOpen }) {
    return (
        <FilterScrollContainer>
            {data.map((item) => (

                <ProdListFilterCard key={item.id} icon={item.icon} title={item.name} />

            ))}
        </FilterScrollContainer>
    )
};

const FilterScrollContainer = styled.div`
    display: flex;
    gap: 16px;
    overflow-x: scroll;
    overflow-y: hidden;
    width: 100%;
    padding: 0 24px 20px 24px;
    scroll-behavior: smooth;

    &::-webkit-scrollbar {
        height: 24px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        margin: 0 400px;
    }

    &::-webkit-scrollbar-thumb {
        background: #00749e;
        border-radius: 25px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #0099cc;
    }
`;

const CardCont = styled.div`
    width: 248px;
    flex-shrink: 0;
`;