/**
 * Daily subscriber counts → owner Telegram DM.
 *
 * Usage:
 *   npm run social:subscribers
 *   npm run social:subscribers -- --dry-run
 */
import { resolve } from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { formatSubscriberReportTelegram } from "@/lib/social-stats/format-telegram";
import { fetchAllSubscriberSnapshots } from "@/lib/social-stats/subscribers";
import { sendDailySubscriberDm } from "@/lib/social-stats/send-daily-dm";

const dryRun = process.argv.includes("--dry-run");

async function main() {
  if (dryRun) {
    const snapshots = await fetchAllSubscriberSnapshots();
    console.log(formatSubscriberReportTelegram(snapshots));
    return;
  }

  const result = await sendDailySubscriberDm();
  if (result.text) console.log(result.text);
  if (!result.sent) {
    console.error(result.error ?? result.skipped ?? "send failed");
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
