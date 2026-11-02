/** Guides where the hub wizard starts in the article, not as a leave-the-page link. */
export type GuideWizardEmbed = {
  title: string;
  body: string;
  /** Hub wizard `?interest=` key. Ranking hint only. */
  interest?: string;
};

const EMBEDS: Record<string, GuideWizardEmbed> = {
  "vnj-serbiya-dlya-rossiyan-2026": {
    title: "Сербия не открывает Шенген",
    body: "Если цель — программа в ЕС, выберите паспорт. Подбор продолжится со следующего шага: доход, семья, сроки. Это не юридическое заключение.",
  },
  "chernogoriya-vnj-dlya-rossiyan-2026": {
    title: "Куда подаваться после 1 ноября",
    body: "С 1 ноября 2026 у паспортов РФ и Беларуси безвиз закрыт. Выберите паспорт — дальше шаг про доход и маршрут. Украина и Казахстан сверяйте отдельно: правила въезда другие.",
  },
  "vnj-portugaliya-d8-d7-grazhdanstvo-2026": {
    title: "D8 или D7 — проверьте свой порог",
    body: "Удалёнка около €3 680 в месяц или пассив около €920. Выберите паспорт: подбор продолжится с учётом Португалии. Порог на дату подачи сверяйте в консульстве.",
    interest: "portugal",
  },
};

export function getGuideWizardEmbed(slug: string): GuideWizardEmbed | undefined {
  return EMBEDS[slug];
}

export const ITALY_ROUTE_CHECK_GUIDE_SLUGS = new Set([
  "vnj-italiya-2026-digital-nomad",
  "vnj-italiya-2026-elective-residency",
]);
