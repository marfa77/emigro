/** Path helpers — pure, no DB. */

export function buildNewsDigestSlug(topicKey: string, weekEnd: string): string {
  return `${topicKey}-relocation-news-${weekEnd.slice(0, 10)}`;
}

export function newsArticlePath(slug: string): string {
  return `/ru/news/${slug}`;
}

export function newsIndexPath(country?: string): string {
  return country ? `/ru/news?country=${country}` : "/ru/news";
}
