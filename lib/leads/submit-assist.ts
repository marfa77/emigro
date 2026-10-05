import { isValidWizardSessionId } from "@/lib/assist/session-id";
import { trackServerEvent } from "@/lib/analytics/server";
import { getCorridorBySlug } from "@/lib/corridor/queries";
import { formatAssistLeadTelegramMessage } from "@/lib/leads/format-telegram";
import { createAdminClient } from "@/lib/admin/supabase";
import { looksLikeTelegramPublicContact } from "@/lib/telegram/public-url";
import { sendOwnerTelegramDm } from "@/lib/telegram";

export const ASSIST_PLAN_TIER_LABELS: Record<string, string> = {
  "partner-match": "Бесплатный подбор партнёра",
  "route-check": "Route Check (€129)",
  accompaniment: "Сопровождение (€100/час)",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  paypal: "PayPal",
  telegram_stars: "Telegram Stars",
  crypto: "Crypto (USDT/USDC)",
  card: "Оплата картой (Gumroad)",
};

export type SubmitAssistLeadInput = {
  country: string;
  corridorSlug?: string;
  destinationIso2?: string;
  programRoute: string;
  planTier?: string;
  paymentMethod?: string;
  selectedProviders?: string[];
  name: string;
  contact: string;
  message: string;
  source?: string;
  sessionId?: string | null;
  preferredLanguage?: "ru" | "es" | "fr";
};

export type SubmitAssistLeadResult = {
  leadId: string | null;
  stored: boolean;
  storageError?: string;
};

export async function submitAssistLead(input: SubmitAssistLeadInput): Promise<SubmitAssistLeadResult> {
  const source = input.source || "emigro_assist";
  const planTier = input.planTier || "partner-match";
  const sessionId = input.sessionId && isValidWizardSessionId(input.sessionId) ? input.sessionId : null;
  const providers = input.selectedProviders ?? [];
  const notes = [
    `Source: ${source}`,
    `Plan: ${ASSIST_PLAN_TIER_LABELS[planTier] ?? planTier}`,
    planTier === "partner-match"
      ? "Payment: бесплатно"
      : `Payment: ${PAYMENT_METHOD_LABELS[input.paymentMethod ?? ""] ?? (input.paymentMethod || "—")}`,
    `Country: ${input.country}${input.destinationIso2 ? ` (${input.destinationIso2})` : ""}`,
    `Program/route: ${input.programRoute}`,
    providers.length ? `Selected providers: ${providers.join(", ")}` : "Selected providers: —",
    "",
    input.message,
  ].join("\n");

  let leadId: string | null = null;
  let stored = false;
  let storageError: string | undefined;

  try {
    let corridorId: string | null = null;
    if (input.corridorSlug) {
      const corridor = await getCorridorBySlug(input.corridorSlug);
      if (corridor) corridorId = corridor.id;
    }
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("emigro_manual_leads")
      .insert({
        corridor_id: corridorId,
        destination_iso2: input.destinationIso2 || null,
        session_id: sessionId,
        name: input.name,
        email: input.contact,
        telegram: looksLikeTelegramPublicContact(input.contact) ? input.contact : null,
        notes,
        passport_iso2: null,
        selected_program_slugs: [input.programRoute],
        preferred_language: input.preferredLanguage ?? "ru",
        status: "new",
        source,
      })
      .select("id")
      .single();
    if (error) storageError = error.message;
    else {
      leadId = data.id;
      stored = true;
    }
  } catch (err) {
    storageError = err instanceof Error ? err.message : "Lead storage failed";
  }

  await trackServerEvent("assist_lead_submitted", {
    source,
    lead_id: leadId ?? "",
    stored,
    country: input.country,
    corridor_slug: input.corridorSlug ?? "",
    provider_count: providers.length,
    plan_tier: planTier,
    payment_method: input.paymentMethod ?? "",
    session_id: sessionId ?? "",
  });

  if (storageError) {
    await trackServerEvent("lead_error", {
      source,
      country: input.country,
      corridor_slug: input.corridorSlug ?? "",
      message: storageError,
    });
  }

  const tg = await sendOwnerTelegramDm(
    formatAssistLeadTelegramMessage({
      leadId,
      stored,
      country: input.country,
      corridorSlug: input.corridorSlug,
      programRoute: input.programRoute,
      planTier: ASSIST_PLAN_TIER_LABELS[planTier] ?? planTier,
      paymentMethod:
        planTier === "partner-match"
          ? "Бесплатно"
          : PAYMENT_METHOD_LABELS[input.paymentMethod ?? ""] ?? input.paymentMethod,
      selectedProviders: providers,
      name: input.name,
      contact: input.contact,
      message: input.message,
    })
  );
  if (!tg.success) {
    console.warn("[assist-leads] Telegram DM failed:", tg.error);
  }

  return { leadId, stored, storageError };
}
