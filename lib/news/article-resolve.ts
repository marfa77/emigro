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

async function resolveViaDecoder(url: string): Promise<string | null> {
  try {
    const result = await decoder.decode(url);
    if (result?.status && result.decoded_url && !isGoogleNewsUrl(result.decoded_url)) {
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
    if (!isGoogleNewsUrl(finalUrl)) return finalUrl;
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

  if (!isGoogleNewsUrl(url)) {
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
  const google = links.filter((l) => isGoogleNewsUrl(l.url)).length;
  return google / links.length;
}

/** Stories with direct publisher URLs only — required before generation. */
export function filterResolvableStories<T extends { resolved_link: string; resolved: boolean }>(
  stories: T[]
): T[] {
  return stories.filter((s) => s.resolved && !isGoogleNewsUrl(s.resolved_link));
}
