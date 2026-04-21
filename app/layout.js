import { Boldonse, DM_Sans } from "next/font/google";
import "./globals.css";
import MainLayoutComp from "@/components/global/mainLayoutComp";

const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

const boldonse = Boldonse({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-boldonse",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dm_sans.variable} ${boldonse.variable}`}>
      <body>
        <MainLayoutComp>
          {children}
        </MainLayoutComp>
      </body>
    </html>
  );
}
