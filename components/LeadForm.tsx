"use client";

import Link from "next/link";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics/client";

interface LeadFormProps {
  corridorSlug: string;
  sessionId?: string;
  programSlugs: string[];
  defaultPassport?: string;
  countryRu?: string;
}

export function LeadForm({ corridorSlug, sessionId, programSlugs, defaultPassport, countryRu = "Португалии" }: LeadFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telegram, setTelegram] = useState("");
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<string[]>(programSlugs.slice(0, 2));
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`/api/v1/corridors/${corridorSlug}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          name,
          email,
          telegram,
          notes,
          passport_iso2: defaultPassport ?? "RU",
          selected_program_slugs: selected,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      trackEvent("lead_submitted", {
        corridor_slug: corridorSlug,
        session_id: sessionId ?? "",
        programs: selected.join(","),
      });
      setStatus("done");
      setMessage("Заявка отправлена. Мы свяжемся с выбранными фирмами из справочника.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ошибка";
      trackEvent("lead_error", { corridor_slug: corridorSlug, message: msg });
      setStatus("error");
      setMessage(msg);
    }
  }

  if (status === "done") {
    return <p className="rounded-lg bg-green-50 p-4 text-green-800">{message}</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold">Запросить контакты из справочника</h3>
      <p className="text-sm text-slate-600">
        Список фирм из справочника после wizard. Детальный разбор маршрута —{" "}
        <Link href="/ru/assist" className="text-corridor-600 hover:underline">
          Route Check (€129)
        </Link>
        .
      </p>

      <input
        required
        placeholder="Имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
      />
      <input
        placeholder="Telegram (необязательно)"
        value={telegram}
        onChange={(e) => setTelegram(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
      />
      <textarea
        placeholder="Комментарий"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
        rows={3}
      />

      <fieldset>
        <legend className="text-sm font-medium">Интересующие маршруты</legend>
        <div className="mt-2 space-y-1">
          {programSlugs.map((slug) => (
            <label key={slug} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(slug)}
                onChange={(e) => {
                  setSelected((prev) =>
                    e.target.checked ? [...prev, slug] : prev.filter((s) => s !== slug)
                  );
                }}
              />
              {slug}
            </label>
          ))}
        </div>
      </fieldset>

      {status === "error" && <p className="text-sm text-red-600">{message}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-corridor-600 py-3 font-medium text-white hover:bg-corridor-700 disabled:opacity-60"
      >
        {status === "loading" ? "Отправка..." : "Запросить контакты"}
      </button>
      <p className="text-xs text-slate-500">
        Отправляя форму, вы соглашаетесь с{" "}
        <Link href="/ru/privacy" className="text-corridor-600 hover:underline">
          политикой конфиденциальности
        </Link>{" "}
        и передачей контактов выбранным фирмам из справочника для обработки заявки.
      </p>
    </form>
  );
}
