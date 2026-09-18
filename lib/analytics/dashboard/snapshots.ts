import { createAdminClient } from "@/lib/admin/supabase";
import {
  fetchSubscriberSnapshot,
  type SocialChannelTarget,
  type SubscriberSnapshot,
} from "@/lib/social-stats/subscribers";
import {
  SATELLITE_CITY_CHATS,
  cityChatTelegramId,
} from "@/lib/satellite/city-chats";
import { statsBotToken } from "@/lib/telegram/admin-bot";
import {
  followersFromInsightsPayload,
} from "@/lib/analytics/threads-stats";
import { THREADS_GRAPH_BASE } from "@/lib/threads/config";

export type MetricSnapshot = {
  metricKey: string;
  metricGroup: "social" | "city_chat";
  label: string;
  value: number | null;
  status: "ok" | "unavailable" | "error";
  error?: string;
  snapshotDate: string;
  capturedAt: string;
  metadata: Record<string, unknown>;
};

const EMIGRO_SOCIAL_CHANNELS: SocialChannelTarget[] = [
  {
    platform: "threads",
    handle: "emigro_assist",
    label: "Threads @emigro_assist",
    url: "https://www.threads.com/@emigro_assist",
  },
  {
    platform: "threads",
    handle: "emigro_invest",
    label: "Threads @emigro_invest",
    url: "https://www.threads.com/@emigro_invest",
  },
  {
    platform: "telegram",
    handle: "Emigro_news",
    label: "Telegram @Emigro_news",
    url: "https://t.me/Emigro_news",
  },
];

async function fetchCityChatMemberCount(chatId: string): Promise<number> {
  const token = statsBotToken();
  if (!token) throw new Error("Telegram bot token missing");
  const response = await fetch(`https://api.telegram.org/bot${token}/getChatMemberCount`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId }),
    cache: "no-store",
  });
  const payload = (await response.json()) as {
    ok?: boolean;
    result?: number;
    description?: string;
  };
  if (!response.ok || payload.ok === false || payload.result == null) {
    throw new Error(payload.description || `Telegram HTTP ${response.status}`);
  }
  return payload.result;
}

function socialMetric(snapshot: SubscriberSnapshot): Omit<MetricSnapshot, "snapshotDate" | "capturedAt"> {
  return {
    metricKey: `${snapshot.platform}:${snapshot.handle.toLowerCase()}:members`,
    metricGroup: "social",
    label: snapshot.label,
    value: snapshot.count,
    status: snapshot.count == null ? "unavailable" : "ok",
    error: snapshot.error,
    metadata: {
      platform: snapshot.platform,
      handle: snapshot.handle,
      url: snapshot.url,
    },
  };
}

async function fetchSocialSnapshot(channel: SocialChannelTarget): Promise<SubscriberSnapshot> {
  if (channel.platform !== "threads" || channel.handle !== "emigro_invest") {
    return fetchSubscriberSnapshot(channel);
  }
  const token = process.env.THREADS_INVESTMENT_ACCESS_TOKEN?.trim();
  if (!token) return fetchSubscriberSnapshot(channel);
  try {
    const url = new URL(`${THREADS_GRAPH_BASE}/me/threads_insights`);
    url.searchParams.set("metric", "followers_count");
    url.searchParams.set("access_token", token);
    const response = await fetch(url, { cache: "no-store" });
    const payload: unknown = await response.json();
    const count = response.ok ? followersFromInsightsPayload(payload) : null;
    if (count == null) throw new Error(`Threads Graph HTTP ${response.status}`);
    return { ...channel, count };
  } catch (error) {
    return {
      ...channel,
      count: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function collectCurrentMetricSnapshots(): Promise<
  Array<Omit<MetricSnapshot, "snapshotDate" | "capturedAt">>
> {
  const [social, cityChats] = await Promise.all([
    Promise.all(EMIGRO_SOCIAL_CHANNELS.map(fetchSocialSnapshot)),
    Promise.all(
      SATELLITE_CITY_CHATS.map(async (chat) => {
        const chatId = cityChatTelegramId(chat);
        if (!chatId) {
          return {
            metricKey: `telegram:city:${chat.countryKey}:members`,
            metricGroup: "city_chat" as const,
            label: `Telegram · ${chat.chatTitleRu}`,
            value: null,
            status: "unavailable" as const,
            error: `${chat.envChatId} missing`,
            metadata: { countryKey: chat.countryKey, city: chat.city },
          };
        }
        try {
          const value = await fetchCityChatMemberCount(chatId);
          return {
            metricKey: `telegram:city:${chat.countryKey}:members`,
            metricGroup: "city_chat" as const,
            label: `Telegram · ${chat.chatTitleRu}`,
            value,
            status: "ok" as const,
            metadata: { countryKey: chat.countryKey, city: chat.city },
          };
        } catch (error) {
          return {
            metricKey: `telegram:city:${chat.countryKey}:members`,
            metricGroup: "city_chat" as const,
            label: `Telegram · ${chat.chatTitleRu}`,
            value: null,
            status: "error" as const,
            error: error instanceof Error ? error.message : String(error),
            metadata: { countryKey: chat.countryKey, city: chat.city },
          };
        }
      })
    ),
  ]);

  return [...social.map(socialMetric), ...cityChats];
}

export async function captureDailyMetricSnapshots(): Promise<{
  captured: number;
  available: number;
}> {
  const snapshots = await collectCurrentMetricSnapshots();
  const supabase = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const rows = snapshots.map((snapshot) => ({
    metric_key: snapshot.metricKey,
    metric_group: snapshot.metricGroup,
    label: snapshot.label,
    value: snapshot.value,
    status: snapshot.status,
    error: snapshot.error ?? null,
    metadata: snapshot.metadata,
    snapshot_date: today,
    captured_at: new Date().toISOString(),
  }));
  const { error } = await supabase
    .from("emigro_metric_snapshots")
    .upsert(rows, { onConflict: "metric_key,snapshot_date" });
  if (error) throw new Error(error.message);
  return {
    captured: rows.length,
    available: rows.filter((row) => row.value != null).length,
  };
}

export async function loadMetricSnapshotHistory(days = 30): Promise<MetricSnapshot[]> {
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - Math.max(days - 1, 0));
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("emigro_metric_snapshots")
    .select("metric_key, metric_group, label, value, status, error, metadata, snapshot_date, captured_at")
    .gte("snapshot_date", start.toISOString().slice(0, 10))
    .order("snapshot_date", { ascending: true });
  if (error) {
    if (/emigro_metric_snapshots|relation .* does not exist/i.test(error.message)) return [];
    throw new Error(error.message);
  }
  return (data ?? []).map((row) => ({
    metricKey: row.metric_key,
    metricGroup: row.metric_group as MetricSnapshot["metricGroup"],
    label: row.label,
    value: row.value == null ? null : Number(row.value),
    status: row.status as MetricSnapshot["status"],
    error: row.error ?? undefined,
    metadata: (row.metadata ?? {}) as Record<string, unknown>,
    snapshotDate: row.snapshot_date,
    capturedAt: row.captured_at,
  }));
}
