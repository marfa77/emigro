import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServerClient } from "@/lib/supabase/server";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { SPAIN_SATELLITE } from "@/lib/satellite/spain";
import { ITALY_SATELLITE } from "@/lib/satellite/italy";

/** All third-party relocant channels — PT+ES+IT. Writing only Portugal used to wipe Italy/Spain cursors. */
const CHANNELS = [
  ...PORTUGAL_SATELLITE.sourceChannels,
  ...SPAIN_SATELLITE.sourceChannels,
  ...ITALY_SATELLITE.sourceChannels,
] as const;

const STATE_FILE = resolve(process.cwd(), "parser/state.json");

function loadLocalState(): Record<string, { last_id: number }> {
  if (!existsSync(STATE_FILE)) return {};
  try {
    const raw = JSON.parse(readFileSync(STATE_FILE, "utf-8")) as Record<string, { last_id?: number }>;
    const out: Record<string, { last_id: number }> = {};
    for (const [k, v] of Object.entries(raw || {})) {
      out[k] = { last_id: Number(v?.last_id) || 0 };
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Align Telethon cursor with max ingested message_id.
 * Never decrease a channel cursor: empty Supabase rows used to reset Italy/Spain to 0
 * every daily run, so Telethon re-scanned cold-start forever.
 */
export async function syncParserStateFromSupabase(): Promise<Record<string, { last_id: number }>> {
  const supabase = createServerClient();
  const local = loadLocalState();
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
    const fromDb = data ? Number(data.message_id) : 0;
    const fromLocal = local[channel]?.last_id ?? 0;
    state[channel] = { last_id: Math.max(fromDb, fromLocal) };
  }

  writeFileSync(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
  return state;
}
