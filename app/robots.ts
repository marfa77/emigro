import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/** Yandex bots (incl. YandexAdditionalBot for Alice AI) must not be blocked. */
const YANDEX_BOTS = ["Yandex", "YandexBot", "YandexImages", "YandexMedia", "YandexAdditional", "YandexAdditionalBot"] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/"] },
      ...YANDEX_BOTS.map((userAgent) => ({ userAgent, allow: "/" as const })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ""),
  };
}
