/** Hand-curated Spain satellite guide — rent Idealista Valencia. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const ARENDA_VALENCIA_SLUG = "arenda-valencia-idealista-2026";

const bodySections: NoteBodySection[] = [
  { ...buildGlossarySection(glossaryForSlug(ARENDA_VALENCIA_SLUG)!) },
  {
    heading: "Официально: contrato de alquiler",
    section_kind: "official",
    paragraphs: [
      "LAU (Ley de Arrendamientos Urbanos) регулирует аренду жилья. Fianza — до 1 месяца renta для физлица-арендодателя; agency fee часто 1 месяц + IVA.",
    ],
    bullets: [
      "Contrato: NIE обеих сторон, IBAN, описание fianza и gastos de comunidad.",
      "Fianza депонируется в IVAMA (Valencia) / organo autonómico — не «на карту» без договора.",
      "Empadronamiento: право tenant после contrato; нужен для TIE и школы.",
      "Alquiler temporal (<11 мес.) — другие правила; проверяйте cláusula temporada.",
    ],
  },
  {
    heading: "Практика Idealista Valencia",
    section_kind: "practice",
    paragraphs: [
      "В @valenciarusia и @valenforum типичный сценарий: agency просит NIE + payslips + Spanish IBAN ещё до viewing. Ruzafa, Benimaclet, Campanar — €900–1400 за T2 в 2026.",
    ],
    bullets: [
      "Idealista/Fotocasa: фильтр «sin mascotas» / «con NIE» — отсеивайте до звонка.",
      "Agency fee 1 mes + 21% IVA — торгуется редко; заложите в бюджет.",
      "Depósito + первый mes — перевод с concepto «fianza + mes + dirección».",
      "Contrato на испанском — попросите краткий summary ключевых cláusulas.",
      "Fotos состояния + inventario при check-in — спор через 12 мес. без них сложнее.",
    ],
  },
  {
    heading: "Где объявление и реальность",
    section_kind: "gap",
    bullets: [
      "Idealista: «disponible ya» → flat уже сдан, объявление не снято.",
      "«Sin aval» → всё равно просят 3 meses fianza или prepago.",
      "В чатах релокантов часто пишут «наличные fianza», но на практике риск без IVAMA deposit — официально fianza через organismo.",
      "Airbnb long-term — не всегда годится для empadronamiento/TIE.",
    ],
  },
  {
    heading: "Районы и бюджет Valencia",
    section_kind: "practice",
    paragraphs: [
      "В @valenciarusia 2026: T2 в Benimaclet/Campanar €850–1100; Ruzafa €1100–1400; Eixample дороже. Agency fee не входит в renta — заложите +1 mes + IVA в первый месяц.",
    ],
    bullets: [
      "Benimaclet / Algirós — чаще принимают NIE без aval, но проверяйте contrato на empadronamiento.",
      "Ruzafa / El Carmen — высокий спрос; viewing в тот же день, если NIE + IBAN готовы.",
      "Fotocasa дублирует Idealista — сравнивайте цену и agency.",
      "Contrato temporal 11 мес. — уточните prórroga и право padrón для TIE.",
      "Inventario + фото дефектов — подписывайте в день check-in, не «потом».",
    ],
  },
  {
    heading: "До подписи: чеклист",
    section_kind: "practice",
    bullets: [
      "NIE + Spanish IBAN готовы — иначе откажут после viewing.",
      "Проверьте propietario в Registro / agency licencia.",
      "Fianza: сумма, срок возврата, cuenta deposito.",
      "Gastos: comunidad, IBI — кто платит; включено ли в renta.",
    ],
  },
];

const keyTakeaways = [
  "Официально: fianza до 1 mes для частного арендодателя; contrato с NIE.",
  formatPracticeTakeaway({
    channels: ["valenciarusia"],
    period: "2025–2026",
    claim:
      "агентства в Valencia часто просят NIE и IBAN ещё до viewing (просмотра квартиры)",
    forReader: "комиссия agency обычно ~1 mes (месяц аренды) + IVA — закладывайте в бюджет до подписания",
  }),
  "Расхождение: «sin aval» vs triple fianza/prepago в чатах.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужен ли NIE для аренды в Valencia?",
    a: "По закону contrato возможен с pasaporte. На практике agency и propietario требуют NIE + IBAN до подписи.",
  },
  {
    q: "Сколько стоит agency fee?",
    a: "Часто 1 месячная renta + IVA 21%. На практике €800–1200 для T2 в Valencia centro/Ruzafa.",
  },
  {
    q: "Можно ли fianza наличными?",
    a: "Официально fianza через deposito legal. Наличные «на руку» — красный флаг мошенничества.",
  },
  {
    q: "Какие районы Valencia проще для первого contrato?",
    a: "По правилам район не важен. На практике Benimaclet, Campanar и Algirós чаще принимают NIE + IBAN без aval; Ruzafa дороже и конкурентнее.",
  },
];

export const ARENDA_VALENCIA_GUIDE = {
  slug: ARENDA_VALENCIA_SLUG,
  category: "Аренда",
  content_kind: "tip" as ContentKind,
  title: "Аренда в Valencia: Idealista и contrato до подписи",
  excerpt:
    "Депозит, agency fee, NIE + IBAN до viewing — что проверить на Idealista, чтобы не потерять неделю на отказ agency.",
  seo_title: "Аренда Valencia 2026 — Idealista и contrato",
  seo_description:
    "Аренда в Valencia 2026: Idealista, fianza, agency fee, NIE и Spanish IBAN до подписи contrato. Практика для русскоязычных релокантов в Испании.",
  quick_answer:
    "В Valencia agency на Idealista чаще просят NIE и Spanish IBAN ещё до viewing — и это не «развод», а фильтр рынка. Fianza — до 1 mes по LAU; agency fee ~1 mes + IVA. Перед подписью проверьте deposito fianza, gastos de comunidad и право на empadronamiento — иначе ключи есть, а padrón нет.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Idealista", url: "https://www.idealista.com/" },
    { title: "IVAMA — fianzas Valencia", url: "https://www.gva.es/" },
  ],
  topic_tags: ["alquiler", "arenda", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["alquiler", "arenda", "valencia"],
    contentKind: "tip",
    extra: ["idealista", "nie"],
  }),
  source_channel: "valenciarusia+valenforum",
  source_label: "editorial:alquiler-valencia+voice-pass",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};
