/**
 * Expands digits, dates, and compound durations for Russian OpenAI TTS.
 * Fixes misreadings like "3-летняя" → "трилетняя" instead of "трёхлетняя".
 */

const RE_FLAGS = "giu";

/** JS \\b ignores Cyrillic — use explicit letter boundaries. */
const NOT_BEFORE = "(?<![\\p{L}\\d])";
const NOT_AFTER = "(?![\\p{L}\\d])";

const TEENS = [
  "десять",
  "одиннадцать",
  "двенадцать",
  "тринадцать",
  "четырнадцать",
  "пятнадцать",
  "шестнадцать",
  "семнадцать",
  "восемнадцать",
  "девятнадцать",
] as const;

const TENS = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"] as const;
const HUNDREDS = [
  "",
  "сто",
  "двести",
  "триста",
  "четыреста",
  "пятьсот",
  "шестьсот",
  "семьсот",
  "восемьсот",
  "девятьсот",
] as const;

const ONES_M = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"] as const;
const ONES_F = ["", "одна", "две", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"] as const;

const MONTHS_GENITIVE = [
  "",
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

const DURATION_GENITIVE_PREFIX: Record<number, string> = {
  1: "одно",
  2: "двух",
  3: "трёх",
  4: "четырёх",
  5: "пяти",
  6: "шести",
  7: "семи",
  8: "восьми",
  9: "девяти",
  10: "десяти",
};

const FEMININE_UNITS = new Set([
  "минута",
  "минуты",
  "минут",
  "секунда",
  "секунды",
  "секунд",
  "неделя",
  "недели",
  "недель",
]);

function ruCardinal(n: number, feminine = false): string {
  if (!Number.isFinite(n) || n < 0 || n > 9999) return String(n);
  if (n === 0) return "ноль";

  const ones = feminine ? ONES_F : ONES_M;
  const parts: string[] = [];

  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  if (thousands > 0) {
    if (thousands === 1) parts.push("тысяча");
    else if (thousands >= 2 && thousands <= 4) parts.push(`${ruCardinal(thousands, true)} тысячи`);
    else parts.push(`${ruCardinal(thousands, true)} тысяч`);
  }

  const hundreds = Math.floor(rest / 100);
  const tensOnes = rest % 100;
  if (hundreds > 0) parts.push(HUNDREDS[hundreds]);
  if (tensOnes >= 10 && tensOnes < 20) parts.push(TEENS[tensOnes - 10]);
  else {
    const tens = Math.floor(tensOnes / 10);
    const one = tensOnes % 10;
    if (tens > 0) parts.push(TENS[tens]);
    if (one > 0) parts.push(ones[one]);
  }

  return parts.join(" ");
}

function ruGenitive(n: number, feminine = false): string {
  const map: Record<number, string> = feminine
    ? { 1: "одной", 2: "двух", 3: "трёх", 4: "четырёх", 5: "пяти", 6: "шести", 7: "семи", 8: "восьми", 9: "девяти", 10: "десяти" }
    : { 1: "одного", 2: "двух", 3: "трёх", 4: "четырёх", 5: "пяти", 6: "шести", 7: "семи", 8: "восьми", 9: "девяти", 10: "десяти" };
  if (map[n]) return map[n];
  return ruCardinal(n, feminine);
}

const ORDINAL_PREPOSITIONAL_ONES = [
  "",
  "первом",
  "втором",
  "третьем",
  "четвёртом",
  "пятом",
  "шестом",
  "седьмом",
  "восьмом",
  "девятом",
] as const;

const ORDINAL_PREPOSITIONAL_TEENS = [
  "десятом",
  "одиннадцатом",
  "двенадцатом",
  "тринадцатом",
  "четырнадцатом",
  "пятнадцатом",
  "шестнадцатом",
  "семнадцатом",
  "восемнадцатом",
  "девятнадцатом",
] as const;

const ORDINAL_PREPOSITIONAL_TENS = [
  "",
  "",
  "двадцатом",
  "тридцатом",
  "сороковом",
  "пятидесятом",
  "шестидесятом",
  "семидесятом",
  "восьмидесятом",
  "девяностом",
] as const;

function ordinalPrepositional(n: number): string {
  if (n >= 11 && n <= 19) return ORDINAL_PREPOSITIONAL_TEENS[n - 10];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  if (tens === 0) return ORDINAL_PREPOSITIONAL_ONES[ones];
  if (ones === 0) return ORDINAL_PREPOSITIONAL_TENS[tens];
  const tensStem = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"][tens];
  return `${tensStem} ${ORDINAL_PREPOSITIONAL_ONES[ones]}`;
}

function yearPrepositional(year: number): string {
  if (year === 2000) return "двухтысячном";
  if (year >= 2001 && year < 2100) {
    const suffix = year % 100;
    if (suffix === 0) return "двухтысячном";
    return `две тысячи ${ordinalPrepositional(suffix)}`;
  }
  return ruYearSpoken(year);
}

function ruYearSpoken(year: number, withYearWord = false): string {
  const spoken = ruCardinal(year);
  if (!withYearWord) return spoken;
  const mod100 = year % 100;
  const mod10 = year % 10;
  let yearWord = "год";
  if (mod100 >= 11 && mod100 <= 14) yearWord = "год";
  else if (mod10 === 1) yearWord = "год";
  else if (mod10 >= 2 && mod10 <= 4) yearWord = "года";
  else yearWord = "лет";
  return `${spoken} ${yearWord}`;
}

function ruDateSpoken(day: number, month: number, year: number): string {
  const monthName = MONTHS_GENITIVE[month] ?? String(month);
  return `${ruCardinal(day)} ${monthName} ${ruYearSpoken(year)} года`;
}

function compoundDuration(n: number, stem: string, ending: string): string {
  const prefix = DURATION_GENITIVE_PREFIX[n];
  if (prefix) return `${prefix}${stem}${ending}`;
  return `${ruCardinal(n)}${stem}${ending}`;
}

function fixMismergedDurationWords(text: string): string {
  return text
    .replace(new RegExp(`${NOT_BEFORE}трилетн(яя|ий|ее|ие|ей|ую)${NOT_AFTER}`, RE_FLAGS), "трёхлетн$1")
    .replace(new RegExp(`${NOT_BEFORE}двулетн(яя|ий|ее|ие|ей|ую)${NOT_AFTER}`, RE_FLAGS), "двухлетн$1")
    .replace(new RegExp(`${NOT_BEFORE}четырехлетн(яя|ий|ее|ие|ей|ую)${NOT_AFTER}`, RE_FLAGS), "четырёхлетн$1")
    .replace(new RegExp(`${NOT_BEFORE}трехлетн(яя|ий|ее|ие|ей|ую)${NOT_AFTER}`, RE_FLAGS), "трёхлетн$1")
    .replace(new RegExp(`${NOT_BEFORE}четырехмесячн(ая|яя|ий|ее|ие|ей|ую)${NOT_AFTER}`, RE_FLAGS), "четырёхмесячн$1")
    .replace(new RegExp(`${NOT_BEFORE}трехмесячн(ая|яя|ий|ее|ие|ей|ую)${NOT_AFTER}`, RE_FLAGS), "трёхмесячн$1");
}

function expandCompoundDurations(text: string): string {
  return text.replace(
    new RegExp(
      `${NOT_BEFORE}(\\d{1,2})\\s*[-–—]?\\s*(летн|месячн|дневн|недельн|часов|годичн)(ая|яя|ий|ее|ие|ей|ую)${NOT_AFTER}`,
      RE_FLAGS
    ),
    (_match, rawNum: string, stem: string, ending: string) => {
      const n = Number.parseInt(rawNum, 10);
      if (!Number.isFinite(n) || n <= 0) return _match;
      return compoundDuration(n, stem.toLowerCase(), ending.toLowerCase());
    }
  );
}

function expandEuroAmounts(text: string): string {
  return text
    .replace(/€\s*(\d[\d\s]*)/g, (_m, raw: string) => {
      const n = Number.parseInt(raw.replace(/\s/g, ""), 10);
      return Number.isFinite(n) ? `${ruCardinal(n)} евро` : _m;
    })
    .replace(new RegExp(`${NOT_BEFORE}(\\d[\\d\\s]*)\\s*€${NOT_AFTER}`, RE_FLAGS), (_m, raw: string) => {
      const n = Number.parseInt(raw.replace(/\s/g, ""), 10);
      return Number.isFinite(n) ? `${ruCardinal(n)} евро` : _m;
    });
}

function expandRanges(text: string): string {
  return text.replace(
    new RegExp(
      `${NOT_BEFORE}(\\d{1,4})\\s*[-–—]\\s*(\\d{1,4})\\s+(дней|дня|день|месяцев|месяца|месяц|лет|года|год|минут|минуты|минута|секунд|секунды|секунда|часов|часа|час|евро|процентов|процент)${NOT_AFTER}`,
      RE_FLAGS
    ),
    (_m, a: string, b: string, unit: string) => {
      const n1 = Number.parseInt(a, 10);
      const n2 = Number.parseInt(b, 10);
      const feminine = FEMININE_UNITS.has(unit.toLowerCase());
      return `от ${ruGenitive(n1, feminine)} до ${ruGenitive(n2, feminine)} ${unit.toLowerCase()}`;
    }
  );
}

function expandDates(text: string): string {
  return text.replace(/\b(\d{1,2})[./](\d{1,2})[./](20\d{2})\b/g, (_m, d: string, mo: string, y: string) => {
    return ruDateSpoken(Number.parseInt(d, 10), Number.parseInt(mo, 10), Number.parseInt(y, 10));
  });
}

function expandYears(text: string): string {
  let next = text.replace(
    new RegExp(`${NOT_BEFORE}(20\\d{2})\\s+(году|года|год)${NOT_AFTER}`, RE_FLAGS),
    (_m, y: string, word: string) => {
      const year = Number.parseInt(y, 10);
      if (word.toLowerCase() === "году") return `${yearPrepositional(year)} году`;
      return ruYearSpoken(year, true);
    }
  );
  next = next.replace(new RegExp(`${NOT_BEFORE}в\\s+(20\\d{2})\\s+году${NOT_AFTER}`, RE_FLAGS), (_m, y: string) => {
    const year = Number.parseInt(y, 10);
    return `в ${yearPrepositional(year)} году`;
  });
  next = next.replace(new RegExp(`${NOT_BEFORE}в\\s+(20\\d{2})${NOT_AFTER}`, RE_FLAGS), (_m, y: string) => {
    const year = Number.parseInt(y, 10);
    return `в ${ruYearSpoken(year)}`;
  });
  return next;
}

function expandNumberUnits(text: string): string {
  return text.replace(
    new RegExp(
      `${NOT_BEFORE}(\\d{1,4})\\s+(дней|дня|день|месяцев|месяца|месяц|лет|года|год|минут|минуты|минута|секунд|секунды|секунда|часов|часа|час|евро|процентов|процент)${NOT_AFTER}`,
      RE_FLAGS
    ),
    (_m, raw: string, unit: string) => {
      const n = Number.parseInt(raw, 10);
      const feminine = FEMININE_UNITS.has(unit.toLowerCase());
      return `${ruCardinal(n, feminine)} ${unit.toLowerCase()}`;
    }
  );
}

function expandRemainingYears(text: string): string {
  return text.replace(new RegExp(`${NOT_BEFORE}(20\\d{2})${NOT_AFTER}`, RE_FLAGS), (y) =>
    ruYearSpoken(Number.parseInt(y, 10))
  );
}

function expandRemainingDigits(text: string): string {
  return text.replace(new RegExp(`${NOT_BEFORE}(\\d{1,4})${NOT_AFTER}`, RE_FLAGS), (raw) => {
    const n = Number.parseInt(raw, 10);
    return ruCardinal(n);
  });
}

/** Prepare script segment text for Russian TTS. */
export function prepareTextForRuTts(text: string): string {
  let out = text.normalize("NFKC");
  out = fixMismergedDurationWords(out);
  out = expandCompoundDurations(out);
  out = expandEuroAmounts(out);
  out = expandRanges(out);
  out = expandDates(out);
  out = expandYears(out);
  out = expandNumberUnits(out);
  out = expandRemainingYears(out);
  out = expandRemainingDigits(out);
  out = out.replace(/\s+/g, " ").trim();
  return out;
}
