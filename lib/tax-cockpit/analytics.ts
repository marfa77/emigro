import { createAdminClient } from "@/lib/admin/supabase";

const MS_PER_DAY = 86_400_000;
const RETURN_WINDOW_MS = 7 * MS_PER_DAY;

export type TaxEventName =
  | "tax_open"
  | "ticket_add"
  | "residency_report"
  | "counsel_ask"
  | "country_focus";

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
