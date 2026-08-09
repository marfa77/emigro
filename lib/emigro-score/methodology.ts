import { EMIGRO_SCORE_AXIS_LABELS, type EmigroScoreAxisId } from "./types";

export const EMIGRO_SCORE_PATH = "/ru/emigro-score";

export type EmigroScoreRubricRow = {
  band: string;
  meaning: string;
};

export type EmigroScoreAxisDoc = {
  id: EmigroScoreAxisId;
  label: string;
  weight: number;
  blurb: string;
  rubric: EmigroScoreRubricRow[];
};

export const EMIGRO_SCORE_OVERALL_WEIGHTS: Record<EmigroScoreAxisId, number> = {
  entry: 0.25,
  status: 0.3,
  banks: 0.15,
  tax: 0.15,
  next: 0.15,
};

export const EMIGRO_SCORE_AXIS_DOCS: EmigroScoreAxisDoc[] = [
  {
    id: "entry",
    label: EMIGRO_SCORE_AXIS_LABELS.entry,
    weight: EMIGRO_SCORE_OVERALL_WEIGHTS.entry,
    blurb: "Насколько реально въехать и остаться на первые недели без сюрприза на границе.",
    rubric: [
      { band: "90", meaning: "Безвиз ≥90 дней или тривиальная e-visa; отказы редки" },
      { band: "70", meaning: "Безвиз 30–90 дней или понятная виза; дискреция предсказуема" },
      { band: "50", meaning: "Виза через VFS / очередь или безвиз с sunset / «накопительный» лимит" },
      { band: "30", meaning: "Высокий отказ, долгие записи, паспортные ограничения" },
    ],
  },
  {
    id: "status",
    label: EMIGRO_SCORE_AXIS_LABELS.status,
    weight: EMIGRO_SCORE_OVERALL_WEIGHTS.status,
    blurb: "Есть ли массовый легальный путь жить и зарабатывать — не серая зона.",
    rubric: [
      { band: "90", meaning: "Опубликованный маршрут stay+work; отказ — исключение; permit ≥2 лет" },
      { band: "70", meaning: "Маршрут работает, но медленно, узко или дорого" },
      { band: "50", meaning: "Только для подмножества (доход/IT/инвест) или короткий unclear renewal" },
      { band: "30", meaning: "Нет mass-market пути; практика держится на серой зоне" },
    ],
  },
  {
    id: "banks",
    label: EMIGRO_SCORE_AXIS_LABELS.banks,
    weight: EMIGRO_SCORE_OVERALL_WEIGHTS.banks,
    blurb: "Открытие счёта и KYC для паспорта РФ (консервативная база).",
    rubric: [
      { band: "90", meaning: "Счёт открывают предсказуемо при базовых документах" },
      { band: "70", meaning: "Открывают часто, но с усиленным due diligence" },
      { band: "50", meaning: "Case-by-case; нужен residence / долгий статус" },
      { band: "30", meaning: "Систематический отказ или месяцы onboarding для РФ" },
    ],
  },
  {
    id: "tax",
    label: EMIGRO_SCORE_AXIS_LABELS.tax,
    weight: EMIGRO_SCORE_OVERALL_WEIGHTS.tax,
    blurb: "Предсказуемость налогов и ловушки (двойной налог, PE, отсутствие СИДН с РФ).",
    rubric: [
      { band: "90", meaning: "Прозрачные правила + защита от двойного налога где уместно" },
      { band: "70", meaning: "Понятная система при advisor; спецрежимы узкие, но честные" },
      { band: "50", meaning: "Сложно / меняющиеся режимы; риск ошибки высокий" },
      { band: "30", meaning: "СИДН нет или ловушки (PE с первого дня) без простого выхода" },
    ],
  },
  {
    id: "next",
    label: EMIGRO_SCORE_AXIS_LABELS.next,
    weight: EMIGRO_SCORE_OVERALL_WEIGHTS.next,
    blurb: "Перспектива: EU-трамплин (консульства, residence proof) или долгий settle вне ЕС.",
    rubric: [
      { band: "90", meaning: "Сильный EU-коридор или зрелый settle с долгим статусом" },
      { band: "70", meaning: "Хорошая база дальше: консульства / PR-трек при условиях" },
      { band: "50", meaning: "Частично полезно; D7/аналоги часто не из этой юрисдикции" },
      { band: "30", meaning: "Слабая база для следующего шага; изолированный lifestyle-хаб" },
    ],
  },
];
