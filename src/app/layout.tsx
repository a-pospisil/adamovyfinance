import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Newsreader, Schibsted_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/ui/JsonLd";
import { organizationSchema, personSchema, professionalServiceSchema, websiteSchema } from "@/lib/schema";
import { SITE, SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["italic"],
  axes: ["opsz"],
  variable: "--font-serif",
  display: "swap",
  preload: false,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Adam Pospíšil – hypotéky a financování investičních nemovitostí",
    template: "%s | Adam Pospíšil",
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: "Adam Pospíšil", url: SITE_URL }],
  creator: "Adam Pospíšil",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    url: "/",
    title: "Adam Pospíšil – hypotéky a financování investičních nemovitostí",
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
  themeColor: "#0a0d0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="cs" className={`${sans.variable} ${serif.variable} ${mono.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={[personSchema(), organizationSchema(), professionalServiceSchema(), websiteSchema()]} />
        <Header />
        <div id="obsah" className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
