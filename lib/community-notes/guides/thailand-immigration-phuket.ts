/**
 * Hand-curated Thailand satellite guide — Immigration Phuket (CORE: residence_appointment).
 * TM30, 90-day report, extension, re-entry; appointment vs walk-in separated from e-Visa routes.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import type { ThailandEditorialGuide } from "@/lib/community-notes/guides/thailand-editorial-index";
import type { CommunityNoteFaq, ContentKind, GlossaryTerm, NoteBodySection } from "@/lib/community-notes/types";

export const IMMIGRATION_PHUKET_SLUG = "immigration-phuket-tm30-90-days-2026";

const PILLAR_SLUG = "tailand-dlya-rossiyan-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "TM30", ru: "уведомление адреса: подаёт владелец/управляющий жильём, когда иностранец вселяется или возвращается после выезда" },
  { pt: "TM47", ru: "форма 90-day report — личная отчётность иностранца каждые 90 дней непрерывного пребывания" },
  { pt: "Extension of stay", ru: "продление штампа/разрешения на пребывание в Immigration по основанию визы, не «новая виза»" },
  { pt: "Re-entry permit", ru: "разрешение выехать и вернуться без потери текущего статуса (single / multiple)" },
  { pt: "Permit of stay", ru: "срок, который officer поставил при въезде или после extension; ≠ длина визы в паспорте" },
  { pt: "Thailand e-Visa", ru: "подача визы до поездки на thaievisa.go.th; не заменяет TM30 и 90-day внутри страны" },
  { pt: "Queue Online", ru: "электронная очередь Phuket Immigration для части услуг; слот ≠ гарантия приёма без пакета" },
  { pt: "DTV / LTR / Privilege", ru: "три разных long-stay контура: e-Visa nomad, BOI LTR, платная membership — не смешивать документы" },
];

const DISCLAIMER =
  "**Emigro — не юридическая консультация.** Сроки штампов, онлайн-порталы и списки документов **меняются**. Сверяйте [immigration.go.th](https://www.immigration.go.th/), [phuketimmigration.go.th](http://www.phuketimmigration.go.th/) и [thaievisa.go.th](https://www.thaievisa.go.th/) на дату визита. Покупка condo или «виза с объекта» — отдельная проверка, не автоматический статус.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из штампа, TM30, очереди Phuket Immigration и чатов «Пхукет» — разберём до того, как перепутаете 90-day report с регистрацией адреса или DTV с Thailand Privilege."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Thailand-track, фокус Phuket 2026. **OK** = посольство / Immigration / e-Visa; **soft** = часы Patong/Blue Tree и полевые очереди; **fixed** = смягчено под актуальную рамку.",
    ],
    bullets: [
      "OK: с **15 сентября 2026** общий 60-дневный безвиз для 93 стран отменён; для **обычных паспортов РФ** сохраняется **безвиз до 30 дней** по двустороннему соглашению ([Посольство Таиланда в Москве](https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes), информация на 31.08.2026).",
      "OK: долгий stay — отдельные категории (**DTV**, **LTR**, **Thailand Privilege**); подача до въезда часто через [Thailand e-Visa](https://www.thaievisa.go.th/).",
      "OK: **TM30** — уведомление адреса (формы TM30); **90-day report** — обязанность иностранца (TM47), разные сроки и ответственные.",
      "OK: главный офис Phuket Immigration на сайте провинции: **482 Phuket Rd., Talad Yai, Mueang Phuket 83000**, tel. 076-221-905, пн–пт 08:30–12:00 и 13:00–16:30 ([contact-pkimm](http://www.phuketimmigration.go.th/contact-pkimm.php)).",
      "Fixed: «купил condo от 3 млн THB — виза семье автоматически» → сделка с земельным департаментом **не заменяет** проверку Immigration; приказы №237/2568 и №238/2568 не дают такой универсальной формулы в материалах Emigro.",
      "Fixed: «90-day можно игнорировать, если есть DTV» → report обязателен при непрерывном пребывании >90 дней, пока действует permit of stay.",
      "Soft: дополнительные точки **Patong** (Thawewong Beach Rd.) и **Blue Tree** (Si Sunthon) — часы на сайте волонтёров/офиса могут отличаться от главного офиса; сверяйте перед поездкой.",
      "Soft: онлайн **Queue Online** Phuket и TM30 portal иногда недоступны — имейте plan B личный визит в будний день утром.",
      "UNCHECKED: требование **Thailand Digital Arrival Card** для онлайн 90-day у въездов после 01.05.2025 — сверяйте актуальный FAQ на immigration.go.th перед первой онлайн-подачей.",
    ],
  },
  {
    heading: "Официально: офисы Phuket Immigration и каналы",
    section_kind: "official",
    paragraphs: [
      "Phuket Immigration — extension, re-entry, 90-day (in-person), проверка TM30. Правила — [immigration.go.th](https://www.immigration.go.th/); формы и e-service — [phuketimmigration.go.th](http://www.phuketimmigration.go.th/).",
      "**Главный офис:** 482 Phuket Road, Talad Yai, Mueang Phuket 83000; пн–пт 08:30–12:00, 13:00–16:30; **1178**.",
      "**Patong / Blue Tree** — soft: укороченные часы; сложный extension — главный офис. Queue Online **не заменяет** пакет документов.",
    ],
    bullets: [
      "482 Phuket Rd. — extension, re-entry, 90-day (in-person), спорные кейсы.",
      "Patong / Blue Tree — soft: часть услуг и справочные окна; не замена главного офиса для всех типов виз.",
      "Формы TM30/TM47 — download с phuketimmigration.go.th / immigration.go.th.",
      "e-Visa до поездки — только thaievisa.go.th; после въезда — Immigration Phuket.",
      "1178 — общий call center Immigration (язык — часто TH/EN).",
    ],
  },
  {
    heading: "TM30 и 90-day report: два разных контура",
    section_kind: "official",
    paragraphs: [
      "**TM30** — уведомление **куда** вы живёте. Обязанность **house master / owner / possessor** сообщить о вселении иностранца и при **новом заезде** после поездки (даже в тот же condo). Арендатор передаёт landlord копии паспорта, lease и контакты; juristic person в Rawai/Kata часто подаёт пакетом через портал Notify Resident. Без TM30 в базе officer на extension может отправить «сначала адрес» — независимо от того, что в чате «все так живут».",
      "**90-day report (TM47)** — отчёт **как долго** вы непрерывно в Таиланде. Подаёт **иностранец** (или представитель по правилам bureau), цикл ~90 дней от прошлого report или въезда. Окно: обычно **15 дней до** due date и **7 дней после** (soft — сверяйте FAQ immigration.go.th). Report **не продлевает** permit of stay; только фиксирует, что вы на месте и адрес совпадает с TM30.",
      "На стойке Phuket Immigration оба контура часто проверяют вместе: «нет TM30» или просроченный 90-day → очередь зря, штраф или перенос extension. Для семьи у каждого взрослого свой 90-day; дети — по правилам возраста на дату визита (soft: иногда report только на родителя — уточняйте на стойке).",
    ],
    bullets: [
      "TM30 — landlord/owner; после каждого нового въезда в тот же или новый адрес.",
      "90-day — иностранец; онлайн, почтой или лично в Phuket Immigration.",
      "Онлайн TM30: портал Notify Resident (ссылка с phuketimmigration.go.th).",
      "Онлайн 90-day: сервис Immigration Bureau (с immigration.go.th); soft — сбои → in-person.",
      "Смена condo на Rawai → Kata: новый TM30 + не сбрасывайте цикл 90-day без сверки дат.",
    ],
  },
  {
    heading: "Запись, walk-in и что куда нести",
    section_kind: "action_guide",
    paragraphs: [
      "На Пхукете смешивают три разных «записи»: **Queue Online** провинции, **онлайн-подача** TM30/90-day и **живая очередь** в офисе. Для типичного релоканта с DTV или tourist extension картина такая:",
    ],
    table: {
      columns: ["Задача", "Запись / walk-in", "Кто несёт", "Базовый пакет"],
      rows: [
        [
          "TM30 (адрес)",
          "Онлайн landlord или in-person; очередь TM30 в офисе — soft",
          "Owner / juristic person condo",
          "Паспорт foreigner, адрес, house registration landlord, договор аренды",
        ],
        [
          "90-day report",
          "Онлайн или walk-in; запись не всегда обязательна — soft",
          "Иностранец",
          "Паспорт, TM47, предыдущий report / штамп въезда, адрес TM30",
        ],
        [
          "Extension of stay",
          "Queue Online **или** walk-in утром — soft; конкуренция в сезон",
          "Иностранец",
          "Паспорт, фото, TM30, финансы/страховка по типу визы, форма extension, fee",
        ],
        [
          "Re-entry permit",
          "Обычно лично до выезда; soft — очередь как на extension",
          "Иностранец",
          "Паспорт, фото, действующий permit of stay, заявление, fee single/multiple",
        ],
        [
          "DTV / LTR / Privilege (до въезда)",
          "e-Visa / BOI / Privilege office — **не** Phuket Immigration queue",
          "Заявитель",
          "Checklist категории на thaievisa.go.th, ltr.boi.go.th или thailandprivilege.co.th",
        ],
      ],
    },
  },
  {
    heading: "Extension и re-entry permit на практике Phuket",
    section_kind: "practice",
    paragraphs: [
      "**Extension of stay** продлевает текущий **permit of stay**, а не «выдаёт новую визу в паспорт». Officer смотрит штамп, TM30, 90-day history и пакет по **типу** (tourist, DTV, marriage non-O и т.д.). Tourist track на Пхукете historically включал 30+30 soft-дней, но лимиты и proof of funds менялись — список на день визита, не пост 2023.",
      "**Re-entry permit** (single/multiple) оформляют **до выезда**, если вы уже на extension/long-stay и не хотите потерять накопленный permit. Без re-entry новый въезд может получить только короткий tourist stamp, а школа/lease «на год» останутся без статуса.",
      "Типичный RU-track: **безвиз 30 дней** (РФ, с 15.09.2026, двустороннее соглашение) → при необходимости **extension** tourist или заранее **DTV** через e-Visa → TM30 в condo → календарь 90-day → к month 4–6 второй extension, re-entry перед поездкой или смена категории с выездом, когда tourist исчерпан.",
    ],
    bullets: [
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2"],
        period: "2025–2026",
        claim:
          "extension tourist в высокий сезон — 2–4 часа в главном офисе без Queue Online или с номером, который не успели до закрытия окна",
        forReader: "приходите к открытию 08:30 с полным пакетом и копиями; проверьте Queue Online накануне",
      }),
      "Re-entry — планируйте за 1–3 дня до рейса; same-day иногда возможен, но soft без гарантии.",
      "Фото и копии — на месте есть киоски у офиса; soft — переплата и очередь.",
      "Штраф за просроченный 90-day — могут выставить до extension; не откладывайте report «на после holidays».",
      "DTV extension — отдельный checklist от tourist; не смешивайте proof of remote work с pension proof.",
    ],
  },
  {
    heading: "DTV, LTR и Thailand Privilege — не одна очередь",
    section_kind: "official",
    paragraphs: [
      "**DTV (Destination Thailand Visa)** — подача **до въезда** на [thaievisa.go.th](https://www.thaievisa.go.th/): remote work или approved soft-power activity, proof of funds порядка **500 000 THB**, страховка и паспорт по checklist MFA. После landing — TM30, 90-day, **extension** уже по правилам DTV в Phuket Immigration, не по tourist checklist.",
      "**LTR** — отдельный контур [BOI LTR](https://ltr.boi.go.th/) (wealthy, pensioner, work-from-Thailand, highly skilled) с порогами дохода/активов и сроком до 10 лет. Одобрение BOI ≠ «запись в Patong»; штамп/перmit по письму программы.",
      "**Thailand Privilege** — платная membership ([thailandprivilege.co.th](https://www.thailandprivilege.co.th/thailandprivilegecard)): пребывание, **без права работы** по найму в Таиланде; Bronze от **650 000 THB** на 5 лет (тариф на сайте). Не путать с DTV «для nomad» и с LTR BOI.",
      "Покупка **condo** в foreign quota — право по земельному департаменту; **не** автоматическая виза семье. Маркeting «3 млн THB = visa for all» сверяйте с e-Visa/Immigration отдельно от сделки — Emigro в Nota не подтверждает такую формулу.",
    ],
    bullets: [
      "Безвиз 30 дней (РФ с 15.09.2026) — не DTV; для >30 дней нужна виза или extension по правилам.",
      "DTV — e-Visa + после въезда compliance (TM30, 90-day).",
      "LTR — BOI пороги; work rights зависят от sub-category.",
      "Privilege — оплата пакета + membership; работа по найму в TH обычно нет.",
      "Смена категории mid-stay часто = выезд + новая виза, не «апгрейд в окне Patong».",
    ],
  },
  {
    heading: "Месяц 4–6 на Пхукете: compliance и второй визит в Immigration",
    section_kind: "practice",
    paragraphs: [
      "К **четвёртому–шестому месяцу** на Пхукете у типичного expat уже **два–три 90-day report**, возможно **первое или второе extension**, и вопрос **re-entry** перед поездкой в РФ/ОАЭ. Именно здесь «жили без проблем» сталкивается с проверкой базы на стойке.",
      "**Месяц 4:** после переезда между районами (Cherng Talay → Rawai) убедитесь, что **новый TM30** подан; обновите shared-календарь: due 90-day, expiry permit, passport **>6 месяцев** для extension.",
      "**Месяц 5:** планируете выезд с long permit — **re-entry permit** в главном офисе **до** check-in. Tourist на исходе — решите: ещё одно extension (если policy позволяет) или DTV/LTR через e-Visa с выездом; border run с семьёй — soft высокий риск отказа на границе.",
      "**Месяц 6:** часто второй визит в Immigration — renewal extension, исправление TM30 после lease renewal, оплата штрафа за пропущенный 90-day. Возьмите страховку, копию lease, bank book TH если есть; банк/аренда — sibling slots, здесь только **migration compliance**.",
    ],
    bullets: [
      "Календарь 90-day + expiry permit + passport — один shared doc для семьи.",
      "Re-entry до билета — не в аэропорту «исправят».",
      "Renew lease → новый TM30 от landlord; старый адрес в базе блокирует extension.",
      "DTV extension month 6 — proof of funds и activity по актуальному checklist, не tourist.",
      formatPracticeBullet({
        channels: ["russianinphuket", "thailand_chatik"],
        period: "2025–2026",
        claim:
          "к 4–6 месяцу банки и школы чаще запрашивают историю TM30/90-day, не только первый штамп",
        forReader: "храните PDF TM30, квитанции report и копии extension в одной папке",
      }),
    ],
  },
  {
    heading: "Где правила и Пхукет расходятся",
    section_kind: "gap",
    paragraphs: [
      "Формально TM30 должен быть в **24 часа** после вселения; на практике condo juristic подаёт пакетом раз в неделю — soft, но риск остаётся на landlord. Формально 90-day можно онлайн; на практике портал падает в пик — expats идут лично с распечаткой TM47.",
      "Формально Queue Online экономит время; на практике номер без полного пакета не продлевает permit — только очередь на стойку. «Агент за 5 000 THB без вашего присутствия» на extension — серая зона; officer может требовать личную явку.",
    ],
    bullets: [
      "Официально: TM30 — обязанность owner. На практике: проверьте, что juristic condo реально подал, не только «обещали в чате».",
      "Официально: 90-day window 15 дней до / 7 после due. На практике: в праздники офис закрыт — подайте раньше.",
      "Soft: Patong office — короче часы; не все extension принимают.",
      "Fixed: «купил недвижимость — виза гарантирована» — нет в официальных схемах как автомат.",
    ],
  },
  {
    heading: "Типичные ошибки и Assist",
    section_kind: "practice",
    paragraphs: [
      "Провалы редко из‑за «сложного Таиланда» — чаще из‑за путаницы TM30/90-day, tourist vs DTV и поездки без re-entry. Полный маршрут страны — pillar [Таиланд для россиян 2026](/ru/guides/" +
        PILLAR_SLUG +
        "); wizard — [Emigro Wizard](/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=immigration-phuket&utm_content=" +
        IMMIGRATION_PHUKET_SLUG +
        ").",
      "Если permit истекает, семья на разных штампах или marketing «виза с condo» не сходится с e-Visa — [Route Check Assist](/ru/assist?country=thailand&utm_source=emigro&utm_medium=guide&utm_campaign=immigration-phuket&utm_content=" +
        IMMIGRATION_PHUKET_SLUG +
        "#assist-form).",
    ],
    bullets: [
      "Жить на tourist/border run полгода с ребёнком в школе — soft высокий риск на границе.",
      "Не делать 90-day «потому что TM30 есть» — разные формы.",
      "Extension в последний день permit — очередь + отказ «подайте завтра» = overstay.",
      "Выезд без re-entry при long extension — потеря статуса.",
      "DTV документы копировать с LTR checklist — отказ e-Visa.",
      "Верить адресу «Chalong bypass» из блога вместо 482 Phuket Rd. на официальном сайте — soft verify.",
    ],
  },
];

const keyTakeaways = [
  "Официально: TM30 (адрес) подаёт owner/juristic; 90-day report (TM47) — личная обязанность иностранца; оба проверяют при extension/re-entry в Phuket Immigration (482 Phuket Rd., пн–пт 08:30–16:30).",
  "Официально: с 15.09.2026 для РФ безвиз **30 дней** по двустороннему соглашению; DTV/LTR/Privilege — отдельные каналы (e-Visa, BOI, Privilege), не очередь «на всякий случай».",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "pkhuket2"],
    period: "2025–2026",
    claim:
      "extension и 90-day в высокий сезон надёжнее с утренним визитом или рабочим онлайн, чем с одним номером Queue Online без пакета",
    forReader:
      "к month 4–6 ведите календарь permit + 90-day + re-entry до любого выезда; храните TM30 PDF",
  }),
  "Расхождение: покупка condo/«виза с объекта» — не гарантия статуса; формулы «семья автоматом» в официальных материалах Emigro не подтверждены.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Кто подаёт TM30 на Пхукете — я или арендодатель?",
    a: "По правилам — **house master / owner / possessor** жилья (часто landlord или juristic person condo). На практике expat собирает копии паспорта и договор, но подпись и подача — на стороне owner; без TM30 в базе extension могут задержать.",
  },
  {
    q: "Нужна ли запись Queue Online на extension?",
    a: "По правилам Phuket Immigration продвигает **Queue Online** для части услуг. На практике в @nashi_phuket_chat многие берут номер онлайн **или** приходят walk-in к 08:30 в главный офис; без полного пакета номер не заменяет приём.",
  },
  {
    q: "Чем 90-day report отличается от TM30?",
    a: "По правилам TM30 — адрес при вселении/return (owner); 90-day — периодический report иностранца (TM47). На практике оба спрашивают на extension; пропуск 90-day чаще даёт штраф, чем «молчаливое» прощение.",
  },
  {
    q: "Безвиз 30 дней для россиян после 15 сентября 2026 — это DTV?",
    a: "По правилам посольства в Москве — **отдельное** 30-дневное двустороннее соглашение, не DTV. На практике для работы и stay >30 дней оформляют DTV/LTR/Privilege через e-Visa или консульство **до** или вместо цепочки tourist extension.",
  },
  {
    q: "Даёт ли покупка condo автоматическую визу семье?",
    a: "По правилам владение condo — иностранная квота по земельному праву; виза — отдельное основание Immigration/MFA. На практике marketing «виза с объекта» проверяйте как конкретную категорию на thaievisa.go.th, не как следствие сделки.",
  },
  {
    q: "Когда оформлять re-entry permit?",
    a: "По правилам — **до выезда** из Таиланда, пока действует permit of stay. На практике закладывайте 1–3 рабочих дня в Phuket Immigration; в аэропорту «добавить re-entry» к long-stay обычно нельзя.",
  },
];

export const IMMIGRATION_PHUKET_GUIDE = {
  slug: IMMIGRATION_PHUKET_SLUG,
  category: "Immigration / статус",
  content_kind: "guide" as ContentKind,
  title: "Immigration Пхукет 2026: TM30, 90-day, extension и запись",
  excerpt:
    "Phuket Immigration: TM30 и 90-day report, extension и re-entry permit, Queue Online vs walk-in, DTV/LTR/Privilege отдельно, безвиз 30 дней для РФ с 15.09.2026 — без мифа «виза с condo».",
  seo_title: "Immigration Пхукет 2026 — TM30, 90-day, extension",
  seo_description:
    "Immigration Пхукет 2026: TM30, 90-day report, продление, re-entry, очередь. DTV/LTR отдельно; безвиз РФ 30 дней с 15.09.2026. Недвижимость не даёт визу.",
  quick_answer:
    "На Пхукете статус ведёт Provincial Immigration (главный офис 482 Phuket Rd.): TM30 подаёт landlord/juristic, 90-day report (TM47) — вы сами онлайн или лично. Extension и re-entry — пакет по типу визы + TM30; Queue Online ускоряет номер, но не заменяет документы. DTV/LTR/Thailand Privilege оформляются через e-Visa/BOI/Privilege, не смешивайте с tourist. С 15.09.2026 для РФ безвиз 30 дней по двустороннему соглашению. Покупка condo не даёт автоматической визы семье. К 4–6 месяцу держите календарь 90-day и re-entry до выезда.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Immigration Bureau Thailand", url: "https://www.immigration.go.th/" },
    { title: "Phuket Immigration — контакты", url: "http://www.phuketimmigration.go.th/contact-pkimm.php" },
    { title: "Thailand e-Visa", url: "https://www.thaievisa.go.th/" },
    { title: "Посольство Таиланда в Москве — безвиз 2026", url: "https://moscow.thaiembassy.org/en/publicservice/revision-of-thailand-s-visa-exemption-and-visa-on-arrival-schemes" },
    { title: "BOI LTR Visa", url: "https://ltr.boi.go.th/" },
    { title: "Thailand Privilege", url: "https://www.thailandprivilege.co.th/thailandprivilegecard" },
  ],
  topic_tags: ["immigration", "phuket", "thailand"],
  hashtags: buildNoteHashtags({
    topicTags: ["immigration", "phuket", "thailand"],
    contentKind: "guide",
    extra: ["tm30", "90day", "extension", "dtv", "ltr"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+russianinphuket",
  source_label: "editorial:immigration-phuket-gold-residence-appointment-2026",
  pillar_guide_slug: PILLAR_SLUG,
} satisfies ThailandEditorialGuide;

export default IMMIGRATION_PHUKET_GUIDE;
