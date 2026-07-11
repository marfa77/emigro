/**
 * Enrich internet provider guide with real community_signals practice (no full Gemini rewrite).
 *
 *   npx tsx scripts/portugal-enrich-internet-guide.ts
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { ensurePortugalCronEnv } from "@/lib/community-notes/cron-env";
import { ensureNoteOgImage } from "@/lib/community-notes/note-og-image";
import { communityNotePublicUrl } from "@/lib/community-notes/note-url";
import { createServerClient } from "@/lib/supabase/server";
import type { CommunityNoteFaq, NoteBodySection } from "@/lib/community-notes/types";

const SLUG = "vybor-internet-provaydera-portugaliya-2026";

/** 3 relevant signals from chatlisboa + por_tugal (2025–2026). */
export const SIGNAL_COUNT = 3;

const keyTakeaways = [
  "Официально: Для контракта на домашний интернет нужны NIF, удостоверение личности и подтверждение адреса; большинство провайдеров требуют португальский IBAN для Débito Direto.",
  "На практике: В чате chatlisboa (2026) пользователи WTF Fibra отмечали стабильную скорость без просадок за 3 месяца, но установка затянулась — пришлось несколько раз ездить между офисами/точками подключения.",
  "На практике: NOS в 2026 снова рекламирует тарифы до 10 Гбит/с — в чатах спрашивают, совпадает ли реальная скорость с обещанной; перед подписанием имеет смысл проверить отзывы по своему району в Norte.",
  "Расхождение: При смене тарифа внутри Vodafone (например, на бренд Amigo) оператор может выставить штраф за «досрочное расторжение» (~€117 в кейсе из por_tugal), хотя ANACOM считает это внутренней сменой, а не уходом к конкуренту.",
  "На практике: Жалоба в CIAB (Centro de Arbitragem de Conflitos de Consumo) по спорным штрафам за fidelização часто приводит к отмене счёта до арбитража — бесплатно, связь относится к «essenciais» услугам.",
  "Перед выбором в Порту, Браге или Матозиньюше проверяйте fibra по точному адресу на сайтах MEO, NOS и Vodafone — покрытие в Norte сильно зависит от здания и улицы.",
];

const bodySections: NoteBodySection[] = [
  {
    heading: "Что требуется для оформления контракта на интернет",
    section_kind: "official",
    paragraphs: [
      "Для подключения домашнего интернета в Португалии, включая Norte (Порту, Брага, Матозиньюш), необходимы стандартные документы. Без NIF и подтверждения адреса провайдер не оформит договор.",
    ],
    bullets: [
      "Número de Identificação Fiscal (NIF) — обязателен.",
      "Паспорт или Título de Residência.",
      "Подтверждение адреса: Contrato de Arrendamento или Atestado de Residência из Junta de Freguesia.",
      "Португальский банковский счёт для Débito Direto (иностранный IBAN принимают редко).",
      "Возраст заявителя — от 18 лет.",
    ],
  },
  {
    heading: "MEO, NOS, Vodafone и альтернативы в Norte",
    section_kind: "practice",
    paragraphs: [
      "Три крупнейших оператора — MEO, NOS и Vodafone — покрывают Порту и пригороды, но fibra доступна не на каждом адресе. В чатах релокантов также упоминают альтернативных провайдеров вроде WTF Fibra — их стоит сравнить, если «большая тройка» не даёт нужную скорость или цену.",
    ],
    bullets: [
      "MEO, NOS, Vodafone — основной выбор в Порту и Браге; обязательна проверка fibra по точному адресу, а не только по индексу.",
      "WTF Fibra — в chatlisboa (2026) отмечали стабильную скорость без просадок за 3 месяца; альтернатива, если крупные операторы не подходят.",
      "NOS в 2026 снова продвигает тарифы до 10 Гбит/с — в чатах задают вопрос, насколько реальная скорость близка к рекламной.",
      "В старых домах Norte (центр Порту, частные quintas) реальная скорость может быть ниже заявленной — это не только «лиссабонская» проблема.",
    ],
  },
  {
    heading: "Как выбрать тариф и проверить покрытие",
    section_kind: "practice",
    paragraphs: [
      "Проверка покрытия по адресу — главный шаг. В чатах советуют не подписывать контракт, пока на сайте провайдера не подтверждена fibra именно для вашей квартиры.",
    ],
    bullets: [
      "Введите точный адрес на meo.pt, nos.pt, vodafone.pt — убедитесь, что доступна fibra, а не только ADSL.",
      "Сравните pacotes: только интернет vs интернет + TV + мобильная связь.",
      "Проверьте período de fidelização (обычно 24 месяца) и штраф за досрочный выезд.",
      "Для удалённой работы смотрите upload, не только download.",
      "Уточните стоимость установки, активации и аренды роутера.",
      "Поищите отзывы по своему району (например, Cedofeita, Boavista, Matosinhos).",
    ],
  },
  {
    heading: "Установка и подключение — что бывает на практике",
    section_kind: "practice",
    paragraphs: [
      "После подписания контракта провайдер назначает визит техника. Срок — от нескольких дней до двух недель, в зависимости от загрузки и типа жилья.",
    ],
    bullets: [
      "Техник должен иметь доступ к месту установки ONT/роутера — будьте дома в назначенный слот.",
      "WTF Fibra (chatlisboa, 2026): после подключения связь работала стабильно, но сам процесс оформления затянулся — «гоняли» между разными точками/офисами.",
      "В новостройках Порту и Матозиньюша fibra часто уже проведена; в старых домах может потребоваться согласование с администратором здания.",
      "Если техник не приехал в окно — перенос через приложение или call-center; фиксируйте номер обращения.",
    ],
  },
  {
    heading: "Контракт, fidelização и споры с оператором",
    section_kind: "gap",
    paragraphs: [
      "Период верности (fidelização) — частый источник конфликтов. Официально штраф за досрочное расторжение законен, но на практике операторы иногда начисляют его ошибочно.",
    ],
    bullets: [
      "Сайт/договор: при досрочном расторжене до 24 месяцев — штраф по таблице в контракте.",
      "На деле (por_tugal, 2025): при смене тарифа Vodafone → Amigo (тот же оператор, тот же NIF) выставили ~€117 за «расторжение», хотя ANACOM трактует это как внутреннюю смену.",
      "Жалоба в CIAB — бесплатно; в описанном кейсе Vodafone отменил счёт до арбитража.",
      "Сохраняйте переписку, номера обращений и ссылайтесь на позицию ANACOM при внутренних сменах тарифа.",
      "Не соглашайтесь на первую отписку call-center — требуйте письменное обоснование штрафа.",
    ],
  },
  {
    heading: "Типичные ошибки при выборе интернета",
    section_kind: "gap",
    bullets: [
      "Не проверять fibra по адресу — риск ADSL вместо оптоволокна.",
      "Не читать условия fidelização — штраф при переезде из Порту в другой регион или страну.",
      "Соглашаться на первый тариф без сравнения MEO/NOS/Vodafone и альтернатив.",
      "Игнорировать отзывы о поддержке — при обрыве связи это критично.",
      "Не уточнять стоимость роутера и установки.",
      "Платить необоснованный штраф без жалобы в CIAB.",
    ],
  },
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Можно ли подключить интернет без NIF?",
    a: "По правилам NIF обязателен для контракта. На практике без NIF провайдеры не оформляют домашний интернет.",
  },
  {
    q: "Сколько времени занимает установка интернета?",
    a: "Официально — от нескольких дней. На практике в чатах встречается до 2 недель; у WTF Fibra (2026) сам процесс оформления затянулся из‑за бюрократии, хотя после подключения связь работала стабильно.",
  },
  {
    q: "Что такое «период верности» в контракте?",
    a: "Período de fidelização — обычно 24 месяца. По правилам досрочное расторжение влечёт штраф. На практике штраф иногда выставляют ошибочно даже при смене тарифа внутри одного оператора (кейс Vodafone → Amigo, ~€117; ANACOM считает это не сменой провайдера).",
  },
  {
    q: "Нужен ли португальский банковский счёт для оплаты?",
    a: "По правилам большинство провайдеров требуют IBAN PT для Débito Direto. На практике иностранный счёт принимают редко.",
  },
  {
    q: "Как проверить покрытие fibra по адресу в Порту?",
    a: "На meo.pt, nos.pt или vodafone.pt введите точный адрес (улица, номер, этаж). В Norte покрытие сильно зависит от здания — в центре Порту fibra есть не везде.",
  },
  {
    q: "Что делать, если выставили штраф за fidelização несправедливо?",
    a: "На практике: не платите сразу, соберите документы и подайте жалобу в CIAB (бесплатно). В кейсе por_tugal (2025) Vodafone отменил ~€117 после претензии; ссылайтесь на ANACOM при внутренней смене тарифа.",
  },
];

async function main() {
  ensurePortugalCronEnv();
  const supabase = createServerClient();

  const quickAnswer =
    "Для домашнего интернета в Norte (Порту, Брага) нужны NIF и подтверждение адреса. Основные провайдеры — MEO, NOS, Vodafone; альтернатива — WTF Fibra. На практике проверяйте fibra по точному адресу, читайте fidelização (24 мес.) и при спорных штрафах жалуйтесь в CIAB.";

  const draft = {
    content_kind: "guide" as const,
    seo_title: "Интернет в Португалии 2026: провайдеры и fibra",
    seo_description:
      "Как выбрать MEO, NOS, Vodafone или WTF Fibra в Порту и Norte: документы, fibra по адресу, fidelização, установка и споры с оператором — официально и на практике.",
    quick_answer: quickAnswer,
    body_sections: bodySections,
    body_paragraphs: [] as string[],
    faq,
    key_takeaways: keyTakeaways,
  };

  const errors = validateNoteDraft(draft);
  if (errors.length > 0) {
    throw new Error(`Quality gate: ${errors.join("; ")}`);
  }

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
      quick_answer: draft.quick_answer,
      key_takeaways: draft.key_takeaways,
      body_sections: draft.body_sections,
      faq: draft.faq,
      seo_description: draft.seo_description,
      updated_at: now,
    })
    .eq("id", existing.id);

  if (error) throw new Error(error.message);

  console.log(`[enrich] ✓ ${SLUG} — ${SIGNAL_COUNT} signals → practice sections updated`);

  const { path: ogPath } = await ensureNoteOgImage({ slug: SLUG, title: draft.seo_title });
  console.log(`[og-image] ${ogPath}`);
  console.log(`URL: ${communityNotePublicUrl(SLUG)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
