#!/usr/bin/env npx tsx
/**
 * Scan @milan_4at + @como_4at + @milan_ua_chat (last N hours):
 *  1) high-confidence prostitution/drug ads → DM alert (for Telegram report)
 *  2) answerable questions → LLM soft draft → DM
 *  3) always end with status DM
 *
 *   npm run milan4at:scan
 *   npm run milan4at:scan -- --hours=6 --dry
 *   npm run milan4at:scan -- --hours=4 --max=3
 *
 * Requires: parser/tg.session + TG_API_* ; OPENROUTER_API_KEY ; MILAN4AT_BOT_TOKEN
 * Notify chat: ONLY whoever sent /start → scripts/output/milan4at-notify-chat.json
 */
import { config } from "dotenv";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });
config({ path: path.resolve(process.cwd(), "parser/.env") });

import { matchMilan4atTopics } from "@/lib/milan-4at/draft";
import { produceMilan4atReply } from "@/lib/milan-4at/produce-reply";
import { loadMilan4atNotifyChatId, milan4atBotToken } from "@/lib/milan-4at/bot-handler";
import { MILAN_4AT_MIN_SCORE } from "@/lib/milan-4at/topics";
import {
  detectAbuseHighConfidence,
  formatAbuseAlert,
} from "@/lib/milan-4at/abuse-detect";

const SCAN_CHANNELS = ["milan_4at", "como_4at", "milan_ua_chat"] as const;
type ScanChannel = (typeof SCAN_CHANNELS)[number];

type FetchedMsg = {
  id: number;
  channel: ScanChannel;
  date: string;
  text: string;
  url: string;
  reply_to?: number | null;
  from?: { id?: number; username?: string | null; label?: string | null } | null;
};

const OUT_DIR = path.resolve(process.cwd(), "scripts/output");
const SEEN_FILE = path.join(OUT_DIR, "milan4at-seen-ids.json");
const ABUSE_SEEN_FILE = path.join(OUT_DIR, "milan4at-abuse-seen.json");

const NOISE =
  /продам|куплю|продаю|лечу\s|багаж|собутыльник|уборк|ваканси|ищу\s+работ|работа\s+милан|объявлен|ciao_chat|преподаватель.*итальян|франческо/i;

const QUESTIONISH =
  /\?|подскаж|посовет|кто\s+знает|как\s+(?:получить|оформить|сделать|найти)|где\s+(?:можно|взять|оформ|сделать)|можно\s+ли|нужна?\s+(?:помощ|подсказ)|ищу\s+(?!работ)/i;

const QUESTION_URL_RE = /^https:\/\/t\.me\/(?:milan_4at|como_4at|milan_ua_chat)\/\d+$/i;

function parseArgs(argv: string[]) {
  let hours = 4;
  let max = 5;
  let dry = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry") dry = true;
    else if (a.startsWith("--hours=")) hours = Number(a.split("=")[1]) || 4;
    else if (a === "--hours") hours = Number(argv[++i]) || 4;
    else if (a.startsWith("--max=")) max = Number(a.split("=")[1]) || 5;
    else if (a === "--max") max = Number(argv[++i]) || 5;
  }
  return { hours, max, dry };
}

function seenKey(channel: string, id: number): string {
  return `${channel}:${id}`;
}

function loadKeySet(file: string, legacyMilanOnly = false): Set<string> {
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
      ids?: Array<number | string>;
      keys?: string[];
    };
    const out = new Set<string>();
    for (const k of raw.keys || []) out.add(String(k));
    for (const id of raw.ids || []) {
      if (typeof id === "number" && legacyMilanOnly) out.add(seenKey("milan_4at", id));
      else if (typeof id === "string" && id.includes(":")) out.add(id);
      else if (typeof id === "string" && /^\d+$/.test(id) && legacyMilanOnly) {
        out.add(seenKey("milan_4at", Number(id)));
      }
    }
    return out;
  } catch {
    return new Set();
  }
}

function saveKeySet(file: string, keys: Set<string>, keep = 800) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const list = [...keys].sort().slice(-keep);
  fs.writeFileSync(file, JSON.stringify({ keys: list, updatedAt: new Date().toISOString() }, null, 2));
}

function notifyChatId(): string | null {
  return loadMilan4atNotifyChatId();
}

function fetchChannel(channel: ScanChannel, hours: number): FetchedMsg[] {
  const py = path.resolve(process.cwd(), "parser/fetch_milan_4at.py");
  const res = spawnSync(
    "python3",
    [py, "--channel", channel, "--hours", String(hours), "--limit", "100"],
    {
      encoding: "utf8",
      cwd: process.cwd(),
      env: process.env,
      maxBuffer: 8 * 1024 * 1024,
    }
  );
  if (res.status !== 0) {
    throw new Error(`[${channel}] ${res.stderr || res.stdout || `fetch exit ${res.status}`}`);
  }
  const data = JSON.parse(res.stdout) as {
    messages: Array<Omit<FetchedMsg, "channel"> & { channel?: string }>;
  };
  return (data.messages || []).map((m) => ({
    ...m,
    channel: (m.channel as ScanChannel) || channel,
  }));
}

type FetchSummary = {
  msgs: FetchedMsg[];
  perChannel: Record<string, number>;
  failures: string[];
};

function fetchMessages(hours: number): FetchSummary {
  const all: FetchedMsg[] = [];
  const perChannel: Record<string, number> = {};
  const failures: string[] = [];
  for (const channel of SCAN_CHANNELS) {
    try {
      const rows = fetchChannel(channel, hours);
      perChannel[channel] = rows.length;
      console.error(`[scan] ${channel}: ${rows.length} msgs`);
      all.push(...rows);
    } catch (e) {
      perChannel[channel] = 0;
      const err = e instanceof Error ? e.message : String(e);
      failures.push(`${channel}: ${err.slice(0, 120)}`);
      console.error(`[scan] ${channel} FAILED:`, err);
    }
  }
  return { msgs: all, perChannel, failures };
}

function formatStatus(params: {
  hours: number;
  perChannel: Record<string, number>;
  failures: string[];
  candidates: number;
  drafted: number;
  skipped: number;
  abuseAlerts: number;
  abuseScanned: number;
}): string {
  const chLine = SCAN_CHANNELS.map((c) => `${c} ${params.perChannel[c] ?? 0}`).join(" · ");
  const lines = [
    `milan4at scan · ${params.hours}h`,
    `msgs: ${chLine}`,
    `abuse: ${params.abuseAlerts} alert(s) / ${params.abuseScanned} checked`,
    `candidates ${params.candidates} · drafted ${params.drafted} · skipped ${params.skipped}`,
  ];
  if (params.failures.length) {
    lines.push(`fetch fail: ${params.failures.join("; ")}`);
  }
  if (params.abuseAlerts > 0) {
    lines.push(`⚠️ abuse alerts выше — пожалуйся в Telegram`);
  } else {
    lines.push("abuse: чисто в окне (high-confidence)");
  }
  if (params.candidates === 0) {
    lines.push("нет вопросов для ответа в окне");
  } else if (params.drafted === 0) {
    lines.push("кандидаты были, черновиков не отправил (skip/fail)");
  } else {
    lines.push(`готово: ${params.drafted} черновик(а) выше`);
  }
  return lines.join("\n");
}

async function sendDm(chatId: string, text: string) {
  const token = milan4atBotToken();
  if (!token) throw new Error("MILAN4AT_BOT_TOKEN missing");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      link_preview_options: { is_disabled: true },
    }),
  });
  const json = (await res.json()) as { ok?: boolean; description?: string };
  if (!json.ok) throw new Error(json.description || "sendMessage failed");
}

/** Three DMs: (1) bare t.me URL (2) factcheck ok (3) short reply. */
async function sendDraftTriple(
  chatId: string,
  questionUrl: string,
  factLine: string,
  reply: string
) {
  const url = questionUrl.trim();
  if (!QUESTION_URL_RE.test(url)) {
    throw new Error(`refusing non-bare question url: ${url.slice(0, 80)}`);
  }
  const body = reply.trim();
  if (!body || body.includes("http") || /тема:|score|note:/i.test(body)) {
    throw new Error("refusing dirty reply body");
  }
  await sendDm(chatId, url);
  await sendDm(chatId, factLine.trim() || "factcheck: ok");
  await sendDm(chatId, body);
}

async function scanAbuse(
  msgs: FetchedMsg[],
  opts: { dry: boolean; chatId: string | null }
): Promise<{ alerts: number; scanned: number }> {
  const abuseSeen = loadKeySet(ABUSE_SEEN_FILE);
  let alerts = 0;
  let scanned = 0;

  for (const msg of msgs) {
    const key = seenKey(msg.channel, msg.id);
    if (abuseSeen.has(key)) continue;
    scanned += 1;
    const hit = await detectAbuseHighConfidence(msg.text);
    if (!hit) continue;

    const alert = formatAbuseAlert({
      url: msg.url,
      channel: msg.channel,
      from: msg.from?.label || null,
      hit,
      text: msg.text,
    });
    console.error(`[abuse] HIT ${msg.channel}/${msg.id} ${hit.category} score=${hit.score}`);
    console.log(`\n${alert}\n`);

    if (!opts.dry && opts.chatId) {
      await sendDm(opts.chatId, alert);
    }
    abuseSeen.add(key);
    alerts += 1;
  }

  saveKeySet(ABUSE_SEEN_FILE, abuseSeen, 1200);
  return { alerts, scanned };
}

async function main() {
  const { hours, max, dry } = parseArgs(process.argv.slice(2));
  const seen = loadKeySet(SEEN_FILE, true);
  const { msgs, perChannel, failures } = fetchMessages(hours);
  console.error(`[scan] fetched ${msgs.length} msgs / last ${hours}h (${SCAN_CHANNELS.join("+")})`);

  const chatId = notifyChatId();
  if (!dry && !chatId) {
    throw new Error("No /start yet. Open the draft bot and send /start — drafts go only to that chat.");
  }
  console.error(`[scan] notify chat (from /start only): ${chatId || "(dry)"}`);

  const { alerts: abuseAlerts, scanned: abuseScanned } = await scanAbuse(msgs, { dry, chatId });
  console.error(`[scan] abuse alerts=${abuseAlerts} scanned=${abuseScanned}`);

  const candidates: Array<{
    msg: FetchedMsg;
    score: number;
    topicLabel: string;
    topicId: string;
  }> = [];

  for (const msg of msgs) {
    const key = seenKey(msg.channel, msg.id);
    if (seen.has(key)) continue;
    if (msg.reply_to) continue;
    if (NOISE.test(msg.text)) continue;
    if (!QUESTIONISH.test(msg.text) && !msg.text.includes("?")) continue;
    const matches = matchMilan4atTopics(msg.text);
    const top = matches[0];
    let score = top?.score ?? 0;
    if (/страхов|assicur|waitaly|внж|permesso|codice|questura|iban|аренд|como|комо/i.test(msg.text)) {
      score = Math.max(score, MILAN_4AT_MIN_SCORE + 5);
    }
    if (score < MILAN_4AT_MIN_SCORE) continue;
    const geo =
      msg.channel === "como_4at"
        ? "Italy / Como"
        : msg.channel === "milan_ua_chat"
          ? "Italy / Milano UA"
          : "Italy / Milano";
    candidates.push({
      msg,
      score,
      topicLabel: top?.topic.label || geo,
      topicId: top?.topic.id || "general",
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  const pick = candidates.slice(0, max);
  console.error(`[scan] candidates ${candidates.length}, drafting ${pick.length}`);

  const drafted: number[] = [];
  let skipped = 0;

  for (const c of pick) {
    const key = seenKey(c.msg.channel, c.msg.id);
    const produced = await produceMilan4atReply({
      question: c.msg.text,
      topicLabel: c.topicLabel,
    });
    if (!produced.reply) {
      skipped += 1;
      console.error(`[scan] skip ${c.msg.channel}/${c.msg.id}: ${produced.skipReason}`);
      if (!dry && chatId && produced.factVerdict === "fail") {
        await sendDm(
          chatId,
          `SKIP factcheck · ${c.msg.url}\n${produced.factReason || produced.skipReason}`
        );
      }
      seen.add(key);
      continue;
    }

    console.log(
      `\n[1] ${c.msg.url}\n[2] factcheck ${produced.factVerdict}\n[3] ${produced.reply}\n`
    );

    if (!dry && chatId) {
      const factLine =
        produced.factVerdict === "revise"
          ? `factcheck: ok (revise) · ${produced.factReason || "правкали черновик"}`
          : `factcheck: ok · ${produced.factReason || "pass"}`;
      await sendDraftTriple(chatId, c.msg.url, factLine, produced.reply);
      console.error(
        `[scan] DM×3 → ${chatId} for ${c.msg.channel}/${c.msg.id} (${produced.factVerdict})`
      );
    }
    seen.add(key);
    drafted.push(c.msg.id);
  }

  saveKeySet(SEEN_FILE, seen);

  const status = formatStatus({
    hours,
    perChannel,
    failures,
    candidates: candidates.length,
    drafted: drafted.length,
    skipped,
    abuseAlerts,
    abuseScanned,
  });
  console.error(`[scan] status\n${status}`);
  if (!dry && chatId) {
    await sendDm(chatId, status);
  } else if (dry) {
    console.log(`[dry] would DM status:\n${status}`);
  }
  console.error(`[scan] done drafted=${drafted.length} abuse=${abuseAlerts}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
