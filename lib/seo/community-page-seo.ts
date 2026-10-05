import { pageUrl } from "@/lib/seo";
import { EMIGRO_PUBLISHER } from "@/lib/seo/schema";
import { NEWS_TELEGRAM_URL } from "@/lib/community";

export function buildCommunityPageSchema(): Record<string, unknown>[] {
  const url = pageUrl("/ru/community");

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Для своих в Порту — закрытый чат Emigro",
    description:
      "Закрытый чат Emigro «Порту и вокруг»: для своих публикуем важное, общаемся, эксперты отвечают. Новости страны в личку — только в боте. Канал @Emigro_news — отдельно.",
    inLanguage: "ru-RU",
    isPartOf: {
      "@type": "WebSite",
      name: "Emigro",
      url: pageUrl("/ru"),
    },
    about: {
      "@type": "Organization",
      name: "Emigro",
      url: pageUrl("/ru"),
    },
    publisher: EMIGRO_PUBLISHER,
    mainEntity: {
      "@type": "Organization",
      name: "Emigro Telegram Community",
      url: NEWS_TELEGRAM_URL,
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Как попасть в чат Порту и вокруг?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Откройте кнопку «Чат» на emigro.online или напишите боту /start — он сразу пришлёт ссылку в личку. Если вы уже в группе, та же кнопка открывает чат.",
        },
      },
      {
        "@type": "Question",
        name: "Как получать новости страны в личку?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Только в боте @emigro_chat_bot: напишите «новости Португалия», «новости Испания», «новости Италия» или «новости Таиланд». Карточка приходит в этот чат, как только выпуск появляется на сайте. На сайте подписаться нельзя.",
        },
      },
      {
        "@type": "Question",
        name: "Чем сообщество Emigro отличается от wizard на сайте?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wizard на emigro.online подбирает маршруты ВНЖ по анкете. Закрытый чат — для своих: важное, общение и ответы экспертов Emigro по быту. Не юридическая консультация.",
        },
      },
      {
        "@type": "Question",
        name: "А комментарии у канала?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Отдельно вступить в группу нельзя — чат привязан к каналу. Подпишитесь на @Emigro_news и пишите в комментариях к постам. Это не чат Порту.",
        },
      },
      {
        "@type": "Question",
        name: "Это юридическая консультация?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Нет. Обсуждения носят справочный характер. Для официальных решений обращайтесь к лицензированным специалистам из справочника Emigro или Emigro Assist.",
        },
      },
    ],
  };

  return [webPage, faqPage];
}
