import type { Corridor, CorridorProgram, ProgramDetail, WizardDefinition } from "@/lib/types";

/** SIRI fee overview, 01.01.2026: Euro 912.87. Shown as ~€912. */
export const DENMARK_SIRI_WORK_FEE = "DKK 6 810 (~€912)";

export const DENMARK_WORK_BADGE = "Работа у датского работодателя";

export const PAY_LIMIT_QUICK_LEAD =
  "Рабочий ВНЖ Дании для специалистов с предложением работы от датского работодателя и годовой зарплатой не ниже установленного Pay Limit. Удалённая работа на иностранную компанию сама по себе не даёт права на этот маршрут.";

const VERIFIED = "2026-11-01";

const PASSPORT_NOTE_RU =
  "Заявление на рабочий ВНЖ рассматривает SIRI. Биометрию сдают в датском представительстве или визовом центре по месту законного проживания, как правило в течение 14 дней после подачи; если запись позже, SIRI сообщают дату. Виза и въезд зависят от страны проживания и конкретного представительства. Карточка не подтверждает, что подача открыта для паспорта без этой проверки.";

const PASSPORT_NOTE_EN =
  "SIRI decides the work-permit application. Biometrics are recorded at a Danish mission or application centre in the country of legal residence, normally within 14 days of filing. The visa and entry depend on that residence and the specific mission.";

export const DENMARK_EMPLOYMENT_SLUGS = [
  "denmark-work-permit",
  "denmark-supplementary-pay-limit",
  "denmark-positive-list",
  "denmark-fast-track",
] as const;

export type DenmarkEmploymentSlug = (typeof DENMARK_EMPLOYMENT_SLUGS)[number];

const CARD_ORDER = [
  "denmark-work-permit",
  "denmark-supplementary-pay-limit",
  "denmark-positive-list",
  "denmark-family-reunification",
  "denmark-fast-track",
];

type Fact = {
  programId: string;
  versionId: string;
  titleRu: string;
  summaryRu: string;
  requirements: { label: string; value: string }[];
  timeline: { title: string; duration: string }[];
  sources: { url: string; excerpt: string; label: string }[];
};

const FEE_SOURCE = {
  url: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/Fælles/Fees/Fee---overview-of-fee-rates",
  excerpt:
    "Таблица сборов SIRI на 01.01.2026: Positive Lists, Pay Limit schemes, Fast-track и их продления — DKK 6 810 (Euro 912.87). Сопровождающая семья работника — отдельный сбор DKK 3 080, не сбор воссоединения к гражданину.",
  label: "SIRI — таблица сборов",
};

const PROCESSING_SOURCE = {
  url: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Case-processing-times-in-SIRI",
  excerpt:
    "Срок SIRI считается до решения по заявлению. Pay Limit: обычно 1 месяц, до 3 месяцев. Supplementary Pay Limit: обычно 2 месяца, до 5. Fast-track pay limit / short-term / researcher / educational: обычно 1 месяц, до 2. Fast-track supplementary: обычно 2 месяца, до 4. Positive List higher education: обычно 1 месяц, до 3. Positive List skilled work: обычно 3 месяца, до 4.",
  label: "SIRI — сроки рассмотрения",
};

function feeCost() {
  return { label: "Сбор SIRI", value: DENMARK_SIRI_WORK_FEE };
}

const FACTS: Record<DenmarkEmploymentSlug, Fact> = {
  "denmark-work-permit": {
    programId: "b0000000-0000-4000-8000-000000000109",
    versionId: "c0000000-0000-4000-8000-000000000109",
    titleRu: "Pay Limit Scheme — рабочий ВНЖ Дании",
    summaryRu:
      "Рабочий ВНЖ при оффере датского работодателя и зарплате не ниже DKK 552 000 в год (2026). Удалённая работа на иностранную компанию этот маршрут не открывает.",
    requirements: [
      {
        label: "Зарплата Pay Limit",
        value:
          "DKK 552 000 в год в 2026 году (на странице минимума SIRI также DKK 46 000 в месяц). Ориентир Emigro ~€74 000 брутто. Не менее 30 часов в неделю; годовой минимум нужен независимо от числа часов.",
      },
      {
        label: "Оффер датского работодателя",
        value:
          "Работа по найму у работодателя в Дании, условия не ниже датских стандартов. Удалённая работа на иностранную компанию сама по себе этот маршрут не открывает.",
      },
      {
        label: "Что входит в DKK 552 000",
        value:
          "SIRI учитывает гарантированную денежную зарплату, включая фиксированные надбавки, взносы в трудовую пенсию работодателя и работника и оплачиваемые отпускные. При помесячной оплате в оценку входит отпускная надбавка 1%. При почасовой оплате надбавка 12,5% сверху базовой ставки в Pay Limit не добавляется. Отпускные, которые выплатят только в следующем году, в зарплату текущего года не входят. Бесплатное жильё, автомобиль, столовая, телефон, интернет и похожие льготы в порог не входят.",
      },
      {
        label: "Датский банковский счёт",
        value:
          "Зарплата поступает на счёт в датском банке на имя заявителя. Счёт открывают в течение 180 дней после выдачи разрешения. Если въезд позже выдачи, срок 180 дней считается от въезда. Если датский ВНЖ уже действует не менее 180 дней, зарплата идёт на датский счёт с первой выплаты.",
      },
      {
        label: "Срок разрешения и смена работы",
        value:
          "Разрешение привязано к конкретной работе. Контракт на 4 года или дольше: разрешение обычно на 4 года. Более короткий контракт: срок обычно равен сроку работы, и дополнительно дают 6 месяцев на поиск работы без права работать. Новый работодатель — новое разрешение. Смена содержания работы внутри той же компании или университета нового разрешения не требует, если зарплата остаётся не ниже Pay Limit и датских стандартов. О потере работы сообщают SIRI: разрешение могут отозвать. При увольнении не по вине работника можно в течение 2 дней просить ещё 6 месяцев на поиск; работать в этот период нельзя.",
      },
    ],
    timeline: [
      { title: "Подготовка работодателем и заявителем", duration: "Зависит от кейса" },
      { title: "Рассмотрение SIRI", duration: "Обычно 1 месяц" },
      { title: "Если SIRI запросит дополнительные сведения", duration: "До 3 месяцев" },
      { title: "Биометрия, въезд и карта", duration: "Отдельно от срока решения SIRI" },
    ],
    sources: [
      {
        url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme",
        excerpt:
          "Pay Limit Scheme: оффер работы в Дании, минимум DKK 552 000 в 2026 году, не менее 30 часов в неделю, сбор DKK 6 810. Обычный срок решения 1 месяц, до 3 месяцев если нужны дополнительные сведения. Страница обновлена 22.09.2026.",
        label: "SIRI — Pay Limit Scheme",
      },
      {
        url: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Minimum-amounts/Pay-Limit-Scheme's-minimum-amount",
        excerpt: "Минимум Pay Limit с 1 января 2026: DKK 552 000 в год, DKK 46 000 в месяц. Зарплата и условия должны соответствовать датским стандартам.",
        label: "SIRI — минимум Pay Limit",
      },
      PROCESSING_SOURCE,
      FEE_SOURCE,
    ],
  },
  "denmark-supplementary-pay-limit": {
    programId: "b0000000-0000-4000-8000-000000000112",
    versionId: "c0000000-0000-4000-8000-000000000112",
    titleRu: "Supplementary Pay Limit — рабочий ВНЖ Дании",
    summaryRu:
      "Отдельная схема SIRI: оффер в Дании и зарплата не ниже DKK 446 000 в год (2026). Порог ниже Pay Limit, но схема доступна только при дополнительных условиях, включая публикацию вакансии и полную занятость.",
    requirements: [
      {
        label: "Зарплата Supplementary Pay Limit",
        value:
          "DKK 446 000 в год в 2026 году, DKK 37 166,67 в месяц. Ориентир Emigro ~€59 800 брутто. Это отдельная схема, а не снижение порога Pay Limit для любого оффера.",
      },
      {
        label: "Оффер и публикация вакансии",
        value:
          "Нужен оффер работы в Дании. Вакансия должна быть размещена и на Jobnet, и в EURES не менее 2 недель до подачи в SIRI и не более 6 месяцев до подачи.",
      },
      {
        label: "Рабочее время",
        value:
          "По общему правилу полная занятость: 37–40 часов в неделю. Годовой минимум DKK 446 000 при этом всё равно должен быть выполнен.",
      },
      {
        label: "Дополнительные условия схемы",
        value:
          "Зарплата и условия труда не ниже датских стандартов. В состав порога входят гарантированная денежная зарплата, пенсионные взносы работодателя и работника и оплачиваемые отпускные; жильё, автомобиль, телефон и похожие льготы не входят. За 2 года до подачи не должно быть штрафа от DKK 3 000 по уголовному кодексу, закону о наркотиках, закону об оружии или закону об иностранцах. Сезонно скорректированная валовая безработица не должна превышать 3,75% в среднем за 3 месяца до подачи.",
      },
      {
        label: "Датский банковский счёт",
        value:
          "Зарплата на счёт в датском банке на имя заявителя. Счёт открывают в течение 180 дней после разрешения или, если въезд позже, в течение 180 дней после въезда.",
      },
    ],
    timeline: [
      { title: "Подготовка работодателем и заявителем", duration: "Зависит от кейса" },
      { title: "Рассмотрение SIRI", duration: "Обычно 2 месяца" },
      { title: "Если SIRI запросит дополнительные сведения", duration: "До 5 месяцев" },
      { title: "Биометрия, въезд и карта", duration: "Отдельно от срока решения SIRI" },
    ],
    sources: [
      {
        url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Pay-Limit-Schemes/Supplementary-Pay-Limit-scheme",
        excerpt:
          "Supplementary Pay Limit Scheme — отдельная схема: оффер в Дании от DKK 446 000 (2026), публикация на Jobnet и EURES, полная занятость. Обычный срок 2 месяца, до 5 месяцев. Сбор DKK 6 810.",
        label: "SIRI — Supplementary Pay Limit",
      },
      {
        url: "https://www.nyidanmark.dk/en-GB/Words-and-concepts/SIRI/Minimum-amounts/The-Supplementary-Pay-Limit-Scheme's-minimum-amount",
        excerpt: "Минимум Supplementary Pay Limit с 1 января 2026: DKK 446 000 в год, DKK 37 166,67 в месяц.",
        label: "SIRI — минимум Supplementary Pay Limit",
      },
      PROCESSING_SOURCE,
      FEE_SOURCE,
    ],
  },
  "denmark-positive-list": {
    programId: "b0000000-0000-4000-8000-000000000113",
    versionId: "c0000000-0000-4000-8000-000000000113",
    titleRu: "Positive List — рабочий ВНЖ Дании",
    summaryRu:
      "Отдельный рабочий маршрут, если должность входит в Positive List SIRI. Порог DKK 552 000 для этой схемы не требуется. У списков высшего образования и skilled work разные сроки рассмотрения.",
    requirements: [
      {
        label: "Два списка SIRI",
        value:
          "Positive List for People with a Higher Education: должность есть в списке дефицитных профессий, а образование подходит для этой работы. Positive List for Skilled Work: должность есть в списке квалифицированных профессий. Оба списка обновляют 1 января и 1 июля. Оффер датского работодателя обязателен.",
      },
      {
        label: "Зарплата и датские стандарты",
        value:
          "Отдельного порога Pay Limit нет. Зарплата и условия (отпуск, срок уведомления) не ниже датских стандартов для этой области. Для skilled work SIRI сверяет предложение со статистикой зарплат Danmarks Statistik. Учитываются гарантированная денежная зарплата, допустимые пенсионные взносы и отпускные; жильё, автомобиль, телефон и похожие льготы не входят.",
      },
      {
        label: "Обязанности работодателя на skilled work",
        value:
          "Для Positive List for Skilled Work работодатель должен выполнять обязанности по обучению учеников и быть в системе Læreplads-AUB. Исключения из этого условия SIRI не даёт.",
      },
      {
        label: "Датский банковский счёт",
        value:
          "Зарплата на счёт в датском банке на имя заявителя, счёт в течение 180 дней после разрешения или въезда — по тому же правилу, что у Pay Limit.",
      },
      {
        label: "Сроки двух списков",
        value:
          "Higher education: обычно 1 месяц, до 3 месяцев если нужны дополнительные сведения. Skilled work: обычно 3 месяца, до 4 месяцев. Сбор каждой схемы — DKK 6 810 (~€912).",
      },
    ],
    timeline: [
      { title: "Подготовка работодателем и заявителем", duration: "Зависит от кейса" },
      { title: "Positive List, высшее образование", duration: "Обычно 1 месяц, до 3 месяцев" },
      { title: "Positive List, skilled work", duration: "Обычно 3 месяца, до 4 месяцев" },
      { title: "Биометрия, въезд и карта", duration: "Отдельно от срока решения SIRI" },
    ],
    sources: [
      {
        url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Positive-List-Higher-Education",
        excerpt:
          "Positive List for People with a Higher Education: должность из списка дефицита, образование под должность, датские стандарты. Обычно 1 месяц, до 3 месяцев. Сбор DKK 6 810. Страница обновлена 01.10.2026.",
        label: "SIRI — Positive List, высшее образование",
      },
      {
        url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/The-Positive-Lists/Positive-List-for-skilled-work",
        excerpt:
          "Positive List for Skilled Work: должность из списка квалифицированных профессий, зарплата по датским стандартам и статистике Danmarks Statistik, обязанности работодателя по ученикам. Обычно 3 месяца, до 4. Сбор DKK 6 810.",
        label: "SIRI — Positive List, skilled work",
      },
      PROCESSING_SOURCE,
      FEE_SOURCE,
    ],
  },
  "denmark-fast-track": {
    programId: "b0000000-0000-4000-8000-000000000111",
    versionId: "c0000000-0000-4000-8000-000000000111",
    titleRu: "Fast-track — рабочий ВНЖ Дании",
    summaryRu:
      "Рабочий ВНЖ, если датский работодатель сертифицирован SIRI. Зарплатный порог зависит от трека: pay limit DKK 552 000, supplementary pay limit DKK 446 000 или другой трек Fast-track.",
    requirements: [
      {
        label: "Сертифицированный работодатель",
        value:
          "Работодатель в Дании сертифицирован SIRI для Fast-track. Заявление по схеме обычно подаёт работодатель онлайн. Это работа у датского работодателя, а не удалёнка на иностранную компанию.",
      },
      {
        label: "Трек и зарплата",
        value:
          "Pay limit track: не ниже DKK 552 000 в год (2026). Supplementary pay limit track: не ниже DKK 446 000 и дополнительные условия этой схемы. У Fast-track также есть short-term, researcher и educational tracks; их условия смотрят на странице SIRI, без подстановки порога Pay Limit.",
      },
      {
        label: "Сроки SIRI по трекам",
        value:
          "Pay limit, short-term, researcher и educational tracks: обычно 1 месяц, до 2 месяцев если нужны дополнительные сведения. Supplementary pay limit track: обычно 2 месяца, до 4 месяцев.",
      },
      {
        label: "Датские стандарты и счёт",
        value:
          "Зарплата и условия не ниже датских стандартов. В порог трека входят гарантированная денежная зарплата, пенсионные взносы и отпускные; жильё, автомобиль, телефон и похожие льготы не входят. Зарплата идёт на датский счёт заявителя.",
      },
    ],
    timeline: [
      { title: "Сертификация работодателя и контракт", duration: "Зависит от кейса" },
      { title: "Fast-track: pay limit и соседние треки", duration: "Обычно 1 месяц, до 2 месяцев" },
      { title: "Fast-track: supplementary pay limit track", duration: "Обычно 2 месяца, до 4 месяцев" },
      { title: "Биометрия, въезд и карта", duration: "Отдельно от срока решения SIRI" },
    ],
    sources: [
      {
        url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Fast-track",
        excerpt:
          "Fast-track Scheme: работодатель сертифицирован SIRI. Pay limit track от DKK 552 000, supplementary pay limit track от DKK 446 000 (2026). Сбор DKK 6 810.",
        label: "SIRI — Fast-track",
      },
      PROCESSING_SOURCE,
      FEE_SOURCE,
    ],
  },
};

export function isDenmarkEmploymentSlug(slug: string): slug is DenmarkEmploymentSlug {
  return (DENMARK_EMPLOYMENT_SLUGS as readonly string[]).includes(slug);
}

export function denmarkEmploymentFact(slug: string): Fact | null {
  return isDenmarkEmploymentSlug(slug) ? FACTS[slug] : null;
}

function passports(versionId: string): ProgramDetail["passportEligibility"] {
  return (["RU", "BY", "UA", "KZ"] as const).map((iso2) => ({
    id: `${versionId}-${iso2}`,
    passport_iso2: iso2,
    status: "partial" as const,
    notes_en: PASSPORT_NOTE_EN,
    notes_ru: PASSPORT_NOTE_RU,
  }));
}

export function syntheticDenmarkProgram(slug: DenmarkEmploymentSlug): ProgramDetail {
  const fact = FACTS[slug];
  return applyDenmarkSiriFacts({
    id: fact.programId,
    slug,
    destination_iso2: "DK",
    program_type: "LABOR",
    title_ru: fact.titleRu,
    summary_ru: fact.summaryRu,
    version: { id: fact.versionId },
    requirements: [],
    timeline: [],
    costs: [],
    sources: [],
    passportEligibility: [],
  });
}

export function applyDenmarkSiriFacts(program: ProgramDetail): ProgramDetail {
  const fact = denmarkEmploymentFact(program.slug);
  if (!fact || !program.version) return program;
  const versionId = program.version.id || fact.versionId;
  return {
    ...program,
    title_ru: fact.titleRu,
    summary_ru: fact.summaryRu,
    requirements: fact.requirements.map((item, index) => ({
      id: `${versionId}-req-${index + 1}`,
      label_ru: item.label,
      value_text: item.value,
    })),
    costs: [
      { id: `${versionId}-fee`, label_ru: feeCost().label, amount_text: feeCost().value, amount_eur: null },
      {
        id: `${versionId}-bio`,
        label_ru: "Биометрия",
        amount_text: "Отдельный шаг: представительство по месту законного проживания, обычно в течение 14 дней после подачи",
        amount_eur: null,
      },
    ],
    timeline: fact.timeline.map((step, index) => ({
      id: `${versionId}-step-${index + 1}`,
      title_ru: step.title,
      duration_text: step.duration,
    })),
    sources: fact.sources.map((source, index) => ({
      id: `${versionId}-src-${index + 1}`,
      source_url: source.url,
      raw_excerpt: source.excerpt,
      last_verified: VERIFIED,
      label_ru: source.label,
    })),
    passportEligibility: passports(versionId),
  };
}

export function ensureDenmarkPrograms(
  programs: Map<string, ProgramDetail>,
  requestedSlugs: readonly string[],
): Map<string, ProgramDetail> {
  for (const slug of requestedSlugs) {
    if (!isDenmarkEmploymentSlug(slug)) continue;
    const current = programs.get(slug) ?? syntheticDenmarkProgram(slug);
    programs.set(slug, applyDenmarkSiriFacts(current.version ? current : { ...current, version: { id: FACTS[slug].versionId } }));
  }
  return programs;
}

export function withDenmarkWorkCards(corridor: Corridor): Corridor {
  if (corridor.slug !== "ru-speaking-to-denmark") return corridor;
  const bySlug = new Map(corridor.programs.map((program) => [program.slug, program]));
  for (const slug of DENMARK_EMPLOYMENT_SLUGS) {
    const fact = FACTS[slug];
    const existing = bySlug.get(slug);
    const card: CorridorProgram = {
      id: existing?.id ?? fact.programId,
      slug,
      program_type: "LABOR",
      title_ru: fact.titleRu,
      summary_ru: fact.summaryRu,
      sort_order: CARD_ORDER.indexOf(slug),
      is_featured: true,
    };
    bySlug.set(slug, card);
  }
  const programs = [...bySlug.values()].sort((a, b) => {
    const ai = CARD_ORDER.indexOf(a.slug);
    const bi = CARD_ORDER.indexOf(b.slug);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  return { ...corridor, programs };
}

export function overlayDenmarkWizard(wizard: WizardDefinition): WizardDefinition {
  if (wizard.slug !== "denmark-routes") return wizard;
  return {
    ...wizard,
    modules: wizard.modules.map((mod) => {
      if (mod.module_key !== "labor") return mod;
      return {
        ...mod,
        title_ru: DENMARK_WORK_BADGE,
        questions: mod.questions.map((question) =>
          question.question_key === "remote_income"
            ? {
                ...question,
                help_ru:
                  "Pay Limit, Supplementary Pay Limit, Positive List и Fast-track требуют оффер датского работодателя. Удалённый доход на иностранную компанию сам по себе эти схемы не открывает.",
              }
            : question,
        ),
      };
    }),
  };
}
