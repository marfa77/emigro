import { publicSiteUrl } from "@/lib/site-url";
import { EMIGRO_LOGO_URL, EMIGRO_PUBLISHER } from "@/lib/seo/schema";

export const EMIGRO_ORG_ID = `${publicSiteUrl()}/#organization`;

const SERVICE_TAGLINE =
  "Коридорный навигатор для русскоязычных: маршруты ВНЖ, wizard подбора, справочник и еженедельные новости по Европе.";

const AREA_SERVED = [
  "Portugal",
  "Spain",
  "France",
  "Italy",
  "Germany",
  "Netherlands",
  "Poland",
  "Czechia",
  "Austria",
  "Serbia",
  "Georgia",
  "Montenegro",
  "Turkey",
  "Armenia",
  "Kazakhstan",
  "United Arab Emirates",
  "Thailand",
  "Indonesia",
];

export function emigroGlobalJsonLd(): Record<string, unknown>[] {
  const url = publicSiteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": EMIGRO_ORG_ID,
    name: "Emigro",
    url,
    logo: EMIGRO_LOGO_URL,
    description: SERVICE_TAGLINE,
    sameAs: [] as string[],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Emigro",
    url,
    description: SERVICE_TAGLINE,
    inLanguage: "ru-RU",
    publisher: { "@id": EMIGRO_ORG_ID },
    potentialAction: {
      "@type": "UseAction",
      target: `${url}/ru/wizard`,
      name: "Подбор маршрута ВНЖ",
    },
  };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Emigro — навигатор релокации в Европу",
    serviceType: "Relocation route intelligence",
    description: SERVICE_TAGLINE,
    provider: { "@id": EMIGRO_ORG_ID },
    areaServed: AREA_SERVED.map((name) => ({ "@type": "Country", name })),
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: url,
      serviceType: "Web wizard and corridor guides",
    },
  };

  return [organization, website, service];
}

export { EMIGRO_PUBLISHER };
