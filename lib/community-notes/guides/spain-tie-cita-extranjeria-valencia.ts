/**
 * Hand-curated Spain satellite guide — TIE / cita extranjería Valencia.
 * ICPPlus slot practice separated from official Policía / Interior rules.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const TIE_CITA_SLUG = "tie-cita-extranjeria-valencia-2026";

const GLOSSARY_INTRO =
  "Слова из ICPPlus, письма resolución favorable и окна Comisaría — чтобы не путать cita на huellas с записью на NIE или с «живой очередью», которой в Valencia уже нет.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(TIE_CITA_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор спорных формулировок черновика и чатов. **OK** = официальный портал; **soft** = поле Valencia 2025–2026; **fixed** = смягчено. Не юрконсультация — trámite и oficina сверяйте в [ICPPlus](https://sede.administracionespublicas.gob.es/icpplus/) на дату записи.",
    ],
    bullets: [
      "OK: TIE — EX-17 + tasa 790 código 012 + cita **TOMA DE HUELLAS** через [ICPPlus](https://sede.administracionespublicas.gob.es/icpplus/citar).",
      "OK: autorización свыше шести месяцев → TIE **в течение одного месяца после въезда** (Ministerio del Interior).",
      "OK: importe tasa — из PDF [Tasa790_012](https://sede.policia.gob.es/Tasa790_012/ImpresoRellenar), не из блога.",
      "Fixed: «можно без cita» → cita previa **imprescindible**; живой очереди нет.",
      "Soft: адрес Comisaría — **только из PDF cita**, не Bailén/Patraix из чатов.",
      "Fixed: scalpers cita — не официальный канал.",
    ],
  },
  {
    heading: "Официально: портал, trámite и huellas",
    section_kind: "official",
    paragraphs: [
      "После въезда по visado D с autorización свыше шести месяцев нужно запросить TIE в месячный срок. Пластик документирует уже выданную autorización; право проживания создаёт autorización, а не resguardo huellas. Отсутствие карты не аннулирует автоматически разрешение, но нарушает обязанность документироваться и создаёт практические проблемы.",
      "Cita previa extranjería бронируется на [sede.administracionespublicas.gob.es/icpplus](https://sede.administracionespublicas.gob.es/icpplus/citar). Для типичного кейса RU с visado D ищите trámite **POLICÍA — TOMA DE HUELLAS (EXPEDICIÓN DE TARJETA) Y RENOVACIÓN DE TARJETA DE LARGA DURACIÓN**, provincia Valencia. Система покажет **oficina concreta** — ехать нужно туда, а не по адресу из старого поста.",
      "На приёме: EX-17, pasaporte, visado/resolución, tasa 790-012 pagada, fotografía carnet, certificado empadronamiento (если procede). После huellas выдают **resguardo** — временное подтверждение до recogida пластика.",
    ],
    bullets: [
      "Portal ICPPlus — cita Policía extranjería ([directorio](https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus)).",
      "EX-17 + tasa 790-012 pagada + fotografía carnet.",
      "Resguardo после huellas — до recogida пластика.",
      "Certificado empadronamiento — en práctica <3 meses для Valencia.",
    ],
  },
  {
    heading: "Typical RU track: visado D → huellas в Valencia",
    section_kind: "practice",
    paragraphs: [
      "Типичный русскоязычный релокант приезжает с visado D ( trabajo, no lucrativa, teletrabajo/DNV после consulado). NIE и padrón часто уже в процессе или закрыты в первую неделю — см. [NIE и padrón](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        "). TIE — следующий bottleneck: не «один визит», а cita + huellas + ожидание пластика.",
      "Бронируйте cita **сразу после прилёта**, не дожидаясь «идеального» NIE на бумаге. Resguardo EX-15 и certificado empadronamiento с historial обычно входят в пакет. PDF-сканы ≤2 MB, читаемые — частая причина «vuelva con copia clara».",
    ],
    bullets: [
      "Visado D в pasaporte — проверьте plazo «presentar solicitud TIE» (sticker consulado).",
      "Resolución favorable — если подавали до въезда; иначе visado + contrato/justificante по tipo.",
      "NIE/resguardo — identificación fiscal en paquete.",
      "Certificado + historial empadronamiento Valencia — PA.CE.10.",
      "Fotos carnet 32×26 mm, fondo blanco — 3 copias en práctica чатов.",
      formatPracticeBullet({
        channels: ["valenciarusia", "valenforum"],
        period: "2025–2026",
        claim:
          "resguardo после huellas принимают банк и agency для contrato, пока пластик «в производстве»",
        forReader: "сфотографируйте resguardo в облако в день приёма — не ждите SMS",
      }),
    ],
  },
  {
    heading: "Охота за cita: ICPPlus без scalpers",
    section_kind: "action_guide",
    paragraphs: [
      "ICPPlus не публикует официальный таймтейбл «слоты в 08:00». Участники @valenciarusia и @valenforum в 2025–2026 описывают короткие окна, когда календарь оживает — это **полевой опыт**, не инструкция Ministerio. Ведите простой лog: дата, hora, resultado (0 citas / cita tomada).",
      "Платные сервисы, которые **продают** cita или бронируют за вас за €100–600, — серая зона. Официально cita бесплатна; покупка у третьих лиц — риск мошенничества и блокировки. Допустимы **alert-сервисы**, которые только уведомляют о появлении hueco — бронь делаете вы на sede.",
    ],
    bullets: [
      "Provincia: Valencia — не путать с Alicante или Castellón, если живёте в другом municipio.",
      "Trámite: «TOMA DE HUELLAS» — не «Asignación NIE» и не «Entrega TIE» (recogida — отдельная cita позже).",
      "NIE + nombre completo — autocompletado; ошибка в NIE роняет бронь.",
      "VPN иногда ломает captcha ICPPlus — пробуйте мобильный 4G без VPN.",
      "Si 0 citas 1–3 meses: монitorинг ежедневно, gestoría с прозрачным договором, **не** scalper; soft — provincias с меньшей demanda только если domicilio позволяет.",
      formatPracticeBullet({
        channels: ["spain_granitsa"],
        period: "2025–2026",
        claim:
          "в Valencia cita на huellas чаще появляется за 1–3 недели мониторинга, быстрее Madrid/Barcelona, но без гарантии",
        forReader: "начинайте ICPPlus в первую неделю после прилёта, не в день 29 по visado",
      }),
    ],
  },
  {
    heading: "День huellas: папка и oficina из PDF cita",
    section_kind: "action_guide",
    paragraphs: [
      "Утром визита распечатайте cita previa, tasa pagada, EX-17 и originals. Oficina — **exactamente** la que figura en su justificante ICPPlus. Если в чате советуют «езжай на Bailén» или «только Patraix», сверьте с **вашим** PDF: официальный источник офиса — ICPPlus, не сторонний агрегатор.",
      "En mostrador иногда дозапрашивают contrato trabajo, alta SS, bank statements — держите PDF по tipo autorización, даже если «универсальный список» из Telegram короче.",
    ],
    bullets: [
      "Cita previa impresa + pasaporte + EX-17 + tasa pagada.",
      "Visado/resolución + empadronamiento reciente.",
      "Fotografía carnet; seguro visado si exigible.",
    ],
  },
  {
    heading: "Где sede и практика расходятся",
    section_kind: "gap",
    paragraphs: [
      "Формально cita previa бесплатна и обязательна. На практике конкуренция за huecos в Valencia ниже, чем в Madrid, но **не нулевая** — сентябрь и post-verano calendars опустошаются за минуты.",
      "Resguardo после huellas официально подтверждает trámite en curso. На практике один банковский clerk принимает resguardo, другой требует TIE plástico — имейте plan B sucursal.",
    ],
    bullets: [
      "Официально: solicitud TIE — в течение одного месяца для autorización свыше шести месяцев. На практике cita и изготовление занимают недели; диапазон зависит от oficina и не имеет гарантированного «минимума» в 6–8 недель.",
      "Официально: «hay citas» en ICPPlus. На práctica: pantalla 0 durante días — normal en pico.",
      "Soft: horarios «12:00 y 20:00» para nuevas citas — blogs de abogados, no sede; no copie como ley.",
      "Официально: resguardo = prueba tramitación. На практике: utilities/Hacienda к 4–6 месяцу могут запросить уже **пластик** — не откладывайте recogida TIE.",
      formatPracticeBullet({
        channels: ["valenforum", "spain_granitsa"],
        period: "2025–2026",
        claim:
          "отказ на huellas из‑за empadronamiento >3 meses или PDF borroso — частая причина второго cita",
        forReader: "обновите certificado padrón за неделю до cita",
      }),
    ],
  },
  {
    heading: "Если cita нет месяцы 1–3: план B",
    section_kind: "practice",
    paragraphs: [
      "Отсутствие hueco не аннулирует автоматически underlying autorización, но месячный срок запроса TIE продолжает действовать. Сохраняйте screenshots ICPPlus и документы autorización; если срок уже пропущен или Policía не даёт канал подачи — обращайтесь в dependencia/abogado extranjería, не к scalper.",
      "Gestoría €300–600 за сопровождение cita — рынок услуг, не госуслуга. Просите письменно: что входит (monitoreo, сопровождение en día huellas), что нет (гарантия slot).",
    ],
    bullets: [
      "Продолжайте мониторинг ICPPlus 2–4 коротких сессии в день.",
      "Alert legal (уведомление, не покупка cita) — ok; перепродажа cita — нет.",
      "Contact extranjería provincia — если visado истекает, формулируйте situación письменно.",
      "Duplicado resolución — только si procede по instrucción oficina; renovación resuelta favorable часто **не** требует duplicado для huellas (soft, сверяйте caso).",
      "Abogado — когда plazo visado прошёл и нет resguardo huellas.",
      "Не ехать «без cita на удачу» — потерянный día и riesgo отказа.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    paragraphs: [
      "Провалы редко из‑за «сложной Испании» — чаще из‑за позднего старта ICPPlus, устаревшего padrón или путаницы NIE vs TIE. Resguardo huellas сохраните так же тщательно, как visado в pasaporte.",
    ],
    bullets: [
      "Откладывать cita «пока устроюсь в квартире» — слоты не ждут; visado plazo тикает.",
      "Empadronamiento старше 3 meses — возможен дозапрос; актуальность сверяйте по checklist oficina.",
      "Seguro без cobertura repatriación / не на ES — отказ en mostrador (soft).",
      "PDF pasaporte нечитаемый — «vuelva mañana».",
      "Путать trámite NIE и huellas TIE в ICPPlus — wrong office.",
      "Ждать пластик для банка — resguardo + NIE часто достаточны en Valencia.",
      "Покупать cita у scalper — riesgo estafa y datos personales.",
    ],
  },
  {
    heading: "Recogida del plástico TIE y cita de entrega",
    section_kind: "official",
    paragraphs: [
      "Huellas — только половина истории. Когда TIE изготовлен, Policía назначает **entrega** — отдельный trámite en ICPPlus («ENTREGA DE TARJETAS»). Не путайте con toma de huellas. SMS o correo de Comisaría указывает, когда пластик готов; без recogida карта не у вас.",
      "En recogida llevan pasaporte, resguardo anterior y justificante cita entrega. Si pierde plazo, puede necesitar nueva cita — soft delay weeks.",
    ],
    bullets: [
      "Trámite entrega — distinto de huellas en ICPPlus.",
      "Notificación Comisaría — guarde SMS/email.",
      "Plazo recogida — variable; no ignore aviso.",
      "Oficina entrega — puede coincidir con dependencia huellas o no; siga PDF cita.",
      "Menores — recogida con representante legal si procede.",
    ],
  },
  {
    heading: "Связанные шаги и Assist",
    section_kind: "practice",
    paragraphs: [
      "TIE cierra el arco migratorio post-visado; NIE y padrón deben estar cerrados antes. Ruta completa visado → TIE → SS en [Emigro Wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=tie-cita-valencia&utm_content=tie-cita-extranjeria-valencia-2026). Si visado caduca o rechazan huellas — [Route Check Assist](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=tie-cita-valencia&utm_content=tie-cita-extranjeria-valencia-2026).",
    ],
    bullets: [
      "[NIE и empadronamiento](/notes/" + NIE_EMPADRONAMIENTO_SLUG + ") — до huellas.",
      "[Банк IBAN](/notes/bank-iban-nerezident-ispaniya-2026) — resguardo huellas для KYC.",
      "[Первые 30 дней](/notes/pervye-30-dnej-v-ispanii-satelit-2026) — порядок недель.",
      "Pillar: [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026).",
    ],
  },
];

const keyTakeaways = [
  "Официально: TIE huellas — cita ICPPlus, trámite TOMA DE HUELLAS, EX-17 + tasa 790-012 (importe из PDF sede.policia.gob.es); oficina = адрес в вашем justificante cita.",
  "Официально: cita previa обязательна; без неё не примут; certificado empadronamiento reciente — стандарт пакета Valencia.",
  formatPracticeTakeaway({
    channels: ["valenciarusia", "valenforum"],
    period: "2025–2026",
    claim:
      "resguardo после huellas часто принимают банк и аренда до пластика TIE",
    forReader:
      "бронируйте ICPPlus в первую неделю; полный цикл cita + plástico в чатах — 4–8 meses",
  }),
  "Расхождение: «можно без cita» и фиксированный адрес Comisaría из блога — soft; доверяйте PDF cita ICPPlus, не scalpers.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно попасть на huellas без cita?",
    a: "По правилам — нет, cita previa imprescindible через ICPPlus. На практике живой очереди в Valencia на huellas нет; без PDF cita развернут.",
  },
  {
    q: "Какой portal для типичного TIE с visado D?",
    a: "По правилам — [sede.administracionespublicas.gob.es/icpplus](https://sede.administracionespublicas.gob.es/icpplus/citar), provincia Valencia, trámite POLICÍA TOMA DE HUELLAS. На практике не путайте с Asignación NIE.",
  },
  {
    q: "Сколько ждать TIE в Valencia?",
    a: "По правилам resguardo — в день huellas; plástico — semanas после. На практике полный цикл cita + recogida в @valenciarusia — 4–8 meses в загруженные периоды.",
  },
  {
    q: "Что если cita пропала на ICPPlus?",
    a: "По правилам — повторный мониторинг sede. На практике утренние сессии, alert (не покупка cita), gestoría с договором; при истечении visado — abogado.",
  },
  {
    q: "Нужен ли готовый NIE перед записью?",
    a: "По правилам — identificación и padrón в пакете; visado D — base. На практике resguardo EX-15 достаточен; не ждите «зелёный» certificado для брони cita.",
  },
];

export const TIE_CITA_GUIDE = {
  slug: TIE_CITA_SLUG,
  category: "TIE и extranjería",
  content_kind: "guide" as ContentKind,
  title: "TIE и cita extranjería в Valencia: запись и huellas 2026",
  excerpt:
    "ICPPlus, EX-17, tasa 790-012, huellas и resguardo — пошаговый маршрут Valencia для visado D без мифов про «живую очередь» и scalpers.",
  seo_title: "TIE extranjería Valencia 2026 — cita и huellas",
  seo_description:
    "TIE и cita extranjería Valencia 2026: ICPPlus, huellas, resguardo, EX-17, документы и сроки. Практика для RU/BY с visado D — без paid cita-scalpers.",
  quick_answer:
    "После visado D бронируйте cita на ICPPlus (POLICÍA — TOMA DE HUELLAS, provincia Valencia) в первую неделю. Пакет: EX-17, tasa 790 из PDF на sede.policia.gob.es, padrón reciente с historial, pasaporte, seguro visado. Oficina Comisaría — только адрес из вашего PDF cita, не из чатов про Bailén или Patraix. После huellas — resguardo до пластика; scalpers не рекомендуем. Полный цикл в @valenciarusia — до 4–8 meses в пик.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "ICPPlus — cita extranjería", url: "https://sede.administracionespublicas.gob.es/icpplus/citar" },
    { title: "Directorio ICPPlus", url: "https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus" },
    { title: "Policía — extranjería", url: "https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria.php" },
    { title: "Ministerio del Interior — TIE", url: "https://www.interior.gob.es/opencms/es/servicios-al-ciudadano/tramites-y-gestiones/extranjeria/regimen-general/tarjeta-de-identidad-de-extranjero/" },
    { title: "Tasa 790 código 012", url: "https://sede.policia.gob.es/Tasa790_012/ImpresoRellenar" },
    { title: "Ministerio Inclusion — extranjería", url: "https://www.inclusion.gob.es/" },
  ],
  topic_tags: ["tie", "extranjeria", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["tie", "extranjeria", "valencia"],
    contentKind: "guide",
    extra: ["huellas", "cita", "icpplus"],
  }),
  source_channel: "valenforum+valenciarusia+spain_granitsa",
  source_label: "editorial:tie-cita-gold-valencia-2026",
  pillar_guide_slug: "vnj-ispaniya-2026",
};

export default TIE_CITA_GUIDE;
