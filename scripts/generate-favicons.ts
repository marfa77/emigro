/**
 * Generates static PNG favicons in public/ for Yandex (32×32, 120×120) and Apple touch.
 * Run: npx tsx scripts/generate-favicons.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";
import { ImageResponse } from "next/og";
import { EmigroIconMark } from "../lib/brand/emigro-icon-mark";

async function writeIcon(size: number, filename: string) {
  const res = new ImageResponse(React.createElement(EmigroIconMark), { width: size, height: size });
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(process.cwd(), "public", filename), buffer);
  console.log(`Wrote public/${filename} (${size}×${size})`);
}

async function main() {
  await writeIcon(32, "icon-32.png");
  await writeIcon(120, "icon-120.png");
  await writeIcon(180, "apple-touch-icon.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
