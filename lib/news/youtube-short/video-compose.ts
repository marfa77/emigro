import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { ensureBrollClips, pickBrollForSegment, randomBrollOffset } from "./broll";
import { ensureSwishSfx, mixFinalAudio, segmentTransitionTimes } from "./sfx";
import { ensureBgmTrack } from "./bgm";
import {
  assertReadableVideoFile,
  ffprobeDuration,
  ffprobeVideoSize,
  ffmpegFailureMessage,
  runFfmpeg,
} from "./ffmpeg-utils";
import type { CaptionFrame, ScriptSegment } from "./types";
import type { TipShortTopic } from "./topics";

const XFADE_DURATION = 0.22;
const FPS = 30;
/** VPS-friendly preset (slow OOMs on 4GB RAM during 1080p xfade re-encode). */
const VIDEO_PRESET = process.env.EMIGRO_YOUTUBE_SHORTS_FFMPEG_PRESET?.trim() || "medium";
const FFMPEG_THREADS = process.env.EMIGRO_YOUTUBE_SHORTS_FFMPEG_THREADS?.trim() || "2";
const MIN_SEGMENT_BYTES = 8_192;

function shellPath(p: string): string {
  return p.replace(/'/g, "'\\''");
}

function groupFramesBySegment(frames: CaptionFrame[], segments: ScriptSegment[]): CaptionFrame[][] {
  const groups: CaptionFrame[][] = segments.map(() => []);
  for (const frame of frames) {
    const idx = segments.indexOf(frame.segment);
    if (idx >= 0) groups[idx].push(frame);
  }
  return groups;
}

function segmentDuration(frames: CaptionFrame[]): number {
  return frames.reduce((sum, f) => sum + f.duration, 0);
}

function writeOverlayConcat(frames: CaptionFrame[], concatPath: string): void {
  const lines: string[] = [];
  for (const frame of frames) {
    lines.push(`file '${shellPath(frame.imagePath)}'`);
    lines.push(`duration ${frame.duration.toFixed(3)}`);
  }
  if (frames.length > 0) {
    lines.push(`file '${shellPath(frames[frames.length - 1].imagePath)}'`);
  }
  fs.writeFileSync(concatPath, lines.join("\n"));
}

function assertOverlayInputs(frames: CaptionFrame[], segmentLabel: string): void {
  for (const frame of frames) {
    if (!fs.existsSync(frame.imagePath)) {
      throw new Error(`Overlay frame missing (${segmentLabel}): ${frame.imagePath}`);
    }
    const bytes = fs.statSync(frame.imagePath).size;
    if (bytes < 1_024) {
      throw new Error(`Overlay frame too small (${segmentLabel}, ${bytes} bytes): ${frame.imagePath}`);
    }
  }
}

function assertReadableBroll(brollPath: string, segmentLabel: string): void {
  assertReadableVideoFile(brollPath, `broll-${segmentLabel}`, { minDuration: 1 });
}

/** Downscale 4K Pexels clips to 1080p proxy — avoids OOM on 4GB VPS during Ken Burns. */
function ensureBroll1080Proxy(sourcePath: string, workDir: string, segmentLabel: string): string {
  const { width, height } = ffprobeVideoSize(sourcePath);
  if (width <= 1080 && height <= 1920) return sourcePath;

  const proxyPath = path.join(workDir, `broll-1080-${path.basename(sourcePath, path.extname(sourcePath))}.mp4`);
  if (fs.existsSync(proxyPath)) {
    try {
      assertReadableVideoFile(proxyPath, `broll-proxy-${segmentLabel}`, { minDuration: 1 });
      return proxyPath;
    } catch {
      fs.unlinkSync(proxyPath);
    }
  }

  console.log(`[video-compose] B-roll proxy ${width}x${height} → 1080p (${segmentLabel})`);
  runFfmpeg(
    [
      "-y",
      "-threads",
      FFMPEG_THREADS,
      "-i",
      sourcePath,
      "-an",
      "-vf",
      `fps=${FPS},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p`,
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      proxyPath,
    ],
    `B-roll proxy (${segmentLabel})`
  );
  return proxyPath;
}

function buildSegmentFilter(opts: { duration: number; kenBurns: boolean }): string {
  const dur = opts.duration.toFixed(3);
  const bgChain = opts.kenBurns
    ? [
        `[0:v]fps=${FPS},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,`,
        `scale=w='1080*(1+0.08*t/${dur})':h='1920*(1+0.08*t/${dur})':eval=frame,`,
        `crop=1080:1920:'(iw-1080)/2':'(ih-1920)/2',`,
        "eq=brightness=-0.05:saturation=1.12,setsar=1[bg];",
      ].join("")
    : `[0:v]fps=${FPS},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=brightness=-0.05:saturation=1.12,setsar=1[bg];`;

  return [
    bgChain,
    `[1:v]fps=${FPS},scale=1080:1920,format=rgba[ov];`,
    "[bg][ov]overlay=0:0:format=auto:shortest=1[vout]",
  ].join("");
}

function runSegmentFfmpeg(opts: {
  brollPath: string;
  brollOffset: number;
  overlayConcat: string;
  outputPath: string;
  duration: number;
  segmentLabel: string;
  kenBurns: boolean;
  preset: string;
}): void {
  const filter = buildSegmentFilter({ duration: opts.duration, kenBurns: opts.kenBurns });
  runFfmpeg(
    [
      "-y",
      "-threads",
      FFMPEG_THREADS,
      "-filter_threads",
      "1",
      "-ss",
      opts.brollOffset.toFixed(2),
      "-stream_loop",
      "-1",
      "-i",
      opts.brollPath,
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      opts.overlayConcat,
      "-filter_complex",
      filter,
      "-map",
      "[vout]",
      "-t",
      opts.duration.toFixed(3),
      "-an",
      "-r",
      String(FPS),
      "-fps_mode",
      "cfr",
      "-c:v",
      "libx264",
      "-preset",
      opts.preset,
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      opts.outputPath,
    ],
    `Segment render (${opts.segmentLabel}${opts.kenBurns ? "" : ", lite"})`
  );
}

function renderSegmentVideo(opts: {
  brollPath: string;
  brollOffset: number;
  frames: CaptionFrame[];
  outputPath: string;
  workDir: string;
  segmentLabel: string;
}): void {
  const { brollPath, brollOffset, frames, outputPath, workDir, segmentLabel } = opts;
  if (frames.length === 0) throw new Error(`No frames for segment ${segmentLabel}`);

  assertOverlayInputs(frames, segmentLabel);
  assertReadableBroll(brollPath, segmentLabel);
  const broll1080 = ensureBroll1080Proxy(brollPath, workDir, segmentLabel);

  const duration = segmentDuration(frames);
  const overlayConcat = path.join(workDir, `${segmentLabel}.overlay.txt`);
  writeOverlayConcat(frames, overlayConcat);

  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

  try {
    runSegmentFfmpeg({
      brollPath: broll1080,
      brollOffset,
      overlayConcat,
      outputPath,
      duration,
      segmentLabel,
      kenBurns: true,
      preset: VIDEO_PRESET,
    });
  } catch (firstError) {
    const reason = firstError instanceof Error ? firstError.message : String(firstError ?? "unknown");
    console.warn(`[video-compose] Segment ${segmentLabel} failed (${reason}); retrying lite profile`);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    runSegmentFfmpeg({
      brollPath: broll1080,
      brollOffset,
      overlayConcat,
      outputPath,
      duration,
      segmentLabel,
      kenBurns: false,
      preset: "ultrafast",
    });
  }
}

function assertReadableSegment(segmentPath: string, label: string): number {
  return assertReadableVideoFile(segmentPath, label, {
    minBytes: MIN_SEGMENT_BYTES,
    minDuration: XFADE_DURATION + 0.05,
  });
}

function concatSegmentsWithXfade(segmentPaths: string[], outputPath: string): void {
  if (segmentPaths.length === 1) {
    fs.copyFileSync(segmentPaths[0], outputPath);
    return;
  }

  const durations = segmentPaths.map((p, i) => assertReadableSegment(p, `segment-${i + 1}`));
  const normalized = segmentPaths.map((_, i) => `[${i}:v]fps=${FPS},settb=AVTB,setpts=PTS-STARTPTS,format=yuv420p[s${i}]`);
  let filter = `${normalized.join(";")};`;
  let lastLabel = "[s0]";
  let offsetAcc = 0;

  for (let i = 1; i < segmentPaths.length; i++) {
    offsetAcc += Math.max(0, durations[i - 1] - XFADE_DURATION);
    const outLabel = i === segmentPaths.length - 1 ? "[vout]" : `[v${i}]`;
    filter += `${lastLabel}[s${i}]xfade=transition=fade:duration=${XFADE_DURATION.toFixed(3)}:offset=${offsetAcc.toFixed(3)}${outLabel};`;
    lastLabel = outLabel;
  }

  filter = filter.replace(/;$/, "");

  const inputs = segmentPaths.flatMap((p) => ["-i", p]);
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-threads",
      FFMPEG_THREADS,
      "-filter_threads",
      "1",
      ...inputs,
      "-filter_complex",
      filter,
      "-map",
      "[vout]",
      "-an",
      "-r",
      String(FPS),
      "-fps_mode",
      "cfr",
      "-c:v",
      "libx264",
      "-preset",
      VIDEO_PRESET,
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }
  );

  if (result.status !== 0) {
    throw new Error(`Segment xfade concat failed: ${ffmpegFailureMessage("xfade", result)}`);
  }
}

function muxVideoAudio(videoPath: string, audioPath: string, outputPath: string): void {
  runFfmpeg(
    [
      "-y",
      "-i",
      videoPath,
      "-i",
      audioPath,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-ar",
      "48000",
      "-shortest",
      outputPath,
    ],
    "Final mux"
  );
}

export async function composeDynamicVideo(opts: {
  topic: TipShortTopic;
  frames: CaptionFrame[];
  segments: ScriptSegment[];
  segmentDurations: number[];
  audioPath: string;
  outputPath: string;
  outputDir: string;
}): Promise<void> {
  const workDir = path.join(opts.outputDir, "video-compose");
  fs.mkdirSync(workDir, { recursive: true });

  console.log("[video-compose] Fetching B-roll clips...");
  const brollClips = await ensureBrollClips(opts.topic, opts.outputDir);

  const frameGroups = groupFramesBySegment(opts.frames, opts.segments);
  const segmentPaths: string[] = [];

  for (let i = 0; i < frameGroups.length; i++) {
    const group = frameGroups[i];
    if (group.length === 0) continue;

    const segment = opts.segments[i];
    const broll = pickBrollForSegment(brollClips, segment.kind, i);
    const offset = randomBrollOffset(broll);
    const segOut = path.join(workDir, `segment-${i + 1}-${segment.kind}.mp4`);

    console.log(`[video-compose] Segment ${segment.kind}: ${segmentDuration(group).toFixed(1)}s, B-roll offset ${offset.toFixed(1)}s`);
    renderSegmentVideo({
      brollPath: broll,
      brollOffset: offset,
      frames: group,
      outputPath: segOut,
      workDir,
      segmentLabel: `${i + 1}-${segment.kind}`,
    });
    assertReadableSegment(segOut, `${i + 1}-${segment.kind}`);
    segmentPaths.push(segOut);
  }

  const silentVideo = path.join(workDir, "video-xfade.mp4");
  console.log("[video-compose] Crossfading segments...");
  concatSegmentsWithXfade(segmentPaths, silentVideo);

  const sfxPath = ensureSwishSfx(workDir);
  const bgmPath = ensureBgmTrack(opts.outputDir, opts.topic.id);
  const pauseAfter = opts.segments.map((s) => s.pauseAfter);
  const transitions = segmentTransitionTimes(opts.segmentDurations, pauseAfter);
  const voiceDuration = ffprobeDuration(opts.audioPath);
  const mixedAudio = path.join(workDir, "audio-with-sfx.aac");

  console.log(
    `[video-compose] Mixing audio (BGM: ${bgmPath ? path.basename(bgmPath) : "off"}, SFX at ${transitions.map((t) => t.toFixed(1)).join("s, ")}s)`
  );
  mixFinalAudio({
    voicePath: opts.audioPath,
    sfxPath,
    transitionTimes: transitions,
    voiceDuration,
    bgmPath,
    outputPath: mixedAudio,
  });

  console.log("[video-compose] Muxing final video...");
  muxVideoAudio(silentVideo, mixedAudio, opts.outputPath);
}
