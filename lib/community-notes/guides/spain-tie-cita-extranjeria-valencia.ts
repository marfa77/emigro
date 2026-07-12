/** Hand-curated Spain satellite guide — TIE / cita extranjería. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const TIE_CITA_SLUG = "tie-cita-extranjeria-valencia-2026";

const bodySections: NoteBodySection[] = [
  { ...buildGlossarySection(glossaryForSlug(TIE_CITA_SLUG)!) },
  {
    heading: "Официально: TIE, cita previa и huellas",
    section_kind: "official",
    paragraphs: [
      "Зачем читать: после въезда по visado D у вас ограниченный срок на подачу Tarjeta de Identidad de Extranjero (TIE) — без записи на cita previa и huellas dactilares вы рискуете штрафом и проблемами при проверке статуса.",
      "Официально TIE — пластиковая карта резидента; до неё выдают resguardo после сдачи отпечатков. Запись идёт через sede electrónica в Oficina de Extranjería или Comisaría de Policía по provincia.",
    ],
    bullets: [
      "Visado D — национальная виза; в ней указан срок подачи на TIE (обычно 30 дней с въезда).",
      "Cita previa — обязательная онлайн-запись на sede.administracionespublicas.gob.es; без неё не примут.",
      "Huellas dactilares — биометрия на приёме; после неё выдают resguardo до готовности пластика.",
      "Документы: pasaporte, visado, certificado de empadronamiento (<3 мес.), seguro médico, tasa 790, фото 32×26 мм.",
      "Provincia Valencia — Comisaría Provincial de Extranjería y Documentación (Policía Nacional); адрес и trámite на sede.",
    ],
  },
  {
    heading: "На практике: cita и очереди в Valencia",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: в @valenforum, @valenciarusia и @spain_granitsa три боли 2025–2026 — «слот исчез за секунду», «huellas без cita», «resguardo не принимают в банке». Valencia быстрее Madrid/Barcelona, но cita всё равно конкурентная.",
    ],
    bullets: [
      "Cita на sede — ловят слоты 08:00–09:00 Europe/Madrid; VPN и мобильный браузер иногда ломают портал.",
      "Полный цикл TIE в Valencia — 4–8 мес. (@valenciarusia); cita 1–3 недели, пластик 30–90 дней после huellas.",
      "Gestoría €300–600 сопровождает cita + huellas; официального «VIP-окна» нет — только помощь с записью.",
      "PDF-пакет: сканы ≤2 MB, читаемые; частая причина отказа — нечёткий pasaporte или устаревший padrón.",
      "Resguardo после huellas часто принимают банк, Idealista-агентства и utilities до пластика TIE.",
    ],
  },
  {
    heading: "Где сайт и практика расходятся",
    section_kind: "gap",
    bullets: [
      "Sede: «есть свободные citas» → на экране 0 слотов на всю неделю в пиковые месяцы (сентябрь–ноябрь).",
      "Чат: «можно без записи в Valencia» → развернут без resguardo cita previa; живой очереди нет.",
      "Сайт: 30 дней на TIE → gestoría говорит «2 недели на cita + ещё на huellas» — закладывайте 6–8 недель минимум.",
      "Ожидание: resguardo = TIE → utilities и некоторые банки требуют уже пластик или NIE definitivo.",
      "Чат Madrid/BCN: cita 2–4 мес. (@migranty_barselona) → в Valencia обычно 1–3 недели, но не гарантия.",
    ],
  },
  {
    heading: "Пошагово: TIE в Valencia",
    section_kind: "practice",
    paragraphs: [
      "Зачем читать: типовой маршрут из @valenforum (2025–2026) — от прилёта до resguardo. Предполагается, что NIE и empadronamiento уже есть — см. [NIE и padrón](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        ").",
    ],
    bullets: [
      "Шаг 1: сразу после прилёта — регистрируйтесь на sede (Extranjería → huellas / TIE); не ждите готовый NIE.",
      "Шаг 2: оплатите tasa 790 (код зависит от trámite) — квитанция PDF в пакет документов.",
      "Шаг 3: соберите папку: pasaporte + visado, certificado de empadronamiento с historial, seguro médico, фото, tasa.",
      "Шаг 4: на huellas — сдайте отпечатки, получите resguardo; сфотографируйте и сохраните в облако.",
      "Шаг 5: с resguardo открывайте банк, аренду, travel — пластик заберёте по SMS/письму через 30–90 дней.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    bullets: [
      "Ехать в extranjería без cita previa — потерянный день; в Valencia живой очереди нет.",
      "Empadronamiento старше 3 мес. без обновления certificado — дозапрос и перенос huellas.",
      "Seguro médico не на испанском / без repatriación — отказ или повторный визит.",
      "Ждать пластик TIE для банка — resguardo + NIE часто достаточно в Valencia.",
      "Откладывать cita «пока устроюсь» — слоты исчезают; бронируйте в первую неделю после прилёта.",
    ],
  },
];

const keyTakeaways = [
  "Официально: TIE подаётся в срок visado через cita previa на sede, затем huellas dactilares.",
  "На практике: в Valencia слоты ловят утром 08:00–09:00; gestoría €300–600, полный цикл 4–8 мес.",
  "Расхождение: resguardo после huellas часто принимают банк и аренда — не ждите пластик для бытовых задач.",
  "Официально: без cita previa не примут; certificado de empadronamiento должен быть актуальным (<3 мес.).",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно попасть на huellas без cita?",
    a: "Нет — по правилам нужна cita previa. На практике в редких sedes принимают по resguardo записи — не рассчитывайте.",
  },
  {
    q: "Сколько ждать TIE в Valencia?",
    a: "По правилам — resguardo сразу после huellas, пластик 30–90 дней. На практике полный цикл cita + пластик — 4–8 мес. (@valenciarusia).",
  },
  {
    q: "Что делать, если cita пропала на sede?",
    a: "Обновляйте sede несколько раз в день (утро 08:00–09:00), пробуйте соседние municipios provincia, gestoría или alert-сервисы — остерегайтесь мошенников.",
  },
  {
    q: "Какие документы на huellas обязательны?",
    a: "По правилам: pasaporte, visado, empadronamiento, seguro médico, tasa 790, фото. На практике extranjería Valencia дозапрашивает contrato trabajo и bank statements — держите PDF ≤2 MB.",
  },
  {
    q: "Нужен ли готовый NIE перед записью на TIE?",
    a: "Не обязательно — по правилам нужен visado D и padrón. На практике бронируйте cita сразу после прилёта; resguardo NIE достаточно для пакета.",
  },
];

export const TIE_CITA_GUIDE = {
  slug: TIE_CITA_SLUG,
  category: "TIE и extranjería",
  content_kind: "guide" as ContentKind,
  title: "TIE и cita extranjería в Valencia: запись и huellas",
  excerpt:
    "Cita previa на sede, huellas, resguardo и пластик — пошаговый маршрут для Valencia без мифов про «живую очередь» и потерянных слотов.",
  seo_title: "TIE extranjería Valencia 2026 — cita и huellas",
  seo_description:
    "TIE и cita extranjería в Valencia 2026: huellas, resguardo, запись sede, документы и сроки. Практика для русскоязычных релокантов с visado D в provincia Valencia.",
  quick_answer:
    "После въезда по visado D запишитесь на cita previa для TIE на sede и сдайте huellas в Comisaría de Extranjería Valencia. Слоты ловят утром 08:00–09:00; после huellas получите resguardo — его часто принимают банк и аренда до пластика.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Sede — cita previa extranjería", url: "https://sede.administracionespublicas.gob.es/" },
    { title: "Ministerio Inclusion — extranjería", url: "https://www.inclusion.gob.es/" },
    { title: "Policía Nacional — extranjería", url: "https://www.policia.es/_es/extranjeria.php" },
  ],
  topic_tags: ["tie", "extranjeria", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["tie", "extranjeria", "valencia"],
    contentKind: "guide",
    extra: ["huellas", "cita"],
  }),
  source_channel: "valenforum+valenciarusia+spain_granitsa",
  source_label: "editorial:tie-cita",
  pillar_guide_slug: "vnj-ispaniya-2026",
};
