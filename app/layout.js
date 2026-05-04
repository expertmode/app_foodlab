import { DM_Sans } from "next/font/google";
import "./globals.css";
import MainLayoutComp from "@/components/global/mainLayoutComp";
import KioskGuard from "@/components/global/kioskGuard";
import PwaRegister from "@/components/global/pwaRegister";
import WarmupCache from "@/components/global/warmupCache";
import AutoRefresh from "@/components/global/autoRefresh";
import VersionPoller from "@/components/global/versionPoller";
import StyledComponentsRegistry from "@/components/global/styledComponentsRegistry";
import TouchHint from "@/components/global/touchHint";
import IdleRedirect from "@/components/global/idleRedirect";
import ProdFooter from "@/components/productsPage/prodFooter";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata = {
  title: "Foodlab",
  manifest: "/manifest.json",
  themeColor: "#005E81",
  viewport: { width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dm_sans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Boldonse&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <KioskGuard />
          <PwaRegister />
          <WarmupCache />
          <AutoRefresh />
          <VersionPoller />
          <IdleRedirect />
          <MainLayoutComp>
            {children}
          </MainLayoutComp>
          <ProdFooter />
          <TouchHint />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}

// .boldonse-regular {
//   font-family: "Boldonse", system-ui;
//   font-weight: 400;
//   font-style: normal;

