import { answerStatsBotCallback } from "@/lib/telegram/admin-bot";
import { decideUserRoute } from "@/lib/telegram/bot/decide";
import { sendHome } from "@/lib/telegram/bot/home";
import { clearSession, getLiveSession } from "@/lib/telegram/bot/session";
import { upsertBotUser } from "@/lib/telegram/bot/users";
import { continueCity, startCity } from "@/lib/telegram/bot/apps/city";
import { continueRequest, startRequest } from "@/lib/telegram/bot/apps/request";
import { continueTax, startTax } from "@/lib/telegram/bot/apps/tax";
import { sendMyRequestStatus } from "@/lib/telegram/bot/request-owner";
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

function messageFromUpdate(update: TelegramUpdate): TelegramUpdate["message"] {
  return update.message || update.edited_message;
}

function toIncoming(update: TelegramUpdate): BotIncoming | null {
  const cb = update.callback_query;
  if (cb?.id && cb.data) return { kind: "callback", id: cb.id, data: cb.data };

  const message = messageFromUpdate(update);
  if (!message) return null;

  const photos = message.photo;
  if (photos?.length) {
    const photoFileId = photos[photos.length - 1]?.file_id;
    if (photoFileId) {
      return {
        kind: "media",
        caption: message.caption ?? "",
        photoFileId,
      };
    }
  }

  const doc = message.document;
  if (doc?.file_id) {
    return {
      kind: "media",
      caption: message.caption ?? "",
      documentFileId: doc.file_id,
      mimeType: doc.mime_type,
      fileName: doc.file_name,
    };
  }

  const text = message.text;
  if (typeof text === "string") return { kind: "message", text };

  if (typeof message.caption === "string" && message.caption.length > 0) {
    return { kind: "media", caption: message.caption };
  }

  return null;
}

function isPrivate(update: TelegramUpdate): boolean {
  const type = update.callback_query?.message?.chat?.type || update.message?.chat?.type || update.edited_message?.chat?.type;
  return (type || "private") === "private";
}

async function openApp(ctx: BotUserCtx, link: BotDeepLink): Promise<void> {
  await clearSession(ctx.userId);
  // Since 2026-11-19 every help / property / invest / wizard entry from the site opens the specialist request.
  switch (link.app) {
    case "home":
      await sendHome(ctx);
      return;
    case "status":
      await sendMyRequestStatus(ctx.chatId, ctx.userId);
      return;
    case "city":
      await startCity(ctx, link.countryKey);
      return;
    case "tax":
      // Not in the menu any more; still reachable from /ru/nalogi.
      await startTax(ctx, link.year);
      return;
    case "news":
      await sendHome(ctx, "Новостную рассылку в боте мы приостановили — новости по странам выходят на emigro.online.");
      return;
    case "request":
      await startRequest(ctx, { country: link.country, source: link.source, goal: link.goal });
      return;
    case "assist":
      await startRequest(ctx, { country: link.country, source: link.country ? `assist_${link.country}` : "assist" });
      return;
    case "property":
      await startRequest(ctx, { country: link.dest, source: `property_${link.dest ?? "any"}`, goal: "property" });
      return;
    case "invest":
      await startRequest(ctx, { source: `invest_${link.key}`, goal: "invest" });
      return;
    case "wizard":
      await startRequest(ctx, { source: `wizard_${link.mode}_${link.sessionId}`.slice(0, 80) });
      return;
  }
}

async function continueApp(ctx: BotUserCtx, incoming: BotIncoming): Promise<void> {
  const session = await getLiveSession(ctx.userId);
  if (!session) {
    await sendHome(ctx, "Сессия истекла. Выберите пункт меню.");
    return;
  }
  if (session.app === "request") {
    await continueRequest(ctx, incoming, session.payload, session.step);
    return;
  }
  if (session.app === "city") {
    await continueCity(ctx, incoming);
    return;
  }
  if (session.app === "tax") {
    await continueTax(ctx, incoming, session.payload, session.step);
    return;
  }
  // Sessions of retired apps (assist, property, news) fall back to the new flow.
  await sendHome(ctx);
}

export async function routeTelegramUpdate(update: TelegramUpdate): Promise<void> {
  if (!isPrivate(update)) return;

  const ctx = toCtx(update);
  const incoming = toIncoming(update);
  if (!ctx || !incoming) return;

  await upsertBotUser(ctx);
  const session = await getLiveSession(ctx.userId);

  if (incoming.kind === "media") {
    if (session) {
      await continueApp(ctx, incoming);
      return;
    }
    await sendHome(ctx, "Файлы принимаем только внутри заявки — нажмите «Подобрать специалиста».");
    return;
  }

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
    await openApp(ctx, action.link);
    return;
  }
  if (action.type === "continue-session") {
    await continueApp(ctx, incoming);
    return;
  }
  if (action.type === "city-keyword") {
    await startCity(ctx, action.countryKey);
    return;
  }

  if (incoming.kind === "callback") await answerStatsBotCallback(incoming.id);
  await sendHome(ctx);
}
