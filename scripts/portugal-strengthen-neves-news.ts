/**
 * Strengthened news note: Luís Neves / MAI scandal — relocant angle (AIMA).
 *   npx tsx scripts/portugal-strengthen-neves-news.ts
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { flattenBodySections, validateNoteDraft } from "@/lib/community-notes/editorial-quality";
import { buildNoteHashtags } from "@/lib/community-notes/hashtags";
import { refreshDailySpotlight } from "@/lib/community-notes/daily-spotlight";
import { communityNotePublicUrl } from "@/lib/community-notes/note-url";
import type { CommunityNoteFaq, ContentKind, NoteBodySection } from "@/lib/community-notes/types";
import { createServerClient } from "@/lib/supabase/server";

const SLUG = "politicheskiy-krizis-ministr-neves-portugalia";

const bodySections: NoteBodySection[] = [
  {
    heading: "Что произошло",
    section_kind: "official",
    paragraphs: [
      "В июле 2026 португальские СМИ (Observador, Público, Expresso, Nascer do Sol) развернули историю вокруг Луиша Невеша (Luís Neves) — министра внутренних дел (Ministro da Administração Interna, MAI) с февраля 2026.",
      "До правительства он почти восемь лет был директором национальной Polícia Judiciária (PJ). Скандал не про «новый иммиграционный закон», а про контракты PJ и связи с подрядчиком — но MAI курирует силовые структуры и политический надзор за миграционной повесткой, поэтому релоканты в чатах сразу спрашивают про AIMA.",
    ],
    bullets: [
      "Ядро истории: компания Construbarcelos предпринимателя João Carvalho получила от PJ 17 контрактов на сумму около 2,23 млн € (2019–2025), пока Невеш возглавлял полицию.",
      "Параллельно та же компания делала частные работы на семейном объекте Невеша в Odemira (Alentejo) — об этом первым написал Nascer do Sol.",
      "Отдельная линия июля 2026: прицеп (atrelado) с материалами из операции по наркотикам оказался на площадке Construbarcelos; PJ сообщила о признаках возможных descaminho / abuso de poder и передала материалы Ministério Público.",
      "Невеш публично обещал «разбирать пункт за пунктом» и приветствовал открытие inquérito по линии atrelado.",
    ],
  },
  {
    heading: "Цифры и факты по контрактам",
    section_kind: "official",
    paragraphs: [
      "Observador опубликовал полный список 17 контрактов, который PJ передала редакции. Это уже не слухи из чата — сверяемые суммы и типы процедур.",
    ],
    bullets: [
      "Итого ~2,23 млн €: крупные работы в Guarda (~1,24 млн €), Évora (~0,89 млн €), один контракт в Porto (~98 тыс. €, Diretoria do Norte / IT-perícias).",
      "Только 3 из 17 контрактов шли через процедуры с конкуренцией; остальные — contratação excluída или ajuste direto.",
      "На трёх крупных empreitadas «работы сверх договора» добавили порядка +345 тыс. € (~28% к базе) — PJ объясняет это статьёй о trabalhos complementares.",
      "Невеш утверждает, что большая часть контрактов была до личного знакомства с предпринимателем; журналисты продолжают сверять хронологию.",
    ],
  },
  {
    heading: "Что это значит для релокантов и AIMA",
    section_kind: "practice",
    paragraphs: [
      "AIMA — автономное агентство. Смена или давление на министра внутренних дел само по себе не отменяет portal, законы о residência и ваши уже поданные pedidos.",
      "Политическая турбулентность вокруг MAI — это риск для новостного цикла и настроения в правительстве, а не кнопка «остановить ВНЖ в Porto». Путать скандал PJ с отменой правил AIMA — типичная ошибка Telegram.",
    ],
    bullets: [
      "Официально процедуры AIMA (заявки, renovação, morada) не меняются из‑за газетных заголовков — смотрите agora.imigrante / письма агентства, не треды про министра.",
      "На практике в периоды правительственного шума в чатах растёт тревога: «задержки будут». Исторически бюрократия и так медленная; закладывайте запас по срокам всегда, не только из‑за Невеша.",
      "Для Norte (Porto, Braga): отделения AIMA работают по общим инструкциям; локальные окна не «закрывают из‑за Lisboa politics» без отдельного объявления агентства.",
      "Если ждёте título / card — проверьте morada и статус на портале; это полезно независимо от скандала. См. [продление ВНЖ](/notes/prodlenie-vnzh-portugaliya-aima-2026) и [запись AIMA](/notes/aima-agora-zapis-2026).",
    ],
  },
  {
    heading: "Что сделать сейчас",
    section_kind: "practice",
    paragraphs: [
      "Короткий чеклист без паники: новость важна как контекст страны, не как повод бросать документы и бежать в Lisboa.",
    ],
    bullets: [
      "Не меняйте план подачи / продления только из‑за заголовков — действуйте по сроку вашего título.",
      "Сохраните 1–2 первоисточника (Observador / Público / gov.pt), а не пересказ из чата.",
      "Проверьте статус дела и адрес доставки карты на портале AIMA, если ждёте пластик.",
      "Игнорируйте «срочно оформляйте через посредника, пока не закрыли» — это классический upsell на страхе.",
      "Следите за официальными объявлениями AIMA и MAI; законы меняет Assembleia / Governo через нормативные акты, не через скандал в ленте.",
    ],
  },
];

const keyTakeaways = [
  "Официально: Luís Neves — MAI с февраля 2026; скандал июля 2026 — про контракты PJ с Construbarcelos (~2,23 млн €) и связанный inquérito, не про отмену правил AIMA.",
  "На практике: для релокантов в Porto/Braga это новостной фон — процедуры residência не «выключаются» заголовками; запас по срокам закладывайте всегда.",
  "Официально: AIMA работает по своим регламентам; изменения иммиграционных правил — через закон и объявления агентства, не через Telegram.",
  "Расхождение: чаты рисуют «кризис ВНЖ», СМИ разбирают контракты полиции — читайте цифры, не панику.",
];

const faq: CommunityNoteFaq[] = [
  {
    q: "Нужно ли срочно бежать в AIMA из‑за дела Невеша?",
    a: "Нет. Политический скандал вокруг MAI/PJ не меняет ваш личный срок título. Подайте или продлите по календарю документов, не по заголовкам.",
  },
  {
    q: "Могут ли из‑за этого сразу ужесточить иммиграционные законы?",
    a: "Не за один новостной цикл. По правилам изменение режима residência — парламентский/правительственный процесс. На практике курс может сдвинуться позже, но это не «кнопка отмены» текущих заявок.",
  },
  {
    q: "Затронет ли скандал отделения AIMA в Porto и Braga?",
    a: "Прямого объявления о закрытии окон из‑за дела Невеша нет. Косвенно шум в Lisboa влияет на новостной фон; локальные приёмы идут по инструкциям AIMA, пока агентство не сообщит иное.",
  },
  {
    q: "Почему Emigro пишет про министра, если это не гайд по ВНЖ?",
    a: "Потому что MAI в зоне внимания релокантов: люди связывают министра с миграцией. Задача новости — отделить факты скандала от паники про AIMA и дать чеклист без посредников.",
  },
];

async function main() {
  const seo_title = "Дело Невеша 2026: что значит для AIMA";
  const seo_description =
    "Скандал вокруг министра внутренних дел Luís Neves (июль 2026): контракты PJ, цифры Observador и что это реально значит для AIMA и релокантов в Porto и Norte.";

  const patch = {
    slug: SLUG,
    category: "AIMA и записи",
    content_kind: "news" as ContentKind,
    title: "Дело министра Невеша: факты скандала и что это значит для AIMA",
    excerpt:
      "Июль 2026: контракты PJ с Construbarcelos, inquérito и паника в чатах. Разбираем цифры и отделяем политику от процедур ВНЖ для релокантов в Norte.",
    seo_title,
    seo_description,
    quick_answer:
      "В ленте снова «кризис в Лиссабоне» — и в Porto сразу вопрос: а AIMA? Речь о Luís Neves, министре внутренних дел с февраля 2026, и скандале вокруг контрактов Polícia Judiciária на ~2,23 млн € с компанией друга. Для релокантов это новость про политику и полицию, не кнопка «отменить ВНЖ»: процедуры AIMA сами себя не выключают.",
    body_sections: bodySections,
    body_paragraphs: flattenBodySections(bodySections),
    key_takeaways: keyTakeaways,
    faq,
    official_links: [
      {
        title: "Observador — 17 контрактов PJ с Construbarcelos",
        url: "https://observador.pt/especiais/as-obras-os-valores-e-os-trabalhos-a-mais-todos-os-17-contratos-da-pj-com-a-empresa-do-amigo-de-luis-neves/",
      },
      { title: "gov.pt — Governo de Portugal", url: "https://www.gov.pt/" },
      { title: "AIMA — агентство миграции", url: "https://aima.gov.pt/" },
      {
        title: "Emigro — продление ВНЖ AIMA",
        url: "https://portugal.emigro.online/notes/prodlenie-vnzh-portugaliya-aima-2026",
      },
    ],
    topic_tags: ["aima", "portugal"],
    hashtags: buildNoteHashtags({
      topicTags: ["aima", "portugal"],
      contentKind: "news",
      extra: ["новости", "mai"],
    }),
    source_label: "editorial:observador+aima-angle+strengthen-pass",
    city: "porto",
    country_key: "portugal",
    status: "published" as const,
    updated_at: new Date().toISOString(),
  };

  const errors = validateNoteDraft({
    content_kind: patch.content_kind,
    slug: patch.slug,
    seo_title: patch.seo_title,
    seo_description: patch.seo_description,
    quick_answer: patch.quick_answer,
    body_sections: patch.body_sections,
    body_paragraphs: patch.body_paragraphs,
    faq: patch.faq,
    key_takeaways: patch.key_takeaways,
    official_links: patch.official_links,
  });
  if (errors.length) {
    throw new Error(`Quality gate: ${errors.join("; ")}`);
  }

  const supabase = createServerClient();
  const { data: existing, error: findErr } = await supabase
    .from("community_notes")
    .select("id, published_at")
    .eq("slug", SLUG)
    .maybeSingle();
  if (findErr) throw new Error(findErr.message);
  if (!existing) throw new Error(`Note not found: ${SLUG}`);

  const { error } = await supabase
    .from("community_notes")
    .update({ ...patch, published_at: existing.published_at })
    .eq("id", existing.id);
  if (error) throw new Error(error.message);

  console.log(`[update] strengthened news ${SLUG}`);
  try {
    const spotlight = await refreshDailySpotlight("portugal");
    console.log("[spotlight]", spotlight?.note_slug);
  } catch (e) {
    console.warn("[spotlight] skipped:", e instanceof Error ? e.message : e);
  }
  console.log(`\nURL: ${communityNotePublicUrl(SLUG)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
