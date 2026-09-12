export const SITE_URL = "https://adamovyfinance.cz";

export const SITE = {
  name: "Adam Pospíšil",
  domain: "adamovyfinance.cz",
  url: SITE_URL,
  tagline: "Hypotéky a financování investičních nemovitostí",
  description:
    "Adam Pospíšil – finanční poradce, hypoteční specialista a investor. Financování investičních nemovitostí, které počítá s celým portfoliem, ne s jedním úvěrem. Workshopy pro investory.",
  locale: "cs_CZ",
  phone: "+420 775 313 596",
  phoneHref: "tel:+420775313596",
  whatsapp: "https://wa.me/420775313596",
  email: "adam.pospisil@egfin.cz",
  instagram: "https://www.instagram.com/adampospis/",
  instagramHandle: "@adampospis",
  linkedin: "https://www.linkedin.com/in/adam-pospisil/",
  office: {
    street: "Palackého 715/15",
    city: "Praha 1",
    zip: "110 00",
    country: "CZ",
    mapUrl: "https://maps.google.com/?q=Palackého+715/15,+110+00+Praha+1",
  },
  responseTime: "do 48 pracovních hodin",
} as const;

export const EGFIN = {
  name: "Evergreen Finance",
  legalName: "Evergreen finance, s.r.o.",
  ico: "07714769",
  url: "https://www.egfin.cz",
  calculators: "https://www.egfin.cz/kalkulacky",
  portfolioAnalysis: "https://www.egfin.cz/analyza-portfolia",
  caseStudies: "https://www.egfin.cz/pripadove-studie",
  workshops: "https://www.egfin.cz/workshopy",
  workshopBeginners: "https://www.egfin.cz/workshopy/zacatecnici",
  workshopAdvanced: "https://www.egfin.cz/workshopy/pokrocile",
  linkedin: "https://www.linkedin.com/company/71705854/",
} as const;

/** Verified figures (egfin.cz, workshop pages, 2026). Update here only. */
export const FACTS = {
  yearsInFinance: 15,
  sinceYear: 2010,
  specialisationSince: 2021,
  ownPortfolioSince: 2022,
  loans2025Mil: 620,
  loansTotalBil: 3,
  clients: 500,
  bankPartners: 14,
  teamSpecialists: 6,
  workshopAlumni: 100,
  workshopCapacity: 30,
  googleRating: "5,0",
  googleReviews: 31,
} as const;

/** ČNB recommendation effective 1 April 2026 (source: ČNB press release). */
export const CNB_2026 = {
  effectiveFrom: "1. 4. 2026",
  investmentLtv: 70,
  investmentDti: 7,
  ownHomeLtv: 80,
  ownHomeLtvUnder36: 90,
} as const;

export const NAV = [
  { href: "/financovani", label: "Financování" },
  { href: "/workshopy", label: "Workshopy" },
  { href: "/pripadove-studie", label: "Případové studie" },
  { href: "/o-adamovi", label: "O Adamovi" },
  { href: "/nastroje", label: "Nástroje" },
  { href: "/kontakt", label: "Kontakt" },
] as const;
