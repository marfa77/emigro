import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import type { EmigroEventName } from "@/lib/analytics/events";

const ALLOWED: Set<string> = new Set([
  "page_view",
  "wizard_started",
  "wizard_step",
  "wizard_completed",
  "wizard_error",
  "lead_submitted",
  "lead_error",
  "news_article_view",
  "news_source_click",
  "corridor_link_click",
]);

export async function POST(request: Request) {
  let body: { event?: string; properties?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event?.trim();
  if (!event || !ALLOWED.has(event)) {
    return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }

  const props = body.properties ?? {};
  await trackServerEvent(event as EmigroEventName, props as Record<string, string>, "web");
  return NextResponse.json({ ok: true });
}
