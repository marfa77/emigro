"use client";

import { useEffect } from "react";

export function EnDocumentLang() {
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = "en";
    return () => {
      document.documentElement.lang = previous || "ru";
    };
  }, []);

  return null;
}
