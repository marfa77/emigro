import { pageUrl } from "@/lib/seo";
import { EMIGRO_PUBLISHER } from "@/lib/seo/schema";
import { allPublicTelegramCommunityLinks } from "@/lib/telegram/public-communities";

export function buildCommunityPageSchema(): Record<string, unknown>[] {
  const url = pageUrl("/ru/community");
  const links = allPublicTelegramCommunityLinks();

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: "Сообщества Emigro в Telegram",
    description:
      "Каналы и чаты Emigro: «Порту и вокруг» @emigro_portugal, @valencia_echat, @emigro_Italy, @milan_echat, @comomercatino — новости региона и общение релокантов.",
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
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Какие Telegram-сообщества есть у Emigro?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Пять публичных точек: ${links.map((l) => l.title).join("; ")}. Ссылки на emigro.online/ru/community.`,
        },
      },
      {
        "@type": "Question",
        name: "Чем канал @Emigro_news отличается от региональных?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "@Emigro_news — общая лента Emigro. @emigro_portugal — публичный чат «Порту и вокруг». @emigro_Italy и городские чаты — локальные новости и быт.",
        },
      },
      {
        "@type": "Question",
        name: "Как получать новости страны в личку?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "В боте @emigro_chat_bot напишите «новости Португалия», «новости Испания» или «новости Италия». Это отдельно от публичных каналов и чатов.",
        },
      },
      {
        "@type": "Question",
        name: "Это юридическая консультация?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Нет. Обсуждения носят справочный характер. Для официальных решений используйте справочник провайдеров Emigro или Emigro Assist.",
        },
      },
      {
        "@type": "Question",
        name: "Есть ли барахолка для релокантов?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Для озера Комо — публичный чат @comomercatino (Como. Mercatino delle pulci). Это community buy/sell, не официальный сервис.",
        },
      },
    ],
  };

  return [webPage, faqPage];
}
