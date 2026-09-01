"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics/client";
import { formField, formFieldWhite } from "@/lib/ui/mobile";

export type AssistCountryOption = {
  label: string;
  value: string;
  corridorSlug: string;
};

export type AssistProviderOption = {
  id: string;
  name: string;
  category: string;
  /** Corridors this partner covers — form shows only matches for selected country. */
  corridorSlugs: string[];
};

export type AssistPlanTier = "route-check" | "accompaniment";

export type AssistPaymentMethod = "paypal" | "telegram_stars" | "crypto" | "card";

const PAYMENT_OPTIONS_RU: { value: AssistPaymentMethod; label: string }[] = [
  { value: "paypal", label: "PayPal" },
  { value: "telegram_stars", label: "Telegram Stars" },
  { value: "crypto", label: "Crypto (USDT / USDC)" },
  { value: "card", label: "Оплата картой (отправим ссылку на Gumroad)" },
];

const PAYMENT_OPTIONS_ES: { value: AssistPaymentMethod; label: string }[] = [
  { value: "paypal", label: "PayPal" },
  { value: "telegram_stars", label: "Telegram Stars" },
  { value: "crypto", label: "Crypto (USDT / USDC)" },
  { value: "card", label: "Tarjeta (enviaremos enlace de Gumroad)" },
];

const PAYMENT_OPTIONS_FR: { value: AssistPaymentMethod; label: string }[] = [
  { value: "paypal", label: "PayPal" },
  { value: "telegram_stars", label: "Telegram Stars" },
  { value: "crypto", label: "Crypto (USDT / USDC)" },
  { value: "card", label: "Carte (nous enverrons un lien Gumroad)" },
];

const PLAN_TIER_OPTIONS_RU: { value: AssistPlanTier; label: string; summary: string }[] = [
  {
    value: "route-check",
    label: "Route Check — €129",
    summary:
      "Созвон с командой Emigro по чек-листу, PDF с разбором кейса в течение 48 часов, подбор партнёров. Оплата — после согласования слота.",
  },
  {
    value: "accompaniment",
    label: "Сопровождение — €100/час",
    summary:
      "Коммуникационная поддержка: переписка с консульством, юристом или агентством, письма, формы, разбор отказов. Оплата — после согласования формата работы.",
  },
];

const PLAN_TIER_OPTIONS_ES: { value: AssistPlanTier; label: string; summary: string }[] = [
  {
    value: "route-check",
    label: "Route Check — €129",
    summary:
      "Llamada con el equipo Emigro según checklist, PDF del caso en 48 h y selección de partners. Pago tras confirmar el slot.",
  },
  {
    value: "accompaniment",
    label: "Acompañamiento — €100/hora",
    summary:
      "Apoyo de comunicación: correo con consulado, abogado o agencia, cartas, formularios, análisis de denegaciones. Pago tras acordar el formato.",
  },
];

const PLAN_TIER_OPTIONS_FR: { value: AssistPlanTier; label: string; summary: string }[] = [
  {
    value: "route-check",
    label: "Route Check — €129",
    summary:
      "Appel avec l'équipe Emigro selon checklist, PDF du cas sous 48 h et sélection de partenaires. Paiement après confirmation du créneau.",
  },
  {
    value: "accompaniment",
    label: "Accompagnement — €100/heure",
    summary:
      "Soutien de communication : courrier avec consulat, avocat ou agence, lettres, formulaires, analyse de refus. Paiement après accord sur le format.",
  },
];

const SUCCESS_MESSAGES_RU: Record<AssistPlanTier, string> = {
  "route-check":
    "Заявка отправлена. Emigro согласует время созвона с командой. После подтверждения слота вышлем реквизиты (€129). Команда Emigro проведёт встречу и пришлёт PDF с разбором кейса и контактами партнёров в течение 48 часов.",
  accompaniment:
    "Заявка отправлена. Emigro свяжется с вами, уточнит задачу и согласует формат работы. Оплата €100/час — после согласования.",
};

const SUCCESS_MESSAGES_ES: Record<AssistPlanTier, string> = {
  "route-check":
    "Solicitud enviada. Emigro acordará la hora de la llamada. Tras confirmar el slot, enviaremos los datos de pago (€129). Tras la reunión recibirá el PDF y contactos de partners en 48 h.",
  accompaniment:
    "Solicitud enviada. Emigro contactará para aclarar la tarea y el formato. Pago €100/hora tras el acuerdo.",
};

const SUCCESS_MESSAGES_FR: Record<AssistPlanTier, string> = {
  "route-check":
    "Demande envoyée. Emigro conviendra de l'heure de l'appel. Après confirmation du créneau, nous enverrons les coordonnées de paiement (€129). Après la réunion vous recevrez le PDF et les contacts partenaires sous 48 h.",
  accompaniment:
    "Demande envoyée. Emigro vous contactera pour clarifier la tâche et le format. Paiement €100/heure après accord.",
};

const SUBMIT_LABELS_RU: Record<AssistPlanTier, string> = {
  "route-check": "Запросить Route Check — €129",
  accompaniment: "Запросить сопровождение",
};

const SUBMIT_LABELS_ES: Record<AssistPlanTier, string> = {
  "route-check": "Solicitar Route Check — €129",
  accompaniment: "Solicitar acompañamiento",
};

const SUBMIT_LABELS_FR: Record<AssistPlanTier, string> = {
  "route-check": "Demander Route Check — €129",
  accompaniment: "Demander l'accompagnement",
};

function tierFromHash(hash: string): AssistPlanTier | null {
  if (hash === "#assist-form-accompaniment" || hash === "#assist-accompaniment") {
    return "accompaniment";
  }
  return null;
}

type Props = {
  countries: AssistCountryOption[];
  providers: AssistProviderOption[];
  defaultPlanTier?: AssistPlanTier;
  initialSessionId?: string;
  initialCountry?: string;
  initialProgramRoute?: string;
  locale?: "ru" | "es" | "fr";
  /** Override analytics/lead source (e.g. satellite hub intake). */
  leadSource?: string;
};

export function AssistLeadForm({
  countries,
  providers,
  defaultPlanTier = "route-check",
  initialSessionId,
  initialCountry,
  initialProgramRoute,
  locale = "ru",
  leadSource,
}: Props) {
  const isEs = locale === "es";
  const isFr = locale === "fr";
  const defaultAssistSource = isEs ? "emigro_assist_es" : isFr ? "emigro_assist_fr" : "emigro_assist";
  const assistSource = leadSource?.trim() || defaultAssistSource;
  const PAYMENT_OPTIONS = isEs ? PAYMENT_OPTIONS_ES : isFr ? PAYMENT_OPTIONS_FR : PAYMENT_OPTIONS_RU;
  const PLAN_TIER_OPTIONS = isEs
    ? PLAN_TIER_OPTIONS_ES
    : isFr
      ? PLAN_TIER_OPTIONS_FR
      : PLAN_TIER_OPTIONS_RU;
  const SUCCESS_MESSAGES = isEs
    ? SUCCESS_MESSAGES_ES
    : isFr
      ? SUCCESS_MESSAGES_FR
      : SUCCESS_MESSAGES_RU;
  const SUBMIT_LABELS = isEs ? SUBMIT_LABELS_ES : isFr ? SUBMIT_LABELS_FR : SUBMIT_LABELS_RU;
  const PAYMENT_LABELS = Object.fromEntries(
    PAYMENT_OPTIONS.map(({ value, label }) => [value, label])
  ) as Record<AssistPaymentMethod, string>;

  const validInitialCountry =
    initialCountry && countries.some((option) => option.value === initialCountry)
      ? initialCountry
      : countries[0]?.value ?? "";
  const [country, setCountry] = useState(validInitialCountry);
  const [programRoute, setProgramRoute] = useState(initialProgramRoute ?? "");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [planTier, setPlanTier] = useState<AssistPlanTier>(defaultPlanTier);
  const [paymentMethod, setPaymentMethod] = useState<AssistPaymentMethod>("paypal");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [notice, setNotice] = useState("");

  const countryOption = countries.find((option) => option.value === country) ?? countries[0];
  const wizardSessionId = initialSessionId?.trim() ?? "";
  const corridorSlug = countryOption?.corridorSlug ?? "";
  const corridorProviders = useMemo(
    () =>
      corridorSlug
        ? providers.filter((provider) => provider.corridorSlugs.includes(corridorSlug))
        : [],
    [providers, corridorSlug]
  );

  useEffect(() => {
    const applyHash = () => {
      const tier = tierFromHash(window.location.hash);
      if (tier) setPlanTier(tier);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    const allowed = new Set(corridorProviders.map((p) => p.id));
    setSelectedProviders((prev) => {
      const next = prev.filter((id) => allowed.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [corridorProviders]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setNotice("");

    try {
      const res = await fetch("/api/v1/assist/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country,
          country_label: countryOption?.label ?? country,
          corridor_slug: countryOption?.corridorSlug,
          program_route: programRoute,
          selected_provider_ids: selectedProviders,
          plan_tier: planTier,
          payment_method: paymentMethod,
          name,
          contact,
          message,
          consent,
          session_id: wizardSessionId || undefined,
          preferred_language: locale,
          audience: isEs ? "latam" : isFr ? "fr_africa" : "ru",
          source: assistSource,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error ??
            (isEs
              ? "No se pudo enviar la solicitud"
              : isFr
                ? "Impossible d'envoyer la demande"
                : "Не удалось отправить заявку")
        );
      }

      trackEvent("assist_lead_submitted", {
        source: assistSource,
        country,
        corridor_slug: countryOption?.corridorSlug,
        providers: selectedProviders.join(","),
        plan_tier: planTier,
        payment_method: paymentMethod,
        session_id: wizardSessionId,
        locale,
      });
      setStatus("done");
      setNotice(SUCCESS_MESSAGES[planTier]);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : isEs
            ? "Error al enviar"
            : isFr
              ? "Erreur d'envoi"
              : "Ошибка отправки";
      trackEvent("lead_error", {
        source: assistSource,
        country,
        message: msg,
      });
      setStatus("error");
      setNotice(msg);
    }
  }

  if (status === "done") {
    return <p className="rounded-xl bg-green-50 p-5 text-green-800">{notice}</p>;
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <fieldset>
        <legend className="text-sm font-medium text-slate-800">
          {isEs ? "Qué le interesa" : isFr ? "Ce qui vous intéresse" : "Что вас интересует"}
        </legend>
        <div className="mt-3 space-y-2">
          {PLAN_TIER_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${
                planTier === option.value
                  ? "border-corridor-600 bg-corridor-50/60"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="plan_tier"
                value={option.value}
                checked={planTier === option.value}
                onChange={() => setPlanTier(option.value)}
                className="mt-1"
              />
              <span>
                <span className="font-medium text-slate-900">{option.label}</span>
                <span className="mt-1 block leading-relaxed text-slate-600">{option.summary}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className="text-sm font-medium text-slate-800" htmlFor="assist-payment">
          {isEs
            ? "Método de pago preferido"
            : isFr
              ? "Mode de paiement préféré"
              : "Предпочитаемый способ оплаты"}
        </label>
        <select
          id="assist-payment"
          required
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as AssistPaymentMethod)}
          className={`mt-2 ${formFieldWhite}`}
        >
          {PAYMENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-slate-500">
          {isEs
            ? `Enviaremos los datos o el enlace (${PAYMENT_LABELS[paymentMethod]}) tras acordar hora o formato.`
            : isFr
              ? `Nous enverrons les coordonnées ou le lien (${PAYMENT_LABELS[paymentMethod]}) après accord sur l'heure ou le format.`
              : `Реквизиты или ссылку (${PAYMENT_LABELS[paymentMethod]}) вышлем после согласования времени или формата работы.`}
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800" htmlFor="assist-country">
          {isEs ? "País / corredor" : isFr ? "Pays / corridor" : "Страна / коридор"}
        </label>
        <select
          id="assist-country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className={`mt-2 ${formFieldWhite}`}
        >
          {countries.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800" htmlFor="assist-route">
          {planTier === "accompaniment"
            ? isEs
              ? "Su ruta y tarea"
              : isFr
                ? "Votre route et tâche"
                : "Ваш маршрут и задача"
            : isEs
              ? "Qué necesita"
              : isFr
                ? "Ce dont vous avez besoin"
                : "Что вам нужно"}
        </label>
        <input
          id="assist-route"
          required
          value={programRoute}
          onChange={(e) => setProgramRoute(e.target.value)}
          placeholder={
            planTier === "accompaniment"
              ? isEs
                ? "Ej.: denegación AIMA, escribir al consulado, revisar formulario D7"
                : isFr
                  ? "Ex. : refus préfecture, écrire au consulat, revoir un formulaire"
                  : "Например: отказ AIMA, нужно написать в консульство, проверить форму D7"
              : isEs
                ? "Ej.: D7, nómada digital, cambio de estatus en España, mudanza con familia"
                : isFr
                  ? "Ex. : Passeport Talent, visiteur, études, déménagement en famille"
                  : "Например: D7, digital nomad, смена статуса в Испании, переезд с семьёй"
          }
          className={`mt-2 ${formField}`}
        />
      </div>

      {planTier === "route-check" && corridorProviders.length > 0 && (
        <fieldset>
          <legend className="text-sm font-medium text-slate-800">
            {isEs
              ? "Partners que ya contempla (opcional)"
              : isFr
                ? "Partenaires déjà envisagés (optionnel)"
                : "Каких партнёров уже рассматриваете (необязательно)"}
          </legend>
          <p className="mt-1 text-xs text-slate-500">
            {isEs
              ? `Solo para ${countryOption?.label ?? "este país"}.`
              : isFr
                ? `Uniquement pour ${countryOption?.label ?? "ce pays"}.`
                : `Только по направлению «${countryOption?.label ?? "выбранная страна"}».`}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {corridorProviders.map((provider) => (
              <label key={provider.id} className="flex items-start gap-2 rounded-lg border border-slate-200 p-3 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={selectedProviders.includes(provider.id)}
                  onChange={(e) =>
                    setSelectedProviders((prev) =>
                      e.target.checked ? [...prev, provider.id] : prev.filter((id) => id !== provider.id)
                    )
                  }
                />
                <span>
                  <span className="font-medium text-slate-900">{provider.name}</span>
                  <span className="block text-xs text-slate-500">{provider.category}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="assist-name">
            {isEs ? "Nombre" : isFr ? "Nom" : "Имя"}
          </label>
          <input
            id="assist-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-2 ${formField}`}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-800" htmlFor="assist-contact">
            {isEs ? "Email o Telegram" : isFr ? "Email ou Telegram" : "Email или Telegram"}
          </label>
          <input
            id="assist-contact"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={
              isEs
                ? "name@email.com o @username"
                : isFr
                  ? "name@email.com ou @username"
                  : "name@email.com или @username"
            }
            className={`mt-2 ${formField}`}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-800" htmlFor="assist-message">
          {isEs ? "Cuéntenos más" : isFr ? "Dites-nous en plus" : "Расскажите подробнее"}
        </label>
        <textarea
          id="assist-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder={
            planTier === "accompaniment"
              ? isEs
                ? "Qué ya hizo, dónde se trabó, qué cartas o formularios necesita, plazos."
                : isFr
                  ? "Ce qui est déjà fait, où vous êtes bloqué, quelles lettres ou formulaires, délais."
                  : "Что уже сделано, где застряли, какие письма или формы нужны, дедлайны."
              : isEs
                ? "Situación, ingresos, familia, plazos — qué quiere aclarar."
                : isFr
                  ? "Situation, revenus, famille, délais — ce que vous voulez clarifier."
                  : "Ситуация, доход, семья, сроки — что хотите прояснить."
          }
          className={`mt-2 ${formField}`}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-slate-600">
        <input
          required
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        <span>
          {isEs ? (
            <>
              Acepto la{" "}
              <Link href="/es/privacy" className="text-corridor-600 hover:underline">
                política de privacidad
              </Link>{" "}
              y entiendo que Emigro no es un bufete: Route Check es un análisis estructurado y navegación hacia
              especialistas; el acompañamiento es apoyo de comunicación. La responsabilidad jurídica es del partner
              que usted elija.
            </>
          ) : isFr ? (
            <>
              J&apos;accepte la{" "}
              <Link href="/fr/privacy" className="text-corridor-600 hover:underline">
                politique de confidentialité
              </Link>{" "}
              et comprends qu&apos;Emigro n&apos;est pas un cabinet : Route Check est une analyse structurée et une
              navigation vers des spécialistes ; l&apos;accompagnement est un soutien de communication. La
              responsabilité juridique incombe au partenaire que vous choisissez.
            </>
          ) : (
            <>
              Я согласен(на) с{" "}
              <Link href="/ru/privacy" className="text-corridor-600 hover:underline">
                политикой конфиденциальности
              </Link>{" "}
              и понимаю, что Emigro не юридическая фирма: Route Check — структурированный разбор ситуации и навигация к
              специалистам, сопровождение — коммуникационная поддержка. Юридическую ответственность несёт партнёр, которого
              вы выбираете.
            </>
          )}
        </span>
      </label>

      {status === "error" && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{notice}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-corridor-600 px-5 py-3 font-medium text-white hover:bg-corridor-700 disabled:opacity-60"
      >
        {status === "loading"
          ? isEs
            ? "Enviando…"
            : isFr
              ? "Envoi…"
              : "Отправка..."
          : SUBMIT_LABELS[planTier]}
      </button>
    </form>
  );
}
