#!/usr/bin/env npx tsx
/**
 * Drain one (default) immigration story into @Emigro_news as ⚡ #молния.
 * Separate from news:stories so the channel is not flooded at 10:00 UTC.
 *
 *   npm run news:lightning -- --dry-run
 *   npm run news:lightning
 *   npm run news:lightning -- --max=1
 *   npm run news:lightning -- --resend-pending
 */
import { config } from "dotenv";
import { resolve } from "path";
import { runLightningTelegramQueue } from "../lib/news/run-lightning-queue";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function parseArgs() {
  const dryRun = process.argv.includes("--dry-run");
  const resendPending = process.argv.includes("--resend-pending");
  const maxArg = process.argv.find((a) => a.startsWith("--max="))?.split("=")[1];
  const maxPublish = maxArg ? Math.max(1, Number(maxArg)) : undefined;
  return { dryRun, maxPublish, resendPending };
}

async function main() {
  const { dryRun, maxPublish, resendPending } = parseArgs();
  if (resendPending) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
    if (!supabaseUrl || !serviceKey) throw new Error("Supabase env missing");
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { resendStaleLightningOwnerDm } = await import("../lib/news/run-lightning-queue");
    const result = await resendStaleLightningOwnerDm(supabase, { force: true });
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log(`⚡ Lightning queue${dryRun ? " [dry-run]" : ""}`);
  const result = await runLightningTelegramQueue({ dryRun, maxPublish });
  console.log(JSON.stringify(result, null, 2));
  if (result.awaitingApproval.length) {
    console.log(`Awaiting owner DM approval: ${result.awaitingApproval.join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
