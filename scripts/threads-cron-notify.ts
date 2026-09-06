#!/usr/bin/env npx tsx
/**
 * Owner DM for Threads cron failures (daily / satellites).
 *
 *   npx tsx scripts/threads-cron-notify.ts --stream=daily --error="..."
 */
import { config } from "dotenv";
import { resolve } from "path";
import { sendOwnerTelegramDm } from "../lib/telegram";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "parser/.env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3) || undefined;
}

async function main() {
  const stream = (arg("stream") || "threads").trim();
  const error = (arg("error") || process.argv.slice(2).filter((a) => !a.startsWith("--")).join(" ") || "unknown error").trim();
  const text = [
    `❌ Emigro Threads — ${stream}`,
    `@emigro_assist`,
    "",
    error.slice(0, 3500),
  ].join("\n");

  const sent = await sendOwnerTelegramDm(text);
  if (!sent.success) {
    console.error("[threads-cron-notify] DM failed:", sent.error);
    process.exit(1);
  }
  console.log("[threads-cron-notify] DM sent");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
