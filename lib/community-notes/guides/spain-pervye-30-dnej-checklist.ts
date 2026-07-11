/** Hand-curated Spain satellite guide — first 30 days checklist. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PERVYE_30_SLUG = "pervye-30-dnej-v-ispanii-satelit-2026";

const bodySections: NoteBodySection[] = [
  { ...buildGlossarySection(glossaryForSlug(PERVYE_30_SLUG)!) },
  {
    heading: "Неделя 1: SIM, NIE, временный адрес",
    section_kind: "official",
    paragraphs: [
      "Первые 7 дней — связь и старт NIE. Полный pillar: [первые 30 дней в Испании на emigro.online](/ru/guides/pervye-30-dnej-v-ispanii-2026).",
    ],
    bullets: [
      "SIM/eSIM: Movistar, Vodafone, Orange — prepaid от €10.",
      "Cita previa NIE: EX-15 + tasa 790 на sede.",
      "Жильё short-term с autorización для будущего padrón.",
      "Не переводите fianza до NIE + проверки contrato.",
    ],
  },
  {
    heading: "Неделя 2: empadronamiento и банк",
    section_kind: "practice",
    paragraphs: [
      "Без padrón и ES IBAN большинство шагов встанут. См. также [NIE и empadronamiento](/notes/nie-empadronamiento-poryadok-2026).",
    ],
    bullets: [
      "Empadronamiento в ayuntamiento — certificado + historial.",
      "CaixaBank/Santander: NIE + padrón + KYC.",
      "Revolut параллельно — не для fianza/TIE.",
      "Utilities: Iberdrola/Endesa просят NIE + IBAN.",
    ],
  },
  {
    heading: "Неделя 3–4: TIE, SS, закрепление",
    section_kind: "practice",
    bullets: [
      "Cita extranjería + huellas — см. [TIE Valencia](/notes/tie-cita-extranjeria-valencia-2026).",
      "DNV/autónomo: alta Seguridad Social через gestoría.",
      "Seguro médico — активна до получения SS.",
      "Сохраните все resguardos и PDF — дозапросы типичны.",
    ],
  },
  {
    heading: "Типичные ошибки первого месяца",
    section_kind: "practice",
    bullets: [
      "Ошибка: TIE «потом» — пропуск 30-day window visado.",
      "Ошибка: аренда без empadronamiento clause.",
      "Ошибка: autónomo/Beckham «разберу потом» — штрафы SS.",
      "Ошибка: один чеклист из PT-чата — NIF ≠ NIE.",
    ],
  },
];

const keyTakeaways = [
  "Официально: visado D → TIE в срок; NIE и padrón — параллельно с первой недели.",
  "На практике: NIE → padrón → IBAN → cita TIE — порядок для Valencia.",
  "Расхождение: «можно месяц без TIE» vs 30-day rule на visado.",
  "Pillar: [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026) для визы и DNV.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С чего начать в первый день?",
    a: "SIM, жильё с возможностью padrón, запись на NIE. Не подписывайте long-term contrato без проверки.",
  },
  {
    q: "Можно отложить TIE на второй месяц?",
    a: "По visado — обычно 30 дней. На практике cita занимает недели — начинайте в неделю 1.",
  },
  {
    q: "Где полный чеклист?",
    a: "Pillar на emigro.online: /ru/guides/pervye-30-dnej-v-ispanii-2026 — этот материал — сжатая практика satellite.",
  },
  {
    q: "Valencia или Madrid быстрее?",
    a: "Valencia обычно короче очереди NIE/TIE; Madrid/Barcelona закладывайте +2–4 недели.",
  },
];

export const PERVYE_30_GUIDE = {
  slug: PERVYE_30_SLUG,
  category: "Первый месяц",
  content_kind: "guide" as ContentKind,
  title: "Первые 30 дней в Испании: чеклист satellite",
  excerpt:
    "NIE, empadronamiento, банк, TIE, Seguridad Social — порядок для Valencia после visado D, без путаницы с португальским чеклистом.",
  seo_title: "Первые 30 дней Испания 2026 — чеклист",
  seo_description:
    "Чеклист первых 30 дней в Испании 2026: NIE, empadronamiento, банк, TIE, Seguridad Social. Практика Valencia для RU/BY/UA/KZ после visado D.",
  quick_answer:
    "Первый месяц в Испании (Valencia): SIM → NIE → empadronamiento → Spanish IBAN → cita TIE/huellas → SS при employment/autónomo. Срок TIE по visado — не откладывайте. Pillar: emigro.online/ru/guides/pervye-30-dnej-v-ispanii-2026.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Sede electrónica", url: "https://sede.administracionespublicas.gob.es/" },
    { title: "Seguridad Social", url: "https://www.seg-social.es/" },
    { title: "Pillar — 30 дней ES", url: "https://www.emigro.online/ru/guides/pervye-30-dnej-v-ispanii-2026" },
  ],
  topic_tags: ["nie", "tie", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["nie", "tie", "valencia"],
    contentKind: "guide",
    extra: ["checklist", "extranjeria"],
  }),
  source_channel: "spain_granitsa+valenforum+spainchats",
  source_label: "editorial:30-days",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};
