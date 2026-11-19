import { createAdminClient } from "@/lib/admin/supabase";
import type { BotApp, BotSession } from "@/lib/telegram/bot/types";

const TTL_MS = 30 * 60 * 1000;
export const REQUEST_TTL_MS = 48 * 60 * 60 * 1000;

/**
 * The DB check constraint on emigro_bot_sessions.app predates the request flow (2026-11-19) and the
 * migration history cannot be pushed from here, so the request dialogue is stored under the retired
 * "assist" value. The old assist app no longer exists, so the mapping is unambiguous.
 */
const DB_APP: Partial<Record<BotApp, string>> = { request: "assist" };
export const REQUEST_DB_APP = "assist";

function toDbApp(app: BotApp): string {
  return DB_APP[app] ?? app;
}

function fromDbApp(app: string): BotApp {
  return (app === "assist" ? "request" : app) as BotApp;
}

function rowToSession(row: {
  telegram_user_id: number;
  app: string;
  step: string;
  payload: Record<string, unknown> | null;
  expires_at: string;
}): BotSession {
  return {
    telegramUserId: row.telegram_user_id,
    app: fromDbApp(row.app),
    step: row.step,
    payload: row.payload ?? {},
    expiresAt: row.expires_at,
  };
}

export async function getLiveSession(telegramUserId: number): Promise<BotSession | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("emigro_bot_sessions")
      .select("telegram_user_id, app, step, payload, expires_at")
      .eq("telegram_user_id", telegramUserId)
      .maybeSingle();
    if (error || !data) return null;
    if (new Date(data.expires_at).getTime() <= Date.now()) {
      await clearSession(telegramUserId);
      return null;
    }
    return rowToSession(data);
  } catch (e) {
    console.warn("[bot] get session failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

export async function setSession(input: {
  telegramUserId: number;
  app: BotApp;
  step: string;
  payload?: Record<string, unknown>;
  /** Default 30 min; the specialist-request dialogue lives 48 h so the reminder can bring people back. */
  ttlMs?: number;
}): Promise<void> {
  try {
    const supabase = createAdminClient();
    const expiresAt = new Date(Date.now() + (input.ttlMs ?? TTL_MS)).toISOString();
    const { error } = await supabase.from("emigro_bot_sessions").upsert(
      {
        telegram_user_id: input.telegramUserId,
        app: toDbApp(input.app),
        step: input.step,
        payload: input.payload ?? {},
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "telegram_user_id" }
    );
    if (error) console.warn("[bot] set session failed:", error.message);
  } catch (e) {
    console.warn("[bot] set session failed:", e instanceof Error ? e.message : e);
  }
}

export async function patchSession(
  telegramUserId: number,
  patch: { step?: string; payload?: Record<string, unknown> }
): Promise<void> {
  const live = await getLiveSession(telegramUserId);
  if (!live) return;
  await setSession({
    telegramUserId,
    app: live.app,
    step: patch.step ?? live.step,
    payload: patch.payload ?? live.payload,
    ttlMs: live.app === "request" ? REQUEST_TTL_MS : undefined,
  });
}

export async function clearSession(telegramUserId: number): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from("emigro_bot_sessions").delete().eq("telegram_user_id", telegramUserId);
  } catch (e) {
    console.warn("[bot] clear session failed:", e instanceof Error ? e.message : e);
  }
}
