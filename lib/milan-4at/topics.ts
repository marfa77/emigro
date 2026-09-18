/**
 * @milan_4at expert drafts — topic matchers + soft neighbour tone.
 * Never hard-sell; CTA lines are optional and separate from the public reply.
 */

export type Milan4atTopic = {
  id: string;
  label: string;
  /** Note slug on italy.emigro.online */
  noteSlug: string;
  /** Weighted keyword / regex hits (case-insensitive). */
  patterns: RegExp[];
  weight: number;
  /** Public reply body — soft, no Emigro brand, no imperatives. */
  reply: string;
  /** One-line optional soft close (still no “go to Emigro”). */
  softClose?: string;
};

export const MILAN_4AT_TOPICS: Milan4atTopic[] = [
  {
    id: "insurance-vnj",
    label: "Страховка / ВНЖ",
    noteSlug: "meditsina-milano-ssn-tessera-2026",
    weight: 50,
    patterns: [
      /страхов|assicur|waitaly|полис.{0,20}внж|внж.{0,20}страхов|студент.{0,30}страхов|страхов.{0,30}студент/i,
    ],
    reply:
      "Студентам под ВНЖ обычно берут спецполис под permesso (Waitaly и похожие), не обычный travel на неделю. Насколько помню, смотрят чтобы срок и покрытие совпали со списком консульства — у разных стран формулировки плавают.",
  },
  {
    id: "codice-fiscale",
    label: "Codice fiscale",
    noteSlug: "codice-fiscale-milano-2026",
    weight: 55,
    patterns: [
      /codice\s*fiscale|\bcf\b|код[ие]че|налогов\w*\s+код|agenzia\s+entrate|aa4\/?8/i,
    ],
    reply:
      "По codice fiscale в Milano обычно начинают с Agenzia delle Entrate (не Questura). Без него тяжело с contratto, банком и SIM — у многих первая неделя упиралась именно сюда. Если уже есть permesso en trámite, берут с собой ricevuta / kit; без статуса иногда просят AA4/8 или консульский маршрут — зависит от пакета документов на момент визита.",
    softClose: "Если слот/пакет неочевидны — иногда помогает сверить чеклист до похода, а не гадать в очереди.",
  },
  {
    id: "permesso",
    label: "Permesso / Questura",
    noteSlug: "permesso-questura-milano-2026",
    weight: 45,
    patterns: [
      /kit\s*postale|posta\s+e\s+kit|questura|rilascio|rinnovo\s+permesso|8\s*giorn/i,
      /(?:как|где|кто|когда).{0,48}permesso|(?:получить|оформить|продлить)\s+permesso/i,
      /schengen\s*[≠!=]|schengen.{0,20}permesso|permesso.{0,20}schengen/i,
    ],
    reply:
      "Schengen-штамп и permesso — разные вещи; на практике Milano часто идёт через kit postale → Questura, и сроки плавают по сезону. Раньше у многих «ломалось» на неполном kit, просроченной ricevuta или записи не в тот sportello. Имеет смысл сначала сверить, какой именно шаг у вас сейчас (kit / appuntamento / rinnovo), и не смешивать с consular GKS.",
    softClose: "Официальные инструкции Questura лучше перепроверить в день записи — поле в чатах запаздывает.",
  },
  {
    id: "arenda",
    label: "Аренда Milano",
    noteSlug: "arenda-milano-idealista-2026",
    weight: 40,
    patterns: [
      /arenda|аренд|idealista|immobiliare|contratto|caparra|agenzia\s+immobiliare|снять\s+квартир|снять\s+жиль/i,
    ],
    reply:
      "По аренде в Milano на Idealista/Immobiliare часто просят CF + IT IBAN ещё до подписи, а caparra без нормального contratto — классическая ловушка. Раньше работало так: сначала пакет документов, потом просмотр «горячих» вариантов, а не наоборот. Como/Monza — тот же Lombardia-контур по бумагам, но commute и цены другие.",
    softClose: "Если агент торопит с предоплатой без contratto — обычно красный флаг.",
  },
  {
    id: "bank",
    label: "Банк / IBAN",
    noteSlug: "bank-iban-nerezident-italiya-2026",
    weight: 38,
    patterns: [/iban|счет\s+в\s+банк|открыт\w*\s+счет|intesa|unicredit|poste\s+italiane|revolut|wise/i],
    reply:
      "IT IBAN и «иностранный» кошелёк — разные истории для contratto и зарплаты. На поле чаще всплывают Intesa / Poste / UniCredit, но для RU/BY KYC зависит от пакета (CF, permesso/ricevuta, адрес). Раньше у многих отказывали без CF или с одной только ricevuta — лучше уточнить в отделении заранее, какой минимум они ждут именно сейчас.",
  },
  {
    id: "ssn",
    label: "SSN / медицина",
    noteSlug: "meditsina-milano-ssn-tessera-2026",
    weight: 36,
    patterns: [/ssn|tessera\s+sanitaria|medico\s+di\s+base|ats|pronto\s+soccorso|поликлин|медстрахов/i],
    reply:
      "SSN / tessera и medico di base в Milano идут через ATS после статуса, который даёт право на iscrizione — без этого часто остаётся частное или pronto soccorso. Раньше путаница была: «есть permesso en trámite» ≠ автоматически tessera. Имеет смысл сначала понять ваш статус, потом уже выбирать ambulatorio.",
  },
  {
    id: "sim-luce",
    label: "SIM / интернет / luce",
    noteSlug: "sim-internet-luce-milano-2026",
    weight: 34,
    patterns: [/sim\b|tim\b|vodafone|windtre|iliad|luce|gas\b|enel|свет\s+и\s+газ|интернет\s+дома/i],
    reply:
      "SIM часто открывают с паспортом + CF; домашние luce/gas/интернет — уже с contratto и codice fiscale. Раньше у релокантов отваливалось на отсутствии CF или на «туристическом» тарифе, который потом не тянет для адреса. Имеет смысл сначала закрыть связь, потом коммуналку под фактический адрес.",
  },
  {
    id: "passport-gks",
    label: "Паспорт / GKS Milano",
    noteSlug: "zapis-konsulstvo-italiya-pasport-2026",
    weight: 42,
    patterns: [
      /загран|паспорт|gks|kdmid|milan\.mid|консульств|генконсульств|биометр/i,
    ],
    reply:
      "GKS Milano и запись через kdmid — отдельная очередь от Questura. Консульский округ шире Lombardia; слоты на поле часто ловят мониторингом, не «раз в месяц». Путают с Барселоной/Римом — это другие адреса. Имеет смысл сверить услугу на milan.kdmid.ru и пакет до брони, а не после.",
  },
  {
    id: "first-30",
    label: "Первые 30 дней",
    noteSlug: "pervye-30-dnej-v-italii-satelit-2026",
    weight: 30,
    patterns: [/перв\w*\s+(недел|месяц|дни)|только\s+приехал|что\s+делать\s+сначала|чек[\s-]?лист|checklist/i],
    reply:
      "В первые дни обычно цепочка такая: связь → крыша/contratto → codice fiscale → kit/Questura по вашему статусу. Раньше кто прыгал сразу в банк или школу без CF, терял неделю. Порядок зависит от визы, но «сначала быт и CF» почти никого не подводил.",
  },
  {
    id: "districts",
    label: "Районы / Como",
    noteSlug: "milano-rajony-arenda-metro-como-2026",
    weight: 32,
    patterns: [/район|zone\s+\d|navigli|isola|porta\s+romana|como\b|monza|lecco|где\s+жить/i],
    reply:
      "По районам Milano смотрят связку цена / metro / шум, а Como/Monza — как Nord-commute, не «другой мир» по бумагам. Раньше люди выбирали красивый двор без линии метро и потом жалели про зиму. Имеет смысл сначала зафиксировать бюджет и маршрут на работу/школу, потом уже двор.",
  },
  {
    id: "schools",
    label: "Школы / семья",
    noteSlug: "shkoly-semya-milano-como-2026",
    weight: 35,
    patterns: [/школ|scuola|asilo|materna|международн\w*\s+школ|iscrizione\s+scolast/i],
    reply:
      "Scuola pubblica и международные — разные очереди и пакеты; часто просят CF ребёнка/родителей и адрес. Раньше откладывали iscrizione «на потом» и ловили полный набор. Имеет смысл уточнить comune / scuola di competenza по фактическому indirizzo, а не по красивому району на карте.",
  },
  {
    id: "vnj-nomad",
    label: "ВНЖ / nomade / elective",
    noteSlug: "vnj-italiya-nomade-elective-2026",
    weight: 40,
    patterns: [/номад|nomad|elective|residenza\s+elettiva|visto|внж|impatsi|impat/i],
    reply:
      "Каналы въезда (nomade / elective / lavoro) путают даже в чатах — документы и пороги разные, а «у знакомого прошло» редко копируется 1:1. Раньше работало так: сначала тип visto/permesso, потом быт (CF, contratto), не наоборот. Цифры и списки лучше сверять с официальным источником на дату подачи.",
  },
  {
    id: "transport",
    label: "ATM / транспорт",
    noteSlug: "transport-milano-atm-trenord-2026",
    weight: 28,
    patterns: [
      /\batm\b|metro\s+milano|trenord|абонемент|tessera\s+atm|проездн|area\s*[bc]|зон[аы]\s+(?:милан|milan)|евро\s*[45]|euro\s*[45]|парковк|можно\s+ездить|на\s+машине/i,
    ],
    reply:
      "ATM / Trenord и Area B/C — разные слои: туристический билет ≠ месячный, а машина в центре упирается в зоны и парковку. Раньше в выходные Area C обычно спокойнее, чем в будни, но карту comune всё равно глядят перед поездкой. Имеет смысл решить «ехать / метро с окраины» от того, сколько вас и нужен ли центр весь день.",
  },
  {
    id: "piva-inps",
    label: "Partita IVA / INPS",
    noteSlug: "inps-partita-iva-milano-2026",
    weight: 36,
    patterns: [/partita\s*iva|p\.?\s*iva|inps|forfait|режим\s+форфет|открыт\w*\s+ива/i],
    reply:
      "Partita IVA и INPS — не «одна кнопка»: кодекс деятельности, forfettario и взносы зависят от профиля. Раньше люди открывали код «как у друга» и потом правили через коммерциалиста. Имеет смысл сначала набросать деятельность и режим, потом уже портал — и заложить буфер на ошибки кода.",
  },
  {
    id: "food-local",
    label: "Еда / рестораны",
    noteSlug: "zheltye-stranitsy-relokanta-milano-2026",
    weight: 30,
    patterns: [
      /ресторан|кафе|траттори|osteria|trattoria|где\s+поесть|поесть|all\s*you\s*can\s*eat|ayce|ла\s*скала|la\s*scala.{0,40}(еда|ресторан|обед)|бюджетн\w*\s+ресторан/i,
    ],
    reply:
      "У Ла Скалы / Дуомо днём нормальный обед без туристического наценки — лотерея: многие «меню» до ~15–16, AYCE часто режут дневную смену. Раньше спасало отойти на 1–2 квартала от пьяццы или смотреть trattoria с pranzo, а не витрину у театра. Конкретное имя лучше сверить по свежим отзывам — поле в чатах быстро устаревает.",
    softClose: "Если нужен именно слот 14–18 — сначала часы кухни, потом рейтинг.",
  },
];

export const MILAN_4AT_MIN_SCORE = 28;
