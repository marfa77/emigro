import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import { ensureNoteOgImage, hasNoteOgImage } from "@/lib/community-notes/note-og-image";
import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";

export const maxDuration = 120;

/** Warm OG/hero images for guides published by VPS cron (PEXELS on Vercel, dynamic /api route). */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lookbackDays = Math.min(parseInt(process.env.PORTUGAL_NOTE_IMAGE_LOOKBACK_DAYS ?? "14", 10) || 14, 30);
  const cutoff = Date.now() - lookbackDays * 24 * 60 * 60 * 1000;

  try {
    const notes = await getPublishedCommunityNotes("portugal");
    const recentGuides = notes.filter(
      (n) =>
        n.content_kind === "guide" &&
        n.published_at &&
        new Date(n.published_at).getTime() >= cutoff &&
        !hasNoteOgImage(n.slug)
    );

    const warmed: string[] = [];
    const errors: string[] = [];

    for (const note of recentGuides.slice(0, 5)) {
      try {
        const result = await ensureNoteOgImage(note);
        if (result.generated || result.path.includes("/api/community-notes/hero/")) {
          warmed.push(note.slug);
        }
      } catch (e) {
        errors.push(`${note.slug}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }

    await trackServerEvent(
      "cron_portugal_note_images",
      {
        candidates: recentGuides.length,
        warmed: warmed.length,
        slugs: warmed.join(",") || null,
        errors: errors.length ? errors.join(";") : null,
      },
      "cron"
    );

    return NextResponse.json({
      ok: true,
      candidates: recentGuides.length,
      warmed,
      errors,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    await trackServerEvent("cron_portugal_note_images_error", { message }, "cron");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
