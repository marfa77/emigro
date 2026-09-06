/**
 * Hand-curated Spain satellite guide — NIE + empadronamiento order (Valencia).
 * Official Policía / ayuntamiento rules separated from cautious field practice.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const NIE_EMPADRONAMIENTO_SLUG = "nie-empadronamiento-poryadok-2026";

const GLOSSARY_INTRO =
  "Эти слова встретятся в cita Policía Nacional, в Oficina del Padrón и в письмах арендодателя. Различать их до первого визита проще, чем объяснять на испанском в очереди, почему вы принесли только pasaporte.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(NIE_EMPADRONAMIENTO_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор спорных формулировок из чатов и старых гайдов. **OK** = сверено с официальной страницей; **soft** = полевая практика Valencia; **fixed** = смягчено под рамку 2026. Не юридическая консультация — перед визитом откройте [sede.policia.gob.es](https://sede.policia.gob.es/) и [sede.valencia.es PA.GP.11](https://sede.valencia.es/sede/registro/procedimiento/PA.GP.11).",
    ],
    bullets: [
      "OK: NIE присваивает Dirección General de la Policía через EX-15 + tasa 790 código 012; процедура 994354, plazo máximo resolución — **5 días** с entrada en registro ([Policía — Asignación NIE](https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria_tramite_asignacion_nie.php)).",
      "OK: importe tasa «Asignación de NIE a instancia del interesado» берётся из **PDF**, сгенерированного на [Tasa790_012](https://sede.policia.gob.es/Tasa790_012/ImpresoRellenar) — не копируйте € из блога как «закон навсегда»; сумма индексируется.",
      "OK: empadronamiento в Valencia — trámite **PA.GP.11**; certificado — **PA.CE.10**; trámites padronales **gratuitos** ([Ayuntamiento Valencia](https://www.valencia.es/)).",
      "OK: Oficina del Padrón — Plaza del Ayuntamiento, entrada Periodista Azzati, 2; Tabacalera — C/ Amadeu de Savoia, 11; cita: web municipal или **010 / 963100010**.",
      "Fixed: для visado D / residencia NIE обычно уже присвоен в resolución или visado; отдельный EX-15 нужен не каждому. Сначала проверьте номер в своих документах, а затем выбирайте trámite — не бронируйте «Asignación NIE» автоматически перед TIE.",
      "Fixed: «NIE и padrón в любом порядке, закон не запрещает» → формально да, но банк, TIE и utilities в Valencia на практике просят **оба** документа; порядок ниже — полевой, не статья LOEX.",
      "Soft: gestoría «NIE за 1 день €150–400» — услуга посредника, не ускоренная госпошлина; официального VIP-окна нет.",
      "Soft: «empadronamiento по Airbnb без propietario» — ayuntamiento часто откладывает или отказывает; нужен contrato или autorización firmada.",
      "Soft: срок «NIE на пластике 1–4 недели» — зависит от provincia и загрузки; resguardo выдают в день подачи при успешном приёме.",
    ],
  },
  {
    heading: "Официально: NIE и padrón — два разных органа",
    section_kind: "official",
    paragraphs: [
      "Número de Identificación de Extranjero — налоговый и административный идентификатор для любого иностранца, чьи интересы связаны с Испанией: аренда, работа, покупка, подача на residencia. Его присваивает Policía Nacional / Oficina de Extranjería по форме EX-15 после оплаты tasa 790 código 012. Номер **не привязан к Valencia**: полученный в provincia Valencia действует по всей стране.",
      "Empadronamiento — регистрация в padrón municipal ayuntamiento, где вы **habitualmente** проживаете. Это не виза и не residencia: муниципалитет фиксирует адрес для censos, школы, части процедур extranjería и certificado de empadronamiento. В Valencia alta и cambio de domicilio идут через PA.GP.11; справка — PA.CE.10.",
      "Cita previa на NIE бронируется через [sede administraciones públicas](https://sede.administracionespublicas.gob.es/) (Policía — Asignación de NIE). Cita на padrón — через web [valencia.es](https://www.valencia.es/) / [sede.valencia.es](https://sede.valencia.es/) или телефон 010. Это **разные** календари; свободный слот в одном не открывает другой.",
    ],
    bullets: [
      "EX-15: укажите **motivo concreto** (аренда, TIE, trabajo) — общие формулировки с 2023 года не принимают ([Policía NIE](https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria_tramite_asignacion_nie.php)).",
      "Tasa 790-012: сгенерируйте impreso онлайн, оплатите в banco/caja **без обязательного счёта** — сохраните ejemplar para la Administración с sello.",
      "Resguardo EX-15 — подтверждение подачи; номер NIE может быть уже присвоен до «красивого» certificado на бумаге.",
      "Certificado de empadronamiento acredita domicilio ante extranjería, banco, colegio — запросите **historial** (PA.CE.10), если TIE или школа просят antigüedad.",
      "Trámites padronales en Valencia son **gratuitos** — платить «за ускорение» в окне ayuntamiento не требуется по официальной карточке PA.GP.11.",
      "Extranjero en situación irregular no puede solicitar NIE por esta vía — статус должен быть legal (visado, autorización en trámite).",
    ],
  },
  {
    heading: "Документы: EX-15, tasa и папка для padrón",
    section_kind: "action_guide",
    paragraphs: [
      "Папку собирают до cita, а не в очереди у банкомата. Имя в EX-15, contrato и pasaporte должно совпадать буква в букву — иначе повторный визит в Policía или Oficina del Padrón съест неделю, которую вы планировали потратить на Idealista.",
      "Для empadronamiento ayuntamiento Valencia просит доказать **residencia habitual** в vivienda. Локал без autorización de vivienda, чистый Airbnb без propietario или contrato на 2 ночи часто уходят в revisión документации — онлайн-заявка PA.GP.11 не автоматическая.",
    ],
    bullets: [
      "Pasaporte original + копии страниц с datos и sellos; срок действия — проверьте visado D.",
      "EX-15 заполнен от руки или печатно, **sin tachaduras**; motivo — конкретный (contrato de alquiler en Valencia, expedición TIE, alta autónomo).",
      "Justificante tasa 790-012 pagada — сумма из вашего PDF на sede.policia.gob.es.",
      "Justificante del motivo: borrador contrato, resolución favorable, carta empleador — по вашему caso.",
      "Para padrón: contrato de alquiler + DNI/NIE arrendador **или** autorización del propietario firmada con copia de su DNI.",
      "Recibo de suministros (luz, agua) на ваше имя иногда принимают как apoyo, но contrato надёжнее для TIE.",
      "Si familia: cita previa — 1 por persona salvo unidad familiar (PA.GP.11).",
    ],
  },
  {
    heading: "Valencia: где записаться и в каком порядке идти",
    section_kind: "practice",
    paragraphs: [
      "В Valencia цепочка зависит от основания. При visado D сначала найдите уже присвоенный NIE в visado/resolución, параллельно бронируйте TIE huellas и оформляйте padrón по фактическому адресу. EX-15 — отдельный маршрут для asignación NIE, если номера действительно нет; он не является обязательной «ступенью перед TIE» для каждого резидента.",
      "NIE: cita через sede.administracionespublicas.gob.es — provincia Valencia, trámite Policía-Asignación de NIE. Слоты в сентябре–ноябре исчезают быстро; начинайте мониторинг в первые 72 часа после прилёта в VLC.",
      "Padrón: Oficina del Padrón (Periodista Azzati, 2) или Tabacalera (Amadeu de Savoia, 11); horario 8:30–14:00, **cita previa** через web или 010. Certificado можно запросить сразу после alta — для TIE берите свежий (<3 meses en la práctica).",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenforum", "valenciarusia"],
        period: "2025–2026",
        claim:
          "в Valencia чаще проходят цепочку NIE/resguardo → padrón → IBAN, а не наоборот — иначе банк и utilities отправляют «вернуться с certificado»",
        forReader:
          "не переводите fianza до подписанного contrato; документы для padrón проверьте до подписи",
      }),
      "Cita NIE: сохраните PDF resguardo cita; без него в Comisaría не примут.",
      "En el banco: resguardo EX-15 иногда принимают до certificado NIE definitivo — зависит от sucursal (soft).",
      "Gestoría €150–400: имеет смысл, если cita NIE «нулевая» неделями; договор должен отличать fee gestoría от tasa oficial.",
      formatPracticeBullet({
        channels: ["spain_granitsa"],
        period: "2025–2026",
        claim:
          "empadronamiento в Tabacalera иногда быстрее, чем в Casa Consistorial, если cita на Periodista Azzati занята",
        forReader: "расширяйте поиск cita на обе oficinas padronales",
      }),
      "Certificado + historial: попросите оба в день alta — повторный визит для TIE через месяц лишний.",
      "Utilities Iberdrola/Endesa: NIE + IBAN + contrato — см. [SIM и luz Valencia](/notes/sim-internet-luz-valencia-2026).",
    ],
  },
  {
    heading: "Неделя 1 без NIE и padrón: что не закрыть",
    section_kind: "practice",
    paragraphs: [
      "Первые семь дней в Valencia кажутся «только про квартиру и SIM», но без NIE/resguardo и certificado de empadronamiento часть дверей формально закрыта. Это не теория из форума — это фильтры банка, agency на Idealista и ICPPlus при записи на huellas.",
      "Resguardo EX-15 уже открывает часть KYC. Для аренды дайте подтверждение titularidad подходящего счёта SEPA; arrendador затем вносит fianza в Generalitat по GVA 3023. Отказ только из-за страны IBAN может быть незаконной IBAN discrimination.",
    ],
    bullets: [
      "Без NIE/resguardo: сложнее cita banca, contrato с agency, alta autónomo, часть suministros на ваше имя.",
      "Без padrón: extranjería на huellas дозапрашивает certificado; школа и SIP часто требуют empadronamiento.",
      "Без обоих: перевод fianza «с зарубежной карты» — типичный отказ; см. [аренда Valencia](/notes/arenda-valencia-idealista-2026).",
      "С resguardo, но без padrón: банк может отложить opening на 5–10 días (soft из @valenciarusia).",
      "С padrón, но без NIE: ayuntamiento иногда регистрирует по pasaporte, но банк и Hacienda всё равно ждут identificación fiscal.",
    ],
  },
  {
    heading: "Где официальный маршрут расходится с практикой Valencia",
    section_kind: "gap",
    paragraphs: [
      "Официально NIE и empadronamiento — независимые trámites. На практике Valencia связывает их в одну «админ-цепочку» через банк, TIE и аренду. Расхождение не значит, что закон неверен — значит, что ваш следующий контрагент смотрит на **оба** документа.",
    ],
    bullets: [
      "Официально: порядок NIE/padrón не регламентирован. На практике: NIE/resguardo → padrón → banco — меньше отказов в @valenforum.",
      "Официально: cita previa доступна на sede. На практике: 0 slots на недели вперёд в пик — нужен ежедневный мониторинг, не один заход.",
      "Официально: empadronamiento gratuito. На практике: без contrato ≥6 meses или autorización propietario alta может уйти в revisión неделями.",
      "Официально: plazo NIE 5 días. На практике: certificado на бумаге и очередь на cita растягивают ощущение «месяц без номера».",
      formatPracticeBullet({
        channels: ["valenciarusia", "spain_granitsa"],
        period: "2025–2026",
        claim:
          "банки Valencia чаще открывают cuenta с resguardo NIE + certificado empadronamiento, чем только с pasaporte turista",
        forReader: "не закрывайте зарубежный счёт до ES IBAN — нужен мост для fianza",
      }),
    ],
  },
  {
    heading: "Типичные ошибки и сроки до TIE",
    section_kind: "practice",
    paragraphs: [
      "Большинство повторных визитов — не «сложная Испания», а несовпадение имени, просроченный certificado padrón или попытка empadronarse в Airbnb без propietario. Короткая проверка папки перед cita экономит больше, чем gestoría без документов.",
      "Если в первый месяц пропустить padrón или NIE, к 4–6 месяцу после прилёта вы можете иметь resguardo huellas, но всё ещё спорить с Hacienda, SS или agency из‑за отсутствия historial empadronamiento или IBAN letter — типичный хвост из @spain_granitsa, который дешевле закрыть в неделю 2, чем лечить перед renovación.",
    ],
    bullets: [
      "Empadronamiento до NIE без pasaporte/resguardo — лишний визит: сначала identificación, потом padrón.",
      "Один certificado empadronamiento без historial — extranjería просит актуальный (<3 meses) перед huellas.",
      "Airbnb без autorización — отказ или revisión; для TIE нужен domicilio estable.",
      "Ждать «готовый NIE на зелёном листе» для cita TIE — resguardo + padrón часто достаточны; см. [TIE cita Valencia](/notes/tie-cita-extranjeria-valencia-2026).",
      "Перевод fianza без ES IBAN — agency откладывает contrato; см. [банк и IBAN](/notes/bank-iban-nerezident-ispaniya-2026).",
      "Не сохранили PDF resguardo cita и tasa — без них не пустят в Comisaría.",
    ],
  },
  {
    heading: "Oficinas del Padrón Valencia: Periodista Azzati y Tabacalera",
    section_kind: "action_guide",
    paragraphs: [
      "Ayuntamiento de Valencia держит несколько точек gestión padronal, но две самые упоминаемые релокантами — Oficina del Padrón Municipal en Plaza del Ayuntamiento (entrada Periodista Azzati, 2) и Oficina de Atención Ciudadana en Tabacalera (C/ Amadeu de Savoia, 11, Nave Oeste). Обе работают de 8:30 a 14:00, lunes a viernes, **con cita previa** через web municipal или 010 / 963100010.",
      "En Periodista Azzati поток смешанный: vecinos de toda la vida y recién llegados con contrato en Ruzafa o Benimaclet. En Tabacalera иногда короче espera de cita, но пакет документов тот же. Не приезжайте без cita: en la puerta suelen rechazar aunque traiga contrato.",
      "Tras el alta pida certificado de empadronamiento **y** historial si va a pedir TIE o plaza escolar — trámite PA.CE.10 en [sede.valencia.es](https://sede.valencia.es/sede/registro/procedimiento/PA.CE.10). El certificado telefónico vía 010 existe, pero extranjería prefiere papel reciente de oficina.",
    ],
    bullets: [
      "Cita: valencia.es / sede.valencia.es — 1 cita por persona salvo unidad familiar.",
      "Teléfono 010 / 963100010 / 962081104 — si la web falla.",
      "Contrato: firmas, dirección completa, duración.",
      "Autorización propietario: firma + copia DNI/NIE del dueño.",
      "Menores: pasaporte + representante legal.",
      "Cambio de domicilio intra Valencia — mismo PA.GP.11.",
    ],
  },
  {
    heading: "Gestoría frente a cita propia en NIE",
    section_kind: "practice",
    paragraphs: [
      "Gestoría en Valencia vende «NIE rápido» por €150–400. No es ventanilla preferente del Estado: el gestor vigila sede, rellena EX-15 y a veces acompaña a Comisaría. Tiene sentido si no puede leer español o no tiene tiempo para monitorear citas, pero el contrato debe separar honorarios de la tasa 790 oficial.",
      "El camino DIY es más barato en euros y más caro en horas: dos o tres semanas buscando hueco más un viaje con carpeta. En @valenforum muchos mezclan: cita NIE propia y gestoría solo para Seguridad Social más adelante.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["valenforum"],
        period: "2025–2026",
        claim:
          "gestoría compensa cuando sede muestra 0 citas NIE más de dos semanas",
        forReader: "exija contrato: solo cita vs acompañamiento completo",
      }),
      "No deje pasaporte original sin recibo detallado.",
      "Tasa 790 — páguela usted en banco; no acepte «todo incluido» sin justificante.",
      "Empadronamiento no delegable salvo poder notarial — raro.",
      "Compare presupuestos; €400 sin lista — señal de alerta.",
    ],
  },
  {
    heading: "Empadronamiento electrónico: cuándo tiene sentido",
    section_kind: "official",
    paragraphs: [
      "PA.GP.11 admite solicitud online con certificado digital o Cl@ve. Para un recién llegado ruso en semana 1 es poco habitual — Cl@ve/FNMT exige identificación previa. La alta online **no es automática**: el ayuntamiento revisa y puede pedir más datos vía carpeta ciudadana.",
      "Si intenta vía electrónica, suba contrato completo y DNI del arrendador. Un requerimiento de documentación no es denegación definitiva — corrija en carpeta sin duplicar solicitudes innecesarias.",
    ],
    bullets: [
      "Presencial — vía habitual sin Cl@ve.",
      "Electrónico — PA.GP.11 con certificado en sede.valencia.es.",
      "Revisión manual — plazos variables.",
      "Planifique padrón antes de huellas si puede.",
    ],
  },
  {
    heading: "Сценарий релоканта: первая неделя в Valencia",
    section_kind: "practice",
    paragraphs: [
      "Представьте типичный прилёт в VLC с visado D: в паспорте есть sticker, в телефоне — переписка с agency по квартире, в чате @valenforum кто-то пишет «сначала padrón, потом NIE», а кто-то — наоборот. Спокойная логика для Valencia такая: в день 1–2 вы покупаете SIM и бронируете две citas — NIE на sede administraciones и huellas на ICPPlus, даже если слот через две недели. Параллельно ищете short-term жильё с правом empadronamiento, потому что без propietario signature Airbnb редко проходит в Oficina del Padrón.",
      "Если отдельный EX-15 действительно нужен, оплатите tasa 790 в banco: impreso с barcode, несколько копий, sello банка на ejemplar para la Administración. Motivo должен описывать конкретный экономический, профессиональный или социальный интерес; не используйте шаблон «expedición TIE», если NIE уже присвоен в visado/resolución.",
      "На второй неделе, уже с resguardo, идёте на cita padrón в Tabacalera или Periodista Azzati. Чиновник смотрит contrato, иногда звонит arrendador. После alta просите certificado **и** historial — extranjería любит видеть, что вы на этом адресе не «вчера». Затем — cita banca: CaixaBank или Santander в Campanar, если центр перегружен туристами.",
      "К **4–6 месяцу** после прилёта, если padrón или NIE были отложены, вы рискуете прийти на huellas с visado уже использованным, без historial domicilio и без IBAN letter — и тогда gestoría берёт двойной гонорар за «исправление», которое в неделю 2 стоило одного визита в ayuntamiento.",
    ],
    bullets: [
      "День 1–2: SIM + citas NIE + ICPPlus + temporary жильё.",
      "День 3–5: tasa 790 + EX-15 + приём NIE.",
      "Неделя 2: padrón + certificado + historial.",
      "Неделя 2–3: banco + carta IBAN.",
      "Неделя 1–4: huellas TIE по cita ICPPlus.",
      "Cloud-папка: resguardos, contrato, tasa, cita PDF.",
    ],
  },
  {
    heading: "Почему certificado empadronamiento «стареет»",
    section_kind: "practice",
    paragraphs: [
      "Официально certificado PA.CE.10 подтверждает факт регистрации на дату выпуска. Extranjería Valencia на huellas часто просит документ «свежий» — в чатах это три месяца, хотя закон не всегда пишет цифру на листе. Если между padrón и cita прошло лето или переезд внутри города, обновите certificado в 010 или Oficina del Padrón за день до huellas.",
      "Historial empadronamiento показывает непрерывность адреса — полезно при смене contrato или споре с agency. Запросите оба документа в день alta, даже если clerk говорит «потом можно».",
    ],
    bullets: [
      "Certificado — snapshot на дату.",
      "Historial — timeline адресов.",
      "Обновление перед huellas — дешевле новой cita.",
      "Cambio domicilio — PA.GP.11 до TIE если сменили район.",
      "010 — заказ certificado на дом, но для extranjería лучше офис.",
    ],
  },
  {
    heading: "Русскоязычный релокант: типовые вопросы на месте",
    section_kind: "practice",
    paragraphs: [
      "«Можно ли сначала padrón, потом NIE?» — самый частый спор в @valenforum. Формально да, но если вы приехали с visado D, ICPPlus уже просит NIE в форме, а банк — resguardo EX-15. Padrón без identificación иногда проходит по pasaporte, но вы всё равно вернётесь в Policía за NIE на следующей неделе.",
      "«Airbnb на месяц — хватит для empadronamiento?» — зависит от propietario. Ayuntamiento Valencia проверяет, что жильё — vivienda, а не только turismo. Попросите у хозяина autorización firmada и copia DNI; без этого alta уходит в revisión, а certificado не успеваете к huellas.",
      "«Gestoría обещает NIE за два дня» — уточните: два дня до cita или до готового номера? Tasa 790 платите вы; gestoría продаёт время и сопровождение. Сравните с двумя неделями самостоятельного мониторинга sede — для многих это €150 экономии.",
      "«Нужен ли адрес в Valencia до NIE?» — для EX-15 motivo «аренда» адрес в contrato помогает, но NIE как номер не привязан к calle. Для TIE и банка адрес через padrón обязателен на практике, даже если закон NIE этого не требует.",
    ],
    bullets: [
      "Спор padrón vs NIE — решайте практикой Valencia, не абстрактным LOEX.",
      "Airbnb — только с propietario on board.",
      "Gestoría — контракт и разделение tasa/fee.",
      "Historial padrón — с первого alta.",
      "Cloud-копии resguardos — обязательны.",
    ],
  },
  {
    heading: "Итог для релоканта",
    section_kind: "practice",
    paragraphs: [
      "Valencia прощает плохой испанский, но не пустой certificado padrón. Закройте NIE и empadronamiento в первые две недели — это дешевле, чем исправлять цепочку у банка и extranjería к четвёртому месяцу. Официальные адреса: Periodista Azzati, 2; Tabacalera, Amadeu de Savoia, 11; телефон 010. Tasa NIE — только из PDF на сайте полиции.",
    ],
    bullets: [
      "NIE → padrón → banco — практика Valencia.",
      "Historial padrón — с первого alta.",
      "Resguardos — в облако.",
      "Gestoría — по контракту.",
      "Sibling guides — TIE и банк.",
    ],
  },
  {
    heading: "Связанные шаги и следующий маршрут",
    section_kind: "practice",
    paragraphs: [
      "NIE и padrón — середина цепочки, не финал. После certificado открывайте cuenta, бронируйте huellas и подключайте suministros. Если visado D или DNV — сверьте маршрут на [Emigro Wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=nie-padron-valencia&utm_content=nie-empadronamiento-poryadok-2026) и при спорных casos возьмите [Route Check Assist](/ru/assist?utm_source=emigro&utm_medium=guide&utm_campaign=nie-padron-valencia&utm_content=nie-empadronamiento-poryadok-2026) — €129 разбор вашего пакета и порядка шагов, не замена abogado.",
    ],
    bullets: [
      "[Банк и IBAN](/notes/bank-iban-nerezident-ispaniya-2026) — после NIE + padrón.",
      "[TIE cita extranjería Valencia](/notes/tie-cita-extranjeria-valencia-2026) — resguardo + certificado empadronamiento.",
      "[Аренда Idealista Valencia](/notes/arenda-valencia-idealista-2026) — clause empadronamiento до fianza.",
      "[Первые 30 дней satellite](/notes/pervye-30-dnej-v-ispanii-satelit-2026) — полный orchestrator.",
      "Pillar: [ВНЖ Испания 2026](/ru/guides/vnj-ispaniya-2026) — visado и основания.",
    ],
  },
];

const keyTakeaways = [
  "Официально: NIE — EX-15 + tasa 790-012 (importe из PDF sede.policia.gob.es); empadronamiento Valencia — PA.GP.11, gratuito; certificado — PA.CE.10.",
  "Официально: cita NIE — sede.administracionespublicas.gob.es; cita padrón — valencia.es / 010; Oficina del Padrón — Periodista Azzati, 2; Tabacalera — Amadeu de Savoia, 11.",
  formatPracticeTakeaway({
    channels: ["valenforum", "valenciarusia"],
    period: "2025–2026",
    claim:
      "безопасный порядок в Valencia: NIE или resguardo, затем empadronamiento с historial, потом ES IBAN и cita TIE",
    forReader:
      "без padrón банк и extranjería чаще стопорят, чем «можно потом» из чата",
  }),
  "Расхождение: закон не фиксирует порядок NIE/padrón, но банк, TIE и agency Valencia на практике просят оба документа — не копируйте «любой порядок» с Reddit.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Что делать первым — NIE или empadronamiento?",
    a: "По правилам trámites независимы. На практике сначала проверьте, не присвоен ли NIE уже в visado/resolución; padrón оформляйте по фактическому адресу, а EX-15 — только если номера действительно нет.",
  },
  {
    q: "Можно ли empadronamiento без contrato de alquiler?",
    a: "По правилам PA.GP.11 нужно acreditar residencia habitual — обычно contrato или autorización propietario с DNI. На практике Airbnb без письма владельца часто уходит в revisión или отказ.",
  },
  {
    q: "Сколько ждать NIE в Valencia?",
    a: "По правилам resolución — до 5 días с registro; resguardo в день приёма при успешной подаче. На практике cita может занять 1–3 недели поиска слота; certificado на бумаге — ещё несколько días.",
  },
  {
    q: "Нужен ли NIE для empadronamiento?",
    a: "По правилам достаточно identificación — pasaporte. На практике NIE/resguardo ускоряет окно и нужен банку/Hacienda сразу после padrón.",
  },
  {
    q: "Нужен ли адрес в Valencia до NIE?",
    a: "По правилам NIE присваивается при мотivo económico/profesional — адрес Valencia не обязателен на входе. На практике для TIE, банка и padrón адрес понадобится в первые две недели; short-term contrato с empadronamiento clause закрывает оба контура.",
  },
  {
    q: "Что нельзя сделать в первую неделю без NIE/resguardo?",
    a: "По правилам многие actos возможны с pasaporte. На практике без NIE/resguardo в Valencia сложнее: открыть счёт в традиционном банке, domiciliar renta, оформить часть suministros на имя, пройти KYC agency на Idealista. TIE cita бронируется с NIE en formulario.",
  },
];

export const NIE_EMPADRONAMIENTO_GUIDE = {
  slug: NIE_EMPADRONAMIENTO_SLUG,
  category: "NIE и padrón",
  content_kind: "guide" as ContentKind,
  title: "NIE и empadronamiento в Valencia: порядок шагов 2026",
  excerpt:
    "EX-15, tasa 790-012, PA.GP.11, Oficina del Padrón и Tabacalera — официальный каркас и практический порядок NIE → padrón → banco для Valencia без мифов из чатов.",
  seo_title: "NIE и empadronamiento Valencia 2026 — порядок",
  seo_description:
    "NIE и empadronamiento Valencia 2026: EX-15, tasa 790, cita previa, padrón Periodista Azzati. Порядок шагов для RU/BY — разные органы, не путать.",
  quick_answer:
    "NIE и padrón в Valencia — разные органы: Policía (EX-15 + tasa 790 из PDF на sede.policia.gob.es) и ayuntamiento PA.GP.11 (gratuito). Безопасная цепочка для быта: NIE/resguardo → empadronamiento с historial → ES IBAN → cita TIE. Oficinas: Periodista Azzati, 2 и Tabacalera Amadeu de Savoia, 11; cita — valencia.es или 010.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Policía — Asignación NIE", url: "https://sede.policia.gob.es/portalCiudadano/_es/tramites_extranjeria_tramite_asignacion_nie.php" },
    { title: "Tasa 790 código 012", url: "https://sede.policia.gob.es/Tasa790_012/ImpresoRellenar" },
    { title: "Sede — cita previa", url: "https://sede.administracionespublicas.gob.es/" },
    { title: "Valencia — PA.GP.11 empadronamiento", url: "https://sede.valencia.es/sede/registro/procedimiento/PA.GP.11" },
    { title: "Ayuntamiento de Valencia", url: "https://www.valencia.es/" },
  ],
  topic_tags: ["nie", "empadronamiento", "valencia"],
  hashtags: buildNoteHashtags({
    topicTags: ["nie", "empadronamiento", "valencia"],
    contentKind: "guide",
    extra: ["extranjeria", "padron", "ex-15"],
  }),
  source_channel: "valenforum+valenciarusia+spain_granitsa",
  source_label: "editorial:nie-padron-gold-valencia-2026",
  pillar_guide_slug: "pervye-30-dnej-v-ispanii-2026",
};

export default NIE_EMPADRONAMIENTO_GUIDE;
