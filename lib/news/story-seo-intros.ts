/** Git-shipped story intros (first screen + query H2) until Supabase bodies are patched. */

export type NewsStoryIntro = {
  heading: string;
  paragraphs: string[];
};

export const NEWS_STORY_INTROS: Partial<Record<string, NewsStoryIntro>> = {
  "portugal-story-2026-09-07-k1b2yo": {
    heading: "Как зарегистрировать компанию в Португалии",
    paragraphs: [
      "Для LDA, sociedade por quotas или SA типовой путь — NIF учредителей, pacto social, счёт под капитал, регистрация в коммерческом реестре. На одном приёме это делает balcão Empresa na Hora: constitution, pacto и registo comercial; по официальной странице serviço — pedido normal 360 euros (registo.justica.gov.pt / empresanahora.pt).",
      "Empresa na Hora не заменяет ВНЖ: отдельный предпринимательский маршрут открывается только если бизнес проходит критерии AIMA/MNE — не любая регистрация на бумаге.",
    ],
  },
  "germany-story-2026-10-05-vn3nqp": {
    heading: "Счётчики отопления: что меняется с 1 января 2027",
    paragraphs: [
      "HeizkostenV § 5 Abs. 3: не дистанционно считываемые приборы учёта, установленные до 1 декабря 2021 (и часть поздних исключений), должны к 31 декабря 2026 соответствовать требованиям дистанционного считывания — через дооснащение или замену. С 1 января 2027 остаются исключения при технической невозможности или неоправданных затратах.",
      "По § 4 Abs. 4 наниматель вправе требовать от Gebäudeeigentümer соблюдения обязанности по учёту потребления. Это не автоматическая «скидка» в законе — спор решают по фактам дома и Abrechnung.",
    ],
  },
};

export function getNewsStoryIntro(slug: string): NewsStoryIntro | undefined {
  return NEWS_STORY_INTROS[slug];
}