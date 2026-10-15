/**
 * Golden Visa 2026 comparison PDFs from lib/investment/golden-visa-2026.ts (single source of truth).
 *   npx tsx scripts/build-golden-visa-pdf.ts
 * Output: public/assist/emigro_golden_visa_2026_comparison_{ru,en}.pdf (served with X-Robots-Tag: noindex).
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  GOLDEN_VISA_LAST_CHECKED,
  GOLDEN_VISA_ROWS,
  INVEST_COMPARE_PDF_PATH,
  PORTUGAL_2026_CALLOUT,
  VERIFY_BADGE,
  investPagePath,
  isVerifyOnly,
  type FactCell,
  type GoldenVisaRow,
  type InvestLocale,
} from "../lib/investment/golden-visa-2026";
import { investBotDeepLink } from "../lib/telegram/deep-link";

const SITE = "https://www.emigro.online";
const CHROME =
  process.env.CHROME_BIN ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const LOGO_SVG = readFileSync(resolve("public/icon.svg"), "utf8");

const COPY = {
  ru: {
    docTitle: "Golden Visa 2026: сравнение программ ВНЖ за инвестиции",
    brandTag: "Private Capital · Investment Migration",
    eyebrow: (date: string) => `Сравнение программ · проверено ${date}`,
    title: "Golden Visa 2026",
    subtitle:
      "8 программ ВНЖ за инвестиции: пороги входа, сроки до гражданства и доступность для паспортов РФ/РБ — с официальными источниками.",
    stats: {
      total: "программ в сравнении",
      open: "открыты для новых заявок",
      ruBy: "закрыты для паспортов РФ/РБ",
      floor: "минимальный порог на бумаге",
    },
    takeawaysTitle: "Главное в 2026",
    takeaways: [
      "Португалия: только фонды от €500 000. С 19.05.2026 до гражданства — 10 лет (Lei Orgânica 1/2026).",
      "Испания закрыла Golden Visa 3 апреля 2025. Остаются ВНЖ без права работы, виза цифрового кочевника и ВНЖ предпринимателя.",
      "Италия, Греция и Мальта не принимают новые заявки граждан РФ/РБ. Португалия и Таиланд их законом не исключают.",
      "Недвижимость как основание в ЕС осталась только в Греции; вне ЕС — ОАЭ. В Португалии её исключили в 2023.",
    ],
    insideTitle: "Внутри",
    inside: [
      ["2", "Обзор", "8 программ в одной таблице"],
      ["3–6", "Карточки стран", "Маршруты, пороги, источники"],
      ["7", "Что дальше", "Подбор и Route Check"],
    ],
    overviewTitle: "Обзор: 8 программ на одной странице",
    overviewLead: "Пороги и статусы из официальных источников. Подробности и ссылки — в карточках стран.",
    head: ["Страна и программа", "Минимальный вход", "До гражданства", "Паспорта РФ/РБ"],
    calloutTitle: "Португалия, 2026",
    legendBadge: "пункт ещё не сверен вручную с официальным текстом — проверяйте источник",
    countriesTitle: "Программы по странам",
    facts: { min: "Минимальный вход", citizenship: "До гражданства", ruBy: "Паспорта РФ/РБ" },
    routes: "Маршруты и условия",
    sources: "Официальные источники",
    checked: "Проверено",
    notChecked: "уточняется",
    more: "Разбор на сайте",
    status: { open: "Открыта", closed: "Закрыта" },
    ruByPill: { open: "РФ/РБ: не исключены", restricted: "РФ/РБ: закрыта", verify: "РФ/РБ: уточняется", na: "" },
    ctaTitle: "Что дальше",
    ctaLead:
      "Таблица показывает правила. Какая программа реально открыта под ваш паспорт, бюджет и семью — разберём бесплатно, до разговора с фондом или брокером.",
    offers: [
      { name: "Бесплатный подбор маршрута", price: "€0", text: "4 вопроса на сайте — пришлём подходящие программы в течение 1 рабочего дня.", path: "compare", slot: "match" },
      { name: "Route Check", price: "€129", text: "Разовый созвон и PDF-маршрут за 48 часов: документы, сроки, риски отказа.", path: "/ru/route-check", slot: "route_check" },
      { name: "Сопровождение", price: "€100/час", text: "Письма, формы, разбор отказов — по часам, без пакетов.", path: "/ru/assist", slot: "assist" },
    ],
    open: "Открыть",
    telegram: "Вопрос по программе? Напишите в Telegram",
    disclaimer:
      "Emigro сравнивает миграционные характеристики программ, а не инвестиционную доходность. Это не юридическая, налоговая или инвестиционная консультация. Правила меняются — перед переводом денег сверяйте их с официальным источником и лицензированным юристом.",
    footer: (date: string) => `Emigro · Golden Visa 2026 · проверено ${date}`,
    utm: "pdf_ru",
  },
  en: {
    docTitle: "Golden Visa 2026: investment residency programmes compared",
    brandTag: "Private Capital · Investment Migration",
    eyebrow: (date: string) => `Programme comparison · checked ${date}`,
    title: "Golden Visa 2026",
    subtitle:
      "8 investment-residence programmes: entry thresholds, time to citizenship and eligibility for RU/BY passports — with official sources.",
    stats: {
      total: "programmes compared",
      open: "open to new applications",
      ruBy: "closed to RU/BY passports",
      floor: "lowest threshold on paper",
    },
    takeawaysTitle: "What matters in 2026",
    takeaways: [
      "Portugal: funds only, from €500,000. Since 19.05.2026 citizenship takes 10 years (Lei Orgânica 1/2026).",
      "Spain closed its golden visa on 3 April 2025. Non-lucrative residence, the digital nomad visa and the entrepreneur route remain.",
      "Italy, Greece and Malta do not accept new applications from RU/BY nationals. Portugal and Thailand do not exclude them by law.",
      "In the EU, property still qualifies on its own only in Greece; outside the EU, the UAE. Portugal removed it in 2023.",
    ],
    insideTitle: "Inside",
    inside: [
      ["2", "Overview", "8 programmes in one table"],
      ["3–6", "Country cards", "Routes, thresholds, sources"],
      ["7", "Next steps", "Free shortlist and Route Check"],
    ],
    overviewTitle: "Overview: 8 programmes on one page",
    overviewLead: "Thresholds and statuses from official sources. Details and links are in the country cards.",
    head: ["Country and programme", "Minimum investment", "Time to citizenship", "RU/BY passports"],
    calloutTitle: "Portugal, 2026",
    legendBadge: "not yet checked by a human against the official text — verify with the source",
    countriesTitle: "Programmes by country",
    facts: { min: "Minimum investment", citizenship: "Time to citizenship", ruBy: "RU/BY passports" },
    routes: "Routes and conditions",
    sources: "Official sources",
    checked: "Checked",
    notChecked: "being verified",
    more: "Full guide",
    status: { open: "Open", closed: "Closed" },
    ruByPill: { open: "RU/BY: not excluded", restricted: "RU/BY: closed", verify: "RU/BY: being verified", na: "" },
    ctaTitle: "What next",
    ctaLead:
      "The table shows the rules. Which programme is actually open to your passport, budget and family — we check that for free, before you talk to a fund or a broker.",
    offers: [
      { name: "Free route match", price: "€0", text: "4 questions on the site — we send matching programmes within 1 business day.", path: "compare", slot: "match" },
      { name: "Route Check", price: "€129", text: "One-off call and a PDF route within 48 hours: documents, timing, refusal risks.", path: "/ru/route-check", slot: "route_check" },
      { name: "Accompaniment", price: "€100/hour", text: "Emails, forms, refusal reviews — by the hour, no packages.", path: "/ru/assist", slot: "assist" },
    ],
    open: "Open",
    telegram: "Question about a programme? Message us on Telegram",
    disclaimer:
      "Emigro compares the migration features of programmes, not investment returns. This is not legal, tax or investment advice. Rules change — verify with the official source and a licensed lawyer before moving money.",
    footer: (date: string) => `Emigro · Golden Visa 2026 · checked ${date}`,
    utm: "pdf_en",
  },
} as const;

function esc(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function displayDate(iso: string, locale: InvestLocale): string {
  const [y, m, d] = iso.split("-");
  if (locale === "ru") return `${d}.${m}.${y}`;
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(m) - 1];
  return `${Number(d)} ${month} ${y}`;
}

function tracked(pathOrUrl: string, locale: InvestLocale, slot: string): string {
  const url = new URL(pathOrUrl, SITE);
  url.searchParams.set("utm_source", "pdf");
  url.searchParams.set("utm_medium", "lead_magnet");
  url.searchParams.set("utm_campaign", "golden_visa_2026");
  url.searchParams.set("utm_content", `${COPY[locale].utm}_${slot}`);
  return url.toString();
}

function badge(locale: InvestLocale): string {
  return `<span class="badge">${VERIFY_BADGE[locale]}</span>`;
}

function cell(value: FactCell, locale: InvestLocale): string {
  if (isVerifyOnly(value, locale)) return badge(locale);
  return `${esc(value[locale])}${value.verify ? ` ${badge(locale)}` : ""}`;
}

function routeItems(value: FactCell, locale: InvestLocale): string {
  const parts = value[locale].split(/;\s+/).filter(Boolean);
  const items = parts.map((part, index) => {
    const tail = value.verify && index === parts.length - 1 ? ` ${badge(locale)}` : "";
    return `<li>${esc(part.charAt(0).toUpperCase() + part.slice(1))}${tail}</li>`;
  });
  return `<ul class="routes">${items.join("")}</ul>`;
}

function statusPills(row: GoldenVisaRow, locale: InvestLocale): string {
  const t = COPY[locale];
  const pills = [
    `<span class="pill ${row.status === "open" ? "pill-open" : "pill-closed"}">${t.status[row.status]}</span>`,
  ];
  const ruBy = t.ruByPill[row.ruBy.status];
  if (ruBy) {
    const tone = row.ruBy.status === "restricted" ? "pill-closed" : row.ruBy.status === "verify" ? "pill-verify" : "pill-open";
    pills.push(`<span class="pill ${tone}">${ruBy}</span>`);
  }
  return pills.join("");
}

function ruByClass(row: GoldenVisaRow): string {
  return row.ruBy.status === "restricted" ? "neg" : row.ruBy.status === "open" ? "pos" : "";
}

function logo(size: string): string {
  return `<span class="logo" style="width:${size};height:${size}">${LOGO_SVG}</span>`;
}

function pageFooter(locale: InvestLocale, page: number, total: number): string {
  const date = displayDate(GOLDEN_VISA_LAST_CHECKED, locale);
  return `<div class="pfoot"><span>${esc(COPY[locale].footer(date))}</span><span>www.emigro.online · ${page} / ${total}</span></div>`;
}

function topBar(locale: InvestLocale, section: string): string {
  return `<div class="topbar">${logo("7mm")}<strong>Emigro</strong><span class="topbar-sep">·</span><span>Golden Visa 2026</span><span class="topbar-section">${esc(section)}</span></div>`;
}

function coverPage(locale: InvestLocale, total: number): string {
  const t = COPY[locale];
  const date = displayDate(GOLDEN_VISA_LAST_CHECKED, locale);
  const openCount = GOLDEN_VISA_ROWS.filter((row) => row.status === "open").length;
  const ruByClosed = GOLDEN_VISA_ROWS.filter((row) => row.ruBy.status === "restricted").length;
  const stats = [
    [String(GOLDEN_VISA_ROWS.length), t.stats.total],
    [String(openCount), t.stats.open],
    [String(ruByClosed), t.stats.ruBy],
    [locale === "ru" ? "€250 000" : "€250,000", t.stats.floor],
  ];
  return `<section class="page cover">
  <div class="hero">
    <div class="hero-glow"></div>
    <div class="brand">${logo("12mm")}<div><div class="brand-name">Emigro</div><div class="brand-tag">${esc(t.brandTag)}</div></div></div>
    <div class="eyebrow">${esc(t.eyebrow(date))}</div>
    <h1>${esc(t.title)}</h1>
    <p class="subtitle">${esc(t.subtitle)}</p>
    <div class="flags">${GOLDEN_VISA_ROWS.map((row) => `<span>${row.flag}</span>`).join("")}</div>
  </div>
  <div class="stats">${stats
    .map(([value, label]) => `<div class="stat"><div class="stat-value">${esc(value)}</div><div class="stat-label">${esc(label)}</div></div>`)
    .join("")}</div>
  <div class="takeaways">
    <h2>${esc(t.takeawaysTitle)}</h2>
    <ol>${t.takeaways.map((item, index) => `<li><span class="num">${index + 1}</span><p>${esc(item)}</p></li>`).join("")}</ol>
    <h2 class="inside-title">${esc(t.insideTitle)}</h2>
    <div class="toc">${t.inside
      .map(([pages, title, sub]) => `<div class="toc-item"><span class="toc-page">${esc(pages)}</span><div><div class="toc-title">${esc(title)}</div><div class="toc-sub">${esc(sub)}</div></div></div>`)
      .join("")}</div>
  </div>
  ${pageFooter(locale, 1, total)}
</section>`;
}

function overviewPage(locale: InvestLocale, total: number): string {
  const t = COPY[locale];
  const rows = GOLDEN_VISA_ROWS.map(
    (row) => `<tr class="${row.status === "closed" ? "row-closed" : ""}">
  <th><span class="ov-flag">${row.flag}</span><span class="ov-name">${esc(row.country[locale])}<small>${esc(row.programme[locale])}</small></span></th>
  <td class="strong">${cell(row.minInvestment, locale)}</td>
  <td>${cell(row.citizenship, locale)}</td>
  <td class="${ruByClass(row)}">${cell(row.ruBy, locale)}</td>
</tr>`
  ).join("\n");
  return `<section class="page">
  ${topBar(locale, t.overviewTitle)}
  <h2 class="ptitle">${esc(t.overviewTitle)}</h2>
  <p class="plead">${esc(t.overviewLead)}</p>
  <table class="overview">
    <colgroup><col style="width:24%"><col style="width:22%"><col style="width:27%"><col style="width:27%"></colgroup>
    <thead><tr>${t.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="callout"><strong>${esc(t.calloutTitle)}.</strong> ${esc(PORTUGAL_2026_CALLOUT[locale].replace(/^(Важно|Important) \(2026\):\s*/, ""))}</div>
  <p class="legend">${badge(locale)} — ${esc(t.legendBadge)}</p>
  ${pageFooter(locale, 2, total)}
</section>`;
}

function countryCard(row: GoldenVisaRow, locale: InvestLocale): string {
  const t = COPY[locale];
  const tone = row.status === "closed" ? "head-closed" : row.ruBy.status === "restricted" ? "head-restricted" : "head-open";
  const pageLink = tracked(investPagePath(locale, row.slug), locale, row.slug);
  const checked = row.lastChecked ? displayDate(row.lastChecked, locale) : `<span class="badge">${t.notChecked}</span>`;
  return `<article class="card">
  <header class="card-head ${tone}">
    <span class="card-flag">${row.flag}</span>
    <div class="card-title"><h3>${esc(row.country[locale])}</h3><div class="card-prog">${esc(row.programme[locale])}</div></div>
    <div class="card-pills">${statusPills(row, locale)}</div>
  </header>
  <div class="facts">
    <div class="fact"><div class="fact-label">${esc(t.facts.min)}</div><div class="fact-value big">${cell(row.minInvestment, locale)}</div></div>
    <div class="fact"><div class="fact-label">${esc(t.facts.citizenship)}</div><div class="fact-value">${cell(row.citizenship, locale)}</div></div>
    <div class="fact"><div class="fact-label">${esc(t.facts.ruBy)}</div><div class="fact-value ${ruByClass(row)}">${cell(row.ruBy, locale)}</div></div>
  </div>
  <div class="card-body">
    <div class="sect-label">${esc(t.routes)}</div>
    ${routeItems(row.routes, locale)}
    <div class="card-foot">
      <div class="srcs"><div class="sect-label">${esc(t.sources)}</div>${row.sources
        .map((source) => `<a href="${esc(source.url)}">${esc(source.label)}</a>`)
        .join("")}</div>
      <div class="meta-col">
        <div><span class="sect-label inline">${esc(t.checked)}</span> ${checked}</div>
        <a class="more" href="${esc(pageLink)}">${esc(t.more)} →</a>
      </div>
    </div>
  </div>
</article>`;
}

function countryPages(locale: InvestLocale, total: number, firstPage: number): string[] {
  const t = COPY[locale];
  const pages: string[] = [];
  for (let i = 0; i < GOLDEN_VISA_ROWS.length; i += 2) {
    const pair = GOLDEN_VISA_ROWS.slice(i, i + 2);
    const pageNo = firstPage + pages.length;
    pages.push(`<section class="page">
  ${topBar(locale, t.countriesTitle)}
  ${pair.map((row) => countryCard(row, locale)).join("\n")}
  ${pageFooter(locale, pageNo, total)}
</section>`);
  }
  return pages;
}

function ctaPage(locale: InvestLocale, total: number): string {
  const t = COPY[locale];
  const offers = t.offers
    .map((offer, index) => {
      const href = tracked(offer.path === "compare" ? investPagePath(locale, "compare") + "#invest-quick" : offer.path, locale, offer.slot);
      return `<a class="offer ${index === 0 ? "offer-main" : ""}" href="${esc(href)}">
  <div class="offer-step">${index + 1}</div>
  <div class="offer-body"><div class="offer-name">${esc(offer.name)}</div><div class="offer-text">${esc(offer.text)}</div></div>
  <div class="offer-side"><div class="offer-price">${esc(offer.price)}</div><div class="offer-open">${esc(t.open)} →</div></div>
</a>`;
    })
    .join("\n");
  const tg = investBotDeepLink("compare", locale);
  return `<section class="page cta-page">
  ${topBar(locale, t.ctaTitle)}
  <div class="cta-hero">
    <h2>${esc(t.ctaTitle)}</h2>
    <p>${esc(t.ctaLead)}</p>
  </div>
  <div class="offers">${offers}</div>
  <a class="tg" href="${esc(tg)}"><span class="tg-icon">✈</span><span>${esc(t.telegram)}</span><span class="tg-handle">@emigro_chat_bot</span></a>
  <div class="disclaimer">${esc(t.disclaimer)}</div>
  ${pageFooter(locale, total, total)}
</section>`;
}

const CSS = `
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body { font-family: -apple-system, "SF Pro Text", "Helvetica Neue", Arial, sans-serif; color: #0f172a; font-size: 9pt; line-height: 1.45; }
  a { color: inherit; text-decoration: none; }
  .page { width: 210mm; height: 297mm; position: relative; overflow: hidden; padding: 14mm 15mm 20mm; page-break-after: always; break-after: page; }
  .page:last-child { page-break-after: auto; break-after: auto; }
  .logo { display: inline-block; flex: none; }
  .logo svg { width: 100%; height: 100%; display: block; }
  .pfoot { position: absolute; left: 15mm; right: 15mm; bottom: 9mm; display: flex; justify-content: space-between; font-size: 7.4pt; color: #94a3b8; border-top: 0.6pt solid #e2e8f0; padding-top: 2.6mm; }
  .badge { display: inline-block; background: #fef3c7; color: #92400e; border: 0.6pt solid #fcd34d; border-radius: 99px; padding: 0.2mm 2mm; font-size: 6.6pt; font-weight: 700; letter-spacing: .02em; text-transform: uppercase; vertical-align: 1px; white-space: nowrap; }
  .neg { color: #be123c; font-weight: 600; }
  .pos { color: #047857; font-weight: 600; }

  /* cover */
  .cover { padding: 0; }
  .hero { position: relative; overflow: hidden; height: 158mm; padding: 16mm 16mm 0; color: #fff; background: linear-gradient(140deg, #0b1533 0%, #13265e 48%, #1d4ed8 100%); }
  .hero-glow { position: absolute; right: -40mm; top: -40mm; width: 130mm; height: 130mm; border-radius: 50%; background: radial-gradient(circle, rgba(251,191,36,.35), rgba(251,191,36,0) 65%); }
  .brand { position: relative; display: flex; align-items: center; gap: 3.5mm; }
  .brand .logo svg rect { fill: rgba(255,255,255,.14); }
  .brand-name { font-size: 15pt; font-weight: 700; letter-spacing: -.01em; }
  .brand-tag { font-size: 7.6pt; color: #bfdbfe; letter-spacing: .08em; text-transform: uppercase; }
  .eyebrow { position: relative; display: inline-block; margin-top: 22mm; padding: 1.4mm 3.5mm; border-radius: 99px; background: rgba(251,191,36,.16); border: 0.6pt solid rgba(251,191,36,.5); color: #fde68a; font-size: 8pt; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
  .hero h1 { position: relative; margin: 6mm 0 0; font-size: 46pt; line-height: 1; font-weight: 800; letter-spacing: -.03em; }
  .subtitle { position: relative; max-width: 150mm; margin: 6mm 0 0; font-size: 13pt; line-height: 1.4; color: #dbeafe; }
  .flags { position: relative; margin-top: 9mm; display: flex; gap: 3mm; font-size: 20pt; }
  .stats { position: relative; margin: -16mm 15mm 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 3.5mm; }
  .stat { background: #fff; border-radius: 4mm; padding: 5mm 4.5mm; box-shadow: 0 3mm 8mm rgba(15,23,42,.14); border: 0.6pt solid #e2e8f0; }
  .stat-value { font-size: 22pt; font-weight: 800; color: #1d4ed8; letter-spacing: -.02em; line-height: 1.1; }
  .stat-label { margin-top: 1.5mm; font-size: 8pt; color: #475569; line-height: 1.3; }
  .takeaways { padding: 7mm 15mm 0; }
  .takeaways h2 { margin: 0 0 4mm; font-size: 14pt; letter-spacing: -.01em; }
  .takeaways ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 3.5mm; }
  .takeaways li { display: flex; gap: 3mm; background: #f8fafc; border: 0.6pt solid #e2e8f0; border-radius: 3.5mm; padding: 3.8mm; }
  .takeaways .num { flex: none; width: 6.5mm; height: 6.5mm; border-radius: 50%; background: #1d4ed8; color: #fff; font-weight: 700; font-size: 8.5pt; display: flex; align-items: center; justify-content: center; }
  .takeaways p { margin: 0; font-size: 8.8pt; line-height: 1.45; color: #1e293b; }
  .inside-title { margin-top: 6mm !important; }
  .toc { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3.5mm; }
  .toc-item { display: flex; align-items: center; gap: 3mm; border-top: 0.9mm solid #1d4ed8; padding-top: 3mm; }
  .toc-page { font-size: 15pt; font-weight: 800; color: #1d4ed8; letter-spacing: -.02em; min-width: 9mm; }
  .toc-title { font-size: 9.5pt; font-weight: 700; color: #0f172a; }
  .toc-sub { font-size: 8pt; color: #64748b; margin-top: .6mm; }

  /* inner pages */
  .topbar { display: flex; align-items: center; gap: 2mm; font-size: 8pt; color: #475569; padding-bottom: 3mm; border-bottom: 0.6pt solid #e2e8f0; margin-bottom: 6mm; }
  .topbar strong { color: #0f172a; }
  .topbar-sep { color: #cbd5e1; }
  .topbar-section { margin-left: auto; color: #1d4ed8; font-weight: 600; }
  .ptitle { margin: 0; font-size: 18pt; letter-spacing: -.02em; }
  .plead { margin: 2mm 0 5mm; color: #64748b; }

  table.overview { width: 100%; border-collapse: separate; border-spacing: 0; table-layout: fixed; border: 0.6pt solid #e2e8f0; border-radius: 3.5mm; overflow: hidden; }
  .overview thead th { background: #0f1f4d; color: #e0e7ff; text-align: left; font-size: 7.2pt; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; padding: 3mm 3mm; }
  .overview td, .overview tbody th { padding: 3.2mm 3mm; vertical-align: top; text-align: left; border-top: 0.6pt solid #e2e8f0; font-size: 8.4pt; line-height: 1.4; }
  .overview tbody tr:nth-child(even) { background: #f8fafc; }
  .overview tbody th { display: flex; gap: 2.4mm; font-weight: 700; }
  .ov-flag { font-size: 13pt; line-height: 1; }
  .ov-name small { display: block; font-weight: 400; color: #64748b; font-size: 7.4pt; margin-top: .5mm; }
  .overview td.strong { font-weight: 700; color: #1e3a8a; }
  .row-closed td, .row-closed th { color: #64748b; }
  .callout { margin-top: 6mm; border-left: 1.2mm solid #f59e0b; background: #fffbeb; border-radius: 0 3mm 3mm 0; padding: 4mm 5mm; color: #78350f; font-size: 8.6pt; line-height: 1.5; }
  .legend { margin-top: 4mm; font-size: 8pt; color: #64748b; }

  .card { border: 0.6pt solid #dbe3ee; border-radius: 4mm; overflow: hidden; margin-bottom: 6mm; break-inside: avoid; background: #fff; }
  .card-head { display: flex; align-items: center; gap: 4mm; padding: 4.5mm 5.5mm; }
  .head-open { background: linear-gradient(120deg, #eef4ff, #f8fbff); }
  .head-restricted { background: linear-gradient(120deg, #fff1f2, #fffafa); }
  .head-closed { background: linear-gradient(120deg, #f1f5f9, #f8fafc); }
  .card-flag { font-size: 24pt; line-height: 1; }
  .card-title h3 { margin: 0; font-size: 15pt; letter-spacing: -.01em; }
  .card-prog { font-size: 8.4pt; color: #475569; margin-top: .5mm; }
  .card-pills { margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 1.5mm; }
  .pill { display: inline-block; border-radius: 99px; padding: .8mm 3mm; font-size: 7.4pt; font-weight: 700; white-space: nowrap; }
  .pill-open { background: #d1fae5; color: #065f46; }
  .pill-closed { background: #ffe4e6; color: #9f1239; }
  .pill-verify { background: #fef3c7; color: #92400e; }
  .facts { display: grid; grid-template-columns: 1fr 1.2fr 1.2fr; border-top: 0.6pt solid #e2e8f0; border-bottom: 0.6pt solid #e2e8f0; }
  .fact { padding: 3.5mm 5mm; }
  .fact + .fact { border-left: 0.6pt solid #e2e8f0; }
  .fact-label, .sect-label { font-size: 6.8pt; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: #64748b; margin-bottom: 1.2mm; }
  .sect-label.inline { display: inline; margin: 0 1mm 0 0; }
  .fact-value { font-size: 8.8pt; line-height: 1.4; }
  .fact-value.big { font-size: 12pt; font-weight: 800; color: #1e3a8a; line-height: 1.25; }
  .card-body { padding: 4mm 5.5mm 4.5mm; }
  ul.routes { margin: 0; padding: 0; list-style: none; }
  ul.routes li { position: relative; padding-left: 4mm; margin-bottom: 1.2mm; font-size: 8.7pt; line-height: 1.45; }
  ul.routes li::before { content: ""; position: absolute; left: .6mm; top: 1.9mm; width: 1.5mm; height: 1.5mm; border-radius: 50%; background: #1d4ed8; }
  .card-foot { display: flex; gap: 6mm; margin-top: 3.5mm; padding-top: 3mm; border-top: 0.6pt dashed #e2e8f0; }
  .srcs { flex: 1; }
  .srcs a { display: block; color: #1d4ed8; font-size: 8pt; line-height: 1.5; text-decoration: underline; text-decoration-color: #bfdbfe; }
  .meta-col { flex: none; text-align: right; font-size: 8pt; color: #334155; display: flex; flex-direction: column; justify-content: space-between; gap: 2mm; }
  .more { color: #1d4ed8; font-weight: 700; }

  .cta-hero { margin-top: 4mm; border-radius: 5mm; padding: 10mm 9mm; color: #fff; background: linear-gradient(140deg, #0b1533 0%, #13265e 55%, #1d4ed8 100%); }
  .cta-hero h2 { margin: 0; font-size: 26pt; letter-spacing: -.02em; }
  .cta-hero p { margin: 4mm 0 0; max-width: 150mm; font-size: 11pt; line-height: 1.5; color: #dbeafe; }
  .offers { margin-top: 7mm; display: flex; flex-direction: column; gap: 4mm; }
  .offer { display: flex; align-items: center; gap: 5mm; border: 0.6pt solid #dbe3ee; border-radius: 4mm; padding: 5.5mm 6mm; background: #fff; }
  .offer-main { border: 1.2pt solid #1d4ed8; background: #f5f8ff; }
  .offer-step { flex: none; width: 10mm; height: 10mm; border-radius: 50%; background: #e0e7ff; color: #1d4ed8; font-weight: 800; font-size: 12pt; display: flex; align-items: center; justify-content: center; }
  .offer-main .offer-step { background: #1d4ed8; color: #fff; }
  .offer-body { flex: 1; }
  .offer-name { font-size: 12.5pt; font-weight: 700; }
  .offer-text { margin-top: 1mm; color: #475569; font-size: 9pt; }
  .offer-side { text-align: right; flex: none; }
  .offer-price { font-size: 16pt; font-weight: 800; color: #1e3a8a; }
  .offer-open { font-size: 8.4pt; font-weight: 700; color: #1d4ed8; margin-top: .8mm; }
  .tg { margin-top: 7mm; display: flex; align-items: center; gap: 3mm; padding: 5mm 6mm; border-radius: 4mm; background: #e8f4fd; color: #075985; font-weight: 600; font-size: 10pt; }
  .tg-icon { width: 8mm; height: 8mm; border-radius: 50%; background: #229ed9; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10pt; }
  .tg-handle { margin-left: auto; font-weight: 700; color: #0369a1; }
  .disclaimer { margin-top: 9mm; font-size: 8pt; line-height: 1.55; color: #64748b; border-top: 0.6pt solid #e2e8f0; padding-top: 4mm; }
`;

function html(locale: InvestLocale): string {
  const countryPageCount = Math.ceil(GOLDEN_VISA_ROWS.length / 2);
  const total = 2 + countryPageCount + 1;
  const pages = [coverPage(locale, total), overviewPage(locale, total), ...countryPages(locale, total, 3), ctaPage(locale, total)];
  return `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>${esc(COPY[locale].docTitle)} — Emigro</title>
<style>${CSS}</style>
</head>
<body>
${pages.join("\n")}
</body>
</html>`;
}

function main() {
  if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME}; set CHROME_BIN`);
  const dir = mkdtempSync(join(tmpdir(), "gv-pdf-"));
  for (const locale of ["ru", "en"] as const) {
    const htmlPath = join(dir, `golden-visa-${locale}.html`);
    writeFileSync(htmlPath, html(locale), "utf8");
    const out = resolve("public", INVEST_COMPARE_PDF_PATH[locale].replace(/^\//, ""));
    mkdirSync(resolve(out, ".."), { recursive: true });
    execFileSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        "--virtual-time-budget=3000",
        `--print-to-pdf=${out}`,
        `file://${htmlPath}`,
      ],
      { stdio: "pipe" }
    );
    console.log(`wrote ${out} (${html(locale).length} chars html)`);
  }
}

main();
