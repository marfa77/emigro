/**
 * Long-term rent Porto / Braga / Norte 2026 — relocant practice guide.
 * Voice: seasoned realtor / market advisor (not Remarque leisure).
 * User draft Sep 2026 kept full; law/market claims soft-verified in Nota Emigro.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { NIF_PORTO_GUIDE_SLUG } from "@/lib/community-notes/guides/nif-porto";
import { PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG } from "@/lib/community-notes/guides/porto-vs-braga-family-schools";
import { NORTE_CLIMATE_COMFORT_SLUG } from "@/lib/community-notes/guides/norte-climate-comfort";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const PORTO_BRAGA_LONG_TERM_RENT_SLUG = "arenda-dolgosrok-porto-braga-2026";

const RENT_GLOSSARY_INTRO =
  "Термины из contrato, переписки с senhorio и квитанций — чтобы на просмотре и при подписи понимать, о чём речь, а не кивать на каждое португальское слово.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(PORTO_BRAGA_LONG_TERM_RENT_SLUG)!, RENT_GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор спорных формулировок черновика — без вырезания практики. Soft = ориентир из чатов/рынка; fixed = смягчено под официальную рамку. Аудитория гайда: RU/BY/UA/KZ с треком D7/D8/D2 в Norte (Porto, Braga, Guimarães, Gaia).",
    ],
    bullets: [
      "Fixed: «Decreto-Lei 13/2019» → речь о **Lei n.º 13/2019** (изменения NRAU / Código Civil), не отдельный «закон про договор». Письменная форма и сроки — в Código Civil / NRAU; сверяйте актуальную редакцию.",
      "OK / soft: caução для habitação часто ограничивают **двумя месяцами renda** — распространённая формулировка юристов и DECO-обзоров; exact article сверяйте перед спором.",
      "Fixed: «6–12 месяцев ренты upfront как норма» → на рынке так просят, но **antecipação de rendas** в типовой рамке тоже ограничена (часто ориентир до **2 месяцев**). Большие предоплаты — красный флаг: торгуйтесь caução bancária / fiador и сверяйте с advogado.",
      "Fixed: «арендатор чинит всё до €300/год» → **фиксированного порога €300 в законе нет**. По умолчанию conservação (art. 1074.º CC и след.) — на senhorio, salvo estipulação; мелкий износ от нормального использования — на inquilino.",
      "Fixed: «выйти можно с уведомлением за 120 дней» → сроки **denúncia** зависят от стороны и длительности contrato. Не копируйте «120 дней» как универсальный совет.",
      "Soft: registo в Finanças — senhorio обычно до **конца месяца, следующего** за началом; в быту говорят «~30 дней». С авг. 2025 inquilino может сам продвинуть регистрацию при затягивании (CLS — сверяйте портал).",
      "Soft: вилки Idealista и AIMA-очереди — полевые ориентиры, не официальная статистика.",
      "Soft: публичной «проверки чужого NIF одним кликом» обычно нет — NIF сторон в contrato, не перевод до подписи.",
      "Soft: honorários «1 месяц + IVA 23%» и caução bancária «1,5–3%» — рыночные ориентиры из чатов, не таблица AT.",
    ],
  },
  {
    heading: "Официально: договор, caução, registo Finanças",
    section_kind: "official",
    paragraphs: [
      "Долгосрочная аренда для жилья оформляется **contrato de arrendamento**. Для сроков дольше короткого транзита письменная форма — базовая защита: без неё сложнее доказать morada для AIMA, SNS и Finanças. Lei n.º 13/2019 усилила стабильность аренды (минимальные сроки / обновления в NRAU) — детали сверяйте в актуальной редакции Código Civil, а не в пересказе чата.",
      "Caução (залог) и antecipação de rendas — разные вещи. Обе часто ограничивают **двумя месяцами** renda в типовых обзорах; рынок иногда требует больше — это повод остановиться и сверить с advogado, а не «так все платят».",
      "Registo / comunicação do contrato в Autoridade Tributária обязателен для налоговой жизни договора. Senhorio обычно подаёт Modelo 2 / Imposto do Selo; inquilino сохраняет comprovativo. Без регистрации слабее IRS-вычет и доказательство адреса.",
    ],
    bullets: [
      "В contrato: NIF сторон, morada, renda, caução, срок, кто платит condomínio / IMI / utilities, условия denúncia, inventário.",
      "Caução — обычно до 2 meses; отдельная предоплата renda — тоже смотрите лимиты antecipação, не смешивайте с «ещё шесть месяцев наличными».",
      "Ежемесячно требуйте recibo de renda (или электронный эквивалент) с NIF обеих сторон.",
      "IMI как правило платит собственник; если clausula перекладывает IMI на inquilino — читайте дважды и торгуйтесь.",
      "Официальные ориентиры прав: [Portal das Finanças](https://www.portaldasfinancas.gov.pt/), [DECO](https://www.deco.pt/) — не замена advogado.",
    ],
  },
  {
    heading: "Официально / на практике: кому платить",
    section_kind: "official",
    paragraphs: [
      "По одному договору деньги часто уходят разным получателям. Путаница IBAN стоит recibo и спокойствия: transferência «не туда» формально может не считаться оплатой renda.",
    ],
    bullets: [
      "Renda — senhorio (proprietário) на IBAN из contrato; в descrição — morada и mês.",
      "Honorários imobiliária — агентству по счёту/recibo (часто ориентир 1 mês renda + IVA; на практике иногда просят больше — торгуйтесь до брони).",
      "Condomínio — administrador de condomínio, отдельный IBAN; не смешивайте с renda.",
      "Taxa registo / Imposto do Selo — разовый платёж по Finanças после comunicação do contrato.",
      "Utilities (água, luz, gás, internet) — после assinatura часто оформляют на inquilino; сверяйте contrato.",
    ],
  },
  {
    heading: "Зачем этот гайд и с чего начать",
    section_kind: "practice",
    paragraphs: [
      "Аренда — первая серьёзная сделка после прилёта в Norte. Ошибка здесь бьёт и по бюджету (часто комиссии агентства плюс caução), и по нервам: рынок долгосрочного arrendamento в Porto и Braga в 2025–2026 остаётся плотным, а senhorio и imobiliária нередко выбирают между несколькими заявками за пару суток.",
      "Ориентиры цен — по объявлениям Idealista / Imovirtual и разговорам в чатах; это не аудит рынка Emigro. Перед подписью сверяйте свой contrato и при споре — advogado / DECO.",
    ],
    bullets: [
      "Стартовый контур: NIF → PT IBAN → пакет платёжеспособности → просмотр → contrato → registo Finanças.",
      "Связанные гайды: [NIF в Порту](/notes/" +
        NIF_PORTO_GUIDE_SLUG +
        "), [счёт и кредитка](/notes/kak-otkryt-bankovskiy-schet-portugalia-2026), [первый месяц](/notes/pervyj-mesyac-portugaliya-checklist).",
    ],
  },
  {
    heading: "Чек-лист до просмотра",
    section_kind: "action_guide",
    paragraphs: [
      "Без базового пакета senhorio и imobiliária в Norte часто даже не назначают второй просмотр. Соберите документы до активного Idealista, особенно в августе–сентябре, когда совпадают студенты и волна релокантов.",
    ],
    bullets: [
      "NIF — без него contrato обычно не подпишут. Порядок для OPO/Porto: [NIF в Порту](/notes/" +
        NIF_PORTO_GUIDE_SLUG +
        ").",
      "IBAN португальского банка — для caução и renda. См. [счёт и кредитка](/notes/kak-otkryt-bankovskiy-schet-portugalia-2026).",
      "Fiador (поручитель с NIF) или альтернатива: caução bancária / гарантийное письмо банка — ориентир стоимости услуги 1,5–3% от годовой renda в чатах; сверяйте тариф банка.",
      "Выписки / payslips за ~3 месяца (для D7/D8 часто европейский счёт + контракт / invoices) — доказательство платёжеспособности.",
      "Паспорт и NIF всех, кого впишут в contrato — senhorio обычно фиксирует всех проживающих.",
      formatPracticeBullet({
        channels: ["por_tugal", "lepta"],
        period: "2025–2026",
        claim:
          "часть агентств в Porto обсуждала банковскую гарантию вместо fiador, когда у релоканта нет местного поручителя",
        forReader:
          "сравните стоимость гарантии с запросом «6 месяцев вперед» и не путайте рыночный запрос с лимитом antecipação",
      }),
    ],
  },
  {
    heading: "Бюджеты аренды: Porto и Braga (ориентиры)",
    section_kind: "practice",
    paragraphs: [
      "Цифры ниже — **ориентиры объявлений** (Idealista / Imovirtual и обсуждения 2025–2026), не каталог Emigro. Asking price часто выше финальной renda, если вы готовы подписать быстро; в пик сезона (август–сентябрь) торг слабее, иногда идёт конкуренция заявок.",
      "Сравнивайте всегда **renda + condomínio + utilities**, а не только цифру на карточке Idealista.",
    ],
    bullets: [
      "Porto центр (Cedofeita, Miragaia и рядом): T0 ~€750–950; T1 ~€950–1 200; T2 ~€1 300–1 700; T3 ~€1 800–2 500.",
      "Porto спальные (Ramalde, Lordelo и аналоги): T0 ~€600–750; T1 ~€750–950; T2 ~€1 000–1 300; T3 ~€1 400–1 800.",
      "Foz / Matosinhos / Bonfim (полевые вилки): Foz T2 часто ~€1 100–1 600; Matosinhos ~€900–1 300; Bonfim / Campanhã ~€750–1 100.",
      "Braga центр: T0 ~€550–700; T1 ~€650–850; T2 ~€850–1 100; T3 ~€1 100–1 400.",
      "Braga окраины (Gualtar, Nogueiró): T0 ~€450–600; T1 ~€550–700; T2 ~€700–900; T3 ~€900–1 200.",
      "Новые condomínios (Real / Parque Norte, Senhora da Hora): T2–T3 mobilado часто дороже «старого» centro из‑за AC, garagem, piscina — заложите отдельный condomínio.",
      formatPracticeBullet({
        channels: ["por_tugal"],
        period: "2025–2026",
        claim:
          "финальная renda иногда оказывается на несколько процентов ниже asking, если подпись следует за просмотром в течение 1–2 суток",
        forReader: "в августе–сентябре на это меньше рассчитывайте — держите plan B по району",
      }),
    ],
  },
  {
    heading: "Стартовые расходы: официально и на практике",
    section_kind: "gap",
    paragraphs: [
      "При заселении складывайте caução, предоплату, комиссию и первый месяц utilities. «Красная линия» рынка: запросы **3+ месяцев caução** или **очень большой upfront** без прозрачной банковской гарантии — стоп-сигнал: либо завышенный риск senhorio, либо схема, от которой лучше уйти.",
    ],
    bullets: [
      "Caução — официально часто до 2 meses; на практике у иностранцев без fiador почти всегда просят верхнюю границу.",
      "Комиссия агентства — ориентир 1 mês + IVA 23%; если просят 1,5 — торгуйтесь до брони и просите fatura.",
      "Utilities T2 — ориентир €80–150/мес; зимой в сыром старом prédio отопление может добавить заметную сумму (см. [климат Norte](/notes/" +
        NORTE_CLIMATE_COMFORT_SLUG +
        ")).",
      "Condomínio — ориентир €30–80/мес в обычном prédio; в новостроях с elevador/piscina нередко выше (€100–150+).",
      "IMI — по умолчанию собственник; clausula «всё на арендатора» проверяйте.",
    ],
  },
  {
    heading: "На практике: что встречается в договорах и чатах",
    section_kind: "practice",
    paragraphs: [
      "Официальная рамка и полевой опыт расходятся чаще всего на «без договора дешевле», языке clausulas и регистрации. Ниже — типичные развилки, не юридический вердикт по вашему кейсу.",
    ],
    bullets: [
      "«Без contrato, наличными, дешевле» — не берите: слабая защита, слабый comprovativo для AIMA при renovação, риск потерять деньги без следа.",
      "Договор только на португальском — попросите bilingual / summary и заложите сутки на перевод и сверку clausulas (DECO / чат / advogado).",
      "Clausula «арендатор оплачивает все ремонты» — слишком широкая; настаивайте на разделении conservação senhorio vs мелкий износ inquilino.",
      "Senhorio не регистрирует договор — его налоговый риск, но и ваш: без registo сложнее atestado / recibos для AIMA. Напомните срок; при затягивании смотрите опцию самостоятельной коммуникации на Portal das Finanças (с 2025).",
      formatPracticeBullet({
        channels: ["por_tugal", "chatlisboa"],
        period: "2025–2026",
        claim:
          "участники чатов предупреждали, что без зарегистрированного contrato и recibos продление ВНЖ и бытовые справки идут тяжелее",
        forReader: "заложите проверку registo в календарь на 30–45 день после assinatura",
      }),
    ],
  },
  {
    heading: "Поиск и фильтрация объявлений",
    section_kind: "action_guide",
    paragraphs: [
      "Крупные площадки дают объём, чаты — срочные cessão и частников. Фильтруйте жёстко: пустая карточка без этажа, года и фото мокрых зон — почти всегда потерянное время на выезд.",
    ],
    bullets: [
      "Idealista — база шире; много агентств с asking выше рынка.",
      "Imovirtual — чаще частники, меньше фильтров.",
      "FB/Telegram (#аренда_порту, #аренда_брага и локальные группы) — срочные передачи договора (cessão) ближе к концу месяца; экономия комиссии возможна, но проверяйте senhorio так же жёстко.",
      "Отсекайте объявления без фото всех комнат, этажа (rés-do-chão / cave — риск humidade), года постройки и намёка на отопление/AC.",
      formatPracticeBullet({
        channels: ["por_tugal", "lepta"],
        period: "2025–2026",
        claim:
          "срочные объявления о передаче договора чаще всплывают в последнюю неделю месяца, когда кто-то съезжает",
        forReader: "cessão экономит комиссию только если senhorio письменно согласен и Finanças обновлены",
      }),
    ],
  },
  {
    heading: "Просмотр: что проверить лично",
    section_kind: "action_guide",
    paragraphs: [
      "Фото Idealista не показывают запах, давление воды и вечерний шум. В старом Porto (часто до 1980-х) humidade и одинарные стёкла — типовой риск; подробнее — [климат Norte](/notes/" +
        NORTE_CLIMATE_COMFORT_SLUG +
        ").",
    ],
    bullets: [
      "Влажность и плесень — углы, шкафы, за шторами; фото с датой до подписи.",
      "Давление воды — кран на максимум на верхних этажах старых prédio.",
      "Окна — открыть/закрыть; одинарное стекло = дороже греть зимой.",
      "Шум — 5 минут тишины: трамвай, бары, стройка в centro Porto обычны.",
      "Парковка вечером; lugar de garagem часто отдельно (€50–100/мес ориентир).",
      "Соседи / подъезд — короткий разговор иногда дешевле сюрприза после ключей.",
    ],
  },
  {
    heading: "Переговоры и подписание",
    section_kind: "action_guide",
    paragraphs: [
      "Торг возможен, но не отменяет законных рамок caução / antecipação. Быстрая подпись помогает на конкурентном объекте; «подписали не глядя» — классическая ошибка.",
    ],
    bullets: [
      "Иногда удаётся −5–10% к asking при подписи в 24–48 ч — не гарантия в пик сезона.",
      "Мебель (mobília), рассрочка honorários, clausula о досрочном выходе — предмет переговоров; сроки denúncia сверяйте с законом, не с шаблоном агента.",
      "В contrato: стороны с NIF, адрес и комнаты, renda и способ оплаты, caução и возврат, utilities/IMI/condomínio, срок, inventário с фото, обязательство registo Finanças.",
      "Сфотографируйте дефекты при заселении (метаданные даты) — типичная защита при споре о caução на выезде.",
      "Не переводите caução до подписи и проверки реквизитов; только transferência с назначением, не «наличные без расписки».",
    ],
  },
  {
    heading: "Porto vs Braga: где снимать",
    section_kind: "practice",
    paragraphs: [
      "Выбор города — про бюджет, commute и инфраструкцию семьи, не про «где быстрее AIMA навсегда». Очереди AIMA меняются; не стройте аренду только на слухе «в Браге слотов больше». Сравнение школ и быта — [Porto vs Braga](/notes/" +
        PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
        ").",
    ],
    bullets: [
      "Porto: выше T2 (~€1 000–1 300+ в спальных / больше в центре), Metro/трамвай, OPO ближе, шире RU-сообщество и коворкинги; английский встречается чаще.",
      "Braga: T2 часто ~€700–900, спокойнее и дешевле, поезд/авто до Porto ~45–60 мин; португальский нужнее в быту; для семьи с remote — частый выбор.",
      "Guimarães / Gaia — запасной бюджетный контур с commute.",
      "Без машины в центре Porto проще; с детьми и remote — чаще смотрят Braga / Gualtar / Real, заложив отдельный condomínio в новостроях.",
    ],
  },
  {
    heading: "Новые condomínios Norte (Real, Matosinhos)",
    section_kind: "practice",
    paragraphs: [
      "Если нужны AC, garagem и закрытый двор — фильтруйте nova construção / condomínio fechado, а не только centro histórico. В Real (Braga) и Senhora da Hora класс жилья и чек condomínio другие, чем в старом Bonfim.",
    ],
    bullets: [
      "Braga Real / Cancela — ряды вроде Green Terrace: varanda, box, часто piscina; T3 mobilado в чатах 2025–2026 нередко €1 200–2 000+ плюс condomínio.",
      "Matosinhos / Senhora da Hora — Condomínio do Sobreiro и аналоги у Metro; проверяйте risco inundação у пляжа.",
      "До подписи: valor condomínio/mês, что входит, atas com obras — внезапный elevador бьёт больнее, чем +€50 renda.",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Большинство потерь — не «не тот район», а перевод до проверки, договор без registo и квартира без отопления в сыром prédio.",
    ],
    bullets: [
      "Подписали по фото без визита — плесень, шум, давление воды.",
      "Caução наличными без следа — слабые доказательства.",
      "Не проверили registo через ~месяц — сюрприз для AIMA/Finanças.",
      "Не читали condomínio — +€100–150/мес в новострое.",
      "Взяли без отопления/AC в старом Porto — зима и счета.",
      "Смешали IBAN renda и condomínio — долг у administrador копится незаметно.",
    ],
  },
];

const keyTakeaways = [
  "Официально: contrato письменный, caução и antecipação в типовой рамке часто до 2 meses каждая; registo в Finanças нужен для налоговой жизни договора и доказательства morada.",
  "Официально: conservação по умолчанию — на senhorio (art. 1074.º CC и след.), мелкий износ от нормального использования — на inquilino; фиксированного «€300/год» в законе нет.",
  formatPracticeTakeaway({
    channels: ["por_tugal", "lepta"],
    period: "2025–2026",
    claim:
      "без fiador в Porto/Braga часто просят верхнюю caução и/или обсуждают банковскую гарантию или крупную предоплату",
    forReader:
      "сверяйте запрос с лимитами antecipação и не переводите деньги до подписи contrato",
  }),
  formatPracticeTakeaway({
    channels: ["por_tugal"],
    period: "2026",
    claim:
      "ориентиры T2: Porto спальные ~€1 000–1 300, центр выше; Braga centro/окраины часто заметно дешевле",
    forReader: "всегда складывайте renda + condomínio + utilities",
  }),
  "Расхождение: asking Idealista ≠ финальная renda; AIMA-очереди и «6 месяцев вперед» — полевые истории, не закон. Сроки denúncia сверяйте по clausula и Código Civil, не по FAQ из чата.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли снять квартиру без NIF?",
    a: "На практике почти нет: senhorio не сможет нормально провести registo и recibos. Получите NIF в первую очередь — [гайд по NIF в Порту](/notes/" +
      NIF_PORTO_GUIDE_SLUG +
      ").",
  },
  {
    q: "Что делать, если нет fiador и банк не даёт гарантию?",
    a: "Иногда помогают расширенные выписки, поручитель из ЕС или переговоры с частником. Запросы «6–12 месяцев вперед» встречаются в чатах, но могут конфликтовать с лимитами antecipação — сверяйте с advogado и не путайте рыночный страх senhorio с законом.",
  },
  {
    q: "Сколько времени искать квартиру?",
    a: "Ориентир из практики: в августе–сентябре чаще 2–4 недели активного поиска; зимой иногда быстрее. Это не гарантия — зависит от бюджета и гибкости по району.",
  },
  {
    q: "Нужна ли seguro de arrendamento?",
    a: "Не всегда обязательна по закону, но senhorio/агентство могут требовать. Ориентир стоимости в обзорах €100–200/год — сверяйте полис.",
  },
  {
    q: "Как выехать досрочно?",
    a: "Сроки denúncia зависят от длительности contrato и стороны. Cessão (передача договора) иногда экономит конфликт, если senhorio согласен письменно. Не опирайтесь на универсальные «120 дней» из чата — читайте clausula и при споре advogado.",
  },
  {
    q: "Кому переводить ежемесячную аренду?",
    a: "Senhorio — на IBAN из contrato; condomínio — administrador. Требуйте recibo каждый месяц. Подробности оплаты — в разделах выше и в [гайде по счёту](/notes/kak-otkryt-bankovskiy-schet-portugalia-2026).",
  },
  {
    q: "Может ли арендатор сам зарегистрировать договор в Finanças?",
    a: "С августа 2025 inquilino может продвинуть коммуникацию, если senhorio не уложился в срок. Точный путь — на Portal das Finanças (CLS / comunicação do locatário); сохраняйте comprovativo.",
  },
  {
    q: "Porto или Braga для семьи на D7/D8?",
    a: "Часто Braga дешевле и спокойнее при remote; Porto — ближе OPO, Metro и сообщество, но дороже. Школы и районы — [Porto vs Braga](/notes/" +
      PORTO_VS_BRAGA_FAMILY_SCHOOLS_SLUG +
      ").",
  },
];

export const PORTO_BRAGA_LONG_TERM_RENT_GUIDE = {
  slug: PORTO_BRAGA_LONG_TERM_RENT_SLUG,
  category: "Аренда",
  content_kind: "guide" as ContentKind,
  title: "Долгосрочная аренда в Порту и Браге 2026: гайд для релоканта",
  excerpt:
    "Norte 2026: чек-лист до просмотра, бюджеты Porto/Braga, caução и fiador, registo Finanças, просмотр на плесень, переговоры и типичные ошибки — с Nota Emigro по закону.",
  seo_title: "Аренда Porto/Braga 2026 — caução, fiador, районы",
  seo_description:
    "Долгосрок Porto/Braga 2026: NIF, IBAN, caução до 2 мес, fiador/гарантия, Idealista-ориентиры, registo Finanças, Porto vs Braga. Для D7/D8 — не юрконсультация.",
  quick_answer:
    "Для долгосрочной аренды в Porto/Braga соберите NIF, PT IBAN и пакет платёжеспособности до просмотров. Caução и предоплата в типовой рамке часто до двух месяцев каждая; большие «upfront» из чатов сверяйте с законом. Платите senhorio и condomínio на разные IBAN, требуйте recibo и проверьте registo в Finanças. Цены Idealista — ориентир: T2 в спальных Porto часто около €1 000–1 300, в Braga заметно ниже.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "Idealista — arrendar", url: "https://www.idealista.pt/arrendar-casas/" },
    { title: "Imovirtual", url: "https://www.imovirtual.com/" },
    { title: "DECO", url: "https://www.deco.pt/" },
    { title: "AIMA", url: "https://aima.gov.pt/" },
  ],
  topic_tags: ["arenda", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["arenda", "portugal"],
    contentKind: "guide",
    extra: [
      "porto",
      "braga",
      "norte",
      "foz",
      "matosinhos",
      "gualtar",
      "renda",
      "caucao",
      "fiador",
      "financas",
    ],
  }),
  source_channel: "por_tugal+lepta+chatlisboa+official-editorial",
  source_label: "editorial:porto-braga-rent-sep2026-factcheck",
};

export default PORTO_BRAGA_LONG_TERM_RENT_GUIDE;
