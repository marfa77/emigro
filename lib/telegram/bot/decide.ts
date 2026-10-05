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
  | { type: "dispatch"; app: "assist" | "property" }
  | { type: "news" }
  | { type: "city-keyword"; countryKey: string };

export function startPayloadFromText(text: string): string | null {
  const match = text.trim().match(/^\/start(?:@\w+)?(?:\s+(.+))?$/i);
  if (!match) return null;
  return match[1]?.trim() ?? "";
}

export function parseAppSlashCommand(text: string): BotDeepLink | null {
  const t = text.trim();
  if (/^\/(?:news|новости)(?:@\w+)?$/i.test(t)) return { app: "news" };
  if (/^\/(?:assist|help|pomosh|помощь)(?:@\w+)?$/i.test(t)) return { app: "assist" };
  if (/^\/(?:property|invest|недвижка)(?:@\w+)?$/i.test(t)) return { app: "property" };
  if (/^\/(?:chat|city)(?:@\w+)?$/i.test(t)) return { app: "city" };
  return null;
}

export function isUserAppCallback(data: string): boolean {
  return (
    data.startsWith("as:") ||
    data.startsWith("pr:") ||
    data.startsWith("city:") ||
    data.startsWith("home:") ||
    Boolean(parseNewsBotCallback(data))
  );
}

/**
 * Pure router decision. Global commands and menu beat a live session.
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
      return { type: "home", hint: "Не понял ссылку. Откройте меню и выберите приложение." };
    }
    if (isGlobalCommand(text) || (isStartCommand(text) && !startPayloadFromText(text))) {
      return { type: "home" };
    }
    const menu = parseMenuLabel(text);
    if (menu === "Меню") return { type: "home" };
    if (menu === "Новости") return { type: "open", link: { app: "news" } };
    if (menu === "Помощь") return { type: "open", link: { app: "assist" } };
    if (menu === "Недвижка") return { type: "open", link: { app: "property" } };
    if (menu === "Чат города") return { type: "open", link: { app: "city" } };

    const slash = parseAppSlashCommand(text);
    if (slash) return { type: "open", link: slash };

    if (input.hasLiveSession) return { type: "continue-session" };

    if (parseNewsBotIntent(text)) return { type: "news" };
    const city = matchCityChatKeyword(text);
    if (city) return { type: "city-keyword", countryKey: city.countryKey };
    return { type: "home", hint: "Выберите пункт меню ниже — новости, помощь, недвижка или чат города." };
  }

  if (data) {
    if (parseNewsBotCallback(data)) return { type: "news" };
    if (data.startsWith("home:assist")) {
      const country = data.startsWith("home:assist:")
        ? data.slice("home:assist:".length).replace(/[^a-z]/g, "") || undefined
        : undefined;
      return { type: "open", link: { app: "assist", country } };
    }
    if (data.startsWith("city:")) {
      const countryKey = data.slice("city:".length).replace(/[^a-z]/g, "");
      return { type: "open", link: { app: "city", countryKey: countryKey || undefined } };
    }
    if (input.hasLiveSession) return { type: "continue-session" };
    if (data.startsWith("as:")) return { type: "dispatch", app: "assist" };
    if (data.startsWith("pr:")) return { type: "dispatch", app: "property" };
    return { type: "home" };
  }

  return { type: "home" };
}
