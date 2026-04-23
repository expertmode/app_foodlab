import styled from "styled-components";
import LogoComp from "@/components/homepage/logoComp";
import ButtonComp from "@/components/homepage/buttonComp";
import data from "@/data/generalData.json";
import BannersData from "@/data/bannersData.json";
import BannersMain from "@/components/homepage/banners/bannersMain";

export const metadata = {
  title: "FoodLab",
  description: "",
}

export default function Home() {
  return (
    <HomeBox>
      <LogoComp />
      <ButtonComp title={data.homePage.buttonTitle} link={data.homePage.buttonLink} />
      <BannersMain array={BannersData.banners} />
    </HomeBox>
  );
}

const HomeBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 100%;
  height: 1920px;
`;