import React from "react";
import { readFileSync } from "node:fs";
import path from "node:path";

type GuideOgTemplateProps = {
  title: string;
  subtitle: string;
  backgroundDataUrl: string;
};

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function corridorWebpToOgJpg(coverWebp: string): string {
  const match = coverWebp.match(/corridor-([a-z]+)\.webp$/);
  if (match) return `corridor-${match[1]}.jpg`;
  return "og-default.jpg";
}

export function loadOgBackgroundDataUrl(relativePath: string): string {
  const filePath = path.join(process.cwd(), "public", "images", "og", relativePath);
  const buffer = readFileSync(filePath);
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

export function GuideOgTemplate({ title, subtitle, backgroundDataUrl }: GuideOgTemplateProps) {
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
          background: "linear-gradient(105deg, rgba(2,6,23,0.88) 0%, rgba(2,6,23,0.72) 42%, rgba(2,6,23,0.18) 100%)",
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
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.22)",
              padding: "10px 18px",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            EMIGRO GUIDE
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 28,
              maxWidth: 920,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 54,
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              {truncate(title, 88)}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 28,
                lineHeight: 1.35,
                color: "rgba(255,255,255,0.92)",
                maxWidth: 880,
              }}
            >
              {truncate(subtitle, 132)}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            borderRadius: 999,
            background: "#2563eb",
            padding: "14px 24px",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          www.emigro.online
        </div>
      </div>
    </div>
  );
}
