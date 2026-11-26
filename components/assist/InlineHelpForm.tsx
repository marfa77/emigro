"use client";

import { useEffect, useState } from "react";
import { QuickRequestForm } from "@/components/assist/QuickRequestForm";

type Props = {
  source: string;
  countryLabel: string;
  countrySegment?: string;
  corridorSlug?: string;
  programRoute?: string;
  className?: string;
};

const SESSION_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The help form itself, inline — no hop to /ru/assist. When the visitor arrives from quiz
 * results (`?session=…`), the request carries their results link.
 */
export function InlineHelpForm({ source, countryLabel, countrySegment, corridorSlug, programRoute, className = "" }: Props) {
  const [session, setSession] = useState<{ id: string; resultsPath: string } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session") ?? "";
    const from = params.get("from") ?? "";
    if (!SESSION_RE.test(id)) return;
    const resultsPath = /^\/ru\/[a-z0-9-]+\/results$/.test(from) ? `${from}?session=${id}` : `/ru/wizard/results?session=${id}`;
    setSession({ id, resultsPath });
  }, []);

  return (
    <section id="help" className={`scroll-mt-24 rounded-2xl border border-corridor-200 bg-corridor-50 p-5 sm:p-6 ${className}`}>
      <h2 className="text-xl font-bold text-slate-950">Получить помощь с этим маршрутом</h2>
      <p className="mt-2 mb-4 max-w-2xl text-sm leading-relaxed text-slate-700">
        Опишите коротко свою ситуацию и оставьте контакт — передадим ваш случай специалисту, который ведёт такие
        маршруты, он свяжется с вами сам. Для вас бесплатно: комиссию Emigro платит специалист.
      </p>
      <QuickRequestForm
        source={session ? `${source}_from_quiz` : source}
        countryLabel={countryLabel}
        countrySegment={countrySegment}
        corridorSlug={corridorSlug}
        programRoute={programRoute}
        sessionId={session?.id}
        resultsPath={session?.resultsPath}
        contextNote={session ? "Заявка со страницы программы после квиза." : "Заявка со страницы программы."}
        submitLabel="Получить помощь — бесплатно"
        situationFirst
      />
    </section>
  );
}
