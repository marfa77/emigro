import { createAdminClient } from "@/lib/admin/supabase";
import type { LoadedWizardSessionReport } from "@/lib/wizard/session-report";
import type { WizardTelegramMode } from "@/lib/telegram/deep-link";

export type WizardTelegramUserProfile = {
  telegramUserId: string | number;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  languageCode?: string | null;
  isPremium?: boolean | null;
};

export type WizardTelegramDeliverySource = "bot_start" | "login_widget";

function topRecommendationFromSession(session: LoadedWizardSessionReport): string | null {
  if (session.mode === "hub" && session.payload?.pick) {
    return `${session.payload.pick.countryRu} — ${session.payload.pick.programTitleRu}`;
  }
  const first = session.corridorResults?.[0];
  if (first?.title) return first.title;
  return null;
}

function matchCountFromSession(session: LoadedWizardSessionReport): number | null {
  if (session.mode === "hub" && session.payload?.results) {
    return session.payload.results.filter((r) => r.outcome !== "unlikely").length;
  }
  if (session.corridorResults?.length) {
    return session.corridorResults.filter((r) => r.outcome !== "unlikely").length;
  }
  return null;
}

export async function saveWizardTelegramUserDelivery(input: {
  profile: WizardTelegramUserProfile;
  session: LoadedWizardSessionReport;
  source: WizardTelegramDeliverySource;
  reportSent?: boolean;
}): Promise<void> {
  const telegramUserId = Number(input.profile.telegramUserId);
  if (!Number.isFinite(telegramUserId) || telegramUserId <= 0) return;

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  const { error: userError } = await supabase.from("emigro_wizard_telegram_users").upsert(
    {
      telegram_user_id: telegramUserId,
      username: input.profile.username?.trim() || null,
      first_name: input.profile.firstName?.trim() || null,
      last_name: input.profile.lastName?.trim() || null,
      language_code: input.profile.languageCode?.trim() || null,
      is_premium: input.profile.isPremium ?? null,
      last_seen_at: now,
    },
    { onConflict: "telegram_user_id", ignoreDuplicates: false }
  );

  if (userError) {
    console.warn("[wizard-telegram] user upsert failed:", userError.message);
    return;
  }

  const passportIso2 = (input.session.answers.passport_iso2 as string | undefined) ??
    (input.session.answers.passport as string | undefined);

  const { data: existingDelivery } = await supabase
    .from("emigro_wizard_telegram_deliveries")
    .select("id")
    .eq("telegram_user_id", telegramUserId)
    .eq("wizard_session_id", input.session.sessionId)
    .maybeSingle();

  if (!existingDelivery) {
    const { error: deliveryError } = await supabase.from("emigro_wizard_telegram_deliveries").insert({
      telegram_user_id: telegramUserId,
      wizard_session_id: input.session.sessionId,
      wizard_mode: input.session.mode as WizardTelegramMode,
      source: input.source,
      passport_iso2: passportIso2?.trim() || null,
      top_recommendation: topRecommendationFromSession(input.session),
      match_count: matchCountFromSession(input.session),
      report_sent: input.reportSent ?? true,
    });

    if (deliveryError) {
      console.warn("[wizard-telegram] delivery insert failed:", deliveryError.message);
      return;
    }

    const { count } = await supabase
      .from("emigro_wizard_telegram_deliveries")
      .select("id", { count: "exact", head: true })
      .eq("telegram_user_id", telegramUserId);

    await supabase
      .from("emigro_wizard_telegram_users")
      .update({ delivery_count: count ?? 1, last_seen_at: now })
      .eq("telegram_user_id", telegramUserId);
  } else {
    await supabase
      .from("emigro_wizard_telegram_users")
      .update({ last_seen_at: now })
      .eq("telegram_user_id", telegramUserId);
  }
}
