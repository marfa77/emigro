/**
 * Hand-curated Spain satellite guide — transport in Valencia (metro, EMT, car).
 * Official Metrovalencia / EMT / DGT pages separated from field practice in chats.
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
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import { PERVYE_30_SLUG } from "@/lib/community-notes/guides/spain-pervye-30-dnej-checklist";
import { VALENCIA_RAJONY_SLUG } from "@/lib/community-notes/guides/spain-valencia-rajony";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const TRANSPORT_VALENCIA_SLUG = "transport-valencia-metro-emt-coche-2026";

const GLOSSARY_INTRO =
  "Слова из Metrovalencia, EMT и DGT — чтобы не перепутать SUMA 10 с bonobús, zona A с zona D Cercanías и «можно ездить по иностранным правам» с обязанностью canje после резиденции.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(TRANSPORT_VALENCIA_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Сверка черновика с metrovalencia.es, emtvalencia.es, aena.es и dgt.es на дату fetch. **OK** = официальная страница; **soft** = поле Valencia 2025–2026; **fixed** = смягчено; **UNCHECKED** = не подтверждено в этой сессии.",
    ],
    bullets: [
      "OK: Decreto ley 6/2026 prorroga reducción tarifaria hasta **31 diciembre 2026** — [Metrovalencia tarifas temporales](https://www.metrovalencia.es/es/nuestras-tarifas-temporales/).",
      "OK: SUMA 10 zona A/B/C con reducción 40% — **5,40 €** (10 viajes); AB/BC **7,50 €**; ABC **12,60 €**; no aplica en combinaciones con zona D Cercanías Renfe (tabla oficial).",
      "OK: Aeropuerto VLC — estación **Aeroport**, líneas **3 y 5** Metrovalencia; horarios y tarifas — [Aena](https://www.aena.es/es/valencia/como-llegar/metro.html).",
      "OK: EMT Bonobús — **5,10 €** bonificado hasta 31/12/2026 (tarifa base 8,50 €); título **separado** de SUMA/Metrovalencia — [EMT tarifas](https://www.emtvalencia.es/wp/tarifas-y-titulos/).",
      "OK: Multa viajar sin título válido en Metrovalencia — **100 €** regularización + billete (normas viaje, metrovalencia.es).",
      "Soft: ORA horarios/tarifas 2026 — сверяйте [sede.valencia.es](https://sede.valencia.es/) и apps Telpark/ElParking; infografías medios — secondary.",
      "UNCHECKED: точные plazos canje permiso RU/BY en Jefatura Valencia — список países convenio на sede.dgt.gob.es; срок «6 meses» после empadronamiento — soft, не универсальная norma DGT.",
      "Fixed: «SUMA покрывает автобус EMT» → **нет**; integración ATMV ≠ bonobús EMT без отдельной tarjeta.",
    ],
  },
  {
    heading: "Официально: Metrovalencia, zonas y aeropuerto",
    section_kind: "official",
    paragraphs: [
      "Metrovalencia — red de metro y tranvía de Ferrocarrils de la Generalitat Valenciana (FGV) en el área metropolitana. Para desplazamientos diarios en ciudad y periferia cercana la mayoría de expats viven en **combinaciones zonales A, B o C**; la **zona D** entra en juego con Cercanías Renfe y **no recibe** la reducción temporal en esas combinaciones según Decreto ley 6/2026.",
      "El título **SUMA 10** — diez viajes recargables por combinación zonal, válido en Metrovalencia y en la red integrada ATMV (consulte plano zonal en metrovalencia.es). Con la reducción vigente hasta 31/12/2026, un bloque de 10 viajes en **una zona A, B o C cuesta 5,40 €** (~0,54 €/viaje según comunicación Generalitat). Los títulos comprados en periodo bonificado pueden usarse hasta **31 enero 2027** (página oficial).",
      "Desde el **Aeropuerto de Valencia** la estación **Aeroport** (planta baja terminal regional) conecta con el centro por **línea 3** (Aeroport–Rafelbunyol) y **línea 5** (Aeroport–Marítim-Serrería). Aena publica horarios orientativos y enlace a consulta en tiempo real Metrovalencia; no sustituye validar su combinación zonal al comprar SUMA.",
    ],
    bullets: [
      "[Plano zonal ATMV](https://www.metrovalencia.es/es/plano-zonal/) — antes de elegir SUMA 10 ABC vs AB.",
      "Soporte Tarjeta SUMA — anónima cartón 1,10 € / plástico 2,20 € (tarifas temporales).",
      "Menores 10 años — gratis en metro/tram acompañados (máx. 2 por titular).",
      "TuiN / Mobilitat — títulos FGV con reducción 40% según tabla oficial.",
    ],
  },
  {
    heading: "Официально: EMT autobús y billete sencillo",
    section_kind: "official",
    paragraphs: [
      "La **EMT** (Empresa Municipal de Transportes) opera la red de autobuses urbanos de València ciudad. Es **operador distinto** de Metrovalencia: el mismo soporte SUMA no sustituye el **Bonobús EMT** salvo productos explícitamente integrados — en la práctica la mayoría de recién llegados llevan **dos títulos** los primeros meses.",
      "Según la página oficial de tarifas EMT, el **Bonobús** (10 viajes, transbordos ilimitados 1 hora entre buses EMT) cuesta **8,50 €** tarifa general y **5,10 €** con bonificación municipal/estatal hasta **31/12/2026**. Billete sencillo / EMTicket — **2,00 €**. La tarjeta recargable EMT tiene PVP **2 €** además del título.",
      "Recarga en estancos, quioscos, oficinas EMT y online en emtvalencia.es / app EMTValencia. Para barrios sin metro directo (partes de Benimaclet, Cabanyal, Patraix) el bus cierra el último tramo que el tranvía no alcanza.",
    ],
    bullets: [
      "EMT Jove — menores 30: **12,50 €/mes** bonificado (página tarifas).",
      "EMT Infantil — gratuito hasta 14 años.",
      "Billete sencillo — 2,00 €; caro vs Bonobús a largo plazo.",
      "Recarga en estancos, quioscos, emtvalencia.es / app EMTValencia.",
    ],
  },
  {
    heading: "Практика: первые 1–2 meses без машины",
    section_kind: "practice",
    paragraphs: [
      "Типичный русскоязычный релокант в Valencia первый месяц живёт в радиусе **metro L3/L5/L1** или EMT от [аренды](/notes/" +
        ARENDA_VALENCIA_SLUG +
        "). Машина не нужна для NIE, padrón, банка и TIE — см. [первые 30 дней](/notes/" +
        PERVYE_30_SLUG +
        ") и [NIE/padrón](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        ").",
      "Разумный старт: в день прилёта — billete sencillo o SUMA desde Aeroport; en la primera semana — Tarjeta SUMA + Bonobús EMT si vive donde el bus es imprescindible. Elija combinación zonal según [районы](/notes/" +
        VALENCIA_RAJONY_SLUG +
        "): Ruzafa/Eixample — zona A; Mislata/Paterna frecuente — AB o más.",
      "Valencia es plana y ciclista en el centro; Valenbisi (**soft**) complementa metro para trayectos <15 min. No confunda «puedo ir en coche de alquiler turístico» con aparcamiento ORA en Ciutat Vella — allí el coche estorba antes de ser útil.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenforum", "valenciarusia"],
        period: "2025–2026",
        claim:
          "familias en AB/BC viven con SUMA 10 + Bonobús; gasto transporte <30 €/mes/persona con bonificaciones",
        forReader:
          "antes de firmar alquiler lejos de metro, simule 2 semanas solo transporte público",
      }),
      "Aeropuerto → Xàtiva/Colón — L3/L5; transbordo a L1 hacia Universidad o Cabanyal según barrio.",
      "Cercanías Renfe — aparte de SUMA si usa zona D; billete Renfe o abono específico.",
      "Taxi/licencia VTC desde VLC — 20–35 € centro (**soft**); útil noche/maletas, no diario.",
      "Google Maps / Moovit — horarios reales; Metrovalencia app para incidencias.",
    ],
  },
  {
    heading: "Где portal y чат расходятся",
    section_kind: "gap",
    paragraphs: [
      "Oficialmente SUMA y Bonobús tienen precios bonificados hasta fin de 2026. En la práctica la bonificación EMT dependió de financiación municipal en 2026 — la web EMT muestra 5,10 € hasta 31/12/26, pero conviene verificar recarga en estanco si el precio difiere.",
      "Oficialmente puede viajar en metro con título válido. En la práctica validación fallida (soporte caducado, zona incorrecta) — multa 100 € en control FGV.",
    ],
    bullets: [
      "Официально: reducción 40% SUMA hasta 31/12/2026. На практике: títulos adquiridos usables hasta 31/01/2027 — no agote recargas sin plan.",
      "Официально: EMT y Metrovalencia — redes distintas. На практике: expats compran ambos títulos la semana 1 y olvidan recargar Bonobús.",
      "Soft: «gratis transporte Valencia 2026» — solo colectivos concretos (infantil, DANA municipios); no universal.",
      "Официально: Aeroport conectado L3/L5. На практике: obras/eventos cambian frecuencia — consulte app el día del vuelo.",
    ],
  },
  {
    heading: "Авто: аренда, покупка, import — вторая половина полугода",
    section_kind: "official",
    paragraphs: [
      "El coche en Valencia **no es el primer paso**. Tiene sentido evaluarlo cuando conoce barrio, ORA y si su empleo exige desplazamientos fuera de metro (Albufera, industria periferia, visitas clientes). **Alquiler turístico** semanas 1–8 — legal con contrato y seguro; **compra o import** — trámites DGT, posible IVA/impuesto matriculación e **ITV**.",
      "Permiso de conducir: permisos **UE/EEE** válidos permiten conducir en España mientras estén en vigor (DGT). Países **con convenio** — canje por permiso español cuando sea **residente**; lista de países y pruebas en [sede.dgt.gob.es — canje extranjeros](https://sede.dgt.gob.es/es/permisos-de-conducir/canjes-de-permisos/canjes-de-permisos-extranjeros/). Canje digital posible con Cl@ve/certificado; sin ello — cita en Jefatura de Tráfico (cita previa sede o 060).",
      "**ITV** — inspección técnica periódica obligatoria; primera matriculación importado suele exigir inspección previa en estación ITV. **Seguro** — obligatorio (responsabilidad civil); multas llegan a domicilio empadronado.",
    ],
    bullets: [
      "Compra coche usado — contrato, permiso circulación, ficha técnica, impuesto transmisiones.",
      "Importación — aduana/AEAT; **UNCHECKED** aranceles caso RU — gestoría especializada.",
      "Rent-a-car largo plazo — seguro y titular deben coincidir con uso habitual.",
      "Peajes AP-7 — consulte operador; Via-T ≠ ORA municipal.",
    ],
  },
  {
    heading: "ORA, multas y aparcamiento en calle",
    section_kind: "practice",
    paragraphs: [
      "El **ORA** (Ordenanza Reguladora de Aparcamiento) del Ayuntamiento divide la vía pública en **zona azul, naranja y verde**. No residentes suelen aparcar en azul/naranja con límite temporal y pago en parquímetro o apps **ElParking, Telpark, Easypark** (adjudicatarias habituales — **soft**).",
      "Según información municipal difundida en 2023–2024 (**soft**, verifique sede): zona azul laborables 9:00–14:00 y 16:00–20:00; tarifa centro ~1 €/h, máximo 2 h no residente. Zona verde — prioridad residentes con distintivo y tasa ([TR.AR.85 sede.valencia.es](https://sede.valencia.es/sede/registro/procedimiento/TR.AR.85)). Ciutat Vella — peatonalización progresiva; aparcar sin permiso residente es multa rápida.",
      "Multas DGT (velocidad, móvil) y ORA llegan por correo al domicilio fiscal/empadronamiento. Sin [padrón](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        ") actualizado — riesgo de no enterarse hasta embargo.",
    ],
    bullets: [
      "Distintivo residente ORA — requiere empadronamiento en calle afectada (sede electrónica).",
      "Garaje privado en contrato alquiler — compare precio vs ORA diaria si usa coche 5 días/semana.",
      "Motos — plazas ORA específicas; no ocupe plaza coche con moto.",
      "Denuncia aparcamiento — foto matrícula; pago app reduce sorpresas vs parquímetro monedas.",
      formatPracticeBullet({
        channels: ["valenforum"],
        period: "2025–2026",
        claim:
          "expats con coche de renting turístico meses 3–4 acumulan multas ORA y seguro insuficiente para uso habitual",
        forReader:
          "si el coche no está a su nombre y póliza, regularice antes del mes 4",
      }),
    ],
  },
  {
    heading: "Типичные ошибки релокантов",
    section_kind: "practice",
    paragraphs: [
      "Transporte en Valencia falla más por prisa que por «sistema imposible»: comprar SUMA zona equivocada, olvidar Bonobús, o traer coche antes de TIE/seguro/ITV.",
    ],
    bullets: [
      "Comprar SUMA AB viviendo solo en zona A — sobrepaga cada recarga.",
      "Asumir que SUMA vale en bus EMT — no; lleve Bonobús o sencillo.",
      "Alquilar coche turístico 6 meses sin ITV/seguro uso habitual — riesgo multa y siniestro no cubierto.",
      "No canjear permiso país sin convenio — conducir después de plazo legal (**soft**) — sanción DGT.",
      "Aparcar en verde sin distintivo — grúa y multa en horas reguladas.",
      "Ignorar caducidad soporte SUMA (3–5 años) — validación fallida en andén.",
      "Usar solo taxi desde aeropuerto todo el mes — presupuesto x10 vs SUMA.",
    ],
  },
  {
    heading: "К 4–6 месяцу: coche, seguro y multas",
    section_kind: "practice",
    paragraphs: [
      "К четвёртому–шестому месяцу многие понимают, нужен ли им автомобиль: если живёте в [Ruzafa/Cabanyal con metro](/notes/" +
        VALENCIA_RAJONY_SLUG +
        ") и работаете hybrid — машина часто остаётся «хотелкой». Если же всё ещё ездите на **turismo rent** или машине знакомого без оформления — именно сейчас приходят **multas ORA**, письма DGT и отказ страховщика при ДТП.",
      "Canje permiso y matriculación — trámites de **meses**, no de fin de semana. Gestoría para import/DGT tiene sentido si el coche ya está en España; no sustituye [IBAN y domicilio](/notes/bank-iban-nerezident-ispaniya-2026) para multas y póliza.",
      "Revise bonificaciones transporte público antes de comprar coche: SUMA 10 a 5,40 € sigue siendo competidor fuerte frente a ORA + gasolina + seguro para desplazamientos urbanos.",
    ],
    bullets: [
      "Si mantiene renting >120 días — compare coste total vs compra usado + seguro anual.",
      "ITV próxima en coche comprado — calendario en ficha técnica; olvidar ITV — multa fija.",
      "Actualice domicilio DGT y aseguradora tras mudanza — multas al antiguo padrón.",
      "Valide reducciones tarifarias 2027 en enero — canje títulos no consumidos hasta 31/03/2027 (metrovalencia.es).",
      "Route Check [Emigro Assist](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=transport-valencia&utm_content=transport-valencia-metro-emt-coche-2026) si multas impugnación o residencia afecta canje.",
    ],
  },
];

const keyTakeaways = [
  "Официально: SUMA 10 zona A/B/C — 5,40 € (10 viajes) con reducción hasta 31/12/2026; Aeroport — L3 y L5; Bonobús EMT — título aparte, 5,10 € bonificado.",
  formatPracticeTakeaway({
    channels: ["valenforum", "valenciarusia"],
    period: "2025–2026",
    claim:
      "primer mes sin coche es viable en Eixample/Cabanyal con SUMA + Bonobús; gasto <30 €/mes",
    forReader:
      "compre soporte SUMA en Colón o Xàtiva la semana 1; no alquile coche hasta conocer ORA",
  }),
  "Официально: canje permiso extranjero — sede.dgt.gob.es según país convenio; ITV y seguro obligatorios en coche propio.",
  "Расхождение: «un solo abono para todo» vs EMT y Metrovalencia separados; coche turístico mes 4 — multas ORA/seguro.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли жить в Valencia без машины первые месяцы?",
    a: "По правилам — sí: Metrovalencia + EMT cubren ciudad y aeropuerto (L3/L5). На практике familias en barrios bien servidos no compran coche hasta mes 4–6; periferia industrial puede requerir coche antes.",
  },
  {
    q: "SUMA 10 или Bonobús — что покупать?",
    a: "По правилам — SUMA ATMV para metro/tram/Cercanías según zona; Bonobús EMT solo autobús urbano. На практике la mayoría lleva ambos si usa bus y metro; precios bonificados hasta 31/12/2026 en webs oficiales.",
  },
  {
    q: "Как доехать от аэропорта VLC до центра?",
    a: "По правилам Aena — estación Aeroport, líneas 3 y 5 Metrovalencia. На практике compra SUMA o sencillo en máquina; taxi 20–35 € noche (**soft**).",
  },
  {
    q: "Нужен ли canje прав для резидента?",
    a: "По правилам DGT — permisos UE válidos conducen en ES; países con convenio deben canjear como residente (lista en sede.dgt). На практике plazos y pruebas varían; RU/BY — verificar convenio (**UNCHECKED** detalle pruebas).",
  },
  {
    q: "Что такое ORA и как не получить multa?",
    a: "По правилам Ayuntamiento — estacionamiento regulado en vía pública (azul/naranja/verde). На практике no residente paga app/parquímetro en horario regulado; Ciutat Vella — preferir garaje o sin coche.",
  },
];

export const TRANSPORT_VALENCIA_GUIDE = {
  slug: TRANSPORT_VALENCIA_SLUG,
  category: "Транспорт и быт",
  content_kind: "guide" as ContentKind,
  title: "Транспорт Valencia 2026: метро, EMT и авто без мифов",
  excerpt:
    "SUMA 10, Bonobús EMT, L3/L5 desde aeropuerto, zonas tarifarias y reducciones 2026 — первая половина без машины; DGT, ITV, ORA и multas — когда автомобиль имеет смысл к 4–6 месяцу.",
  seo_title: "Транспорт Valencia 2026 — метро, EMT, авто",
  seo_description:
    "Транспорт Valencia 2026: метро L3/L5, SUMA 10 ~5,40€, bonobús EMT отдельно. DGT, ITV, ORA — когда брать авто после полугода. Практика RU/BY без машины mes 1–2.",
  quick_answer:
    "Первые 1–2 meses в Valencia реально без машины: Aeroport conecta L3/L5; SUMA 10 en zona A/B/C cuesta 5,40€ (10 viajes) con reducción hasta 31/12/2026; EMT Bonobús — título aparte, 5,10€ bonificado. Elija zona en plano ATMV según barrio. Coche — segunda mitad del año: canje permiso DGT, seguro, ITV y ORA en calle; renting turístico largo acumula multas.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Metrovalencia — tarifas temporales", url: "https://www.metrovalencia.es/es/nuestras-tarifas-temporales/" },
    { title: "EMT Valencia — tarifas y títulos", url: "https://www.emtvalencia.es/wp/tarifas-y-titulos/" },
    { title: "Aena — metro aeropuerto Valencia", url: "https://www.aena.es/es/valencia/como-llegar/metro.html" },
    { title: "DGT — canje permisos extranjeros", url: "https://sede.dgt.gob.es/es/permisos-de-conducir/canjes-de-permisos/canjes-de-permisos-extranjeros/" },
    { title: "Ayuntamiento Valencia — ORA residente", url: "https://sede.valencia.es/sede/registro/procedimiento/TR.AR.85" },
    { title: "AEMET — clima Valencia (referencia desplazamientos)", url: "https://www.aemet.es/es/serviciosclimaticos/datosclimatologicos/valoresclimatologicos?l=8416" },
  ],
  topic_tags: ["transport", "valencia", "metro", "emt"],
  hashtags: buildNoteHashtags({
    topicTags: ["transport", "valencia", "metro", "emt"],
    contentKind: "guide",
    extra: ["suma", "ora", "dgt", "aeropuerto"],
  }),
  source_channel: "valenforum+valenciarusia+spain_granitsa",
  source_label: "editorial:transport-valencia-gold-2026",
  pillar_guide_slug: "vnj-ispaniya-2026",
};

export default TRANSPORT_VALENCIA_GUIDE;
