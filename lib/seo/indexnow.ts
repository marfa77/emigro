import { SITE_URL } from "@/lib/site-url";

const INDEXNOW_ENDPOINTS = [
  "https://yandex.com/indexnow",
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
] as const;

export function getIndexNowKey(): string | undefined {
  return process.env.INDEXNOW_KEY?.trim() || undefined;
}

export function indexNowKeyFileUrl(siteUrl = SITE_URL): string {
  const key = getIndexNowKey();
  if (!key) return "";
  return `${siteUrl.replace(/\/$/, "")}/${key}.txt`;
}

/** Notify Yandex/Bing/IndexNow partners that URLs were added or updated. */
export async function pingIndexNow(urls: string[]): Promise<void> {
  const key = getIndexNowKey();
  const unique = Array.from(new Set(urls.map((u) => u.trim()).filter(Boolean)));
  if (!key || unique.length === 0) return;

  let host: string;
  try {
    host = new URL(unique[0]).hostname;
  } catch {
    console.warn("[seo] IndexNow: invalid URL", unique[0]);
    return;
  }

  const keyLocation = `https://${host}/${key}.txt`;
  const body = JSON.stringify({
    host,
    key,
    keyLocation,
    urlList: unique.slice(0, 10_000),
  });

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body,
        signal: AbortSignal.timeout(10_000),
      });
      console.info(`[seo] IndexNow ${new URL(endpoint).hostname}: ${res.status} (${unique.length} urls)`);
    } catch (e) {
      console.warn(`[seo] IndexNow ${endpoint} failed:`, e instanceof Error ? e.message : e);
    }
  }
}
