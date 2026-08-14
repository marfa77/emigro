/**
 * Owner DM approval for #молния before channel publish.
 * Status markers on emigro_news_digests:
 * - threads_text starts with LIGHTNING_PENDING_MARK (+ optional JSON draft) → awaiting owner
 * - telegram_html = LIGHTNING_SKIP_MARK → rejected / not eligible
 * - telegram_message_ids length > 0 → published to channel
 *
 * On ✅: Telegram = one channel post; Threads = hook + slides reply-chain (soft-fail).
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
  encodeLightningPendingThreadsText,
  escapeTelegramHtml,
  isLightningPendingThreadsText,
  parseLightningPendingThreadsText,
  type LightningThreadsPayload,
} from "@/lib/news/story-lightning";
import { isAdminTelegramChat } from "@/lib/telegram/admin-bot";
import { composeThreadsChainFromRepost, newsStoryThreadsImageUrl } from "@/lib/threads/compose";
import { publishThreadsChain } from "@/lib/threads/client";
import { loadThreadsEnv } from "@/lib/threads/config";

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
  return isLightningPendingThreadsText(row.threads_text);
}

export async function loadOldestPendingLightning(supabase?: SupabaseClient): Promise<{
  slug: string;
  telegram_html: string;
  threadsPayload: LightningThreadsPayload | null;
} | null> {
  const db = supabase ?? createSupabaseAdmin();
  const { data, error } = await db
    .from("emigro_news_digests")
    .select("slug, telegram_html, threads_text, telegram_message_ids, published_at")
    .eq("format", "story")
    .like("threads_text", `${LIGHTNING_PENDING_MARK}%`)
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
    return {
      slug: row.slug as string,
      telegram_html: html,
      threadsPayload: parseLightningPendingThreadsText(row.threads_text as string | null),
    };
  }
  return null;
}

/** Save draft + ask owner in DM (does not post to channel). */
export async function requestLightningOwnerApproval(params: {
  supabase: SupabaseClient;
  slug: string;
  html: string;
  llmReason?: string;
  /** Numbered slides for Threads preview in DM. */
  threadsPaste?: string;
  /** Structured draft for auto-publish after ✅. */
  threadsPayload?: LightningThreadsPayload | null;
  dryRun?: boolean;
}): Promise<{ ok: boolean; reason: string }> {
  if (params.dryRun) {
    console.log(`[lightning-approval] dry-run would DM approve for ${params.slug}\n${params.html}`);
    if (params.threadsPaste) console.log(`[lightning-approval] threads paste:\n${params.threadsPaste}`);
    return { ok: true, reason: "dry-run" };
  }

  await params.supabase
    .from("emigro_news_digests")
    .update({
      telegram_html: params.html,
      threads_text: encodeLightningPendingThreadsText(params.threadsPayload ?? null),
      updated_at: new Date().toISOString(),
    })
    .eq("slug", params.slug);

  const threadsBlock = params.threadsPaste
    ? [
        "",
        "— Threads (после ✅ уйдёт цепочкой) —",
        "",
        `<pre>${escapeTelegramHtml(params.threadsPaste.slice(0, 1800))}</pre>`,
      ]
    : [];

  const preface = [
    `⚡ <b>Согласование #молния</b>`,
    `<code>${escapeTelegramHtml(params.slug)}</code>`,
    params.llmReason
      ? `<i>LLM:</i> ${escapeTelegramHtml(params.llmReason.slice(0, 180))}`
      : "",
    "",
    "— черновик (Telegram, один пост) —",
    "",
    params.html,
    ...threadsBlock,
    "",
    "— — —",
    "✅ Telegram + Threads · ❌ пропуск",
  ]
    .filter(Boolean)
    .join("\n");

  const dm = await sendOwnerTelegramHtmlWithButtons(preface, [
    [
      { text: "✅ TG + Threads", callback_data: LIGHTNING_CB_OK },
      { text: "❌ Пропуск", callback_data: LIGHTNING_CB_SKIP },
    ],
  ]);

  if (!dm.success) {
    return { ok: false, reason: dm.error || "dm-failed" };
  }
  return { ok: true, reason: "awaiting-owner" };
}

async function publishLightningToThreads(
  payload: LightningThreadsPayload
): Promise<{ ok: boolean; ids?: string[]; error?: string; skipped?: boolean }> {
  const env = loadThreadsEnv();
  if (!env.autoPublish) {
    return { ok: false, skipped: true, error: "THREADS_AUTO_PUBLISH≠1" };
  }
  if (!env.accessToken || !env.userId) {
    return { ok: false, skipped: true, error: "THREADS token/user missing" };
  }

  try {
    const imageUrl =
      payload.imageUrl?.trim() ||
      (() => {
        const m = (payload.pageUrl || "").match(/\/ru\/news\/([^/?#]+)/);
        return m ? newsStoryThreadsImageUrl(decodeURIComponent(m[1])) : undefined;
      })();

    const items = composeThreadsChainFromRepost({
      countryRu: payload.countryRu,
      flag: payload.flag,
      draft: { headline: payload.headline, slides: payload.slides },
      pageUrl: payload.pageUrl,
      imageUrl,
      ctaMode: "telegram",
    });
    const result = await publishThreadsChain({
      items,
      forcePublish: true,
      pauseMs: 800,
    });
    return { ok: true, ids: result.publishedIds };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function approvePendingLightning(): Promise<{
  ok: boolean;
  slug?: string;
  error?: string;
  threadsOk?: boolean;
  threadsError?: string;
  threadsSkipped?: boolean;
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
    console.log(`[lightning-approval] telegram published ${pending.slug}`);

    let threadsOk = false;
    let threadsError: string | undefined;
    let threadsSkipped = false;

    if (pending.threadsPayload) {
      const th = await publishLightningToThreads(pending.threadsPayload);
      threadsOk = th.ok;
      threadsError = th.error;
      threadsSkipped = Boolean(th.skipped);
      if (th.ok) {
        console.log(
          `[lightning-approval] threads published ${pending.slug}:`,
          th.ids?.join(",")
        );
      } else {
        console.warn(
          `[lightning-approval] threads failed ${pending.slug}:`,
          th.error
        );
      }
    } else {
      threadsSkipped = true;
      threadsError = "no-threads-draft";
      console.warn(`[lightning-approval] no Threads draft for ${pending.slug}`);
    }

    return {
      ok: true,
      slug: pending.slug,
      threadsOk,
      threadsError,
      threadsSkipped,
    };
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

function formatApproveDmNote(result: Awaited<ReturnType<typeof approvePendingLightning>>): string {
  if (!result.ok) return `⚠️ Не удалось: ${result.error}`;
  const slug = `<code>${result.slug}</code>`;
  let threadsLine = "Threads: —";
  if (result.threadsOk) threadsLine = "Threads: ✓";
  else if (result.threadsSkipped) {
    threadsLine = `Threads: пропуск (${result.threadsError || "n/a"})`;
  } else {
    threadsLine = `Threads: ✗ ${result.threadsError || "error"}`;
  }
  return `✅ Telegram: ✓ @Emigro_news\n${threadsLine}\n${slug}`;
}

/** Plain-text alert to owner private chat when publish has problems. */
async function notifyOwnerPublishErrors(
  result: Awaited<ReturnType<typeof approvePendingLightning>>
): Promise<void> {
  const { sendOwnerTelegramDm } = await import("@/lib/telegram");
  const slug = result.slug || "?";

  if (!result.ok) {
    await sendOwnerTelegramDm(
      `⚠️ #молния: ошибка Telegram\n${slug}\n${result.error || "unknown"}`
    );
    return;
  }

  if (result.threadsOk) return;

  const why = result.threadsError || (result.threadsSkipped ? "skipped" : "unknown");
  await sendOwnerTelegramDm(
    `⚠️ #молния: Telegram ✓, Threads ✗\n${slug}\n${why}`
  );
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
    const toast = result.ok
      ? result.threadsOk
        ? "TG + Threads"
        : "Telegram ок (ошибка Threads — в личку)"
      : result.error || "Ошибка";
    await answerNewsBotCallback(params.callbackQueryId, toast);
    if (params.messageId != null) {
      await editNewsBotMessageHtml(params.chatId, params.messageId, formatApproveDmNote(result));
    }
    await notifyOwnerPublishErrors(result);
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
  if (!result.ok) {
    const { sendOwnerTelegramDm } = await import("@/lib/telegram");
    await sendOwnerTelegramDm(
      `⚠️ #молния: не удалось пропустить\n${result.slug || "?"}\n${result.error || "unknown"}`
    );
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
        ? formatApproveDmNote(result).replace(/<\/?code>/g, "")
        : `⚠️ #молния publish failed: ${result.error}`
    );
    // Extra alert already covered by the summary DM above when Threads fails.
  } else {
    const result = await skipPendingLightning();
    await sendOwnerTelegramDm(
      result.ok ? `❌ #молния пропуск: ${result.slug}` : `⚠️ skip failed: ${result.error}`
    );
  }
  return true;
}
