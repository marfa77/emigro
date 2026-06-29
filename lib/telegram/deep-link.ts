import { RELOCATOR_CHAT_URL } from "@/lib/community";

export type WizardTelegramMode = "hub" | "corridor";

const DEFAULT_BOT_URL = "https://t.me/emigro_chat_bot";
const START_PREFIX: Record<WizardTelegramMode, string> = {
  hub: "wiz_hub_",
  corridor: "wiz_corridor_",
};

function publicTelegramBotUrl(): string {
  const raw = RELOCATOR_CHAT_URL.trim();
  const value = raw.startsWith("@")
    ? `https://t.me/${raw.slice(1)}`
    : raw.startsWith("t.me/")
      ? `https://${raw}`
      : raw;

  try {
    const url = new URL(value);
    if (url.hostname !== "t.me" && url.hostname !== "telegram.me") return DEFAULT_BOT_URL;
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_BOT_URL;
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
