import { classifyLlmAttribution, referrerHost } from "@/lib/analytics/llm-attribution";

export type TrafficChannel = "llm" | "search" | "direct" | "referral" | "social" | "internal" | "other";

const SEARCH_HOST_NEEDLES = [
  "google.",
  "google.com",
  "googleapis.com",
  "yandex.",
  "ya.ru",
  "duckduckgo.com",
  "bing.com",
  "yahoo.com",
  "baidu.com",
  "ecosia.org",
  "brave.com",
  "search.brave.com",
  "qwant.com",
  "startpage.com",
];

const SOCIAL_HOST_NEEDLES = [
  "t.me",
  "telegram.org",
  "telegram.me",
  "facebook.com",
  "fb.com",
  "instagram.com",
  "twitter.com",
  "x.com",
  "vk.com",
  "linkedin.com",
  "reddit.com",
  "threads.net",
  "whatsapp.com",
];

const INTERNAL_HOST_NEEDLES = ["emigro.online", "emigro."];

function hostMatches(host: string, needles: string[]): boolean {
  return needles.some((n) => host === n || host.endsWith(n) || host.includes(n));
}

function isSearchUtm(utmSource: string | null | undefined, utmMedium: string | null | undefined): boolean {
  const med = (utmMedium || "").trim().toLowerCase();
  const src = (utmSource || "").trim().toLowerCase();
  if (med === "organic" || med === "seo") return true;
  if (src === "google" || src === "yandex" || src === "bing" || src === "duckduckgo") return true;
  return false;
}

/**
 * Attribute a hit to a traffic channel.
 * Order: LLM → search → social → internal → referral → direct → other.
 */
export function classifyTrafficChannel(
  referrer: string | null | undefined,
  utmSource: string | null | undefined,
  utmMedium?: string | null
): { channel: TrafficChannel; label: string } {
  const llm = classifyLlmAttribution(referrer, utmSource, utmMedium);
  if (llm) return { channel: "llm", label: llm };

  if (isSearchUtm(utmSource, utmMedium)) {
    const src = (utmSource || "organic").trim() || "organic";
    return { channel: "search", label: src };
  }

  const host = referrerHost(referrer);
  if (host) {
    if (hostMatches(host, INTERNAL_HOST_NEEDLES)) {
      return { channel: "internal", label: host };
    }
    // Bing organic search (LLM already caught Copilot hosts)
    if (hostMatches(host, SEARCH_HOST_NEEDLES)) {
      return { channel: "search", label: host };
    }
    if (hostMatches(host, SOCIAL_HOST_NEEDLES)) {
      return { channel: "social", label: host };
    }
    return { channel: "referral", label: host };
  }

  if (utmSource?.trim()) {
    return { channel: "other", label: utmSource.trim() };
  }

  return { channel: "direct", label: "direct" };
}

export function isDiscoveryChannel(channel: TrafficChannel): boolean {
  return channel === "search" || channel === "llm";
}
