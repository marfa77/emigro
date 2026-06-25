export function Disclaimer({ locale = "ru" }: { locale?: "ru" | "en" }) {
  const text =
    locale === "ru"
      ? "Emigro не является юридической консультацией. Информация носит справочный характер — проверяйте требования в консульстве и у лицензированных специалистов."
      : "Emigro is not legal advice. Information is indicative — verify requirements with the consulate and licensed professionals.";

  return (
    <aside className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {text}
    </aside>
  );
}
