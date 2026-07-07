import assert from "node:assert/strict";
import {
  countLabeledTakeaways,
  hasOfficialPracticeSplit,
  validateOfficialPracticeCopy,
} from "../lib/community-notes/official-vs-practice";

assert.equal(
  hasOfficialPracticeSplit("guide", [
    { heading: "Что требует Finanças", section_kind: "official", bullets: ["a", "b", "c"] },
    { heading: "Как обычно проходит", section_kind: "practice", bullets: ["x", "y", "z"] },
  ]),
  true
);

assert.equal(
  validateOfficialPracticeCopy({
    content_kind: "guide",
    body_sections: [
      { heading: "Официально", section_kind: "official" },
      { heading: "Практика", section_kind: "practice" },
    ],
    key_takeaways: ["Официально: NIF нужен", "На практике: без записи не пустят", "ещё факт"],
  }).length,
  0
);

assert.ok(
  validateOfficialPracticeCopy({
    content_kind: "qa",
    body_sections: [{ heading: "Всё в одном" }],
    key_takeaways: ["просто факт"],
  }).length >= 2
);

assert.equal(countLabeledTakeaways(["Официально: x", "На практике: y"]), 2);

console.log("official-vs-practice checks ok");
