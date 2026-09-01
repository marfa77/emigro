/**
 * Threads access token helpers (short-lived → long-lived → refresh).
 * Server-side only — never expose THREADS_APP_SECRET to the client.
 */
import { existsSync, readFileSync, writeFileSync, chmodSync } from "fs";
import { resolve } from "path";
import {
  THREADS_EXCHANGE_URL,
  THREADS_OAUTH_TOKEN_URL,
  THREADS_REFRESH_URL,
  loadThreadsEnv,
} from "@/lib/threads/config";

export type ThreadsTokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  user_id?: number | string;
};

async function getJson(url: string): Promise<ThreadsTokenResponse> {
  const res = await fetch(url, { method: "GET" });
  const data = (await res.json()) as ThreadsTokenResponse & { error?: { message?: string } };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error?.message || `Threads token HTTP ${res.status}`);
  }
  return data;
}

async function postForm(url: string, body: Record<string, string>): Promise<ThreadsTokenResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });
  const data = (await res.json()) as ThreadsTokenResponse & { error?: { message?: string } };
  if (!res.ok || !data.access_token) {
    throw new Error(data.error?.message || `Threads token HTTP ${res.status}`);
  }
  return data;
}

/**
 * Exchange OAuth authorization `code` → short-lived user token (~1 hour).
 * https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/
 */
export async function exchangeAuthCodeForShortLivedToken(code: string): Promise<ThreadsTokenResponse> {
  const env = loadThreadsEnv();
  if (!env.appId || !env.appSecret || !env.redirectUri) {
    throw new Error("THREADS_APP_ID, THREADS_APP_SECRET, THREADS_REDIRECT_URI required");
  }
  return postForm(THREADS_OAUTH_TOKEN_URL, {
    client_id: env.appId,
    client_secret: env.appSecret,
    grant_type: "authorization_code",
    redirect_uri: env.redirectUri,
    code,
  });
}

/**
 * Exchange short-lived token → long-lived (~60 days).
 * https://developers.facebook.com/docs/threads/get-started/long-lived-tokens/
 */
export async function exchangeShortLivedForLongLived(
  shortLivedToken: string
): Promise<ThreadsTokenResponse> {
  const env = loadThreadsEnv();
  if (!env.appSecret) throw new Error("THREADS_APP_SECRET required");
  const u = new URL(THREADS_EXCHANGE_URL);
  u.searchParams.set("grant_type", "th_exchange_token");
  u.searchParams.set("client_secret", env.appSecret);
  u.searchParams.set("access_token", shortLivedToken);
  return getJson(u.toString());
}

/**
 * Refresh long-lived token (must be ≥24h old and not expired) → another ~60 days.
 */
export async function refreshLongLivedToken(
  longLivedToken?: string
): Promise<ThreadsTokenResponse> {
  const token = (longLivedToken || loadThreadsEnv().accessToken).trim();
  if (!token) throw new Error("long-lived access_token required");
  const u = new URL(THREADS_REFRESH_URL);
  u.searchParams.set("grant_type", "th_refresh_token");
  u.searchParams.set("access_token", token);
  return getJson(u.toString());
}

export function formatExpiresIn(expiresIn?: number): string {
  if (!expiresIn || !Number.isFinite(expiresIn)) return "unknown";
  const days = Math.round(expiresIn / 86400);
  return `${expiresIn}s (~${days}d)`;
}

/** Write THREADS_* into existing env files (`.env.local` / `.env` / `parser/.env`). Never logs the value. */
export function persistThreadsEnvValues(updates: Record<string, string>): string[] {
  const candidates = [
    resolve(process.cwd(), ".env.local"),
    resolve(process.cwd(), ".env"),
    resolve(process.cwd(), "parser/.env"),
  ];
  const written: string[] = [];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    let text = readFileSync(file, "utf8");
    let changed = false;
    for (const [key, value] of Object.entries(updates)) {
      if (!key || !value) continue;
      const line = `${key}=${value}`;
      const re = new RegExp(`^${key}=.*$`, "m");
      if (re.test(text)) {
        text = text.replace(re, line);
      } else {
        text = `${text.trimEnd()}\n${line}\n`;
      }
      changed = true;
    }
    if (!changed) continue;
    writeFileSync(file, text.endsWith("\n") ? text : `${text}\n`, { encoding: "utf8" });
    try {
      chmodSync(file, 0o600);
    } catch {
      /* ignore on Darwin */
    }
    written.push(file);
  }
  return written;
}
