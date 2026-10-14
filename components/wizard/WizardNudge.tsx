"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, X } from "lucide-react";
import { HUB_WIZARD_PATH } from "@/lib/corridor/paths";

const DISMISS_KEY = "emigro-wizard-nudge-dismissed:v1";
const ANCHOR_ID = "wizard-nudge-inline";

const COPY = {
  title: "Не знаете, что выбрать?",
  body: "Пройдите бесплатный подбор маршрута за 2 минуты: паспорт, доход и семья — и сразу видно, какие ВНЖ вам подходят.",
  cta: "Подобрать маршрут",
};

type NudgeProps = {
  /** Prefix for data-placement → wizard_cta_click (e.g. ru_home, ru_guides). */
  placement: string;
  href?: string;
  className?: string;
};

export function WizardNudgeBlock({ placement, href = HUB_WIZARD_PATH, className = "" }: NudgeProps) {
  return (
    <section
      id={ANCHOR_ID}
      className={`flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-corridor-700 to-corridor-600 p-5 text-white shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Compass className="mt-0.5 h-6 w-6 shrink-0 text-corridor-100" aria-hidden />
        <div>
          <h2 className="text-lg font-bold">{COPY.title}</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-corridor-50">{COPY.body}</p>
        </div>
      </div>
      <Link
        href={href}
        data-placement={`${placement}_nudge_inline`}
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-corridor-800 hover:bg-corridor-50"
      >
        {COPY.cta}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
}

/** Desktop-only: mobile already has the fixed MobileBottomBar with the same CTA. */
export function WizardNudgeFloating({ placement, href = HUB_WIZARD_PATH }: NudgeProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const pastFirstScreen = window.scrollY > window.innerHeight * 0.9;
      const anchor = document.getElementById(ANCHOR_ID);
      const rect = anchor?.getBoundingClientRect();
      const inlineOnScreen = rect ? rect.bottom > 0 && rect.top < window.innerHeight : false;
      setVisible(pastFirstScreen && !inlineOnScreen);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // private mode
    }
  }

  return (
    <aside
      className="fixed bottom-6 right-6 z-30 hidden w-80 rounded-2xl border border-corridor-200 bg-white p-4 shadow-xl shadow-slate-900/10 md:block"
      aria-label={COPY.title}
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label="Скрыть"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
      <p className="pr-6 font-semibold text-slate-900">{COPY.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        Бесплатный подбор маршрута за 2 минуты — какие ВНЖ подходят по паспорту, доходу и семье.
      </p>
      <Link
        href={href}
        data-placement={`${placement}_nudge_floating`}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-corridor-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-corridor-700"
      >
        {COPY.cta}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </aside>
  );
}
