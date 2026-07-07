import { createAdminClient } from "@/lib/admin/supabase";
import { sendStatsBotMessage } from "@/lib/telegram/admin-bot";
import type { WizardTelegramDeliverySource } from "@/lib/wizard/save-telegram-user";
import { saveWizardTelegramUserDelivery, type WizardTelegramUserProfile } from "@/lib/wizard/save-telegram-user";
import { formatUserWizardReportHtml } from "@/lib/wizard/format-user-report";
import { loadWizardSessionReport } from "@/lib/wizard/session-report";

const USER_REPORT_SENT_EVENT = "wizard_user_report_sent";

export async function userWizardReportAlreadySent(
  sessionId: string,
  telegramUserId: string
): Promise<boolean> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("site_events")
    .select("id", { count: "exact", head: true })
    .eq("event_name", USER_REPORT_SENT_EVENT)
    .contains("properties", { wizard_session_id: sessionId, telegram_user_id: telegramUserId });

  if (error) {
    console.warn("[wizard-telegram] dedup check failed:", error.message);
    return false;
  }
  return (count ?? 0) > 0;
}

async function markUserWizardReportSent(sessionId: string, telegramUserId: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase.from("site_events").insert({
    session_id: sessionId.slice(0, 128),
    event_name: USER_REPORT_SENT_EVENT,
    properties: { wizard_session_id: sessionId, telegram_user_id: telegramUserId },
  });
  if (error) console.warn("[wizard-telegram] dedup mark failed:", error.message);
}

export async function sendWizardReportToTelegramUser(input: {
  sessionId: string;
  telegramUserId: string | number;
  force?: boolean;
  profile?: WizardTelegramUserProfile;
  source?: WizardTelegramDeliverySource;
}): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  const sessionId = input.sessionId.trim();
  const telegramUserId = String(input.telegramUserId).trim();
  if (!sessionId || !telegramUserId) {
    return { success: false, error: "session_id and telegram user id required" };
  }

  const loaded = await loadWizardSessionReport(sessionId);
  if (!loaded) {
    return { success: false, error: "wizard session not found" };
  }

  const persistUser = async (reportSent: boolean) => {
    if (!input.profile) return;
    await saveWizardTelegramUserDelivery({
      profile: input.profile,
      session: loaded,
      source: input.source ?? "bot_start",
      reportSent,
    });
  };

  if (!input.force && (await userWizardReportAlreadySent(sessionId, telegramUserId))) {
    await persistUser(true);
    return { success: true, skipped: true };
  }

  const chunks = formatUserWizardReportHtml(loaded);
  for (const chunk of chunks) {
    const sent = await sendStatsBotMessage(telegramUserId, chunk, { parseMode: "HTML" });
    if (!sent.success) {
      await persistUser(false);
      return { success: false, error: sent.error ?? "telegram send failed" };
    }
  }

  await markUserWizardReportSent(sessionId, telegramUserId);
  await persistUser(true);
  return { success: true };
}
