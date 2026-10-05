import { normalizeTelegramPublicUrl, telegramPublicUrl } from "@/lib/telegram/public-url";
import {
  defaultCityChat,
  parseCityChatStartPayload,
  type SatelliteCityChat,
} from "@/lib/satellite/city-chats";
import type { AssistPlanTier, BotDeepLink } from "@/lib/telegram/bot/types";
import { resolveNewsBotTopic } from "@/lib/news/bot-subscribe-topics";

export type WizardTelegramMode = "hub" | "corridor";

/** Wizard session deep links go to the bot, not the discussion group. */
const WIZARD_BOT_URL =
  normalizeTelegramPublicUrl(
    process.env.EMIGRO_CHAT_BOT_PUBLIC_URL?.trim() ?? telegramPublicUrl("emigro_chat_bot"),
  );
const START_PREFIX: Record<WizardTelegramMode, string> = {
  hub: "wiz_hub_",
  corridor: "wiz_corridor_",
};

export function publicTelegramBotUrl(): string {
  const raw = (process.env.EMIGRO_CHAT_BOT_PUBLIC_URL?.trim() ?? telegramPublicUrl("emigro_chat_bot")).trim();
  const value = raw.startsWith("@") ? telegramPublicUrl(raw) : normalizeTelegramPublicUrl(raw);

  try {
    const url = new URL(value);
    if (url.hostname !== "t.me" && url.hostname !== "telegram.me") return WIZARD_BOT_URL;
    return normalizeTelegramPublicUrl(value);
  } catch {
    return WIZARD_BOT_URL;
  }
}

export function wizardTelegramStartPayload({
  mode,
  sessionId,
}: {
  mode: WizardTelegramMode;
  sessionId: string;
}): string {
  const cleanSessionId = sessionId.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 48);
  return `${START_PREFIX[mode]}${cleanSessionId}`;
}

export function wizardTelegramDeepLink(input: {
  mode: WizardTelegramMode;
  sessionId: string;
}): string {
  const url = new URL(publicTelegramBotUrl());
  url.searchParams.set("start", wizardTelegramStartPayload(input));
  return url.toString();
}

/** Private city group: site CTAs must use this, never a t.me/+ invite hash. */
export const PORTO_CHAT_START_PAYLOAD = "porto_chat";

export function cityChatDeepLink(chat: SatelliteCityChat, source?: string): string {
  const url = new URL(publicTelegramBotUrl());
  const suffix = source?.replace(/[^a-z0-9_]/gi, "").slice(0, 24).toLowerCase();
  url.searchParams.set("start", suffix ? `${chat.startPayload}_${suffix}` : chat.startPayload);
  return url.toString();
}

export function isPortoChatStartPayload(payload: string): boolean {
  const chat = parseCityChatStartPayload(payload);
  return chat?.startPayload === PORTO_CHAT_START_PAYLOAD;
}

export function isCityChatStartPayload(payload: string): boolean {
  return Boolean(parseCityChatStartPayload(payload));
}

export function portoChatDeepLink(source?: string): string {
  return cityChatDeepLink(defaultCityChat(), source);
}

/** Opens the bot so the user can subscribe to country news in chat (not on the site). */
export function newsBotStartPayload(topicKey?: string): string {
  const key = topicKey?.replace(/[^a-z]/gi, "").toLowerCase();
  return key ? `news_${key}` : "news";
}

export function newsBotDeepLink(topicKey?: string): string {
  const url = new URL(publicTelegramBotUrl());
  url.searchParams.set("start", newsBotStartPayload(topicKey));
  return url.toString();
}

export function parseWizardTelegramStartPayload(payload: string):
  | { mode: WizardTelegramMode; sessionId: string }
  | null {
  const clean = payload.trim();
  for (const [mode, prefix] of Object.entries(START_PREFIX) as Array<[WizardTelegramMode, string]>) {
    if (!clean.startsWith(prefix)) continue;
    const sessionId = clean.slice(prefix.length);
    if (/^[A-Za-z0-9_-]{8,48}$/.test(sessionId)) {
      return { mode, sessionId };
    }
  }
  return null;
}

function startUrl(payload: string): string {
  const url = new URL(publicTelegramBotUrl());
  url.searchParams.set("start", payload);
  return url.toString();
}

export function assistBotStartPayload(opts?: { country?: string; tier?: AssistPlanTier }): string {
  const country = opts?.country?.replace(/[^a-z]/gi, "").toLowerCase();
  const tierPrefix =
    opts?.tier === "route-check" ? "assist_route" : opts?.tier === "accompaniment" ? "assist_acc" : "assist";
  if (opts?.tier === "partner-match") {
    return country ? `assist_partner_${country}` : "assist_partner";
  }
  return country ? `${tierPrefix}_${country}` : tierPrefix;
}

export function assistBotDeepLink(opts?: { country?: string; tier?: AssistPlanTier }): string {
  return startUrl(assistBotStartPayload(opts));
}

export function propertyBotStartPayload(dest?: "uae" | "thailand"): string {
  if (dest === "uae") return "property_uae";
  if (dest === "thailand") return "property_thailand";
  return "property";
}

export function propertyBotDeepLink(dest?: "uae" | "thailand"): string {
  return startUrl(propertyBotStartPayload(dest));
}

function parseAssistPayload(clean: string): BotDeepLink | null {
  const match = clean.match(/^assist(?:_(partner|route|acc|accompaniment))?(?:_([a-z]+))?$/i);
  if (!match) return null;
  const rawTier = (match[1] || "").toLowerCase();
  const tier: AssistPlanTier | undefined =
    rawTier === "route"
      ? "route-check"
      : rawTier === "acc" || rawTier === "accompaniment"
        ? "accompaniment"
        : rawTier === "partner"
          ? "partner-match"
          : undefined;
  const countryRaw = match[2]?.toLowerCase();
  const country = countryRaw && resolveNewsBotTopic(countryRaw) ? resolveNewsBotTopic(countryRaw)!.key : countryRaw;
  return { app: "assist", country, tier };
}

export function parseBotStartPayload(payload: string): BotDeepLink | null {
  const raw = payload.trim();
  if (!raw) return { app: "home" };

  const wizard = parseWizardTelegramStartPayload(raw);
  if (wizard) return { app: "wizard", mode: wizard.mode, sessionId: wizard.sessionId };

  const clean = raw.toLowerCase();

  const city = parseCityChatStartPayload(clean);
  if (city) return { app: "city", countryKey: city.countryKey };

  if (clean === "news") return { app: "news" };
  const news = clean.match(/^news[_-]([a-z]+)$/i);
  if (news) {
    const topic = resolveNewsBotTopic(news[1]);
    return { app: "news", topicKey: topic?.key };
  }

  if (clean === "property") return { app: "property" };
  if (clean === "property_uae") return { app: "property", dest: "uae" };
  if (clean === "property_thailand" || clean === "property_th") return { app: "property", dest: "thailand" };

  const assist = parseAssistPayload(clean);
  if (assist) return assist;

  return null;
}
