/**
 * Smoke: send latest evaluated hub wizard report to TELEGRAM_ADMIN_CHAT_ID.
 *   npx tsx scripts/test-wizard-telegram-delivery.ts
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

import { createAdminClient } from "../lib/admin/supabase";
import { telegramAdminChatIds } from "../lib/telegram/admin-bot";
import { sendWizardReportToTelegramUser } from "../lib/wizard/send-telegram-report";

async function main(): Promise<number> {
  const adminId = [...telegramAdminChatIds()][0];
  if (!adminId) {
    console.error("TELEGRAM_ADMIN_CHAT_ID is not set");
    return 1;
  }

  const supabase = createAdminClient();
  const { data: sessions, error } = await supabase
    .from("emigro_hub_wizard_sessions")
    .select("id, created_at")
    .not("results", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("Supabase error:", error.message);
    return 1;
  }

  const session = sessions?.[0];
  if (!session) {
    console.error("No evaluated hub wizard sessions found");
    return 1;
  }

  console.log("Sending hub report", session.id, "to", adminId);
  const result = await sendWizardReportToTelegramUser({
    sessionId: session.id,
    telegramUserId: adminId,
    force: true,
  });
  console.log(result);
  return result.success ? 0 : 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
