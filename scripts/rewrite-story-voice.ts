#!/usr/bin/env npx tsx
/**
 * One-off: rewrite published story tiles that slipped into press-wire tone.
 *
 *   npx tsx scripts/rewrite-story-voice.ts sweden-story-2026-08-06-1scadi portugal-story-2026-08-08-1dwd14
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { storyEditorialVoiceForTopic } from "../lib/news/story-editorial-voice";
import { geminiFastJson } from "../lib/news/gemini";
import { mapNewsTopicRow, type NewsTopicRow } from "../lib/news/topics/queries";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const slugs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (slugs.length === 0) {
    console.error("Usage: npx tsx scripts/rewrite-story-voice.ts <slug>...");
    process.exit(1);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, ""),
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  for (const slug of slugs) {
    const { data: row, error } = await supabase
      .from("emigro_news_digests")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !row) {
      console.error("missing", slug, error?.message);
      continue;
    }

    const { data: topicRow } = await supabase
      .from("emigro_news_topics")
      .select("*")
      .eq("key", row.topic_key)
      .maybeSingle();
    const topic = topicRow ? mapNewsTopicRow(topicRow as NewsTopicRow) : null;
    const topicKey = row.topic_key as string;

    const paras = (row.content_blocks?.[0]?.paragraphs ?? []) as string[];
    const draft = {
      title: row.title as string,
      excerpt: row.excerpt as string,
      seo_title: (row.seo_title as string) || (row.title as string),
      seo_description: (row.seo_description as string) || (row.excerpt as string),
      paragraphs: paras,
      key_takeaways: (row.key_takeaways as string[]) ?? [],
      tags: (row.tags as string[]) ?? [],
    };

    const system = `Перепиши новостную плитку Emigro. Сохрани ВСЕ факты, имена, цифры, даты. Не добавляй нового.
Коридор: ${topic?.countryRu || topicKey}.
${storyEditorialVoiceForTopic(topicKey)}
Верни JSON с полями title, excerpt, seo_title, seo_description, paragraphs, key_takeaways, tags.`;

    const schema = {
      type: "OBJECT",
      properties: {
        title: { type: "STRING" },
        excerpt: { type: "STRING" },
        seo_title: { type: "STRING" },
        seo_description: { type: "STRING" },
        paragraphs: { type: "ARRAY", items: { type: "STRING" } },
        key_takeaways: { type: "ARRAY", items: { type: "STRING" } },
        tags: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["title", "excerpt", "seo_title", "seo_description", "paragraphs", "key_takeaways", "tags"],
    };

    const rewritten = await geminiFastJson<typeof draft>(system, JSON.stringify(draft), schema, 3072, {
      thinkingBudget: 0,
    });

    const content_blocks = [
      {
        ...(row.content_blocks?.[0] || {}),
        heading: rewritten.title.slice(0, 80),
        paragraphs: rewritten.paragraphs.map((p) => p.trim()).filter(Boolean).slice(0, 4),
      },
    ];

    const { error: upErr } = await supabase
      .from("emigro_news_digests")
      .update({
        title: rewritten.title.trim().slice(0, 120),
        excerpt: rewritten.excerpt.trim().slice(0, 320),
        seo_title: (rewritten.seo_title || rewritten.title).trim().slice(0, 70),
        seo_description: (rewritten.seo_description || rewritten.excerpt).trim().slice(0, 155),
        key_takeaways: (rewritten.key_takeaways ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 3),
        tags: (rewritten.tags ?? draft.tags).map((t) => t.trim()).filter(Boolean).slice(0, 5),
        content_blocks,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (upErr) {
      console.error("update failed", slug, upErr.message);
      continue;
    }
    console.log("✓", slug);
    console.log("  title:", rewritten.title);
    console.log("  excerpt:", rewritten.excerpt);
    console.log("  p0:", rewritten.paragraphs[0]?.slice(0, 160));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
