/** Hand-curated Spain satellite guide — Beckham Law myths. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const BECKHAM_SLUG = "beckham-autonomo-mify-2026";

const bodySections: NoteBodySection[] = [
  {
    heading: "Официально: Ley Beckham (régimen especial)",
    section_kind: "official",
    paragraphs: [
      "Régimen especial impatriados — пониженная ставка IRPF 24% на доход до €600k для «новых» резидентов, не бывших резидентов ES 5 лет. Не автоматически для DNV и не замена autónomo.",
    ],
    bullets: [
      "Заявление в Agencia Tributaria в срок после начала работы в ES.",
      "Применимо к employment и некоторым director cases — не всем remote freelancers.",
      "Autónomo: alta en RETA + Seguridad Social — отдельно от Beckham.",
      "Срок режима — до 6 лет при соблюдении условий.",
    ],
  },
  {
    heading: "Мифы из чатов",
    section_kind: "practice",
    paragraphs: [
      "В @spainchats каждую неделю: «DNV = Beckham 24%» и «autónomo не нужен». Оба утверждения опасны без gestoría/advisor.",
    ],
    bullets: [
      "Миф: teletrabajo автоматом Beckham — нужен qualifying employment contract с ES или eligible structure.",
      "Миф: 24% на весь мировой доход — лимиты и исключения по Agencia Tributaria.",
      "Миф: autónomo «только для испанских клиентов» — alta нужна многим DNV с invoice income.",
      "Миф: не платить SS первый год — штрафы Hacienda + Seguridad Social.",
      "Реальность: gestoría €80–150/мес. для autónomo + tax filing — норма.",
    ],
  },
  {
    heading: "Где ожидание и налоги расходятся",
    section_kind: "gap",
    bullets: [
      "«Переехал = Beckham» → без заявления и eligibility — обычный IRPF прогрессив.",
      "Remote на foreign company → часто autónomo или PE риск, не Beckham.",
      "UA temporary protection — отдельный tax track, не Beckham.",
    ],
  },
  {
    heading: "IRPF и SS: что считать отдельно",
    section_kind: "official",
    paragraphs: [
      "Beckham (modelo 149) и alta autónomo (RETA) — параллельные треки. DNV teletrabajo не освобождает от SS, если доход оформлен как autónomo или есть PE в ES.",
    ],
    bullets: [
      "IRPF impatriados: 24% на eligible income до €600k — не на весь мировой доход автоматически.",
      "Cuota autónomo 2026: от ~€230/мес. base mínima — платится независимо от Beckham.",
      "Foreign employer payroll + autónomo — риск двойного учёта; gestoría сверяет modelo 100/303.",
      "Срок Beckham: заявление в окне после начала работы; пропуск — обычный прогрессив IRPF.",
    ],
  },
  {
    heading: "Что спросить у gestoría",
    section_kind: "practice",
    bullets: [
      "Подпадаю ли под impatriados с моим contrato?",
      "Нужен ли alta autónomo при DNV и foreign employer?",
      "Когда подавать modelo 149 / заявление Beckham?",
      "Как совмещать SS autónomo и foreign payroll?",
    ],
  },
];

const keyTakeaways = [
  "Официально: Beckham — régimen для eligible impatriados, не default для DNV.",
  "На практике: autónomo + SS часто обязательны для freelancers — не «опция».",
  "Расхождение: «24% flat» vs прогрессив IRPF без одобренного régimen.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "DNV даёт Beckham 24% автоматически?",
    a: "Нет. Beckham — отдельное заявление и условия (не резидент 5 лет, eligible income). DNV — иммиграция, не налог.",
  },
  {
    q: "Нужен ли autónomo при remote work?",
    a: "Зависит от структуры. На практике многие DNV с invoice income оформляют alta autónomo — проверьте с gestoría.",
  },
  {
    q: "Сколько стоит gestoría для autónomo?",
    a: "Ориентир €80–150/мес. + SS cuota от ~€230/мес. (2026, зависит от base).",
  },
  {
    q: "Когда подавать заявление Beckham?",
    a: "По правилам — в срок после начала работы/резидентства в ES. На практике gestoría советует подать в первые 6 месяцев после alta SS или employment.",
  },
];

export const BECKHAM_GUIDE = {
  slug: BECKHAM_SLUG,
  category: "Налоги",
  content_kind: "qa" as ContentKind,
  title: "Beckham Law и autónomo: мифы из чатов",
  excerpt:
    "24% не автоматом с DNV; alta en Seguridad Social и когда régimen impatriados реально применим.",
  seo_title: "Beckham Law Испания 2026 — мифы DNV",
  seo_description:
    "Beckham Law и autónomo в Испании 2026: мифы из Telegram-чатов, 24% impatriados vs DNV teletrabajo. Когда нужен alta SS — для RU/BY релокантов.",
  quick_answer:
    "Beckham (régimen impatriados) — не автоматически с digital nomad visa. Нужны eligibility и заявление в Agencia Tributaria. Autónomo и Seguridad Social — отдельный обязательный трек для многих freelancers, не «миф gestoría».",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Agencia Tributaria", url: "https://www.agenciatributaria.gob.es/" },
    { title: "Seguridad Social — autónomos", url: "https://www.seg-social.es/" },
  ],
  topic_tags: ["dnv", "autonomo", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["dnv", "autonomo", "valencia"],
    contentKind: "qa",
    extra: ["beckham", "impuestos"],
  }),
  source_channel: "spainchats+spain_granitsa",
  source_label: "editorial:beckham-myths",
  pillar_guide_slug: "vnj-ispaniya-2026",
};
