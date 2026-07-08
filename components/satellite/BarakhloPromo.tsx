"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { barakhloPromoUrl, isServiceDiscoveryNote } from "@/lib/community-notes/sponsor-promo";
import { tapTarget } from "@/lib/ui/mobile";

type BarakhloPromoProps = {
  context: "hub" | string;
  placement: "satellite_hub" | "satellite_note";
  compact?: boolean;
  category?: string;
};

export function BarakhloPromo({ context, placement, compact = false, category = "" }: BarakhloPromoProps) {
  const href = barakhloPromoUrl(context, "portugal", "satellite");
  const serviceNote = context !== "hub" && isServiceDiscoveryNote(context, category);

  function handleClick() {
    trackEvent("corridor_link_click", {
      link_target: "barakhlo_lisbon",
      placement,
      note_slug: context === "hub" ? null : context,
    });
  }

  if (compact) {
    return (
      <section
        className="mt-8 flex flex-col gap-3 rounded-xl border border-orange-200 bg-orange-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
        aria-labelledby={compact ? undefined : "barakhlo-promo-heading"}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-orange-800">Барахолка Лиссабона</p>
          <p className="mt-1 text-sm text-slate-800">
            Мебель, авто, услуги и б/у от русскоязычных — без комиссии, из Telegram-чатов.
          </p>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className={`inline-flex ${tapTarget} shrink-0 items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700`}
        >
          На Barakhlo
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </section>
    );
  }

  return (
    <section
      className="mt-10 rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 sm:p-6"
      aria-labelledby="barakhlo-promo-heading"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-orange-800">Сообщество Лиссабона</p>
      <h2 id="barakhlo-promo-heading" className="mt-2 text-lg font-semibold text-slate-900">
        Барахолка Лиссабона на Barakhlo.online
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        {serviceNote
          ? "На Barakhlo — раздел «Услуги» и объявления мастеров из Telegram-чатов Лиссабона. Удобно сравнить с Google Maps и чатами."
          : "Объявления из русскоязычных Telegram-чатов: мебель для новой квартиры, авто, услуги мастеров, детские вещи и электроника. Обновляется автоматически, переход к продавцу — в один клик."}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`mt-4 inline-flex ${tapTarget} items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700`}
      >
        Смотреть объявления в Лиссабоне
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-3 text-xs text-slate-500">Сервис Emigro · barakhlo.online/portugal/lisbon</p>
    </section>
  );
}
