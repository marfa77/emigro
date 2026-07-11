#!/usr/bin/env npx tsx
/**
 * One-off fix: Germany citizenship 8-year → 5/3 years in published news digests.
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CITIZENSHIP_5_3_RU =
  "Стандартный срок для получения гражданства — 5 лет легального проживания (реформа StAG с 27 июня 2024); при немецком C1 и особых интеграционных достижениях возможно ускорение до 3 лет.";

const TAKEAWAY_5_3_RU =
  "Стандартный срок проживания для натурализации по StAG (с 27 июня 2024) — 5 лет легального проживания; при немецком C1 и особых интеграционных достижениях — ускорение до 3 лет.";

async function fixJuly10() {
  const slug = "germany-relocation-news-2026-07-10";
  const { data: d, error } = await supabase.from("emigro_news_digests").select("*").eq("slug", slug).single();
  if (error || !d) throw new Error(`Digest not found: ${slug}`);

  const key_takeaways = [...(d.key_takeaways ?? [])];
  key_takeaways[1] = TAKEAWAY_5_3_RU;

  const content_blocks = [...(d.content_blocks ?? [])];
  const bamf = content_blocks.find((b) => /bamf/i.test(b.heading ?? ""));
  if (bamf?.paragraphs?.[0]) {
    bamf.paragraphs[0] =
      "Федеральное ведомство по делам миграции и беженцев (BAMF) определяет правила для всех типов ВНЖ, обязательства по интеграционным курсам и критерии натурализации. " +
      CITIZENSHIP_5_3_RU;
  }

  let threads_text = d.threads_text ?? "";
  threads_text = threads_text.replace(
    /Стандартный срок для получения гражданства — 8 лет законного проживания в Германии, однако правила BAMF предусматривают возможность его сокращения\./g,
    CITIZENSHIP_5_3_RU
  );

  const { error: upErr } = await supabase
    .from("emigro_news_digests")
    .update({ key_takeaways, content_blocks, threads_text, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (upErr) throw upErr;
  console.log("fixed:", slug);
}

async function fixJune24() {
  const slug = "germany-relocation-news-2026-06-24";
  const { data: d, error } = await supabase.from("emigro_news_digests").select("*").eq("slug", slug).single();
  if (error || !d) throw new Error(`Digest not found: ${slug}`);

  let telegram_html = d.telegram_html ?? "";
  telegram_html = telegram_html
    .replace(
      /Разъяснены правила получения гражданства Германии, включая стандартный срок 8 лет и возможности его сокращения до 5 или 3 лет при особых успехах в интеграции\./g,
      "Разъяснены правила получения гражданства Германии: стандартный срок 5 лет (StAG 2024), ускорение до 3 лет при C1 и особой интеграции, разрешено двойное гражданство."
    )
    .replace(
      /• Значительные сроки натурализации \(8 лет\) требуют долгосрочного планирования\./g,
      "• Срок натурализации — 5 лет (ускорение до 3 лет при C1); учитывайте в долгосрочном плане."
    );

  const { error: upErr } = await supabase
    .from("emigro_news_digests")
    .update({ telegram_html, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  if (upErr) throw upErr;
  console.log("fixed:", slug);
}

async function main() {
  await fixJuly10();
  await fixJune24();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
