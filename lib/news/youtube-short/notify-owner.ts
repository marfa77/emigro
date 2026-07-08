import { sendOwnerTelegramDm } from "../../telegram";
import { getCommunityTipTopic } from "./community-topics";
import type { YoutubeShortResult } from "./types";

export type YoutubeShortNotifyStatus = "success" | "error" | "skipped";

export type YoutubeShortPipelineStage = "start" | "topic" | "script" | "render" | "youtube" | "gcs" | "error";

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
    message.includes("already running") ||
    message.includes("pipeline already running")
  );
}

function stageLabel(stage: YoutubeShortPipelineStage): string {
  switch (stage) {
    case "start":
      return "🎬 YouTube Short — старт";
    case "topic":
      return "📌 Тема выбрана";
    case "script":
      return "📝 Сценарий готов";
    case "render":
      return "🎥 Видео отрендерено";
    case "youtube":
      return "📺 YouTube загрузка";
    case "gcs":
      return "☁️ GCS загрузка";
    case "error":
      return "❌ Ошибка пайплайна";
  }
}

export async function notifyYoutubeShortPipelineStage(payload: {
  stage: YoutubeShortPipelineStage;
  topicId?: string;
  topicTitle?: string;
  detail?: string;
}): Promise<void> {
  if (!notifyEnabled()) return;

  const lines = [stageLabel(payload.stage)];
  const topicLineText = payload.topicTitle
    ? `Тема: ${payload.topicId ?? "?"} — ${payload.topicTitle}`
    : payload.topicId
      ? `Тема: ${payload.topicId}`
      : null;
  if (topicLineText) lines.push(topicLineText);
  if (payload.detail) lines.push(truncate(payload.detail, 800));

  const sent = await sendOwnerTelegramDm(lines.join("\n"));
  if (!sent.success) {
    console.warn(`[youtube-short] Telegram stage notify failed (${payload.stage}): ${sent.error ?? "unknown"}`);
  }
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

export async function notifyYoutubeShortCronShell(message: string): Promise<void> {
  if (!notifyEnabled()) return;
  const text = ["⚙️ YouTube Short — cron", "", truncate(message, 1200)].join("\n");
  const sent = await sendOwnerTelegramDm(text);
  if (!sent.success) {
    console.warn(`[youtube-short] Telegram cron notify failed: ${sent.error ?? "unknown"}`);
  }
}

