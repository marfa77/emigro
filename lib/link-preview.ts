import { unstable_cache } from "next/cache";

export type LinkPreview = {
  url: string;
  hostname: string;
  imageUrl: string | null;
  siteName: string | null;
};

const MARKDOWN_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/gi;
const FETCH_TIMEOUT_MS = 4500;
const MAX_HTML_BYTES = 350_000;

const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

function isSafePublicHttpUrl(raw: string): URL | null {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  const host = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTS.has(host)) return null;
  if (host.endsWith(".local") || host.endsWith(".internal")) return null;
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|169\.254\.)/.test(host)) return null;
  return parsed;
}

function metaContent(html: string, keys: string[]): string | null {
  for (const key of keys) {
    const propertyRe = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i"
    );
    const contentFirstRe = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
      "i"
    );
    const match = html.match(propertyRe) ?? html.match(contentFirstRe);
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return null;
}

function absolutize(base: URL, value: string): string | null {
  try {
    return new URL(value, base).href;
  } catch {
    return null;
  }
}

async function fetchOpenGraphUncached(url: string): Promise<LinkPreview> {
  const parsed = isSafePublicHttpUrl(url);
  const hostname = parsed?.hostname.replace(/^www\./, "") ?? "site";
  if (!parsed) {
    return { url, hostname, imageUrl: null, siteName: null };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(parsed.href, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (compatible; EmigroBot/1.0; +https://www.emigro.online/; link-preview)",
        "Accept-Language": "en-US,en;q=0.8,pt;q=0.7,ru;q=0.5",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return { url: parsed.href, hostname, imageUrl: null, siteName: null };
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!/text\/html|application\/xhtml/i.test(contentType) && contentType.length > 0) {
      return { url: parsed.href, hostname, imageUrl: null, siteName: null };
    }

    const buf = await res.arrayBuffer();
    const html = new TextDecoder("utf-8", { fatal: false }).decode(
      buf.byteLength > MAX_HTML_BYTES ? buf.slice(0, MAX_HTML_BYTES) : buf
    );

    const rawImage =
      metaContent(html, ["og:image", "og:image:url", "twitter:image", "twitter:image:src"]) ?? null;
    const imageUrl = rawImage ? absolutize(parsed, rawImage) : null;
    const siteName = metaContent(html, ["og:site_name"]) ?? hostname;

    return {
      url: parsed.href,
      hostname,
      imageUrl: imageUrl && isSafePublicHttpUrl(imageUrl) ? imageUrl : null,
      siteName,
    };
  } catch {
    return { url: parsed.href, hostname, imageUrl: null, siteName: null };
  } finally {
    clearTimeout(timer);
  }
}

/** Cached OG lookup (24h). Safe for RSC — SSRF-guarded public http(s) only. */
export function getLinkPreview(url: string): Promise<LinkPreview> {
  const key = url.trim();
  return unstable_cache(() => fetchOpenGraphUncached(key), ["link-preview-v1", key], {
    revalidate: 86400,
  })();
}

export async function getLinkPreviews(urls: string[]): Promise<Map<string, LinkPreview>> {
  const unique = Array.from(new Set(urls.map((u) => u.trim()).filter(Boolean)));
  const pairs = await Promise.all(
    unique.map(async (url) => [url, await getLinkPreview(url)] as const)
  );
  return new Map(pairs);
}

export function extractMarkdownHttpLinks(text: string): Array<{ label: string; url: string }> {
  const out: Array<{ label: string; url: string }> = [];
  const re = new RegExp(MARKDOWN_LINK_RE.source, "gi");
  let match = re.exec(text);
  while (match) {
    const label = match[1]?.trim() ?? "";
    const url = match[2]?.trim() ?? "";
    if (label && url && isSafePublicHttpUrl(url)) {
      out.push({ label, url });
    }
    match = re.exec(text);
  }
  return out;
}

export function faviconUrlForHostname(hostname: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`;
}
