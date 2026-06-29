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
  { value: "PL", label_en: "Poland", label_ru: "🇵🇱 Польша" },
  { value: "CZ", label_en: "Czechia", label_ru: "🇨🇿 Чехия" },
  { value: "AT", label_en: "Austria", label_ru: "🇦🇹 Австрия" },
];

const GOAL_OPTIONS = [
  { value: "residency", label_en: "Residency", label_ru: "ВНЖ / легализация" },
  { value: "citizenship", label_en: "Citizenship path", label_ru: "Путь к гражданству" },
  { value: "fast", label_en: "Speed & predictability", label_ru: "Скорость и предсказуемость" },
  { value: "study", label_en: "Study / university", label_ru: "Учёба / вуз" },
];

const CURRENT_RESIDENCE_OPTIONS = [
  { value: "abroad_eu", label_en: "Already in EU", label_ru: "Уже живу в стране ЕС" },
  { value: "abroad_other", label_en: "Abroad outside EU", label_ru: "За границей, но не в ЕС" },
  { value: "cis_planning", label_en: "In CIS / planning", label_ru: "В СНГ или планирую переезд" },
];

const STUDY_LEVEL_OPTIONS = [
  { value: "bachelor", label_en: "Bachelor / undergraduate", label_ru: "Бакалавриат" },
  { value: "master", label_en: "Master / graduate", label_ru: "Магистратура" },
  { value: "language", label_en: "Language school", label_ru: "Языковая / подготовительная школа" },
  { value: "other", label_en: "Other / undecided", label_ru: "Другое / пока не решил(а)" },
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
        helpRu: "Паспорт, с которым вы будете подавать заявление. Если паспортов несколько, выберите основной.",
        options: PASSPORT_OPTIONS,
        sort: 1,
      }),
      q("hub-core", "current_residence", "single", "Где вы сейчас живёте?", {
        helpRu:
          "Это помогает понять контекст: смена статуса внутри ЕС, переезд из другой страны или первичная подача из-за рубежа. На подбор программ сейчас не влияет.",
        options: CURRENT_RESIDENCE_OPTIONS,
        required: false,
        sort: 2,
      }),
      q("hub-core", "relocation_goal", "single", "Главная цель", {
        helpRu: "Это только помогает поставить маршруты в удобный порядок. Страны из-за этого ответа не отсекаются.",
        options: GOAL_OPTIONS,
        sort: 3,
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
        helpRu:
          "Например зарплата, ИП или фриланс от клиентов не в той стране, куда вы переезжаете или где подаётесь. Это важно для виз цифрового кочевника, например D8 в Португалии.",
        options: YES_NO,
        sort: 1,
      }),
      q("hub-labor", "monthly_income_eur", "number", "Месячный чистый доход (EUR)", {
        helpRu:
          "Сумма после налогов в среднем за последние 3–6 месяцев. Пример: если получаете около €3 500 в месяц, введите 3500.",
        required: false,
        sort: 2,
      }),
      q("hub-labor", "has_job_offer", "single", "Есть подписанный оффер в стране ЕС?", {
        helpRu:
          "Оффер — это письменное предложение работы от работодателя в стране переезда. Нужно для рабочих виз и Blue Card: это карта ВНЖ для квалифицированной работы.",
        options: YES_NO,
        sort: 3,
      }),
      q("hub-labor", "annual_salary_eur", "number", "Годовая брутто-зарплата в оффере (EUR)", {
        helpRu:
          "Брутто — сумма до налогов за год из оффера. Пример: €4 800 в месяц до налогов = примерно 57600.",
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
        helpRu:
          "Пассивный доход — деньги, которые приходят без работы по найму: пенсия, аренда квартиры, дивиденды. Зарплату сюда не включайте. Пример: пенсия €900 + аренда €500 = 1400.",
        required: false,
        sort: 1,
      }),
      q("hub-capital", "savings_eur", "number", "Ликвидные сбережения (EUR)", {
        helpRu:
          "Деньги, которые можно показать выпиской из банка и реально использовать. Не считайте квартиру, машину или деньги, которые нельзя быстро снять. Пример: 25000.",
        required: false,
        sort: 2,
      }),
      q("hub-capital", "willing_to_invest_eur", "number", "Капитал для инвестиционного маршрута (EUR)", {
        helpRu:
          "Сколько вы готовы вложить именно в инвестиционный ВНЖ. Это не обычные сбережения и не D7. Если не планируете инвестировать, введите 0 или оставьте пустым.",
        required: false,
        sort: 3,
      }),
      q("hub-capital", "has_university_degree", "single", "Признаваемый диплом вуза?", {
        helpRu:
          "Диплом бакалавра/магистра/специалиста, который можно подтвердить документами. Если не уверены, выберите «Нет» — это не заблокирует другие маршруты.",
        options: YES_NO,
        sort: 4,
      }),
    ],
  },
  {
    id: "hub-study",
    module_key: "study",
    title_ru: "Учёба",
    sort_order: 4,
    questions: [
      q("hub-study", "wants_study_route", "single", "Планируете релокацию через учёбу (вуз / языковая школа)?", {
        helpRu:
          "Это отдельный путь: вы поступаете в учебное заведение и показываете деньги на обучение и жизнь. Он не заменяет удалённую работу или пассивный доход.",
        options: YES_NO,
        sort: 1,
      }),
      q("hub-study", "has_university_admission", "single", "Есть подтверждение зачисления (admission / matrícula)?", {
        helpRu:
          "Нужно письмо от университета, языковой школы или национальной системы поступления. Если вы только выбираете программу, ответьте «Нет».",
        options: YES_NO,
        required: false,
        sort: 2,
      }),
      q("hub-study", "study_budget_eur", "number", "Доступные средства на учёбу (EUR)", {
        helpRu:
          "Деньги на обучение и проживание: свои сбережения, блокированный счёт или официальный спонсор. Пример: 12000.",
        required: false,
        sort: 3,
      }),
      q("hub-study", "can_show_study_funds", "single", "Можете подтвердить источник средств (банк / спонсор)?", {
        helpRu:
          "Подтверждение — это выписка из банка, письмо спонсора, справки о доходе или другой документальный след денег.",
        options: YES_NO,
        required: false,
        sort: 4,
      }),
      q("hub-study", "study_level", "single", "Уровень обучения (необязательно)", {
        options: STUDY_LEVEL_OPTIONS,
        required: false,
        sort: 5,
      }),
    ],
  },
  {
    id: "hub-bond",
    module_key: "bond",
    title_ru: "Семья и состав",
    sort_order: 5,
    questions: [
      q("hub-bond", "relocating_with_spouse", "single", "Супруг(а) едет вместе с вами?", {
        helpRu:
          "Это влияет на сумму дохода/сбережений и пакет документов. Обычно супруг(а) идёт как член семьи или через воссоединение.",
        options: YES_NO,
        required: false,
        sort: 1,
      }),
      q("hub-bond", "relocating_children_count", "number", "Сколько детей едет с вами?", {
        helpRu:
          "Введите 0, если детей нет. Для детей обычно нужны дополнительные деньги, страховка, жильё и документы о родстве.",
        required: false,
        sort: 2,
      }),
      q("hub-bond", "relocating_parents_count", "number", "Родители или бабушки/дедушки в поездке?", {
        helpRu:
          "Введите 0, если никто. Взрослые родственники — сложный кейс: часто нужна отдельная проверка зависимости и права на воссоединение.",
        required: false,
        sort: 3,
      }),
      q("hub-bond", "family_countries", "multi", "Семья уже легально в стране ЕС (можно несколько)", {
        helpRu:
          "Отметьте страну, если там уже есть близкий родственник с гражданством или ВНЖ, к которому вы хотите переехать. Это про вашу подачу к ним, а не про их переезд к вам.",
        options: FAMILY_COUNTRY_OPTIONS,
        required: false,
        sort: 4,
      }),
    ],
  },
];

export const HUB_WIZARD_ID = "hub-global-v1";
