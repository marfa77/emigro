/**
 * UniPrep2Go — mocks + Anki decks for citizenship / naturalization exams.
 * Catalog maps Emigro topic keys → deep links (paths only; UTM added at call sites).
 */

export type UniPrepLink = {
  path: string;
  titleRu: string;
  blurbRu: string;
  titleEs?: string;
  blurbEs?: string;
};

export type UniPrepOffer = {
  topicKey: string;
  countryRu: string;
  countryEs?: string;
  /** Short exam / test label for badges */
  examLabelRu: string;
  examLabelEs?: string;
  headlineRu: string;
  headlineEs?: string;
  bodyRu: string;
  bodyEs?: string;
  mock?: UniPrepLink;
  deck?: UniPrepLink;
  /** Optional Prep2Go language mock (sister product) */
  prep2goMock?: UniPrepLink;
};

export type UniPrepLocale = "ru" | "es";

export function uniPrepLinkTitle(link: UniPrepLink, locale: UniPrepLocale = "ru"): string {
  return locale === "es" && link.titleEs ? link.titleEs : link.titleRu;
}

export function uniPrepLinkBlurb(link: UniPrepLink, locale: UniPrepLocale = "ru"): string {
  return locale === "es" && link.blurbEs ? link.blurbEs : link.blurbRu;
}

export function uniPrepOfferCopy(offer: UniPrepOffer, locale: UniPrepLocale = "ru") {
  if (locale === "es") {
    return {
      country: offer.countryEs ?? offer.countryRu,
      examLabel: offer.examLabelEs ?? offer.examLabelRu,
      headline: offer.headlineEs ?? offer.headlineRu,
      body: offer.bodyEs ?? offer.bodyRu,
    };
  }
  return {
    country: offer.countryRu,
    examLabel: offer.examLabelRu,
    headline: offer.headlineRu,
    body: offer.bodyRu,
  };
}

const BASE = "https://uniprep2go.study";
const PREP2GO_BASE = "https://www.prep2go.study";

export const UNIPREP2GO_BASE = BASE;
export const PREP2GO_BASE_URL = PREP2GO_BASE;

/** Hub catalog for citizenship vertical (multi-country). */
export const UNIPREP_CITIZENSHIP_HUB: UniPrepLink = {
  path: "/mock-exams/v/citizenship",
  titleRu: "Все моки по натурализации",
  blurbRu: "Бесплатные timed readiness checks: DE, ES, FR, PL, CZ и др.",
  titleEs: "Todos los mocks de naturalización",
  blurbEs: "Checks timed gratuitos: DE, ES, FR, PL, CZ y más.",
};

export const UNIPREP_LANGUAGE_DECKS_HUB: UniPrepLink = {
  path: "/language-certification-decks",
  titleRu: "Anki-колоды для языковых экзаменов",
  blurbRu: "CIPLE, DELE, CELI, DELF, German A2, Dutch A2 и др.",
  titleEs: "Mazos Anki para exámenes de idioma",
  blurbEs: "CIPLE, DELE, CELI, DELF, German A2, Dutch A2 y más.",
};

export const UNIPREP_OFFERS_BY_TOPIC: Record<string, UniPrepOffer> = {
  portugal: {
    topicKey: "portugal",
    countryRu: "Португалия",
    countryEs: "Portugal",
    examLabelRu: "CIPLE A2",
    examLabelEs: "CIPLE A2",
    headlineRu: "CIPLE A2: колода Anki + mock на Prep2Go",
    headlineEs: "CIPLE A2: mazo Anki + mock en Prep2Go",
    bodyRu:
      "Для гражданства PT нужен португальский A2. На UniPrep2Go — Anki-колода European Portuguese; полный timed mock CIPLE — на Prep2Go.",
    bodyEs:
      "Para la nacionalidad portuguesa suele hacer falta portugués A2. En UniPrep2Go: mazo Anki de European Portuguese; el mock timed completo CIPLE está en Prep2Go. Plazos PT (7/10 años) ≠ art. 22 España (~2 años).",
    deck: {
      path: "/decks/ciple-a2-european-portuguese-anki-deck",
      titleRu: "CIPLE A2 Anki-колода",
      blurbRu: "European Portuguese · темы CAPLE",
      titleEs: "Mazo Anki CIPLE A2",
      blurbEs: "European Portuguese · temas CAPLE",
    },
    prep2goMock: {
      path: "/ciple-a2-mock-test",
      titleRu: "CIPLE A2 mock (Prep2Go)",
      blurbRu: "Формат экзамена · AI scoring · без регистрации на preview",
      titleEs: "Mock CIPLE A2 (Prep2Go)",
      blurbEs: "Formato de examen · AI scoring · preview sin registro",
    },
  },
  spain: {
    topicKey: "spain",
    countryRu: "Испания",
    countryEs: "España",
    examLabelRu: "CCSE + DELE A2",
    examLabelEs: "CCSE (+ DELE si aplica)",
    headlineRu: "CCSE mock + DELE A2 колода",
    headlineEs: "Mock CCSE + mazo DELE A2",
    bodyRu:
      "Для nacionalidad ES нужны DELE A2 и CCSE. Бесплатный CCSE readiness check на UniPrep2Go; Anki DELE A2 — отдельно; полный DELE mock — на Prep2Go.",
    bodyEs:
      "Para nacionalidad española (art. 22) casi siempre hace falta CCSE. Si el español es lengua oficial en tu país, DELE A2 suele estar exento — confirma en Justicia. Mock CCSE gratis en UniPrep2Go; mazo DELE y mock DELE completo en Prep2Go si te aplica.",
    mock: {
      path: "/mock-exams/ccse-espana-readiness-check",
      titleRu: "CCSE España mock",
      blurbRu: "Конституция и культура · timed readiness",
      titleEs: "Mock CCSE España",
      blurbEs: "Constitución y cultura · readiness timed",
    },
    deck: {
      path: "/decks/dele-a2-spanish-anki-deck",
      titleRu: "DELE A2 Anki-колода",
      blurbRu: "Лексика и темы A2 для Cervantes",
      titleEs: "Mazo Anki DELE A2",
      blurbEs: "Léxico y temas A2 (Cervantes)",
    },
    prep2goMock: {
      path: "/dele-a2-mock-test",
      titleRu: "DELE A2 mock (Prep2Go)",
      blurbRu: "Полный timed mock · AI writing & speaking",
      titleEs: "Mock DELE A2 (Prep2Go)",
      blurbEs: "Mock timed completo · writing y speaking con AI",
    },
  },
  germany: {
    topicKey: "germany",
    countryRu: "Германия",
    examLabelRu: "Leben in Deutschland",
    headlineRu: "Einbürgerungstest / LID + German A2 колода",
    bodyRu:
      "Для натурализации DE — язык B1 и тест Leben in Deutschland / Einbürgerungstest. Бесплатный LID mock + Anki German A2 (версия для русскоязычных).",
    mock: {
      path: "/mock-exams/leben-in-deutschland-readiness-check",
      titleRu: "Leben in Deutschland mock",
      blurbRu: "Civics readiness · timed",
    },
    deck: {
      path: "/decks/german-a2-for-russian-speakers-anki-deck",
      titleRu: "German A2 Anki (для RU)",
      blurbRu: "Колода с опорой на русскоязычных learners",
    },
    prep2goMock: {
      path: "/dtz-b1-mock-test",
      titleRu: "DTZ B1 mock (Prep2Go)",
      blurbRu: "Языковой mock для интеграции / гражданства",
    },
  },
  france: {
    topicKey: "france",
    countryRu: "Франция",
    examLabelRu: "Examen civique + DELF",
    headlineRu: "Naturalisation FR mock + DELF B2 колода",
    bodyRu:
      "С 2026 для натурализации FR — civic exam и язык (часто B2). Бесплатный readiness check + Anki DELF B2; timed DELF mock — на Prep2Go.",
    mock: {
      path: "/mock-exams/naturalisation-francaise-readiness-check",
      titleRu: "Naturalisation française mock",
      blurbRu: "Civics readiness · timed",
    },
    deck: {
      path: "/decks/delf-b2-french-anki-deck",
      titleRu: "DELF B2 Anki-колода",
      blurbRu: "Лексика и темы B2",
    },
    prep2goMock: {
      path: "/delf-b2-mock-test",
      titleRu: "DELF B2 mock (Prep2Go)",
      blurbRu: "Полный timed mock · AI scoring",
    },
  },
  italy: {
    topicKey: "italy",
    countryRu: "Италия",
    examLabelRu: "CELI B1",
    headlineRu: "CELI B1: колода Anki + mock на Prep2Go",
    bodyRu:
      "Для гражданства IT обычно нужен итальянский B1 (CELI / CILS). Anki CELI B1 на UniPrep2Go; полный mock — на Prep2Go.",
    deck: {
      path: "/decks/celi-b1-italian-anki-deck",
      titleRu: "CELI B1 Anki-колода",
      blurbRu: "Итальянский B1 для натурализации",
    },
    prep2goMock: {
      path: "/celi-2-mock-test",
      titleRu: "CELI 2 mock (Prep2Go)",
      blurbRu: "Формат CELI · timed · AI scoring",
    },
  },
  netherlands: {
    topicKey: "netherlands",
    countryRu: "Нидерланды",
    examLabelRu: "Inburgering A2",
    headlineRu: "Dutch A2 Inburgering — Anki-колода",
    bodyRu:
      "Для интеграции / гражданства NL часто нужен нидерландский A2 (inburgering). Колода Anki на UniPrep2Go.",
    deck: {
      path: "/decks/dutch-a2-inburgering-anki-deck",
      titleRu: "Dutch A2 Inburgering Anki",
      blurbRu: "Лексика и темы inburgeringsexamen",
    },
  },
  czechia: {
    topicKey: "czechia",
    countryRu: "Чехия",
    examLabelRu: "Občanství + CCE A2",
    headlineRu: "Czech citizenship mock + CCE A2 колода",
    bodyRu:
      "Для гражданства CZ — тест и язык A2. Бесплатный citizenship readiness check + Anki CCE A2.",
    mock: {
      path: "/mock-exams/czech-citizenship-readiness-check",
      titleRu: "Czech citizenship mock",
      blurbRu: "Civics readiness · timed",
    },
    deck: {
      path: "/decks/czech-a2-cce-anki-deck",
      titleRu: "Czech A2 CCE Anki",
      blurbRu: "Языковая колода A2",
    },
  },
  poland: {
    topicKey: "poland",
    countryRu: "Польша",
    examLabelRu: "Citizenship + A2",
    headlineRu: "Polish citizenship mock + A2 колода",
    bodyRu:
      "Подготовка к тесту / языку для гражданства PL: бесплатный readiness check и Anki Polish A2.",
    mock: {
      path: "/mock-exams/polish-citizenship-readiness-check",
      titleRu: "Polish citizenship mock",
      blurbRu: "Civics readiness · timed",
    },
    deck: {
      path: "/decks/polish-a2-certyfikat-anki-deck",
      titleRu: "Polish A2 Anki",
      blurbRu: "Certyfikat / A2 лексика",
    },
  },
  greece: {
    topicKey: "greece",
    countryRu: "Греция",
    examLabelRu: "Ellinomatheia A2",
    headlineRu: "Greek A2 Ellinomatheia — Anki-колода",
    bodyRu: "Языковой A2 для ВНЖ/гражданства GR — Anki-колода Ellinomatheia на UniPrep2Go.",
    deck: {
      path: "/decks/greek-a2-ellinomatheia-anki-deck",
      titleRu: "Greek A2 Anki",
      blurbRu: "Ellinomatheia A2",
    },
  },
  scandinavia: {
    topicKey: "scandinavia",
    countryRu: "Скандинавия",
    examLabelRu: "A2 (DK/NO/SE)",
    headlineRu: "Скандинавские A2 Anki-колоды",
    bodyRu:
      "Для интеграции / гражданства в DK, NO, SE — языковые A2 колоды: Prøve i Dansk, Norskprøve, SFI.",
    deck: {
      path: "/decks/swedish-a2-sfi-anki-deck",
      titleRu: "Swedish A2 SFI Anki",
      blurbRu: "Также доступны Danish A2 и Norwegian A2 на UniPrep2Go",
    },
  },
  sweden: {
    topicKey: "sweden",
    countryRu: "Швеция",
    examLabelRu: "Swedish A2 / SFI",
    headlineRu: "Swedish A2 SFI — Anki-колода",
    bodyRu: "Для интеграции / гражданства в Швеции — языковая A2 колода SFI на UniPrep2Go.",
    deck: {
      path: "/decks/swedish-a2-sfi-anki-deck",
      titleRu: "Swedish A2 SFI Anki",
      blurbRu: "SFI / Swedish A2",
    },
  },
  norway: {
    topicKey: "norway",
    countryRu: "Норвегия",
    examLabelRu: "Norskprøve A2",
    headlineRu: "Norwegian A2 — Anki-колода",
    bodyRu: "Для интеграции / гражданства в Норвегии — языковая A2 колода Norskprøve на UniPrep2Go.",
    deck: {
      path: "/decks/norwegian-a2-norskprove-anki-deck",
      titleRu: "Norwegian A2 Anki",
      blurbRu: "Norskprøve A2",
    },
  },
  finland: {
    topicKey: "finland",
    countryRu: "Финляндия",
    examLabelRu: "Finnish A2",
    headlineRu: "Finnish A2 — Anki-колода",
    bodyRu: "Для интеграции / гражданства в Финляндии — языковая A2 колода на UniPrep2Go.",
    deck: {
      path: "/decks/finnish-a2-anki-deck",
      titleRu: "Finnish A2 Anki",
      blurbRu: "Finnish A2",
    },
  },
  denmark: {
    topicKey: "denmark",
    countryRu: "Дания",
    examLabelRu: "Prøve i Dansk A2",
    headlineRu: "Danish A2 — Anki-колода",
    bodyRu: "Для интеграции / гражданства в Дании — языковая A2 колода Prøve i Dansk на UniPrep2Go.",
    deck: {
      path: "/decks/danish-a2-prove-i-dansk-anki-deck",
      titleRu: "Danish A2 Anki",
      blurbRu: "Prøve i Dansk A2",
    },
  },
};

/** Explicit citizenship / naturalization intent — not “any country topic”. */
const CITIZENSHIP_GUIDE_HINT =
  /grazhdanstvo|гражданств|натурализ|einb[uü]rger|leben.in.deutschland|inburger|civics|nationalit|nacionalidad|citizenship|ciple|ccse|celi|delf|dele[-_]?a2/i;

export function getUniPrepOfferForTopic(topicKey: string | undefined | null): UniPrepOffer | null {
  if (!topicKey) return null;
  return UNIPREP_OFFERS_BY_TOPIC[topicKey] ?? null;
}

/** Prefer first topic that has an offer. */
export function getUniPrepOfferForTopics(topicKeys: string[] | undefined | null): UniPrepOffer | null {
  if (!topicKeys?.length) return null;
  for (const key of topicKeys) {
    const offer = getUniPrepOfferForTopic(key);
    if (offer) return offer;
  }
  return null;
}

/**
 * True only for naturalization / citizenship exam intent.
 * Country topic alone (portugal, spain…) is NOT enough — that used to spray UniPrep on bank/tax/DN guides.
 */
export function guideLooksCitizenshipRelated(guide: {
  slug: string;
  title?: string;
  tags?: string[];
  topic_keys?: string[];
}): boolean {
  if (guide.topic_keys?.includes("citizenship")) return true;
  if (CITIZENSHIP_GUIDE_HINT.test(guide.slug)) return true;
  if (guide.title && CITIZENSHIP_GUIDE_HINT.test(guide.title)) return true;
  if (guide.tags?.some((t) => CITIZENSHIP_GUIDE_HINT.test(t))) return true;
  return false;
}

/** Show UniPrep promo on a guide only when citizenship-related AND we have a country offer (deck/mock). */
export function shouldShowUniPrepOnGuide(guide: {
  slug: string;
  title?: string;
  tags?: string[];
  topic_keys?: string[];
}): boolean {
  if (!guideLooksCitizenshipRelated(guide)) return false;
  return Boolean(getUniPrepOfferForTopics(guide.topic_keys));
}

/**
 * ES corridor: show UniPrep on nationality pillar, origin residencia (CCSE path), and Portugal CIPLE pillar.
 */
export function shouldShowUniPrepOnEsGuide(guide: {
  slug: string;
  title?: string;
  tags?: string[];
  topic_keys?: string[];
}): boolean {
  if (shouldShowUniPrepOnGuide(guide)) return true;
  if (/^residencia-espana-desde-/.test(guide.slug)) return Boolean(getUniPrepOfferForTopic("spain"));
  if (guide.slug === "portugal-d8-d7-latam-2026") return Boolean(getUniPrepOfferForTopic("portugal"));
  return false;
}

/** Resolve ES offer: PT guide → portugal (CIPLE/Prep2Go); ES origin/nacionalidad → spain (CCSE). */
export function resolveUniPrepOfferForEsGuide(guide: {
  slug: string;
  topic_keys?: string[];
}): UniPrepOffer | null {
  if (guide.slug === "portugal-d8-d7-latam-2026") return getUniPrepOfferForTopic("portugal");
  if (/^residencia-espana-desde-/.test(guide.slug) || /nacionalidad/.test(guide.slug)) {
    return getUniPrepOfferForTopic("spain") ?? getUniPrepOfferForTopics(guide.topic_keys);
  }
  return getUniPrepOfferForTopics(guide.topic_keys);
}

export function withUniPrepUtm(
  pathOrUrl: string,
  opts: {
    medium: string;
    campaign: string;
    content?: string;
    base?: string;
  }
): string {
  const base = opts.base ?? BASE;
  const url = pathOrUrl.startsWith("http") ? new URL(pathOrUrl) : new URL(pathOrUrl, base);
  url.searchParams.set("utm_source", "emigro");
  url.searchParams.set("utm_medium", opts.medium);
  url.searchParams.set("utm_campaign", opts.campaign);
  if (opts.content) url.searchParams.set("utm_content", opts.content);
  return url.toString();
}

export function withPrep2GoUtm(
  pathOrUrl: string,
  opts: { medium: string; campaign: string; content?: string }
): string {
  return withUniPrepUtm(pathOrUrl, { ...opts, base: PREP2GO_BASE });
}
