#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import {
  guideTelegramVoiceErrors,
  listGuidePromoCandidates,
} from "../lib/news/guide-telegram-post";
import { extractGuideSlugsFromChannelHtml } from "../lib/news/guide-telegram-posted";

const channelHtml = `
<div class="tgme_widget_message_text">
<a href="https://www.emigro.online/ru/guides/d7-vs-digital-nomad-visa-sravnenie?utm_source=emigro">D7 vs D8</a>
<a href="/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026">D8 pillar</a>
<a href="https://t.me/Emigro_news/88">msg</a>
</div>
`;

const extracted = extractGuideSlugsFromChannelHtml(channelHtml);
assert.deepEqual(extracted, [
  "d7-vs-digital-nomad-visa-sravnenie",
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026",
]);

const alreadyPosted = new Set(extracted);
const candidates = listGuidePromoCandidates(alreadyPosted);
assert(
  !candidates.some((g) => alreadyPosted.has(g.slug)),
  "queue must not pick a slug that already has a channel post"
);
assert(candidates.length > 0, "other unpublished guides must remain in the queue");

const good = guideTelegramVoiceErrors(
  "Грузия для россиян в 2026 — уже не 2022-й. Но и не закрылась\n" +
    "С 1 января на въезд нужна медстраховка ≥30 000 лари на весь срок пребывания."
);
assert.equal(good.length, 0, `house-style post must pass voice: ${good.join("; ")}`);

assert(
  guideTelegramVoiceErrors("Я сидел в кафе в Лиссабоне и помню, как оформлял NIF.").some((e) =>
    e.includes("memoir")
  ),
  "first-person memoir must fail"
);
assert(
  guideTelegramVoiceErrors("Актуальную информацию можно найти в нашем визарде.").some((e) =>
    e.includes("CTA")
  ),
  "wizard CTA fluff must fail"
);
assert(
  guideTelegramVoiceErrors("Важно отметить: на фоне текущих изменений правила игры новые.").length >
    0,
  "LLM stamps must fail"
);
assert(
  guideTelegramVoiceErrors("Давайте разберёмся.\nЧто делать: соберите документы.").some(
    (e) => e.includes("telegraphic") || e.includes("lecture")
  ),
  "telegraphic / lecture voice must fail"
);

console.log("guide-telegram-quality: ok");
