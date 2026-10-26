/** Hand-curated Portugal guide — official-source correction and editorial rewrite (2026-10-26). */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const VNJ_RENEWAL_SLUG = "prodlenie-vnzh-portugaliya-aima-2026";

const bodySections: NoteBodySection[] = [
  {
    heading: "Проверьте, открыт ли ваш маршрут",
    section_kind: "action_guide",
    card_layout: "tiles",
    paragraphs: ["AIMA открывает Portal das Renovações по категориям и срокам действия карты. Перед подачей сверьте тип карты и дату окончания с последним объявлением ведомства."],
    cards: [
      { eyebrow: "Обычный ВНЖ", title: "Проверьте Portal das Renovações", body: "Убедитесь, что портал принимает ваш тип карты и дату окончания. Окна доступности меняются." },
      { eyebrow: "ARI", title: "Откройте отдельную инструкцию", body: "Продление карты ARI и первичная заявка на ARI — разные процедуры. Для продления AIMA указывает Portal das Renovações." },
      { eyebrow: "Особая категория", title: "Сверьте FAQ AIMA", body: "Для некоторых категорий действует отдельная процедура. Не отправляйте дублирующую заявку, пока не проверили свой маршрут." },
    ],
  },
  {
    heading: "Подайте документы и оплатите DUC",
    section_kind: "action_guide",
    card_layout: "tiles",
    paragraphs: ["Войдите в портал с адресом электронной почты, связанным с вашим делом, и выполняйте персональные инструкции. Не используйте чужой список документов или срок платежа."],
    cards: [
      { eyebrow: "Доступ", title: "Проверьте email и данные", body: "Убедитесь, что AIMA может связаться с вами. Изменившиеся сведения исправляйте официальным способом." },
      { eyebrow: "Документы", title: "Следуйте списку для своего дела", body: "Требования зависят от основания ВНЖ и этапа процесса. Проверьте формат, читаемость и срок действия файлов." },
      { eyebrow: "Платёж", title: "Оплатите по своему DUC", body: "Сумма и срок оплаты указаны в платёжном документе именно для вашего процесса. Сохраните квитанцию." },
    ],
  },
  {
    heading: "Проверьте NISS и адрес",
    section_kind: "official",
    card_layout: "tiles",
    paragraphs: ["AIMA просит проверять NISS и актуальный адрес: корректность данных влияет на обработку дела и доставку карты."],
    cards: [
      { eyebrow: "Идентификация", title: "Паспорт и карта ВНЖ", body: "Подготовьте данные паспорта и текущей или истёкшей карты. Загружайте копии, только если портал их запрашивает." },
      { eyebrow: "Segurança Social", title: "Сверьте NISS в AIMA", body: "Если ваш NISS не отображается в системе, используйте Contact Form для добавления или исправления номера." },
      { eyebrow: "Доставка", title: "Убедитесь, что адрес актуален", body: "Изменение адреса оформляйте через предусмотренный официальный канал." },
    ],
  },
  {
    heading: "Если карта уже истекла",
    section_kind: "official",
    card_layout: "tiles",
    paragraphs: ["AIMA разъясняет, что право проживания в Португалии сохраняется до шести месяцев после окончания карты, истёкшей после 30 июня 2025 года. Переходное правило для карт, истёкших до этой даты, завершилось 15 апреля 2026 года. Это не разрешение на поездки по Шенгену."],
    cards: [
      { eyebrow: "Заявление подано", title: "Носите карту и recibo", body: "AIMA просит иметь при себе истёкшую карту и подтверждение поданного заявления." },
      { eyebrow: "Не получается подать", title: "Зафиксируйте обращение", body: "Используйте соответствующий канал AIMA и сохраните номер запроса и снимки ошибки." },
      { eyebrow: "Планируете поездку", title: "Проверьте правила въезда отдельно", body: "AIMA указывает, что recibo о подаче не является проездным документом для других стран Шенгена." },
    ],
  },
  {
    heading: "Если портал не принимает заявку",
    section_kind: "action_guide",
    card_layout: "tiles",
    paragraphs: ["Опишите в Contact Form AIMA, что именно остановилось: категория, валидация данных, загрузка или платёж. Выберите тему Portal das Renovações и ближайший подтип."],
    cards: [
      { eyebrow: "Ошибка в данных", title: "Выберите нужный тип исправления", body: "Для NISS, email, паспорта или адреса используйте соответствующую категорию формы." },
      { eyebrow: "Категория недоступна", title: "Сверьте объявление AIMA", body: "Проверьте дату карты и список категорий. В обращении укажите тип карты и текст ошибки." },
      { eyebrow: "Сложное дело", title: "Получите персональную консультацию", body: "При смене основания, отказе или споре о статусе обратитесь к юристу или solicitador в Португалии." },
    ],
  },
];

const keyTakeaways = [
  "Доступность Portal das Renovações зависит от категории и срока карты; сверяйтесь с последним объявлением AIMA.",
  "Документы, сумма и срок оплаты указаны для вашего дела и в вашем DUC.",
  "AIMA назначает личный визит, если требуется биометрия или другое очное действие.",
  "Правило проживания в Португалии после окончания карты не означает автоматического права поездок по Шенгену.",
  "При ошибке в данных или кабинете используйте Contact Form AIMA по соответствующей теме.",
];

const faq: CommunityNoteFaq[] = [
  { q: "Когда подавать на продление?", a: "Когда ваша категория и дата окончания доступны в Portal das Renovações. Перед подачей проверьте последнее объявление AIMA." },
  { q: "Нужно ли идти в AIMA лично?", a: "Не всегда. Продление проходит онлайн; AIMA назначает визит, если требуется биометрия или другое очное действие." },
  { q: "Какие документы нужны для D7 или D8?", a: "Универсального списка нет. Следуйте checklist в Portal das Renovações для вашего дела." },
  { q: "Сколько стоит продление?", a: "Сумма зависит от процедуры. Оплатите DUC, сформированный AIMA, и сверяйте его с текущей таблицей сборов." },
  { q: "Можно ли ехать в другую страну Шенгена с recibo?", a: "AIMA указывает, что recibo о подаче не заменяет проездной документ для поездок в другие страны Шенгена." },
  { q: "Что делать, если портал не принимает мою карту?", a: "Сверьте последнее объявление AIMA и обратитесь через Contact Form по теме Portal das Renovações." },
];

const topicTags = ["aima", "vng", "documents", "renewal"];

export const VNJ_RENEWAL_GUIDE = {
  slug: VNJ_RENEWAL_SLUG,
  category: "AIMA и записи",
  content_kind: "guide" as ContentKind,
  title: "Продление ВНЖ в Португалии: портал AIMA, документы и сроки",
  excerpt: "Как проверить доступность Portal das Renovações, подать документы и оплатить DUC. Что говорит AIMA об истёкшей карте и поездках.",
  seo_title: "Продление ВНЖ в Португалии — Portal das Renovações AIMA",
  seo_description: "Маршрут продления ВНЖ в Португалии: Portal das Renovações, документы, DUC, истёкшая карта и обращение в AIMA.",
  quick_answer: "Сначала проверьте, что Portal das Renovações принимает ваш тип карты и дату её окончания. Следуйте персональному списку документов и сроку оплаты в DUC. AIMA назначает очный визит, если требуется биометрия. Правила пребывания после окончания карты не следует считать разрешением на поездки по Шенгену.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "AIMA — доступность Portal das Renovações", url: "https://aima.gov.pt/pt/noticias/portal-de-renovacoes-certificados-e-cartoes-de-residencia-permanentes-de-nacionais-ue-e-familiares" },
    { title: "AIMA — право проживания после окончания карты", url: "https://aima.gov.pt/pt/noticias/direito-de-residencia" },
    { title: "AIMA — таблица сборов", url: "https://aima.gov.pt/media/pages/documents/dc677d0005-1772305205/tabela-de-taxas-e-demais-encargos-a-cobrar-pelos-procedimentos-administrativos.pdf" },
    { title: "AIMA — FAQ по процедурам", url: "https://aima.gov.pt/pt/decreto-regulamentar-da-lei-de-estrangeiros-alteracoes/perguntas-frequentes" },
    { title: "AIMA — Contact Form", url: "https://contactenos.aima.gov.pt/contact-form" },
    { title: "AIMA — добавить или исправить NISS", url: "https://aima.gov.pt/pt/noticias/saiba-como-registar-o-seu-niss" },
    { title: "AIMA — FAQ о документах и поездках", url: "https://aima.gov.pt/media/pages/documents/15677172d6-1738878548/titulos-de-residencia.pdf" },
  ],
  topic_tags: topicTags,
  hashtags: buildNoteHashtags({ topicTags, contentKind: "guide" }),
  source_channel: "editorial:official-source-review-2026-10-26",
  source_label: "editorial:aima-renewal-correction-2026-10-26",
};
