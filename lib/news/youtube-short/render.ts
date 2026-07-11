import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  MIN_AUDIO_BYTES,
  assertReadableAudioPart,
  ffprobeDuration,
  runFfmpeg,
} from "./ffmpeg-utils";
import sharp from "sharp";
import {
  RU_TTS_SPEED,
  RU_TTS_VOICE,
  SHORT_DURATION_MAX,
  SHORT_DURATION_MIN,
  SHORT_HEIGHT,
  SHORT_WIDTH,
  ensureEnv,
  isDynamicVideoEnabled,
} from "./config";
import { compact, wordCount } from "./text-utils";
import { prepareTextForRuTts } from "./tts-spoken-text";
import type { CaptionFrame, ScriptSegment } from "./types";
import type { TipShortTopic } from "./topics";

export type VisualTheme = {
  bg0: string;
  bg1: string;
  bg2: string;
  orb1: string;
  orb2: string;
  label: string;
  accentHook: string;
  accentStory: string;
  accentCta: string;
  softText: string;
};

const TOPIC_THEMES: Record<string, VisualTheme> = {
  portugal: {
    bg0: "#052e16",
    bg1: "#166534",
    bg2: "#991b1b",
    orb1: "#22c55e",
    orb2: "#ef4444",
    label: "#bbf7d0",
    accentHook: "#fbbf24",
    accentStory: "#86efac",
    accentCta: "#ef4444",
    softText: "#dcfce7",
  },
  spain: {
    bg0: "#1f0a0a",
    bg1: "#991b1b",
    bg2: "#92400e",
    orb1: "#f59e0b",
    orb2: "#ef4444",
    label: "#fde68a",
    accentHook: "#fbbf24",
    accentStory: "#ffffff",
    accentCta: "#22c55e",
    softText: "#fef3c7",
  },
  france: {
    bg0: "#020617",
    bg1: "#1d4ed8",
    bg2: "#991b1b",
    orb1: "#3b82f6",
    orb2: "#ef4444",
    label: "#bfdbfe",
    accentHook: "#ef4444",
    accentStory: "#60a5fa",
    accentCta: "#ffffff",
    softText: "#dbeafe",
  },
  germany: {
    bg0: "#030712",
    bg1: "#1f2937",
    bg2: "#92400e",
    orb1: "#f59e0b",
    orb2: "#ef4444",
    label: "#fde68a",
    accentHook: "#f59e0b",
    accentStory: "#e5e7eb",
    accentCta: "#facc15",
    softText: "#fef3c7",
  },
  italy: {
    bg0: "#022c22",
    bg1: "#065f46",
    bg2: "#991b1b",
    orb1: "#22c55e",
    orb2: "#ef4444",
    label: "#bbf7d0",
    accentHook: "#ef4444",
    accentStory: "#86efac",
    accentCta: "#ffffff",
    softText: "#dcfce7",
  },
  netherlands: {
    bg0: "#082f49",
    bg1: "#1d4ed8",
    bg2: "#9a3412",
    orb1: "#f97316",
    orb2: "#38bdf8",
    label: "#bae6fd",
    accentHook: "#fb923c",
    accentStory: "#7dd3fc",
    accentCta: "#ffffff",
    softText: "#e0f2fe",
  },
  scandinavia: {
    bg0: "#0f172a",
    bg1: "#075985",
    bg2: "#134e4a",
    orb1: "#38bdf8",
    orb2: "#14b8a6",
    label: "#bae6fd",
    accentHook: "#38bdf8",
    accentStory: "#99f6e4",
    accentCta: "#fef08a",
    softText: "#e0f2fe",
  },
};

const DEFAULT_THEME: VisualTheme = {
  bg0: "#0c1222",
  bg1: "#1e3a5f",
  bg2: "#0f766e",
  orb1: "#2563eb",
  orb2: "#14b8a6",
  label: "#bfdbfe",
  accentHook: "#f97316",
  accentStory: "#60a5fa",
  accentCta: "#22c55e",
  softText: "#dbeafe",
};

function themeForTopic(topic: TipShortTopic): VisualTheme {
  return TOPIC_THEMES[topic.topic_key] ?? DEFAULT_THEME;
}

function xml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = compact(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
      if (lines.length >= maxLines) break;
    } else {
      line = next;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

function chunkCaption(text: string): string[] {
  return splitCaptionSentences(text);
}

function splitCaptionSentences(text: string): string[] {
  const normalized = compact(text);
  const chunks = normalized.split(/(?<=[.!?…])\s+/).map(compact).filter(Boolean);
  return chunks.length > 0 ? chunks : [normalized].filter(Boolean);
}

function splitCaptionWords(words: string[], maxWords: number): string[] {
  if (words.length <= maxWords) return [words.join(" ")];
  const splitAt = Math.min(maxWords, Math.ceil(words.length / 2));
  return [...splitCaptionWords(words.slice(0, splitAt), maxWords), ...splitCaptionWords(words.slice(splitAt), maxWords)];
}

function chunkShortCaption(text: string): string[] {
  const chunks: string[] = [];
  for (const sentence of chunkCaption(text)) {
    const words = sentence.split(/\s+/).filter(Boolean);
    chunks.push(...splitCaptionWords(words, 11));
  }
  return chunks.map(compact).filter(Boolean);
}

function srtTime(seconds: number): string {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  const milli = ms % 1000;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(milli).padStart(3, "0")}`;
}

const AUDIO_SAMPLE_RATE = 48_000;

export { ffprobeDuration };

function countryFlagSvg(topicKey: string, x: number, y: number, scale = 1): string {
  const w = 130 * scale;
  const h = 86 * scale;
  const rx = 8 * scale;
  const c = topicKey.toLowerCase();
  if (c.includes("portugal")) {
    return `<rect x="${x}" y="${y}" width="${w * 0.4}" height="${h}" rx="${rx}" fill="#046A38"/><rect x="${x + w * 0.4}" y="${y}" width="${w * 0.6}" height="${h}" rx="${rx}" fill="#DA291C"/>`;
  }
  if (c.includes("spain")) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#AA151B"/><rect x="${x}" y="${y + h * 0.25}" width="${w}" height="${h * 0.5}" fill="#F1BF00"/>`;
  }
  if (c.includes("france")) {
    return `<rect x="${x}" y="${y}" width="${w / 3}" height="${h}" rx="${rx}" fill="#0055A4"/><rect x="${x + w / 3}" y="${y}" width="${w / 3}" height="${h}" fill="#fff"/><rect x="${x + (2 * w) / 3}" y="${y}" width="${w / 3}" height="${h}" rx="${rx}" fill="#EF4135"/>`;
  }
  if (c.includes("italy")) {
    return `<rect x="${x}" y="${y}" width="${w / 3}" height="${h}" rx="${rx}" fill="#009246"/><rect x="${x + w / 3}" y="${y}" width="${w / 3}" height="${h}" fill="#fff"/><rect x="${x + (2 * w) / 3}" y="${y}" width="${w / 3}" height="${h}" rx="${rx}" fill="#CE2B37"/>`;
  }
  if (c.includes("germany")) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h / 3}" rx="${rx}" fill="#000"/><rect x="${x}" y="${y + h / 3}" width="${w}" height="${h / 3}" fill="#DD0000"/><rect x="${x}" y="${y + (2 * h) / 3}" width="${w}" height="${h / 3}" rx="${rx}" fill="#FFCE00"/>`;
  }
  if (c.includes("netherlands")) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h / 3}" rx="${rx}" fill="#AE1C28"/><rect x="${x}" y="${y + h / 3}" width="${w}" height="${h / 3}" fill="#fff"/><rect x="${x}" y="${y + (2 * h) / 3}" width="${w}" height="${h / 3}" rx="${rx}" fill="#21468B"/>`;
  }
  if (c.includes("scandinavia")) {
    const crossX = x + w * 0.34;
    const crossW = w * 0.14;
    const crossY = y + h * 0.42;
    const crossH = h * 0.18;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#0B5AA9"/><rect x="${crossX}" y="${y}" width="${crossW}" height="${h}" fill="#FCD116"/><rect x="${x}" y="${crossY}" width="${w}" height="${crossH}" fill="#FCD116"/>`;
  }
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#2563eb"/>`;
}

function visualAccent(theme: VisualTheme, kind: ScriptSegment["kind"]): string {
  if (kind === "hook") return theme.accentHook;
  if (kind === "cta") return theme.accentCta;
  return theme.accentStory;
}

function kindLabel(kind: ScriptSegment["kind"]): string {
  if (kind === "hook") return "КРЮЧОК";
  if (kind === "tip") return "СУТЬ";
  return "ДАЛЬШЕ";
}

function overlayCaptionSvg(caption: string, fontSize: number): string {
  const lines = wrapText(caption, 24, 3);
  const lineHeight = fontSize + 14;
  const startY = 1480 - ((lines.length - 1) * lineHeight) / 2;
  return lines
    .map(
      (line, idx) =>
        `<text x="540" y="${startY + idx * lineHeight}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="950" fill="#ffffff">${xml(line)}</text>`
    )
    .join("\n");
}

async function renderOverlayFrame(frame: CaptionFrame, topic: TipShortTopic): Promise<void> {
  const theme = themeForTopic(topic);
  const accent = visualAccent(theme, frame.segment.kind);
  const titleLines = wrapText(frame.segment.visualTitle, 16, 2);
  const captionText = frame.caption || frame.segment.visualTitle;
  const captionFontSize = captionText.length > 72 ? 46 : captionText.length > 48 ? 52 : 58;
  const flag = countryFlagSvg(topic.topic_key, 860, 118, 1.35);
  const captionBlock = overlayCaptionSvg(captionText, captionFontSize);

  const svg = `
<svg width="${SHORT_WIDTH}" height="${SHORT_HEIGHT}" viewBox="0 0 ${SHORT_WIDTH} ${SHORT_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="topScrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020617" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomScrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#020617" stop-opacity="0"/>
      <stop offset="40%" stop-color="#020617" stop-opacity="0.78"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="0.92"/>
    </linearGradient>
    <filter id="shortShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>
  <rect width="${SHORT_WIDTH}" height="760" fill="url(#topScrim)"/>
  <rect y="880" width="${SHORT_WIDTH}" height="1040" fill="url(#bottomScrim)"/>
  <text x="72" y="118" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="900" letter-spacing="3" fill="${theme.label}">EMIGRO · ЛАЙФХАК</text>
  <text x="72" y="168" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="#ffffff">${xml(topic.country)}</text>
  <g filter="url(#shortShadow)">${flag}</g>
  <text x="72" y="268" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="950" letter-spacing="4" fill="${accent}">${kindLabel(frame.segment.kind)}</text>
  ${titleLines
    .map(
      (line, idx) =>
        `<text x="72" y="${360 + idx * 78}" font-family="Arial, Helvetica, sans-serif" font-size="68" font-weight="950" fill="#ffffff">${xml(line)}</text>`
    )
    .join("\n")}
  <g filter="url(#shortShadow)">${captionBlock}</g>
  <text x="540" y="1820" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="900" fill="#ffffff">@Emigro_news · emigro.online</text>
</svg>`;

  await sharp(Buffer.from(svg)).ensureAlpha().png().toFile(frame.imagePath);
}

async function renderShortFrame(frame: CaptionFrame, topic: TipShortTopic): Promise<void> {
  if (isDynamicVideoEnabled()) {
    await renderOverlayFrame(frame, topic);
    return;
  }
  const theme = themeForTopic(topic);
  const accent = visualAccent(theme, frame.segment.kind);
  const titleLines = wrapText(frame.segment.visualTitle, 18, 3);
  const bodyLines = wrapText(frame.segment.visualBody, 23, 5);
  const captionLines = wrapText(frame.caption || frame.segment.visualBody, 28, 4);
  const captionFontSize = frame.caption.length > 108 ? 44 : frame.caption.length > 72 ? 50 : 56;
  const flag = countryFlagSvg(topic.topic_key, 675, 145, 1.72);

  const svg = `
<svg width="${SHORT_WIDTH}" height="${SHORT_HEIGHT}" viewBox="0 0 ${SHORT_WIDTH} ${SHORT_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shortBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg0}"/>
      <stop offset="52%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
    <filter id="shortShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="28" flood-color="#000000" flood-opacity="0.30"/>
    </filter>
  </defs>
  <rect width="${SHORT_WIDTH}" height="${SHORT_HEIGHT}" fill="url(#shortBg)"/>
  <circle cx="920" cy="210" r="360" fill="${theme.orb1}" opacity="0.24"/>
  <circle cx="140" cy="1720" r="330" fill="${theme.orb2}" opacity="0.16"/>
  <rect x="62" y="86" width="956" height="1748" rx="54" fill="#ffffff" opacity="0.08" stroke="#ffffff" stroke-opacity="0.14"/>
  <text x="88" y="150" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="900" letter-spacing="3" fill="${theme.label}">EMIGRO · ЛАЙФХАК</text>
  <text x="88" y="204" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="800" fill="#ffffff">${xml(topic.country)}</text>
  <g filter="url(#shortShadow)">${flag}</g>
  <text x="88" y="372" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="950" letter-spacing="4" fill="${accent}">${kindLabel(frame.segment.kind)}</text>
  ${titleLines
    .map(
      (line, idx) =>
        `<text x="88" y="${510 + idx * 88}" font-family="Arial, Helvetica, sans-serif" font-size="78" font-weight="950" fill="#ffffff">${xml(line)}</text>`
    )
    .join("\n")}
  <rect x="88" y="770" width="904" height="2" fill="#ffffff" opacity="0.18"/>
  ${bodyLines
    .map(
      (line, idx) =>
        `<text x="88" y="${880 + idx * 62}" font-family="Arial, Helvetica, sans-serif" font-size="48" font-weight="800" fill="${theme.softText}">${xml(line)}</text>`
    )
    .join("\n")}
  <rect x="70" y="1348" width="940" height="330" rx="42" fill="#020617" opacity="0.88"/>
  ${captionLines
    .map(
      (line, idx) =>
        `<text x="540" y="${1438 + idx * (captionFontSize + 14)}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${captionFontSize}" font-weight="950" fill="#ffffff">${xml(line)}</text>`
    )
    .join("\n")}
  <text x="540" y="1766" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="900" fill="#ffffff">@Emigro_news · emigro.online</text>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(frame.imagePath);
}

async function renderShortThumbnail(topic: TipShortTopic, outputPath: string, headline: string): Promise<void> {
  const theme = themeForTopic(topic);
  const titleLines = wrapText(headline, 18, 3);
  const flag = countryFlagSvg(topic.topic_key, 650, 240, 1.9);
  const svg = `
<svg width="${SHORT_WIDTH}" height="${SHORT_HEIGHT}" viewBox="0 0 ${SHORT_WIDTH} ${SHORT_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="thumbBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg0}"/>
      <stop offset="55%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="${SHORT_WIDTH}" height="${SHORT_HEIGHT}" fill="url(#thumbBg)"/>
  <circle cx="880" cy="230" r="350" fill="${theme.orb1}" opacity="0.24"/>
  <g>${flag}</g>
  ${titleLines
    .map(
      (line, idx) =>
        `<text x="96" y="${650 + idx * 104}" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="950" fill="#ffffff">${xml(line)}</text>`
    )
    .join("\n")}
  <text x="96" y="1160" font-family="Arial, Helvetica, sans-serif" font-size="42" font-weight="800" fill="${theme.softText}">${xml(topic.country)} · лайфхак</text>
  <text x="96" y="1690" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="950" fill="#ffffff">@Emigro_news</text>
</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(outputPath);
}

function cachedAudioUsable(outputPath: string): boolean {
  return fs.existsSync(outputPath) && fs.statSync(outputPath).size >= MIN_AUDIO_BYTES;
}

function normalizeAudioPart(inputPath: string, label: string): void {
  const tmp = `${inputPath}.norm.mp3`;
  runFfmpeg(
    [
      "-y",
      "-i",
      inputPath,
      "-af",
      `aresample=${AUDIO_SAMPLE_RATE}`,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      "-ar",
      String(AUDIO_SAMPLE_RATE),
      "-ac",
      "1",
      tmp,
    ],
    `Audio normalize (${label})`
  );
  fs.renameSync(tmp, inputPath);
}

async function openAiTts(text: string, outputPath: string, force = false): Promise<void> {
  if (cachedAudioUsable(outputPath) && !force) return;
  const spokenText = prepareTextForRuTts(text);
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ensureEnv("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice: RU_TTS_VOICE,
      input: spokenText,
      speed: RU_TTS_SPEED,
      response_format: "mp3",
      instructions:
        "Говори по-русски как автор YouTube-канала про релокацию. Крючок — быстро и уверенно, суть — чётко, без рекламного тона. Естественный разговорный русский. Числа и даты произноси полностью словами; в сложных словах сохраняй букву ё (трёхлетняя, четырёхмесячная).",
    }),
  });
  if (!response.ok) {
    throw new Error(`OpenAI TTS failed ${response.status}: ${(await response.text()).slice(0, 500)}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < MIN_AUDIO_BYTES) {
    throw new Error(`OpenAI TTS returned empty audio for ${outputPath}`);
  }
  fs.writeFileSync(outputPath, bytes);
}

function generateSilence(outputPath: string, seconds: number): void {
  runFfmpeg(
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `anullsrc=r=${AUDIO_SAMPLE_RATE}:cl=mono`,
      "-t",
      seconds.toFixed(2),
      "-c:a",
      "libmp3lame",
      "-b:a",
      "128k",
      "-ar",
      String(AUDIO_SAMPLE_RATE),
      "-ac",
      "1",
      outputPath,
    ],
    `Silence (${seconds.toFixed(2)}s)`
  );
}

export async function renderAudio(
  segments: ScriptSegment[],
  outputDir: string,
  forceAudio = false
): Promise<{ audioPath: string; segmentDurations: number[] }> {
  const audioDir = path.join(outputDir, "audio-parts");
  fs.mkdirSync(audioDir, { recursive: true });
  const lines: string[] = [];
  const partPaths: string[] = [];
  const segmentDurations: number[] = [];

  for (let i = 0; i < segments.length; i++) {
    const segmentHash = crypto
      .createHash("sha1")
      .update(
        JSON.stringify({
          text: prepareTextForRuTts(segments[i].text),
          voice: RU_TTS_VOICE,
          speed: RU_TTS_SPEED,
        })
      )
      .digest("hex")
      .slice(0, 10);
    const partPath = path.join(audioDir, `segment-${String(i + 1).padStart(2, "0")}-${segmentHash}.mp3`);
    const segmentLabel = `segment-${String(i + 1).padStart(2, "0")}`;
    await openAiTts(segments[i].text, partPath, forceAudio);
    normalizeAudioPart(partPath, segmentLabel);
    segmentDurations.push(assertReadableAudioPart(partPath, segmentLabel));
    partPaths.push(partPath);
    lines.push(`file '${partPath.replace(/'/g, "'\\''")}'`);
    if (segments[i].pauseAfter > 0) {
      const pauseHash = crypto.createHash("sha1").update(segments[i].pauseAfter.toFixed(2)).digest("hex").slice(0, 8);
      const silencePath = path.join(audioDir, `pause-${String(i + 1).padStart(2, "0")}-${pauseHash}.mp3`);
      const pauseLabel = `pause-${String(i + 1).padStart(2, "0")}`;
      if (!cachedAudioUsable(silencePath)) generateSilence(silencePath, segments[i].pauseAfter);
      normalizeAudioPart(silencePath, pauseLabel);
      assertReadableAudioPart(silencePath, pauseLabel);
      partPaths.push(silencePath);
      lines.push(`file '${silencePath.replace(/'/g, "'\\''")}'`);
    }
  }

  for (const partPath of partPaths) {
    assertReadableAudioPart(partPath, path.basename(partPath));
  }

  const concatPath = path.join(outputDir, "audio.concat.txt");
  fs.writeFileSync(concatPath, lines.join("\n"));
  const audioPath = path.join(outputDir, "short-voiceover.mp3");
  concatAudioWithRetry(concatPath, audioPath, partPaths);
  return { audioPath, segmentDurations };
}

function concatAudioWithRetry(concatPath: string, audioPath: string, partPaths: string[]): void {
  try {
    runFfmpeg(["-y", "-f", "concat", "-safe", "0", "-i", concatPath, "-c", "copy", audioPath], "Audio concat");
  } catch (firstError) {
    const reason = firstError instanceof Error ? firstError.message : String(firstError ?? "unknown");
    console.warn(`[youtube-short] Audio concat copy failed (${reason}); retrying with re-encode`);
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    runFfmpeg(
      [
        "-y",
        "-f",
        "concat",
        "-safe",
        "0",
        "-i",
        concatPath,
        "-c:a",
        "libmp3lame",
        "-b:a",
        "192k",
        "-ar",
        String(AUDIO_SAMPLE_RATE),
        "-ac",
        "1",
        audioPath,
      ],
      "Audio concat (re-encode retry)"
    );
  }
  assertReadableAudioPart(audioPath, "voiceover");
  for (const partPath of partPaths) {
    if (!fs.existsSync(partPath)) {
      throw new Error(`Audio concat input missing after merge: ${partPath}`);
    }
  }
}

export async function renderShortFrames(
  topic: TipShortTopic,
  segments: ScriptSegment[],
  segmentDurations: number[],
  outputDir: string
): Promise<CaptionFrame[]> {
  const frameDir = path.join(outputDir, "short-frames");
  fs.mkdirSync(frameDir, { recursive: true });
  const frames: CaptionFrame[] = [];
  let frameIndex = 0;

  for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
    const segment = segments[segmentIndex];
    const chunks = chunkShortCaption(segment.text);
    const totalWords = Math.max(1, wordCount(segment.text));
    const segmentDuration = segmentDurations[segmentIndex];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const usedDuration = frames.filter((f) => f.segment === segment).reduce((sum, f) => sum + f.duration, 0);
      const chunkDuration =
        i === chunks.length - 1
          ? Math.max(0.95, segmentDuration - usedDuration)
          : Math.max(0.95, (segmentDuration * wordCount(chunk)) / totalWords);

      const frame: CaptionFrame = {
        segment,
        caption: chunk,
        duration: chunkDuration,
        imagePath: path.join(frameDir, `short-frame-${String(++frameIndex).padStart(4, "0")}.png`),
      };
      await renderShortFrame(frame, topic);
      frames.push(frame);
    }

    if (segment.pauseAfter > 0) {
      const frame: CaptionFrame = {
        segment,
        caption: "",
        duration: segment.pauseAfter,
        imagePath: path.join(frameDir, `short-frame-${String(++frameIndex).padStart(4, "0")}.png`),
      };
      await renderShortFrame({ ...frame, caption: segment.visualTitle }, topic);
      frames.push(frame);
    }
  }

  return frames;
}

export function writeFrameConcat(frames: CaptionFrame[], outputDir: string): string {
  const concatPath = path.join(outputDir, "short-frames.concat.txt");
  const lines: string[] = [];
  for (const frame of frames) {
    lines.push(`file '${frame.imagePath.replace(/'/g, "'\\''")}'`);
    lines.push(`duration ${frame.duration.toFixed(3)}`);
  }
  lines.push(`file '${frames[frames.length - 1].imagePath.replace(/'/g, "'\\''")}'`);
  fs.writeFileSync(concatPath, lines.join("\n"));
  return concatPath;
}

export function writeSrt(frames: CaptionFrame[], outputPath: string): void {
  let cursor = 0;
  let index = 0;
  const lines: string[] = [];
  for (const frame of frames) {
    const start = cursor;
    const end = cursor + frame.duration;
    if (frame.caption.trim()) {
      lines.push(String(++index), `${srtTime(start)} --> ${srtTime(end)}`, frame.caption, "");
    }
    cursor = end;
  }
  fs.writeFileSync(outputPath, lines.join("\n"));
}

export function renderVideo(framesConcatPath: string, audioPath: string, outputPath: string): void {
  runFfmpeg(
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      framesConcatPath,
      "-i",
      audioPath,
      "-vf",
      "fps=30,format=yuv420p",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "19",
      "-c:a",
      "aac",
      "-b:a",
      "144k",
      "-shortest",
      outputPath,
    ],
    "Video render"
  );
}

export function fitVoiceoverToMaxDuration(audioPath: string, maxSeconds: number): number {
  const originalDuration = ffprobeDuration(audioPath);
  if (originalDuration <= maxSeconds) return originalDuration;

  const tempo = Math.min(originalDuration / maxSeconds, 1.12);
  const fittedPath = `${audioPath}.fit.mp3`;
  runFfmpeg(
    [
      "-y",
      "-i",
      audioPath,
      "-af",
      `atempo=${tempo.toFixed(4)}`,
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      "-ar",
      String(AUDIO_SAMPLE_RATE),
      "-ac",
      "1",
      fittedPath,
    ],
    "Audio tempo fit"
  );

  fs.renameSync(fittedPath, audioPath);
  const duration = ffprobeDuration(audioPath);
  console.log(
    `[youtube-short] Voiceover trimmed ${originalDuration.toFixed(1)}s → ${duration.toFixed(1)}s (atempo ${tempo.toFixed(3)})`
  );
  return duration;
}

export function assertShortDuration(seconds: number): void {
  if (seconds > SHORT_DURATION_MAX) {
    throw new Error(`Shorts duration ${seconds.toFixed(1)}s exceeds ${SHORT_DURATION_MAX}s limit`);
  }
  if (seconds < SHORT_DURATION_MIN) {
    throw new Error(`Shorts duration ${seconds.toFixed(1)}s below ${SHORT_DURATION_MIN}s minimum`);
  }
}

export { renderShortThumbnail, themeForTopic };
