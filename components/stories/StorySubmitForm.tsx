"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";
import {
  STORY_GENRE_HINTS,
  STORY_GENRE_LABELS,
  STORY_ROLE_LABELS,
} from "@/lib/stories/genres";
import { STORIES_INDEX_PATH } from "@/lib/stories/paths";
import { STORY_GENRES, STORY_ROLES, type StoryGenre, type StoryRole } from "@/lib/stories/types";
import { formFieldWhite } from "@/lib/ui/mobile";

const COUNTRY_OPTIONS = [
  "Португалия",
  "Испания",
  "Германия",
  "Франция",
  "Италия",
  "Нидерланды",
  "Греция",
  "Кипр",
  "Хорватия",
  "Грузия",
  "Сербия",
  "Черногория",
  "Другая",
] as const;

type Props = {
  initialGuideSlug?: string;
  disagree?: boolean;
};

export function StorySubmitForm({ initialGuideSlug = "", disagree = false }: Props) {
  const [title, setTitle] = useState(
    disagree ? "Контрапункт: у меня другой опыт по этому гайду" : ""
  );
  const [role, setRole] = useState<StoryRole>("it");
  const [country, setCountry] = useState("Португалия");
  const [countryOther, setCountryOther] = useState("");
  const [genre, setGenre] = useState<StoryGenre>(disagree ? "hot_take" : "lifehack");
  const [body, setBody] = useState("");
  const [wouldDoDifferently, setWouldDoDifferently] = useState("");
  const [contact, setContact] = useState("");
  const [backlinkUrl, setBacklinkUrl] = useState("");
  const [wantBacklink, setWantBacklink] = useState(false);
  const [relatedGuide, setRelatedGuide] = useState(initialGuideSlug);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [notice, setNotice] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setNotice("");

    const resolvedCountry = country === "Другая" ? countryOther.trim() : country;

    try {
      const res = await fetch("/api/v1/stories/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          role,
          country: resolvedCountry,
          genre,
          body: body.trim(),
          would_do_differently: wouldDoDifferently.trim(),
          contact: contact.trim(),
          backlink_url: wantBacklink ? backlinkUrl.trim() : "",
          related_guide_slug: relatedGuide.trim(),
          disagree,
          consent,
        }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Не удалось отправить");

      trackEvent("story_submitted", {
        genre,
        role,
        country: resolvedCountry,
        disagree,
        has_guide: Boolean(relatedGuide.trim()),
      });

      setStatus("done");
    } catch (err) {
      setStatus("error");
      setNotice(err instanceof Error ? err.message : "Ошибка отправки");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-5 py-6 text-emerald-950" aria-live="polite">
        <p className="text-lg font-semibold">История отправлена редакции</p>
        <p className="mt-2 text-sm leading-relaxed">
          Мы прочитаем и напишем вам в Telegram или email, если опубликуем. Обычно ответ — в течение нескольких дней.
        </p>
        <Link href={STORIES_INDEX_PATH} className="mt-4 inline-flex text-sm font-medium text-emerald-900 underline">
          Смотреть опубликованные истории
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {disagree ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Вы не согласны с гайдом — отлично. Напишите короткий контрапункт с фактами из своего опыта. Мы разместим его
          рядом с гайдом после модерации.
        </p>
      ) : null}

      <div>
        <label htmlFor="story-title" className="block text-sm font-medium text-slate-800">
          Заголовок
        </label>
        <input
          id="story-title"
          required
          maxLength={160}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Как я… за … дней / месяцев / евро"
          className={`mt-1.5 ${formFieldWhite}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="story-role" className="block text-sm font-medium text-slate-800">
            Ваша роль
          </label>
          <select
            id="story-role"
            value={role}
            onChange={(e) => setRole(e.target.value as StoryRole)}
            className={`mt-1.5 ${formFieldWhite}`}
          >
            {STORY_ROLES.map((r) => (
              <option key={r} value={r}>
                {STORY_ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="story-country" className="block text-sm font-medium text-slate-800">
            Страна релокации
          </label>
          <select
            id="story-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={`mt-1.5 ${formFieldWhite}`}
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {country === "Другая" ? (
            <input
              required
              maxLength={80}
              value={countryOther}
              onChange={(e) => setCountryOther(e.target.value)}
              placeholder="Какая страна?"
              className={`mt-2 ${formFieldWhite}`}
            />
          ) : null}
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-800">Жанр</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {STORY_GENRES.map((g) => (
            <label
              key={g}
              className={`flex cursor-pointer gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                genre === g ? "border-corridor-400 bg-corridor-50" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="genre"
                value={g}
                checked={genre === g}
                onChange={() => setGenre(g)}
                className="mt-1"
              />
              <span>
                <span className="font-medium text-slate-900">{STORY_GENRE_LABELS[g]}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{STORY_GENRE_HINTS[g]}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="story-body" className="block text-sm font-medium text-slate-800">
          Текст истории
        </label>
        <textarea
          id="story-body"
          required
          rows={10}
          maxLength={12000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Таймлайн, цифры, что случилось. Можно без идеального стиля — редактор поможет структурировать, голос оставим ваш."
          className={`mt-1.5 ${formFieldWhite} resize-y`}
        />
        <p className="mt-1 text-xs text-slate-500">{body.length}/12000</p>
      </div>

      <div>
        <label htmlFor="story-differently" className="block text-sm font-medium text-slate-800">
          Что бы вы сделали иначе?
        </label>
        <textarea
          id="story-differently"
          required
          rows={3}
          maxLength={2000}
          value={wouldDoDifferently}
          onChange={(e) => setWouldDoDifferently(e.target.value)}
          placeholder="Обязательное поле — именно это чаще всего спасает следующего читателя"
          className={`mt-1.5 ${formFieldWhite} resize-y`}
        />
      </div>

      <div>
        <label htmlFor="story-contact" className="block text-sm font-medium text-slate-800">
          Telegram или email
        </label>
        <input
          id="story-contact"
          required
          maxLength={120}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="@username или email — не публикуем"
          className={`mt-1.5 ${formFieldWhite}`}
        />
        <p className="mt-1 text-xs text-slate-500">Только для редакции: согласовать правки и публикацию.</p>
      </div>

      <div>
        <label htmlFor="story-guide" className="block text-sm font-medium text-slate-800">
          Связанный гайд (slug, необязательно)
        </label>
        <input
          id="story-guide"
          maxLength={120}
          value={relatedGuide}
          onChange={(e) => setRelatedGuide(e.target.value)}
          placeholder="например pervye-30-dnej-v-portugalii-2026"
          className={`mt-1.5 ${formFieldWhite}`}
        />
      </div>

      <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
        <label className="flex items-start gap-2 text-sm text-slate-800">
          <input
            type="checkbox"
            checked={wantBacklink}
            onChange={(e) => setWantBacklink(e.target.checked)}
            className="mt-1"
          />
          Хочу обратную ссылку на Telegram / сайт / услуги
        </label>
        {wantBacklink ? (
          <input
            type="url"
            required
            maxLength={300}
            value={backlinkUrl}
            onChange={(e) => setBacklinkUrl(e.target.value)}
            placeholder="https://t.me/… или https://…"
            className={formFieldWhite}
          />
        ) : null}
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        Согласен(на), что Emigro может отредактировать структуру (не голос) и опубликовать историю с указанным именем /
        ссылкой. Это личный опыт, не юридическая консультация.
      </label>

      {notice ? (
        <p className="text-sm text-rose-700" role="alert">
          {notice}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-corridor-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-corridor-800 disabled:opacity-60"
      >
        {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Отправить на модерацию
      </button>
    </form>
  );
}
