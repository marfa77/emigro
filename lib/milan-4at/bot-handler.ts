/**
 * Telegram handler for the dedicated @milan_4at draft bot (MILAN4AT_BOT_TOKEN).
 * Input: forward from the group, or paste question text / t.me message link.
 * Output: optional message link + soft expert draft (no Emigro hard sell).
 */
import { draftMilan4atReply } from "@/lib/milan-4at/draft";
import { produceMilan4atReply } from "@/lib/milan-4at/produce-reply";
import fs from "fs";
import path from "path";

export function milan4atBotToken(): string | undefined {
  return process.env.MILAN4AT_BOT_TOKEN?.trim() || undefined;
}

const NOTIFY_FILE = path.join(process.cwd(), "scripts/output/milan4at-notify-chat.json");

export function rememberMilan4atNotifyChat(
  chatId: string | number,
  meta?: { userId?: string | number; username?: string; firstName?: string }
): void {
  try {
    fs.mkdirSync(path.dirname(NOTIFY_FILE), { recursive: true });
    fs.writeFileSync(
      NOTIFY_FILE,
      JSON.stringify(
        {
          chatId: String(chatId),
          userId: meta?.userId != null ? String(meta.userId) : undefined,
          username: meta?.username || undefined,
          firstName: meta?.firstName || undefined,
          updatedAt: new Date().toISOString(),
          source: "/start",
        },
        null,
        2
      ) + "\n"
    );
  } catch (e) {
    console.error("[milan4at-bot] failed to persist notify chat:", e);
  }
}

/** Prefer durable env on VPS/Vercel; else local /start file. */
export function loadMilan4atNotifyChatId(): string | null {
  const fromEnv = process.env.MILAN4AT_NOTIFY_CHAT_ID?.trim();
  if (fromEnv) return fromEnv;
  try {
    const raw = JSON.parse(fs.readFileSync(NOTIFY_FILE, "utf8")) as { chatId?: string | number };
    return raw.chatId != null ? String(raw.chatId) : null;
  } catch {
    return null;
  }
}

type TgChat = { id: number; type?: string; username?: string; title?: string };
type TgUser = { id: number; username?: string; first_name?: string };
type TgMessage = {
  message_id: number;
  text?: string;
  caption?: string;
  chat: TgChat;
  from?: TgUser;
  forward_from_chat?: TgChat;
  forward_from_message_id?: number;
  forward_origin?: {
    type?: string;
    chat?: TgChat;
    message_id?: number;
  };
  entities?: Array<{ type: string; offset: number; length: number; url?: string }>;
  caption_entities?: Array<{ type: string; offset: number; length: number; url?: string }>;
};

export type Milan4atUpdate = {
  update_id: number;
  message?: TgMessage;
  edited_message?: TgMessage;
};

function messageLink(chat: TgChat | undefined, messageId: number | undefined): string | null {
  if (!chat || messageId == null) return null;
  if (chat.username) return `https://t.me/${chat.username}/${messageId}`;
  // private/supergroup without @ — t.me/c/<internal>/<id>
  const raw = String(chat.id);
  if (raw.startsWith("-100")) {
    const internal = raw.slice(4);
    return `https://t.me/c/${internal}/${messageId}`;
  }
  return null;
}

function extractQuestionText(msg: TgMessage): string {
  return (msg.text || msg.caption || "").trim();
}

/** Strip a lone t.me link so we don't treat the URL as the question body. */
function stripTelegramLinks(text: string): string {
  return text
    .replace(/https?:\/\/t\.me\/[^\s]+/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstTelegramUrl(msg: TgMessage): string | null {
  const text = msg.text || msg.caption || "";
  const entities = msg.entities || msg.caption_entities || [];
  for (const e of entities) {
    if (e.type === "url") {
      const slice = text.slice(e.offset, e.offset + e.length);
      if (/t\.me\//i.test(slice)) return slice.startsWith("http") ? slice : `https://${slice}`;
    }
    if (e.type === "text_link" && e.url && /t\.me\//i.test(e.url)) return e.url;
  }
  const m = text.match(/https?:\/\/t\.me\/[^\s]+/i);
  return m ? m[0] : null;
}

/** Two-message draft: [0]=question link (optional), [1]=short reply body. */
export function buildMilan4atBotMessages(msg: TgMessage): string[] {
  const raw = extractQuestionText(msg);
  if (!raw) {
    return ["Пришлите текст вопроса или перешлите сообщение из @milan_4at / @como_4at / @milan_ua_chat."];
  }
  if (/^\/start\b/i.test(raw) || /^\/help\b/i.test(raw)) {
    rememberMilan4atNotifyChat(msg.chat.id, {
      userId: msg.from?.id,
      username: msg.from?.username,
      firstName: msg.from?.first_name,
    });
    return [
      [
        "Ок. Черновики из @milan_4at, @como_4at и @milan_ua_chat буду слать только вам в этот чат.",
        "Скан: npm run milan4at:scan",
        "Формат: 1) ссылка 2) короткий ответ. В группу и другим — нет.",
      ].join("\n"),
    ];
  }

  const forwardedChat = msg.forward_from_chat || msg.forward_origin?.chat;
  const forwardedMsgId = msg.forward_from_message_id ?? msg.forward_origin?.message_id;
  const linkFromForward = messageLink(forwardedChat, forwardedMsgId);
  const linkFromPaste = firstTelegramUrl(msg);
  const questionLink = linkFromForward || linkFromPaste;

  const questionBody = stripTelegramLinks(raw);
  if (!questionBody || questionBody.length < 8) {
    return [
      questionLink || "",
      "В ссылке нет текста — перешлите само сообщение или допишите вопрос.",
    ].filter(Boolean);
  }

  const draft = draftMilan4atReply(questionBody);
  if (!draft.relevant) {
    const skip = [
      "SKIP — слабо бьётся в Italy inventory, лучше не отвечать от «эксперта».",
      draft.ops.matches.length
        ? `ближние: ${draft.ops.matches.map((m) => m.label).join(", ")}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");
    return questionLink ? [questionLink, skip] : [skip];
  }

  // Placeholder — processMilan4atUpdate replaces with LLM + factcheck (3 msgs).
  return questionLink ? [questionLink, "__LLM__"] : ["__LLM__"];
}

/** @deprecated use buildMilan4atBotMessages — kept for scripts that expect one blob */
export function buildMilan4atBotReply(msg: TgMessage): string {
  return buildMilan4atBotMessages(msg)
    .filter((p) => p !== "__LLM__")
    .join("\n\n");
}

async function tgApi(
  token: string,
  method: string,
  body: Record<string, unknown>
): Promise<{ ok: boolean; description?: string }> {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as { ok: boolean; description?: string };
}

async function sendPrivate(token: string, chatId: number, text: string): Promise<void> {
  const res = await tgApi(token, "sendMessage", {
    chat_id: chatId,
    text: text.trim(),
    disable_web_page_preview: true,
    link_preview_options: { is_disabled: true },
  });
  if (!res.ok) {
    console.error("[milan4at-bot] sendMessage failed:", res.description);
  }
}

export async function processMilan4atUpdate(update: Milan4atUpdate): Promise<void> {
  const token = milan4atBotToken();
  if (!token) return;

  const msg = update.message || update.edited_message;
  if (!msg?.chat?.id) return;
  // Only private DMs — never reply inside groups
  if (msg.chat.type && msg.chat.type !== "private") return;

  const parts = buildMilan4atBotMessages(msg);
  const questionBody = stripTelegramLinks(extractQuestionText(msg));
  const draft = questionBody.length >= 8 ? draftMilan4atReply(questionBody) : null;

  for (const part of parts) {
    if (!part.trim()) continue;
    if (part === "__LLM__") {
      const produced = await produceMilan4atReply({
        question: questionBody,
        topicLabel: draft?.topicLabel,
      });
      if (!produced.reply) {
        await sendPrivate(
          token,
          msg.chat.id,
          `SKIP — ${produced.skipReason || "модель/фактчек отказали"}`
        );
        continue;
      }
      const factLine =
        produced.factVerdict === "revise"
          ? `factcheck: ok (revise) · ${produced.factReason || "правкали черновик"}`
          : `factcheck: ok · ${produced.factReason || "pass"}`;
      await sendPrivate(token, msg.chat.id, factLine);
      await sendPrivate(token, msg.chat.id, produced.reply);
      continue;
    }
    await sendPrivate(token, msg.chat.id, part);
  }
}
