import assert from "node:assert/strict";
import {
  formatValenciaGroupHtml,
  pickNextValenciaGroupNote,
  type ValenciaGroupBank,
} from "../lib/community-notes/valencia-group-card";
import {
  discussionPromptForValenciaNote,
  valenciaGroupGuideDue,
  VALENCIA_GROUP_MIN_INTERVAL_MS,
  VALENCIA_GROUP_REPLY_HINT,
} from "../lib/community-notes/valencia-group-prompts";
import type { CommunityNote } from "../lib/community-notes/types";

function note(partial: Partial<CommunityNote> & Pick<CommunityNote, "slug" | "title">): CommunityNote {
  return {
    id: partial.slug,
    country_key: "spain",
    city: "valencia",
    category: partial.category ?? "Быт",
    content_kind: "guide",
    excerpt: partial.excerpt ?? "excerpt",
    seo_title: partial.title,
    seo_description: "desc",
    quick_answer: partial.quick_answer ?? "quick",
    body_paragraphs: [],
    body_sections: [],
    key_takeaways: partial.key_takeaways ?? [],
    faq: [],
    official_links: [],
    source_channel: null,
    source_label: null,
    topic_tags: partial.topic_tags ?? [],
    hashtags: [],
    status: "published",
    published_at: "2026-09-01T00:00:00.000Z",
    created_at: "2026-09-01T00:00:00.000Z",
    updated_at: "2026-09-01T00:00:00.000Z",
    ...partial,
  };
}

const districts = discussionPromptForValenciaNote(
  note({
    slug: "valencia-rajony-arenda-shkoly-metro-2026",
    title: "Районы Valencia",
  })
);
assert.match(districts.question, /район/i);

const sip = discussionPromptForValenciaNote(
  note({ slug: "meditsina-valencia-sip-sns-chastnaya-2026", title: "Медицина Valencia" })
);
assert.match(sip.question, /SIP|частн|centro/i);

const html = formatValenciaGroupHtml(
  note({ slug: "valencia-rajony-arenda-shkoly-metro-2026", title: "Районы Valencia" }),
  "https://spain.emigro.online/notes/valencia-rajony-arenda-shkoly-metro-2026"
);
assert.match(html, /<b>Районы Valencia<\/b>/);
assert.match(html, /<b>Кто где живёт/);
assert.ok(html.includes(VALENCIA_GROUP_REPLY_HINT));
assert.ok(!html.includes("• "));
assert.ok(!html.includes("Гайд ·"));

assert.equal(valenciaGroupGuideDue(undefined), true);
const recent = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
assert.equal(valenciaGroupGuideDue(recent), false);
const old = new Date(Date.now() - VALENCIA_GROUP_MIN_INTERVAL_MS - 1000).toISOString();
assert.equal(valenciaGroupGuideDue(old), true);

const bank: ValenciaGroupBank = {
  queue: ["valencia-rajony-arenda-shkoly-metro-2026", "meditsina-valencia-sip-sns-chastnaya-2026"],
};
const notes = [
  note({ slug: "valencia-rajony-arenda-shkoly-metro-2026", title: "Районы" }),
  note({ slug: "meditsina-valencia-sip-sns-chastnaya-2026", title: "SIP" }),
];
const first = pickNextValenciaGroupNote(notes, new Set(), bank);
assert.equal(first?.slug, "valencia-rajony-arenda-shkoly-metro-2026");
const second = pickNextValenciaGroupNote(notes, new Set(["valencia-rajony-arenda-shkoly-metro-2026"]), bank);
assert.equal(second?.slug, "meditsina-valencia-sip-sns-chastnaya-2026");

console.log("valencia-group-prompts ok");
