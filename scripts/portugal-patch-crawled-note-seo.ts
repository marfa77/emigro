/**
 * Patch SEO fields for crawled-not-indexed Portugal notes that live in Supabase
 * (no full hand-guide republish).
 *
 *   npx tsx scripts/portugal-patch-crawled-note-seo.ts
 */
import dotenv from "dotenv";
import { resolve } from "node:path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

import { createServerClient } from "@/lib/supabase/server";

const PATCHES: Array<{
  slug: string;
  title: string;
  excerpt: string;
  seo_title: string;
  seo_description: string;
  quick_answer: string;
}> = [
  // —— previously patched (idempotent refresh) ——
  {
    slug: "aima-residence-card-sent-abroad-2026",
    title: "Карта ВНЖ AIMA уехала за границу: проверить и сменить адрес 2026",
    excerpt:
      "Título de residência иногда уезжает на старый адрес за границей. Как проверить morada в AIMA/портале, сменить адрес до отправки и что делать, если карта уже в пути.",
    seo_title: "Карта ВНЖ уехала за границу — адрес AIMA",
    seo_description:
      "Карта ВНЖ AIMA уехала на старый адрес за границей: как проверить morada, сменить адрес до отправки и не потерять título. Практика 2026.",
    quick_answer:
      "Если в профиле AIMA / portal остался старый адрес «на родине», título de residência могут отправить туда. До биометрии и отправки карты сверьте morada с NIF/Finanças и договором аренды; после отправки — трек и запрос через каналы AIMA. Это не замена renovação и не запись Agora: отдельный сбой доставки, не слота.",
  },
  {
    slug: "aima-agora-zapis-2026",
    title: "AIMA Португалия 2026: Agora vs portal — слот Porto/Lisboa",
    excerpt:
      "Agora ≠ portal-renovacoes: двери AIMA, лог мониторинга слотов Porto/Lisboa, чек-лист до охоты и день приёма, документы на balcão, план B — с Nota Emigro (fact-check).",
    seo_title: "AIMA 2026: Agora vs portal, слот Porto",
    seo_description:
      "AIMA Португалия 2026: Agora ≠ portal-renovacoes, слот Porto/Lisboa, Chave Móvel, balcão, taxas ≈€440 по DUC. Практика Emigro — не юрконсультация.",
    quick_answer:
      "В Португалии в 2026 типовая renovação часто стартует на portal-renovacoes.aima.gov.pt; Agora — когда нужен личный приём (слоты Porto/Lisboa конкурентны). Ведите лог окон, подготовьте NIF, Chave Móvel, совпадающий адрес и PDF; без ботов. Taxas temporary renovação с 01.03.2026 ориентир ≈€440 — платите по DUC. Карта «уехала за границу» — отдельный гайд про адрес доставки; CIPLE — не Agora.",
  },
  {
    slug: "arenda-kvartiry-lisbon-pervyi-mesyac-2026",
    title: "Аренда в Лиссабоне 2026: NIF, fiador, Idealista — первый месяц",
    excerpt:
      "NIF, fiador, Idealista, open house, caução и Modelo 2: первый месяц аренды в Лиссабоне для релокантов — закон Art. 1076 vs практика чатов 2026. Не путать с Porto/Braga.",
    seo_title: "Аренда Лиссабон 2026: NIF, fiador, Idealista",
    seo_description:
      "Аренда Лиссабон 2026: NIF → Idealista/open house → fiador/caução → Modelo 2. Art. 1076 vs предоплата 6–12 мес. Для Lisboa — не Porto/Braga гайд.",
    quick_answer:
      "Вы стоите в очереди open house в Arroios: 20 человек, агент смотрит на часы, а senhorio уже спрашивает «есть fiador?». В Лиссабоне 2026 без NIF и папки документов вы не кандидат; без fiador рынок часто требует предоплату далеко за лимит Art. 1076. Держите курс на registered contrato и Modelo 2 — иначе AIMA не увидит вашу morada. Для Norte см. гайд аренды Porto/Braga.",
  },
  // —— new GSC crawled batch 2026-09-12 ——
  {
    slug: "pervyj-mesyac-portugaliya-checklist",
    title: "Первый месяц в Португалии 2026: NIF, банк, AIMA — чеклист Porto/Braga",
    excerpt:
      "72 часа → неделя 4: NIF, SIM, банк, morada, канал AIMA. Для семьи в Norte (Porto/Braga) — не путать с Lisboa-only гайдами.",
    seo_title: "Первый месяц PT 2026 — NIF, банк, AIMA",
    seo_description:
      "Первый месяц в Португалии 2026: NIF → SIM → банк → morada → AIMA. Чеклист для Porto/Braga (Norte). Не юрконсультация — практика Emigro.",
    quick_answer:
      "Первые 30 дней в PT: (1) NIF, (2) португальский номер, (3) банк/IBAN, (4) договор аренды и совпадающая morada, (5) мониторинг канала AIMA под вашу процедуру (portal ≠ Agora). Schengen-туризм ≠ ВНЖ. Семье с детьми сначала школа/район — см. Porto vs Braga.",
  },
  {
    slug: "kak-otkryt-bankovskiy-schet-portugalia-2026",
    title: "Банк в Португалии 2026: счёт, NIF, ActivoBank / Millennium — Norte",
    excerpt:
      "NIF, KYC, ActivoBank, Millennium, CGD, Revolut MB Way и первая кредитка: что реально спрашивают у релокантов в Porto/Lisboa 2026.",
    seo_title: "Банк PT 2026: NIF, ActivoBank, Millennium",
    seo_description:
      "Открыть счёт в Португалии 2026: NIF, KYC, ActivoBank/Millennium/CGD, Revolut MB Way. Практика для RU/BY в Norte — не реклама банка.",
    quick_answer:
      "Без NIF и proof of address большинство банков PT не откроют счёт. Типовой путь 2026: NIF → пакет (паспорт, NIF, morada) → ActivoBank / Millennium / CGD или fintech с MB Way. Кредитка — отдельный скоринг, не «автоматом с счётом». Дубликат-слаг otkrytie-scheta… редиректит сюда.",
  },
  {
    slug: "ciple-guide-2026",
    title: "CIPLE A2 Португалия 2026: экзамен CAPLE для гражданства — не AIMA",
    excerpt:
      "CIPLE A2 / CAPLE: формат, запись, Norte vs Lisboa центры. Это языковой экзамен для nacionalidade — не слот Agora AIMA.",
    seo_title: "CIPLE A2 2026 — CAPLE, не слот AIMA",
    seo_description:
      "CIPLE A2 Португалия 2026: CAPLE, формат, запись. Для гражданства — не Agora AIMA. Timed mock — Prep2Go; ВНЖ — wizard Emigro.",
    quick_answer:
      "CIPLE A2 — экзамен CAPLE (FLUL) по европейскому португальскому. Нужен для многих треков гражданства, не для первичной записи AIMA/Agora. Не путайте с DELE/CIPLE-брендами других школ. Timed mock A2 — на Prep2Go; маршрут ВНЖ D7/D8 — на emigro.online.",
  },
  {
    slug: "studencheskiy-vnzh-portugal-mify-aima-2026",
    title: "Студенческий ВНЖ Португалия 2026: мифы NIF, банк, AIMA",
    excerpt:
      "Estudante ≠ «лёгкий ВНЖ»: NIF, банк, страховка, AIMA/SEF-наследие. Что чаты путают с D7/D8 и туристическим Шенгеном.",
    seo_title: "Студенческий ВНЖ PT 2026 — мифы AIMA",
    seo_description:
      "Студенческий ВНЖ Португалия 2026: NIF, банк, AIMA. Мифы чатов vs aima.gov.pt. Не путать с D7/D8 и туризмом Schengen.",
    quick_answer:
      "Студенческий статус в PT требует зачисления, средств, страховки и легального канала AIMA — это не «турист купил NIF». Estância por estudos не даёт 50% срока под nacionalidade art. 22 как larga duração-UE. Сверяйте актуальный checklist на aima.gov.pt и pillar D7/D8 на www.",
  },
  {
    slug: "arenda-lissabon-do-podpisi",
    title: "Аренда Lisboa до подписи: Idealista, caução, red flags 2026",
    excerpt:
      "Что проверить до подписи contrato в Лиссабоне: объявление, agency fee, caução, NIF продавца/агента, ловушки предоплаты.",
    seo_title: "Аренда Lisboa до подписи — red flags",
    seo_description:
      "Аренда Лиссабон до подписи 2026: Idealista, caução, agency, NIF. Red flags предоплаты. Дополнение к гайду первого месяца.",
    quick_answer:
      "До подписи в Lisboa: сверьте senhorio/агентство, не платите крупный депозит в личный IBAN без contrato, зафиксируйте NIF и адрес. После подписи — Modelo 2 и совпадение morada с AIMA. Полный первый месяц — в гайде arenda-kvartiry-lisbon…",
  },
  {
    slug: "zheltye-stranitsy-relokanta-portugaliya-2026",
    title: "Жёлтые страницы релоканта PT 2026: AIMA, Finanças, SNS, Junta",
    excerpt:
      "Кто есть кто: AIMA, Finanças, Segurança Social, SNS 24, Junta de Freguesia, IMT — зачем звонить и какие сайты открывать первыми.",
    seo_title: "Жёлтые страницы PT 2026 — AIMA/Finanças",
    seo_description:
      "Жёлтые страницы релоканта Португалия 2026: AIMA, Finanças, SNS 24, Junta, IMT. Куда идти с NIF и ВНЖ — практика Norte.",
    quick_answer:
      "Короткий справочник контактов: Finanças/NIF, AIMA (portal/Agora), SNS/SNS 24, Junta (документы района), IMT (авто). Это не каталог юристов и не замена pillar-гида по визе.",
  },
  {
    slug: "porto-vs-braga-semya-mezhdunarodnaya-shkola-2026",
    title: "Porto vs Braga 2026: семья, школа, аренда T2 — Norte",
    excerpt:
      "International schools, районы, аренда T2/T3, логистика до Porto: сравнение для семьи с детьми в Norte.",
    seo_title: "Porto vs Braga 2026 — семья и школа",
    seo_description:
      "Porto vs Braga 2026 для семьи: школы, аренда T2, климат Norte. Не Lisboa. Практика Emigro + wizard ВНЖ на www.",
    quick_answer:
      "Выбор Porto vs Braga для семьи: школа и бюджет аренды важнее «статуса города». Закладывайте international school waitlists, T2+ и дорогу на работу/AIMA. Lisboa — другой рынок (см. гайды Lisboa).",
  },
  {
    slug: "mashina-portugaliya-kupit-arenda-import-2026",
    title: "Машина в Португалии 2026: купить, аренда, импорт — IMT Norte",
    excerpt:
      "Rent-a-car vs покупка vs importação: IMT, seguro, IUC. Для релокантов в Norte — без мифов «EU номера навсегда».",
    seo_title: "Машина PT 2026 — купить / аренда / IMT",
    seo_description:
      "Машина в Португалии 2026: аренда, покупка, импорт, IMT, seguro. Практика Norte. Portagens — отдельный гайд.",
    quick_answer:
      "Короткий путь: сначала rent-a-car на адаптацию, покупка/импорт — после NIF и morada. IMT и seguro обязательны; иностранные номера не «вечный лайфхак». Платные дороги/Via Verde — гайд portagens.",
  },
  {
    slug: "platnye-dorogi-shtrafy-avariya-portugaliya-norte-2026",
    title: "Portagens Norte 2026: Via Verde, штрафы, авария — что делать",
    excerpt:
      "SCUT/portagens, Via Verde, штрафы и ДТП в Norte: куда платить и чего не делать после аварии.",
    seo_title: "Portagens Norte 2026 — Via Verde, штрафы",
    seo_description:
      "Платные дороги Португалия Norte 2026: Via Verde, штрафы, авария. Практика Emigro — не замена полису seguro.",
    quick_answer:
      "В Norte много portagens: Via Verde / CTT / EasyToll — сверяйте канал оплаты. Штраф не «игнор до границы». После ДТП — polícia + seguro; замена транспондера Via Verde не отдельный thin-гайд (сюда).",
  },
  {
    slug: "zamena-zagranpasporta-portugaliya-2026",
    title: "Замена загранпаспорта в Португалии 2026: Lisboa, запись, Norte",
    excerpt:
      "Консульство / kdmid Lisboa: какие услуги, agendamento, документы. Поездка из Porto — закладывайте день.",
    seo_title: "Загранпаспорт PT 2026 — консульство Lisboa",
    seo_description:
      "Замена загранпаспорта в Португалии 2026: запись Lisboa, документы, день из Porto/Norte. Не AIMA и не CIPLE.",
    quick_answer:
      "Загранпаспорт РФ/других стран — консульский трек (часто Lisboa), не AIMA. Бронируйте слот заранее, везите оригинал и фото по чеклисту миссии. Из Norte планируйте целый день.",
  },
  {
    slug: "klimat-norte-zhara-vlazhnost-plesen-zima-2026",
    title: "Климат Norte 2026: жара, humidade, плесень — Porto/Braga",
    excerpt:
      "Влажность, плесень, зима без отопления и лето без AC: быт Porto, Matosinhos, Braga — что смотреть в объявлении аренды.",
    seo_title: "Климат Norte 2026 — влажность и плесень",
    seo_description:
      "Климат Norte Португалия 2026: humidade, плесень, зима/лето. Porto/Braga — на что смотреть в аренде. Практика Emigro.",
    quick_answer:
      "Norte = влажность и плесень чаще, чем «вечное лето Algarve». В объявлении смотрите ориентацию, AC/desumidificador, отопление. Это быт, не визовый гайд.",
  },
  {
    slug: "sns-registration-changes-2026",
    title: "SNS Португалия 2026: регистрация, № utente, изменения для ВНЖ",
    excerpt:
      "Как попасть в SNS с ВНЖ/NISS: № utente, centro de saúde, что изменилось в практике 2026 для релокантов.",
    seo_title: "SNS PT 2026 — регистрация и № utente",
    seo_description:
      "SNS Португалия 2026: регистрация, № utente, centro de saúde при ВНЖ. Практика Emigro — сверяйте sns.gov.pt.",
    quick_answer:
      "Доступ к SNS зависит от статуса и NISS/документов резидента. После назначения centro de saúde получите nº utente. Частная страховка ≠ автоматический SNS. Официально — sns.gov.pt / SPMS.",
  },
  {
    slug: "vybor-internet-provaydera-portugaliya-2026",
    title: "Интернет в Португалии 2026: MEO, NOS, Vodafone — договор и NIF",
    excerpt:
      "Фибро vs 5G home, депозит, NIF, привязка к morada: как выбрать провайдера без ловушки 24 месяцев.",
    seo_title: "Интернет PT 2026 — MEO/NOS/Vodafone",
    seo_description:
      "Интернет Португалия 2026: MEO, NOS, Vodafone, NIF, депозит, срок договора. Практика для аренды в Norte/Lisboa.",
    quick_answer:
      "Провайдеру нужен NIF и адрес. Сравнивайте скорость, lock-in 12–24 мес и штрафы за выход. Для краткосрочной аренды иногда выгоднее 5G home / мобильный хотспот.",
  },
  {
    slug: "termo-responsabilidade-podtverzhdenie-zhilya-2026",
    title: "Termo de responsabilidade 2026: подтверждение жилья для визы/AIMA",
    excerpt:
      "Что такое termo de responsabilidade / proof of accommodation: кто подписывает, когда нужен для визы D и AIMA.",
    seo_title: "Termo de responsabilidade PT 2026",
    seo_description:
      "Termo de responsabilidade Португалия 2026: подтверждение жилья для визы D / AIMA. Кто подписывает — практика Emigro.",
    quick_answer:
      "Termo / proof of accommodation — документ о жилье (хозяин/приглашающий). Требования зависят от консульства и типа визы; для ВНЖ важнее registered contrato + Modelo 2. Не путать с fiador по аренде.",
  },
  {
    slug: "regiony-portugalii-ekspaty-klimat-tseny-2026",
    title: "Регионы Португалии 2026: климат и цены для экспатов — Norte vs Lisboa",
    excerpt:
      "Norte, Lisboa, Algarve, Centro: климат, аренда, транспорт — ориентир для выбора базы до D7/D8.",
    seo_title: "Регионы PT 2026 — климат и цены",
    seo_description:
      "Регионы Португалии 2026 для экспатов: Norte, Lisboa, Algarve — климат и аренда. Перед визой D7/D8 — wizard Emigro.",
    quick_answer:
      "Выбор региона = климат + аренда + доступ к AIMA/консульству. Norte дешевле Lisboa, Algarve — туристический сезон. Виза и пороги дохода — на pillar www, не в этом обзоре.",
  },
  {
    slug: "mezhdunarodnye-shkoly-portugaliya-2026",
    title: "Международные школы Португалия 2026: Lisboa и Norte — waitlist",
    excerpt:
      "International schools: депозиты, waitlist, районы Lisboa vs Porto. Для семьи до выбора аренды T2/T3.",
    seo_title: "Международные школы PT 2026",
    seo_description:
      "Международные школы Португалия 2026: Lisboa/Norte, waitlist, бюджет. Семья — смотрите до аренды. Emigro practice.",
    quick_answer:
      "International school часто определяет район и бюджет сильнее, чем «вид на океан». Запрашивайте waitlist до подписания долгосрочной аренды. Сравнение Porto/Braga — отдельный гайд.",
  },
  {
    slug: "lgoty-s-vnj-kulturnye-mesta-2026",
    title: "Льготы с ВНЖ PT 2026: музеи, культура, карты скидок",
    excerpt:
      "Что реально даёт cartão de residente / статус для культуры и транспорта — без мифов «всё бесплатно».",
    seo_title: "Льготы с ВНЖ PT 2026 — музеи",
    seo_description:
      "Льготы с ВНЖ Португалия 2026: музеи и культура. Что работает на практике — не путать с EU-citizen rights.",
    quick_answer:
      "ВНЖ ≠ гражданство EU: льготы зависят от места и акции. Музеи/transport — сверяйте на кассе. Не путать с правами EU citizen после nacionalidade.",
  },
  {
    slug: "pokupka-zemli-postroyka-doma-norte-portugaliya-2026",
    title: "Земля и стройка в Norte 2026: terreno, PDM, NIF — осторожно",
    excerpt:
      "Покупка terreno и стройка дома в Norte: PDM, licença, налоги. Высокий риск без юриста — это не гайд «купи и строй».",
    seo_title: "Terreno Norte 2026 — PDM и риски",
    seo_description:
      "Покупка земли и стройка Norte Португалия 2026: PDM, licença, NIF. Высокий риск — нужна проверка юриста, не DIY.",
    quick_answer:
      "Terreno в Norte без проверки PDM/licença — частый провал чатов. Нужны NIF, due diligence и архитектор/юрист. Emigro даёт рамку риска, не сопровождение сделки.",
  },
  {
    slug: "iva-climatizacao-portugal-2026",
    title: "IVA на климатизацию PT 2026: ставка, счёт-фактура, подводные",
    excerpt:
      "Климатизация / AC и IVA: что смотреть в orçamento и factura. Бытовой гайд, не налоговая консультация.",
    seo_title: "IVA климатизация PT 2026",
    seo_description:
      "IVA на климатизацию в Португалии 2026: orçamento, factura, ставка. Практика для аренды/дома — сверяйте AT.",
    quick_answer:
      "Ставка IVA и вычет зависят от типа работ и вашего статуса. Требуйте factura с NIF. Для официальных ставок — Portal das Finanças / AT. Не thin «одна цифра навсегда».",
  },
  {
    slug: "portugal-justice-system-fines-2026",
    title: "Суды Португалии 2026: штрафы за затягивание дел — что знать релоканту",
    excerpt:
      "Новости о штрафах в судах PT: как это касается обычного релоканта (и когда не касается). Не юридическая консультация.",
    seo_title: "Суды PT 2026 — штрафы, кратко",
    seo_description:
      "Штрафы в судебной системе Португалии 2026: контекст для релокантов. Не юрконсультация — следите за BOE/Diário da República.",
    quick_answer:
      "Изменения processuais в PT редко бьют по бытовому ВНЖ-треку напрямую. Если у вас гражданский/трудовой спор — адвокат. Этот note = контекст новостей, не инструкция «как судиться».",
  },
  {
    slug: "tax-debt-portugal-what-to-know-2026",
    title: "Налоговый долг PT 2026: как проверить на Portal das Finanças",
    excerpt:
      "Как релоканту проверить dívida fiscal / AT: Portal das Finanças, NIF, что бывает при долге. Не бухгалтерия под ключ.",
    seo_title: "Налоговый долг PT 2026 — проверка AT",
    seo_description:
      "Налоговый долг Португалия 2026: проверка на Portal das Finanças по NIF. Практика Emigro — не замена contabilista.",
    quick_answer:
      "Проверка: Portal das Finanças под своим NIF. Долг может блокировать справки и сделки. Для расшифровки — contabilista. Новости про «€10 млрд долгов страны» ≠ ваш личный NIF.",
  },
  {
    slug: "elektromobil-tesla-v-portugalii-2026",
    title: "Электромобиль в Португалии 2026: зарядка, IUC, Norte",
    excerpt:
      "EV/Tesla в PT: зарядка, IUC/налоги, реальность Norte. Дополнение к гайду про машину/IMT — не обзор автосалона.",
    seo_title: "EV/Tesla PT 2026 — зарядка и IUC",
    seo_description:
      "Электромобиль в Португалии 2026: зарядка, IUC, быт Norte. Связка с гайдом авто/IMT Emigro.",
    quick_answer:
      "EV в PT = зарядка дома/сети + регистрация IMT + IUC/правила для электрических. Не заменяет гайд «купить/импорт авто». Сверяйте IMT и налоговые страницы AT.",
  },
];

async function main() {
  const supabase = createServerClient();
  const now = new Date().toISOString();
  let ok = 0;
  let skip = 0;

  for (const patch of PATCHES) {
    const { data: existing, error: findErr } = await supabase
      .from("community_notes")
      .select("id, slug")
      .eq("slug", patch.slug)
      .maybeSingle();
    if (findErr) throw new Error(findErr.message);
    if (!existing) {
      console.warn(`[skip] not found: ${patch.slug}`);
      skip += 1;
      continue;
    }
    const { error } = await supabase
      .from("community_notes")
      .update({
        title: patch.title,
        excerpt: patch.excerpt,
        seo_title: patch.seo_title,
        seo_description: patch.seo_description,
        quick_answer: patch.quick_answer,
        updated_at: now,
        source_label: "editorial:gsc-crawled-seo-patch-2026-09-12",
      })
      .eq("id", existing.id);
    if (error) throw new Error(`${patch.slug}: ${error.message}`);
    console.log(`[ok] patched SEO ${patch.slug}`);
    ok += 1;
  }
  console.log(`done ok=${ok} skip=${skip}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
