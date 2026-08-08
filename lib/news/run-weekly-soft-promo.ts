import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import {
  GUIDE_CB_OK_PREFIX,
  GUIDE_CB_SKIP_PREFIX,
} from "@/lib/news/run-guide-telegram-queue";
import {
  isoWeekKey,
  softPromoProductForWeek,
  writeSoftPromoPost,
} from "@/lib/news/weekly-soft-promo";
import { sendOwnerTelegramHtmlWithButtons } from "@/lib/telegram";
import { escapeTelegramHtml } from "@/lib/news/story-lightning";

function hasTelegramBotToken(): boolean {
  return Boolean((process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim());
}

function statePath(): string {
  const fromEnv = process.env.EMIGRO_SOFT_PROMO_STATE?.trim();
  if (fromEnv) return fromEnv;
  return resolve(process.cwd(), "deploy/news-soft-promo/.last-iso-week");
}

function readLastWeek(): string | null {
  const p = statePath();
  if (!existsSync(p)) return null;
  return readFileSync(p, "utf8").trim() || null;
}

function writeLastWeek(week: string): void {
  const p = statePath();
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, `${week}\n`, "utf8");
}

/** UTC weekday 1=Mon … 7=Sun */
function utcWeekday(d = new Date()): number {
  return d.getUTCDay() === 0 ? 7 : d.getUTCDay();
}

/**
 * Spread one post uniformly across remaining Mon–Fri of the ISO week.
 * Timer may fire every weekday; we skip until a random roll says «today».
 */
export function shouldPostToday(opts?: { now?: Date; force?: boolean }): {
  yes: boolean;
  reason: string;
  week: string;
} {
  const now = opts?.now ?? new Date();
  const week = isoWeekKey(now);
  if (opts?.force) return { yes: true, reason: "force", week };

  const last = readLastWeek();
  if (last === week) return { yes: false, reason: "already-this-week", week };

  const dow = utcWeekday(now);
  if (dow > 5) return { yes: false, reason: "weekend", week };

  const remaining = 6 - dow; // Mon→5 … Fri→1
  const roll = Math.random();
  const threshold = 1 / remaining;
  if (roll > threshold) {
    return {
      yes: false,
      reason: `roll-skip (${roll.toFixed(2)}>${threshold.toFixed(2)}; remainingWeekdays=${remaining})`,
      week,
    };
  }
  return { yes: true, reason: `roll-ok (${roll.toFixed(2)}≤${threshold.toFixed(2)})`, week };
}

export type SoftPromoRunResult = {
  /** True only after owner approved and channel publish (not set by this runner). */
  posted: boolean;
  awaitingApproval: boolean;
  skipped: boolean;
  reason: string;
  week: string;
  productId?: string;
  format?: string;
  html?: string;
  draftId?: string;
  dryRun: boolean;
};

export async function runWeeklySoftPromo(options?: {
  dryRun?: boolean;
  force?: boolean;
}): Promise<SoftPromoRunResult> {
  const dryRun = Boolean(options?.dryRun);
  const gate = shouldPostToday({ force: options?.force });
  console.log(`[soft-promo] week=${gate.week} gate=${gate.reason}`);

  if (!gate.yes) {
    return {
      posted: false,
      awaitingApproval: false,
      skipped: true,
      reason: gate.reason,
      week: gate.week,
      dryRun,
    };
  }

  const product = softPromoProductForWeek();
  console.log(`[soft-promo] product=${product.id} (${product.labelRu})`);

  const draft = await writeSoftPromoPost(product);
  console.log(`[soft-promo] format=${draft.format}\n${draft.html}`);

  if (dryRun) {
    return {
      posted: false,
      awaitingApproval: false,
      skipped: true,
      reason: "dry-run",
      week: gate.week,
      productId: product.id,
      format: draft.format,
      html: draft.html,
      dryRun: true,
    };
  }

  if (!hasTelegramBotToken()) {
    return {
      posted: false,
      awaitingApproval: false,
      skipped: true,
      reason: "bot token missing",
      week: gate.week,
      productId: product.id,
      format: draft.format,
      html: draft.html,
      dryRun: false,
    };
  }

  if (!process.env.TELEGRAM_PRIVATE_CHAT_ID?.trim()) {
    return {
      posted: false,
      awaitingApproval: false,
      skipped: true,
      reason: "TELEGRAM_PRIVATE_CHAT_ID missing",
      week: gate.week,
      productId: product.id,
      format: draft.format,
      html: draft.html,
      dryRun: false,
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    return {
      posted: false,
      awaitingApproval: false,
      skipped: true,
      reason: "Supabase env missing",
      week: gate.week,
      productId: product.id,
      format: draft.format,
      html: draft.html,
      dryRun: false,
    };
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: pending } = await supabase
    .from("guide_telegram_drafts")
    .select("id, slug")
    .eq("status", "pending")
    .limit(1)
    .maybeSingle();
  if (pending?.id) {
    return {
      posted: false,
      awaitingApproval: false,
      skipped: true,
      reason: `pending-exists:${pending.slug}`,
      week: gate.week,
      productId: product.id,
      format: draft.format,
      html: draft.html,
      dryRun: false,
    };
  }

  const slug = `soft-promo-${gate.week}-${product.id}`;
  const title = `Soft promo · ${product.labelRu} · ${gate.week}`;

  const { data: row, error } = await supabase
    .from("guide_telegram_drafts")
    .insert({
      slug,
      title,
      html: draft.html,
      status: "pending",
      publish_mode: "html",
      meta: { productId: product.id, week: gate.week },
      factcheck_notes: `soft_promo format=${draft.format}`,
    })
    .select("id, slug")
    .single();

  if (error || !row) {
    return {
      posted: false,
      awaitingApproval: false,
      skipped: true,
      reason: `insert:${error?.message || "unknown"}`,
      week: gate.week,
      productId: product.id,
      format: draft.format,
      html: draft.html,
      dryRun: false,
    };
  }

  const id = row.id as string;
  const preface = [
    `📣 <b>Согласование soft promo</b>`,
    `<code>${escapeTelegramHtml(slug)}</code>`,
    `<i>${escapeTelegramHtml(product.labelRu)}</i> · format: ${escapeTelegramHtml(draft.format)}`,
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
      .update({
        status: "skipped",
        factcheck_notes: dm.error,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id);
    return {
      posted: false,
      awaitingApproval: false,
      skipped: true,
      reason: `dm:${dm.error}`,
      week: gate.week,
      productId: product.id,
      format: draft.format,
      html: draft.html,
      draftId: id,
      dryRun: false,
    };
  }

  // Consume the week when approval is requested (not on channel publish).
  writeLastWeek(gate.week);
  console.log(`[soft-promo] awaiting approval id=${id} slug=${slug}`);

  return {
    posted: false,
    awaitingApproval: true,
    skipped: false,
    reason: "awaiting-owner",
    week: gate.week,
    productId: product.id,
    format: draft.format,
    html: draft.html,
    draftId: id,
    dryRun: false,
  };
}
