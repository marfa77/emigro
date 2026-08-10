"use client";

import { useEffect } from "react";

/** Root layout keeps lang="ru"; ES segment flips document language for crawlers/a11y. */
export function EsDocumentLang() {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = "es";
    return () => {
      document.documentElement.lang = previous || "ru";
    };
  }, []);

  return null;
}
