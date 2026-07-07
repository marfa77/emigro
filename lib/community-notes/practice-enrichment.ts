import { flattenBodySections, type DraftQualityInput } from "@/lib/community-notes/editorial-quality";
import {
  bootstrapOfficialPracticeCopy,
  validateOfficialPracticeCopy,
} from "@/lib/community-notes/official-vs-practice";
import type {
  CommunityNote,
  CommunitySignal,
  CommunitySignalIngest,
  ContentKind,
  NoteBodySection,
} from "@/lib/community-notes/types";

export type PracticeAuditResult = {
  slug: string;
  status: "OK" | "NEEDS_ENRICHMENT";
  reasons: string[];
  practiceBulletCount: number;
  specificBulletCount: number;
};

const SPECIFIC_RE =
  /€|\d+\s*(€|мес|месяц|дн|дней|нед|час|часов|год|лет|%|гб|gb|mb|мб)|Porto|Порту|Braga|Брага|Matosinhos|Guimarães|Viana|Norte|OPO|LIS|Millennium|ActivoBank|Caixa|MEO|NOS|Vodafone|Nowo|WTF|Amigo|AIMA|Finanças|SNS|Junta|IMT|CIAB|ANACOM|Agora|Cascais|Sintra|Coimbra|Évora|\d{4}/i;

const GENERIC_RE =
  /^(Проверьте|Сравните|Изучите|Уточните|Спросите|Почитайте|Не провер|Не читай|Не сравн|Соглашайтесь|Игнорируйте|Подключайте)/i;

const CHAT_GROUNDED_RE =
  /€|\d+\s*(€|мес|месяц|дн|дней|нед|час|часов|год|лет|%|гб|gb)|в чате|CIAB|ANACOM|WTF|Amigo|Multicare|Revolut|Idealista|Worten|Fixando|services\.aima|шестую линию|замкнутый круг|Junta de Freguesia|ASSINATURA|rúbrica|утente|SNS24|médico de família/i;

const TOPIC_KEYWORDS: Record<string, string[]> = {
  nif: ["nif", "finanças", "financas", "e-fatura", "налог", "financas"],
  aima: ["aima", "agora", "внж", "vng", "миграц", "imigrante"],
  arenda: ["arenda", "аренд", "arrendamento", "caução", "caucao", "fiador", "termo"],
  bank: ["bank", "банк", "счёт", "счет", "conta", "cartão", "кредитн", "millennium", "activobank"],
  sns: ["sns", "utente", "centro de saúde", "centro de saude", "здоров"],
  ciple: ["ciple", "caple", "a2", "гражданств"],
  sim: ["internet", "интернет", "fibra", "фибр", "meo", "nos", "vodafone", "nowo", "wtf", "amigo", "gigabit", "тариф", "провайдер", "fideliza"],
  pets: ["pets", "питом", "dgav", "собак", "кошк", "microchip"],
  transport: ["metro", "cp", "comboios", "транспорт", "navegante"],
  auto: ["imt", "машин", "carro", "veículo", "veiculo", "водител", "carta"],
  school: ["school", "школ", "international", "ib", "escola"],
};

function practiceTexts(note: Pick<CommunityNote, "body_sections" | "key_takeaways">): string[] {
  const sections = note.body_sections ?? [];
  const practiceSections = sections.filter(
    (s) =>
      s.section_kind === "practice" ||
      /на практике|как обычно|в чате|реальн|опыт релокант/i.test(s.heading)
  );
  const bullets = practiceSections.flatMap((s) => s.bullets ?? []);
  const paragraphs = practiceSections.flatMap((s) => s.paragraphs ?? []);
  const takeaways = (note.key_takeaways ?? []).filter((t) => /^На практике:/i.test(t));
  return [...bullets, ...paragraphs, ...takeaways];
}

export function auditPracticeQuality(
  note: Pick<CommunityNote, "slug" | "content_kind" | "body_sections" | "key_takeaways">,
  opts?: { strict?: boolean }
): PracticeAuditResult {
  const texts = practiceTexts(note);
  const practiceBulletCount = note.body_sections
    .filter((s) => s.section_kind === "practice")
    .flatMap((s) => s.bullets ?? []).length;
  const specificBulletCount = texts.filter((t) => SPECIFIC_RE.test(t)).length;
  const genericOnlyBullets =
    texts.filter((t) => GENERIC_RE.test(t.trim())).length >= 3 && specificBulletCount < 2;
  const genericChecklistDominant =
    practiceBulletCount >= 4 &&
    texts.filter((t) => GENERIC_RE.test(t.trim())).length / Math.max(practiceBulletCount, 1) >= 0.5 &&
    texts.filter((t) => CHAT_GROUNDED_RE.test(t)).length < 2;
  const reasons: string[] = [];

  if (texts.length === 0) reasons.push("no practice content");
  if (practiceBulletCount === 0 && texts.length > 0) reasons.push("practice has paragraphs only, no bullets");
  if (specificBulletCount < 2) reasons.push(`only ${specificBulletCount} specific practice items`);
  if (genericOnlyBullets) reasons.push("generic checklist without channel specifics");
  if (genericChecklistDominant) reasons.push("generic imperative checklist dominates practice section");

  const structural = validateOfficialPracticeCopy(note);
  if (structural.length > 0) reasons.push(...structural);

  const relaxedOk = reasons.length === 0 || (specificBulletCount >= 3 && !genericOnlyBullets);
  const status = opts?.strict
    ? reasons.length === 0
      ? "OK"
      : "NEEDS_ENRICHMENT"
    : relaxedOk
      ? "OK"
      : "NEEDS_ENRICHMENT";

  return {
    slug: note.slug,
    status: status === "OK" ? "OK" : "NEEDS_ENRICHMENT",
    reasons,
    practiceBulletCount,
    specificBulletCount,
  };
}

export function buildSearchKeywords(
  note: Pick<CommunityNote, "slug" | "title" | "topic_tags">
): string[] {
  const fromSlug = note.slug
    .replace(/-2026$/, "")
    .split("-")
    .filter((w) => w.length > 2 && !/^\d+$/.test(w));
  const fromTitle = note.title
    .toLowerCase()
    .replace(/[^a-zа-яё0-9\s]/gi, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const topicExtras = note.topic_tags.flatMap((t) => TOPIC_KEYWORDS[t] ?? [t]);
  return Array.from(new Set([...fromSlug, ...fromTitle.slice(0, 8), ...topicExtras])).slice(0, 20);
}

export function anonymizeSignalText(text: string): string {
  return text
    .replace(/@[\w\d_]+/g, "")
    .replace(/\+?\d[\d\s()-]{8,}\d/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Extract concrete practice bullets from channel messages. */
export function extractPracticeBullets(
  signals: Array<Pick<CommunitySignal, "text">>,
  limit = 8
): string[] {
  const bullets: string[] = [];
  const seen = new Set<string>();

  for (const signal of signals) {
    const clean = anonymizeSignalText(signal.text);
    if (clean.length < 40) continue;

    const sentences = clean.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
    for (const sentence of sentences) {
      if (sentence.length < 30 || sentence.length > 280) continue;
      if (!SPECIFIC_RE.test(sentence) && !/на практике|в чате|обычно|рекоменд|совет|штраф|очеред|слот|ждал|месяц|недел/i.test(sentence))
        continue;
      if (/MEO Arena|концерт|Megadeth|Iron Maiden|фестивал|праздник|корабл|кокаин|расизм|Uber|FlixBus|библиотек|комикс/i.test(sentence))
        continue;

      const normalized = sentence.toLowerCase().slice(0, 80);
      if (seen.has(normalized)) continue;
      seen.add(normalized);

      let bullet = sentence;
      if (/^[-•]\s/.test(bullet)) bullet = bullet.replace(/^[-•]\s*/, "");
      bullets.push(bullet.charAt(0).toUpperCase() + bullet.slice(1));
      if (bullets.length >= limit) return bullets;
    }
  }

  return bullets;
}

/** Hand-tuned bullets when signals are sparse but topic is known. */
export const CURATED_PRACTICE: Record<string, string[]> = {
  "aima-agora-zapis-2026": [
    "services.aima.gov.pt (2026): отдельный сервис для продления просроченных ВНЖ — только после e-mail от AIMA с требованием оплатить госпошлину; без письма форма недоступна.",
    "LIS аэропорт: держателям ВНЖ/ВМЖ выделили отдельную (6-ю) линию паспортного контроля — очереди для «обычных» пассажиров из не-Шенгена часто 1–4 часа.",
    "При риске опоздания на рейс: покажите посадочный сотруднику аэропорта — в чатах не отказывали провести через паспортный контроль и досмотр вне общей очереди.",
    "Слоты Agora по-прежнему «ловят» ночью/рано утром; мониторинг в несколько браузеров + уведомления — типичная стратегия, официального расписания релиза нет.",
  ],
  "arenda-lissabon-do-podpisi": [
    "Замкнутый круг в чатах: для аренды нужен местный IBAN/банк, для банка — адрес; выход — посредник по NIF, Termo у знакомого или краткосрочная бронь с регистрацией.",
    "С 1 августа 2025 арендатор может сам зарегистрировать Contrato de Arrendamento в Finanças, если арендодатель не сделал это за месяц — нужны данные договора и NIF обеих сторон.",
    "Подпись: assinatura (полное имя в Cartão de Cidadão) ≠ rúbrica (короткая «закорючка»); в договоре аренды часто требуют именно assinatura — уточняйте до подписания.",
    "Просмотр до подписи: проверяйте воду, электричество, интернет по адресу (fibra на сайте MEO/NOS) — в чатах это называют обязательным, не «опцией».",
  ],
  "arenda-kvartiry-lisbon-pervyi-mesyac-2026": [
    "Idealista/Rentalia: основной агрегатор; в 2025 Idealista интегрировал Rentalia — смотрите и долгосрочную аренду, и сезонные объявления, чтобы не переплатить.",
    "Вне Lx/Porto: по данным Idealista Q2 2025, топ спроса на аренду смещается в пригороды — Braga, Guimarães, Matosinhos часто дешевле при сопоставимой инфраструктуре.",
    "Депозит и fiador: на практике просят 2–3 месяца вперёд + caução 1–2 месяца; если нет португальского fiador — предоплата или корпоративный договор.",
    "Замкнутый круг банк↔адрес: типичный совет — сначала NIF + Revolut/ActivoBank онлайн, затем Termo или краткая аренда для адреса в Finanças.",
  ],
  "pervyj-mesyac-portugaliya-checklist": [
    "Revolut (2026): клиентам с RU-паспортом приходили предупреждения о блокировке при переводах «из России» — держите основной счёт в PT-банке для аренды и SNS.",
    "NIF + Revolut: в чатах подтверждали оформление Revolut по паспорту + NIF/NISS — удобно первые недели, но не заменяет PT IBAN для договора аренды.",
    "Безопасность жилья: в чатах предупреждают — старые деревянные окна нужно «щёлкать» до конца; в 2022–23 были кражи через незакрытые окна у студентов в Lx.",
    "Norte: для Порту/Брага первый месяц — Andante (зона Z2/3), Junta de Freguesia для Atestado, Finanças для NIF; AIMA-центры севернее Lx — Marco de Canaveses, не Saldanha.",
  ],
  "sns-registration-changes-2026": [
    "Частная страховка: в чатах обсуждают Multicare 3 для семьи — цена зависит от возраста; спрашивайте годовую котировку до отказа от частной клиники.",
    "SNS: дефицит медсестёр (~14 000) — очереди к специалистам реальны; правила доступа к врачам меняются с хронологического принципа на более структурированный triage.",
    "Atestado de Residência в Junta: в Lx/Porto 3–14 дней; без него часть центров saúde откладывает регистрацию, хотя номер utente выдать обязаны.",
    "Экстренные случаи: в чатах описывали SNS + частную клинику параллельно — для острых симптомов у подростков не ждут только médico de família.",
  ],
  "termo-responsabilidade-podtverzhdenie-zhilya-2026": [
    "AIMA (2026): ужесточили подтверждение адреса — для части кейсов могут потребовать declaração от senhorio (собственника), не только Termo от друга/родственника.",
    "Termo для визита родственника: в чатах спрашивали — нужен ли Contrato de Arrendamento к Termo; безопаснее приложить договор или Atestado, если адрес не совпадает с пропиской приглашающего.",
    "Заверение в Junta: €10–20 за autenticação de assinatura; Notário дороже, но принимают везде — для AIMA в аэропорту OPO/LIS часто хватает цветного скана, оригинал надёжнее.",
    "Título de Residência vs паспорт: для Termo достаточно копии ВНЖ приглашающего; разворот загранпаспорта — если нет PT-карты, но адрес подтверждён Atestado.",
  ],
  "nif-lissabon-chto-puutayut": [
    "Миф «NIF только с ВНЖ»: в чатах студенты открывают счёт по студенческой визе — NIF можно получить раньше ВНЖ через Finanças или представителя.",
    "Смена адреса: после переезда обновите morada на portaldasfinancas.gov.pt — иначе e-Fatura и связь с Junta/SNS идут на старый адрес.",
    "Revolut: оформляется по паспорту + NIF/NISS — удобный старт, но аренда и SNS часто требуют PT IBAN и Atestado de Residência.",
    "Finanças vs «NIF Лиссабон»: налоговый номер один на всю страну; «лиссабонский» путаница — из-за очередей в крупных городах, в Norte (Braga, Guimarães) часто быстрее очно.",
  ],
  "studencheskiy-vnzh-portugal-mify-aima-2026": [
    "Миф «студенческий ВНЖ годами»: в чатах пугают, но банки обязаны открывать счёт по студенческой визе — это основание легального пребывания, даже без карты ВНЖ.",
    "services.aima.gov.pt: продление просроченных студенческих/рабочих ВНЖ — только после e-mail AIMA с оплатой пошлины; не путать с первичной записью Agora.",
    "NIF до ВНЖ: типичный порядок — виза → NIF → счёт → SNS; ждать карту ВНЖ для NIF не обязательно.",
    "Синтра/музеи: держатели ВНЖ спрашивали о льготном входе в Pena по будням — уточняйте на кассе с Título de Residência, правила зависят от объекта.",
  ],
  "lgoty-s-vnj-kulturnye-mesta-2026": [
    "Palácio da Pena (Sintra): в чатах сообщали о бесплатном входе по будням при предъявлении ВНЖ — уточняйте на кассе, акции меняются по сезону.",
    "Держите Título de Residência или PDF от AIMA + паспорт: многие муниципальные музеи Norte (Porto, Braga) дают скидку residente, не туристу.",
    "Льготы не автоматические: часто нужно сказать «sou residente» и показать карту — кассир может не предложить сам.",
    "Cultural passes: в Lx карта Lisboa Viva/муzeйные карты; в Porto Andante + отдельные абонементы Serralves/Casa da Música — residente дешевле на 20–40%.",
  ],
  "poisk-mestnyh-uslug-portugaliya-2026": [
    "Worten: техника с гарантией — можно открыть спор в приложении или нести в магазин через 1+ год; в чатах подтверждали ремонт/замену по garantia legal.",
    "Мастера: Fixando.pt и рекомендации в локальных чатах (Oeiras, Cascais, Porto) — для мелкого ремонта (кarnизы, сантехника) быстрее, чем OLX без отзывов.",
    "Цены: за монтаж карнизов/мелкий ремонт в Lx в чатах просят €40–80 за визит + материалы — всегда просите orçamento до начала.",
    "Autorizado vs частник: для гарантийной техники — centro autorizado; для жилья — частный eletricista/canalizador с рекомендацией от соседей по parish.",
  ],
  "vybor-internet-provaydera-portugaliya-2026": [
    "WTF (альтернативный провайдер fibra): в чате отмечают стабильную скорость без перепадов за 3+ месяца, но подключение может затянуться — клиента могут «перекидывать» между отделениями/этапами оформления.",
    "NOS снова предлагает тарифы до 10 Gbit/s — в чатах спрашивают, выдаёт ли реальную скорость; перед подписанием стоит проверить по адресу и попросить тестовый период, если доступен.",
    "Vodafone → суб-бренд Amigo: внутренняя смена тарифа не должна считаться уходом к конкуренту (позиция ANACOM), но на практике приходил счёт €117,43 за «досрочное расторжение» — оспаривали через CIAB, штраф аннулировали.",
    "При смене оператора сохраняйте переписку и номера претензий: CIAB бесплатен для споров по связи, Vodafone часто снимает неустойку до арбитража, если сослаться на ANACOM.",
    "Перед fidelização 24 мес: уточните стоимость расторжения и что считается «сменой оператора» — переход между брендами одной компании формально не portabilidade.",
  ],
};

export function mergePracticeBullets(
  sections: NoteBodySection[],
  newBullets: string[]
): NoteBodySection[] {
  if (newBullets.length === 0) return sections;

  const existing = new Set(
    sections
      .flatMap((s) => s.bullets ?? [])
      .map((b) => b.toLowerCase().slice(0, 60))
  );
  const toAdd = newBullets.filter((b) => !existing.has(b.toLowerCase().slice(0, 60)));
  if (toAdd.length === 0) return sections;

  let practiceIdx = sections.findIndex((s) => s.section_kind === "practice");
  if (practiceIdx < 0) {
    practiceIdx = sections.findIndex((s) => /на практике|как обычно|в чате/i.test(s.heading));
  }
  if (practiceIdx < 0) {
    return [
      ...sections,
      {
        heading: "Как обычно проходит — по опыту чатов",
        section_kind: "practice" as const,
        bullets: toAdd,
      },
    ];
  }

  const target = sections[practiceIdx];
  const mergedBullets = [...(target.bullets ?? []), ...toAdd].slice(0, 12);

  return sections.map((s, i) =>
    i === practiceIdx ? { ...s, section_kind: s.section_kind ?? "practice", bullets: mergedBullets } : s
  );
}

export function enrichTakeaways(
  takeaways: string[],
  newBullets: string[]
): string[] {
  const practiceItems = takeaways.filter((t) => /^На практике:/i.test(t));
  const others = takeaways.filter((t) => !/^На практике:/i.test(t));
  const existingPractice = practiceItems.map((t) => t.replace(/^На практике:\s*/i, "").toLowerCase());

  const additions: string[] = [];
  for (const bullet of newBullets.slice(0, 3)) {
    const short = bullet.length > 200 ? `${bullet.slice(0, 197)}…` : bullet;
    if (!existingPractice.some((e) => e.includes(short.toLowerCase().slice(0, 40)))) {
      additions.push(`На практике: ${short}`);
    }
  }

  if (additions.length === 0) return takeaways;
  const official = others.filter((t) => /^Официально:/i.test(t));
  const rest = others.filter((t) => !/^Официально:/i.test(t));
  return [...official, ...practiceItems, ...additions, ...rest].slice(0, 8);
}

export function applyPracticeEnrichment(
  note: Pick<CommunityNote, "slug" | "body_sections" | "key_takeaways">,
  bullets: string[]
): { body_sections: NoteBodySection[]; key_takeaways: string[]; body_paragraphs: string[]; added: number } {
  const curated = CURATED_PRACTICE[note.slug] ?? [];
  const allBullets = [...curated, ...bullets];
  const body_sections = mergePracticeBullets(note.body_sections, allBullets);
  const before = note.body_sections.flatMap((s) => s.bullets ?? []).length;
  const after = body_sections.flatMap((s) => s.bullets ?? []).length;
  const key_takeaways = enrichTakeaways(note.key_takeaways, allBullets);
  return {
    body_sections,
    key_takeaways,
    body_paragraphs: flattenBodySections(body_sections),
    added: after - before,
  };
}

export type PracticeEnrichmentResult = {
  draft: DraftQualityInput & { slug: string };
  signalBullets: number;
  enrichmentAdded: number;
  audit: PracticeAuditResult;
};

/** Bootstrap official/practice split and inject chat-grounded bullets before publish. */
export function enrichDraftPracticeFromSignals(
  draft: DraftQualityInput & { slug: string },
  signals: CommunitySignalIngest[]
): PracticeEnrichmentResult {
  const bootstrapped = bootstrapOfficialPracticeCopy({
    content_kind: draft.content_kind,
    quick_answer: draft.quick_answer,
    key_takeaways: draft.key_takeaways,
    body_sections: draft.body_sections,
  });

  let working: DraftQualityInput & { slug: string } = {
    ...draft,
    key_takeaways: bootstrapped.key_takeaways,
    body_sections: bootstrapped.body_sections,
    body_paragraphs: flattenBodySections(bootstrapped.body_sections),
  };

  const signalBullets = extractPracticeBullets(signals, 8);
  const enriched = applyPracticeEnrichment(working, signalBullets);
  working = {
    ...working,
    body_sections: enriched.body_sections,
    key_takeaways: enriched.key_takeaways,
    body_paragraphs: enriched.body_paragraphs,
  };

  const audit = auditPracticeQuality(
    {
      slug: draft.slug,
      content_kind: working.content_kind,
      body_sections: working.body_sections,
      key_takeaways: working.key_takeaways,
    },
    { strict: true }
  );

  return {
    draft: working,
    signalBullets: signalBullets.length,
    enrichmentAdded: enriched.added,
    audit,
  };
}

/** Human-readable errors for cron publish gate when practice is thin or generic. */
export function practicePublishGateErrors(audit: PracticeAuditResult, signalBullets: number): string[] {
  if (audit.status === "OK") return [];
  const errors = [...audit.reasons];
  if (signalBullets === 0) {
    errors.unshift("no practice bullets extracted from cluster signals");
  }
  return errors;
}
