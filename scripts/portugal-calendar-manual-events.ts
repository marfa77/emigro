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

const EVENTS: Manual[] = [
  {
    key: "manual-tnsj-dez-palavras-do-inferno-2026-11-28",
    theme: "literature",
    tags: ["literature", "culture", "porto"],
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
    tags: ["culture", "literature", "porto"],
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
    tags: ["culture", "porto"],
    title: "Семинар FEP: корпоративная стратегия и инвестиции, спикер из Sonae",
    description:
      "Открытый семинар Faculdade de Economia do Porto: Жуан Долореш из Sonae рассказывает о корпоративной стратегии и управлении инвестициями крупнейшей розничной группы Португалии. Семинары FEP открыты для широкой публики, вход свободный, на португальском.",
    start: "2026-12-07T18:30:00Z",
    end: "2026-12-07T20:00:00Z",
    location: "Faculdade de Economia da Universidade do Porto, Salão Nobre",
    address: "Rua Dr. Roberto Frias, 4200-464 Porto",
    price: "бесплатно",
    url: "https://eventos.fep.up.pt/ver_evento/eventos.php",
    organizer: "FEP — Universidade do Porto",
  },
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
