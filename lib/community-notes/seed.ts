import type { CommunityNote } from "@/lib/community-notes/types";

/** Fallback when Supabase migration not applied yet (local / preview). */
export const PORTUGAL_NOTE_SEED: CommunityNote[] = [
  {
    id: "seed-nif",
    slug: "nif-lissabon-chto-puutayut",
    country_key: "portugal",
    city: "lisbon",
    category: "NIF и налоги",
    title: "NIF в Лиссабоне: что чаще всего путают в чате",
    excerpt:
      "Finanças, e-Fatura, представитель и сроки — типичные вопросы из @chatlisboa. Разбираем, где люди теряют неделю, и что проверить по официальным правилам.",
    seo_title: "NIF в Лиссабоне 2026 — типичные ошибки | Emigro PT",
    seo_description:
      "NIF в Португалии: Finanças, e-Fatura, представитель и сроки. Что чаще путают в чате релокантов и как проверить шаги до подачи на ВНЖ.",
    quick_answer:
      "NIF выдаёт Finanças; для нерезидента часто нужен представитель (representante fiscal). Без активного NIF и e-Fatura вы не закроете аренду, банк и многие шаги по ВНЖ.",
    body_paragraphs: [
      "В чате Лиссабона (@chatlisboa) каждую неделю повторяются три путаницы: «NIF = ВНЖ», «можно без представителя, если живу в Airbnb», «e-Fatura не нужна, пока не работаю».",
      "NIF — налоговый номер. Он не даёт права жить в Португалии. Для легализации нужен отдельный маршрут: виза → AIMA → карта резидента.",
    ],
    faq: [
      {
        q: "NIF даёт право жить в Португалии?",
        a: "Нет. NIF — налоговый идентификатор. Право пребывания оформляется через визу/AIMA отдельно.",
      },
    ],
    official_links: [
      { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
    ],
    source_channel: "chatlisboa",
    source_label: "Темы из обсуждений @chatlisboa (редакция Emigro)",
    topic_tags: ["nif", "financas"],
    status: "published",
    published_at: "2026-07-03T10:00:00.000Z",
    created_at: "2026-07-03T10:00:00.000Z",
    updated_at: "2026-07-03T10:00:00.000Z",
  },
  {
    id: "seed-aima",
    slug: "aima-agora-zapis-2026",
    country_key: "portugal",
    city: "lisbon",
    category: "AIMA и записи",
    title: "AIMA и Agora: как не потерять неделю на записи",
    excerpt:
      "Очереди, слоты и «пропала запись» — частый стресс в чате Лиссабона. Практический порядок действий без мифов про «секретные окна».",
    seo_title: "AIMA Agora запись 2026 — как не потерять слот | Emigro PT",
    seo_description:
      "Запись в AIMA через Agora: типичные ошибки, что делать если слот пропал, и как подготовить документы до записи.",
    quick_answer:
      "Запись через Agora — официальный канал AIMA. Слоты конкурентные; готовьте PDF заранее и не полагайтесь на «перенос без штрафа» из чужих историй.",
    body_paragraphs: [
      "В @chatlisboa регулярно всплывают три боли: «слот исчез через минуту», «портал не принимает PDF», «можно ли прийти без записи в Лиссабоне».",
      "Agora — единственный устойчивый путь для большинства процедур AIMA.",
    ],
    faq: [
      {
        q: "Можно ли попасть в AIMA без записи?",
        a: "В большинстве случаев нет — нужна запись через Agora.",
      },
    ],
    official_links: [
      { title: "AIMA", url: "https://aima.gov.pt/" },
      { title: "Agora", url: "https://agora.imigrante.pt/" },
    ],
    source_channel: "chatlisboa",
    source_label: "Темы из обсуждений @chatlisboa (редакция Emigro)",
    topic_tags: ["aima", "agora"],
    status: "published",
    published_at: "2026-07-03T10:00:00.000Z",
    created_at: "2026-07-03T10:00:00.000Z",
    updated_at: "2026-07-03T10:00:00.000Z",
  },
  {
    id: "seed-rent",
    slug: "arenda-lissabon-do-podpisi",
    country_key: "portugal",
    city: "lisbon",
    category: "Аренда",
    title: "Аренда в Лиссабоне: вопросы из чата, которые стоит решить до подписи",
    excerpt:
      "Caução, fiador, NIF в договоре и регистрация — что обсуждают в @chatlisboa до того, как появляются споры с арендодателем.",
    seo_title: "Аренда Лиссабон 2026 — до подписи договора | Emigro PT",
    seo_description:
      "Аренда в Лиссабоне: caução, fiador, NIF в договоре, регистрация arrendamento. Что проверить до подписи.",
    quick_answer:
      "До подписи проверьте: NIF обеих сторон, срок caução, опись имущества, регистрацию договора и канал связи с арендодателем.",
    body_paragraphs: [
      "Типичный сценарий в чате: человек подписал договор на английском, перевёл caução на личный счёт, а через месяц выясняется, что arrendamento не зарегистрирован.",
    ],
    faq: [
      {
        q: "Нужен ли NIF в договоре аренды?",
        a: "Да, для большинства административных шагов адрес подтверждается через зарегистрированный договор с NIF.",
      },
    ],
    official_links: [
      { title: "Portal das Finanças", url: "https://www.portaldasfinancas.gov.pt/" },
    ],
    source_channel: "chatlisboa",
    source_label: "Темы из обсуждений @chatlisboa (редакция Emigro)",
    topic_tags: ["arenda", "lisboa"],
    status: "published",
    published_at: "2026-07-03T10:00:00.000Z",
    created_at: "2026-07-03T10:00:00.000Z",
    updated_at: "2026-07-03T10:00:00.000Z",
  },
];
