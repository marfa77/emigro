"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { prep2GoPromoUrl } from "@/lib/community-notes/sponsor-promo";
import { PARTNER_LINK_REL } from "@/lib/partners/link";
import { tapTarget } from "@/lib/ui/mobile";
import { withUniPrepUtm } from "@/lib/uniprep2go/catalog";

export function Prep2GoPromo({ noteSlug }: { noteSlug: string }) {
  const href = prep2GoPromoUrl(noteSlug, "/ciple-a2-mock-test");
  const uniPrepAnkiHref = withUniPrepUtm("/decks/ciple-a2-european-portuguese-anki-deck", {
    medium: "satellite",
    campaign: "ciple_note",
    content: noteSlug,
  });

  function handleClick() {
    trackEvent("provider_click", {
      provider_id: "prep2go",
      placement: "satellite_ciple_note",
      topic_key: "portugal",
      note_slug: noteSlug,
      product: "mock",
    });
  }

  return (
    <section
      className="mt-10 rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-5 sm:p-6"
      aria-labelledby="prep2go-promo-heading"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-violet-800">Сестринский продукт · Prep2Go</p>
      <h2 id="prep2go-promo-heading" className="mt-2 text-lg font-semibold text-slate-900">
        CIPLE A2 mock — онлайн на Prep2Go.study
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Сертификат CIPLE нужен для гражданства Португалии. Timed mock в формате CAPLE: чтение, письмо, аудирование,
        говорение + AI scoring. Anki-колоду CIPLE смотрите на{" "}
        <a
          href={uniPrepAnkiHref}
          target="_blank"
          rel={PARTNER_LINK_REL}
          className="font-semibold text-violet-800 underline-offset-2 hover:underline"
        >
          UniPrep2Go
        </a>
        .
      </p>
      <a
        href={href}
        target="_blank"
        rel={PARTNER_LINK_REL}
        onClick={handleClick}
        className={`mt-4 inline-flex ${tapTarget} items-center gap-2 rounded-lg bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-800`}
      >
        Пройти CIPLE mock на Prep2Go
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-3 text-xs text-slate-500">Семейство PixID Studio · не заменяет официальную регистрацию на CAPLE</p>
    </section>
  );
}
