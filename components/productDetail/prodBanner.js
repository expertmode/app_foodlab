'use client';
import styled from "styled-components";
import { motion } from "framer-motion";
import ImageComp from "../global/imageComp";

export default function ProdBanner({ data }) {
    return (
        <BannerMainBox>
            {/* <BannerImage image={data.imgBg} /> */}
            <BannerImageBox>
                <Image
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <ImageComp image={data.imgBg} />
                </Image>
            </BannerImageBox>
            <ProdImgBox
                $imgSize={data.imgSize}
                $imgScale={data.imgScaleDetail ?? data.imgScale}
                $offsetX={data.imgOffsetXDetail ?? data.imgOffsetX}
                $offsetY={data.imgOffsetYDetail ?? data.imgOffsetY}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 12, duration: 0.15, delay: 0.2 }}
            >
                <ImageComp image={data.imgProd} />
            </ProdImgBox>
        </BannerMainBox>
    )
};

const BannerMainBox = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
    height: 900px;
    position: relative;
    overflow: hidden;
    background-color: #f0f0eb;
`;

const BannerImageBox = styled.div`
    width: 110%;
    height: 696px;
    overflow: hidden;
    position: absolute;
    top: 0;
    border-radius: 0 0 1000px 1000px;
`;

const Image = styled(motion.div)`
    display: flex;
    width: 100%;
    height: 100%;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
`;

const ProdImgBox = styled(motion.div)`
    display: flex;
    width: ${props => props.$imgSize || '560px'};
    transform: translate(${props => props.$offsetX ?? 0}%, ${props => -(props.$offsetY ?? 0)}%) scale(${props => props.$imgScale ?? 1});
    transform-origin: bottom left;
    position: absolute;
    bottom: 24px;
    left: 64px;
`;