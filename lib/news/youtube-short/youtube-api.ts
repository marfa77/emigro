import fs from "fs";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
const YOUTUBE_UPLOAD = "https://www.googleapis.com/upload/youtube/v3";

export type YoutubePrivacyStatus = "public" | "unlisted" | "private";

export type YoutubeCredentials = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

export type YoutubeVideoInsertResponse = {
  id: string;
  snippet?: {
    title?: string;
    channelId?: string;
  };
  status?: {
    privacyStatus?: string;
    uploadStatus?: string;
  };
};

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

export function getYoutubeCredentials(): YoutubeCredentials | null {
  const clientId =
    process.env.EMIGRO_YOUTUBE_CLIENT_ID?.trim() || process.env.YOUTUBE_CLIENT_ID?.trim();
  const clientSecret =
    process.env.EMIGRO_YOUTUBE_CLIENT_SECRET?.trim() ||
    process.env.YOUTUBE_CLIENT_SECRET?.trim();
  const refreshToken =
    process.env.EMIGRO_YOUTUBE_REFRESH_TOKEN?.trim() ||
    process.env.YOUTUBE_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) return null;
  return { clientId, clientSecret, refreshToken };
}

export async function getYoutubeAccessToken(credentials = getYoutubeCredentials()): Promise<string> {
  if (!credentials) {
    throw new Error(
      "YouTube OAuth credentials missing (EMIGRO_YOUTUBE_CLIENT_ID, EMIGRO_YOUTUBE_CLIENT_SECRET, EMIGRO_YOUTUBE_REFRESH_TOKEN)"
    );
  }

  const now = Date.now();
  if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60_000) {
    return cachedAccessToken.token;
  }

  const body = new URLSearchParams({
    client_id: credentials.clientId,
    client_secret: credentials.clientSecret,
    refresh_token: credentials.refreshToken,
    grant_type: "refresh_token",
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  const json = (await res.json()) as { access_token?: string; expires_in?: number; error?: string; error_description?: string };
  if (!res.ok || !json.access_token) {
    throw new Error(
      `YouTube token refresh failed (${res.status}): ${json.error_description || json.error || res.statusText}`
    );
  }

  cachedAccessToken = {
    token: json.access_token,
    expiresAt: now + (json.expires_in ?? 3600) * 1000,
  };
  return json.access_token;
}

function buildMultipartBody(metadata: object, media: Buffer, boundary: string): Buffer {
  const metaPart = Buffer.from(
    `--${boundary}\r\n` +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      `${JSON.stringify(metadata)}\r\n`
  );
  const mediaHeader = Buffer.from(`--${boundary}\r\nContent-Type: video/mp4\r\n\r\n`);
  const mediaFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
  return Buffer.concat([metaPart, mediaHeader, media, mediaFooter]);
}

export function trimYoutubeTags(tags: string[]): string[] {
  const result: string[] = [];
  let totalChars = 0;
  for (const raw of tags) {
    const tag = raw.trim().slice(0, 30);
    if (!tag) continue;
    if (totalChars + tag.length > 500) break;
    result.push(tag);
    totalChars += tag.length;
  }
  return result;
}

export async function uploadYoutubeVideo(opts: {
  videoPath: string;
  title: string;
  description: string;
  tags: string[];
  privacyStatus: YoutubePrivacyStatus;
  categoryId?: string;
}): Promise<YoutubeVideoInsertResponse> {
  const accessToken = await getYoutubeAccessToken();
  const videoBuffer = fs.readFileSync(opts.videoPath);
  const boundary = `emigro_${Date.now()}`;
  const metadata = {
    snippet: {
      title: opts.title.slice(0, 100),
      description: opts.description.slice(0, 5000),
      tags: trimYoutubeTags(opts.tags),
      categoryId: opts.categoryId ?? "19",
      defaultLanguage: "ru",
      defaultAudioLanguage: "ru",
    },
    status: {
      privacyStatus: opts.privacyStatus,
      selfDeclaredMadeForKids: false,
    },
  };

  const body = buildMultipartBody(metadata, videoBuffer, boundary);
  const res = await fetch(
    `${YOUTUBE_UPLOAD}/videos?uploadType=multipart&part=snippet,status`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": String(body.length),
      },
      body: new Uint8Array(body),
    }
  );

  const json = (await res.json()) as YoutubeVideoInsertResponse & {
    error?: { message?: string; errors?: Array<{ message?: string }> };
  };

  if (!res.ok || !json.id) {
    const detail =
      json.error?.message ||
      json.error?.errors?.map((e) => e.message).filter(Boolean).join("; ") ||
      res.statusText;
    throw new Error(`YouTube video upload failed (${res.status}): ${detail}`);
  }

  return json;
}

export async function setYoutubeThumbnail(videoId: string, thumbnailPath: string): Promise<void> {
  const accessToken = await getYoutubeAccessToken();
  const image = fs.readFileSync(thumbnailPath);
  const res = await fetch(`${YOUTUBE_UPLOAD}/thumbnails/set?videoId=${encodeURIComponent(videoId)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "image/png",
      "Content-Length": String(image.length),
    },
    body: new Uint8Array(image),
  });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(
      `YouTube thumbnail upload failed (${res.status}): ${json.error?.message || res.statusText}`
    );
  }
}

export async function uploadYoutubeCaptions(opts: {
  videoId: string;
  captionsPath: string;
  language?: string;
  name?: string;
}): Promise<void> {
  const accessToken = await getYoutubeAccessToken();
  const srt = fs.readFileSync(opts.captionsPath);
  const boundary = `emigro_cap_${Date.now()}`;
  const metadata = {
    snippet: {
      videoId: opts.videoId,
      language: opts.language ?? "ru",
      name: opts.name ?? "Russian",
      isDraft: false,
    },
  };

  const metaPart = Buffer.from(
    `--${boundary}\r\n` +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      `${JSON.stringify(metadata)}\r\n`
  );
  const mediaHeader = Buffer.from(`--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`);
  const mediaFooter = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([metaPart, mediaHeader, srt, mediaFooter]);

  const res = await fetch(`${YOUTUBE_UPLOAD}/captions?part=snippet&uploadType=multipart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
      "Content-Length": String(body.length),
    },
    body: new Uint8Array(body),
  });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(
      `YouTube captions upload failed (${res.status}): ${json.error?.message || res.statusText}`
    );
  }
}

export async function addVideoToPlaylist(videoId: string, playlistId: string): Promise<void> {
  const accessToken = await getYoutubeAccessToken();
  const res = await fetch(`${YOUTUBE_API}/playlistItems?part=snippet`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      snippet: {
        playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId,
        },
      },
    }),
  });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    throw new Error(
      `YouTube playlist insert failed (${res.status}): ${json.error?.message || res.statusText}`
    );
  }
}

export async function findPlaylistIdByTitle(title: string): Promise<string | null> {
  const accessToken = await getYoutubeAccessToken();
  const params = new URLSearchParams({
    part: "snippet",
    mine: "true",
    maxResults: "50",
  });

  const res = await fetch(`${YOUTUBE_API}/playlists?${params}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const json = (await res.json()) as {
    items?: Array<{ id?: string; snippet?: { title?: string } }>;
    error?: { message?: string };
  };

  if (!res.ok) {
    throw new Error(`YouTube playlists.list failed (${res.status}): ${json.error?.message || res.statusText}`);
  }

  const match = json.items?.find((item) => item.snippet?.title?.trim() === title.trim());
  return match?.id ?? null;
}

export function youtubeVideoUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeShortsUrl(videoId: string): string {
  return `https://www.youtube.com/shorts/${videoId}`;
}
