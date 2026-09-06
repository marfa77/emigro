/**
 * Hand-curated Spain satellite guide — yellow pages for relocants in Valencia.
 * Practical directory: who to call months 1–6, not citizenship law sales.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { BANK_IBAN_SLUG } from "@/lib/community-notes/guides/spain-bank-iban-nerezident";
import { MEDITSINA_VALENCIA_SLUG } from "@/lib/community-notes/guides/spain-meditsina-valencia-sip";
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import { PERVYE_30_SLUG } from "@/lib/community-notes/guides/spain-pervye-30-dnej-checklist";
import { TIE_CITA_SLUG } from "@/lib/community-notes/guides/spain-tie-cita-extranjeria-valencia";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const ZHELTYE_STRANITSY_VALENCIA_SLUG = "zheltye-stranitsy-relokanta-valencia-2026";

/** Planned core guide — link label wired in note-link-labels.ts */
const ALTA_SS_HACIENDA_SLUG = "alta-ss-hacienda-valencia-2026";

const GLOSSARY_INTRO =
  "Короткий словарь «кого звать» — чтобы electrician no fuera abogado de nacionalidad y gestoría no vendiera Beckham cuando usted solo necesita alta Seguridad Social.";

const DISCLAIMER =
  "**Emigro — не юридическая консультация и не call-center.** Экстренные случаи — **112**. Перед подачей в госорган сверяйте формы на sede oficial; Telegram-объявления — не источник права.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(ZHELTYE_STRANITSY_VALENCIA_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Directorio práctico meses 1–6 Valencia. **OK** = portal .gob.es / ayuntamiento; **soft** = mercado servicios; **UNCHECKED** = tarifas concretas.",
    ],
    bullets: [
      "OK: emergencias — **112**; sanidad urgente grave — 112 → SAMU CV ([ses.san.gva.es](https://ses.san.gva.es/es/)).",
      "OK: extranjería/TIE — [ICPPlus](https://sede.administracionespublicas.gob.es/icpplus/citar); NIE/padrón — ayuntamiento ([гайд](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        ")).",
      "OK: Seguridad Social alta — [sede.seg-social.gob.es](https://sede.seg-social.gob.es/wps/portal/sede); trámites empresa/autónomo.",
      "Soft: gestoría €80–200/mes autónomo — mercado, no tarifa oficial.",
      "UNCHECKED: honorarios electricista/plumber media Valencia 2026 — presupuesto siempre antes.",
      "Fixed: «abogado nacionalidad para abrir luz» — desvío; ver [SIM/luz](/notes/sim-internet-luz-valencia-2026).",
    ],
  },
  {
    heading: "Официально: органы первых недель",
    section_kind: "official",
    paragraphs: [
      "En los primeros meses en Valencia la mayoría de trámites no requiere «el mejor abogado de España», sino **el organismo correcto**: Policía/ICPPlus para TIE, ayuntamiento para padrón, Seguridad Social para alta laboral, banco para IBAN, centro de salud para SIP.",
      "Use [Administración en línea](https://administracion.gob.es/) como índice de sedes. Para Valencia ciudad: [Ayuntamiento](https://www.valencia.es/) y [sede electrónica](https://sede.valencia.es/) — cita previa, ORA, residuos.",
    ],
    bullets: [
      "[ICPPlus](/notes/" + TIE_CITA_SLUG + ") — cita huellas TIE provincia Valencia.",
      "[Policía extranjería](https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria.php) — información trámites.",
      "[Agencia Tributaria](https://sede.agenciatributaria.gob.es/) — NIE fiscal, modelos, certificados.",
      "[Seguridad Social](https://www.seg-social.es/) — alta, cotización, vida laboral.",
      "[san.gva.es](https://www.san.gva.es/es/web/tarjeta-sanitaria) — SIP Comunitat Valenciana.",
      "[060](https://www.060.gob.es/) — información administrativa general España (no sustituye cita organismo).",
    ],
  },
  {
    heading: "Быт: electrician, fontanería, cerrajero",
    section_kind: "practice",
    paragraphs: [
      "Avería eléctrica, fuga agua o cerradura — **urgencia doméstica**, no extranjería. En Valencia contratar **electricista autorizado** y **fontanero** vía recomendación vecinal, seguro hogar o plataformas con reseñas verificables (Habitissimo, Cronoshare — **soft**, no endoso Emigro).",
      "Pida **presupuesto por escrito** antes de intervención; desplazamiento + hora mano obra suelen facturarse aparte (**UNCHECKED** rangos €). Para avería que amenaza seguridad (chispas, inundación) — corte general y seguro hogar si contrató.",
      "Cerrajero 24h — solo con factura y precio acordado; anuncios Telegram «€30 puerta» sin empresa son riesgo estafa.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenforum", "valenciarusia"],
        period: "2025–2026",
        claim:
          "electricista y fontanero fiables llegaron vía administrador finca o vecinos Ruzafa, no anuncio chat",
        forReader:
          "pregunte en comunidad de propietarios antes de Telegram marketplace",
      }),
      "Seguro hogar — revisar cobertura daños eléctricos/agua; franquicia.",
      "Boletín eléctrico (CIE) — solo electricista colegiado; necesario alta luz nueva.",
      "EMIVASA avería contador — 963 860 600 ([гайд utilities](/notes/sim-internet-luz-valencia-2026)).",
      "No pague en efectivo sin factura — reclamación imposible.",
    ],
  },
  {
    heading: "Gestoría, alta SS y Hacienda — когда платить",
    section_kind: "official",
    paragraphs: [
      "**Gestoría** — despacho administrativo: alta autónomo, modelos trimestrales, acompañamiento SS, a veces monitor ICPPlus. **No sustituye** abogado en recurso contencioso ni «compra cita» ilegal.",
      "Alta en Seguridad Social como trabajador o autónomo — empleador o gestoría vía sede SS; guía dedicada: [alta SS y Hacienda Valencia](/notes/" +
        ALTA_SS_HACIENDA_SLUG +
        ") (**slot editorial** — trámite oficial en sede.seg-social.gob.es).",
      "Abogado extranjería — cuando visado caduca, recurso denegación, nacionalidad (**no** mes 1 para NIE estándar). Abogado laboral — despido, contrato hostil.",
    ],
    bullets: [
      "Gestoría mes 1–2: útil si autónomo + español limitado + cita SS.",
      "Gestoría mes 4–6: declaraciones trimestrales IRPF/IVA autónomo.",
      "Empleador cuenta ajena — alta SS empresa; usted no necesita gestoría SS.",
      "Modelo 145/036 — Hacienda; gestoría o software certificado.",
      "Lista verificación contrato gestoría: qué incluye, plazos, sin garantía cita ICPPlus.",
    ],
  },
  {
    heading: "Salud privada, traducción jurada, dentista",
    section_kind: "practice",
    paragraphs: [
      "Pediatra/dentista **privado** — cuando SIP aún no activo o dental adulto no cubierto SNS. Busque clínica con factura y NIF; [медицина Valencia](/notes/" +
        MEDITSINA_VALENCIA_SLUG +
        ") cubre SIP vs privado.",
      "**Traductor jurado** (traductor/a jurado/a) — documentos académicos, contratos para juzgado, algunas solicitudes consulares. Listado oficial Ministerio de Asuntos Exteriores — [MAEC traductores](https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Traductores.aspx) (**soft** enlace estructura).",
      "No use «traductor del chat» para expediente escolar oficial — colegio puede rechazar.",
    ],
    bullets: [
      "Dentista privado Valencia — presupuesto limpieza/consulta (**UNCHECKED** €).",
      "Pediatra privado — seguro Sanitas/DKV red concertada.",
      "Psicólogo/coach expat — servicio privado; no SNS salvo derivación.",
      "Farmacia — receta médico; farmacéutico no sustituye médico.",
      "Optometrista — ópticas comerciales; graduación ≠ oftalmólogo SNS.",
    ],
  },
  {
    heading: "Cómo distinguir servicio normal de anuncio Telegram",
    section_kind: "gap",
    paragraphs: [
      "Servicio normal: factura con NIF, contrato o presupuesto, referencia a sede oficial cuando es trámite público, sin prometer «TIE garantizado 48h».",
      "Anuncio sospechoso: solo Telegram/WhatsApp, pago Bizum sin factura, «abogado» que no muestra número colegiado, precio todo-incluido nacionalidad+TIE+Beckham.",
    ],
    bullets: [
      "Официально: cita ICPPlus gratuita. На практике: «vendo cita» — estafa.",
      "Gestoría legítima admite honorarios por escrito; no pide pasaporte fotos sin contrato.",
      "Electricista colegiado — número en factura; chapuzas baratas encarecen seguro.",
      "Desconfíe perfiles «gestor Valencia» sin domicilio fiscal ES.",
      formatPracticeBullet({
        channels: ["spain_granitsa", "valenforum"],
        period: "2025–2026",
        claim:
          "estafas «abogado DNV Beckham pack» en grupos Telegram — bloqueo y denuncia",
        forReader:
          "para trámite concreto abra sede.gob.es primero; Assist Emigro audit ruta, no vende cita",
      }),
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    paragraphs: [
      "Справочник ломается, когда вызывают юриста на протечку или ждут Telegram вместо sede. Ниже — что чаще всего стопорит первые 4–6 месяцев в Valencia.",
    ],
    bullets: [
      "Платить «abogado» за cita ICPPlus — слот бесплатный на портале; это scalping.",
      "Gestoría «todo incluido» Beckham+nacionalidad, когда нужен только alta SS или перевод jurado.",
      "Electricista/fontanero без factura y NIF — seguro hogar no cubre chapuza.",
      "Откладывать traductor jurado MAEC до mes 5 — colegio y Hacienda не принимают перевод без sello.",
      "Хранить единственную копию контактов в чате Telegram — при бане профиля теряете номер cerrajero.",
    ],
  },
  {
    heading: "Qué resolver aquí vs Assist vs portal oficial",
    section_kind: "practice",
    paragraphs: [
      "**Portal oficial** — cuando existe formulario, plazo legal y competencia clara (ICPPlus, padrón, SS, SIP).",
      "**DIY + este directorio** — averías hogar, elección gestoría transparente, traductor jurado listado.",
      "**Emigro Assist** — Route Check cuando visado plazo, denegación, estructura autónomo/Beckham dudosa, o pánico mes 4 con multas+citas mezcladas — [Assist](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=yellow-pages-valencia&utm_content=zheltye-stranitsy-relokanta-valencia-2026).",
      "No es página Beckham/DNV: nacionalidad 2 años y UGE tienen guías propias; aquí **operativa Valencia semestre 1**.",
    ],
    bullets: [
      "Mes 1: 112, ICPPlus, ayuntamiento, banco — [30 días](/notes/" + PERVYE_30_SLUG + ").",
      "Mes 2–3: gestoría SS si autónomo; electricista si piso antiguo.",
      "Mes 4–6: revisar si gestoría aún necesaria post-TIE; dentista privado planificado.",
      "[IBAN](/notes/" + BANK_IBAN_SLUG + ") — antes domiciliar seguro/gestoría.",
      "Pillar VNЖ — [/ru/guides/vnj-ispaniya-2026](/ru/guides/vnj-ispaniya-2026) para marco legal, no fontanero.",
    ],
  },
  {
    heading: "К 4–6 месяцу: DIY vs pagar gestor",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу** видно, что осталось: TIE plástico, SS estable, primera declaración autónomo, seguro hogar tras avería. **DIY** tiene sentido para padrón, SIP cita, Bonobús — trámites con guía Emigro.",
      "Pagar gestoría tiene sentido si modelo 303/130 autónomo, alta SS retrasada genera gap, o multa DGT impugnación (**soft**). No pague «pack nacionalidad» si solo necesita cerrajero y traductor jurado expediente escolar.",
      "Revise suscripciones mes 4: gestoría duplicada con asesor fiscal home country — elija uno.",
    ],
    bullets: [
      "Checklist mes 4: ¿TIE recogida? ¿SS vida laboral correcta? ¿Seguro hogar activo?",
      "Gestoría — cancelar si solo monitorizaba cita ya resuelta.",
      "Abogado — activar solo si recurso o plazo visado.",
      "Directorio actualizado — bookmark sede.valencia.es + ICPPlus + san.gva.es.",
      "Telegram — silenciar anuncios servicios; usar búsqueda en guías Emigro.",
    ],
  },
];

const keyTakeaways = [
  "Официально: mes 1 — 112, ICPPlus/TIE, ayuntamiento padrón, Seguridad Social, san.gva.es SIP; índice administracion.gob.es.",
  formatPracticeTakeaway({
    channels: ["valenforum", "valenciarusia"],
    period: "2025–2026",
    claim:
      "electricista/fontanero fiable vía comunidad; gestoría solo autónomo/SS, no NIE básico",
    forReader:
      "presupuesto escrito antes de obra; rechace Telegram sin factura",
  }),
  "На практике: traductor jurado MAEC para documentos oficiales; dentista/pediatra privado si SNS cola.",
  "Расхождение: anuncio «abogado todo en uno» vs trámite sede gratuito; Assist — audit ruta, no scalper cita.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Кого вызывать в Valencia в первые полгода?",
    a: "По правилам — organismo competente: Policía/ICPPlus (TIE), ayuntamiento (padrón), SS (alta), CS (SIP), 112 (emergencia). На практике: fontanero/electricista vía comunidad; gestoría si autónomo; abogado solo recurso/complejo.",
  },
  {
    q: "Как отличить gestoría normal de estafa?",
    a: "По правилам — gestoría factura con NIF y contrato. На практике: desconfíe garantía cita ICPPlus, pago solo Bizum, Beckham+nacionalidad pack en Telegram.",
  },
  {
    q: "Нужен ли abogado para NIE?",
    a: "По правилам — no obligatorio; EX-15 y cita sede. На практике: gestoría opcional monitor cita; abogado — denegación o visado caducado.",
  },
  {
    q: "Где traductor jurado?",
    a: "По правилам — listado MAEC traductores jurados. На практике: colegio/Hacienda rechazan traducción sin sello jurado.",
  },
  {
    q: "Cuándo Emigro Assist vs DIY?",
    a: "По правилам — trámites estándar DIY en sede. На практике: Assist Route Check si plazos visado, denegación, autónomo+impuestos dudosos mes 4–6.",
  },
];

export const ZHELTYE_STRANITSY_VALENCIA_GUIDE = {
  slug: ZHELTYE_STRANITSY_VALENCIA_SLUG,
  category: "Справочник релоканта",
  content_kind: "guide" as ContentKind,
  title: "Жёлтые страницы релоканта Valencia 2026: кого звать",
  excerpt:
    "Electricista, fontanería, gestoría alta SS, pediatra/dentista privado, traductor jurado — кого реально вызывать в первые 6 meses Valencia, как отличить servicio de anuncio Telegram y cuándo portal vs Assist.",
  seo_title: "Gestoría Valencia 2026 — жёлтые страницы",
  seo_description:
    "Gestoría Valencia 2026: electrician, fontanería, alta SS, traductor jurado. Кого звать полгода — portal vs Assist, sin abogado nacionalidad. Anti-estafa Telegram.",
  quick_answer:
    "Primeros 6 meses Valencia: 112 emergencias; ICPPlus y ayuntamiento para TIE/padrón; Seguridad Social para alta laboral; centro salud SIP. Averías hogar — electricista/fontanero con presupuesto y factura, no Telegram. Gestoría — autónomo/modelos SS, no «abogado Beckham». Traductor jurado MAEC para documentos oficiales. Rechace anuncios sin NIF; Assist Emigro — audit ruta compleja, no venta cita.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Administración.gob.es — directorio", url: "https://administracion.gob.es/" },
    { title: "ICPPlus — cita extranjería", url: "https://sede.administracionespublicas.gob.es/icpplus/citar" },
    { title: "Seguridad Social — sede electrónica", url: "https://sede.seg-social.gob.es/wps/portal/sede" },
    { title: "Ayuntamiento Valencia — sede", url: "https://sede.valencia.es/" },
    { title: "MAEC — traductores jurados", url: "https://www.exteriores.gob.es/es/ServiciosAlCiudadano/Paginas/Traductores.aspx" },
    { title: "Sanidad CV — SIP", url: "https://www.san.gva.es/es/web/tarjeta-sanitaria" },
  ],
  topic_tags: ["directory", "valencia", "gestoria", "services"],
  hashtags: buildNoteHashtags({
    topicTags: ["directory", "valencia", "gestoria", "services"],
    contentKind: "guide",
    extra: ["fontaneria", "electricista", "traductor", "assist"],
  }),
  source_channel: "valenforum+valenciarusia+spain_granitsa",
  source_label: "editorial:yellow-pages-valencia-gold-2026",
  pillar_guide_slug: "vnj-ispaniya-2026",
};

export default ZHELTYE_STRANITSY_VALENCIA_GUIDE;
