export type SamplePlanSection = {
  id: string;
  title: string;
  content: string[];
  items?: { label: string; value: string }[];
  checklist?: { done: boolean; text: string }[];
};

export const SAMPLE_PLAN_META = {
  clientName: "Максим К.",
  clientLocation: "Санкт-Петербург → Валенсия, Испания",
  family: "Супруга + 2 детей (7 и 11 лет)",
  route: "Digital Nomad Visa (ВНЖ цифрового кочевника)",
  corridor: "ru-speaking-to-spain",
  preparedAt: "15 мая 2026",
  planId: "EA-SP-2026-0042",
  status: "Выполнено — семья переехала",
} as const;

export const SAMPLE_PLAN_SECTIONS: SamplePlanSection[] = [
  {
    id: "summary",
    title: "Резюме для принятия решения",
    content: [
      "Семья Максима прошла полный цикл: от первичной проверки маршрута до получения ВНЖ и регистрации в Валенсии. Ключевой фактор — удалённый доход IT-директора (€4 200/мес. net) и готовность к консульскому этапу в Москве.",
      "Рекомендованный маршрут — Digital Nomad Visa Испании (Ley de Startups): один основной заявитель, супруга и дети как иждивенцы. Альтернативы (Португалия D8, автономo в Испании) отложены из‑за более длинного срока и дополнительных налоговых обязательств.",
      "Общий горизонт от первой консультации до переезда — 5,5 месяцев. Бюджет «под ключ» (без жилья) — €8 400. Риски снижены за счёт заблаговременной apostille/legalización и резерва на отказ консульства.",
    ],
  },
  {
    id: "profile",
    title: "Профиль семьи",
    items: [
      { label: "Заявитель", value: "Максим К., 38 лет, гражданин РФ" },
      { label: "Супруга", value: "Анна К., 36 лет, не работает (иждивенец)" },
      { label: "Дети", value: "Сын 11 лет, дочь 7 лет (иждивенцы)" },
      { label: "Текущая локация", value: "Санкт-Петербург (на момент старта)" },
      { label: "Целевой город", value: "Валенсия, Comunidad Valenciana" },
      { label: "Доход", value: "€4 200/мес. net, контракт с EU-компанией (remote)" },
      { label: "Сбережения", value: "€42 000 ликвидных (депозит + брокерский счёт)" },
      { label: "Языки", value: "RU — native, EN — B2, ES — A1 (курсы до переезда)" },
      { label: "Ограничения", value: "Школа для детей к сентябрю; не готовы к автономo на старте" },
    ],
    content: [],
  },
  {
    id: "route",
    title: "Выбранный маршрут",
    content: [
      "Digital Nomad Visa (residencia de teletrabajador de carácter internacional) — основной заявитель подтверждает удалённую работу на иностранную компанию, доход ≥200% SMI (2026: €2 849/мес.), страховку и жильё в Испании.",
      "Супруга и дети подаются как familiares a cargo в том же пакете после одобрения основного заявителя. Дети зачислены в concertado шкola в районе Campanar после получения NIE.",
      "Почему не D7 Португалии: семья хотела испаноязычную среду; контракт — с **EU-компанией** (не испанским работодателем), remote. Португалия D8 осталась запасным коридором на случай отказа.",
    ],
    items: [
      { label: "Тип разрешения", value: "ВНЖ teletrabajador internacional, 3 года" },
      { label: "Консульство", value: "Consulado General de España en Moscú" },
      { label: "Провайдеры", value: "Gestoría Valencia (оформление), страховка Sanitas Familiar" },
      { label: "Налоговый статус", value: "Beckham Law не применим; обсуждение autónomo — через 12 мес." },
    ],
  },
  {
    id: "timeline",
    title: "Таймлайн",
    items: [
      { label: "Нед. 1–2", value: "Route Check + сбор документов, apostille, переводы sworn translator" },
      { label: "Нед. 3–4", value: "Бронь жилья (contrato de arrendamiento), страховка, справки о несудимости" },
      { label: "Нед. 5–6", value: "Подача в консульство Москва, биометрия, доп. запрос (certificado de titularidad bancaria)" },
      { label: "Нед. 10", value: "Одобрение визы D, въезд в Испанию, TIE appointment" },
      { label: "Нед. 12", value: "NIE семьи, empadronamiento, школа — matrícula" },
      { label: "Нед. 22", value: "Получение карт TIE, открытие счёта CaixaBank" },
    ],
    content: [],
  },
  {
    id: "budget",
    title: "Бюджет (ориентир)",
    items: [
      { label: "Emigro Assist — Route Check", value: "€129" },
      { label: "Emigro Assist — полный план + сопровождение", value: "€990" },
      { label: "Переводы + apostille (4 комплекта)", value: "€680" },
      { label: "Gestoría + подготовка dossier", value: "€1 450" },
      { label: "Консульский сбор + fee gestoría consular", value: "€380" },
      { label: "Страховка Sanitas (семья, 12 мес.)", value: "€2 640" },
      { label: "Аренда депозит + агент (2 мес.)", value: "€2 800" },
      { label: "Переезд + первый месяц быт", value: "€1 900" },
      { label: "Резерв на дозапросы / задержки", value: "€1 500" },
      { label: "Итого (без аренды помесячно)", value: "≈ €8 400 + €1 400/мес. жильё" },
    ],
    content: [
      "Цифры актуальны на Q2 2026. Emigro Assist не получает комиссий от gestoría — провайдер выбран клиентом по прозрачному прайсу.",
    ],
  },
  {
    id: "documents",
    title: "Чек-лист документов",
    checklist: [
      { done: true, text: "Загранпаспорт (≥1 год, все члены семьи)" },
      { done: true, text: "Contrato laboral / employer letter (remote, ≥1 год)" },
      { done: true, text: "Выписки по зарплате за 3 мес. + bank certificate" },
      { done: true, text: "Справка о несудимости (apostille, перевод)" },
      { done: true, text: "Свидетельства о браке и рождении детей (apostille)" },
      { done: true, text: "Seguro médico privado без copago (семейный полис)" },
      { done: true, text: "Contrato de arrendamiento + registro vivienda" },
      { done: true, text: "Formulario EX-01 + tasa 790-038 (оплачена)" },
      { done: true, text: "CV + diploma ( перевод для основного заявителя)" },
      { done: false, text: "Certificado de titularidad — запрошен consulado post-submission" },
    ],
    content: [],
  },
  {
    id: "risks",
    title: "Риски и меры",
    content: [
      "Задержка apostille в РФ — закладывали +3 нед.; дубликаты справок заказаны параллельно.",
      "Дозапрос consulado по titularidad счёта — закрыт за 4 дня через gestoría.",
      "Школьные места в Campanar — бронь через список waiting list; backup: nearby Catarroja.",
      "Налоговое резидентство — семья планирует >183 дней в ES; консультация gestor с Q4 2026.",
    ],
  },
  {
    id: "next",
    title: "Следующие шаги (после переезда)",
    content: [
      "Продление TIE за 60 дней до окончания (напоминание в календаре Emigro Assist).",
      "Повышение ES до A2 для детей — интеграция в школьную программу.",
      "Оценка перехода основного заявителя на autónomo при росте дохода >€60k.",
      "Через 5 лет непрерывного ВНЖ — оценка eligibility для permanent residence.",
    ],
  },
];
