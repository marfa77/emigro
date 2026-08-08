/**
 * Owner DM approval for #молния before channel publish.
 * Status markers on emigro_news_digests:
 * - threads_text = LIGHTNING_PENDING_MARK, telegram_html = draft → awaiting owner
 * - telegram_html = LIGHTNING_SKIP_MARK → rejected / not eligible
 * - telegram_message_ids length > 0 → published to channel
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  answerNewsBotCallback,
  editNewsBotMessageHtml,
  publishNewsHtmlToChannel,
  sendOwnerTelegramHtmlWithButtons,
} from "@/lib/telegram";
import {
  LIGHTNING_PENDING_MARK,
  LIGHTNING_SKIP_MARK,
  escapeTelegramHtml,
} from "@/lib/news/story-lightning";
import { isAdminTelegramChat } from "@/lib/telegram/admin-bot";

export const LIGHTNING_CB_OK = "lg:ok";
export const LIGHTNING_CB_SKIP = "lg:no";

function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase env missing");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function isLightningPendingRow(row: {
  threads_text?: string | null;
  telegram_html?: string | null;
  telegram_message_ids?: number[] | null;
}): boolean {
  if ((row.telegram_message_ids ?? []).length > 0) return false;
  return (row.threads_text ?? "").trim() === LIGHTNING_PENDING_MARK;
}

export async function loadOldestPendingLightning(supabase?: SupabaseClient): Promise<{
  slug: string;
  telegram_html: string;
} | null> {
  const db = supabase ?? createSupabaseAdmin();
  const { data, error } = await db
    .from("emigro_news_digests")
    .select("slug, telegram_html, threads_text, telegram_message_ids, published_at")
    .eq("format", "story")
    .eq("threads_text", LIGHTNING_PENDING_MARK)
    .order("published_at", { ascending: true })
    .limit(5);

  if (error) {
    console.warn("[lightning-approval] load pending failed:", error.message);
    return null;
  }

  for (const row of data ?? []) {
    if (!isLightningPendingRow(row)) continue;
    const html = (row.telegram_html ?? "").trim();
    if (!html || html === LIGHTNING_SKIP_MARK) continue;
    return { slug: row.slug as string, telegram_html: html };
  }
  return null;
}

/** Save draft + ask owner in DM (does not post to channel). */
export async function requestLightningOwnerApproval(params: {
  supabase: SupabaseClient;
  slug: string;
  html: string;
  llmReason?: string;
  dryRun?: boolean;
}): Promise<{ ok: boolean; reason: string }> {
  if (params.dryRun) {
    console.log(`[lightning-approval] dry-run would DM approve for ${params.slug}\n${params.html}`);
    return { ok: true, reason: "dry-run" };
  }

  await params.supabase
    .from("emigro_news_digests")
    .update({
      telegram_html: params.html,
      threads_text: LIGHTNING_PENDING_MARK,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", params.slug);

  const preface = [
    `⚡ <b>Согласование #молния</b>`,
    `<code>${escapeTelegramHtml(params.slug)}</code>`,
    params.llmReason
      ? `<i>LLM:</i> ${escapeTelegramHtml(params.llmReason.slice(0, 180))}`
      : "",
    "",
    "— черновик —",
    "",
    params.html,
    "",
    "— — —",
    "✅ в канал · ❌ пропуск (кнопки ниже)",
  ]
    .filter(Boolean)
    .join("\n");

  const dm = await sendOwnerTelegramHtmlWithButtons(preface, [
    [
      { text: "✅ В канал", callback_data: LIGHTNING_CB_OK },
      { text: "❌ Пропуск", callback_data: LIGHTNING_CB_SKIP },
    ],
  ]);

  if (!dm.success) {
    return { ok: false, reason: dm.error || "dm-failed" };
  }
  return { ok: true, reason: "awaiting-owner" };
}

export async function approvePendingLightning(): Promise<{
  ok: boolean;
  slug?: string;
  error?: string;
}> {
  const supabase = createSupabaseAdmin();
  const pending = await loadOldestPendingLightning(supabase);
  if (!pending) return { ok: false, error: "no-pending" };

  try {
    const messageIds = await publishNewsHtmlToChannel(pending.telegram_html);
    await supabase
      .from("emigro_news_digests")
      .update({
        telegram_message_ids: messageIds,
        threads_text: null,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", pending.slug);
    console.log(`[lightning-approval] published ${pending.slug}`);
    return { ok: true, slug: pending.slug };
  } catch (e) {
    return { ok: false, slug: pending.slug, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function skipPendingLightning(): Promise<{
  ok: boolean;
  slug?: string;
  error?: string;
}> {
  const supabase = createSupabaseAdmin();
  const pending = await loadOldestPendingLightning(supabase);
  if (!pending) return { ok: false, error: "no-pending" };

  await supabase
    .from("emigro_news_digests")
    .update({
      telegram_html: LIGHTNING_SKIP_MARK,
      threads_text: null,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", pending.slug);

  console.log(`[lightning-approval] skipped ${pending.slug}`);
  return { ok: true, slug: pending.slug };
}

export async function handleLightningApprovalCallback(params: {
  data: string;
  chatId: string | number;
  userId?: string | number;
  callbackQueryId: string;
  messageId?: number;
}): Promise<boolean> {
  if (params.data !== LIGHTNING_CB_OK && params.data !== LIGHTNING_CB_SKIP) return false;

  if (!isAdminTelegramChat(params.chatId, params.userId)) {
    await answerNewsBotCallback(params.callbackQueryId, "Нет доступа");
    return true;
  }

  if (params.data === LIGHTNING_CB_OK) {
    const result = await approvePendingLightning();
    await answerNewsBotCallback(
      params.callbackQueryId,
      result.ok ? "Опубликовано в канал" : result.error || "Ошибка"
    );
    if (params.messageId != null) {
      const note = result.ok
        ? `✅ Опубликовано в @Emigro_news\n<code>${result.slug}</code>`
        : `⚠️ Не удалось: ${result.error}`;
      await editNewsBotMessageHtml(params.chatId, params.messageId, note);
    }
    return true;
  }

  const result = await skipPendingLightning();
  await answerNewsBotCallback(
    params.callbackQueryId,
    result.ok ? "Пропущено" : result.error || "Ошибка"
  );
  if (params.messageId != null) {
    const note = result.ok
      ? `❌ Пропуск #молния\n<code>${result.slug}</code>`
      : `⚠️ Не удалось: ${result.error}`;
    await editNewsBotMessageHtml(params.chatId, params.messageId, note);
  }
  return true;
}

export async function handleLightningApprovalCommand(params: {
  text: string;
  chatId: string | number;
  userId?: string | number;
}): Promise<boolean> {
  const t = params.text.trim().toLowerCase();
  const isOk = /^\/(?:молния_да|molniya_ok|lightning_ok)(?:@\w+)?$/i.test(t);
  const isSkip = /^\/(?:молния_нет|molniya_no|lightning_skip)(?:@\w+)?$/i.test(t);
  if (!isOk && !isSkip) return false;

  if (!isAdminTelegramChat(params.chatId, params.userId)) return true;

  const { sendOwnerTelegramDm } = await import("@/lib/telegram");
  if (isOk) {
    const result = await approvePendingLightning();
    await sendOwnerTelegramDm(
      result.ok
        ? `✅ #молния в канале: ${result.slug}`
        : `⚠️ #молния publish failed: ${result.error}`
    );
  } else {
    const result = await skipPendingLightning();
    await sendOwnerTelegramDm(
      result.ok ? `❌ #молния пропуск: ${result.slug}` : `⚠️ skip failed: ${result.error}`
    );
  }
  return true;
}
