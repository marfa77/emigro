import { answerStatsBotCallback } from "@/lib/telegram/admin-bot";
import { decideUserRoute } from "@/lib/telegram/bot/decide";
import { sendHome } from "@/lib/telegram/bot/home";
import { clearSession, getLiveSession } from "@/lib/telegram/bot/session";
import { upsertBotUser } from "@/lib/telegram/bot/users";
import { continueAssist, startAssist } from "@/lib/telegram/bot/apps/assist";
import { continueCity, startCity } from "@/lib/telegram/bot/apps/city";
import { continueNews, startNews } from "@/lib/telegram/bot/apps/news";
import { continueProperty, startProperty } from "@/lib/telegram/bot/apps/property";
import { continueWizardHomeAssist, startWizard } from "@/lib/telegram/bot/apps/wizard";
import type { BotDeepLink, BotIncoming, BotUserCtx, TelegramUpdate } from "@/lib/telegram/bot/types";

function toCtx(update: TelegramUpdate): BotUserCtx | null {
  const cb = update.callback_query;
  if (cb) {
    const chatId = Number(cb.message?.chat?.id ?? cb.from?.id);
    const userId = Number(cb.from?.id);
    if (!Number.isFinite(chatId) || !Number.isFinite(userId)) return null;
    return {
      userId,
      chatId,
      username: cb.from?.username,
      firstName: cb.from?.first_name,
    };
  }
  const message = update.message || update.edited_message;
  const chatId = Number(message?.chat?.id);
  const userId = Number(message?.from?.id);
  if (!Number.isFinite(chatId) || !Number.isFinite(userId)) return null;
  return {
    userId,
    chatId,
    username: message?.from?.username,
    firstName: message?.from?.first_name,
    lastName: message?.from?.last_name,
  };
}

function toIncoming(update: TelegramUpdate): BotIncoming | null {
  const cb = update.callback_query;
  if (cb?.id && cb.data) return { kind: "callback", id: cb.id, data: cb.data };
  const text = (update.message || update.edited_message)?.text;
  if (typeof text === "string") return { kind: "message", text };
  return null;
}

function isPrivate(update: TelegramUpdate): boolean {
  const type = update.callback_query?.message?.chat?.type || update.message?.chat?.type || update.edited_message?.chat?.type;
  return (type || "private") === "private";
}

async function openApp(ctx: BotUserCtx, link: BotDeepLink, incoming: BotIncoming): Promise<void> {
  await clearSession(ctx.userId);
  if (link.app === "home") {
    await sendHome(ctx);
    return;
  }
  if (link.app === "news") {
    await startNews(ctx, link.topicKey);
    return;
  }
  if (link.app === "city") {
    await startCity(ctx, link.countryKey);
    return;
  }
  if (link.app === "wizard") {
    await startWizard(ctx, { mode: link.mode, sessionId: link.sessionId });
    return;
  }
  if (link.app === "assist") {
    if (incoming.kind === "callback" && incoming.data.startsWith("home:assist")) {
      await startAssist(ctx, { country: link.country });
      return;
    }
    await startAssist(ctx, { country: link.country, tier: link.tier });
    return;
  }
  if (link.app === "property") {
    await startProperty(ctx, link.dest);
  }
}

async function continueApp(ctx: BotUserCtx, incoming: BotIncoming): Promise<void> {
  const session = await getLiveSession(ctx.userId);
  if (!session) {
    await sendHome(ctx, "Сессия истекла. Выберите пункт меню.");
    return;
  }
  if (session.app === "assist") {
    await continueAssist(ctx, incoming, session.payload);
    return;
  }
  if (session.app === "property") {
    await continueProperty(ctx, incoming, session.payload);
    return;
  }
  if (session.app === "city") {
    await continueCity(ctx, incoming);
    return;
  }
  if (session.app === "news") {
    const handled = await continueNews(ctx, incoming);
    if (!handled) await startNews(ctx);
  }
}

export async function routeTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (!isPrivate(update)) return;

  const ctx = toCtx(update);
  const incoming = toIncoming(update);
  if (!ctx || !incoming) return;

  await upsertBotUser(ctx);
  const session = await getLiveSession(ctx.userId);
  const action = decideUserRoute({
    text: incoming.kind === "message" ? incoming.text : undefined,
    callbackData: incoming.kind === "callback" ? incoming.data : undefined,
    hasLiveSession: Boolean(session),
  });

  if (action.type === "home") {
    await clearSession(ctx.userId);
    await sendHome(ctx, action.hint);
    return;
  }
  if (action.type === "open") {
    await openApp(ctx, action.link, incoming);
    return;
  }
  if (action.type === "continue-session") {
    await continueApp(ctx, incoming);
    return;
  }
  if (action.type === "dispatch") {
    if (action.app === "assist") await continueAssist(ctx, incoming, {});
    else await continueProperty(ctx, incoming, {});
    return;
  }
  if (action.type === "news") {
    const handled = await continueNews(ctx, incoming);
    if (!handled) await startNews(ctx);
    return;
  }
  if (action.type === "city-keyword") {
    await startCity(ctx, action.countryKey);
    return;
  }

  if (incoming.kind === "callback") {
    if (await continueWizardHomeAssist(ctx, incoming)) return;
    await answerStatsBotCallback(incoming.id);
  }
  await sendHome(ctx);
}
