import type { CountryPack } from "./types";

/**
 * Day rule override: both ends count.
 * TUIR art. 2, as amended by D.Lgs. 209/2023 (from 1 Jan 2024): fractions of a day count toward
 * physical presence. Arrival and departure days are both an orienter for that rule.
 * Majority of the tax year is 183 days, or 184 in a leap year.
 */
export const IT_PACK: CountryPack = {
  iso2: "IT",
  nameRu: "Италия",
  complete: true,
  dayRule: { arriveInclusive: true, departInclusive: true },
  presenceThresholdDays: 183,
  thresholdCompare: "gte",
  majorityOfLeapYear: true,
  notesRu: [
    "Ориентир, не консультация. Ст. 2 TUIR в редакции D.Lgs. 209/2023 (с 1 января 2024): резидент, если большую часть налогового периода в Италии гражданская residenza, domicilio (главным образом личные и семейные связи) или просто физическое присутствие. Достаточно одного из трёх.",
    "Большая часть года — 183 дня, в високосный год 184. Дроби дня считаются. В pack день приезда и день выезда оба входят. Прописка в anagrafe большую часть года — опровержимая презумпция; светофор реестр не видит.",
    "Красный по дням не закрывает вопросы domicilio и прописки и не является статусом для декларации.",
  ],
  tieBreakerQuestionsRu: [
    "Где большая часть года прописка в anagrafe — презумпцию ещё нужно опровергать?",
    "Где domicilio: личные и семейные связи, даже если ночей мало?",
    "Совпадает ли подсчёт «любая часть дня» со штампами, включая день вылета?",
    "Високосный ли год — тогда ориентир 184 дня, не 183?",
  ],
  officialSource: {
    labelRu: "Agenzia Entrate — резидентство физлиц",
    url: "https://www.agenziaentrate.gov.it/portale/regole-generali-per-persone-fisiche",
  },
};
