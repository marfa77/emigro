import { ES_PATHS } from "@/lib/es/corridor";
import { FR_PATHS } from "@/lib/fr/corridor";
import type { UiLocale } from "@/lib/locale";
import { portoChatDeepLink } from "@/lib/telegram/deep-link";

export type SiteNavLink = {
  href: string;
  labelRu: string;
  labelEn: string;
  labelEs?: string;
  labelFr?: string;
};

export const HEADER_NAV_LINKS: SiteNavLink[] = [
  { href: "/ru#destinations", labelRu: "Направления", labelEn: "Destinations", labelEs: "Destinos" },
  { href: "/ru/wizard", labelRu: "Подбор маршрута", labelEn: "Route finder", labelEs: "Evaluador" },
  { href: "/ru/guides", labelRu: "Гайды", labelEn: "Guides", labelEs: "Guías" },
  { href: "/ru/news", labelRu: "Новости", labelEn: "News", labelEs: "Noticias" },
  { href: "/ru/assist", labelRu: "Консультация", labelEn: "Consultation", labelEs: "Contacto" },
  { href: "/ru/partners", labelRu: "Партнёрам", labelEn: "Partners", labelEs: "Partners" },
  { href: portoChatDeepLink("nav"), labelRu: "Чат", labelEn: "Community", labelEs: "Comunidad" },
];

export const ES_HEADER_NAV_LINKS: SiteNavLink[] = [
  { href: ES_PATHS.home, labelRu: "Inicio", labelEn: "Home", labelEs: "Inicio" },
  { href: ES_PATHS.wizard, labelRu: "Evaluador", labelEn: "Route finder", labelEs: "Evaluador" },
  { href: ES_PATHS.spain, labelRu: "España", labelEn: "Spain", labelEs: "España" },
  { href: ES_PATHS.portugal, labelRu: "Portugal", labelEn: "Portugal", labelEs: "Portugal" },
  { href: ES_PATHS.peru, labelRu: "Perú", labelEn: "Peru", labelEs: "Perú" },
  { href: ES_PATHS.colombia, labelRu: "Colombia", labelEn: "Colombia", labelEs: "Colombia" },
  { href: ES_PATHS.chile, labelRu: "Chile", labelEn: "Chile", labelEs: "Chile" },
  { href: ES_PATHS.paraguay, labelRu: "Paraguay", labelEn: "Paraguay", labelEs: "Paraguay" },
  { href: ES_PATHS.guides, labelRu: "Guías", labelEn: "Guides", labelEs: "Guías" },
  { href: ES_PATHS.contact, labelRu: "Contacto", labelEn: "Contact", labelEs: "Contacto" },
];

export const FR_HEADER_NAV_LINKS: SiteNavLink[] = [
  { href: FR_PATHS.home, labelRu: "Accueil", labelEn: "Home", labelFr: "Accueil" },
  { href: FR_PATHS.france, labelRu: "France", labelEn: "France", labelFr: "France" },
  { href: FR_PATHS.maroc, labelRu: "Maroc", labelEn: "Morocco", labelFr: "Maroc" },
  { href: FR_PATHS.algerie, labelRu: "Algérie", labelEn: "Algeria", labelFr: "Algérie" },
  { href: FR_PATHS.tunisie, labelRu: "Tunisie", labelEn: "Tunisia", labelFr: "Tunisie" },
  { href: FR_PATHS.senegal, labelRu: "Sénégal", labelEn: "Senegal", labelFr: "Sénégal" },
  { href: FR_PATHS.guides, labelRu: "Guides", labelEn: "Guides", labelFr: "Guides" },
  { href: FR_PATHS.wizard, labelRu: "Évaluateur", labelEn: "Evaluator", labelFr: "Évaluateur" },
  { href: FR_PATHS.assist, labelRu: "Assist", labelEn: "Assist", labelFr: "Assist" },
  { href: FR_PATHS.contact, labelRu: "Contact", labelEn: "Contact", labelFr: "Contact" },
];

function pickLabel(link: SiteNavLink, locale: UiLocale): string {
  if (locale === "es") return link.labelEs ?? link.labelEn;
  if (locale === "fr") return link.labelFr ?? link.labelEn;
  if (locale === "ru") return link.labelRu;
  return link.labelEn;
}

export function getHeaderNavLinks(locale: UiLocale) {
  const source =
    locale === "es" ? ES_HEADER_NAV_LINKS : locale === "fr" ? FR_HEADER_NAV_LINKS : HEADER_NAV_LINKS;
  return source.map((link) => ({
    href: link.href,
    label: pickLabel(link, locale),
  }));
}
