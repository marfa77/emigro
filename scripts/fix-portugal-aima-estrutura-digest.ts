#!/usr/bin/env npx tsx
/**
 * One-off fix: Estrutura de Missão past tense (closed 2025-12-31) + CSTAF court backlog context.
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SLUG = "portugal-relocation-news-2026-07-06";

const EXCERPT =
  "1260 инвесторов программы ARI подали жалобу на новый закон о гражданстве, удвоивший срок ожидания до 10 лет. Отдельно: спецгруппа AIMA по бэклогу SEF завершила работу в конце 2025 года, оставив 30 000 дел; в 2026 сильнее давят суды (133 000+ исков, CSTAF).";

const SEO_DESCRIPTION =
  "1260 инвесторов Golden Visa подали жалобу омбудсмену на удвоение срока для гражданства до 10 лет. Estrutura de Missão AIMA закрылась 31.12.2025; судебная очередь — 133 000+ исков.";

const TAKEAWAY_ESTRUTURA =
  "Estrutura de Missão AIMA завершила работу 31.12.2025, оставив ~30 000 «наследных» дел в общей очереди; в 2026 судебная очередь (133 000+ исков, CSTAF, ~900 новых в день) — более актуальный фактор задержек.";

const BLOCK_HEADING = "Спецгруппа AIMA завершила работу: 30 000 дел и судебная очередь CSTAF";

const BLOCK_PARAGRAPHS = [
  "Специальная рабочая группа AIMA (Estrutura de Missão), созданная для ликвидации бэклога, унаследованного от SEF, формально прекратила работу 31 декабря 2025 года. 1 июля 2026 года госсекретарь по иммиграции подтвердил, что около 30 000 дел, требовавших дополнительного анализа или контакта с заявителями, остались в общей очереди AIMA без выделенного фокуса на устранение задержек.",
  "За время работы до конца 2025 года спецгруппа вынесла 525 000 решений и провела 763 000 приёмов. Оставшиеся 30 000 дел составляют 5–8% от первоначального объёма задолженности.",
  "Параллельно в 2026 году более острый фактор задержек — административные суды: в очереди 133 000+ исков против AIMA. Для их разгрузки создана судебная рабочая группа CSTAF, которая за первый месяц вынесла 7 000+ решений, но около 900 новых исков поступает ежедневно — поток опережает темп рассмотрения.",
  "Мы: если ваше дело в очереди AIMA или уже в суде — проверьте портал на запросы документов и ответьте в срок, чтобы не попасть в новый цикл задержек.",
];

const THREADS_INTRO =
  "1260 инвесторов программы ARI подали жалобу на новый закон о гражданстве, удвоивший срок ожидания до 10 лет. Отдельно: спецгруппа AIMA завершила работу в конце 2025 года, оставив 30 000 дел; в 2026 сильнее давят суды (133 000+ исков, CSTAF).";

const THREADS_BLOCK =
  "Специальная рабочая группа AIMA (Estrutura de Missão) прекратила работу 31 декабря 2025 года. Около 30 000 «наследных» дел остались в общей очереди AIMA. Параллельно в судах — 133 000+ исков против AIMA; CSTAF за месяц вынесла 7 000+ решений, но ~900 новых исков поступает ежедневно.";

async function main() {
  const { data: d, error } = await supabase.from("emigro_news_digests").select("*").eq("slug", SLUG).single();
  if (error || !d) throw new Error(`Digest not found: ${SLUG}`);

  const key_takeaways = [...(d.key_takeaways ?? [])];
  key_takeaways[2] = TAKEAWAY_ESTRUTURA;

  const content_blocks = [...(d.content_blocks ?? [])];
  const aimaBlock = content_blocks.find((b) => /спецгруппа aima/i.test(b.heading ?? ""));
  if (!aimaBlock) throw new Error("AIMA block not found");
  aimaBlock.heading = BLOCK_HEADING;
  aimaBlock.paragraphs = BLOCK_PARAGRAPHS;

  let threads_text = d.threads_text ?? "";
  threads_text = threads_text.replace(
    /1260 инвесторов программы ARI подали жалобу на новый закон о гражданстве, удвоивший срок ожидания до 10 лет\. Отдельно, спецгруппа AIMA по разбору задолженности завершает работу, оставляя 30 000 сложных дел в общей очереди\./,
    THREADS_INTRO
  );
  threads_text = threads_text.replace(
    /Спецгруппа AIMA завершает работу: 30 000 сложных дел переходят в общую очередь\n\nГоссекретарь по иммиграции подтвердил 1 июля 2026 года, что специальная рабочая группа AIMA \(Estrutura de Missão\), созданная для устранения задолженности, унаследованной от SEF, завершает свою работу\. Около 30 000 дел, требующих дополнительного анализа или контакта с заявителями, будут переданы в общую очередь обработки AIMA до августа 2026 года\./,
    `${BLOCK_HEADING}\n\n${THREADS_BLOCK}`
  );

  const { error: upErr } = await supabase
    .from("emigro_news_digests")
    .update({
      excerpt: EXCERPT,
      seo_description: SEO_DESCRIPTION,
      key_takeaways,
      content_blocks,
      threads_text,
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
