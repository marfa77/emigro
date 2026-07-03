import { getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { buildPortugalLlmsTxt } from "@/lib/community-notes/seo-page";

export async function GET() {
  const notes = await getPublishedCommunityNotes("portugal");
  const body = await buildPortugalLlmsTxt(notes);
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
