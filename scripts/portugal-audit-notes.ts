import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { validateOfficialPracticeCopy, needsOfficialPracticeRefresh } from "@/lib/community-notes/official-vs-practice";
import { validateSnsUtenteCopy, snsTextsFromDraft } from "@/lib/community-notes/sns-editorial";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

async function main() {
  const sb = createServerClient();
  const { data, error } = await sb
    .from("community_notes")
    .select("slug, content_kind, body_sections, key_takeaways, quick_answer, body_paragraphs, faq, status")
    .eq("country_key", "portugal")
    .eq("status", "published");

  if (error) throw new Error(error.message);

  let ok = 0;
  let issues = 0;
  for (const row of data ?? []) {
    const note = {
      slug: String(row.slug),
      content_kind: (row.content_kind as ContentKind) ?? "guide",
      body_sections: (row.body_sections as NoteBodySection[]) ?? [],
      key_takeaways: (row.key_takeaways as string[]) ?? [],
    };
    const op = validateOfficialPracticeCopy(note);
    const sns = validateSnsUtenteCopy(
      snsTextsFromDraft({
        quick_answer: String(row.quick_answer ?? ""),
        key_takeaways: note.key_takeaways,
        body_paragraphs: (row.body_paragraphs as string[]) ?? [],
        body_sections: note.body_sections,
        faq: (row.faq as CommunityNoteFaq[]) ?? [],
      })
    );
    const needRewrite = needsOfficialPracticeRefresh(note);
    if (op.length === 0 && sns.length === 0 && !needRewrite) {
      ok += 1;
      console.log("OK", note.slug);
    } else {
      issues += 1;
      console.log("ISSUE", note.slug, [...op, ...sns].join("; ") || "needs refresh");
    }
  }
  console.log(`\n${ok} ok, ${issues} with issues`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
