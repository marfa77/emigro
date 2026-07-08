import path from "path";

/** Fixed OpenAI TTS voice for all Emigro Shorts — no rotation. */
export const RU_TTS_VOICE = "onyx" as const;
export const RU_TTS_SPEED = 1.06;

export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;
/** Target band: 30–45 seconds (evergreen tips, not news). */
export const SHORT_DURATION_TARGET_MIN = 30;
export const SHORT_DURATION_TARGET_MAX = 45;
/** Pre-render estimate buffer (TTS can differ slightly from estimate). */
export const SHORT_DURATION_MIN = 28;
export const SHORT_DURATION_MAX = 48;
/** Script QA target + hard pre-TTS estimate cap (leave headroom to SHORT_DURATION_MAX). */
export const SHORT_DURATION_ESTIMATE_TARGET = 42;
export const SHORT_DURATION_ESTIMATE_MAX = 44;
/** Empirical RU TTS rate at RU_TTS_SPEED (OpenAI reads slower than English; numbers/pauses add time). */
export const SHORT_WORDS_PER_SECOND = 1.72;
/** Gemini script QA attempts (too short / too long retries). */
export const SCRIPT_QA_MAX_ATTEMPTS = 4;

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@Emigro_news";
export const YOUTUBE_CHANNEL_HANDLE = "@Emigro_news";

export function isYoutubeShortsEnabled(): boolean {
  return process.env.EMIGRO_YOUTUBE_SHORTS_ENABLED !== "0";
}

export function isYoutubeUploadEnabled(): boolean {
  if (process.env.EMIGRO_YOUTUBE_UPLOAD_ENABLED === "0") return false;
  if (process.env.EMIGRO_YOUTUBE_UPLOAD_ENABLED === "1") return true;
  const hasRefresh =
    Boolean(process.env.EMIGRO_YOUTUBE_REFRESH_TOKEN?.trim()) ||
    Boolean(process.env.YOUTUBE_REFRESH_TOKEN?.trim());
  const hasClient =
    Boolean(process.env.EMIGRO_YOUTUBE_CLIENT_ID?.trim() || process.env.YOUTUBE_CLIENT_ID?.trim()) &&
    Boolean(
      process.env.EMIGRO_YOUTUBE_CLIENT_SECRET?.trim() || process.env.YOUTUBE_CLIENT_SECRET?.trim()
    );
  return hasRefresh && hasClient;
}

export type YoutubeUploadPrivacy = "public" | "unlisted" | "private";

export function youtubeUploadPrivacy(): YoutubeUploadPrivacy {
  const raw = process.env.EMIGRO_YOUTUBE_UPLOAD_PRIVACY?.trim().toLowerCase();
  if (raw === "private" || raw === "unlisted" || raw === "public") return raw;
  return "public";
}

/** Dynamic B-roll + Ken Burns + kinetic captions (default on). Set EMIGRO_YOUTUBE_SHORTS_DYNAMIC=0 for legacy static slides. */
export function isDynamicVideoEnabled(): boolean {
  return process.env.EMIGRO_YOUTUBE_SHORTS_DYNAMIC !== "0";
}

export function youtubeShortsBucket(): string {
  return (
    process.env.EMIGRO_YOUTUBE_SHORTS_BUCKET?.trim() ||
    process.env.YOUTUBE_ARTIFACTS_GCS_BUCKET?.trim() ||
    "gs://prep2go/prep2go-podcast"
  );
}

export function youtubeShortsGcsPrefix(): string {
  return process.env.EMIGRO_YOUTUBE_SHORTS_GCS_PREFIX?.trim() || "emigro-shorts";
}

export function youtubeShortsOutputRoot(): string {
  return (
    process.env.EMIGRO_YOUTUBE_SHORTS_OUTPUT_ROOT?.trim() ||
    path.join(process.cwd(), "scripts", "output", "emigro-youtube-shorts")
  );
}

export function canRunYoutubeShortsLocally(): boolean {
  if (process.env.VERCEL === "1") return false;
  try {
    const { execFileSync } = require("child_process") as typeof import("child_process");
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    execFileSync("ffprobe", ["-version"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function ensureEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
}
