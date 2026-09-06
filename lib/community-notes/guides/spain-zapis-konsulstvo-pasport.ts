/**
 * Hand-curated Spain satellite guide — consulado RF desde Valencia.
 * Barcelona GKS jurisdiction; queue, passport, apostille practice.
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

export const ZAPIS_KONSULSTVO_ES_SLUG = "zapis-konsulstvo-ispanija-pasport-2026";

const GLOSSARY_INTRO =
  "GKS Barcelona, kdmid queue и почётное консульство — три разных адреса в одном чате. Разберём до истечения pasaporte на фоне TIE en trámite.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(ZAPIS_KONSULSTVO_ES_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор для граждан РФ в Valencia. **OK** = kdmid / MID; **soft** = поле 2025–2026; **fixed** = смягчено. No consular advice — cita y documentos en sitio oficial al día de reserva.",
    ],
    bullets: [
      "OK: Valencia — demarcación **GKS Barcelona** (Aragón, Baleares, Cataluña, Navarra, Murcia, Valencia, Almería) — [kdmid.ru consulados España](https://www.kdmid.ru/docs/spain/russian-consular-offices/).",
      "OK: GKS Barcelona — Av. Pearson 34, 08034; horario lun–vie 10:00–13:30 (kdmid).",
      "OK: cola electrónica — **barcelona.kdmid.ru/queue/** (también queue-remote según instrucciones portal).",
      "Soft: Consulado honorario Valencia Av. Aragón 4-bis — web consulrusocv.com menciona pasaportes; **GKS oficial** para biometría заграна — kdmid lista solo Barcelona GKS para distrito; tratar honorario como **UNCHECKED** para pasaporte RF hasta confirmar en barcelona.mid.ru.",
      "Fixed: no inventar calle consulado — Pearson 34 OK kdmid; honorario Aragón 4-bis soft web tercero.",
      "UNCHECKED: apostilla documentos RU desde ES — límites consulado; docs ES vía Ministerio Justicia.",
      "UNCHECKED: barcelona.mid.ru/consul-district — fetch rejected; distrito tomado de kdmid.",
    ],
  },
  {
    heading: "Официально: demarcación y dónde tramitar pasaporte RF",
    section_kind: "official",
    paragraphs: [
      "Ciudadanos RF en Comunidad Valenciana dependen del **Consulado General de la Federación de Rusia en Barcelona** (GKS), no del Embajada Madrid salvo residencia en otras provincias ([kdmid.ru — oficinas España](https://www.kdmid.ru/docs/spain/russian-consular-offices/)).",
      "Pasaporte biométrico 10 años — formulario **zp.midpass.ru**; pasaporte 5 años — **passportzu.kdmid.ru** ( práctica consular estándar; confirmar en instrucción cita). Podaча **personal**; recogida — segundo viaje.",
      "Empadronamiento en ES define demarcación consular RF junto con reglas MID. Valencia city → viaje Barcelona (~350 km) o tren AVE ~3 h — planificar día completo.",
      "Poderes notariales, certificados y algunas legalizaciones — pueden tramitarse en GKS con cita; apostilla documentos **españoles** — Ministerio Justicia / MAEC; documentos **rusos** — apostilla antes de salir o vía consulado según tipo (**UNCHECKED** detalle límites desde ES).",
    ],
    bullets: [
      "GKS Barcelona — Pearson 34; tel. +34 93 280 54 32 (kdmid).",
      "Madrid embassy — resto provincias no Barcelona district.",
      "Cita — barcelona.kdmid.ru queue.",
      "Biometría 10 a — zp.midpass.ru.",
      "5 años — passportzu.kdmid.ru.",
    ],
  },
  {
    heading: "Запись из Valencia: cola, confirmación, tiempos",
    section_kind: "practice",
    paragraphs: [
      "Sistema cola **barcelona.kdmid.ru** — elegir servicio «zagranpasport» / biometría según portal. Monitoreo diario: huecos aparecen irregularmente; @valenciarusia describe semanas de espera para primer slot.",
      "Tras reservar — correos confirmación; revisar spam. Algunos participantes reportan fallos email 2025–2026 — captura pantalla «estado cita» en kdmid.",
      "No pagar terceros «cita sin cola» — riesgo estafa y rechazo en puerta GKS. Solo alertas legales que avisan hueco — usted reserva en kdmid.",
      "Viaje Valencia–Barcelona: salida temprano, margen 30 min antes hora cita; documentos originales + copias color.",
    ],
    bullets: [
      "Monitor barcelona.kdmid.ru 1–2 sesiones/día.",
      "Confirmación email — guardar PDF/screenshot.",
      "Dos viajes mínimo — podaча + recogida.",
      "No scalpers cola — fixed policy Emigro.",
      formatPracticeBullet({
        channels: ["valenciarusia", "spain_granitsa"],
        period: "2025–2026",
        claim:
          "slot primera cita GKS Barcelona desde Valencia suele tardar 2–6 semanas de monitorización — ciclo completo pasaporte 2–4 meses",
        forReader:
          "empiece cola 6–9 meses antes expiry si TIE también en trámite",
      }),
    ],
  },
  {
    heading: "Pasaporte, poderes y apostilla a mes 4–6",
    section_kind: "practice",
    paragraphs: [
      "Mes 4–6 en Valencia coincide con TIE en trámite, viajes «a Rusia» o caducidad pasaporte. Pasaporte vencido con TIE resguardo — viajar fuera Schengen complicado; renovación RF no espera «hasta TIE plástico».",
      "Poder notarial para representar propiedad/banco en RF — cita GKS separada; traducción y legalización según uso. Certificados civiles RF — rutas consulares limitadas (**UNCHECKED** plazos desde Valencia).",
      "Documentos españoles (empadronamiento, contrato) para consulado RF — copia + traducción jurada ruso si exigen.",
      "Apostilla ES — sede electrónica Justicia; planificar si documento necesario en RF.",
    ],
    bullets: [
      "Expiry pasaporte <12 meses — iniciar cola ya.",
      "TIE resguardo + pasaporte viejo — aerolínea puede negar boarding.",
      "Poder — cita distinta; notario ES no sustituye GKS.",
      "Apostilla RU docs — UNCHECKED desde ES.",
      "Menores — ambos padres o consentimiento notarial.",
    ],
  },
  {
    heading: "Где sede и práctica divergen",
    section_kind: "gap",
    paragraphs: [
      "Web honorario Valencia promete pasaportes con cita telefónica; kdmid oficial centraliza GKS Barcelona para distrito. No asuma honorario sustituye biometría GKS sin confirmar barcelona.mid.ru.",
      "«Cita en días» en foros vs realidad 2–6 semanas slot — normal pico post-verano.",
      "Email confirmación — a veces no llega; estado solo en kdmid.",
    ],
    bullets: [
      "Официально: GKS Pearson 34 pasaportes distrito. Soft honorario Aragón — verificar antes desplazarse solo allí.",
      "Официально: horario 10:00–13:30. На práctica: llegar antes — control acceso.",
      "«Comprar turno» — estafa frecuente @spain_granitsa.",
      "Procesamiento 10 años bio — soft hasta 3 meses; no viajar sin pasaporte válido.",
    ],
  },
  {
    heading: "Documentos antes de la cita GKS: paquete completo",
    section_kind: "official",
    paragraphs: [
      "Consulado no acepta expediente parcial — slot perdido si falta copia pasaporte interno RU (práctica histórica consular Moscú/Barcelona) o comprobante empadronamiento ES. Prepare originals + copias color antes reservar cola.",
      "Biometría 10 años: pasaporte actual (aunque caducado), pasaporte interno RU si disponible, formulario zp.midpass.ru impreso con código barras, fotos según instrucción portal, comprobante morada Valencia (certificado empadronamiento PA.CE.10).",
      "Menores: acta nacimiento con apostilla (**UNCHECKED** plazo desde ES), ambos progenitores en cita o consentimiento notarial. Cambio apellidos por matrimonio — certificado adicional.",
      "Tasa consular — confirmar importe en barcelona.mid.ru el día cita; efectivo o instrucción portal (**soft** — verificar, no inventar €).",
    ],
    bullets: [
      "zp.midpass.ru — revisar datos antes imprimir; error = nueva cola.",
      "Empadronamiento Valencia — PA.CE.10 reciente para paquete.",
      "Pasaporte interno RU — copia completa según práctica consular.",
      "Seguro viaje no sustituye documentos pasaporte.",
      "Fotos — especificaciones portal midpass; no improvisar tamaño.",
    ],
  },
  {
    heading: "Logística Valencia–Barcelona: tren, parking, día doble",
    section_kind: "practice",
    paragraphs: [
      "AVE Valencia Joaquín Sorolla – Barcelona Sants ~3 h; reservar billete con margen 90 min antes cita 10:00 GKS. Metro L3/L5 + taxi a Av. Pearson 34 — zona Pedralbes; parking limitado.",
      "Muchos combinan cita pasaporte con trámite ES — no superponga mismo día [TIE huellas](/notes/" + TIE_CITA_SLUG + ") en Valencia y GKS Barcelona sin buffer.",
      "Recogida pasaporte — segundo viaje; horario entrega similar mañana (kdmid 10:00–13:30). Menores deben acudir ambas veces salvo excepción consular escrita.",
    ],
    bullets: [
      "Salida AVE 07:00–07:30 para cita 10:00 Barcelona.",
      "Carpeta física + USB backup PDF formularios.",
      "Hotel Barcelona solo si recogida al día siguiente.",
      "EES/Schengen — pasaporte RF solo filas manuales aeropuerto.",
      formatPracticeBullet({
        channels: ["valenciarusia"],
        period: "2025–2026",
        claim:
          "relokanty combinan fin de semana Barcelona con monitor cola entre semana online desde Valencia",
        forReader: "no compre billete AVE hasta tener cita confirmada en kdmid",
      }),
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    paragraphs: [
      "Errores: esperar último mes expiry, confundir consulado ES (visado) con GKS RF, olvidar pasaporte interno RU copia, perder cita TIE por viaje Barcelona mismo día, confiar en web honorario sin confirmar GKS.",
    ],
    bullets: [
      "Reservar pasaporte «después TIE» — expiry cruza trámite.",
      "Ir a Madrid embassy viviendo Valencia — demarcación incorrecta.",
      "Formulario midpass sin imprimir código barras — devolución.",
      "Paquete incompleto — no aceptan parcial.",
      "Confundir exteriores.gob.es visado ES con mid.ru pasaporte RF.",
      "Un solo viaje planeado — recogida requiere segundo.",
      "Pagar «gestor cola» — riesgo datos.",
    ],
  },
  {
    heading: "К 4–6 месяцу: qué no puede esperar a fin de año",
    section_kind: "practice",
    paragraphs: [
      "A mes 4–6: si pasaporte expira en <6 meses, **inicie cola GKS ahora** — ciclo completo puede superar validez TIE/resguardo para viajes. Poderes bancarios RF, venta propiedad, herencia — no posponer «a diciembre» si plazo legal en RF corre.",
      "Renovación pasaporte menor — ambos progenitores; planificar vacaciones escolares Valencia con cola llena.",
      "Paralelo [TIE ICPPlus](/notes/" + TIE_CITA_SLUG + ") — no cancele cita huellas por viaje Barcelona sin reprogramar.",
    ],
    bullets: [
      "Pasaporte — cola 6–9 meses antes expiry.",
      "Poder representación — cita separada mes 4–6 si operación RF.",
      "Apostilla doc ES — semanas Ministerio Justicia.",
      "TIE huellas — prioridad si visado plazo corto.",
      "Certificado registro civil RF — UNCHECKED plazo consular.",
    ],
  },
  {
    heading: "Связанные шаги",
    section_kind: "practice",
    paragraphs: [
      "Consulado RF es paralelo a trámites ES — no sustituye NIE/TIE. Orden migratorio: [/ru/wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=consulado-valencia&utm_content=zapis-konsulstvo-ispanija-pasport-2026).",
    ],
    bullets: [
      "[TIE cita Valencia](/notes/" + TIE_CITA_SLUG + ") — coordinar fechas.",
      "[Первые 30 дней](/notes/pervye-30-dnej-v-ispanii-satelit-2026) — empadronamiento para paquete consular.",
      "[DNV consulado ES](/notes/dnv-uge-konsulstvo-2026) — visado España ≠ pasaporte RF.",
      "Pillar: [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026).",
    ],
  },
];

const keyTakeaways = [
  "Официально: Valencia → GKS Barcelona (Pearson 34); cola barcelona.kdmid.ru; horario lun–vie 10:00–13:30 (kdmid.ru).",
  formatPracticeTakeaway({
    channels: ["valenciarusia", "spain_granitsa"],
    period: "2025–2026",
    claim:
      "desde Valencia el slot GKS suele requerir semanas de monitorización y dos viajes a Barcelona — podaча y recogida",
    forReader:
      "reserve cola 6–9 meses antes del expiry; no espere TIE plástico",
  }),
  "Официально: biometría 10 años zp.midpass.ru; 5 años passportzu.kdmid.ru — confirmar en cita.",
  "Расхождение: consulado honorario Av. Aragón 4-bis (web tercero) vs GKS kdmid — soft/UNCHECKED pasaportes; apostilla RU desde ES UNCHECKED.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Как записаться в консульство из Valencia на паспорт?",
    a: "По правилам — cola **barcelona.kdmid.ru** (GKS Barcelona, distrito Valencia). Formularios zp.midpass.ru / passportzu.kdmid.ru antes cita. На практике monitoreo diario 2–6 semanas hasta slot; viaje Barcelona personal.",
  },
  {
    q: "¿Puedo hacer pasaporte en consulado honorario Valencia?",
    a: "По правилам kdmid — pasaportes distrito vía **GKS Barcelona**. Web honorario Av. Aragón menciona pasaportes — **soft/UNCHECKED**; confirme en barcelona.mid.ru antes ir solo al honorario.",
  },
  {
    q: "Сколько ждать очередь и изготовление?",
    a: "По правилам — plazo recogida según tipo pasaporte en instrucción consular. На практике slot 2–6 semanas + hasta ~3 meses bio — planifique 2 viajes.",
  },
  {
    q: "Qué no puede esperar al mes 12?",
    a: "По правилам — pasaporte caducado limita viajes. На практике mes 4–6: renovación pasaporte, poderes RF, apostilla docs ES si operación en curso — cola GKS no acelera fin de año.",
  },
  {
    q: "Apostilla documentos rusos desde España?",
    a: "По правилам — depende tipo doc y vía consular. **UNCHECKED** en este guide — verifique GKS/Ministerio Justicia para su caso; muchos docs RU se apostillan antes de salir.",
  },
];

export const ZAPIS_KONSULSTVO_ES_GUIDE = {
  slug: ZAPIS_KONSULSTVO_ES_SLUG,
  category: "Консульство RF",
  content_kind: "guide" as ContentKind,
  title: "Запись в консульство RF из Valencia: паспорт 2026",
  excerpt:
    "GKS Barcelona, cola kdmid, biometría zp.midpass.ru y plazos desde Valencia — qué no posponer al mes 4–6 mientras TIE está en trámite.",
  seo_title: "Консульство паспорт Valencia 2026 — GKS Barcelona",
  seo_description:
    "Запись на загранпаспорт RF из Valencia: GKS Barcelona, barcelona.kdmid.ru, очередь 2–6 нед., два визита. Паспорт, доверенность, apostilla — mes 4–6.",
  quick_answer:
    "Жители Valencia входят в консульский округ **ГКС Barcelona** (Av. Pearson 34). Запись — **barcelona.kdmid.ru/queue/**; биопаспорт 10 лет — **zp.midpass.ru**, 5 лет — **passportzu.kdmid.ru**. Подача и выдача — лично, обычно **два** поездки (~3 ч на AVE). Слот часто ловят **2–6 недель** мониторинга; полный цикл — до **2–4 мес.** Начинайте за **6–9 мес.** до expiry, особенно если [TIE](/notes/tie-cita-extranjeria-valencia-2026) en trámite. Почётное консульство Av. Aragón 4-bis — **soft**; официальный канал заграна — GKS (kdmid).",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "kdmid.ru — consulados RF en España",
      url: "https://www.kdmid.ru/docs/spain/russian-consular-offices/",
    },
    {
      title: "Cola GKS Barcelona",
      url: "https://barcelona.kdmid.ru/queue/",
    },
    {
      title: "GKS Barcelona (web)",
      url: "https://barcelona.mid.ru/",
    },
    {
      title: "zp.midpass.ru — biometría 10 años",
      url: "https://zp.midpass.ru/",
    },
  ],
  topic_tags: ["consulado", "pasaporte", "valencia", "barcelona", "rf"],
  hashtags: buildNoteHashtags({
    topicTags: ["consulado", "pasaporte", "valencia"],
    contentKind: "guide",
    extra: ["kdmid", "zagran", "barcelona"],
  }),
  source_channel: "valenciarusia+spain_granitsa",
  source_label: "editorial:zapis-konsulstvo-gold-valencia-2026",
  pillar_guide_slug: "vnj-ispaniya-2026",
};

export default ZAPIS_KONSULSTVO_ES_GUIDE;
