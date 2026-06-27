import { publicSiteUrl } from "@/lib/site-url";

function revalidateSecret(): string | undefined {
  return process.env.CRON_SECRET?.trim() || process.env.EMIGRO_ADMIN_SECRET?.trim();
}

/** Bust Next.js ISR for news hub + article pages after DB writes (import / weekly). */
export async function revalidateNewsPages(slugs: string[] = []): Promise<void> {
  const site = publicSiteUrl();
  const secret = revalidateSecret();
  if (!secret || /localhost|127\.0\.0\.1/.test(site)) return;

  try {
    const res = await fetch(`${site}/api/revalidate/news`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slugs }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.warn(`[news] cache revalidate failed (${res.status}): ${text.slice(0, 200)}`);
      return;
    }
    const json = (await res.json()) as { revalidated?: string[] };
    console.log(`[news] cache revalidated: ${(json.revalidated ?? []).join(", ") || "ok"}`);
  } catch (e) {
    console.warn("[news] cache revalidate error:", e instanceof Error ? e.message : e);
  }
}
