import type { Metadata } from "next";
import { pageMetadata, pageUrl } from "@/lib/seo";
import { publicSiteUrl } from "@/lib/site-url";
import {
  GOLDEN_VISA_LAST_CHECKED,
  GOLDEN_VISA_ROWS,
  investPagePath,
  type InvestLocale,
  type InvestPageKey,
} from "@/lib/investment/golden-visa-2026";

/** RU↔EN pair: ru, ru-RU, en, x-default→en; canonical = self. */
export function investPairLanguages(key: InvestPageKey): Record<string, string> {
  const ru = pageUrl(investPagePath("ru", key));
  const en = pageUrl(investPagePath("en", key));
  return { ru, "ru-RU": ru, en, "x-default": en };
}

export function investMetadata(input: {
  locale: InvestLocale;
  key: InvestPageKey;
  title: string;
  description: string;
  aiDescription: string;
  aiCategory?: string;
}): Metadata {
  const path = investPagePath(input.locale, input.key);
  const base = pageMetadata({
    title: input.title,
    titleAbsolute: true,
    description: input.description,
    path,
    aiDescription: input.aiDescription,
    aiCategory: input.aiCategory ?? (input.key === "hub" ? "investment-migration" : "investment-migration-route"),
  });
  const alternates = typeof base.alternates === "object" && base.alternates ? base.alternates : {};
  // Spec titles (e.g. compare pages, 68–69 chars) must not be cut by the 60-char absolute-title fitter.
  const metadata: Metadata = {
    ...base,
    title: { absolute: input.title },
    openGraph: { ...base.openGraph, title: input.title },
    twitter: { ...base.twitter, title: input.title },
    alternates: {
      ...alternates,
      canonical: pageUrl(path),
      languages: investPairLanguages(input.key),
    },
  };
  if (input.locale === "en") {
    // pageMetadata pads short descriptions with RU copy; EN keeps the exact spec text.
    metadata.description = input.description;
    metadata.openGraph = { ...metadata.openGraph, description: input.description, locale: "en_US" };
    metadata.twitter = { ...metadata.twitter, description: input.description };
  }
  return metadata;
}

export const INVEST_ASSIST_OFFERS = {
  match: { price: 0, path: "/ru/assist" },
  routeCheck: { price: 129, path: "/ru/route-check" },
  hourly: { price: 100, path: "/ru/assist" },
} as const;

export function investServiceSchema(locale: InvestLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Emigro Assist",
    provider: { "@type": "Organization", name: "Emigro", url: publicSiteUrl() },
    serviceType: "Residence & investment-migration route planning",
    areaServed: GOLDEN_VISA_ROWS.map((row) => row.iso2),
    inLanguage: locale === "en" ? "en" : "ru-RU",
    offers: [
      {
        "@type": "Offer",
        name: "Assist match",
        price: String(INVEST_ASSIST_OFFERS.match.price),
        priceCurrency: "EUR",
        url: pageUrl(INVEST_ASSIST_OFFERS.match.path),
      },
      {
        "@type": "Offer",
        name: "Route Check",
        price: String(INVEST_ASSIST_OFFERS.routeCheck.price),
        priceCurrency: "EUR",
        url: pageUrl(INVEST_ASSIST_OFFERS.routeCheck.path),
      },
      {
        "@type": "Offer",
        name: "Consultation (per hour)",
        price: String(INVEST_ASSIST_OFFERS.hourly.price),
        priceCurrency: "EUR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(INVEST_ASSIST_OFFERS.hourly.price),
          priceCurrency: "EUR",
          unitCode: "HUR",
          unitText: "HOUR",
        },
        url: pageUrl(INVEST_ASSIST_OFFERS.hourly.path),
      },
    ],
  };
}

export function goldenVisaDatasetSchema(locale: InvestLocale) {
  const url = pageUrl(investPagePath(locale, "compare"));
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: locale === "en" ? "Golden Visa 2026 comparison" : "Сравнение Golden Visa 2026",
    description:
      locale === "en"
        ? "Minimum investment, routes, time to citizenship and RU/BY eligibility for 8 investment-residence programmes, with official sources."
        : "Минимальные инвестиции, маршруты, срок до гражданства и доступность для паспортов РФ/РБ по 8 программам ВНЖ за инвестиции, с официальными источниками.",
    url,
    dateModified: GOLDEN_VISA_LAST_CHECKED,
    inLanguage: locale === "en" ? "en" : "ru-RU",
    creator: { "@type": "Organization", name: "Emigro", url: publicSiteUrl() },
    isAccessibleForFree: true,
    spatialCoverage: GOLDEN_VISA_ROWS.map((row) => ({ "@type": "Place", name: row.country.en })),
    variableMeasured: ["Minimum investment", "Routes", "Time to citizenship", "RU/BY eligibility", "Official source"],
  };
}
