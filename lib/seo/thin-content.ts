import type { Metadata } from "next";

/**
 * Min published notes for a satellite tag page to be indexable.
 * Keep in sync with sitemap.ts tag URL inclusion (Barakhlo thin-content gate).
 */
export const MIN_TAG_NOTES_INDEXABLE = 2;

export function shouldNoindexTagPage(noteCount: number): boolean {
  return noteCount < MIN_TAG_NOTES_INDEXABLE;
}

export function tagPageRobots(noteCount: number): Metadata["robots"] | undefined {
  if (shouldNoindexTagPage(noteCount)) {
    return { index: false, follow: true };
  }
  return undefined;
}
