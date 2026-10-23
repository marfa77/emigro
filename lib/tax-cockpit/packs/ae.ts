import { PT_AE_RENTAL_PLAYBOOK } from "./pt-ae-rental";
import type { CountryPack } from "./types";

/**
 * Day rule override: both ends count.
 * Ministerial Decision No. 27 of 2023, art. 3 (implementation of Cabinet Decision No. 85 of 2022):
 * any day or any part of a day physically in the UAE counts as a full day.
 * Exceptional circumstances that stopped a departure may be disregarded by the FTA — this pack does not subtract them.
 */
export const AE_PACK: CountryPack = {
  iso2: "AE",
  nameRu: "ОАЭ",
  complete: true,
  dayRule: { arriveInclusive: true, departInclusive: true },
  presenceThresholdDays: 183,
  thresholdCompare: "gte",
  notesRu: [
    "Ориентир, не консультация. Cabinet Decision No. 85 of 2022, ст. 4: физлицо — налоговый резидент ОАЭ, если выполнено хотя бы одно из трёх. (1) Обычное или основное место жизни и центр финансовых и личных интересов в ОАЭ. (2) 183 дня или больше за 12 месяцев подряд. (3) 90 дней или больше за те же 12 месяцев, плюс гражданство ОАЭ или GCC либо ВНЖ, и при этом постоянное жильё или работа либо бизнес в ОАЭ.",
    "183 дня — не единственный тест. Зелёный ниже 183 в календарном году не отменяет ни тест 90 дней со связями, ни центр интересов. Окно в решении — 12 месяцев подряд, не обязательно 1 января–31 декабря.",
    "Часть дня в ОАЭ считается как день (Ministerial Decision No. 27 of 2023, ст. 3). В pack входят и день приезда, и день выезда. Дни, когда человек не смог уехать из-за исключительных обстоятельств, FTA может не засчитывать — кокпит их не вычитает.",
    "Общего подоходного налога на зарплату физлица нет. Бизнес-доход физлица может попадать в корпоративный налог; порог оборота сверять на tax.gov.ae. Красный по дням не заменяет сертификат налогового резидентства FTA.",
  ],
  tieBreakerQuestionsRu: [
    "Есть ли гражданство ОАЭ или GCC, либо действующий ВНЖ, плюс постоянное жильё или работа/бизнес — тогда ориентир может быть 90 дней, не 183?",
    "Где обычное место жизни и центр финансовых и личных интересов, даже если дней мало?",
    "Какие 12 месяцев подряд смотреть, а не только календарный год?",
    "Есть ли бизнес-доход физлица и нужен ли сертификат резидентства FTA?",
  ],
  playbooks: [PT_AE_RENTAL_PLAYBOOK],
  officialSource: {
    labelRu: "Cabinet Decision 85/2022 (FTA)",
    url: "https://tax.gov.ae/Datafolder/Files/Legislation/Corporate%20Tax/Cabinet%20Decision%2085%20of%202022%20-%20For%20publishing.pdf",
  },
};
