"use client";

import { useEffect } from "react";

/**
 * Root layout sets lang from middleware (`x-emigro-ui-locale`) for SSR/crawlers.
 * This client flip keeps lang="es" on client navigations within /es and restores on leave.
 */
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
