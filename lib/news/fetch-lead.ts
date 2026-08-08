/**
 * Cheap lead extraction: fetch HTML once, take first meaningful paragraph(s).
 * Used only for score-passing story candidates (not the full feed).
 */
const UA = "Mozilla/5.0 (compatible; EmigroNewsBot/1.0; +https://www.emigro.online)";

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function paragraphsFromHtml(html: string): string[] {
  const matches = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) ?? [];
  const out: string[] = [];
  for (const raw of matches) {
    const text = stripTags(raw);
    if (text.length < 60) continue;
    if (/cookie|subscribe|newsletter|javascript|copyright/i.test(text)) continue;
    out.push(text);
    if (out.length >= 2) break;
  }
  return out;
}

export async function fetchArticleLead(
  url: string,
  options?: { timeoutMs?: number; maxChars?: number }
): Promise<string | null> {
  const timeoutMs = options?.timeoutMs ?? 12_000;
  const maxChars = options?.maxChars ?? 900;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pt-PT,pt;q=0.9,en;q=0.8,ru;q=0.7",
      },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    const paras = paragraphsFromHtml(html);
    if (paras.length === 0) {
      const meta =
        html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1] ||
        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1];
      if (meta?.trim()) return meta.trim().slice(0, maxChars);
      return null;
    }
    return paras.join(" ").slice(0, maxChars);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
