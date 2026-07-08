"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { prep2GoPromoUrl } from "@/lib/community-notes/sponsor-promo";
import { tapTarget } from "@/lib/ui/mobile";

export function Prep2GoPromo({ noteSlug }: { noteSlug: string }) {
  const href = prep2GoPromoUrl(noteSlug);

  function handleClick() {
    trackEvent("provider_click", {
      provider_id: "prep2go",
      placement: "satellite_ciple_note",
      topic_key: "portugal",
      note_slug: noteSlug,
    });
  }

  return (
    <section
      className="mt-10 rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-5 sm:p-6"
      aria-labelledby="prep2go-promo-heading"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Подготовка к экзамену</p>
      <h2 id="prep2go-promo-heading" className="mt-2 text-lg font-semibold text-slate-900">
        CIPLE A2 — онлайн на Prep2Go.study
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Сертификат CIPLE нужен для гражданства Португалии. Prep2Go — mock-тесты, карточки и формат реального экзамена
        CAPLE: чтение, письмо, аудирование, говорение.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        onClick={handleClick}
        className={`mt-4 inline-flex ${tapTarget} items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800`}
      >
        Готовиться к CIPLE на Prep2Go
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-3 text-xs text-slate-500">Сервис из справочника · не заменяет официальную регистрацию на CAPLE</p>
    </section>
  );
}
