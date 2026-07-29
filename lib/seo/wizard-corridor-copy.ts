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
  greece:
    "Wizard Emigro по Греции: Digital Nomad €3 500/мес, FIP, Golden Visa €250k–€800k. Консульская подача после Law 5275/2026 для паспортов RU/BY/UA/KZ.",
  cyprus:
    "Wizard Emigro по Кипру: Digital Nomad €3 500/мес net (до ~3 лет), Category F от €9 568/год, Non-Dom контекст. Кипрский ВНЖ ≠ Шенген — для паспортов RU/BY/UA/KZ.",
  hungary:
    "Wizard Emigro по Венгрии: White Card €3 000/мес net (макс. 2 года, без семьи и ПМЖ), Guest Investor от €250k. Enter Hungary / OIF — для паспортов RU/BY/UA/KZ.",
  malta:
    "Wizard Emigro по Мальте: NRP €42 000/год (закрыт для РФ/BY), MPRP permanent residence (€99k fees + недвижимость), Non-Dom контекст — для паспортов RU/BY/UA/KZ.",
  bulgaria:
    "Wizard Emigro по Болгарии: Digital Nomad ~€31 010/год (макс. 1+1), EOOD/бизнес, Type D → Migration. Евро и 10% flat tax — для паспортов RU/BY/UA/KZ.",
  croatia:
    "Wizard Emigro по Хорватии: Digital Nomad €3 622,50/мес (макс. 18 мес, 0% PIT на foreign income), семья +10% avg net. MUP / cooling-off 6 мес — для паспортов RU/BY/UA/KZ.",
  slovenia:
    "Wizard Emigro по Словении: Digital Nomad ~€3 200/мес (2× avg net, макс. 12 мес), s.p. self-employment, семья. GOV.SI с 21.11.2025 — для паспортов RU/BY/UA/KZ.",
  estonia:
    "Wizard Emigro по Эстонии: Digital Nomad Visa €4 500/мес (РФ/BY почти закрыты по MFA), e-Residency + OÜ (€150, не ВНЖ). Для паспортов RU/BY/UA/KZ.",
  scandinavia:
    "Wizard Emigro по Скандинавии: work permit Швеции, pay limit scheme Дании, воссоединение семьи. Пороги зарплаты и сроки для паспортов RU/BY/UA/KZ.",
};

export function wizardCorridorDescription(countrySegment: string, countryRu: string): string {
  return (
    WIZARD_CORRIDOR_DESCRIPTIONS[countrySegment] ??
    `Wizard Emigro по коридору ${countryRu}: ответьте на вопросы о паспорте, доходе и семье — получите сравнение программ ВНЖ с требованиями и сроками для паспортов RU/BY/UA/KZ.`
  );
}
