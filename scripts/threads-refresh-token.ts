#!/usr/bin/env npx tsx
/**
 * Refresh long-lived Threads token (~60d again). Token must be ≥24h old and not expired.
 *
 *   npm run threads:refresh-token
 *   npm run threads:refresh-token -- --token=TH...
 */
import { config } from "dotenv";
import { resolve } from "path";
import { formatExpiresIn, persistThreadsEnvValues, refreshLongLivedToken } from "../lib/threads";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3)?.trim() || undefined;
}

async function main() {
  const refreshed = await refreshLongLivedToken(arg("token"));
  const write = process.argv.includes("--write") || process.argv.includes("--persist");
  if (write) {
    const files = persistThreadsEnvValues({ THREADS_ACCESS_TOKEN: refreshed.access_token });
    console.log("Refreshed THREADS_ACCESS_TOKEN in", files.join(", ") || "(no .env files found)");
  } else {
    console.log("\n=== REFRESHED LONG-LIVED TOKEN (save to THREADS_ACCESS_TOKEN, or --write) ===\n");
    console.log(refreshed.access_token);
  }
  console.log("expires_in=", formatExpiresIn(refreshed.expires_in));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
