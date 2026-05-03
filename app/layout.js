import { DM_Sans } from "next/font/google";
import "./globals.css";
import MainLayoutComp from "@/components/global/mainLayoutComp";
import KioskGuard from "@/components/global/kioskGuard";
import PwaRegister from "@/components/global/pwaRegister";

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
        <KioskGuard />
        <PwaRegister />
        <MainLayoutComp>
          {children}
        </MainLayoutComp>
      </body>
    </html>
  );
}

// .boldonse-regular {
//   font-family: "Boldonse", system-ui;
//   font-weight: 400;
//   font-style: normal;

