/** Hand-curated Spain satellite guide — TIE / cita extranjería. */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const TIE_CITA_SLUG = "tie-cita-extranjeria-valencia-2026";

const bodySections: NoteBodySection[] = [
  { ...buildGlossarySection(glossaryForSlug(TIE_CITA_SLUG)!) },
  {
    heading: "Официально: TIE, cita previa и huellas",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: после въезда по visado D срок на подачу TIE ограничен — без cita previa и huellas рискуете штрафом и проблемами при проверке статуса.",
      "Что делать: запишитесь на sede electrónica (Oficina de Extranjería / Comisaría) и соберите паспорт, visado, padrón, seguro, tasa 790, фото.",
      "Зачем: без resguardo cita previa в Valencia живой очереди нет — развернут в дверях.",
      "Официально TIE — пластиковая карта резидента; до неё выдают resguardo после сдачи отпечатков.",
      "Главное: cita previa обязательна; срок подачи обычно указан в visado D (часто 30 дней с въезда).",
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
      "Зачем вам это сейчас: в @valenforum, @valenciarusia и @spain_granitsa три боли 2025–2026 — «слот исчез», «huellas без cita», «resguardo не принимают в банке».",
      "Что делать: ловите слоты утром 08:00–09:00 Europe/Madrid и держите PDF-пакет ≤2 MB.",
      "Зачем: Valencia быстрее Madrid/Barcelona, но cita всё равно конкурентная — без запаса недель не уложитесь в visado.",
      "Главное: полный цикл TIE в чатах Valencia — 4–8 месяцев; gestoría €300–600 помогает с записью, но не даёт «VIP-окна».",
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
    paragraphs: [
      "Что делать: не верьте «есть citas» на sede и «можно без записи» из чата — бронируйте в первую неделю после прилёта.",
      "Зачем: пиковые месяцы (сентябрь–ноябрь) обнуляют слоты за минуты; опоздание с TIE бьёт по статусу.",
      "Главное: сайт показывает формальные 30 дней; на деле закладывайте 6–8 недель минимум на cita + huellas.",
    ],
    bullets: [
      "На сайте sede звучит как «есть свободные citas», а на экране 0 слотов на всю неделю в пиковые месяцы.",
      "В чатах релокантов часто пишут «можно без записи в Valencia», но на практике развернут без resguardo cita previa — живой очереди нет.",
      "На сайте 30 дней на TIE, а gestoría говорит «2 недели на cita + ещё на huellas» — закладывайте 6–8 недель минимум.",
      "Ожидание: resguardo = TIE → utilities и некоторые банки требуют уже пластик или NIE definitivo.",
      "В чатах Madrid/BCN cita 2–4 мес. — в Valencia обычно 1–3 недели, но это не гарантия.",
    ],
  },
  {
    heading: "Пошагово: TIE в Valencia",
    section_kind: "practice",
    paragraphs: [
      "Зачем вам это сейчас: типовой маршрут от прилёта до resguardo — при условии, что NIE и empadronamiento уже есть.",
      "Что делать: пройдите пять шагов ниже; параллельно держите open вкладку sede.",
      "Зачем: откладывать cita «пока устроюсь» — самый дорогой совет из чатов.",
      "См. также [NIE и padrón](/notes/" + NIE_EMPADRONAMIENTO_SLUG + ").",
      "Главное: resguardo после huellas часто достаточно для банка и аренды — не ждите пластик для быта.",
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
    paragraphs: [
      "Что делать: проверьте список до поездки в extranjería и до оплаты gestoría.",
      "Зачем: одна ошибка с padrón или seguro — повторный визит и потерянный слот.",
      "Главное: cita previa + актуальный padrón + читаемый PDF — три фильтра, без которых huellas не случится.",
    ],
    bullets: [
      "Ошибка: ехать в extranjería без cita previa — потерянный день; в Valencia живой очереди нет.",
      "Ошибка: empadronamiento старше 3 мес. без обновления certificado — дозапрос и перенос huellas.",
      "Ошибка: seguro médico не на испанском / без repatriación — отказ или повторный визит.",
      "Ошибка: ждать пластик TIE для банка — resguardo + NIE часто достаточно в Valencia.",
      "Ошибка: откладывать cita «пока устроюсь» — слоты исчезают; бронируйте в первую неделю.",
    ],
  },
];

const keyTakeaways = [
  "Официально: TIE подаётся в срок visado через cita previa на sede, затем huellas dactilares.",
  formatPracticeTakeaway({
    channels: ["valenciarusia"],
    period: "2025–2026",
    claim:
      "в Valencia слоты cita previa (запись в extranjería) чаще появляются утром около 08:00–09:00",
    forReader:
      "gestoría (посредник) берёт €300–600, но полный цикл TIE — cita, huellas и пластик — в чатах занимает 4–8 месяцев",
  }),
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
    "Visado D в паспорте есть — а пластик TIE ещё «где-то в системе», и это нормальная испанская пауза, не конец света. После въезда ловите cita previa на sede и сдайте huellas в Comisaría de Extranjería Valencia; слоты чаще утром 08:00–09:00. После huellas — resguardo: его часто принимают банк и аренда до пластика.",
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
  source_label: "editorial:tie-cita+voice-pass",
  pillar_guide_slug: "vnj-ispaniya-2026",
};
