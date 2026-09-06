/**
 * Hand-curated Spain satellite guide — NUSS / RETA / Hacienda Valencia.
 * SS alta separated from Beckham myths and tax residence rules.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { DNV_UGE_SLUG } from "@/lib/community-notes/guides/spain-dnv-uge-konsulstvo";
import { TIE_CITA_SLUG } from "@/lib/community-notes/guides/spain-tie-cita-extranjeria-valencia";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const ALTA_SS_HACIENDA_SLUG = "alta-ss-hacienda-valencia-2026";

const GLOSSARY_INTRO =
  "NUSS, RETA, modelo 149 и residencia fiscal — слова, которые gestoría смешивает с «DNV = 24%». Разберём до первого invoice, пока ventana Beckham не закрылась на месяце 5.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(ALTA_SS_HACIENDA_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор спорных формулировок. **OK** = Seg-Social / Agencia Tributaria; **soft** = Valencia 2025–2026; **fixed** = смягчено. No asesoría fiscal — cuotas y plazos en sede oficial al día del alta.",
    ],
    bullets: [
      "OK: NUSS/NAF — Número de la Seguridad Social; solicitud vía [Importass](https://portal.seg-social.gob.es/wps/portal/importass/importass) (Tesorería General SS).",
      "OK: autónomo — alta censal AEAT modelos **036/037** **antes o mismo día** que alta RETA; retraso → recargo ([guía autónomo Importass](https://portal.seg-social.gob.es/wps/portal/importass/importass/Colectivos/Trabajo+Autonomo/Guia)).",
      "OK: extranjero no UE — alta RETA requiere NIE, NUSS y permiso trabajo/residencia (misma guía Importass).",
      "OK: régimen impatriados (Beckham) — opción vía **modelo 149** en plazo **6 meses** desde inicio actividad en alta SS ([Agencia Tributaria — plazo modelo 149](https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c02-irpf-cuestiones-generales/sujecion-irpf-aspectos-personales/regimen-fiscal-especial-aplicable-trabajadores-desplazados/regimen-aplicable-trabajadores-desplazados/ejercicio-opcion-regimen-especial/plazo-ejercicio-opcion-regimen-especial.html)).",
      "Fixed: «DNV = Beckham 24% automático» → visado teletrabajo **≠** modelo 149; hay que optar y cumplir requisitos impatriados.",
      "Fixed: «residencia fiscal = TIE plástico» → residencia fiscal IRPF — **183 días** / centro intereses vitales; TIE documenta migración, no sustituye criterio AEAT.",
      "Soft: banco pide SS a mes 2–4 — práctica Valencia @valenciarusia.",
      "UNCHECKED: cuota autónomo 2026 tarifa plana €80 vs €88 — no fetch tarifa oficial; gestoría cita cifras variables; ver sede Seg-Social RETA al tramitar.",
      "UNCHECKED: importe cuota mínima base RETA 2026 exacta — confirmar en Importass/sede al alta.",
    ],
  },
  {
    heading: "Официально: NUSS, alta censal y RETA",
    section_kind: "official",
    paragraphs: [
      "Número de la Seguridad Social (NUSS, también NAF) identifica su relación con la Tesorería General de la Seguridad Social. Sin él no hay alta en RETA (Régimen Especial Trabajadores Autónomos) ni vida laboral que piden bancos y algunos arrendadores.",
      "Portal [Importass](https://portal.seg-social.gob.es/wps/portal/importass/importass) concentra trámites: solicitar NUSS, alta/baja autónomo, consulta deudas. Extranjero: servicio «Solicitar el número de la Seguridad Social» desde área personal o sede electrónica con NIE.",
      "Secuencia autónomo (Importass guía): **alta en Hacienda** (declaración censal 036/037, CNAE/IAE) **el mismo día o antes** del inicio de actividad; **alta RETA** coincidente. Alta hasta **60 días antes** del inicio; si tarde, cuota mes completo desde primer día del mes y posible **recargo** si >30 días desde inicio actividad.",
      "Empleado por cuenta ajena: alta la hace el **employer** español o extranjero según convenio; teletrabajador DNV autónomo — usted tramita RETA salvo importación legislación origen (declaración responsable visado).",
    ],
    bullets: [
      "NUSS — Importass / sede Seg-Social; consulta en área personal si ya existe.",
      "036/037 AEAT — censal antes RETA.",
      "RETA — obligatoria autónomo habitual; cuotas mensuales independientes Beckham.",
      "Vida laboral — informe online tras alta.",
      "NIE + autorización residencia — requisitos extranjero no UE (Importass).",
    ],
  },
  {
    heading: "Beckham, autónomo y mitos de chat (no automático con DNV)",
    section_kind: "official",
    paragraphs: [
      "Régimen especial impatriados (Ley Beckham / art. 93 Ley 35/2006) permite tributación IRNR 24% sobre rentas españolas elegibles hasta cierto límite — **solo tras optar** con modelo 149 en plazo **6 meses** desde fecha inicio actividad en alta SS (Agencia Tributaria). Teletrabajo visa autoriza **residir**; no activa régimen fiscal.",
      "Mitos frecuentes en @spainchats: «remote = Beckham» (falso sin qualifying employment/estructura y modelo 149); «autónomo solo si clientes ES» (muchos DNV con invoice income necesitan RETA); «no pagar SS primer año» (recargos Seg-Social + Hacienda).",
      "Autónomo: cuota RETA se paga **independiente** de impatriados; 24% IRPF eligible ≠ exención Seguridad Social. Foreign payroll + autónomo — riesgo doble cotización; gestoría revisa convenio y modelo 100/303.",
      "DNV teletrabajo no sustituye alta censal si factura como profesional; employer extranjero con nómina puede ser cuenta ajena sin RETA — caso a caso con contrato.",
    ],
    bullets: [
      "Modelo 149 — ventana 6 meses post-alta SS; electrónica; alta censal previa.",
      "Beckham — employment/director cases; no todos freelancers remote.",
      "RETA cuota — mensual aun con impatriados aprobado.",
      "Myth DNV=24% — fixed; ver DNV guide y gestoría.",
      "UNCHECKED: tarifa plana primer año autónomo 2026 importe — sede al tramitar.",
    ],
  },
  {
    heading: "Residencia fiscal: cuándo empieza el «reloj»",
    section_kind: "official",
    paragraphs: [
      "Residencia fiscal española (IRPF) — regla general **183 días** en territorio ES en año natural y/o **centro de intereses vitales** (familia, negocio principal). No coincide automáticamente con fecha TIE ni sello pasaporte turístico.",
      "Permiso teletrabajo implica residir legalmente; obligaciones fiscales dependen de días, ingresos ES/worldwide según tratados y opción impatriados. Modelo 149 — opt-in; sin él, progresivo IRPF residente.",
      "Certificado de residencia fiscal AEAT — trámite separado; bancos a veces confunden TIE con certificado fiscal.",
    ],
    bullets: [
      "183 días — orientación IRPF; contabilizar entradas/salidas.",
      "Centro intereses — soft criterio AEAT; no solo contrato alquiler.",
      "TIE plástico — identidad migratoria; no prueba fiscal sola.",
      "Convenios doble imposición — país origen ingresos vs ES.",
      "Gestoría — calendario modelos 130/303 trimestrales autónomo.",
    ],
  },
  {
    heading: "Valencia en práctica: banco, arrendador, contrato",
    section_kind: "practice",
    paragraphs: [
      "Tras [TIE huellas](/notes/" + TIE_CITA_SLUG + ") y resguardo, bancos Valencia (CaixaBank, Santander, BBVA) suelen pedir NIE, empadronamiento, justificante ingresos y a veces **vida laboral** o alta SS para cuenta nómina o préstamo. Contrato alquiler largo plazo — propietario puede exigir nómina ES, autónomo con RETA o aval bancario.",
      "Remote con empresa extranjera: contrato y extractos pueden bastar para IBAN inicial ([banco guide](/notes/bank-iban-nerezident-ispaniya-2026)); a mes 4–6 agency pide más estabilidad — SS o TIE plástico.",
      "IE (Identificación de Extranjero) en facturas autónomo — coherente con alta censal; sin censal, Hacienda no reconoce actividad.",
    ],
    bullets: [
      "Resguardo TIE + NIE — KYC inicial banco.",
      "Vida laboral Importass — prueba alta SS mes 3–6.",
      "Autónomo — RETA antes facturar clientes ES > umbral ocasional.",
      "Landlord Idealista — ingresos 3× renta; SS refuerza perfil.",
      formatPracticeBullet({
        channels: ["valenciarusia", "valenforum"],
        period: "2025–2026",
        claim:
          "algunos clerks bancarios piden TIE plástico aunque resguardo huellas sea válido — segunda sucursal acepta resguardo",
        forReader: "lleve resguardo + vida laboral PDF en la misma carpeta KYC",
      }),
    ],
  },
  {
    heading: "Где sede и práctica divergen",
    section_kind: "gap",
    paragraphs: [
      "Formalmente alta RETA puede ser telemática Importass el mismo día que censal. En práctica gestorías Valencia cobran €80–150/mes incluyendo modelos — mercado, no tarifa pública.",
      "Plazo modelo 149 — 6 meses calendario desde alta SS (AEAT). En chats «semestre desde llegada» — impreciso; cuenta desde **inicio actividad en SS**, no desde visado.",
    ],
    bullets: [
      "Официально: alta SS mismo día inicio. На práctica: DNV holders retrasan mes 2–3 esperando TIE — riesgo recargo si autónomo ya factura.",
      "Официально: Beckham requiere modelo 149. На práctica: «me dijeron 24% con visa» — error caro sin opt-in.",
      "Офiciально: NUSS gratuito online. На práctica: gestoría cobra «tramitar NUSS» — puede hacerlo usted Importass.",
      "Soft: cuota autónomo primer año reducida — verificar en sede; no repetir cifras blog sin fetch.",
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    paragraphs: [
      "Errores a mes 4–6 suelen ser ventana 149 perdida, RETA tardía con recargo, o confundir residencia migratoria con fiscal.",
    ],
    bullets: [
      "Facturar autónomo sin alta censal/RETA — sanciones Hacienda + SS.",
      "Perder 6 meses modelo 149 — IRPF progresivo residente.",
      "Asumir DNV exime SS — declaración responsable visado exige cumplimiento.",
      "Esperar TIE plástico para NUSS — puede solicitar antes con NIE + autorización.",
      "No guardar justificante alta SS — banco mes 5 lo pide.",
      "Mezclar nómina extranjera y autónomo sin asesor — doble alta.",
      "Creer stamp turista fija residencia fiscal — no.",
    ],
  },
  {
    heading: "К 4–6 месяцу: ventanas, recargos, documentos",
    section_kind: "practice",
    paragraphs: [
      "Entre mes 4 y 6 muchos teletrabajadores Valencia ya tienen resguardo o TIE, contrato alquiler y primeros ingresos declarables. **Ventana modelo 149** puede cerrarse en este tramo si alta SS fue en mes 1–2. **Recargos RETA** aparecen si actividad empezó antes del alta formal.",
      "Renovación alquiler, hipoteca o cuenta nómina — arrendador/banco piden vida laboral o certificado SS. SIP tarjeta sanitaria — alta SS vinculada ([medicina guide](/notes/meditsina-valencia-sip-sns-chastnaya-2026)).",
      "Si aún sin alta — priorice Importass + gestoría esta semana; paralelo [DNV contexto](/notes/" + DNV_UGE_SLUG + ") si visado teletrabajo.",
    ],
    bullets: [
      "Mes 4 — revise si quedan <2 meses para modelo 149.",
      "Mes 5 — banco/landlord: prepare vida laboral PDF.",
      "Mes 6 — cierre ventana 149 si alta SS mes 0–1.",
      "Recargos — cuotas desde inicio actividad + recargo sede SS.",
      "Assist — estructura ingresos: [/ru/assist](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=ss-valencia&utm_content=alta-ss-hacienda-valencia-2026).",
    ],
  },
  {
    heading: "Связанные шаги",
    section_kind: "practice",
    paragraphs: [
      "SS cierra el triángulo migración–fiscal–sanidad post-[TIE](/notes/" + TIE_CITA_SLUG + "). Orden completo en wizard: [/ru/wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=ss-valencia&utm_content=alta-ss-hacienda-valencia-2026).",
    ],
    bullets: [
      "[DNV consulado/UGE](/notes/" + DNV_UGE_SLUG + ") — obligaciones SS en visado.",
      "[TIE cita](/notes/" + TIE_CITA_SLUG + ") — antes o paralelo NUSS.",
      "[Банk IBAN](/notes/bank-iban-nerezident-ispaniya-2026) — KYC.",
      "Pillar: [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026).",
    ],
  },
];

const keyTakeaways = [
  "Официально: NUSS vía Importass; autónomo — censal AEAT 036/037 mismo día o antes que RETA; extranjero necesita NIE + permiso residencia (guía Importass).",
  "Официально: Beckham/régimen impatriados — modelo 149 en **6 meses** desde alta SS; **no** automático con DNV (Agencia Tributaria).",
  formatPracticeTakeaway({
    channels: ["valenciarusia", "spainchats"],
    period: "2025–2026",
    claim:
      "a mes 4–6 bancos y arrendadores Valencia piden vida laboral o justificante SS aunque resguardo TIE bastara al mes 1",
    forReader:
      "tramite NUSS y RETA en mes 1–2 si factura autónomo; no espere plástico TIE",
  }),
  "Расхождение: residencia fiscal (183 días/centro intereses) ≠ TIE; cuota RETA 2026 tarifa plana — UNCHECKED importe exacto, ver sede al alta.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как получить номер Seguridad Social в Valencia?",
    a: "По правилам — solicitud **NUSS** en [Importass](https://portal.seg-social.gob.es/wps/portal/importass/importass) con NIE; luego alta **RETA** si autónomo tras censal AEAT. На практике gestoría Valencia lo empaqueta; puede hacerlo online usted.",
  },
  {
    q: "Когда начинается налоговый «час»?",
    a: "По правилам IRPF — **183 días** en ES y/o centro intereses vitales en el año; Beckham opt-in — **6 meses** desde alta SS (modelo 149). На практике no espere TIE plástico como señal fiscal; lleve calendario entradas.",
  },
  {
    q: "DNV da derecho a Beckham 24%?",
    a: "По правилам — **no** automático; requiere elegibilidad impatriados + **modelo 149** en plazo. На практике muchos DNV autónomos pagan IRPF progresivo + cuota RETA sin opt-in.",
  },
  {
    q: "¿Qué piden banco y arrendador a mes 4–6?",
    a: "По правилам — NIE, ingresos, contrato; SS no siempre legalmente exigido al banco. На практике Valencia: vida laboral, alta autónomo o nómina estable; TIE plástico a veces más que resguardo.",
  },
  {
    q: "Orden alta autónomo — Hacienda o Seg-Social primero?",
    a: "По правилам Importass — **Hacienda (036/037) antes o mismo día** que RETA. На практике gestoría presenta ambos el día de inicio actividad acordado.",
  },
];

export const ALTA_SS_HACIENDA_GUIDE = {
  slug: ALTA_SS_HACIENDA_SLUG,
  category: "SS и Hacienda",
  content_kind: "guide" as ContentKind,
  title: "NUSS, alta SS y Hacienda en Valencia 2026",
  excerpt:
    "Número Seguridad Social vía Importass, RETA autónomo, modelo 149 Beckham y residencia fiscal — qué piden banco y arrendador al mes 4–6 en Valencia.",
  seo_title: "Seguridad Social Valencia 2026 — NUSS y Hacienda",
  seo_description:
    "NUSS Importass, alta RETA autónomo, modelo 149 Beckham (6 meses), residencia fiscal 183 días. Práctica Valencia mes 4–6: banco, arrendador, DNV — guía RU.",
  quick_answer:
    "El **NUSS** (número Seguridad Social) se solicita en **Importass** (portal Seg-Social). Autónomo: **alta censal AEAT 036/037** el mismo día o antes del **RETA**; retraso implica recargo. **Beckham** (régimen impatriados) **no** viene con visa DNV — hay que presentar **modelo 149** en **6 meses** desde el alta SS (Agencia Tributaria). Residencia fiscal IRPF: **183 días**/centro de intereses, no la fecha del TIE. A mes 4–6 en Valencia banco y arrendador suelen pedir vida laboral o justificante SS.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "Importass — Tesorería SS",
      url: "https://portal.seg-social.gob.es/wps/portal/importass/importass",
    },
    {
      title: "Importass — guía autónomo",
      url: "https://portal.seg-social.gob.es/wps/portal/importass/importass/Colectivos/Trabajo+Autonomo/Guia",
    },
    {
      title: "Agencia Tributaria — plazo modelo 149",
      url: "https://sede.agenciatributaria.gob.es/Sede/ayuda/manuales-videos-folletos/manuales-practicos/irpf-2025/c02-irpf-cuestiones-generales/sujecion-irpf-aspectos-personales/regimen-fiscal-especial-aplicable-trabajadores-desplazados/regimen-aplicable-trabajadores-desplazados/ejercicio-opcion-regimen-especial/plazo-ejercicio-opcion-regimen-especial.html",
    },
    {
      title: "Agencia Tributaria — censal 036/037",
      url: "https://sede.agenciatributaria.gob.es/",
    },
  ],
  topic_tags: ["seguridad-social", "hacienda", "autonomo", "valencia", "beckham"],
  hashtags: buildNoteHashtags({
    topicTags: ["seguridad-social", "hacienda", "valencia"],
    contentKind: "guide",
    extra: ["autonomo", "nuss", "reta"],
  }),
  source_channel: "valenciarusia+spainchats+spain_granitsa",
  source_label: "editorial:alta-ss-hacienda-gold-valencia-2026",
  pillar_guide_slug: "vnj-ispaniya-2026",
};

export default ALTA_SS_HACIENDA_GUIDE;
