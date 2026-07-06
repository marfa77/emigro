import fs from "fs";
import path from "path";
import { youtubeShortsOutputRoot } from "./config";
import { todayYmd } from "./text-utils";
import { TIP_SHORT_TOPICS, type TipShortTopic } from "./topics";

type PublishedState = {
  published: string[];
  last_published_at?: string;
  last_topic_id?: string;
  /** UTC date of last successful daily run (one short per day). */
  last_success_date?: string;
};

function statePath(): string {
  const custom = process.env.EMIGRO_YOUTUBE_SHORTS_STATE_FILE?.trim();
  if (custom) return custom;
  return path.join(path.dirname(youtubeShortsOutputRoot()), "youtube-shorts-state.json");
}

function readState(): PublishedState {
  const file = statePath();
  if (!fs.existsSync(file)) return { published: [] };
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as PublishedState;
  } catch {
    return { published: [] };
  }
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

export function pickNextTipTopic(forceTopicId?: string): TipShortTopic {
  if (forceTopicId) {
    const forced = TIP_SHORT_TOPICS.find((t) => t.id === forceTopicId);
    if (!forced) throw new Error(`Unknown tip topic: ${forceTopicId}`);
    return forced;
  }

  const state = readState();
  const unpublished = TIP_SHORT_TOPICS.filter((t) => !state.published.includes(t.id));
  if (unpublished.length > 0) return unpublished[0];

  // All topics published once — start a new cycle (never repeat yesterday's topic).
  const cycle = TIP_SHORT_TOPICS.filter((t) => t.id !== state.last_topic_id);
  const next = cycle[0] ?? TIP_SHORT_TOPICS[0];
  writeState({ ...state, published: [], last_topic_id: state.last_topic_id });
  return next;
}

export function listTipTopics(): Array<TipShortTopic & { published: boolean }> {
  const state = readState();
  return TIP_SHORT_TOPICS.map((t) => ({
    ...t,
    published: state.published.includes(t.id),
  }));
}
