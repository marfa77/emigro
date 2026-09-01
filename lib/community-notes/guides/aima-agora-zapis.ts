/**
 * AIMA Agora slot-hunting guide — balcão/agendamento practice.
 * Renovação lifecycle (docs, taxas, portal-renovacoes) lives in prodlenie guide — bridge only.
 * User draft Sep 2026 kept full; law/portal claims soft-verified in Nota Emigro.
 */
import { flattenBodySections } from "@/lib/community-notes/editorial-quality";
import { glossaryForSlug } from "@/lib/community-notes/editorial-glossaries";
import { buildGlossarySection } from "@/lib/community-notes/glossary";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import {
  formatPracticeBullet,
  formatPracticeTakeaway,
} from "@/lib/community-notes/practice-format";
import { NIF_PORTO_GUIDE_SLUG } from "@/lib/community-notes/guides/nif-porto";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";

export const AIMA_AGORA_GUIDE_SLUG = "aima-agora-zapis-2026";
export const VNJ_RENEWAL_NOTE_SLUG = "prodlenie-vnzh-portugaliya-aima-2026";

const GLOSSARY_INTRO =
  "Слова из Agora, письма AIMA и balcão — чтобы не путать запись на приём с онлайн-продлением título.";

const bodySections: NoteBodySection[] = [
  {
    ...buildGlossarySection(glossaryForSlug(AIMA_AGORA_GUIDE_SLUG)!, GLOSSARY_INTRO),
  },
  {
    heading: "Nota Emigro (fact-check)",
    section_kind: "official",
    paragraphs: [
      "Короткий разбор спорных формулировок черновика. Soft = чаты/рынок; fixed = смягчено под актуальную рамку 2026. Не юридическая консультация — перед действием сверяйте [aima.gov.pt](https://aima.gov.pt/).",
    ],
    bullets: [
      "Fixed: «продление ВНЖ = только слот Agora» → в 2026 **типовая renovação** часто стартует на **portal-renovacoes.aima.gov.pt** (поэтапно по mês caducidade). Agora / balcão — когда нужен личный приём или биометрия по вызову. Полный lifecycle: [продление ВНЖ](/notes/" +
        VNJ_RENEWAL_NOTE_SLUG +
        ").",
      "Fixed: такса «€83 renovação» → с **01.03.2026** типовой пакет temporary renovação ориентир **€133 + €307,20 ≈ €440,20** ([Tabela AIMA](https://aima.gov.pt/pt/noticias/atualizacao-da-tabela-de-taxas)). Платите по **своему DUC**, не по цифре из чата.",
      "Soft: URL записи — в практике Emigro и старых материалах часто **agora.imigrante.pt**; зеркала/редиректы gov меняются. Открывайте ссылку с aima.gov.pt / актуального письма AIMA.",
      "Soft: «официальное расписание сброса слотов 08:00/18:00» и «боты забирают 70%» — **не официальная статистика**. Официального публичного таймтейбла релиза слотов обычно нет.",
      "Soft: сроки ожидания по регионам (8–14 мес. Lisboa и т.д.) — полевые ориентиры чатов, не SLA AIMA.",
      "Soft: «90 дней обрабатывают заявку» — часто отсчёт от **подачи/приёма документов**, не от даты бронирования слота; сверяйте ваш canal.",
      "Soft: Livro Amarelo, Tutela (суд), «успех 60–70%» — узкие/экстренные сценарии; проценты из чатов не доказаны. При просрочке карты — advogado + aima.gov.pt.",
      "Soft: справка о несудимости / апостиль «всегда на renovação» — зависит от типа pedido и инструкций вашего balcão/портала; не копируйте универсальный список.",
      "OK: CIPLE / nacionalidade по натурализации — не путать с AIMA Agora; гражданство — MJ / cidadaniaonline (сверяйте актуальный вход).",
      "OK / soft: Chave Móvel Digital через autenticacao.gov.pt ускоряет вход; SMS-only медленнее в пик.",
    ],
  },
  {
    heading: "Официально: какие двери AIMA не путать",
    section_kind: "official",
    paragraphs: [
      "AIMA — bottleneck релокации, но «одна кнопка Agora на всё» — миф. В 2026 разные процедуры ходят разными каналами. Сначала определите **дверь**, потом охоту за слотом.",
      "Этот гайд — про **agendamento / balcão** (когда Agora или иной канал записи реально нужен). Папка документов, taxas и portal-renovacoes — в [гайде по продлению ВНЖ](/notes/" +
        VNJ_RENEWAL_NOTE_SLUG +
        "), без дублирования тела.",
    ],
    bullets: [
      "**portal-renovacoes.aima.gov.pt** — типовой онлайн-старт renovação título (поэтапно по месяцу expiry). Следите за новостями AIMA, открыт ли ваш mês.",
      "**Agora** (часто agora.imigrante.pt) — запись на личный приём / часть процедур balcão, когда портал или письмо AIMA ведёт вас туда.",
      "**services.aima.gov.pt** — отдельные кейсы (в т.ч. caducados) часто **после e-mail AIMA** с инструкцией и оплатой; без письма форма может быть недоступна.",
      "**contactenos.aima.gov.pt** — онлайн-формы на отдельные типы agendamento (виза D → AR, prorrogação и др.) — сверяйте актуальные новости aima.gov.pt.",
      "Contact center AIMA (+351) 217 115 000 / geral@aima.gov.pt — иногда единственный путь к balcão по FAQ AIMA; каналы меняются.",
      "Livro Amarelo — узкий офлайн-контур жалобы/фиксации; не план A вместо правильного portal/Agora.",
    ],
  },
  {
    heading: "Зачем охота за слотом всё ещё нужна",
    section_kind: "practice",
    paragraphs: [
      "Когда ваша процедура требует presencial, слоты остаются конкурентными. В чатах 2025–2026 по Lisboa и Porto описывают исчезновение свободных дат за секунды–минуты после появления — это полевой опыт, не отчёт AIMA.",
      "Без активного agendamento (если он обязателен для вашего canal) вы не закроете биометрию / balcão. Но для многих renovação сначала нужен **portal**, а не F5 в Agora.",
    ],
    bullets: [
      "Аудитория: RU/BY/UA/KZ с D7/D8/D2/D3, reagrupamento или renovação — когда письмо/портал требует приём.",
      "Красная линия: не ждите последний месяц до expiry, если вам нужен presencial — начинайте мониторинг заранее (ориентир из чатов: месяцы, не дни).",
      "NIF и доступ к autenticacao.gov.pt / Chave Móvel — must have до охоты. NIF: [гайд Porto](/notes/" +
        NIF_PORTO_GUIDE_SLUG +
        ").",
    ],
  },
  {
    heading: "Чек-лист до охоты на слот",
    section_kind: "action_guide",
    paragraphs: [
      "Хаотичные заходы в портал выматывают и дают ложное ощущение контроля. Заведите простой лог: дата, процедура, регион, результат — и проверяйте системно в окна, которые вы сами заметили работающими.",
    ],
    bullets: [
      "NIF — для входа и данных профиля.",
      "Португальский номер (MEO/NOS/Vodafone prepaid ок) — SMS / Chave Móvel.",
      "Рабочий email — уведомления о слоте и отменах (проверяйте spam).",
      "Паспорт и номер título под рукой — автозаполнение при брони.",
      "Сканы по checklist **вашего** canal (portal vs balcão) — не универсальная таблица из чата.",
      "Адрес в профиле лучше сверить с Finanças заранее; рассинхрон иногда роняет бронь (полевая жалоба, soft).",
    ],
  },
  {
    heading: "Какие процедуры люди ищут в Agora (soft)",
    section_kind: "practice",
    paragraphs: [
      "Названия пунктов меню меняются. Ниже — типовые ярлыки из практики чатов, не полный каталог AIMA. Перед бронированием прочитайте, что реально открыто в вашем аккаунте и что требует portal-renovacoes.",
    ],
    bullets: [
      "Renovação / título — часто **сначала portal**; Agora — если нужен приём.",
      "Emissão / biometria / entrega de documentos — когда AIMA/IRN или визовый трек зовёт на balcão.",
      "Alteração de dados (morada, паспорт) — иногда отдельный agendamento; сверяйте FAQ AIMA / contact center.",
      "Смена основания (D7→D8 и т.п.) — часто **nova autorização**, не «кнопка cessão в Agora»; advogado.",
      "Nacionalidade / CIPLE — **не** Agora AIMA; MJ / cidadaniaonline (сверяйте актуальный портал).",
    ],
  },
  {
    heading: "Сроки: официально и на практике",
    section_kind: "gap",
    paragraphs: [
      "Официальные формулировки про сроки анализа и полевые «месяцы до слота» — разные вещи. Не складывайте их в одну цифру «AIMA обещала 90 дней от сегодня».",
    ],
    bullets: [
      "Официально / soft: заявления о renovação часто связывают с окном подачи до expiry и сроками анализа после приёма документов — сверяйте aima.gov.pt и ваш comprovativo.",
      "На практике (чаты, soft): от появления слота до даты приёма в Lisboa/Porto иногда месяцы; Braga/Coimbra/Algarve/Azores в разговорах называют менее загруженными — **не гарантия** и не повод нарушать правило адреса/конкордата.",
      "Запись в «чужой» posto — иногда проходит для renovação, иногда разворачивают; для первой emissão чаще жёстче привязка к morada. Soft.",
      formatPracticeBullet({
        channels: ["por_tugal", "chatlisboa"],
        period: "2025–2026",
        claim:
          "слоты в крупных городах ловят рано утром и вечером, официального расписания релиза нет",
        forReader: "ведите свой лог окон, не копируйте чужой «таймтейбл 08:00» как закон",
      }),
    ],
  },
  {
    heading: "Официально / на практике: переносы, просрочка, боты",
    section_kind: "gap",
    paragraphs: [
      "Правила переноса и последствия просроченной карты зависят от canal и статуса pedido. Ниже — осторожные ориентиры.",
    ],
    bullets: [
      "Перенос слота через портал — лимит раз встречается в практике; после исчерпания можно оказаться без даты. Не переносите «на всякий случай».",
      "Карта истекла, слота нет — сначала ваш canal (portal / e-mail AIMA / contact center), не слух про Livro Amarelo как замену renovação.",
      "Advogado / solicitador — не «магия слотов», а скорость, правильный canal и пакет; проверяйте OA. Ориентир гонорара за помощь с записью в чатах €100–500 — рынок, не прайс AIMA.",
      "Боты и скрипты — риск CAPTCHA, блокировки сессии и потери доступа. Emigro не рекомендует автоматизацию против ToS портала.",
    ],
  },
  {
    heading: "Пошагово: доступ, профиль, охота",
    section_kind: "action_guide",
    paragraphs: [
      "Сначала стабильный вход (Chave Móvel Digital / Autenticação Gov), потом заполненный профиль, потом короткие сессии охоты — не наоборот.",
    ],
    bullets: [
      "Откройте актуальный вход Agora / agendamento со страницы AIMA или из письма; не доверяйте случайным ссылкам из чатов.",
      "Настройте Chave Móvel на [autenticacao.gov.pt](https://www.autenticacao.gov.pt/) (NIF + телефон + email) — быстрее SMS в пик.",
      "В профиле: NIF, título, morada, контакты. После смены адреса в Finanças заложите дни на синхронизацию (полевая жалоба 7–14 дней — soft).",
      "Тактика охоты (practice): залогиньтесь заранее, держите страницу нужной процедуры, обновляйте в «ваши» окна, берите ближайшую доступную дату, подтверждайте быстро, сохраните PDF comprovativo.",
      "Два устройства (ПК + телефон) иногда помогают, когда веб падает под нагрузкой — soft из чатов.",
      "После брони: календарь (−7 / −1 день), папка документов по инструкции **вашего** pedido, ежедневный email.",
    ],
  },
  {
    heading: "Документы на приём: не универсальный чемодан",
    section_kind: "practice",
    paragraphs: [
      "Список на balcão зависит от типа autorização и того, что уже принято на portal. Ниже — что **часто** просят в чатах для renovação / primeira; сверяйте checklist AIMA и письмо с вызовом.",
    ],
    bullets: [
      "Паспорт (+ копии), título (даже caducado, если так указано), фото по шаблону.",
      "Comprovativo morada: contrato + recibos / atestado — см. также [аренду Porto/Braga](/notes/arenda-dolgosrok-porto-braga-2026).",
      "Rendimentos по типу D7/D8/work — выписки, IRS, contrato; не «12 месяцев всем».",
      "Seguro saúde — если требует ваш canal.",
      "Registo criminal — только если явно в checklist; апостиль/перевод — по стране выдачи; срок годности справки часто короткий (ориентир ~90 дней в чатах — soft).",
      "Taxas — по DUC / Tabela AIMA; не «€83 за всё».",
      formatPracticeBullet({
        channels: ["por_tugal", "chatlisboa"],
        period: "2025–2026",
        claim:
          "на balcão иногда разворачивают из‑за incomplete PDF или отсутствующих recibos de renda",
        forReader: "собирайте папку с первого месяца аренды и дублируйте сканы до визита",
      }),
    ],
  },
  {
    heading: "Если слот не ловится: альтернативы (soft)",
    section_kind: "practice",
    paragraphs: [
      "План B зависит от того, истекла ли карта и какой canal вам открыт. Не прыгайте сразу в суд.",
    ],
    bullets: [
      "Повторный мониторинг + правильный portal-месяц — чаще дешевле advogado.",
      "Contact center / formulário contactenos — когда AIMA так инструктирует для вашего типа pedido.",
      "Другой posto — риск отказа «не ваш район»; для renovação иногда пробуют, для первой emissão осторожнее.",
      "Livro Amarelo — фиксация/жалоба в узких случаях; не заменяет portal e DUC.",
      "Advogado — пакет + canal + при необходимости reclamação; проверяйте OA.",
      "Судебные меры (tutela etc.) — крайний случай с costs; успех «60–70% из чата» не цифра Emigro.",
    ],
  },
  {
    heading: "Типичные ошибки",
    section_kind: "practice",
    paragraphs: [
      "Большинство провалов — поздний старт, путаница дверей и неполный пакет на balcão.",
    ],
    bullets: [
      "Ждали последний месяц до expiry — слотов «на завтра» нет.",
      "F5 в Agora, пока не открыт ваш mês на portal-renovacoes.",
      "Адрес Agora ≠ Finanças — бронь падает.",
      "Бот / скрипт — бан сессии.",
      "Пришли без recibos / без DUC — отправляют собирать заново.",
      "Не читали email об отмене слота.",
      "«Advogado» без проверки в Ordem dos Advogados.",
    ],
  },
];

const keyTakeaways = [
  "Официально: renovação título в 2026 часто начинается на portal-renovacoes.aima.gov.pt; Agora — про balcão/agendamento, когда этот canal нужен. Сверяйте aima.gov.pt.",
  "Официально: taxas temporary renovação с 01.03.2026 ориентир €133 + €307,20 ≈ €440,20 — платите по DUC; не «€83 из чата».",
  formatPracticeTakeaway({
    channels: ["por_tugal", "chatlisboa"],
    period: "2025–2026",
    claim:
      "слоты на presencial в Lisboa/Porto ловят короткими сессиями; официального расписания релиза нет",
    forReader: "ведите лог окон и готовьте PDF заранее",
  }),
  "Расхождение: «90 дней AIMA» ≠ «90 дней от сегодняшнего F5». Отсчёт обычно от приёма/подачи по вашему canal, а не от мечты о слоте.",
  "Мост: папка, DUC и caducados — [продление ВНЖ](/notes/" + VNJ_RENEWAL_NOTE_SLUG + "); здесь только охота за приёмом.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужен ли слот Agora, чтобы продлить ВНЖ в 2026?",
    a: "Не всегда. Типовая renovação часто стартует на portal-renovacoes.aima.gov.pt. Agora нужен, если ваш canal требует личный приём/биометрию. Подробно: [продление ВНЖ](/notes/" +
      VNJ_RENEWAL_NOTE_SLUG +
      ").",
  },
  {
    q: "Сколько раз в день проверять Agora?",
    a: "Сколько угодно с паузами. Частые обновления иногда ловят CAPTCHA или режут сессию — делайте короткие заходы, не бесконечный F5.",
  },
  {
    q: "Можно ли две брони на один NIF?",
    a: "На практике обычно одна активная бронь на процедуру/NIF. Не рассчитывайте на параллельные «запасные» слоты без проверки правил портала.",
  },
  {
    q: "Что если приём отменили за день?",
    a: "Сохраните письмо. Иногда предлагают новую дату; иначе — снова мониторинг. Письмо об отмене — доказательство срыва по вине сервиса.",
  },
  {
    q: "Сколько платить за renovação?",
    a: "С 01.03.2026 типовой ориентир temporary renovação ≈ €440,20 (€133 + €307,20). Сверяйте Tabela AIMA и **свой DUC** — не устаревшее «€83/€99,80».",
  },
  {
    q: "Нужен ли переводчик на balcão?",
    a: "AIMA переводчиков обычно не предоставляет. Берите португалоязычного сопровождающего или advogado; телефонный перевод — риск недопонимания.",
  },
  {
    q: "Можно ли записаться в другой город?",
    a: "Иногда для renovação пробуют Braga/Coimbra, живя в Porto — полевой опыт. Могут принять или отправить «в свой» posto. Для первой emissão чаще смотрят morada. Soft.",
  },
];

export const AIMA_AGORA_GUIDE = {
  slug: AIMA_AGORA_GUIDE_SLUG,
  category: "AIMA / ВНЖ",
  content_kind: "guide" as ContentKind,
  title: "Запись в AIMA в 2026: как поймать слот через Agora — гайд для релоканта",
  excerpt:
    "Agora и balcão в 2026: какие двери не путать с portal-renovacoes, чек-лист до охоты, тактика слотов, документы на приём и план B — с Nota Emigro.",
  seo_title: "AIMA Agora 2026 — слот, portal и balcão",
  seo_description:
    "Запись AIMA в Португалии 2026: Agora vs portal-renovacoes, охота за слотом Porto/Lisboa, Chave Móvel, balcão, taxas ≈€440. Не юрконсультация.",
  quick_answer:
    "В Португалии в 2026 типовая renovação часто стартует на portal-renovacoes.aima.gov.pt; Agora — когда нужен личный приём (Porto/Lisboa слоты конкурентны). Для охоты подготовьте NIF, Chave Móvel, совпадающий адрес и PDF; ловите короткими сессиями без ботов. Taxas temporary renovação с 01.03.2026 ориентир ≈€440 — платите по DUC. Папка и caducados — в гайде по продлению ВНЖ.",
  body_sections: bodySections,
  body_paragraphs: flattenBodySections(bodySections),
  key_takeaways: keyTakeaways,
  faq,
  official_links: [
    { title: "AIMA", url: "https://aima.gov.pt/" },
    { title: "Portal das Renovações", url: "https://portal-renovacoes.aima.gov.pt/" },
    { title: "Agora (запись)", url: "https://agora.imigrante.pt/" },
    { title: "Autenticação Gov / Chave Móvel", url: "https://www.autenticacao.gov.pt/" },
    { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
    { title: "Ordem dos Advogados", url: "https://www.oa.pt/" },
  ],
  topic_tags: ["aima", "portugal"],
  hashtags: buildNoteHashtags({
    topicTags: ["aima", "portugal"],
    contentKind: "guide",
    extra: ["agora", "vnj", "renovacao", "balcao", "norte", "porto", "lisboa"],
  }),
  source_channel: "por_tugal+chatlisboa+lepta+official-editorial",
  source_label: "editorial:aima-agora-sep2026-factcheck",
};

export default AIMA_AGORA_GUIDE;
