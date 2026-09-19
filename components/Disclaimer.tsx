import type { UiLocale } from "@/lib/locale";

export const PARTNER_LINKS_DISCLAIMER_RU =
  "Ссылки на Wise, Revolut и другие сервисы в материалах могут быть партнёрскими.";

export function Disclaimer({ locale = "ru" }: { locale?: UiLocale }) {
  const text =
    locale === "es"
      ? "Emigro no es asesoramiento jurídico. La información es orientativa: verifique los requisitos en el consulado y con profesionales colegiados. Algunos enlaces a servicios como Wise o Revolut pueden ser de afiliados."
      : locale === "fr"
        ? "Emigro n'est pas un conseil juridique. Information indicative : vérifiez les exigences auprès du consulat et de professionnels. Certains liens vers Wise, Revolut ou d'autres services peuvent être affiliés."
      : locale === "ru"
        ? `Emigro не является юридической консультацией. Информация носит справочный характер — проверяйте требования в консульстве и у лицензированных специалистов. ${PARTNER_LINKS_DISCLAIMER_RU}`
        : "Emigro is not legal advice. Information is indicative — verify requirements with the consulate and licensed professionals. Some links to Wise, Revolut and other services may be affiliate links.";

  return (
    <aside className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      {text}
    </aside>
  );
}
