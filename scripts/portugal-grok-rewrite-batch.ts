/**
 * Batch Grok rewrite for Portugal hand guides (practical continuous prose).
 *
 *   npx tsx scripts/portugal-grok-rewrite-batch.ts --slug=zheltye-stranitsy-relokanta-portugaliya-2026
 *   npx tsx scripts/portugal-grok-rewrite-batch.ts --all-top5
 */
import dotenv from "dotenv";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { openrouterJson } from "@/lib/llm/openrouter";
import { EDITORIAL_VOICE_PRACTICAL, VOICE_REWRITE_HINT } from "@/lib/community-notes/editorial-voice";
import { YELLOW_PAGES_RELOCANT_GUIDE } from "@/lib/community-notes/guides/yellow-pages-relocant-portugal";
import { LISBON_RENT_FIRST_MONTH_GUIDE } from "@/lib/community-notes/guides/lisbon-rent-first-month";
import { DRIVING_LICENSE_EXCHANGE_GUIDE } from "@/lib/community-notes/guides/driving-license-exchange";
import { VNJ_RENEWAL_GUIDE } from "@/lib/community-notes/guides/prodlenie-vnzh-portugaliya-aima-2026";
import { PERVYJ_MESYAC_CHECKLIST_GUIDE } from "@/lib/community-notes/guides/pervyj-mesyac-portugaliya-checklist";

const MODEL = (process.env.EMIGRO_GROK_REWRITE_MODEL || "x-ai/grok-4.3").trim();

const TOP5 = [
  "zheltye-stranitsy-relokanta-portugaliya-2026",
  "arenda-kvartiry-lisbon-pervyi-mesyac-2026",
  "zamena-voditelskih-prav-portugaliya-2026",
  "prodlenie-vnzh-portugaliya-aima-2026",
  "pervyj-mesyac-portugaliya-checklist",
] as const;

const GUIDES: Record<string, {
  slug: string;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  key_takeaways: string[];
  body_sections: unknown[];
  faq: unknown[];
  topicHint: string;
}> = {
  "zheltye-stranitsy-relokanta-portugaliya-2026": {
    ...YELLOW_PAGES_RELOCANT_GUIDE,
    topicHint: "Жёлтые страницы релоканта PT: AIMA, Finanças, SNS24, Junta, Loja do Cidadão, IMT, CTT — кто есть кто, зачем звонить, порядок первой недели. Не каталог телефонов.",
  },
  "arenda-kvartiry-lisbon-pervyi-mesyac-2026": {
    ...LISBON_RENT_FIRST_MONTH_GUIDE,
    topicHint: "Аренда Lisboa первый месяц: Idealista, deposito, fiador, contrato, NIF, ловушки до подписи. Practical realtor voice.",
  },
  "zamena-voditelskih-prav-portugaliya-2026": {
    ...DRIVING_LICENSE_EXCHANGE_GUIDE,
    topicHint: "Обмен иностранных водительских прав на carta PT через IMT: сроки, документы, теория/практика, Norte vs Lisboa.",
  },
  "prodlenie-vnzh-portugaliya-aima-2026": {
    ...VNJ_RENEWAL_GUIDE,
    topicHint: "Продление autorização/título через Portal das Renovações AIMA: пакет документов, taxas, сроки, D7/D8 нюансы 2026.",
  },
  "pervyj-mesyac-portugaliya-checklist": {
    ...PERVYJ_MESYAC_CHECKLIST_GUIDE,
    topicHint: "Первый месяц семьи/релоканта в Porto/Braga: школа, NIF, SNS, AIMA/ARI — порядок недель, не стена чеклиста.",
  },
};

type Out = {
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
  key_takeaways: string[];
  body_sections: Array<{
    heading: string;
    section_kind: "glossary" | "official" | "practice" | "gap" | "action_guide";
    paragraphs: string[];
    bullets?: string[];
  }>;
  faq: Array<{ q: string; a: string }>;
};

async function rewriteOne(slug: string): Promise<void> {
  const g = GUIDES[slug];
  if (!g) throw new Error(`Unknown slug ${slug}`);

  const current = {
    title: g.title,
    quick_answer: g.quick_answer,
    key_takeaways: g.key_takeaways,
    body_sections: g.body_sections,
    faq: g.faq,
    excerpt: g.excerpt,
    seo_title: g.seo_title,
    seo_description: g.seo_description,
  };

  const system = `Ты старший редактор Emigro для portugal.emigro.online.
${EDITORIAL_VOICE_PRACTICAL}
${VOICE_REWRITE_HINT}

Критично — НЕ телеграф:
- Полностью ПЕРЕСОБЕРИ гайд связной прозой. В каждой НЕ-glossary секции минимум 2–3 абзаца по 3–6 предложений.
- ЗАПРЕЩЕНЫ ярлыки «Что делать:», «Зачем читать:», «Зачем:», «Шаг N —» как скелет.
- Bullets ≤5 с глаголом ПОСЛЕ прозы; финал секции «Главное: …».
- glossary первая (6–8 терминов); затем official*; practice*; gap; practice «Таймлайн… и типичные ошибки» с ≥4 bullets «Ошибка: …».
- key_takeaways ровно 4, из них ≥2 с «Официально:» / «На практике:» / «Расхождение:».
- faq 6–8; ответы начинай с да/нет/цифры, затем «По правилам…» / «На практике…».
- seo_title 24–58 символов; seo_description 145–160; quick_answer ≥180.
- Сохрани ВСЕ факты, цифры, органы, перелинковки /notes/…; убери @username-спам.
- Тема: ${g.topicHint}
JSON only.`;

  const user = `Перепиши slug ${slug} с нуля по смыслу (стиль текущего — плохой телеграф, не копируй).

ТЕКУЩИЙ JSON (факты сохранить, подачу заменить):
${JSON.stringify(current).slice(0, 32000)}

Верни JSON: title, excerpt, seo_title, seo_description, quick_answer, key_takeaways[4], body_sections, faq.`;

  console.error(`[grok] ${slug} model=${MODEL}`);
  const { data, model } = await openrouterJson<Out>(MODEL, system, user, 16000, {
    temperature: 0.4,
  });
  mkdirSync(resolve(process.cwd(), "scripts/output"), { recursive: true });
  const outPath = resolve(process.cwd(), `scripts/output/grok-rewrite-${slug}.json`);
  writeFileSync(outPath, JSON.stringify({ ...data, _meta: { model, slug } }, null, 2) + "\n");
  console.error(`[grok] wrote ${outPath} sections=${data.body_sections?.length} model=${model}`);
}

async function main() {
  const argv = process.argv.slice(2);
  const all = argv.includes("--all-top5");
  const one = argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const slugs = all ? [...TOP5] : one ? [one] : [];
  if (!slugs.length) {
    console.error("Usage: --slug=... | --all-top5");
    process.exit(1);
  }
  for (const slug of slugs) {
    await rewriteOne(slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
