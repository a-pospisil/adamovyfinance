import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/ui/JsonLd";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { brandSchema, organizationSchema, personSchema, professionalServiceSchema, websiteSchema } from "@/lib/schema";
import { SITE, SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Značka „Adamovy finance“ stojí v title vepředu záměrně. Je to dotaz, kterým
 * web lidé hledají, a doména mu přesně odpovídá; bez shody v title Google
 * vrací na ten dotaz Facebook a cizí firmu ADAM finance, a.s.
 */
const HOME_TITLE = `${SITE.brand} – Adam Pospíšil | Financování investičních nemovitostí`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE.brand} – Adam Pospíšil`,
  },
  description: SITE.description,
  // Název webu pro Google (site name) se čte z og:site_name a WebSite.name.
  applicationName: SITE.brand,
  authors: [{ name: "Adam Pospíšil", url: SITE_URL }],
  creator: "Adam Pospíšil",
  publisher: SITE.brand,
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.brand,
    url: `${SITE_URL}/`,
    title: HOME_TITLE,
    description: SITE.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${SITE.brand} – Adam Pospíšil` }],
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: true, email: true, address: false },
};

export const viewport: Viewport = {
  themeColor: "#f1e7d0",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* Označí dokument dřív, než se vykreslí obsah: jen tehdy se smí obsah
            skrýt kvůli animaci odhalení. Bez JS zůstane všechno viditelné. */}
        <Script id="js-flag" strategy="beforeInteractive">
          {`document.documentElement.dataset.js="1"`}
        </Script>
        <JsonLd data={[personSchema(), brandSchema(), organizationSchema(), professionalServiceSchema(), websiteSchema()]} />
        <RevealObserver />
        <Header />
        <div id="obsah" className="flex-1">
          {children}
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
