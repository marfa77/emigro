#!/usr/bin/env npx tsx
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";
import { validateSiteDigestQuality, validateTelegramDigestQuality } from "../lib/news/quality";
import { digestHtmlFormatViolation } from "../lib/news/telegram-html";
import { CHANNEL_STYLE_BANNED_RU } from "../lib/news/editorial";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const slug = process.argv[2] || "portugal-relocation-news-2026-06-24";
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: d } = await supabase.from("emigro_news_digests").select("*").eq("slug", slug).single();
  if (!d) {
    console.error("Digest not found:", slug);
    process.exit(1);
  }

  const siteErrors = validateSiteDigestQuality({
    topic: d.topic_key,
    weekEnd: d.week_end,
    digest: {
      title: d.title,
      excerpt: d.excerpt,
      seo_title: d.seo_title,
      seo_description: d.seo_description,
      key_takeaways: d.key_takeaways ?? [],
      content_blocks: d.content_blocks ?? [],
    },
  });

  const tgErrors = validateTelegramDigestQuality({
    topic: d.topic_key,
    weekEnd: d.week_end,
    digestHtml: d.telegram_html ?? "",
  });

  const formatViol = digestHtmlFormatViolation(d.telegram_html ?? "", []);
  const banned = new RegExp(CHANNEL_STYLE_BANNED_RU, "i").exec(
    (d.telegram_html ?? "").replace(/<[^>]+>/g, " ")
  );

  console.log("=== DIGEST AUDIT ===");
  console.log("slug:", d.slug);
  console.log("title:", d.title);
  console.log("telegram_len:", (d.telegram_html ?? "").length);
  console.log("site_factual_errors:", siteErrors.length ? siteErrors : "none");
  console.log("telegram_factual_errors:", tgErrors.length ? tgErrors : "none");
  console.log("telegram_format:", formatViol ?? "ok");
  console.log("banned_phrase:", banned?.[0] ?? "none");
  console.log("threads_posts:", (d.threads_text ?? "").split(/\n\n(?=\d+\/\d+\n)/).length);
  console.log("\n=== THREADS (copy-paste) ===\n");
  console.log(d.threads_text);
  console.log("\n=== EXCERPT ===\n", d.excerpt);
  console.log("\n=== TAKEAWAYS ===\n", (d.key_takeaways ?? []).join("\n"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
