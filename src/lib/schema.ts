import { EGFIN, SITE, SITE_URL } from "@/lib/site";

export const PERSON_ID = `${SITE_URL}/#adam-pospisil`;
export const ORG_ID = `${SITE_URL}/#evergreen-finance`;
/** „Adamovy finance“ jako samostatná entita — pod tímhle jménem web lidé hledají. */
export const BRAND_ID = `${SITE_URL}/#adamovy-finance`;
const SERVICE_ID = `${SITE_URL}/#service`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Adam as the central entity of the site (personal brand). */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Adam Pospíšil",
    givenName: "Adam",
    familyName: "Pospíšil",
    honorificPrefix: "Bc.",
    url: SITE_URL,
    image: `${SITE_URL}/images/adam-suit.jpg`,
    jobTitle: ["Finanční poradce", "Hypoteční specialista", "Specialista na financování investičních nemovitostí", "Investor", "Lektor"],
    description:
      "Finanční poradce a hypoteční specialista zaměřený na financování investičních nemovitostí. Zakladatel Evergreen Finance, investor do nájemních nemovitostí a lektor workshopů pro investory.",
    worksFor: { "@id": ORG_ID },
    affiliation: { "@id": ORG_ID },
    brand: { "@id": BRAND_ID },
    email: SITE.email,
    telephone: SITE.phone,
    knowsAbout: [
      "hypotéky",
      "hypoteční úvěry",
      "investiční hypotéka",
      "financování investičních nemovitostí",
      "financování realitního portfolia",
      "refinancování hypotéky",
      "financování nemovitostí přes s.r.o.",
      "bankovní metodiky",
      "LTV, DTI, DSTI, DSCR",
    ],
    knowsLanguage: "cs",
    nationality: { "@type": "Country", name: "Česká republika" },
    homeLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Praha", addressCountry: "CZ" } },
    sameAs: [SITE.facebook, SITE.instagram, SITE.linkedin, `${EGFIN.url}/o-nas`],
  };
}

/**
 * Značka „Adamovy finance“. Bez téhle entity nemá Google na dotaz „Adamovy
 * finance“ co nabídnout a spáruje ho s nejbližší firmou v rejstříku
 * (ADAM finance, a.s.). `sameAs` drží pohromadě web, Facebook a Instagram,
 * které dneska Google vidí jako tři různé věci.
 */
export function brandSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": BRAND_ID,
    name: SITE.brand,
    alternateName: "Adam Pospíšil",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og.jpg`,
    slogan: "Banka vidí úvěr. Já vidím portfolio.",
    description:
      "Adamovy finance je osobní značka Adama Pospíšila, hypotečního specialisty na financování investičních nemovitostí. Financování realizuje ve společnosti Evergreen Finance.",
    sameAs: [SITE.facebook, SITE.instagram, SITE.linkedin],
  };
}

/** Evergreen Finance – the company Adam founded (links the personal brand to the corporate brand). */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: EGFIN.name,
    legalName: EGFIN.legalName,
    url: EGFIN.url,
    founder: { "@id": PERSON_ID },
    identifier: { "@type": "PropertyValue", propertyID: "IČO", value: EGFIN.ico },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.office.street,
      addressLocality: SITE.office.city,
      postalCode: SITE.office.zip,
      addressCountry: "CZ",
    },
    sameAs: [EGFIN.linkedin],
  };
}

/** Adam's advisory service as a ProfessionalService. */
export function professionalServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "FinancialService"],
    "@id": SERVICE_ID,
    name: `${SITE.brand} – Adam Pospíšil`,
    alternateName: "Adam Pospíšil",
    url: SITE_URL,
    // Organization-level logo — tohle Google čte při stavbě entity firmy.
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og.jpg`,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "Konzultace zdarma",
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    brand: { "@id": BRAND_ID },
    parentOrganization: { "@id": ORG_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.office.street,
      addressLocality: SITE.office.city,
      postalCode: SITE.office.zip,
      addressCountry: "CZ",
    },
    areaServed: { "@type": "Country", name: "Česká republika" },
    // serviceType patří na Service, ne na LocalBusiness — proto přes makesOffer.
    makesOffer: [
      "Hypoteční poradenství",
      "Investiční hypotéka",
      "Financování investičních nemovitostí",
      "Refinancování hypotéky",
      "Financování nemovitostí přes s.r.o.",
      "Financování realitního portfolia",
      "Workshop financování nemovitostí",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, serviceType: name, provider: { "@id": PERSON_ID } },
    })),
    knowsAbout: ["hypotéky", "investiční nemovitosti", "bankovní metodiky", "financování portfolia"],
    sameAs: [SITE.facebook, SITE.instagram, SITE.linkedin],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    // Google bere název webu ve výsledcích právě odsud (+ z og:site_name).
    name: SITE.brand,
    alternateName: "Adam Pospíšil",
    inLanguage: "cs",
    about: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };
}

/** Homepage je profil Adama — ProfilePage to říká vyhledávačům explicitně. */
export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profil`,
    url: SITE_URL,
    name: `${SITE.brand} – Adam Pospíšil`,
    alternateName: SITE.brand,
    inLanguage: "cs",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Úvod", item: SITE_URL },
      ...items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: it.name,
        item: `${SITE_URL}${it.path}`,
      })),
    ],
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}
