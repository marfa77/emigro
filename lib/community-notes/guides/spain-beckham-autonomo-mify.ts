/** Hand-curated Spain satellite guide — Beckham Law myths. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const BECKHAM_SLUG = "beckham-autonomo-mify-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      glossaryForSlug(BECKHAM_SLUG)!,
      "Слова, которые услышите у gestoría и в Agencia Tributaria — разберём до заявления на régimen impatriados, пока «DNV = 24%» не всплыло в самый дорогой момент."
    ),
  },
  {
    heading: "Официально: Ley Beckham (régimen especial)",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: régimen especial impatriados — не автомат с digital nomad visa и не замена autónomo.",
      "Что делать: проверьте eligibility (не резидент ES 5 лет, qualifying income) и срок заявления в Agencia Tributaria.",
      "Зачем: без одобренного régimen вы на обычном прогрессивном IRPF — разница тысячи евро в год.",
      "Главное: Beckham 24% до €600k — отдельное заявление; DNV — иммиграция, не налог.",
    ],
    bullets: [
      "Заявление в Agencia Tributaria в срок после начала работы в ES.",
      "Применимо к employment и некоторым director cases — не всем remote freelancers.",
      "Autónomo: alta en RETA + Seguridad Social — отдельно от Beckham.",
      "Срок режима — до 6 лет при соблюдении условий.",
      "Modelo 149 / заявление impatriados — сверяйте актуальный срок на сайте Agencia Tributaria.",
    ],
  },
  {
    heading: "Мифы из чатов",
    section_kind: "practice",
    paragraphs: [
      "Зачем вам это сейчас: в чатах каждую неделю «DNV = Beckham 24%» и «autónomo не нужен» — оба утверждения опасны без advisor.",
      "Что делать: разберите мифы ниже с gestoría до первого invoice и до modelo 149.",
      "Зачем: ошибка в структуре дохода ломает и налог, и SS.",
      "Главное: teletrabajo не даёт 24% автоматически; alta autónomo часто обязательна для freelancers.",
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
    paragraphs: [
      "Что делать: сверяйте советы из чатов с Agencia Tributaria и Seg-Social — не с чужим «у меня 24%».",
      "Зачем: «переехал = Beckham» и remote на foreign company — самые дорогие иллюзии.",
      "Главное: без заявления и eligibility — обычный IRPF; remote часто = autónomo или PE-риск.",
    ],
    bullets: [
      "В чатах пишут «переехал = Beckham», а без заявления и eligibility — обычный IRPF прогрессив.",
      "Remote на foreign company → часто autónomo или PE риск, не Beckham.",
      "UA temporary protection — отдельный tax track, не Beckham.",
      "На сайте «24% flat» звучит просто — на деле лимиты, исключения и окно подачи.",
    ],
  },
  {
    heading: "IRPF и SS: что считать отдельно",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: Beckham (modelo 149) и alta autónomo (RETA) — параллельные треки.",
      "Что делать: посчитайте IRPF impatriados и cuota autónomo отдельно — не «в одном флаконе».",
      "Зачем: DNV teletrabajo не освобождает от SS, если доход оформлен как autónomo.",
      "Главное: 24% на eligible income ≠ отмена Seguridad Social.",
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
    paragraphs: [
      "Что делать: придите к gestoría с контрактом/invoice structure и списком вопросов ниже.",
      "Зачем: один час консультации дешевле года неправильного IRPF.",
      "Главное: зафиксируйте письменно — подпадаете ли под impatriados и нужен ли alta autónomo.",
    ],
    bullets: [
      "Подпадаю ли под impatriados с моим contrato?",
      "Нужен ли alta autónomo при DNV и foreign employer?",
      "Когда подавать modelo 149 / заявление Beckham?",
      "Как совмещать SS autónomo и foreign payroll?",
      "Какие документы на окно подачи и что будет при пропуске срока?",
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    paragraphs: [
      "Что делать: пройдите список до первого invoice и до заявления Beckham.",
      "Зачем: штрафы SS и пересчёт IRPF бьют сильнее, чем «сэкономить на gestoría».",
      "Главное: не путайте DNV, Beckham и autónomo — это три разных трека.",
    ],
    bullets: [
      "Ошибка: считать DNV автоматическим Beckham 24% без заявления.",
      "Ошибка: не оформлять alta autónomo при invoice income «потому что remote».",
      "Ошибка: пропускать окно подачи impatriados и оставаться на прогрессивном IRPF.",
      "Ошибка: игнорировать SS cuota первый год — штрафы Hacienda + Seg-Social.",
      "Ошибка: смешивать foreign payroll и autónomo без сверки modelo с gestoría.",
    ],
  },
];

const keyTakeaways = [
  "Официально: Beckham — régimen для eligible impatriados, не default для DNV.",
  "На практике: autónomo + SS часто обязательны для freelancers — не «опция».",
  "Расхождение: «24% flat» vs прогрессив IRPF без одобренного régimen.",
  "Официально: заявление в Agencia Tributaria и alta RETA — разные сроки и органы.",
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
  content_kind: "guide" as ContentKind,
  title: "Beckham Law и autónomo: мифы из чатов",
  excerpt:
    "24% не автоматом с DNV; alta en Seguridad Social и когда régimen impatriados реально применим.",
  seo_title: "Beckham Law Испания 2026 — мифы DNV",
  seo_description:
    "Beckham Law и autónomo в Испании 2026: мифы из Telegram-чатов, 24% impatriados vs DNV teletrabajo. Когда нужен alta SS — для RU/BY релокантов в Valencia.",
  quick_answer:
    "«Мне же положен Beckham с digital nomad» — частая фраза, от которой потом больно в Agencia Tributaria. Régimen impatriados не включается автоматом с DNV: нужны eligibility и отдельное заявление. Autónomo и Seguridad Social — свой обязательный трек для многих freelancers, не «миф gestoría».",
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
    contentKind: "guide",
    extra: ["beckham", "impuestos"],
  }),
  source_channel: "spainchats+spain_granitsa",
  source_label: "editorial:beckham-myths+voice-pass",
  pillar_guide_slug: "vnj-ispaniya-2026",
};
