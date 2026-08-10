"use client";

import { useEffect } from "react";

/** Keep document lang="fr" on client navigations within /fr. */
export function FrDocumentLang() {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = "fr";
    return () => {
      document.documentElement.lang = previous || "ru";
    };
  }, []);

  return null;
}
