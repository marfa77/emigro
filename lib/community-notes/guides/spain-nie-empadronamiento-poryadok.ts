/** Hand-curated Spain satellite guide — NIE + empadronamiento order. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const NIE_EMPADRONAMIENTO_SLUG = "nie-empadronamiento-poryadok-2026";

const bodySections: NoteBodySection[] = [
  { ...buildGlossarySection(glossaryForSlug(NIE_EMPADRONAMIENTO_SLUG)!) },
  {
    heading: "Официально: что такое NIE и empadronamiento",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: без NIE и padrón в Valencia почти не открыть банк, не закрыть аренду и не подать на TIE.",
      "Что делать: оформите NIE (EX-15 + tasa 790) и empadronamiento в ayuntamiento как два отдельных шага.",
      "Зачем: это разные органы — Agencia Tributaria / Policía и ayuntamiento; путаница порядка стоит недели.",
      "Главное: NIE — налоговый ID; empadronamiento — регистрация по адресу; оба нужны для быта и extranjería.",
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
      "Зачем вам это сейчас: в @valenforum и @spain_granitsa в 2025–2026 чаще рекомендуют NIE → padrón → банк → cita TIE.",
      "Что делать: сначала NIE или resguardo подачи, затем empadronamiento, потом банк.",
      "Зачем: обратный порядок часто стопорит банк и utilities на повторный визит в ayuntamiento.",
      "Главное: безопасный порядок в Valencia — NIE/resguardo, затем padrón, потом IBAN и TIE.",
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
    paragraphs: [
      "Что делать: не копируйте «любой порядок» с сайта — в Valencia банк и gestoría просят NIE + padrón вместе.",
      "Зачем: слоты и Airbnb-кейсы из чатов расходятся с формальными правилами сильнее всего.",
      "Главное: сайт описывает процедуры; жизнь требует последовательности и актуального certificado.",
    ],
    bullets: [
      "На сайте звучит как «NIE и empadronamiento в любой последовательности», а банки и gestorías в Valencia просят NIE + padrón вместе.",
      "На сайте cita previa «доступна», а слоты на extranjería в пиковые недели исчезают за минуты.",
      "В чатах релокантов часто пишут «empadronamiento по Airbnb», но ayuntamiento часто требует contrato ≥6 мес. или autorización propietario.",
      "Ожидание: NIE за 1 день → в Madrid/Barcelona 2–4 недели; Valencia обычно 1–2 недели при gestoría.",
    ],
  },
  {
    heading: "Пошагово: NIE и padrón в Valencia",
    section_kind: "practice",
    paragraphs: [
      "Зачем вам это сейчас: типовой маршрут из @valenforum — день 1–3 cita NIE, день 4–7 padrón, день 8–14 банк.",
      "Что делать: пройдите пять шагов; gestoría сокращает NIE, но не заменяет визит в ayuntamiento.",
      "Зачем: без historial empadronamiento TIE часто дозапрашивает актуальный certificado.",
      "Главное: сохраните resguardo EX-15 в облако — он нужен банку и TIE до готового NIE.",
    ],
    bullets: [
      "Шаг 1: скачайте EX-15, оплатите tasa 790-012, запишитесь на sede (Policía Nacional / Extranjería Valencia).",
      "Шаг 2: на приёме получите resguardo — сохраните PDF; он нужен банку и TIE до готового NIE.",
      "Шаг 3: ayuntamiento — cita online «empadronamiento»; contrato + DNI/NIE владельца или autorización firmada.",
      "Шаг 4: certificado de empadronamiento + historial — запросите сразу; TIE просит актуальный (<3 мес.).",
      "Шаг 5: с NIE + padrón открывайте ES IBAN — см. [банк и IBAN](/notes/bank-iban-nerezident-ispaniya-2026).",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Что делать: проверьте список до перевода fianza и до записи на TIE.",
      "Зачем: повторный визит в ayuntamiento и отказ арендодателя — самые частые потери первой недели.",
      "Главное: не ждите «готовый NIE» для всего — resguardo + padrón часто открывают банк и cita TIE.",
    ],
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
  formatPracticeTakeaway({
    channels: ["valenciarusia"],
    period: "2025–2026",
    claim:
      "безопасный порядок в Valencia: NIE или resguardo, затем empadronamiento, потом банк и cita в extranjería",
    forReader: "padrón (прописка) нужен почти всегда для IBAN и TIE — «можно без padrón» в чатах не срабатывает на практике",
  }),
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
  source_label: "editorial:nie-padron+voice-pass",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};
