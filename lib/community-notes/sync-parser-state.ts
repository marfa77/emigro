import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServerClient } from "@/lib/supabase/server";

const CHANNELS = ["chatlisboa", "por_tugal"] as const;
const STATE_FILE = resolve(process.cwd(), "parser/state.json");

/** Align Telethon cursor with max ingested message_id (for CI/cron without local state.json). */
export async function syncParserStateFromSupabase(): Promise<Record<string, { last_id: number }>> {
  const supabase = createServerClient();
  const state: Record<string, { last_id: number }> = {};

  for (const channel of CHANNELS) {
    const { data, error } = await supabase
      .from("community_signals")
      .select("message_id")
      .eq("channel_username", channel)
      .order("message_id", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    state[channel] = { last_id: data ? Number(data.message_id) : 0 };
  }

  writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
  return state;
}
