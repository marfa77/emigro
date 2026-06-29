import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/site-url";

/** Yandex bots (incl. YandexAdditionalBot for Alice AI) must not be blocked. */
const YANDEX_BOTS = ["Yandex", "YandexBot", "YandexImages", "YandexMedia", "YandexAdditional", "YandexAdditionalBot"] as const;

export default function robots(): MetadataRoute.Robots {
  const origin = publicSiteUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/"] },
      ...YANDEX_BOTS.map((userAgent) => ({ userAgent, allow: "/" as const })),
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin.replace(/^https?:\/\//, ""),
  };
}
