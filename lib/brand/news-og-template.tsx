import React from "react";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { COUNTRY_ACCENTS, countryAccent, countryOgImage } from "@/lib/brand/country-accents";
import { loadOgBackgroundDataUrl } from "@/lib/brand/guide-og-template";

export type NewsOgTemplateProps = {
  title: string;
  countryLabel: string;
  flag: string;
  dateLabel: string;
  /** urlSegment e.g. portugal, sweden */
  segment?: string;
  backgroundDataUrl: string;
  accentFrom: string;
  accentTo: string;
  accentGlow: string;
};

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

function hexToRgba(hex: string, alpha: number): string {
  const raw = hex.replace("#", "").trim();
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (raw.length !== 6) return `rgba(2,6,23,${alpha})`;
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Resolve corridor JPG data URL for a country segment (fallback og-default). */
export function loadNewsOgBackground(segment?: string): string {
  const ogPath = countryOgImage(segment); // /images/og/corridor-….jpg
  const relative = ogPath.replace(/^\/images\/og\//, "");
  const abs = path.join(process.cwd(), "public", "images", "og", relative);
  if (existsSync(abs)) return loadOgBackgroundDataUrl(relative);
  return loadOgBackgroundDataUrl("og-default.jpg");
}

export function newsOgAccent(segment?: string) {
  const a = countryAccent(segment);
  return {
    from: a.from,
    to: a.to,
    glow: a.glow,
    label: (segment && COUNTRY_ACCENTS[segment]?.label) || "Emigro",
  };
}

export function NewsOgTemplate({
  title,
  countryLabel,
  flag,
  dateLabel,
  backgroundDataUrl,
  accentFrom,
  accentTo,
  accentGlow,
}: NewsOgTemplateProps) {
  const overlay = `linear-gradient(115deg, ${hexToRgba(accentFrom, 0.92)} 0%, ${hexToRgba(accentTo, 0.78)} 48%, ${hexToRgba(accentFrom, 0.22)} 100%)`;
  const pillBorder = hexToRgba(accentGlow, 0.55);
  const pillBg = hexToRgba(accentGlow, 0.18);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        color: "#ffffff",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backgroundDataUrl}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          background: overlay,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 8,
          display: "flex",
          background: `linear-gradient(90deg, ${accentFrom} 0%, ${accentGlow} 50%, ${accentTo} 100%)`,
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "52px 56px 48px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              borderRadius: 999,
              background: pillBg,
              border: `1px solid ${pillBorder}`,
              padding: "10px 18px",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            EMIGRO · МОЛНИЯ
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 980,
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            {truncate(title, 100)}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {flag} {countryLabel}
            {dateLabel ? ` · ${dateLabel}` : ""}
          </div>
          <div
            style={{
              display: "flex",
              borderRadius: 999,
              background: accentFrom,
              padding: "12px 22px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            www.emigro.online
          </div>
        </div>
      </div>
    </div>
  );
}
