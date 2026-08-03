export const STORIES_INDEX_PATH = "/ru/stories";
export const STORIES_SUBMIT_PATH = "/ru/stories/submit";

export function storyPath(slug: string): string {
  return `/ru/stories/${slug}`;
}

export function storySubmitPath(params?: { guide?: string; disagree?: boolean }): string {
  if (!params?.guide && !params?.disagree) return STORIES_SUBMIT_PATH;
  const q = new URLSearchParams();
  if (params.guide) q.set("guide", params.guide);
  if (params.disagree) q.set("disagree", "1");
  return `${STORIES_SUBMIT_PATH}?${q.toString()}`;
}
