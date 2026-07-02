/** Unique meta descriptions per corridor wizard — avoids generic SEO suffix padding. */
export const WIZARD_CORRIDOR_DESCRIPTIONS: Record<string, string> = {
  portugal:
    "Wizard Emigro по Португалии: D7, D8 digital nomad, Golden Visa ARI, семья. Сравнение программ ВНЖ с порогами дохода и сроками для паспортов RU/BY/UA/KZ.",
  spain:
    "Wizard Emigro по Испании: digital nomad teletrabajo, non-lucrative, студенческая виза, воссоединение семьи. Пороги €2 849+/мес и сроки для паспортов RU/BY/UA/KZ.",
  germany:
    "Wizard Emigro по Германии: EU Blue Card, Chancenkarte, work permit, воссоединение. Пороги зарплаты 2026 и сроки ВНЖ для паспортов RU/BY/UA/KZ.",
  france:
    "Wizard Emigro по Франции: talent passport, VLS-TS étudiant, visiteur, воссоединение. Пороги дохода и сроки для паспортов RU/BY/UA/KZ.",
  italy:
    "Wizard Emigro по Италии: digital nomad, investor visa, elective residence, учёба. Пороги дохода и сроки ВНЖ для паспортов RU/BY/UA/KZ.",
  netherlands:
    "Wizard Emigro по Нидерландам: highly skilled migrant, startup facilitator, воссоединение. Пороги зарплаты IND и сроки для паспортов RU/BY/UA/KZ.",
  poland:
    "Wizard Emigro по Польше: work permit, EU Blue Card, B2B IT, студенческий pobyt. Пороги зарплаты и сроки для паспортов RU/BY/UA/KZ — ключевой маршрут для BY.",
  czechia:
    "Wizard Emigro по Чехии: employee card, EU Blue Card, živnost IT, учёба. Пороги дохода и сроки pobyt для паспортов RU/BY/UA/KZ.",
  austria:
    "Wizard Emigro по Австрии: Red-White-Red Card, EU Blue Card, самозанятость, учёба. Пороги зарплаты AMS и сроки для паспортов RU/BY/UA/KZ.",
  scandinavia:
    "Wizard Emigro по Скандинавии: work permit Швеции, pay limit scheme Дании, воссоединение семьи. Пороги зарплаты и сроки для паспортов RU/BY/UA/KZ.",
};

export function wizardCorridorDescription(countrySegment: string, countryRu: string): string {
  return (
    WIZARD_CORRIDOR_DESCRIPTIONS[countrySegment] ??
    `Wizard Emigro по коридору ${countryRu}: ответьте на вопросы о паспорте, доходе и семье — получите сравнение программ ВНЖ с требованиями и сроками для паспортов RU/BY/UA/KZ.`
  );
}
