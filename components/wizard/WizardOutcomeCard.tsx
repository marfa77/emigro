import Link from "next/link";
import { ProgramTypeBadge } from "@/components/visuals/ProgramTypeBadge";

export const OUTCOME_LABELS: Record<string, string> = {
  likely_eligible: "Подходит по базовым ответам",
  needs_review: "Требует проверки",
  unlikely: "Сейчас не подходит",
};

const OUTCOME_LABELS_ES: Record<string, string> = {
  likely_eligible: "Encaja con las respuestas básicas",
  needs_review: "Requiere revisión",
  unlikely: "Por ahora no encaja",
};

const OUTCOME_LABELS_FR: Record<string, string> = {
  likely_eligible: "Correspond aux réponses de base",
  needs_review: "Nécessite une revue",
  unlikely: "Ne convient pas pour l'instant",
};

export const OUTCOME_COLORS: Record<string, string> = {
  likely_eligible: "bg-green-100 text-green-800 border-green-200",
  needs_review: "bg-amber-100 text-amber-800 border-amber-200",
  unlikely: "bg-slate-100 text-slate-600 border-slate-200",
};

const MAX_REASON_LENGTH = 150;

type CardLocale = "ru" | "es" | "fr";

export function readableReason(reason: string): string {
  const compact = reason.replace(/\s+/g, " ").trim();
  if (compact.length <= MAX_REASON_LENGTH) return compact;
  return `${compact.slice(0, MAX_REASON_LENGTH - 1).trimEnd()}…`;
}

export function WizardOutcomeCard({
  title,
  programType,
  outcome,
  reasons,
  href,
  sourceUrl,
  sourceLabel,
  locale = "ru",
}: {
  title: string;
  programType?: string;
  outcome: string;
  reasons?: string[];
  href?: string;
  sourceUrl?: string | null;
  sourceLabel?: string | null;
  locale?: CardLocale;
}) {
  const labels =
    locale === "es" ? OUTCOME_LABELS_ES : locale === "fr" ? OUTCOME_LABELS_FR : OUTCOME_LABELS;
  const visibleReasons = reasons?.filter(Boolean) ?? [];
  const missing = missingItems(outcome, visibleReasons, locale);
  const nextSteps = nextStepsForOutcome(outcome, locale);
  const why = locale === "es" ? "Por qué" : locale === "fr" ? "Pourquoi" : "Почему";
  const lack = locale === "es" ? "Qué falta" : locale === "fr" ? "Ce qui manque" : "Что не хватает";
  const after =
    locale === "es" ? "Qué hacer después" : locale === "fr" ? "Ensuite" : "Что сделать дальше";
  const source =
    locale === "es" ? "Fuente oficial" : locale === "fr" ? "Source officielle" : "Официальный источник";
  const open =
    locale === "es"
      ? "Abrir en Emigro ES →"
      : locale === "fr"
        ? "Ouvrir sur Emigro FR →"
        : "Страница программы →";
  const whyEmpty =
    locale === "es"
      ? "Comparamos sus respuestas con los requisitos básicos del programa."
      : locale === "fr"
        ? "Nous avons comparé vos réponses aux exigences de base du programme."
        : "Сравнили ваши ответы с базовыми требованиями программы.";

  return (
    <div className={`w-full rounded-xl border p-5 ${OUTCOME_COLORS[outcome] ?? "border-slate-200 bg-white"}`}>
      {programType && <ProgramTypeBadge type={programType} />}
      <h2 className={`font-semibold ${programType ? "mt-3" : ""}`}>{title}</h2>
      <p className="mt-2 text-sm font-medium">{labels[outcome] ?? outcome}</p>

      <section className="mt-4 space-y-3 text-sm leading-relaxed">
        <div>
          <p className="font-semibold">{why}</p>
          {visibleReasons.length > 0 ? (
            <ul className="mt-1 space-y-1 opacity-90">
              {visibleReasons.slice(0, 3).map((reason) => (
                <li key={reason}>• {readableReason(reason)}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 opacity-90">{whyEmpty}</p>
          )}
        </div>

        <div>
          <p className="font-semibold">{lack}</p>
          <p className="mt-1 opacity-90">{missing}</p>
        </div>

        <div>
          <p className="font-semibold">{after}</p>
          <ul className="mt-1 space-y-1 opacity-90">
            {nextSteps.map((step) => (
              <li key={step}>• {step}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        {sourceUrl && (
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-corridor-700 underline">
            {source}
            {sourceLabel ? `: ${sourceLabel}` : ""}
          </a>
        )}
        {href && (
          <Link href={href} className="text-corridor-700 underline">
            {open}
          </Link>
        )}
      </div>
    </div>
  );
}

function missingItems(outcome: string, reasons: string[], locale: CardLocale): string {
  if (outcome === "likely_eligible") {
    if (locale === "es") {
      return "No se ve un vacío crítico en sus respuestas. Aun así revise la lista actual de documentos y el lugar de presentación.";
    }
    if (locale === "fr") {
      return "Aucun trou critique dans vos réponses. Vérifiez tout de même la liste actuelle de documents et le lieu de dépôt.";
    }
    return "Критичного пробела по вашим ответам не видно. Всё равно нужно проверить свежий список документов и место подачи.";
  }

  if (outcome === "needs_review") {
    if (locale === "es") {
      return "Hace falta revisión manual: suele ser pasaporte, consulado, familia o prueba de fondos.";
    }
    if (locale === "fr") {
      return "Revue manuelle nécessaire : souvent passeport, consulat, famille ou preuve de fonds.";
    }
    return "Нужна ручная проверка: чаще всего это паспорт, консульство подачи, состав семьи или подтверждение денег.";
  }

  const blockers = reasons.filter((reason) => /нужно|указано|не указан|не выбрано|не хватает/i.test(reason));
  if (blockers.length > 0) {
    return blockers.slice(0, 2).map(readableReason).join("; ");
  }

  if (locale === "es") {
    return "Faltan una o varias condiciones básicas del programa. Compare con la fuente oficial.";
  }
  if (locale === "fr") {
    return "Il manque une ou plusieurs conditions de base du programme. Comparez avec la source officielle.";
  }
  return "Не хватает одного или нескольких базовых условий программы. Посмотрите причины выше и сравните с официальными требованиями.";
}

function nextStepsForOutcome(outcome: string, locale: CardLocale): string[] {
  if (outcome === "likely_eligible") {
    if (locale === "es") {
      return [
        "Abra el hub o pilar y revise la lista oficial de documentos.",
        "Reúna pruebas de ingresos, fondos, familia y vivienda.",
        "Antes de presentar, confirme el consulado o la oficina de extranjería.",
      ];
    }
    if (locale === "fr") {
      return [
        "Ouvrez le hub ou le pilier et vérifiez la liste officielle de documents.",
        "Réunissez les preuves de revenus, fonds, famille et logement.",
        "Avant de déposer, confirmez le consulat ou la préfecture.",
      ];
    }
    return [
      "Откройте страницу программы и проверьте официальный список документов.",
      "Соберите доказательства дохода, денег, семьи и жилья.",
      "Перед подачей проверьте консульство или миграционный орган.",
    ];
  }

  if (outcome === "needs_review") {
    if (locale === "es") {
      return [
        "Contraste los puntos dudosos con la fuente oficial.",
        "Prepare documentos que expliquen ingresos, familia o lugar de presentación.",
        "Si el caso es complejo, escríbanos.",
      ];
    }
    if (locale === "fr") {
      return [
        "Croisez les points douteux avec la source officielle.",
        "Préparez des documents qui expliquent revenus, famille ou lieu de dépôt.",
        "Si le cas est complexe, écrivez-nous.",
      ];
    }
    return [
      "Сверьте спорные пункты с официальным источником.",
      "Подготовьте документы, которые объясняют доход, семью или место подачи.",
      "Покажите кейс специалисту, если есть отказ, несколько стран или сложная семья.",
    ];
  }

  if (locale === "es") {
    return [
      "No es un rechazo: es una revisión previa.",
      "Vea si puede subir ingresos, ahorros, oferta o la vía de estudios.",
      "Compare rutas vecinas (España ↔ Portugal) y revise los pilares.",
    ];
  }
  if (locale === "fr") {
    return [
      "Ce n'est pas un refus : c'est une revue préalable.",
      "Voyez si vous pouvez augmenter revenus, épargne, offre ou la voie études.",
      "Comparez les piliers France et écrivez-nous si le cas est complexe.",
    ];
  }
  return [
    "Не паникуйте: это не отказ, а предварительная проверка.",
    "Посмотрите, можно ли поднять доход, накопить средства, получить оффер или выбрать учёбу.",
    "Сравните соседние маршруты и при сложном кейсе обсудите его с провайдером.",
  ];
}
