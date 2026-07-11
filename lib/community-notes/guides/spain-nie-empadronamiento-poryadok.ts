/** Hand-curated Spain satellite guide — NIE + empadronamiento order. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const NIE_EMPADRONAMIENTO_SLUG = "nie-empadronamiento-poryadok-2026";

const bodySections: NoteBodySection[] = [
  { ...buildGlossarySection(glossaryForSlug(NIE_EMPADRONAMIENTO_SLUG)!) },
  {
    heading: "Официально: что такое NIE и empadronamiento",
    section_kind: "official",
    paragraphs: [
      "NIE — налоговый идентификатор иностранца (Agencia Tributaria). Empadronamiento — регистрация по адресу в ayuntamiento (padrón municipal). Оба нужны для банка, аренды, TIE и большинства suministros.",
    ],
    bullets: [
      "NIE: форма EX-15, tasa 790 код 012, паспорт, motivo (аренда, TIE, работа).",
      "Empadronamiento: contrato de alquiler или autorización владельца + паспорт/NIE.",
      "Certificado de empadronamiento — запросите с historial для TIE и школы.",
      "Без padrón многие municipios не выдадут certificado для extranjería.",
    ],
  },
  {
    heading: "Практика Valencia: порядок шагов",
    section_kind: "practice",
    paragraphs: [
      "В чатах @valenforum и @spain_granitsa в 2025–2026 чаще рекомендуют: сначала NIE (или resguardo подачи), затем empadronamiento, затем банк и cita TIE. Обратный порядок часто стопорит банк и utilities.",
    ],
    bullets: [
      "Cita previa на NIE: sede electrónica, Oficina de Extranjería или Policía — слоты ловят ночью/утром.",
      "Gestoría €150–400 ускоряет NIE в Valencia; официального «VIP-окна» нет.",
      "Empadronamiento в ayuntamiento Valencia: cita online или walk-in по району — 1–5 дней.",
      "Airbnb без autorización владельца — частый отказ в padrón; short-term contrato помогает не всегда.",
      "С resguardo EX-15 банк иногда открывает счёт до готового NIE — зависит от филиала.",
    ],
  },
  {
    heading: "Где сайт и практика расходятся",
    section_kind: "gap",
    bullets: [
      "Сайт: «NIE и empadronamiento в любой последовательности» → банки и gestorías в Valencia просят NIE + padrón вместе.",
      "Сайт: cita previa «доступна» → слоты на extranjería в пиковые недели исчезают за минуты.",
      "Чат: «empadronamiento по Airbnb» → ayuntamiento часто требует contrato ≥6 мес. или autorización propietario.",
      "Ожидание: NIE за 1 день → в Madrid/Barcelona 2–4 недели; Valencia обычно 1–2 недели при gestoría.",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    bullets: [
      "Ошибка: empadronamiento до NIE — теряете неделю на повторный визит в ayuntamiento.",
      "Ошибка: перевод caução без Spanish IBAN — арендодатель отказывает до NIE.",
      "Ошибка: один certificado de empadronamiento без historial — extranjería просит актуальный (<3 мес.).",
      "Ошибка: ждать «готовый NIE» для записи на TIE — resguardo + padrón часто достаточны для cita.",
    ],
  },
];

const keyTakeaways = [
  "Официально: NIE (EX-15 + tasa 790) и empadronamiento — отдельные процедуры в разных органах.",
  "На практике: NIE/resguardo → empadronamiento → банк → cita extranjería — безопасный порядок в Valencia.",
  "Расхождение: «можно без padrón» vs требование банка и TIE — padrón нужен почти всегда.",
  "Официально: certificado de empadronamiento бесплатен; historial — для TIE и школы.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Что делать первым — NIE или empadronamiento?",
    a: "По правилам порядок не фиксирован. На практике в Valencia сначала NIE или resguardo подачи, затем padrón — так проще банк и TIE.",
  },
  {
    q: "Можно empadronamiento без contrato de alquiler?",
    a: "Официально — с autorización владельца жилья. На практике Airbnb без письма propietario часто не принимают.",
  },
  {
    q: "Сколько ждать NIE в Valencia?",
    a: "По правилам — после подачи выдают resguardo сразу, NIE на пластике/бумаге 1–4 недели. Gestoría сокращает до ~1 недели.",
  },
  {
    q: "Нужен ли NIE для empadronamiento?",
    a: "Не всегда обязателен на входе, но ayuntamiento просит identificación; паспорт + NIE/resguardo ускоряют процесс.",
  },
];

export const NIE_EMPADRONAMIENTO_GUIDE = {
  slug: NIE_EMPADRONAMIENTO_SLUG,
  category: "NIE и padrón",
  content_kind: "guide" as ContentKind,
  title: "NIE и empadronamiento в Испании: порядок шагов",
  excerpt:
    "Cita previa, EX-15, certificado de empadronamiento — безопасная последовательность для Valencia и других городов, без путаницы из чатов.",
  seo_title: "NIE и empadronamiento Испания 2026 — порядок",
  seo_description:
    "NIE и empadronamiento в Испании 2026: порядок шагов для Valencia, cita previa, EX-15, certificado de empadronamiento. Практика для RU/BY/UA/KZ.",
  quick_answer:
    "В Valencia и большинстве городов Испании сначала подайте на NIE (EX-15 + tasa 790), получите resguardo, затем empadronamiento в ayuntamiento с contrato или autorización владельца. Без padrón сложнее банк, TIE и utilities.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Sede — cita previa", url: "https://sede.administracionespublicas.gob.es/" },
    { title: "Agencia Tributaria — NIE", url: "https://www.agenciatributaria.gob.es/" },
    { title: "Ayuntamiento de Valencia", url: "https://www.valencia.es/" },
  ],
  topic_tags: ["nie", "empadronamiento", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["nie", "empadronamiento", "valencia"],
    contentKind: "guide",
    extra: ["extranjeria", "padron"],
  }),
  source_channel: "valenforum+spain_granitsa",
  source_label: "editorial:nie-padron",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};
