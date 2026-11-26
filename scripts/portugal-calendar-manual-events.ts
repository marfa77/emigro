/**
 * Hand-picked Porto events for the satellite calendar (porto.emigro.online/calendar):
 * Portuguese practice, meetups, networking, free public talks.
 * Every row was checked on its source page on 2026-11-26.
 *
 * Rows carry no image_url on purpose: the Telegram channel only picks rows
 * with a photo, so these stay on the site and never auto-post.
 *
 *   npx tsx scripts/portugal-calendar-manual-events.ts --dry-run
 *   npx tsx scripts/portugal-calendar-manual-events.ts
 */
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local" });

type Manual = {
  key: string;
  theme: string;
  tags: string[];
  title: string;
  description: string;
  start: string;
  end: string | null;
  location: string;
  address: string;
  price: string;
  url: string;
  organizer: string;
};

const CASA_DA_HORTA = {
  theme: "culture",
  tags: ["social", "culture", "porto"],
  title: "Portuguese Language MeetUp: живой португальский в Casa da Horta",
  description:
    "Еженедельная разговорная встреча для тех, кто учит португальский. Ведёт преподаватель Нуну, формат свободный: говорят на португальском, помогают с английским. Подходит, чтобы попрактиковать язык и познакомиться с другими приезжими и местными. Вход за донат, регистрация не нужна.",
  location: "Casa da Horta, Porto",
  address: "Rua de São Francisco 12A, Porto",
  price: "донат",
  url: "https://eventos.coletivos.org/event/portuguese-language-meetup-60",
  organizer: "Casa da Horta",
};

const FCUP = "Faculdade de Ciências da Universidade do Porto";
const FCUP_ADDRESS = "Rua do Campo Alegre 687, 4169-007 Porto";
const FLUP = "Faculdade de Letras da Universidade do Porto";
const FLUP_ADDRESS = "Via Panorâmica Edgar Cardoso, 4150-564 Porto";
const FPCEUP = "Faculdade de Psicologia e de Ciências da Educação da U.Porto";
const FPCEUP_ADDRESS = "Rua Alfredo Allen, 4200-135 Porto";
const UP_EVENT = "https://www.up.pt/eventos/event/";

/** Open university talks. Checked on up.pt and seminarios.fep.up.pt on 2026-11-26. */
const UPORTO_TALKS: Manual[] = [
  {
    key: "manual-flup-vasos-comunicantes-2026-11-30",
    theme: "culture",
    tags: ["talk", "literature", "culture", "porto"],
    title: "Vasos Comunicantes: лекции о сравнительном литературоведении в FLUP",
    description:
      "Открытый цикл лекций филологического факультета. Сабрина Седлмайер (UFMG, Бразилия) говорит об исследованиях Южной Атлантики, Алексис Виегаш разбирает видеоигры и детектив как предмет литературоведения. Цикл рассчитан на исследователей, студентов и всех интересующихся, на португальском.",
    start: "2026-11-30T16:30:00Z",
    end: null,
    location: `${FLUP}, sala 203`,
    address: FLUP_ADDRESS,
    price: "бесплатно",
    url: `${UP_EVENT}vasos-comunicantes-ciclo-de-palestras-2026`,
    organizer: "Instituto de Literatura Comparada, FLUP",
  },
  {
    key: "manual-fcup-palestras-ambiente-2026-12-02",
    theme: "culture",
    tags: ["talk", "culture", "porto"],
    title: "Лекции «Ambiente e Sustentabilidade» в FCUP: экология, реки и почва",
    description:
      "Первый день цикла лекций магистратуры по экологии: управление качеством и экологией в компаниях (Lasso Eco Innovation, 10:00), загрязнение реки Риу-Тинту (ISEP, 11:00), ДНК микробов и здоровье почвы (14:00). Каждая лекция 30 минут плюс обсуждение. Открыто для широкой публики, вход свободный, без регистрации.",
    start: "2026-12-02T10:00:00Z",
    end: "2026-12-02T15:00:00Z",
    location: `${FCUP}, FC2 -1.02`,
    address: FCUP_ADDRESS,
    price: "бесплатно",
    url: `${UP_EVENT}palestras-ambiente-e-sustentabilidade`,
    organizer: "Mestrado em Ciências e Tecnologia do Ambiente, FCUP",
  },
  {
    key: "manual-fcup-palestras-ambiente-2026-12-03",
    theme: "culture",
    tags: ["talk", "culture", "porto"],
    title: "Лекции «Ambiente e Sustentabilidade» в FCUP: климат и морские отходы",
    description:
      "Второй день цикла: Даниэла Пьяццезе из Университета Палермо об устойчивом развитии (на английском), переработка морских отходов в полезные материалы (LAQV-REQUIMTE), в 14:00 Карла Гонсалвеш из Centro do Clima о климатическом переходе на уровне города. Открыто для всех, вход свободный, без регистрации.",
    start: "2026-12-03T11:00:00Z",
    end: "2026-12-03T15:00:00Z",
    location: `${FCUP}, FC3 -1.19`,
    address: FCUP_ADDRESS,
    price: "бесплатно",
    url: `${UP_EVENT}palestras-ambiente-e-sustentabilidade`,
    organizer: "Mestrado em Ciências e Tecnologia do Ambiente, FCUP",
  },
  {
    key: "manual-fpceup-ai-risks-crime-2026-12-02",
    theme: "culture",
    tags: ["talk", "culture", "porto"],
    title: "Открытая лекция: польза и риски ИИ для правосудия и предотвращения преступлений",
    description:
      "Мария Эйра из центра ИИ и робототехники ООН (UNICRI) рассказывает, как искусственный интеллект и новые технологии меняют предотвращение преступлений, уголовное правосудие и защиту прав. Открытая лекция магистратуры по психологии в FPCEUP.",
    start: "2026-12-02T10:00:00Z",
    end: null,
    location: `${FPCEUP}, sala 254`,
    address: FPCEUP_ADDRESS,
    price: "открытая лекция",
    url: `${UP_EVENT}benefits-and-risks-of-ai-and-emerging-technologies`,
    organizer: "FPCEUP",
  },
  {
    key: "manual-flup-daniel-dennett-conference-2026-12-02",
    theme: "culture",
    tags: ["talk", "culture", "porto"],
    title: "III Daniel Dennett Conference: философия сознания в FLUP",
    description:
      "Третья конференция памяти философа Дэниела Деннета: доклады о сознании, разуме и языке. Первый день проходит очно в FLUP и онлайн, второй (3 декабря) только онлайн. Участие свободное и бесплатное, программа на сайте Института философии U.Porto.",
    start: "2026-12-02T10:00:00Z",
    end: "2026-12-02T18:15:00Z",
    location: `${FLUP}, Sala de Reuniões 2`,
    address: FLUP_ADDRESS,
    price: "бесплатно",
    url: `${UP_EVENT}iii-daniel-dennett-conference`,
    organizer: "Instituto de Filosofia da U.Porto",
  },
  {
    key: "manual-flup-criatividade-multimodal-2026-12-03",
    theme: "culture",
    tags: ["talk", "literature", "culture", "porto"],
    title: "Открытый семинар: мультимодальный роман в португальской прозе XXI века",
    description:
      "Филипе Сенош Феррейра из Университета Авейру о романах, которые соединяют текст, изображение и вёрстку, на примерах современной португальской литературы. Открытый семинар Института сравнительного литературоведения, вход свободный, на португальском.",
    start: "2026-12-03T16:30:00Z",
    end: null,
    location: `${FLUP}, sala 402`,
    address: FLUP_ADDRESS,
    price: "бесплатно",
    url: `${UP_EVENT}criatividade-multimodal-na-ficcao-portuguesa-do-se`,
    organizer: "Instituto de Literatura Comparada, FLUP",
  },
  {
    key: "manual-fep-seminar-kpmg-tax-2026-12-03",
    theme: "culture",
    tags: ["talk", "culture", "porto"],
    title: "Семинар FEP: куда движется международное налогообложение, спикер из KPMG",
    description:
      "Руи Силва, налоговый партнёр KPMG Portugal, о переменах в международном налогообложении: реорганизации групп, сделки M&A, трансфертное ценообразование. Семинар открыт для широкой публики, на португальском. Вход бесплатный, но нужна регистрация на странице семинара.",
    start: "2026-12-03T18:30:00Z",
    end: "2026-12-03T20:00:00Z",
    location: "Faculdade de Economia da Universidade do Porto, Salão Nobre",
    address: "Rua Dr. Roberto Frias, 4200-464 Porto",
    price: "бесплатно",
    url: "https://seminarios.fep.up.pt/?event=para-onde-caminha-a-fiscalidade-internacional-em-portugues&lang=pt",
    organizer: "FEP — Universidade do Porto",
  },
  {
    key: "manual-fcup-paleo-mega-incendios-2026-12-04",
    theme: "culture",
    tags: ["talk", "culture", "porto"],
    title: "Открытая лекция: мегапожары при глобальном потеплении палеозоя",
    description:
      "Палеонтолог Педру Коррейя (UTAD) рассказывает, как гигантские лесные пожары сотни миллионов лет назад меняли климат и ландшафт Земли и что это говорит о сегодняшнем потеплении. Открытая лекция департамента геонаук FCUP, на португальском.",
    start: "2026-12-04T10:00:00Z",
    end: null,
    location: `${FCUP}, Departamento de Geociências`,
    address: FCUP_ADDRESS,
    price: "бесплатно",
    url: `${UP_EVENT}palestra-paleoincendios`,
    organizer: "FCUP",
  },
  {
    key: "manual-fpceup-bridge-miit-seminar-2026-12-04",
    theme: "culture",
    tags: ["talk", "culture", "porto"],
    title: "Конференция BRIDGE & MIIT: международное образование учителей",
    description:
      "Итоговый семинар двух исследовательских проектов FPCEUP: главный доклад профессора Линды Эванс из Манчестерского университета, круглый стол об интернационализации подготовки учителей, кофе-брейк и открытая лекция о суперразнообразии в школах. Бесплатно, по предварительной регистрации.",
    start: "2026-12-04T14:00:00Z",
    end: "2026-12-04T20:00:00Z",
    location: `${FPCEUP}, Auditório 1`,
    address: FPCEUP_ADDRESS,
    price: "бесплатно, регистрация",
    url: `${UP_EVENT}seminario-final-dos-projetos-bridge-e-miit`,
    organizer: "CIIE — FPCEUP",
  },
];

/** Business, tech and startup meetups. Checked on Meetup, Luma and aeportugal.pt on 2026-11-26. */
function meetup(
  key: string,
  tags: string[],
  title: string,
  description: string,
  start: string,
  end: string | null,
  location: string,
  address: string,
  price: string,
  url: string,
  organizer: string,
): Manual {
  return { key, theme: "city", tags: [...tags, "porto"], title, description, start, end, location, address, price, url, organizer };
}

const UPTEC_ADDRESS = "Rua Alfredo Allen 455/461, 4200-135 Porto";
const NOLA = "Rua do Bolhão 124, 4000-226 Porto";

const BUSINESS_MEETUPS: Manual[] = [
  meetup(
    "manual-porto-ai-builders-zero-to-1000-2026-11-27",
    ["social", "talk"],
    "From Zero to 1000 Users: основатели о первых пользователях",
    "Встреча сообщества Porto AI Builders в рамках Porto AI Week: основатели и разработчики рассказывают, как нашли первую тысячу пользователей, потом свободное общение. На английском, бесплатно, регистрация на Luma.",
    "2026-11-27T17:45:00Z", "2026-11-27T19:30:00Z",
    "The Social Hub Porto", "Praça de Dom João I 80, 4000-065 Porto", "бесплатно", "https://luma.com/lt29pz6n", "Porto AI Builders",
  ),
  ...["2026-11-30", "2026-12-07", "2026-12-14"].map((day) =>
    meetup(
      `manual-oporto-toastmasters-${day}`,
      ["social"],
      day === "2026-12-14"
        ? "Oporto Toastmasters: публичные выступления, встреча на английском"
        : "Oporto Toastmasters: публичные выступления, встреча на португальском",
      "Открытая встреча клуба ораторов: подготовленные и импровизированные выступления с разбором. Гости приходят бесплатно и могут выступить сами. В первый, третий и пятый понедельник месяца встреча идёт на португальском, во второй и четвёртый на английском. Хорошая практика языка и знакомства.",
      `${day}T20:45:00Z`, `${day}T22:45:00Z`,
      "UPTEC Asprela", UPTEC_ADDRESS, "бесплатно", "https://www.meetup.com/leadership-and-public-speaking/events/317373630/", "Oporto Toastmasters",
    ),
  ),
  meetup(
    "manual-sobremesa-ai-health-2026-12-02",
    ["social", "talk"],
    "Sobremesa: доверили бы вы ИИ своё здоровье? Дебаты за десертом",
    "Модерируемая дискуссия об искусственном интеллекте в медицине: участники спорят за столом с десертом, формат рассчитан на знакомства. На английском, билет €19–25 на Luma.",
    "2026-12-02T18:30:00Z", "2026-12-02T20:30:00Z",
    "Calico Porto", "Rua da Meditação 70, 4150-487 Porto", "€19–25", "https://luma.com/33l03llv", "Sobremesa",
  ),
  meetup(
    "manual-leadcraft-porto-2026-12-03",
    ["social", "talk"],
    "LeadCraft Porto: митап руководителей разработки об ИИ-стратегии",
    "Встреча сообщества engineering-менеджеров в Porto Innovation Hub: доклад Жуана Фардильи о том, как строить ИИ-стратегию в команде, и панель «Software Factory» о разработке, где большую часть кода пишет ИИ. Бесплатно, мест мало, запись на Meetup.",
    "2026-12-03T18:15:00Z", "2026-12-03T20:00:00Z",
    "Porto Innovation Hub", "Largo do Dr. Tito Fontes 15, 4000-538 Porto", "бесплатно", "https://www.meetup.com/leadcraft-the-engineering-managers-community/events/317471673/", "LeadCraft",
  ),
  meetup(
    "manual-producttank-money-stories-2026-12-03",
    ["social", "talk"],
    "ProductTank Porto: Рич Миронов о том, как объяснять ценность продуктовой работы",
    "Продуктовое сообщество Порту приглашает Рича Миронова: как продакт-лидерам говорить с бизнесом на языке денег. После доклада желающие идут на ужин. На английском, запись на Meetup, есть лист ожидания.",
    "2026-12-03T19:00:00Z", "2026-12-03T21:00:00Z",
    "Pixelmatters", "Avenida dos Aliados 168, 4º andar, 4000-065 Porto", "по записи на Meetup", "https://www.meetup.com/producttank-porto/events/317502661/", "ProductTank Porto",
  ),
  meetup(
    "manual-ai-engineering-porto-2-2026-12-03",
    ["social", "talk"],
    "AI Engineering Porto #2: кто ещё читает код?",
    "Митап инженеров об ИИ в разработке: Руи Силва (PowerHive) и Жозе Педру Силва (Critical Manufacturing) о spec-driven development и ревью кода, написанного с помощью ИИ. Еда за счёт организаторов. Бесплатно, регистрация на Luma с одобрением, мест мало.",
    "2026-12-03T18:00:00Z", "2026-12-03T20:30:00Z",
    "DeHouse Península", "Praça do Bom Sucesso 159, Piso 1, 4150-146 Porto", "бесплатно", "https://luma.com/igftb2ru", "AI Engineering Porto",
  ),
  meetup(
    "manual-founders-founders-growth-talks-2026-12-03",
    ["social", "talk"],
    "Growth Talks в Founders Founders: B2B-продажи с ИИ и автоматизацией",
    "Камерная встреча без слайдов в стартап-доме Founders Founders: как собрать исходящие B2B-продажи на ИИ и автоматизации, потом вопросы и нетворкинг. До 20 человек, на английском, €6 с напитком, регистрация на Luma.",
    "2026-12-03T18:00:00Z", "2026-12-03T20:00:00Z",
    "Founders Founders", "Rua de Godim 389, 4300-240 Porto", "€6", "https://luma.com/as7fco4i", "Founders Founders",
  ),
  meetup(
    "manual-hr-afterwork-83-maia-2026-12-03",
    ["social", "talk"],
    "HR AfterWork #83: навыки будущего и роль HR в компаниях",
    "Вечерняя встреча HR-сообщества севера в технопарке TECMAIA: разговор о навыках, которые понадобятся компаниям, и нетворкинг. На португальском, бесплатно, регистрация на Luma.",
    "2026-12-03T17:30:00Z", "2026-12-03T19:30:00Z",
    "TECMAIA Parque, Edifício Matchpoint, Maia", "Rua Eng. Frederico Ulrich 2650, 4470-605 Maia", "бесплатно", "https://luma.com/jp5obgjf", "HR AfterWork",
  ),
  meetup(
    "manual-uptec-power-hour-cmvm-2026-12-10",
    ["talk"],
    "Power Hour #28 в UPTEC: финтех и регулятор CMVM",
    "Комиссия по рынку ценных бумаг Португалии (CMVM) рассказывает финтех-компаниям о канале CMVM Inov и песочнице Market4Growth, потом вопросы и консультации. Полезно, если делаете финтех в Португалии. Бесплатно, регистрация на Luma.",
    "2026-12-10T14:00:00Z", "2026-12-10T15:30:00Z",
    "UPTEC Asprela", UPTEC_ADDRESS, "бесплатно", "https://luma.com/c4kor4ab", "UPTEC и 351 Portuguese Startup Association",
  ),
  ...["2026-12-10", "2027-01-07"].map((day) =>
    meetup(
      `manual-biz-and-buzz-letraria-${day}`,
      ["social"],
      "Biz & Buzz: нетворкинг после работы для приезжих и местных",
      "Неформальная встреча Porto Business Network раз в две недели: предприниматели, фрилансеры, экспаты и местные знакомятся за напитками, без питчей. На английском, запись на Meetup.",
      `${day}T18:00:00Z`, `${day}T20:00:00Z`,
      "Letraria Porto Downtown", "Rua dos Mártires da Liberdade 108, 4000-483 Porto", "по записи на Meetup", "https://www.meetup.com/porto-business-network/events/315856526/", "Porto Business Network",
    ),
  ),
  meetup(
    "manual-the-build-room-2026-12-12",
    ["social"],
    "The Build Room: практическая встреча тех, кто строит на ИИ",
    "Встреча для тех, кто уже делает проекты с ИИ (Claude Code, агенты, MCP): один участник показывает свой проект, группа разбирает его вместе. Раз в две недели по субботам, на английском, €5.",
    "2026-12-12T12:30:00Z", "2026-12-12T15:30:00Z",
    "NOLA 2.0", NOLA, "€5", "https://www.meetup.com/the-build-room/events/317281923/", "The Build Room",
  ),
  {
    key: "manual-aep-transparencia-salarial-2026-12-15",
    theme: "culture",
    tags: ["talk", "culture", "porto"],
    title: "AEP: прозрачность зарплат, что изменится для компаний",
    description:
      "Утренний семинар в Ассоциации предпринимателей Португалии (AEP) о директиве ЕС 2023/970 о прозрачности и равенстве оплаты: две панели с юристами для руководителей, HR и бухгалтерии. На португальском, бесплатно, нужна регистрация.",
    start: "2026-12-15T09:30:00Z",
    end: "2026-12-15T12:30:00Z",
    location: "AEP, Leça da Palmeira, Matosinhos",
    address: "Avenida Dr. António Macedo 196, 4450-617 Leça da Palmeira",
    price: "бесплатно, регистрация",
    url: "https://www.aeportugal.pt/pt/eventos/cmp-02339-g6s1b-transparencia-salarial-e-igualdade-salarial-o-que-vai-mudar-para-as-empresas",
    organizer: "AEP и JPAB",
  },
];

/** Public talks at museums, libraries, Serralves, Planetário. Checked on their own pages on 2026-11-26. */
function talk(
  key: string,
  tags: string[],
  title: string,
  description: string,
  start: string,
  end: string | null,
  location: string,
  address: string,
  price: string,
  url: string,
  organizer: string,
): Manual {
  return { key, theme: "culture", tags: ["talk", ...tags, "culture", "porto"], title, description, start, end, location, address, price, url, organizer };
}

const CASA_DOS_LIVROS = "Casa dos Livros (FLUP), Palacete Burmester";
const CASA_DOS_LIVROS_ADDRESS = "Rua do Campo Alegre 1055, 4169-004 Porto";
const SERRALVES_ADDRESS = "Rua D. João de Castro 210, 4150-417 Porto";
const PLANETARIO_ADDRESS = "Rua das Estrelas, 4150-762 Porto";

const CITY_TALKS: Manual[] = [
  talk(
    "manual-matosinhos-pedro-chagas-freitas-2026-11-27",
    ["literature"],
    "Педру Шагаш Фрейташ: будущее чтения, бумага или цифра",
    "Встреча с одним из самых читаемых португальских авторов в Лесе-да-Палмейре: разговор о чтении в цифровую эпоху, потом автограф-сессия. На португальском, вход свободный до заполнения зала.",
    "2026-11-27T21:30:00Z", null,
    "Salão Paroquial de Leça da Palmeira, Matosinhos", "Leça da Palmeira, Matosinhos", "бесплатно",
    "https://www.cm-matosinhos.pt/evento/a-conversa-com-pedro-chagas-freitas", "Câmara Municipal de Matosinhos",
  ),
  talk(
    "manual-planetario-mais-perto-das-estrelas-2026-11-27",
    ["family"],
    "Mais Perto das Estrelas: вечер в Планетарии Порту и телескопы",
    "Показ звёздного неба под куполом Планетария, потом наблюдение в телескопы, если позволит погода, вместе с астрономами Института астрофизики. С 7 лет, дети с взрослыми. Бесплатно, регистрация на каждого участника.",
    "2026-11-27T21:00:00Z", "2026-11-27T22:30:00Z",
    "Planetário do Porto — Centro Ciência Viva", PLANETARIO_ADDRESS, "бесплатно, регистрация",
    "https://planetario.up.pt/pt/evento/maispertonov26", "Planetário do Porto",
  ),
  talk(
    "manual-museu-carro-electrico-ponte-ferreirinha-2026-12-02",
    [],
    "Мост Ферейринья шаг за шагом: Metro do Porto о новом мосте через Дору",
    "Инженеры Metro do Porto рассказывают, как проектировали и строили новый мост D. Antónia Ferreira, потом экскурсия. Цикл «Conversas debaixo da Ponte» в Музее трамвая, на португальском, вход свободный.",
    "2026-12-02T15:00:00Z", "2026-12-02T16:30:00Z",
    "Museu do Carro Eléctrico", "Alameda Basílio Teles 51, 4150-127 Porto", "бесплатно",
    "https://www.museudocarroelectrico.pt/event/a-ponte-ferreirinha-passo-a-passo/", "Museu do Carro Eléctrico",
  ),
  talk(
    "manual-bmag-curso-breve-47-olhares-2026-12-02",
    ["city"],
    "Curso Breve #47: 30 лет историческому центру Порту в списке ЮНЕСКО",
    "Заключительная лекция курса библиотек Порту: географ Алвару Домингеш и социолог Виржилиу Боржеш Перейра о том, как изменился исторический центр за 30 лет. На португальском, €7, со скидкой по карте библиотеки или Cartão Porto €3,50.",
    "2026-12-02T18:00:00Z", "2026-12-02T20:00:00Z",
    "Biblioteca Municipal Almeida Garrett", "Rua de Dom Manuel II, 4050-346 Porto", "€7",
    "https://www.bibliotecasdoporto.pt/evento/curso-breve-47-centro-historico-do-porto-30-anos-olhares-cruzados-novas-datas/", "Bibliotecas do Porto",
  ),
  talk(
    "manual-casa-dos-livros-hanukkah-2026-12-04",
    [],
    "Евреи Порту и их традиции: лекция о Хануке",
    "Сезар Сантуш Силва и Майкл Ротвелл рассказывают о еврейской общине Порту и празднике Ханука, с показом игры в дрейдл. В 15:15 поёт хор Mekor Haim. На португальском, вход свободный.",
    "2026-12-04T15:30:00Z", "2026-12-04T17:30:00Z",
    CASA_DOS_LIVROS, CASA_DOS_LIVROS_ADDRESS, "бесплатно",
    "https://wp.letras.up.pt/casadoslivros/pt/evento/conferencia-do-professor-cesar-santos-silva-e-do-professor-doutor-michael-hothwell-os-judeus-no-porto-e-as-suas-tradicoes-o-hanukkah/", "Casa dos Livros, FLUP",
  ),
  talk(
    "manual-museu-do-porto-arqueociencias-ceramica-2026-12-04",
    [],
    "Arqueociências: что химия керамики рассказывает археологам",
    "Осенний курс Музея Порту: Фернанду Каштру и Изабел Фернандеш (Университет Минью) о химическом анализе древней керамики. Лекция в бывшем резервуаре в парке Паштелейра, на португальском, 40 мест, билет €2.",
    "2026-12-04T17:45:00Z", "2026-12-04T19:45:00Z",
    "Reservatório — Museu do Porto, Parque da Pasteleira", "Rua de Gomes Eanes de Azurara, 4150-362 Porto", "€2",
    "https://museudoporto.pt/en/recurso/curso-de-outono-arqueociencias-1-o-interesse-da-caraterizacao-de-ceramicas-para-a-investigacao-arqueologica/", "Museu do Porto",
  ),
  talk(
    "manual-serralves-miguel-gomes-critico-2026-12-05",
    ["cinema"],
    "Мигел Гомеш — кинокритик: презентация книги в Serralves",
    "Режиссёр Мигел Гомеш вместе с Рикарду Виейрой Лижбоа и Антониу Прету говорит о своих кинокритических текстах 1996–2001 годов. Аудитория Casa do Cinema Manoel de Oliveira, на португальском, бесплатно по регистрации.",
    "2026-12-05T17:00:00Z", null,
    "Casa do Cinema Manoel de Oliveira, Serralves", SERRALVES_ADDRESS, "бесплатно, регистрация",
    "https://www.serralves.pt/en/atividades-serralves/0512-miguel-gomes-critico-de-cinema/", "Fundação de Serralves",
  ),
  talk(
    "manual-casa-do-infante-curso-breve-47-2026-12-09",
    ["city"],
    "Исторический центр Порту изнутри: от заявки в ЮНЕСКО до управления",
    "Лекция архитектора Руи Лозы, который вёл заявку исторического центра Порту в ЮНЕСКО, и круглый стол о 30 годах в списке всемирного наследия. Casa do Infante, на португальском, вход свободный.",
    "2026-12-09T18:00:00Z", "2026-12-09T19:30:00Z",
    "Casa do Infante", "Rua da Alfândega 10, 4050-029 Porto", "бесплатно",
    "https://www.bibliotecasdoporto.pt/evento/curso-breve-47-o-centro-historico-do-porto-patrimonio-mundial-visto-por-dentro-da-candidatura-a-gestao/", "Bibliotecas do Porto",
  ),
  talk(
    "manual-casa-dos-livros-natal-natais-2026-12-09",
    ["social"],
    "Natal! Natais…: как встречают Рождество в Венгрии, Италии, Бразилии и Дании",
    "Круглый стол о рождественских обычаях разных стран: преподаватели и гости из Венгрии, Италии, Бразилии и Дании рассказывают о своих традициях. Цикл «Do Natal aos Reis», на португальском, вход свободный.",
    "2026-12-09T17:30:00Z", "2026-12-09T19:30:00Z",
    CASA_DOS_LIVROS, CASA_DOS_LIVROS_ADDRESS, "бесплатно",
    "https://wp.letras.up.pt/casadoslivros/pt/evento/natal-natais-mesa-redonda-com-professor-doutor-istvan-rakoczi-professor-doutor-giuseppe-mea-dr-a-carolina-avilez-de-basto-e-dr-a-mafalda-de-brito/", "Casa dos Livros, FLUP",
  ),
  talk(
    "manual-upt-direitos-humanos-2026-12-10",
    [],
    "Всеобщая декларация прав человека сегодня: лекция Марии Лусии Амарал",
    "Бывший омбудсмен Португалии Мария Лусия Амарал о смысле и действенности Декларации 1948 года, потом дискуссия и кофе. Университет Portucalense, на португальском, бесплатно по предварительной регистрации, сбор с 14:00.",
    "2026-12-10T14:30:00Z", "2026-12-10T16:15:00Z",
    "Universidade Portucalense, Auditório 201", "Rua Dr. António Bernardino de Almeida 541, 4200-072 Porto", "бесплатно, регистрация",
    "https://www.upt.pt/noticias/maria-lucia-amaral-debate-direitos-humanos/", "Universidade Portucalense",
  ),
  talk(
    "manual-serralves-marie-jose-van-hee-2026-12-12",
    [],
    "Мари-Жозе Ван Хе: разговор об архитектуре в Serralves",
    "Бельгийский архитектор Мари-Жозе Ван Хе в разговоре с Марком Дюбуа, Фернандой Фрагатейру и Сэмом Де Вохтом, к 15-летию издательства AMAG. Аудитория Музея Serralves, бесплатно по онлайн-регистрации.",
    "2026-12-12T17:00:00Z", null,
    "Auditório do Museu de Serralves", SERRALVES_ADDRESS, "бесплатно, регистрация",
    "https://www.serralves.pt/en/atividades-serralves/1212-marie-jose-van-hee-celebracao-da-arquitetura/", "Fundação de Serralves",
  ),
  talk(
    "manual-planetario-minicurso-astronomia-2026-12-14",
    [],
    "Мини-курс астрономии: системы жизнеобеспечения для жизни в космосе",
    "Изабел Соуза (Институт астрофизики, FEUP, i3S) о биорегенеративных системах, которые помогут людям жить в космосе. Открыто для широкой публики, есть трансляция. Бесплатно, регистрация через форму на странице.",
    "2026-12-14T13:00:00Z", "2026-12-14T17:00:00Z",
    "Planetário do Porto — Centro Ciência Viva", PLANETARIO_ADDRESS, "бесплатно, регистрация",
    "https://planetario.up.pt/pt/evento/minicurso-astro26", "Planetário do Porto",
  ),
  talk(
    "manual-bmag-clube-da-saude-mudanca-2026-12-15",
    ["wellness"],
    "Клуб здоровья: как справляться с переменами",
    "Психолог Мафалда Матеуш о стойкости и о том, как переживать большие перемены в жизни. Встреча в библиотеке Алмейды Гаррета, на португальском, бесплатно по регистрации.",
    "2026-12-15T14:30:00Z", null,
    "Biblioteca Municipal Almeida Garrett, Sala Multiusos", "Rua de Dom Manuel II, 4050-346 Porto", "бесплатно, регистрация",
    "https://www.bibliotecasdoporto.pt/evento/clube-da-saude-estrategias-para-lidar-com-a-mudanca/", "Bibliotecas do Porto",
  ),
  talk(
    "manual-casa-dos-livros-natal-grinch-2026-12-16",
    [],
    "«Рождество? Нет, спасибо!»: разговор с точки зрения Гринча",
    "Ироничная беседа о том, почему не все любят Рождество, в цикле «Do Natal aos Reis» в Casa dos Livros. На португальском, вход свободный.",
    "2026-12-16T17:30:00Z", "2026-12-16T19:30:00Z",
    CASA_DOS_LIVROS, CASA_DOS_LIVROS_ADDRESS, "бесплатно",
    "https://wp.letras.up.pt/casadoslivros/pt/evento/natal-nao-obrigado-a-perspetiva-grinch-conversa-com-a-professora-doutora-zulmira-santos-e-a-professora-doutora-helena-vilaca/", "Casa dos Livros, FLUP",
  ),
  talk(
    "manual-casa-dos-livros-escritorios-2027-01-06",
    ["literature"],
    "Кабинеты писателей: Граса Моура, Ана Луиза Амарал, Эужениу де Андраде",
    "Воспоминания о рабочих кабинетах писателей Порту: Вашку Граса Моуры, Аны Луизы Амарал, Умберту Бакеру Морену и Эужениу де Андраде. Говорят Гонсалу Граса Моура, Фатима Виейра и Арналду Сарайва. На португальском, вход свободный.",
    "2027-01-06T17:00:00Z", "2027-01-06T18:00:00Z",
    CASA_DOS_LIVROS, CASA_DOS_LIVROS_ADDRESS, "бесплатно",
    "https://wp.letras.up.pt/casadoslivros/pt/evento/entre-o-imaginado-e-o-vivido-os-escritorios-de-vasco-graca-moura-ana-luisa-amaral-humberto-baquero-moreno-e-eugenio-de-andrade-memorias-testemunhos-e-representacoes-conversa-com-o/", "Casa dos Livros, FLUP",
  ),
  ...["2026-12-04", "2026-12-11", "2026-12-18"].map((day) => ({
    key: `manual-porto-social-language-exchange-${day}`,
    theme: "night",
    tags: ["social", "night", "porto"],
    title: "Porto Social & Language Exchange: языковой обмен в Bonaparte",
    description:
      "Пятничный языковой обмен в баре Bonaparte Downtown: местные и приезжие практикуют португальский, английский и другие языки и знакомятся. Каждую пятницу с 18:00, билет €3 только онлайн на Eventbrite.",
    start: `${day}T18:00:00Z`,
    end: null,
    location: "Bonaparte Downtown, Porto",
    address: "Praça de Guilherme Gomes Fernandes 40, 4050-150 Porto",
    price: "€3",
    url: "https://www.eventbrite.com/e/porto-social-and-language-exchange-make-new-friends-tickets-1992611520698",
    organizer: "Porto Social and Language Exchange",
  })),
];

const EVENTS: Manual[] = [
  {
    key: "manual-tnsj-dez-palavras-do-inferno-2026-11-28",
    theme: "literature",
    tags: ["talk", "literature", "culture", "porto"],
    title: "Dez palavras do Inferno: лекция Марку Невеша о португальском языке",
    description:
      "Лингвист и популяризатор языка Марку Невеш разбирает десять слов из «Auto da Barca do Inferno» Жила Висенте: откуда они взялись и что значат сегодня. Лекция на португальском, хороший способ послушать живую речь и узнать язык глубже. Вход свободный.",
    start: "2026-11-28T16:00:00Z",
    end: "2026-11-28T18:00:00Z",
    location: "Teatro Nacional São João, Porto",
    address: "Praça da Batalha, Porto",
    price: "бесплатно",
    url: "https://www.agenda-porto.pt/en/evento/tnsj-dez-palavras-do-inferno/",
    organizer: "Teatro Nacional São João",
  },
  {
    key: "manual-influencia-inglesa-no-porto-2026-11-28",
    theme: "culture",
    tags: ["talk", "culture", "literature", "porto"],
    title: "A Influência Inglesa no Porto: коллоквиум в Palácio da Bolsa",
    description:
      "Разговор о том, как англичане повлияли на Порту, и презентация книги Игнасио Пейро «Anglofilia». Среди участников Паулу Рангел, Пол Симингтон и Клара Феррейра Алвеш. Публичное событие в Арабском зале Palácio da Bolsa, на португальском. Вход свободный.",
    start: "2026-11-28T16:00:00Z",
    end: "2026-11-28T19:30:00Z",
    location: "Palácio da Bolsa, Salão Árabe, Porto",
    address: "Rua de Ferreira Borges, 4050-253 Porto",
    price: "бесплатно",
    url: "https://www.agenda-porto.pt/en/evento/a-iinfluencia-inglesa-no-porto/",
    organizer: "Museu do Porto",
  },
  ...["2026-12-02", "2026-12-09", "2026-12-16"].map((day) => ({
    ...CASA_DA_HORTA,
    key: `manual-portuguese-language-meetup-casa-da-horta-${day}`,
    start: `${day}T18:30:00Z`,
    end: `${day}T20:00:00Z`,
  })),
  ...["2026-12-03", "2026-12-17"].map((day) => ({
    key: `manual-porto-future-tech-networking-${day}`,
    theme: "city",
    tags: ["social", "city", "porto"],
    title: "Porto Future Tech: неформальный нетворкинг для айтишников",
    description:
      "Встреча людей из технологий раз в две недели: знакомства, разговоры о трендах и работе в Порту. Общаются на английском и португальском, можно прийти одному. Записаться нужно на странице Meetup, вход без билета.",
    start: `${day}T19:00:00Z`,
    end: `${day}T21:00:00Z`,
    location: "A Fábrica da Picaria, Porto",
    address: "Rua da Picaria 72, Porto",
    price: "по записи на Meetup",
    url: "https://www.meetup.com/porto-future-tech/events/317354816/",
    organizer: "Porto Future Tech",
  })),
  {
    key: "manual-friday-international-social-embaixada-2026-12-04",
    theme: "night",
    tags: ["social", "night", "porto"],
    title: "Friday International Social: вечер знакомств для приезжих и местных",
    description:
      "Пятничная встреча международного сообщества Порту: экспаты, студенты и местные знакомятся за едой и напитками. Сбор на втором этаже бара Embaixada с 20:00, после 23:15 желающие идут дальше. Общение на английском. Вход бесплатный, еду и напитки каждый оплачивает сам.",
    start: "2026-12-04T20:00:00Z",
    end: "2026-12-04T23:15:00Z",
    location: "Embaixada Bar, Porto",
    address: "Praça de Carlos Alberto 121, 4050-159 Porto",
    price: "бесплатно",
    url: "https://www.meetup.com/porto-internationals/events/314351458/",
    organizer: "Porto Internationals",
  },
  {
    key: "manual-porto-business-network-brunch-61-2026-12-05",
    theme: "food",
    tags: ["social", "food", "porto"],
    title: "Business Talks & Brunch #61: бизнес-бранч Porto Business Network",
    description:
      "Субботний бранч для предпринимателей, фрилансеров и тех, кто только открывает дело в Португалии. Короткие выступления и свободный нетворкинг за столом, на английском. Шестьдесят первая встреча серии, подходит, чтобы влиться в местное деловое сообщество.",
    start: "2026-12-05T11:00:00Z",
    end: "2026-12-05T14:00:00Z",
    location: "NOLA 2.0, Porto",
    address: "Rua do Bolhão 124, 4000-226 Porto",
    price: "€10",
    url: "https://www.meetup.com/porto-business-network/events/317251499/",
    organizer: "Porto Business Network",
  },
  {
    key: "manual-fep-seminar-sonae-strategy-2026-12-07",
    theme: "culture",
    tags: ["talk", "culture", "porto"],
    title: "Семинар FEP: корпоративная стратегия и инвестиции, спикер из Sonae",
    description:
      "Открытый семинар Faculdade de Economia do Porto: Жуан Долореш из Sonae рассказывает о корпоративной стратегии и управлении инвестициями крупнейшей розничной группы Португалии. Семинар открыт для широкой публики, на португальском. Вход бесплатный, но нужна регистрация на странице семинара.",
    start: "2026-12-07T18:30:00Z",
    end: "2026-12-07T20:00:00Z",
    location: "Faculdade de Economia da Universidade do Porto, Salão Nobre",
    address: "Rua Dr. Roberto Frias, 4200-464 Porto",
    price: "бесплатно",
    url: "https://seminarios.fep.up.pt/?event=estrategia-corporativa-e-gestao-de-investimentos-em-portugues&lang=pt",
    organizer: "FEP — Universidade do Porto",
  },
  ...UPORTO_TALKS,
  ...BUSINESS_MEETUPS,
  ...CITY_TALKS,
];

function slugOf(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);
}

function mapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const rows = EVENTS.map((ev) => ({
    source_key: ev.key,
    slug: slugOf(ev.key),
    country: "PT",
    city: "Porto",
    theme: ev.theme,
    tags: ev.tags,
    title: ev.title,
    description: ev.description,
    start_at: ev.start,
    end_at: ev.end,
    location: ev.location,
    address: ev.address,
    maps_url: mapsUrl(ev.address),
    price_label: ev.price,
    source_url: ev.url,
    image_url: null,
    source_id: "manual",
    organizer: ev.organizer,
    updated_at: new Date().toISOString(),
  }));

  if (dryRun) {
    for (const row of rows) console.log(`${row.start_at}  ${row.theme.padEnd(10)} ${row.price_label.padEnd(20)} ${row.title}`);
    console.log(`[manual-events] dry-run, ${rows.length} rows`);
    return;
  }

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
  const { error } = await db.from("outdoor_events").upsert(rows, { onConflict: "source_key" });
  if (error) throw new Error(error.message);
  console.log(`[manual-events] upserted ${rows.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
