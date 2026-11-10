/**
 * Primary screening questionnaire (Pavel, 2026-11-10). One schema drives the public form
 * (/ru/anketa), API validation (/api/v1/screening) and the admin view (/admin/screening).
 * Changing a field id orphans old answers in the admin view — add new ids instead.
 */
export const SCREENING_SCHEMA_VERSION = "2026-11-10";

export type ScreeningField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
};

export type ScreeningSection = { title: string; fields: readonly ScreeningField[] };

export const SCREENING_SECTIONS: readonly ScreeningSection[] = [
  {
    title: "Контакты",
    fields: [
      { id: "name", label: "Имя", type: "text", required: true },
      { id: "contact", label: "Email или Telegram", type: "text", required: true, placeholder: "name@mail.com или @username" },
      { id: "phone", label: "Телефон или WhatsApp", type: "text" },
    ],
  },
  {
    title: "Документы и статус",
    fields: [
      { id: "citizenship", label: "Гражданство (все паспорта)", type: "text", required: true, placeholder: "Например: Россия; Россия и Израиль" },
      { id: "residence_country", label: "Страна, где живёте сейчас", type: "text", required: true },
      {
        id: "residence_status",
        label: "Ваш статус в этой стране",
        type: "select",
        required: true,
        options: [
          "Гражданин",
          "ВНЖ или ПМЖ",
          "Национальная виза (тип D)",
          "Шенгенская виза или безвиз",
          "Временная защита",
          "Убежище или статус беженца",
          "Другое",
        ],
      },
      { id: "status_until", label: "До какой даты действует статус", type: "text", placeholder: "Например: до 03.2027" },
    ],
  },
  {
    title: "Цель",
    fields: [
      { id: "destination", label: "Куда хотите переехать", type: "text", required: true, placeholder: "Страна или несколько стран" },
      {
        id: "goal",
        label: "Главная цель",
        type: "select",
        required: true,
        options: [
          "ВНЖ или легализация",
          "Работа по найму",
          "Удалённая работа (digital nomad)",
          "Бизнес или самозанятость",
          "Учёба",
          "Инвестиции",
          "Воссоединение с семьёй",
          "Гражданство",
          "Другое",
        ],
      },
      {
        id: "timeline",
        label: "Когда планируете переезд",
        type: "select",
        required: true,
        options: ["В ближайшие 3 месяца", "Через 3–6 месяцев", "Через 6–12 месяцев", "Больше чем через год или пока изучаю"],
      },
    ],
  },
  {
    title: "Семья",
    fields: [
      {
        id: "household",
        label: "Кто переезжает",
        type: "select",
        required: true,
        options: ["Только я", "Я и супруг(а) или партнёр", "Я, супруг(а) и дети", "Я и дети", "Другое"],
      },
      { id: "children", label: "Дети: сколько и какого возраста", type: "text" },
      { id: "parents", label: "Планируете перевезти родителей?", type: "select", options: ["Нет", "Да", "Пока не знаю"] },
    ],
  },
  {
    title: "Доход и деньги",
    fields: [
      {
        id: "income_source",
        label: "Основной источник дохода",
        type: "select",
        required: true,
        options: [
          "Работа по найму в стране, где живу",
          "Удалённая работа на иностранного работодателя",
          "Свой бизнес или фриланс",
          "Пассивный доход (аренда, дивиденды)",
          "Пенсия",
          "Стабильного дохода нет",
        ],
      },
      {
        id: "income_monthly",
        label: "Доход в месяц (на семью, после налогов)",
        type: "select",
        required: true,
        options: ["До €1 500", "€1 500–2 500", "€2 500–4 000", "€4 000–6 000", "Больше €6 000"],
      },
      {
        id: "savings",
        label: "Сбережения",
        type: "select",
        required: true,
        options: ["До €10 000", "€10 000–30 000", "€30 000–100 000", "€100 000–300 000", "Больше €300 000"],
      },
      {
        id: "income_proof",
        label: "Можете подтвердить доход и деньги документами?",
        type: "select",
        required: true,
        options: ["Да, всё официально", "Частично", "Нет"],
      },
    ],
  },
  {
    title: "Образование и языки",
    fields: [
      { id: "education", label: "Образование", type: "select", options: ["Высшее", "Среднее специальное", "Среднее", "Учусь сейчас"] },
      { id: "profession", label: "Профессия или чем занимаетесь", type: "text" },
      { id: "languages", label: "Языки и уровень", type: "text", placeholder: "Например: английский B2, португальский A1" },
    ],
  },
  {
    title: "История",
    fields: [
      { id: "refusals", label: "Были отказы в визах или ВНЖ?", type: "select", required: true, options: ["Не было", "Были"] },
      { id: "refusals_details", label: "Если были: где, когда и по какой причине", type: "textarea" },
      { id: "criminal_record", label: "Есть судимость?", type: "select", required: true, options: ["Нет", "Да"] },
    ],
  },
  {
    title: "Задача",
    fields: [
      { id: "done_already", label: "Что уже сделали", type: "textarea", placeholder: "Документы, консультации, поданные заявления" },
      { id: "main_question", label: "Главный вопрос или где застряли", type: "textarea", required: true },
      {
        id: "consultation",
        label: "Какая помощь нужна",
        type: "select",
        required: true,
        options: ["Бесплатный подбор специалиста", "Route Check (оплачен)", "Пока не знаю"],
      },
      {
        id: "budget",
        label: "Бюджет на сопровождение (юрист, агентство)",
        type: "select",
        options: ["До €500", "€500–2 000", "€2 000–5 000", "Больше €5 000", "Пока не знаю"],
      },
    ],
  },
];

export const SCREENING_FIELDS: readonly ScreeningField[] = SCREENING_SECTIONS.flatMap((section) => section.fields);

export const SCREENING_MAX_FIELD_LENGTH = 2000;

export type ScreeningAnswers = Record<string, string>;

/** Keep only known fields, trim, cap length; returns the ids of missing required fields. */
export function cleanScreeningAnswers(raw: unknown): { answers: ScreeningAnswers; missing: string[] } {
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const answers: ScreeningAnswers = {};
  const missing: string[] = [];
  for (const field of SCREENING_FIELDS) {
    const value = typeof input[field.id] === "string" ? (input[field.id] as string).trim().slice(0, SCREENING_MAX_FIELD_LENGTH) : "";
    if (field.type === "select" && value && field.options && !field.options.includes(value)) {
      missing.push(field.id);
      continue;
    }
    if (value) answers[field.id] = value;
    else if (field.required) missing.push(field.id);
  }
  return { answers, missing };
}
