import fs from "fs";
import { execFileSync, spawnSync } from "child_process";

export const MIN_AUDIO_BYTES = 512;
export const MIN_VIDEO_BYTES = 8_192;

export function ffprobeVideoSize(filePath: string): { width: number; height: number } {
  const out = execFileSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-select_streams",
      "v:0",
      "-show_entries",
      "stream=width,height",
      "-of",
      "csv=p=0:s=x",
      filePath,
    ],
    { encoding: "utf8" }
  );
  const [widthRaw, heightRaw] = out.trim().split("x");
  const width = Number(widthRaw);
  const height = Number(heightRaw);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error(`Could not read video dimensions for ${filePath}`);
  }
  return { width, height };
}

export function ffprobeDuration(filePath: string): number {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", filePath],
    { encoding: "utf8" }
  );
  const seconds = Number(out.trim());
  if (!Number.isFinite(seconds)) throw new Error(`Could not read duration for ${filePath}`);
  return seconds;
}

export function ffmpegErrorDetail(result: ReturnType<typeof spawnSync>): string {
  const stderr = typeof result.stderr === "string" ? result.stderr : "";
  const lines = stderr
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /error|invalid|failed|moov atom|no such file|does not contain/i.test(line));
  return lines.slice(-4).join(" ") || stderr.trim().split("\n").slice(-3).join(" ") || "no ffmpeg details";
}

export function ffmpegFailureMessage(label: string, result: ReturnType<typeof spawnSync>): string {
  const parts = [
    result.error?.message,
    result.signal ? `signal ${result.signal}` : null,
    result.status != null ? `exit ${result.status}` : null,
    ffmpegErrorDetail(result),
  ].filter(Boolean);
  return `${label} failed (${parts.join("; ") || "unknown"})`;
}

export function runFfmpeg(args: string[], label: string): void {
  const result = spawnSync("ffmpeg", args, {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  if (result.status === 0 && !result.error) return;
  throw new Error(ffmpegFailureMessage(label, result));
}

export function assertReadableVideoFile(
  filePath: string,
  label: string,
  opts: { minBytes?: number; minDuration?: number } = {}
): number {
  const minBytes = opts.minBytes ?? MIN_VIDEO_BYTES;
  const minDuration = opts.minDuration ?? 0;
  if (!fs.existsSync(filePath)) {
    throw new Error(`Video file missing (${label}): ${filePath}`);
  }
  const bytes = fs.statSync(filePath).size;
  if (bytes < minBytes) {
    throw new Error(`Video file too small (${label}, ${bytes} bytes): ${filePath}`);
  }
  const duration = ffprobeDuration(filePath);
  if (duration <= minDuration) {
    throw new Error(`Video file too short (${label}, ${duration.toFixed(2)}s): ${filePath}`);
  }
  return duration;
}

export function assertReadableAudioPart(partPath: string, label: string): number {
  if (!fs.existsSync(partPath)) {
    throw new Error(`Audio part missing (${label}): ${partPath}`);
  }
  const bytes = fs.statSync(partPath).size;
  if (bytes < MIN_AUDIO_BYTES) {
    throw new Error(`Audio part too small (${label}, ${bytes} bytes): ${partPath}`);
  }
  const duration = ffprobeDuration(partPath);
  if (duration <= 0) {
    throw new Error(`Audio part has zero duration (${label}): ${partPath}`);
  }
  return duration;
}
