import fs from "fs";
import path from "path";
import { publicSiteUrl } from "@/lib/site-url";
import { YOUTUBE_CHANNEL_URL } from "./config";
import { compact, limitWords } from "./text-utils";
import type { ScriptSegment, YoutubeShortMetadata, YoutubeUploadInfo } from "./types";
import type { TipShortScript } from "./script-writer";
import type { TipShortTopic } from "./topics";

function withYoutubeUtm(url: string, topic: TipShortTopic, dateYmd: string): string {
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}utm_source=youtube&utm_medium=shorts&utm_campaign=emigro-tip-${topic.id}-${dateYmd}`;
}

function uniqueTags(tags: string[], limit = 12): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const tag of tags.map((item) => compact(item)).filter(Boolean)) {
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(tag);
    if (result.length >= limit) break;
  }
  return result;
}

function guideUrl(slug: string): string {
  return `${publicSiteUrl()}/ru/guides/${slug}`;
}

export function buildTipShortMetadata(
  topic: TipShortTopic,
  script: TipShortScript,
  durationSeconds: number,
  dateYmd: string
): YoutubeShortMetadata {
  const title = script.youtube_title.slice(0, 96);
  const noteLink = topic.note_url ? withYoutubeUtm(topic.note_url, topic, dateYmd) : null;
  const guideLink = topic.guide_slug
    ? withYoutubeUtm(guideUrl(topic.guide_slug), topic, dateYmd)
    : noteLink ?? `${publicSiteUrl()}/ru/portugal`;
  const corridorLink = withYoutubeUtm(`${publicSiteUrl()}/ru/portugal`, topic, dateYmd);

  return {
    title,
    description: [
      `${script.hook}`,
      "",
      "В этом Short:",
      ...script.description_bullets.map((b) => `• ${b}`),
      "",
      noteLink ? `Полная заметка: ${noteLink}` : null,
      `Подробные гайды: ${guideLink}`,
      `Коридор Португалия: ${corridorLink}`,
      `Telegram: https://t.me/Emigro_news`,
      `YouTube: ${YOUTUBE_CHANNEL_URL}`,
      "",
      `Длительность: ${Math.round(durationSeconds)} сек`,
      "#shorts #релокация #португалия #лайфхак",
    ]
      .filter(Boolean)
      .join("\n"),
    tags: uniqueTags([
      "релокация",
      "лайфхак",
      "португалия",
      "внж",
      "emigro",
      "shorts",
      ...topic.tags,
    ]),
    playlist: "Emigro — лайфхаки релокации",
  };
}

export function writeShortUploadFields(opts: {
  topic: TipShortTopic;
  metadata: YoutubeShortMetadata;
  outputDir: string;
  files: Record<string, string>;
  gcsUri?: string | null;
  guideSlug?: string;
  youtube?: YoutubeUploadInfo | null;
}): void {
  const gcs = (fileName: string) => (opts.gcsUri ? `${opts.gcsUri}/${fileName}` : "");

  const body = [
    "TITLE:",
    opts.metadata.title,
    "",
    "DESCRIPTION:",
    opts.metadata.description,
    "",
    "TAGS:",
    opts.metadata.tags.join(", "),
    "",
    "PLAYLIST:",
    opts.metadata.playlist,
    "",
    "CHANNEL:",
    YOUTUBE_CHANNEL_URL,
    "",
    "VISIBILITY:",
    opts.youtube
      ? `${opts.youtube.privacyStatus} (uploaded via API)`
      : "Unlisted → проверить крючок, субтитры, ссылку → опубликовать как Shorts.",
    "",
    ...(opts.youtube
      ? [
          "YOUTUBE VIDEO:",
          opts.youtube.shortsUrl,
          `Video ID: ${opts.youtube.videoId}`,
          "",
        ]
      : []),
    "VIDEO FILE:",
    gcs("short.mp4") || opts.files.shortVideo,
    opts.gcsUri ? `Local: ${opts.files.shortVideo}` : "",
    "",
    "THUMBNAIL:",
    gcs("short-thumbnail.png") || opts.files.shortThumbnail,
    opts.gcsUri ? `Local: ${opts.files.shortThumbnail}` : "",
    "",
    "CAPTIONS:",
    gcs("short-captions.srt") || opts.files.shortCaptions,
    opts.gcsUri ? `Local: ${opts.files.shortCaptions}` : "",
    "",
    "SCRIPT:",
    gcs("short-script.txt") || opts.files.shortScript,
    opts.gcsUri ? `Local: ${opts.files.shortScript}` : "",
    "",
    "TOPIC ID:",
    opts.topic.id,
    "",
    "GUIDE:",
    opts.guideSlug ? guideUrl(opts.guideSlug) : "—",
    "",
    "ARTIFACTS:",
    opts.gcsUri ? `GCS: ${opts.gcsUri}` : `Local: ${opts.outputDir}`,
    "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  fs.writeFileSync(path.join(opts.outputDir, "short-youtube-upload-fields.txt"), `\uFEFF${body}`, {
    encoding: "utf8",
  });
}

export function spokenLinesFromSegments(segments: ScriptSegment[]): string[] {
  return segments.filter((s) => s.kind !== "cta").map((s) => s.text);
}

export { limitWords };
