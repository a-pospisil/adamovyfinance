import { EGFIN, FACTS, SITE, SITE_URL } from "@/lib/site";

export const PERSON_ID = `${SITE_URL}/#adam-pospisil`;
export const ORG_ID = `${SITE_URL}/#evergreen-finance`;
export const SERVICE_ID = `${SITE_URL}/#service`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

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
    sameAs: [SITE.instagram, SITE.linkedin, `${EGFIN.url}/o-nas`],
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
    name: "Adam Pospíšil – hypotéky a financování investičních nemovitostí",
    url: SITE_URL,
    image: `${SITE_URL}/og.jpg`,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "Konzultace zdarma",
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    parentOrganization: { "@id": ORG_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.office.street,
      addressLocality: SITE.office.city,
      postalCode: SITE.office.zip,
      addressCountry: "CZ",
    },
    areaServed: { "@type": "Country", name: "Česká republika" },
    serviceType: [
      "Hypoteční poradenství",
      "Investiční hypotéka",
      "Financování investičních nemovitostí",
      "Refinancování hypotéky",
      "Financování nemovitostí přes s.r.o.",
      "Financování realitního portfolia",
      "Workshop financování nemovitostí",
    ],
    knowsAbout: ["hypotéky", "investiční nemovitosti", "bankovní metodiky", "financování portfolia"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: FACTS.googleRating.replace(",", "."),
      bestRating: "5",
      ratingCount: FACTS.googleReviews,
    },
    sameAs: [SITE.instagram, SITE.linkedin],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE.name,
    inLanguage: "cs",
    about: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
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
