import { validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import type { CommunityNote } from "@/lib/community-notes/types";

/** Hand-written guides — never auto-rewrite. */
export const SKIP_REWRITE_SLUGS = new Set([
  "zamena-voditelskih-prav-portugaliya-2026",
  "mezhdunarodnye-shkoly-portugaliya-2026",
  "mashina-portugaliya-kupit-arenda-import-2026",
  "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026",
  "pokupka-zemli-postroyka-doma-norte-portugaliya-2026",
  "klimat-norte-zhara-vlazhnost-plesen-zima-2026",
  "meditsina-norte-sns-chastnaya-stomatologiya-2026",
  "zamena-zagranpasporta-portugaliya-2026",
  "platnye-dorogi-shtrafy-avariya-portugaliya-norte-2026",
  "arenda-dolgosrok-porto-braga-2026",
  "turizm-vnutri-portugalii-norte-2026",
  "kupit-kvartiru-portugaliya-norte-2026",
  "regiony-portugalii-ekspaty-klimat-tseny-2026",
]);

/** Already deep-rewritten by Gemini (batch or manual). */
export const REWRITTEN_SLUGS = new Set([
  "aima-agora-zapis-2026",
  "nif-lissabon-chto-puutayut",
]);

/** Priority order for one-by-one deep rewrites (highest first). */
export const REWRITE_PRIORITY: string[] = [
  "elektromobil-tesla-v-portugalii-2026",
  "pervyj-mesyac-portugaliya-checklist",
  "arenda-lissabon-do-podpisi",
  "kak-otkryt-bankovskiy-schet-portugalia-2026",
  "sns-registration-changes-2026",
  "smena-adresa-nif-financas-2026",
  "studencheskiy-vnzh-portugal-mify-aima-2026",
  "arenda-kvartiry-lisbon-pervyi-mesyac-2026",
  "vybor-internet-provaydera-portugaliya-2026",
  "termo-responsabilidade-podtverzhdenie-zhilya-2026",
  "poisk-mestnyh-uslug-portugaliya-2026",
  "lgoty-s-vnj-kulturnye-mesta-2026",
  "vozvrat-remont-tovarov-portugaliya-2026",
  "poterya-pitomtsa-portugaliya-gid-2026",
  "ciple-guide-2026",
  "otkrytie-scheta-kreditnaya-karta-portugaliya-2026",
];

export const REWRITE_SOURCE_LABEL = "rewrite:gemini";

export function noteToDraftInput(note: CommunityNote) {
  return {
    content_kind: note.content_kind,
    seo_title: note.seo_title,
    seo_description: note.seo_description,
    quick_answer: note.quick_answer,
    body_sections: note.body_sections,
    body_paragraphs: note.body_paragraphs,
    faq: note.faq,
    key_takeaways: note.key_takeaways,
  };
}

export function isRewriteCompleted(note: CommunityNote): boolean {
  if (REWRITTEN_SLUGS.has(note.slug)) return true;
  return Boolean(note.source_label?.includes(REWRITE_SOURCE_LABEL));
}

/** Pending deep rewrite — priority queue minus curated/completed. */
export function isRewritePending(note: CommunityNote, force = false): boolean {
  if (SKIP_REWRITE_SLUGS.has(note.slug)) return false;
  if (!force && isRewriteCompleted(note)) return false;
  if (REWRITE_PRIORITY.includes(note.slug)) return true;
  return validateNoteDraft(noteToDraftInput(note)).length > 0;
}

/** @deprecated use isRewritePending */
export function needsDeepContentRewrite(note: CommunityNote): boolean {
  return isRewritePending(note);
}

export function sortNotesForRewrite(notes: CommunityNote[]): CommunityNote[] {
  const rank = new Map(REWRITE_PRIORITY.map((slug, i) => [slug, i]));
  return [...notes].sort((a, b) => {
    const ra = rank.get(a.slug) ?? 999;
    const rb = rank.get(b.slug) ?? 999;
    return ra - rb;
  });
}

export function pickNextRewriteCandidate(notes: CommunityNote[], force = false): CommunityNote | null {
  const eligible = sortNotesForRewrite(notes).filter((n) => isRewritePending(n, force));
  return eligible[0] ?? null;
}

export function countPendingRewrites(notes: CommunityNote[], force = false): number {
  return notes.filter((n) => isRewritePending(n, force)).length;
}
