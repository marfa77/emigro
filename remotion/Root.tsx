import React from "react";
import { Composition } from "remotion";
import { EmigroShort } from "./EmigroShort";
import { SHORT_COMPOSITION_ID, type EmigroShortProps } from "./types";

const defaultProps: EmigroShortProps = {
  fps: 30,
  durationInFrames: 90,
  audio: "",
  shots: [],
  beats: [{ text: "Emigro", from: 0, duration: 90, kind: "hook" }],
  hookTitle: "Emigro",
  hookEnd: 90,
  stats: [],
  accent: "#FFD400",
  flag: ["#046A38", "#DA291C"],
  handle: "@Emigro_news",
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id={SHORT_COMPOSITION_ID}
    component={EmigroShort as unknown as React.FC<Record<string, unknown>>}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={90}
    defaultProps={defaultProps as unknown as Record<string, unknown>}
    calculateMetadata={({ props }) => {
      const p = props as unknown as EmigroShortProps;
      return { durationInFrames: Math.max(1, p.durationInFrames), fps: p.fps };
    }}
  />
);
