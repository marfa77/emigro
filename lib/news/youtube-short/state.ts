import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { loadCommunityTipTopics, getCommunityTipTopic } from "./community-topics";
import { youtubeShortsBucket, youtubeShortsGcsPrefix, youtubeShortsOutputRoot } from "./config";
import { todayYmd } from "./text-utils";
import { expandEquivalentTopicSlugs } from "./topic-equivalents";
import type { TipShortTopic } from "./topics";

type PublishedState = {
  published: string[];
  last_published_at?: string;
  last_topic_id?: string;
  /** UTC date of last successful daily run (one short per day). */
  last_success_date?: string;
  /** Set after merging published[] from GCS / local artifacts (once). */
  backfill_migrated_at?: string;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)+$/;

function isTopicSlug(id: string): boolean {
  return SLUG_PATTERN.test(id);
}

export function statePath(): string {
  const custom = process.env.EMIGRO_YOUTUBE_SHORTS_STATE_FILE?.trim();
  if (custom) return custom;
  return path.join(path.dirname(youtubeShortsOutputRoot()), "youtube-shorts-state.json");
}

export function testStateWritable(): { ok: boolean; error: string } {
  const file = statePath();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const probe = `${file}.health-${process.pid}`;
    fs.writeFileSync(probe, "{}", { encoding: "utf8" });
    fs.unlinkSync(probe);
    return { ok: true, error: "" };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error ?? "unknown") };
  }
}

function legacyStatePath(): string {
  return path.join(process.cwd(), "scripts", "output", "youtube-shorts-state.json");
}

function discoverPublishedFromLocalOutput(): Set<string> {
  const found = new Set<string>();
  const outputRoot = youtubeShortsOutputRoot();
  if (!fs.existsSync(outputRoot)) return found;

  for (const name of fs.readdirSync(outputRoot)) {
    const match = name.match(/^(.+)-(\d{4}-\d{2}-\d{2})$/);
    if (!match || !isTopicSlug(match[1])) continue;
    const video = path.join(outputRoot, name, "short.mp4");
    if (fs.existsSync(video)) found.add(match[1]);
  }
  return found;
}

function gcsEnv(): NodeJS.ProcessEnv {
  const gcsHome = process.env.GSUTIL_HOME || process.env.EMIGRO_YOUTUBE_STATE_DIR || path.join(process.cwd(), "data");
  const credentials =
    process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), "data/gcs-upload-key.json");
  const cloudConfig = process.env.CLOUDSDK_CONFIG || path.join(process.cwd(), "data/gcloud-config");
  fs.mkdirSync(path.join(gcsHome, ".gsutil"), { recursive: true });
  return {
    ...process.env,
    HOME: gcsHome,
    GSUTIL_HOME: gcsHome,
    CLOUDSDK_CONFIG: cloudConfig,
    GOOGLE_APPLICATION_CREDENTIALS: credentials,
  };
}

function discoverPublishedFromGcs(force = false): { slugs: Set<string>; ok: boolean } {
  const found = new Set<string>();
  if (!force && !shouldSyncPublishedFromGcs()) return { slugs: found, ok: true };

  const bucket = youtubeShortsBucket().replace(/\/+$/g, "");
  if (!bucket.startsWith("gs://")) return { slugs: found, ok: true };

  const creds =
    process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), "data/gcs-upload-key.json");
  if (!fs.existsSync(creds)) {
    console.warn("[youtube-short] GCS backfill skipped: no credentials file");
    return { slugs: found, ok: false };
  }

  const prefix = `${bucket}/${youtubeShortsGcsPrefix()}/tips/`;
  const result = spawnSync("gsutil", ["ls", prefix], {
    encoding: "utf8",
    env: gcsEnv(),
    timeout: 30_000,
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "gsutil ls failed").trim().slice(0, 200);
    console.warn(`[youtube-short] GCS backfill failed: ${detail}`);
    return { slugs: found, ok: false };
  }

  for (const line of result.stdout.split("\n")) {
    const match = line.trim().match(/\/tips\/[^/]+\/([^/]+)\/?$/);
    if (match && isTopicSlug(match[1])) found.add(match[1]);
  }
  return { slugs: found, ok: true };
}

function discoverPublishedFromGenerationReports(): Set<string> {
  const found = new Set<string>();
  const outputRoot = youtubeShortsOutputRoot();
  if (!fs.existsSync(outputRoot)) return found;

  for (const name of fs.readdirSync(outputRoot)) {
    const match = name.match(/^(.+)-(\d{4}-\d{2}-\d{2})$/);
    if (!match || !isTopicSlug(match[1])) continue;
    const reportPath = path.join(outputRoot, name, "generation-report.json");
    if (!fs.existsSync(reportPath)) continue;
    try {
      const report = JSON.parse(fs.readFileSync(reportPath, "utf8")) as {
        topic_id?: string;
        video_duration_seconds?: number;
        youtube?: { videoId?: string };
      };
      if (report.topic_id === match[1] && (report.youtube?.videoId || (report.video_duration_seconds ?? 0) > 0)) {
        found.add(match[1]);
      }
    } catch {
      /* ignore */
    }
  }
  return found;
}

function mergeLegacyStatePublished(state: PublishedState): PublishedState {
  const legacyFile = legacyStatePath();
  if (!fs.existsSync(legacyFile)) return state;
  try {
    const legacy = JSON.parse(fs.readFileSync(legacyFile, "utf8")) as PublishedState;
    const merged = Array.from(new Set([...state.published, ...(legacy.published ?? [])]));
    if (merged.length === state.published.length) return state;
    return { ...state, published: merged };
  } catch {
    return state;
  }
}

function shouldSyncPublishedFromGcs(): boolean {
  if (process.env.EMIGRO_YOUTUBE_SHORTS_SYNC_GCS === "1") return true;
  return process.env.EMIGRO_YOUTUBE_SHORTS_BACKFILL_GCS !== "0";
}

function collectDoneTopicSlugs(state: PublishedState, options?: { refreshGcs?: boolean }): Set<string> {
  const done = new Set(state.published);
  for (const id of Array.from(discoverPublishedFromLocalOutput())) done.add(id);
  for (const id of Array.from(discoverPublishedFromGenerationReports())) done.add(id);

  const refreshGcs = options?.refreshGcs ?? true;
  if (refreshGcs) {
    const gcs = discoverPublishedFromGcs(true);
    for (const id of Array.from(gcs.slugs)) done.add(id);
  } else if (!state.backfill_migrated_at && shouldSyncPublishedFromGcs()) {
    const gcs = discoverPublishedFromGcs(false);
    for (const id of Array.from(gcs.slugs)) done.add(id);
  }

  return expandEquivalentTopicSlugs(done);
}

function backfillPublishedState(state: PublishedState): PublishedState {
  const forceGcsSync = process.env.EMIGRO_YOUTUBE_SHORTS_SYNC_GCS === "1";
  const skipGcs = state.backfill_migrated_at && !forceGcsSync;

  const discovered = new Set(state.published);
  for (const id of Array.from(discoverPublishedFromLocalOutput())) discovered.add(id);
  for (const id of Array.from(discoverPublishedFromGenerationReports())) discovered.add(id);

  let gcsOk = true;
  if (!skipGcs && shouldSyncPublishedFromGcs()) {
    const gcs = discoverPublishedFromGcs();
    gcsOk = gcs.ok;
    for (const id of Array.from(gcs.slugs)) discovered.add(id);
  }

  const expandedDiscovered = expandEquivalentTopicSlugs(discovered);
  let next = mergeLegacyStatePublished({ ...state, published: Array.from(expandedDiscovered) });
  const changed =
    next.published.length !== state.published.length ||
    next.published.some((id, i) => state.published[i] !== id);

  const gcsAttempted = !skipGcs && shouldSyncPublishedFromGcs();
  if ((gcsAttempted && gcsOk) || (!gcsAttempted && !state.backfill_migrated_at)) {
    next = { ...next, backfill_migrated_at: new Date().toISOString() };
  }

  if (changed) {
    next.last_topic_id = next.last_topic_id ?? next.published.at(-1);
    console.log(`[youtube-short] Backfilled published[] from artifacts: ${next.published.join(", ")}`);
  }
  if (changed || !state.backfill_migrated_at) {
    writeState(next);
  }
  return next;
}

function readState(): PublishedState {
  const file = statePath();
  let state: PublishedState = { published: [] };
  if (fs.existsSync(file)) {
    try {
      state = JSON.parse(fs.readFileSync(file, "utf8")) as PublishedState;
    } catch {
      state = { published: [] };
    }
  }
  return backfillPublishedState(state);
}

function writeState(state: PublishedState): void {
  const file = statePath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2), { encoding: "utf8" });
  fs.renameSync(tmp, file);
}

export function alreadyGeneratedToday(): boolean {
  return readState().last_success_date === todayYmd();
}

export function isTopicPublished(topicId: string): boolean {
  return collectDoneTopicSlugs(readState()).has(topicId);
}

export function markTopicPublished(topicId: string): void {
  const state = readState();
  if (!state.published.includes(topicId)) {
    state.published.push(topicId);
  }
  state.last_published_at = new Date().toISOString();
  state.last_topic_id = topicId;
  state.last_success_date = todayYmd();
  writeState(state);
}

export function getPublishedTopicSlugs(): string[] {
  return Array.from(collectDoneTopicSlugs(readState(), { refreshGcs: true })).sort();
}

export async function pickNextTipTopics(count = 1, explicitTopicId?: string): Promise<TipShortTopic[]> {
  if (explicitTopicId) {
    const forced = await getCommunityTipTopic(explicitTopicId);
    if (!forced) throw new Error(`Unknown tip topic (note slug): ${explicitTopicId}`);
    return [forced];
  }

  const topics = await loadCommunityTipTopics();
  if (topics.length === 0) {
    throw new Error("No published community notes on portugal.emigro.online suitable for Shorts");
  }

  const done = collectDoneTopicSlugs(readState(), { refreshGcs: true });
  const unpublished = topics.filter((t) => !done.has(t.id));
  if (unpublished.length === 0) {
    throw new Error(
      `All ${topics.length} community note topics are published. Use --topic=SLUG --force to re-render one note.`
    );
  }
  return unpublished.slice(0, Math.max(1, count));
}

export async function pickNextTipTopic(explicitTopicId?: string): Promise<TipShortTopic> {
  const [next] = await pickNextTipTopics(1, explicitTopicId);
  return next;
}

export async function listTipTopics(): Promise<Array<TipShortTopic & { published: boolean }>> {
  const done = collectDoneTopicSlugs(readState(), { refreshGcs: true });
  const topics = await loadCommunityTipTopics();
  return topics.map((t) => ({
    ...t,
    published: done.has(t.id),
  }));
}
