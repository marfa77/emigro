"use client";

import type { ReactNode } from "react";
import { BookOpen, ExternalLink, FlaskConical } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { tapTarget } from "@/lib/ui/mobile";
import { PARTNER_LINK_REL } from "@/lib/partners/link";
import {
  type UniPrepLocale,
  type UniPrepOffer,
  UNIPREP_CITIZENSHIP_HUB,
  getUniPrepOfferForTopic,
  getUniPrepOfferForTopics,
  uniPrepLinkBlurb,
  uniPrepLinkTitle,
  uniPrepOfferCopy,
  withPrep2GoUtm,
  withUniPrepUtm,
} from "@/lib/uniprep2go/catalog";

export type UniPrepPlacement =
  | "guide_article"
  | "guide_sidebar"
  | "corridor_landing"
  | "digest"
  | "wizard_results"
  | "citizenship_hub"
  | "destination_hub";

type Props = {
  placement: UniPrepPlacement;
  topicKey?: string;
  topicKeys?: string[];
  /** Override resolved offer (e.g. multi-country citizenship guide). */
  offer?: UniPrepOffer | null;
  contentId?: string;
  compact?: boolean;
  className?: string;
  locale?: UniPrepLocale;
};

function resolveOffer(props: Props): UniPrepOffer | null {
  if (props.offer !== undefined) return props.offer;
  if (props.topicKey) return getUniPrepOfferForTopic(props.topicKey);
  return getUniPrepOfferForTopics(props.topicKeys);
}

function trackClick(params: {
  placement: UniPrepPlacement;
  topicKey?: string;
  product: "mock" | "deck" | "prep2go_mock" | "hub";
  path: string;
  contentId?: string;
}) {
  trackEvent("provider_click", {
    provider_id: "uniprep2go",
    placement: params.placement,
    topic_key: params.topicKey,
    product: params.product,
    path: params.path,
    content_id: params.contentId,
  });
}

function CtaLink({
  href,
  children,
  onClick,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  const base =
    variant === "primary"
      ? "bg-teal-700 text-white hover:bg-teal-800"
      : "border border-teal-300 bg-white text-teal-900 hover:bg-teal-50";
  return (
    <a
      href={href}
      target="_blank"
      rel={PARTNER_LINK_REL}
      onClick={onClick}
      className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${base}`}
    >
      {children}
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}

/** Multi-country citizenship guides (PT+ES, DE+PL). */
export function UniPrepCitizenshipHubPromo({
  placement,
  contentId,
  className = "",
  locale = "ru",
}: {
  placement: UniPrepPlacement;
  contentId?: string;
  className?: string;
  locale?: UniPrepLocale;
}) {
  const hubHref = withUniPrepUtm(UNIPREP_CITIZENSHIP_HUB.path, {
    medium: placement,
    campaign: "citizenship_hub",
    content: contentId,
  });
  const decksHref = withUniPrepUtm("/language-certification-decks", {
    medium: placement,
    campaign: "citizenship_hub",
    content: contentId ? `${contentId}_decks` : "decks",
  });

  const isEs = locale === "es";

  return (
    <section
      className={`rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5 sm:p-6 ${className}`}
      aria-labelledby="uniprep-hub-heading"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
        {isEs ? "Producto hermano · UniPrep2Go" : "Сестринский продукт · UniPrep2Go"}
      </p>
      <h2 id="uniprep-hub-heading" className="mt-2 text-lg font-semibold text-slate-900">
        {isEs ? "Mocks y mazos Anki para naturalización" : "Моки и Anki-колоды для натурализации"}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        {isEs
          ? "Checks timed gratuitos (CCSE, Leben in Deutschland, naturalisation FR, PL, CZ…) y mazos Anki para exámenes de idioma (CIPLE, DELE, CELI, DELF, German A2). No son exámenes oficiales — material de estudio UniPrep2Go."
          : "Бесплатные timed readiness checks (CCSE, Leben in Deutschland, naturalisation FR, PL, CZ…) и Anki-колоды для языковых экзаменов (CIPLE, DELE, CELI, DELF, German A2). Не официальные экзамены — учебные материалы UniPrep2Go."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <CtaLink
          href={hubHref}
          onClick={() =>
            trackClick({
              placement,
              product: "hub",
              path: UNIPREP_CITIZENSHIP_HUB.path,
              contentId,
            })
          }
        >
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
          {isEs ? "Ver mocks" : "Смотреть моки"}
        </CtaLink>
        <CtaLink
          href={decksHref}
          variant="secondary"
          onClick={() =>
            trackClick({
              placement,
              product: "deck",
              path: "/language-certification-decks",
              contentId,
            })
          }
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          {isEs ? "Mazos Anki" : "Anki-колоды"}
        </CtaLink>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {isEs
          ? "uniprep2go.study · familia PixID Studio · no sustituye la inscripción oficial al examen"
          : "uniprep2go.study · семейство PixID Studio · не заменяет официальную запись на экзамен"}
      </p>
    </section>
  );
}

export function UniPrep2GoPromo({
  placement,
  topicKey,
  topicKeys,
  offer: offerProp,
  contentId,
  compact = false,
  className = "",
  locale = "ru",
}: Props) {
  const offer = resolveOffer({ placement, topicKey, topicKeys, offer: offerProp });
  if (!offer) return null;

  const copy = uniPrepOfferCopy(offer, locale);
  const campaign = `uniprep_${offer.topicKey}`;
  const content = contentId ?? offer.topicKey;
  const isEs = locale === "es";

  const mockHref = offer.mock
    ? withUniPrepUtm(offer.mock.path, { medium: placement, campaign, content: `${content}_mock` })
    : null;
  const deckHref = offer.deck
    ? withUniPrepUtm(offer.deck.path, { medium: placement, campaign, content: `${content}_deck` })
    : null;
  const prep2goHref = offer.prep2goMock
    ? withPrep2GoUtm(offer.prep2goMock.path, {
        medium: placement,
        campaign: `prep2go_${offer.topicKey}`,
        content: `${content}_prep2go_mock`,
      })
    : null;

  if (compact) {
    const primaryHref = mockHref ?? deckHref ?? prep2goHref;
    const primaryLabel = offer.mock
      ? uniPrepLinkTitle(offer.mock, locale)
      : offer.deck
        ? uniPrepLinkTitle(offer.deck, locale)
        : offer.prep2goMock
          ? uniPrepLinkTitle(offer.prep2goMock, locale)
          : "UniPrep2Go";
    if (!primaryHref) return null;
    return (
      <section
        className={`rounded-xl border border-teal-200 bg-teal-50/80 p-4 ${className}`}
        aria-label="UniPrep2Go"
      >
        <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
          {isEs ? `Recomendamos · ${copy.examLabel}` : `Рекомендуем · ${copy.examLabel}`}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-900">{copy.headline}</p>
        <a
          href={primaryHref}
          target="_blank"
          rel={PARTNER_LINK_REL}
          onClick={() =>
            trackClick({
              placement,
              topicKey: offer.topicKey,
              product: offer.mock ? "mock" : offer.deck ? "deck" : "prep2go_mock",
              path: offer.mock?.path ?? offer.deck?.path ?? offer.prep2goMock?.path ?? "",
              contentId: content,
            })
          }
          className={`mt-3 inline-flex ${tapTarget} items-center gap-1.5 text-sm font-semibold text-teal-800 underline-offset-2 hover:underline`}
        >
          {primaryLabel}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </section>
    );
  }

  return (
    <section
      className={`rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-5 sm:p-6 ${className}`}
      aria-labelledby={`uniprep-promo-${offer.topicKey}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-teal-800">
        {isEs ? "Producto hermano · UniPrep2Go" : "Сестринский продукт · UniPrep2Go"}
      </p>
      <h2 id={`uniprep-promo-${offer.topicKey}`} className="mt-2 text-lg font-semibold text-slate-900">
        {copy.headline}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{copy.body}</p>

      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {offer.mock && (
          <li className="flex gap-2">
            <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
            <span>
              <strong>{uniPrepLinkTitle(offer.mock, locale)}</strong> — {uniPrepLinkBlurb(offer.mock, locale)}
            </span>
          </li>
        )}
        {offer.deck && (
          <li className="flex gap-2">
            <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
            <span>
              <strong>{uniPrepLinkTitle(offer.deck, locale)}</strong> — {uniPrepLinkBlurb(offer.deck, locale)}
            </span>
          </li>
        )}
        {offer.prep2goMock && (
          <li className="flex gap-2">
            <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" aria-hidden="true" />
            <span>
              <strong>{uniPrepLinkTitle(offer.prep2goMock, locale)}</strong> —{" "}
              {uniPrepLinkBlurb(offer.prep2goMock, locale)}
            </span>
          </li>
        )}
      </ul>

      <div className="mt-4 flex flex-wrap gap-3">
        {mockHref && offer.mock && (
          <CtaLink
            href={mockHref}
            onClick={() =>
              trackClick({
                placement,
                topicKey: offer.topicKey,
                product: "mock",
                path: offer.mock!.path,
                contentId: content,
              })
            }
          >
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            {uniPrepLinkTitle(offer.mock, locale)}
          </CtaLink>
        )}
        {deckHref && offer.deck && (
          <CtaLink
            href={deckHref}
            variant={mockHref ? "secondary" : "primary"}
            onClick={() =>
              trackClick({
                placement,
                topicKey: offer.topicKey,
                product: "deck",
                path: offer.deck!.path,
                contentId: content,
              })
            }
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            {uniPrepLinkTitle(offer.deck, locale)}
          </CtaLink>
        )}
        {prep2goHref && offer.prep2goMock && (
          <CtaLink
            href={prep2goHref}
            variant="secondary"
            onClick={() =>
              trackClick({
                placement,
                topicKey: offer.topicKey,
                product: "prep2go_mock",
                path: offer.prep2goMock!.path,
                contentId: content,
              })
            }
          >
            {uniPrepLinkTitle(offer.prep2goMock, locale)}
          </CtaLink>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {isEs
          ? "uniprep2go.study · familia PixID Studio · material de estudio, no examen oficial"
          : "uniprep2go.study · семейство PixID Studio · учебные материалы, не официальный экзамен"}
      </p>
    </section>
  );
}
