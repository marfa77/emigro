import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { youtubeShortsBucket, youtubeShortsGcsPrefix, youtubeShortsOutputRoot } from "./config";
import { todayYmd } from "./text-utils";
import { TIP_SHORT_TOPICS, type TipShortTopic } from "./topics";

type PublishedState = {
  published: string[];
  last_published_at?: string;
  last_topic_id?: string;
  /** UTC date of last successful daily run (one short per day). */
  last_success_date?: string;
  /** Set after merging published[] from GCS / local artifacts (once). */
  backfill_migrated_at?: string;
};

const KNOWN_TOPIC_IDS = new Set(TIP_SHORT_TOPICS.map((t) => t.id));

function statePath(): string {
  const custom = process.env.EMIGRO_YOUTUBE_SHORTS_STATE_FILE?.trim();
  if (custom) return custom;
  return path.join(path.dirname(youtubeShortsOutputRoot()), "youtube-shorts-state.json");
}

function legacyStatePath(): string {
  return path.join(process.cwd(), "scripts", "output", "youtube-shorts-state.json");
}

function orderPublishedIds(ids: Iterable<string>): string[] {
  const set = new Set(ids);
  return TIP_SHORT_TOPICS.filter((t) => set.has(t.id)).map((t) => t.id);
}

function discoverPublishedFromLocalOutput(): Set<string> {
  const found = new Set<string>();
  const outputRoot = youtubeShortsOutputRoot();
  if (!fs.existsSync(outputRoot)) return found;

  for (const name of fs.readdirSync(outputRoot)) {
    const match = name.match(/^(.+)-(\d{4}-\d{2}-\d{2})$/);
    if (!match || !KNOWN_TOPIC_IDS.has(match[1])) continue;
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

function discoverPublishedFromGcs(): Set<string> {
  const found = new Set<string>();
  if (process.env.EMIGRO_YOUTUBE_SHORTS_BACKFILL_GCS === "0") return found;

  const bucket = youtubeShortsBucket().replace(/\/+$/g, "");
  if (!bucket.startsWith("gs://")) return found;

  const prefix = `${bucket}/${youtubeShortsGcsPrefix()}/tips/`;
  const result = spawnSync("gsutil", ["ls", prefix], {
    encoding: "utf8",
    env: gcsEnv(),
    timeout: 30_000,
  });
  if (result.status !== 0) return found;

  for (const line of result.stdout.split("\n")) {
    const match = line.trim().match(/\/tips\/[^/]+\/([^/]+)\/?$/);
    if (match && KNOWN_TOPIC_IDS.has(match[1])) found.add(match[1]);
  }
  return found;
}

function mergeLegacyStatePublished(state: PublishedState): PublishedState {
  const legacyFile = legacyStatePath();
  if (!fs.existsSync(legacyFile)) return state;
  try {
    const legacy = JSON.parse(fs.readFileSync(legacyFile, "utf8")) as PublishedState;
    const merged = orderPublishedIds([...state.published, ...(legacy.published ?? [])]);
    if (merged.length === state.published.length) return state;
    return { ...state, published: merged };
  } catch {
    return state;
  }
}

function backfillPublishedState(state: PublishedState): PublishedState {
  if (state.backfill_migrated_at) return state;

  const discovered = new Set(state.published);
  for (const id of discoverPublishedFromLocalOutput()) discovered.add(id);
  for (const id of discoverPublishedFromGcs()) discovered.add(id);

  let next = mergeLegacyStatePublished({ ...state, published: orderPublishedIds(discovered) });
  const changed =
    next.published.length !== state.published.length ||
    next.published.some((id, i) => state.published[i] !== id);

  next = { ...next, backfill_migrated_at: new Date().toISOString() };
  if (changed) {
    next.last_topic_id = next.last_topic_id ?? next.published.at(-1);
    console.log(`[youtube-short] Backfilled published[] from artifacts: ${next.published.join(", ")}`);
  }
  writeState(next);
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
  fs.writeFileSync(file, JSON.stringify(state, null, 2), { encoding: "utf8" });
}

export function alreadyGeneratedToday(): boolean {
  return readState().last_success_date === todayYmd();
}

export function isTopicPublished(topicId: string): boolean {
  return readState().published.includes(topicId);
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

export function pickNextTipTopic(explicitTopicId?: string): TipShortTopic {
  if (explicitTopicId) {
    const forced = TIP_SHORT_TOPICS.find((t) => t.id === explicitTopicId);
    if (!forced) throw new Error(`Unknown tip topic: ${explicitTopicId}`);
    return forced;
  }

  const state = readState();
  const unpublished = TIP_SHORT_TOPICS.filter((t) => !state.published.includes(t.id));
  if (unpublished.length === 0) {
    throw new Error(
      `All ${TIP_SHORT_TOPICS.length} tip topics are published. Use --topic=ID --force to re-render one topic.`
    );
  }
  return unpublished[0];
}

export function listTipTopics(): Array<TipShortTopic & { published: boolean }> {
  const state = readState();
  return TIP_SHORT_TOPICS.map((t) => ({
    ...t,
    published: state.published.includes(t.id),
  }));
}
