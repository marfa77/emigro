#!/usr/bin/env npx tsx
/**
 * Re-render an Emigro Short with Remotion from a saved props.json + public dir,
 * without re-running script/TTS/b-roll. Used to iterate on remotion/EmigroShort.tsx.
 *
 *   npx tsx scripts/remotion-preview-short.ts <workDir> [out.mp4] [--frames=0-90]
 *
 * <workDir> must contain props.json and public/ (written by remotion-render.ts).
 */
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import { SHORT_COMPOSITION_ID } from "../remotion/types";

async function main() {
  const workDir = path.resolve(process.argv[2] ?? "");
  const out = path.resolve(process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : path.join(workDir, "preview.mp4"));
  const framesArg = process.argv.find((a) => a.startsWith("--frames="))?.split("=")[1];
  const stills = process.argv.find((a) => a.startsWith("--stills="))?.split("=")[1];
  const props = JSON.parse(fs.readFileSync(path.join(workDir, "props.json"), "utf8"));

  const serveUrl = await bundle({
    entryPoint: path.join(process.cwd(), "remotion", "index.ts"),
    publicDir: path.join(workDir, "public"),
  });
  const composition = await selectComposition({ serveUrl, id: SHORT_COMPOSITION_ID, inputProps: props });

  if (stills) {
    for (const f of stills.split(",").map(Number)) {
      const file = path.join(workDir, `still-${f}.png`);
      await renderStill({ composition, serveUrl, frame: f, output: file, inputProps: props });
      console.log(file);
    }
    return;
  }

  const frameRange = framesArg
    ? (framesArg.split("-").map(Number) as [number, number])
    : undefined;
  await renderMedia({
    composition,
    serveUrl,
    codec: "h264",
    crf: 20,
    outputLocation: out,
    inputProps: props,
    frameRange,
    concurrency: Number(process.env.EMIGRO_YOUTUBE_SHORTS_REMOTION_CONCURRENCY || "4"),
  });
  console.log(out);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
