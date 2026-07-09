/**
 * Enrich Tesla/EV guide with real community_signals practice (editorial pass).
 *
 *   npx tsx scripts/portugal-enrich-tesla-ev-guide.ts
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { scoreBlueprint, validateAgainstBlueprint } from "@/lib/community-notes/article-blueprint";
import { ensurePortugalCronEnv } from "@/lib/community-notes/cron-env";
import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";
import { communityNotePublicUrl } from "@/lib/community-notes/note-url";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNoteFaq, NoteBodySection } from "@/lib/community-notes/types";

const SLUG = "elektromobil-tesla-v-portugalii-2026";

/** Relevant signals: autolife_pt (2), por_tugal (1), lepta (3) — Jul 2025–Jul 2026. */
export const SIGNAL_COUNT = 6;

const keyTakeaways = [
  "Официально: Чистые электромобили (carro elétrico) освобождены от ISV при регистрации и от ежегодного IUC — по Статье 5 Кодекса IUC и правилам Finanças.",
  "На практике: В autolife_pt (июль 2026) владельцы Tesla отмечают: на «obscure» зарядках Mobi.E неработающие станции бывают ~1–2 раза из 10; надёжнее ехать к Decathlon, сетевым ТЦ и Supercharger.",
  "На практике: Для Model 3 Standard Range в Norte (Порту, Брага) городской режим без домашней зарядки возможен, но дороже; домашний carregador по ночному тарифу (~€0.10–0.15/кВт⋅ч) — самый предсказуемый вариант.",
  "Расхождение: Карта Miio/PlugShare показывает широкое покрытие, но статус «last used» в Google Maps часто не совпадает с реальностью — в чате советуют проверять станцию в приложении перед поездкой.",
  "На практике: Порту → Лиссабон (~320 км по A1) на Tesla проходят с одной остановкой 15–20 мин на Supercharger (Gaia, Leiria); в Norte быстрых DC за пределами A1 и центра Порту/Браги меньше, чем на карте.",
  "С 2025–2026 (Decreto 93/2025, MB Way): контракт с CEME для публичной зарядки больше не обязателен — оплата через MB Way, QR или карту напрямую на станции.",
];

const bodySections: NoteBodySection[] = [
  {
    heading: "Словарь терминов",
    section_kind: "glossary",
    paragraphs: [
      "Ключевые термины на португальском (PT-PT) — чтобы читать порталы IMT/Finanças, договоры condomínio и приложения зарядки без постоянного перевода.",
    ],
    bullets: [
      "**carro elétrico** — электромобиль; в документах IMT и страховке указывается тип de energia",
      "**ISV (Imposto Sobre Veículos)** — налог при первой регистрации; для чистых EV = 0 €",
      "**IUC (Imposto Único de Circulação)** — ежегодный дорожный налог; для чистых EV не начисляется",
      "**Mobi.E** — национальная сеть публичных зарядных станций (операторы-CEME на точках)",
      "**CEME** — коммерческий оператор зарядки; с 2025–2026 прямой контракт не обязателен",
      "**carregador doméstico** — домашняя зарядка (wallbox); в condomínio нужно согласование",
      "**condomínio** — управление многоквартирного дома; решает установку зарядки на паркинге",
      "**autonomia** — заявленный запас хода; на трассе и в холоде обычно на 20–30% ниже",
      "**IPO (Inspeção Periódica Obrigatória)** — обязательный техосмотр; для EV те же правила, плюс recall-блокировка с 2025",
      "**IMT** — Instituto da Mobilidade e dos Transportes; регистрация авто, права, техосмотр",
    ],
  },
  {
    heading: "Налоги и регистрация электромобиля",
    section_kind: "official",
    paragraphs: [
      "Португалия стимулирует переход на электромобили налоговыми льготами. Правила едины для всей страны, включая Norte (Порту, Брага, Minho).",
    ],
    bullets: [
      "ISV: чистый электромобиль (0 г CO₂, только электричество) — освобождение от налога при регистрации.",
      "IUC: для carros elétricos ежегодный дорожный налог не начисляется (Статья 5 Кодекса IUC).",
      "Регистрация: покупка в PT или импорт — через IMT/conservatória; нужны NIF, страховка (seguro automóvel), Certificado de Matrícula.",
      "Plug-in hybrid: льготы меньше, чем у чистого EV — проверяйте CO₂ и дату первой регистрации на portaldasfinancas.gov.pt.",
      "Субсидии (incentivos): периодически обновляются на gov.pt — сумма и условия зависят от бюджета и типа авто.",
    ],
  },
  {
    heading: "Зарядная инфраструктура — что на порталах",
    section_kind: "official",
    paragraphs: [
      "Публичная сеть Mobi.E охватывает Португалию; Tesla Supercharger — отдельная сеть вдоль магистралей. С 2025 года правила оплаты упрощаются.",
    ],
    bullets: [
      "Decreto n.º 93/2025 (por_tugal, авг. 2025): убирает обязательный контракт с CEME — оплата через MB Way, QR-код или банковскую карту на станции.",
      "Mobi.E: станции разных операторов; тарифы публикуются оператором, не единые по всей сети.",
      "Tesla Supercharger: отдельные точки вдоль A1, A2, A3; тариф ~€0.40–0.55/кВт⋅ч (2026, по данным владельцев).",
      "Домашняя зарядка: по ночному тарифу EDP/Goldenergy ~€0.10–0.15/кВт⋅ч — дешевле публичных DC.",
      "Приложения: Miio (агрегатор Mobi.E), PlugShare (отзывы), Mobyfinder (lepta, 2025 — прогноз занятости станции).",
    ],
  },
  {
    heading: "Повседневное владение в Norte (Порту, Брага, Matosinhos)",
    section_kind: "practice",
    paragraphs: [
      "Для релокантов в Norte городской режим на Tesla Model 3/Y реален при домашней или рабочей зарядке. Без своего паркинга всё сложнее — публичные точки в центре Порту и на парковках ТЦ.",
    ],
    bullets: [
      "Порту/Брага: для поездок в радиусе 1–2 часов (Norte, Minho, Douro) домашняя зарядка закрывает 90% кейсов — типичный сценарий из autolife_pt (2026).",
      "Без паркинга: уличные зарядки в Cedofeita/Boavista и парковки Continente/Decathlon — часто заняты вечером; закладывайте запас 20–30% autonomia.",
      "Зима/трасса: реальный запас хода на A1 на 20–30% ниже WLTP — в чатах советуют не планировать маршрут «впритык».",
      "Страховка: seguro для EV сравнима с бензиновым классом; уточняйте покрытие батареи и assistance на 0% заряда.",
      "Техосмотр IPO: с марта 2025 неисправленный recall блокирует IPO — для подержанного EV проверяйте историю до покупки.",
    ],
  },
  {
    heading: "Зарядки на практике: Supercharger, Mobi.E, Miio",
    section_kind: "practice",
    paragraphs: [
      "Официальные карты показывают хорошее покрытие, но в чатах autolife_pt (июль 2026) главная жалоба — нестабильность публичных точек вне крупных сетей.",
    ],
    bullets: [
      "autolife_pt (2026): на «obscure» зарядках Mobi.E станция не работает примерно 1–2 раза из 10; надёжнее — Decathlon, крупные ТЦ, Supercharger.",
      "Google Maps «last used» — в чате называют ненадёжным; перед поездкой проверяйте статус в Miio или PlugShare.",
      "Supercharger на A1 (Порту → Лиссабон, ~320 км): одна остановка 15–20 мин на Gaia/Leiria — комфортный сценарий для Model 3 SR.",
      "Публичный DC Mobi.E: €0.45–0.80/кВт⋅ч в зависимости от оператора — в 3–5 раз дороже ночной домашней зарядки.",
      "MB Way (lepta, 2025): оплата без отдельного контракта CEME — сканируете QR на станции или платите в приложении.",
      "Дальние поездки в Алгарве (1–2 раза в год): Supercharger вдоль A2/A22; внутренние районы — только AC, планируйте ночёвку с зарядкой.",
    ],
  },
  {
    heading: "Домашняя зарядка и condomínio",
    section_kind: "practice",
    paragraphs: [
      "Домашний carregador — самый дешёвый и предсказуемый способ. В многоквартирном доме процесс зависит от condomínio, не только от закона.",
    ],
    bullets: [
      "По закону condomínio не может запретить установку, если она технически возможна и расходы на вас — но на практике нужно письменное согласование.",
      "Аренда с паркингом: согласуйте с senhorio и администрацией дома до покупки wallbox; в старых зданиях Порту мощность стояка может быть ограничена.",
      "Съём без паркинга: полагаться только на публичные станции — дороже и нервнее; в Norte это главный аргумент «за» дом/гараж.",
      "Ночной тариф: оформите bi-horário или simétrico с ночной зоной — экономия ощутима при ежедневной зарядке.",
    ],
  },
  {
    heading: "Где расходится официальная карта и реальность",
    section_kind: "gap",
    paragraphs: [
      "Порталы и агрегаторы рисуют плотное покрытие, но опыт в чатах расходится с картой — особенно за пределами A1 и крупных городов Norte.",
    ],
    bullets: [
      "Сайт Mobi.E: много точек на карте — на деле часть AC 3,7 кВт, часть DC неисправна или занята без обновления статуса.",
      "Miio vs реальность: в autolife_pt (2026) спрашивали, отражает ли карта действительность — ответ: проверяйте перед выездом, не полагайтесь на «last used».",
      "Norte вне A1: быстрых DC в глубине Minho/Trás-os-Montes мало — для Tesla лучше маршрут через Supercharger на магистрали.",
      "Decreto 93/2025 упростил оплату, но не ускорил ремонт сломанных станций — инфраструктура отстаёт от спроса в пик сезона.",
      "Model 3 SR: для редких поездок Порту–Faro/Algarve нужен план Supercharger; «проеду без остановок» — рискованно зимой.",
    ],
  },
  {
    heading: "Типичные ошибки владельцев EV в Norte",
    section_kind: "practice",
    bullets: [
      "Ошибка: планировать маршрут «впритык» по WLTP — на A1 зимой запас на 20–30% ниже заявленного.",
      "Ошибка: ехать на obscure Mobi.E без проверки в Miio — autolife_pt: 1–2 из 10 точек не работают.",
      "Ошибка: покупать EV без паркинга и рассчитывать только на уличные зарядки в центре Порту — вечером точки заняты.",
      "Ошибка: не согласовать wallbox с condomínio до покупки авто — в старых зданиях мощность стояка ограничена.",
      "Ошибка: полагаться на Google Maps «last used» вместо PlugShare/Miio перед дальней поездкой.",
      "Ошибка: брать подержанный EV без проверки recall — с марта 2025 невыполненный recall блокирует IPO.",
    ],
  },
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Сколько реально стоит зарядить Tesla в Португалии?",
    a: "По правилам тарифы публикует оператор. На практике: дома по ночному тарифу ~€0.10–0.15/кВт⋅ч; Supercharger ~€0.40–0.55; публичный DC Mobi.E ~€0.45–0.80/кВт⋅ч (2026).",
  },
  {
    q: "Хватит ли запаса хода для поездки из Порту в Лиссабон?",
    a: "По правилам — зависит от модели. На практике Model 3 SR проезжает ~320 км по A1 с одной остановкой 15–20 мин на Supercharger (Gaia/Leiria); зимой закладывайте запас 20–30%.",
  },
  {
    q: "Сложно ли установить зарядку в съёмной квартире с паркингом?",
    a: "По закону condomínio не может необоснованно запретить. На практике нужно согласование с senhorio и администрацией; в старых домах Порту возможны ограничения по мощности.",
  },
  {
    q: "Какие приложения нужны для зарядок в Norte?",
    a: "Официально: Miio для Mobi.E, приложение Tesla для Supercharger. На практике добавьте PlugShare (отзывы/статус) и Mobyfinder (прогноз занятости, lepta 2025); оплата — MB Way или карта с 2025.",
  },
  {
    q: "Есть ли смысл покупать электромобиль без своего паркинга в Порту?",
    a: "По правилам — да, через публичную сеть. На практике в Norte без паркинга дороже и нервнее: станции у ТЦ заняты, obscure точки ненадёжны (autolife_pt: 1–2 из 10 не работают).",
  },
  {
    q: "Какие налоги платит владелец Tesla в Португалии?",
    a: "Официально: ISV = 0 € и IUC не начисляется для чистого EV. На практике платите только seguro, техосмотр IPO и электричество; plug-in hybrid — льготы меньше.",
  },
];

async function main() {
  ensurePortugalCronEnv();
  const supabase = createServerClient();

  const quickAnswer =
    "Tesla и другие EV в Norte (Порту, Брага) выгодны по налогам (ISV/IUC = 0), но зарядка — главный практический вопрос. Домашний carregador дешевле всего; публичные Mobi.E нестабильны (~1–2 из 10 «obscure» точек, autolife_pt 2026). Дальние поездки по A1 — через Supercharger.";

  const seoDescription =
    "Tesla и электромобили в Португалии 2026: ISV/IUC, зарядка Mobi.E и Supercharger в Порту и Norte, домашний carregador, Miio — официально и на практике.";

  const draft = {
    slug: SLUG,
    content_kind: "guide" as const,
    seo_title: "Электромобиль в Португалии: зарядка, налоги, Tesla",
    seo_description: seoDescription,
    quick_answer: quickAnswer,
    body_sections: bodySections,
    body_paragraphs: [] as string[],
    faq,
    key_takeaways: keyTakeaways,
    official_links: [
      { title: "IMT — Registo de veículos", url: "https://www.imt-ip.pt/" },
      { title: "Portal das Finanças — ISV", url: "https://www.portaldasfinancas.gov.pt/" },
      { title: "Mobi.E", url: "https://www.mobie.pt/" },
    ],
  };

  const errors = validateNoteDraft(draft);
  const blueprint = validateAgainstBlueprint(draft);
  errors.push(...blueprint.errors);

  if (errors.length > 0) {
    throw new Error(`Quality gate: ${errors.join("; ")}`);
  }

  console.log(`[blueprint] score ${blueprint.score}/100`);

  const now = new Date().toISOString();
  const { data: existing, error: fetchErr } = await supabase
    .from("community_notes")
    .select("id, published_at")
    .eq("slug", SLUG)
    .maybeSingle();

  if (fetchErr) throw new Error(fetchErr.message);
  if (!existing) throw new Error(`Note not found: ${SLUG}`);

  const { error } = await supabase
    .from("community_notes")
    .update({
      content_kind: "guide",
      quick_answer: draft.quick_answer,
      key_takeaways: draft.key_takeaways,
      body_sections: draft.body_sections,
      faq: draft.faq,
      seo_description: draft.seo_description,
      source_label: "enrich:practice+editorial",
      topic_tags: ["auto", "portugal"],
      official_links: [
        { title: "IMT — Registo de veículos", url: "https://www.imt-ip.pt/" },
        { title: "Portal das Finanças — ISV", url: "https://www.portaldasfinancas.gov.pt/" },
        { title: "Mobi.E", url: "https://www.mobie.pt/" },
      ],
      updated_at: now,
    })
    .eq("id", existing.id);

  if (error) throw new Error(error.message);

  console.log(`[enrich] ✓ ${SLUG} — ${SIGNAL_COUNT} signals → practice sections updated`);
  console.log(`[blueprint] score ${scoreBlueprint(draft)}/100`);

  try {
    const { path: ogPath } = await ensureNoteOgImage({ slug: SLUG, title: draft.seo_title });
    console.log(`[og-image] ${ogPath}`);
  } catch (ogError) {
    const msg = ogError instanceof Error ? ogError.message : "og image failed";
    console.warn(`[og-image] skip: ${msg}`);
  }
  console.log(`URL: ${communityNotePublicUrl(SLUG)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
