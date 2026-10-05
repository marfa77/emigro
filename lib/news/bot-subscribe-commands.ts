import { resolveNewsBotTopic, type NewsBotTopic } from "@/lib/news/bot-subscribe-topics";

export type NewsBotIntent =
  | { type: "subscribe"; topic?: NewsBotTopic }
  | { type: "unsubscribe"; topic?: NewsBotTopic }
  | { type: "help" };

const START_NEWS_RE = /^news(?:[_-]?([a-z]+))?$/i;
const SUBSCRIBE_RE =
  /^\/(?:news|subscribe|novosti)(?:@\w+)?(?:\s+(.+))?$/i;
const UNSUBSCRIBE_RE =
  /^\/(?:stop|unsubscribe|unsub)(?:@\w+)?(?:\s+(.+))?$/i;

function stripBotCommand(text: string): string {
  return (text || "").trim().replace(/^\/(?:start)(?:@\w+)?\s+/i, "").trim();
}

export function parseNewsStartPayload(payload: string): NewsBotTopic | "picker" | null {
  const match = payload.trim().match(START_NEWS_RE);
  if (!match) return null;
  if (!match[1]) return "picker";
  return resolveNewsBotTopic(match[1]) ?? "picker";
}

export function parseNewsBotIntent(text: string): NewsBotIntent | null {
  const raw = (text || "").trim();
  if (!raw) return null;

  const startPayload = stripBotCommand(raw);
  if (/^\/start(?:@\w+)?\s+/i.test(raw)) {
    const parsed = parseNewsStartPayload(startPayload);
    if (parsed === "picker") return { type: "subscribe" };
    if (parsed) return { type: "subscribe", topic: parsed };
  }

  const unsubCmd = raw.match(UNSUBSCRIBE_RE);
  if (unsubCmd) {
    return { type: "unsubscribe", topic: resolveNewsBotTopic(unsubCmd[1]) };
  }

  const subCmd = raw.match(SUBSCRIBE_RE);
  if (subCmd) {
    return { type: "subscribe", topic: resolveNewsBotTopic(subCmd[1]) };
  }

  const lower = raw.toLowerCase();
  if (
    /^(отписка|отписаться|стоп новост)/i.test(lower) ||
    /^отписка\s+/.test(lower)
  ) {
    const rest = raw.replace(/^(отписка|отписаться|стоп новост\w*)\s*/i, "");
    return { type: "unsubscribe", topic: resolveNewsBotTopic(rest) };
  }

  if (/^(новости|подписка|подписаться)(?:\s|$)/i.test(lower)) {
    const rest = raw.replace(/^(новости|подписка|подписаться)\s*/i, "");
    return { type: "subscribe", topic: resolveNewsBotTopic(rest) };
  }

  if (/как подписаться|подписка на новости|новости в бот/i.test(lower)) {
    return { type: "help" };
  }

  return null;
}

export function newsBotCallbackData(topicKey: string): string {
  return `news:sub:${topicKey}`.slice(0, 64);
}

export function newsBotUnsubCallbackData(topicKey = "all"): string {
  return `news:unsub:${topicKey}`.slice(0, 64);
}

export function parseNewsBotCallback(data: string): NewsBotIntent | null {
  const sub = data.match(/^news:sub:([a-z]+)$/i);
  if (sub) {
    const topic = resolveNewsBotTopic(sub[1]);
    return topic ? { type: "subscribe", topic } : { type: "subscribe" };
  }
  const unsub = data.match(/^news:unsub:([a-z]+)$/i);
  if (unsub) {
    if (unsub[1] === "all") return { type: "unsubscribe" };
    return { type: "unsubscribe", topic: resolveNewsBotTopic(unsub[1]) };
  }
  return null;
}
