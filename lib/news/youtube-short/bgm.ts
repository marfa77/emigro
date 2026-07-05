import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "child_process";

const AUDIO_SAMPLE_RATE = 48_000;
const GENERATED_NAME = "bgm-ambient-lofi.mp3";

export function isBgmEnabled(): boolean {
  return process.env.EMIGRO_BGM_ENABLED !== "0";
}

export function bgmVolume(): number {
  const raw = Number(process.env.EMIGRO_BGM_VOLUME ?? "0.1");
  if (!Number.isFinite(raw) || raw <= 0) return 0.1;
  return Math.min(raw, 0.25);
}

function bgmLibraryDir(): string {
  return process.env.EMIGRO_BGM_DIR?.trim() || path.join(process.cwd(), "data", "bgm");
}

function listBgmTracks(): string[] {
  const dir = bgmLibraryDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(mp3|m4a|aac|wav)$/i.test(f))
    .map((f) => path.join(dir, f))
    .filter((p) => fs.statSync(p).size > 10_000);
}

/** Soft ambient bed — fallback when no royalty-free tracks in data/bgm/. */
function generateAmbientBed(destPath: string): void {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `anoisesrc=d=120:c=pink:r=${AUDIO_SAMPLE_RATE}:a=0.18`,
      "-af",
      "lowpass=f=900,highpass=f=70,volume=0.35,afade=t=in:st=0:d=3",
      "-c:a",
      "libmp3lame",
      "-b:a",
      "128k",
      destPath,
    ],
    { stdio: "ignore" }
  );
  if (result.status !== 0) throw new Error("Failed to generate ambient BGM bed");
}

/**
 * Returns path to background music track (library file or generated ambient).
 * Drop lo-fi/ambient MP3s into data/bgm/ (Pixabay, YouTube Audio Library, etc.).
 */
export function ensureBgmTrack(outputDir: string, topicId: string): string | null {
  if (!isBgmEnabled()) return null;

  const tracks = listBgmTracks();
  if (tracks.length > 0) {
    const hash = crypto.createHash("sha1").update(topicId).digest("hex");
    const idx = parseInt(hash.slice(0, 8), 16) % tracks.length;
    console.log(`[bgm] Using library track: ${path.basename(tracks[idx])}`);
    return tracks[idx];
  }

  const generated = path.join(outputDir, "video-compose", GENERATED_NAME);
  if (!fs.existsSync(generated) || fs.statSync(generated).size < 5000) {
    console.log("[bgm] No tracks in data/bgm/ — using generated ambient bed");
    generateAmbientBed(generated);
  }
  return generated;
}
