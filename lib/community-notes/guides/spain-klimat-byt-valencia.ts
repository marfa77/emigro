/**
 * Hand-curated Spain satellite guide — climate and daily life in Valencia (months 4–6).
 * AEMET / ayuntamiento sources separated from expat field practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { ARENDA_VALENCIA_SLUG } from "@/lib/community-notes/guides/spain-arenda-valencia-idealista";
import { MEDITSINA_VALENCIA_SLUG } from "@/lib/community-notes/guides/spain-meditsina-valencia-sip";
import { VALENCIA_RAJONY_SLUG } from "@/lib/community-notes/guides/spain-valencia-rajony";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const KLIMAT_BYT_VALENCIA_SLUG = "klimat-byt-valencia-4-6-mes-2026";

const GLOSSARY_INTRO =
  "Слова про clima mediterráneo, humedad en piso antiguo y ritmo valenciano — чтобы «мягкая зима» не означала отсутствие плесени в baño sin ventilación.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(KLIMAT_BYT_VALENCIA_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Clima y residuos — AEMET y ayuntamiento; práctica vivienda — soft chats. **OK** = fetch; **UNCHECKED** = no verificado.",
    ],
    bullets: [
      "OK: AEMET Valencia estación 8416 (1981-2010) — temperatura media anual **17,3 °C**, humedad relativa media **65%**, precipitación **475 mm/año** ([AEMET valores normales](https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=8416)).",
      "OK: inviernos suaves — enero TM ~16,4 °C / Tm ~7,1 °C; verano julio-agosto TM ~30+ °C (**tabla AEMET**).",
      "OK: recogida residuos Valencia — depósito resto **20:00 h hasta paso camión** en contenedores convencionales; selectiva sin límite horario salvo norma local ([ordenanza sede.valencia.es PDF 2026](https://sede.valencia.es/sede/descarga/doc/DOCUMENT_1_20260010184614)).",
      "OK: Ciutat Vella Nord — plataformas móviles residuos **19:00–23:00** ([valencia.es recogida móvil](https://www.valencia.es/es/-/recogida-movil-ciutat-vella)).",
      "OK: muebles voluminosos — solicitud **010** / 963 100 010 o app ([valencia.es recogida enseres](https://www.valencia.es/cas/vlcneta/inicio/-/content/recollida-gratuita-de-mobles-i-objectes-vells)).",
      "Soft: moho en pisos planta baja Ruzafa/Cabanyal — práctica expat, no dato AEMET.",
      "UNCHECKED: consumo eléctrico AC 3 meses verano piso 70 m² — depende orientación y aislamiento.",
    ],
  },
  {
    heading: "Официально: clima mediterráneo y humedad",
    section_kind: "official",
    paragraphs: [
      "Valencia tiene clima **mediterráneo**: inviernos relativamente suaves y veranos calurosos con humedad moderada-alta según AEMET (media anual 65%). No es Canarias: en enero necesita calefacción puntual en piso sin aislamiento, y en julio-agosto el calor se siente más por noche tropical si no hay AC.",
      "La **humedad** en pisos antiguos de **patrimonio** (Ciutat Vella, parte Cabanyal) se manifiesta en condensación en ventanas, olor en armarios y moho en baños poco ventilados — fenómeno físico amplificado cerca del mar y tras **gota fría** ollas de septiembre-octubre (AEMET efemérides — eventos puntuales).",
      "Orientación del piso (sur vs norte), doble acristalamiento y extracción mecánica en baño importan más que la media estadística. Al buscar [аренду](/notes/" +
        ARENDA_VALENCIA_SLUG +
        ") inspeccione manchas en techos y ventilación antes de firmar.",
    ],
    bullets: [
      "AEMET predicción diaria — app/web para alertas calor/viento.",
      "Gota fría — seguir avisos AEMET/municipio; no subestimar inundaciones urbanas puntuales.",
      "Insolación ~2.696 h/año (AEMET) — protección solar verano.",
      "Playa Malvarrosa — brisa; centro bloques densos retienen calor (**soft**).",
    ],
  },
  {
    heading: "Vivienda: calor, AC, moho — meses 1–6",
    section_kind: "practice",
    paragraphs: [
      "Mes 1–2: muchos expats abren ventanas y «sobreviven» sin AC; mes 3–4 (junio-agosto) el presupuesto eléctrico salta si instalan **split** portátil o encienden AC fijo. Contrato alquiler: confirme si **aire acondicionado** está incluido y mantenimiento a cargo de propietario.",
      "Moho: ventile baño post-ducha, use extractor, no seque ropa en habitación cerrada. Si mancha >30 cm, comunique arrendador — LAU reparaciones estructura/humedad por cuenta propietario en muchos casos (**soft**, caso concreto).",
      "Invierno mes 4–6 (noviembre-febrero): calefacción eléctrica cara; invertir en **ventanas estancas** a veces baja factura más que AC verano.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenforum", "valenciarusia"],
        period: "2025–2026",
        claim:
          "pisos planta baja sin ventilar desarrollaron moho en armarios mes 4–5; deshumidificador ayudó",
        forReader:
          "visite piso después de lluvia; pregunte goteras techo y filtraciones fachada",
      }),
      "Deshumidificador — 150–300 € compra (**soft**); consumo eléctrico contabilizar.",
      "Split AC — permiso comunidad si exterior en fachada protegida Ciutat Vella.",
      "Ventiladores techo — menos comunes que en US; techo alto Eixample retiene calor.",
      "Seguro hogar — cubrir daños agua; fotos estado entrada.",
    ],
  },
  {
    heading: "Ritmo semanal: tiendas, deporte, domingo",
    section_kind: "practice",
    paragraphs: [
      "Comercios: supermercados Mercadona/Consum/Carrefour suelen abrir **lunes-sábado** mañana-tarde; muchos cierran **domingo** tarde completa o abren solo mañana (**soft** horarios cadena). Mercados municipales (Central, Ruzafa) — mañanas laborables.",
      "Domingo tradicional: más tranquilo en calles residenciales; restaurantes turísticos Ciutat Vella abiertos. **Siesta** comercial menos rígida que estereotipo, pero 14:00–17:00 muchas tiendas pequeñas cierran.",
      "Deporte: paseo/mar en Malvarrosa, Turia jardín, gimnasios cadena; parques municipales abiertos. Heat midday verano — entrenar mañana temprano (AEMET temperaturas pico 14:00–18:00 **soft**).",
    ],
    bullets: [
      "Horario comercio — cartel puerta; Google Maps no siempre actualizado.",
      "Farmacia guardia domingo — rotativa; buscador colegio farmacéuticos.",
      "Correos — sábado mañana muchas oficinas; colas TIE no relacionadas.",
      "Piscina municipal — abono temporada (**UNCHECKED** precio 2026).",
      "Domingo — planifique compra grande sábado.",
    ],
  },
  {
    heading: "Fines de semana: Albufera y pueblos, no guía de fiestas",
    section_kind: "practice",
    paragraphs: [
      "A **4–6 meses** muchos expats quieren «conocer la Comunitat» sin convertirse en turistas de fallas. Escapadas sobrias: **Parque Natural Albufera** (El Palmar, paseo en barca — **soft** tarifas), pueblos costa sur (Cullera, Gandía tren Cercanías) o interior (Xàtiva en tren).",
      "No es guía de vino/fiesta: enfoque **logística** — SUMA/Cercanías, reserva restaurante domingo, clima ventoso lago. Fallas/Mercado central son cultura, pero su planificación anual no es requisito mes 4.",
      "Enlace [районы](/notes/" +
        VALENCIA_RAJONY_SLUG +
        ") — barrio base antes de explorar; mudarse lejos sin metro cambia fines de semana en tráfico ORA.",
    ],
    bullets: [
      "Renfe Cercanías C-1 sur — consulte horario día festivo.",
      "Albufera — mosquitos atardecer verano; repelente.",
      "Playa invierno — paseo sí; baño agua fría AEMET ~14 °C enero.",
      "Mercadillo Ruzafa domingo mañana — aglomeración parking.",
      "Evite sobrecargar primer fin de semana post-mudanza — descanso útil.",
    ],
  },
  {
    heading: "Basura, recogida y convivencia edificio",
    section_kind: "official",
    paragraphs: [
      "Según ordenanza municipal consultada en sede Valencia 2026: depósito en contenedores selectivos **sin límite horario** general; fracción **resto** solo **desde 20:00 h** hasta paso del camión. Incumplimiento — sanción municipal (**artículo ordenanza** en PDF oficial).",
      "Ciutat Vella Nord usa **plataformas móviles** 19:00–23:00 — consulte PDF ubicaciones ayuntamiento. Muebles — nunca en vía pública sin cita 010; multa abandono.",
      "Comunidad de propietarios: normas ruido, obras, contenedores en patio — actas en español; traducción clave si vive en edificio señorial.",
    ],
    bullets: [
      "010 Valencia — información municipal lunes-viernes 8:30–18:30 (**web oficial enseres**).",
      "Reciclaje orgánico — contenedor marrón según barrio implantación.",
      "Aceite usado — puntos limpios; no fregadero.",
      "Ruido nocturno — ordenanza convivencia; fiestas edificio avisar vecinos.",
    ],
  },
  {
    heading: "Где clima «suave» y piso real расходятся",
    section_kind: "gap",
    paragraphs: [
      "Oficialmente Valencia es invierno templado. En la práctica piso **norte**, **sin sol**, planta **baja** en calle húmeda — sensación «Pequeña Londres» en enero.",
      "Oficialmente humedad 65% media. En la práctica baño sin ventana — moho local 80%+ humedad relativa horas.",
    ],
    bullets: [
      "Официально: AEMET TM verano ~31 °C. На практике: último piso azotea +50 °C sin toldo (**soft**).",
      "«No necesito AC en Valencia» — revision mes 3 cuando llega ola calor.",
      "Domingo todo cerrado — planifique; no es «ciudad muerta», es ritmo local.",
      "Albufera «cerca» — 30–40 min coche/bus; no es parque urbano a pie.",
    ],
  },
  {
    heading: "Типичные ошибки быта mes 4–6",
    section_kind: "practice",
    paragraphs: [
      "Errores: ignorar moho hasta daño ropa, secar ropa en salón cerrado, no leer horario basura (multa vecinos), domingo sin compra previa, AC portátil ruidoso conflictos vecindad.",
    ],
    bullets: [
      "No ventilar tras gota fría — olor humedad permanente.",
      "Pintar sobre moho sin tratar — reaparece mes 5.",
      "Tirar muebles calle sin 010 — multa ayuntamiento.",
      "Entrenar mediodía agosto — golpe calor; AEMET avisos.",
      "Asumir farmacia 24h cualquier barrio — ver guardia.",
      "Reservar restaurante domingo noche sin booking — lleno.",
    ],
  },
  {
    heading: "К 4–6 месяцу: clima, salud y estabilidad",
    section_kind: "practice",
    paragraphs: [
      "К **4–6 месяцу** usted ya conoce si su piso «funciona» en verano e invierno: factura luz, armarios secos, rutina basura. Si moho persiste y arrendador no actúa — documente fotos, carta certificada (**soft** asesoría LAU).",
      "Salud: alergias polen primavera CV, piel seca con AC — [медицина](/notes/" +
        MEDITSINA_VALENCIA_SLUG +
        ") para médico de familia. Cambio armario estacional — humedad en trasteros comunitarios.",
      "Si planea quedarse años — invertir ventanas/AC negociado con propietario puede valer más que mudarse cada 11 meses temporal.",
    ],
    bullets: [
      "Revisión mes 5: ¿AC suficiente? ¿Deshumidificador necesario invierno?",
      "Seguro hogar — reclamación daños agua si filtración techo.",
      "Ritmo social estable — deporte fijo, mercado barrio, menos burnout expat.",
      "Escapada Albufera fin semana — desconexión sin gastar fiesta.",
      "Assist — solo si conflicto arrendador/humedad afecta residencia legal.",
    ],
  },
];

const keyTakeaways = [
  "Официально: AEMET Valencia — media 17,3 °C, humedad 65%, inviernos suaves y veranos calurosos; gota fría vigilancia AEMET.",
  formatPracticeTakeaway({
    channels: ["valenforum", "valenciarusia"],
    period: "2025–2026",
    claim:
      "moho y factura AC sorpresa mes 4 en pisos antiguos sin ventilación — deshumidificador y revisar contrato",
    forReader:
      "inspeccione humedad al alquilar; basura resto solo desde 20:00 según ayuntamiento",
  }),
  "Официально: recogida muebles vía 010; Ciutat Vella plataformas 19:00–23:00.",
  "На практике: domingo comercio limitado; fines de semana Albufera/pueblos con SUMA/Cercanías, no clubes.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Что всплывает в быту Valencia к 4–6 месяцу?",
    a: "По правилам climatológicos AEMET — calor verano e humedad moderada. На практике: moho en baños, factura AC, ritmo domingo cerrado, basura horario 20:00 resto, conflictos vecindad ruido.",
  },
  {
    q: "Нужен ли AC en Valencia?",
    a: "По правилам — no obligatorio legalmente. На практике: julio-agosto en pisos altos sin sombra AC casi estándar; planta baja norte a veces sobrevive ventilador.",
  },
  {
    q: "Когда выносить basura resto?",
    a: "По правилам ayuntamiento — depósito resto **desde 20:00 h** hasta paso camión; selectiva sin límite en contenedores normales. На практике Ciutat Vella móvil 19:00–23:00.",
  },
  {
    q: "Куда escapar fin de semana sin fiestas?",
    a: "По правилам — transporte público Renfe/SUMA a pueblos y Albufera. На практике: El Palmar, Xàtiva tren, playa invierno paseo; planifique domingo horarios.",
  },
  {
    q: "Cómo combatir moho?",
    a: "По правилам — ventilación y control humedad fuente. На практике: extractor baño, deshumidificador, comunicar arrendador filtraciones; no pintar encima.",
  },
];

export const KLIMAT_BYT_VALENCIA_GUIDE = {
  slug: KLIMAT_BYT_VALENCIA_SLUG,
  category: "Климат и быт",
  content_kind: "guide" as ContentKind,
  title: "Климат и быт Valencia: 4–6 месяцев — жара, плесень, ритм",
  excerpt:
    "AEMET mediterráneo, humedad en pisos antiguos, AC y moho, horarios comercio y domingo, recogida basura ayuntamiento, escapadas Albufera — что всплывает к полугоду, без guía de vino/fiestas.",
  seo_title: "Климат Valencia 2026 — быт 4–6 месяцев",
  seo_description:
    "Климат Valencia 2026: AEMET жара, влажность, плесень, AC, basura 20:00, ритм воскресений. Быт к 4–6 месяцу — официально и на практике. Albufera fines de semana.",
  quick_answer:
    "Valencia — clima mediterráneo (AEMET: media 17,3 °C, humedad 65%). A mes 4–6 aparecen factura AC verano, moho en baños mal ventilados de pisos antiguos, ritmo comercial con domingo limitado y basura resto desde 20:00 h según ayuntamiento. Fines de semana sobrios: Albufera, pueblos en tren. Inspeccione humedad al alquilar; enlace distritos y salud en guías Emigro.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "AEMET — valores normales Valencia", url: "https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=8416" },
    { title: "AEMET — datos climatológicos", url: "https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos" },
    { title: "Ayuntamiento Valencia — recogida móvil Ciutat Vella", url: "https://www.valencia.es/es/-/recogida-movil-ciutat-vella" },
    { title: "Ayuntamiento Valencia — recogida enseres 010", url: "https://www.valencia.es/cas/vlcneta/inicio/-/content/recollida-gratuita-de-mobles-i-objectes-vells" },
    { title: "Sede Valencia — ordenanza residuos PDF", url: "https://sede.valencia.es/sede/descarga/doc/DOCUMENT_1_20260010184614" },
  ],
  topic_tags: ["climate", "valencia", "daily-life", "housing"],
  hashtags: buildNoteHashtags({
    topicTags: ["climate", "valencia", "daily-life", "housing"],
    contentKind: "guide",
    extra: ["humedad", "moho", "aemet", "basura", "albufera"],
  }),
  source_channel: "valenforum+valenciarusia+spain_granitsa",
  source_label: "editorial:klimat-byt-valencia-gold-2026",
  pillar_guide_slug: "vnj-ispaniya-2026",
};

export default KLIMAT_BYT_VALENCIA_GUIDE;
