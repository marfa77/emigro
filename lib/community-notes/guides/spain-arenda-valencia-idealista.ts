/**
 * Long-term rent Valencia 2026 — Idealista, contrato, fianza GVA.
 * Voice: seasoned market advisor (literary nif-porto register).
 * Fact-check overlays in Nota Emigro; IVAMA → Generalitat/Hacienda GVA fixed.
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
import { NIE_EMPADRONAMIENTO_SLUG } from "@/lib/community-notes/guides/spain-nie-empadronamiento-poryadok";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const ARENDA_VALENCIA_SLUG = "arenda-valencia-idealista-2026";

const VALENCIA_DISTRICTS_SLUG = "valencia-rajony-arenda-shkoly-metro-2026";

const RENT_GLOSSARY_INTRO =
  "Слова из contrato de alquiler, переписки с inmobiliaria и квитанций comunidad — чтобы на просмотре в Ruzafa или Benimaclet понимать, о чём спор, а не кивать на каждое испанское слово.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(ARENDA_VALENCIA_SLUG)!, RENT_GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор спорных формулировок старого черновика и типичных мифов из чатов — без вырезания практики. Soft = ориентир рынка Valencia; fixed = смягчено под официальную рамку LAU и Generalitat Valenciana. Аудитория: RU/BY/UA/KZ с треком DNV, autónomo, trabajo por cuenta ajena или familia, приезжающие в Comunidad Valenciana через Valencia city.",
      "Старый tip ошибочно отсылал депозит fianza в «IVAMA» — устаревшее имя. С 2022 года процедура централизована в Hacienda GVA (Decreto 46/2022); inquilino платит arrendador, arrendador deposita en Generalitat. Если в переписке слышите «fianza en efectivo sin depósito» — это не «испанская практика», а красный флаг.",
    ],
    bullets: [
      "Fixed: «fianza депонируется в IVAMA» → **орган депозита в Comunitat Valenciana — Generalitat** (Conselleria de Hacienda / Tesorería), процедура [GVA 3023](https://www.gva.es/es/inicio/procedimientos?id_proc=3023): **modelo 816** telemático или **modelo 806** presencial в банке-коллабораторе. IVAMA — устаревшее имя; в глоссарии ниже термин оставлен как alias, но депозит идёт в Hacienda GVA.",
      "OK (LAU art. 36): **fianza legal** — **1 mes** renta для arrendamiento de **vivienda**; **2 meses** для uso distinto del de vivienda. Обязательна в metálico при celebración del contrato.",
      "Soft / practice: **garantía adicional** (aval bancario, meses extra, fiador) — договорная практика; для vivienda до 5 лет (7 если arrendador persona jurídica) LAU ограничивает garantía adicional **двумя mensualidades** сверх fianza legal.",
      "Fixed: для arrendamiento de **vivienda** расходы gestión inmobiliaria и formalización del contrato несёт **arrendador** (LAU art. 20 после Ley 12/2023). Требование «1 mes + IVA с inquilino» для vivienda — не рыночная норма, а основание запросить factura, отказаться и при необходимости подать reclamación. Для temporada/uso distinto сначала квалифицируйте contrato.",
      "Fixed: «обязательно проверить propietario в Registro de la Propiedad» → **Nota simple** полезна при сомнениях, но **не обязательный** шаг для каждого арендатора; достаточно contrato, DNI/NIE arrendador и comprobante depósito fianza. Не платите «наличными на руку» из‑за отсутствия nota simple.",
      "Soft: цены Idealista T2 Ruzafa €1100–1400, Benimaclet €850–1100 — полевые вилки 2025–2026, не статистика Generalitat; уточняйте на viewing.",
      "Fixed: padrón отражает **фактическое habitual residence** и не создаётся cláusula LAU. Название contrato «temporal» само по себе не запрещает empadronamiento; Ayuntamiento проверяет реальное проживание и документы на vivienda. Для extranjería отдельно нужен актуальный пакет конкретного trámite.",
      "OK: arrendador обязан depositar fianza **в течение mes siguiente** a la celebración del contrato (Ley 8/2004 CV art. 22); inquilino может запросить подтверждение depósito письменно в fianzastelematicas@gva.es и сохранить ответ.",
    ],
  },
  {
    heading: "Официально: LAU, contrato, fiador y garantías",
    section_kind: "official",
    paragraphs: [
      "Долгосрочная аренда жилья в Испании регулируется **Ley de Arrendamientos Urbanos (LAU, Ley 29/1994)**. Contrato de arrendamiento de vivienda — письменная форма защищает обе стороны: без неё сложнее доказать morada для empadronamiento, банка и extranjería. LAU задаёт минимальные сроки prórroga для vivienda habitual, правила обновления renta и обязательную **fianza en metálico** — не «добровольный жест», а элемент contrato.",
      "Fianza legal — garantía del cumplimiento de obligaciones arrendaticias. Дополнительные garantías — **aval bancario** (банковская поручительство), **fiador** (физический поручитель с доходом в ES), **depósito adicional** в виде лишних meses — LAU **разрешает pactar** в contrato, но для vivienda в типовых сроках суммарный потолok garantía adicional — **dos mensualidades** сверх fianza legal (art. 36.5). Всё, что agency просит сверх, — предмет переговоров и advogado, не «так принято у всех».",
      "Plazo del contrato: para vivienda LAU establece prórroga mínima anual tras el primer año en muchos escenarios — la duración pactada importa para TIE y empadronamiento. **Alquiler temporal** por temporada (<11 meses en la práctica de mercado) suele excluirse del régimen de vivienda habitual; clausula «temporal por estudios / obra / traslado» limita prórroga y a veces padrón. Si su visado D exige domicilio estable — no firmes temporal «porque es más fácil» sin plan de cambio a los 4–6 meses.",
      "Arrendador обязан вернуть fianza по окончании contrato, если нет daños ni deudas; если restitución задерживается más de un mes desde entrega de llaves, fianza devenga **interés legal** (LAU art. 36.4). Gastos de comunidad, IBI y reparaciones de conservación — por defecto muchos quedan en propietario salvo pacto expreso; clausula que carga todo al inquilino merece segunda lectura.",
    ],
    bullets: [
      "Contrato: identificación сторон (NIE/pasaporte, DNI arrendador), descripción del inmueble, renta, forma de pago, duración, gastos (comunidad, IBI, suministros), inventario.",
      "Fianza legal vivienda — **1 mensualidad de renta**; uso distinto — **2 mensualidades** (LAU art. 36.1).",
      "Garantía adicional — по pacto; для vivienda в contratos до 5/7 лет — не более **2 mensualidades** extra (LAU art. 36.5).",
      "Alquiler temporal / por temporada — другой régimen; cláusula «temporal 11 meses» влияет на prórroga, empadronamiento и TIE — читайте objeto del contrato.",
      "Официальный текст LAU: [BOE Ley 29/1994](https://www.boe.es/buscar/doc.php?id=BOE-A-1994-26003).",
    ],
  },
  {
    heading: "Официально: depósito fianza en Comunitat Valenciana",
    section_kind: "official",
    paragraphs: [
      "В Comunidad Valenciana arrendador **обязан depositar fianza legal a favor de la Generalitat** (Ley 8/2004 de la Vivienda CV; **Decreto 46/2022**). Depósito — обязанность **persona arrendadora**, не inquilino: вы переводите fianza на IBAN arrendador или платите по instrucciones contrato, а он вносит сумму в Hacienda GVA **dentro del mes siguiente** a la firma. Si no lo hace — inquilino puede solicitar comprobación (email fianzastelematicas@gva.es).",
      "Dos vías oficiales: **modelo 816** — depósito telemático (tarjeta o Bizum) en [atv.gva.es/tributos-modelos-fianzas](https://atv.gva.es/es/tributos-modelos-fianzas); **modelo 806** — presencial en entidad colaboradora (CaixaBank, Santander, Sabadell, Cajamar, Abanca, Ibercaja). Necesario: contrato PDF, referencia catastral del inmueble, email para justificantes.",
      "Devolución al fin del arrendamiento — trámite **arrendador** (no inquilino): modelo 816 → devolución solo telemática con certificado electrónico; procedimiento [GVA 2739](https://www.gva.es/es/inicio/procedimientos?id_proc=2739). Inquilino при salida exige restitución fianza legal + intereses si procede; si arrendador retiene sin causa — vía amistosa, burofax o asesoría.",
    ],
    bullets: [
      "Plazo depósito — **mes siguiente** a la celebración del contrato; fuera de plazo — recargo modelo 818/808 (Ley 8/2004 art. 22: 5%–20% según demora).",
      "Modelo 816 admite pasaporte del inquilino — útil para recién llegados sin NIE definitivo.",
      "Tras depósito telemático no hay que presentar papel en administración — documentación queda en el trámite.",
      "Inquilino puede verificar depósito: escrito + copia contrato + NIF a fianzastelematicas@gva.es (GVA 3023).",
      "Normativa local: [Ley 8/2004 CV](https://www.boe.es/eli/es-vc/l/2004/10/20/8/con), [Decreto 46/2022 DOGV](https://www.gva.es/downloads/publicados/PR/2022_3675.pdf).",
    ],
  },
  {
    heading: "Официально / на практике: кому и за что платить",
    section_kind: "official",
    paragraphs: [
      "По одному contrato деньги могут уходить разным получателям — renta arrendador, suministros компаниям, comunidad по действительному pacto. Для vivienda не платите agency за gestión/formalización: LAU art. 20 относит эти расходы на arrendador.",
      "Fianza legal — arrendador (он же обязан depositar en GVA). Для alquiler de vivienda расходы gestión agency и formalización договора по LAU art. 20 платит arrendador, даже если anuncio пытается переложить их на inquilino. Comunidad — по contrato и с указанием годовой суммы; suministros — после alta a nombre del inquilino en compañía eléctrica/agua.",
    ],
    bullets: [
      "Renta mensual — IBAN arrendador из contrato; concepto: dirección + mes.",
      "Fianza legal — arrendador; сохраните justificante transferencia и номер depósito GVA cuando lo reciba.",
      "Gestión inmobiliaria/formalización vivienda — за счёт arrendador (LAU art. 20); не переводите «комиссию жильца» без независимой проверки tipo contrato.",
      "Comunidad — administrador; не смешивайте с renta.",
      "Suministros — после contrato; algunos incluidos en renta — rare, verificar.",
    ],
  },
  {
    heading: "Стартовый контур: NIE, IBAN, пакет до Idealista",
    section_kind: "practice",
    paragraphs: [
      "Аренда в Valencia — первая сделка, которая одновременно бьёт по кошельку и документам. Agency вправе проверять identidad и solvencia, но не требовать испанскую страну IBAN как единственный допустимый вариант. Подготовьте NIE/resolución, подтверждение дохода и certificado de titularidad счёта SEPA.",
      "Связанные шаги: [NIE и empadronamiento](/notes/" +
        NIE_EMPADRONAMIENTO_SLUG +
        "), [Spanish IBAN](/notes/" +
        BANK_IBAN_SLUG +
        "), [районы Valencia — аренда, школы, metro](/notes/" +
        VALENCIA_DISTRICTS_SLUG +
        "). Если маршрут ВНЖ ещё не ясен — [wizard Emigro](https://www.emigro.online/ru/spain/wizard); при спорном contrato, temporal vs larga duración или блокировке padrón — [Assist Route Check](https://www.emigro.online/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=valencia_rent).",
    ],
    bullets: [
      "NIE (или resguardo + pasaporte) — большинство agency просят до viewing; contrato с pasaporte возможен, но редок на конкурентном объекте.",
      "IBAN ES… — для transferencia fianza + primer mes; без него отсеивают раньше, чем вы доедете до Benimaclet.",
      "Justificante de ingresos: nóminas, contrato teletrabajo, extracts 3 mes., tax return — под ваш trámite (DNV, autónomo, employment).",
      "Aval bancario / fiador español — если нет, готовьте альтернативу: garantía adicional, prepago negociado (сверяйте с LAU), employer letter.",
      "Certificado empadronamiento historial — не для аренды, но понадобится для TIE через 1–2 meses после заселения.",
      formatPracticeBullet({
        channels: ["valenciarusia", "valenforum"],
        period: "2025–2026",
        claim:
          "агентства на Idealista часто просят NIE, IBAN и payslips ещё до назначения viewing — и отказывают, если пакет неполный",
        forReader:
          "соберите PDF-папку до активного поиска; в сентябре–октябре конкуренция выше",
      }),
      "План B по району: если Ruzafa закрыта — Campanar, Algirós, Quatre Carreres с тем же бюджетом и меньшей конкуренцией.",
      "Не переводите dinero до contrato firmado и проверки IBAN arrendador. Если agency требует отдельную сумму с inquilino, запросите legal concept и factura: gestión/formalización vivienda оплачивает arrendador.",
    ],
  },
  {
    heading: "Бюджеты аренды: районы Valencia (ориентиры 2026)",
    section_kind: "practice",
    paragraphs: [
      "Цифры ниже — **ориентиры объявлений** Idealista/Fotocasa и обсуждений @valenciarusia / @valenforum в 2025–2026, не каталог Emigro и не официальная estadística Generalitat. Asking price часто выше финальной renta, если вы готовы подписать в 24–48 часов с полным пакетом NIE+IBAN; в сентябре–октябре (curso UV, волна релокантов) торг слабее.",
      "Подробнее по школам, metro и «где жить семье» — [районы Valencia](/notes/" +
        VALENCIA_DISTRICTS_SLUG +
        "). Сравнивайте **renta + законно согласованные comunidad/IBI + suministros**, а не только цифру карточки. Gestión agency/formalización vivienda в бюджет inquilino не включайте.",
    ],
    bullets: [
      "Ruzafa / Gran Vía: T1 ~€900–1150; T2 ~€1100–1400; T3 ~€1400–1900 — высокий спрос, много bares, вечерний шум.",
      "Benimaclet / Algirós: T1 ~€750–950; T2 ~€850–1100; T3 ~€1100–1400 — студенческий и релокant mix, чаще без aval.",
      "Campanar / Nou Moles: T2 ~€800–1050; T3 ~€1000–1300 — спальные, tram/metro до centro 15–25 min.",
      "Eixample / Pla del Remei: T2 ~€1200–1600+ — quiet luxury, parking отдельно.",
      "Ciutat Vella / El Carmen: T1 ~€850–1100; T2 ~€1000–1300 — туризм, шум, humedad en planta baja.",
      "Quatre Carreres / Malilla: T2 ~€750–950 — бюджетнее, дальше от пляжа, растущий stock nuevo.",
      "Paterna / Mislata (metro): T2 ~€700–900 — commute 20–30 min, часто семьи.",
      formatPracticeBullet({
        channels: ["valenciarusia"],
        period: "2026",
        claim:
          "финальная renta иногда оказывалась на €50–100 ниже asking при быстрой подписи с испанским IBAN и без mascotas",
        forReader: "в пик сезона на это меньше рассчитывайте — держите plan B по району",
      }),
    ],
  },
  {
    heading: "Idealista, Fotocasa и полевой рынок Valencia",
    section_kind: "practice",
    paragraphs: [
      "Idealista — главный витринный слой рынка Valencia; Fotocasa и Milanuncios дублируют часть объявлений. Поиск — это не листание красивых фото, а фильтрация шума: одна квартира в трёх agency, снятые объявления и «disponible ya» без ответа — норма, не ваш личный blacklist.",
      "Сравнивайте **renta + gastos de comunidad + suministros**, не только headline. Comunidad и IBI можно переложить на inquilino лишь при письменном pacto, который определяет годовую сумму на дату договора (LAU art. 20); рекламной строки недостаточно.",
    ],
    bullets: [
      "Фильтры: «larga duración», «sin mascotas» если есть pet — экономит звонки; «amueblado» vs vacío влияет на депозит и inventario.",
      "Дубли объявлений — одна квартира у 2–3 agency с разной renta; звоните по referencia catastral или адресу.",
      "«Disponible ya» + не отвечают 48 ч — часто квартира уже сдана, карточку не сняли.",
      "Ruzafa / El Carmen — высокий спрос; viewing в тот же день, если NIE + IBAN готовы.",
      "Benimaclet / Algirós — чаще принимают extranjero без aval, но проверяйте cláusula empadronamiento.",
      formatPracticeBullet({
        channels: ["valenforum"],
        period: "2026",
        claim:
          "часть объявлений пытается переименовать запрещённую для inquilino vivienda комиссию в «servicio» или «estudio de solvencia»",
        forReader: "для vivienda ссылайтесь на LAU art. 20, требуйте concepto и factura до любого платежа",
      }),
      "Contrato temporal 11 meses — уточните prórroga automática и право padrón; многие TIE-треки требуют larga duración.",
      "Inventario + фото дефектов при entrega de llaves — подписывайте в день check-in; через 12 meses без них спор о fianza тяжелее.",
    ],
  },
  {
    heading: "На практике: fiador, aval и red flags Idealista",
    section_kind: "practice",
    paragraphs: [
      "Рынок Valencia для extranjero без fiador español часто добавляет **garantía adicional**: depósito, aval bancario или prepago negociado в пределах применимых правил. «Sin aval» на Idealista — маркетинговый hook; уточняйте **garantías totales** до viewing.",
      "Red flags на уровне anuncio и agency: precio muy por debajo del barrio; fotos de stock sin cocina/baño; propietario «en el extranjero» que pide transferencia antes de contrato; negativa a depósito GVA «porque es más rápido en mano»; contrato solo en inglés sin versión LAU; negativa escrita a empadronamiento pese a vivienda habitual. Если agency давит «firma hoy o perdemos el piso» — это рыночное давление, но не повод пропускать lectura del contrato.",
    ],
    bullets: [
      "Aval bancario — banco avala 12–24 meses; coste orientativo 1–2% anual; no todos los bancos lo dan a recién llegados.",
      "Fiador con nómina en ES — ideal para agency tradicional; difícil para recién llegados.",
      "Dos meses extra de fianza — límite LAU para garantía adicional en vivienda; practice a veces pide tres — negocie.",
      "Agency без CIF/recibo и с «servicio obligatorio al inquilino» — pida concepto legal и не платите до проверки.",
      "Anuncio duplicado con rentas distintas — misma vivienda, distintas comisiones.",
      "«Solo transferencia internacional» — rechace; IBAN ES en contrato.",
      formatPracticeBullet({
        channels: ["valenforum", "valenciarusia"],
        period: "2025–2026",
        claim:
          "estafas con «fianza por Bizum antes de ver el piso» aparecían en hilos de alquiler — siempre contrato y visita presencial",
        forReader: "no pague fianza sin contrato firmado y DNI/NIE del arrendador",
      }),
      "Contrato «a nombre de empresa» sin relación con vivienda — sospecha de uso distinto del de vivienda (2 meses fianza legal).",
    ],
  },
  {
    heading: "Стартовые расходы: официально и на практике",
    section_kind: "gap",
    paragraphs: [
      "Первый mes после подписи — самый дорогой: fianza legal, возможная garantía adicional, первый mes de renta и подключение suministros. Gestión agency/formalización vivienda — расход arrendador. Просьба о большой transferencia без contrato и без понятного назначения — стоп-сигнал.",
      "Официально fianza legal — 1 mes; garantía adicional регулируется art. 36. Для vivienda расходы agency/formalización несёт arrendador. Пример T2 €1100 для inquilino: fianza €1100 + primer mes €1100 + согласованная garantía adicional (если есть) + suministros; не закладывайте «1 mes + IVA агенту» как законный обязательный расход.",
    ],
    bullets: [
      "Fianza legal — 1 mes renta (LAU); arrendador deposita en GVA — usted paga, él trámite.",
      "Garantía adicional 1–2 meses или aval — частая practice для extranjeros; торгуйте.",
      "Honorarios gestión/formalización vivienda — платит arrendador; для temporada/uso distinto проверяйте régimen и factura отдельно.",
      "Primer mes de renta — часто adelantado en firma; уточните prorrateo si entra mid-mes.",
      "Suministros (luz, agua, gas, internet) — €80–150/мес T2; лета AC может добавить.",
      "Comunidad — €40–120 типично; obra nueva выше.",
    ],
  },
  {
    heading: "Где объявление и реальность расходятся",
    section_kind: "gap",
    paragraphs: [
      "Idealista показывает идеальную картину; поле Valencia добавляет сезонность (сентябрь — студенты UV + релоканты), дубли agency и «sin aval» на карточке при тройной garantía в переписке. Разрыв между anuncio и WhatsApp — не исключение, а рабочая норма рынка 2026.",
      "Agency иногда публикует одну квартиру дважды — с разной renta и переименованными «servicios»; частник может сдавать через двух агентов. До viewing спрашивайте referencia, tipo de contrato и все суммы письменно.",
    ],
    bullets: [
      "«Sin aval» en anuncio → en WhatsApp piden 2–3 meses garantía adicional o aval bancario — practice, no LAU mínimo.",
      "«Solo particulares» → иногда скрытая inmobiliaria с платным «servicio» в последний момент; для vivienda это не обходит LAU art. 20.",
      "Fianza «en efectivo al propietario» sin depósito GVA — красный флаг; официально arrendador debe depositar en Generalitat.",
      "Airbnb / booking «long stay 6 meses» — не contrato LAU vivienda; empadronamiento и TIE часто не закрываются этим адресом.",
      "«Incluye comunidad» en texto → en contrato comunidad a cargo del inquilino — читайте clausula 5–8 antes de firmar.",
      "Precio bajo mercado + prisa firmar hoy — классика estafa; no transferencias sin contrato.",
    ],
  },
  {
    heading: "Empadronamiento, TIE и temporal de 11 meses",
    section_kind: "gap",
    paragraphs: [
      "Empadronamiento — регистрация в **padrón municipal** по адресу фактического **domicilio habitual**. Ayuntamiento принимает документы, подтверждающие vivienda и право/факт проживания; contrato vivienda или autorización titular — обычные доказательства. Сам ярлык **temporada** не отменяет обязанность зарегистрироваться там, где человек реально живёт, но tourist accommodation и отсутствие документов могут вызвать проверку.",
      "Разрыв болезненный и типичный: ключи есть, padrón нет — renovación TIE, cuenta nómina и escolarización встают. Ayuntamiento de Valencia pide contrato + DNI/NIE; si arrendador dice «es temporal, no empadronamiento» — это не мелочь, а блокер для residencia. Заранее спросите **por escrito**: «¿Autoriza empadronamiento según contrato de arrendamiento de vivienda?»",
      "Certificado de empadronamiento **con historial** — частое требование cita extranjería (<3 meses de antigüedad); без padrón no lo obtiene. Resguardo TIE + contrato larga duración + padrón — связка, которую в @valenciarusia советуют закрыть в **primeros 60–90 días** после заселения.",
    ],
    bullets: [
      "Larga duración vivienda — базовый сценарий для padrón; ayuntamiento Valencia pide contrato + DNI/NIE.",
      "Temporal <11 mes. «por estudios / obra» — arrendador может отказать в autorización padrón; не путайте с turismo.",
      "Habitación en piso compartido — empadronamiento возможен с autorización del titular; не все coliving это оформляют.",
      "Certificado empadronamiento <3 mes. — типичное требование extranjería; без padrón не получите.",
      "Resguardo TIE + contrato larga duración — связка, которую в @valenciarusia советуют закрыть в первые 60–90 días после заселения.",
    ],
  },
  {
    heading: "Просмотр: что проверить лично",
    section_kind: "action_guide",
    paragraphs: [
      "Фото Idealista не передают запах humedad, давление воды на último piso и вечерний шум terraza в Ciutat Vella. Valencia — климат мягче Madrid, но старые casas en planta baja и patios interior с плесенью встречаются и в Benimaclet, и в Ruzafa. Летом без AC en ático bajo cubierta комфорт резко падает; зимой одинарные ventanas в Eixample — счета Endesa выше, чем кажется по renta.",
      "Выделите 20–30 минут на осмотр после того, как agency «закроет» квартиру — это не грубость, а стандарт покупателя услуги arrendamiento. Сфотографируйте всё сомнительное с датой — эти кадры потом стоят одного mes de fianza при споре о daños.",
    ],
    bullets: [
      "Humedad — углы, шкафы, за шторами; фото с датой до подписи.",
      "Agua caliente — кран на máximo; en edificios antiguos calentador pequeño = duchas cortas.",
      "Ventanas — abrir/cerrar; simple acristalamiento = AC/caro en verano.",
      "Ruido — 5 min silencio: terraza, colegio, bar, obras en Eixample.",
      "Ascensor y escalera — если broken, negocie o descarte si planta alta.",
      "Contador luz/agua — foto lectura en entrega de llaves.",
      "Vecinos / portero — una frase amable a veces evita sorpresa de obras.",
    ],
  },
  {
    heading: "Переговоры и день подписи",
    section_kind: "action_guide",
    paragraphs: [
      "Торг по renta возможен, но не отменяет LAU: fianza legal остаётся 1 mes, depósito GVA — обязанность arrendador. Быстрая подпись помогает на конкурентном объекте; «firmamos mañana sin leer» — классическая ошибка, особенно en clausulas de temporal y gastos. Если agency торопит — попросите ночь на чтение; legitimate arrendador обычно согласен, мошенник — нет.",
      "Contrato на испанском — попросите resumen ключевых clausulas на русском/английском у знакомого или gestoría; один вечер дешевле года спора. Не подписывайте blank pages — каждая страница должна быть заполнена или зачёркнута.",
    ],
    bullets: [
      "A veces −€50–100/mes si firma en 48 h — no garantía en septiembre.",
      "Negocie mobiliario, parking и garantías — antes de reservar.",
      "En contrato: IBAN arrendador для renta/fianza; gestión agency vivienda — за счёт arrendador.",
      "Clausula gastos: comunidad, IBI, reparaciones — quién paga qué.",
      "Inventario firmado + fotos — el mismo día de llaves.",
      "Pida copia contrato + justificante depósito fianza en 30 días.",
      "No entregue llaves de su piso anterior hasta tener contrato firmado del nuevo.",
    ],
  },
  {
    heading: "Типичные ошибки релоканта",
    section_kind: "practice",
    paragraphs: [
      "Большинство потерь — не «не тот barrio», а перевод до подписи, temporal вместо vivienda и отсутствие comprobante depósito fianza. Valencia кажется мягче Madrid, но agency здесь так же дисциплинированы: без пакета документов вы не «плохой клиент», а просто следующий candidato в очереди.",
      "Типичный сценарий estafa: красивый anuncio, давление «transferencia hoy», propietario «en el extranjero». Официальный contrato LAU + depósito GVA + visita presencial — минимальный фильтр. Если что-то из трёх отсутствует — уходите без объяснений.",
    ],
    bullets: [
      "Transferencia fianza до contrato firmado — риск estafa; gestión agency vivienda inquilino не оплачивает.",
      "Firmaron temporal 11 mes. не читая clausula temporada — через mes 4 нет padrón для TIE.",
      "No pidieron justificante depósito fianza GVA — при salida arrendador «забыл» depositar; пишите en fianzastelematicas@gva.es.",
      "Aceptaron garantía adicional 3+ meses без торга — LAU cap 2 meses extra для vivienda; practice часто нарушают.",
      "Viewing solo por fotos — humedad en planta baja, ruido de terraza en Ciutat Vella, ascensor roto.",
      "Заплатили agency «обязательный service fee» за vivienda — оспаривайте по LAU art. 20.",
      "No fotografiaron inventario — disputa de fianza al año.",
      "Confiaron en «Registro obligatorio» de blogs — pagaron gestoría за nota simple, когда достаточно было DNI arrendador + contrato firmado.",
    ],
  },
  {
    heading: "К 4–6 месяцу: если всё ещё temporal или Airbnb",
    section_kind: "practice",
    paragraphs: [
      "К четвёртому–шестому месяцу в Valencia у многих релокантов заканчивается «временное» жильё: contrato temporal de 11 meses, habitación en piso compartido sin padrón или Airbnb long-term con contrato de hospedaje. Это не редкий сбой планирования — типичная точка, где renovación TIE, escuela и банк напоминают, что нужен domicilio habitual con depósito GVA, а не только recibos de pago.",
      "Не ждите prórroga automática от contrato temporal без clausula expresa — ищите larga duración параллельно, пока статус ещё legal y el mercado no sube otra vez en septiembre. Si el arrendador ofrece prórroga del temporal — lea si mantiene clausula de temporada o convierte en vivienda habitual.",
      "Gestoría o Assist Route Check помогают сверить contrato для próxima cita extranjería — [Assist](https://www.emigro.online/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=valencia_rent_m4) дешевле mes de hotel в пик migratorio.",
    ],
    bullets: [
      "Mes 4: проверьте vencimiento contrato и право prórroga; если temporal — начните Idealista с фильтром larga duración за 6–8 semanas до fin.",
      "Mes 4–5: запросите certificado empadronamiento; если ayuntamiento отказал — это сигнал сменить vivienda до cita TIE.",
      "Mes 5–6: соберите пакет доходов заново (banks love fresh extracts); без aval готовьте garantía bancaria или employer letter. Si el mercado sube en septiembre — mejor firmar larga duración antes del pico que buscar en la última semana de contrato temporal.",
      "Si sigue en Airbnb: negocie contrato directo con propietario (baja temporada) или cambie a vivienda con depósito GVA — Airbnb no sustituye LAU ni da certificado empadronamiento с historial для extranjería.",
      formatPracticeBullet({
        channels: ["valenciarusia"],
        period: "2025–2026",
        claim:
          "участники чата на 4–5 месяце после прилёта часто меняли temporal на larga duración именно из‑за padrón и renovación TIE",
        forReader:
          "заложите 2–4 недели поиска + fianza и, если согласовано законно, garantía adicional — не в последнюю неделю contrato",
      }),
      "Renovación TIE / huellas: contrato + padrón + seguro — проверьте актуальный checklist en [TIE Valencia](/notes/tie-cita-extranjeria-valencia-2026).",
      "Escalada: si arrendador bloquea padrón pese a clausula — burofax / asesoría; no invente domicilio falso.",
    ],
  },
  {
    heading: "Пошагово: от фильтра Idealista до entrega de llaves",
    section_kind: "action_guide",
    paragraphs: [
      "Ниже — типовой маршрут без «магии gestoría»: он ускоряет переписку, но не заменяет NIE, IBAN и contrato firmado. Закладывайте **2–4 недели** активного поиска в пик сезона и **1 semana** в межсезонье — это ориентир из @valenciarusia, не garantía Emigro.",
      "Каждый шаг оставляет след: PDF contrato, justificante depósito GVA, fotos inventario, certificado empadronamiento. Именно эта цепочка потом кормит TIE, банк и школу — не скрин переписки с agency.",
    ],
    bullets: [
      "Шаг 1: NIE/resguardo + IBAN ES + justificantes — до первого contacto en Idealista.",
      "Шаг 2: filtros larga duración, presupuesto без комиссии inquilino за gestión vivienda; shortlist 5–8 anuncios.",
      "Шаг 3: viewing presencial; fotos humedad/ruido; preguntar empadronamiento por escrito.",
      "Шаг 4: negociación renta/garantías; pedir borrador contrato antes de transferir.",
      "Шаг 5: firma; pago fianza + 1er mes на реквизиты contrato; никаких honorarios gestión vivienda с inquilino.",
      "Шаг 6: a los 30 días — pedir justificante depósito GVA (modelo 816/806).",
      "Шаг 7: empadronamiento en ayuntamiento; certificado con historial para extranjería.",
      "Шаг 8: alta suministros; guardar recibos de renta mensuales.",
    ],
  },
  {
    heading: "Contrato: cláusulas que чаще всего кусают",
    section_kind: "practice",
    paragraphs: [
      "Contrato tipo de agency — десять страниц на испанском, и большинство споров рождается не из «мелкого шрифта», а из трёх блоков: **objeto** (vivienda vs temporal), **gastos** (comunidad, IBI, reparaciones) и **garantías** (fianza + adicional). Выделите вечер на эти clausulas — дешевле, чем gestoría после salida conflictiva.",
      "Clausula de **actualización de renta** — LAU ограничивает подъёмы в определённых периодах; agency иногда копирует старые шаблоны. Clausula de **rescisión anticipada** — штрафы и plazos de preaviso должны быть явными; «30 días de preaviso» без pena — редкость, проверяйте cifra. En Valencia algunos contratos prohíben **subarriendo y Airbnb** — нарушение может ser causa de rescisión и потери fianza.",
      "Inventario anexo: mobiliario, estado de paredes, electrodomésticos. Sin inventario firmado arrendador может atribuir daños preexistentes al inquilino al devolver fianza — особенно если depósito GVA уже devuelto и остаётся только спор о garantía adicional.",
    ],
    bullets: [
      "Objeto: «arrendamiento de vivienda» vs «arrendamiento de temporada» — ключ для padrón.",
      "Duración y prórroga: años pactados + prórroga legal LAU.",
      "Fianza + garantía adicional: cifras separadas, no mezclar con honorarios.",
      "Gastos: comunidad, IBI, seguro hogar, reparaciones menores.",
      "Empadronamiento: cláusula de autorización expresa — pedirla si falta.",
      "Mascotas, subarriendo, obras — prohibiciones explícitas o permiso.",
    ],
  },
];

const keyTakeaways = [
  "Официально: fianza legal — 1 mes renta (vivienda), 2 meses (uso distinto); arrendador deposita en Generalitat GVA (modelo 816/806) dentro del mes siguiente — не IVAMA.",
  "Официально: garantía adicional — по pacto, до 2 meses extra для vivienda в типовых сроках LAU; gestión inmobiliaria/formalización vivienda оплачивает arrendador (LAU art. 20).",
  formatPracticeTakeaway({
    channels: ["valenciarusia", "valenforum"],
    period: "2025–2026",
    claim:
      "agency en Idealista Valencia suelen exigir NIE, IBAN español y justificante de ingresos antes del viewing",
    forReader:
      "arme el paquete antes de buscar; presupueste fianza + 1er mes + garantía adicional pactada, но не gestión agency vivienda",
  }),
  "Расхождение: «sin aval» en anuncio vs triple garantía en chat; temporal/Airbnb vs empadronamiento para TIE — к mes 4–6 смените на larga duración con depósito GVA.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "¿Cuánto es la fianza legal en Valencia?",
    a: "По правилам LAU: 1 mensualidad de renta para vivienda. Depósito en Generalitat — obligación del arrendador (GVA 3023). На практике agency piden además garantía adicional (aval, meses extra) — negocie y сверьте с art. 36.5 LAU.",
  },
  {
    q: "¿Necesito NIE para alquilar?",
    a: "По правилам contrato возможен con pasaporte. На практике inmobiliaria и propietario en Valencia casi siempre exigen NIE/resguardo + IBAN ES antes de firmar.",
  },
  {
    q: "¿Quién paga la comisión de la inmobiliaria?",
    a: "По правилам LAU art. 20 расходы gestión inmobiliaria и formalización договора vivienda несёт arrendador. На практике agency иногда переименовывает комиссию — запросите concepto/factura и оспорьте до платежа; для temporada/uso distinto отдельно проверьте régimen.",
  },
  {
    q: "¿Puedo empadronarme con contrato temporal de 11 meses?",
    a: "По правилам empadronamiento requiere domicilio habitual; temporal de temporada часто no califica. На практике ayuntamiento Valencia pide autorización del arrendador; para TIE лучше larga duración vivienda.",
  },
  {
    q: "¿Cómo sé si el propietario depositó la fianza?",
    a: "По правилам inquilino puede solicitarlo por escrito + copia contrato a fianzastelematicas@gva.es (GVA 3023). На практике pida justificante al firmar y repita a los 30 días si no lo recibe.",
  },
  {
    q: "¿Puede el propietario no depositar la fianza en GVA?",
    a: "По правилам arrendador debe depositar fianza legal en Generalitat en el mes siguiente (GVA 3023, Decreto 46/2022); fuera de plazo — recargo modelo 818/808. На практике частники задерживают; inquilino puede verificar por email y exigir justificante por escrito antes de entrega de llaves.",
  },
];

export const ARENDA_VALENCIA_GUIDE = {
  slug: ARENDA_VALENCIA_SLUG,
  category: "Аренда",
  content_kind: "guide" as ContentKind,
  title: "Аренда в Valencia 2026: Idealista, contrato, fianza GVA",
  excerpt:
    "LAU, depósito fianza en Generalitat Valenciana (modelo 816/806, GVA 3023), fiador/aval, honorarios agency, NIE+IBAN, empadronamiento vs temporal 11 mes, red flags Idealista и сценарий «к 4–6 месяцу» — полный гайд для релоканта в Valencia с Nota Emigro (IVAMA → GVA fixed).",
  seo_title: "Аренда Valencia 2026 — Idealista, fianza GVA, contrato",
  seo_description:
    "Аренда Valencia 2026: Idealista, fianza 1 mes по LAU, депозит в Generalitat GVA 816/806, NIE и IBAN. Не путать депозит с устаревшим IVAMA — гайд.",
  quick_answer:
    "En Valencia la fianza legal es 1 mes de renta (LAU art. 36); el arrendador la deposita en Generalitat por GVA 3023. Para vivienda, gestión inmobiliaria y formalización del contrato son a cargo del arrendador (LAU art. 20). Antes de firmar revise garantías, gastos escritos, uso habitual/temporada y documentos para padrón; la etiqueta temporal no decide por sí sola el empadronamiento.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "BOE — LAU Ley 29/1994", url: "https://www.boe.es/buscar/doc.php?id=BOE-A-1994-26003" },
    { title: "BOE — Ley 12/2023 de Vivienda", url: "https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203" },
    {
      title: "GVA — Depósito fianza (3023)",
      url: "https://www.gva.es/es/inicio/procedimientos?id_proc=3023",
    },
    {
      title: "GVA — Devolución fianza (2739)",
      url: "https://www.gva.es/es/inicio/procedimientos?id_proc=2739",
    },
    {
      title: "ATV GVA — Modelos fianzas 816/806",
      url: "https://atv.gva.es/es/tributos-modelos-fianzas",
    },
    { title: "BOE — Ley 8/2004 Vivienda CV", url: "https://www.boe.es/eli/es-vc/l/2004/10/20/8/con" },
    { title: "Idealista — alquiler Valencia", url: "https://www.idealista.com/alquiler-viviendas/valencia-valencia/" },
  ],
  topic_tags: ["alquiler", "arenda", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["alquiler", "arenda", "valencia"],
    contentKind: "guide",
    extra: ["idealista", "nie", "fianza", "empadronamiento", "ruzafa", "benimaclet"],
  }),
  source_channel: "valenciarusia+valenforum+official-editorial",
  source_label: "editorial:alquiler-valencia-sep2026-factcheck-gold",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};

export default ARENDA_VALENCIA_GUIDE;
