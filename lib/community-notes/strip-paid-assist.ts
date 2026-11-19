/**
 * Emigro is free for users since 2026-11-19: the paid Route Check (€129) and hourly accompaniment are gone.
 * Satellite notes in the database still mention them, so published text is rewritten at render time to the free
 * specialist match. Order matters: specific phrases first, generic fallbacks last.
 */
const RULES: Array<[RegExp, string]> = [
  [/\*\*Assist Emigro \(Route Check €129\):\*\* аудит \*\*вашего\*\* порядка/g, "**Emigro Assist (бесплатный подбор специалиста):** разбор **вашего** порядка"],
  [/Консультация Emigro Assist за €129 разбирает/g, "Специалист, которого бесплатно подберёт Emigro Assist, разберёт"],
  [/консультации Assist за €129/g, "бесплатном подборе специалиста Emigro"],
  [/Проверка маршрута Assist за €129/g, "Бесплатный подбор специалиста Emigro"],
  [/проверку маршрута Assist за €129/g, "бесплатный подбор специалиста Emigro"],
  [/проверка маршрута Assist за €129/g, "бесплатный подбор специалиста Emigro"],
  [/Сопровождение Assist за €129/g, "Бесплатный подбор специалиста Emigro"],
  [/Assist Route Check — document order audit €129\./g, "Emigro Assist — бесплатный подбор специалиста по порядку документов."],
  [/— €129 разбор вашего пакета и порядка шагов, не замена abogado\./g, "— бесплатный подбор специалиста по вашему пакету и порядку шагов."],
  [/\[Assist €129\]/g, "[Emigro Assist — бесплатно]"],
  [/Route Check Assist €129/g, "бесплатный подбор специалиста Emigro"],
  [/Route Check Emigro Assist/g, "бесплатный подбор специалиста Emigro"],
  [/Route Check Assist/g, "бесплатный подбор специалиста Emigro"],
  [/\*\*Assist Route Check\*\*/g, "**бесплатный подбор специалиста Emigro**"],
  [/Assist Route Check/g, "бесплатный подбор специалиста Emigro"],
  [/— Route Check cuando/g, "— selección gratuita de especialista cuando"],
  [/Route Check \[Emigro Assist\]/g, "Подбор специалиста [Emigro Assist]"],
  [/\[Route Check\]\(/g, "[подбор специалиста]("],
  [/— Route Check категории\./g, "— бесплатный подбор специалиста по категории."],
  [/Route Check \(?€129\)?/g, "бесплатный подбор специалиста"],
  [/Route Check/g, "подбор специалиста"],
  [/за €129/g, "бесплатно"],
];

export function stripPaidAssistText(text: string): string {
  if (!text.includes("Route Check") && !text.includes("€129")) return text;
  return RULES.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text);
}

/** Deep-rewrite every string field of a note-like object. */
export function stripPaidAssist<T>(value: T): T {
  if (typeof value === "string") return stripPaidAssistText(value) as T;
  if (Array.isArray(value)) return value.map((item) => stripPaidAssist(item)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) out[key] = stripPaidAssist(item);
    return out as T;
  }
  return value;
}
