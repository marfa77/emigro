#!/usr/bin/env npx tsx
/**
 * One-off fix: France ANEF / Conseil d'État fact-check corrections.
 * - Decision date: 5 May 2026 (case №502860), not July 7
 * - Deadline nuance: 6 vs 12 months for different measures
 * - Crisis scale: ~930k cases; April 5 action plan context
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TAKEAWAY_RULING_RU =
  "5 мая 2026 года Conseil d'État (дело №502860) признал «carence fautive» МВД по сбоям ANEF по иску 10 ассоциаций (Cimade, France Terre d'Asile и др.). Сроки различаются: 6 месяцев (до 5 ноября 2026) на часть мер и 12 месяцев — на другие, в т.ч. подачу заявлений по разным основаниям.";

const TAKEAWAY_CRISIS_RU =
  "В очереди по стране — около 930 000 дел на ВНЖ (не только ANEF). 5 апреля 2026 правительство обещало сократить сроки рассмотрения вдвое к концу года — решение суда лишь одно звено в системном кризисе.";

const EXCERPT_JULY_RU =
  "В мае Conseil d'État признал системный сбой ANEF незаконным (дело №502860); дайджест за 1–8 июля — о практических последствиях для заявителей. В очереди ~930 000 дел. Сроки исправлений: 6 месяцев на часть мер и 12 — на другие.";

const SEO_DESC_JULY_RU =
  "Conseil d'État 5 мая 2026 признал незаконным сбой ANEF (дело №502860). Разные сроки: 6 и 12 мес. ~930 000 дел в очереди. Что делать при задержке продления ВНЖ.";

const BLOCK1_P1_RU =
  "5 мая 2026 года Conseil d'État (высший административный суд) вынес решение по делу №502860 по иску 10 ассоциаций, включая Cimade и France Terre d'Asile. Бездействие министра внутренних дел по устранению системных сбоев платформы ANEF признано незаконной «carence fautive» (виновной бездеятельностью). Дайджест за 1–8 июля освещает практические последствия этого решения, а не новое судебное постановление недели.";

const BLOCK1_P2_RU =
  "Кризис шире ANEF: по всей стране в очереди около 930 000 дел на ВНЖ. Ещё 5 апреля 2026 года правительство анонсировало план действий с обещанием сократить сроки рассмотрения вдвое к концу 2026 года. Решение суда — одно из звеньев в системной перегрузке французской миграционной бюрократии.";

const BLOCK1_P3_RU =
  "Суд выявил семь системных нарушений, которые нельзя устранить в индивидуальном порядке. Самое серьёзное — невозможность подавать несколько заявлений одновременно или последовательно: отказ по одному основанию может привести к предписанию покинуть Францию (OQTF). Суд установил разные сроки для разных мер: на часть исправлений — 6 месяцев (до 5 ноября 2026), на другие — 12 месяцев (включая возможность подавать заявления по разным основаниям). Среди прочих нарушений — задержки с выдачей временных справок (attestations de prolongation d'instruction) и отсутствие возможности исправить ошибки в анкете после подачи.";

async function fixJuly08() {
  const slug = "france-relocation-news-2026-07-08";
  const { data: d, error } = await supabase.from("emigro_news_digests").select("*").eq("slug", slug).single();
  if (error || !d) throw new Error(`Digest not found: ${slug}`);

  const key_takeaways = [...(d.key_takeaways ?? [])];
  key_takeaways[0] = TAKEAWAY_RULING_RU;
  if (key_takeaways.length > 1) {
    key_takeaways.splice(1, 0, TAKEAWAY_CRISIS_RU);
  } else {
    key_takeaways.push(TAKEAWAY_CRISIS_RU);
  }

  const content_blocks = [...(d.content_blocks ?? [])];
  const courtBlock = content_blocks.find((b) => /ANEF|суд обязал/i.test(b.heading ?? ""));
  if (courtBlock) {
    courtBlock.paragraphs = [BLOCK1_P1_RU, BLOCK1_P2_RU, BLOCK1_P3_RU];
  }

  let threads_text = d.threads_text ?? "";
  threads_text = threads_text
    .replace(
      /Административный суд обязал правительство устранить системные сбои в онлайн-системе для подачи на ВНЖ ANEF в течение 6–12 месяцев\. Из-за многомесячных задержек иностранцы вынуждены прибегать к срочным судебным процедурам\./,
      "В мае Conseil d'État признал сбои ANEF незаконными (дело №502860, 5 мая). На этой неделе — практические последствия: в очереди ~930 000 дел, сроки исправлений 6 или 12 месяцев в зависимости от меры."
    )
    .replace(
      /7 июля 2026 года административный суд вынес решение против МВД Франции\. Бездействие министра в ответ на требования десяти ассоциаций об устранении сбоев в онлайн-платформе ANEF было признано незаконным «имплицитным отказом»\./,
      "5 мая 2026 Conseil d'État (№502860) признал «carence fautive» МВД по ANEF — иск 10 ассоциаций (Cimade, France Terre d'Asile). Разные сроки: 6 мес. (до 5 нояб.) и 12 мес. на отдельные меры."
    )
    .replace(
      /Суд выявил семь системных нарушений, которые не могут быть решены в индивидуальном порядке\. Самое серьёзное — невозможность подавать несколько заявлений одновременно или последовательно\./,
      "Ключевое нарушение — невозможность подавать заявления по разным основаниям. В очереди по стране ~930 000 дел; 5 апреля правительство обещало сократить сроки вдвое к концу 2026."
    );

  const { error: upErr } = await supabase
    .from("emigro_news_digests")
    .update({
      excerpt: EXCERPT_JULY_RU,
      seo_description: SEO_DESC_JULY_RU,
      key_takeaways,
      content_blocks,
      threads_text,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);
  if (upErr) throw upErr;
  console.log("fixed:", slug);
}

async function fixMay06() {
  const slug = "france-relocation-news-2026-05-06";
  const { data: d, error } = await supabase.from("emigro_news_digests").select("*").eq("slug", slug).single();
  if (error || !d) throw new Error(`Digest not found: ${slug}`);

  const key_takeaways = [...(d.key_takeaways ?? [])];
  key_takeaways[0] =
    "5 мая 2026 Conseil d'État (№502860) признал «carence fautive» по ANEF. Сроки: 6 месяцев (до 5 нояб. 2026) на часть мер, 12 месяцев — на другие (в т.ч. подача по разным основаниям).";

  const content_blocks = [...(d.content_blocks ?? [])];
  const anefBlock = content_blocks.find((b) => /ANEF/i.test(b.heading ?? ""));
  if (anefBlock?.paragraphs) {
    anefBlock.paragraphs[0] =
      "5 мая 2026 года Conseil d'État (дело №502860) по иску 10 ассоциаций, включая Cimade и France Terre d'Asile, признал виновную бездеятельность («carence fautive») министра внутренних дел по устранению системных сбоев портала ANEF.";
    anefBlock.paragraphs[1] =
      "Суд установил разные сроки: 6 месяцев (до 5 ноября 2026) на часть мер и 12 месяцев на другие, включая возможность подавать заявления по разным основаниям. В очереди по стране около 930 000 дел; 5 апреля 2026 правительство обещало сократить сроки рассмотрения вдвое к концу года.";
  }

  let excerpt = d.excerpt ?? "";
  excerpt = excerpt.replace(
    /Государственный совет обязал власти исправить ошибки в работе портала ANEF в течение полугода\./,
    "Conseil d'État 5 мая 2026 (№502860) обязал власти исправить ANEF: 6 месяцев на часть мер, 12 — на другие. В очереди ~930 000 дел."
  );

  const { error: upErr } = await supabase
    .from("emigro_news_digests")
    .update({
      excerpt,
      key_takeaways,
      content_blocks,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", slug);
  if (upErr) throw upErr;
  console.log("fixed:", slug);
}

async function main() {
  await fixJuly08();
  await fixMay06();
  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
