import type { HouseholdSummary } from "@/lib/engine/household";

export function HouseholdBanner({ household }: { household?: HouseholdSummary }) {
  if (!household || household.isSolo) return null;

  return (
    <section className="mt-6 rounded-xl border border-sky-200 bg-sky-50 px-5 py-4 text-sky-950">
      <p className="font-medium">Расчёт для семьи: {household.labelRu}</p>
      <p className="mt-2 text-sm text-sky-900/90">
        Пороги дохода и сбережений пересчитаны с учётом иждивенцев. Родители и бабушки/дедушки — отдельный
        сложный маршрут; часто сначала переезжает основной заявитель, семья — воссоединением.
      </p>
    </section>
  );
}
