import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { buildItalyLlmsTxt } from "@/lib/community-notes/seo-page";

export async function GET() {
  const notes = await getPublishedCommunityNotes("italy");
  const body = await buildItalyLlmsTxt(notes);
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
