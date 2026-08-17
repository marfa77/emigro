import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  firstNoteBodyImageSrc,
  generateNoteOgWebp,
  hasNoteOgImageFile,
  noteOgImageFilePath,
  webpFromPublicImage,
} from "@/lib/community-notes/note-og-image";
import { getPublishedCommunityNoteBySlug } from "@/lib/community-notes/queries";

export const runtime = "nodejs";

const CACHE_HEADERS = {
  "Content-Type": "image/webp",
  "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
};

function webpResponse(buf: Buffer): NextResponse {
  return new NextResponse(new Uint8Array(buf), { headers: CACHE_HEADERS });
}

/**
 * Hero/OG for community notes.
 * NEVER returns the shared og-default stub for published guides — that made every
 * missing card look identical. Prefer committed WebP → body figure → Pexels → 404.
 */
export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug.replace(/\.webp$/i, "");

  const filePath = noteOgImageFilePath(slug);
  if (hasNoteOgImageFile(slug)) {
    return webpResponse(fs.readFileSync(filePath));
  }

  const note =
    (await getPublishedCommunityNoteBySlug(slug, "spain")) ??
    (await getPublishedCommunityNoteBySlug(slug, "portugal"));
  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bodySrc = firstNoteBodyImageSrc(note);
  if (bodySrc) {
    const fromBody = await webpFromPublicImage(bodySrc);
    if (fromBody) return webpResponse(fromBody);
  }

  const webp = await generateNoteOgWebp(note);
  if (webp) return webpResponse(webp);

  // Guides must not share one placeholder JPEG across the hub.
  if (note.content_kind === "guide") {
    return NextResponse.json(
      { error: "Guide hero missing — commit public/images/community-notes/{slug}.webp" },
      { status: 404 }
    );
  }

  const fallbackPath = path.join(process.cwd(), "public/images/og/og-default.jpg");
  if (fs.existsSync(fallbackPath)) {
    return new NextResponse(new Uint8Array(fs.readFileSync(fallbackPath)), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": CACHE_HEADERS["Cache-Control"],
      },
    });
  }

  return NextResponse.json({ error: "Hero unavailable" }, { status: 404 });
}
