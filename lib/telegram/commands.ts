const STATS_RE = /^\/(?:stats|status)(?:@\w+)?$/i;
const STATS_DEMO_RE = /^\/(?:stats|status)(?:@\w+)?\s+demo$/i;
const START_RE = /^\/start(?:@\w+)?(?:\s|$)/i;

export function isStatsCommand(text: string): boolean {
  return STATS_RE.test((text || "").trim());
}

export function isStatsDemoCommand(text: string): boolean {
  return STATS_DEMO_RE.test((text || "").trim());
}

export function isStartCommand(text: string): boolean {
  return START_RE.test((text || "").trim());
}

export function startWelcomeMessage(): string {
  return [
    "<b>Emigro bot</b>",
    "",
    "Доступные команды:",
    "• /start — это сообщение",
    "• /stats — статистика сайта (только для админа)",
    "• /status — то же, что /stats",
    "• кнопка из wizard — сохранить результат и продолжить разбор",
    "",
    "<i>Бот для внутренней аналитики emigro.online</i>",
  ].join("\n");
}

export function buildDemoStatsReport(): string {
  return [
    "<b>📊 Emigro — статистика</b>",
    "<i>⚠️ ДЕМО — пример отчёта, не реальные данные</i>",
    "Часовой пояс: <code>Europe/Lisbon</code> · сегодня 27.06",
    "",
    "<b>Нарастающий итог</b>",
    "Уникальные посетители: <b>128</b> <i>(browser-id, без ботов)</i>",
    "Просмотры страниц: <b>412</b>",
    "Лиды: <b>3</b>",
    "",
    "<b>Сегодня</b> <i>(+5 к вчера)</i>",
    "Посетители: <b>18</b>",
    "",
    "<i>Реальные данные: /stats · этот пример: /stats demo</i>",
  ].join("\n");
}
