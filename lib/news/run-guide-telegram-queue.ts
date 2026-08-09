/**
 * Guide → fact-check → owner DM approval → @Emigro_news.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { factcheckGuideForTelegram } from "@/lib/guides/volatile-factcheck";
import { formatVolatileFactcheckTelegramDigest } from "@/lib/guides/volatile-factcheck-notify";
import {
  listGuidePromoCandidates,
  writeGuideTelegramPost,
} from "@/lib/news/guide-telegram-post";
import {
  answerNewsBotCallback,
  editNewsBotMessageHtml,
  publishNewsDigestToChannel,
  publishNewsHtmlToChannel,
  sendOwnerTelegramDm,
  sendOwnerTelegramHtmlWithButtons,
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

async function handledSlugs(supabase: SupabaseClient): Promise<Set<string>> {
  const { data } = await supabase
    .from("guide_telegram_drafts")
    .select("slug, status")
    .in("status", ["pending", "published", "skipped", "skipped_critical"])
    .limit(500);
  return new Set((data ?? []).map((r) => r.slug as string));
}

async function hasPendingDraft(supabase: SupabaseClient): Promise<boolean> {
  const { data } = await supabase
    .from("guide_telegram_drafts")
    .select("id")
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();
  return Boolean(data?.id);
}

async function countPublishedToday(supabase: SupabaseClient): Promise<number> {
  const since = `${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`;
  const { count } = await supabase
    .from("guide_telegram_drafts")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .gte("resolved_at", since);
  return count ?? 0;
}

export type GuideTelegramQueueResult = {
  dryRun: boolean;
  awaitingApproval: string[];
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
      skippedCritical: [],
      skipped: ["daily-published-cap"],
      reason: "already published a guide today",
    };
  }

  if (!dryRun && (await hasPendingDraft(supabase))) {
    return {
      dryRun,
      awaitingApproval: [],
      skippedCritical: [],
      skipped: ["pending-exists"],
      reason: "owner still has a pending guide draft",
    };
  }

  const exclude = await handledSlugs(supabase);
  const candidates = listGuidePromoCandidates(exclude);
  console.log(`[guide-tg] candidates=${candidates.length} excluded=${exclude.size}`);

  const awaitingApproval: string[] = [];
  const skippedCritical: string[] = [];
  const skipped: string[] = [];

  let tries = 0;
  for (const guide of candidates) {
    if (awaitingApproval.length >= 1) break;
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

    const draft = await writeGuideTelegramPost(guide);
    if (dryRun) {
      console.log(
        `[guide-tg] dry-run draft ${guide.slug} format=${draft.format} model=${draft.model}\n${draft.html}`
      );
      awaitingApproval.push(guide.slug);
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
        factcheck_notes: issues.length ? issues.map((i) => `${i.severity}:${i.issue}`).join("; ") : null,
      })
      .select("id, slug")
      .single();

    if (error || !row) {
      skipped.push(`${guide.slug}:insert:${error?.message}`);
      continue;
    }

    const id = row.id as string;
    const preface = [
      `📘 <b>Согласование гайда</b>`,
      `<code>${escapeTelegramHtml(guide.slug)}</code>`,
      `<i>format:</i> ${escapeTelegramHtml(draft.format)} · <i>model:</i> ${escapeTelegramHtml(draft.model)}`,
      "",
      "— черновик —",
      "",
      draft.html,
      "",
      "— — —",
      "✅ в канал · ❌ пропуск",
    ].join("\n");

    const dm = await sendOwnerTelegramHtmlWithButtons(preface, [
      [
        { text: "✅ В канал", callback_data: `${GUIDE_CB_OK_PREFIX}${id}` },
        { text: "❌ Пропуск", callback_data: `${GUIDE_CB_SKIP_PREFIX}${id}` },
      ],
    ]);

    if (!dm.success) {
      await supabase
        .from("guide_telegram_drafts")
        .update({ status: "skipped", factcheck_notes: dm.error, resolved_at: new Date().toISOString() })
        .eq("id", id);
      skipped.push(`${guide.slug}:dm:${dm.error}`);
      continue;
    }

    awaitingApproval.push(guide.slug);
    console.log(`[guide-tg] awaiting approval id=${id} slug=${guide.slug}`);
    break;
  }

  return { dryRun, awaitingApproval, skippedCritical, skipped };
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
      result.ok ? "Гайд в канале" : result.error || "Ошибка"
    );
    if (params.messageId != null) {
      await editNewsBotMessageHtml(
        params.chatId,
        params.messageId,
        result.ok
          ? `✅ Гайд в @Emigro_news\n<code>${escapeTelegramHtml(result.slug || id)}</code>`
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
        ? `❌ Пропуск гайда\n<code>${escapeTelegramHtml(result.slug || id)}</code>`
        : `⚠️ ${escapeTelegramHtml(result.error || "error")}`
    );
  }
  return true;
}
