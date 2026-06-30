import { GoogleDecoder } from "google-news-url-decoder";
import { domainFromLink } from "./scoring";

const PUBLISHER_LABELS: Record<string, string> = {
  "publico.pt": "Público",
  "expresso.pt": "Expresso",
  "theportugalnews.com": "The Portugal News",
  "reuters.com": "Reuters",
  "ft.com": "Financial Times",
  "theguardian.com": "The Guardian",
  "politico.eu": "Politico Europe",
  "euronews.com": "Euronews",
  "schengenvisainfo.com": "SchengenVisaInfo",
  "parlamento.pt": "Assembleia da República",
  "dre.pt": "Diário da República",
  "aima.gov.pt": "AIMA",
  "gov.uk": "GOV.UK",
  "interior.gob.es": "Ministerio del Interior",
  "interieur.gouv.fr": "Ministère de l'Intérieur",
  "bund.de": "Bundesregierung",
  "ind.nl": "IND",
  "thelocal.es": "The Local Spain",
  "thelocal.pt": "The Local Portugal",
  "thelocal.fr": "The Local France",
  "thelocal.de": "The Local Germany",
  "thelocal.it": "The Local Italy",
  "elpais.com": "El País",
};

const decoder = new GoogleDecoder();

export function publisherFromDomain(link: string): string {
  const domain = domainFromLink(link);
  for (const [suffix, label] of Object.entries(PUBLISHER_LABELS)) {
    if (domain === suffix || domain.endsWith(`.${suffix}`)) return label;
  }
  const parts = domain.split(".");
  if (parts.length >= 2) {
    const base = parts[parts.length - 2];
    return base.charAt(0).toUpperCase() + base.slice(1);
  }
  return domain;
}

/** Google News titles are often "Headline - Publisher Name". */
export function parseGoogleNewsTitle(title: string): { headline: string; publisher: string | null } {
  const trimmed = title.trim();
  const match = trimmed.match(/^(.+?)\s+[-–—]\s+([^-–—]+)$/);
  if (!match) return { headline: trimmed, publisher: null };
  const headline = match[1].trim();
  const publisher = match[2].trim();
  if (!headline || !publisher || publisher.length > 80) return { headline: trimmed, publisher: null };
  return { headline, publisher };
}

export function isGoogleNewsUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "news.google.com" || host.endsWith(".news.google.com");
  } catch {
    return false;
  }
}

/** Vertex AI Search grounding redirect wrappers — not valid public source URLs. */
export function isGoogleGroundingRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "vertexaisearch.cloud.google.com" || host.endsWith(".vertexaisearch.cloud.google.com")) {
      return true;
    }
    return parsed.pathname.includes("grounding-api-redirect");
  } catch {
    return /vertexaisearch\.cloud\.google\.com|grounding-api-redirect/i.test(url);
  }
}

export function isBlockedSourceUrl(url: string): boolean {
  return isGoogleNewsUrl(url) || isGoogleGroundingRedirectUrl(url);
}

/** google.com and subdomains — not valid outbound links in social posts. */
export function isGoogleDomainUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === "google.com" || host.endsWith(".google.com");
  } catch {
    return /(?:^|\/)google\.com/i.test(url);
  }
}

export function isDisallowedSocialUrl(url: string): boolean {
  return isBlockedSourceUrl(url) || isGoogleDomainUrl(url);
}

const GOOGLE_SOURCE_NAME_RE =
  /^google(?:\s+(?:news|search|alerts?|discover|feed|alert))?$/i;

/** Publisher label is a Google wrapper, not a real outlet. */
export function isGoogleSourceName(name: string): boolean {
  const clean = name.trim();
  if (!clean) return false;
  if (GOOGLE_SOURCE_NAME_RE.test(clean)) return true;
  return /^google\b/i.test(clean) && clean.length <= 24;
}

export function isBlockedSourceName(name: string): boolean {
  const clean = name.trim();
  if (!clean) return true;
  if (/^(com|www|unknown)$/i.test(clean)) return true;
  return isGoogleSourceName(clean);
}

export function isPublishableSourceUrl(url: string): boolean {
  return Boolean(url?.trim()) && !isBlockedSourceUrl(url);
}

export function isPublishableSourceLink(link: { title: string; url: string }): boolean {
  return isPublishableSourceUrl(link.url) && !isBlockedSourceName(link.title);
}

export function sanitizeSourceLinks<T extends { title: string; url: string }>(links: T[]): T[] {
  return links.filter((l) => isPublishableSourceLink(l));
}

const URL_IN_TEXT_RE = /https?:\/\/[^\s<>"')\]]+/gi;

export function findBlockedUrlsInText(text: string): string[] {
  const matches = text.match(URL_IN_TEXT_RE) ?? [];
  return matches.filter(isDisallowedSocialUrl);
}

export function stripBlockedUrlsFromText(text: string): string {
  let out = text;
  const matches = text.match(URL_IN_TEXT_RE) ?? [];
  for (const url of matches) {
    if (isDisallowedSocialUrl(url)) {
      out = out.split(url).join("");
    }
  }
  return out
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+Источники:\s*$/gm, "")
    .trim();
}

/** Remove publisher attribution and Google labels from Telegram/Threads copy. */
export function stripSourceAttributionFromText(text: string): string {
  return text
    .replace(/^Источник:\s*.+$/gim, "")
    .replace(/\nИсточник:\s*.+$/gim, "")
    .replace(/\bИсточник:\s*Google(?:\s+News)?\b/gi, "")
    .replace(/^Источники:\s*\n(?:.+\shttps?:\/\/[^\n]+\n?)*/gim, "")
    .replace(/\nИсточники:\s*\n(?:.+\shttps?:\/\/[^\n]+\n?)*/gim, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function stripGoogleSourceMentionsFromText(text: string): string {
  return stripSourceAttributionFromText(stripBlockedUrlsFromText(text));
}

async function resolveViaDecoder(url: string): Promise<string | null> {
  try {
    const result = await decoder.decode(url);
    if (result?.status && result.decoded_url && isPublishableSourceUrl(result.decoded_url)) {
      return result.decoded_url;
    }
  } catch (e) {
    console.warn("[news] decoder failed:", url, e instanceof Error ? e.message : e);
  }
  return null;
}

async function resolveViaRedirect(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
      headers: {
        "User-Agent": "EmigroNewsBot/1.0 (+https://www.emigro.online)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const finalUrl = res.url || url;
    if (isPublishableSourceUrl(finalUrl)) return finalUrl;
  } catch (e) {
    console.warn("[news] redirect resolve failed:", url, e instanceof Error ? e.message : e);
  }
  return null;
}

export async function resolveArticleUrl(
  url: string,
  titleHint?: string
): Promise<{ url: string; publisher: string; headline: string; resolved: boolean }> {
  const parsed = titleHint ? parseGoogleNewsTitle(titleHint) : { headline: titleHint ?? "", publisher: null };

  if (isPublishableSourceUrl(url)) {
    return {
      url,
      publisher: parsed.publisher || publisherFromDomain(url),
      headline: parsed.headline || titleHint || "",
      resolved: true,
    };
  }

  const decoded = (await resolveViaDecoder(url)) || (await resolveViaRedirect(url));
  if (decoded) {
    return {
      url: decoded,
      publisher: parsed.publisher || publisherFromDomain(decoded),
      headline: parsed.headline || titleHint || "",
      resolved: true,
    };
  }

  return {
    url,
    publisher: parsed.publisher && parsed.publisher !== "Google News" ? parsed.publisher : "Google News",
    headline: parsed.headline || titleHint || "",
    resolved: false,
  };
}

export async function enrichStoryLinks<T extends { title: string; link: string; source: string }>(
  stories: T[]
): Promise<Array<T & { resolved_link: string; resolved_source: string; headline: string; resolved: boolean }>> {
  const batchSize = 3;
  const out: Array<T & { resolved_link: string; resolved_source: string; headline: string; resolved: boolean }> = [];

  for (let i = 0; i < stories.length; i += batchSize) {
    const batch = stories.slice(i, i + batchSize);
    const resolved = await Promise.all(
      batch.map(async (s) => {
        const r = await resolveArticleUrl(s.link, s.title);
        const headline = r.headline || s.title;
        const source =
          r.publisher !== "Google News" && r.publisher !== "unknown"
            ? r.publisher
            : s.source !== "Google News"
              ? s.source
              : r.publisher;
        return {
          ...s,
          title: headline,
          link: r.url,
          source,
          resolved_link: r.url,
          resolved_source: source,
          headline,
          resolved: r.resolved,
        };
      })
    );
    out.push(...resolved);
  }

  return out;
}

export function googleNewsLinkRatio(links: Array<{ url: string }>): number {
  if (links.length === 0) return 1;
  const blocked = links.filter((l) => isBlockedSourceUrl(l.url)).length;
  return blocked / links.length;
}

/** Stories with direct publisher URLs only — required before generation. */
export function filterResolvableStories<T extends { resolved_link: string; resolved: boolean }>(
  stories: T[]
): T[] {
  return stories.filter((s) => s.resolved && isPublishableSourceUrl(s.resolved_link));
}
