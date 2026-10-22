#!/usr/bin/env npx tsx
/**
 * Scan @chatporto → pick the most interesting question of the day →
 * short LLM draft + note link → owner DM (you paste into the group yourself).
 *
 *   npm run chatporto:scan
 *   npm run chatporto:scan -- --hours=26 --dry
 *   npm run chatporto:scan -- --force   # ignore once-per-day lock
 *
 * Notify: CHATPORTO_NOTIFY_CHAT_ID or TELEGRAM_PRIVATE_CHAT_ID
 * Bot: EMIGRO_NEWS_BOT_TOKEN (same as other owner DMs)
 */
import { config } from "dotenv";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });
config({ path: path.resolve(process.cwd(), ".env") });
config({ path: path.resolve(process.cwd(), "parser/.env") });

import { chatportoOpsLink, matchChatportoTopics } from "@/lib/chatporto/draft";
import { produceChatportoReply } from "@/lib/chatporto/produce-reply";
import { CHATPORTO_MIN_SCORE } from "@/lib/chatporto/topics";
function newsBotToken(): string | undefined {
  return (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim();
}

type FetchedMsg = {
  id: number;
  channel: string;
  date: string;
  text: string;
  url: string;
  reply_to?: number | null;
};

const OUT_DIR = path.resolve(process.cwd(), "scripts/output");
const SEEN_FILE = path.join(OUT_DIR, "chatporto-seen-ids.json");
const DAY_LOCK_FILE = path.join(OUT_DIR, "chatporto-day-lock.json");

const NOISE =
  /продам|куплю|продаю|ваканси|ищу\s+работ|работа\s+в\s+порту|объявлен|подработк|оплата:\s*\d+|instagram\.com\/reel|ищу\s+девушк|знакомств/i;

/** No Emigro note inventory — skip “кто знает контакты …” service hunting. */
const OUT_OF_SCOPE =
  /трихолог|дерматолог|стоматолог|гинеколог|психолог|парикмахер|маникюр|косметолог|репетитор|няня|таксист|русскоязычн\w*\s+такси|контакт\w*\s+(?:русско|такси|врач|клиник)|посоветуйте\s+такси|uber|bolt/i;

const QUESTIONISH =
  /\?|подскаж|посовет|порекоменд|кто\s+знает|как\s+(?:получить|оформить|сделать|найти|можно)|где\s+(?:можно|взять|оформ|сделать)|можно\s+ли|нужна?\s+(?:помощ|подсказ)|ищу\s+(?!работ)|правда\s+ли/i;

function parseArgs(argv: string[]) {
  let hours = 26;
  let dry = false;
  let force = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry") dry = true;
    else if (a === "--force") force = true;
    else if (a.startsWith("--hours=")) hours = Number(a.split("=")[1]) || 26;
    else if (a === "--hours") hours = Number(argv[++i]) || 26;
  }
  return { hours, dry, force };
}

function seenKey(id: number): string {
  return `chatporto:${id}`;
}

function loadSeen(): Set<string> {
  try {
    const raw = JSON.parse(fs.readFileSync(SEEN_FILE, "utf8")) as { keys?: string[] };
    return new Set(raw.keys || []);
  } catch {
    return new Set();
  }
}

function saveSeen(keys: Set<string>, keep = 600) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const list = [...keys].sort().slice(-keep);
  fs.writeFileSync(
    SEEN_FILE,
    JSON.stringify({ keys: list, updatedAt: new Date().toISOString() }, null, 2) + "\n"
  );
}

function utcDay(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function alreadySentToday(): boolean {
  try {
    const raw = JSON.parse(fs.readFileSync(DAY_LOCK_FILE, "utf8")) as { day?: string };
    return raw.day === utcDay();
  } catch {
    return false;
  }
}

function markSentToday(meta: { msgId: number; url: string }) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(
    DAY_LOCK_FILE,
    JSON.stringify(
      { day: utcDay(), msgId: meta.msgId, url: meta.url, at: new Date().toISOString() },
      null,
      2
    ) + "\n"
  );
}

function notifyChatId(): string | null {
  return (
    process.env.CHATPORTO_NOTIFY_CHAT_ID?.trim() ||
    process.env.TELEGRAM_PRIVATE_CHAT_ID?.trim() ||
    null
  );
}

function pythonBin(): string {
  const venv = path.resolve(process.cwd(), "parser/.venv/bin/python");
  if (fs.existsSync(venv)) return venv;
  return "python3";
}

function fetchMessages(hours: number): FetchedMsg[] {
  const py = path.resolve(process.cwd(), "parser/fetch_chatporto.py");
  const ch = (process.env.CHATPORTO_CHANNEL || "chatporto").trim().replace(/^@/, "");
  const res = spawnSync(
    pythonBin(),
    [py, "--channel", ch, "--hours", String(hours), "--limit", "120"],
    {
      encoding: "utf8",
      cwd: path.resolve(process.cwd(), "parser"),
      env: process.env,
      maxBuffer: 8 * 1024 * 1024,
    }
  );
  if (res.status !== 0) {
    throw new Error(res.stderr || res.stdout || `fetch exit ${res.status}`);
  }
  const data = JSON.parse(res.stdout) as { messages?: FetchedMsg[] };
  return data.messages || [];
}

async function sendDm(chatId: string, text: string) {
  const token = newsBotToken();
  if (!token) throw new Error("EMIGRO_NEWS_BOT_TOKEN missing");
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text.slice(0, 4096),
      disable_web_page_preview: true,
    }),
  });
  const json = (await res.json()) as { ok?: boolean; description?: string };
  if (!json.ok) throw new Error(json.description || "sendMessage failed");
}

async function main() {
  const { hours, dry, force } = parseArgs(process.argv.slice(2));

  if (!force && alreadySentToday()) {
    const msg = `chatporto · уже слали сегодня (${utcDay()}) — тишина до завтра`;
    console.error(msg);
    if (!dry) {
      // no status spam every cron tick if lock held — only log
    } else {
      console.log(`[dry] ${msg}`);
    }
    return;
  }

  const chatId = notifyChatId();
  if (!dry && !chatId) {
    throw new Error("CHATPORTO_NOTIFY_CHAT_ID or TELEGRAM_PRIVATE_CHAT_ID missing");
  }

  const seen = loadSeen();
  const msgs = fetchMessages(hours);
  console.error(`[chatporto] fetched ${msgs.length} msgs / last ${hours}h`);

  const candidates: Array<{
    msg: FetchedMsg;
    score: number;
    topicLabel: string;
    noteSlug: string;
  }> = [];

  for (const msg of msgs) {
    const key = seenKey(msg.id);
    if (seen.has(key)) continue;
    if (msg.reply_to) continue;
    if (NOISE.test(msg.text)) continue;
    if (OUT_OF_SCOPE.test(msg.text)) continue;
    if (!QUESTIONISH.test(msg.text) && !msg.text.includes("?")) continue;
    const matches = matchChatportoTopics(msg.text);
    const top = matches[0];
    // Only inventory hits — no floor for “any question in the chat”.
    if (!top || top.score < CHATPORTO_MIN_SCORE) continue;
    candidates.push({
      msg,
      score: top.score,
      topicLabel: top.topic.label,
      noteSlug: top.topic.noteSlug,
    });
  }

  candidates.sort((a, b) => b.score - a.score);
  console.error(
    `[chatporto] candidates=${candidates.length}` +
      (candidates[0] ? ` top=${candidates[0].msg.id}:${candidates[0].topicLabel}` : "")
  );

  if (candidates.length === 0) {
    const status = `chatporto · ${hours}h · нет вопроса с гайдом (норм)`;
    console.error(status);
    if (!dry && chatId) await sendDm(chatId, status);
    return;
  }

  const maxTries = Math.min(3, candidates.length);
  let sent = false;

  for (let i = 0; i < maxTries; i++) {
    const best = candidates[i]!;
    const produced = await produceChatportoReply({
      question: best.msg.text,
      topicLabel: best.topicLabel,
    });

    seen.add(seenKey(best.msg.id));
    saveSeen(seen);

    if (!produced.reply) {
      console.error(`[chatporto] skip ${best.msg.id}: ${produced.skipReason}`);
      continue;
    }

    const ops = chatportoOpsLink(best.msg.text);
    const noteUrl = ops.noteUrl;
    if (!noteUrl) {
      console.error(`[chatporto] skip ${best.msg.id}: no note url`);
      continue;
    }

    const factLine =
      produced.factVerdict === "revise"
        ? `factcheck: ok (revise) · ${produced.factReason || ""}`
        : `factcheck: ok · ${produced.factReason || "pass"}`;
    const reply = produced.reply.trim();
    if (!reply || /https?:\/\//i.test(reply) || /тема:|score=/i.test(reply)) {
      console.error(`[chatporto] skip ${best.msg.id}: dirty reply`);
      continue;
    }

    const parts = [best.msg.url.trim(), factLine, reply, noteUrl];
    console.log(`\n[1] ${parts[0]}\n[2] ${parts[1]}\n[3] ${parts[2]}\n[4] ${parts[3]}\n`);

    if (!dry && chatId) {
      for (const part of parts) {
        await sendDm(chatId, part);
      }
      markSentToday({ msgId: best.msg.id, url: best.msg.url });
      console.error(`[chatporto] DM×${parts.length} → ${chatId}`);
    } else {
      console.log(`[dry] would DM×${parts.length}`);
    }
    sent = true;
    break;
  }

  if (!sent) {
    const status = `chatporto · ${hours}h · кандидаты были, черновик не прошёл`;
    console.error(status);
    if (!dry && chatId) await sendDm(chatId, status);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
