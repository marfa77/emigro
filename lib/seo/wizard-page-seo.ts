import { pageUrl } from "@/lib/seo";
import { EMIGRO_PUBLISHER } from "@/lib/seo/schema";
import { WIZARD_CORRIDOR_DESCRIPTIONS } from "@/lib/seo/wizard-corridor-copy";

export type WizardFaqItem = { question: string; answer: string };

export function buildWizardPageFaq(topic: {
  countryRu: string;
  urlSegment: string;
}): WizardFaqItem[] {
  const corridorPrograms =
    WIZARD_CORRIDOR_DESCRIPTIONS[topic.urlSegment]?.replace(/^Wizard Emigro по [^:]+: /, "") ??
    `программы ВНЖ коридора ${topic.countryRu} с порогами дохода и сроками для паспортов RU/BY/UA/KZ`;

  return [
    {
      question: `Какие маршруты ВНЖ проверяет wizard по ${topic.countryRu}?`,
      answer: `Wizard сопоставляет ваш профиль с программами: ${corridorPrograms}. Это справочная оценка — не юридическая консультация и не гарантия одобрения.`,
    },
    {
      question: `Чем wizard коридора ${topic.countryRu} отличается от hub wizard на /ru/wizard?`,
      answer: `Коридорный wizard глубже проверяет программы одной страны (${topic.countryRu}). Hub wizard сравнивает несколько EU-коридоров Emigro и подсказывает, куда проще попасть по паспорту, доходу и семье.`,
    },
    {
      question: "Гарантирует ли Emigro одобрение визы или ВНЖ?",
      answer: "Нет. Wizard показывает соответствие требованиям программ на основе ваших ответов. Финальное решение принимает консульство или миграционная служба.",
    },
  ];
}

export function buildWizardPageSchema(input: {
  path: string;
  title: string;
  description: string;
  countryRu: string;
  urlSegment: string;
}): Record<string, unknown>[] {
  const url = pageUrl(input.path);
  const faqItems = buildWizardPageFaq({ countryRu: input.countryRu, urlSegment: input.urlSegment });

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: input.title,
    description: input.description,
    inLanguage: "ru-RU",
    isPartOf: {
      "@type": "WebSite",
      name: "Emigro",
      url: pageUrl("/ru"),
    },
    about: {
      "@type": "Place",
      name: input.countryRu,
    },
    publisher: EMIGRO_PUBLISHER,
    potentialAction: {
      "@type": "InteractAction",
      name: `Подбор маршрута ВНЖ — ${input.countryRu}`,
      target: url,
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return [webPage, faqPage];
}
