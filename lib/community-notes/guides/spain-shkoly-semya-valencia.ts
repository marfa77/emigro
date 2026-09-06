/**
 * Hand-curated Spain satellite guide — schools and family in Valencia.
 * Official CEICE/G236 admission separated from international school practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { MEDITSINA_VALENCIA_SLUG } from "@/lib/community-notes/guides/spain-meditsina-valencia-sip";
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import { PERVYE_30_SLUG } from "@/lib/community-notes/guides/spain-pervye-30-dnej-checklist";
import { VALENCIA_RAJONY_SLUG } from "@/lib/community-notes/guides/spain-valencia-rajony";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const SHKOLY_SEMYA_SLUG = "shkoly-semya-valencia-2026";

const GLOSSARY_INTRO =
  "Слова из admisión CEICE, centro de salud и чатов colegio — чтобы не перепутать fase ordinaria с vacantes, empadronamiento с matrícula и calendario vacunación с «записью в любую частную школу без lista».";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(SHKOLY_SEMYA_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Сверка с ceice.gva.es, procedimiento G236 y san.gva.es. **OK** = fetch oficial; **soft** = práctica chats; **UNCHECKED** = no confirmado.",
    ],
    bullets: [
      "OK: curso **2026-2027** — fase ordinaria admisión ya cerrada (mayo–julio 2026 según G236); llegada **septiembre 2026** → vacantes / fase extraordinaria / lista espera — [ceice fase extraordinaria](https://ceice.gva.es/es/web/admision-alumnado/fase-extraordinaria).",
      "OK: fase extraordinaria 2026-2027 — publicación vacantes Infantil/Primaria Valencia **21/07/2026**; ESO Valencia **23/07/2026**; Bachillerato **29/07/2026** (página CEICE).",
      "OK: solicitudes telemáticas extraordinaria Infantil/Primaria — 13–16 julio 2026; matrícula admitidos 23–27 julio (**G236 PDF** gva.es).",
      "OK: empadronamiento — criterio habitual baremación centros públicos; certificado vigente en solicitud ([NIE/padrón](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        ")).",
      "UNCHECKED: calendario admisión **2027-2028** — no publicado en fetch; no inventar fechas mayo 2027.",
      "UNCHECKED: tasas British School Valencia / American School — matrícula anual; consultar web colegio, no cifras de blogs.",
      "Soft: vacunación calendario CV — san.gva.es / centro salud; no sustituye pediatra privado internacional.",
    ],
  },
  {
    heading: "Официально: colegios públicos y admisión G236",
    section_kind: "official",
    paragraphs: [
      "Educación Infantil (3–6), Primaria, ESO y Bachillerato en centros **sostenidos con fondos públicos** de la Comunitat Valenciana se rigen por el procedimiento **G236** ([gva.es procedimiento](https://www.gva.es/es/inicio/procedimientos?_es_gva_es_siac_portlet_SiacDetalleProcedimientosNuevoGVA_codigo=G236)). La admisión es **telefática** en fases: ordinaria (primavera) y extraordinaria (verano) cuando quedan plazas.",
      "Si llega a Valencia en **septiembre 2026** con curso 2026-2027 ya iniciado, la vía oficial no es «elijo cualquier colegio mañana», sino **consultar vacantes** publicadas en [admisión alumnado CEICE](https://ceice.gva.es/es/web/admision-alumnado), contactar centros con plazas libres o Dirección Territorial de Educación Valencia para orientación. La fase extraordinaria de julio 2026 ya transcurrió; plazas residuales y lista de espera dependen de bajas — proceso **continuo**, no calendario único en septiembre.",
      "Documentación típica en solicitud: DNI/NIE/pasaporte del alumno y representante, **certificado de empadronamiento**, libro de familia o partida de nacimiento, informe académico del centro anterior (traducción si procede). Baremación usa criterios legales: proximidad domicilio, hermanos en centro, renta (**Decreto 48/2024** marco CV — detalle criterios en instrucciones CEICE, no resumimos aquí como ley).",
    ],
    bullets: [
      "[Portal admisión](https://ceice.gva.es/es/web/admision-alumnado) — calendarios, vacantes, instrucciones.",
      "Adminova / aplicaciones GVA — acceso telemático solicitudes (según fase activa).",
      "Educación Infantil 3 años — plaza no garantizada día 1; demanda alta en barrios céntricos.",
      "Centro de educación especial — circuito aparte si procede (G236 anexo).",
      "Comedor y transporte escolar — solicitud separada en muchos centros (**soft** plazos).",
    ],
  },
  {
    heading: "Официально: escuelas internacionales y privadas",
    section_kind: "official",
    paragraphs: [
      "Los **colegios privados e internacionales** (British, American, Lycée, etc.) **no usan G236** como única puerta: admisiones propias, listas de espera, pruebas de nivel y matrícula anual. En Valencia provincia ejemplos conocidos incluyen **British School of Valencia**, **American School of Valencia** y otros centros privados bilingües — consulte web oficial de cada colegio para plazas 2026-2027.",
      "No publicamos cifras de matrícula: **UNCHECKED** en esta sesión. Presupuestos orientativos de foros expat (5–15 k€/año) varían por nivel e inclusión comedor/bus — **simulación obligatoria** con admissions office.",
      "Empadronamiento y contrato de alquiler siguen siendo relevantes para logística (transporte, [barrio](/notes/" +
        VALENCIA_RAJONY_SLUG +
        ")) aunque el centro privado no aplique baremación pública.",
    ],
    bullets: [
      "British School of Valencia — admisiones vía web colegio (**UNCHECKED** plazas sept 2026).",
      "American School of Valencia — circuito propio; visita campus habitual.",
      "Curriculum UK/US vs LOE española — impacto en transición posterior universidad ES/UK.",
      "Certificados académicos extranjeros — homologación/ convalidación si cambio a público (**soft**).",
      "Becas internas limitadas — no asumir beca por llegada tardía curso.",
    ],
  },
  {
    heading: "Практика: mes 1–3 — guardería, vacunas y centro de salud",
    section_kind: "practice",
    paragraphs: [
      "Familias con niños pequeños en mes 1–3 suelen cerrar **empadronamiento**, alta **SIP** y pediatra en centro de salud — ver [медицина Valencia](/notes/" +
        MEDITSINA_VALENCIA_SLUG +
        "). Calendario **vacunación** infantil en CV sigue programas salud pública; cita pediatra CS con tarjeta SIP activa.",
      "Guardería privada (0–3) mientras espera plaza Infantil pública es práctica común: **UNCHECKED** precios medios Valencia 2026 — contrato mensual + matrícula; no confundir guardería privada con escuela Infantil pública 3–6.",
      "Si el niño llega sin historial vacunal ES, lleve calendario traducido; pediatra puede proponer pauta adaptada (**soft**, caso a caso).",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenciarusia", "valenforum"],
        period: "2025–2026",
        claim:
          "familias cerraron SIP niños en semana 2–4 tras padrón; vacunas programadas en CS, no urgencias",
        forReader:
          "no espere TIE plástico si ya tiene NIE + SS para alta SIP pediátrica",
      }),
      "Empadronamiento familia entera — mejora baremación colegio público futuro.",
      "Documentos colegio — apostille partida nacimiento si solicita internacional.",
      "Idioma valenciano/castellano — apoyo público PISE en muchos centros (**soft**).",
      "Autobús escolar — plazas limitadas; ver distancia en [районы](/notes/" + VALENCIA_RAJONY_SLUG + ").",
    ],
  },
  {
    heading: "Si no tiene hijos: por qué este guide importa",
    section_kind: "practice",
    paragraphs: [
      "Si llega **sin hijos**, este slot del satellite no es ruido: muchos expats posponen Valencia por «escuelas nebulosas» y luego descubren que amigos buscan colegio en julio sin haber leído G236. Entender que **septiembre ≠ admisión ordinaria** evita promesas falsas a la familia que viene en verano.",
      "También le afecta indirectamente: barrios con colegios internacionales (La Cañada, urbanizaciones norte) tienen **tráfico escolar**, ORA mañana y alquileres familiares — útil al elegir [аренду](/notes/arenda-valencia-idealista-2026). Si planea hijos en 2–3 años, empadronamiento estable hoy simplifica baremación mañana.",
    ],
    bullets: [
      "Comparta enlace CEICE con familias del chat — reduce preguntas repetidas.",
      "Sin hijos: priorice [первые 30 дней](/notes/" + PERVYE_30_SLUG + ") y trámites adulto.",
      "Futuro plan familia — barrio con Infantil público vs internacional cambia presupuesto vivienda.",
    ],
  },
  {
    heading: "Где portal y expectativas expat расходятся",
    section_kind: "gap",
    paragraphs: [
      "Oficialmente hay vacantes y fases extraordinarias. En la práctica septiembre 2026 llega **después** del calendario extraordinario de julio — opciones reales son plazas sueltas, no «primera opción centro top».",
      "Oficialmente baremación es objetiva. En la práctica domicilio empadronado en calle X vs contrato temporal sin padrón puede cambiar puntuación radicalmente.",
    ],
    bullets: [
      "Официально: solicitud telemática G236. На практике: sin certificado empadronamiento reciente — solicitud incompleta.",
      "Официально: derecho educación. На práктике: centro saturado → lista espera meses.",
      "«British School siempre hay plaza» — **UNCHECKED**; listas de espera habituales.",
      "Soft: «solo inglés en público» — mayoría centros públicos en castellano/valenciano.",
    ],
  },
  {
    heading: "Типичные ошибки семей-релокантов",
    section_kind: "practice",
    paragraphs: [
      "Errores repetidos: buscar colegio internacional en agosto sin lista de espera, olvidar padrón antes de baremación, o asumir vacunas turísticas sustituyen calendario CV.",
    ],
    bullets: [
      "Llegar 1 septiembre sin vacantes consultadas — niño en casa semanas.",
      "Contrato alquiler temporal sin empadronamiento — pierde puntos admisión.",
      "Traducción jurada tardía de expediente académico — retrasa matrícula.",
      "Cancelar seguro privado infantil antes de SIP activo — gaps cobertura.",
      "Elegir barrio lejos colegio elegido — comedor/bus no disponible.",
      "Mezclar guardería 0–3 con Infantil 3–6 — trámites distintos.",
    ],
  },
  {
    heading: "К 4–6 месяцу: escuela, pediatra y estabilidad",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу** семья либо уже в colegio (público o privado), либо en lista de espera con plan B (guardería, homeschooling regulado **UNCHECKED** requisitos). Debe estar claro: SIP pediátrico activo, vacunas al día según CS, y empadronamiento coincidente con domicilio real.",
      "Si sigue en alquiler temporal, renueve o cambie a contrato que permita padrón estable — renovaciones admisión 2027-2028 usarán domicilio **UNCHECKED** fechas calendario 2027. Preparar documentos académicos traducidos **antes** de mayo siguiente.",
      "Internacional: revisar contrato matrícula anual — penalizaciones baja mid-year (**soft**). Público: comunicar cambio domicilio a centro si mudanza en mes 4.",
    ],
    bullets: [
      "Revisión pediatra 4–6 mes — calendario vacunas segundo curso en ES.",
      "Actividades extraescolares — plazas en septiembre; mid-year limitadas.",
      "Comedor escolar — lista espera si no solicitó en matrícula.",
      "Wizard familia — [Emigro wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=shkoly-valencia&utm_content=shkoly-semya-valencia-2026).",
      "Assist si visado familiar depende de empadronamiento colegio — [Route Check](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=shkoly-valencia&utm_content=shkoly-semya-valencia-2026).",
    ],
  },
];

const keyTakeaways = [
  "Официально: admisión pública CV — procedimiento G236; curso 2026-2027 ordinaria cerrada; sept 2026 → vacantes/lista espera vía CEICE.",
  formatPracticeTakeaway({
    channels: ["valenciarusia", "valenforum"],
    period: "2025–2026",
    claim:
      "familias con padrón temprano obtuvieron plaza extraordinaria julio o lista espera septiembre",
    forReader:
      "empadronamiento antes de buscar colegio; internacional — contactar admissions sin esperar G236",
  }),
  "Официально: vacunación infantil — centro de salud con SIP; calendario salud pública CV.",
  "Расхождение: «llego en septiembre y elijo colegio» vs calendario julio agotado; tasas internacionales UNCHECKED.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как устроить ребёнка в школу в Valencia?",
    a: "По правилам G236 — solicitud telemática en fase activa con empadronamiento y documentos alumno. На практике sept 2026: consultar vacantes CEICE, centros con plazas o internacional propio; ordinaria 2026-2027 ya pasó.",
  },
  {
    q: "Нужен ли empadronamiento для школы?",
    a: "По правилам — criterio baremación y acreditación domicilio en público. На практике sin padrón estable muchas solicitudes quedan incompletas o pierden puntos.",
  },
  {
    q: "Чем отличается British/American School?",
    a: "По правилам — centros privados fuera G236; admisión directa. На практике curriculum anglosajón, matrícula anual (**UNCHECKED** cifras); plazas limitadas.",
  },
  {
    q: "Где делать vacunas ребёнку?",
    a: "По правилам — pediatra centro de salud / programas salud pública CV con SIP. На практике cita CS tras [alta SIP](/notes/" +
      MEDITSINA_VALENCIA_SLUG +
      "); urgencias solo emergencia.",
  },
  {
    q: "Нет детей — нужен ли этот guide?",
    a: "По правилам — no trámite. На практике útil para elegir barrio, ayudar familias del chat y planificar futuro empadronamiento.",
  },
];

export const SHKOLY_SEMYA_GUIDE = {
  slug: SHKOLY_SEMYA_SLUG,
  category: "Семья и образование",
  content_kind: "guide" as ContentKind,
  title: "Школы и семья в Valencia 2026: público, internacional y vacunas",
  excerpt:
    "Admisión G236, fase extraordinaria 2026-2027, colegios internacionales sin cifras inventadas, empadronamiento, SIP pediátrico y vacunación mes 1–3 — плюс честный блок для релокантов без детей.",
  seo_title: "Школы Valencia 2026 — admisión и семья",
  seo_description:
    "Школы Valencia 2026: admisión G236, vacantes septiembre, internacional, padrón y vacunas SIP. Семьи RU/BY — без fechas 2027-2028 inventadas; CEICE oficial.",
  quick_answer:
    "Colegio público CV — procedimiento G236 en ceice.gva.es; curso 2026-2027 ordinaria cerrada, llegada sept 2026 implica vacantes/lista espera o colegio privado/internacional (British School, American School — tasas UNCHECKED). Empadronamiento y certificado vigente son clave en baremación. Mes 1–3: alta SIP niños y vacunas en centro de salud. Sin hijos — guide útil para barrios y familias del chat.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "CEICE — Admisión alumnado", url: "https://ceice.gva.es/es/web/admision-alumnado" },
    { title: "CEICE — Fase extraordinaria 2026-2027", url: "https://ceice.gva.es/es/web/admision-alumnado/fase-extraordinaria" },
    { title: "GVA — Procedimiento G236 admisión 2026-2027", url: "https://www.gva.es/es/inicio/procedimientos?_es_gva_es_siac_portlet_SiacDetalleProcedimientosNuevoGVA_codigo=G236" },
    { title: "Sanidad CV — Tarjeta SIP", url: "https://www.san.gva.es/es/web/tarjeta-sanitaria" },
    { title: "Educación GVA — portal", url: "https://ceice.gva.es/es/inicio" },
  ],
  topic_tags: ["schools", "family", "valencia", "education"],
  hashtags: buildNoteHashtags({
    topicTags: ["schools", "family", "valencia", "education"],
    contentKind: "guide",
    extra: ["admision", "empadronamiento", "sip", "internacional"],
  }),
  source_channel: "valenciarusia+valenforum+spain_granitsa",
  source_label: "editorial:shkoly-semya-valencia-gold-2026",
  pillar_guide_slug: "vnj-ispaniya-2026",
};

export default SHKOLY_SEMYA_GUIDE;
