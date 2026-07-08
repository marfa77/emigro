import { formatSubscriberReportTelegram } from "@/lib/social-stats/format-telegram";
import { fetchAllSubscriberSnapshots } from "@/lib/social-stats/subscribers";
import { sendOwnerTelegramDm } from "@/lib/telegram";

function socialStatsEnabled(): boolean {
  return process.env.EMIGRO_SOCIAL_STATS_ENABLED !== "0";
}

export async function sendDailySubscriberDm(): Promise<{
  sent: boolean;
  skipped?: string;
  text?: string;
  snapshots?: Awaited<ReturnType<typeof fetchAllSubscriberSnapshots>>;
  error?: string;
}> {
  if (!socialStatsEnabled()) {
    return { sent: false, skipped: "EMIGRO_SOCIAL_STATS_ENABLED=0" };
  }

  const snapshots = await fetchAllSubscriberSnapshots();
  const text = formatSubscriberReportTelegram(snapshots);
  const result = await sendOwnerTelegramDm(text);

  if (!result.success) {
    return { sent: false, text, snapshots, error: result.error ?? "Telegram DM failed" };
  }

  return { sent: true, text, snapshots };
}
