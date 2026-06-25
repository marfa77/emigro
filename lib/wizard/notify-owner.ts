import { sendOwnerTelegramDm } from "@/lib/telegram";
import type { GlobalEvalPayload } from "@/lib/engine/run-global-evaluation";
import type { WizardModule } from "@/lib/types";
import {
  formatWizardCompletedTelegram,
  formatWizardCtaClickTelegram,
  formatWizardResultsClickTelegram,
  formatWizardResultsViewTelegram,
  formatWizardStartedTelegram,
  type WizardFunnelContext,
} from "@/lib/wizard/format-telegram";
import { iso2ToCountryRu } from "@/lib/wizard/geo-country";
import { inferEntryContext } from "@/lib/wizard/infer-entry-context";

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

export async function notifyWizardCtaClick(
  props: Record<string, string>,
  ctx?: WizardFunnelContext
): Promise<void> {
  const text = formatWizardCtaClickTelegram(props, ctx);
  const result = await sendOwnerTelegramDm(text);
  if (!result.success) console.warn("[wizard-notify] cta click:", result.error);
}

export async function notifyWizardStarted(
  props: Record<string, string>,
  ctx?: WizardFunnelContext
): Promise<void> {
  const text = formatWizardStartedTelegram(props, ctx);
  const result = await sendOwnerTelegramDm(text);
  if (!result.success) console.warn("[wizard-notify] started:", result.error);
}

export async function notifyWizardCompleted(input: {
  mode: "hub" | "corridor";
  sessionId: string;
  corridorSlug?: string;
  corridorTitleRu?: string;
  answers: Record<string, unknown>;
  payload?: GlobalEvalPayload;
  modules?: WizardModule[];
  corridorResults?: Array<{ slug: string; outcome: string; title?: string }>;
  ctx?: WizardFunnelContext;
}): Promise<void> {
  const text = formatWizardCompletedTelegram(input);
  const result = await sendOwnerTelegramDm(text);
  if (!result.success) console.warn("[wizard-notify] completed:", result.error);
}

export async function notifyWizardResultsView(
  props: Record<string, string>,
  ctx?: WizardFunnelContext
): Promise<void> {
  const text = formatWizardResultsViewTelegram(props, ctx);
  const result = await sendOwnerTelegramDm(text);
  if (!result.success) console.warn("[wizard-notify] results view:", result.error);
}

export async function notifyWizardResultsClick(
  props: Record<string, string>,
  ctx?: WizardFunnelContext
): Promise<void> {
  const text = formatWizardResultsClickTelegram(props, ctx);
  const result = await sendOwnerTelegramDm(text);
  if (!result.success) console.warn("[wizard-notify] results click:", result.error);
}
