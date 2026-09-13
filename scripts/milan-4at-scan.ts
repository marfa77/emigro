#!/usr/bin/env npx tsx
/**
 * Scan @milan_4at (last N hours) → pick answerable questions → LLM soft draft → DM bot.
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

type FetchedMsg = {
  id: number;
  date: string;
  text: string;
  url: string;
  reply_to?: number | null;
};

const OUT_DIR = path.resolve(process.cwd(), "scripts/output");
const SEEN_FILE = path.join(OUT_DIR, "milan4at-seen-ids.json");

const NOISE =
  /продам|куплю|продаю|лечу\s|багаж|собутыльник|уборк|ваканси|ищу\s+работ|работа\s+милан|объявлен|ciao_chat|преподаватель.*итальян|франческо/i;

const QUESTIONISH =
  /\?|подскаж|посовет|кто\s+знает|как\s+(?:получить|оформить|сделать|найти)|где\s+(?:можно|взять|оформ|сделать)|можно\s+ли|нужна?\s+(?:помощ|подсказ)|ищу\s+(?!работ)/i;

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

function loadSeen(): Set<number> {
  try {
    const raw = JSON.parse(fs.readFileSync(SEEN_FILE, "utf8")) as { ids?: number[] };
    return new Set(raw.ids || []);
  } catch {
    return new Set();
  }
}

function saveSeen(ids: Set<number>) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const list = [...ids].sort((a, b) => a - b).slice(-500);
  fs.writeFileSync(SEEN_FILE, JSON.stringify({ ids: list, updatedAt: new Date().toISOString() }, null, 2));
}

function notifyChatId(): string | null {
  // Strict: only the private chat that sent /start to this bot.
  return loadMilan4atNotifyChatId();
}

function fetchMessages(hours: number): FetchedMsg[] {
  const py = path.resolve(process.cwd(), "parser/fetch_milan_4at.py");
  const res = spawnSync("python3", [py, "--hours", String(hours), "--limit", "100"], {
    encoding: "utf8",
    cwd: process.cwd(),
    env: process.env,
    maxBuffer: 8 * 1024 * 1024,
  });
  if (res.status !== 0) {
    throw new Error(res.stderr || res.stdout || `fetch exit ${res.status}`);
  }
  const data = JSON.parse(res.stdout) as { messages: FetchedMsg[] };
  return data.messages || [];
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
      // no preview = no wall of post text under the link
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
  if (!/^https:\/\/t\.me\/milan_4at\/\d+$/i.test(url)) {
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

async function main() {
  const { hours, max, dry } = parseArgs(process.argv.slice(2));
  const seen = loadSeen();
  const msgs = fetchMessages(hours);
  console.error(`[scan] fetched ${msgs.length} msgs / last ${hours}h`);

  const candidates: Array<{ msg: FetchedMsg; score: number; topicLabel: string; topicId: string }> =
    [];

  for (const msg of msgs) {
    if (seen.has(msg.id)) continue;
    if (msg.reply_to) continue; // top-level only
    if (NOISE.test(msg.text)) continue;
    if (!QUESTIONISH.test(msg.text) && !msg.text.includes("?")) continue;
    const matches = matchMilan4atTopics(msg.text);
    const top = matches[0];
    // allow insurance/VNJ-ish even if topic score soft — boost via generic patterns
    let score = top?.score ?? 0;
    if (/страхов|assicur|waitaly|внж|permesso|codice|questura|iban|аренд/i.test(msg.text)) {
      score = Math.max(score, MILAN_4AT_MIN_SCORE + 5);
    }
    if (score < MILAN_4AT_MIN_SCORE) continue;
    candidates.push({
      msg,
      score,
      topicLabel: top?.topic.label || "Italy / Milano",
      topicId: top?.topic.id || "general",
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  const pick = candidates.slice(0, max);
  console.error(`[scan] candidates ${candidates.length}, drafting ${pick.length}`);

  if (!pick.length) {
    console.log("No suitable questions in window.");
    return;
  }

  const chatId = notifyChatId();
  if (!dry && !chatId) {
    throw new Error("No /start yet. Open the draft bot and send /start — drafts go only to that chat.");
  }

  console.error(`[scan] notify chat (from /start only): ${chatId || "(dry)"}`);

  const drafted: number[] = [];

  for (const c of pick) {
    const produced = await produceMilan4atReply({
      question: c.msg.text,
      topicLabel: c.topicLabel,
    });
    if (!produced.reply) {
      console.error(`[scan] skip ${c.msg.id}: ${produced.skipReason}`);
      if (!dry && chatId && produced.factVerdict === "fail") {
        await sendDm(
          chatId,
          `SKIP factcheck · ${c.msg.url}\n${produced.factReason || produced.skipReason}`
        );
      }
      seen.add(c.msg.id);
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
      console.error(`[scan] DM×3 → ${chatId} for ${c.msg.id} (${produced.factVerdict})`);
    }
    seen.add(c.msg.id);
    drafted.push(c.msg.id);
  }

  saveSeen(seen);
  console.error(`[scan] done drafted=${drafted.length}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
