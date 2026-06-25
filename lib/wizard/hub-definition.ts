import type { WizardModule } from "@/lib/types";

const PASSPORT_OPTIONS = [
  { value: "RU", label_en: "Russia", label_ru: "Россия" },
  { value: "BY", label_en: "Belarus", label_ru: "Беларусь" },
  { value: "UA", label_en: "Ukraine", label_ru: "Украина" },
  { value: "KZ", label_en: "Kazakhstan", label_ru: "Казахстан" },
];

const YES_NO = [
  { value: "yes", label_en: "Yes", label_ru: "Да" },
  { value: "no", label_en: "No", label_ru: "Нет" },
];

const FAMILY_COUNTRY_OPTIONS = [
  { value: "PT", label_en: "Portugal", label_ru: "🇵🇹 Португалия" },
  { value: "ES", label_en: "Spain", label_ru: "🇪🇸 Испания" },
  { value: "FR", label_en: "France", label_ru: "🇫🇷 Франция" },
  { value: "IT", label_en: "Italy", label_ru: "🇮🇹 Италия" },
  { value: "DE", label_en: "Germany", label_ru: "🇩🇪 Германия" },
  { value: "NL", label_en: "Netherlands", label_ru: "🇳🇱 Нидерланды" },
  { value: "SE", label_en: "Nordics", label_ru: "🇸🇪 Скандинавия" },
];

const GOAL_OPTIONS = [
  { value: "residency", label_en: "Residency", label_ru: "ВНЖ / легализация" },
  { value: "citizenship", label_en: "Citizenship path", label_ru: "Путь к гражданству" },
  { value: "fast", label_en: "Speed & predictability", label_ru: "Скорость и предсказуемость" },
];

function q(
  moduleId: string,
  key: string,
  type: string,
  labelRu: string,
  opts?: {
    helpRu?: string;
    options?: typeof PASSPORT_OPTIONS;
    required?: boolean;
    sort?: number;
  }
) {
  return {
    id: `hub-${key}`,
    module_id: moduleId,
    question_key: key,
    question_type: type,
    label_ru: labelRu,
    help_ru: opts?.helpRu ?? null,
    options: opts?.options ?? null,
    required: opts?.required ?? true,
    sort_order: opts?.sort ?? 1,
  };
}

/** Global hub wizard — one flow, evaluates all active corridors. */
export const HUB_WIZARD_MODULES: WizardModule[] = [
  {
    id: "hub-core",
    module_key: "core",
    title_ru: "Профиль",
    sort_order: 1,
    questions: [
      q("hub-core", "passport_iso2", "single", "Ваш паспорт", {
        helpRu: "Паспорт, с которым планируете подавать документы",
        options: PASSPORT_OPTIONS,
        sort: 1,
      }),
      q("hub-core", "relocation_goal", "single", "Главная цель", {
        helpRu: "Поможет ранжировать маршруты — не отсекает страны",
        options: GOAL_OPTIONS,
        sort: 2,
      }),
    ],
  },
  {
    id: "hub-labor",
    module_key: "labor",
    title_ru: "Работа и доход",
    sort_order: 2,
    questions: [
      q("hub-labor", "remote_income", "single", "Есть стабильный удалённый доход из-за рубежа?", {
        helpRu: "Зарплата или фриланс от клиентов вне страны назначения (D8, digital nomad, HSM)",
        options: YES_NO,
        sort: 1,
      }),
      q("hub-labor", "monthly_income_eur", "number", "Месячный чистый доход (EUR)", {
        helpRu: "Средний чистый доход за последние 3–6 месяцев",
        required: false,
        sort: 2,
      }),
      q("hub-labor", "has_job_offer", "single", "Есть подписанный оффер в стране ЕС?", {
        helpRu: "Blue Card, Talent, pay limit — нужен работодатель в стране назначения",
        options: YES_NO,
        sort: 3,
      }),
      q("hub-labor", "annual_salary_eur", "number", "Годовая брутто-зарплата в оффере (EUR)", {
        required: false,
        sort: 4,
      }),
    ],
  },
  {
    id: "hub-capital",
    module_key: "capital",
    title_ru: "Капитал, инвестиции и образование",
    sort_order: 3,
    questions: [
      q("hub-capital", "passive_income_eur", "number", "Месячный пассивный доход (EUR)", {
        helpRu: "Аренда, дивиденды, пенсия — не зарплата (D7, elective, non-lucrative)",
        required: false,
        sort: 1,
      }),
      q("hub-capital", "savings_eur", "number", "Ликвидные сбережения (EUR)", {
        helpRu: "Доступные средства на счетах (Chancenkarte, NLV, visiteur)",
        required: false,
        sort: 2,
      }),
      q("hub-capital", "willing_to_invest_eur", "number", "Капитал для инвестиционного маршрута (EUR)", {
        helpRu: "Golden Visa / инвесторская виза (PT от €500k, ES от €1M, IT от €250k). Не путать с D7. GV через недвижимость в PT/ES закрыт.",
        required: false,
        sort: 3,
      }),
      q("hub-capital", "has_university_degree", "single", "Признаваемый диплом вуза?", {
        options: YES_NO,
        sort: 4,
      }),
    ],
  },
  {
    id: "hub-bond",
    module_key: "bond",
    title_ru: "Семья и состав",
    sort_order: 4,
    questions: [
      q("hub-bond", "relocating_with_spouse", "single", "Супруг(а) едет вместе с вами?", {
        helpRu: "Супруг обычно оформляется как иждивенец в той же заявке или воссоединение после вашего ВНЖ",
        options: YES_NO,
        required: false,
        sort: 1,
      }),
      q("hub-bond", "relocating_children_count", "number", "Сколько детей едет с вами?", {
        helpRu: "Несовершеннолетние — в заявке основного заявителя; нужны доп. средства и жильё",
        required: false,
        sort: 2,
      }),
      q("hub-bond", "relocating_parents_count", "number", "Родители или бабушки/дедушки в поездке?", {
        helpRu: "0 если никто. Взрослые родственники — самый сложный кейс; часто отдельное воссоединение или отказ",
        required: false,
        sort: 3,
      }),
      q("hub-bond", "family_countries", "multi", "Семья уже легально в стране ЕС (можно несколько)", {
        helpRu: "Резидент или гражданин, через кого возможно воссоединение — если вы к ним, а не они к вам",
        options: FAMILY_COUNTRY_OPTIONS,
        required: false,
        sort: 4,
      }),
    ],
  },
];

export const HUB_WIZARD_ID = "hub-global-v1";
