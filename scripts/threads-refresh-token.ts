#!/usr/bin/env npx tsx
/**
 * Refresh long-lived Threads token (~60d again). Token must be ≥24h old and not expired.
 *
 *   npm run threads:refresh-token
 *   npm run threads:refresh-token -- --token=TH...
 */
import { config } from "dotenv";
import { resolve } from "path";
import { formatExpiresIn, refreshLongLivedToken } from "../lib/threads";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3)?.trim() || undefined;
}

async function main() {
  const refreshed = await refreshLongLivedToken(arg("token"));
  console.log("\n=== REFRESHED LONG-LIVED TOKEN (save to THREADS_ACCESS_TOKEN) ===\n");
  console.log(refreshed.access_token);
  console.log("\nexpires_in=", formatExpiresIn(refreshed.expires_in));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
