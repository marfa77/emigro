/**
 * Ensure note body images under /images/… exist on disk and are git-tracked.
 * Prevents prod 404s when CLI deploy ships untracked public/ assets that Git deploys drop.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import type { NoteBodySection } from "@/lib/community-notes/types";

export function collectLocalImageSrcs(sections: NoteBodySection[] | undefined): string[] {
  const out = new Set<string>();
  for (const section of sections ?? []) {
    for (const img of section.images ?? []) {
      if (typeof img.src === "string" && img.src.startsWith("/images/")) {
        out.add(img.src);
      }
    }
  }
  return [...out].sort();
}

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

/** Throws if any /images/… body asset is missing or not committed. */
export function assertBodyImagesCommitted(
  slug: string,
  sections: NoteBodySection[] | undefined
): void {
  const srcs = collectLocalImageSrcs(sections);
  if (srcs.length === 0) return;

  const errors: string[] = [];
  for (const src of srcs) {
    const rel = path.join("public", src.replace(/^\//, ""));
    if (!fs.existsSync(path.join(process.cwd(), rel))) {
      errors.push(`missing file ${rel}`);
      continue;
    }
    if (!isGitTracked(rel)) {
      errors.push(`NOT in git (prod Git deploy will 404): ${rel}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Body image gate (${slug}): ${errors.join("; ")}. ` +
        `git add public/images/… && commit + push — never ship photos via CLI-only deploy.`
    );
  }
}
