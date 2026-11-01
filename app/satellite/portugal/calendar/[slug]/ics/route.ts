import { eventIcs, getPortugalEvent } from "@/lib/events/portugal-calendar";
import { portugalSatelliteUrl } from "@/lib/site-url";

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const event = await getPortugalEvent(params.slug);
  if (!event) return new Response("Not found", { status: 404 });
  const body = eventIcs(event, portugalSatelliteUrl(`/calendar/${event.slug}`));
  return new Response(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug}.ics"`,
    },
  });
}
