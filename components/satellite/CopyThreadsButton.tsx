"use client";

import { useState } from "react";
import { tapTarget } from "@/lib/ui/mobile";

export function CopyThreadsButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex ${tapTarget} items-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-teal-400 hover:text-teal-800`}
    >
      {copied ? "Скопировано ✓" : "Скопировать для Threads"}
    </button>
  );
}
