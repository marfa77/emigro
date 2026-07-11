#!/usr/bin/env npx tsx
/**
 * One-off fix: Italy UNHCR sea arrivals fact-check (italy-relocation-news-2026-07-07).
 * - 14 464 → 14 388 (UNHCR, end of June 2026)
 * - Add YoY −30% declining trend context; fix "роста" framing
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SLUG = "italy-relocation-news-2026-07-07";

const UNHCR_SOURCE = {
  url: "https://cde.news/migrant-arrivals-to-italy-fall-30-in-first-half-of-2026-unhcr-says/",
  title: "UNHCR via CDE News",
};

const EXCERPT_RU =
  "Делегацию Европарламента не допустили к проверке итальянского центра для мигрантов в Албании, где с мая зафиксировано шесть попыток суицида. По данным UNHCR (на конец июня 2026), с начала года в Италию по морю прибыли 14 388 человек — на 30% меньше, чем за тот же период 2025 года.";

const SEO_DESC_RU =
  "Депутатам Европарламента отказали в доступе к данным и камерам в центре для мигрантов в Албании. По UNHCR (конец июня): 14 388 морских прибытий в Италию с начала 2026 года, −30% год к году.";

const TAKEAWAY_ARRIVALS_RU =
  "По данным UNHCR (на конец июня 2026), в Италию по морю с начала года прибыли 14 388 человек — на 30% меньше, чем за аналогичный период 2025 года. При этом более 1400 человек погибли или пропали без вести в Средиземном море.";

const BLOCK2_HEADING_RU =
  "Визит Папы Римского на Лампедузу на фоне сократившихся морских прибытий";

const BLOCK2_P2_RU =
  "Визит прошёл на фоне статистики UNHCR (на конец июня 2026): с начала года в Италию по морю прибыли 14 388 человек — на 30% меньше, чем за тот же период 2025 года; более половины из них — на Лампедузу. За тот же период в Средиземном море погибли или пропали без вести более 1400 человек. По данным Красного Креста, за последние три года через центр приёма на острове прошли более 182 000 человек.";

async function main() {
  const { data: d, error } = await supabase.from("emigro_news_digests").select("*").eq("slug", SLUG).single();
  if (error || !d) throw new Error(`Digest not found: ${SLUG}`);

  const key_takeaways = [...(d.key_takeaways ?? [])];
  const arrivalsIdx = key_takeaways.findIndex((t: string) => /14.?464|по морю прибыли/i.test(t));
  if (arrivalsIdx >= 0) key_takeaways[arrivalsIdx] = TAKEAWAY_ARRIVALS_RU;

  const content_blocks = [...(d.content_blocks ?? [])];
  const popeBlock = content_blocks.find((b) => /Лампедуз|Пап/i.test(b.heading ?? ""));
  if (popeBlock) {
    popeBlock.heading = BLOCK2_HEADING_RU;
    if (popeBlock.paragraphs?.[1]) popeBlock.paragraphs[1] = BLOCK2_P2_RU;
  }

  let threads_text = d.threads_text ?? "";
  threads_text = threads_text
    .replace(
      /Одновременно, по данным ООН, с начала 2026 года в Италию по морю прибыли 14 464 человека\./,
      "По данным UNHCR (на конец июня 2026), с начала года в Италию по морю прибыли 14 388 человек — на 30% меньше, чем за тот же период 2025 года."
    )
    .replace(
      /Визит Папы Римского на Лампедузу на фоне роста числа прибывающих по морю/,
      BLOCK2_HEADING_RU
    )
    .replace(
      /Визит прошел на фоне статистики ООН: с начала 2026 года в Италию по морю прибыли 14 464 человека, более половины из них — на Лампедузу\./,
      "Визит прошёл на фоне статистики UNHCR: с начала года в Италию по морю прибыли 14 388 человек (−30% год к году); более половины — на Лампедузу."
    );

  const source_links = [...(d.source_links ?? [])];
  if (!source_links.some((s) => /unhcr|cde\.news/i.test(s.url ?? ""))) {
    source_links.push(UNHCR_SOURCE);
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
