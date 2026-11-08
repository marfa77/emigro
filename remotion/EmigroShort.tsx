import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";
import type { EmigroShortProps, ShortBeat, ShortShot, ShortStat } from "./types";

const { fontFamily } = loadFont("normal", { weights: ["800", "900"], subsets: ["latin", "cyrillic"] });

const YELLOW = "#FFD400";
const STROKE = "rgba(0,0,0,0.92)";

const textStroke = (px: number): React.CSSProperties => ({
  WebkitTextStroke: `${px}px ${STROKE}`,
  paintOrder: "stroke fill",
  textShadow: "0 8px 28px rgba(0,0,0,0.55)",
});

/** Numbers, €, %, and short acronyms (NIF, AIMA, D7) pop in yellow. */
function isHighlightWord(word: string): boolean {
  const bare = word.replace(/[«»"',.!?:;…()—–-]/g, "");
  if (!bare) return false;
  if (/[0-9€%$]/.test(bare)) return true;
  return /^[A-ZА-ЯЁ]{2,}[0-9]*$/.test(bare) && bare.length <= 8;
}

function splitWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/* ---------- Background ---------- */

const ShotLayer: React.FC<{ shot: ShortShot; index: number }> = ({ shot, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = spring({ frame, fps, config: { damping: 18, stiffness: 160 }, durationInFrames: 10 });
  const drift = interpolate(frame, [0, shot.duration], [0, 0.05], { extrapolateRight: "clamp" });
  const scale = 1.14 - 0.14 * punch + drift;
  const panX = (index % 2 === 0 ? -1 : 1) * interpolate(frame, [0, shot.duration], [0, 24], { extrapolateRight: "clamp" });
  const flash = interpolate(frame, [0, 4], [index === 0 ? 0 : 0.28, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(shot.src)}
        startFrom={shot.startFrom}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${panX}px)`,
          filter: "brightness(0.8) saturate(1.18) contrast(1.06)",
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "#ffffff", opacity: flash }} />
    </AbsoluteFill>
  );
};

const Scrims: React.FC = () => (
  <>
    <AbsoluteFill
      style={{ background: "radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.10) 70%)" }}
    />
    <AbsoluteFill
      style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 72%, rgba(0,0,0,0.45) 100%)" }}
    />
  </>
);

/* ---------- Chrome ---------- */

const ProgressBar: React.FC<{ accent: string }> = ({ accent }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = Math.min(100, (frame / Math.max(1, durationInFrames - 1)) * 100);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 12, background: "rgba(255,255,255,0.22)" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: accent, boxShadow: `0 0 18px ${accent}` }} />
    </div>
  );
};

const Brand: React.FC<{ flag: [string, string] }> = ({ flag }) => (
  <div style={{ position: "absolute", top: 70, left: 64, display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}>
      <div style={{ width: 22, height: 36, background: flag[0] }} />
      <div style={{ width: 32, height: 36, background: flag[1] }} />
    </div>
    <div style={{ fontFamily, fontWeight: 900, fontSize: 32, letterSpacing: 3, color: "#fff", ...textStroke(0) }}>EMIGRO</div>
  </div>
);

/* ---------- Hook headline ---------- */

const HookHeadline: React.FC<{ title: string; hookEnd: number }> = ({ title, hookEnd }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = splitWords(title);
  const longest = Math.max(...words.map((w) => w.length), 1);
  const fontSize = title.length > 34 || longest > 12 ? 92 : title.length > 22 ? 108 : 124;
  const exit = interpolate(frame, [hookEnd - 2, hookEnd + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 60,
        right: 60,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignContent: "center",
        gap: "4px 30px",
        minHeight: 420,
        opacity: 1 - exit,
        transform: `translateY(${-80 * exit}px) scale(${1 - 0.15 * exit})`,
      }}
    >
      {words.map((word, i) => {
        const s = spring({ frame: frame - i * 3, fps, config: { damping: 12, stiffness: 180, mass: 0.6 } });
        const box = /[0-9€%]/.test(word);
        const hl = !box && isHighlightWord(word);
        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize,
              lineHeight: 1.04,
              color: box ? "#111" : hl ? YELLOW : "#fff",
              background: box ? YELLOW : "transparent",
              padding: box ? "0 14px" : 0,
              borderRadius: box ? 14 : 0,
              display: "inline-block",
              transform: `scale(${0.4 + 0.6 * s}) translateY(${(1 - s) * 40}px) rotate(${box ? -2 : 0}deg)`,
              opacity: Math.min(1, s * 1.6),
              textTransform: "uppercase",
              ...(box ? {} : textStroke(Math.round(fontSize * 0.1))),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- Kinetic captions ---------- */

const CaptionBeat: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = splitWords(beat.text);
  const totalChars = words.reduce((sum, w) => sum + w.length + 1, 0) || 1;
  const speakFrames = beat.duration * 0.92;
  let acc = 0;
  const starts = words.map((w) => {
    const start = (acc / totalChars) * speakFrames;
    acc += w.length + 1;
    return start;
  });
  const activeIdx = starts.reduce((idx, start, i) => (frame >= start ? i : idx), 0);
  const fontSize = beat.text.length > 30 ? 80 : 92;
  const top = beat.kind === "hook" ? 1040 : 900;
  const isCta = beat.kind === "cta";

  const inner = (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px 30px" }}>
      {words.map((word, i) => {
        const appear = spring({ frame: frame - Math.min(starts[i], i * 3), fps, config: { damping: 14, stiffness: 220, mass: 0.5 } });
        const active = i === activeIdx;
        const hl = isHighlightWord(word);
        return (
          <span
            key={i}
            style={{
              fontFamily,
              fontWeight: 900,
              fontSize: isCta ? fontSize * 0.86 : fontSize,
              lineHeight: 1.12,
              display: "inline-block",
              color: isCta ? (hl ? "#B45309" : "#0F172A") : hl || active ? YELLOW : "#fff",
              transform: `scale(${(0.5 + 0.5 * appear) * (active && !isCta ? 1.08 : 1)}) translateY(${(1 - appear) * 24}px)`,
              opacity: Math.min(1, appear * 1.8),
              ...(isCta ? {} : textStroke(Math.round(fontSize * 0.12))),
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );

  if (isCta) {
    const pop = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
    return (
      <div style={{ position: "absolute", top: top - 40, left: 70, right: 70, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            background: "#ffffff",
            borderRadius: 44,
            padding: "40px 44px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            transform: `scale(${0.6 + 0.4 * pop})`,
            opacity: Math.min(1, pop * 1.5),
          }}
        >
          {inner}
          <div
            style={{
              position: "absolute",
              bottom: -30,
              left: 90,
              width: 0,
              height: 0,
              borderLeft: "26px solid transparent",
              borderRight: "26px solid transparent",
              borderTop: "34px solid #ffffff",
            }}
          />
        </div>
      </div>
    );
  }

  return <div style={{ position: "absolute", top, left: 56, right: 56 }}>{inner}</div>;
};

/* ---------- Stat card ---------- */

function parseStat(value: string): { prefix: string; number: number | null; suffix: string } {
  const m = value.match(/^(\D*?)(\d[\d\s.,]*)(.*)$/);
  if (!m) return { prefix: "", number: null, suffix: value };
  const digits = Number(m[2].replace(/[\s.,]/g, ""));
  return { prefix: m[1], number: Number.isFinite(digits) ? digits : null, suffix: m[3] };
}

function beatMentionsStat(beat: ShortBeat, stat: ShortStat): boolean {
  const text = beat.text.toLowerCase();
  const value = stat.value.toLowerCase().trim();
  if (value && text.includes(value)) return true;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 1 && text.replace(/\D/g, "").includes(digits) && digits.length >= 2;
}

const StatCard: React.FC<{ stat: ShortStat; duration: number }> = ({ stat, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 10, stiffness: 150, mass: 0.7 } });
  const out = interpolate(frame, [duration - 6, duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const parsed = parseStat(stat.value);
  const count = parsed.number === null ? null : Math.round(interpolate(frame, [0, 16], [0, parsed.number], { extrapolateRight: "clamp" }));
  const shown = parsed.number === null ? stat.value : `${parsed.prefix}${count?.toLocaleString("ru-RU")}${parsed.suffix}`;
  return (
    <div
      style={{
        position: "absolute",
        top: 360,
        left: 0,
        right: 0,
        textAlign: "center",
        transform: `scale(${0.3 + 0.7 * pop})`,
        opacity: Math.min(1, pop * 1.6) * out,
      }}
    >
      <div style={{ fontFamily, fontWeight: 900, fontSize: 230, lineHeight: 1, color: YELLOW, ...textStroke(22) }}>{shown}</div>
      <div style={{ fontFamily, fontWeight: 900, fontSize: 56, color: "#fff", marginTop: 12, textTransform: "uppercase", ...textStroke(10) }}>
        {stat.label}
      </div>
    </div>
  );
};

/* ---------- Composition ---------- */

export const EmigroShort: React.FC<EmigroShortProps> = (props) => {
  const shownStats = new Set<string>();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0f19" }}>
      {props.shots.map((shot, i) => (
        <Sequence key={`shot-${i}`} from={shot.from} durationInFrames={shot.duration} layout="none">
          <ShotLayer shot={shot} index={i} />
        </Sequence>
      ))}
      <Scrims />
      <ProgressBar accent={props.accent} />
      <Brand flag={props.flag} />

      <Sequence from={0} durationInFrames={props.hookEnd + 10} layout="none">
        <HookHeadline title={props.hookTitle} hookEnd={props.hookEnd} />
      </Sequence>

      {props.beats.map((beat, i) => {
        const stat = beat.kind === "tip" ? props.stats.find((s) => !shownStats.has(s.value) && beatMentionsStat(beat, s)) : undefined;
        if (stat) shownStats.add(stat.value);
        return (
          <React.Fragment key={`beat-${i}`}>
            {stat ? (
              <Sequence from={beat.from} durationInFrames={Math.max(beat.duration, 45)} layout="none">
                <StatCard stat={stat} duration={Math.max(beat.duration, 45)} />
              </Sequence>
            ) : null}
            <Sequence from={beat.from} durationInFrames={beat.duration} layout="none">
              <CaptionBeat beat={beat} />
            </Sequence>
          </React.Fragment>
        );
      })}

      {props.audio ? <Audio src={staticFile(props.audio)} /> : null}
    </AbsoluteFill>
  );
};
