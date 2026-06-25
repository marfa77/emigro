/** Student visa (STUDY) programs — seeded via 20260625260000_student_visa_programs.sql */

import type { ProgramSeed } from "./europe-corridors";

export type StudyProgramLink = {
  corridorId: string;
  corridorSlug: string;
  wizardId: string;
  studyModuleId: string;
  programId: string;
  versionId: string;
  sortOrder: number;
  program: ProgramSeed;
};

const YES_NO =
  '[{"value":"yes","label_en":"Yes","label_ru":"Да"},{"value":"no","label_en":"No","label_ru":"Нет"}]';

const STUDY_LEVEL_OPTIONS =
  '[{"value":"bachelor","label_en":"Bachelor / undergraduate","label_ru":"Бакалавриат"},{"value":"master","label_en":"Master / graduate","label_ru":"Магистратура"},{"value":"language","label_en":"Language school / preparatory","label_ru":"Языковая / подготовительная школа"},{"value":"other","label_en":"Other / undecided","label_ru":"Другое / пока не решил(а)"}]';

/** Shared corridor wizard study-axis questions (also mirrored in hub-definition.ts). */
export const STUDY_WIZARD_QUESTIONS = [
  {
    key: "wants_study_route",
    type: "single",
    labelEn: "Planning to relocate via study (university / language school)?",
    labelRu: "Планируете релокацию через учёбу (вуз / языковая школа)?",
    helpEn: "Student visa / residence for enrollment — not remote work or passive income routes",
    helpRu: "Студенческая виза / ВНЖ для зачисления — не удалёнка и не пассивный доход",
    options: YES_NO,
  },
  {
    key: "has_university_admission",
    type: "single",
    labelEn: "Do you have admission / enrollment confirmation?",
    labelRu: "Есть подтверждение зачисления (admission / matrícula)?",
    helpEn: "Letter from university, Campus France approval, Zulassung, etc.",
    helpRu: "Письмо от вуза, одобрение Campus France, Zulassung и т.п.",
    options: YES_NO,
  },
  {
    key: "study_budget_eur",
    type: "number",
    labelEn: "Available study funds (EUR)",
    labelRu: "Доступные средства на учёбу (EUR)",
    helpEn: "Blocked account, savings, or sponsor funds for tuition + living costs",
    helpRu: "Blocked account, сбережения или спонсор — на обучение и проживание",
  },
  {
    key: "can_show_study_funds",
    type: "single",
    labelEn: "Can document source of study funds (bank / sponsor)?",
    labelRu: "Можете подтвердить источник средств (банк / спонсор)?",
    options: YES_NO,
  },
  {
    key: "study_level",
    type: "single",
    labelEn: "Study level (optional)",
    labelRu: "Уровень обучения (необязательно)",
    options: STUDY_LEVEL_OPTIONS,
  },
] as const;

export const STUDY_PROGRAMS: StudyProgramLink[] = [
  {
    corridorId: "a0000000-0000-4000-8000-000000000001",
    corridorSlug: "ru-speaking-to-portugal",
    wizardId: "d0000000-0000-4000-8000-000000000001",
    studyModuleId: "e0000000-0000-4000-8000-000000000029",
    programId: "b0000000-0000-4000-8000-000000000025",
    versionId: "c0000000-0000-4000-8000-000000000028",
    sortOrder: 5,
    program: {
      slug: "portugal-student-visa-d4",
      type: "STUDY",
      destinationIso2: "PT",
      titleEn: "Portugal D4 Student Visa",
      titleRu: "Португалия — студенческая виза D4",
      summaryEn: "National D4 visa for enrollment at a Portuguese school or university; proof of means and accommodation.",
      summaryRu: "Национальная виза D4 при зачислении в португальский вуз или школу; подтверждение средств и жилья.",
      rule: {
        and: [
          { "==": [{ var: "passport_iso2" }, "RU"] },
          { "==": [{ var: "wants_study_route" }, "yes"] },
          { "==": [{ var: "has_university_admission" }, "yes"] },
          {
            or: [
              { ">=": [{ var: "study_budget_eur" }, 9840] },
              { "==": [{ var: "can_show_study_funds" }, "yes"] },
            ],
          },
        ],
      },
      requirements: [
        {
          type: "documents",
          labelEn: "Enrollment",
          labelRu: "Зачисление",
          value: "Подтверждение зачисления в аккредитованный вуз / школу PT",
        },
        {
          type: "savings",
          labelEn: "Means of subsistence",
          labelRu: "Средства к существованию",
          value: "≈€820/мес. (100% мин. зарплаты 2026) — сбережения или спонсор",
        },
        {
          type: "insurance",
          labelEn: "Health insurance",
          labelRu: "Медстраховка",
          value: "Покрытие в Португалии на срок обучения",
        },
        {
          type: "documents",
          labelEn: "Accommodation",
          labelRu: "Жильё",
          value: "Договор аренды или подтверждение общежития",
        },
      ],
      costs: [
        { labelEn: "Consular fee", labelRu: "Консульский сбор", amount: "€90–120" },
        { labelEn: "Tuition (varies)", labelRu: "Обучение (зависит от вуза)", amount: "€700–7 000/год (гос. вузы дешевле)" },
      ],
      timeline: [
        {
          step: "document_prep",
          titleEn: "Admission & financial dossier",
          titleRu: "Зачисление и финансовое досье",
          duration: "1–3 месяца",
        },
        {
          step: "application",
          titleEn: "D4 visa at consulate / VFS",
          titleRu: "Виза D4 в консульстве / VFS",
          duration: "1–3 месяца",
        },
        {
          step: "residence",
          titleEn: "AIMA residence permit",
          titleRu: "ВНЖ в AIMA",
          duration: "2–6 месяцев после въезда",
        },
      ],
      sources: [
        {
          url: "https://vistos.mne.gov.pt/en/national-visas/general-information/study-visa",
          excerpt: "D4 study visa — enrollment at educational institution and proof of means required.",
          labelEn: "MNE — study visa (D4)",
          labelRu: "MNE — виза D4 (учёба)",
        },
        {
          url: "https://aima.gov.pt/",
          excerpt: "After entry, residence permit for study is processed through AIMA.",
          labelEn: "AIMA",
          labelRu: "AIMA",
        },
      ],
    },
  },
  {
    corridorId: "a0000000-0000-4000-8000-000000000002",
    corridorSlug: "ru-speaking-to-spain",
    wizardId: "d0000000-0000-4000-8000-000000000002",
    studyModuleId: "e0000000-0000-4000-8000-000000000030",
    programId: "b0000000-0000-4000-8000-000000000026",
    versionId: "c0000000-0000-4000-8000-000000000029",
    sortOrder: 5,
    program: {
      slug: "spain-student-visa",
      type: "STUDY",
      destinationIso2: "ES",
      titleEn: "Spain Student Visa (estudios)",
      titleRu: "Испания — студенческая виза (estudios)",
      summaryEn: "Long-stay visa for studies at a recognized center; funds, insurance, and enrollment required.",
      summaryRu: "Долгосрочная виза для учёбы в аккредитованном центре; нужны средства, страховка и зачисление.",
      rule: {
        and: [
          { "==": [{ var: "passport_iso2" }, "RU"] },
          { "==": [{ var: "wants_study_route" }, "yes"] },
          { "==": [{ var: "has_university_admission" }, "yes"] },
          {
            or: [
              { ">=": [{ var: "study_budget_eur" }, 7200] },
              { "==": [{ var: "can_show_study_funds" }, "yes"] },
            ],
          },
        ],
      },
      requirements: [
        {
          type: "documents",
          labelEn: "Enrollment",
          labelRu: "Зачисление",
          value: "Matrícula / admission в аккредитованный учебный центр",
        },
        {
          type: "savings",
          labelEn: "Financial means",
          labelRu: "Финансовые средства",
          value: "≈€600/мес. (100% IPREM) или эквивалент в сбережениях",
        },
        {
          type: "insurance",
          labelEn: "Health insurance",
          labelRu: "Медстраховка",
          value: "Полное покрытие в Испании без доплат (copay)",
        },
      ],
      costs: [
        { labelEn: "Consular fee", labelRu: "Консульский сбор", amount: "€80–160" },
        { labelEn: "Tuition (public university)", labelRu: "Обучение (гос. вуз)", amount: "€750–2 500/год" },
      ],
      timeline: [
        {
          step: "document_prep",
          titleEn: "Admission & insurance",
          titleRu: "Зачисление и страховка",
          duration: "2–6 недель",
        },
        {
          step: "application",
          titleEn: "Consulate student visa",
          titleRu: "Студенческая виза в консульстве",
          duration: "1–3 месяца",
        },
        {
          step: "residence",
          titleEn: "TIE (estudiante)",
          titleRu: "TIE (estudiante)",
          duration: "2–6 месяцев",
        },
      ],
      sources: [
        {
          url: "https://www.inclusion.gob.es/web/migraciones/w/autorizacion-de-estancia-por-estudios",
          excerpt: "Autorización de estancia por estudios — enrollment and sufficient means.",
          labelEn: "Spanish immigration — estudios",
          labelRu: "Миграционная служба — estudios",
        },
      ],
    },
  },
  {
    corridorId: "a0000000-0000-4000-8000-000000000005",
    corridorSlug: "ru-speaking-to-germany",
    wizardId: "d0000000-0000-4000-8000-000000000005",
    studyModuleId: "e0000000-0000-4000-8000-000000000033",
    programId: "b0000000-0000-4000-8000-000000000027",
    versionId: "c0000000-0000-4000-8000-000000000030",
    sortOrder: 5,
    program: {
      slug: "germany-student-visa",
      type: "STUDY",
      destinationIso2: "DE",
      titleEn: "Germany Student Visa",
      titleRu: "Германия — студенческая виза",
      summaryEn: "National visa for university studies with admission (Zulassung) and blocked account or scholarship proof.",
      summaryRu: "Национальная виза для учёбы в вузе с Zulassung и blocked account или стипендией.",
      rule: {
        and: [
          { "==": [{ var: "passport_iso2" }, "RU"] },
          { "==": [{ var: "wants_study_route" }, "yes"] },
          { "==": [{ var: "has_university_admission" }, "yes"] },
          {
            or: [
              { ">=": [{ var: "study_budget_eur" }, 11904] },
              { "==": [{ var: "can_show_study_funds" }, "yes"] },
            ],
          },
        ],
      },
      requirements: [
        {
          type: "documents",
          labelEn: "University admission",
          labelRu: "Зачисление в вуз",
          value: "Zulassungsbescheid или условное (vorläufig) для Studienkolleg",
        },
        {
          type: "savings",
          labelEn: "Blocked account (Sperrkonto)",
          labelRu: "Blocked account (Sperrkonto)",
          value: "≈€992/мес. × 12 = €11 904 (2025/26 ориентир)",
        },
        {
          type: "insurance",
          labelEn: "Health insurance",
          labelRu: "Медстраховка",
          value: "Студенческая (GKV/PKV) или travel insurance до enrollment",
        },
      ],
      costs: [
        { labelEn: "Blocked account setup", labelRu: "Открытие Sperrkonto", amount: "€50–150 + €11 904 депозит" },
        { labelEn: "Consular fee", labelRu: "Консульский сбор", amount: "€75" },
        { labelEn: "Semester contribution", labelRu: "Semesterbeitrag", amount: "€150–400/семестр (гос. вузы)" },
      ],
      timeline: [
        {
          step: "document_prep",
          titleEn: "Zulassung & Sperrkonto",
          titleRu: "Zulassung и Sperrkonto",
          duration: "2–4 месяца",
        },
        {
          step: "application",
          titleEn: "National visa appointment",
          titleRu: "Национальная виза в консульстве",
          duration: "4–12 недель",
        },
        {
          step: "residence",
          titleEn: "Residence permit (Aufenthaltstitel)",
          titleRu: "Aufenthaltstitel в Ausländerbehörde",
          duration: "4–8 недель после регистрации",
        },
      ],
      sources: [
        {
          url: "https://www.make-it-in-germany.com/en/visa-residence/types/studying",
          excerpt: "Student visa requires proof of admission and sufficient financial means (blocked account).",
          labelEn: "Make it in Germany — studying",
          labelRu: "Make it in Germany — учёба",
        },
        {
          url: "https://www.germany-visa.org/student-visa/blocked-account/",
          excerpt: "Blocked account amount updated annually based on BAföG rates.",
          labelEn: "Blocked account threshold",
          labelRu: "Порог blocked account",
        },
      ],
    },
  },
  {
    corridorId: "a0000000-0000-4000-8000-000000000003",
    corridorSlug: "ru-speaking-to-france",
    wizardId: "d0000000-0000-4000-8000-000000000003",
    studyModuleId: "e0000000-0000-4000-8000-000000000031",
    programId: "b0000000-0000-4000-8000-000000000028",
    versionId: "c0000000-0000-4000-8000-000000000031",
    sortOrder: 5,
    program: {
      slug: "france-student-visa",
      type: "STUDY",
      destinationIso2: "FR",
      titleEn: "France VLS-TS étudiant",
      titleRu: "Франция — VLS-TS étudiant",
      summaryEn: "Long-stay student visa after Campus France procedure; proof of enrollment and means.",
      summaryRu: "Долгосрочная студенческая виза после процедуры Campus France; зачисление и средства.",
      rule: {
        and: [
          { "==": [{ var: "passport_iso2" }, "RU"] },
          { "==": [{ var: "wants_study_route" }, "yes"] },
          { "==": [{ var: "has_university_admission" }, "yes"] },
          {
            or: [
              { ">=": [{ var: "study_budget_eur" }, 7380] },
              { "==": [{ var: "can_show_study_funds" }, "yes"] },
            ],
          },
        ],
      },
      requirements: [
        {
          type: "documents",
          labelEn: "Campus France",
          labelRu: "Campus France",
          value: "Прохождение процедуры Etudes en France / Campus France",
        },
        {
          type: "documents",
          labelEn: "Enrollment",
          labelRu: "Зачисление",
          value: "Attestation d'inscription или certificate de scolarité",
        },
        {
          type: "savings",
          labelEn: "Financial means",
          labelRu: "Финансовые средства",
          value: "≈€615/мес. минимум (2026 ориентир для VLS-TS étudiant)",
        },
      ],
      costs: [
        { labelEn: "Campus France fee", labelRu: "Сбор Campus France", amount: "€190–250" },
        { labelEn: "Visa fee", labelRu: "Визовый сбор", amount: "€99" },
        { labelEn: "Public university tuition", labelRu: "Обучение (гос. вуз)", amount: "€170–601/год (2026)" },
      ],
      timeline: [
        {
          step: "document_prep",
          titleEn: "Campus France dossier",
          titleRu: "Досье Campus France",
          duration: "2–4 месяца",
        },
        {
          step: "application",
          titleEn: "VLS-TS étudiant at consulate",
          titleRu: "VLS-TS étudiant в консульстве",
          duration: "2–6 недель",
        },
        {
          step: "residence",
          titleEn: "Prefecture validation",
          titleRu: "Валидация в префектуре",
          duration: "2–3 месяца после приезда",
        },
      ],
      sources: [
        {
          url: "https://france-visas.gouv.fr/en/web/france-visas/student",
          excerpt: "Long-stay student visa — Campus France procedure and proof of resources.",
          labelEn: "France-Visas — student",
          labelRu: "France-Visas — étudiant",
        },
        {
          url: "https://www.campusfrance.org/en",
          excerpt: "Campus France manages the application process for most international students.",
          labelEn: "Campus France",
          labelRu: "Campus France",
        },
      ],
    },
  },
  {
    corridorId: "a0000000-0000-4000-8000-000000000004",
    corridorSlug: "ru-speaking-to-italy",
    wizardId: "d0000000-0000-4000-8000-000000000004",
    studyModuleId: "e0000000-0000-4000-8000-000000000032",
    programId: "b0000000-0000-4000-8000-000000000029",
    versionId: "c0000000-0000-4000-8000-000000000032",
    sortOrder: 5,
    program: {
      slug: "italy-student-visa",
      type: "STUDY",
      destinationIso2: "IT",
      titleEn: "Italy Student Visa (studio)",
      titleRu: "Италия — студенческая виза (studio)",
      summaryEn: "Type D visa for university enrollment; declaration of value and proof of means required.",
      summaryRu: "Виза типа D при зачислении в итальянский вуз; dichiarazione di valore и подтверждение средств.",
      rule: {
        and: [
          { "==": [{ var: "passport_iso2" }, "RU"] },
          { "==": [{ var: "wants_study_route" }, "yes"] },
          { "==": [{ var: "has_university_admission" }, "yes"] },
          {
            or: [
              { ">=": [{ var: "study_budget_eur" }, 5520] },
              { "==": [{ var: "can_show_study_funds" }, "yes"] },
            ],
          },
        ],
      },
      requirements: [
        {
          type: "documents",
          labelEn: "University enrollment",
          labelRu: "Зачисление в вуз",
          value: "Lettera di ammissione / pre-iscrizione",
        },
        {
          type: "documents",
          labelEn: "Dichiarazione di valore",
          labelRu: "Dichiarazione di valore",
          value: "Признание диплома через консульство IT (для большинства программ)",
        },
        {
          type: "savings",
          labelEn: "Financial means",
          labelRu: "Финансовые средства",
          value: "≈€460/мес. минимум (2026 ориентир для permesso per studio)",
        },
      ],
      costs: [
        { labelEn: "Consular fee", labelRu: "Консульский сбор", amount: "€50–116" },
        { labelEn: "Public university tuition", labelRu: "Обучение (гос. вуз)", amount: "€156–3 500/год (ISEE)" },
        { labelEn: "Dichiarazione di valore", labelRu: "Dichiarazione di valore", amount: "€100–300" },
      ],
      timeline: [
        {
          step: "document_prep",
          titleEn: "Admission & dichiarazione di valore",
          titleRu: "Зачисление и dichiarazione di valore",
          duration: "2–4 месяца",
        },
        {
          step: "application",
          titleEn: "Type D visa at consulate",
          titleRu: "Виза типа D в консульстве",
          duration: "2–8 недель",
        },
        {
          step: "residence",
          titleEn: "Permesso di soggiorno per studio",
          titleRu: "Permesso di soggiorno per studio",
          duration: "4–8 недель после questura",
        },
      ],
      sources: [
        {
          url: "https://vistoperitalia.esteri.it/home/en",
          excerpt: "Study visa (type D) — enrollment at Italian institution and proof of means.",
          labelEn: "Italy visa portal — study",
          labelRu: "Портал виз IT — учёба",
        },
      ],
    },
  },
];
