/** Path helpers — pure, no DB. */

export function buildNewsDigestSlug(topicKey: string, weekEnd: string): string {
  return `${topicKey}-relocation-news-${weekEnd.slice(0, 10)}`;
}

/** Single-story tile slug: `{topic}-story-YYYY-MM-DD-{hash}` */
export function buildNewsStorySlug(topicKey: string, dateYmd: string, urlOrId: string): string {
  const day = dateYmd.slice(0, 10);
  let hash = 0;
  for (let i = 0; i < urlOrId.length; i += 1) {
    hash = (hash * 31 + urlOrId.charCodeAt(i)) >>> 0;
  }
  const short = hash.toString(36).slice(0, 6);
  return `${topicKey}-story-${day}-${short}`;
}

export function isNewsStorySlug(slug: string): boolean {
  return /^[a-z]+-story-\d{4}-\d{2}-\d{2}-[a-z0-9]+$/.test(slug);
}

export function isNewsDigestSlug(slug: string): boolean {
  return /^[a-z]+-relocation-news-\d{4}-\d{2}-\d{2}$/.test(slug);
}

export function isRevalidatableNewsSlug(slug: string): boolean {
  return isNewsDigestSlug(slug) || isNewsStorySlug(slug);
}

export function newsArticlePath(slug: string): string {
  return `/ru/news/${slug}`;
}

export function newsIndexPath(country?: string): string {
  return country ? `/ru/news?country=${country}` : "/ru/news";
}
