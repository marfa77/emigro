import { createAdminClient } from "@/lib/admin/supabase";
import { getWizardForCorridor } from "@/lib/corridor/queries";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import { sendOwnerTelegramDm } from "@/lib/telegram";
import type { WizardModule } from "@/lib/types";
import {
  formatWizardCompletedTelegram,
  type WizardFunnelContext,
} from "@/lib/wizard/format-telegram";
import { iso2ToCountryRu } from "@/lib/wizard/geo-country";
import { inferEntryContext } from "@/lib/wizard/infer-entry-context";
import { createServerClient } from "@/lib/supabase/server";

const OWNER_DM_SENT_EVENT = "wizard_owner_dm_sent";

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

async function loadWizardSessionForOwnerNotify(sessionId: string): Promise<{
  mode: "hub" | "corridor";
  sessionId: string;
  corridorSlug?: string;
  corridorTitleRu?: string;
  answers: Record<string, unknown>;
  payload?: GlobalEvalPayload;
  modules?: WizardModule[];
  corridorResults?: Array<{ slug: string; outcome: string; title?: string }>;
} | null> {
  const supabase = createServerClient();

  const { data: hubSession } = await supabase
    .from("emigro_hub_wizard_sessions")
    .select("id, answers, results")
    .eq("id", sessionId)
    .maybeSingle();

  if (hubSession?.results) {
    return {
      mode: "hub",
      sessionId: hubSession.id,
      answers: (hubSession.answers ?? {}) as Record<string, unknown>,
      payload: hubSession.results as GlobalEvalPayload,
    };
  }

  const { data: corridorSession } = await supabase
    .from("emigro_wizard_sessions")
    .select("id, answers, corridor_id, emigro_corridors(slug, title_ru)")
    .eq("id", sessionId)
    .maybeSingle();

  if (!corridorSession) return null;

  const corridorRaw = corridorSession.emigro_corridors;
  const corridor = (Array.isArray(corridorRaw) ? corridorRaw[0] : corridorRaw) as
    | { slug: string; title_ru: string }
    | null
    | undefined;
  if (!corridor) return null;

  const { data: results } = await supabase
    .from("emigro_eligibility_results")
    .select("outcome, score, emigro_programs(slug, title_ru)")
    .eq("session_id", sessionId)
    .order("score", { ascending: false })
    .limit(5);

  const wizard = await getWizardForCorridor(corridorSession.corridor_id);

  return {
    mode: "corridor",
    sessionId: corridorSession.id,
    corridorSlug: corridor.slug,
    corridorTitleRu: corridor.title_ru,
    answers: (corridorSession.answers ?? {}) as Record<string, unknown>,
    modules: wizard?.modules,
    corridorResults: (results ?? []).map((row) => {
      const programRaw = row.emigro_programs;
      const program = (Array.isArray(programRaw) ? programRaw[0] : programRaw) as
        | { slug: string; title_ru: string }
        | null
        | undefined;
      return {
        slug: program?.slug ?? "unknown",
        outcome: row.outcome,
        title: program?.title_ru,
      };
    }),
  };
}

/** Single owner DM when the user opens the wizard results page. */
export async function notifyWizardResultsView(
  props: Record<string, string>,
  ctx?: WizardFunnelContext
): Promise<void> {
  const sessionId = props.session_id?.trim();
  if (!sessionId) return;

  if (await ownerWizardDmAlreadySent(sessionId)) return;

  const loaded = await loadWizardSessionForOwnerNotify(sessionId);
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
