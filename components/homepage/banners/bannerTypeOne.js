import styled from "styled-components";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function BannerTypeOne({ data }) {
    const [prevImage, setPrevImage] = useState(data.image);

    useEffect(() => {
        // A imagem anterior sai quando termina a animação
        const timer = setTimeout(() => {
            setPrevImage(data.image);
        }, 2000);

        return () => clearTimeout(timer);
    }, [data.id]);

    return (
        <BannerBox>
            <AnimatePresence mode="wait">
                <div key={`banner-${data.id}`} style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {/* Imagem anterior - faz fade out enquanto os textos saem */}
                    <AnimatePresence>
                        {prevImage !== data.image && (
                            <BannerImage
                                key={`prev-image`}
                                $image={prevImage}
                                initial={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                style={{ zIndex: 2 }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Imagem nova - já visível desde o início (por baixo) */}
                    <BannerImage
                        $image={data.image}
                        style={{ zIndex: 1, opacity: 1 }}
                    />

                    {/* Textos do item atual */}
                    <TextContainer>
                        <TextOne
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
                        >
                            {data.text1}
                        </TextOne>
                        <TextTwo
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
                        >
                            {data.text2}
                        </TextTwo>
                        <TextThree
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: "easeOut", delay: 0.9 }}
                        >
                            {data.text3}
                        </TextThree>
                    </TextContainer>
                </div>
            </AnimatePresence>
        </BannerBox>
    );
}

const BannerBox = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
`;

const BannerImage = styled(motion.div)`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.$image});
    background-size: cover;
    background-position: center;
`;

const TextContainer = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 10;
    position: relative;
`;

const TextOne = styled(motion.p)`
    margin: 0;
    font-size: 80px;
    color: #FFFFFF;
    text-align: center;
    z-index: 10;
    position: relative;
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    line-height: 1.4;
    text-transform: uppercase;
`;

const TextTwo = styled(motion.p)`
    margin: 0;
    font-size: 120px;
    color: #FFFFFF;
    text-align: center;
    z-index: 10;
    position: relative;
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    line-height: 1.4;
    text-transform: uppercase;

`;

const TextThree = styled(motion.p)`
    margin: 0;
    font-size: 85px;
    color: #FFFFFF;
    text-align: center;
    z-index: 10;
    position: relative;
    font-family: "Boldonse", system-ui;
    font-weight: 400;
    line-height: 1.4;
    text-transform: uppercase;
`;