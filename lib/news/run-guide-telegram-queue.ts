/**
 * Guide → fact-check → auto-publish to @Emigro_news (no owner approve).
 * Lightning still requires DM approval separately.
 * Legacy gd:ok / gd:no callbacks kept for leftover pending drafts
 * (soft promo / digests still use approve).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { factcheckGuideForTelegram } from "@/lib/guides/volatile-factcheck";
import { formatVolatileFactcheckTelegramDigest } from "@/lib/guides/volatile-factcheck-notify";
import {
  listGuidePromoCandidates,
  writeGuideTelegramPost,
} from "@/lib/news/guide-telegram-post";
import {
  fetchChannelPostedGuideSlugs,
  listHandledGuideSlugs,
  rememberChannelGuideSlugs,
} from "@/lib/news/guide-telegram-posted";
import {
  answerNewsBotCallback,
  editNewsBotMessageHtml,
  publishNewsDigestToChannel,
  publishNewsHtmlToChannel,
  sendOwnerTelegramDm,
} from "@/lib/telegram";
import { isAdminTelegramChat } from "@/lib/telegram/admin-bot";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";

export const GUIDE_CB_OK_PREFIX = "gd:ok:";
export const GUIDE_CB_SKIP_PREFIX = "gd:no:";

const MAX_TRIES_PER_RUN = 5;

type DraftRow = {
  id: string;
  slug: string;
  title: string;
  html: string;
  status: string;
  publish_mode?: string | null;
  meta?: {
    flag?: string;
    countryRu?: string;
    digestSlug?: string;
    kind?: string;
    productId?: string;
    week?: string;
  } | null;
};

function createSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) throw new Error("Supabase env missing");
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function excludeAlreadyPostedSlugs(
  supabase: SupabaseClient,
  dryRun: boolean
): Promise<Set<string>> {
  const exclude = await listHandledGuideSlugs(supabase);
  try {
    const channelSlugs = await fetchChannelPostedGuideSlugs();
    const inserted = dryRun ? 0 : await rememberChannelGuideSlugs(supabase, channelSlugs);
    for (const slug of channelSlugs) exclude.add(slug);
    console.log(
      `[guide-tg] channel-archive slugs=${channelSlugs.length} newly-seeded=${inserted}${dryRun ? " (dry-run)" : ""}`
    );
  } catch (e) {
    console.warn(
      "[guide-tg] channel archive fetch failed — using DB slugs only:",
      e instanceof Error ? e.message : e
    );
  }
  return exclude;
}

async function countPublishedToday(supabase: SupabaseClient): Promise<number> {
  const since = `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`;
  // Ignore archive seeds ("seeded from @Emigro_news") — only real channel publishes.
  const { data } = await supabase
    .from("guide_telegram_drafts")
    .select("id, factcheck_notes, html")
    .eq("status", "published")
    .gte("resolved_at", since)
    .limit(20);
  return (data ?? []).filter((row) => {
    const notes = String(row.factcheck_notes || "");
    const html = String(row.html || "");
    if (notes.includes("seeded")) return false;
    if (html.startsWith("(seeded")) return false;
    return true;
  }).length;
}

export type GuideTelegramQueueResult = {
  dryRun: boolean;
  /** @deprecated guides auto-publish; kept for CLI shape. */
  awaitingApproval: string[];
  published: string[];
  skippedCritical: string[];
  skipped: string[];
  reason?: string;
};

export async function runGuideTelegramQueue(options?: {
  dryRun?: boolean;
}): Promise<GuideTelegramQueueResult> {
  const dryRun = Boolean(options?.dryRun);
  const supabase = createSupabaseAdmin();

  if ((await countPublishedToday(supabase)) >= 1) {
    return {
      dryRun,
      awaitingApproval: [],
      published: [],
      skippedCritical: [],
      skipped: ["daily-published-cap"],
      reason: "already published a guide today",
    };
  }

  const exclude = await excludeAlreadyPostedSlugs(supabase, dryRun);
  const candidates = listGuidePromoCandidates(exclude);
  console.log(`[guide-tg] candidates=${candidates.length} excluded=${exclude.size}`);

  const awaitingApproval: string[] = [];
  const published: string[] = [];
  const skippedCritical: string[] = [];
  const skipped: string[] = [];

  let tries = 0;
  for (const guide of candidates) {
    if (published.length >= 1) break;
    if (tries >= MAX_TRIES_PER_RUN) break;
    tries += 1;

    console.log(`[guide-tg] try ${guide.slug}`);
    const issues = await factcheckGuideForTelegram(guide.slug);
    const critical = issues.filter((i) => i.severity === "critical");

    if (critical.length > 0) {
      const notes = critical.map((i) => i.issue).join("; ").slice(0, 500);
      skippedCritical.push(guide.slug);
      console.log(`[guide-tg] critical ${guide.slug}: ${notes}`);

      if (!dryRun) {
        await supabase.from("guide_telegram_drafts").insert({
          slug: guide.slug,
          title: guide.title,
          html: "(skipped_critical)",
          status: "skipped_critical",
          factcheck_notes: notes,
          resolved_at: new Date().toISOString(),
        });
        const dmBody = formatVolatileFactcheckTelegramDigest(critical, 1);
        await sendOwnerTelegramDm(`📘 Гайд для канала — critical, берём следующий\n\n${dmBody}`);
      }
      continue;
    }

    let draft: Awaited<ReturnType<typeof writeGuideTelegramPost>>;
    try {
      draft = await writeGuideTelegramPost(guide);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      skipped.push(`${guide.slug}:write:${msg}`);
      console.log(`[guide-tg] write-fail ${guide.slug}: ${msg}`);
      if (!dryRun) {
        await sendOwnerTelegramDm(
          `📘 Гайд не ушёл (голос/черновик), берём следующий\n${guide.slug}\n${msg.slice(0, 400)}`
        );
      }
      continue;
    }

    if (dryRun) {
      console.log(
        `[guide-tg] dry-run would auto-publish ${guide.slug} format=${draft.format} model=${draft.model}\n${draft.html}`
      );
      published.push(guide.slug);
      break;
    }

    const { data: row, error } = await supabase
      .from("guide_telegram_drafts")
      .insert({
        slug: guide.slug,
        title: guide.title,
        html: draft.html,
        status: "pending",
        publish_mode: "html",
        meta: { kind: "guide" },
        factcheck_notes: issues.length
          ? issues.map((i) => `${i.severity}:${i.issue}`).join("; ")
          : "auto-publish",
      })
      .select("id, slug")
      .single();

    if (error || !row) {
      skipped.push(`${guide.slug}:insert:${error?.message}`);
      continue;
    }

    const id = row.id as string;
    const result = await approveGuideDraft(id);
    if (!result.ok) {
      await supabase
        .from("guide_telegram_drafts")
        .update({
          status: "skipped",
          factcheck_notes: result.error || "publish-failed",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", id);
      skipped.push(`${guide.slug}:publish:${result.error}`);
      await sendOwnerTelegramDm(
        `⚠️ Гайд не ушёл в канал\n${guide.slug}\n${result.error || "unknown"}`
      );
      continue;
    }

    published.push(guide.slug);
    console.log(`[guide-tg] auto-published id=${id} slug=${guide.slug}`);
    await sendOwnerTelegramDm(
      `📘 Гайд в @Emigro_news (без апрува)\n${guide.slug}\nformat=${draft.format}`
    );
    break;
  }

  return { dryRun, awaitingApproval, published, skippedCritical, skipped };
}

async function loadDraft(supabase: SupabaseClient, id: string): Promise<DraftRow | null> {
  const { data } = await supabase
    .from("guide_telegram_drafts")
    .select("id, slug, title, html, status, publish_mode, meta")
    .eq("id", id)
    .maybeSingle();
  return (data as DraftRow | null) ?? null;
}

export async function approveGuideDraft(id: string): Promise<{ ok: boolean; slug?: string; error?: string }> {
  const supabase = createSupabaseAdmin();
  const draft = await loadDraft(supabase, id);
  if (!draft) return { ok: false, error: "not-found" };
  if (draft.status !== "pending") return { ok: false, error: `status:${draft.status}`, slug: draft.slug };
  if (!draft.html?.trim()) return { ok: false, error: "empty-html", slug: draft.slug };

  try {
    const mode = (draft.publish_mode || "html").trim();
    const meta = draft.meta ?? {};
    const messageIds =
      mode === "threads"
        ? await publishNewsDigestToChannel(draft.html, {
            flag: meta.flag,
            countryRu: meta.countryRu,
          })
        : await publishNewsHtmlToChannel(draft.html);

    await supabase
      .from("guide_telegram_drafts")
      .update({
        status: "published",
        channel_message_ids: messageIds,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    const digestSlug = meta.digestSlug || (mode === "threads" ? draft.slug : null);
    if (digestSlug) {
      await supabase
        .from("emigro_news_digests")
        .update({
          telegram_message_ids: messageIds,
          updated_at: new Date().toISOString(),
        })
        .eq("slug", digestSlug);
    }

    return { ok: true, slug: draft.slug };
  } catch (e) {
    return { ok: false, slug: draft.slug, error: e instanceof Error ? e.message : String(e) };
  }
}

export async function skipGuideDraft(id: string): Promise<{ ok: boolean; slug?: string; error?: string }> {
  const supabase = createSupabaseAdmin();
  const draft = await loadDraft(supabase, id);
  if (!draft) return { ok: false, error: "not-found" };
  if (draft.status !== "pending") return { ok: false, error: `status:${draft.status}`, slug: draft.slug };

  await supabase
    .from("guide_telegram_drafts")
    .update({
      status: "skipped",
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  return { ok: true, slug: draft.slug };
}

/** Legacy buttons for leftover pending drafts (soft promo / digests still use approve). */
export async function handleGuideApprovalCallback(params: {
  data: string;
  chatId: string | number;
  userId?: string | number;
  callbackQueryId: string;
  messageId?: number;
}): Promise<boolean> {
  const isOk = params.data.startsWith(GUIDE_CB_OK_PREFIX);
  const isSkip = params.data.startsWith(GUIDE_CB_SKIP_PREFIX);
  if (!isOk && !isSkip) return false;

  if (!isAdminTelegramChat(params.chatId, params.userId)) {
    await answerNewsBotCallback(params.callbackQueryId, "Нет доступа");
    return true;
  }

  const id = params.data.slice(isOk ? GUIDE_CB_OK_PREFIX.length : GUIDE_CB_SKIP_PREFIX.length);
  if (!id) {
    await answerNewsBotCallback(params.callbackQueryId, "Bad id");
    return true;
  }

  if (isOk) {
    const result = await approveGuideDraft(id);
    await answerNewsBotCallback(
      params.callbackQueryId,
      result.ok ? "В канале" : result.error || "Ошибка"
    );
    if (params.messageId != null) {
      await editNewsBotMessageHtml(
        params.chatId,
        params.messageId,
        result.ok
          ? `✅ В @Emigro_news\n<code>${escapeTelegramHtml(result.slug || id)}</code>`
          : `⚠️ ${escapeTelegramHtml(result.error || "error")}`
      );
    }
    return true;
  }

  const result = await skipGuideDraft(id);
  await answerNewsBotCallback(params.callbackQueryId, result.ok ? "Пропущено" : result.error || "Ошибка");
  if (params.messageId != null) {
    await editNewsBotMessageHtml(
      params.chatId,
      params.messageId,
      result.ok
        ? `❌ Пропуск\n<code>${escapeTelegramHtml(result.slug || id)}</code>`
        : `⚠️ ${escapeTelegramHtml(result.error || "error")}`
    );
  }
  return true;
}
