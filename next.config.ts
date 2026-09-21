import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    deviceSizes: [480, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Legacy/alternate paths people may type or that were linked historically.
      { source: "/workshop", destination: "/workshopy", permanent: true },
      // Příběh, timeline i principy jsou nově přímo na homepage.
      { source: "/o-adamovi", destination: "/", permanent: true },
      { source: "/o-mne", destination: "/", permanent: true },
      { source: "/pripadove-studie", destination: "/", permanent: true },
      { source: "/kalkulacky", destination: "/nastroje", permanent: true },

      // Adresy původního WordPressu na adamovyfinance.cz. Google je pořád drží
      // v indexu (ověřeno u /uspory-a-investice/) a dnes na nich dostává 404 —
      // tedy přesně na URL, které nesly jméno „Adamovy finance“ v titulku.
      // Definitivní seznam patří vytáhnout ze Search Console → Stránky →
      // „Nenalezeno (404)“ a doplnit sem.
      { source: "/uspory-a-investice", destination: "/nastroje", permanent: true },
      { source: "/hypoteky", destination: "/financovani", permanent: true },
      { source: "/hypoteka", destination: "/financovani", permanent: true },
      { source: "/investice", destination: "/financovani", permanent: true },
      { source: "/sluzby", destination: "/financovani", permanent: true },
      { source: "/pojisteni", destination: "/kontakt", permanent: true },
      { source: "/blog", destination: "/", permanent: true },
      { source: "/reference", destination: "/", permanent: true },
      { source: "/feed", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
