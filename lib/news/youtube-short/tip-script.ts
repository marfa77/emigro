import {
  RU_TTS_SPEED,
  SHORT_DURATION_ESTIMATE_MAX,
  SHORT_DURATION_MIN,
  SHORT_DURATION_TARGET_MAX,
  SHORT_DURATION_TARGET_MIN,
  SHORT_WORDS_PER_SECOND,
} from "./config";
import { compact, wordCount } from "./text-utils";
import type { ScriptSegment } from "./types";
import type { TipShortScript } from "./script-writer";
import type { TipShortTopic } from "./topics";

export function buildTipSegments(script: TipShortScript, topic: TipShortTopic): ScriptSegment[] {
  const stats = script.highlight_stats ?? [];
  return [
    {
      kind: "hook",
      visualTitle: script.visual_hook,
      visualBody: topic.title,
      sourceLabel: `${topic.country} · лайфхак`,
      text: script.hook,
      pauseAfter: 0.25,
      highlightStats: stats,
    },
    {
      kind: "tip",
      visualTitle: "Суть",
      visualBody: script.visual_body,
      sourceLabel: "Emigro — проверенные шаги",
      text: script.body,
      pauseAfter: 0.3,
      highlightStats: stats,
    },
    {
      kind: "cta",
      visualTitle: "Подробнее",
      visualBody: "emigro.online/ru/portugal",
      sourceLabel: "@Emigro_news",
      text: script.cta,
      pauseAfter: 0.35,
      highlightStats: stats,
    },
  ];
}

/** Total pauseAfter across hook/tip/cta segments in buildTipSegments. */
export const TIP_SEGMENT_PAUSE_TOTAL = 0.25 + 0.3 + 0.35;

export function estimateTipDurationSeconds(segments: ScriptSegment[]): number {
  const words = segments.reduce((sum, s) => sum + wordCount(s.text), 0);
  const pauses = segments.reduce((sum, s) => sum + s.pauseAfter, 0);
  return words / (SHORT_WORDS_PER_SECOND * RU_TTS_SPEED) + pauses;
}

export function minWordsForDuration(seconds: number): number {
  return Math.ceil((seconds - TIP_SEGMENT_PAUSE_TOTAL) * SHORT_WORDS_PER_SECOND * RU_TTS_SPEED);
}

export function maxWordsForDuration(seconds: number): number {
  return Math.floor((seconds - TIP_SEGMENT_PAUSE_TOTAL) * SHORT_WORDS_PER_SECOND * RU_TTS_SPEED);
}

export function durationTargetBandLabel(): string {
  return `${SHORT_DURATION_TARGET_MIN}–${SHORT_DURATION_TARGET_MAX}s`;
}

export function assertTipDurationEstimate(segments: ScriptSegment[]): void {
  const estimate = estimateTipDurationSeconds(segments);
  if (estimate < SHORT_DURATION_MIN || estimate > SHORT_DURATION_ESTIMATE_MAX) {
    throw new Error(
      `Estimated duration ${estimate.toFixed(1)}s outside ${SHORT_DURATION_MIN}–${SHORT_DURATION_ESTIMATE_MAX}s pre-render band`
    );
  }
}

export { compact, wordCount };
