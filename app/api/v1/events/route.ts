import { NextResponse } from "next/server";
import { trackServerEvent } from "@/lib/analytics/server";
import type { EmigroEventName } from "@/lib/analytics/events";
import {
  buildWizardContext,
  notifyWizardCtaClick,
  notifyWizardResultsClick,
  notifyWizardResultsView,
  notifyWizardStarted,
} from "@/lib/wizard/notify-owner";

const ALLOWED: Set<string> = new Set([
  "page_view",
  "wizard_cta_click",
  "wizard_started",
  "wizard_step",
  "wizard_completed",
  "wizard_error",
  "wizard_results_view",
  "wizard_results_click",
  "lead_submitted",
  "lead_error",
  "news_article_view",
  "news_source_click",
  "corridor_link_click",
  "provider_click",
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

  const props = propsToStrings(body.properties ?? {});
  await trackServerEvent(event as EmigroEventName, props, "web");

  if (TELEGRAM_EVENTS.has(event)) {
    const ctx = buildWizardContext(request, props);
    void (async () => {
      switch (event) {
        case "wizard_cta_click":
          await notifyWizardCtaClick(props, ctx);
          break;
        case "wizard_started":
          await notifyWizardStarted(props, ctx);
          break;
        case "wizard_results_view":
          await notifyWizardResultsView(props, ctx);
          break;
        case "wizard_results_click":
          await notifyWizardResultsClick(props, ctx);
          break;
      }
    })();
  }

  return NextResponse.json({ ok: true });
}
