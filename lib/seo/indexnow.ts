import { SITE_URL } from "@/lib/site-url";

/** Yandex first — primary audience uses Yandex Search and Alice AI, not Google. */
export const INDEXNOW_ENDPOINTS = [
  "https://yandex.com/indexnow",
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
] as const;

export type IndexNowPingResult = {
  endpoint: string;
  hostname: string;
  status: number;
  ok: boolean;
  primary: boolean;
};

export function getIndexNowKey(): string | undefined {
  return process.env.INDEXNOW_KEY?.trim() || undefined;
}

export function indexNowKeyFileUrl(siteUrl = SITE_URL): string {
  const key = getIndexNowKey();
  if (!key) return "";
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/${key}.txt`;
}

function endpointLabel(endpoint: string): string {
  if (endpoint.includes("yandex")) return "Yandex (primary)";
  return new URL(endpoint).hostname;
}

/** Notify Yandex/Bing/IndexNow partners that URLs were added or updated. Yandex is pinged first. */
export async function pingIndexNow(urls: string[]): Promise<IndexNowPingResult[]> {
  const key = getIndexNowKey();
  const unique = Array.from(new Set(urls.map((u) => u.trim()).filter(Boolean)));
  const results: IndexNowPingResult[] = [];
  if (!key || unique.length === 0) return results;

  let host: string;
  try {
    host = new URL(unique[0]).hostname;
  } catch {
    console.warn("[seo] IndexNow: invalid URL", unique[0]);
    return results;
  }

  const keyLocation = `https://${host}/${key}.txt`;
  const body = JSON.stringify({
    host,
    key,
    keyLocation,
    urlList: unique.slice(0, 10_000),
  });

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    const primary = endpoint.includes("yandex");
    const label = endpointLabel(endpoint);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
        signal: AbortSignal.timeout(10_000),
      });
      const result: IndexNowPingResult = {
        endpoint,
        hostname: new URL(endpoint).hostname,
        status: res.status,
        ok: res.ok,
        primary,
      };
      results.push(result);

      const statusNote = res.ok ? "OK" : "FAILED";
      console.info(`[seo] IndexNow ${label}: ${res.status} ${statusNote} (${unique.length} urls)`);

      if (primary && !res.ok) {
        const errorBody = await res.text().catch(() => "");
        if (errorBody) {
          console.warn(`[seo] Yandex IndexNow response: ${errorBody.slice(0, 300)}`);
        }
      }
    } catch (e) {
      results.push({
        endpoint,
        hostname: new URL(endpoint).hostname,
        status: 0,
        ok: false,
        primary,
      });
      console.warn(`[seo] IndexNow ${label} failed:`, e instanceof Error ? e.message : e);
    }
  }

  return results;
}
