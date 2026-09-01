/**
 * Owner DM approval for #молния before channel / Threads publish.
 *
 * Status markers on emigro_news_digests.threads_text:
 * - LIGHTNING_PENDING_MARK → awaiting TG and/or Threads
 * - LIGHTNING_THREADS_PENDING_MARK → TG live, Threads still awaiting
 * - LIGHTNING_TG_PENDING_MARK → Threads live, TG still awaiting
 * - LIGHTNING_THREADS_PUBLISHED_MARK → Threads already live (Sunday cron skip)
 * - telegram_html = LIGHTNING_SKIP_MARK → rejected / not eligible
 * - telegram_message_ids length > 0 → published to Telegram channel
 *
 * Approve TG and Threads independently (separate inline buttons).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  answerNewsBotCallback,
  editNewsBotMessageHtml,
  publishNewsHtmlToChannel,
  sendOwnerTelegramHtmlWithButtons,
  type TelegramInlineButton,
} from "@/lib/telegram";
import {
  LIGHTNING_PENDING_MARK,
  LIGHTNING_SKIP_MARK,
  LIGHTNING_TG_PENDING_MARK,
  LIGHTNING_THREADS_PENDING_MARK,
  LIGHTNING_THREADS_PUBLISHED_MARK,
  encodeLightningPendingThreadsText,
  escapeTelegramHtml,
  isLightningAwaitingOwner,
  isLightningThreadsAlreadyPosted,
  lightningOwnerMarkOf,
  parseLightningPendingThreadsText,
  type LightningOwnerMark,
  type LightningThreadsPayload,
} from "@/lib/news/story-lightning";
import { isAdminTelegramChat } from "@/lib/telegram/admin-bot";
import { composeThreadsChainFromRepost } from "@/lib/threads/compose";
import { publishThreadsChain } from "@/lib/threads/client";
import { loadThreadsEnv } from "@/lib/threads/config";
import { formatThreadsPaste } from "@/lib/news/threads-repost-style";

/** Approve Telegram only. */
export const LIGHTNING_CB_TG = "lg:tg";
/** Approve Threads only. */
export const LIGHTNING_CB_TH = "lg:th";
/** Skip remaining channel(s). */
export const LIGHTNING_CB_SKIP = "lg:no";
/** @deprecated combined approve — still handled for old DMs. */
export const LIGHTNING_CB_OK = "lg:ok";

/** Telegram callback_data max = 64 bytes. */
function lightningCb(prefix: string, slug?: string): string {
  if (!slug) return prefix;
  const withSlug = `${prefix}:${slug}`;
  return Buffer.byteLength(withSlug, "utf8") <= 64 ? withSlug : prefix;
}

function parseLightningCb(data: string): {
  action: "tg" | "th" | "skip" | "ok" | null;
  slug?: string;
} {
  if (data === LIGHTNING_CB_OK || data.startsWith(`${LIGHTNING_CB_OK}:`)) {
    return { action: "ok", slug: data.includes(":") ? data.slice(LIGHTNING_CB_OK.length + 1) : undefined };
  }
  if (data === LIGHTNING_CB_TG || data.startsWith(`${LIGHTNING_CB_TG}:`)) {
    return { action: "tg", slug: data.includes(":") ? data.slice(LIGHTNING_CB_TG.length + 1) : undefined };
  }
  if (data === LIGHTNING_CB_TH || data.startsWith(`${LIGHTNING_CB_TH}:`)) {
    return { action: "th", slug: data.includes(":") ? data.slice(LIGHTNING_CB_TH.length + 1) : undefined };
  }
  if (data === LIGHTNING_CB_SKIP || data.startsWith(`${LIGHTNING_CB_SKIP}:`)) {
    return { action: "skip", slug: data.includes(":") ? data.slice(LIGHTNING_CB_SKIP.length + 1) : undefined };
  }
  return { action: null };
}

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

type PendingLightning = {
  slug: string;
  telegram_html: string;
  threads_text: string;
  mark: LightningOwnerMark;
  threadsPayload: LightningThreadsPayload | null;
  tgPublished: boolean;
};

export function isLightningPendingRow(row: {
  threads_text?: string | null;
  telegram_html?: string | null;
  telegram_message_ids?: number[] | null;
}): boolean {
  const mark = lightningOwnerMarkOf(row.threads_text);
  if (!mark) return false;
  if (mark === LIGHTNING_PENDING_MARK || mark === LIGHTNING_TG_PENDING_MARK) {
    const html = (row.telegram_html ?? "").trim();
    if (!html || html === LIGHTNING_SKIP_MARK) return false;
  }
  return true;
}

function lightningKeyboard(mark: LightningOwnerMark, slug: string): TelegramInlineButton[][] {
  if (mark === LIGHTNING_THREADS_PENDING_MARK) {
    return [
      [
        { text: "✅ Threads", callback_data: lightningCb(LIGHTNING_CB_TH, slug) },
        { text: "❌ Без Threads", callback_data: lightningCb(LIGHTNING_CB_SKIP, slug) },
      ],
    ];
  }
  if (mark === LIGHTNING_TG_PENDING_MARK) {
    return [
      [
        { text: "✅ Telegram", callback_data: lightningCb(LIGHTNING_CB_TG, slug) },
        { text: "❌ Без Telegram", callback_data: lightningCb(LIGHTNING_CB_SKIP, slug) },
      ],
    ];
  }
  return [
    [
      { text: "✅ Telegram", callback_data: lightningCb(LIGHTNING_CB_TG, slug) },
      { text: "✅ Threads", callback_data: lightningCb(LIGHTNING_CB_TH, slug) },
    ],
    [{ text: "❌ Пропуск всего", callback_data: lightningCb(LIGHTNING_CB_SKIP, slug) }],
  ];
}

function statusLineForMark(mark: LightningOwnerMark): string {
  if (mark === LIGHTNING_THREADS_PENDING_MARK) {
    return "Telegram: ✓ · ждём решение по Threads";
  }
  if (mark === LIGHTNING_TG_PENDING_MARK) {
    return "Threads: ✓ · ждём решение по Telegram";
  }
  return "Выбери канал отдельно — не всё из Telegram нужно в Threads";
}

async function loadPendingLightning(
  supabase?: SupabaseClient,
  slug?: string
): Promise<PendingLightning | null> {
  const db = supabase ?? createSupabaseAdmin();

  if (slug?.trim()) {
    const { data, error } = await db
      .from("emigro_news_digests")
      .select("slug, telegram_html, threads_text, telegram_message_ids, published_at")
      .eq("slug", slug.trim())
      .maybeSingle();
    if (error) {
      console.warn("[lightning-approval] load by slug failed:", error.message);
      return null;
    }
    if (!data || !isLightningPendingRow(data)) return null;
    const mark = lightningOwnerMarkOf(data.threads_text as string | null);
    if (!mark) return null;
    return {
      slug: data.slug as string,
      telegram_html: (data.telegram_html ?? "").trim(),
      threads_text: String(data.threads_text ?? ""),
      mark,
      threadsPayload: parseLightningPendingThreadsText(data.threads_text as string | null),
      tgPublished: ((data.telegram_message_ids ?? []) as number[]).length > 0,
    };
  }

  // Avoid SQL LIKE `_` wildcards in mark names — fetch candidates and filter in JS.
  const { data, error } = await db
    .from("emigro_news_digests")
    .select("slug, telegram_html, threads_text, telegram_message_ids, published_at")
    .eq("format", "story")
    .not("threads_text", "is", null)
    .order("published_at", { ascending: true })
    .limit(40);

  if (error) {
    console.warn("[lightning-approval] load pending failed:", error.message);
    return null;
  }

  for (const row of data ?? []) {
    if (!isLightningPendingRow(row)) continue;
    const mark = lightningOwnerMarkOf(row.threads_text as string | null);
    if (!mark) continue;
    const html = (row.telegram_html ?? "").trim();
    return {
      slug: row.slug as string,
      telegram_html: html,
      threads_text: String(row.threads_text ?? ""),
      mark,
      threadsPayload: parseLightningPendingThreadsText(row.threads_text as string | null),
      tgPublished: ((row.telegram_message_ids ?? []) as number[]).length > 0,
    };
  }
  return null;
}

/** @deprecated use loadPendingLightning */
async function loadOldestPendingLightning(supabase?: SupabaseClient) {
  return loadPendingLightning(supabase);
}

function buildApprovalDmHtml(params: {
  slug: string;
  html: string;
  llmReason?: string;
  threadsPaste?: string;
  mark: LightningOwnerMark;
}): string {
  const threadsBlock = params.threadsPaste
    ? [
        "",
        "— Threads (отдельное согласование) —",
        "",
        `<pre>${escapeTelegramHtml(params.threadsPaste.slice(0, 1800))}</pre>`,
      ]
    : [];

  return [
    `⚡ <b>Согласование #молния</b>`,
    `<code>${escapeTelegramHtml(params.slug)}</code>`,
    params.llmReason
      ? `<i>LLM:</i> ${escapeTelegramHtml(params.llmReason.slice(0, 180))}`
      : "",
    "",
    statusLineForMark(params.mark),
    "",
    "— черновик Telegram (один пост) —",
    "",
    params.html,
    ...threadsBlock,
    "",
    "— — —",
    statusLineForMark(params.mark),
  ]
    .filter(Boolean)
    .join("\n");
}

/** Save draft + ask owner in DM (does not post to channel). */
export async function requestLightningOwnerApproval(params: {
  supabase: SupabaseClient;
  slug: string;
  html: string;
  llmReason?: string;
  /** Numbered slides for Threads preview in DM. */
  threadsPaste?: string;
  /** Structured draft for auto-publish after ✅ Threads. */
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

  const preface = buildApprovalDmHtml({
    slug: params.slug,
    html: params.html,
    llmReason: params.llmReason,
    threadsPaste: params.threadsPaste,
    mark: LIGHTNING_PENDING_MARK,
  });

  const dm = await sendOwnerTelegramHtmlWithButtons(
    preface,
    lightningKeyboard(LIGHTNING_PENDING_MARK, params.slug)
  );

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
    const items = composeThreadsChainFromRepost({
      countryRu: payload.countryRu,
      flag: payload.flag,
      draft: { headline: payload.headline, slides: payload.slides },
      pageUrl: payload.pageUrl,
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

type ChannelActionResult = {
  ok: boolean;
  slug?: string;
  error?: string;
  /** Remaining owner mark, or null if fully resolved. */
  remainingMark?: LightningOwnerMark | null;
  threadsOk?: boolean;
  threadsError?: string;
  threadsSkipped?: boolean;
  tgOk?: boolean;
};

export async function approveLightningTelegram(slug?: string): Promise<ChannelActionResult> {
  const supabase = createSupabaseAdmin();
  const pending = await loadPendingLightning(supabase, slug);
  if (!pending) return { ok: false, error: "no-pending" };

  if (
    pending.mark !== LIGHTNING_PENDING_MARK &&
    pending.mark !== LIGHTNING_TG_PENDING_MARK
  ) {
    return { ok: false, slug: pending.slug, error: "tg-not-awaiting" };
  }
  if (pending.tgPublished) {
    return { ok: false, slug: pending.slug, error: "tg-already-published" };
  }

  try {
    const messageIds = await publishNewsHtmlToChannel(pending.telegram_html);
    const stillWantThreads =
      pending.mark === LIGHTNING_PENDING_MARK && Boolean(pending.threadsPayload);
    const threadsAlreadyLive = pending.mark === LIGHTNING_TG_PENDING_MARK;

    const nextMark: LightningOwnerMark | null = stillWantThreads
      ? LIGHTNING_THREADS_PENDING_MARK
      : null;

    await supabase
      .from("emigro_news_digests")
      .update({
        telegram_message_ids: messageIds,
        threads_text: nextMark
          ? encodeLightningPendingThreadsText(pending.threadsPayload, nextMark)
          : threadsAlreadyLive
            ? LIGHTNING_THREADS_PUBLISHED_MARK
            : null,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", pending.slug);

    console.log(`[lightning-approval] telegram published ${pending.slug}`);
    return { ok: true, slug: pending.slug, tgOk: true, remainingMark: nextMark };
  } catch (e) {
    return { ok: false, slug: pending.slug, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function approveLightningThreads(slug?: string): Promise<ChannelActionResult> {
  const supabase = createSupabaseAdmin();
  const pending = await loadPendingLightning(supabase, slug);
  if (!pending) return { ok: false, error: "no-pending" };

  if (
    pending.mark !== LIGHTNING_PENDING_MARK &&
    pending.mark !== LIGHTNING_THREADS_PENDING_MARK
  ) {
    return { ok: false, slug: pending.slug, error: "threads-not-awaiting" };
  }

  if (!pending.threadsPayload) {
    return {
      ok: false,
      slug: pending.slug,
      error: "no-threads-draft",
      threadsSkipped: true,
      threadsError: "no-threads-draft",
    };
  }

  const th = await publishLightningToThreads(pending.threadsPayload);
  if (!th.ok) {
    console.warn(`[lightning-approval] threads failed ${pending.slug}:`, th.error);
    return {
      ok: false,
      slug: pending.slug,
      error: th.error || "threads-failed",
      threadsOk: false,
      threadsError: th.error,
      threadsSkipped: Boolean(th.skipped),
    };
  }

  console.log(`[lightning-approval] threads published ${pending.slug}:`, th.ids?.join(","));

  const stillWantTg =
    pending.mark === LIGHTNING_PENDING_MARK && !pending.tgPublished;

  const nextMark: LightningOwnerMark | null = stillWantTg ? LIGHTNING_TG_PENDING_MARK : null;

  await supabase
    .from("emigro_news_digests")
    .update({
      threads_text: nextMark
        ? encodeLightningPendingThreadsText(pending.threadsPayload, nextMark)
        : LIGHTNING_THREADS_PUBLISHED_MARK,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", pending.slug);

  return {
    ok: true,
    slug: pending.slug,
    threadsOk: true,
    remainingMark: nextMark,
  };
}

/** @deprecated Prefer approveLightningTelegram / approveLightningThreads. */
export async function approvePendingLightning(slug?: string): Promise<{
  ok: boolean;
  slug?: string;
  error?: string;
  threadsOk?: boolean;
  threadsError?: string;
  threadsSkipped?: boolean;
}> {
  const tg = await approveLightningTelegram(slug);
  if (!tg.ok) return tg;

  if (tg.remainingMark !== LIGHTNING_THREADS_PENDING_MARK) {
    return { ok: true, slug: tg.slug, threadsOk: false, threadsSkipped: true, threadsError: "no-threads-left" };
  }

  const th = await approveLightningThreads(slug || tg.slug);
  return {
    ok: true,
    slug: tg.slug || th.slug,
    threadsOk: th.ok && th.threadsOk,
    threadsError: th.threadsError || th.error,
    threadsSkipped: th.threadsSkipped,
  };
}

export async function skipPendingLightning(slug?: string): Promise<{
  ok: boolean;
  slug?: string;
  error?: string;
  skippedWhat?: "all" | "threads" | "telegram";
}> {
  const supabase = createSupabaseAdmin();
  const pending = await loadPendingLightning(supabase, slug);
  if (!pending) return { ok: false, error: "no-pending" };

  if (pending.mark === LIGHTNING_THREADS_PENDING_MARK) {
    // TG already live — drop Threads wait only.
    await supabase
      .from("emigro_news_digests")
      .update({
        threads_text: null,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", pending.slug);
    console.log(`[lightning-approval] skipped remaining Threads ${pending.slug}`);
    return { ok: true, slug: pending.slug, skippedWhat: "threads" };
  }

  if (pending.mark === LIGHTNING_TG_PENDING_MARK) {
    // Threads already live — skip TG, keep a cron skip mark.
    await supabase
      .from("emigro_news_digests")
      .update({
        telegram_html: LIGHTNING_SKIP_MARK,
        threads_text: LIGHTNING_THREADS_PUBLISHED_MARK,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", pending.slug);
    console.log(`[lightning-approval] skipped remaining Telegram ${pending.slug}`);
    return { ok: true, slug: pending.slug, skippedWhat: "telegram" };
  }

  await supabase
    .from("emigro_news_digests")
    .update({
      telegram_html: LIGHTNING_SKIP_MARK,
      threads_text: null,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", pending.slug);

  console.log(`[lightning-approval] skipped all ${pending.slug}`);
  return { ok: true, slug: pending.slug, skippedWhat: "all" };
}

async function refreshOrFinalizeDm(params: {
  chatId: string | number;
  messageId?: number;
  slug: string;
  telegramHtml: string;
  threadsPayload?: LightningThreadsPayload | null;
  remainingMark: LightningOwnerMark | null | undefined;
  finalNote: string;
}): Promise<void> {
  if (params.messageId == null) return;

  if (params.remainingMark) {
    const threadsPaste = params.threadsPayload
      ? formatThreadsPaste(
          {
            headline: params.threadsPayload.headline,
            slides: params.threadsPayload.slides,
          },
          params.threadsPayload.countryRu
        )
      : undefined;
    const html = buildApprovalDmHtml({
      slug: params.slug,
      html: params.telegramHtml,
      threadsPaste,
      mark: params.remainingMark,
    });
    await editNewsBotMessageHtml(
      params.chatId,
      params.messageId,
      html,
      lightningKeyboard(params.remainingMark, params.slug)
    );
    return;
  }

  await editNewsBotMessageHtml(params.chatId, params.messageId, params.finalNote);
}

/** Plain-text alert to owner private chat when publish has problems. */
async function notifyOwnerChannelError(kind: "telegram" | "threads", slug: string, error: string) {
  const { sendOwnerTelegramDm } = await import("@/lib/telegram");
  await sendOwnerTelegramDm(`⚠️ #молния: ошибка ${kind}\n${slug}\n${error}`);
}

export async function handleLightningApprovalCallback(params: {
  data: string;
  chatId: string | number;
  userId?: string | number;
  callbackQueryId: string;
  messageId?: number;
}): Promise<boolean> {
  const parsed = parseLightningCb(params.data);
  if (!parsed.action) return false;

  if (!isAdminTelegramChat(params.chatId, params.userId)) {
    await answerNewsBotCallback(params.callbackQueryId, "Нет доступа");
    return true;
  }

  const slug = parsed.slug;
  const supabase = createSupabaseAdmin();
  const before = await loadPendingLightning(supabase, slug);

  const softStale = async (label: string) => {
    await answerNewsBotCallback(params.callbackQueryId, "Уже обработано");
    if (params.messageId != null) {
      await editNewsBotMessageHtml(
        params.chatId,
        params.messageId,
        `ℹ️ ${label}: уже обработано или нет pending\n<code>${escapeTelegramHtml(slug || before?.slug || "?")}</code>`
      );
    }
    // No scary owner error DM for stale double-taps.
  };

  if (parsed.action === "skip") {
    const result = await skipPendingLightning(slug);
    if (!result.ok && result.error === "no-pending") {
      await softStale("Пропуск");
      return true;
    }
    const toast =
      result.skippedWhat === "threads"
        ? "Без Threads"
        : result.skippedWhat === "telegram"
          ? "Без Telegram"
          : result.ok
            ? "Пропущено"
            : result.error || "Ошибка";
    await answerNewsBotCallback(params.callbackQueryId, toast);
    if (params.messageId != null) {
      const note = result.ok
        ? result.skippedWhat === "threads"
          ? `✅ Telegram ✓ · ❌ Threads пропуск\n<code>${result.slug}</code>`
          : result.skippedWhat === "telegram"
            ? `✅ Threads ✓ · ❌ Telegram пропуск\n<code>${result.slug}</code>`
            : `❌ Пропуск #молния\n<code>${result.slug}</code>`
        : `⚠️ Не удалось: ${result.error}`;
      await editNewsBotMessageHtml(params.chatId, params.messageId, note);
    }
    if (!result.ok) {
      await notifyOwnerChannelError("telegram", result.slug || "?", result.error || "skip-failed");
    }
    return true;
  }

  if (parsed.action === "ok") {
    const result = await approvePendingLightning(slug);
    if (!result.ok && result.error === "no-pending") {
      await softStale("Согласование");
      return true;
    }
    const toast = result.ok
      ? result.threadsOk
        ? "TG + Threads"
        : "Telegram ок"
      : result.error || "Ошибка";
    await answerNewsBotCallback(params.callbackQueryId, toast);
    if (params.messageId != null) {
      let threadsLine = "Threads: —";
      if (result.threadsOk) threadsLine = "Threads: ✓";
      else if (result.threadsSkipped) {
        threadsLine = `Threads: пропуск (${result.threadsError || "n/a"})`;
      } else {
        threadsLine = `Threads: ✗ ${result.threadsError || "error"}`;
      }
      await editNewsBotMessageHtml(
        params.chatId,
        params.messageId,
        result.ok
          ? `✅ Telegram: ✓ @Emigro_news\n${threadsLine}\n<code>${result.slug}</code>`
          : `⚠️ Не удалось: ${result.error}`
      );
    }
    if (!result.ok) {
      await notifyOwnerChannelError("telegram", result.slug || "?", result.error || "unknown");
    } else if (!result.threadsOk && !result.threadsSkipped) {
      await notifyOwnerChannelError("threads", result.slug || "?", result.threadsError || "unknown");
    }
    return true;
  }

  if (parsed.action === "tg") {
    const result = await approveLightningTelegram(slug);
    if (!result.ok && result.error === "no-pending") {
      await softStale("Telegram");
      return true;
    }
    await answerNewsBotCallback(
      params.callbackQueryId,
      result.ok ? "Telegram ✓" : result.error || "Ошибка"
    );
    await refreshOrFinalizeDm({
      chatId: params.chatId,
      messageId: params.messageId,
      slug: result.slug || before?.slug || slug || "?",
      telegramHtml: before?.telegram_html || "",
      threadsPayload: before?.threadsPayload,
      remainingMark: result.remainingMark,
      finalNote: result.ok
        ? `✅ Telegram: ✓ @Emigro_news\n<code>${result.slug}</code>`
        : `⚠️ Не удалось: ${result.error}`,
    });
    if (!result.ok) {
      await notifyOwnerChannelError("telegram", result.slug || "?", result.error || "unknown");
    }
    return true;
  }

  // threads
  const result = await approveLightningThreads(slug);
  if (!result.ok && result.error === "no-pending") {
    await softStale("Threads");
    return true;
  }
  await answerNewsBotCallback(
    params.callbackQueryId,
    result.ok ? "Threads ✓" : result.error || "Ошибка"
  );
  await refreshOrFinalizeDm({
    chatId: params.chatId,
    messageId: params.messageId,
    slug: result.slug || before?.slug || slug || "?",
    telegramHtml: before?.telegram_html || "",
    threadsPayload: before?.threadsPayload,
    remainingMark: result.remainingMark,
    finalNote: result.ok
      ? `✅ Threads: ✓\n<code>${result.slug}</code>`
      : `⚠️ Threads: ${result.error}`,
  });
  if (!result.ok) {
    await notifyOwnerChannelError("threads", result.slug || "?", result.error || "unknown");
  }
  return true;
}

export async function handleLightningApprovalCommand(params: {
  text: string;
  chatId: string | number;
  userId?: string | number;
}): Promise<boolean> {
  const t = params.text.trim().toLowerCase();
  const isTg = /^\/(?:молния_tg|молния_телега|molniya_tg|lightning_tg)(?:@\w+)?$/i.test(t);
  const isTh = /^\/(?:молния_threads|молния_тредс|molniya_th|lightning_th)(?:@\w+)?$/i.test(t);
  const isOk = /^\/(?:молния_да|molniya_ok|lightning_ok)(?:@\w+)?$/i.test(t);
  const isSkip = /^\/(?:молния_нет|molniya_no|lightning_skip)(?:@\w+)?$/i.test(t);
  if (!isTg && !isTh && !isOk && !isSkip) return false;

  if (!isAdminTelegramChat(params.chatId, params.userId)) return true;

  const { sendOwnerTelegramDm } = await import("@/lib/telegram");

  if (isSkip) {
    const result = await skipPendingLightning();
    await sendOwnerTelegramDm(
      result.ok
        ? `❌ #молния пропуск (${result.skippedWhat}): ${result.slug}`
        : `⚠️ skip failed: ${result.error}`
    );
    return true;
  }

  if (isTg || isOk) {
    const result = isOk ? await approvePendingLightning() : await approveLightningTelegram();
    if (isOk) {
      await sendOwnerTelegramDm(
        result.ok
          ? `✅ Telegram ✓${(result as { threadsOk?: boolean }).threadsOk ? " · Threads ✓" : ""}\n${result.slug}`
          : `⚠️ #молния publish failed: ${result.error}`
      );
    } else {
      const r = result as ChannelActionResult;
      await sendOwnerTelegramDm(
        r.ok
          ? r.remainingMark
            ? `✅ Telegram ✓ · ждём Threads\n${r.slug}`
            : `✅ Telegram ✓\n${r.slug}`
          : `⚠️ Telegram failed: ${r.error}`
      );
    }
    return true;
  }

  const result = await approveLightningThreads();
  await sendOwnerTelegramDm(
    result.ok
      ? result.remainingMark
        ? `✅ Threads ✓ · ждём Telegram\n${result.slug}`
        : `✅ Threads ✓\n${result.slug}`
      : `⚠️ Threads failed: ${result.error}`
  );
  return true;
}

/** Re-export for queue “already awaiting” checks. */
export { isLightningAwaitingOwner, isLightningThreadsAlreadyPosted };
