/** Props for the EmigroShort composition. All media paths are file names inside the render's publicDir. */
export type ShortBeatKind = "hook" | "tip" | "cta";

export type ShortBeat = {
  text: string;
  /** Start frame. */
  from: number;
  /** Length in frames. */
  duration: number;
  kind: ShortBeatKind;
};

export type ShortShot = {
  src: string;
  from: number;
  duration: number;
  /** Frame offset inside the clip. */
  startFrom: number;
};

export type ShortStat = { value: string; label: string };

export type EmigroShortProps = {
  fps: number;
  durationInFrames: number;
  audio: string;
  shots: ShortShot[];
  beats: ShortBeat[];
  hookTitle: string;
  /** Frame where the hook segment ends (headline leaves). */
  hookEnd: number;
  stats: ShortStat[];
  accent: string;
  flag: [string, string];
  handle: string;
};

export const SHORT_COMPOSITION_ID = "EmigroShort";
