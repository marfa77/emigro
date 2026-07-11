#!/usr/bin/env npx tsx
/**
 * One-off fix: Sweden PMJ/protection-status fact-check (scandinavia-relocation-news-2026-07-05).
 * - Clarify: already granted PMJ is NOT revoked — only new decisions from 12 July 2026
 * - Add citizenship path without PMJ (well-founded LTR prospects / 10 years residence)
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SLUG = "scandinavia-relocation-news-2026-07-05";

const MIGRATIONSVERKET_SOURCE = {
  url: "https://www.migrationsverket.se/nyheter/news-archive/2026-06-18-no-permanent-residence-permits-for-former-asylum-seekers-or-their-family-members.html",
  title: "Migrationsverket",
};

const EXCERPT_RU =
  "С 12 июля 2026 Швеция прекращает выдавать новые ПМЖ держателям гуманитарных статусов (при продлении — пятилетний ВНЖ); уже выданные ПМЖ сохраняются. С 13 июля шесть госорганов будут обязаны сообщать о резидентах без документов.";

const SEO_DESC_RU =
  "С 12 июля 2026 Швеция не выдаёт новые ПМЖ беженцам и воссоединившимся с ними — уже выданные сохраняются. Гражданство возможно без ПМЖ при перспективах LTR.";

const TAKEAWAY_PMJ_RU =
  "С 12 июля 2026 при новых решениях и продлении беженцы, получатели субсидиарной защиты, воссоединившиеся с ними родственники и LTR больше не получат ПМЖ — вместо него пятилетний продлеваемый ВНЖ. Уже выданные ПМЖ не отзываются.";

const TAKEAWAY_CITIZENSHIP_RU =
  "Для гражданства с 12 июля ПМЖ не обязателен: достаточно обоснованных перспектив продления LTR-статуса; при 10 годах легального проживания это условие тоже не требуется (Migrationsverket).";

const BLOCK1_P1_RU =
  "С 12 июля 2026 года в Швеции вступает в силу закон (proposition 2025/26:262), прекращающий выдачу новых постоянных видов на жительство (ПМЖ) для держателей защитных статусов. Лица с ВНЖ на основании убежища, субсидиарной защиты, «исключительно тяжёлых обстоятельств», препятствий к исполнению высылки, воссоединившиеся с ними родственники, а также LTR при новых решениях больше не получат ПМЖ.";

const BLOCK1_P2_RU =
  "Вместо ПМЖ при продлении им будут выдавать пятилетний продлеваемый ВНЖ. Уже выданные ПМЖ не отзываются — меняются только новые решения с 12 июля. Параллельно для гражданства снимается требование ПМЖ: заявители со статусом защиты смогут подавать при обоснованных перспективах продления LTR; при 10 годах легального проживания это условие не требуется. ПМЖ по работе, бизнесу, финансовой независимости и для исследователей сохраняется.";

const THREADS_BLOCK3_RU =
  "С 12 июля 2026 (proposition 2025/26:262) при новых решениях беженцы, субсидиарная защита, воссоединившиеся родственники и LTR получают пятилетний продлеваемый ВНЖ вместо ПМЖ. Уже выданные ПМЖ не отзываются. Для гражданства с 12 июля ПМЖ не нужен при обоснованных перспективах продления LTR или после 10 лет проживания (Migrationsverket).";

async function main() {
  const { data: d, error } = await supabase.from("emigro_news_digests").select("*").eq("slug", SLUG).single();
  if (error || !d) throw new Error(`Digest not found: ${SLUG}`);

  const key_takeaways = [...(d.key_takeaways ?? [])];
  const pmjIdx = key_takeaways.findIndex((t: string) => /12 июля 2026.*пмж|пмж.*12 июля/i.test(t));
  if (pmjIdx >= 0) key_takeaways[pmjIdx] = TAKEAWAY_PMJ_RU;
  if (!key_takeaways.some((t: string) => /гражданств|натурализ|citizenship/i.test(t))) {
    key_takeaways.splice(1, 0, TAKEAWAY_CITIZENSHIP_RU);
  }

  const content_blocks = [...(d.content_blocks ?? [])];
  const pmjBlock = content_blocks.find((b) => /пмж|гуманитарн/i.test(b.heading ?? ""));
  if (pmjBlock) {
    pmjBlock.paragraphs = [BLOCK1_P1_RU, BLOCK1_P2_RU];
    pmjBlock.source_name = "Migrationsverket";
    pmjBlock.source_url = MIGRATIONSVERKET_SOURCE.url;
  }

  let threads_text = d.threads_text ?? "";
  threads_text = threads_text
    .replace(
      /С 12 июля 2026 года Швеция прекращает выдачу ПМЖ обладателям гуманитарных статусов, заменяя его на продлеваемый ВНЖ\./,
      "С 12 июля 2026 Швеция прекращает выдавать новые ПМЖ держателям гуманитарных статусов (при продлении — пятилетний ВНЖ); уже выданные ПМЖ сохраняются."
    )
    .replace(
      /С 12 июля 2026 года в Швеции вступает в силу закон, отменяющий постоянный вид на жительство \(ПМЖ\) для определённых категорий резидентов\. Лица, имеющие или запрашивающие ВНЖ на основании убежища, дополнительной защиты, «исключительно тяжелых обстоятельств» или статуса долгосрочного резидента \(LTR\), больше не смогут претендовать на ПМЖ\./,
      THREADS_BLOCK3_RU
    )
    .replace(
      /С 12 июля 2026 года в Швеции вступает в силу закон \(proposition 2025\/26:262\), прекращающий выдачу новых постоянных видов на жительство \(ПМЖ\) для держателей защитных статусов\.[\s\S]*?для исследователей сохраняется\./,
      THREADS_BLOCK3_RU
    );

  const source_links = [...(d.source_links ?? [])];
  if (!source_links.some((s) => /migrationsverket/i.test(s.url ?? ""))) {
    source_links.unshift(MIGRATIONSVERKET_SOURCE);
  }

  const { error: upErr } = await supabase
    .from("emigro_news_digests")
    .update({
      excerpt: EXCERPT_RU,
      seo_description: SEO_DESC_RU,
      key_takeaways,
      content_blocks,
      threads_text,
      source_links,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", SLUG);
  if (upErr) throw upErr;
  console.log("fixed:", SLUG);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
