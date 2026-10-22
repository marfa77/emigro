import assert from "node:assert/strict";
import {
  formatPortoGroupHtml,
  pickNextPortoGroupNote,
  type PortoGroupBank,
} from "../lib/community-notes/porto-group-card";
import {
  discussionPromptForNote,
  portoGroupGuideDue,
  portoGroupNewsQuietAfterGuide,
  PORTO_GROUP_MIN_INTERVAL_MS,
  PORTO_GROUP_REPLY_HINT,
} from "../lib/community-notes/porto-group-prompts";
import type { CommunityNote } from "../lib/community-notes/types";

function note(partial: Partial<CommunityNote> & Pick<CommunityNote, "slug" | "title">): CommunityNote {
  return {
    id: partial.slug,
    country_key: "portugal",
    city: "porto",
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

const districts = discussionPromptForNote(
  note({
    slug: "porto-rajony-arenda-shkoly-parki-sport-2026",
    title: "Районы Порту",
  })
);
assert.match(districts.question, /район/i);

const sns = discussionPromptForNote(
  note({ slug: "meditsina-norte-sns-chastnaya-stomatologiya-2026", title: "Медицина Norte" })
);
assert.match(sns.question, /SNS|utente|частн/i);

const html = formatPortoGroupHtml(
  note({ slug: "porto-rajony-arenda-shkoly-parki-sport-2026", title: "Районы Порту" }),
  "https://portugal.emigro.online/notes/porto-rajony-arenda-shkoly-parki-sport-2026"
);
assert.match(html, /<b>Районы Порту<\/b>/);
assert.match(html, /<b>Кто где живёт/);
assert.ok(html.includes(PORTO_GROUP_REPLY_HINT));
assert.ok(!html.includes("• "));
assert.ok(!html.includes("Гайд ·"));

assert.equal(portoGroupGuideDue(undefined), true);
const recent = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
assert.equal(portoGroupGuideDue(recent), false);
const old = new Date(Date.now() - PORTO_GROUP_MIN_INTERVAL_MS - 1000).toISOString();
assert.equal(portoGroupGuideDue(old), true);
assert.equal(portoGroupNewsQuietAfterGuide(recent), true);
assert.equal(portoGroupNewsQuietAfterGuide(old), false);

const bank: PortoGroupBank = {
  queue: ["porto-rajony-arenda-shkoly-parki-sport-2026", "meditsina-norte-sns-chastnaya-stomatologiya-2026"],
};
const notes = [
  note({ slug: "porto-rajony-arenda-shkoly-parki-sport-2026", title: "Районы" }),
  note({ slug: "meditsina-norte-sns-chastnaya-stomatologiya-2026", title: "SNS" }),
];
const next = pickNextPortoGroupNote(notes, new Set(["porto-rajony-arenda-shkoly-parki-sport-2026"]), bank);
assert.equal(next?.slug, "meditsina-norte-sns-chastnaya-stomatologiya-2026");

const recycled = pickNextPortoGroupNote(
  notes,
  new Set(["porto-rajony-arenda-shkoly-parki-sport-2026", "meditsina-norte-sns-chastnaya-stomatologiya-2026"]),
  bank,
  {
    now: Date.parse("2026-12-01T00:00:00.000Z"),
    postedAt: new Map([
      ["porto-rajony-arenda-shkoly-parki-sport-2026", Date.parse("2026-09-01T00:00:00.000Z")],
      ["meditsina-norte-sns-chastnaya-stomatologiya-2026", Date.parse("2026-10-01T00:00:00.000Z")],
    ]),
  }
);
assert.equal(recycled?.slug, "porto-rajony-arenda-shkoly-parki-sport-2026");

const tooSoon = pickNextPortoGroupNote(
  notes,
  new Set(["porto-rajony-arenda-shkoly-parki-sport-2026", "meditsina-norte-sns-chastnaya-stomatologiya-2026"]),
  bank,
  {
    now: Date.parse("2026-09-10T00:00:00.000Z"),
    postedAt: new Map([
      ["porto-rajony-arenda-shkoly-parki-sport-2026", Date.parse("2026-09-01T00:00:00.000Z")],
    ]),
  }
);
assert.equal(tooSoon, null);

console.log("porto-group prompts ok");
