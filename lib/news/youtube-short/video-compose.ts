import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { ensureBrollClips, pickBrollForSegment, randomBrollOffset } from "./broll";
import { ensureSwishSfx, mixFinalAudio, segmentTransitionTimes } from "./sfx";
import { ensureBgmTrack } from "./bgm";
import { ffprobeDuration } from "./render";
import type { CaptionFrame, ScriptSegment } from "./types";
import type { TipShortTopic } from "./topics";

const XFADE_DURATION = 0.22;
const FPS = 30;
/** VPS-friendly preset (slow OOMs on 4GB RAM during 1080p xfade re-encode). */
const VIDEO_PRESET = process.env.EMIGRO_YOUTUBE_SHORTS_FFMPEG_PRESET?.trim() || "medium";
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

  const duration = segmentDuration(frames);
  const overlayConcat = path.join(workDir, `${segmentLabel}.overlay.txt`);
  writeOverlayConcat(frames, overlayConcat);

  // Smooth Ken Burns on live B-roll: zoom tied to timestamp (not zoompan slideshow mode).
  const zoomDelta = 0.08;
  const dur = duration.toFixed(3);

  const filter = [
    `[0:v]fps=${FPS},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,`,
    `scale=w='1080*(1+${zoomDelta}*t/${dur})':h='1920*(1+${zoomDelta}*t/${dur})':eval=frame,`,
    `crop=1080:1920:'(iw-1080)/2':'(ih-1920)/2',`,
    "eq=brightness=-0.05:saturation=1.12,setsar=1[bg];",
    `[1:v]scale=1080:1920,format=rgba[ov];`,
    "[bg][ov]overlay=0:0:format=auto:shortest=1[vout]",
  ].join("");

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-ss",
      brollOffset.toFixed(2),
      "-stream_loop",
      "-1",
      "-i",
      brollPath,
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      overlayConcat,
      "-filter_complex",
      filter,
      "-map",
      "[vout]",
      "-t",
      dur,
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
    { stdio: "inherit" }
  );

  if (result.status !== 0) throw new Error(`Segment render failed (${segmentLabel}): ${result.status}`);
}

function ffmpegErrorDetail(result: ReturnType<typeof spawnSync>): string {
  const stderr = typeof result.stderr === "string" ? result.stderr : "";
  const lines = stderr
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /error|invalid|failed|moov atom|no such file/i.test(line));
  return lines.slice(-4).join(" ") || "no ffmpeg details";
}

function assertReadableSegment(segmentPath: string, label: string): number {
  if (!fs.existsSync(segmentPath)) {
    throw new Error(`Segment file missing (${label}): ${segmentPath}`);
  }
  const bytes = fs.statSync(segmentPath).size;
  if (bytes < MIN_SEGMENT_BYTES) {
    throw new Error(`Segment file too small (${label}, ${bytes} bytes): ${segmentPath}`);
  }
  const duration = ffprobeDuration(segmentPath);
  if (duration < XFADE_DURATION + 0.05) {
    throw new Error(
      `Segment too short for xfade (${label}, ${duration.toFixed(2)}s < ${XFADE_DURATION}s): ${segmentPath}`
    );
  }
  return duration;
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
    const code = result.status ?? "signal";
    throw new Error(`Segment xfade concat failed (${code}): ${ffmpegErrorDetail(result)}`);
  }
}

function muxVideoAudio(videoPath: string, audioPath: string, outputPath: string): void {
  const result = spawnSync(
    "ffmpeg",
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
    { stdio: "inherit" }
  );
  if (result.status !== 0) throw new Error(`Final mux failed: ${result.status}`);
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
