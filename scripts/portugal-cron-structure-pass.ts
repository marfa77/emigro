/**
 * Structural + voice-close pass for priority cron guides (no Gemini).
 *
 *   npx tsx scripts/portugal-cron-structure-pass.ts
 *   npx tsx scripts/portugal-cron-structure-pass.ts --slug=aima-agora-zapis-2026
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import {
  applyBlueprintFixes,
  reorderSectionsCanonical,
  validateAgainstBlueprint,
  validateSectionOrder,
} from "@/lib/community-notes/article-blueprint";
import { flattenBodySections, normalizeNoteDraftSeo } from "@/lib/community-notes/editorial-quality";
import { applyReadabilityToDraft } from "@/lib/community-notes/editorial-readability";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { TOPIC_OFFICIAL_LINKS } from "@/lib/community-notes/editorial-voice";
import { ensureSectionVoiceClose } from "@/lib/community-notes/voice-transforms";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNote, CommunityNoteLink, NoteBodySection } from "@/lib/community-notes/types";

const PRIORITY = [
  "aima-agora-zapis-2026",
  "nif-lissabon-chto-puutayut",
  "ciple-guide-2026",
  "kak-otkryt-bankovskiy-schet-portugalia-2026",
  "poterya-pitomtsa-portugaliya-gid-2026",
];

function topicKeyForSlug(slug: string): string {
  if (/aima|agora/.test(slug)) return "aima";
  if (/nif/.test(slug)) return "nif";
  if (/ciple/.test(slug)) return "ciple";
  if (/bank|schet|conta/.test(slug)) return "bank";
  if (/pitom|pet/.test(slug)) return "pets";
  return "general";
}

function ensureLinks(note: CommunityNote): CommunityNoteLink[] {
  const existing = note.official_links ?? [];
  if (existing.length >= 2) return existing;
  const topic = [
    ...(TOPIC_OFFICIAL_LINKS[topicKeyForSlug(note.slug)] ?? []),
    ...(TOPIC_OFFICIAL_LINKS.general ?? []),
  ];
  const merged = [...existing];
  for (const link of topic) {
    if (!merged.some((l) => l.url === link.url)) merged.push(link);
    if (merged.length >= 2) break;
  }
  if (merged.length < 2) {
    merged.push(
      { title: "gov.pt", url: "https://www.gov.pt/" },
      { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" }
    );
  }
  return merged.slice(0, 6);
}

async function main() {
  const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  const slugs = slugArg ? [slugArg] : PRIORITY;
  const sb = createServerClient();

  for (const slug of slugs) {
    const { data, error } = await sb.from("community_notes").select("*").eq("slug", slug).maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) {
      console.warn(`[skip] ${slug}: not found`);
      continue;
    }

    const note = data as unknown as CommunityNote;
    const glossaryTerms = glossaryForSlug(slug) ?? undefined;
    const fixed = applyBlueprintFixes({
      content_kind: note.content_kind,
      quick_answer: note.quick_answer,
      key_takeaways: note.key_takeaways,
      body_sections: note.body_sections,
      faq: note.faq,
      glossaryTerms,
    });
    let body_sections = reorderSectionsCanonical(fixed.body_sections).sections.map(ensureSectionVoiceClose);
    const readable = applyReadabilityToDraft({
      ...note,
      key_takeaways: fixed.key_takeaways,
      body_sections,
    });
    body_sections = readable.body_sections.map(ensureSectionVoiceClose);

    const seo = normalizeNoteDraftSeo({
      seo_title: note.seo_title,
      seo_description: note.seo_description,
    });
    const official_links = ensureLinks(note);

    const blueprint = validateAgainstBlueprint({
      content_kind: note.content_kind,
      slug,
      quick_answer: readable.quick_answer,
      seo_description: seo.seo_description,
      body_sections,
      key_takeaways: readable.key_takeaways,
      faq: readable.faq,
      official_links,
    });
    const order = validateSectionOrder(body_sections);

    const { error: upErr } = await sb
      .from("community_notes")
      .update({
        quick_answer: readable.quick_answer,
        key_takeaways: readable.key_takeaways,
        body_sections,
        body_paragraphs: flattenBodySections(body_sections),
        faq: readable.faq,
        excerpt: readable.excerpt,
        seo_title: seo.seo_title,
        seo_description: seo.seo_description,
        official_links,
        source_label: note.source_label?.includes("structure-pass")
          ? note.source_label
          : [note.source_label, "structure-pass"].filter(Boolean).join("+"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", note.id);

    if (upErr) {
      console.error(`[fail] ${slug}: ${upErr.message}`);
    } else {
      console.log(
        `[ok] ${slug}: bp=${blueprint.score} orderErr=${order.length} links=${official_links.length} bpErr=${blueprint.errors.slice(0, 3).join("; ") || "none"}`
      );
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
