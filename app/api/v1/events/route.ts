import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import type { EmigroEventName } from "@/lib/analytics/events";
import { trackSiteEvent } from "@/lib/analytics/track-site-event";
import { clientIp } from "@/lib/analytics/geo";
import {
  buildWizardContext,
  notifyWizardCtaClick,
  notifyWizardResultsClick,
  notifyWizardResultsView,
  notifyWizardStarted,
} from "@/lib/wizard/notify-owner";

const ALLOWED: Set<string> = new Set([
  "session_start",
  "page_view",
  "wizard_cta_click",
  "wizard_started",
  "wizard_step",
  "wizard_completed",
  "wizard_error",
  "wizard_results_view",
  "wizard_results_click",
  "lead_submitted",
  "assist_lead_submitted",
  "lead_error",
  "news_article_view",
  "news_source_click",
  "corridor_link_click",
  "provider_click",
  "community_join_click",
]);

const TELEGRAM_EVENTS: Set<string> = new Set([
  "wizard_cta_click",
  "wizard_started",
  "wizard_results_view",
  "wizard_results_click",
]);

function propsToStrings(props: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === null || v === undefined) continue;
    out[k] = String(v);
  }
  return out;
}

type SiteEventBody = {
  session_id?: string;
  event_name?: string;
  event?: string;
  page_path?: string | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  utm_term?: string | null;
  properties?: Record<string, unknown>;
};

export async function POST(request: Request) {
  let body: SiteEventBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = (body.event_name ?? body.event)?.trim();
  if (!eventName || !ALLOWED.has(eventName)) {
    return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }

  const sessionId = body.session_id?.trim();
  const props = body.properties ?? {};
  const userAgent = request.headers.get("user-agent");

  if (sessionId && sessionId.length >= 8) {
    await trackSiteEvent({
      session_id: sessionId,
      event_name: eventName,
      page_path: body.page_path,
      referrer: body.referrer,
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_content: body.utm_content,
      utm_term: body.utm_term,
      properties: props,
      user_agent: userAgent,
      ip_address: clientIp(request),
      request,
    });
  } else {
    const flatProps = propsToStrings(props);
    await trackServerEvent(eventName as EmigroEventName, flatProps, "web");
  }

  if (TELEGRAM_EVENTS.has(eventName)) {
    const flatProps = propsToStrings(props);
    const ctx = buildWizardContext(request, flatProps);
    void (async () => {
      switch (eventName) {
        case "wizard_cta_click":
          await notifyWizardCtaClick(flatProps, ctx);
          break;
        case "wizard_started":
          await notifyWizardStarted(flatProps, ctx);
          break;
        case "wizard_results_view":
          await notifyWizardResultsView(flatProps, ctx);
          break;
        case "wizard_results_click":
          await notifyWizardResultsClick(flatProps, ctx);
          break;
      }
    })();
  }

  return NextResponse.json({ ok: true });
}
