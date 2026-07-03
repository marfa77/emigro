/** Editorial voice for portugal.emigro.online — aligned with docs/SEO_GUIDE_STANDARD.md */

export const PORTUGAL_EDITORIAL_SYSTEM = `Ты редактор Emigro — спокойный навигатор для русскоязычных релокантов (паспорта RU/BY/UA/KZ) в Португалии.

Пиши заметку для portugal.emigro.online на основе АНОНИМИЗИРОВАННЫХ тем из Telegram-чатов. Не цитируй сообщения дословно, не упоминай имена, @username, телефоны.

Типы материалов (content_kind):
- news — изменение правил, сроки, официальные новости (со ссылкой на источник).
- lifehack — короткий практический приём «как сделать быстрее/дешевле».
- tip — совет по выбору (банк, район, сервис) без гарантий.
- guide — пошаговый порядок действий (NIF, AIMA, аренда).
- qa — ответ на частый вопрос из чата.

Структура текста:
1. quick_answer — 2–3 предложения, прямой ответ без воды.
2. body_paragraphs — 4–6 абзацев: типичная ситуация читателя → правило → что обычно ломается → безопасный порядок шагов.
3. faq — 2–3 вопроса в формулировках людей из чата.
4. official_links — 1–3 ссылки на AIMA, Portal das Finanças, gov.pt (только реальные URL).

Тон:
- Спокойный, конкретный, без паники и без «розовых пони».
- Короткие абзацы; можно одно короткое предложение после длинного.
- «В чате часто спрашивают…» — ок; «важно отметить», «на фоне изменений», «seamless» — нельзя.
- Не обещай гарантированный ВНЖ; не давай схем обхода закона.

Язык: русский. Год контекста: 2026.`.trim();

export const TOPIC_OFFICIAL_LINKS: Record<string, Array<{ title: string; url: string }>> = {
  nif: [
    { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "e-Fatura", url: "https://faturas.portaldasfinancas.gov.pt/" },
  ],
  aima: [
    { title: "AIMA", url: "https://aima.gov.pt/" },
    { title: "Agora", url: "https://agora.imigrante.pt/" },
  ],
  arenda: [{ title: "Portal das Finanças — arrendamento", url: "https://www.portaldasfinancas.gov.pt/" }],
  bank: [{ title: "Banco de Portugal", url: "https://www.bportugal.pt/" }],
  sns: [{ title: "SNS", url: "https://www.sns.gov.pt/" }],
  ciple: [{ title: "CAPLE / CIPLE", url: "https://caple.letras.ulisboa.pt/" }],
  transport: [{ title: "CP — Comboios de Portugal", url: "https://www.cp.pt/" }],
  sim: [{ title: "ANACOM", url: "https://www.anacom.pt/" }],
  school: [{ title: "DGE — Educação", url: "https://www.dge.mec.pt/" }],
  food: [{ title: "ASAE", url: "https://www.asae.gov.pt/" }],
  pets: [{ title: "DGAV", url: "https://www.dgav.pt/" }],
  general: [
    { title: "AIMA", url: "https://aima.gov.pt/" },
    { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
  ],
};

export const TOPIC_LABELS: Record<string, string> = {
  nif: "NIF и налоги",
  aima: "AIMA и записи",
  arenda: "Аренда",
  bank: "Банки",
  sns: "Здоровье и SNS",
  ciple: "Язык и CIPLE",
  transport: "Транспорт",
  sim: "SIM и связь",
  school: "Школы и дети",
  food: "Еда и магазины",
  pets: "Питомцы",
  general: "Быт в Португалии",
};
