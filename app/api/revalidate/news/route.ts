import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { pingIndexNow } from "@/lib/seo/indexnow";
import { newsArticleUrl, publicSiteUrl } from "@/lib/site-url";

function authorized(request: Request): boolean {
  const secret =
    process.env.CRON_SECRET?.trim() || process.env.EMIGRO_ADMIN_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let slugs: string[] = [];
  try {
    const body = (await request.json()) as { slugs?: string[] };
    slugs = Array.isArray(body.slugs) ? body.slugs.filter((s) => typeof s === "string") : [];
  } catch {
    /* empty body ok */
  }

  const paths = new Set<string>(["/ru/news", "/ru/news/feed.xml", "/ru", "/ru/guides"]);
  for (const slug of slugs) {
    if (/^[a-z]+-relocation-news-\d{4}-\d{2}-\d{2}$/.test(slug)) {
      paths.add(`/ru/news/${slug}`);
    }
  }

  const pathList = Array.from(paths);
  for (const path of pathList) {
    revalidatePath(path);
  }

  revalidateTag(CACHE_TAGS.newsDigests);
  revalidateTag(CACHE_TAGS.newsTopics);

  const site = publicSiteUrl();
  const indexNowUrls = pathList.map((p) => `${site}${p}`);
  for (const slug of slugs) {
    if (/^[a-z]+-relocation-news-\d{4}-\d{2}-\d{2}$/.test(slug)) {
      indexNowUrls.push(newsArticleUrl(slug));
    }
  }
  void pingIndexNow(Array.from(new Set(indexNowUrls)));

  return NextResponse.json({ revalidated: pathList });
}
