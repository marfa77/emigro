import fs from "fs";
import path from "path";
import crypto from "crypto";
import { spawnSync } from "child_process";
import { SHORT_HEIGHT, SHORT_WIDTH } from "./config";
import type { TipShortTopic } from "./topics";

const FALLBACK_BG: Record<string, string> = {
  portugal: "0x166534",
  spain: "0x991b1b",
  france: "0x1d4ed8",
  germany: "0x1f2937",
  italy: "0x065f46",
  netherlands: "0x1d4ed8",
  scandinavia: "0x075985",
};

const PEXELS_API = "https://api.pexels.com/videos/search";

/** Country-level fallback queries. */
const COUNTRY_BROLL: Record<string, string[]> = {
  portugal: ["lisbon street vertical", "lisbon tram", "portugal coast aerial"],
  spain: ["barcelona street vertical", "madrid city walking"],
  france: ["paris street vertical", "lyon city"],
  germany: ["berlin street vertical", "munich city"],
  italy: ["rome street vertical", "milan city"],
  netherlands: ["amsterdam canal vertical", "amsterdam bike"],
  scandinavia: ["copenhagen street vertical", "oslo fjord"],
};

/** Topic-specific queries layered on top of country clips. */
const TOPIC_BROLL: Record<string, string[]> = {
  "aima-3-mistakes": ["passport documents desk", "office queue waiting", "government building"],
  "lisbon-free-museums-vnj": ["art museum interior", "lisbon architecture", "museum gallery"],
  "lisbon-rent-2026": ["apartment keys house", "lisbon apartment balcony", "city apartment building"],
  "nif-one-day": ["bank counter service", "tax office documents", "signing contract desk"],
  "d7-vs-d8-one-minute": ["laptop remote work cafe", "coworking space", "freelancer working"],
  "portugal-digital-nomad": ["coworking lisbon", "beach laptop work", "digital nomad cafe"],
  "portugal-healthcare-vnj": ["hospital modern building", "doctor consultation", "pharmacy store"],
  "portugal-iban-not-revolut": ["bank card payment", "portuguese bank office", "mobile banking app"],
  "sns-registration": ["hospital entrance", "health insurance documents", "doctor patient consultation"],
};

type PexelsVideoFile = {
  id: number;
  quality?: string;
  width: number;
  height: number;
  link: string;
};

type PexelsSearchResponse = {
  videos?: Array<{
    id: number;
    duration: number;
    video_files: PexelsVideoFile[];
  }>;
};

function brollCacheRoot(): string {
  return process.env.EMIGRO_BROLL_CACHE_DIR?.trim() || path.join(process.cwd(), "data", "broll-cache");
}

function pickVerticalFile(files: PexelsVideoFile[]): PexelsVideoFile | null {
  const portrait = files
    .filter((f) => f.height >= f.width && f.height >= 720 && f.link)
    .sort((a, b) => b.height - a.height);
  if (portrait.length > 0) return portrait[0];
  const any = files.filter((f) => f.height >= 540 && f.link).sort((a, b) => b.height - a.height);
  return any[0] ?? null;
}

async function searchPexels(query: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) return null;

  const params = new URLSearchParams({
    query,
    orientation: "portrait",
    size: "medium",
    per_page: "8",
  });

  const res = await fetch(`${PEXELS_API}?${params}`, {
    headers: { Authorization: apiKey },
  });

  if (!res.ok) {
    console.warn(`[broll] Pexels search failed (${res.status}) for "${query}"`);
    return null;
  }

  const json = (await res.json()) as PexelsSearchResponse;
  for (const video of json.videos ?? []) {
    const file = pickVerticalFile(video.video_files ?? []);
    if (file) return file.link;
  }
  return null;
}

async function downloadClip(url: string, destPath: string): Promise<void> {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 50_000) return;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`B-roll download failed (${res.status}): ${url}`);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
}

function createFallbackBroll(destPath: string, topic: TipShortTopic, seed: number): void {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 20_000) return;

  const themeColor = FALLBACK_BG[topic.topic_key] ?? "0x1e3a5f";
  const hueShift = (seed % 30) - 15;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `color=c=${themeColor}:s=${SHORT_WIDTH}x${SHORT_HEIGHT}:d=20:r=30`,
      "-vf",
      [
        "noise=alls=12:allf=t+u",
        `hue=h=${hueShift}`,
        "zoompan=z='min(zoom+0.0012,1.14)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=600:s=1080x1920:fps=30",
        "eq=brightness=-0.04:saturation=1.2",
        "format=yuv420p",
      ].join(","),
      "-t",
      "20",
      "-an",
      destPath,
    ],
    { stdio: "ignore" }
  );

  if (result.status !== 0) {
    throw new Error(`Fallback B-roll generation failed for ${destPath}`);
  }
}

function queriesForTopic(topic: TipShortTopic): string[] {
  const topicQueries = TOPIC_BROLL[topic.id] ?? [];
  const countryQueries = COUNTRY_BROLL[topic.topic_key] ?? COUNTRY_BROLL.portugal;
  return Array.from(new Set([...topicQueries, ...countryQueries]));
}

/**
 * Returns 3+ B-roll clip paths for a topic (cached). Uses Pexels when API key is set.
 */
export async function ensureBrollClips(topic: TipShortTopic, outputDir: string, minClips = 3): Promise<string[]> {
  const cacheDir = path.join(brollCacheRoot(), topic.topic_key);
  fs.mkdirSync(cacheDir, { recursive: true });

  const queries = queriesForTopic(topic);
  const clips: string[] = [];

  for (let i = 0; i < queries.length && clips.length < minClips + 2; i++) {
    const query = queries[i];
    const hash = crypto.createHash("sha1").update(query).digest("hex").slice(0, 10);
    const dest = path.join(cacheDir, `${hash}.mp4`);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 50_000) {
      clips.push(dest);
      continue;
    }

    const url = await searchPexels(query);
    if (url) {
      try {
        await downloadClip(url, dest);
        clips.push(dest);
        console.log(`[broll] Downloaded: ${query}`);
      } catch (error) {
        console.warn(`[broll] Download error for "${query}":`, error instanceof Error ? error.message : error);
      }
    }
  }

  while (clips.length < minClips) {
    const fallback = path.join(outputDir, "broll-fallback", `fallback-${clips.length + 1}.mp4`);
    createFallbackBroll(fallback, topic, clips.length + topic.id.length);
    clips.push(fallback);
  }

  return clips.slice(0, minClips + 2);
}

export function pickBrollForSegment(clips: string[], segmentKind: string, segmentIndex: number): string {
  const offset = segmentKind === "hook" ? 0 : segmentKind === "tip" ? 1 : 2;
  return clips[(segmentIndex + offset) % clips.length];
}

export function randomBrollOffset(clipPath: string, maxSeconds = 8): number {
  try {
    const { execFileSync } = require("child_process") as typeof import("child_process");
    const out = execFileSync(
      "ffprobe",
      ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", clipPath],
      { encoding: "utf8" }
    );
    const duration = Number(out.trim());
    if (!Number.isFinite(duration) || duration <= 3) return 0;
    const upper = Math.max(1, Math.min(maxSeconds, duration - 5));
    return Math.random() * upper;
  } catch {
    return 0;
  }
}
