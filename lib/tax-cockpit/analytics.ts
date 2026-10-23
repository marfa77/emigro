import { createAdminClient } from "@/lib/admin/supabase";
import {
  isAdminTelegramChat,
  sendStatsBotMessage,
  telegramAdminChatIds,
} from "@/lib/telegram/admin-bot";

const MS_PER_DAY = 86_400_000;
const RETURN_WINDOW_MS = 7 * MS_PER_DAY;

export type TaxEventName =
  | "tax_open"
  | "ticket_add"
  | "residency_report"
  | "counsel_ask"
  | "country_focus";

const EVENT_LABEL_RU: Record<TaxEventName, string> = {
  tax_open: "открыл Налоги",
  ticket_add: "добавил поездки",
  residency_report: "запросил отчёт",
  counsel_ask: "вопрос консультанту",
  country_focus: "фокус страны в counsel",
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Notify owner about other users' tax usage (free forever; owner sees demand). Skip self. */
async function notifyOwnerTaxUsage(
  telegramUserId: number,
  eventName: TaxEventName,
  payload: Record<string, unknown>
): Promise<void> {
  if (isAdminTelegramChat(null, telegramUserId)) return;
  const admins = telegramAdminChatIds();
  if (admins.size === 0) return;

  const year = typeof payload.year === "number" ? payload.year : null;
  const uname =
    typeof payload.username === "string" && payload.username
      ? `@${payload.username.replace(/^@/, "")}`
      : null;
  const name =
    typeof payload.firstName === "string" && payload.firstName
      ? escapeHtml(payload.firstName)
      : null;
  const preview =
    typeof payload.preview === "string" && payload.preview
      ? escapeHtml(payload.preview.slice(0, 280))
      : null;
  const who = [uname, name, `<code>${telegramUserId}</code>`].filter(Boolean).join(" · ");
  const lines = [
    `🧾 <b>Налоги · чужой</b> — ${escapeHtml(EVENT_LABEL_RU[eventName])}`,
    who,
    year != null ? `год <b>${year}</b>` : null,
    preview ? `<i>${preview}</i>` : null,
  ].filter(Boolean) as string[];

  for (const chatId of Array.from(admins)) {
    await sendStatsBotMessage(chatId, lines.join("\n"), {
      parseMode: "HTML",
      disableWebPagePreview: true,
    }).catch((e) =>
      console.warn("[tax-cockpit] owner notify failed:", e instanceof Error ? e.message : e)
    );
  }
}

export async function emitBotEvent(
  telegramUserId: number,
  eventName: TaxEventName,
  payload: Record<string, unknown> = {}
): Promise<void> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("emigro_bot_events").insert({
      telegram_user_id: telegramUserId,
      event_name: eventName,
      payload,
    });
    if (error) {
      console.warn("[tax-cockpit] emitBotEvent failed:", error.message);
    }
  } catch (e) {
    console.warn(
      "[tax-cockpit] emitBotEvent failed:",
      e instanceof Error ? e.message : e
    );
  }
  // Fire-and-forget DM; do not block user UX on notify failure.
  void notifyOwnerTaxUsage(telegramUserId, eventName, payload);
}

export type TaxFunnel7d = {
  taxOpen: number;
  ticketAdd: number;
  residencyReport: number;
  counselAsk: number;
  distinctOpenUsers: number;
  returnWithin7dUsers: number;
};

const TAX_FUNNEL_EVENTS: TaxEventName[] = [
  "tax_open",
  "ticket_add",
  "residency_report",
  "counsel_ask",
];

/** Global bot tax funnel for owner /stats; null if table missing or query fails. */
export async function summarizeTaxFunnel7d(): Promise<TaxFunnel7d | null> {
  try {
    const supabase = createAdminClient();
    const since7d = new Date(Date.now() - 7 * MS_PER_DAY).toISOString();
    const since14d = new Date(Date.now() - 14 * MS_PER_DAY).toISOString();

    const { data: recent, error } = await supabase
      .from("emigro_bot_events")
      .select("telegram_user_id, event_name, created_at")
      .gte("created_at", since7d)
      .in("event_name", TAX_FUNNEL_EVENTS);

    if (error) {
      console.warn("[tax-cockpit] summarizeTaxFunnel7d failed:", error.message);
      return null;
    }

    const counts = { taxOpen: 0, ticketAdd: 0, residencyReport: 0, counselAsk: 0 };
    const openUsers = new Set<number>();
    for (const row of recent ?? []) {
      const uid = Number(row.telegram_user_id);
      const name = row.event_name as TaxEventName;
      if (name === "tax_open") {
        counts.taxOpen++;
        if (Number.isFinite(uid)) openUsers.add(uid);
      } else if (name === "ticket_add") counts.ticketAdd++;
      else if (name === "residency_report") counts.residencyReport++;
      else if (name === "counsel_ask") counts.counselAsk++;
    }

    const { data: opens14d, error: opensErr } = await supabase
      .from("emigro_bot_events")
      .select("telegram_user_id, created_at")
      .eq("event_name", "tax_open")
      .gte("created_at", since14d)
      .order("created_at", { ascending: true });

    if (opensErr) {
      console.warn("[tax-cockpit] summarizeTaxFunnel7d opens failed:", opensErr.message);
      return { ...counts, distinctOpenUsers: openUsers.size, returnWithin7dUsers: 0 };
    }

    const byUser = new Map<number, number[]>();
    const window7dStart = Date.now() - 7 * MS_PER_DAY;
    for (const row of opens14d ?? []) {
      const uid = Number(row.telegram_user_id);
      if (!Number.isFinite(uid)) continue;
      const t = new Date(row.created_at as string).getTime();
      const list = byUser.get(uid) ?? [];
      list.push(t);
      byUser.set(uid, list);
    }

    let returnWithin7dUsers = 0;
    for (const times of Array.from(byUser.values())) {
      times.sort((a, b) => a - b);
      let returned = false;
      for (let i = 1; i < times.length; i++) {
        if (times[i] - times[i - 1] <= RETURN_WINDOW_MS && times[i] >= window7dStart) {
          returned = true;
          break;
        }
      }
      if (returned) returnWithin7dUsers++;
    }

    return {
      ...counts,
      distinctOpenUsers: openUsers.size,
      returnWithin7dUsers,
    };
  } catch (e) {
    console.warn(
      "[tax-cockpit] summarizeTaxFunnel7d failed:",
      e instanceof Error ? e.message : e
    );
    return null;
  }
}

/** True if the user has two `tax_open` events within 7 days (any pair). */
export async function hasReturnWithin7d(telegramUserId: number): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("emigro_bot_events")
      .select("created_at")
      .eq("telegram_user_id", telegramUserId)
      .eq("event_name", "tax_open")
      .order("created_at", { ascending: true })
      .limit(200);

    if (error || !data || data.length < 2) return false;

    const times = data.map((row) => new Date(row.created_at as string).getTime());
    for (let i = 1; i < times.length; i++) {
      if (times[i] - times[i - 1] <= RETURN_WINDOW_MS) return true;
    }
    return false;
  } catch (e) {
    console.warn(
      "[tax-cockpit] hasReturnWithin7d failed:",
      e instanceof Error ? e.message : e
    );
    return false;
  }
}
