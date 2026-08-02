"use client";

import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { PARTNER_LINK_REL } from "@/lib/partners/link";
import { pixIdPhotoUrl } from "@/lib/pixid/catalog";
import { tapTarget } from "@/lib/ui/mobile";

type Props = {
  noteSlug: string;
  topicKey?: string;
};

export function PixIDPromo({ noteSlug, topicKey = "portugal" }: Props) {
  const href = pixIdPhotoUrl({
    topicKey,
    medium: "satellite",
    campaign: "visa_passport_photo",
    content: noteSlug,
  });

  function handleClick() {
    trackEvent("provider_click", {
      provider_id: "pixid",
      placement: "satellite_photo_note",
      topic_key: topicKey,
      note_slug: noteSlug,
    });
  }

  return (
    <section
      className="mt-10 rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 sm:p-6"
      aria-labelledby="pixid-promo-heading"
    >
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Сестринский продукт · PixID</p>
      <h2 id="pixid-promo-heading" className="mt-2 text-lg font-semibold text-slate-900">
        Фото на визу / паспорт — онлайн за ~$4.99
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        PixID.studio готовит compliant JPEG под Schengen и национальные визы: 100 проверок + AI vision, без ретуши
        лица (важно для правил 2026). Подходит для консульского пакета и digital upload, если консульство принимает
        файл.
      </p>
      <a
        href={href}
        target="_blank"
        rel={PARTNER_LINK_REL}
        onClick={handleClick}
        className={`mt-4 inline-flex ${tapTarget} items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800`}
      >
        Сделать фото на PixID
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-3 text-xs text-slate-500">pixid.studio · семейство PixID Studio · не заменяет требования конкретного консульства</p>
    </section>
  );
}
