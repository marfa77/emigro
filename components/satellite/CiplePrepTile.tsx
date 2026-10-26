"use client";

import { BookOpen, ExternalLink, FlaskConical } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { externalLinkRel, PARTNER_LINK_REL } from "@/lib/partners/link";
import { tapTarget } from "@/lib/ui/mobile";
import {
  CIPLE_A2_RU_GUMROAD_URL,
  withPrep2GoUtm,
  withUniPrepUtm,
} from "@/lib/uniprep2go/catalog";

type Props = {
  /** Hub vs note placement for UTM / analytics */
  placement?: "satellite_hub" | "satellite_ciple_note";
  noteSlug?: string;
  className?: string;
};

/**
 * Organic CIPLE conversion tile for portugal.emigro.online —
 * Gumroad Anki (RU speakers) + Prep2Go timed mock.
 */
export function CiplePrepTile({
  placement = "satellite_hub",
  noteSlug,
  className = "",
}: Props) {
  const content = noteSlug ?? "hub";
  const deckHref = withUniPrepUtm(CIPLE_A2_RU_GUMROAD_URL, {
    medium: "satellite",
    campaign: "ciple_ru_deck",
    content: `${placement}_${content}_deck`,
  });
  const mockHref = withPrep2GoUtm("/ciple-a2-mock-test", {
    medium: "satellite",
    campaign: "ciple_ru_deck",
    content: `${placement}_${content}_mock`,
  });
  const deckRel = externalLinkRel(deckHref, { sponsored: true });

  function track(product: "deck" | "mock") {
    trackEvent("provider_click", {
      provider_id: product === "deck" ? "gumroad_ciple_ru" : "prep2go",
      placement,
      topic_key: "portugal",
      note_slug: noteSlug ?? null,
      product: product === "deck" ? "ciple_anki_ru_gumroad" : "ciple_mock",
    });
  }

  return (
    <section
      className={`mt-8 overflow-hidden rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50/90 via-white to-cyan-50/80 ${className}`}
      aria-labelledby="ciple-prep-tile-heading"
    >
      <div className="border-b border-teal-100/80 px-4 py-3 sm:px-5">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
          Подготовка к гражданству · PixID Studio
        </p>
        <h2 id="ciple-prep-tile-heading" className="mt-1 text-lg font-semibold text-slate-900">
          CIPLE A2 Anki for Russian speakers
        </h2>
      </div>
      <div className="px-4 py-4 sm:px-5">
        <p className="text-sm leading-relaxed text-slate-700">
          Языковая часть натурализации PT — экзамен CIPLE (A2 CAPLE). Колода Anki Portuguese A2 (CIPLE) for Russian
          speakers — на Gumroad; timed mock — на Prep2Go: mock → Anki → retest. Это не запись Agora и не юрконсультация.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={deckHref}
            target="_blank"
            rel={deckRel}
            onClick={() => track("deck")}
            className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800`}
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            Купить Anki-колоду на Gumroad
            <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
          </a>
          <a
            href={mockHref}
            target="_blank"
            rel={PARTNER_LINK_REL}
            onClick={() => track("mock")}
            className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 transition hover:border-teal-500 hover:bg-teal-50`}
          >
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            Timed mock CIPLE
            <ExternalLink className="h-3.5 w-3.5 opacity-80" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          gumroad.com/l/ciple-a2-for-russian-speakers-anki-deck · prep2go.study mock · не официальная запись на CAPLE
        </p>
      </div>
    </section>
  );
}
