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
  "nebezopasnye-goroda-evropy-2026": {
    title: "Район не заменяет маршрут",
    body: "Индекс преступности не говорит, какой ВНЖ вам открыт. Выберите паспорт — дальше доход, семья и страна. Это не оценка безопасности квартала.",
  },
  // GSC top-impression guides (Oct–Nov 2026): start the wizard where readers already are.
  "digital-nomad-vizy-evropy-sravnenie-2026": {
    title: "D8 Португалии или DN Испании",
    body: "Порог около €3 680 в Португалии против около €2 849 в Испании. Выберите паспорт: подбор сравнит обе визы с вашим доходом и семьёй. Порог на дату подачи сверяйте в консульстве.",
    interest: "portugal,spain",
  },
  "nalogi-pri-pereezde-v-evropu-2026": {
    title: "Сначала маршрут, потом налоги",
    body: "Налоговое резидентство зависит от страны и визы, которую вы получите. Выберите паспорт — подбор покажет маршруты, а налоговые вопросы потом разберите с консультантом. Это не налоговая консультация.",
  },
  "kuda-pereehat-iz-rossii-2026-evropa-vnj": {
    title: "Одной волшебной страны нет",
    body: "Удалёнка, найм, пассивный доход, учёба или семья — у каждого профиля свой маршрут. Выберите паспорт: за 2 минуты подбор оставит те, что подходят вам.",
  },
  "bank-i-iban-dlya-rossiyan-v-evrope-2026": {
    title: "Счёт откроется проще с ВНЖ",
    body: "Часть ограничений для россиян снимается с видом на жительство в ЕС. Выберите паспорт — подбор покажет, какой ВНЖ вам реально открыт.",
  },
  "podtverdit-dohod-dengi-dlya-vnj-esli-dohod-iz-rossii-2026": {
    title: "Какой порог дохода нужен вам",
    body: "Требования к сумме и выпискам зависят от визы. Выберите паспорт: подбор сравнит ваш доход с порогами программ. Документы сверяйте с чек-листом консульства.",
  },
  "vnj-skandinaviya-2026": {
    title: "Швеция, Норвегия, Финляндия или Дания",
    body: "Пороги разные. Выберите паспорт: подбор поставит скандинавские коридоры выше остальных. Оффер и зарплату сверяйте на сайте миграционной службы.",
    interest: "sweden,norway,finland,denmark",
  },
};

const ES_EMBEDS: Record<string, GuideWizardEmbed> = {
  "visa-nomada-digital-espana-latam-2026": {
    title: "¿Su ingreso llega al umbral?",
    body: "Nómada digital pide ~€2.849/mes del titular en 2026 (200% SMI). Elija su pasaporte: el evaluador compara su caso con nómada, no lucrativa y Portugal. Verifique el umbral con el consulado o la UGE.",
    interest: "spain,portugal",
  },
  "visado-no-lucrativa-espana-latam-2026": {
    title: "No lucrativa o nómada: elija con su ingreso",
    body: "No lucrativa pide ~€2.400/mes del titular (400% IPREM) y se tramita en el consulado. Elija su pasaporte: el evaluador le muestra qué vía le encaja.",
    interest: "spain",
  },
  "nacionalidad-espanola-latam-2026": {
    title: "Primero la residencia legal",
    body: "Los 2 años para la nacionalidad cuentan desde una residencia legal y continuada. Elija su pasaporte: el evaluador le muestra la vía de residencia para empezar.",
    interest: "spain",
  },
  "residencia-espana-desde-uruguay-2026": {
    title: "Uruguay no es la única ruta",
    body: "Nómada, no lucrativa y nacionalidad dependen del pasaporte y del ingreso. Elija el suyo: el evaluador sigue con España y Portugal.",
    interest: "spain,portugal",
  },
  "ley-memoria-democratica-latam-2026": {
    title: "Sin CSV, la vía viva es la residencia",
    body: "Las citas nuevas de la Ley de Memoria cerraron en octubre de 2025. Elija pasaporte para ver nómada digital o no lucrativa, y después la nacionalidad.",
    interest: "spain",
  },
};

export function getEsGuideWizardEmbed(slug: string): GuideWizardEmbed | undefined {
  return ES_EMBEDS[slug];
}

export function getGuideWizardEmbed(slug: string): GuideWizardEmbed | undefined {
  return EMBEDS[slug];
}

export const ITALY_ROUTE_CHECK_GUIDE_SLUGS = new Set([
  "vnj-italiya-2026-digital-nomad",
  "vnj-italiya-2026-elective-residency",
]);
