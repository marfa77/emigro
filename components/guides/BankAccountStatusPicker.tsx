"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { guideHeadingId } from "@/lib/guides/heading-id";

type Residence = "none" | "d" | "permit" | "citizen";
type Country = "pt" | "es" | "de" | "other";
type Passport = "ru" | "by" | "dual";

const RESIDENCE: { id: Residence; label: string }[] = [
  { id: "none", label: "Нет ВНЖ, живу за пределами ЕС" },
  { id: "d", label: "Есть долгосрочная виза D" },
  { id: "permit", label: "Есть ВНЖ ЕС / ЕЭЗ / Швейцарии" },
  { id: "citizen", label: "Есть гражданство ЕС / ЕЭЗ / Швейцарии" },
];

const COUNTRIES: { id: Country; label: string; heading: string }[] = [
  { id: "pt", label: "Португалия", heading: "Банки Португалии" },
  { id: "es", label: "Испания", heading: "Банки Испании" },
  { id: "de", label: "Германия", heading: "Банки Германии" },
  { id: "other", label: "Другая страна", heading: "Счёт с ВНЖ: банки и финтехи" },
];

const PASSPORTS: { id: Passport; label: string }[] = [
  { id: "ru", label: "Россия" },
  { id: "by", label: "Беларусь" },
  { id: "dual", label: "Двойное гражданство ЕС и РФ" },
];

const WIZARD =
  "/ru/wizard?utm_source=emigro&utm_medium=guide&utm_campaign=bank_iban_2026&utm_content=status_picker";

function advice(residence: Residence, country: Country, passport: Passport): { lead: string; read: string } {
  const place = COUNTRIES.find((item) => item.id === country)!;
  const by = passport === "by";
  const person = by ? "гражданину Беларуси" : "гражданину РФ";

  if (passport === "dual" || residence === "citizen") {
    return {
      lead: "Гражданство ЕС, ЕЭЗ или Швейцарии — это исключение Article 5b(3): запрет на карты и электронные деньги к вам не применяется только из-за второго паспорта РФ. Банк всё равно проверит, кто вы, где живёте и откуда деньги. Это не открытие счёта.",
      read: place.heading,
    };
  }

  if (residence === "none") {
    return {
      lead: by
        ? "Без права проживания в ЕС, ЕЭЗ или Швейцарии новую карту и электронные деньги вам, как правило, не выпустят. Paysera по своей политике не открывает счета гражданам Беларуси без резидентства ЕС. Wise может оставить переводы на уже открытом балансе и при этом заблокировать карту. Местный банк смотрит статус, а не только паспорт."
        : "Без права проживания в ЕС, ЕЭЗ или Швейцарии новую карту и электронные деньги гражданину РФ, как правило, не выпустят (Article 5b(2)). Paysera публично не открывает такие счета без резидентства ЕС. У Wise адрес не может быть в России, а карта — отдельное ограничение. Депозит свыше €100 000 в одном банке ЕС тоже под запретом, пока нет исключения 5b(3).",
      read: "Счёт без ВНЖ: что реально доступно",
    };
  }

  if (residence === "d") {
    return {
      lead: `Зарегистрированная виза D по разъяснению Еврокомиссии от 13 марта 2026 обычно может попадать в исключение Article 5b(3), если вы встали на учёт по месту жительства. Провайдеры строже закона: Paysera писала, что виза D — не ВНЖ, Revolut в конце 2025 года требовал карту ВНЖ, Wise для карты принимает визу длиннее 90 дней. Для ${person} это повод проверить сервис до перевода всех денег, а не гарантия счёта в ${place.label === "Другая страна" ? "выбранной стране" : place.label}.`,
      read: "Счёт без ВНЖ: что реально доступно",
    };
  }

  return {
    lead: `ВНЖ в ЕС, ЕЭЗ или Швейцарии — основание для исключения Article 5b(3), но не автоматическое «да» от Wise, Revolut, Paysera или N26. Банк смотрит гражданство, адрес, налог и полную цепочку денег. Начните с местного банка в стране проживания и держите второй канал на время продления ВНЖ.`,
    read: place.heading,
  };
}

function Choice<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T | null;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-slate-950">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={`rounded-full border px-3 py-1.5 text-left text-sm leading-snug transition ${
                selected
                  ? "border-corridor-700 bg-corridor-700 text-white"
                  : "border-slate-200 bg-white text-slate-800 hover:border-corridor-300"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function BankAccountStatusPicker() {
  const [residence, setResidence] = useState<Residence | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [passport, setPassport] = useState<Passport | null>(null);
  const [shown, setShown] = useState(false);

  const ready = residence !== null && country !== null && passport !== null;
  const result = useMemo(
    () => (ready && shown ? advice(residence, country, passport) : null),
    [ready, shown, residence, country, passport],
  );

  return (
    <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-950/5 sm:p-7">
      <h2 className="text-xl font-bold tracking-tight text-slate-950">Какой у вас статус в Европе?</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Предварительная навигация по гайду. Это не проверка банка и не обещание открыть счёт.
      </p>
      <div className="mt-5 space-y-5">
        <Choice legend="1. Статус проживания" value={residence} options={RESIDENCE} onChange={(id) => { setResidence(id); setShown(false); }} />
        <Choice legend="2. Страна, где хотите обслуживаться" value={country} options={COUNTRIES} onChange={(id) => { setCountry(id); setShown(false); }} />
        <Choice legend="3. Паспорт" value={passport} options={PASSPORTS} onChange={(id) => { setPassport(id); setShown(false); }} />
      </div>
      <button
        type="button"
        disabled={!ready}
        onClick={() => setShown(true)}
        className="mt-6 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Подобрать, что читать
      </button>
      {result ? (
        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm leading-relaxed text-slate-800">
          <p>{result.lead}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            <a href={`#${guideHeadingId(result.read)}`} className="font-semibold text-corridor-800 underline-offset-2 hover:underline">
              Раздел «{result.read}»
            </a>
            <Link href={WIZARD} className="font-semibold text-corridor-800 underline-offset-2 hover:underline">
              Подобрать маршрут ВНЖ в wizard
            </Link>
          </p>
        </div>
      ) : null}
    </section>
  );
}
