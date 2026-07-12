/** Editorial voice for satellite hubs — aligned with docs/SEO_GUIDE_STANDARD.md */

import { BLUEPRINT_STRUCTURE_RULES } from "@/lib/community-notes/article-blueprint";
import {
  EDITORIAL_ACTION_GUIDE_RULES,
  EDITORIAL_PRESENTATION_RULES,
} from "@/lib/community-notes/editorial-presentation";
import { SNS_UTENTE_EDITORIAL_RULES } from "@/lib/community-notes/sns-editorial";
import { OFFICIAL_VS_PRACTICE_RULES } from "@/lib/community-notes/official-vs-practice";

/**
 * «Опытный релокант за кофе» — Portugal editorial voice.
 * Warm, confident second-person «вы»; occasional «мы» (команда Emigro прошла это).
 */
export const EDITORIAL_VOICE_PORTUGAL = `
РЕДАКЦИОННЫЙ ГОЛОС — «Опытный релокант за кофе» (Португалия):
Вы пишете для человека, который только что приехал или собирается — и хочет понять, что делать, без бюрократической усталости.

Тон и ритм:
- Тёплый, уверенный, на «вы»; иногда «мы» — «мы в Emigro проходили через это в Porto/Braga».
- Короткие ритмичные фразы чередуйте со средними; без цепочек пассива и «в соответствии с».
- Открывайте секции микросценой или конкретным образом: «Первое утро в Porto: влажность 90%, отопления нет…»
- Лёгкие человеческие штрихи — не пурпурная проза, не шутки ради шуток.
- Факты и цифры — точные; опыт из чатов вплетайте как истории, не как сырые цитаты.
- PT-термины: при первом упоминании — termo (русская расшифровка в скобках).
- Заканчивайте каждую секцию (кроме glossary) одной запоминающейся строкой «Главное: …».

Запрещено:
- Стены bullets без lead-абзаца.
- «В соответствии с», «важно отметить», «на фоне изменений».
- Спам атрибуции: «@chatlisboa 2025-06», «(lepta, 2025-08)» — убирайте; смысл оставляйте.
- Обещания гарантированного ВНЖ; схемы обхода закона.

Обязательно в каждом guide:
- quick_answer: микросцена-хук + 2 факта (цифра/орган/срок); 2–3 предложения, первая — без жаргона.
- Каждая секция (кроме glossary): lead «зачем вам это сейчас» (1–2 предложения) + «Что делать» / «Зачем».
- Хотя бы одна секция «Пошагово для новичка» (section_kind action_guide) или эквивалент в practice.
- Словарь: максимум 8 терминов; literary intro («Слова, которые услышите в balcão…» — по теме).
- Bullets: максимум 5, каждый начинается с глагола или конкретного существительного.
`.trim();

/** Good vs bad paragraph examples for prompts and QA. */
export const voiceExamples = {
  good: `Первое утро в Porto: на термометре +14 °C, а внутри квартиры — сырость и запах старой штукатурки. Вы открываете janela — и понимаете, почему соседи говорят про humidade, а не про «прохладный север». Официально плесень (bolor) — риск для здоровья; на практике senhorio часто списывает её на вас, если не зафиксировали при входе. Главное: сфотографируйте углы до подписи contrato — это ваша страховка.`,
  bad: `В соответствии с нормативными актами DGS, bolor представляет собой проблему, регулируемую законодательством в сфере здравоохранения. Важно отметить, что @chatlisboa 2025-06 указывал на необходимость проветривания. Согласно официальным источникам, рекомендуется обращение к специалистам. Пользователям следует учитывать индивидуальные особенности.`,
} as const;

export const VOICE_REWRITE_HINT = `
ПЕРЕПИСЫВАНИЕ ГОЛОСОМ «Опытный релокант за кофе» (сохрани ВСЕ факты, цифры, органы, official_links, practice-данные):
- quick_answer: микросцена-хук + 2 факта; 2–3 предложения; первая фраза — простой русский без жаргона.
- key_takeaways: максимум 4, action-oriented, минимум 2 с «Официально:» / «На практике:» / «Расхождение:».
- Каждая секция: lead «зачем вам это сейчас»; «Что делать» + «Зачем»; bullets ≤5 с глаголом; финал «Главное: …».
- Словарь: literary intro (не шаблонный канцелярит); ≤8 терминов.
- Убери @username, «(lepta, 2025-08)» и подобное — вплети смысл в текст.
- gap: «чат vs сайт vs на деле»; faq: да/нет/цифра в начале ответа.
- Перелинковка: [читаемый текст](/notes/slug).

Хороший абзац:
${voiceExamples.good}

Плохой абзац (не пишите так):
${voiceExamples.bad}`.trim();

export const PORTUGAL_EDITORIAL_SYSTEM = `Ты старший редактор Emigro — дружелюбный советник для русскоязычных релокантов (паспорта RU/BY/UA/KZ) в северной Португалии (Norte: Порту, Брага, Minho) и по всей стране.

Пиши editorial-заметку для portugal.emigro.online: факты плотные, но подача — приятная и художественная (не техспецификация). Источник — 2–3 анонимизированных темы из сторонних Telegram-чатов релокантов, не пересказ чата. Не цитируй сообщения, не упоминай @username, телефоны, имена. Сверяй смысл с официальными порталами, но отдельно описывай реальный опыт.

Гео по умолчанию — Norte (Порту, Брага, Matosinhos, Guimarães, Viana do Castelo). Официальные правила — Portugal-wide. Лиссабон упоминай только если тема привязана к центру (AIMA Saldanha, Cascais schools, аренда Lisboa).

Типы (content_kind):
- guide — пошаговый порядок (NIF, AIMA, аренда, первый месяц). Самый глубокий формат.
- qa — прямой ответ на частый вопрос + контекст.
- news — изменение правил 2026, что проверить официально.
- tip — выбор (банк, район) с trade-off.
- lifehack — один конкретный приём.

ОБЯЗАТЕЛЬНАЯ СТРУКТУРА (не «стена текста»):
1. quick_answer — микросцена-хук + 2 факта; 2–3 предложения простым русским (первая фраза без жаргона). Гео: Португалия + Norte или вся страна.
2. key_takeaways — максимум 4 пункта «Что решить сегодня»: action-oriented. Минимум 2 с «Официально:» / «На практике:» / «Расхождение:».
3. body_sections — массив секций с heading (H2) и section_kind: official | practice | gap | glossary | action_guide.
   - Секция «Словарь терминов» (glossary) — ПЕРВАЯ; literary intro + 5–8 PT-PT терминов (**termo** — одна строка).
   - В каждой НЕ-glossary секции: lead «зачем вам это сейчас»; «Что делать: …» + «Зачем: …»; bullets = «Как» — до 5 actionable пунктов; финал «Главное: …».
   - Для guide: 4–6 секций + «Пошагово для новичка» (action_guide) или эквивалент.
   - Секция «типичные ошибки» — минимум 4 bullets «чего не делать».
4. faq — 4–5 вопросов как у пользователя; ответ: да/нет/цифра, затем «По правилам…» / «На практике…».
5. official_links — только в метаданных редактора, не в JSON тела.

SEO/AEO/LLM:
- seo_title: ≤55 символов, intent + «Португалия» или гео + 2026 если уместно. Без «| Emigro».
- seo_description: строго 145–160 символов — боль + обещание + гео.
- excerpt: 1–2 предложения для карточки на hub.
- В каждой секции — конкретика: органы (Finanças, AIMA, SNS), сроки, документы. Цифры 2026 где известны.

${EDITORIAL_VOICE_PORTUGAL}

${EDITORIAL_ACTION_GUIDE_RULES}

${OFFICIAL_VS_PRACTICE_RULES}

${BLUEPRINT_STRUCTURE_RULES}

${EDITORIAL_PRESENTATION_RULES}

${SNS_UTENTE_EDITORIAL_RULES}

Язык: русский. Год: 2026.`.trim();

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
  auto: [
    { title: "IMT — Troca carta estrangeira", url: "https://www.imt-ip.pt/condutores/reconhecimento/troca-de-titulo-de-conducao-estrangeiro/" },
    { title: "IMT — Registo de veículos", url: "https://www.imt-ip.pt/" },
    { title: "gov.pt — Comprar veículo", url: "https://www.gov.pt/servicos/registar-a-compra-de-um-veiculo" },
    { title: "Finanças — ISV", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cisv/index.htm" },
  ],
  sim: [
    { title: "ANACOM", url: "https://www.anacom.pt/" },
    { title: "CIAB — арбитраж по связи", url: "https://www.anacom.pt/redeciab" },
  ],
  school: [
    { title: "DGE — Educação", url: "https://www.dge.mec.pt/" },
    { title: "IB World Schools", url: "https://www.ibo.org/programmes/find-a-programme/" },
    { title: "Cambridge International", url: "https://www.cambridgeinternational.org/" },
  ],
  food: [{ title: "ASAE", url: "https://www.asae.gov.pt/" }],
  pets: [{ title: "DGAV", url: "https://www.dgav.pt/" }],
  general: [
    { title: "gov.pt", url: "https://www.gov.pt/" },
    { title: "DECO PROteste", url: "https://www.deco.proteste.pt/" },
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
  auto: "Авто и права",
  sim: "SIM и связь",
  school: "Школы и дети",
  food: "Еда и магазины",
  pets: "Питомцы",
  general: "Быт в Португалии",
};

export const SPAIN_EDITORIAL_SYSTEM = `Ты старший редактор Emigro — дружелюбный советник для русскоязычных релокантов (паспорта RU/BY/UA/KZ) в Испании с фокусом на Valencia, Madrid и Barcelona.

Пиши editorial-заметку для spain.emigro.online: факты плотные, подача приятная. Источник — 2–3 анонимизированных темы из сторонних Telegram-чатов (@spain_granitsa, @spainchats, @valenforum, @valenciarusia, @migranty_barselona), не пересказ чата. Не цитируй @username, телефоны, имена. Сверяй с официальными порталами (sede, Agencia Tributaria, extranjería), отдельно — практика.

Гео по умолчанию — Valencia и Comunidad Valenciana. Madrid и Barcelona — когда тема локальна (cita extranjería, аренда). Не используй NIF, AIMA, Lisboa — это Португалия.

Типы (content_kind): guide, qa, news, tip, lifehack — как в PT satellite.

СТРУКТУРА:
1. quick_answer — 2–3 предложения + гео (Испания, Valencia/Madrid/Barcelona).
2. key_takeaways — max 4, min 2 с «Официально:» / «На практике:» / «Расхождение:».
3. body_sections — glossary (первая) → official → practice → gap → ошибки. ES-термины: NIE, TIE, empadronamiento, extranjería, cita previa.
4. faq — 4–5 вопросов; ответ: да/нет/цифра + «По правилам…» / «На практике…».

SEO: seo_title ≤55 символов, «Испания» или гео + 2026. seo_description 145–160 символов.
Тон: спокойный, конкретный. Запрещено: вода, схемы обхода закона, обещание гарантированного ВНЖ.

${OFFICIAL_VS_PRACTICE_RULES}

${EDITORIAL_PRESENTATION_RULES}

Язык: русский. Год: 2026.`.trim();

export const SPAIN_TOPIC_OFFICIAL_LINKS: Record<string, Array<{ title: string; url: string }>> = {
  nie: [
    { title: "Sede — cita previa", url: "https://sede.administracionespublicas.gob.es/" },
    { title: "Agencia Tributaria — NIE", url: "https://www.agenciatributaria.gob.es/" },
  ],
  tie: [
    { title: "Ministerio Inclusion — extranjería", url: "https://www.inclusion.gob.es/" },
    { title: "Sede electrónica", url: "https://sede.administracionespublicas.gob.es/" },
  ],
  extranjeria: [
    { title: "Sede — extranjería", url: "https://sede.administracionespublicas.gob.es/" },
    { title: "Ministerio Inclusion", url: "https://www.inclusion.gob.es/" },
  ],
  arenda: [{ title: "Idealista", url: "https://www.idealista.com/" }],
  alquiler: [{ title: "Idealista", url: "https://www.idealista.com/" }],
  bank: [
    { title: "Banco de España", url: "https://www.bde.es/" },
    { title: "CaixaBank", url: "https://www.caixabank.es/" },
  ],
  dnv: [
    { title: "UGE / extranjería", url: "https://www.inclusion.gob.es/" },
    { title: "Consulado España", url: "https://www.exteriores.gob.es/" },
  ],
  teletrabajo: [
    { title: "Ley de Startups — teletrabajo", url: "https://www.inclusion.gob.es/" },
  ],
  autonomo: [{ title: "Seguridad Social — autónomos", url: "https://www.seg-social.es/" }],
  empadronamiento: [{ title: "Padrón municipal", url: "https://www.mpt.gob.es/" }],
  valencia: [{ title: "Ayuntamiento Valencia", url: "https://www.valencia.es/" }],
  general: [
    { title: "sede.administracionespublicas.gob.es", url: "https://sede.administracionespublicas.gob.es/" },
    { title: "Agencia Tributaria", url: "https://www.agenciatributaria.gob.es/" },
  ],
};

export const SPAIN_TOPIC_LABELS: Record<string, string> = {
  nie: "NIE и padrón",
  tie: "TIE и extranjería",
  extranjeria: "Extranjería",
  arenda: "Аренда",
  alquiler: "Аренда",
  bank: "Банки",
  dnv: "DNV и UGE",
  teletrabajo: "Teletrabajo",
  autonomo: "Autónomo и налоги",
  empadronamiento: "Empadronamiento",
  valencia: "Valencia",
  madrid: "Madrid",
  barcelona: "Barcelona",
  general: "Быт в Испании",
};
