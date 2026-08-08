import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import { publishNewsHtmlToChannel } from "@/lib/telegram";
import {
  isoWeekKey,
  softPromoProductForWeek,
  writeSoftPromoPost,
} from "@/lib/news/weekly-soft-promo";

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
  posted: boolean;
  skipped: boolean;
  reason: string;
  week: string;
  productId?: string;
  format?: string;
  html?: string;
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
    return { posted: false, skipped: true, reason: gate.reason, week: gate.week, dryRun };
  }

  const product = softPromoProductForWeek();
  console.log(`[soft-promo] product=${product.id} (${product.labelRu})`);

  const draft = await writeSoftPromoPost(product);
  console.log(`[soft-promo] format=${draft.format}\n${draft.html}`);

  if (dryRun) {
    return {
      posted: false,
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
      skipped: true,
      reason: "bot token missing",
      week: gate.week,
      productId: product.id,
      format: draft.format,
      html: draft.html,
      dryRun: false,
    };
  }

  await publishNewsHtmlToChannel(draft.html);
  writeLastWeek(gate.week);
  console.log(`[soft-promo] published to ${process.env.EMIGRO_NEWS_TELEGRAM_CHANNEL || "@Emigro_news"}`);

  return {
    posted: true,
    skipped: false,
    reason: "ok",
    week: gate.week,
    productId: product.id,
    format: draft.format,
    html: draft.html,
    dryRun: false,
  };
}
