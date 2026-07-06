import { sendOwnerTelegramDm } from "../../telegram";
import { getCommunityTipTopic } from "./community-topics";
import type { YoutubeShortResult } from "./types";

export type YoutubeShortNotifyStatus = "success" | "error" | "skipped";

function notifyEnabled(): boolean {
  return process.env.EMIGRO_YOUTUBE_SHORTS_NOTIFY !== "0";
}

function truncate(text: string, max = 3200): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

async function topicLine(topicId?: string): Promise<string | null> {
  if (!topicId) return null;
  const topic = await getCommunityTipTopic(topicId);
  if (topic) {
    return `Тема: ${topic.id} — ${topic.title}`;
  }
  return `Тема: ${topicId}`;
}

async function formatSuccess(result: YoutubeShortResult): Promise<string> {
  const lines = [
    "✅ YouTube Short готов",
    "",
    await topicLine(result.topicId),
    `Заголовок: ${result.metadata.title}`,
    `Длительность: ${Math.round(result.report.video_duration_seconds)} сек`,
  ].filter(Boolean) as string[];

  if (result.gcsUri) lines.push(`GCS: ${result.gcsUri}/short.mp4`);
  if (result.youtube?.shortsUrl) lines.push(`YouTube: ${result.youtube.shortsUrl}`);
  else lines.push("YouTube: ручная загрузка (auto-upload выключен)");

  return lines.join("\n");
}

async function formatError(error: string, topicId?: string): Promise<string> {
  const lines = ["❌ YouTube Short — ошибка", "", await topicLine(topicId), `Ошибка: ${truncate(error)}`].filter(
    Boolean
  ) as string[];
  return lines.join("\n");
}

async function formatSkipped(reason: string, topicId?: string): Promise<string> {
  const lines = ["⏭ YouTube Short — пропуск", "", await topicLine(topicId), truncate(reason)].filter(Boolean) as string[];
  return lines.join("\n");
}

export function isYoutubeShortSkipMessage(message: string): boolean {
  return (
    message.includes("Daily short already generated") ||
    message.includes("Already generated today") ||
    message.includes("Topic already published") ||
    message.includes("community note topics are published") ||
    message.includes("tip topics are published") ||
    message.includes("already running")
  );
}

export async function notifyYoutubeShortOwner(payload: {
  status: YoutubeShortNotifyStatus;
  topicId?: string;
  error?: string;
  result?: YoutubeShortResult;
}): Promise<void> {
  if (!notifyEnabled()) return;

  let text: string;
  if (payload.status === "success" && payload.result) {
    text = await formatSuccess(payload.result);
  } else if (payload.status === "skipped") {
    text = await formatSkipped(payload.error ?? "Пропущено", payload.topicId);
  } else {
    text = await formatError(payload.error ?? "Unknown error", payload.topicId);
  }

  const sent = await sendOwnerTelegramDm(text);
  if (!sent.success) {
    console.warn(`[youtube-short] Telegram notify failed: ${sent.error ?? "unknown"}`);
  }
}
