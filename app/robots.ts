import type { MetadataRoute } from "next";
import { PORTUGAL_SATELLITE_HOST } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE_HOST } from "@/lib/satellite/spain";
import { publicHostKind } from "@/lib/seo/request-host";
import { publicSiteUrl } from "@/lib/site-url";

/** Yandex bots (incl. YandexAdditionalBot for Alice AI) must not be blocked. */
const YANDEX_BOTS = ["Yandex", "YandexBot", "YandexImages", "YandexMedia", "YandexAdditional", "YandexAdditionalBot"] as const;

/** AI crawlers (Prep2Go / PixID allowlist). */
const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-Web",
  "Anthropic-AI",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "cohere-ai",
] as const;

function sharedRules(): MetadataRoute.Robots["rules"] {
  return [
    { userAgent: "*", allow: "/", disallow: ["/admin/"] },
    ...YANDEX_BOTS.map((userAgent) => ({ userAgent, allow: "/" as const })),
    ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" as const })),
  ];
}

export default function robots(): MetadataRoute.Robots {
  const kind = publicHostKind();

  if (kind === "portugal-satellite") {
    const origin = `https://${PORTUGAL_SATELLITE_HOST}`;
    return {
      rules: sharedRules(),
      sitemap: `${origin}/sitemap.xml`,
      host: PORTUGAL_SATELLITE_HOST,
    };
  }

  if (kind === "spain-satellite") {
    const origin = `https://${SPAIN_SATELLITE_HOST}`;
    return {
      rules: sharedRules(),
      sitemap: `${origin}/sitemap.xml`,
      host: SPAIN_SATELLITE_HOST,
    };
  }

  const origin = publicSiteUrl();
  return {
    rules: sharedRules(),
    // llm-sitemap.xml stays reachable via llms.txt — do not declare it as a Google Sitemap:
    // it mixes www + satellite hosts and GSC then reports "no referring sitemaps" for subdomains.
    sitemap: [
      `${origin}/sitemap.xml`,
      `${origin}/sitemap/recent.xml`,
      `https://${PORTUGAL_SATELLITE_HOST}/sitemap.xml`,
      `https://${SPAIN_SATELLITE_HOST}/sitemap.xml`,
    ],
    host: origin.replace(/^https?:\/\//, ""),
  };
}
