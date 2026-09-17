/**
 * Hand-curated Thailand satellite guide — bank account Phuket (gold CORE slot: bank).
 * Bank of Thailand AML/KYC rules separated from branch practice; no bank-name guarantees.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { ThailandEditorialGuide } from "@/lib/community-notes/guides/thailand-editorial-index";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const THAILAND_BANK_PHUKET_SLUG = "bank-schet-phuket-inostrancu-2026";

const GLOSSARY_INTRO =
  "Слова из отделения на Пхукете, из приложения банка и из переписки с арендодателем — разберём до визита, пока менеджер не попросил TM30 или Certificate of Residence, которых ещё нет.";

const LOCAL_GLOSSARY: GlossaryTerm[] = [
  { pt: "savings account", context: "THB", ru: "обычный сберегательный счёт в батах; база для PromptPay и локальных платежей" },
  { pt: "FCD account", ru: "foreign currency deposit — счёт в USD/EUR; отдельный продукт, не всегда нужен на старте" },
  { pt: "Non-Resident Baht Account", context: "NRBA", ru: "нерезидентский бат-счёт; у части банков открывают только в head office, не в каждом филиале" },
  { pt: "PromptPay", ru: "национальная система переводов по номеру телефона или Thai ID; для иностранца чаще только по мобильному" },
  { pt: "TM30", ru: "уведомление immigration об адресе пребывания; обычно подаёт landlord, без него сложнее продления и банки" },
  { pt: "Certificate of Residence", context: "Immigration", ru: "справка о месте жительства из immigration — сильный proof of address для KYC" },
  { pt: "TIN", context: "Tax ID", ru: "10-значный налоговый номер Revenue Department; у иностранца без Thai PIN часто нужен для PIT и иногда спрашивают в банке" },
  { pt: "work permit", ru: "разрешение на работу; для Non-Imm B «чистый» путь к счёту, но не единственный официальный вариант у всех банков" },
];

const glossaryTerms = glossaryForSlug(THAILAND_BANK_PHUKET_SLUG) ?? LOCAL_GLOSSARY;

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryTerms, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Разбор банковских мифов для Пхукета 2026. **OK** = Bank of Thailand (BOT) / Revenue Department; **soft** = филиалы на острове и чаты; **fixed** = смягчено. Не финсовет — condiciones счёта сверяйте в контракте банка. **Ни один бренд (Bangkok Bank, KBank, SCB, Krungthai и т.д.) не гарантирует открытие** — решение принимает конкретный филиал и compliance.",
    ],
    bullets: [
      "OK: финучреждения обязаны идентифицировать клиента, верифицировать данные и при необходимости проверять источник средств ([BOT Notification on Customer Due Diligence](https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2562/EngPDF/25620191.pdf)).",
      "OK: для иностранца базовый ID — паспорт ([BOT rules on account opening](https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2559/EngPDF/25590157.pdf)).",
      "OK: TIN для иностранца без Thai PIN — через Revenue Department; краткий визит ≤14 дней и ≤90 дней в налоговом году может не требовать TIN ([RD — Tax Identification](https://www.rd.go.th/english/21987.html)).",
      "OK: PromptPay для иностранца — регистрация по паспорту и мобильному номеру у ряда банков ([Bangkok Bank PromptPay FAQ](https://www.bangkokbank.com/en/Personal/Digital-Banking/PromptPay)).",
      "Fixed: «любой турист на Патонге откроет счёт за час» → BOT не запрещает формально, но политика крупных банков и AML на практике требуют long-stay основание.",
      "Fixed: «DTV = автоматически банк» → категория визы ≠ автоматическое одобрение; soft, зависит от филиала.",
      "Soft: усиленный KYC для паспорта РФ/РБ — origen средств, SWIFT, иногда отказ без письменной причины.",
    ],
  },
  {
    heading: "Официально: зачем THB-счёт и что задаёт BOT",
    section_kind: "official",
    paragraphs: [
      "Счёт в тайском банке под надзором Bank of Thailand — не «удобство expat-блога», а инфраструктура для аренды, коммуналки, зарплаты от Thai employer, покупки condo по foreign quota и локальных переводов. BOT не публикует единый чеклист «паспорт X + виза Y = да» для всех банков: он задаёт стандарты идентификации, due diligence и внутренние процессы финучреждений. Каждый банк вправе ужесточить требования сверх минимума — особенно по адресу, цели счёта и источнику средств.",
      "Официально иностранец открывает счёт лично в филиале (удалённое открытие из-за рубежа крупные банки, включая Bangkok Bank, не предлагают). Non-Resident Baht Account и FCD — отдельные продукты с другими правилами и иногда другим местом обслуживания. Для быта на Пхукете большинству релокантов нужен обычный THB savings/current, мобильный банкинг и при возможности PromptPay.",
    ],
    bullets: [
      "KYC/CDD: паспорт, верификация личности, актуальный адрес, purpose of account.",
      "AML: крупные inbound переводы, наличные, крипто без paper trail — триггеры доп. проверки.",
      "Личное присутствие в филиале — норма; «агент откроет без вас» — red flag.",
    ],
  },
  {
    heading: "Официально: паспорт, виза, TM30, адрес, телефон",
    section_kind: "official",
    paragraphs: [
      "Базовый пакет почти everywhere: оригинал паспорта (часто требуют срок действия 6+ месяцев), действующий штамп/виза, подтверждение адреса в Таиланде и мобильный номер, зарегистрированный на ваше имя. Bangkok Bank для иностранцев указывает варианты: work permit, заверенная копия паспорта в посольстве, либо документы на condo/S&P agreement — это иллюстрация, что **альтернативы work permit существуют на уровне продукта банка**, но филиал всё равно может отказать.",
      "TM30 — регистрация адреса в Immigration (обычно подаёт арендодатель или отель). Сам по себе TM30 не всегда принимают как «адрес для банка», но без цепочки registration сложнее Certificate of Residence и продления визы. Для адреса банки чаще хотят lease agreement, utility bill на ваше имя, house registration (если есть) или Certificate of Residence из immigration. Адрес отеля или абстрактный «post office box» типично не проходят.",
      "Thai mobile number, зарегистрированный на данные из паспорта, — практически обязателен для OTP, mobile banking и PromptPay. SIM tourist иногда не совпадает с именем в паспорте — это частая причина «вернитесь в другой день с другим номером».",
    ],
    bullets: [
      "Non-Imm B / O / ED / LTR / Elite / retirement — разные продукты банков; не путать с безвизом 30 дней.",
      "Work permit — самый прямой путь для salary account, но не единственный документ в официальных списках.",
      "Lease + TM30 + CoR — типичная связка к 2–4 месяцу жизни на острове.",
    ],
  },
  {
    heading: "Налоговый резидент, TIN и банк",
    section_kind: "official",
    paragraphs: [
      "Revenue Department: иностранец без Thai PIN (гражданская регистрация) generally должен получить TIN для целей налогового учёта, если подпадает под обязанность. Налоговый резидент — проживание более 180 дней в календарном году; резидент отчитывается по доходам из источников в Таиланде и по части зарубежного дохода, ввезённого в страну ([RD — Personal Income Tax](https://rd.go.th/english/6045.html)).",
      "На открытии счёта TIN не всегда спрашивают в первый день, но к 4–6 месяцу при регулярных SWIFT, аренде через agency, работе с Thai counterparties или подаче на продление визы номер часто всплывает. Имеет смысл получить TIN заранее в area revenue office по месту domicile — для физлица допускается подача в любом area office.",
    ],
    bullets: [
      "TIN — 10 цифр; не путать с 13-значным форматом в Thai-only сервисах проверки.",
      "Краткий турист ≤14 дней за визит и ≤90 дней в году — исключение из обязанности подавать на TIN (RD).",
      "Банк и RD — разные ведомства; «нет TIN» не отменяет KYC банка.",
    ],
  },
  {
    heading: "PromptPay, карты, переводы и комиссии",
    section_kind: "official",
    paragraphs: [
      "PromptPay привязывает THB savings/current к Thai mobile number (иностранцы обычно не регистрируют Thai Citizen ID). Регистрация — в филиале или digital-каналах банка после открытия счёта; нужны passbook, паспорт, номер телефона и SMS OTP. Joint-счета и FCD в PromptPay не участвуют.",
      "Дебетовая карта Visa/Mastercard на THB-счёте — оплата в 7-Eleven, Grab, клиниках, части аренды. МИР в Таиланде ограничен; UnionPay встречается точечно. SWIFT inbound/outbound — отдельные комиссии и FX; Bangkok Bank historically силён в international transfers, но тарифы сверяйте в tariff sheet филиала.",
      "Лимиты снятия в ATM и daily transfer caps задаёт банк + ваш KYC tier — в приложении, не в expat-форуме.",
    ],
    bullets: [
      "PromptPay — P2P и QR для быта; не заменяет SWIFT для крупных сумм из РФ/ОАЭ.",
      "Mobile banking — часто только после очного KYC и активации в филиале.",
      "FCD — если доход в USD/EUR и частые конвертации; открывают не всем с первого визита.",
    ],
  },
  {
    heading: "Пхукет: визы, филиалы и матрица (без гарантий)",
    section_kind: "practice",
    paragraphs: [
      "На Пхукете (Patong, Phuket Town, Chalong, Rawai) исход **зависит от менеджера филиала**, типа визы и полноты пакета — не от «рейтинга банка в статье». Маркетинговые страницы LH Bank, Bangkok Bank, KBank описывают продукты для foreigners, но это верхний потолок возможного, не обещание для вашего паспорта.",
      "Безвиз 30 дней (для РФ с 15.09.2026 — двустороннее соглашение) и tourist visa в 2025–2026 в крупных сетях **часто не принимают** для нового счёта — soft по чатам и консультантам, при этом BOT не содержит blanket visa ban. DTV, Non-Imm O, Elite, LTR, retirement O-A, Non-Imm B с work permit — статистически чаще проходят, но DTV на практике не везде признают как «достаточно долгий» статус.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "russianinphuket"],
        period: "2025–2026",
        claim:
          "на Пхукете отказ с tourist stamp в центральных филиалах — норма; успех чаще после Non-Imm, Elite или lease + CoR",
        forReader: "не планируйте аренду и школу только на зарубежной карте — заложите 2–4 недели на пакет адреса",
      }),
      "Bangkok Bank — часто упоминают для SWIFT и property-related opening; **не гарантия** на Rawai vs Phuket Town.",
      "KBank — в Бангкоке открывают часть Non-Imm B без work permit; на Пхукете политика может отличаться — plan B филиал.",
      "SCB / Krungthai / TTB — те же BOT-правила, другой branch mood; «лучший банк» из SEO-статьи не копируйте.",
      "Посредники «100% открытие за 50k THB» — проверяйте, что вы подписываете; счёт всё равно на ваше имя и ваш KYC.",
    ],
  },
  {
    heading: "KYC для граждан РФ/РБ: усиленный compliance",
    section_kind: "practice",
    paragraphs: [
      "Паспорт РФ или РБ не создаёт автоматический запрет в BOT, но Thai banks в усиленном AML-режиме оценивают country risk, санкционные списки, correspondent banking и происхождение средств. Крупный перевод из РФ, наличные, криптобиржи без выписки, «третьи лица» на SWIFT — типичные stop factors.",
      "Подготовьте письменное объяснение на EN: remote salary, продажа актива, savings, pension — плюс выписки 3–6 месяцев на EN. При треке РФ + ОАЭ/Турция/другая страна банк может запросить доп. документы или SWIFT Authenticate / notarized passport copy — как в официальных альтернативах Bangkok Bank для property track.",
      "Отказ без explanation случается — просите список недостающих документов письменно (email/line официальный канал банка), идите в другой филиал или другой банк. Не врать про адрес или источник — блокировка счёта и STR хуже отказа на входе.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["thailand_chatik", "pkhuket2"],
        period: "2025–2026",
        claim:
          "россияне с LTR/Elite и нормальным lease чаще проходят, чем с одним DTV без CoR; отказы с формулировкой «policy» без деталей — идти в соседний банк",
        forReader: "держите второй мост (Revolut/Wise) до стабильного THB-счёта",
      }),
      "Санкции и correspondent routes меняются — SWIFT из РФ может идти дольше или возвращаться; это не «банк Пхукета против вас», а цепочка банков-корреспондентов.",
      "РБ: похожий профиль риска; UA/KZ — case-by-case, но lease + long-stay visa остаётся базой.",
    ],
  },
  {
    heading: "Revolut, Wise и иностранные карты: что реально мостит",
    section_kind: "practice",
    paragraphs: [
      "До THB-счёта Revolut / Wise / карта банка страны резидентства закрывают часть быта: оплата Grab, Booking, страховки, онлайн-школы, депозит аренды если landlord принимает SWIFT/card. Это **мост**, не замена local account: PromptPay на иностранную карту не повесить; часть агентств и juristic person просят перевод на Thai account; комиссия FX и лимиты KYC fintech бьют по семейному бюджету.",
      "Revolut с TH/EU профилем и российским гражданством — отдельный риск блокировок по правилам эмитента; не делайте его единственным каналом на 6+ месяцев с детьми и арендой. Карты UAE/Turkey/Armenia — рабочий временный слой, пока собираете TM30, lease и визу.",
    ],
    bullets: [
      "Мост: foreign card + cash THB из обменника (осторожно с лимитами и proof of source при последующем KYC).",
      "Не мост: «PromptPay через посредника» с чужим счётом — AML-риск для всех сторон.",
      "К 4–6 месяцу цель — свой THB + PromptPay + mobile banking; fintech оставить для EUR/USD.",
    ],
  },
  {
    heading: "Пошагово: месяц 1 и к 4–6 месяцу",
    section_kind: "action_guide",
    paragraphs: [
      "Сценарий A — вы уже на long-stay визе с lease. Сценарий B — безвиз/турист, банк отложен до статуса. Не смешивайте чеклисты.",
      "К **4–6 месяцу** на Пхукете проверьте: активный THB-счёт или осознанный plan B; PromptPay на ваш номер; TM30 актуален; TIN при доходе/180+ днях; SWIFT-реквизиты сохранены; debit card работает в ваших типичных merchant; второй канал (foreign) не единственный. Если счёт так и не открыт — пересмотрите визу, CoR и филиал до продления rent/school contract.",
    ],
    bullets: [
      "1 — Thai SIM на имя из паспорта (True/dtac/AIS); OTP-ready.",
      "2 — Lease ≥6–12 мес., TM30 от landlord, копии для банка.",
      "3 — Immigration: Certificate of Residence (если готовы ждать очередь).",
      "4 — Пакет: паспорт, виза, lease, CoR/TM30, выписки, letter purpose (rent/utilities/salary).",
      "5 — Plan A филиал + plan B другой банк в тот же trip-week; утро буднего дня.",
      "6 — Открытие → passbook → mobile app → PromptPay registration.",
      "7 — Месяц 4–6: annual KYC reminder, обновить адрес/телефон в банке при переезде района.",
    ],
  },
  {
    heading: "Где сайт, SEO и отделение расходятся",
    section_kind: "gap",
    paragraphs: [
      "Expat-статьи 2020 года про «tourist account на Патонге» противоречат текущему AML и branch policy. BOT PDF не запрещает иностранцам счёт, но не обязывает банк открыть его с одним штампом безвиза.",
    ],
    bullets: [
      "«KBank лучший для всех» → на Пхукете outcome ≠ Bangkok HQ case.",
      "«Bangkok Bank откроет по condo S&P» → нужен пакет, trusted developer letter — soft approve.",
      "«DTV = bank ready» → fixed: не универсально.",
      "«Revolut хватит навсегда» → fixed: PromptPay, agency, некоторые schools — local THB.",
      "«Агент гарантирует SCB» → нет универсальной гарантии; только ваш KYC.",
      "Письмо банка о re-KYC → ответить, иначе freeze; не игнорировать email из спама.",
    ],
  },
  {
    heading: "Типичные ошибки и сроки: банк на Пхукете",
    section_kind: "practice",
    paragraphs: [
      "Ошибки month 1–6 из Phuket-чатов и отказов compliance: не те документы, неверный порядок шагов, один филиал без plan B. Ниже — что переносит открытие счёта на недели без нарушения BOT.",
    ],
    bullets: [
      "Идти в банк до lease/TM30 и ждать «сделают по паспорту» — tourist stamp часто stop на входе.",
      "SIM не на имя из паспорта — OTP и mobile banking не активируют; сначала True/dtac/AIS с KYC.",
      "Один визит в «лучший по SEO» банк без второго филиала — отказ policy без списка docs.",
      "Крупный SWIFT сразу после открытия без source-of-funds letter — freeze или STR вместо «быстрого счёта».",
      "Игнор re-KYC email — блокировка операций; обновляйте адрес при смене района Rawai → Phuket Town.",
    ],
  },
  {
    heading: "Следующий шаг Emigro",
    section_kind: "practice",
    paragraphs: [
      "Если виза, TM30 и банк блокируют друг друга, сверьте маршрут на [Emigro Wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=bank-phuket&utm_content=bank-schet-phuket-inostrancu-2026). Для разбора отказа филиала и plan B по статусу — [Route Check Assist](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=bank-phuket&utm_content=bank-schet-phuket-inostrancu-2026). Pillar: [Таиланд для россиян 2026](/ru/guides/tailand-dlya-rossiyan-2026).",
    ],
    bullets: [
      "Не начинайте с посредника, пока не собрали lease и long-stay основание.",
      "Два банка за одну поездку в Phuket Town дешевле, чем неделя border run.",
    ],
  },
];

const keyTakeaways = [
  "Официально: BOT требует KYC/CDD и верификацию личности; паспорт — базовый ID; открытие лично в филиале; TIN — через RD для иностранцев без Thai PIN при наличии обязанности.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "russianinphuket"],
    period: "2025–2026",
    claim:
      "на Пхукете без long-stay визы и адреса новый THB-счёт в крупных сетях часто недоступен; DTV и Elite — не автоматический pass",
    forReader: "lease + TM30 + CoR + два банка plan A/B; ни один бренд не обещаем",
  }),
  "PromptPay и mobile banking идут после THB savings; Revolut/Wise — мост до local счёта, не замена к 4–6 месяцу.",
  "RU/BY: усиленный source-of-funds; SWIFT и correspondent risk; отказ — другой филиал/банк, не подделка адреса.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли открыть счёт на безвиз 30 дней или tourist visa?",
    a: "По правилам BOT нет общего запрета для иностранца с паспортом. На практике крупные банки на Пхукете в 2025–2026 обычно требуют long-stay non-immigrant, Elite, LTR или сопоставимый пакет с адресом; tourist stamp — частый отказ.",
  },
  {
    q: "Какой банк на Пхукете «самый простой» для россиянина?",
    a: "По правилам все licensed banks под одним BOT-надзором. На практике исход зависит от филиала, визы и lease — мы не обещаем, что именно Bangkok Bank, KBank или SCB откроют счёт; готовьте два plan A/B.",
  },
  {
    q: "Нужен ли TM30 для банка?",
    a: "По правилам TM30 — immigration registration, не банковский документ. На практике без TM30 сложнее CoR и продления; банк чаще просит lease или CoR, а TM30 помогает собрать цепочку адреса.",
  },
  {
    q: "Хватит ли Revolut до PromptPay и аренды?",
    a: "По правилам аренда может идти через SWIFT/card. На практике PromptPay, часть agency и локальный быт требуют THB-счёт; к 4–6 месяцу local account или осознанный plan B обязателен.",
  },
  {
    q: "Нужен ли TIN при открытии счёта?",
    a: "По правилам RD TIN нужен иностранцам без Thai PIN при наличии налоговой обязанности; краткий турист ≤90 дней в году может быть exempt. На практике банк может не спросить в день 1, но при доходе и 180+ днях получите TIN заранее.",
  },
  {
    q: "Что делать при отказе compliance?",
    a: "Письменный список недостающих документов → другой филиал → второй банк → пересмотр визы/CoR. Не покупайте «чужой счёт»; держите Revolut/Wise как мост.",
  },
];

export const THAILAND_BANK_PHUKET_GUIDE: ThailandEditorialGuide = {
  slug: THAILAND_BANK_PHUKET_SLUG,
  category: "Банки",
  content_kind: "guide" as ContentKind,
  title: "Банковский счёт на Пхукете для иностранца: 2026",
  excerpt:
    "BOT, KYC, TM30, TIN, PromptPay и усиленный compliance для RU-паспорта: как открыть THB-счёт на Пхукете без мифов про «лучший банк» и что мостит Revolut к 4–6 месяцу.",
  seo_title: "Банк Пхукет 2026 — счёт иностранцу THB",
  seo_description:
    "Счёт в банке Пхукета 2026: BOT KYC, виза, TM30, TIN, PromptPay, SWIFT, RU compliance. Bangkok Bank, KBank — без гарантий; Revolut как мост к 4–6 месяцу.",
  quick_answer:
    "Bank of Thailand обязывает банки проводить KYC и верифицировать личность; счёт открывают лично в филиале, обычно с паспортом, long-stay визой или сопоставимым основанием, адресом в Таиланде и Thai mobile. Tourist/безвиз 30 дней на Пхукете в 2025–2026 часто не хватает для нового THB-счёта. PromptPay — после savings account; TIN — через Revenue Department при налоговой обязанности. Паспорт РФ не «запрещён», но усиливает проверку источника средств. Ни один named bank не гарантируем; Revolut/Wise — мост до local счёта к 4–6 месяцу.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Bank of Thailand — Customer Due Diligence (Notification)", url: "https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2562/EngPDF/25620191.pdf" },
    { title: "Bank of Thailand — Account opening rules (Notification)", url: "https://www.bot.or.th/content/dam/bot/fipcs/documents/FPG/2559/EngPDF/25590157.pdf" },
    { title: "Revenue Department — Tax Identification (TIN)", url: "https://www.rd.go.th/english/21987.html" },
    { title: "Bangkok Bank — Foreign customers FAQ", url: "https://www.bangkokbank.com/en/Personal/Other-Services/Foreign-Customers/Faqs" },
    { title: "Bangkok Bank — PromptPay for foreigners", url: "https://www.bangkokbank.com/en/Personal/Digital-Banking/PromptPay" },
  ],
  topic_tags: ["bank", "phuket", "thailand"],
  hashtags: buildNoteHashtags({
    topicTags: ["bank", "phuket", "thailand"],
    contentKind: "guide",
    extra: ["promptpay", "tm30", "tin", "kyc", "revolut", "thb"],
  }),
  source_channel: "nashi_phuket_chat+russianinphuket+thailand_chatik",
  source_label: "editorial:bank-phuket-gold-2026",
  pillar_guide_slug: "tailand-dlya-rossiyan-2026",
};

export default THAILAND_BANK_PHUKET_GUIDE;
