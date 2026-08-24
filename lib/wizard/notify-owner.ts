import { createAdminClient } from "@/lib/admin/supabase";
import { formatAssistCtaClickTelegram } from "@/lib/assist/format-telegram";
import { sendOwnerTelegramDm } from "@/lib/telegram";
import {
  formatWizardCompletedTelegram,
  type WizardFunnelContext,
} from "@/lib/wizard/format-telegram";
import { iso2ToCountryRu } from "@/lib/wizard/geo-country";
import { inferEntryContext } from "@/lib/wizard/infer-entry-context";
import { loadWizardSessionReport } from "@/lib/wizard/session-report";

const OWNER_DM_SENT_EVENT = "wizard_owner_dm_sent";
const ASSIST_CTA_DM_SENT_EVENT = "assist_cta_owner_dm_sent";

export function requestToWizardContext(request: Request, props: Record<string, string> = {}): WizardFunnelContext {
  const forwarded = request.headers.get("x-forwarded-for");
  const geoCountryRu = iso2ToCountryRu(request.headers.get("x-vercel-ip-country"));
  return {
    ip: forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    referer: props.referer || request.headers.get("referer") || undefined,
    pagePath: props.page_path || undefined,
    geoCountryRu,
  };
}

function collectInterestKeys(props: Record<string, string>): string[] {
  const raw = props.interest_countries || props.interest;
  if (!raw) return [];
  return raw
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean);
}

export function enrichWizardContext(
  ctx: WizardFunnelContext,
  props: Record<string, string> = {}
): WizardFunnelContext {
  const inferred = inferEntryContext({
    referer: ctx.referer,
    pagePath: ctx.pagePath,
    interestKeys: collectInterestKeys(props),
  });

  return {
    ...ctx,
    interestCountriesRu: inferred.interestCountriesRu.length ? inferred.interestCountriesRu : undefined,
    entrySource: inferred.entrySource,
    entryType: inferred.entryType,
  };
}

export function buildWizardContext(request: Request, props: Record<string, string> = {}): WizardFunnelContext {
  return enrichWizardContext(requestToWizardContext(request, props), props);
}

export async function ownerWizardDmAlreadySent(wizardSessionId: string): Promise<boolean> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("site_events")
    .select("id", { count: "exact", head: true })
    .eq("event_name", OWNER_DM_SENT_EVENT)
    .contains("properties", { wizard_session_id: wizardSessionId });

  if (error) {
    console.warn("[wizard-notify] dedup check failed:", error.message);
    return false;
  }
  return (count ?? 0) > 0;
}

export async function markOwnerWizardDmSent(wizardSessionId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("site_events").insert({
    session_id: wizardSessionId.slice(0, 128),
    event_name: OWNER_DM_SENT_EVENT,
    properties: { wizard_session_id: wizardSessionId },
  });
  if (error) console.warn("[wizard-notify] dedup mark failed:", error.message);
}

/** Single owner DM when the user opens the wizard results page. */
export async function notifyWizardResultsView(
  props: Record<string, string>,
  ctx?: WizardFunnelContext
): Promise<void> {
  const sessionId = props.session_id?.trim();
  if (!sessionId) return;

  if (await ownerWizardDmAlreadySent(sessionId)) return;

  const loaded = await loadWizardSessionReport(sessionId);
  if (!loaded) {
    console.warn("[wizard-notify] results view: session not found", sessionId);
    return;
  }

  const text = formatWizardCompletedTelegram({
    ...loaded,
    ctx,
    headline: "📊 Emigro — пользователь увидел результаты wizard",
  });

  const result = await sendOwnerTelegramDm(text);
  if (!result.success) {
    console.warn("[wizard-notify] results view:", result.error);
    return;
  }

  await markOwnerWizardDmSent(sessionId);
}

/** Owner DM when user clicks an Assist CTA. Deduped per browser session + placement (15 min window via event mark). */
export async function notifyAssistCtaClick(
  props: Record<string, string>,
  ctx?: WizardFunnelContext
): Promise<void> {
  const analyticsSession = props.analytics_session_id?.trim() || props.browser_session_id?.trim();
  const placement = props.placement?.trim() || "unknown";
  const dedupeKey = analyticsSession
    ? `${analyticsSession}:${placement}`
    : props.session_id?.trim()
      ? `wiz:${props.session_id.trim()}:${placement}`
      : null;

  if (dedupeKey && (await ownerAssistCtaDmAlreadySent(dedupeKey))) return;

  const text = formatAssistCtaClickTelegram(props, ctx);
  const result = await sendOwnerTelegramDm(text);
  if (!result.success) {
    console.warn("[assist-notify] cta click:", result.error);
    return;
  }

  if (dedupeKey) await markOwnerAssistCtaDmSent(dedupeKey);
}

async function ownerAssistCtaDmAlreadySent(dedupeKey: string): Promise<boolean> {
  const supabase = createAdminClient();
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from("site_events")
    .select("id", { count: "exact", head: true })
    .eq("event_name", ASSIST_CTA_DM_SENT_EVENT)
    .gte("created_at", since)
    .contains("properties", { dedupe_key: dedupeKey });

  if (error) {
    console.warn("[assist-notify] dedup check failed:", error.message);
    return false;
  }
  return (count ?? 0) > 0;
}

async function markOwnerAssistCtaDmSent(dedupeKey: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("site_events").insert({
    session_id: dedupeKey.slice(0, 128),
    event_name: ASSIST_CTA_DM_SENT_EVENT,
    properties: { dedupe_key: dedupeKey },
  });
  if (error) console.warn("[assist-notify] dedup mark failed:", error.message);
}
