import type { MetadataRoute } from "next";
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

export default function robots(): MetadataRoute.Robots {
  const origin = publicSiteUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin/"] },
      ...YANDEX_BOTS.map((userAgent) => ({ userAgent, allow: "/" as const })),
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" as const })),
    ],
    sitemap: [`${origin}/sitemap.xml`, `${origin}/llm-sitemap.xml`],
    host: origin.replace(/^https?:\/\//, ""),
  };
}
