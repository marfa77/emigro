/**
 * Default share card for pages without their own image. Served as /images/og/emigro-card-2026-11.jpg
 * (og-default.jpg keeps the same content for code that reads the file by its old name).
 * Plain typographic card in Emigro colours — replaced the AI "dashboard" render on 2026-11-19.
 *
 *   npx tsx scripts/generate-default-og.tsx
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import React from "react";
import { ImageResponse } from "next/og";

const POINTS = ["Бесплатно", "Официальные источники", "Паспорта RU · BY · UA · KZ"];

function Card() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px 56px",
        background: "linear-gradient(135deg, #0b1f3a 0%, #12355f 55%, #1d4ed8 100%)",
        color: "#ffffff",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 6, opacity: 0.9 }}>EMIGRO</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 66, fontWeight: 700, lineHeight: 1.12, maxWidth: 1000 }}>
          Подбор ВНЖ в Европе по паспорту, доходу и семье
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 34 }}>
          {POINTS.map((point) => (
            <div
              key={point}
              style={{
                display: "flex",
                fontSize: 26,
                padding: "10px 22px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.28)",
              }}
            >
              {point}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 28, opacity: 0.85 }}>www.emigro.online</div>
    </div>
  );
}

async function main() {
  const res = new ImageResponse(<Card />, { width: 1200, height: 630 });
  // ImageResponse renders PNG; OG routes embed this file as image/jpeg, so convert to a real JPEG.
  const out = path.join(process.cwd(), "public/images/og/og-default.jpg");
  const png = path.join(process.cwd(), "public/images/og/.og-default.png");
  writeFileSync(png, Buffer.from(await res.arrayBuffer()));
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "90", png, "--out", out]);
  rmSync(png);
  // New file name = new URL, so Telegram/Threads re-fetch instead of serving their cached old image.
  copyFileSync(out, path.join(process.cwd(), "public/images/og/emigro-card-2026-11.jpg"));
  console.log(`Wrote ${out} and emigro-card-2026-11.jpg`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
