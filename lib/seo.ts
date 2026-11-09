import type { Metadata } from "next";
import site from "@/data/site.json";
import { formulas, reviews } from "@/lib/catalog";
import { getDict, locales, ogLocale, type Locale } from "@/lib/i18n";
import { SERVICES_PAGES, serviceById, type ServiceId } from "@/lib/services";

export function pageMeta(lang: Locale, path: string, title: string, description: string, image = "/og.jpg"): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])) as Record<string, string>;
  languages["x-default"] = `/fr${path}`;
  return {
    title,
    description,
    alternates: { canonical: `/${lang}${path}`, languages },
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url: `/${lang}${path}`,
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

const businessId = `${site.url}/#business`;

function business(lang: Locale) {
  const d = getDict(lang);
  return {
    "@type": ["FoodEstablishment", "LocalBusiness"],
    additionalType: "https://schema.org/Caterer",
    "@id": businessId,
    name: site.name,
    description: d.meta.description,
    url: `${site.url}/${lang}`,
    image: [`${site.url}/og.jpg`, `${site.url}/media/hero/buffet-chateau-nappe-sauge.jpg`],
    logo: `${site.url}/logo.svg`,
    telephone: site.phoneIntl.replace(/\s/g, ""),
    sameAs: [site.instagram],
    servesCuisine: ["Européenne", "Française", "Marocaine", "Orientale"],
    priceRange: "€€€",
    address: { "@type": "PostalAddress", addressRegion: "Île-de-France", addressCountry: "FR" },
    areaServed: [{ "@type": "AdministrativeArea", name: "Île-de-France" }, ...site.departments.map((x) => ({ "@type": "AdministrativeArea", name: `${x.name} (${x.code})` }))],
    knowsLanguage: ["fr", "ar", "en"],
    makesOffer: SERVICES_PAGES.map((x) => ({ "@type": "Offer", itemOffered: { "@id": `${site.url}/${lang}/${x.slug}#service` } })),
    contactPoint: { "@type": "ContactPoint", telephone: site.phoneIntl.replace(/\s/g, ""), contactType: "reservations", availableLanguage: ["French", "Arabic", "English"] },
    ...(reviews.length ? { review: reviews.map((r) => ({ "@type": "Review", reviewBody: r.text, author: { "@type": "Person", name: r.author } })) } : {}),
  };
}

function serviceNode(lang: Locale, id: ServiceId) {
  const d = getDict(lang);
  const x = serviceById(id);
  const t = d.services.items[id];
  return {
    "@type": "Service",
    "@id": `${site.url}/${lang}/${x.slug}#service`,
    serviceType: id === "domicile" ? "Chef à domicile" : "Traiteur",
    name: t.eyebrow,
    description: t.metaDescription,
    url: `${site.url}/${lang}/${x.slug}`,
    provider: { "@id": businessId },
    areaServed: { "@type": "AdministrativeArea", name: "Île-de-France" },
    image: `${site.url}${x.image}`,
  };
}

function services(lang: Locale) {
  return SERVICES_PAGES.map((x) => serviceNode(lang, x.id));
}

function offerCatalog(lang: Locale) {
  const d = getDict(lang);
  return {
    "@type": "OfferCatalog",
    name: d.formules.pageTitle,
    url: `${site.url}/${lang}/formules`,
    itemListElement: formulas.map((f) => ({
      "@type": "Offer",
      name: d.formules.items[f.id].name,
      description: d.formules.items[f.id].text,
      seller: { "@id": businessId },
      ...(f.priceFrom ? { priceSpecification: { "@type": "UnitPriceSpecification", minPrice: f.priceFrom, priceCurrency: "EUR", referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "personne" } } } : {}),
    })),
  };
}

/** Traiteur + une fiche Service par formule + FAQ, dans un seul graphe JSON-LD. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      business(lang),
      ...services(lang),
      { "@type": "FAQPage", mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
}

export function formulesJsonLd(lang: Locale) {
  const d = getDict(lang);
  return {
    "@context": "https://schema.org",
    "@graph": [
      business(lang),
      offerCatalog(lang),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/${lang}` },
          { "@type": "ListItem", position: 2, name: d.formules.pageEyebrow, item: `${site.url}/${lang}/formules` },
        ],
      },
    ],
  };
}

export function serviceJsonLd(lang: Locale, id: ServiceId) {
  const d = getDict(lang);
  const x = serviceById(id);
  return {
    "@context": "https://schema.org",
    "@graph": [
      business(lang),
      serviceNode(lang, id),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: `${site.url}/${lang}` },
          { "@type": "ListItem", position: 2, name: d.services.items[id].eyebrow, item: `${site.url}/${lang}/${x.slug}` },
        ],
      },
    ],
  };
}

export const jsonLd = (data: object) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });
