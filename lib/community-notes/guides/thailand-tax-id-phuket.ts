/**
 * Hand-curated Thailand satellite guide — TIN / tax ID (Phuket focus).
 * Revenue Department rules separated from Phuket field practice.
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

export const THAILAND_TAX_ID_PHUKET_SLUG = "tax-id-tin-phuket-2026";

const PILLAR_SLUG = "tailand-dlya-rossiyan-2026";

const GLOSSARY: GlossaryTerm[] = [
  { pt: "TIN (Taxpayer Identification Number)", ru: "налоговый номер Revenue Department; у иностранца без thai PIN выдаётся отдельно от визы и work permit" },
  { pt: "PIN (Personal Identification Number)", ru: "13-значный ID гражданина Таиланда по гражданскому регистру; гражданин может использовать PIN вместо отдельного TIN" },
  { pt: "Revenue Department (กรมสรรพากร)", ru: "налоговая служба; выдаёт TIN и принимает декларации P.N.D.90/91" },
  { pt: "Area Revenue Office / Branch", ru: "районное отделение в провинции; на Пхукете — главный офис и субофисы по amphoe" },
  { pt: "Form L.P. 10.1", ru: "официальная форма заявления на TIN для физлица" },
  { pt: "P.N.D.90 / P.N.D.91", ru: "годовая декларация personal income tax (90 — смешанные доходы; 91 — наём)" },
  { pt: "Tax resident (180 days)", ru: "налоговый резидент календарного года при ≥180 дней в Таиланде суммарно — отдельно от наличия TIN" },
  { pt: "Assessable income", ru: "доход, подлежащий учёту; с даты его получения отсчитываются 60 дней на подачу заявления TIN" },
  { pt: "Tax Clearance Certificate", ru: "справка перед выездом для части иностранцев с налоговыми обязательствами — не заменяет TIN" },
  { pt: "TM30 / immigration", ru: "миграционный учёт адреса; не выдаёт TIN и не равен налоговой регистрации" },
];

const DISCLAIMER =
  "**Emigro — не налоговая консультация.** Порог 180 дней, foreign-sourced income с 2024 года и требования конкретного окна Revenue **меняются**. Актуальные формы — [rd.go.th/english](https://www.rd.go.th/english/21987.html). Это satellite-гайд для **Phuket / Mueang Phuket**; не копируйте португальский NIF или испанский NIE как «тот же номер».";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(
      GLOSSARY,
      "Слова из чатов @nashi_phuket_chat и @pkhuket2 смешивают TIN, Thai ID, TM30 и «налоговый резидент». Разберём до поездки в Revenue Office — иначе арендодатель или банк попросят «tax ID», а вы принесёте только штамп в паспорте."
    ),
    paragraphs: [DISCLAIMER],
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Ключевые утверждения сверены с Revenue Department (English) и PIT-страницами. **OK** = официальный текст RD; **soft** = практика Phuket 2025–2026; **fixed** = смягчено под рамку 2026.",
    ],
    bullets: [
      "OK: иностранец без PIN по гражданскому регистру **обязан получить TIN**, если подпадает под personal income tax; форма **L.P. 10.1**; срок — **в течение 60 дней** с даты появления assessable income ([Tax Identification EN](https://www.rd.go.th/english/21987.html)).",
      "OK: физлицо может подать L.P. 10.1 **в любом** area revenue office или branch **независимо от domicile**; в провинциях базово — branch по месту domicile ([Tax Identification EN](https://www.rd.go.th/english/21987.html)).",
      "OK: краткий визит: иностранец **не обязан** подавать на TIN, если один период ≤14 дней и **суммарно ≤90 дней** в налоговом году ([Tax Identification EN](https://www.rd.go.th/english/21987.html)).",
      "OK: **tax resident** — проживание **более 180 дней** суммарно в календарном налоговом году; резидент отчитывается по доходам из Таиланда и по части foreign income, **ввезённого** в Таиланд ([Personal Income Tax EN](https://www.rd.go.th/english/6045)).",
      "OK: foreign-sourced income, **заработанный с 1 января 2024**, подлежит учёту при remittance резидентом ([RD PDF foreign income 2024](https://www.rd.go.th/fileadmin/user_upload/lorkhor/newspr/2024/FOREIGNERS_PAY_TAX2024.pdf)).",
      "OK: адрес **Phuket Area Revenue Office** на сайте RD: Ministry of Finance complex, **23 Narisorn Rd**, Talat Yai, Mueang Phuket 83000; тел. **0-7635-8250** (страница [สำนักงานสรรพากรพื้นที่ภูเก็ต](https://www.rd.go.th/region/11/phuket/532/%E0%B8%9B%E0%B8%B5-2566.html)).",
      "Fixed: «TIN нужен каждому expat в аэропорту» → по закону триггер — **налоговые отношения** (доход, VAT/SBT, работодатель), а не факт приземления на HKT.",
      "Fixed: «TIN = виза / extension / 90-day report» → **нет**; это Revenue Department, не Immigration.",
      "Soft: на L.P. 10.1 в таблице RD указаны **tabien baan** (house registration); у большинства иностранцев его нет — на практике часто принимают **lease + passport**, но окно может запросить иное подтверждение domicile.",
      "Soft: в блогах пишут «10 vs 13 цифр» — на EN-странице TIN описан как **10 digits**, сервис проверки TIN на rd.go.th работает с **13-значным** форматом; используйте номер **с официальной карточки/листа**, не переписывайте из чата.",
      "UNCHECKED: walk-in без очереди и англоязычное окно в конкретный день — звоните **1161** (RD Call Center) или офис перед поездкой из Rawai/Kathu.",
    ],
  },
  {
    heading: "Официально: TIN, L.P. 10.1 и Revenue Code",
    section_kind: "official",
    paragraphs: [
      "TIN присваивает **Revenue Department** (Section 3 Undecim Revenue Code). Гражданин с thai **PIN** может использовать PIN вместо отдельного TIN; **иностранец без PIN** подаёт **L.P. 10.1** с копией passport и документами domicile. Срок — **60 дней** после **assessable income**. Выдача TIN **не равна** work permit.",
      "Турист без дохода, укладывающийся в лимит **90/14 дней**, формально может не подавать L.P. 10.1 — но банк или employer всё равно часто просят номер раньше закона.",
    ],
    bullets: [
      "L.P. 10.1 — физлицо; подача возможна в **любом** area office/branch.",
      "Phuket: **Area Revenue Office** (Narisorn Rd) и branch по amphoe — уточняйте по lease.",
      "E-filing — **после** TIN; первичная регистрация иностранца — лично.",
      "Справки: **1161**; штрафы — Section 3 Duodecim Revenue Code.",
    ],
  },
  {
    heading: "Когда иностранцу на Пхукете реально нужен TIN",
    section_kind: "official",
    paragraphs: [
      "По закону TIN нужен, когда без thai PIN появился **assessable income** (зарплата, аренда, Thai business) или вы идёте в **VAT/SBT**. DTV/tourist **без дохода** может не попадать под 60-дневный триггер — но **180+ дней** резидентства и **remittance** foreign income всё равно ведут к декларации, где TIN обязателен.",
      "До закона номер часто просят: **employer**, **банк**, юрлицо-арендодатель, бухгалтер перед **P.N.D.90**. TM30, 90-day report, LTR/DTV и work permit **не заменяют** TIN.",
    ],
    bullets: [
      "Thai salary → TIN до первой выплаты.",
      "Foreign remote на счёт за рубежом → TIN часто **позже**, до remittance или filing.",
      "Condo rental Phuket → income → TIN + P.N.D.90.",
      "Stay ≤90/14 по RD → exemption от **подачи** на TIN (не от bank KYC).",
    ],
  },
  {
    heading: "Phuket: Area Revenue Office, визит и пакет документов",
    section_kind: "action_guide",
    paragraphs: [
      "На Пхукете чаще едут в **Phuket Area Revenue Office** (23 Narisorn Rd, Talat Yai) или в branch (**Muang Phuket 1**, Damrong Rd — soft). Индивид может подать **в любом** office; перед визитом звоните **1161** / **0-7635-8250**.",
      "Имя в passport = lease = bank. Пакет: passport (+ visa/extension), **lease** или utility, **L.P. 10.1** (адрес tambon/amphoe лучше на тайском). Work permit не обязателен, но помогает при employment-motivated заявке.",
    ],
    bullets: [
      "Passport + копии; lease / PEA-PWA bill.",
      "L.P. 10.1 — в окне или rd.go.th.",
      "Сохраните **TIN card** для bank и payroll.",
      "Часы: обычно пн–пт 08:30–16:30 (soft).",
    ],
  },
  {
    heading: "180+ дней, резидентство и связь с TIN",
    section_kind: "official",
    paragraphs: [
      "**Tax residency** (> **180 дней** суммарно в календарном году) и **TIN** — разные оси. Виза (DTV, LTR, tourist) не отменяет подсчёт дней ([PIT EN](https://www.rd.go.th/english/6045)). Резидент платит PIT с Thai-source income и, с **2024**, с **foreign income**, remitted после earning в год резидентства ([RD PDF 2024](https://www.rd.go.th/fileadmin/user_upload/lorkhor/newspr/2024/FOREIGNERS_PAY_TAX2024.pdf)).",
      "TIN нужен для **P.N.D.90/91** и withholding. К **4–6 месяцу** на Пхукете многие близки к 180 дням в текущем году — считайте дни с **1 января**, не с даты DTV.",
    ],
    bullets: [
      "Non-resident (<180) — в general case только Thai-source PIT.",
      "Декларация — обычно до **31 марта** (e-filing может дать extension).",
      "Tax Clearance при выезде — отдельно от первичного TIN.",
    ],
  },
  {
    heading: "К 4–6 месяцу на Пхукете",
    section_kind: "practice",
    paragraphs: [
      "Отложили TIN в month 1 — к **4–6 месяцу** часто уже **long-term lease**, банк, **180-day** projection и remittance под правила **2024**. Хвост: нет withholding, нет **P.N.D.90**, слабый income proof на visa renewal.",
      "Закройте TIN до первого дохода или в month 2–3, если bank/payroll на горизонте. Считайте дни в TH; mixed income — [Route Check](/ru/assist). Pillar: [Таиланд для россиян](https://www.emigro.online/ru/guides/tailand-dlya-rossiyan-2026), [wizard](https://www.emigro.online/ru/wizard).",
    ],
    bullets: [
      "Projection 180 days до 31 декабря.",
      "Swift proof для remitted foreign income.",
      "Смена района — amend адрес в RD.",
    ],
  },
  {
    heading: "Что TIN не даёт: виза, банк, аренда, миграция",
    section_kind: "gap",
    paragraphs: [
      "TIN **не продлевает** visa, **не заменяет** work permit и **не равен** TM30. Банк ведёт **свой KYC**: TIN помогает, но tourist stamp и mismatch адреса всё равно дают отказ.",
      "Частный landlord чаще просит passport, не TIN; номер нужен для **payroll**, rent **юрлицу**, **withholding** и **P.N.D.90**. TIN — не страховка и не proof, что декларация уже подана.",
    ],
    bullets: [
      "Один адрес в lease, bank и L.P. 10.1.",
      "Payroll без TIN часто стопорится.",
      formatPracticeBullet({
        channels: ["nashi_phuket_chat", "pkhuket2"],
        period: "2025–2026",
        claim:
          "банки на Phuket Town просили TIN или withholding slip уже при открытии savings для DTV с lease 12 мес.",
        forReader:
          "заранее спросите branch: нужен ли TIN до визита или достаточно passport + lease",
      }),
      "Immigration extension по одному TIN без income proof — миф; RD и Immigration не взаимозаменяемы.",
    ],
  },
  {
    heading: "Типичные ошибки и расхождение «сайт vs окно»",
    section_kind: "practice",
    paragraphs: [
      "Повторные визиты: нет копий, Airbnb вместо lease, ожидание online-only TIN. Путаница **residency vs filing** и оплата посреднику без RD receipt — частые хвосты к month 4–6.",
    ],
    bullets: [
      "L.P. 10.1 лично — без типовой госпошлины (soft).",
      "Не используйте чужой TIN; DTV не «выдаёт» номер на границе.",
      "Nет tabien baan — покажите lease (soft).",
      formatPracticeBullet({
        channels: ["info_phuket", "thailand_chatik"],
        period: "2025–2026",
        claim:
          "очереди в Narisorn Rd короче до 10:00; после обеда иногда направляли в branch Muang Phuket 1",
        forReader:
          "планируйте утро + запасной branch, не один слот перед рейсом с HKT",
      }),
    ],
  },
];

const keyTakeaways = [
  "Официально: TIN для иностранца без thai PIN — через **L.P. 10.1** в Revenue Department **в течение 60 дней** после assessable income; индивид может подать в **любом** area office/branch ([rd.go.th/english/21987.html](https://www.rd.go.th/english/21987.html)).",
  "Официально: **tax resident** — **>180 дней** суммарно в календарном году; резидентство определяет scope PIT и правила remitted foreign income с **2024** ([rd.go.th/english/6045](https://www.rd.go.th/english/6045)).",
  "Официально: краткий stay **≤90 дней aggregate** и **≤14 дней** за один период освобождает от обязанности подать на TIN по правилу RD — не путать с бытовой нуждой банка.",
  formatPracticeTakeaway({
    channels: ["nashi_phuket_chat", "pkhuket2"],
    period: "2025–2026",
    claim:
      "на Пхукете TIN чаще оформляли в Phuket Area Revenue Office (Narisorn Rd) с passport + lease, иногда направляли в branch Talat Yai",
    forReader:
      "звоните 1161, берите копии и тайский адрес; не отдавайте passport посреднику",
  }),
  "Расхождение: TIN **не** продлевает visa, **не** заменяет work permit и **не** открывает счёт сам по себе — банк и Immigration ведут отдельные процедуры.",
  "На практике: к **4–6 месяцу** без TIN страдают payroll, P.N.D.90 и часть visa renewal с income proof — проще закрыть номер в месяц 1–2, если есть работа, lease или банк-KYC.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужен ли TIN каждому expat на Пхукете сразу после прилёта?",
    a: "По правилам RD — нет, если нет assessable income и вы не подпадаете под VAT/SBT и не превышаете лимит 90/14 дней. На практике банк, employer или long-term lease через юрлицо могут попросить TIN в первые недели — тогда L.P. 10.1 подают до их дедлайна, а не «к 180 дням».",
  },
  {
    q: "Где получить TIN на Пхукете и можно ли в другом province?",
    a: "По правилам — area revenue **branch** по domicile в province; **индивид** может подать в **любом** office/branch. На практике expat едут в Phuket Area Revenue Office (Narisorn Rd, Talat Yai) или branch Muang Phuket; перед визитом уточните по 1161.",
  },
  {
    q: "Достаточно ли passport без lease для L.P. 10.1?",
    a: "По правилам RD к L.P. 10.1 — копия passport и документы domicile (в перечне — house registration). На практике иностранцам часто нужны **lease / utility** и visa pages; Airbnb-only — слабое domicile.",
  },
  {
    q: "TIN и налоговый резидент (180 дней) — одно и то же?",
    a: "По правилам — нет: TIN — идентификатор; резидентство — **>180 дней** в календарном году для scope PIT. На практике к концу года без TIN не подать P.N.D.90 даже при понятном статусе резидента.",
  },
  {
    q: "Нужен ли work permit для TIN?",
    a: "По правилам L.P. 10.1 — passport/alien certificate, не work permit. На практике permit помогает объяснить employment income, но его отсутствие **не должно** блокировать TIN для lawful non-employment cases (soft: зависит от officer).",
  },
  {
    q: "TIN поможет продлить DTV или Non-OA?",
    a: "По правилам Immigration — **нет**, TIN не является основанием для visa. На практике при Non-OA могут запросить **proof of income / tax** — тогда TIN и filing history помогают, но это tax/visa bundle, не автоматическое extension.",
  },
  {
    q: "Что нельзя сделать без TIN в первую неделю?",
    a: "По правилам многие бытовые actы возможны с passport. На практике без TIN сложнее: formal **payroll**, часть **bank KYC**, **withholding** rent to company, регистрация **P.N.D.90** — типичные блокеры из Phuket-чатов 2025–2026.",
  },
];

export const THAILAND_TAX_ID_PHUKET_GUIDE = {
  slug: THAILAND_TAX_ID_PHUKET_SLUG,
  category: "TIN / налоги",
  content_kind: "guide" as ContentKind,
  title: "TIN на Пхукете: налоговый номер Revenue Department 2026",
  excerpt:
    "TIN для иностранца на Phuket: L.P. 10.1, Area Revenue Office Narisorn Rd, passport и lease, 60 дней после дохода, 180 дней резидентства, банк и аренда — официальный каркас RD и практика 2026 без путаницы с NIE/NIF.",
  seo_title: "TIN Пхукет 2026 — Tax ID иностранцу Revenue",
  seo_description:
    "TIN Пхукет 2026: L.P. 10.1, Revenue Department, passport, lease, 180 дней tax resident. Не NIF/NIE. Банк, аренда, P.N.D.90 — что без TIN в первую неделю.",
  quick_answer:
    "TIN (Taxpayer Identification Number) иностранец без thai PIN получает в Revenue Department по форме L.P. 10.1 — обычно в течение 60 дней после assessable income; физлицо может подать в любом area office, на Пхукете — Phuket Area Revenue Office (23 Narisorn Rd, Talat Yai). Возьмите passport, visa pages и подтверждение адреса (lease/utility). TIN не равен visa или work permit; tax resident — отдельно при 180+ днях в календарном году. Без TIN стопорятся payroll, часть bank KYC и P.N.D.90; к 4–6 месяцу риск remittance и 180-day tail.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    {
      title: "Revenue Department — Tax Identification (EN)",
      url: "https://www.rd.go.th/english/21987.html",
    },
    {
      title: "Revenue Department — Personal Income Tax (EN)",
      url: "https://www.rd.go.th/english/6045",
    },
    {
      title: "Phuket Area Revenue Office (RD regional page)",
      url: "https://www.rd.go.th/region/11/phuket/532/%E0%B8%9B%E0%B8%B5-2566.html",
    },
    {
      title: "Foreign-sourced income — RD guidance (PDF, 2024 rules)",
      url: "https://www.rd.go.th/fileadmin/user_upload/lorkhor/newspr/2024/FOREIGNERS_PAY_TAX2024.pdf",
    },
  ],
  topic_tags: ["tin", "tax_id", "phuket", "thailand"],
  hashtags: buildNoteHashtags({
    topicTags: ["tin", "tax_id", "phuket", "thailand"],
    contentKind: "guide",
    extra: ["revenue-department", "lp-10-1", "satellite", "tax-resident"],
  }),
  source_channel: "nashi_phuket_chat+pkhuket2+info_phuket",
  source_label: "editorial:thailand-tax-id-gold-phuket-2026",
  pillar_guide_slug: PILLAR_SLUG,
} satisfies ThailandEditorialGuide;

export default THAILAND_TAX_ID_PHUKET_GUIDE;
