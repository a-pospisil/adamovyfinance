import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/ui/JsonLd";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { organizationSchema, personSchema, professionalServiceSchema, websiteSchema } from "@/lib/schema";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Adam Pospíšil – financování investičních nemovitostí",
    template: "%s | Adam Pospíšil",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "Adam Pospíšil", url: SITE_URL }],
  creator: "Adam Pospíšil",
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: `${SITE_URL}/`,
    title: "Adam Pospíšil – financování investičních nemovitostí",
    description: SITE.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Adam Pospíšil – Banka vidí úvěr. Já vidím portfolio." }],
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
        <JsonLd data={[personSchema(), organizationSchema(), professionalServiceSchema(), websiteSchema()]} />
        <RevealObserver />
        <Header />
        <div id="obsah" className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
