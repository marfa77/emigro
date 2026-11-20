/**
 * Shown on guides whose title moved to 2027 (2026-11-20) until the January 2027 fact-check pass:
 * amounts that countries re-index every year (minimum wage, SMI, IPREM, salary thresholds) are still
 * the 2026 values until the 2027 ones are published. Expires on its own on 1 February 2027.
 */
const UNTIL = Date.parse("2027-02-01T00:00:00Z");

export function YearTransitionNote({ title, className = "" }: { title: string; className?: string }) {
  if (!title.includes("2027") || Date.now() >= UNTIL) return null;
  return (
    <p className={`rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950 ${className}`}>
      Гид обновлён для 2027 года. Суммы, которые страны пересматривают каждый январь (минимальная зарплата, пороги
      дохода и зарплаты), пока указаны по 2026 году — заменим их, как только опубликуют значения на 2027.
    </p>
  );
}
