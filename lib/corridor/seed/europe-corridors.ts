/** Structured seed for Europe corridors (2026 thresholds, official sources). */

export type ProgramSeed = {
  slug: string;
  type: "LABOR" | "CAPITAL" | "BOND" | "STUDY";
  destinationIso2?: string;
  titleEn: string;
  titleRu: string;
  summaryEn: string;
  summaryRu: string;
  rule: Record<string, unknown>;
  requirements: { type: string; labelEn: string; labelRu: string; value: string }[];
  costs: { labelEn: string; labelRu: string; amount: string }[];
  timeline: { step: string; titleEn: string; titleRu: string; duration: string }[];
  sources: { url: string; excerpt: string; labelEn: string; labelRu: string }[];
  /** When set, all passport rows use this status (e.g. startup facilitator → needs_review). */
  passportStatusOverride?: "eligible" | "partial" | "ineligible";
};

export type DigestSeed = {
  category: string;
  titleEn: string;
  titleRu: string;
  bodyEn: string;
  bodyRu: string;
  sourceUrl?: string;
};

export type CorridorSeed = {
  id: string;
  slug: string;
  topicKey: string;
  urlSegment: string;
  destinations: string[];
  titleEn: string;
  titleRu: string;
  audienceEn: string;
  audienceRu: string;
  focusHintRu: string;
  programIds: [string, string, string];
  versionIds: [string, string, string];
  wizardId: string;
  moduleIds: [string, string, string, string];
  familyQuestionKey: string;
  programs: [ProgramSeed, ProgramSeed, ProgramSeed];
  digest: DigestSeed[];
  wizardIntroRu: string;
};

const PASSPORT_OPTIONS =
  '[{"value":"RU","label_en":"Russia","label_ru":"Россия"},{"value":"BY","label_en":"Belarus","label_ru":"Беларусь"},{"value":"UA","label_en":"Ukraine","label_ru":"Украина"},{"value":"KZ","label_en":"Kazakhstan","label_ru":"Казахстан"}]';

const CORE_QUESTIONS = (passportOptions: string) => [
  {
    key: "passport_iso2",
    type: "single",
    labelEn: "Your passport",
    labelRu: "Ваш паспорт",
    helpEn: "Primary passport you will apply with",
    helpRu: "Паспорт, с которым будете подавать",
    options: passportOptions,
  },
];

export function corridorWizardQuestions(
  corridor: CorridorSeed,
  laborExtra: { key: string; type: string; labelEn: string; labelRu: string; helpEn?: string; helpRu?: string; options?: string }[] = []
) {
  const familyKey = corridor.familyQuestionKey;
  const countryName = corridor.titleRu.replace("Русскоязычные → ", "");
  return {
    core: CORE_QUESTIONS(PASSPORT_OPTIONS),
    labor: [
      {
        key: "remote_income",
        type: "single",
        labelEn: "Stable remote income from abroad?",
        labelRu: "Стабильный удалённый доход из-за рубежа?",
        helpEn: "Salary or freelance from employers/clients outside destination country",
        helpRu: "Зарплата или фриланс от работодателей/клиентов вне страны назначения",
        options: '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]',
      },
      {
        key: "monthly_income_eur",
        type: "number",
        labelEn: "Monthly net income (EUR)",
        labelRu: "Месячный чистый доход (EUR)",
      },
      {
        key: "has_job_offer",
        type: "single",
        labelEn: "Signed job offer in destination country?",
        labelRu: "Подписанный оффер работы в стране назначения?",
        options: '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]',
      },
      {
        key: "annual_salary_eur",
        type: "number",
        labelEn: "Annual gross salary in offer (EUR)",
        labelRu: "Годовая брутто-зарплата в оффере (EUR)",
      },
      ...laborExtra,
    ],
    capital: [
      {
        key: "passive_income_eur",
        type: "number",
        labelEn: "Monthly passive income (EUR)",
        labelRu: "Месячный пассивный доход (EUR)",
        helpEn: "Pensions, rent, dividends — not salary",
        helpRu: "Пенсии, аренда, дивиденды — не зарплата",
      },
      {
        key: "savings_eur",
        type: "number",
        labelEn: "Liquid savings (EUR)",
        labelRu: "Ликвидные сбережения (EUR)",
      },
      {
        key: "willing_to_invest_eur",
        type: "number",
        labelEn: "Capital for investment route (EUR)",
        labelRu: "Капитал для инвестиционного маршрута (EUR)",
        helpEn: "Golden Visa / investor visa — not passive income. Real-estate GV closed in PT/ES.",
        helpRu: "Golden Visa / инвесторская виза — не пассивный доход. GV через недвижимость в PT/ES закрыт.",
      },
      {
        key: "has_university_degree",
        type: "single",
        labelEn: "Recognised university degree?",
        labelRu: "Признаваемый диплом вуза?",
        options: '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]',
      },
    ],
    bond: [
      {
        key: "relocating_with_spouse",
        type: "single",
        labelEn: "Spouse relocating with you?",
        labelRu: "Супруг(а) едет вместе с вами?",
        helpRu: "Супруг — иждивенец в заявке или воссоединение после вашего ВНЖ",
        options: '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]',
      },
      {
        key: "relocating_children_count",
        type: "number",
        labelEn: "Children relocating with you",
        labelRu: "Сколько детей едет с вами?",
        helpRu: "Несовершеннолетние — доп. пороги дохода и жилья",
      },
      {
        key: "relocating_parents_count",
        type: "number",
        labelEn: "Parents/grandparents relocating",
        labelRu: "Родители или бабушки/дедушки в поездке?",
        helpRu: "0 если никто. Взрослые родственники — сложный кейс, часто отдельное воссоединение",
      },
      {
        key: familyKey,
        type: "single",
        labelEn: `Family member legally in ${countryName}?`,
        labelRu: `Член семьи уже легально в стране (${countryName})?`,
        helpEn: "Resident or citizen who can sponsor reunification — if you join them",
        helpRu: "Резидент или гражданин для воссоединения — если вы едете к ним",
        options: '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]',
      },
    ],
    study: [
      {
        key: "wants_study_route",
        type: "single",
        labelEn: "Planning to relocate via study?",
        labelRu: "Планируете релокацию через учёбу (вуз / языковая школа)?",
        helpEn: "Student visa — not remote work or passive income",
        helpRu: "Студенческая виза — не удалёнка и не пассивный доход",
        options: '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]',
      },
      {
        key: "has_university_admission",
        type: "single",
        labelEn: "Admission / enrollment confirmation?",
        labelRu: "Есть подтверждение зачисления (admission / matrícula)?",
        helpEn: "Letter from university or language school",
        helpRu: "Письмо от вуза или языковой школы",
        options: '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]',
      },
      {
        key: "study_budget_eur",
        type: "number",
        labelEn: "Available study funds (EUR)",
        labelRu: "Доступные средства на учёбу (EUR)",
        helpEn: "Blocked account, savings, or sponsor for tuition + living",
        helpRu: "Blocked account, сбережения или спонсор — на обучение и проживание",
      },
      {
        key: "can_show_study_funds",
        type: "single",
        labelEn: "Can document source of study funds?",
        labelRu: "Можете подтвердить источник средств (банк / спонсор)?",
        options: '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]',
      },
      {
        key: "study_level",
        type: "single",
        labelEn: "Study level (optional)",
        labelRu: "Уровень обучения (необязательно)",
        options:
          '[{"value":"bachelor","label_en":"Bachelor","label_ru":"Бакалавриат"},{"value":"master","label_en":"Master","label_ru":"Магистратура"},{"value":"language","label_en":"Language school","label_ru":"Языковая школа"},{"value":"other","label_en":"Other","label_ru":"Другое"}]',
      },
    ],
  };
}

export const EUROPE_CORRIDORS: CorridorSeed[] = [
  {
    id: "a0000000-0000-4000-8000-000000000002",
    slug: "ru-speaking-to-spain",
    topicKey: "spain",
    urlSegment: "spain",
    destinations: ["ES"],
    titleEn: "Russian-speaking → Spain",
    titleRu: "Русскоязычные → Испания",
    audienceEn: "Relocation navigator for Russian-speaking applicants targeting Spain residency routes.",
    audienceRu: "Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Испанию.",
    focusHintRu: "Digital nomad (Ley 28/2022), residencia no lucrativa, воссоединение, DELE/CCSE",
    programIds: ["b0000000-0000-4000-8000-000000000004", "b0000000-0000-4000-8000-000000000005", "b0000000-0000-4000-8000-000000000006"],
    versionIds: ["c0000000-0000-4000-8000-000000000007", "c0000000-0000-4000-8000-000000000008", "c0000000-0000-4000-8000-000000000009"],
    wizardId: "d0000000-0000-4000-8000-000000000002",
    moduleIds: ["e0000000-0000-4000-8000-000000000005", "e0000000-0000-4000-8000-000000000006", "e0000000-0000-4000-8000-000000000007", "e0000000-0000-4000-8000-000000000008"],
    familyQuestionKey: "has_family_in_es",
    wizardIntroRu: "Сопоставим профиль с digital nomad (teletrabajo), residencia no lucrativa и воссоединением семьи.",
    programs: [
      {
        slug: "spain-digital-nomad",
        type: "LABOR",
        titleEn: "Spain Digital Nomad (teletrabajo internacional)",
        titleRu: "Испания — digital nomad (teletrabajo)",
        summaryEn:
          "Residence for remote workers with foreign income (Ley 28/2022 teletrabajo); max 20% income from Spain; consulate or UGE route.",
        summaryRu:
          "ВНЖ для удалённых работников с зарубежным доходом (Ley 28/2022 teletrabajo); не более 20% дохода из Испании; подача через консульство за рубежом или UGE в Испании.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            { "==": [{ var: "remote_income" }, "yes"] },
            { ">=": [{ var: "monthly_income_eur" }, 2849] },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Minimum monthly income", labelRu: "Минимальный месячный доход", value: "€2,849 (200% SMI 2026, расчёт UGE по 14 платежам SMI)" },
          {
            type: "documents",
            labelEn: "Remote work proof",
            labelRu: "Подтверждение удалённой работы",
            value: "Контракт ≥3 мес., инвойсы или письмо работодателя; компания-работодатель существует ≥1 год (для наёмных)",
          },
          { type: "insurance", labelEn: "Health insurance", labelRu: "Медстраховка", value: "Полное покрытие в Испании, без copay" },
          {
            type: "income",
            labelEn: "Family income add-on",
            labelRu: "Доплата за членов семьи",
            value: "+€916/мес. за первого иждивенца, +€305/мес. за каждого следующего (75%/25% SMI)",
          },
          {
            type: "documents",
            labelEn: "Spain income cap",
            labelRu: "Лимит дохода из Испании",
            value: "Не более 20% дохода от испанских клиентов или работодателя",
          },
          {
            type: "documents",
            labelEn: "Criminal record",
            labelRu: "Справка о несудимости",
            value: "Апостиль + sworn translation на испанский; действует ~3 месяца",
          },
          {
            type: "documents",
            labelEn: "Submission route",
            labelRu: "Маршрут подачи",
            value: "Консульство (виза D, 1 год) или UGE (если уже легально в Испании); TIE после одобрения",
          },
        ],
        costs: [
          { labelEn: "Consular / UGE fee", labelRu: "Консульский / UGE сбор", amount: "€80–120" },
          { labelEn: "Autónomo social security (if freelance)", labelRu: "Autónomo (если фриланс)", amount: "от ~€453/мес. (2026)" },
          { labelEn: "TIE issuance fee", labelRu: "Сбор TIE (tarjeta extranjero)", amount: "€16–20" },
          { labelEn: "Legal assistance (optional)", labelRu: "Юридическое сопровождение", amount: "€800–2 500" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Income & insurance dossier", titleRu: "Досье дохода и страховки", duration: "2–4 недели" },
          { step: "application", titleEn: "Consulate / UGE submission", titleRu: "Подача в консульство / UGE", duration: "2–4 месяца (консульство; UGE быстрее если уже в ES)" },
          { step: "residence", titleEn: "TIE residence card", titleRu: "Карта TIE (1+2+2 года)", duration: "4–12 мес. (Madrid/BCN часто 6–12)" },
          {
            step: "language_requirement",
            titleEn: "NIE, autónomo & Beckham window",
            titleRu: "NIE, autónomo и окно Beckham",
            duration: "В течение 6 мес. после NIE — выбор налогового режима; фрилансерам — alta autónomo",
          },
        ],
        sources: [
          {
            url: "https://www.boe.es/buscar/act.php?id=BOE-A-2022-23068",
            excerpt: "Ley 28/2022 — autorización de residencia para teletrabajo de carácter internacional.",
            labelEn: "Ley de Startups (BOE)",
            labelRu: "Ley de Startups (BOE)",
          },
          {
            url: "https://www.boe.es/eli/es/rd/2026/02/18/126/con",
            excerpt: "Real Decreto 126/2026 — SMI 2026 €1 221/мес (14 pagas). DNV threshold: €1 221 × 14 ÷ 12 × 2 = €2 849/мес.",
            labelEn: "BOE — SMI 2026",
            labelRu: "BOE — SMI 2026",
          },
          {
            url: "https://extranjeros.inclusion.gob.es/es/informacioninteres/informacionprocedimientos/ciudadanosnocomunitarios/residencia/trabajadores-altamente-cualificados-y-teletrabajadores-de-caracter-internacional/",
            excerpt: "Secretaría de Estado de Migraciones — procedimiento teletrabajo de carácter internacional (digital nomad / remote work).",
            labelEn: "inclusion.gob.es — teletrabajo",
            labelRu: "inclusion.gob.es — teletrabajo",
          },
        ],
      },
      {
        slug: "spain-non-lucrative",
        type: "CAPITAL",
        titleEn: "Spain Non-Lucrative Residence",
        titleRu: "Испания — residencia no lucrativa",
        summaryEn: "Passive income or savings; no work or remote work permitted.",
        summaryRu: "Пассивный доход или сбережения; работа и удалёнка запрещены.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            {
              or: [
                { ">=": [{ var: "passive_income_eur" }, 2400] },
                { ">=": [{ var: "savings_eur" }, 57600] },
              ],
            },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Financial means", labelRu: "Финансовые средства", value: "€28,800/год (400% IPREM €600/мес.) или эквивалент в сбережениях" },
          { type: "documents", labelEn: "No employment", labelRu: "Без трудовой деятельности", value: "Подтверждение прекращения работы; удалёнка не допускается" },
          { type: "insurance", labelEn: "Private health insurance", labelRu: "Частная страховка", value: "Без доплат (copay) — требование многих консульств" },
        ],
        costs: [
          { labelEn: "Visa fee (indicative)", labelRu: "Визовый сбор", amount: "€80–160" },
          { labelEn: "Renewal savings (2-year)", labelRu: "Сбережения на продление (2 года)", amount: "до €57,600 на заявителя" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Passive income proof", titleRu: "Подтверждение пассивного дохода", duration: "2–6 недель" },
          { step: "application", titleEn: "Consulate application", titleRu: "Подача в консульство", duration: "2–4 месяца" },
          { step: "residence", titleEn: "TIE (1+2+2 years)", titleRu: "TIE (1+2+2 года)", duration: "4–12 мес. (Madrid/BCN часто 6–12)" },
        ],
        sources: [
          {
            url: "https://www.boe.es/buscar/act.php?id=BOE-A-2011-7709",
            excerpt: "RD 557/2011 Art. 47 — 400% IPREM for non-lucrative residence.",
            labelEn: "Royal Decree 557/2011",
            labelRu: "RD 557/2011",
          },
        ],
      },
      {
        slug: "spain-family-reunification",
        type: "BOND",
        titleEn: "Spain Family Reunification",
        titleRu: "Испания — воссоединение семьи",
        summaryEn: "Join a legal resident or Spanish citizen family member.",
        summaryRu: "Присоединение к резиденту или гражданину Испании.",
        rule: { and: [{ "==": [{ var: "passport_iso2" }, "RU"] }, { "==": [{ var: "has_family_in_es" }, "yes"] }] },
        requirements: [
          { type: "family", labelEn: "Sponsor", labelRu: "Спонсор", value: "Легальный резидент или гражданин Испании" },
          { type: "income", labelEn: "Sponsor means", labelRu: "Средства спонсора", value: "Достаточный доход/IPREM для содержания семьи" },
        ],
        costs: [{ labelEn: "Consular fee", labelRu: "Консульский сбор", amount: "€80–120" }],
        timeline: [
          { step: "document_prep", titleEn: "Relationship proof", titleRu: "Подтверждение родства", duration: "2–6 недель" },
          { step: "application", titleEn: "Family reunification", titleRu: "Подача на воссоединение", duration: "2–4 месяца" },
          { step: "residence", titleEn: "Family TIE", titleRu: "Семейный TIE", duration: "4–12 мес." },
        ],
        sources: [
          {
            url: "https://www.inclusion.gob.es/web/migraciones/w/reagrupacion-familiar",
            excerpt: "Reagrupación familiar — family reunification for legal residents.",
            labelEn: "Spanish immigration (inclusion.gob.es)",
            labelRu: "Миграционная служба Испании",
          },
        ],
      },
    ],
    digest: [
      {
        category: "citizenship",
        titleEn: "Citizenship language (DELE + CCSE)",
        titleRu: "Язык для гражданства (DELE + CCSE)",
        bodyEn: "Naturalization typically requires 10 years legal residence (general rule). DELE A2 and CCSE constitutional knowledge test are standard.",
        bodyRu: "Натурализация — как правило 10 лет легального проживания. Нужны DELE A2 и тест CCSE по конституции.",
        sourceUrl: "https://sede.mjusticia.gob.es/",
      },
      {
        category: "exam",
        titleEn: "DELE A2 structure",
        titleRu: "Структура DELE A2",
        bodyEn: "DELE assesses Spanish at A2 (reading, writing, listening, speaking). Plan 4–8 months from zero for Russian speakers.",
        bodyRu: "DELE проверяет испанский на A2. С нуля закладывайте 4–8 месяцев подготовки.",
        sourceUrl: "https://examenes.cervantes.es/",
      },
      {
        category: "timeline",
        titleEn: "Residence → citizenship",
        titleRu: "ВНЖ → гражданство",
        bodyEn: "Typical: visa/TIE → renewals → 10 years residence → DELE/CCSE → nationality (12–24 months processing). Sephardic and Latin American exceptions exist.",
        bodyRu: "Типично: виза/TIE → продления → 10 лет → DELE/CCSE → гражданство (12–24 мес.). Есть исключения (сефарды, LATAM).",
      },
      {
        category: "practical",
        titleEn: "NIE and empadronamiento",
        titleRu: "NIE и empadronamiento",
        bodyEn: "Foreigners need NIE for tax/bank. Empadronamiento (municipal registration) is required for many procedures.",
        bodyRu: "Иностранцам нужен NIE для налогов и банка. Empadronamiento (регистрация по месту жительства) нужна для многих процедур.",
      },
      {
        category: "practical",
        titleEn: "Golden visa reform",
        titleRu: "Реформа golden visa",
        bodyEn: "Real-estate investment route closed from 2025-04-03. Transitional cases are narrow — verify current BOE before planning.",
        bodyRu: "Маршрут через недвижимость закрыт с 2025-04-03. Переходные кейсы узкие — проверяйте актуальный BOE.",
        sourceUrl: "https://www.boe.es/",
      },
    ],
  },
  {
    id: "a0000000-0000-4000-8000-000000000003",
    slug: "ru-speaking-to-france",
    topicKey: "france",
    urlSegment: "france",
    destinations: ["FR"],
    titleEn: "Russian-speaking → France",
    titleRu: "Русскоязычные → Франция",
    audienceEn: "Relocation navigator for Russian-speaking applicants targeting France residency routes.",
    audienceRu: "Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ во Францию.",
    focusHintRu: "Talent salarié qualifié, VLS-TS visiteur, воссоединение, DELF, префектура",
    programIds: ["b0000000-0000-4000-8000-000000000007", "b0000000-0000-4000-8000-000000000008", "b0000000-0000-4000-8000-000000000009"],
    versionIds: ["c0000000-0000-4000-8000-000000000010", "c0000000-0000-4000-8000-000000000011", "c0000000-0000-4000-8000-000000000012"],
    wizardId: "d0000000-0000-4000-8000-000000000003",
    moduleIds: ["e0000000-0000-4000-8000-000000000009", "e0000000-0000-4000-8000-000000000010", "e0000000-0000-4000-8000-000000000011", "e0000000-0000-4000-8000-000000000012"],
    familyQuestionKey: "has_family_in_fr",
    wizardIntroRu: "Сопоставим профиль с Talent salarié qualifié, VLS-TS visiteur и воссоединением семьи.",
    programs: [
      {
        slug: "france-talent-salarie",
        type: "LABOR",
        titleEn: "France Talent — salarié qualifié",
        titleRu: "Франция Talent — salarié qualifié",
        summaryEn: "Multi-year residence for qualified employees with a French job offer meeting salary threshold.",
        summaryRu: "Многолетний ВНЖ для квалифицированных сотрудников с оффером во Франции и порогом зарплаты.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            { "==": [{ var: "has_job_offer" }, "yes"] },
            { ">=": [{ var: "annual_salary_eur" }, 39582] },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Minimum gross salary", labelRu: "Минимальная брутто-зарплата", value: "€39,582/year (2026 PACE salarié qualifié threshold)" },
          { type: "documents", labelEn: "Employment contract", labelRu: "Трудовой договор", value: "CDI or qualifying CDD with French employer" },
          { type: "insurance", labelEn: "Health coverage", labelRu: "Медицинское покрытие", value: "French social security enrollment after arrival" },
        ],
        costs: [
          { labelEn: "Visa fee (indicative)", labelRu: "Визовый сбор", amount: "€99–120" },
          { labelEn: "Prefecture titre de séjour", labelRu: "Prefecture — titre de séjour", amount: "€225 (2026 indicative)" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Employer & salary dossier", titleRu: "Досье работодателя и зарплаты", duration: "2–4 weeks" },
          { step: "application", titleEn: "Consulate VLS-TS application", titleRu: "Подача VLS-TS в консульство", duration: "2–4 months" },
          { step: "residence", titleEn: "Prefecture validation", titleRu: "Валидация в префектуре", duration: "4–12 mo. after arrival (Paris/IDF often 6–12)" },
        ],
        sources: [
          {
            url: "https://www.service-public.fr/particuliers/vosdroits/F16926",
            excerpt: "Carte de séjour pluriannuelle — salarié qualifié: minimum gross salary set annually (€39,582 in 2026).",
            labelEn: "Service-Public — salarié qualifié",
            labelRu: "Service-Public — salarié qualifié",
          },
          {
            url: "https://france-visas.gouv.fr/en/web/france-visas/long-stay-visa",
            excerpt: "Long-stay visa (VLS-TS) for employment in France.",
            labelEn: "France-Visas",
            labelRu: "France-Visas",
          },
        ],
      },
      {
        slug: "france-vls-ts-visiteur",
        type: "CAPITAL",
        titleEn: "France VLS-TS visiteur",
        titleRu: "Франция VLS-TS visiteur",
        summaryEn: "Long-stay visitor visa for applicants with sufficient means without working in France.",
        summaryRu: "Долгосрочная виза посетителя при достаточных средствах без права работы во Франции.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            {
              or: [
                { ">=": [{ var: "passive_income_eur" }, 1823] },
                { ">=": [{ var: "savings_eur" }, 21876] },
              ],
            },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Financial means", labelRu: "Финансовые средства", value: "€21,876/year (SMIC annuel 2026) — ~€1,823/month passive or equivalent savings" },
          { type: "documents", labelEn: "No employment in France", labelRu: "Без работы во Франции", value: "Attestation of sufficient resources; no salaried activity" },
          { type: "insurance", labelEn: "Health insurance", labelRu: "Медстраховка", value: "Full coverage in France for entire stay" },
        ],
        costs: [
          { labelEn: "Visa fee", labelRu: "Визовый сбор", amount: "€99" },
          { labelEn: "Prefecture renewal", labelRu: "Продление в префектуре", amount: "€225 (indicative)" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Proof of means & insurance", titleRu: "Подтверждение средств и страховки", duration: "2–4 weeks" },
          { step: "application", titleEn: "Consulate submission", titleRu: "Подача в консульство", duration: "2–4 months" },
          { step: "residence", titleEn: "Visitor titre de séjour", titleRu: "Titre de séjour visiteur", duration: "4–9 mo. after arrival" },
        ],
        sources: [
          {
            url: "https://france-visas.gouv.fr/en/web/france-visas/long-stay-visitor-visa",
            excerpt: "Visitor visa — resources at least equal to SMIC for 12 months without working.",
            labelEn: "France-Visas visiteur",
            labelRu: "France-Visas visiteur",
          },
          {
            url: "https://www.service-public.fr/particuliers/vosdroits/F302",
            excerpt: "SMIC 2026 — reference for minimum resources (€21,876/year gross SMIC).",
            labelEn: "Service-Public SMIC",
            labelRu: "Service-Public SMIC",
          },
        ],
      },
      {
        slug: "france-family-reunification",
        type: "BOND",
        titleEn: "France Family Reunification",
        titleRu: "Франция — воссоединение семьи",
        summaryEn: "Join a family member legally residing in France.",
        summaryRu: "Присоединение к члену семьи с легальным статусом во Франции.",
        rule: { and: [{ "==": [{ var: "passport_iso2" }, "RU"] }, { "==": [{ var: "has_family_in_fr" }, "yes"] }] },
        requirements: [
          { type: "family", labelEn: "Sponsor in France", labelRu: "Спонсор во Франции", value: "Spouse, parent, or qualifying relative with legal stay" },
          { type: "income", labelEn: "Sponsor resources", labelRu: "Средства спонсора", value: "Stable income and adequate housing (SMIC-based rules)" },
        ],
        costs: [{ labelEn: "Visa & OFII fee", labelRu: "Виза и OFII", amount: "€99 + €250 (indicative)" }],
        timeline: [
          { step: "document_prep", titleEn: "Family & housing proof", titleRu: "Подтверждение родства и жилья", duration: "2–8 weeks" },
          { step: "application", titleEn: "OFII / consulate process", titleRu: "Процедура OFII / консульство", duration: "4–10 months" },
          { step: "residence", titleEn: "Family titre de séjour", titleRu: "Семейный titre de séjour", duration: "4–12 months" },
        ],
        sources: [
          {
            url: "https://www.service-public.fr/particuliers/vosdroits/F11166",
            excerpt: "Regroupement familial — family reunification for legal residents in France.",
            labelEn: "Service-Public regroupement familial",
            labelRu: "Service-Public regroupement familial",
          },
        ],
      },
    ],
    digest: [
      {
        category: "citizenship",
        titleEn: "Naturalization language (DELF B1)",
        titleRu: "Язык для натурализации (DELF B1)",
        bodyEn: "Standard naturalization requires 5 years legal residence and French level B1 (DELF/DALF or equivalent).",
        bodyRu: "Стандартная натурализация — 5 лет легального проживания и французский B1 (DELF/DALF или эквивалент).",
        sourceUrl: "https://www.service-public.fr/particuliers/vosdroits/F2728",
      },
      {
        category: "exam",
        titleEn: "DELF B1 structure",
        titleRu: "Структура DELF B1",
        bodyEn: "DELF B1 tests comprehension, writing, speaking. Plan 6–12 months from zero for Russian speakers.",
        bodyRu: "DELF B1 проверяет понимание, письмо, говорение. С нуля закладывайте 6–12 месяцев.",
        sourceUrl: "https://www.france-education-international.fr/delf-dalf",
      },
      {
        category: "timeline",
        titleEn: "Residence → citizenship",
        titleRu: "ВНЖ → гражданство",
        bodyEn: "Typical: VLS-TS → renewals → 5 years → B1 → naturalization dossier (12–18 months processing).",
        bodyRu: "Типично: VLS-TS → продления → 5 лет → B1 → досье натурализации (12–18 мес.).",
      },
      {
        category: "practical",
        titleEn: "Prefecture appointments",
        titleRu: "Запись в префектуру",
        bodyEn: "After arrival, validate VLS-TS and renew at your department prefecture. Wait times vary by department.",
        bodyRu: "После приезда валидируйте VLS-TS и продлевайте в префектуре департамента. Сроки записи различаются.",
        sourceUrl: "https://www.service-public.fr/",
      },
      {
        category: "practical",
        titleEn: "OFII medical visit",
        titleRu: "Медосмотр OFII",
        bodyEn: "First long-stay holders must complete OFII registration and medical visit within 3 months of arrival.",
        bodyRu: "Держатели первого долгосрочного ВНЖ должны пройти регистрацию OFII и медосмотр в течение 3 месяцев.",
        sourceUrl: "https://www.ofii.fr/",
      },
    ],
  },
  {
    id: "a0000000-0000-4000-8000-000000000004",
    slug: "ru-speaking-to-italy",
    topicKey: "italy",
    urlSegment: "italy",
    destinations: ["IT"],
    titleEn: "Russian-speaking → Italy",
    titleRu: "Русскоязычные → Италия",
    audienceEn: "Relocation navigator for Russian-speaking applicants targeting Italy residency routes.",
    audienceRu: "Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Италию.",
    focusHintRu: "Digital nomad, visto elettiva residenza, воссоединение, CELI B1",
    programIds: ["b0000000-0000-4000-8000-000000000010", "b0000000-0000-4000-8000-000000000011", "b0000000-0000-4000-8000-000000000012"],
    versionIds: ["c0000000-0000-4000-8000-000000000013", "c0000000-0000-4000-8000-000000000014", "c0000000-0000-4000-8000-000000000015"],
    wizardId: "d0000000-0000-4000-8000-000000000004",
    moduleIds: ["e0000000-0000-4000-8000-000000000013", "e0000000-0000-4000-8000-000000000014", "e0000000-0000-4000-8000-000000000015", "e0000000-0000-4000-8000-000000000016"],
    familyQuestionKey: "has_family_in_it",
    wizardIntroRu: "Сопоставим профиль с digital nomad, visto elettiva residenza и воссоединением семьи.",
    programs: [
      {
        slug: "italy-digital-nomad",
        type: "LABOR",
        titleEn: "Italy Digital Nomad Visa",
        titleRu: "Италия — digital nomad visa",
        summaryEn: "Residence for highly qualified remote workers with foreign income.",
        summaryRu: "ВНЖ для квалифицированных удалённых работников с зарубежным доходом.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            { "==": [{ var: "remote_income" }, "yes"] },
            { ">=": [{ var: "monthly_income_eur" }, 2066] },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Minimum annual income", labelRu: "Минимальный годовой доход", value: "€24,790/year (~€2,066/month; 3× healthcare exemption base, 2026)" },
          { type: "documents", labelEn: "Remote work proof", labelRu: "Подтверждение удалённой работы", value: "Contract, tax returns, professional qualification" },
          { type: "insurance", labelEn: "Health insurance", labelRu: "Медстраховка", value: "Valid in Italy for entire stay" },
        ],
        costs: [
          { labelEn: "Consular fee", labelRu: "Консульский сбор", amount: "€116 (indicative)" },
          { labelEn: "Permesso di soggiorno", labelRu: "Permesso di soggiorno", amount: "€40–100" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Income & qualification dossier", titleRu: "Досье дохода и квалификации", duration: "2–4 weeks" },
          { step: "application", titleEn: "Consulate nulla osta / visa", titleRu: "Консульство nulla osta / виза", duration: "2–4 months" },
          { step: "residence", titleEn: "Permesso di soggiorno", titleRu: "Permesso di soggiorno", duration: "4–12 months (Milan/Rome longer)" },
        ],
        sources: [
          {
            url: "https://www.integrazionemigranti.gov.it/en-gb/Ricerca-news/Dettaglio-news/id/3835/Who-are-the-digital-nomads-How-can-they-enter-Italy-",
            excerpt: "Minimum income 3× healthcare exemption base (€8,263.30) = €24,789/year (Decreto Ministero Interno 29 Feb 2024).",
            labelEn: "Ministero del Lavoro — digital nomad FAQ",
            labelRu: "Ministero del Lavoro — digital nomad FAQ",
          },
        ],
      },
      {
        slug: "italy-elective-residence",
        type: "CAPITAL",
        titleEn: "Italy Elective Residence",
        titleRu: "Италия — visto elettiva residenza",
        summaryEn: "Residence for applicants with stable passive income from abroad.",
        summaryRu: "ВНЖ для заявителей со стабильным пассивным доходом из-за рубежа.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            {
              or: [
                { ">=": [{ var: "passive_income_eur" }, 2583] },
                { ">=": [{ var: "savings_eur" }, 31000] },
              ],
            },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Passive income threshold", labelRu: "Порог пассивного дохода", value: "€31,000/year (~€2,583/month) from pensions, rent, dividends" },
          { type: "documents", labelEn: "No work in Italy", labelRu: "Без работы в Италии", value: "Sworn declaration; remote salaried work not permitted" },
          { type: "insurance", labelEn: "Health insurance", labelRu: "Медстраховка", value: "Private coverage or enrollment if eligible" },
        ],
        costs: [
          { labelEn: "Consular fee", labelRu: "Консульский сбор", amount: "€116" },
          { labelEn: "Housing proof", labelRu: "Подтверждение жилья", amount: "Varies (lease or ownership)" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Passive income proof", titleRu: "Подтверждение пассивного дохода", duration: "2–6 weeks" },
          { step: "application", titleEn: "Consulate application", titleRu: "Подача в консульство", duration: "2–4 months" },
          { step: "residence", titleEn: "Permesso (1+2+2)", titleRu: "Permesso (1+2+2)", duration: "4–12 months" },
        ],
        sources: [
          {
            url: "https://www.interno.gov.it/it/temi/immigrazione-e-asilo/modalita-dingresso/elective-residence-visa",
            excerpt: "Elective residence visa — proof of stable passive income (€31,000/year threshold, 2026).",
            labelEn: "Ministero dell'Interno — elettiva residenza",
            labelRu: "Ministero dell'Interno — elettiva residenza",
          },
        ],
      },
      {
        slug: "italy-family-reunification",
        type: "BOND",
        titleEn: "Italy Family Reunification",
        titleRu: "Италия — воссоединение семьи",
        summaryEn: "Join a family member legally residing in Italy.",
        summaryRu: "Присоединение к члену семьи с легальным статусом в Италии.",
        rule: { and: [{ "==": [{ var: "passport_iso2" }, "RU"] }, { "==": [{ var: "has_family_in_it" }, "yes"] }] },
        requirements: [
          { type: "family", labelEn: "Sponsor in Italy", labelRu: "Спонсор в Италии", value: "Legal resident with qualifying family tie" },
          { type: "income", labelEn: "Sponsor income", labelRu: "Доход спонсора", value: "Above social allowance (assegno sociale) minimums" },
        ],
        costs: [{ labelEn: "Consular & permit fees", labelRu: "Консульство и permesso", amount: "€116 + €40–100" }],
        timeline: [
          { step: "document_prep", titleEn: "Nulla osta preparation", titleRu: "Подготовка nulla osta", duration: "2–8 weeks" },
          { step: "application", titleEn: "Family reunification visa", titleRu: "Виза воссоединения", duration: "2–4 months" },
          { step: "residence", titleEn: "Family permesso", titleRu: "Семейный permesso", duration: "4–12 months" },
        ],
        sources: [
          {
            url: "https://www.interno.gov.it/it/temi/immigrazione-e-asilo/soggiorno-di-lungo-periodo/ricongiungimento-familiare",
            excerpt: "Ricongiungimento familiare — family reunification for legal residents.",
            labelEn: "Ministero dell'Interno — ricongiungimento",
            labelRu: "Ministero dell'Interno — ricongiungimento",
          },
        ],
      },
    ],
    digest: [
      {
        category: "citizenship",
        titleEn: "Citizenship language (B1)",
        titleRu: "Язык для гражданства (B1)",
        bodyEn: "Naturalization generally requires 10 years legal residence and Italian B1 (CELI/CILS/PLIDA or equivalent).",
        bodyRu: "Натурализация — как правило 10 лет легального проживания и итальянский B1 (CELI/CILS/PLIDA).",
        sourceUrl: "https://www.interno.gov.it/",
      },
      {
        category: "exam",
        titleEn: "CELI B1 structure",
        titleRu: "Структура CELI B1",
        bodyEn: "CELI B1 assesses reading, writing, listening, speaking. Plan 6–10 months from zero.",
        bodyRu: "CELI B1 проверяет чтение, письмо, аудирование, говорение. С нуля — 6–10 месяцев.",
        sourceUrl: "https://www.cvcl.it/en/celi",
      },
      {
        category: "timeline",
        titleEn: "Residence → citizenship",
        titleRu: "ВНЖ → гражданство",
        bodyEn: "Typical: visa → permesso renewals → 10 years → B1 → citizenship application (24–36 months processing).",
        bodyRu: "Типично: виза → продления permesso → 10 лет → B1 → гражданство (24–36 мес.).",
      },
      {
        category: "practical",
        titleEn: "Codice fiscale & anagrafe",
        titleRu: "Codice fiscale и anagrafe",
        bodyEn: "Tax code (codice fiscale) and municipal registration (anagrafe) are required early for banking and permits.",
        bodyRu: "Налоговый код (codice fiscale) и регистрация в comune (anagrafe) нужны для банка и permesso.",
      },
      {
        category: "practical",
        titleEn: "Questura appointments",
        titleRu: "Запись в Questura",
        bodyEn: "Permesso di soggiorno is issued by local Questura. Appointment availability varies by city.",
        bodyRu: "Permesso выдаёт Questura. Сроки записи зависят от города.",
        sourceUrl: "https://www.poliziadistato.it/",
      },
    ],
  },
  {
    id: "a0000000-0000-4000-8000-000000000005",
    slug: "ru-speaking-to-germany",
    topicKey: "germany",
    urlSegment: "germany",
    destinations: ["DE"],
    titleEn: "Russian-speaking → Germany",
    titleRu: "Русскоязычные → Германия",
    audienceEn: "Relocation navigator for Russian-speaking applicants targeting Germany residency routes.",
    audienceRu: "Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Германию.",
    focusHintRu: "EU Blue Card, Chancenkarte, воссоединение, натурализация",
    programIds: ["b0000000-0000-4000-8000-000000000013", "b0000000-0000-4000-8000-000000000014", "b0000000-0000-4000-8000-000000000015"],
    versionIds: ["c0000000-0000-4000-8000-000000000016", "c0000000-0000-4000-8000-000000000017", "c0000000-0000-4000-8000-000000000018"],
    wizardId: "d0000000-0000-4000-8000-000000000005",
    moduleIds: ["e0000000-0000-4000-8000-000000000017", "e0000000-0000-4000-8000-000000000018", "e0000000-0000-4000-8000-000000000019", "e0000000-0000-4000-8000-000000000020"],
    familyQuestionKey: "has_family_in_de",
    wizardIntroRu: "Сопоставим профиль с EU Blue Card, Chancenkarte и воссоединением семьи.",
    programs: [
      {
        slug: "germany-eu-blue-card",
        type: "LABOR",
        titleEn: "Germany EU Blue Card",
        titleRu: "Германия — EU Blue Card",
        summaryEn: "Residence for university graduates with a qualified job meeting salary threshold.",
        summaryRu: "ВНЖ для выпускников вузов с квалифицированной работой и порогом зарплаты.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            { "==": [{ var: "has_job_offer" }, "yes"] },
            { ">=": [{ var: "annual_salary_eur" }, 45934] },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Minimum gross salary", labelRu: "Минимальная брутто-зарплата", value: "€45,934/year (2026 — shortage occupations / new graduates threshold)" },
          { type: "documents", labelEn: "University degree", labelRu: "Диплом вуза", value: "Recognised degree or comparable qualification" },
          { type: "documents", labelEn: "Employment contract", labelRu: "Трудовой договор", value: "Binding job offer with German employer" },
        ],
        costs: [
          { labelEn: "Visa fee", labelRu: "Визовый сбор", amount: "€75" },
          { labelEn: "Residence permit (local)", labelRu: "ВНЖ (местная подача)", amount: "€100 (indicative)" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Degree recognition & contract", titleRu: "Признание диплома и контракт", duration: "2–8 weeks" },
          { step: "application", titleEn: "Consulate / Ausländerbehörde", titleRu: "Консульство / Ausländerbehörde", duration: "2–4 months (visa)" },
          { step: "residence", titleEn: "Blue Card issuance", titleRu: "Выдача Blue Card", duration: "4–12 mo. ABH queue + 6–16 wk card" },
        ],
        sources: [
          {
            url: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card",
            excerpt: "EU Blue Card 2026 — minimum gross salary €45,934 for shortage occupations and new graduates.",
            labelEn: "Make it in Germany — Blue Card",
            labelRu: "Make it in Germany — Blue Card",
          },
        ],
      },
      {
        slug: "germany-chancenkarte",
        type: "LABOR",
        titleEn: "Germany Chancenkarte (Opportunity Card)",
        titleRu: "Германия — Chancenkarte",
        summaryEn: "Job-seeker residence based on points (degree, experience, language) with proof of funds.",
        summaryRu: "ВНЖ для поиска работы по системе баллов с подтверждением средств.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            { ">=": [{ var: "savings_eur" }, 13092] },
            { "==": [{ var: "has_university_degree" }, "yes"] },
          ],
        },
        requirements: [
          { type: "savings", labelEn: "Proof of funds", labelRu: "Подтверждение средств", value: "€13,092 (12 months at standard rate, 2026)" },
          { type: "documents", labelEn: "Points eligibility", labelRu: "Балльная система", value: "Degree + language/experience to reach 6 points (verify current BMAS table)" },
          { type: "documents", labelEn: "No employment yet", labelRu: "Без работы на старте", value: "Job search permitted; employment converts to work permit" },
        ],
        costs: [
          { labelEn: "Visa fee", labelRu: "Визовый сбор", amount: "€75" },
          { labelEn: "Blocked account alternative", labelRu: "Альтернатива — blocked account", amount: "€13,092 deposit" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Points calculation & funds", titleRu: "Расчёт баллов и средств", duration: "2–4 weeks" },
          { step: "application", titleEn: "Consulate application", titleRu: "Подача в консульство", duration: "2–4 months" },
          { step: "residence", titleEn: "Chancenkarte (up to 12 months)", titleRu: "Chancenkarte (до 12 мес.)", duration: "4–12 mo. ABH queue + card" },
        ],
        sources: [
          {
            url: "https://www.make-it-in-germany.com/en/visa-residence/chancenkarte",
            excerpt: "Opportunity Card — proof of funds €13,092 for 12 months; points-based eligibility.",
            labelEn: "Make it in Germany — Chancenkarte",
            labelRu: "Make it in Germany — Chancenkarte",
          },
        ],
      },
      {
        slug: "germany-family-reunification",
        type: "BOND",
        titleEn: "Germany Family Reunification",
        titleRu: "Германия — воссоединение семьи",
        summaryEn: "Join a spouse or family member legally residing in Germany.",
        summaryRu: "Присоединение к супругу или члену семьи с легальным статусом в Германии.",
        rule: { and: [{ "==": [{ var: "passport_iso2" }, "RU"] }, { "==": [{ var: "has_family_in_de" }, "yes"] }] },
        requirements: [
          { type: "family", labelEn: "Sponsor in Germany", labelRu: "Спонсор в Германии", value: "Spouse, minor child, or qualifying relative" },
          { type: "documents", labelEn: "Basic German (spouses)", labelRu: "Базовый немецкий (супруги)", value: "A1 certificate often required for spouse reunification" },
        ],
        costs: [{ labelEn: "Visa & permit fees", labelRu: "Виза и ВНЖ", amount: "€75 + €100" }],
        timeline: [
          { step: "document_prep", titleEn: "Relationship & language proof", titleRu: "Родство и язык", duration: "2–8 weeks" },
          { step: "application", titleEn: "Consulate / embassy", titleRu: "Консульство", duration: "4–8 months" },
          { step: "residence", titleEn: "Family residence permit", titleRu: "Семейный ВНЖ", duration: "4–12 mo. ABH queue + card" },
        ],
        sources: [
          {
            url: "https://www.make-it-in-germany.com/en/visa-residence/family-reunion",
            excerpt: "Family reunification for spouses and family members of legal residents.",
            labelEn: "Make it in Germany — family reunion",
            labelRu: "Make it in Germany — family reunion",
          },
        ],
      },
    ],
    digest: [
      {
        category: "citizenship",
        titleEn: "Naturalization (B1 + 5 years)",
        titleRu: "Натурализация (B1 + 5 лет)",
        bodyEn: "Standard naturalization: 5 years legal residence, B1 German, livelihood, clean record. Reforms may shorten to 3–5 years — verify current StAG.",
        bodyRu: "Стандарт: 5 лет легального проживания, B1, средства к существованию. Реформы могут сократить срок — проверяйте StAG.",
        sourceUrl: "https://www.bmi.bund.de/",
      },
      {
        category: "exam",
        titleEn: "Goethe B1 / telc B1",
        titleRu: "Goethe B1 / telc B1",
        bodyEn: "B1 certificate from Goethe-Institut, telc, or ÖSD is standard for naturalization and some permits.",
        bodyRu: "Сертификат B1 (Goethe, telc, ÖSD) — стандарт для натурализации и части ВНЖ.",
        sourceUrl: "https://www.goethe.de/",
      },
      {
        category: "timeline",
        titleEn: "Blue Card → permanent residence",
        titleRu: "Blue Card → ПМЖ",
        bodyEn: "Blue Card holders may qualify for Niederlassungserlaubnis after 21–27 months (B1 — 21, A1 — 27; §18c AufenthG, from 01.03.2024) with pension contributions.",
        bodyRu: "Держатели Blue Card могут получить Niederlassungserlaubnis через 21–27 мес. (B1 — 21, A1 — 27; §18c AufenthG, с 01.03.2024) при взносах в RV.",
      },
      {
        category: "practical",
        titleEn: "Anmeldung & health insurance",
        titleRu: "Anmeldung и страховка",
        bodyEn: "Register address (Anmeldung) within 2 weeks. Statutory or private health insurance is mandatory.",
        bodyRu: "Регистрация адреса (Anmeldung) в течение 2 недель. Обязательна государственная или частная страховка.",
      },
      {
        category: "practical",
        titleEn: "Ausländerbehörde wait times",
        titleRu: "Очереди Ausländerbehörde",
        bodyEn: "Local immigration offices have long queues in major cities — book appointments early.",
        bodyRu: "В крупных городах длинные очереди в Ausländerbehörde — записывайтесь заранее.",
        sourceUrl: "https://www.make-it-in-germany.com/",
      },
    ],
  },
  {
    id: "a0000000-0000-4000-8000-000000000006",
    slug: "ru-speaking-to-netherlands",
    topicKey: "netherlands",
    urlSegment: "netherlands",
    destinations: ["NL"],
    titleEn: "Russian-speaking → Netherlands",
    titleRu: "Русскоязычные → Нидерланды",
    audienceEn: "Relocation navigator for Russian-speaking applicants targeting Netherlands residency routes.",
    audienceRu: "Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в Нидерланды.",
    focusHintRu: "Highly skilled migrant, startup facilitator, воссоединение, IND",
    programIds: ["b0000000-0000-4000-8000-000000000016", "b0000000-0000-4000-8000-000000000017", "b0000000-0000-4000-8000-000000000018"],
    versionIds: ["c0000000-0000-4000-8000-000000000019", "c0000000-0000-4000-8000-000000000020", "c0000000-0000-4000-8000-000000000021"],
    wizardId: "d0000000-0000-4000-8000-000000000006",
    moduleIds: ["e0000000-0000-4000-8000-000000000021", "e0000000-0000-4000-8000-000000000022", "e0000000-0000-4000-8000-000000000023", "e0000000-0000-4000-8000-000000000024"],
    familyQuestionKey: "has_family_in_nl",
    wizardIntroRu: "Сопоставим профиль с highly skilled migrant, startup facilitator и воссоединением семьи.",
    programs: [
      {
        slug: "netherlands-hsm",
        type: "LABOR",
        titleEn: "Netherlands Highly Skilled Migrant",
        titleRu: "Нидерланды — highly skilled migrant",
        summaryEn: "Work residence for employees of IND-registered sponsors meeting salary thresholds.",
        summaryRu: "Рабочий ВНЖ для сотрудников IND-спонсоров с порогом зарплаты.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            { "==": [{ var: "has_job_offer" }, "yes"] },
            { ">=": [{ var: "monthly_income_eur" }, 4357] },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Minimum gross monthly salary", labelRu: "Минимальная брутто-зарплата", value: "€4,357/month gross (under 30, 2026 IND table — wizard default)" },
          { type: "documents", labelEn: "Recognised sponsor", labelRu: "Recognised sponsor", value: "Employer must be IND-registered sponsor" },
          { type: "insurance", labelEn: "Health insurance", labelRu: "Медстраховка", value: "Dutch basic health insurance after arrival" },
        ],
        costs: [
          { labelEn: "MVV / residence fee (IND)", labelRu: "Сбор IND", amount: "€350 (indicative)" },
          { labelEn: "Partner / children surcharge", labelRu: "Доплата за семью", amount: "Higher salary thresholds apply" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Employer sponsorship dossier", titleRu: "Досье спонсорства работодателя", duration: "2–4 weeks" },
          { step: "application", titleEn: "IND application via sponsor", titleRu: "Подача через спонсора в IND", duration: "5–14 weeks" },
          { step: "residence", titleEn: "Collect residence permit", titleRu: "Получение ВНЖ", duration: "2–4 weeks" },
        ],
        sources: [
          {
            url: "https://ind.nl/en/highly-skilled-migrant",
            excerpt: "Highly skilled migrant — minimum gross monthly salary €4,357 (under 30, 2026 IND salary criteria).",
            labelEn: "IND — highly skilled migrant",
            labelRu: "IND — highly skilled migrant",
          },
        ],
      },
      {
        slug: "netherlands-startup-facilitator",
        type: "LABOR",
        titleEn: "Netherlands Startup Facilitator",
        titleRu: "Нидерланды — startup facilitator",
        summaryEn: "Residence for innovative startups with an approved facilitator; case-by-case assessment.",
        summaryRu: "ВНЖ для инновационных стартапов с одобренным facilitator; оценка индивидуально.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            { "==": [{ var: "has_university_degree" }, "yes"] },
          ],
        },
        requirements: [
          { type: "documents", labelEn: "Approved facilitator", labelRu: "Одобренный facilitator", value: "Contract with IND-listed startup facilitator mandatory" },
          { type: "documents", labelEn: "Innovative product/service", labelRu: "Инновационный продукт", value: "Business plan reviewed by facilitator" },
          { type: "insurance", labelEn: "Health insurance", labelRu: "Медстраховка", value: "Coverage in Netherlands" },
        ],
        costs: [
          { labelEn: "IND application fee", labelRu: "Сбор IND", amount: "€350" },
          { labelEn: "Facilitator fees", labelRu: "Услуги facilitator", amount: "€1,000–5,000+ (varies)" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Facilitator match & business plan", titleRu: "Facilitator и бизнес-план", duration: "4–12 weeks" },
          { step: "application", titleEn: "IND startup application", titleRu: "Подача startup в IND", duration: "2–3 months" },
          { step: "residence", titleEn: "Startup residence (1 year)", titleRu: "Startup ВНЖ (1 год)", duration: "2–4 weeks" },
        ],
        sources: [
          {
            url: "https://ind.nl/en/start-up",
            excerpt: "Residence permit for start-up — requires facilitator recognised by IND; individual assessment.",
            labelEn: "IND — start-up",
            labelRu: "IND — start-up",
          },
        ],
        passportStatusOverride: "partial" as const,
      },
      {
        slug: "netherlands-family-reunification",
        type: "BOND",
        titleEn: "Netherlands Family Reunification",
        titleRu: "Нидерланды — воссоединение семьи",
        summaryEn: "Join a family member legally residing in the Netherlands.",
        summaryRu: "Присоединение к члену семьи с легальным статусом в Нидерландах.",
        rule: { and: [{ "==": [{ var: "passport_iso2" }, "RU"] }, { "==": [{ var: "has_family_in_nl" }, "yes"] }] },
        requirements: [
          { type: "family", labelEn: "Sponsor in NL", labelRu: "Спонсор в NL", value: "Partner, parent, or child with legal stay" },
          { type: "income", labelEn: "Sponsor income", labelRu: "Доход спонсора", value: "Meets IND minimum for family formation" },
        ],
        costs: [{ labelEn: "IND family fee", labelRu: "Сбор IND", amount: "€350 (indicative)" }],
        timeline: [
          { step: "document_prep", titleEn: "Relationship proof", titleRu: "Подтверждение родства", duration: "2–6 weeks" },
          { step: "application", titleEn: "IND family application", titleRu: "Семейная подача IND", duration: "2–4 months" },
          { step: "residence", titleEn: "Family permit", titleRu: "Семейный ВНЖ", duration: "2–4 weeks" },
        ],
        sources: [
          {
            url: "https://ind.nl/en/family",
            excerpt: "Family member residence — join partner or family member legally in the Netherlands.",
            labelEn: "IND — family",
            labelRu: "IND — family",
          },
        ],
      },
    ],
    digest: [
      {
        category: "citizenship",
        titleEn: "Naturalization (5 years + inburgering)",
        titleRu: "Натурализация (5 лет + inburgering)",
        bodyEn: "Naturalization after 5 years legal residence, civic integration (inburgering), and sufficient income.",
        bodyRu: "Натурализация после 5 лет легального проживания, inburgering и достаточного дохода.",
        sourceUrl: "https://ind.nl/en/dutch-citizenship",
      },
      {
        category: "exam",
        titleEn: "Inburgering A2/B1",
        titleRu: "Inburgering A2/B1",
        bodyEn: "Civic integration exam includes language (A2 rising to B1) and knowledge of Dutch society (KNM).",
        bodyRu: "Экзамен inburgering включает язык (A2→B1) и знание общества (KNM).",
        sourceUrl: "https://www.inburgeren.nl/",
      },
      {
        category: "timeline",
        titleEn: "HSM → permanent residence",
        titleRu: "HSM → ПМЖ",
        bodyEn: "Highly skilled migrants may apply for permanent residence after 5 years of legal stay.",
        bodyRu: "Highly skilled migrant может подать на ПМЖ после 5 лет легального проживания.",
      },
      {
        category: "practical",
        titleEn: "BSN registration",
        titleRu: "Регистрация BSN",
        bodyEn: "Register at municipality for BSN (citizen service number) — required for work, tax, and healthcare.",
        bodyRu: "Регистрация в gemeente для BSN — нужна для работы, налогов и healthcare.",
      },
      {
        category: "practical",
        titleEn: "30% ruling (tax)",
        titleRu: "30% ruling (налог)",
        bodyEn: "Eligible HSMs may qualify for 30% tax-free allowance — verify current Belastingdienst rules.",
        bodyRu: "Часть HSM может получить 30% ruling — проверяйте правила Belastingdienst.",
        sourceUrl: "https://www.belastingdienst.nl/",
      },
    ],
  },
  {
    id: "a0000000-0000-4000-8000-000000000007",
    slug: "ru-speaking-to-scandinavia",
    topicKey: "scandinavia",
    urlSegment: "scandinavia",
    destinations: ["SE", "NO", "DK", "FI"],
    titleEn: "Russian-speaking → Scandinavia & Nordic",
    titleRu: "Русскоязычные → Скандинавия и Север",
    audienceEn: "Relocation navigator for Russian-speaking applicants targeting Nordic residency routes.",
    audienceRu: "Навигатор релокации для русскоязычных заявителей с фокусом на маршруты ВНЖ в странах Nordics.",
    focusHintRu: "Sweden work permit, Denmark pay limit, Nordic family reunification",
    programIds: ["b0000000-0000-4000-8000-000000000019", "b0000000-0000-4000-8000-000000000020", "b0000000-0000-4000-8000-000000000021"],
    versionIds: ["c0000000-0000-4000-8000-000000000022", "c0000000-0000-4000-8000-000000000023", "c0000000-0000-4000-8000-000000000024"],
    wizardId: "d0000000-0000-4000-8000-000000000007",
    moduleIds: ["e0000000-0000-4000-8000-000000000025", "e0000000-0000-4000-8000-000000000026", "e0000000-0000-4000-8000-000000000027", "e0000000-0000-4000-8000-000000000028"],
    familyQuestionKey: "has_family_in_se",
    wizardIntroRu: "Сопоставим профиль со шведским work permit, датским pay limit и nordic family reunification.",
    programs: [
      {
        slug: "sweden-work-permit",
        type: "LABOR",
        destinationIso2: "SE",
        titleEn: "Sweden Work Permit",
        titleRu: "Швеция — work permit",
        summaryEn: "Work and residence permit with Swedish employer meeting minimum salary.",
        summaryRu: "Рабочий и вид на жительство с шведским работодателем и минимальной зарплатой.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            { "==": [{ var: "has_job_offer" }, "yes"] },
            { ">=": [{ var: "monthly_income_eur" }, 3050] },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Minimum monthly salary", labelRu: "Минимальная месячная зарплата", value: "SEK 34,470/month (~€3,050, 2026 Migrationsverket minimum)" },
          { type: "documents", labelEn: "Employment terms", labelRu: "Условия трудоустройства", value: "Insurance, pension, and collective agreement compliance" },
          { type: "insurance", labelEn: "Health coverage", labelRu: "Медпокрытие", value: "Swedish employment-based coverage" },
        ],
        costs: [
          { labelEn: "Application fee", labelRu: "Сбор за подачу", amount: "SEK 2,200 (~€200)" },
          { labelEn: "Family co-applicants", labelRu: "Семья-со заявители", amount: "Additional fees per person" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Employer offer & union terms", titleRu: "Оффер и union terms", duration: "2–6 weeks" },
          { step: "application", titleEn: "Migrationsverket online", titleRu: "Подача в Migrationsverket", duration: "4–10 months" },
          { step: "residence", titleEn: "Work permit & residence", titleRu: "Work permit и ВНЖ", duration: "2–4 weeks after approval" },
        ],
        sources: [
          {
            url: "https://www.migrationsverket.se/English/Private-individuals/Working-in-Sweden/Employed/How-to-apply.html",
            excerpt: "Work permit — salary must be at least SEK 34,470 per month (2026 minimum).",
            labelEn: "Migrationsverket — work permit",
            labelRu: "Migrationsverket — work permit",
          },
        ],
      },
      {
        slug: "denmark-work-permit",
        type: "LABOR",
        destinationIso2: "DK",
        titleEn: "Denmark Pay Limit Scheme",
        titleRu: "Дания — pay limit scheme",
        summaryEn: "Work residence for employees with salary above the Danish pay limit.",
        summaryRu: "Рабочий ВНЖ при зарплате выше датского pay limit.",
        rule: {
          and: [
            { "==": [{ var: "passport_iso2" }, "RU"] },
            { "==": [{ var: "has_job_offer" }, "yes"] },
            { ">=": [{ var: "annual_salary_eur" }, 74000] },
          ],
        },
        requirements: [
          { type: "income", labelEn: "Pay limit salary", labelRu: "Зарплата pay limit", value: "DKK 552,000/year (~€74,000 gross, 2026 pay limit)" },
          { type: "documents", labelEn: "Danish job offer", labelRu: "Оффер в Дании", value: "Contract meeting SIRI / pay limit criteria" },
          { type: "insurance", labelEn: "Health insurance", labelRu: "Медстраховка", value: "Danish labour market coverage" },
        ],
        costs: [
          { labelEn: "SIRI application fee", labelRu: "Сбор SIRI", amount: "DKK 4,405 (~€590)" },
          { labelEn: "Biometrics", labelRu: "Биометрия", amount: "Included in fee (indicative)" },
        ],
        timeline: [
          { step: "document_prep", titleEn: "Employer case & contract", titleRu: "Кейс работодателя и контракт", duration: "2–4 weeks" },
          { step: "application", titleEn: "SIRI online application", titleRu: "Подача в SIRI", duration: "3–7 months" },
          { step: "residence", titleEn: "Residence permit", titleRu: "ВНЖ", duration: "2–4 weeks" },
        ],
        sources: [
          {
            url: "https://nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme",
            excerpt: "Pay Limit Scheme — minimum annual salary DKK 552,000 (2026).",
            labelEn: "SIRI — pay limit scheme",
            labelRu: "SIRI — pay limit scheme",
          },
        ],
      },
      {
        slug: "nordic-family-reunification",
        type: "BOND",
        titleEn: "Nordic Family Reunification",
        titleRu: "Nordic — воссоединение семьи",
        summaryEn: "Join a family member legally residing in a Nordic country (SE/NO/DK/FI).",
        summaryRu: "Присоединение к члену семьи с легальным статусом в стране Nordics (SE/NO/DK/FI).",
        rule: { and: [{ "==": [{ var: "passport_iso2" }, "RU"] }, { "==": [{ var: "has_family_in_se" }, "yes"] }] },
        requirements: [
          { type: "family", labelEn: "Sponsor in Nordics", labelRu: "Спонсор в Nordics", value: "Spouse, partner, or qualifying family member" },
          { type: "income", labelEn: "Maintenance requirement", labelRu: "Требование содержания", value: "Country-specific housing and income rules (verify per destination)" },
        ],
        costs: [{ labelEn: "Application fees", labelRu: "Сборы за подачу", amount: "SEK/DKK/NOK/EUR varies by country" }],
        timeline: [
          { step: "document_prep", titleEn: "Relationship & housing proof", titleRu: "Родство и жильё", duration: "2–8 weeks" },
          { step: "application", titleEn: "National authority application", titleRu: "Подача в национальный орган", duration: "4–12 months" },
          { step: "residence", titleEn: "Family residence permit", titleRu: "Семейный ВНЖ", duration: "2–8 weeks" },
        ],
        sources: [
          {
            url: "https://www.migrationsverket.se/English/Private-individuals/Moving-to-a-close-relative-in-Sweden.html",
            excerpt: "Moving to a close relative in Sweden — family reunification rules.",
            labelEn: "Migrationsverket — family",
            labelRu: "Migrationsverket — family",
          },
          {
            url: "https://nyidanmark.dk/en-GB/You-want-to-apply/Family",
            excerpt: "Family reunification in Denmark — spouse and family schemes.",
            labelEn: "SIRI — family",
            labelRu: "SIRI — family",
          },
        ],
      },
    ],
    digest: [
      {
        category: "citizenship",
        titleEn: "Nordic citizenship timelines",
        titleRu: "Сроки гражданства в Nordics",
        bodyEn: "Sweden: ~5 years habitual residence. Denmark: 9 years (with exceptions). Norway: 7 years. Finland: 5 years. Language tests apply.",
        bodyRu: "Швеция: ~5 лет. Дания: 9 лет. Норвегия: 7 лет. Финляндия: 5 лет. Нужны языковые экзамены.",
        sourceUrl: "https://www.migrationsverket.se/",
      },
      {
        category: "exam",
        titleEn: "Swedish / Danish language",
        titleRu: "Шведский / датский язык",
        bodyEn: "Citizenship requires language proof: Swedish (SFI → higher) or Danish (Prøve i Dansk 3 / PD3).",
        bodyRu: "Для гражданства нужен язык: шведский (SFI и выше) или датский (PD3).",
      },
      {
        category: "timeline",
        titleEn: "Work permit → permanent residence",
        titleRu: "Work permit → ПМЖ",
        bodyEn: "Sweden: permanent after 4 years work permit. Denmark: dependent on scheme. Processing backlogs vary.",
        bodyRu: "Швеция: ПМЖ после 4 лет work permit. Дания — зависит от схемы. Очереди различаются.",
      },
      {
        category: "practical",
        titleEn: "Personnummer / CPR",
        titleRu: "Personnummer / CPR",
        bodyEn: "Sweden personnummer and Denmark CPR number are essential for banking, tax, and healthcare.",
        bodyRu: "Personnummer (SE) и CPR (DK) нужны для банка, налогов и healthcare.",
      },
      {
        category: "practical",
        titleEn: "Collective agreements (Sweden)",
        titleRu: "Коллективные договоры (Швеция)",
        bodyEn: "Swedish work permits require terms at least as good as collective agreement or industry practice.",
        bodyRu: "Шведский work permit требует условий не хуже коллективного договора или отраслевой практики.",
        sourceUrl: "https://www.migrationsverket.se/",
      },
    ],
  },
];
