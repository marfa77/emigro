export type RouteComparisonRow = {
  variant: string;
  threshold: string;
  tax: string;
  work: string;
  verdict: string;
  recommended?: boolean;
};

export type RouteRisk = {
  title: string;
  severity: "Высокий" | "Средний" | "Низкий";
  description: string;
};

export type ProviderType = {
  title: string;
  scope: string;
  criteria: string;
  cost: string;
};

export type NextStep = {
  title: string;
  detail: string;
};

export type DocumentCheckItem = {
  document: string;
  status: "done" | "todo";
  statusLabel: string;
};

export type SamplePlanSection = {
  number: string;
  id: string;
  title: string;
  content?: string[];
  items?: { label: string; value: string }[];
  comparisonTable?: RouteComparisonRow[];
  risks?: RouteRisk[];
  providers?: ProviderType[];
  nextSteps?: NextStep[];
  documentChecklist?: DocumentCheckItem[];
  footnote?: string;
};

export const ROUTE_CHECK_PDF_PATH = "/assist/emigro_route_check_example.pdf";

export const SAMPLE_PLAN_META = {
  documentType: "Route Check",
  clientName: "Максим К.",
  subtitle: "Переезд из Санкт-Петербурга в Валенсию · Digital Nomad Visa (Испания)",
  preparedAt: "3 июля 2026",
  planId: "EA-2026-047",
} as const;

export const SAMPLE_PLAN_SECTIONS: SamplePlanSection[] = [
  {
    number: "01",
    id: "profile",
    title: "Профиль клиента",
    items: [
      { label: "Имя", value: "Максим К." },
      { label: "Гражданство", value: "РФ" },
      { label: "Текущее место", value: "Белград (Сербия), ВНЖ Сербии / ИП-паушал" },
      { label: "Семья", value: "Супруга + дочь 8 лет" },
      { label: "Доход", value: "€5 800/мес (IT-фриланс)" },
      { label: "Клиенты", value: "Нидерланды, Германия" },
      { label: "Накопления", value: "≈ €42 000" },
    ],
    content: [
      "Максим работает старшим разработчиком (React/Node.js) по контрактам с двумя европейскими клиентами. Доход стабильный, подтверждён инвойсами за 18 месяцев. Супруга не работает, занимается дочерью.",
      "Семья хочет переехать в Испанию (Валенсия или Барселона) в течение 4–6 месяцев. Приоритет — школа для дочери и возможность продолжать работу на существующих клиентов.",
    ],
  },
  {
    number: "02",
    id: "summary",
    title: "Резюме рекомендации",
    content: [
      "Рекомендуемый маршрут: España Digital Nomad Visa (DNV) → ВНЖ Испании → ПМЖ через 5 лет.",
      "Профиль Максима идеально соответствует Digital Nomad Visa: активный доход выше 400% IPREM (порог ≈ €2 400/мес), иностранные клиенты, фриланс-контракты с историей.",
      "Альтернатива Non-Lucrative Visa отпадает: она запрещает любую трудовую деятельность.",
      "Beckham Law (24% flat tax) доступен с DNV и даёт значительную экономию при доходе €5 800/мес по сравнению со стандартной шкалой IRPF (до 47%).",
    ],
    comparisonTable: [
      {
        variant: "DNV Испания",
        threshold: "€2 400/мес",
        tax: "24% Beckham",
        work: "Да, иностр.",
        verdict: "✓ Оптимально",
        recommended: true,
      },
      {
        variant: "Non-Lucrative ES",
        threshold: "€2 400/мес",
        tax: "до 47%",
        work: "Запрещена",
        verdict: "Не подходит",
      },
      {
        variant: "D8 Португалия",
        threshold: "€3 680/мес",
        tax: "20% NHR",
        work: "Да, иностр.",
        verdict: "Запасной",
      },
      {
        variant: "Blue Card DE",
        threshold: "€45 934/год",
        tax: "до 45%",
        work: "Нужен оффер",
        verdict: "Не подходит",
      },
    ],
  },
  {
    number: "03",
    id: "timeline",
    title: "Таймлайн — 5,5 месяцев",
    items: [
      { label: "1", value: "Апостиль диплома и справки о несудимости (РФ → Сербия) — июль, нед. 1–2 · Максим / дов. лицо в РФ" },
      { label: "2", value: "Перевод документов на испанский (нотариальный) — июль, нед. 2–4 · Переводчик в Белграде" },
      { label: "3", value: "Оформление Autónomo в Испании через gestora — июль–август · Gestora" },
      { label: "4", value: "Подача на DNV в Консульство Испании в Белграде — август, нед. 1 · Максим + gestora" },
      { label: "5", value: "Ожидание решения консульства — 20–30 раб. дней · Консульство Испании" },
      { label: "6", value: "Въезд в Испанию по визе DNV — сентябрь · Семья" },
      { label: "7", value: "Регистрация empadronamiento + NIE — сентябрь, нед. 1 · Максим" },
      { label: "8", value: "Подача на TIE (карта ВНЖ) в Extranjería — сентябрь, нед. 2 · Максим + gestora" },
      { label: "9", value: "Заявка на Beckham Law в AEAT — октябрь (до 6 мес с въезда) · Gestora" },
      { label: "10", value: "Запись дочери в школу — август–сентябрь · Супруга" },
      { label: "11", value: "Получение TIE (карта ВНЖ) — ноябрь–декабрь · Extranjería" },
    ],
    footnote: "Сроки ориентировочные. Задержки возможны в августе (отпускной сезон).",
  },
  {
    number: "04",
    id: "budget",
    title: "Бюджет переезда",
    items: [
      { label: "Апостиль + нотариальные переводы", value: "400–600 EUR · РФ + Сербия" },
      { label: "Gestora (DNV + Autónomo + Beckham)", value: "800–1 200 EUR · Испанский партнёр" },
      { label: "Консульский сбор (DNV)", value: "80 EUR · На заявителя" },
      { label: "Перелёт Белград → Валенсия (3 чел.)", value: "300–500 EUR · Ориентир" },
      { label: "Первый месяц + депозит 2 мес.", value: "3 600–4 800 EUR · Валенсия, 3BR" },
      { label: "Empadronamiento + NIE + TIE", value: "150–250 EUR · Пошлины" },
      { label: "Школа (материалы, форма)", value: "0–200 EUR · Concertada/pública" },
      { label: "Резерв", value: "1 000 EUR · Непредвиденное" },
      { label: "ИТОГО", value: "6 330–8 630 EUR" },
    ],
  },
  {
    number: "05",
    id: "risks",
    title: "Риски и стоп-факторы",
    risks: [
      {
        title: "Отказ в DNV",
        severity: "Средний",
        description:
          "Если gestora некачественно оформит пакет. Митигация: выбрать gestora с опытом DNV-кейсов, подготовить 18-месячную историю инвойсов.",
      },
      {
        title: "Сроки августа",
        severity: "Средний",
        description:
          "Консульство Испании в Белграде работает медленнее в августе. Рекомендуем подавать не позже 1 августа или перенести на сентябрь.",
      },
      {
        title: "Школа для дочери",
        severity: "Низкий",
        description:
          "В Валенсии достаточно мест в concertadas. Нужно empadronamiento — ищем место через июльский резерв.",
      },
      {
        title: "Beckham Law отказ",
        severity: "Низкий",
        description:
          "Отказ возможен если клиенты признаются испанскими. Текущие клиенты (NL, DE) иностранные. Подавать через gestora с опытом Beckham.",
      },
      {
        title: "Перевод накоплений из РФ",
        severity: "Высокий",
        description:
          "Накопления (€42k) хранятся в РФ. Прямой перевод затруднён. Рекомендуем: Армения/Казахстан как хаб, USDT → Kraken → SEPA, Wise с сербского счёта.",
      },
    ],
  },
  {
    number: "06",
    id: "documents",
    title: "Чек-лист документов",
    documentChecklist: [
      { document: "Загранпаспорт — срок действия не менее 1 года + копия", status: "done", statusLabel: "Есть ✓" },
      { document: "Справка об отсутствии судимости (РФ) — апостиль + перевод ES", status: "todo", statusLabel: "Нужно сделать" },
      { document: "Диплом о высшем образовании — апостиль + перевод ES", status: "todo", statusLabel: "Нужно сделать" },
      { document: "Контракты с клиентами (NL, DE) — за последние 12 мес.", status: "done", statusLabel: "Есть ✓" },
      { document: "Инвойсы с подтверждением оплаты — за 6 мес.", status: "done", statusLabel: "Есть ✓" },
      { document: "Выписка банковского счёта — 6 мес. (сербский)", status: "done", statusLabel: "Есть ✓" },
      { document: "Медицинская страховка (покрытие Испания)", status: "todo", statusLabel: "Нужно оформить" },
      { document: "Договор аренды в Испании (предварительный)", status: "todo", statusLabel: "Нужно найти" },
      { document: "Мотивационное письмо на испанском", status: "todo", statusLabel: "Нужно написать" },
      { document: "Биометрические фото", status: "todo", statusLabel: "Нужно сделать" },
    ],
  },
  {
    number: "07",
    id: "providers",
    title: "Типы нужных специалистов",
    content: [
      "Emigro не рекомендует конкретных провайдеров и не несёт ответственности за их работу. Ниже — типы специалистов на маршруте и критерии выбора.",
    ],
    providers: [
      {
        title: "Gestora / Asesoría (Испания)",
        scope: "DNV + Autónomo + Beckham Law",
        criteria:
          "Опыт с клиентами из третьих стран (не ЕС), кейсы DNV 2025–2026, понимание фриланс-структуры.",
        cost: "€800–1 500",
      },
      {
        title: "Нотариальный переводчик (Белград)",
        scope: "Диплом + справка о несудимости → испанский",
        criteria:
          "Сертифицированный судебный переводчик с испанского в Белграде. Срок: 3–7 дней.",
        cost: "€80–150/документ",
      },
      {
        title: "Агентство недвижимости (Валенсия)",
        scope: "Аренда 3BR с официальным empadronamiento",
        criteria:
          "Ключевое условие: арендодатель делает официальный empadronamiento. Районы: Eixample, Ruzafa, Benimaclet.",
        cost: "—",
      },
    ],
  },
  {
    number: "08",
    id: "next",
    title: "Следующие шаги — топ-3 прямо сейчас",
    nextSteps: [
      {
        title: "Заказать справку о несудимости в МВД РФ",
        detail:
          "Срок изготовления — до 30 дней. Через доверенное лицо в РФ + апостиль в Минюсте. Начать не позже 7 июля — иначе срок подачи сдвигается.",
      },
      {
        title: "Найти gestora с опытом DNV в Испании",
        detail:
          "Запросить у 2–3 gestoras: кейсы DNV за 2025–2026, опыт с фрилансерами из третьих стран, готовность вести Beckham Law. Emigro Assist поможет сформулировать запрос на испанском.",
      },
      {
        title: "Перевести накопления из РФ",
        detail:
          "Открыть счёт в армянском или казахстанском банке, перевести туда часть накоплений, затем на сербский/европейский. Либо USDT → Kraken → SEPA. Займёт 4–6 недель.",
      },
    ],
    content: [
      "Нужна помощь в коммуникации с gestora или партнёрами? Emigro Assist — €100/час · contact@emigro.online",
    ],
  },
];
