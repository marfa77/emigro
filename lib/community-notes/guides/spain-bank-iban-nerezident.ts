/** Hand-curated Spain satellite guide — bank IBAN non-resident. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const BANK_IBAN_SLUG = "bank-iban-nerezident-ispaniya-2026";

const bodySections: NoteBodySection[] = [
  { ...buildGlossarySection(glossaryForSlug(BANK_IBAN_SLUG)!) },
  {
    heading: "Официально: счёт для extranjero",
    section_kind: "official",
    paragraphs: [
      "Испанские банки открывают cuenta для резидентов и нерезидентов по PBC/KYC. Нужны identificación (pasaporte, NIE/resguardo), comprobante de domicilio и часто justificante de ingresos.",
    ],
    bullets: [
      "IBAN ES… — обязателен для SEPA, nómina, fianza IVAMA, многих suministros.",
      "CaixaBank, Santander, BBVA — филиалы принимают non-EU с NIE.",
      "Cuenta nómina / sin comisiones — часто требуют domiciliación ingresos.",
      "Revolut/N26 — не заменяют ES IBAN для extranjería и LAU fianza.",
    ],
  },
  {
    heading: "Практика: RU/BY паспорт + Valencia",
    section_kind: "practice",
    paragraphs: [
      "В @spain_granitsa 2025–2026: CaixaBank и Santander открывают с resguardo NIE + empadronamiento; срок 3–10 дней. Отказ чаще из-за KYC source of funds, не паспорта.",
    ],
    bullets: [
      "Документы: pasaporte, NIE/resguardo, certificado empadronamiento, contrato trabajo или statements 3–6 мес.",
      "Очередь в branch без cita — 1–2 часа; лучше cita banca online.",
      "Tarjeta debit приходит 7–10 días; instant digital wallet не у всех.",
      "Крупный inbound transfer из РФ — готовьте объяснение происхождения (sale, savings).",
      "Gestoría «открытие счёта €200» — платите только если branch отказал без причины.",
    ],
  },
  {
    heading: "Где чат и банк расходятся",
    section_kind: "gap",
    bullets: [
      "«N26 хватит для TIE» → extranjería и utilities просят ES IBAN.",
      "«Без NIE откроют» → редко; resguardo EX-15 иногда принимают Caixa.",
      "«Все банки одинаковы» → KYC RU passport в rural branch vs город — разный опыт.",
      "Online-only банки ES — часто нужен уже DNI/NIE definitivo.",
    ],
  },
  {
    heading: "Пошагово: открытие счёта",
    section_kind: "practice",
    paragraphs: [
      "Маршрут из @spain_granitsa: cita banca online → branch с пакетом → cuenta activa 3–10 дней → tarjeta 7–14 дней. Без empadronamiento branch часто переносит на неделю.",
    ],
    bullets: [
      "Шаг 1: certificado empadronamiento + NIE/resguardo + pasaporte — копии и оригиналы.",
      "Шаг 2: justificante ingresos — contrato, autónomo modelo 303 или statements 3–6 мес.",
      "Шаг 3: в branch объясните source of funds для inbound из РФ/РБ — sale, savings, remote salary.",
      "Шаг 4: попросите IBAN letter на бланке банка — extranjería и agency иногда требуют.",
      "Шаг 5: domiciliación utilities — Endesa/Iberdrola проще с ES IBAN, не Revolut.",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    bullets: [
      "Ошибка: перевод fianza с Revolut — agency требует ES IBAN.",
      "Ошибка: нет empadronamiento — branch откладывает на неделю.",
      "Ошибка: не спросить comisiones mantenimiento — €60–120/год.",
      "Ошибка: закрыть «временный» foreign account до открытия ES — нет proof для аренды.",
    ],
  },
];

const keyTakeaways = [
  "Официально: для быта в ES нужен IBAN ES…; KYC — pasaporte + NIE + domicilio.",
  "На практике: CaixaBank/Santander + empadronamiento — типовой путь в Valencia.",
  "Расхождение: Revolut «работает» первые недели, но TIE и fianza требуют ES IBAN.",
  "Официально: cuenta nómina часто требует domiciliación ingresos; non-residente — отдельный продукт.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли открыть счёт без NIE?",
    a: "Официально cuenta non-residente возможна. На практике branch просят NIE или resguardo EX-15 + empadronamiento.",
  },
  {
    q: "Какой банк проще для RU паспорта?",
    a: "Нет единого ответа. На практике CaixaBank и Santander в Valencia чаще в чатах; готовьте KYC на доход.",
  },
  {
    q: "Хватит ли Revolut для аренды?",
    a: "Для перевода fianza через IVAMA — нет, нужен ES IBAN. Revolut удобен параллельно, не вместо.",
  },
  {
    q: "Сколько ждать карту?",
    a: "Cuenta activa 3–10 días; plástico 7–14 días. Digital card — зависит от банка.",
  },
];

export const BANK_IBAN_GUIDE = {
  slug: BANK_IBAN_SLUG,
  category: "Банки",
  content_kind: "guide" as ContentKind,
  title: "Банк и IBAN в Испании для нерезидента",
  excerpt:
    "CaixaBank, Santander, KYC для RU/BY-паспортов — когда Revolut не заменяет Spanish IBAN для TIE и аренды.",
  seo_title: "Банк Испания 2026 — IBAN для нерезидента",
  seo_description:
    "Открытие счёта в Испании 2026: IBAN для нерезидента, CaixaBank, Santander, KYC для RU/BY. Практика Valencia — NIE, empadronamiento, TIE и fianza.",
  quick_answer:
    "Без Spanish IBAN (ES…) в Valencia спотыкаются и аренда, и TIE, и свет — даже если Revolut «вроде хватает». CaixaBank и Santander открывают счёт с NIE/resguardo и empadronamiento; Revolut/N26 — удобный мост, не замена local IBAN.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Banco de España", url: "https://www.bde.es/" },
    { title: "CaixaBank", url: "https://www.caixabank.es/" },
  ],
  topic_tags: ["bank", "nie", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["bank", "nie", "valencia"],
    contentKind: "guide",
    extra: ["iban", "caixabank"],
  }),
  source_channel: "spain_granitsa+valenforum",
  source_label: "editorial:bank-iban+voice-pass",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};
