import styled from "styled-components";
import LogoComp from "@/components/homepage/logoComp";
import ButtonComp from "@/components/homepage/buttonComp";
import data from "@/data/generalData.json";
import BannersMain from "@/components/homepage/banners/bannersMain";
import { readBanners } from "@/lib/banners";
import InstallButton from "@/components/global/installButton";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "FoodLab",
  description: "",
}

export default async function Home() {
  const banners = await readBanners();
  return (
    <HomeBox>
      <LogoComp />
      <ButtonComp title={data.homePage.buttonTitle} link={data.homePage.buttonLink} />
      <BannersMain array={banners} />
      <InstallCorner>
        <InstallButton label="Instalar app" />
      </InstallCorner>
    </HomeBox>
  );
}

const InstallCorner = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 100;
  opacity: 0.5;
  transition: opacity 0.2s;

  &:hover { opacity: 1; }

  @media (display-mode: standalone), (display-mode: fullscreen) {
    display: none;
  }
`;

const HomeBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 100%;
  height: 1920px;
`;