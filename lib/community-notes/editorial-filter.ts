import type { SignalCluster } from "@/lib/community-notes/draft-from-signals";
import type { ContentKind } from "@/lib/community-notes/types";

/** Topics auto-published from Telegram clusters (Portugal). */
export const CORE_RELOC_TOPICS = new Set([
  "nif",
  "aima",
  "arenda",
  "bank",
  "sns",
  "ciple",
  "transport",
  "sim",
  "pets",
]);

/** Topics auto-published from Telegram clusters (Spain). */
export const SPAIN_CORE_RELOC_TOPICS = new Set([
  "nie",
  "tie",
  "extranjeria",
  "empadronamiento",
  "arenda",
  "alquiler",
  "bank",
  "dnv",
  "teletrabajo",
  "autonomo",
  "valencia",
]);

const TOPIC_PATTERNS: Array<{ topic: string; re: RegExp }> = [
  { topic: "bank", re: /\b(bank|банк|сч[её]т|conta|кредитн|cart[aã]o)\b/i },
  { topic: "nif", re: /\b(nif|finanças|financas|e-fatura|e fatura|налог)\b/i },
  { topic: "aima", re: /\b(aima|agora|vng|внж|миграц)\b/i },
  { topic: "arenda", re: /\b(arenda|аренд|arrendamento|cau[cç][aã]o|fiador)\b/i },
  { topic: "sns", re: /\b(sns|utente|здоров|centro de sa[uú]de)\b/i },
  { topic: "ciple", re: /\b(ciple|caple|a2|гражданств)\b/i },
  { topic: "sim", re: /\b(sim|интернет|internet|anacom|связ)\b/i },
  { topic: "pets", re: /\b(pets|питом|dgav|собак|кошк)\b/i },
  { topic: "transport", re: /\b(metro|cp|транспорт|comboios)\b/i },
];

export const SPAIN_TOPIC_PATTERNS: Array<{ topic: string; re: RegExp }> = [
  { topic: "nie", re: /\b(nie|empadronamiento|padron|ex-15|agencia tributaria)\b/i },
  { topic: "tie", re: /\b(tie|huellas|resguardo|tarjeta de identidad)\b/i },
  { topic: "extranjeria", re: /\b(extranjer[ií]a|cita previa|sede)\b/i },
  { topic: "bank", re: /\b(bank|банк|iban|caixabank|santander|сч[её]t)\b/i },
  { topic: "arenda", re: /\b(arenda|аренд|alquiler|idealista|fianza)\b/i },
  { topic: "dnv", re: /\b(dnv|teletrabajo|digital nomad|uge|startups)\b/i },
  { topic: "autonomo", re: /\b(aut[oó]nomo|beckham|impatriado|seguridad social)\b/i },
  { topic: "valencia", re: /\b(valencia|валенс|comunidad valenciana)\b/i },
];

/** Tangential chat topics — skip auto-publish unless manually curated. */
export const SKIP_AUTO_PUBLISH_TOPICS = new Set(["school", "food"]);

export const ARCHIVE_SLUGS = new Set([
  "bank-account-portugal-2026",
  "detskiy-tort-lisabon-zakaz-2026",
  "restaurantes-condimentos-guide-2026",
]);

/** Infer primary topic from title/slug when parser topic_hints are wrong. */
export function reconcileTopic(
  topic: string,
  title: string,
  slug: string,
  countryKey: "portugal" | "spain" = "portugal"
): string {
  const text = `${title} ${slug}`;
  const patterns = countryKey === "spain" ? SPAIN_TOPIC_PATTERNS : TOPIC_PATTERNS;
  for (const { topic: inferred, re } of patterns) {
    if (re.test(text)) return inferred;
  }
  return topic;
}

/** Chat fluff / off-topic posts wrongly tagged as news by the parser. */
const NEWS_NOISE_RE =
  /турагент|ниче не продаю|экскурсия в ссср|утопить щенк|коробк[иае]\s+передач|bmw\s*x\d|механическ\w*\s+разблок|ikea|шампунь|отельн\w*\s+косметик|посуд[аыеу]|флакон/i;

/** Civic / relocant-relevant news worth a satellite + Threads post. */
const NEWS_RELOC_RE =
  /закон\s+о\s+граждан|aima|внж|\bvng\b|\bnif\b|гражданств|национал|транспорт|бесплатн|\bsns\b|utente|finanç|financas|миграц|виз[аыуе]|multa|штраф|метро|residenc|imigr|\bd8\b|\bd7\b|паспорт|консул|\biban\b|банк(?:овск|ир|ов)|аренд|arrendamento|номер\s+utente|agora\.imigrante|portal-renov/i;

/** Ignore stale channel digests sitting in status=new for months. */
const NEWS_MAX_AGE_DAYS = 45;

/** Single-signal channel digests can become news notes (unlike practice guides). */
export function isPublishableNewsCluster(
  cluster: SignalCluster,
  countryKey: "portugal" | "spain" = "portugal"
): boolean {
  if (cluster.contentKind !== "news") return false;
  if (cluster.signals.length < 1) return false;

  const newest = cluster.signals
    .map((s) => new Date(s.posted_at).getTime())
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => b - a)[0];
  if (newest && Date.now() - newest > NEWS_MAX_AGE_DAYS * 86_400_000) return false;

  const text = cluster.signals.map((s) => s.text).join("\n");
  if (NEWS_NOISE_RE.test(text)) return false;
  // Text must match — parser topic_hints often false-positive (auto/food on lifestyle posts).
  if (!NEWS_RELOC_RE.test(text)) return false;

  const coreTopics = countryKey === "spain" ? SPAIN_CORE_RELOC_TOPICS : CORE_RELOC_TOPICS;
  if (SKIP_AUTO_PUBLISH_TOPICS.has(cluster.topic) && !coreTopics.has(cluster.topic)) {
    return false;
  }
  return true;
}

export function shouldAutoPublishCluster(
  cluster: SignalCluster,
  countryKey: "portugal" | "spain" = "portugal"
): boolean {
  if (cluster.contentKind === "news") {
    return isPublishableNewsCluster(cluster, countryKey);
  }
  if (SKIP_AUTO_PUBLISH_TOPICS.has(cluster.topic)) return false;
  if (cluster.signals.length < 2) return false;
  const coreTopics = countryKey === "spain" ? SPAIN_CORE_RELOC_TOPICS : CORE_RELOC_TOPICS;
  if (cluster.topic === "general") return cluster.signals.length >= 5;
  return coreTopics.has(cluster.topic) || cluster.topic === "general";
}

export function isDuplicateTopic(
  topic: string,
  existingTopics: Set<string>,
  title: string
): boolean {
  if (topic !== "bank") return false;
  if (!existingTopics.has("bank")) return false;
  return /\b(bank|банк|сч[её]т|conta)\b/i.test(title);
}

export function latestSignalPostedAt(signals: { posted_at: string }[]): string {
  const sorted = signals.map((s) => s.posted_at).sort();
  return sorted[sorted.length - 1] ?? new Date().toISOString();
}

export function spotlightEligibleKinds(): ContentKind[] {
  return ["news", "lifehack", "tip", "qa", "guide"];
}
