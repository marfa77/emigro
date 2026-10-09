import type { ProgramDetail } from "@/lib/types";

/** Russian copy for program rows that were seeded with English values (Nordic / NL / DE / FR / IT corridors). */
const VALUE_RU: Record<string, string> = {
  "Spouse, partner, or qualifying family member":
    "Супруг(а), партнёр или другой член семьи, дающий право на воссоединение",
  "Spouse, partner, or qualifying family member with legal residence":
    "Супруг(а), партнёр или другой член семьи с законным ВНЖ",
  "Spouse, parent, or qualifying relative with legal stay":
    "Супруг(а), родитель или другой родственник с законным пребыванием",
  "Spouse, minor child, or qualifying relative":
    "Супруг(а), несовершеннолетний ребёнок или другой родственник, дающий право на воссоединение",
  "Partner, parent, or child with legal stay": "Партнёр, родитель или ребёнок с законным пребыванием",
  "Legal resident with qualifying family tie": "Законный резидент с подтверждённой семейной связью",
  "Sponsor income/housing — verify UDI family rules": "Доход и жильё спонсора — сверьте с семейными правилами UDI",
  "Sponsor income/housing — verify Migri family rules": "Доход и жильё спонсора — сверьте с семейными правилами Migri",
  "Soft orient — verify current UDI / EEA Blue Card salary for Norway":
    "Ориентир — сверьте актуальный порог зарплаты UDI / EEA Blue Card для Норвегии",
  "Offer from employer registered in Norway": "Оффер от работодателя, зарегистрированного в Норвегии",
  "Housing and income rules — verify current Migrationsverket thresholds":
    "Требования к жилью и доходу — сверьте актуальные пороги Migrationsverket",
  "Insurance, pension, and collective agreement compliance":
    "Страховка, пенсионные отчисления и условия коллективного договора",
  "Meet Migri / collective agreement levels for the role — verify migri.fi":
    "Зарплата не ниже уровня Migri / коллективного договора для должности — сверьте на migri.fi",
  "Sufficient funds for stay — soft orient; verify migri.fi":
    "Достаточно средств на период пребывания — ориентир; сверьте на migri.fi",
  "Business Finland positive eligibility statement (soft — verify current process)":
    "Положительное заключение Business Finland (ориентир — сверьте текущий порядок)",
  "Meet Fast-track track salary / education criteria — soft orient; verify nyidanmark.dk":
    "Критерии зарплаты или образования для трека Fast-track — ориентир; сверьте на nyidanmark.dk",
  "Danish employer certified for Fast-track — soft; verify SIRI list":
    "Датский работодатель с сертификацией Fast-track — ориентир; сверьте список SIRI",
  "Contract under Fast-track scheme tracks": "Контракт по одному из треков схемы Fast-track",
  "Contract meeting SIRI / pay limit criteria": "Контракт, отвечающий критериям SIRI / pay limit",
  "DKK 552,000/year (~€74,000 gross, 2026 pay limit)": "DKK 552 000 в год (~€74 000 брутто, pay limit 2026)",
  "Danish labour market coverage": "Страховое покрытие по правилам датского рынка труда",
  "SIRI family rules — housing, attachment, and income criteria (verify nyidanmark.dk)":
    "Семейные правила SIRI — жильё, связь с Данией и доход (сверьте на nyidanmark.dk)",
  "Relevant education and/or experience matching the role": "Профильное образование и/или опыт под должность",
  "Recognised higher education or equivalent for the role":
    "Признанное высшее образование или эквивалент для должности",
  "Recognised degree or equivalent high qualification for the role":
    "Признанный диплом или эквивалентная высокая квалификация для должности",
  "Recognised degree or comparable qualification": "Признанный диплом или сопоставимая квалификация",
  "Private coverage or enrollment if eligible": "Частная страховка или подключение к госсистеме, если есть право",
  "Meets IND minimum for family formation": "Не ниже минимума IND для воссоединения семьи",
  "Job search permitted; employment converts to work permit":
    "Поиск работы разрешён; после трудоустройства — переход на рабочий ВНЖ",
  "Employment contract meeting work or specialist residence criteria":
    "Трудовой договор по критериям рабочего ВНЖ или ВНЖ специалиста",
  "Employer occupational insurance; comprehensive health insurance mandatory if cumulative legal stay <12 months (from 1 Jun 2026)":
    "Страховка от работодателя; полная медстраховка обязательна, если суммарное законное пребывание меньше 12 месяцев (с 1 июня 2026)",
  "Employer must be IND-registered sponsor": "Работодатель должен быть признанным спонсором IND",
  "Dutch basic health insurance after arrival": "Базовая нидерландская медстраховка после приезда",
  "Coverage in Netherlands": "Страховка, действующая в Нидерландах",
  "Coverage as required for the permit type": "Страховка по требованиям для этого типа ВНЖ",
  "Contract with IND-listed startup facilitator mandatory": "Обязателен договор с фасилитатором из списка IND",
  "Business plan reviewed by facilitator": "Бизнес-план, проверенный фасилитатором",
  "Scalable startup model accepted under the scheme": "Масштабируемая стартап-модель, принятая по схеме",
  "Degree + language/experience to reach 6 points (verify current BMAS table)":
    "Диплом + язык или опыт на 6 баллов (сверьте актуальную таблицу BMAS)",
  "Binding offer meeting Blue Card criteria": "Обязывающий оффер по критериям Blue Card",
  "Binding job offer with German employer": "Обязывающий оффер от немецкого работодателя",
  "Binding employment meeting Blue Card criteria": "Трудоустройство по критериям Blue Card",
  "A1 certificate often required for spouse reunification": "Для воссоединения супругов часто нужен сертификат A1",
  "CDI or qualifying CDD with French employer": "CDI или подходящий CDD с французским работодателем",
  "Full coverage in France for entire stay": "Полная страховка во Франции на весь срок пребывания",
  "French social security enrollment after arrival": "Регистрация во французской системе соцстрахования после приезда",
  "Attestation of sufficient resources; no salaried activity":
    "Подтверждение достаточных средств; работа по найму запрещена",
  "Stable income and adequate housing (SMIC-based rules)": "Стабильный доход и подходящее жильё (правила на базе SMIC)",
  "€22,404/year (SMIC annuel from 01.06.2026) — €1,867.02/month passive or equivalent savings":
    "€22 404 в год (годовой SMIC с 01.06.2026) — €1 867,02 в месяц пассивного дохода или эквивалентные накопления",
  "€31,000/year (~€2,583/month) from pensions, rent, dividends":
    "€31 000 в год (~€2 583 в месяц) из пенсий, аренды, дивидендов",
  "€13,092 (€1,091/month net × 12 months, 2026)": "€13 092 (€1 091 в месяц нетто × 12 месяцев, 2026)",
  "Valid in Italy for entire stay": "Действует в Италии на весь срок пребывания",
  "Sworn declaration; remote salaried work not permitted":
    "Присяжная декларация; удалённая работа по найму не допускается",
  "Above social allowance (assegno sociale) minimums": "Выше минимума социального пособия (assegno sociale)",
  "Contract, tax returns, professional qualification": "Контракт, налоговые декларации, профессиональная квалификация",
};

const AMOUNT_RU: Record<string, string> = {
  "NOK fees — verify udi.no": "Сборы в NOK — сверьте на udi.no",
  "EUR fees — verify migri.fi": "Сборы в EUR — сверьте на migri.fi",
  "DKK fees — verify SIRI": "Сборы в DKK — сверьте на сайте SIRI",
  "SEK fees — verify Migrationsverket": "Сборы в SEK — сверьте на сайте Migrationsverket",
  "SEK fees per applicant — verify Migrationsverket": "Сборы в SEK за каждого заявителя — сверьте на сайте Migrationsverket",
  "EUR — verify migri.fi / Business Finland": "Сборы в EUR — сверьте на migri.fi / Business Finland",
  "€350 (€300+€50) from 01.05.2026": "€350 (€300 + €50) с 01.05.2026",
  "€13,092 deposit": "€13 092 — депозит",
  "€1,000–5,000+ (varies)": "€1 000–5 000+ (зависит от случая)",
  "Varies (lease or ownership)": "Зависит от варианта (аренда или собственность)",
  "Included in fee (indicative)": "Входит в сбор (ориентир)",
  "Higher salary thresholds apply": "Действуют повышенные пороги зарплаты",
  "Additional fees per person": "Дополнительные сборы за каждого человека",
};

const DURATION_RU: Record<string, string> = {
  "Often faster than standard — verify SIRI": "Часто быстрее стандартного срока — сверьте на сайте SIRI",
};

const DURATION_PHRASES: Array<[RegExp, string]> = [
  [/\bafter decision\b/g, "после решения"],
  [/\bafter approval\b/g, "после одобрения"],
  [/\bafter arrival\b/g, "после приезда"],
  [/\(visa\)/g, "(виза)"],
  [/\bABH queue\b/g, "очередь в ABH"],
  [/\b(\d+[–-]\d+) wk card\b/g, "$1 нед. на выпуск карты"],
  [/\+ card\b/g, "+ выпуск карты"],
  [/\bmo\./g, "мес."],
  [/\bParis\/IDF often\b/g, "Париж и IDF часто"],
  [/\bMilan\/Rome longer\b/g, "в Милане и Риме дольше"],
];

function ruPlural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

function localizeDuration(text: string): string {
  const exact = DURATION_RU[text];
  if (exact) return exact;
  let out = text.replace(/(\d+)((?:\s*[–-]\s*\d+)?)\s*(weeks?|months?)\b/g, (_match, first: string, range: string, unit: string) => {
    const last = Number((range.match(/\d+/) ?? [first])[0]);
    const forms: [string, string, string] = unit.startsWith("week")
      ? ["неделя", "недели", "недель"]
      : ["месяц", "месяца", "месяцев"];
    return `${first}${range} ${ruPlural(last, forms)}`;
  });
  for (const [pattern, replacement] of DURATION_PHRASES) out = out.replace(pattern, replacement);
  return out;
}

function localizeAmount(text: string): string {
  const exact = AMOUNT_RU[text];
  if (exact) return exact;
  return text.replace(/\((\d{4}) indicative\)/g, "(ориентир $1)").replace(/\(indicative\)/g, "(ориентир)");
}

export function localizeProgramRu(program: ProgramDetail): ProgramDetail {
  return {
    ...program,
    requirements: program.requirements.map((item) =>
      item.value_text && VALUE_RU[item.value_text] ? { ...item, value_text: VALUE_RU[item.value_text] } : item,
    ),
    costs: program.costs.map((item) =>
      item.amount_text ? { ...item, amount_text: localizeAmount(item.amount_text) } : item,
    ),
    timeline: program.timeline.map((step) =>
      step.duration_text ? { ...step, duration_text: localizeDuration(step.duration_text) } : step,
    ),
  };
}
