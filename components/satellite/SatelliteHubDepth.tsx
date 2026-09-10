import Link from "next/link";
import type { SatelliteCountryKey } from "@/lib/community-notes/seed";
import {
  satelliteAssistUrl,
  satellitePillarUrl,
  satelliteWizardUrl,
} from "@/lib/satellite/funnel-urls";
import { PARTNER_LINK_REL } from "@/lib/partners/link";
import { liveCityChatForCountry } from "@/lib/satellite/city-chats";
import { cityChatLead } from "@/lib/satellite/city-chat-copy";

type Props = {
  countryKey: string;
  guideCount: number;
  noteCount: number;
  feedCount: number;
  topicCount: number;
  destinationsLabel: string;
};

const ACCENT: Record<string, { shell: string; link: string; label: string }> = {
  portugal: { shell: "border-teal-200 bg-teal-50/70", link: "text-teal-800", label: "Португалия" },
  spain: { shell: "border-amber-200 bg-amber-50/70", link: "text-amber-900", label: "Испания" },
  italy: { shell: "border-emerald-200 bg-emerald-50/70", link: "text-emerald-900", label: "Италия" },
};

function funnelKey(countryKey: string): SatelliteCountryKey {
  if (countryKey === "spain" || countryKey === "italy") return countryKey;
  return "portugal";
}

/**
 * Visible depth signal for satellite hubs — live inventory so Google/LLMs
 * see a stocked navigator, not a thin affiliate shell.
 */
export function SatelliteHubDepth({
  countryKey,
  guideCount,
  noteCount,
  feedCount,
  topicCount,
  destinationsLabel,
}: Props) {
  const accent = ACCENT[countryKey] ?? {
    shell: "border-slate-200 bg-slate-50/70",
    link: "text-slate-800",
    label: countryKey,
  };
  const { shell, link, label: countryLabel } = accent;
  const key = funnelKey(countryKey);
  const pillarHref = satellitePillarUrl({ countryKey: key, placement: "satellite_hub", content: "depth" });
  const wizardHref = satelliteWizardUrl({ countryKey: key, placement: "satellite_hub", content: "depth" });
  const assistHref = satelliteAssistUrl({ countryKey: key, placement: "satellite_hub", content: "depth" });
  const cityChat = liveCityChatForCountry(countryKey);

  return (
    <section
      className={`mt-6 rounded-xl border px-4 py-4 sm:px-5 ${shell}`}
      aria-label={`Инвентарь сателлита ${countryLabel}`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Не тонкий SEO-слой</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700">
        Сейчас на сателлите:{" "}
        <strong>
          {guideCount} гайдов · {feedCount} заметок · {noteCount} материалов всего
        </strong>
        {topicCount > 0 ? (
          <>
            {" "}
            · <strong>{topicCount} тем</strong> ({destinationsLabel})
          </>
        ) : null}
        . Pillar ВНЖ и wizard — на{" "}
        <a href={pillarHref} className={`font-medium underline ${link}`}>
          emigro.online
        </a>
        {" · "}
        <a href={wizardHref} className={`font-medium underline ${link}`}>
          подобрать маршрут
        </a>
        {" · "}
        <a href={assistHref} className={`font-medium underline ${link}`}>
          бесплатно найти специалиста
        </a>
        {countryKey === "portugal" ? (
          <>
            {" · "}
            CIPLE A2 mock —{" "}
            <a
              href="https://www.prep2go.study/ciple-a2-mock-test?utm_source=emigro&utm_medium=satellite&utm_campaign=portugal_hub&utm_content=depth"
              target="_blank"
              rel={PARTNER_LINK_REL}
              className={`font-medium underline ${link}`}
            >
              Prep2Go
            </a>
          </>
        ) : null}
        .
      </p>
      {cityChat ? (
        <p className="mt-2 text-sm leading-relaxed text-slate-700">
          Фишка сателлита — закрытый чат «{cityChat.chatTitleRu}». {cityChatLead(cityChat)}
        </p>
      ) : null}
      {countryKey === "portugal" ? (
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          Фокус Norte (Порту, Брага, Minho) + практика Lisboa/AIMA. Schengen-туризм ≠ ВНЖ: сначала канал AIMA /
          Finanças, потом слоты.{" "}
          <Link href="/notes/aima-agora-zapis-2026" className={`font-medium underline ${link}`}>
            Запись AIMA / Agora
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}
