import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { publishDraftsFromNewSignals } from "@/lib/community-notes/publish-drafts";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";

export const maxDuration = 300;

/** Fallback: publish Gemini drafts from signals already ingested (parser runs on GH Actions / VPS). */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const maxNotes = Math.min(parseInt(process.env.PORTUGAL_CRON_MAX_NOTES ?? "1", 10) || 1, 3);

  try {
    const result = await publishDraftsFromNewSignals(maxNotes);
    const spotlight = await refreshDailySpotlight("portugal");

    await trackServerEvent(
      "cron_portugal_community",
      {
        clusters: result.clusters,
        published: result.published.length,
        skipped: result.skipped.length,
        errors: result.errors.length,
        slugs: result.published.join(",") || null,
        spotlight: spotlight?.note_slug ?? null,
      },
      "cron"
    );

    return NextResponse.json({ ok: true, spotlight: spotlight?.note_slug ?? null, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    await trackServerEvent("cron_portugal_community_error", { message }, "cron");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
