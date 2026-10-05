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
  errorBody?: string;
};

export function getIndexNowKey(): string | undefined {
  return process.env.INDEXNOW_KEY?.trim() || undefined;
}

/** First key hosted on www (25 Jun 2026). Bing still 403s the rotated key; keep both files live. */
export const INDEXNOW_LEGACY_KEY = "48398ea1d9fd45d2964434aac072daf9";

export function getIndexNowLegacyKey(): string | undefined {
  const fromEnv = process.env.INDEXNOW_LEGACY_KEY?.trim();
  if (fromEnv) return fromEnv;
  const current = getIndexNowKey();
  if (current === INDEXNOW_LEGACY_KEY) return undefined;
  return INDEXNOW_LEGACY_KEY;
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

export function isBingIndexNowHostForbidden(results: IndexNowPingResult[]): boolean {
  return results.some(
    (r) =>
      !r.ok &&
      r.status === 403 &&
      (r.hostname.includes("bing.com") || r.hostname.includes("indexnow.org")) &&
      (r.errorBody?.includes("UserForbiddedToAccessSite") ?? false),
  );
}

function isBingPartnerEndpoint(endpoint: string): boolean {
  return endpoint.includes("bing.com") || endpoint.includes("indexnow.org");
}

async function postIndexNow(
  endpoint: string,
  host: string,
  key: string,
  urlList: string[],
): Promise<{ status: number; ok: boolean; errorBody?: string }> {
  const keyLocation = `https://${host}/${key}.txt`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const errorBody = res.ok ? undefined : (await res.text().catch(() => "")).slice(0, 400);
  return { status: res.status, ok: res.ok, errorBody: errorBody || undefined };
}

/** Notify Yandex/Bing/IndexNow partners that URLs were added or updated. Yandex is pinged first. */
export async function pingIndexNow(
  urls: string[],
  options?: { skipBingPartners?: boolean },
): Promise<IndexNowPingResult[]> {
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

  const urlList = unique.slice(0, 10_000);
  const legacyKey = getIndexNowLegacyKey();
  let skipBingPartners = options?.skipBingPartners ?? false;

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    const primary = endpoint.includes("yandex");
    if (skipBingPartners && isBingPartnerEndpoint(endpoint)) {
      continue;
    }
    const label = endpointLabel(endpoint);
    try {
      let posted = await postIndexNow(endpoint, host, key, urlList);
      let usedKey = key;
      if (
        !posted.ok &&
        posted.status === 403 &&
        isBingPartnerEndpoint(endpoint) &&
        legacyKey &&
        posted.errorBody?.includes("UserForbiddedToAccessSite")
      ) {
        console.info(`[seo] IndexNow ${label}: retry with legacy key`);
        posted = await postIndexNow(endpoint, host, legacyKey, urlList);
        usedKey = legacyKey;
      }
      const result: IndexNowPingResult = {
        endpoint,
        hostname: new URL(endpoint).hostname,
        status: posted.status,
        ok: posted.ok,
        primary,
        errorBody: posted.errorBody,
      };
      results.push(result);

      const statusNote = posted.ok ? "OK" : "FAILED";
      console.info(
        `[seo] IndexNow ${label}: ${posted.status} ${statusNote} (${unique.length} urls, key=${usedKey.slice(0, 8)}…)`,
      );
      if (posted.errorBody) {
        console.warn(`[seo] IndexNow ${label} response: ${posted.errorBody}`);
      }
      if (isBingIndexNowHostForbidden([result])) {
        skipBingPartners = true;
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
