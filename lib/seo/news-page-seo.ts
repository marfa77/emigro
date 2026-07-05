import type { NewsDigest } from "@/lib/news/digests";
import type { NewsTopicConfig } from "@/lib/news/topics";
import { buildFaqSchema, type FaqItem } from "@/lib/seo/corridor-page-seo";

export function buildNewsIndexAiDescription(topic: NewsTopicConfig | null): string {
  if (topic) {
    return `Еженедельные новости релокации в ${topic.countryRu} для ${topic.audienceRu}: изменения законов, консульства, пороги ВНЖ и практика подачи с проверенными источниками. Emigro — не юридическая консультация.`;
  }
  return "Еженедельные новости Emigro по ВНЖ, визам и гражданству в европейских коридорах для русскоязычных заявителей (RU, BY, UA, KZ). Каждый выпуск — проверенные факты и ссылки на официальные источники.";
}

export function buildNewsIndexFaq(topic: NewsTopicConfig | null): FaqItem[] {
  if (topic) {
    return [
      {
        question: `Как часто выходят новости по ${topic.countryRu}?`,
        answer: "Emigro публикует еженедельный обзор по каждому активному коридору. Выпуски собираются из официальных источников: миграционные службы, консульства, BOE, BAMF и аналоги.",
      },
      {
        question: `Для кого новости ${topic.countryRu} на Emigro?`,
        answer: `Материалы ориентированы на ${topic.audienceRu}. Это навигация и контекст, а не юридическая консультация — перед подачей проверяйте актуальные правила у консульства или лицензированного специалиста.`,
      },
      {
        question: `Чем новости отличаются от справочника коридора ${topic.countryRu}?`,
        answer: "Новости фиксируют изменения за неделю. Справочник (digest) — структурированные факты по программам ВНЖ. Wizard проверяет личный профиль по требованиям программ.",
      },
      {
        question: "Можно ли подписаться на RSS?",
        answer: `Да. RSS-лента доступна на странице новостей — общая или по стране через параметр country=${topic.urlSegment}.`,
      },
      {
        question: "Как проверить свой маршрут после чтения новостей?",
        answer: "Запустите hub wizard на Emigro (/ru/wizard) или wizard конкретного коридора — система сравнит доход, семью и документы с требованиями программ.",
      },
    ];
  }
  return [
    {
      question: "Что такое новости Emigro?",
      answer: "Еженедельные обзоры по релокации в Европу для русскоязычных: изменения законов, консульства, пороги ВНЖ и практика подачи. Каждый выпуск содержит source_links на первоисточники.",
    },
    {
      question: "Какие страны покрывают новости?",
      answer: "Португалия, Испания, Франция, Италия, Германия, Нидерланды, Скандинавия, Польша, Чехия, Австрия и другие активные коридоры Emigro. Фильтр по стране — через ?country= в URL.",
    },
    {
      question: "Это юридическая консультация?",
      answer: "Нет. Emigro — навигатор и справочник. Перед подачей документов сверяйтесь с официальными источниками и консульством.",
    },
    {
      question: "Как подписаться на обновления?",
      answer: "Используйте RSS (/ru/news/feed.xml) или Telegram-канал Emigro_news. Для страны — RSS с параметром ?country=.",
    },
    {
      question: "Чем новости дополняют wizard?",
      answer: "Новости дают контекст изменений. Wizard (/ru/wizard) проверяет личный профиль: паспорт, доход, семью и документы против требований программ ВНЖ.",
    },
  ];
}

export function buildNewsArticleAiDescription(
  digest: NewsDigest,
  topic: NewsTopicConfig | null
): string {
  const takeaways = digest.key_takeaways.slice(0, 2).join(" ");
  const base = digest.excerpt || digest.seo_description || digest.title;
  return [base, takeaways, topic ? `Коридор: ${topic.countryRu}.` : "", "Emigro — не юридическая консультация."]
    .filter(Boolean)
    .join(" ");
}

export function buildNewsArticleFaq(digest: NewsDigest, topic: NewsTopicConfig | null): FaqItem[] {
  const country = topic?.countryRu ?? digest.country;
  const items: FaqItem[] = [];

  for (const takeaway of digest.key_takeaways.slice(0, 3)) {
    items.push({
      question: `Что важно знать: ${takeaway.slice(0, 80)}${takeaway.length > 80 ? "…" : ""}`,
      answer: takeaway,
    });
  }

  items.push(
    {
      question: `Для кого этот выпуск новостей по ${country}?`,
      answer: topic
        ? `Обзор для ${topic.audienceRu}. Emigro публикует еженедельные изменения по маршруту ${country} с проверенными source_links.`
        : `Еженедельный обзор Emigro по релокации в ${country} для русскоязычных заявителей.`,
    },
    {
      question: "Это юридическая консультация?",
      answer: "Нет. Новости Emigro — навигация и контекст. Перед подачей документов проверяйте правила у консульства или лицензированного специалиста.",
    },
    {
      question: "Как проверить свой маршрут после прочтения?",
      answer: topic?.corridorSlug
        ? `Запустите wizard коридора ${country} или hub wizard на /ru/wizard — система сравнит ваш профиль с требованиями программ ВНЖ.`
        : "Запустите hub wizard на /ru/wizard для сравнения профиля с программами ВНЖ в нескольких странах.",
    }
  );

  return items;
}

export function buildNewsFaqSchema(faq: FaqItem[]): Record<string, unknown> | null {
  return buildFaqSchema(faq);
}
