import type { StoryGenre, StoryRole, StoryVerification } from "@/lib/stories/types";

export const STORY_GENRE_LABELS: Record<StoryGenre, string> = {
  triumph: "Успешный кейс",
  failure: "Провал и восстановление",
  hot_take: "Спорная точка зрения",
  lifehack: "Лайфхак",
};

export const STORY_GENRE_HINTS: Record<StoryGenre, string> = {
  triumph: "Таймлайн, цифры, что сработало",
  failure: "Ошибка, последствия, вывод",
  hot_take: "Аргументы и альтернатива",
  lifehack: "Коротко: проблема → решение → результат",
};

export const STORY_ROLE_LABELS: Record<StoryRole, string> = {
  it: "IT / удалёнщик",
  retiree: "Пенсионер",
  entrepreneur: "Предприниматель",
  family: "Семья с детьми",
  student: "Студент",
  other: "Другое",
};

export const STORY_VERIFICATION_LABELS: Record<StoryVerification, string> = {
  personal: "Личный опыт",
  emigro_reviewed: "Проверено Emigro",
};

export function isStoryGenre(value: string): value is StoryGenre {
  return value in STORY_GENRE_LABELS;
}

export function isStoryRole(value: string): value is StoryRole {
  return value in STORY_ROLE_LABELS;
}
