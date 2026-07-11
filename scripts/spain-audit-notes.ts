/**
 * Audit published Spain community notes against editorial quality + blueprint gates.
 *
 *   npm run spain:audit-notes
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { validateAgainstBlueprint } from "@/lib/community-notes/article-blueprint";
import { validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { validateOfficialPracticeCopy } from "@/lib/community-notes/official-vs-practice";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNote } from "@/lib/community-notes/types";

function wordCount(note: CommunityNote): number {
  const parts = [
    note.quick_answer,
    ...(note.body_paragraphs ?? []),
    ...(note.body_sections ?? []).flatMap((s) => [...(s.paragraphs ?? []), ...(s.bullets ?? [])]),
    ...(note.faq ?? []).flatMap((f) => [f.q, f.a]),
    ...(note.key_takeaways ?? []),
  ];
  return parts.join(" ").split(/\s+/).filter(Boolean).length;
}

async function main() {
  const supabase = createServerClient();
  const { data: notes, error } = await supabase
    .from("community_notes")
    .select("*")
    .eq("country_key", "spain")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;

  const { count: signalCount } = await supabase
    .from("community_signals")
    .select("*", { count: "exact", head: true })
    .eq("country_key", "spain");

  console.log(`=== Spain audit (${notes?.length ?? 0} published notes, ${signalCount ?? 0} TG signals) ===\n`);

  for (const note of notes ?? []) {
    const gate = validateNoteDraft(note, "spain");
    const official = validateOfficialPracticeCopy(note);
    const blueprint =
      note.content_kind === "guide"
        ? validateAgainstBlueprint(note, "spain")
        : { score: 100, errors: [] as string[], warnings: [] as string[] };

    const issues = [...gate, ...official, ...blueprint.errors];
    const status = issues.length === 0 ? "PASS" : "FAIL";
    console.log(
      `${status} ${note.slug} | kind=${note.content_kind} | sections=${note.body_sections?.length ?? 0} | words≈${wordCount(note)} | blueprint=${blueprint.score}`
    );
    if (issues.length > 0) {
      for (const i of issues) console.log(`  - ${i}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
