"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { COMMUNITY_PATH } from "@/lib/community";

type NavLink = {
  href: string;
  label: string;
};

type MobileNavProps = {
  links: NavLink[];
};

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!open || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-corridor-600"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/20"
            aria-label="Закрыть меню"
            onClick={close}
          />
          <div
            id="mobile-nav-panel"
            ref={panelRef}
            className="absolute left-0 right-0 top-full z-50 border-b border-slate-200 bg-white shadow-lg"
          >
            <nav className="flex flex-col px-4 py-3" aria-label="Мобильное меню">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border-b border-slate-100 py-3 text-base text-slate-700 last:border-b-0 hover:text-corridor-600"
                  onClick={close}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex justify-end border-t border-slate-100 px-4 py-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-corridor-600"
                onClick={close}
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Закрыть
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

type MobileBottomBarProps = {
  locale?: "ru" | "en";
};

export function MobileBottomBar({ locale = "ru" }: MobileBottomBarProps) {
  const chatLabel = locale === "ru" ? "Чат" : "Chat";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur md:hidden">
      <div
        className="mx-auto flex max-w-5xl gap-2 px-4 py-2"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <Link
          href="/ru/wizard"
          className="flex flex-1 items-center justify-center rounded-lg bg-corridor-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-corridor-700"
        >
          Wizard
        </Link>
        <Link
          href={COMMUNITY_PATH}
          className="flex flex-1 items-center justify-center rounded-lg border border-corridor-200 bg-white px-4 py-2.5 text-sm font-medium text-corridor-700 hover:border-corridor-300 hover:bg-corridor-50"
        >
          {chatLabel}
        </Link>
      </div>
    </div>
  );
}
