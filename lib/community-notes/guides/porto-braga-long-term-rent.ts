/**
 * Hand-curated guide — voice «Опытный релокант за кофе»
 * (lib/community-notes/editorial-voice.ts; warm relocant-blogger rhythm, style-only).
 * - quick_answer: demystify / сцена + 2 факта
 * - key_takeaways: max 4; glossary 8–10 с literary intro
 * - Each section: «зачем вам это сейчас» + «Что/Зачем» + «Главное: …»
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import { NORTE_CLIMATE_COMFORT_SLUG } from "@/lib/community-notes/guides/norte-climate-comfort";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PORTO_BRAGA_LONG_TERM_RENT_SLUG = "arenda-dolgosrok-porto-braga-2026";

const RENT_GLOSSARY_INTRO =
  "Слова, которые услышите в contrato, в переписке с senhorio и в Multibanco — разберём заранее, пока не пришло «переведите на этот IBAN» без пояснений.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PORTO_BRAGA_LONG_TERM_RENT_SLUG)!, RENT_GLOSSARY_INTRO),
  },
  {
    heading: "Официально: кому платить по договору аренды",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: в Norte четыре получателя денег — и путаница с IBAN стоит вам morada, recibo и спокойного сна.",
      "Что делать: сверить contrato de arrendamento — кто senhorio, кто imobiliária, включён ли condomínio в renda.",
      "Зачем: перевод «не туда» не считается оплатой; Finanças и AIMA смотрят на зарегистрированный договор, не на переписку в WhatsApp.",
      "Главное: renda — senhorio (proprietário); condomínio и registo contrato — отдельные строки и часто отдельные IBAN.",
    ],
    bullets: [
      "Senhorio (proprietário) — ежемесячная renda на IBAN из contrato; в назначении: morada + mês (например «Renda T2 Rua X — julho 2026»).",
      "Imobiliária — если ведёт contrato: honorários (часто 1 mes renda + IVA) и иногда сбор rent; уточните, кто выдаёт recibo de renda.",
      "Administrador de condomínio — condomínio отдельно от renda; IBAN в уведомлении или atas assembleia; не смешивайте с платежом senhorio.",
      "Finanças — taxa registo contrato (не ежемесячная renta); с 1.08.2025 inquilino может зарегистрировать contrato, если senhorio не сделал за месяц (lepta/por_tugal, 2025).",
      "IMI и água/luz/internet — по contrato: IMI обычно senhorio; коммуналки часто на имя inquilino после assinatura.",
    ],
  },
  {
    heading: "Официально: как платить renda и сопутствующие суммы",
    section_kind: "official",
    paragraphs: [
      "Зачем вам это сейчас: без PT IBAN и trace платежа senhorio может «не видеть» оплату — а вы без recibo для Finanças и AIMA.",
      "Что делать: открыть conta à ordem с IBAN PT50… и платить transferência bancária; требовать recibo de renda каждый месяц.",
      "Зачем: наличные и MB Way без recibo — слабое доказательство; для IRS-вычета арендатору нужен зарегистрированный contrato.",
      "Главное: первый платёж при assinatura — caução + первый/последний mes; дальше — только по реквизитам из contrato.",
    ],
    bullets: [
      "Transferência bancária — основной способ: IBAN senhorio + descrição (morada, mês, «renda»); сохраняйте comprovativo в PDF.",
      "Multibanco — если senhorio даёт entidade/referência (реже для долгосрочной renta); удобно для taxa Finanças и condomínio с referência.",
      "MB Way — иногда для мелких сумм или caução; для ежемесячной renda не типично; Revolut с PT IBAN поддерживает MB Way (por_tugal, 2025).",
      "Первый платёж: caução (обычно 1–2 meses) + renda adiantada (1–2 meses) + honorários imobiliária; не переводите до подписи contrato.",
      "Recibo de renda — требуйте ежемесячно с NIF обеих сторон; без recibo сложнее доказать morada и право на IRS deduction.",
    ],
  },
  {
    heading: "Порту: Foz, Matosinhos, Bonfim — бюджеты и кому платить на практике",
    section_kind: "practice",
    paragraphs: [
      "Что делать: выбрать bairro под бюджет и commute, сверить в contrato — condomínio включён или отдельный IBAN administrador.",
      "Зачем: в Foz renda выше, но condomínio в prédio de luxo может добавить €80–150/мес сверху; в Bonfim чаще старый prédio без administrador.",
    ],
    bullets: [
      "Foz do Douro — T2 €1 100–1 600/мес (Idealista 2026); renda senhorio, condomínio отдельно €60–120; imobiliária в Foz часто берёт 1 mes + IVA.",
      "Matosinhos — T2 €900–1 300; участники @lepta в 2025 писали, что пляж периодически закрывают, зато renda на 10–20% ниже Foz; проверьте, кто платит água condomínio.",
      "Bonfim / Campanhã — T2 €750–1 100; Metro 10–15 мин до centro; senhorio часто частник — перевод на IBAN pessoal, recibo вручную.",
      "Cedofeita / Clérigos — центр, шум; condomínio в histórico выше из-за manutenção fachada; уточните atas до assinatura.",
      "На практике @por_tugal: Idealista + Rentalia — один агрегатор с 2025; фильтруйте arrendamento, не férias/AL.",
      "Замкнутый круг NIF↔morada↔банк: см. [открытие счёта](/notes/kak-otkryt-bankovskiy-schet-portugalia-2026) и [первый месяц](/notes/pervyj-mesyac-portugaliya-checklist).",
    ],
  },
  {
    heading: "Брага: centro, Gualtar — бюджеты и платежи",
    section_kind: "practice",
    paragraphs: [
      "Что делать: сравнить Braga centro и Gualtar по renda + commute; в Minho condomínio часто ниже Porto, но heating elétrico зимой — отдельная статья.",
      "Зачем: экономия на renta съедается, если ездите в Porto каждый день; для жизни в Braga платите местному senhorio, не «посреднику из Lx».",
    ],
    bullets: [
      "Braga centro — T2 €700–1 000/мес; senhorio + administrador condomínio (если prédio com elevador) — два IBAN в contrato или annex.",
      "Gualtar — T2 €650–950; рядом с CLIB; expat-плотность ниже Porto; imobiliária реже, чаще прямой senhorio.",
      "Guimarães / Viana — lepta/Idealista Q2 2025: спрос на аренду растёт, цены ниже Porto; renda €600–900 T2, commute до Porto 45–60 мин.",
      "Сравнение бюджетов Norte: подробнее в [Порту vs Брага](/notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + ") — те же ориентиры по районам.",
      "AIMA Norte: comprovativo morada из registo contrato; с 2025 могут просить declaração senhorio (lepta, 2025) — заложите в переговоры.",
    ],
  },
  {
    heading: "Пошагово для новичка: от Idealista до первого recibo",
    section_kind: "action_guide",
    paragraphs: [
      "Зачем вам это сейчас: без порядка шагов вы переведёте caução до проверки senhorio и останетесь без registo в Finanças.",
      "Что делать: поиск → просмотр → contrato → оплата → registo → ежемесячные transferências с recibo.",
      "Зачем: registo contrato даёт morada для NIF, SNS, AIMA; с 08.2025 inquilino может зарегистрировать сам, если senhorio тянет.",
      "Главное: не платите caução без NIF обеих сторон в contrato и certidão permanente / ID senhorio.",
    ],
    bullets: [
      "Шаг 1 — Поиск: Idealista.pt + Rentalia (por_tugal, 2025); фильтр arrendamento, freguesia Foz/Matosinhos/Bonfim/Braga/Gualtar.",
      "Шаг 2 — Просмотр: вода, luz, humidade, bolor — чеклист в [климат Norte](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + "); сфотографируйте углы до assinatura.",
      "Шаг 3 — Contrato: NIF inquilino и senhorio, caução (1–2 meses), fiador или предоплата; сверьте [аренду до подписи](/notes/arenda-lissabon-do-podpisi).",
      "Шаг 4 — Первый платёж: caução + renda adiantada на IBAN из contrato; descrição с morada; не наличные без recibo.",
      "Шаг 5 — Registo Finanças: senhorio или вы после 30 дней (lepta, 08.2025); нужен для morada и IRS.",
      "Шаг 6 — Ежемесячно: transferência до даты в contrato → recibo de renda → condomínio на IBAN administrador (если не в renda).",
    ],
  },
  {
    heading: "Где портал и чат расходятся с договором",
    section_kind: "gap",
    bullets: [
      "Idealista: «много квартир в Porto» → lepta Q2 2025: Lisboa и Porto вне топ-50 спроса — конкуренция в Foz высокая, Braga/Matosinhos дешевле.",
      "Объявление: «condomínio incluído» → на деле cap на расходы или отдельный IBAN administrador с 2-й месяца.",
      "Senhorio: «скидывайте на MB Way» → для долгосрочной renta без recibo вы в зоне риска; настаивайте на transferência + recibo.",
      "Imobiliária: «комиссия с обеих сторон» → в Norte чаще платит inquilino 1 mes; сверьте honorários до брони.",
      "«Fiador не нужен» в чате → на практике без PT fiador просят 2–3 meses adiantado + caução (chatlisboa, 2026).",
      "Registo contrato: «сделает senhorio» → если нет через месяц — регистрируйте сами на Portal das Finanças (por_tugal, 08.2025).",
      "Renda 2026: lepta (08.2025) — индексация ~2,2% по INE; senhorio обязан уведомить, не «тихо» поднять в MB Way.",
      "Банк: «Revolut хватит» → для contrato и caução часто требуют PT IBAN; Revolut с PT IBAN + MB Way — мост, не замена morada (por_tugal, 2025).",
    ],
  },
  {
    heading: "Типичные ошибки с платежами и morada",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: за 2–3 месяца до переезда — поиск на Idealista; за 2 недели — просмотры; в день assinatura — caução с trace; в первый месяц — registo Finanças.",
    ],
    bullets: [
      "Ошибка: перевод caução на личный MB Way без NIF в contrato — нет защиты при споре.",
      "Ошибка: платить condomínio на IBAN senhorio — administrador не видит оплату, долг копится.",
      "Ошибка: не требовать recibo de renda — без него слабый comprovativo для AIMA и IRS.",
      "Ошибка: игнорировать registo contrato — morada не обновится в Finanças; с 08.2025 можно зарегистрировать самим.",
      "Ошибка: один платёж «caução+renda+condomínio» без разбивки — при споре не докажете, что оплатили renda.",
      "Ошибка: аренда в Bonfim без осмотра humidade — к осени bolor и спор с senhorio; см. [климат Norte](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + ").",
      "Ошибка: ждать PT банк для просмотра — NIF + онлайн-счёт первым шагом; детали в [аренда первый месяц Lx](/notes/arenda-kvartiry-lisbon-pervyi-mesyac-2026) (те же правила оплаты).",
    ],
  },
];

const keyTakeaways = [
  "Официально: renda — senhorio (IBAN из contrato); condomínio — administrador; Finanças — taxa registo, не ежемесячная renta.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta"],
    period: "2025–2026",
    claim:
      "ежемесячную renda (аренду) обычно платят transferência bancária (банковским переводом) с recibo de renda каждый месяц",
    forReader: "первый платёж при assinatura (подписании) — caução (депозит) + adiantamento (предоплата) за месяц",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "аренда T2 в 2026: Foz €1 100–1 600, Matosinhos €900–1 300, Bonfim €750–1 100, Braga €700–1 000, Gualtar €650–950",
    forReader: "сравнивайте не только renda, но и condomínio (взнос в дом) — он идёт отдельным переводом",
  }),
  "Расхождение: без registo contrato в Finanças morada «не существует» — с 08.2025 inquilino может зарегистрировать сам после 30 дней.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Кому переводить ежемесячную аренду в Porto/Braga?",
    a: "Senhorio (proprietário) — на IBAN из contrato de arrendamento. Если imobiliária ведёт сбор — уточните, кто выдаёт recibo. Condomínio — на IBAN administrador, не смешивайте с renda. На практике в descrição указывайте morada и mês.",
  },
  {
    q: "Как платить аренду: Multibanco, MB Way или перевод?",
    a: "Обычно transferência bancária на IBAN PT50… — основной способ для долгосрочной renta. Multibanco по entidade/referência senhorio даёт реже. MB Way — для мелких сумм; для ежемесячной renda требуйте recibo. См. [банковский счёт](/notes/kak-otkryt-bankovskiy-schet-portugalia-2026).",
  },
  {
    q: "Сколько платить при подписании contrato?",
    a: "Типично: caução 1–2 meses + renda 1–2 meses вперёд + honorários imobiliária (до 1 mes + IVA). В Foz закладывайте €4 000–8 000 на старте. Не переводите до проверки NIF senhorio и [чеклиста до подписи](/notes/arenda-lissabon-do-podpisi).",
  },
  {
    q: "Нужен ли recibo de renda каждый месяц?",
    a: "Да. Recibo с NIF обеих сторон — доказательство оплаты для IRS и morada. Без recibo senhorio формально может оспорить платёж. Сохраняйте PDF comprovativo transferência + recibo.",
  },
  {
    q: "Кто платит condomínio и как?",
    a: "По contrato — часто inquilino отдельно от renda. IBAN administrador de condomínio в уведомлении или atas. Перевод с назначением «condomínio + morada + mês». Не отправляйте condomínio на IBAN senhorio без письменного подтверждения.",
  },
  {
    q: "Может ли арендатор сам зарегистрировать договор в Finanças?",
    a: "С 1 августа 2025 — да, если senhorio не зарегистрировал за месяц после начала arrendamento (lepta/por_tugal, 2025). Нужны данные contrato и NIF сторон. Registo — не ежемесячная плата, а разовая taxa и ключ к morada.",
  },
  {
    q: "Где искать долгосрочную аренду в Norte?",
    a: "Idealista.pt и Rentalia (интеграция с 2025). Районы: Foz, Matosinhos, Bonfim (Porto), Braga centro, Gualtar. Бюджеты и commute — в [Порту vs Брага](/notes/" + PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG + "). Осмотр на влажность — [климат Norte](/notes/" + NORTE_CLIMATE_COMFORT_SLUG + ").",
  },
];

export const PORTO_BRAGA_LONG_TERM_RENT_GUIDE = {
  slug: PORTO_BRAGA_LONG_TERM_RENT_SLUG,
  category: "Аренда",
  content_kind: "guide" as ContentKind,
  title: "Долгосрочная аренда в Порту и Браге 2026: кому платить, как платить, районы и бюджеты",
  excerpt:
    "Senhorio, imobiliária, condomínio, Finanças — кому и как платить за аренду в Norte. IBAN, transferência, recibo, caução, Idealista и районы Foz, Matosinhos, Bonfim, Braga, Gualtar.",
  seo_title: "Аренда Porto/Braga 2026 — кому и как платить",
  seo_description:
    "Долгосрочная аренда в Порту и Браге: senhorio, condomínio, IBAN, transferência, recibo de renda, caução, registo Finanças. Foz, Matosinhos, Gualtar — бюджеты 2026.",
  quick_answer:
    "Первый вечер в Bonfim: senhorio присылает IBAN и просит «caução + dois meses» на MB Way — и вот уже паника «а это вообще законно?». Спокойно: в Norte renda идёт senhorio (proprietário), condomínio — отдельно administrador, Finanças — разовая taxa registo contrato. Платите transferência bancária с morada в descrição и требуйте recibo de renda каждый месяц — без recibo вы «невидимы» для IRS и AIMA.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Portal das Finanças — arrendamento", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "Idealista — arrendar casas", url: "https://www.idealista.pt/arrendar-casas/" },
    { title: "Rentalia", url: "https://www.rentalia.com/" },
    { title: "Banco de Portugal — IBAN", url: "https://www.bportugal.pt/" },
    { title: "AIMA", url: "https://aima.gov.pt/" },
  ],
  topic_tags: ["arenda", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal"],
    contentKind: "guide",
    extra: ["porto", "braga", "norte", "foz", "matosinhos", "bonfim", "gualtar", "renda", "iban"],
  }),
  source_channel: "chatlisboa+por_tugal+autolife_pt+lepta",
  source_label: "editorial:porto-braga-rent+voice-pass",
};
