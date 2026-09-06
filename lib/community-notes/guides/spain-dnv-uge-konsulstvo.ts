/**
 * Hand-curated Spain satellite guide — DNV / teletrabajo: consulado vs UGE.
 * Filing channels separated from pillar law; Valencia practice post-visado.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { TIE_CITA_SLUG } from "@/lib/community-notes/guides/spain-tie-cita-extranjeria-valencia";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const DNV_UGE_SLUG = "dnv-uge-konsulstvo-2026";

/** Cross-link slug — avoid circular import with spain-alta-ss-hacienda-valencia.ts */
const ALTA_SS_SLUG = "alta-ss-hacienda-valencia-2026";
const ZAPIS_KONSULSTVO_SLUG = "zapis-konsulstvo-ispanija-pasport-2026";

const GLOSSARY_INTRO =
  "Teletrabajo, UGE и visado D — три разных слова из одного чата. Разберём их до подачи, пока «подамся через UGE изнутри» не смешалось с extranjería или с туристическим Schengen.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(DNV_UGE_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор спорных формулировок черновика и чатов. **OK** = официальный портал; **soft** = поле Valencia 2025–2026; **fixed** = смягчено. Не юрконсультация — trámite сверяйте на [one.gob.es](https://www.one.gob.es/es/tramites/solicitud-del-visado-de-nomada-digital) и странице consulado на дату подачи.",
    ],
    bullets: [
      "OK: из third country — visado D teletrabajo в **consulado** demarcación residencia ([exteriores — visado teletrabajo](https://www.exteriores.gob.es/Consulados/moscu/es/Comunicacion/Noticias/Paginas/Articulos/20230502_NOT1.aspx)).",
      "OK: уже **legal stay** в ES — autorización residencia через **UGE-CE** (hasta 3 años), sin visado previo; plazo resolución 20 días (та же noticia consulado).",
      "OK: visado consulado — validez **hasta 1 año**; autorización UGE inicial — **3 años** (exteriores / one.gob.es).",
      "OK: доход titular — **200% SMI**; SMI 2026 = **1 221 €/mes** ([BOE RD 126/2026](https://www.boe.es/buscar/doc.php?id=BOE-A-2026-3815)) → umbral **≈ 2 849 €/mes** en cómputo mensual 12 pagas (one.gob.es).",
      "OK: autónomo teletrabajo — max **20%** ingresos de clientes ES ([one.gob.es — requisitos nómada digital](https://www.one.gob.es/es/tramites/solicitud-del-visado-de-nomada-digital)).",
      "OK: familia — +**75% SMI** primer reagrupado, +**25% SMI** cada miembro adicional (one.gob.es / exteriores).",
      "Fixed: «UGE из туриста» → turismo Schengen **≠ legal stay**; UGE no sustituye visado de entrada.",
      "Fixed: «estancia por estudios = camino a nacionalidad 2 años» → estancia estudios **0%** para cómputo art. 22 CC — миф для nacionalidad, не для DNV.",
      "Soft: сроки consulado 2–4 meses — поле @spain_granitsa, no plazo legal fijo.",
      "UNCHECKED: PDF FAQ inclusion.gob.es nomadas-digitales — timeout al fetch; cifras familiares alternativas en blogs no copiadas.",
    ],
  },
  {
    heading: "Официально: consulado, UGE и extranjería — не смешивать",
    section_kind: "official",
    paragraphs: [
      "Autorización de residencia para **teletrabajo internacional** (digital nomad / DNV) регулируется Ley 14/2013 modificada por Ley de Startups. Канал подачи зависит от того, **где вы находитесь** на дату solicitud — это не «выбор удобнее», а procedimiento distinto.",
      "**Consulado** (demarcación вашей legal residence): visado nacional D teletrabajo для **въезда** из third country. Visado — hasta **1 año**; после въезда — TIE, alta SS según estructura дохода. Подача personal o representante acreditado; cita previa consular.",
      "**UGE-CE** (Unidad de Grandes Empresas y Colectivos Estratégicos, Ministerio Inclusion): autorización residencia **desde dentro ES** solo si ya está en **legal stay** — не turista irregular. Resolución en **20 días** (instrucción consular); autorización inicial hasta **3 años** sin visado previo.",
      "**Extranjería / Policía / ICPPlus** — **не** канал первичной solicitud DNV из-за рубежа и **не** замена consulado для въезда. Oficina extranjería provincia и Comisaría — TIE huellas, renovaciones, modificaciones **después** autorización/visado. Путать «подам в extranjería Valencia» с teletrabajo consular — частая ошибка чатов.",
      "Полный правовой разбор маршрутов, modificaciones, nacionalidad и arraigo — в pillar [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026). Этот satellite-гайд закрывает **практику Valencia**: какой канал выбрать до прилёта, что делать после visado D на месте.",
    ],
    bullets: [
      "Third country → consulado → visado D → entrada → TIE ([TIE cita Valencia](/notes/" + TIE_CITA_SLUG + ")).",
      "Legal stay en ES → UGE telemático / representante — no visado previo.",
      "Extranjería provincia — renovación, modificación, arraigo; no solicitud inicial DNV desde RU.",
      "Schengen turismo 90/180 — **no** es residencia ni legal stay para UGE.",
      "Estancia por estudios — visado distinto; no teletrabajo; no cuenta 100% para nacionalidad art. 22 (soft overlay CC).",
    ],
  },
  {
    heading: "Что НЕ является residencia (и ломает маршрут)",
    section_kind: "official",
    paragraphs: [
      "В чатах «уже в Испании» часто означает **turista Schengen** или **estancia corta** — administración не считает это legal stay для UGE. Residencia создаёт **autorización** o **visado D** с целью teletrabajo, не штамп на границе.",
      "**Estancia por estudios** — отдельный visado/trámite. Миф «учусь → через 2 года nacionalidad по art. 22» неверен: estancia estudios **no computa** al 50% exigido para nacionalidad por residencia (art. 22 CC — larga duración-UE y residencias que cuentan). DNV и estudios — разные vías; не смешивайте пакеты.",
      "**Cuenta propia autónomo** с клиентами ES >20% — не teletrabajo internacional; нужен другой tipo autorización. **Cuenta ajena** с employer ES — employment, no DNV.",
      "Remote work visa другой страны EU **no** sustituye autorización española para residir en territorio ES.",
    ],
    bullets: [
      "Turismo — entrada, no residencia; overstay = irregular.",
      "Estancia estudios — 0% nacionalidad art. 22 (OK doctrina; soft en su caso concreto).",
      "DNV ≠ permiso trabajo genérico cuenta ajena ES.",
      "NIE turístico / certificado registro UE — no TIE post-visado D.",
    ],
  },
  {
    heading: "Typical RU track: consulado → Valencia",
    section_kind: "practice",
    paragraphs: [
      "Для граждан RU/BY/UA/KZ с доходом remote типичный маршрут 2025–2026: consulado (Moscú, SPb, Kyiv — по demarcación) → visado D teletrabajo → перелёт → NIE/padrón → TIE huellas → alta SS/IRPF. UGE изнутри — edge-case: уже legal stay (например, renovación desde otro título), не «прилетел без визы и подал nomad».",
      "Consulado проверяет 3+ meses relación laboral/profesional, empresa extranjera ≥1 año, 200% SMI, seguro ES, antecedentes con apostilla (RU/BY — apostilla de La Haya según noticia consular). Traducción jurada — закладывайте 2 semanas до cita.",
      "После resolución favorable — **1 mes** para recoger visado personalmente (one.gob.es). Plazo entrada — sticker consulado; TIE — mes desde entrada ([TIE guide](/notes/" + TIE_CITA_SLUG + ")).",
    ],
    bullets: [
      "Demarcación consular — residencia legal en país подачи, no «удобный город».",
      "RU: copia pasaporte interno + empadronamiento civil (noticia consulado Moscú).",
      "Bank statements 3–6 meses a nombre solicitante — no solo N26 sin historial.",
      "Seguro repatriación — cobertura todo plazo visado.",
      "NIE antes del visado — recomendación consulado para evitar demoras.",
      formatPracticeBullet({
        channels: ["spain_granitsa", "spainchats"],
        period: "2025–2026",
        claim:
          "resolución consular teletrabajo часто 2–4 meses после пакета completo — без plazo legal fijo",
        forReader:
          "не покупайте билет «на через 6 недель» до visado en pasaporte; planifique TIE + SS en Valencia",
      }),
    ],
  },
  {
    heading: "Пакет consulado: доход, 20% rule, familia",
    section_kind: "practice",
    paragraphs: [
      "Medios económicos — **200% SMI** mensual titular (2026: **2 849 €** sobre base SMI 1 221 € BOE). Familia: +75% SMI primer dependiente, +25% cada adicional (one.gob.es). Acreditar con contrato, nóminas, facturas autónomo, extractos bancarios coincidentes.",
      "Autónomo teletrabajo: relación contractual ≥3 meses; actividad con empresas ES permitida si **≤20%** del total (one.gob.es). Declaración responsable SS — alta RETA o importación legislación origen si convenio internacional.",
      "Titulación universitaria o **3 años** experiencia profesional analogable (one.gob.es). Antecedentes penales 2 años residencia + declaración 5 años.",
    ],
    bullets: [
      "200% SMI — OK BOE + one.gob.es; no redondear «2 800» en contrato si umbral 2 849.",
      "20% ES clients — contabilizar antes de solicitud; gestoría puede reestructurar facturación.",
      "Empresa extranjera — certificado registro mercantil ≥1 año actividad.",
      "Cuenta ajena — carta employer autorizando remote desde ES.",
      "Familiares — solicitud separada por miembro (one.gob.es).",
    ],
  },
  {
    heading: "Где sede и практика расходятся",
    section_kind: "gap",
    paragraphs: [
      "Формально UGE resuelve en 20 días para legal stay. На практике большинство RU/BY **no** califican — нет legal stay al llegar como turista. «UGE за 2 semanas» в чатах относится к casos уже dentro con título previo, не к bypass consulado.",
      "One.gob.es menciona beneficios fiscales 24% — это **régimen impatriados**, no automático con visado. Modelo 149 — ventana **6 meses** desde alta SS ([Agencia Tributaria](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c02-irpf-cuestiones-generales/sujecion-irpf-aspectos-personales/regimen-fiscal-especial-aplicable-trabajadores-desplazados/regimen-aplicable-trabajadores-desplazados/ejercicio-opcion-regimen-especial/plazo-ejercicio-opcion-regimen-especial.html)). См. [alta SS и Hacienda](/notes/" + ALTA_SS_SLUG + ").",
      "Consulado «lista completa» en web vs dозапрос traducción jurada — norma en @spain_granitsa.",
    ],
    bullets: [
      "Официально: UGE sin visado previo solo legal stay. На práctica: turista = canal consulado o salida.",
      "Официально: 20% rule autónomos. На práctica: un cliente ES al 25% — riesgo denegación o modificación.",
      "Официально: visado 1 año. На práctica: renovación → UGE en ES, no consulado exterior.",
      "«DNV = Beckham 24%» — fixed myth; visado ≠ modelo 149.",
      formatPracticeBullet({
        channels: ["spainchats"],
        period: "2025–2026",
        claim:
          "gestoría UGE €800–2000 — mercado servicios; no tarifa oficial Ministerio",
        forReader: "compare contrato escrito qué incluye antes de pagar «UGE express»",
      }),
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    paragraphs: [
      "Провалы редко из‑за «сложной Испании» — чаще из‑за смешения каналов, позднего TIE или дохода bajo umbral SMI tras actualización 2026.",
    ],
    bullets: [
      "Solicitar UGE estando turista — rechazo o situación irregular.",
      "Confundir extranjería Valencia con consulado Moscú/Barcelona consular ES.",
      ">20% ingresos España en teletrabajo autónomo — incoherencia programa.",
      "Antecedentes sin apostilla (RU/BY) — devolución expediente.",
      "Perder mes recogida visado — anulación (one.gob.es: 1 mes post-notificación).",
      "Retrasar TIE >1 mes post-entrada — problemas prácticos renovación.",
      "Creer Schengen = residencia para banco/contrato largo plazo.",
      "Estudios + teletrabajo «en paralelo» sin autorización — riesgo sanción.",
    ],
  },
  {
    heading: "К 4–6 месяцу в Valencia: SS, Hacienda, plástico",
    section_kind: "practice",
    paragraphs: [
      "К четвёртому–шестому месяцу после прилёта у типичного DNV-holder обычно уже есть TIE o resguardo, contrato alquiler y primera facturación autónomo o nómina extranjera. **Reloj SS** и **ventana modelo 149** (si aplica Beckham) часто приходятся на этот период — не откладывайте alta RETA «пока не будет пластик».",
      "Banco может запросить vida laboral o justificante alta SS; arrendador largo plazo — NIE + ingresos + a veces SS. IRPF residencia fiscal — **183 días** o centro intereses, no fecha TIE ([alta SS guide](/notes/" + ALTA_SS_SLUG + ")).",
      "Si visado D caduca mientras TIE en trámite — situación delicada; monitoreo ICPPlus desde semana 1. Passport RF caducando — [запись consulado](/notes/zapis-konsulstvo-ispanija-pasport-2026) desde Valencia (GKS Barcelona).",
    ],
    bullets: [
      "Alta SS/RETA — ver [NUSS y Hacienda Valencia](/notes/" + ALTA_SS_SLUG + ").",
      "Modelo 149 — 6 meses desde alta SS si opta impatriados; no automático DNV.",
      "Renovación teletrabajo — UGE en ES, ~60 días antes expiry (soft blogs; confirmar sede).",
      "Empadronamiento historial — TIE y SIP a mes 4–6.",
      "Assist Route Check — si canal equivocado o denegación: [/ru/assist](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=dnv-valencia&utm_content=dnv-uge-konsulstvo-2026).",
    ],
  },
  {
    heading: "Связанные шаги и pillar",
    section_kind: "practice",
    paragraphs: [
      "DNV cierra la parte **pre-vuelo**; en Valencia el arco continúa NIE → TIE → SS → IRPF. Wizard Emigro arma el orden por perfil: [/ru/wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=dnv-valencia&utm_content=dnv-uge-konsulstvo-2026).",
    ],
    bullets: [
      "Pillar: [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026) — ley, modificaciones, nacionalidad.",
      "[TIE cita extranjería](/notes/" + TIE_CITA_SLUG + ") — post-visado D.",
      "[Alta SS y Hacienda](/notes/" + ALTA_SS_SLUG + ") — NUSS, RETA, modelo 149.",
      "[Первые 30 дней](/notes/pervye-30-dnej-v-ispanii-satelit-2026) — orden semanal.",
      "[Банк IBAN](/notes/bank-iban-nerezident-ispaniya-2026) — KYC post-resguardo.",
    ],
  },
];

const keyTakeaways = [
  "Официально: DNV desde third country — visado D en consulado (demarcación residencia); UGE solo con legal stay en ES; extranjería/ICPPlus — TIE y trámites posteriores, no solicitud inicial desde RU.",
  "Официально: 200% SMI 2026 ≈ 2 849 €/mes (SMI 1 221 € BOE RD 126/2026); familia +75%/+25% SMI; autónomo max 20% ingresos clientes ES (one.gob.es).",
  formatPracticeTakeaway({
    channels: ["spain_granitsa", "spainchats"],
    period: "2025–2026",
    claim:
      "para RU/BY el 90% del track es consulado 2–4 meses + visado 1 año — UGE «rápido» no aplica al turista recién llegado",
    forReader:
      "reserve pillar para derecho completo; use este guide para canal y paquete antes del vuelo a Valencia",
  }),
  "Расхождение: «estancia estudios → nacionalidad 2 años» y «DNV = Beckham 24%» — mitos; estancia estudios 0% art. 22; Beckham requiere modelo 149 aparte.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Куда подавать DNV / teletrabajo — консульство или UGE?",
    a: "По правилам: из third country — **consulado** (visado D); desde dentro ES con **legal stay** — **UGE-CE**. Extranjería provincia no sustituye consulado para entrada. На практике RU/BY casi siempre consulado → vuelo → TIE Valencia.",
  },
  {
    q: "Можно ли подать UGE, приехав туристом?",
    a: "По правилам — no; turismo Schengen no es legal stay para UGE. На практике intentos «UGE sin visado» terminan en rechazo o irregularidad — salida y vía consular.",
  },
  {
    q: "Сколько дохода нужно в 2026?",
    a: "По правилам — 200% SMI: **2 849 €/mes** titular (SMI 1 221 € BOE 2026). Familia: +75% SMI primer miembro, +25% adicionales. На практике conviene margen sobre umbral por tipo de cambio.",
  },
  {
    q: "Можно работать на испанского клиента?",
    a: "По правилам autónomo teletrabajo — sí, si ≤**20%** del total (one.gob.es). Cuenta ajena con employer ES — otro visado. На практике gestoría revisa facturas antes de solicitud.",
  },
  {
    q: "Где полный legal pillar, что cubre satellite?",
    a: "Pillar [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026) — ley, nacionalidad, modificaciones. Satellite — consulado vs UGE, umbral SMI, errores Valencia post-visado, enlaces TIE y SS.",
  },
];

export const DNV_UGE_GUIDE = {
  slug: DNV_UGE_SLUG,
  category: "DNV и UGE",
  content_kind: "guide" as ContentKind,
  title: "DNV Испания: consulado vs UGE — маршрут Valencia 2026",
  excerpt:
    "Teletrabajo internacional: consulado o UGE, umbral 2 849 €/mes, regla 20% y qué no es residencia — guía práctica para RU/BY antes del visado D y TIE en Valencia.",
  seo_title: "DNV Valencia 2026 — consulado vs UGE teletrabajo",
  seo_description:
    "Digital nomad España 2026: consulado vs UGE, 2 849 €/mes (200% SMI), 20% clientes ES. Visado D, TIE Valencia, mitos estudios y Schengen — guía RU/BY.",
  quick_answer:
    "Desde fuera de España el teletrabajo (DNV) se tramita en el **consulado** de su demarcación: visado D hasta 1 año, umbral **≈2 849 €/mes** (200% SMI 2026, BOE 1 221 €). **UGE** solo si ya está en **estancia legal** en ES — no sustituye visado ni sirve al turista Schengen. Extranjería/ICPPlus en Valencia es para **TIE** después del visado, no la solicitud inicial. Autónomo: máx. **20%** ingresos de clientes españoles. Pillar completo en emigro.online/ru/guides/vnj-ispaniya-2026; aquí canal, paquete y mes 4–6 (SS/Hacienda).",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "ONE — visado nómada digital",
      url: "https://www.one.gob.es/es/tramites/solicitud-del-visado-de-nomada-digital",
    },
    {
      title: "Exteriores — visado teletrabajo (consulado Moscú)",
      url: "https://www.exteriores.gob.es/Consulados/moscu/es/Comunicacion/Noticias/Paginas/Articulos/20230502_NOT1.aspx",
    },
    {
      title: "BOE — SMI 2026 (RD 126/2026)",
      url: "https://www.boe.es/buscar/doc.php?id=BOE-A-2026-3815",
    },
    {
      title: "Inclusion — UGE (portal)",
      url: "https://www.inclusion.gob.es/",
    },
    {
      title: "Exteriores — embajadas y consulados",
      url: "https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/index.aspx",
    },
  ],
  topic_tags: ["dnv", "teletrabajo", "valencia", "consulado", "uge"],
  hashtags: buildNoteHashtags({
    topicTags: ["dnv", "teletrabajo", "valencia"],
    contentKind: "guide",
    extra: ["uge", "consulado", "extranjeria"],
  }),
  source_channel: "spain_granitsa+spainchats+valenciarusia",
  source_label: "editorial:dnv-uge-gold-valencia-2026",
  pillar_guide_slug: "vnj-ispaniya-2026",
};

export default DNV_UGE_GUIDE;
