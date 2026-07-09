/** Optional Google sitemap ping (legacy; Google may return 404 — submit sitemap in GSC). */
export async function pingGoogleSitemap(sitemapUrl: string): Promise<boolean> {
  const enabled =
    process.env.PING_GOOGLE_SITEMAP === "1" ||
    process.env.PING_GOOGLE_SITEMAP === "true";
  if (!enabled) return false;

  const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    const res = await fetch(googlePing, { method: "GET", signal: AbortSignal.timeout(8000) });
    console.info(`[seo] Google sitemap ping: ${res.status} ${sitemapUrl}`);
    if (res.status === 404) {
      console.info(
        "[seo] Google /ping often returns 404 (deprecated). Submit sitemap in Search Console instead."
      );
    }
    return res.ok;
  } catch (e) {
    console.warn("[seo] Google sitemap ping failed:", e instanceof Error ? e.message : e);
    return false;
  }
}
