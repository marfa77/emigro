/**
 * Apply Grok JSON rewrites onto hand-guide .ts sources, validate, publish.
 *
 *   npx tsx scripts/portugal-apply-grok-top5.ts
 *   npx tsx scripts/portugal-apply-grok-top5.ts --dry
 */
import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });
dotenv.config({ path: resolve(process.cwd(), ".env") });

import { flattenBodySections, validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { validateAgainstBlueprint, applyBlueprintFixes } from "@/lib/community-notes/article-blueprint";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { isGlossarySection } from "@/lib/community-notes/glossary";
import { publishHandGuide } from "@/lib/community-notes/publish-hand-guide";
import type { CommunityNoteFaq, NoteBodySection } from "@/lib/community-notes/types";

import { YELLOW_PAGES_RELOCANT_GUIDE } from "@/lib/community-notes/guides/yellow-pages-relocant-portugal";
import { LISBON_RENT_FIRST_MONTH_GUIDE } from "@/lib/community-notes/guides/lisbon-rent-first-month";
import { DRIVING_LICENSE_EXCHANGE_GUIDE } from "@/lib/community-notes/guides/driving-license-exchange";
import { VNJ_RENEWAL_GUIDE } from "@/lib/community-notes/guides/prodlenie-vnzh-portugaliya-aima-2026";
import { PERVYJ_MESYAC_CHECKLIST_GUIDE } from "@/lib/community-notes/guides/pervyj-mesyac-portugaliya-checklist";

type GuideExport = typeof YELLOW_PAGES_RELOCANT_GUIDE & { city?: string };

const JOBS: Array<{
  slug: string;
  file: string;
  exportName: string;
  slugConst: string;
  guide: GuideExport;
  city: string;
  publishCmdHint: string;
}> = [
  {
    slug: "zheltye-stranitsy-relokanta-portugaliya-2026",
    file: "lib/community-notes/guides/yellow-pages-relocant-portugal.ts",
    exportName: "YELLOW_PAGES_RELOCANT_GUIDE",
    slugConst: "YELLOW_PAGES_RELOCANT_SLUG",
    guide: YELLOW_PAGES_RELOCANT_GUIDE,
    city: "porto",
    publishCmdHint: "portugal:publish-yellow-pages-guide",
  },
  {
    slug: "arenda-kvartiry-lisbon-pervyi-mesyac-2026",
    file: "lib/community-notes/guides/lisbon-rent-first-month.ts",
    exportName: "LISBON_RENT_FIRST_MONTH_GUIDE",
    slugConst: "LISBON_RENT_FIRST_MONTH_SLUG",
    guide: LISBON_RENT_FIRST_MONTH_GUIDE,
    city: "lisbon",
    publishCmdHint: "portugal:publish-lisbon-rent-guide",
  },
  {
    slug: "zamena-voditelskih-prav-portugaliya-2026",
    file: "lib/community-notes/guides/driving-license-exchange.ts",
    exportName: "DRIVING_LICENSE_EXCHANGE_GUIDE",
    slugConst: "DRIVING_LICENSE_GUIDE_SLUG",
    guide: DRIVING_LICENSE_EXCHANGE_GUIDE,
    city: "porto",
    publishCmdHint: "portugal:publish-license-guide",
  },
  {
    slug: "prodlenie-vnzh-portugaliya-aima-2026",
    file: "lib/community-notes/guides/prodlenie-vnzh-portugaliya-aima-2026.ts",
    exportName: "VNJ_RENEWAL_GUIDE",
    slugConst: "VNJ_RENEWAL_SLUG",
    guide: VNJ_RENEWAL_GUIDE,
    city: "porto",
    publishCmdHint: "portugal:publish-vnj-renewal-guide",
  },
  {
    slug: "pervyj-mesyac-portugaliya-checklist",
    file: "lib/community-notes/guides/pervyj-mesyac-portugaliya-checklist.ts",
    exportName: "PERVYJ_MESYAC_CHECKLIST_GUIDE",
    slugConst: "PERVYJ_MESYAC_CHECKLIST_SLUG",
    guide: PERVYJ_MESYAC_CHECKLIST_GUIDE,
    city: "porto",
    publishCmdHint: "portugal:publish-first-month-checklist",
  },
];

function esc(s: string): string {
  return JSON.stringify(s);
}

function normalizeSeoDescription(s: string): string {
  let t = s.trim();
  if (t.length > 160) t = t.slice(0, 157).replace(/\s+\S*$/, "") + ".";
  if (t.length < 145) {
    const pad = " Практика для релокантов в Португалии 2026.";
    t = (t + pad).slice(0, 160);
  }
  return t;
}

function orderSections(sections: NoteBodySection[]): NoteBodySection[] {
  const glossary = sections.filter(isGlossarySection);
  const official = sections.filter(
    (s) => !isGlossarySection(s) && (s.section_kind === "official" || /официаль/i.test(s.heading))
  );
  const gap = sections.filter(
    (s) => s.section_kind === "gap" || /расхожд|чат vs|портал и/i.test(s.heading)
  );
  const mistakes = sections.filter(
    (s) =>
      !isGlossarySection(s) &&
      (s.section_kind === "practice" || s.section_kind === "action_guide") &&
      /ошибк|таймлайн|пошагов/i.test(s.heading)
  );
  const used = new Set([...glossary, ...official, ...gap, ...mistakes]);
  const practice = sections.filter((s) => !used.has(s));
  return [...glossary, ...official, ...practice, ...gap, ...mistakes];
}

function emitSection(s: NoteBodySection): string {
  const paras = (s.paragraphs ?? []).map((p) => `      ${esc(p)},`).join("\n");
  const bullets = (s.bullets ?? []).map((b) => `      ${esc(b)},`).join("\n");
  return `  {
    heading: ${esc(s.heading)},
    section_kind: ${esc(s.section_kind ?? "practice")},
    paragraphs: [
${paras}
    ],
    bullets: [
${bullets}
    ],
  }`;
}

function emitGuideTs(job: (typeof JOBS)[number], merged: GuideExport): string {
  const glossary = glossaryForSlug(job.slug);
  const glossaryBlock = glossary
    ? `  {
    ...buildGlossarySection(glossaryForSlug(${job.slugConst})!),
  }`
    : "";

  const rest = (merged.body_sections ?? []).filter((s) => !isGlossarySection(s));
  const sectionsSrc = [glossaryBlock, ...rest.map(emitSection)].filter(Boolean).join(",\n");

  const takeaways = (merged.key_takeaways ?? []).map((t) => `  ${esc(t)},`).join("\n");
  const faq = (merged.faq ?? [])
    .map((f) => `  {\n    q: ${esc(f.q)},\n    a: ${esc(f.a)},\n  },`)
    .join("\n");
  const links = (merged.official_links ?? [])
    .map((l) => `    { title: ${esc(l.title)}, url: ${esc(l.url)} },`)
    .join("\n");
  const tags = JSON.stringify(merged.topic_tags ?? ["portugal"]);
  const hashtags = JSON.stringify(merged.hashtags ?? []);

  return `/**
 * Hand-curated Portugal guide — Grok 4.3 rewrite + editorial apply (${new Date().toISOString().slice(0, 10)}).
 * Continuous practical prose; no «Что делать:/Зачем читать:» telegraph.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const ${job.slugConst} = ${esc(job.slug)};

const bodySections: NoteBodySection[] = [
${sectionsSrc}
];

const keyTakeaways = [
${takeaways}
];

const faq: CommunityNoteFaq[] = [
${faq}
];

export const ${job.exportName} = {
  slug: ${job.slugConst},
  category: ${esc(merged.category)},
  content_kind: ${esc(merged.content_kind)} as ContentKind,
  title: ${esc(merged.title)},
  excerpt: ${esc(merged.excerpt)},
  seo_title: ${esc(merged.seo_title)},
  seo_description: ${esc(merged.seo_description)},
  quick_answer: ${esc(merged.quick_answer)},
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
${links}
  ],
  topic_tags: ${tags},
  hashtags: buildNoteHashtags({
    topicTags: ${tags},
    contentKind: "guide",
  }),
  source_channel: ${esc(merged.source_channel ?? "chatlisboa+por_tugal+lepta")},
  source_label: ${esc(merged.source_label ?? "editorial:grok-4.3-rewrite-2026-09-21")},
};
`;
}

async function main() {
  const dry = process.argv.includes("--dry");
  for (const job of JOBS) {
    const jsonPath = resolve(process.cwd(), `scripts/output/grok-rewrite-${job.slug}.json`);
    const raw = JSON.parse(readFileSync(jsonPath, "utf8")) as {
      title: string;
      excerpt: string;
      seo_title: string;
      seo_description: string;
      quick_answer: string;
      key_takeaways: string[];
      body_sections: NoteBodySection[];
      faq: CommunityNoteFaq[];
    };

    let body_sections = (raw.body_sections ?? []).map((s) => ({
      ...s,
      paragraphs: s.paragraphs ?? [],
      bullets: s.bullets ?? [],
    }));

    const fixed = applyBlueprintFixes({
      content_kind: "guide",
      quick_answer: raw.quick_answer,
      key_takeaways: raw.key_takeaways,
      body_sections,
      faq: raw.faq,
    });
    if (fixed.changed) {
      body_sections = fixed.body_sections;
      raw.key_takeaways = fixed.key_takeaways;
    }

    // Prefer curated glossary
    const gloss = glossaryForSlug(job.slug);
    if (gloss) {
      body_sections = [
        buildGlossarySection(gloss),
        ...body_sections.filter((s) => !isGlossarySection(s)),
      ];
    }
    body_sections = orderSections(body_sections);

    const merged: GuideExport = {
      ...job.guide,
      title: raw.title,
      excerpt: raw.excerpt,
      seo_title: raw.seo_title.slice(0, 58),
      seo_description: normalizeSeoDescription(raw.seo_description),
      quick_answer: raw.quick_answer,
      key_takeaways: raw.key_takeaways.slice(0, 4),
      body_sections,
      body_paragraphs: flattenBodySections(body_sections),
      faq: raw.faq,
      source_label: `editorial:grok-4.3-rewrite-2026-09-21`,
    };

    const draftInput = {
      content_kind: merged.content_kind,
      slug: merged.slug,
      seo_title: merged.seo_title,
      seo_description: merged.seo_description,
      quick_answer: merged.quick_answer,
      body_sections: merged.body_sections,
      body_paragraphs: merged.body_paragraphs,
      faq: merged.faq,
      key_takeaways: merged.key_takeaways,
      official_links: merged.official_links,
    };
    let errors = validateNoteDraft(draftInput);
    let bp = validateAgainstBlueprint(draftInput);
    if (bp.errors.length) {
      const again = applyBlueprintFixes({
        content_kind: "guide",
        quick_answer: merged.quick_answer,
        key_takeaways: merged.key_takeaways,
        body_sections: merged.body_sections!,
        faq: merged.faq,
      });
      merged.body_sections = again.body_sections;
      merged.key_takeaways = again.key_takeaways;
      merged.body_paragraphs = flattenBodySections(again.body_sections);
      errors = validateNoteDraft({ ...draftInput, ...merged, body_sections: merged.body_sections, body_paragraphs: merged.body_paragraphs, key_takeaways: merged.key_takeaways });
      bp = validateAgainstBlueprint({ ...draftInput, ...merged, body_sections: merged.body_sections!, key_takeaways: merged.key_takeaways });
    }

    console.log(`[apply] ${job.slug} draftErrors=${errors.length} bpErrors=${bp.errors.length} score=${bp.score}`);
    if (errors.length) console.log("  draft:", errors);
    if (bp.errors.length) console.log("  bp:", bp.errors);

    if (dry) continue;

    writeFileSync(resolve(process.cwd(), job.file), emitGuideTs(job, merged), "utf8");
    console.log(`[write] ${job.file}`);

    if (errors.length === 0 && bp.errors.length === 0) {
      await publishHandGuide({ ...merged, city: job.city });
      console.log(`[publish] ${job.slug}`);
    } else {
      console.warn(`[publish-skip] ${job.slug} — fix errors first`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
