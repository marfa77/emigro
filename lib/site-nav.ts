import { COMMUNITY_PATH } from "@/lib/community";
import { ES_PATHS } from "@/lib/es/corridor";
import type { UiLocale } from "@/lib/locale";

export type SiteNavLink = {
  href: string;
  labelRu: string;
  labelEn: string;
  labelEs?: string;
};

export const HEADER_NAV_LINKS: SiteNavLink[] = [
  { href: "/ru#destinations", labelRu: "Направления", labelEn: "Destinations", labelEs: "Destinos" },
  { href: "/ru/wizard", labelRu: "Подбор маршрута", labelEn: "Route finder", labelEs: "Evaluador" },
  { href: "/ru/guides", labelRu: "Гайды", labelEn: "Guides", labelEs: "Guías" },
  { href: "/ru/news", labelRu: "Новости", labelEn: "News", labelEs: "Noticias" },
  { href: "/ru/assist", labelRu: "Консультация", labelEn: "Consultation", labelEs: "Contacto" },
  { href: "/ru/partners", labelRu: "Партнёрам", labelEn: "Partners", labelEs: "Partners" },
  { href: COMMUNITY_PATH, labelRu: "Чат", labelEn: "Community", labelEs: "Comunidad" },
];

export const ES_HEADER_NAV_LINKS: SiteNavLink[] = [
  { href: ES_PATHS.home, labelRu: "Inicio", labelEn: "Home", labelEs: "Inicio" },
  { href: ES_PATHS.uruguay, labelRu: "Uruguay", labelEn: "Uruguay", labelEs: "Uruguay" },
  { href: ES_PATHS.ecuador, labelRu: "Ecuador", labelEn: "Ecuador", labelEs: "Ecuador" },
  { href: ES_PATHS.spain, labelRu: "España", labelEn: "Spain", labelEs: "España" },
  { href: ES_PATHS.guides, labelRu: "Guías", labelEn: "Guides", labelEs: "Guías" },
  { href: ES_PATHS.contact, labelRu: "Contacto", labelEn: "Contact", labelEs: "Contacto" },
];

function pickLabel(link: SiteNavLink, locale: UiLocale): string {
  if (locale === "es") return link.labelEs ?? link.labelEn;
  if (locale === "ru") return link.labelRu;
  return link.labelEn;
}

export function getHeaderNavLinks(locale: UiLocale) {
  const source = locale === "es" ? ES_HEADER_NAV_LINKS : HEADER_NAV_LINKS;
  return source.map((link) => ({
    href: link.href,
    label: pickLabel(link, locale),
  }));
}
