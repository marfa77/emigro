export type BotApp = "assist" | "property" | "news" | "city";

export type AssistPlanTier = "partner-match" | "route-check" | "accompaniment";

export type BotUserCtx = {
  userId: number;
  chatId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export type BotSession = {
  telegramUserId: number;
  app: BotApp;
  step: string;
  payload: Record<string, unknown>;
  expiresAt: string;
};

export type BotIncoming =
  | { kind: "message"; text: string }
  | { kind: "callback"; id: string; data: string };

export type BotDeepLink =
  | { app: "home" }
  | { app: "news"; topicKey?: string }
  | { app: "assist"; country?: string; tier?: AssistPlanTier }
  | { app: "property"; dest?: "uae" | "thailand" }
  | { app: "city"; countryKey?: string }
  | { app: "wizard"; mode: "hub" | "corridor"; sessionId: string };

export type TelegramMessage = {
  message_id?: number;
  text?: string;
  chat?: { id?: number | string; type?: string };
  from?: { id?: number | string; username?: string; first_name?: string; last_name?: string };
};

export type TelegramUpdate = {
  update_id?: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: {
    id: string;
    data?: string;
    from?: { id?: number | string; username?: string; first_name?: string };
    message?: TelegramMessage;
  };
};
