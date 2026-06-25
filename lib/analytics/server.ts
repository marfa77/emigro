import { createServerClient } from "@/lib/supabase/server";
import type { EmigroEventName, EmigroEventProps } from "./events";
import { sanitizeEventProps } from "./events";

export async function trackServerEvent(
  event: EmigroEventName,
  props: EmigroEventProps = {},
  source: "api" | "cron" | "web" = "api"
): Promise<void> {
  const properties = sanitizeEventProps(props);
  console.info(`[event:${source}] ${event}`, properties);

  try {
    const supabase = createServerClient();
    await supabase.from("emigro_events").insert({
      event_name: event,
      source,
      properties,
    });
  } catch (e) {
    console.warn("[event] DB insert failed:", e instanceof Error ? e.message : e);
  }
}
