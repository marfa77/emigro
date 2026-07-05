export function compact(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function wordCount(text: string): number {
  return compact(text).split(/\s+/).filter(Boolean).length;
}

export function limitWords(text: string, maxWords: number): string {
  const words = compact(text).split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return words.slice(0, maxWords).join(" ");
}

export function formatDateRu(date = new Date()): string {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function todayYmd(): string {
  return new Date().toISOString().slice(0, 10);
}
