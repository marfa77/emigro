import { parseBotStartPayload } from "@/lib/telegram/deep-link";
import { isStartCommand } from "@/lib/telegram/commands";
import { matchCityChatKeyword } from "@/lib/satellite/city-chats";
import { parseNewsBotCallback, parseNewsBotIntent } from "@/lib/news/bot-subscribe-commands";
import { isGlobalCommand } from "@/lib/telegram/bot/home";
import { parseMenuLabel } from "@/lib/telegram/bot/markup";
import type { BotDeepLink } from "@/lib/telegram/bot/types";

export type RouteAction =
  | { type: "home"; hint?: string }
  | { type: "open"; link: BotDeepLink }
  | { type: "continue-session" }
  | { type: "city-keyword"; countryKey: string };

export function startPayloadFromText(text: string): string | null {
  const match = text.trim().match(/^\/start(?:@\w+)?(?:\s+(.+))?$/i);
  if (!match) return null;
  return match[1]?.trim() ?? "";
}

export function parseAppSlashCommand(text: string): BotDeepLink | null {
  const t = text.trim();
  if (/^\/(?:assist|help|pomosh|помощь|request|zayavka|заявка|property|invest|недвижка)(?:@\w+)?$/i.test(t)) {
    return { app: "request" };
  }
  if (/^\/(?:status|мой_запрос)(?:@\w+)?$/i.test(t)) return { app: "status" };
  if (/^\/(?:chat|city)(?:@\w+)?$/i.test(t)) return { app: "city" };
  if (/^\/(?:tax|налоги)(?:@\w+)?$/i.test(t)) return { app: "tax" };
  return null;
}

export function isUserAppCallback(data: string): boolean {
  return (
    data.startsWith("rs:") ||
    data.startsWith("as:") ||
    data.startsWith("pr:") ||
    data.startsWith("iv:") ||
    data.startsWith("city:") ||
    data.startsWith("tx:") ||
    data.startsWith("home:") ||
    Boolean(parseNewsBotCallback(data))
  );
}

const NEWS_PAUSED_HINT = "Новостную рассылку в боте мы приостановили — новости по странам выходят на emigro.online.";

/**
 * Pure router decision. Global commands and menu beat a live session.
 * Since 2026-11-19 the bot has one job — a free specialist request — plus «Мой запрос» and city chats.
 * Unknown text is home — never a Porto invite.
 */
export function decideUserRoute(input: {
  text?: string;
  callbackData?: string;
  hasLiveSession: boolean;
}): RouteAction {
  const text = (input.text || "").trim();
  const data = (input.callbackData || "").trim();

  if (text) {
    const payload = startPayloadFromText(text);
    if (payload !== null) {
      if (!payload) return { type: "home" };
      const link = parseBotStartPayload(payload);
      if (link) return { type: "open", link };
      return { type: "home", hint: "Не понял ссылку. Выберите пункт меню ниже." };
    }
    if (isGlobalCommand(text) || (isStartCommand(text) && !startPayloadFromText(text))) {
      return { type: "home" };
    }
    const menu = parseMenuLabel(text);
    if (menu === "Меню") return { type: "home" };
    if (menu === "Подобрать специалиста" || menu === "Помощь" || menu === "Недвижка") {
      return { type: "open", link: { app: "request" } };
    }
    if (menu === "Мой запрос") return { type: "open", link: { app: "status" } };
    if (menu === "Чат города") return { type: "open", link: { app: "city" } };
    if (menu === "Налоги") return { type: "open", link: { app: "tax" } };
    if (menu === "Новости") return { type: "home", hint: NEWS_PAUSED_HINT };

    const slash = parseAppSlashCommand(text);
    if (slash) return { type: "open", link: slash };

    if (input.hasLiveSession) return { type: "continue-session" };

    if (parseNewsBotIntent(text)) return { type: "home", hint: NEWS_PAUSED_HINT };
    const city = matchCityChatKeyword(text);
    if (city) return { type: "city-keyword", countryKey: city.countryKey };
    return {
      type: "home",
      hint: "Чтобы мы подобрали специалиста, нажмите «Подобрать специалиста».",
    };
  }

  if (data) {
    if (data.startsWith("rs:")) return input.hasLiveSession ? { type: "continue-session" } : { type: "open", link: { app: "request" } };
    if (parseNewsBotCallback(data)) return { type: "home", hint: NEWS_PAUSED_HINT };
    if (data.startsWith("home:assist")) {
      const country = data.startsWith("home:assist:")
        ? data.slice("home:assist:".length).replace(/[^a-z]/g, "") || undefined
        : undefined;
      return { type: "open", link: { app: "request", country } };
    }
    if (data.startsWith("city:")) {
      const countryKey = data.slice("city:".length).replace(/[^a-z]/g, "");
      return { type: "open", link: { app: "city", countryKey: countryKey || undefined } };
    }
    if (data.startsWith("tx:")) return { type: "continue-session" };
    if (input.hasLiveSession) return { type: "continue-session" };
    if (data.startsWith("as:") || data.startsWith("pr:") || data.startsWith("iv:")) {
      return { type: "open", link: { app: "request" } };
    }
    return { type: "home" };
  }

  return { type: "home" };
}
