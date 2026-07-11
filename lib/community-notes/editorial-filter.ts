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

export function shouldAutoPublishCluster(
  cluster: SignalCluster,
  countryKey: "portugal" | "spain" = "portugal"
): boolean {
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
