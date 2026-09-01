"use client";

import { useState } from "react";
import { ArrowRight, BookOpen, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import { portugalSatelliteUrlFromWizard } from "@/lib/portugal/hub";
import { portoChatDeepLink } from "@/lib/telegram/deep-link";
import { tapTarget } from "@/lib/ui/mobile";

export type WizardPortugalPracticePlacement = "wizard_hub_results" | "wizard_corridor_results";

type Where = "in_norte" | "arriving" | "looking";
type Need = "practice" | "visas";

type Props = {
  sessionId: string;
  placement: WizardPortugalPracticePlacement;
};

const WHERE_OPTIONS: Array<{ id: Where; label: string }> = [
  { id: "in_norte", label: "Уже в Porto / Norte" },
  { id: "arriving", label: "Еду в ближайшие ~90 дней" },
  { id: "looking", label: "Пока смотрю из другой страны" },
];

const NEED_OPTIONS: Array<{ id: Need; label: string }> = [
  { id: "practice", label: "Быт и практика: NIF, районы, выходные" },
  { id: "visas", label: "Документы, пороги, AIMA — это не чат" },
];

function ChoiceRow<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: Array<{ id: T; label: string }>;
  value: T | null;
  onChange: (id: T) => void;
}) {
  return (
    <fieldset className="mt-4">
      <legend className="text-sm font-medium text-slate-800">{legend}</legend>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(opt.id)}
              className={`${tapTarget} rounded-lg border px-3 py-2 text-left text-sm font-medium transition sm:max-w-xs ${
                selected
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-teal-200 bg-white text-slate-700 hover:border-teal-400"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function WizardPortugalPracticeCta({ sessionId, placement }: Props) {
  const [where, setWhere] = useState<Where | null>(null);
  const [need, setNeed] = useState<Need | null>(null);

  const showNeed = where === "in_norte" || where === "arriving";
  const showSatellite = where !== null;
  const showChat = showNeed && need === "practice";
  const showVisaRedirect = showNeed && need === "visas";
  const showLookingNote = where === "looking";

  const hubHref = portugalSatelliteUrlFromWizard("/", placement, "hub");
  const nifHref = portugalSatelliteUrlFromWizard("/notes/nif-porto-kak-poluchit-2026", placement, "nif");
  const monthHref = portugalSatelliteUrlFromWizard(
    "/notes/pervyj-mesyac-portugaliya-checklist",
    placement,
    "first_month"
  );
  const chatHref = portoChatDeepLink(placement === "wizard_hub_results" ? "wizhub" : "wizcorr");

  function trackWhere(next: Where) {
    setWhere(next);
    setNeed(null);
    trackEvent("wizard_results_click", {
      session_id: sessionId,
      placement,
      link_label: "portugal_practice_where",
      where: next,
    });
  }

  function trackNeed(next: Need) {
    setNeed(next);
    trackEvent("wizard_results_click", {
      session_id: sessionId,
      placement,
      link_label: "portugal_practice_need",
      where: where ?? "",
      need: next,
    });
  }

  function trackOutbound(label: string, href: string, extra?: Record<string, string>) {
    trackEvent("wizard_results_click", {
      session_id: sessionId,
      placement,
      link_label: label,
      target_path: href,
      where: where ?? "",
      need: need ?? "",
      ...extra,
    });
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/80 to-white p-5 sm:p-6"
      aria-labelledby="wizard-pt-practice-heading"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">Практика в Norte</p>
      <h2 id="wizard-pt-practice-heading" className="mt-1 text-xl font-semibold text-slate-900">
        Почитать, как там живут — не вместо Route Check
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Выше — маршрут и документы. Сателлит — короткие гайды из жизни Porto/Norte. Чат «Порту и вокруг» — городской
        быт, не разбор порогов D8 и не очередь AIMA. Сначала два уточнения, чтобы не кидать всех в одну комнату.
      </p>

      <ChoiceRow
        legend="Где вы сейчас?"
        options={WHERE_OPTIONS}
        value={where}
        onChange={trackWhere}
      />

      {showNeed ? (
        <ChoiceRow
          legend="Что сейчас нужнее?"
          options={NEED_OPTIONS}
          value={need}
          onChange={trackNeed}
        />
      ) : null}

      {showLookingNote ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          Пока вы не в Norte, чат рано: там говорят про районы и выходные, а не «какой доход для D8». Имеет смысл
          сначала почитать практику — и вернуться к чату, когда будете на месте.
        </p>
      ) : null}

      {showVisaRedirect ? (
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          Документы и пороги — это Route Check выше, не городской чат. На сателлите можно отдельно посмотреть заметки
          про AIMA и первый месяц, без входа в группу.
        </p>
      ) : null}

      {showSatellite ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={hubHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutbound("portugal_satellite_hub", hubHref)}
            className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800`}
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            Практика на сателлите
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href={where === "looking" ? monthHref : nifHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackOutbound(where === "looking" ? "portugal_satellite_first_month" : "portugal_satellite_nif", where === "looking" ? monthHref : nifHref)
            }
            className={`inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg border border-teal-300 bg-white px-4 py-2.5 text-sm font-semibold text-teal-900 hover:border-teal-500`}
          >
            {where === "looking" ? "Первый месяц в PT" : "NIF в Porto"}
          </a>
        </div>
      ) : null}

      {showChat ? (
        <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50/80 p-4">
          <p className="text-sm leading-relaxed text-slate-700">
            Тогда чат уместен: быт, жильё, встречи. Бот пришлёт одноразовую ссылку в личку — без публичного @ и без
            стены объявлений.
          </p>
          <a
            href={chatHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackOutbound("portugal_porto_chat", chatHref);
              trackEvent("community_join_click", {
                source: placement,
                session_id: sessionId,
                country: "portugal",
                where: where ?? "",
              });
            }}
            className={`mt-3 inline-flex ${tapTarget} items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-800`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Запросить вход в чат Porto
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      ) : null}
    </section>
  );
}
