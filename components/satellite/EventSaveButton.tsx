"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "emigro-pt-saved-events";

function readSaved(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function EventSaveButton({ slug, variant = "label" }: { slug: string; variant?: "icon" | "label" }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readSaved().includes(slug));
  }, [slug]);

  function toggle() {
    const next = new Set(readSaved());
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    setSaved(next.has(slug));
    window.dispatchEvent(new Event("emigro-pt-saves"));
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? "Убрать из избранного" : "В избранное"}
        onClick={toggle}
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${saved ? "text-rose-600" : "text-slate-400 hover:text-rose-600"}`}
      >
        <Heart filled={saved} />
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      onClick={toggle}
      className={`inline-flex min-h-[44px] items-center rounded-full border px-3 text-sm ${
        saved ? "border-rose-300 bg-rose-50 text-rose-800" : "border-slate-300 bg-white text-slate-700"
      }`}
    >
      {saved ? "В избранном" : "В избранное"}
    </button>
  );
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
    </svg>
  );
}

export function savedEventSlugs(): string[] {
  if (typeof window === "undefined") return [];
  return readSaved();
}
