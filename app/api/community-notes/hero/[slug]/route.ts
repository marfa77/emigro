import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  generateNoteOgWebp,
  hasNoteOgImageFile,
  noteOgImageFilePath,
} from "@/lib/community-notes/note-og-image";
import { getPublishedCommunityNoteBySlug } from "@/lib/community-notes/queries";

export const runtime = "nodejs";

const CACHE_HEADERS = {
  "Content-Type": "image/webp",
  "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
};

function readStaticFallbackImage(fallbackPath: string): Buffer | null {
  const filePath = path.join(process.cwd(), "public", fallbackPath.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug.replace(/\.webp$/i, "");

  const filePath = noteOgImageFilePath(slug);
  if (hasNoteOgImageFile(slug)) {
    const buf = fs.readFileSync(filePath);
    return new NextResponse(new Uint8Array(buf), { headers: CACHE_HEADERS });
  }

  const note =
    (await getPublishedCommunityNoteBySlug(slug, "spain")) ??
    (await getPublishedCommunityNoteBySlug(slug, "portugal"));
  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const webp = await generateNoteOgWebp(note);
  if (!webp) {
    const buf = readStaticFallbackImage("/images/og/og-default.jpg");
    if (buf) {
      return new NextResponse(new Uint8Array(buf), {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": CACHE_HEADERS["Cache-Control"],
        },
      });
    }
    return NextResponse.redirect(new URL("/images/og/og-default.jpg", _request.url), 302);
  }

  return new NextResponse(new Uint8Array(webp), { headers: CACHE_HEADERS });
}
