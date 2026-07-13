/**
 * Editorial pass: add glossary + light copy fixes to published Portugal notes.
 *
 *   npx tsx scripts/portugal-editorial-pass.ts
 *   npx tsx scripts/portugal-editorial-pass.ts --slug=nif-lissabon-chto-puutayut
 *   npx tsx scripts/portugal-editorial-pass.ts --dry-run
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { validateNoteDraft, flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { isGlossarySection, upsertGlossarySection } from "@/lib/community-notes/glossary";
import { SKIP_REWRITE_SLUGS } from "@/lib/community-notes/rewrite-queue";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNote, CommunityNoteFaq, NoteBodySection } from "@/lib/community-notes/types";

const HAND_GUIDE_SLUGS = SKIP_REWRITE_SLUGS;

type PatchResult = { sections?: NoteBodySection[]; takeaways?: string[]; faq?: CommunityNoteFaq[]; quick_answer?: string };

/** Light editorial fixes per slug (typos, geo, label consistency). */
function applyEditorialPatches(note: CommunityNote): PatchResult {
  const patches: PatchResult = {};
  let sections = [...(note.body_sections ?? [])];
  let takeaways = [...(note.key_takeaways ?? [])];
  let faq = [...(note.faq ?? [])];
  let quick_answer = note.quick_answer;

  const replaceInAll = (from: RegExp, to: string) => {
    quick_answer = quick_answer.replace(from, to);
    takeaways = takeaways.map((t) => t.replace(from, to));
    sections = sections.map((s) => ({
      ...s,
      heading: s.heading.replace(from, to),
      paragraphs: s.paragraphs?.map((p) => p.replace(from, to)),
      bullets: s.bullets?.map((b) => b.replace(from, to)),
    }));
    faq = faq.map((f) => ({ q: f.q.replace(from, to), a: f.a.replace(from, to) }));
  };

  // Global typo / consistency pass
  replaceInAll(/чastо/gi, "часто");
  replaceInAll(/путают/g, "путают");
  replaceInAll(/\s{2,}/g, " ");

  switch (note.slug) {
    case "nif-lissabon-chto-puutayut":
      replaceInAll(/Lisboa-only/gi, "Lisboa");
      if (!/Norte|Порту|Porto/i.test(quick_answer)) {
        quick_answer = quick_answer.replace(
          /Португал/i,
          (m) => `${m} (Norte: Порту, Braga — те же правила Finanças)`
        );
      }
      break;
    case "vybor-internet-provaydera-portugaliya-2026":
      replaceInAll(/Lisboa centric/gi, "Lisboa");
      break;
    case "sns-registration-changes-2026":
      takeaways = takeaways.map((t) =>
        t.startsWith("Официально:") || t.startsWith("На практике:") || t.startsWith("Расхождение:")
          ? t
          : t
      );
      break;
    case "pervyj-mesyac-portugaliya-checklist":
      if (!/Porto|Norte|Порту/i.test(quick_answer)) {
        quick_answer = `${quick_answer} В Norte (Porto, Braga) порядок тот же: NIF → morada → utente SNS → банк.`;
      }
      break;
    case "aima-agora-zapis-2026": {
      if (!/Porto|Norte|Braga/i.test(quick_answer)) {
        quick_answer = quick_answer.replace(
          /AIMA/i,
          "AIMA (в Norte balcões в Porto, Braga — те же правила Agora)"
        );
      }
      const bridge =
        "Про **папку документов, сроки и каналы renovação** (portal-renovacoes vs Agora vs services.aima) — [гайд по продлению ВНЖ](https://www.emigro.online/ru/guides/prodlenie-vnzh-portugaliya-aima-2026); здесь только охота за слотом Agora.";
      const paragraphs = sections.flatMap((s) => s.paragraphs ?? []);
      if (!paragraphs.some((p) => p.includes("prodlenie-vnzh-portugaliya-aima-2026"))) {
        const lastIdx = sections.length - 1;
        if (lastIdx >= 0) {
          sections = sections.map((s, i) =>
            i === lastIdx
              ? { ...s, paragraphs: [...(s.paragraphs ?? []), bridge] }
              : s
          );
        }
      }
      break;
    }
    default:
      break;
  }

  patches.sections = sections;
  patches.takeaways = takeaways;
  patches.faq = faq;
  patches.quick_answer = quick_answer;
  return patches;
}

function processNote(note: CommunityNote): { note: CommunityNote; changes: string[] } {
  const changes: string[] = [];
  const terms = glossaryForSlug(note.slug);

  let body_sections = [...(note.body_sections ?? [])];
  let key_takeaways = [...(note.key_takeaways ?? [])];
  let faq = [...(note.faq ?? [])];
  let quick_answer = note.quick_answer;

  const patches = applyEditorialPatches(note);
  if (patches.sections) body_sections = patches.sections;
  if (patches.takeaways) key_takeaways = patches.takeaways;
  if (patches.faq) faq = patches.faq;
  if (patches.quick_answer && patches.quick_answer !== note.quick_answer) {
    quick_answer = patches.quick_answer;
    changes.push("quick_answer geo/typo");
  }

  if (terms) {
    const prevIdx = body_sections.findIndex(isGlossarySection);
    body_sections = upsertGlossarySection(body_sections, terms);
    if (prevIdx < 0) {
      changes.push(`glossary +${terms.length} terms`);
    } else if (prevIdx > 0) {
      changes.push("glossary moved to start");
    } else {
      changes.push("glossary already at start");
    }
  } else {
    changes.push("no glossary data");
  }

  const updated: CommunityNote = {
    ...note,
    quick_answer,
    body_sections,
    body_paragraphs: flattenBodySections(body_sections),
    key_takeaways,
    faq,
    updated_at: new Date().toISOString(),
  };

  return { note: updated, changes };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];

  const supabase = createServerClient();
  let query = supabase.from("community_notes").select("*").eq("country_key", "portugal").eq("status", "published");
  if (slugArg) query = query.eq("slug", slugArg);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  if (!data?.length) {
    console.log("[editorial] no notes matched");
    return;
  }

  const results: Array<{ slug: string; changes: string[]; ok: boolean; errors: string[] }> = [];

  for (const row of data) {
    const note = row as CommunityNote;
    if (HAND_GUIDE_SLUGS.has(note.slug)) {
      console.log(`[skip] ${note.slug} — hand guide (update via publish script)`);
      results.push({ slug: note.slug, changes: ["hand guide — use publish script"], ok: true, errors: [] });
      continue;
    }

    const { note: updated, changes } = processNote(note);
    const qualityErrors =
      updated.content_kind === "guide"
        ? validateNoteDraft({
            content_kind: updated.content_kind,
            seo_title: updated.seo_title,
            seo_description: updated.seo_description,
            quick_answer: updated.quick_answer,
            body_sections: updated.body_sections,
            body_paragraphs: updated.body_paragraphs,
            faq: updated.faq,
            key_takeaways: updated.key_takeaways,
          })
        : [];

    const ok = qualityErrors.length === 0;
    results.push({ slug: note.slug, changes, ok, errors: qualityErrors });

    if (changes.length === 0 || changes.every((c) => c.includes("already") || c.includes("hand guide"))) {
      console.log(`[ok] ${note.slug} — no changes`);
      continue;
    }

    console.log(`[${dryRun ? "dry" : "apply"}] ${note.slug}: ${changes.join(", ")}`);
    if (qualityErrors.length) console.log(`  WARN: ${qualityErrors.join("; ")}`);

    if (!dryRun) {
      const { error: upErr } = await supabase
        .from("community_notes")
        .update({
          quick_answer: updated.quick_answer,
          body_sections: updated.body_sections,
          body_paragraphs: updated.body_paragraphs,
          key_takeaways: updated.key_takeaways,
          faq: updated.faq,
          updated_at: updated.updated_at,
        })
        .eq("id", note.id);
      if (upErr) throw new Error(`${note.slug}: ${upErr.message}`);
    }
  }

  console.log("\n=== Summary ===");
  for (const r of results) {
    console.log(`${r.ok ? "OK" : "FAIL"} ${r.slug} | ${r.changes.join("; ") || "—"}${r.errors.length ? ` | ${r.errors.join("; ")}` : ""}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
