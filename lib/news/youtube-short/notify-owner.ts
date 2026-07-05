import { sendOwnerTelegramDm } from "../../telegram";
import { getTipTopic } from "./topics";
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

function topicLine(topicId?: string): string | null {
  if (!topicId) return null;
  const topic = getTipTopic(topicId);
  if (topic) {
    return `Тема: ${topic.id} — ${topic.title}`;
  }
  return `Тема: ${topicId}`;
}

function formatSuccess(result: YoutubeShortResult): string {
  const lines = [
    "✅ YouTube Short готов",
    "",
    topicLine(result.topicId),
    `Заголовок: ${result.metadata.title}`,
    `Длительность: ${Math.round(result.report.video_duration_seconds)} сек`,
  ].filter(Boolean) as string[];

  if (result.gcsUri) lines.push(`GCS: ${result.gcsUri}/short.mp4`);
  if (result.youtube?.shortsUrl) lines.push(`YouTube: ${result.youtube.shortsUrl}`);
  else lines.push("YouTube: ручная загрузка (auto-upload выключен)");

  return lines.join("\n");
}

function formatError(error: string, topicId?: string): string {
  const lines = ["❌ YouTube Short — ошибка", "", topicLine(topicId), `Ошибка: ${truncate(error)}`].filter(
    Boolean
  ) as string[];
  return lines.join("\n");
}

function formatSkipped(reason: string, topicId?: string): string {
  const lines = ["⏭ YouTube Short — пропуск", "", topicLine(topicId), truncate(reason)].filter(Boolean) as string[];
  return lines.join("\n");
}

export function isYoutubeShortSkipMessage(message: string): boolean {
  return (
    message.includes("Daily short already generated") ||
    message.includes("Already generated today") ||
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
    text = formatSuccess(payload.result);
  } else if (payload.status === "skipped") {
    text = formatSkipped(payload.error ?? "Пропущено", payload.topicId);
  } else {
    text = formatError(payload.error ?? "Unknown error", payload.topicId);
  }

  const sent = await sendOwnerTelegramDm(text);
  if (!sent.success) {
    console.warn(`[youtube-short] Telegram notify failed: ${sent.error ?? "unknown"}`);
  }
}
