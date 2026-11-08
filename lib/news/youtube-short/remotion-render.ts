/**
 * Remotion engine for Emigro Shorts: React composition (remotion/EmigroShort.tsx)
 * rendered headless. Script, TTS, b-roll fetch and audio mix stay shared with
 * the ffmpeg engine; only the picture is built here.
 */
import fs from "fs";
import path from "path";
import { ensureBrollClips } from "./broll";
import { ensureBgmTrack } from "./bgm";
import { ensureSwishSfx, mixFinalAudio, segmentTransitionTimes } from "./sfx";
import { ffprobeDuration, runFfmpeg } from "./ffmpeg-utils";
import { ensureBroll1080Proxy } from "./video-compose";
import { themeForTopic } from "./render";
import type { CaptionFrame, ScriptSegment } from "./types";
import type { TipShortTopic } from "./topics";
import type { EmigroShortProps, ShortBeat, ShortShot } from "../../../remotion/types";
import { SHORT_COMPOSITION_ID } from "../../../remotion/types";

const FPS = 30;
const SHOT_SECONDS = Number(process.env.EMIGRO_YOUTUBE_SHORTS_SHOT_SECONDS || "3.2");

export function isRemotionEngineEnabled(): boolean {
  return (process.env.EMIGRO_YOUTUBE_SHORTS_ENGINE || "remotion").trim().toLowerCase() === "remotion";
}

function flagColors(topicKey: string): [string, string] {
  const k = topicKey.toLowerCase();
  if (k.includes("portugal")) return ["#046A38", "#DA291C"];
  if (k.includes("spain")) return ["#AA151B", "#F1BF00"];
  if (k.includes("italy")) return ["#009246", "#CE2B37"];
  if (k.includes("germany")) return ["#000000", "#DD0000"];
  if (k.includes("france")) return ["#0055A4", "#EF4135"];
  return ["#2563eb", "#FFD400"];
}

function linkOrCopy(src: string, dest: string): void {
  if (fs.existsSync(dest)) fs.unlinkSync(dest);
  try {
    fs.linkSync(src, dest);
  } catch {
    fs.copyFileSync(src, dest);
  }
}

function buildBeats(frames: CaptionFrame[]): { beats: ShortBeat[]; total: number; hookEnd: number } {
  const beats: ShortBeat[] = [];
  let cursor = 0;
  let hookEnd = 0;
  for (const frame of frames) {
    const from = Math.round(cursor * FPS);
    cursor += frame.duration;
    const to = Math.round(cursor * FPS);
    const duration = Math.max(1, to - from);
    if (frame.segment.kind === "hook") hookEnd = to;
    const text = frame.caption.trim();
    const prev = beats[beats.length - 1];
    if (!text) {
      if (prev) prev.duration += duration; // hold the previous beat through the pause
      continue;
    }
    if (prev && prev.text === text && prev.kind === frame.segment.kind) {
      prev.duration += duration;
      continue;
    }
    beats.push({ text, from, duration, kind: frame.segment.kind });
  }
  return { beats, total: Math.round(cursor * FPS), hookEnd };
}

function buildShots(opts: {
  frames: CaptionFrame[];
  segments: ScriptSegment[];
  clips: string[];
  clipFrames: number[];
}): ShortShot[] {
  const { frames, segments, clips, clipFrames } = opts;
  const shots: ShortShot[] = [];
  let cursor = 0;
  let clipCursor = 0;
  for (const segment of segments) {
    const segFrames = frames.filter((f) => f.segment === segment);
    if (segFrames.length === 0) continue;
    const start = Math.round(cursor * FPS);
    cursor += segFrames.reduce((sum, f) => sum + f.duration, 0);
    const end = Math.round(cursor * FPS);
    const len = end - start;
    const count = Math.max(1, Math.round(len / (SHOT_SECONDS * FPS)));
    for (let i = 0; i < count; i++) {
      const from = start + Math.round((len * i) / count);
      const to = start + Math.round((len * (i + 1)) / count);
      const clipIdx = clipCursor % clips.length;
      clipCursor += 1;
      const room = Math.max(0, clipFrames[clipIdx] - (to - from) - 2);
      shots.push({
        src: path.basename(clips[clipIdx]),
        from,
        duration: Math.max(1, to - from),
        startFrom: room > 0 ? Math.floor(Math.random() * Math.min(room, 10 * FPS)) : 0,
      });
    }
  }
  return shots;
}

export async function composeRemotionVideo(opts: {
  topic: TipShortTopic;
  frames: CaptionFrame[];
  segments: ScriptSegment[];
  segmentDurations: number[];
  audioPath: string;
  outputPath: string;
  outputDir: string;
}): Promise<void> {
  const workDir = path.join(opts.outputDir, "remotion");
  const publicDir = path.join(workDir, "public");
  fs.rmSync(publicDir, { recursive: true, force: true });
  fs.mkdirSync(publicDir, { recursive: true });

  console.log("[remotion] Fetching B-roll clips...");
  const fetched = await ensureBrollClips(opts.topic, opts.outputDir, 6);
  // Flat gradient fallbacks look like dead air in a fast-cut reel: repeat real footage instead.
  const real = fetched.filter((clip) => !clip.includes(`${path.sep}broll-fallback${path.sep}`));
  const sourceClips = real.length >= 2 ? real : fetched;
  if (real.length < fetched.length) console.log(`[remotion] Using ${sourceClips.length} real clips (${fetched.length - real.length} fallback skipped)`);
  const clips: string[] = [];
  const clipFrames: number[] = [];
  sourceClips.forEach((clip, i) => {
    const proxy = ensureBroll1080Proxy(clip, workDir, `clip${i + 1}`);
    const dest = path.join(publicDir, `shot-${i + 1}.mp4`);
    linkOrCopy(proxy, dest);
    clips.push(dest);
    clipFrames.push(Math.floor(ffprobeDuration(dest) * FPS));
  });

  console.log("[remotion] Mixing audio...");
  const pauseAfter = opts.segments.map((s) => s.pauseAfter);
  const mixedAac = path.join(workDir, "audio-mix.aac");
  mixFinalAudio({
    voicePath: opts.audioPath,
    sfxPath: ensureSwishSfx(workDir),
    transitionTimes: segmentTransitionTimes(opts.segmentDurations, pauseAfter),
    voiceDuration: ffprobeDuration(opts.audioPath),
    bgmPath: ensureBgmTrack(opts.outputDir, opts.topic.id),
    outputPath: mixedAac,
  });
  runFfmpeg(["-y", "-i", mixedAac, "-c:a", "copy", path.join(publicDir, "audio.m4a")], "Audio remux (m4a)");

  const { beats, total, hookEnd } = buildBeats(opts.frames);
  const voiceFrames = Math.ceil(ffprobeDuration(opts.audioPath) * FPS);
  const durationInFrames = Math.max(total, voiceFrames) + 6;
  const shots = buildShots({ frames: opts.frames, segments: opts.segments, clips, clipFrames });
  const last = shots[shots.length - 1];
  if (last) last.duration = Math.max(last.duration, durationInFrames - last.from);

  const theme = themeForTopic(opts.topic);
  const stats = (opts.segments.find((s) => s.highlightStats?.length)?.highlightStats ?? []).slice(0, 2);
  const inputProps: EmigroShortProps = {
    fps: FPS,
    durationInFrames,
    audio: "audio.m4a",
    shots,
    beats,
    hookTitle: opts.segments[0]?.visualTitle || opts.topic.title,
    hookEnd,
    stats,
    accent: theme.accentHook,
    flag: flagColors(opts.topic.topic_key),
    handle: "@Emigro_news",
  };
  fs.writeFileSync(path.join(workDir, "props.json"), JSON.stringify(inputProps, null, 2));

  const { bundle } = await import("@remotion/bundler");
  const { renderMedia, selectComposition, ensureBrowser } = await import("@remotion/renderer");

  await ensureBrowser();
  console.log("[remotion] Bundling composition...");
  const serveUrl = await bundle({
    entryPoint: path.join(process.cwd(), "remotion", "index.ts"),
    publicDir,
    outDir: path.join(workDir, "bundle"),
  });

  const composition = await selectComposition({
    serveUrl,
    id: SHORT_COMPOSITION_ID,
    inputProps: inputProps as unknown as Record<string, unknown>,
    timeoutInMilliseconds: 120_000,
  });

  const concurrency = Number(process.env.EMIGRO_YOUTUBE_SHORTS_REMOTION_CONCURRENCY || "2");
  let lastPct = -10;
  console.log(`[remotion] Rendering ${durationInFrames} frames (${(durationInFrames / FPS).toFixed(1)}s), concurrency ${concurrency}...`);
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf: 20,
    pixelFormat: "yuv420p",
    audioCodec: "aac",
    audioBitrate: "192k",
    outputLocation: opts.outputPath,
    inputProps: inputProps as unknown as Record<string, unknown>,
    concurrency,
    timeoutInMilliseconds: 120_000,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 100);
      if (pct >= lastPct + 10) {
        lastPct = pct;
        console.log(`[remotion] ${pct}%`);
      }
    },
  });
  console.log(`[remotion] Done → ${opts.outputPath}`);
}
