import { COMMUNITY_PATH } from "@/lib/community";

export type SiteNavLink = {
  href: string;
  labelRu: string;
  labelEn: string;
};

export const HEADER_NAV_LINKS: SiteNavLink[] = [
  { href: "/ru#destinations", labelRu: "Направления", labelEn: "Destinations" },
  { href: "/ru/wizard", labelRu: "Подбор маршрута", labelEn: "Route finder" },
  { href: "/ru/guides", labelRu: "Гайды", labelEn: "Guides" },
  { href: "/ru/news", labelRu: "Новости", labelEn: "News" },
  { href: "/ru/assist", labelRu: "Консультация", labelEn: "Consultation" },
  { href: "/ru/partners", labelRu: "Партнёрам", labelEn: "Partners" },
  { href: COMMUNITY_PATH, labelRu: "Чат", labelEn: "Community" },
];

export function getHeaderNavLinks(locale: "ru" | "en") {
  return HEADER_NAV_LINKS.map(({ href, labelRu, labelEn }) => ({
    href,
    label: locale === "ru" ? labelRu : labelEn,
  }));
}
