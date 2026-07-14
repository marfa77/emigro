/** Next.js Data Cache tags — use with revalidateTag after DB writes. */
export const CACHE_TAGS = {
  newsTopics: "news-topics",
  newsDigests: "news-digests",
  programs: "programs",
  corridors: "corridors",
  wizardPulse: "wizard-pulse",
  wizards: "wizards",
} as const;

export const CACHE_REVALIDATE = {
  topics: 3600,
  programs: 3600,
  corridors: 3600,
  newsDigests: 300,
  wizardPulse: 900,
} as const;
