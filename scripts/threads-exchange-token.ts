#!/usr/bin/env npx tsx
/**
 * Exchange short-lived Threads token → long-lived (~60d).
 *
 *   npm run threads:exchange-token -- --short=EAAG...
 *   npm run threads:exchange-token -- --code=AQBx...   # OAuth code → short → long
 *
 * Prints the long-lived token; store as THREADS_ACCESS_TOKEN (never commit).
 */
import { config } from "dotenv";
import { resolve } from "path";
import {
  exchangeAuthCodeForShortLivedToken,
  exchangeShortLivedForLongLived,
  formatExpiresIn,
  threadsAuthorizationUrl,
} from "../lib/threads";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3)?.trim() || undefined;
}

async function main() {
  if (process.argv.includes("--auth-url")) {
    console.log(threadsAuthorizationUrl());
    return;
  }

  const code = arg("code");
  let short = arg("short");

  if (code) {
    console.log("Exchanging OAuth code → short-lived…");
    const shortRes = await exchangeAuthCodeForShortLivedToken(code);
    short = shortRes.access_token;
    console.log("short-lived ok; user_id=", shortRes.user_id ?? "(n/a)");
    console.log("expires_in=", formatExpiresIn(shortRes.expires_in));
  }

  if (!short) {
    console.error(`Usage:
  npm run threads:exchange-token -- --auth-url
  npm run threads:exchange-token -- --short=<SHORT_LIVED_TOKEN>
  npm run threads:exchange-token -- --code=<OAUTH_CODE>

Needs THREADS_APP_SECRET in .env (and APP_ID + REDIRECT_URI for --code / --auth-url).`);
    process.exit(1);
  }

  console.log("Exchanging short-lived → long-lived…");
  const longRes = await exchangeShortLivedForLongLived(short);
  console.log("\n=== LONG-LIVED TOKEN (save to THREADS_ACCESS_TOKEN) ===\n");
  console.log(longRes.access_token);
  console.log("\nexpires_in=", formatExpiresIn(longRes.expires_in));
  console.log("token_type=", longRes.token_type ?? "bearer");
  if (longRes.user_id) console.log("user_id=", longRes.user_id, "(also set THREADS_USER_ID)");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
