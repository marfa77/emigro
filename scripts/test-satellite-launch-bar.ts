import assert from "node:assert/strict";
import {
  SATELLITE_LAUNCH_AUDIENCE,
  SATELLITE_LAUNCH_BAR,
  SATELLITE_LAUNCH_SLOTS,
  SATELLITE_LAUNCH_CORE_SLOTS,
  SATELLITE_LAUNCH_SLOT_META,
  SATELLITE_LAUNCH_SLOT_LABELS,
  SATELLITE_LAUNCH_CLONE_FROM,
  satelliteGuideQualityGaps,
  satelliteGuideSeoAeoGaps,
} from "../lib/satellite/launch-bar";

assert.equal(SATELLITE_LAUNCH_AUDIENCE, "week0_to_month6");
assert.equal(SATELLITE_LAUNCH_CORE_SLOTS.length, 8);
assert.ok(SATELLITE_LAUNCH_CORE_SLOTS.every((s) => SATELLITE_LAUNCH_SLOTS.includes(s)));
assert.equal(SATELLITE_LAUNCH_BAR.minGuides, 15);
assert.equal(SATELLITE_LAUNCH_BAR.minGuideWords, 1200);
assert.equal(SATELLITE_LAUNCH_BAR.minBodySections, 6);
assert.equal(SATELLITE_LAUNCH_BAR.minGroupBankSlugs, 15);
assert.equal(SATELLITE_LAUNCH_BAR.minWebpBytes, 20_000);

const phases = new Set(SATELLITE_LAUNCH_SLOTS.map((s) => SATELLITE_LAUNCH_SLOT_META[s].phase));
assert.deepEqual([...phases].sort(), ["month1_3", "month4_6", "week0_1"]);

for (const slot of SATELLITE_LAUNCH_SLOTS) {
  const meta = SATELLITE_LAUNCH_SLOT_META[slot];
  assert.ok(meta.label.length > 8, slot);
  assert.equal(SATELLITE_LAUNCH_SLOT_LABELS[slot], meta.label);
  assert.ok(meta.mustAnswer.length >= 3, `${slot} mustAnswer`);
  assert.ok(meta.portugalGold.length > 8, `${slot} portugalGold`);
  assert.ok(meta.lifeSide.length > 2, `${slot} lifeSide`);
  assert.ok(meta.primaryQuery.includes("{city}"), `${slot} primaryQuery {city}`);
  assert.ok(meta.aeoQuestion.includes("?"), `${slot} aeoQuestion`);
  assert.ok(meta.seoAnyOf.length >= 1, `${slot} seoAnyOf`);
}

assert.ok(Object.keys(SATELLITE_LAUNCH_CLONE_FROM).length >= 12);
assert.deepEqual(satelliteGuideQualityGaps("короткий текст без горизонта"), [
  "нет горизонта «к 4–6 месяцу»",
  "нет Nota Emigro / fact-check",
]);
assert.equal(
  satelliteGuideQualityGaps("К 4–6 месяцу очередь вырастет. Nota Emigro: OK, aima.gov.pt.").length,
  0
);

assert.deepEqual(
  satelliteGuideSeoAeoGaps(
    {
      seo_title: "Short",
      seo_description: "too short",
      excerpt: "tiny",
      quick_answer: "нет",
      faq: [],
      topic_tags: [],
      official_links: [],
    },
    { country: "spain", city: "valencia", slot: "tax_id" }
  ).length > 0,
  true
);

const seoPass = satelliteGuideSeoAeoGaps(
  {
    seo_title: "NIE и empadronamiento Valencia 2026 — порядок",
    seo_description:
      "NIE и padrón Valencia 2026: EX-15, sede, ICPPlus, contrato для alta и cita previa. Практика для RU/BY в Valencia без мифа «сначала только NIE».",
    excerpt:
      "Полный маршрут NIE и empadronamiento в Valencia: документы, cita, resguardo и что стопорит банк к 4–6 месяцу.",
    quick_answer:
      "В Валенсии сначала проверьте, нет ли NIE уже в visado. Потом padrón по фактическому адресу и банк. Без resguardo EX-15 сложнее IBAN и TIE cita. К 4–6 месяцу хвост Hacienda не закрывается сам.",
    faq: [
      { q: "NIE раньше padrón?", a: "По правилам trámites независимы. На практике сначала NIE/resguardo." },
      { q: "Нужен contrato?", a: "По правилам надо acreditar residencia. На практике Airbnb без письма часто отказ." },
      { q: "Срок resolución?", a: "По правилам до 5 días. На практике cita занимает недели." },
      { q: "Без NIE банк?", a: "По правилам идентификация паспортом. На практике sucursal просит NIE." },
    ],
    topic_tags: ["nie", "empadronamiento", "valencia"],
    official_links: [
      { title: "Sede", url: "https://sede.administracionespublicas.gob.es/" },
      { title: "Valencia PA.GP.11", url: "https://sede.valencia.es/" },
    ],
  },
  { country: "spain", city: "valencia", slot: "tax_id" }
);
assert.equal(seoPass.length, 0, seoPass.join("; "));

assert.equal(SATELLITE_LAUNCH_BAR.minQuickAnswerChars, 180);
assert.equal(SATELLITE_LAUNCH_BAR.minExcerptChars, 80);

console.log("satellite launch gold bar: 15 life / 8 CORE / horizon+nota / SEO+AEO same batch");
