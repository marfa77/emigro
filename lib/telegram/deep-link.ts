export type WizardTelegramMode = "hub" | "corridor";

/** Wizard session deep links go to the bot, not the discussion group. */
const WIZARD_BOT_URL =
  process.env.EMIGRO_CHAT_BOT_PUBLIC_URL?.trim() ?? "https://t.me/emigro_chat_bot";
const START_PREFIX: Record<WizardTelegramMode, string> = {
  hub: "wiz_hub_",
  corridor: "wiz_corridor_",
};

function publicTelegramBotUrl(): string {
  const raw = WIZARD_BOT_URL.trim();
  const value = raw.startsWith("@")
    ? `https://t.me/${raw.slice(1)}`
    : raw.startsWith("t.me/")
      ? `https://${raw}`
      : raw;

  try {
    const url = new URL(value);
    if (url.hostname !== "t.me" && url.hostname !== "telegram.me") return WIZARD_BOT_URL;
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
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
