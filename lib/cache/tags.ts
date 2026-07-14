/** Next.js Data Cache tags — use with revalidateTag after DB writes. */
export const CACHE_TAGS = {
  newsTopics: "news-topics",
  newsDigests: "news-digests",
  programs: "programs",
  corridors: "corridors",
  corridorSegments: "corridor-segments",
  wizardPulse: "wizard-pulse",
  wizards: "wizards",
  communityNotes: "community-notes",
  guides: "guides",
} as const;

export const CACHE_REVALIDATE = {
  topics: 3600,
  programs: 3600,
  corridors: 3600,
  corridorSegments: 3600,
  newsDigests: 300,
  wizardPulse: 900,
  communityNotes: 300,
  guides: 3600,
} as const;
