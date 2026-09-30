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
  tokenExpiresAtIso,
  threadsAuthorizationUrl,
} from "../lib/threads";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit?.slice(name.length + 3)?.trim() || undefined;
}

/** Portugal satellite uses the Emigro Meta app, never Barakhlo THREADS_APP_*. */
function useEmigroBrandApp(): void {
  const appId = (process.env.THREADS_EMIGRO_APP_ID || "").trim();
  const appSecret = (process.env.THREADS_EMIGRO_APP_SECRET || "").trim();
  const redirectUri = (process.env.THREADS_EMIGRO_REDIRECT_URI || "").trim();
  if (!appId || !appSecret || !redirectUri) {
    throw new Error("THREADS_EMIGRO_APP_ID / THREADS_EMIGRO_APP_SECRET / THREADS_EMIGRO_REDIRECT_URI required");
  }
  process.env.THREADS_APP_ID = appId;
  process.env.THREADS_APP_SECRET = appSecret;
  process.env.THREADS_REDIRECT_URI = redirectUri;
}

async function main() {
  const profile = arg("profile") || "brand";
  const portugalProfile = profile === "portugal";
  const investmentProfile = profile === "investment";
  if (!["brand", "investment", "portugal"].includes(profile)) {
    throw new Error("--profile must be brand|investment|portugal");
  }
  if (portugalProfile) useEmigroBrandApp();

  if (process.argv.includes("--auth-url")) {
    const state = portugalProfile ? "emigro_portugal" : investmentProfile ? "emigro_invest" : "emigro_assist";
    console.log(threadsAuthorizationUrl({ state }));
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
  process.env.THREADS_ACCESS_TOKEN = longRes.access_token;
  if (longRes.user_id) process.env.THREADS_USER_ID = String(longRes.user_id);

  const { fetchThreadsMe } = await import("../lib/threads/client");
  const { assertThreadsBrandUsername, expectedThreadsBrandUsername, normalizeThreadsUsername } =
    await import("../lib/threads/config");
  const me = await fetchThreadsMe();
  console.log("whoami", `@${me.username}`, me.id);
  if (portugalProfile) {
    const { assertPortugalSatelliteAccountIsolated } = await import(
      "../lib/threads/portugal-satellite"
    );
    assertPortugalSatelliteAccountIsolated(me);
    console.log("OK — Portugal satellite @emigro_portugal");
  } else if (investmentProfile) {
    const { loadThreadsInvestmentVerticalConfig } = await import(
      "../lib/threads/investment-vertical"
    );
    const expected = loadThreadsInvestmentVerticalConfig().username;
    if (normalizeThreadsUsername(me.username) !== expected) {
      throw new Error(`Threads token is @${me.username}, expected @${expected}.`);
    }
    console.log(`OK — investment @${expected}`);
  } else {
    assertThreadsBrandUsername(me.username);
    console.log(`OK — @${expectedThreadsBrandUsername()}`);
  }

  const write = process.argv.includes("--write");
  if (write) {
    const { persistThreadsEnvValues } = await import("../lib/threads/tokens");
    const tokenKey = portugalProfile
      ? "THREADS_PT_SAT_ACCESS_TOKEN"
      : investmentProfile
        ? "THREADS_INVESTMENT_ACCESS_TOKEN"
        : "THREADS_ACCESS_TOKEN";
    const userIdKey = portugalProfile
      ? "THREADS_PT_SAT_USER_ID"
      : investmentProfile
        ? "THREADS_INVESTMENT_USER_ID"
        : "THREADS_USER_ID";
    const expiresKey = portugalProfile
      ? "THREADS_PT_SAT_TOKEN_EXPIRES_AT"
      : investmentProfile
        ? "THREADS_INVESTMENT_TOKEN_EXPIRES_AT"
        : "THREADS_TOKEN_EXPIRES_AT";
    const updates: Record<string, string> = { [tokenKey]: longRes.access_token };
    const expiresAt = tokenExpiresAtIso(longRes.expires_in);
    if (expiresAt) updates[expiresKey] = expiresAt;
    if (longRes.user_id) updates[userIdKey] = String(longRes.user_id);
    if (me.id) updates[userIdKey] = me.id;
    if (portugalProfile) updates.THREADS_PT_SAT_USERNAME = "emigro_portugal";
    if (investmentProfile) updates.THREADS_INVESTMENT_USERNAME = "emigro_invest";
    const files = persistThreadsEnvValues(updates);
    console.log(`Wrote ${tokenKey} to`, files.join(", ") || "(no .env files found)");
  } else {
    console.log("\n=== LONG-LIVED TOKEN (save to THREADS_ACCESS_TOKEN, or re-run with --write) ===\n");
    console.log(longRes.access_token);
  }
  console.log("\nexpires_in=", formatExpiresIn(longRes.expires_in));
  console.log("token_type=", longRes.token_type ?? "bearer");
  if (longRes.user_id || me.id) {
    console.log("user_id=", longRes.user_id || me.id, "(THREADS_USER_ID)");
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
