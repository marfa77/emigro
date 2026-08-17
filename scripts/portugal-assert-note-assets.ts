/**
 * Fail if community-note body images under public/ are missing or not git-tracked.
 * Root cause of prod 404s: CLI deploy uploaded untracked assets, then Git deploy wiped them.
 *
 *   npm run portugal:assert-note-assets
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { PORTO_NEWBUILD_CLUSTERS_GUIDE } from "@/lib/community-notes/guides/porto-newbuild-clusters-2026";
import { MATOSINHOS_LIFE_GUIDE } from "@/lib/community-notes/guides/matosinhos-life";
import { PORTO_DISTRICTS_GUIDE } from "@/lib/community-notes/guides/porto-districts-life";
import { WINES_WINERIES_NORTE_GUIDE } from "@/lib/community-notes/guides/wines-wineries-norte-portugal";
import {
  assertBodyImagesCommitted,
  collectLocalImageSrcs,
} from "@/lib/community-notes/assert-body-images-committed";
import { hasNoteOgImage } from "@/lib/community-notes/note-og-image";

/** Hand guides that ship local inline photos — extend when adding new photo packs. */
const GUIDES_WITH_LOCAL_IMAGES = [
  PORTO_NEWBUILD_CLUSTERS_GUIDE,
  MATOSINHOS_LIFE_GUIDE,
  PORTO_DISTRICTS_GUIDE,
  WINES_WINERIES_NORTE_GUIDE,
];

function isGitTracked(relPath: string): boolean {
  try {
    execFileSync("git", ["ls-files", "--error-unmatch", "--", relPath], {
      stdio: ["ignore", "ignore", "ignore"],
    });
    return true;
  } catch {
    return false;
  }
}

function main() {
  const errors: string[] = [];

  for (const guide of GUIDES_WITH_LOCAL_IMAGES) {
    try {
      assertBodyImagesCommitted(guide.slug, guide.body_sections);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
      continue;
    }

    const srcs = collectLocalImageSrcs(guide.body_sections);
    const ogRel = path.join("public/images/community-notes", `${guide.slug}.webp`);

    // Always require OG for listed guides (hero 404s even when body has no local photos).
    if (!hasNoteOgImage(guide.slug)) {
      errors.push(
        `${guide.slug}: missing committed OG WebP public/images/community-notes/${guide.slug}.webp (+ note-og-slugs.ts)`
      );
    } else if (!isGitTracked(ogRel)) {
      errors.push(`${guide.slug}: OG WebP exists but is NOT in git: ${ogRel}`);
    }

    if (srcs.length === 0) continue;
  }

  if (errors.length > 0) {
    console.error("portugal:assert-note-assets FAILED:\n" + errors.map((e) => `  - ${e}`).join("\n"));
    console.error(
      "\nFix: git add the files under public/images/… then commit + push. Never ship photos via CLI-only deploy."
    );
    process.exit(1);
  }

  console.log("portugal:assert-note-assets OK — local note images are on disk and git-tracked.");
}

main();
