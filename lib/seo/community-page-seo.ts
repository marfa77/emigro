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
    name: "Чат Порту и вокруг — Telegram Emigro",
    description:
      "Городской чат Emigro «Порту и вокруг»: быт, жильё, встречи. Бот присылает ссылку в личку. Канал @Emigro_news — отдельно.",
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
        name: "Чем сообщество Emigro отличается от wizard на сайте?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Wizard на emigro.online подбирает маршруты ВНЖ по вашим ответам. Telegram-сообщество — живые обсуждения, опыт переезда и оперативные новости от участников и команды Emigro.",
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
