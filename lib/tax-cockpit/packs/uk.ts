import type { CountryPack } from "./types";

/**
 * Day rule: cockpit default, not an override.
 * UK Statutory Residence Test generally counts a day if you are in the UK at the end of that day (midnight),
 * with transit and other exceptions this pack does not apply. Arrive-on, leave-next-morning matches that
 * midnight orienter; a same-day arrival and departure is 0.
 * The UK tax year is 6 April–5 April. This cockpit still buckets a calendar year.
 */
export const UK_PACK: CountryPack = {
  iso2: "GB",
  nameRu: "Великобритания",
  complete: true,
  presenceThresholdDays: 183,
  thresholdCompare: "gte",
  notesRu: [
    "Ориентир, не консультация. Statutory Residence Test (Finance Act 2013, Schedule 45) не сводится к 183 дням. 183 дня или больше в налоговом году UK — автоматический тест резидентства. Ниже срабатывают связи: семья, жильё, работа, 90 дней, country tie. Набор зависит от того, были ли вы резидентом раньше.",
    "Налоговый год Великобритании — с 6 апреля по 5 апреля, не календарный. Зелёный по январю–декабрю SRT не закрывает.",
    "День в SRT обычно тот, где вы в UK в полночь. Pack не переопределяет правило кокпита: приезд входит, выезд нет. Transit и exceptional days не вычитаем. ISO в журнале — GB; «UK» считается той же страной.",
  ],
  tieBreakerQuestionsRu: [
    "Сколько дней именно с 6 апреля по 5 апреля, а не в календарном году?",
    "Какие ties есть и были ли вы UK-резидентом в предыдущие три года? Ниже 183 это ещё не «зелёный SRT».",
    "Какие ночи были транзитом или exceptional circumstances — их кокпит не вычел?",
  ],
  officialSource: {
    labelRu: "HMRC — residence and the SRT",
    url: "https://www.gov.uk/government/publications/rdr3-statutory-residence-test-srt",
  },
};
