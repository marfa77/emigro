import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { buildThailandLlmsTxt } from "@/lib/community-notes/seo-page";

export async function GET() {
  const notes = await getPublishedCommunityNotes("thailand");
  const body = await buildThailandLlmsTxt(notes);
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
