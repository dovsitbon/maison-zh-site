import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Jost } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import site from "@/data/site.json";
import { dirOf, getDict, isLocale, locales } from "@/lib/i18n";
import { Providers } from "@/components/providers";
import { Announcement } from "@/components/Announcement";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Intro } from "@/components/Intro";
import { MobileBar } from "@/components/MobileBar";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

// Polices auto-hébergées par next/font (servies depuis le site, aucune requête vers Google)
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const jost = Jost({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jost", display: "swap" });
// Amiri réduite aux caractères du site (scripts/amiri-subset.py) : ≈ 100 Ko au lieu de 200
const amiri = localFont({
  src: [
    { path: "../fonts/amiri-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/amiri-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-amiri",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  formatDetection: { telephone: false },
  // Traduction automatique des navigateurs bloquée : seules les langues du site sont proposées
  other: { google: "notranslate" },
};

export const viewport: Viewport = { themeColor: "#faf6ee", width: "device-width", initialScale: 1 };

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

const introScript = `document.documentElement.classList.add("js");try{if(sessionStorage.getItem("maisonzh-intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-seen")}catch(e){}`;

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <html lang={lang} dir={dirOf(lang)} translate="no" className={`${cormorant.variable} ${jost.variable} ${amiri.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="notranslate">
        <Providers lang={lang} d={d}>
          <Intro skipLabel={d.intro.skip} />
          <Announcement />
          <Header />
          <main id="main">{children}</main>
          <Footer lang={lang} d={d} />
          <MobileBar lang={lang} d={d} />
          <WhatsAppFloat label={d.whatsapp.float} message={d.whatsapp.hello} />
        </Providers>
      </body>
    </html>
  );
}
