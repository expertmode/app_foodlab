import styled from "styled-components";
import { motion } from "framer-motion";
import ProdListFilterCard from "./prodListFilterCard";
import { useFilter } from "@/contexts/FilterContext";
import { trackEvent } from "@/components/global/eventTracker";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4 },
    },
};

export default function ProdListFilterComp({ isOpen, pictoFilters = [] }) {
    const { setSelectedPicto } = useFilter();

    const handleCardClick = (key) => {
        setSelectedPicto(key);
        trackEvent('filter_click', key);
    };

    return (
        <FilterScrollContainer
            variants={containerVariants}
            initial="hidden"
            animate={isOpen ? "visible" : "hidden"}
        >
            <CardCont
                key="__all"
                variants={itemVariants}
                onClick={() => handleCardClick('')}
                style={{ cursor: 'pointer' }}
            >
                <ProdListFilterCard pictoKey="" icon="/images/pictos/default.svg" title="Tudo" />
            </CardCont>
            {pictoFilters.map((item) => (
                <CardCont
                    key={item.key}
                    variants={itemVariants}
                    onClick={() => handleCardClick(item.key)}
                    style={{ cursor: 'pointer' }}
                >
                    <ProdListFilterCard pictoKey={item.key} icon={item.icon} title={item.label} />
                </CardCont>
            ))}
        </FilterScrollContainer>
    )
};

const FilterScrollContainer = styled(motion.div)`
    display: flex;
    gap: 24px;
    overflow-x: scroll;
    overflow-y: hidden;
    width: 100%;
    padding: 0 24px 80px 24px;
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

const CardCont = styled(motion.div)`
    width: 248px;
    flex-shrink: 0;
`;