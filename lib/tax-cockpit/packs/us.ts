import type { CountryPack } from "./types";

/**
 * Day rule override: both ends count.
 * Substantial presence generally treats you as present on any day you are physically in the US at any time
 * (exempt individuals, certain commuters, and medical-condition days are not applied here).
 * The 3-year weighted formula is abbreviated: prior years are not in the ledger, so the engine never
 * paints a confident red. Near or over 183 current-year days → yellow.
 */
export const US_PACK: CountryPack = {
  iso2: "US",
  nameRu: "США",
  complete: true,
  dayRule: { arriveInclusive: true, departInclusive: true },
  presenceThresholdDays: 183,
  thresholdCompare: "gte",
  abbreviatedFormula: true,
  notesRu: [
    "Ориентир, не консультация. Substantial presence, IRC §7701(b): минимум 31 день в текущем календарном году и сумма «все дни этого года + 1/3 предыдущего + 1/6 позапрошлого» не меньше 183. Green card (законный постоянный резидент) — отдельный тест, дни его не отменяют.",
    "Прошлых лет в журнале нет, exempt individuals и договорный тай-брейк не считаются. Поэтому США не красим в красный: на линии 183 и рядом (от 75% порога) свет жёлтый — формула сокращена. Даже 183+ в одном году часто уже закрывают арифметику теста, но это всё равно не статус.",
    "Мало дней в текущем году не значит, что тест провален: тяжёлые два предыдущих года могут добрать сумму. Зелёный их не проверял.",
    "День — обычно любой календарный день физического присутствия. В pack входят день приезда и день выезда. Исключения (студент, преподаватель, транзит, болезнь) не вычитаем.",
  ],
  tieBreakerQuestionsRu: [
    "Есть ли green card или статус lawful permanent resident?",
    "Сколько дней было в двух прошлых годах — для 1/3 и 1/6? Без них формула не закрыта.",
    "Какие дни были exempt individual или не должны считаться по болезни?",
    "Нужен ли договорный тай-брейк, если связи ближе к другой стране?",
  ],
  officialSource: {
    labelRu: "IRS — Substantial Presence Test",
    url: "https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test",
  },
};
