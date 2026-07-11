/** Hand-curated Spain satellite guide — DNV / UGE route. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const DNV_UGE_SLUG = "dnv-uge-konsulstvo-2026";

const bodySections: NoteBodySection[] = [
  { ...buildGlossarySection(glossaryForSlug(DNV_UGE_SLUG)!) },
  {
    heading: "Официально: teletrabajo и UGE",
    section_kind: "official",
    paragraphs: [
      "Digital nomad / teletrabajo internacional — резиденция по Ley de Startups. Подача: консульство в стране резидентства или UGE (Unidad de Grandes Empresas) при уже легальном пребывании в ES.",
    ],
    bullets: [
      "Порог дохода 2026: ~€2 849/мес. (200% SMI); до 20% дохода от испанских клиентов.",
      "Консульство: visado D → въезд → TIE в 30 дней.",
      "UGE: для тех, кто уже в ES на legal stay (например, безвиз + legalización) — отдельный трек.",
      "Документы: контракт/клиенты 3+ мес., bank statements, seguro, antecedentes penales с апостилем.",
    ],
  },
  {
    heading: "Практика: консульство vs UGE",
    section_kind: "practice",
    paragraphs: [
      "В @spain_granitsa и @spainchats 2025–2026: большинство RU/BY идут через консульство (Москва, SPb). UGE — для edge-кейсов уже внутри ES; не «быстрый обход» очереди консульства.",
    ],
    bullets: [
      "Консульство: срок 2–4 мес. на рассмотрение в 2026; запись отдельно от подачи.",
      "UGE: нужен legal stay + пакет на испанском; gestoría €800–2000 за сопровождение.",
      "20% rule: фриланс с одним ES-клиентом — считайте долю до подачи.",
      "Семья: dependientes — отдельные формы и доход × коэффициенты.",
      "После одобления: alta autónomo или employment — зависит от маршрута; SS обязательна для большинства.",
    ],
  },
  {
    heading: "Где ожидания расходятся с реальностью",
    section_kind: "gap",
    bullets: [
      "Чат: «UGE за 2 недели» → официально UGE не заменяет консульскую визу для въеза из third country.",
      "Сайт консульства: список документов → дозапрос перевода jurado типичен.",
      "«Remote work = Beckham 24%» — налоговый режим отдельная история, не автоматом с DNV.",
      "N26/Revolut как proof of income — консульство просит statements с именем и stable history.",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    bullets: [
      "Ошибка: подавать UGE туристом без legal stay — отказ.",
      "Ошибка: >20% дохода из Испании на teletrabajo — несоответствие программе.",
      "Ошибка: просрочить TIE после visado D — проблемы с продлением.",
      "Ошибка: antecedentes без apostilla — возврат пакета.",
    ],
  },
];

const keyTakeaways = [
  "Официально: DNV teletrabajo — €2 849/мес., max 20% ES income; visado D через консульство.",
  "На практике: RU/BY чаще консульство 2–4 мес.; UGE — для уже легального пребывания.",
  "Расхождение: «UGE быстрее» vs необходимость legal stay — не shortcut с туристическим входом.",
  "Официально: после visado — TIE в 30 дней; см. pillar [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026).",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "UGE или консульство — что выбрать?",
    a: "По правилам для въеза из РФ/РБ — консульская visado D. UGE — если вы уже легально в ES и соответствуете требованиям UGE. На практике 90% маршрута — консульство.",
  },
  {
    q: "Сколько ждать решение консульства?",
    a: "Официально сроки не фиксированы. На практике 2026: 2–4 месяца после полного пакета в Москве/SPb.",
  },
  {
    q: "Можно ли работать на испанского клиента?",
    a: "Да, но не более 20% совокупного дохода по teletrabajo. Превышение — другой тип резиденции.",
  },
  {
    q: "Нужен ли autónomo после DNV?",
    a: "Зависит от структуры дохода. Многие remote workers оформляют alta autónomo и SS — сверяйте с gestoría до TIE.",
  },
];

export const DNV_UGE_GUIDE = {
  slug: DNV_UGE_SLUG,
  category: "DNV и UGE",
  content_kind: "guide" as ContentKind,
  title: "DNV Испания: UGE vs консульство — маршрут 2026",
  excerpt:
    "Teletrabajo, порог €2 849/мес., пакет документов и когда UGE не заменяет консульскую подачу.",
  seo_title: "DNV Испания 2026 — UGE vs консульство",
  seo_description:
    "Digital nomad visa Испания 2026: teletrabajo, UGE vs консульство, порог €2 849/мес., 20% rule. Маршрут для RU/BY/UA/KZ с visado D и TIE.",
  quick_answer:
    "Digital nomad (teletrabajo) в Испании 2026: доход от ~€2 849/мес., до 20% из ES. Основной путь для RU/BY — консульство → visado D → TIE. UGE — для легального пребывания уже внутри страны, не замена визы.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "UGE — Ley de Startups", url: "https://www.inclusion.gob.es/" },
    { title: "Consulado España Rusia", url: "https://www.exteriores.gob.es/" },
  ],
  topic_tags: ["dnv", "teletrabajo", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["dnv", "teletrabajo", "valencia"],
    contentKind: "guide",
    extra: ["uge", "extranjeria"],
  }),
  source_channel: "spain_granitsa+spainchats",
  source_label: "editorial:dnv-uge",
  pillar_guide_slug: "vnj-ispaniya-2026",
};
