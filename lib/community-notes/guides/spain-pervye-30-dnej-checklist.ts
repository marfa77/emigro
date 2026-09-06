/**
 * Hand-curated Spain satellite guide — first 30 days checklist Valencia.
 * Orchestrator linking core satellite slugs; pillar depth on emigro.online.
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
import { TIE_CITA_SLUG } from "@/lib/community-notes/guides/spain-tie-cita-extranjeria-valencia";
import { BANK_IBAN_SLUG } from "@/lib/community-notes/guides/spain-bank-iban-nerezident";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PERVYE_30_SLUG = "pervye-30-dnej-v-ispanii-satelit-2026";

const SIM_LUZ_SLUG = "sim-internet-luz-valencia-2026";
const ARENDA_SLUG = "arenda-valencia-idealista-2026";
const MEDITSINA_SLUG = "meditsina-valencia-sip-sns-chastnaya-2026";
const RAJONY_SLUG = "valencia-rajony-arenda-shkoly-metro-2026";

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Сроки visado D, taxas и trámites extranjería **меняются**. Этот материал — satellite-оркестратор для Valencia; полный pillar: [первые 30 дней на emigro.online](/ru/guides/pervye-30-dnej-v-ispanii-2026). Hard-правила — [inclusion.gob.es](https://www.inclusion.gob.es/) / ваш visado.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      glossaryForSlug(PERVYE_30_SLUG)!,
      "Слова из aeropuerto VLC, sede ICPPlus и Oficina del Padrón — разберём до того, как чат предложит «сначала TIE, потом всё остальное»."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Satellite-чеклист не дублирует pillar целиком — он **связывает** seven core guides Valencia. OK/soft/fixed ниже.",
    ],
    bullets: [
      "Fixed: при visado/autorización на срок свыше шести месяцев TIE нужно запросить лично **в течение одного месяца после въезда** (Ministerio del Interior); условия конкретного основания и alta SS также сверяйте по resolución.",
      "OK: NIE — EX-15 + tasa 790 PDF ([Policía NIE](https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria_tramite_asignacion_nie.php)); padrón Valencia PA.GP.11 ([sede.valencia.es](https://sede.valencia.es/sede/registro/procedimiento/PA.GP.11)).",
      "OK: TIE huellas — ICPPlus TOMA DE HUELLAS ([icpplus/citar](https://sede.administracionespublicas.gob.es/icpplus/citar)).",
      "Fixed: «португальский чеклист NIF/AIMA подойдёт» → NIF ≠ NIE; AIMA Agora ≠ ICPPlus.",
      "Fixed: «месяц без TIE норм» → visado plazo тикает; cita занимает недели.",
      "Soft: порядок SIM→NIE→padrón→banco — полевой Valencia, не статья LOEX.",
      "Soft: полный inventory satellite Spain — 15 notes; этот файл **не** объясняет DNV consulado, Beckham, autónomo SS — см. sibling guides.",
    ],
  },
  {
    heading: "Официально: три контура первого месяца",
    section_kind: "official",
    paragraphs: [
      "Первые 30 días после прилёта в Valencia — три параллельных контура: **identidad fiscal** (NIE), **domicilio** (empadronamiento + contrato), **estatus migratorio** (TIE huellas по visado D). Они связаны, но идут через разные portales: sede administraciones, ayuntamiento, ICPPlus.",
      "Seguridad Social и autónomo — четвёртый контур для employment/DNV; alta SS не заменяет TIE. Seguro médico privado из visado держите активным до SIP/SNS, если procede.",
    ],
    bullets: [
      "NIE — Policía / EX-15; número fiscal para banco, Hacienda, contratos.",
      "Empadronamiento — ayuntamiento Valencia PA.GP.11; certificado PA.CE.10.",
      "TIE — EX-17, huellas, resguardo; cita ICPPlus obligatoria.",
      "Cuenta bancaria ES IBAN — entidad supervisada; KYC PBC.",
      "Seguridad Social — alta empleador o autónomo ([seg-social.es](https://www.seg-social.es/)).",
      "Suministros — luz/agua/internet на NIE + IBAN ([SIM/luz guide](/notes/" + SIM_LUZ_SLUG + ")).",
    ],
  },
  {
    heading: "Календарь mes 1: 72 horas → semana 4",
    section_kind: "action_guide",
    paragraphs: [
      "Этот note — **маршрут по неделям**, не энциклопедия. Детали NIE, TIE, банка и аренды — в sibling guides; здесь только **когда** их открывать.",
      "**72 horas** после VLC: SIM/eSIM, short-term с cláusula empadronamiento, cita NIE на sede и ICPPlus для huellas. Слот может быть через 1–2 semanas, но очередь начинается сейчас. Без SIM сложнее ICPPlus и banca móvil; без autorización propietario short-term Airbnb станет тупиком на неделе 2.",
      "**Semana 1–2:** NIE/resguardo → empadronamiento (Periodista Azzati, 2 o Tabacalera Amadeu de Savoia, 11 — cita 010) → ES IBAN → просмотр [Idealista](/notes/" +
        ARENDA_SLUG +
        ") когда готовы документы. При visado D NIE часто уже в resolución; EX-15 — только если номера нет. Fianza Generalitat вносит arrendador — «традиционный ES банк» не общее требование закона.",
      "**Semana 3–4:** huellas TIE, SIP/SNS, domiciliación renta si contrato firmado. К концу mes 1 — resguardo huellas (o cita confirmada), IBAN domiciliado, suministros на имя. ICPPlus без cita — продолжайте мониторинг; visado plazo — красная линия.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenciarusia", "valenforum"],
        period: "2025–2026",
        claim:
          "типичный порядок Valencia: NIE/resguardo → empadronamiento → ES IBAN → только потом fianza long-term",
        forReader: "не копируйте PT-чеклист «сначала банк без morada»",
      }),
      "72h — [SIM/luz](/notes/" + SIM_LUZ_SLUG + "), citas NIE/ICPPlus, techo temporal.",
      "Sem 1–2 — [NIE/padrón](/notes/" + NIE_EMPADRONAMIENTO_SLUG + "), [банк](/notes/" + BANK_IBAN_SLUG + "), utilities.",
      "Sem 3–4 — [TIE](/notes/" + TIE_CITA_SLUG + "), [medicina](/notes/" + MEDITSINA_SLUG + "), PDF archive resguardos.",
      "Не переводите fianza long-term до NIE + проверки contrato.",
    ],
  },
  {
    heading: "Порядок шагов: SIM → NIE → padrón → banco → SIP → TIE",
    section_kind: "practice",
    paragraphs: [
      "Полевой порядок Valencia (soft, не LOEX): SIM первым — sede, ICPPlus и banca móvil шлют SMS. NIE вторым — номер на formularios. Padrón третьим — extranjería и agency просят certificado. Банк четвёртым — fianza и utilities. SIP параллельно semana 3–4. TIE huellas — visado plazo тикает, но padrón уже должен быть.",
      "**72 horas** закрывают связь, citas и крышу; **semana 4** — huellas, domiciliación и salud. Между ними — документы и IBAN, не «всё за один день».",
    ],
    bullets: [
      "SIM → NIE → padrón → banco → SIP → cita huellas.",
      "72h ≠ semana 4: citas бронируют рано, huellas часто позже.",
      "No PT checklist NIF/AIMA — другая страна.",
    ],
  },
  {
    heading: "Что ломается к 4–6 месяцу, если mes 1 пропущен",
    section_kind: "gap",
    paragraphs: [
      "Пропуск проверки NIE, padrón или платёжных реквизитов в первый mes кажется «решим потом», но к **4–6 месяцу** стекаются renta, cuotas Seguridad Social и modelos Hacienda. Нужен рабочий счёт SEPA; требование только local IBAN может быть незаконной IBAN discrimination.",
      "Пропуск TIE cita в mes 1 может оставить вас с visado plazo истёкшим и без resguardo huellas — исправление через abogado дороже, чем ICPPlus в неделю 1.",
    ],
    bullets: [
      "Sin padrón — возможны дозапросы TIE/SIP/colegio.",
      "Sin ES IBAN — fianza renewal, luz, SS bloqueados.",
      "Sin huellas/resguardo — статус «en trámite» слабее для banco/Hacienda.",
      "Счёт без поддержки нужных adeudos SEPA — сбои renta/SS; страна IBAN сама по себе не основание отказа.",
      "Sin SIM ES — 2FA banca/Hacienda ломается.",
      "Copiar PT NIF/AIMA порядок — wrong forms, lost weeks.",
    ],
  },
  {
    heading: "Карта satellite: куда углубиться",
    section_kind: "practice",
    paragraphs: [
      "Этот чеклист — **маршрут**, не энциклопедия. Остальные Spain satellite guides закрывают узлы, которые здесь только named:",
    ],
    bullets: [
      "[SIM, internet, luz](/notes/" + SIM_LUZ_SLUG + ") — suministros semana 1.",
      "[NIE y empadronamiento](/notes/" + NIE_EMPADRONAMIENTO_SLUG + ") — tax_id slot.",
      "[Аренда Idealista](/notes/" + ARENDA_SLUG + ") — contrato y fianza.",
      "[Районы, школы, metro](/notes/" + RAJONY_SLUG + ") — где жить.",
      "[Банк IBAN](/notes/" + BANK_IBAN_SLUG + ") — KYC y domiciliación.",
      "[Medicina SIP/SNS](/notes/" + MEDITSINA_SLUG + ") — salud.",
      "[TIE cita Valencia](/notes/" + TIE_CITA_SLUG + ") — huellas.",
      "[DNV / UGE / consulado](/notes/dnv-uge-konsulstvo-2026) — visado до прилёта.",
      "[Beckham / autónomo мифы](/notes/beckham-autonomo-mify-2026) — fiscal mes 2+.",
      "Pillar: [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026) · [30 días pillar](/ru/guides/pervye-30-dnej-v-ispanii-2026).",
    ],
  },
  {
    heading: "Типичные ошибки первого mes",
    section_kind: "practice",
    paragraphs: [
      "Valencia прощает медленный испанский, но не пустой PDF padrón и не «TIE потом». Ниже — ошибки, которые @spain_granitsa повторяет чаще всего.",
    ],
    bullets: [
      "TIE «на второй mes» — visado 30 días + cita queue.",
      "Аренда без проверки документов для padrón.",
      "Fianza без ES IBAN.",
      "Один банк и сдача после отказа.",
      "Autónomo/Beckham «разберу» — штрафы SS/Hacienda.",
      "Чеклист Lisboa/Porto — wrong country.",
      "Cerrar cuenta extranjera до puente IBAN.",
    ],
  },
  {
    heading: "Día 0 en VLC: aeropuerto y primera noche",
    section_kind: "practice",
    paragraphs: [
      "Manises (VLC) — не Madrid Barajas: трансfer Metro/bus/taxi до temporary жилья в Ciutat Vella, Ruzafa или Campanar. В первую ночь нужны только три вещи: связь, адрес с Wi‑Fi и зарядка для завтрашнего sede/ICPPlus. Не подписывайте long-term contrato уставшими — типичная ошибка jet lag.",
      "Сохраните sello entrada en pasaporte — fecha cuenta para plazo visado TIE.",
    ],
    bullets: [
      "Metro/EMT — tarjeta Móbilis después SIM.",
      "Taxi oficial — sticker ayuntamiento.",
      "Temporary booking — dirección exacta para Uber/Cabify.",
      "Foto sello entrada pasaporte — cloud.",
      "Agua/comida — supermercado Mercadona/Consum cerca alojamiento.",
    ],
  },
  {
    heading: "Employment vs autónomo vs DNV: ramas del mes 1",
    section_kind: "gap",
    paragraphs: [
      "Este checklist asume visado D ya en pasaporte. Si viene por **cuenta ajena**, alta SS la hace empleador — usted cierra NIE/padrón/TIE. Si **autónomo**, gestoría y alta SS en semana 2–3 — no espere mes 4. Si **DNV/teletrabajo**, consulado ya validó ingresos, pero SS/IRPF en España igualmente local — vea [DNV UGE](/notes/dnv-uge-konsulstvo-2026) y [Beckham mitos](/notes/beckham-autonomo-mify-2026), no repita aquí.",
    ],
    bullets: [
      "Cuenta ajena — espere instrucciones RRHH sobre SS.",
      "Autónomo — IBAN antes alta SS.",
      "DNV — UGE resolvió; TIE igualmente huellas.",
      "No lucrativa — seguro médico visado obligatorio.",
      "Estudiante — EX-17 con requisitos distintos — soft.",
    ],
  },
  {
    heading: "Familia y menores en Valencia",
    section_kind: "practice",
    paragraphs: [
      "Cónyuge e hijos con visado familiar siguen la misma cadena NIE → padrón → TIE, con citas **separadas** en ICPPlus (1 cita por persona salvo excepciones). Colegio público o concertado pide empadronamiento — planifique antes de junio para curso septiembre.",
      "Menores sin NIE propio — algunos bancos abren cuenta con representante; padrón familiar en una cita si unidad familiar — PA.GP.11.",
    ],
    bullets: [
      "NIE menor — EX-15 con representante.",
      "Empadronamiento familiar — una cita unidad familiar.",
      "Colegio — certificado empadronamiento + NIE niño.",
      "Seguro familiar — mantener hasta SIP pediátrico.",
      "Huellas menores — cita ICPPlus individual.",
    ],
  },
  {
    heading: "Ошибки португальского чеклиста в Valencia",
    section_kind: "gap",
    paragraphs: [
      "Русскоязычные чаты смешивают PT и ES: «NIF за день в Finanças» не равно NIE с cita Policía; «AIMA Agora» не равно ICPPlus. Если ваш чеклист из @por_tugal — выбросьте шаги про representante fiscal и MB Way как обязательные для Valencia.",
    ],
    bullets: [
      "NIF ≠ NIE — разные формы и органы.",
      "AIMA ≠ ICPPlus — разные порталы.",
      "Finanças morada ≠ padrón Valencia.",
      "CIPLE/Prep2Go — PT гражданство, не TIE ES.",
      "Wizard Emigro — если сомневаетесь в стране.",
    ],
  },
  {
    heading: "Wizard y Assist",
    section_kind: "practice",
    paragraphs: [
      "Если visado D, DNV или autónomo переплетены, прогоните факты через [Emigro Wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=30days-valencia&utm_content=pervye-30-dnej-v-ispanii-satelit-2026). Для аудита порядка шагов и риска просрочки visado — [Route Check Assist €129](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=30days-valencia&utm_content=pervye-30-dnej-v-ispanii-satelit-2026).",
    ],
    bullets: [
      "Wizard — сопоставление маршрута без выбора страны заранее.",
      "Assist — PDF разбор case, не substituto abogado.",
      "Satellite inventory — 15 notes Spain; этот файл orchestrator.",
    ],
  },
];

const keyTakeaways = [
  "Официально: visado D → TIE en plazo; NIE (EX-15) y padrón (PA.GP.11) — trámites separados; huellas — ICPPlus.",
  formatPracticeTakeaway({
    channels: ["valenciarusia", "spain_granitsa"],
    period: "2025–2026",
    claim:
      "orden típico Valencia mes 1: SIM → NIE/resguardo → padrón → IBAN → SIP → cita huellas",
    forReader: "72h — SIM + citas NIE/ICPPlus; semana 4 — huellas y salud",
  }),
  "Расхождение: «mes без TIE ok» vs plazo visado; «Revolut basta» vs domiciliación renta/SS к 4–6 mes.",
  "На практике: пропуск padrón/IBAN en mes 1 → bloqueos renta, Hacienda y SS en mes 4–6 — см. sibling guides, не дублируйте здесь.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "С чего начать в первый день в Valencia?",
    a: "По правилам — соблюдать plazo visado. На практике: SIM, short-term с padrón clause, cita NIE на sede e ICPPlus huellas — в первые 72 horas.",
  },
  {
    q: "Можно отложить TIE на второй mes?",
    a: "По правилам visado D — plazo en sticker (часто 30 días). На практике cita ICPPlus занимает semanas — начинайте semana 1.",
  },
  {
    q: "72 horas vs semana 4 — в чём разница?",
    a: "По правилам все trámites не срочны одновременно. На практике: 72h = SIM + citas + techo; semana 4 = huellas, SIP, domiciliación — см. блоки выше.",
  },
  {
    q: "Где полный чеклист?",
    a: "Pillar [30 dней ES](/ru/guides/pervye-30-dnej-v-ispanii-2026) на emigro.online; этот note — satellite orchestrator Valencia.",
  },
  {
    q: "Что если пропустил NIE в mes 1?",
    a: "По правилам — подать EX-15 когда связь с España. На практике без NIE/resguardo стопорятся banco, padrón часто идёт параллельно, TIE huellas — с NIE en formulario. К 4–6 месяцу — хвост Hacienda, Seguridad Social и аренда.",
  },
];

export const PERVYE_30_GUIDE = {
  slug: PERVYE_30_SLUG,
  category: "Первый месяц",
  content_kind: "guide" as ContentKind,
  title: "Первые 30 дней в Valencia: чеклист satellite 2026",
  excerpt:
    "72h → semana 4: SIM, NIE, padrón, IBAN, SIP, TIE cita — orchestrator Valencia с семью core guides. Пропуск mes 1 бьёт renta и Hacienda к 4–6 месяцу. Не копируйте Portugal checklist. Wizard y Assist для audit маршрута и visado plazo.",
  seo_title: "Первые 30 дней Испания 2026 — Valencia checklist",
  seo_description:
    "Первые 30 дней Valencia 2026: SIM, NIE, padrón, банк, TIE huellas и SIP. Порядок 72 часа → 4-я неделя для RU/BY после visado D без копипасты PT.",
  quick_answer:
    "Первый месяц в Валенсии: первые 72 часа — связь, проверка уже присвоенного NIE, ICPPlus для TIE и жильё с документами для padrón. Недели 1–2 — padrón, платёжный счёт SEPA и аренда; недели 3–4 — huellas TIE и SIP по праву на asistencia. Не копируйте португальский NIF/AIMA. К 4–6 месяцу проверьте renta, Seguridad Social и Hacienda; требование только испанского IBAN может быть незаконным.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Sede electrónica", url: "https://sede.administracionespublicas.gob.es/" },
    { title: "ICPPlus cita", url: "https://sede.administracionespublicas.gob.es/icpplus/citar" },
    { title: "Seguridad Social", url: "https://www.seg-social.es/" },
    { title: "Valencia PA.GP.11", url: "https://sede.valencia.es/sede/registro/procedimiento/PA.GP.11" },
    { title: "Pillar — 30 dней ES", url: "https://www.emigro.online/ru/guides/pervye-30-dnej-v-ispanii-2026" },
  ],
  topic_tags: ["nie", "tie", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["nie", "tie", "valencia"],
    contentKind: "guide",
    extra: ["checklist", "extranjeria", "satellite"],
  }),
  source_channel: "spain_granitsa+valenforum+valenciarusia",
  source_label: "editorial:30-days-gold-valencia-2026",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};

export default PERVYE_30_GUIDE;
