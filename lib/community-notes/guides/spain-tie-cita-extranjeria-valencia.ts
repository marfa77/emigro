/** Hand-curated Spain satellite guide — TIE / cita extranjería. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const TIE_CITA_SLUG = "tie-cita-extranjeria-valencia-2026";

const bodySections: NoteBodySection[] = [
  { ...buildGlossarySection(glossaryForSlug(TIE_CITA_SLUG)!) },
  {
    heading: "Официально: TIE и cita extranjería",
    section_kind: "official",
    paragraphs: [
      "После въезда по визе D нужно подать на Tarjeta de Identidad de Extranjero (TIE) в срок, указанный в visado (обычно 30 дней). Запись — cita previa в Oficina de Extranjería / Policía.",
    ],
    bullets: [
      "Huellas dactilares — биометрия на приёме; resguardo выдают до готовности пластика.",
      "Документы: pasaporte, visado, empadronamiento, seguro médico, tasa 790, фото.",
      "Barcelona и Madrid — отдельные sedes; provincia Valencia — Comisaría / extranjería по адресу.",
      "Пропуск срока visado — штраф и риск отказа; gestoría не отменяет формальный deadline.",
    ],
  },
  {
    heading: "Практика: Valencia vs Barcelona",
    section_kind: "practice",
    paragraphs: [
      "В @migranty_barselona и @valenforum три боли: «слот исчез», «huellas без cita», «resguardo не принимают в банке». Valencia обычно быстрее Barcelona по очередям, но cita всё равно конкурентная.",
    ],
    bullets: [
      "Valencia: cita на sede — пробуйте 08:00–09:00 Europe/Madrid; VPN иногда ломает sede.",
      "Barcelona: очереди длиннее; gestoría €300–600 за сопровождение cita + huellas.",
      "PDF пакет: сканы ≤2 MB, читаемые; частая причина отказа — нечёткий pasaporte.",
      "Resguardo TIE часто принимают банк и Idealista-агентства вместо пластика.",
      "Пластик TIE: 30–90 дней после huellas — норма в 2026 по чатам.",
    ],
  },
  {
    heading: "Где расходится портал и жизнь",
    section_kind: "gap",
    bullets: [
      "Sede: «есть свободные citas» → на экране 0 слотов в Barcelona whole week.",
      "Чат: «можно без записи в Valencia» → развернут без resguardo cita previa.",
      "Сайт: 30 дней на TIE → gestoría говорит «2 недели на cita + ещё на huellas» — закладывайте 6–8 недель цикл.",
      "Ожидание: resguardo = TIE → utilities иногда требуют уже пластик или NIE definitivo.",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    bullets: [
      "Ошибка: ехать в extranjería без cita — потерянный день.",
      "Ошибка: empadronamiento старше 3 мес. без обновления certificado.",
      "Ошибка: seguro médico не на испанском/не покрывает repatriación — дозапрос.",
      "Ошибка: ждать пластик для открытия банка — resguardo + NIE часто достаточно.",
    ],
  },
];

const keyTakeaways = [
  "Официально: TIE подаётся в срок visado через cita previa + huellas.",
  "На практике: Valencia быстрее Barcelona, но слоты ловят утром; gestoría €300–600.",
  "Расхождение: resguardo «не TIE» для банка — в Valencia чаще принимают resguardo huellas.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно попасть на huellas без cita?",
    a: "По правилам — нет, нужна cita previa. На практике в редких sedes принимают по resguardo записи — не рассчитывайте.",
  },
  {
    q: "Valencia или Barcelona — где быстрее TIE?",
    a: "По опыту чатов Valencia 2026: cita 1–3 недели, Barcelona 3–8 недель. Официальные сроки одинаковы — разница в очередях.",
  },
  {
    q: "Что делать, если cita пропала?",
    a: "Обновляйте sede несколько раз в день, пробуйте соседние municipios provincia, gestoría или alert-сервисы (осторожно с мошенниками).",
  },
  {
    q: "Какие документы на huellas обязательны?",
    a: "По правилам: pasaporte, visado, empadronamiento, seguro médico, tasa 790, фото. На практике extranjería Valencia дозапрашивает bank statements и contrato trabajo — держите PDF ≤2 MB.",
  },
];

export const TIE_CITA_GUIDE = {
  slug: TIE_CITA_SLUG,
  category: "TIE и extranjería",
  content_kind: "lifehack" as ContentKind,
  title: "TIE и cita extranjería: Valencia и Barcelona",
  excerpt:
    "Huellas, resguardo, очереди sede — как не потерять неделю на записи в extranjería без мифов про «живую очередь».",
  seo_title: "TIE extranjería Valencia 2026 — cita и huellas",
  seo_description:
    "TIE и cita extranjería в Valencia и Barcelona 2026: huellas, resguardo, запись sede. Практика для русскоязычных релокантов с visado D в Испании.",
  quick_answer:
    "TIE оформляется через cita previa на sede, затем huellas. В Valencia слоты ловят утром; Barcelona дольше. Resguardo после huellas часто принимают банк и аренда до пластика.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Sede — extranjería", url: "https://sede.administracionespublicas.gob.es/" },
    { title: "Ministerio Inclusion — extranjería", url: "https://www.inclusion.gob.es/" },
  ],
  topic_tags: ["tie", "extranjeria", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["tie", "extranjeria", "valencia"],
    contentKind: "lifehack",
    extra: ["barcelona", "huellas"],
  }),
  source_channel: "valenforum+migranty_barselona+spain_granitsa",
  source_label: "editorial:tie-cita",
  pillar_guide_slug: "vnj-ispaniya-2026",
};
