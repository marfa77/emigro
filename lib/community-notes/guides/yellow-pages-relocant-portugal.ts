/**
 * Hand-curated Portugal guide — Grok 4.3 rewrite + editorial apply (2026-09-21).
 * Continuous practical prose; no «Что делать:/Зачем читать:» telegraph.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const YELLOW_PAGES_RELOCANT_SLUG = "zheltye-stranitsy-relokanta-portugaliya-2026";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(YELLOW_PAGES_RELOCANT_SLUG)!),
  },
  {
    heading: "Официально: как пользоваться справочником",
    section_kind: "official",
    paragraphs: [
      "Сохраните этот список как справочник на первые месяцы. Новичок часто теряет дни, разыскивая в чатах, куда обращаться за NIF, хотя точка входа уже есть на ePortugal. Главное: экстренное — 112; миграция — AIMA; налоги — Finanças; здоровье — SNS/SNS 24; гражданские услуги — Loja do Cidadão.",
    ],
    bullets: [
      "Зайдите на ePortugal, чтобы найти услуги и перейти в нужные органы.",
      "Проверяйте новости на gov.pt, но для операций используйте порталы AIMA и Finanças.",
      "Добавьте 112 в избранное телефона сразу после прилёта.",
      "Звоните SNS 24 перед визитом в urgência для триажа.",
      "Ищите Loja do Cidadão и Junta через ePortugal по вашему району.",
    ],
  },
  {
    heading: "Миграция и ВНЖ: AIMA, визы, продление",
    section_kind: "official",
    paragraphs: [
      "Любые вопросы по título de residência, биометрии и renovação начинайте с AIMA. SEF больше не существует как единая точка входа, а слоты и порталы обновлялись в 2025–2026 годах. Главное: используйте разные входы — aima.gov.pt для информации, Agora для записи, portal-renovacoes для продления и Portal ARI для Golden Visa.",
    ],
    bullets: [
      "Откройте aima.gov.pt для статусов, таблиц taxas и инструкций.",
      "Подайте renovação через portal-renovacoes.aima.gov.pt и читайте отдельный гайд.",
      "Запишитесь на приём через services.aima.gov.pt или Agora по ссылке в письме.",
      "Для виз D до въезда используйте vistos.mne.gov.pt.",
      "При сложных кейсах обратитесь к advogado de imigração.",
    ],
  },
  {
    heading: "Налоги, NIF, соцстрах, банк-регулятор",
    section_kind: "official",
    paragraphs: [
      "NIF и morada fiscal оформляют через Finanças, NISS и взносы — через Segurança Social, жалобы на банк — через Banco de Portugal. Без NIF невозможно арендовать жильё, открыть счёт и пройти многие процедуры AIMA. Главное: начните с Portal das Finanças, затем перейдите в Segurança Social и проверьте права клиента на clientebancario.bportugal.pt.",
    ],
    bullets: [
      "Получите senha de acesso на Portal das Finanças.",
      "Обратитесь в balcão Finanças или Loja do Cidadão за NIF.",
      "Зарегистрируйте NISS и взносы на seg-social.pt.",
      "Проверьте права клиента и подайте жалобу на Banco de Portugal.",
      "Оформите registo contrato аренды в Finanças.",
    ],
  },
  {
    heading: "Здоровье, школа, авто, паспорт",
    section_kind: "official",
    paragraphs: [
      "SNS привязан к morada, школа проходит через DGE, авто — через IMT, загранпаспорт — через консульство своей страны. Это четыре разных контура документов, и один чат не заменит четыре портала. Главное: зарегистрируйтесь в centro de saúde по адресу, затем проверьте DGE и IMT при необходимости.",
    ],
    bullets: [
      "Встаньте на учёт в SNS по адресу проживания.",
      "Звоните SNS 24 для триажа перед urgência.",
      "Ищите школы на dge.mec.pt и на сайтах конкретных учебных заведений.",
      "Оформляйте carta de condução и импорт авто на imt-ip.pt.",
      "Запишитесь в консульство своей страны через kdmid для паспорта.",
    ],
  },
  {
    heading: "Быт: почта, транспорт, жильё, связь, защита прав",
    section_kind: "practice",
    paragraphs: [
      "Для карт, посылок и штрафов используйте CTT и городские порталы, для аренды — Idealista плюс регистрацию в Finanças. Без бытовых контактов справочник теряет смысл уже на второй неделе. Главное: добавьте CTT и операторов связи в закладки, а договор аренды регистрируйте в Finanças.",
    ],
    bullets: [
      "Отслеживайте доставку документов через ctt.pt.",
      "Покупайте проездные Metropolitano, Carris или Metro do Porto.",
      "Ищите жильё на Idealista и Imovirtual, затем регистрируйте договор.",
      "Подключайте связь у MEO, NOS или Vodafone и споры решайте через ANACOM.",
      "Переоформите энергию и воду на NIF после подписания contrato.",
    ],
  },
  {
    heading: "Где чат и официальный сайт расходятся",
    section_kind: "gap",
    paragraphs: [
      "Если совет из Telegram противоречит aima.gov.pt или portaldasfinancas.gov.pt, ориентируйтесь на портал или адвоката. Чат-адреса быстро устаревают и иногда ведут на фишинг. Главное: проверяйте все ссылки на доменах .gov.pt и не используйте пересланные логины.",
    ],
    bullets: [
      "Чат предлагает писать на личный e-mail AIMA — официально используйте порталы и Loja по записи.",
      "Чат утверждает, что NIF только с ВНЖ — Finanças выдаёт NIF раньше.",
      "Чат даёт одну ссылку Agora на всё — renovação, ARI и биометрия требуют разных входов.",
      "Чат советует звонить в SEF — SEF ушёл, миграция теперь в AIMA.",
    ],
  },
  {
    heading: "Типичные ошибки со справочником",
    section_kind: "practice",
    paragraphs: [
      "Оптимально держать 8–10 официальных закладок и этот гайд, а чаты использовать только для практики. Главное: не ищите телефоны в WhatsApp и не откладывайте обновление morada fiscal.",
    ],
    bullets: [
      "Ошибка: искать телефон AIMA в пересылках вместо aima.gov.pt.",
      "Ошибка: путать Finanças с Segurança Social.",
      "Ошибка: идти в urgência без звонка SNS 24 при не-экстренном случае.",
      "Ошибка: не обновлять morada fiscal после переезда.",
      "Ошибка: держать только Revolut без PT-банка и регистрации в Finanças.",
    ],
  }
];

const keyTakeaways = [
  "Официально: входные двери государства — ePortugal, AIMA, Portal das Finanças, Segurança Social, SNS/SNS 24; экстренное — 112.",
  "На практике: в 2025–2026 годах релоканты чаще всего обращаются в Finanças, AIMA/Agora, Junta, SNS 24 и CTT, поэтому сохраните этот справочник и не копируйте сомнительные личные кабинеты из пересылок.",
  "Официально: renovação, ARI и визы D — разные порталы; не смешивайте Agora с portal-renovacoes.",
  "Расхождение: совет из чата не заменяет компетенцию органа; при конфликте проверяйте gov-портал или обращайтесь к адвокату.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Куда звонить в экстренной ситуации?",
    a: "112 — полиция, скорая, пожарные. Для медицинских вопросов не-экстренного характера сначала SNS 24: 808 24 24 24 или sns24.gov.pt.",
  },
  {
    q: "С чего начать, если только приехал?",
    a: "NIF через Finanças, затем адрес в Junta, банк, SNS и проверка статуса AIMA. Порядок описан в разделе первой недели.",
  },
  {
    q: "Куда по ВНЖ и продлению?",
    a: "aima.gov.pt для информации, portal-renovacoes.aima.gov.pt для онлайн-продления, Agora для записи на balcão. Подробности в отдельных гайдах.",
  },
  {
    q: "Где сделать NIF?",
    a: "Portal das Finanças, Loja do Cidadão или через fiscal representative для нерезидентов. Без NIF почти ничего дальше не откроется.",
  },
  {
    q: "Чем Junta отличается от Loja do Cidadão?",
    a: "Junta de Freguesia — районный орган для Atestado и локальных справок. Loja do Cidadão — многофункциональная точка с несколькими органами в одном здании.",
  },
  {
    q: "Куда жаловаться на банк?",
    a: "Сначала в банк письменно, затем в Banco de Portugal на clientebancario.bportugal.pt. Открытие счёта описано в отдельном гайде.",
  },
  {
    q: "Где искать школу и больницу?",
    a: "Школы через DGE и admissions конкретной школы, здоровье — SNS по morada и SNS 24. Для Севера смотрите отдельный гайд по медицине.",
  },
  {
    q: "Нужны ли Telegram-чаты, если есть этот справочник?",
    a: "Чаты полезны для отзывов о конкретном отделении, но не как адресная книга. Официальные ссылки только на .gov.pt и проверенные домены органов.",
  },
];

export const YELLOW_PAGES_RELOCANT_GUIDE = {
  slug: YELLOW_PAGES_RELOCANT_SLUG,
  category: "Справочник",
  content_kind: "guide" as ContentKind,
  title: "Жёлтые страницы релоканта в Португалии 2026",
  excerpt: "AIMA, Finanças, SNS 24, Junta, Loja do Cidadão, IMT, CTT и другие двери государства: что это, зачем звонить/заходить и куда идти дальше.",
  seo_title: "Жёлтые страницы релоканта PT 2026",
  seo_description: "Жёлтые страницы релоканта в Португалии 2026: AIMA, Finanças, SNS 24, Junta, Loja do Cidadão, IMT, CTT — что это, зачем нужно и куда кликать. Практика для релока",
  quick_answer: "При переезде в Португалию новички тратят недели на поиск нужных контактов в чатах и устаревших пересылках. Держите под рукой проверенный набор официальных порталов: 112 и SNS 24 для экстренных и медицинских вопросов, Finanças для NIF, AIMA для статуса ВНЖ, Junta для подтверждения адреса. Ниже — кто за что отвечает, с прямыми ссылками и порядком действий в первую неделю.",
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
  topic_tags: ["contacts","portugal","aima"],
  hashtags: buildNoteHashtags({
    topicTags: ["contacts","portugal","aima"],
    contentKind: "guide",
  }),
  source_channel: "editorial+aima+financas+sns+chatlisboa+por_tugal+lepta",
  source_label: "editorial:grok-4.3-rewrite-2026-09-21",
};
