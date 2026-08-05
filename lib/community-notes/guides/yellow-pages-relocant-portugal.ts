/**
 * Yellow pages for relocants in Portugal — official contacts + what/why + deep links.
 * Voice: practical directory, not a dump of URLs.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { formatPracticeBullet, formatPracticeTakeaway } from "@/lib/community-notes/practice-format";
import { PORTUGAL_BANK_ACCOUNT_SLUG } from "@/lib/community-notes/guides/portugal-bank-account";
import { LISBON_RENT_FIRST_MONTH_SLUG } from "@/lib/community-notes/guides/lisbon-rent-first-month";
import { VNJ_RENEWAL_SLUG } from "@/lib/community-notes/guides/prodlenie-vnzh-portugaliya-aima-2026";
import { EMBASSY_APPOINTMENT_GUIDE_SLUG } from "@/lib/community-notes/guides/embassy-appointment-booking";
import { MEDITSINA_NORTE_HEALTHCARE_SLUG } from "@/lib/community-notes/guides/meditsina-norte-healthcare";
import { INTERNATIONAL_SCHOOLS_GUIDE_SLUG } from "@/lib/community-notes/guides/international-schools-portugal";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const YELLOW_PAGES_RELOCANT_SLUG = "zheltye-stranitsy-relokanta-portugaliya-2026";

const GLOSSARY_INTRO =
  "Короткий словарь органов, на которые ссылаются ниже — чтобы не путать AIMA с Finanças и Junta с Loja do Cidadão.";

const DISCLAIMER =
  "**Emigro — не юридическая консультация и не call-center.** Ссылки и компетенции органов меняются. Перед подачей документов сверяйте актуальные формы на официальных сайтах; экстренные случаи — **112**.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(YELLOW_PAGES_RELOCANT_SLUG)!, GLOSSARY_INTRO),
    paragraphs: [GLOSSARY_INTRO, DISCLAIMER],
  },
  {
    heading: "Официально: как пользоваться справочником",
    section_kind: "official",
    paragraphs: [
      "Что делать: держать этот список как «жёлтые страницы» — сначала нужный орган и зачем он, потом ссылка, потом наш детальный гайд по теме.",
      "Зачем: новичок теряет дни в чатах, ища «куда писать про NIF», хотя входная точка уже есть на ePortugal / gov.pt.",
      "Главное: экстренное — 112; миграция — AIMA; налоги — Finanças; здоровье — SNS/SNS 24; гражданинский one-stop — Loja do Cidadão.",
    ],
    bullets: [
      "[ePortugal](https://eportugal.gov.pt/) — государственный «портал входов»: поиск услуг, запись, переходы на Finanças, IRN, Segurança Social.",
      "[gov.pt](https://www.portugal.gov.pt/) — новости правительства и политики; не путать с операционными сервисами AIMA/Finanças.",
      "112 — единый номер экстренных служб (полиция, скорая, пожарные) по всей стране.",
      "SNS 24 — **808 24 24 24** (из PT) / [sns24.gov.pt](https://www.sns24.gov.pt/): триаж по телефону до похода в urgência.",
      "Loja do Cidadão — очный one-stop (NIF, часть IRN/SS услуг): точки ищем через ePortugal / местную Câmara.",
      "Junta de Freguesia — ваш районный «приход»: Atestado de Residência, часть подписей и локальных справок.",
    ],
  },
  {
    heading: "Миграция и ВНЖ: AIMA, визы, продление",
    section_kind: "official",
    paragraphs: [
      "Что делать: любые вопросы título de residência, biometria, renovação — начинать с AIMA, не с «знакомого в чате».",
      "Зачем: SEF больше нет как единого входа; слоты, taxas и порталы менялись в 2025–2026.",
      "Главное: разные двери — aima.gov.pt (инфо), Agora (запись на balcão), portal-renovacoes (продление), Portal ARI (Golden Visa).",
    ],
    bullets: [
      "[AIMA](https://aima.gov.pt/) — Agência para a Integração, Migrações e Asilo: статусы, новости, таблицы taxas, инструкции.",
      "[Portal das Renovações](https://portal-renovacoes.aima.gov.pt/) — онлайн-продление título; детали в [гайде renovação](/notes/" +
        VNJ_RENEWAL_SLUG +
        ").",
      "[services.aima.gov.pt](https://services.aima.gov.pt/) — часто для просроченных кейсов **после** письма AIMA, не «кнопка на удачу».",
      "Agora / agendamento AIMA — запись на личный визит/биометрию; практика слотов — [гайд Agora](/notes/aima-agora-zapis-2026).",
      "[Portal ARI](https://aima.gov.pt/pt/viver/autorizacao-de-residencia-para-investimento-art-90-o-a/portal-ari) — Golden Visa / инвестиционный трек (отдельный контур от D7/D8).",
      "[vistos.mne.gov.pt](https://www.vistos.mne.gov.pt/) — визы D до въезда: требования консульств, чеклисты по типу визы.",
      "Advogado de imigração / solicitador — платный, но часто обязательный слой для сложных кейсов; Emigro не заменяет юрконсультацию.",
    ],
  },
  {
    heading: "Налоги, NIF, соцстрах, банк-регулятор",
    section_kind: "official",
    paragraphs: [
      "Что делать: NIF и morada fiscal — через Finanças; NISS и взносы — Segurança Social; жалобы на банк — Banco de Portugal.",
      "Зачем: без NIF нет аренды, счёта и многих AIMA-процессов; без SS — проблемы с работой/автономо.",
    ],
    bullets: [
      "[Portal das Finanças](https://www.portaldasfinancas.gov.pt/) — NIF, e-fatura, IRS, e-arrendamento, senha de acesso.",
      "Autoridade Tributária (AT) / Finanças balcão — очные вопросы по NIF и morada; часто через Loja do Cidadão.",
      "[Segurança Social](https://www.seg-social.pt/) — NISS, вклад работника/empresa, часть пособий; портал Segurança Social Direta.",
      "[Banco de Portugal — Cliente Bancário](https://clientebancario.bportugal.pt/) — права клиента, жалобы на банки, CRC.",
      "Практика открытия счёта и KYC — [счёт и кредитка](/notes/" + PORTUGAL_BANK_ACCOUNT_SLUG + ").",
      "Аренда + registo contrato в Finanças — [первый месяц аренды Lx](/notes/" + LISBON_RENT_FIRST_MONTH_SLUG + ").",
    ],
  },
  {
    heading: "Здоровье, школа, авто, паспорт",
    section_kind: "official",
    paragraphs: [
      "Что делать: SNS по morada, школа через DGE/admissions, авто через IMT, загран через консульство своей страны.",
      "Зачем: это четыре разных «мира» документов — один чат не заменяет четыре портала.",
    ],
    bullets: [
      "[SNS](https://www.sns.gov.pt/) — национальная система здравоохранения; inscrição в centro de saúde по адресу.",
      "[SNS 24](https://www.sns24.gov.pt/) / 808 24 24 24 — телефонный триаж; Norte-практика — [медицина Norte](/notes/" +
        MEDITSINA_NORTE_HEALTHCARE_SLUG +
        ").",
      "[DGE](https://www.dge.mec.pt/) — Direção-Geral da Educação: рамка школ; international — отдельно admissions школы, см. [школы](/notes/" +
        INTERNATIONAL_SCHOOLS_GUIDE_SLUG +
        ").",
      "[IMT](https://www.imt-ip.pt/) — Instituto da Mobilidade e dos Transportes: carta de condução, matrícula, импорт авто.",
      "ПСП/ГНР: [PSP](https://www.psp.pt/) (города), [GNR](https://www.gnr.pt/) (районы вне крупных городов) — заявления, часть штрафов.",
      "Консульство РФ в Lisboa (очередь kdmid) — [запись в консульство](/notes/" + EMBASSY_APPOINTMENT_GUIDE_SLUG + "); граждане UA/BY/KZ — консульства своих стран.",
      "[IRN](https://irn.justica.gov.pt/) — Instituto dos Registos e do Notariado: гражданские записи, часть notarиальных/реестровых услуг.",
    ],
  },
  {
    heading: "Быт: почта, транспорт, жильё, связь, защита прав",
    section_kind: "practice",
    paragraphs: [
      "Что делать: для карты, посылок и штрафов знать CTT и порталы городов; для аренды — Idealista + Finanças, не только WhatsApp.",
      "Зачем: «жёлтые страницы» без быта бесполезны на второй неделе.",
    ],
    bullets: [
      "[CTT](https://www.ctt.pt/) — почта, часть доставок карт/документов, tracking.",
      "Транспорт Lisboa: [Metropolitano](https://www.metrolisboa.pt/), Carris, Navegante; Porto: Metro do Porto, STCP, Andante — сайты операторов вашего города.",
      "[CP](https://www.cp.pt/) — Comboios de Portugal (поезда между городами).",
      "[Idealista](https://www.idealista.pt/) / [Imovirtual](https://www.imovirtual.com/) — поиск аренды; договор всё равно через Finanças/registo.",
      "Операторы связи: MEO, NOS, Vodafone, Nowo — SIM и fibra; споры — [ANACOM](https://www.anacom.pt/) / CIAB.",
      "Энергия/вода: EDP, Galp, Endesa, EPAL (Lisboa) — переоформление на NIF после contrato.",
      "Защита потребителя: [DECO Proteste](https://www.deco.proteste.pt/) (ассоциация), Livro de Reclamações (электронная книга жалоб в сервисах).",
      formatPracticeBullet({
        channels: ["chatlisboa", "por_tugal", "lepta"],
        period: "2025–2026",
        claim:
          "в чатах чаще всего переспрашивают одни и те же двери: Finanças (NIF), AIMA/Agora, SNS 24, Junta для Atestado и CTT для карт",
        forReader: "сохраните этот гайд и 4–5 закладок порталов — не копируйте сомнительные «личные кабинеты» из пересылки",
      }),
    ],
  },
  {
    heading: "Пошагово: какие контакты закрыть в первую неделю",
    section_kind: "action_guide",
    paragraphs: [
      "Что делать: пройти контакты в порядке зависимостей — NIF → morada → банк/SNS → AIMA-статус.",
      "Зачем: без NIF и адреса остальные двери часто закрыты.",
      "Главное: 112 и SNS 24 — в избранное телефона в день прилёта.",
    ],
    bullets: [
      "Шаг 1 — 112 и SNS 24 (808 24 24 24) в контакты телефона.",
      "Шаг 2 — NIF / senha на [Portal das Finanças](https://www.portaldasfinancas.gov.pt/) (или Loja do Cidadão).",
      "Шаг 3 — Junta de Freguesia: Atestado / подтверждение адреса при необходимости.",
      "Шаг 4 — Банк с PT IBAN — [гайд по счёту](/notes/" + PORTUGAL_BANK_ACCOUNT_SLUG + ").",
      "Шаг 5 — Centro de saúde / SNS по morada; при симптомах сначала SNS 24.",
      "Шаг 6 — Проверить статус AIMA: portal-renovacoes / Agora / письмо на e-mail — не смешивать двери.",
      "Шаг 7 — Школа/IMT/консульство — только если актуально в этом месяце (ссылки выше).",
      "Шаг 8 — Закладки: ePortugal, Finanças, AIMA, SNS 24, CTT.",
    ],
  },
  {
    heading: "Где чат и официальный сайт расходятся",
    section_kind: "gap",
    paragraphs: [
      "Что делать: если совет из Telegram противоречит aima.gov.pt / portaldasfinancas.gov.pt — верьте порталу или адвокату.",
      "Зачем: «жёлтые страницы из чата» быстро устаревают и иногда ведут на фишинг.",
    ],
    bullets: [
      "Чат: «пиши на этот personal e-mail AIMA» → официально — порталы и Loja AIMA по записи.",
      "Чат: «NIF только с ВНЖ» → Finanças выдаёт NIF и раньше; детали зависят от резидентства/представителя.",
      "Чат: «одна ссылка Agora на всё» → renovação, ARI и первичная биометрия — разные входы.",
      "Чат: «звоните в SEF» → SEF как бренд ушёл; миграция — AIMA.",
      "Пересланный «логин Finanças» → только https://www.portaldasfinancas.gov.pt/ и официальное приложение.",
      "«Бесплатный юрист из чата» → проверяйте Ordem dos Advogados / отзывы; для AIMA часто нужен платный advogado.",
    ],
  },
  {
    heading: "Типичные ошибки со справочником",
    section_kind: "practice",
    paragraphs: [
      "Оптимально: 8–10 официальных закладок + этот гайд; чаты — для практики, не как первичная адресная книга.",
    ],
    bullets: [
      "Ошибка: искать «телефон AIMA из WhatsApp» вместо aima.gov.pt / Agora.",
      "Ошибка: путать Finanças (налоги/NIF) и Segurança Social (NISS/взносы).",
      "Ошибка: идти в urgência без SNS 24 при не-экстренном случае — часы в очереди.",
      "Ошибка: не обновить morada fiscal после переезда — письма уходят «в никуда».",
      "Ошибка: держать только Revolut-контакты без PT-банка и Finanças.",
      "Ошибка: откладывать консульский паспорт до истечения — очередь kdmid живёт своей жизнью.",
      "Ошибка: платить посреднику «за контакт внутри AIMA» — красный флаг.",
    ],
  },
];

const keyTakeaways = [
  "Официально: входные двери государства — ePortugal, AIMA, Portal das Finanças, Segurança Social, SNS/SNS 24; экстренное — 112.",
  formatPracticeTakeaway({
    channels: ["chatlisboa", "por_tugal", "lepta"],
    period: "2025–2026",
    claim:
      "в чатах снова и снова спрашивают одни органы — Finanças, AIMA/Agora, Junta, SNS 24 и CTT",
    forReader: "сохраните этот справочник и не копируйте сомнительные «личные кабинеты» из пересылок",
  }),
  "Официально: renovação, ARI и визы D — разные порталы; не смешивайте Agora с portal-renovacoes.",
  "Расхождение: совет из чата ≠ компетенция органа; при конфликте смотрите gov-портал или advogado.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Куда звонить в экстренной ситуации?",
    a: "112 — полиция, скорая, пожарные. Для медицинских вопросов не-экстренного характера сначала SNS 24: 808 24 24 24 или sns24.gov.pt.",
  },
  {
    q: "С чего начать, если только приехал?",
    a: "NIF (Finanças) → адрес/Junta → банк → SNS → проверить статус AIMA. Порядок в секции «первая неделя» этого гайда.",
  },
  {
    q: "Куда по ВНЖ и продлению?",
    a: "aima.gov.pt для информации; portal-renovacoes.aima.gov.pt для онлайн-продления; Agora для записи на balcão. Подробно: гайд renovação и гайд Agora.",
  },
  {
    q: "Где сделать NIF?",
    a: "Portal das Finanças / Loja do Cidadão / fiscal representative для нерезидентов. Без NIF почти ничего дальше не откроется.",
  },
  {
    q: "Чем Junta отличается от Loja do Cidadão?",
    a: "Junta de Freguesia — районный орган (Atestado, локальные справки). Loja do Cidadão — multi-service точка с несколькими госорганами в одном здании.",
  },
  {
    q: "Куда жаловаться на банк?",
    a: "Сначала в банк письменно, затем Banco de Portugal — clientebancario.bportugal.pt. Открытие счёта: наш банковский гайд.",
  },
  {
    q: "Где искать школу и больницу?",
    a: "Школы: DGE + admissions конкретной школы (см. гайд international schools). Здоровье: SNS по morada + SNS 24; Norte — гайд медицины.",
  },
  {
    q: "Нужны ли Telegram-чаты, если есть этот справочник?",
    a: "Чаты полезны для «как прошло вчера в отделении X», но не как адресная книга. Официальные ссылки — только с .gov.pt / проверенных доменов органов.",
  },
];

export const YELLOW_PAGES_RELOCANT_GUIDE = {
  slug: YELLOW_PAGES_RELOCANT_SLUG,
  category: "Справочник",
  content_kind: "guide" as ContentKind,
  title: "Жёлтые страницы релоканта в Португалии 2026: важные контакты и зачем они",
  excerpt:
    "AIMA, Finanças, SNS 24, Junta, Loja do Cidadão, IMT, CTT и другие двери государства: что это, зачем звонить/заходить и куда идти дальше.",
  seo_title: "Жёлтые страницы релоканта PT 2026",
  seo_description:
    "Жёлтые страницы релоканта в Португалии 2026: AIMA, Finanças, SNS 24, Junta, Loja do Cidadão, IMT, CTT — что это, зачем нужно и куда кликать.",
  quick_answer:
    "Вы гуглите «телефон AIMA» и получаете чужой WhatsApp из чата 2023 года — так теряют недели. Держите короткую карту: 112 и SNS 24 на телефоне; NIF в Finanças; статус ВНЖ в AIMA/portal-renovacoes; адрес в Junta; быт через ePortugal и CTT. Ниже — кто есть кто и зачем, со ссылками и переходами в детальные гайды Emigro.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "ePortugal", url: "https://eportugal.gov.pt/" },
    { title: "AIMA", url: "https://aima.gov.pt/" },
    { title: "Portal das Renovações AIMA", url: "https://portal-renovacoes.aima.gov.pt/" },
    { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "Segurança Social", url: "https://www.seg-social.pt/" },
    { title: "SNS", url: "https://www.sns.gov.pt/" },
    { title: "SNS 24", url: "https://www.sns24.gov.pt/" },
    { title: "IMT", url: "https://www.imt-ip.pt/" },
    { title: "Banco de Portugal — Cliente Bancário", url: "https://clientebancario.bportugal.pt/" },
    { title: "vistos.mne.gov.pt", url: "https://www.vistos.mne.gov.pt/" },
  ],
  topic_tags: ["contacts", "portugal", "aima"],
  hashtags: buildNoteHashtags({
    topicTags: ["contacts", "portugal", "aima"],
    contentKind: "guide",
    extra: ["справочник", "контакты", "nif", "sns", "financas", "112"],
  }),
  source_channel: "editorial+aima+financas+sns+chatlisboa+por_tugal+lepta",
  source_label: "editorial:yellow-pages-relocant-2026",
};
