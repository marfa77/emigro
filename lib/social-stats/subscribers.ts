import { getYoutubeAccessToken } from "@/lib/news/youtube-short/youtube-api";

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";

export type SocialChannelTarget = {
  platform: "threads" | "youtube" | "facebook_group" | "telegram";
  handle: string;
  url: string;
  label: string;
};

export type SubscriberSnapshot = {
  platform: SocialChannelTarget["platform"];
  handle: string;
  label: string;
  url: string;
  count: number | null;
  error?: string;
};

export const DEFAULT_SOCIAL_CHANNELS: SocialChannelTarget[] = [
  {
    platform: "threads",
    handle: "pveselov23",
    url: "https://www.threads.com/@pveselov23",
    label: "Threads @pveselov23",
  },
  {
    platform: "telegram",
    handle: "Emigro_news",
    url: "https://t.me/Emigro_news",
    label: "Telegram @Emigro_news",
  },
  {
    platform: "youtube",
    handle: "Emigro_news",
    url: "https://www.youtube.com/@Emigro_news",
    label: "YouTube @Emigro_news",
  },
  {
    platform: "youtube",
    handle: "Prep2goNews",
    url: "https://www.youtube.com/@Prep2goNews",
    label: "YouTube @Prep2goNews",
  },
  {
    platform: "facebook_group",
    handle: "910262315378056",
    url: "https://www.facebook.com/groups/910262315378056",
    label: "Facebook · European Citizenship & Immigration News",
  },
];

function parseCount(raw: string): number | null {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return null;
  const value = Number.parseInt(digits, 10);
  return Number.isFinite(value) ? value : null;
}

export async function fetchThreadsFollowers(handle: string): Promise<number> {
  const username = handle.replace(/^@/, "");
  const res = await fetch(`https://www.threads.com/@${encodeURIComponent(username)}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; EmigroBot/1.0; +https://www.emigro.online)",
      Accept: "text/html",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Threads HTTP ${res.status}`);
  }

  const html = await res.text();
  const meta =
    html.match(/property="og:description"\s+content="([^"]+)"/i)?.[1] ??
    html.match(/name="description"\s+content="([^"]+)"/i)?.[1];

  if (!meta) {
    throw new Error("Threads follower meta not found");
  }

  const decoded = meta
    .replace(/&#x2022;/g, "•")
    .replace(/&amp;/g, "&")
    .replace(/&#064;/g, "@");

  const match = decoded.match(/([\d,.]+)\s+Followers/i);
  const count = match ? parseCount(match[1]) : null;
  if (count == null) {
    throw new Error(`Threads follower count not parsed: ${decoded.slice(0, 120)}`);
  }

  return count;
}

function telegramChannelBotToken(): string | undefined {
  return (process.env.EMIGRO_NEWS_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN)?.trim();
}

function telegramChannelId(handle: string): string {
  const configured = process.env.EMIGRO_NEWS_TELEGRAM_CHANNEL?.trim();
  if (configured) return configured;
  const username = handle.replace(/^@/, "");
  return `@${username}`;
}

export async function fetchTelegramChannelSubscribers(handle: string): Promise<number> {
  const token = telegramChannelBotToken();
  if (!token) {
    throw new Error("EMIGRO_NEWS_BOT_TOKEN or TELEGRAM_BOT_TOKEN missing");
  }

  const chatId = telegramChannelId(handle);
  const res = await fetch(`https://api.telegram.org/bot${token}/getChatMemberCount`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId }),
    next: { revalidate: 0 },
  });

  const json = (await res.json()) as {
    ok?: boolean;
    result?: number;
    description?: string;
  };

  if (!res.ok || json.ok === false || json.result == null) {
    throw new Error(json.description || `Telegram HTTP ${res.status}`);
  }

  return json.result;
}

export async function fetchFacebookGroupMembers(groupId: string): Promise<number> {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    throw new Error("FACEBOOK_ACCESS_TOKEN missing");
  }

  const version = process.env.FACEBOOK_GRAPH_VERSION?.trim() || "v21.0";
  const params = new URLSearchParams({
    fields: "member_count",
    access_token: accessToken,
  });

  const res = await fetch(
    `https://graph.facebook.com/${version}/${encodeURIComponent(groupId)}?${params}`,
    { next: { revalidate: 0 } }
  );

  const json = (await res.json()) as {
    member_count?: number;
    error?: { message?: string };
  };

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || `Facebook HTTP ${res.status}`);
  }

  const count = json.member_count;
  if (count == null || !Number.isFinite(count)) {
    throw new Error("Facebook member_count missing");
  }

  return count;
}

async function fetchYoutubeSubscribersWithOAuth(handle: string): Promise<number> {
  const accessToken = await getYoutubeAccessToken();
  const forHandle = handle.replace(/^@/, "");
  const params = new URLSearchParams({
    part: "statistics",
    forHandle,
  });

  const res = await fetch(`${YOUTUBE_API}/channels?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    next: { revalidate: 0 },
  });

  const json = (await res.json()) as {
    items?: Array<{ statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean } }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(json.error?.message || `YouTube HTTP ${res.status}`);
  }

  const stats = json.items?.[0]?.statistics;
  if (!stats) {
    throw new Error(`YouTube channel @${forHandle} not found`);
  }
  if (stats.hiddenSubscriberCount) {
    throw new Error("YouTube subscriber count is hidden");
  }

  const count = stats.subscriberCount ? parseCount(stats.subscriberCount) : null;
  if (count == null) {
    throw new Error("YouTube subscriber count missing");
  }

  return count;
}

async function fetchYoutubeSubscribersWithApiKey(handle: string): Promise<number> {
  const apiKey =
    process.env.YOUTUBE_API_KEY?.trim() ||
    process.env.EMIGRO_YOUTUBE_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("YouTube API key or OAuth credentials missing");
  }

  const forHandle = handle.replace(/^@/, "");
  const params = new URLSearchParams({
    part: "statistics",
    forHandle,
    key: apiKey,
  });

  const res = await fetch(`${YOUTUBE_API}/channels?${params}`, { next: { revalidate: 0 } });
  const json = (await res.json()) as {
    items?: Array<{ statistics?: { subscriberCount?: string; hiddenSubscriberCount?: boolean } }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(json.error?.message || `YouTube HTTP ${res.status}`);
  }

  const stats = json.items?.[0]?.statistics;
  if (!stats) {
    throw new Error(`YouTube channel @${forHandle} not found`);
  }
  if (stats.hiddenSubscriberCount) {
    throw new Error("YouTube subscriber count is hidden");
  }

  const count = stats.subscriberCount ? parseCount(stats.subscriberCount) : null;
  if (count == null) {
    throw new Error("YouTube subscriber count missing");
  }

  return count;
}

export async function fetchYoutubeSubscribers(handle: string): Promise<number> {
  let oauthError: Error | null = null;
  try {
    return await fetchYoutubeSubscribersWithOAuth(handle);
  } catch (e) {
    oauthError = e instanceof Error ? e : new Error(String(e));
  }

  try {
    return await fetchYoutubeSubscribersWithApiKey(handle);
  } catch (apiError) {
    const apiMessage = apiError instanceof Error ? apiError.message : String(apiError);
    if (oauthError) {
      throw new Error(`${apiMessage} (OAuth also unavailable: ${oauthError.message})`);
    }
    throw apiError instanceof Error ? apiError : new Error(String(apiError));
  }
}

export async function fetchSubscriberSnapshot(channel: SocialChannelTarget): Promise<SubscriberSnapshot> {
  try {
    let count: number;
    if (channel.platform === "threads") {
      count = await fetchThreadsFollowers(channel.handle);
    } else if (channel.platform === "telegram") {
      count = await fetchTelegramChannelSubscribers(channel.handle);
    } else if (channel.platform === "facebook_group") {
      count = await fetchFacebookGroupMembers(channel.handle);
    } else {
      count = await fetchYoutubeSubscribers(channel.handle);
    }

    return {
      platform: channel.platform,
      handle: channel.handle,
      label: channel.label,
      url: channel.url,
      count,
    };
  } catch (e) {
    return {
      platform: channel.platform,
      handle: channel.handle,
      label: channel.label,
      url: channel.url,
      count: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function fetchAllSubscriberSnapshots(
  channels: SocialChannelTarget[] = DEFAULT_SOCIAL_CHANNELS
): Promise<SubscriberSnapshot[]> {
  return Promise.all(channels.map((channel) => fetchSubscriberSnapshot(channel)));
}
