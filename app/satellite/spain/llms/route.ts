import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { buildSpainLlmsTxt } from "@/lib/community-notes/seo-page";

export async function GET() {
  const notes = await getPublishedCommunityNotes("spain");
  const body = await buildSpainLlmsTxt(notes);
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
