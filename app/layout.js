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
};

// Default viewport — server-rendered. The inline script in <head> may override it
// at parse time for non-kiosk visits on screens narrower than 1080px (the kiosk's
// design width) so the existing layout auto-fits the device instead of overflowing.
export const viewport = {
  themeColor: "#005E81",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt" translate="no" className={`${dm_sans.variable} notranslate`}>
      <head>
        <meta name="google" content="notranslate" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Boldonse&display=swap" rel="stylesheet" />
        {/* Auto-fit the kiosk 1080px design onto narrower public-site viewports (e.g. phones).
            Skipped on /admin, /print, and when the kiosk flag is active. Runs before paint
            to avoid layout flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var path = location.pathname || '';
              if (path.indexOf('/admin') === 0 || path.indexOf('/print') === 0) return;
              var qs = new URLSearchParams(location.search);
              if (qs.get('kiosk') === '0') localStorage.removeItem('kiosk');
              if (qs.get('kiosk') === '1') localStorage.setItem('kiosk', '1');
              var isKiosk = localStorage.getItem('kiosk') === '1';
              if (isKiosk) return;
              if (window.innerWidth >= 1080) return;
              var scale = window.innerWidth / 1080;
              var meta = document.querySelector('meta[name="viewport"]');
              if (!meta) { meta = document.createElement('meta'); meta.name='viewport'; document.head.appendChild(meta); }
              meta.setAttribute('content', 'width=1080, initial-scale=' + scale.toFixed(4) + ', minimum-scale=' + scale.toFixed(4) + ', maximum-scale=5, user-scalable=yes');
            }catch(e){}})();`,
          }}
        />
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

