import { site } from "./site";

/**
 * JSON-LD structured-data generators. Google reads these to build rich results
 * (knowledge panel, sitelinks, local pack). Output gets injected via a <script
 * type="application/ld+json"> tag on each page.
 *
 * https://developers.google.com/search/docs/appearance/structured-data
 */

const personId = `${site.url}/#person`;
const orgId = `${site.url}/#organization`;
const localBusinessId = `${site.url}/#localbusiness`;

/** Person schema — Danny himself. Drives the knowledge panel for "Danny West DJ". */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: ["Danny West", "DJ Danny West"],
    jobTitle: "DJ, Mix Show Coordinator, Talent Booker",
    description: site.description,
    url: site.url,
    image: `${site.url}/og-image.jpg`,
    worksFor: [
      {
        "@type": "Organization",
        name: "Dallas Cowboys",
        url: "https://www.dallascowboys.com",
      },
      {
        "@type": "Organization",
        name: "SiriusXM",
        url: "https://www.siriusxm.com",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    sameAs: [
      site.socials.instagram,
      site.socials.tiktok,
    ],
  };
}

/** LocalBusiness schema — the booking business. Drives local-pack + maps results. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MusicGroup"],
    "@id": localBusinessId,
    name: site.name,
    image: `${site.url}/og-image.jpg`,
    url: site.url,
    description: site.description,
    priceRange: site.priceRange,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: site.areaServed.map((a) => ({ "@type": "City", name: a })),
    founder: { "@id": personId },
    member: { "@id": personId },
    knowsAbout: [
      "Wedding DJ",
      "Corporate event DJ",
      "Club DJ",
      "Latin music",
      "Open format",
      "Hip-hop",
      "House",
      "Top 40",
    ],
    makesOffer: {
      "@type": "Offer",
      name: "DJ Booking",
      description: "Wedding, corporate, private, and club DJ bookings — quoted per event by inquiry",
      priceCurrency: "USD",
      eligibleQuantity: { "@type": "QuantitativeValue", minValue: 1 },
      availability: "https://schema.org/InStock",
    },
  };
}

/** Website schema — for the SearchAction / sitelinks search box. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    publisher: { "@id": personId },
  };
}

/** City-specific service schema — used on /dj-dallas and /dj-fort-worth. */
export function cityServiceSchema(city: string, region = "TX") {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `DJ ${city}`,
    serviceType: "DJ for hire",
    provider: { "@id": localBusinessId },
    areaServed: { "@type": "City", name: `${city}, ${region}` },
    description: `Professional DJ services in ${city}, ${region}. Weddings, corporate events, private parties, clubs. Bookings by inquiry.`,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

/** Service-specific schema — used on /services/weddings, /services/quinceaneras, etc. */
export function serviceSchema(opts: {
  name: string;
  description: string;
  serviceType?: string;
  areaServed?: string[];
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    serviceType: opts.serviceType ?? opts.name,
    provider: { "@id": localBusinessId },
    areaServed: (opts.areaServed ?? site.areaServed).map((a) => ({
      "@type": "City",
      name: a,
    })),
    description: opts.description,
    url: opts.url,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
}

/** Helper for FAQPage schema — boosts featured snippets in search. */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

/** Renders a JSON-LD script tag for any schema object(s). */
export function jsonLd(schemas: object | object[]): string {
  const arr = Array.isArray(schemas) ? schemas : [schemas];
  // Single object stringify (cleaner) when one item, else array.
  return JSON.stringify(arr.length === 1 ? arr[0] : arr);
}
