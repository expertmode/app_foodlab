import styled from "styled-components";
import LogoComp from "@/components/global/homepage/logoComp";
import ButtonComp from "@/components/global/buttonComp";
import data from "@/data/generalData.json";

export const metadata = {
  title: "FoodLab",
  description: "",
}

export default function Home() {
  return (
    <HomeBox>
      <LogoComp />
      <ButtonComp title={data.homePage.buttonTitle} link={data.homePage.buttonLink} />
    </HomeBox>
  );
}

const HomeBox = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 100%;
  height: 100%;
`;