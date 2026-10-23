/** @type {import('next').NextConfig} */
function usePortugalSubdomainFlag() {
  const flag = process.env.PORTUGAL_SATELLITE_USE_SUBDOMAIN?.trim()?.toLowerCase();
  if (flag === "false") return false;
  if (flag === "true") return true;
  return process.env.NODE_ENV === "production";
}

function useSpainSubdomainFlag() {
  const flag = process.env.SPAIN_SATELLITE_USE_SUBDOMAIN?.trim()?.toLowerCase();
  if (flag === "false") return false;
  if (flag === "true") return true;
  return process.env.NODE_ENV === "production";
}

function useItalySubdomainFlag() {
  const flag = process.env.ITALY_SATELLITE_USE_SUBDOMAIN?.trim()?.toLowerCase();
  if (flag === "false") return false;
  if (flag === "true") return true;
  return process.env.NODE_ENV === "production";
}

function useThailandSubdomainFlag() {
  const flag = process.env.THAILAND_SATELLITE_USE_SUBDOMAIN?.trim()?.toLowerCase();
  if (flag === "false") return false;
  if (flag === "true") return true;
  return process.env.NODE_ENV === "production";
}

/**
 * Portugal satellite notes archived Oct 2026 (expired news / one-shot / duplicates).
 * Keep in sync with ARCHIVE_SLUGS in lib/community-notes/editorial-filter.ts.
 * Destination starting with "https://" is cross-host (www pillar).
 */
const PORTUGAL_ARCHIVED_NOTE_REDIRECTS = {
  "greve-geral-portugal-aima-2026": "aima-agora-zapis-2026",
  "politicheskiy-krizis-ministr-neves-portugalia": "aima-agora-zapis-2026",
  "algarve-border-control-news-2026": "polet-bez-karty-vnzh-aima-portugalia",
  "portugal-spain-border-control-proposal-2026": "polet-bez-karty-vnzh-aima-portugalia",
  "lisbon-metro-cais-sodre-closure-august-2026": "turizm-vnutri-portugalii-norte-2026",
  "pogodnye-preduprezhdeniya-portugalia-znoj": "klimat-norte-zhara-vlazhnost-plesen-zima-2026",
  "iva-climatizacao-portugal-2026": "klimat-norte-zhara-vlazhnost-plesen-zima-2026",
  "free-museums-portugal-changes-2026": "lgoty-s-vnj-kulturnye-mesta-2026",
  "car-child-safety-rules-portugal-2026": "mashina-portugaliya-kupit-arenda-import-2026",
  "novye-pravila-bezopasnosti-avto-portugalia-2026": "mashina-portugaliya-kupit-arenda-import-2026",
  "ipoteka-portugal-stavki-rastut-2026": "kupit-kvartiru-portugaliya-norte-2026",
  "mercado-imobiliario-2026-impacto-arrendamento": "arenda-dolgosrok-porto-braga-2026",
  "arrendamento-jovem-porto-2026": "arenda-dolgosrok-porto-braga-2026",
  "banco-de-portugal-deposit-comparator-2026": "kak-otkryt-bankovskiy-schet-portugalia-2026",
  "portugal-justice-system-fines-2026": "platnye-dorogi-shtrafy-avariya-portugaliya-norte-2026",
  "apostille-notaries-portugal-2027": "doverennost-i-zvonki-v-rf-iz-portugalii",
  "maternity-care-law-change-portugal-2026": "meditsina-norte-sns-chastnaya-stomatologiya-2026",
  "abono-prenatal-automatico-portugal-2026": "meditsina-norte-sns-chastnaya-stomatologiya-2026",
  "pets-civil-protection-portugal-2026": "poterya-pitomtsa-portugaliya-gid-2026",
  "portuguese-passport-ranking-2026":
    "https://www.emigro.online/ru/guides/vnj-portugaliya-d8-d7-grazhdanstvo-2026",
  // Same topic as the www pillar — one URL per intent.
  "prodlenie-vnzh-portugaliya-aima-2026":
    "https://www.emigro.online/ru/guides/prodlenie-vnzh-portugaliya-aima-2026",
};

function portugalArchivedNoteRedirects() {
  return Object.entries(PORTUGAL_ARCHIVED_NOTE_REDIRECTS).flatMap(([from, to]) => {
    const external = to.startsWith("https://");
    return [
      {
        source: `/notes/${from}`,
        has: [{ type: "host", value: "portugal.emigro.online" }],
        destination: external ? to : `/notes/${to}`,
        permanent: true,
      },
      {
        source: `/satellite/portugal/notes/${from}`,
        destination: external ? to : `/satellite/portugal/notes/${to}`,
        permanent: true,
      },
    ];
  });
}

const usePortugalSubdomain = usePortugalSubdomainFlag();
const useSpainSubdomain = useSpainSubdomainFlag();
const useItalySubdomain = useItalySubdomainFlag();
const useThailandSubdomain = useThailandSubdomainFlag();

const nextConfig = {
  reactStrictMode: true,
  // Satellite + corridor SSG can exceed the default 60s on cold Turbo builds.
  staticPageGenerationTimeout: 180,
  experimental: {
    // Owner agent in @emigro_chat_bot reads guides and docs from disk at runtime.
    outputFileTracingIncludes: {
      "/api/telegram/webhook": ["./content/guides/**/*.md", "./docs/*.md"],
      "/api/telegram/news-webhook": ["./content/guides/**/*.md", "./docs/*.md"],
      "/api/v1/investment/pdf/[[...file]]": ["./private/assist/*.pdf"],
    },
  },
  env: {
    PORTUGAL_SATELLITE_USE_SUBDOMAIN: usePortugalSubdomain ? "true" : "false",
    SPAIN_SATELLITE_USE_SUBDOMAIN: useSpainSubdomain ? "true" : "false",
    ITALY_SATELLITE_USE_SUBDOMAIN: useItalySubdomain ? "true" : "false",
    THAILAND_SATELLITE_USE_SUBDOMAIN: useThailandSubdomain ? "true" : "false",
  },
  async redirects() {
    const satelliteNotes = usePortugalSubdomain
      ? "https://portugal.emigro.online/notes/:slug"
      : "/satellite/portugal/notes/:slug";
    const satelliteTag = usePortugalSubdomain
      ? "https://portugal.emigro.online/tag/:tag"
      : "/satellite/portugal/tag/:tag";

    return [
      // Golden Visa PDF is served only via signed /api/v1/investment/pdf links after the form.
      ...["ru", "en"].map((locale) => ({
        source: `/assist/emigro_golden_visa_2026_comparison_${locale}.pdf`,
        destination: `/${locale}/invest/compare#invest-quick`,
        statusCode: 302,
      })),
      { source: "/d7", destination: "/ru/portugal/programs/portugal-d7-passive-income", permanent: true },
      { source: "/d8", destination: "/ru/portugal/programs/portugal-d8-digital-nomad", permanent: true },
      { source: "/ru/d7", destination: "/ru/portugal/programs/portugal-d7-passive-income", permanent: true },
      { source: "/ru/d8", destination: "/ru/portugal/programs/portugal-d8-digital-nomad", permanent: true },
      {
        source: "/favicon.ico",
        destination: "/icon",
        permanent: true,
      },
      {
        source: "/notes/:slug",
        has: [{ type: "host", value: "emigro.online" }],
        destination: usePortugalSubdomain
          ? "https://portugal.emigro.online/notes/:slug"
          : "https://www.emigro.online/satellite/portugal/notes/:slug",
        permanent: true,
      },
      {
        source: "/notes/:slug",
        has: [{ type: "host", value: "www.emigro.online" }],
        destination: satelliteNotes,
        permanent: true,
      },
      {
        source: "/tag/:tag",
        has: [{ type: "host", value: "emigro.online" }],
        destination: usePortugalSubdomain
          ? "https://portugal.emigro.online/tag/:tag"
          : "https://www.emigro.online/satellite/portugal/tag/:tag",
        permanent: true,
      },
      {
        source: "/tag/:tag",
        has: [{ type: "host", value: "www.emigro.online" }],
        destination: satelliteTag,
        permanent: true,
      },
      {
        source: "/",
        missing: [
          { type: "host", value: "portugal.emigro.online" },
          { type: "host", value: "spain.emigro.online" },
          { type: "host", value: "italy.emigro.online" },
          { type: "host", value: "thailand.emigro.online" },
        ],
        destination: "/ru",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "emigro.online" }],
        destination: "https://www.emigro.online/:path*",
        permanent: true,
      },
      // EN money aliases have no localized page yet — send them to the live RU money pages
      // instead of the RU 404.
      ...[
        { source: "/assist", destination: "/ru/assist" },
        // EN assist was a thin mirror that LLMs confused with Emigro Consulting / Emigro.co —
        // send English visitors to the live RU money page (same product).
        { source: "/en/assist", destination: "/ru/assist" },
        { source: "/en/assist/:path*", destination: "/ru/assist/:path*" },
        { source: "/check", destination: "/ru/route-check" },
        { source: "/pricing", destination: "/ru/route-check" },
      ].map(({ source, destination }) => ({
        source,
        missing: [
          { type: "host", value: "portugal.emigro.online" },
          { type: "host", value: "spain.emigro.online" },
          { type: "host", value: "italy.emigro.online" },
          { type: "host", value: "thailand.emigro.online" },
        ],
        destination,
        permanent: true,
      })),
      {
        source: "/ru/portugal/news",
        destination: "/ru/news?country=portugal",
        permanent: true,
      },
      {
        source: "/ru/portugal/news/feed.xml",
        destination: "/ru/news/feed.xml?country=portugal",
        permanent: true,
      },
      {
        source: "/ru/portugal/news/:slug",
        destination: "/ru/news/:slug",
        permanent: true,
      },
      {
        source: "/api/cron/portugal-news",
        destination: "/api/cron/weekly-news?topic=portugal",
        permanent: false,
      },
      // Merged into kak-otkryt-bankovskiy-schet-portugalia-2026
      {
        source: "/notes/otkrytie-scheta-kreditnaya-karta-portugaliya-2026",
        has: [{ type: "host", value: "portugal.emigro.online" }],
        destination: "/notes/kak-otkryt-bankovskiy-schet-portugalia-2026",
        permanent: true,
      },
      {
        source: "/satellite/portugal/notes/otkrytie-scheta-kreditnaya-karta-portugaliya-2026",
        destination: "/satellite/portugal/notes/kak-otkryt-bankovskiy-schet-portugalia-2026",
        permanent: true,
      },
      {
        source: "/ru/guides/otkrytie-scheta-kreditnaya-karta-portugaliya-2026",
        destination: "/ru/guides/kak-otkryt-bankovskiy-schet-portugalia-2026",
        permanent: true,
      },
      // Thin household notes archived Sep 2026 — redirect to system guides / hub
      {
        source: "/notes/via-verde-transponder-replacement-portugal",
        has: [{ type: "host", value: "portugal.emigro.online" }],
        destination: "/notes/platnye-dorogi-shtrafy-avariya-portugaliya-norte-2026",
        permanent: true,
      },
      {
        source: "/satellite/portugal/notes/via-verde-transponder-replacement-portugal",
        destination: "/satellite/portugal/notes/platnye-dorogi-shtrafy-avariya-portugaliya-norte-2026",
        permanent: true,
      },
      {
        source: "/notes/porto-free-public-transport-guide",
        has: [{ type: "host", value: "portugal.emigro.online" }],
        destination: "/notes/turizm-vnutri-portugalii-norte-2026",
        permanent: true,
      },
      {
        source: "/satellite/portugal/notes/porto-free-public-transport-guide",
        destination: "/satellite/portugal/notes/turizm-vnutri-portugalii-norte-2026",
        permanent: true,
      },
      {
        source: "/notes/vozvrat-remont-tovarov-portugaliya-2026",
        has: [{ type: "host", value: "portugal.emigro.online" }],
        destination: "/",
        permanent: true,
      },
      {
        source: "/satellite/portugal/notes/vozvrat-remont-tovarov-portugaliya-2026",
        destination: "/satellite/portugal",
        permanent: true,
      },
      {
        source: "/notes/smena-adresa-nif-financas-2026",
        has: [{ type: "host", value: "portugal.emigro.online" }],
        destination: "/notes/prodlenie-vnzh-portugaliya-aima-2026",
        permanent: true,
      },
      {
        source: "/satellite/portugal/notes/smena-adresa-nif-financas-2026",
        destination: "/satellite/portugal/notes/prodlenie-vnzh-portugaliya-aima-2026",
        permanent: true,
      },
      // Soft-duplicate hub URL on sat host → public canonical /
      {
        source: "/satellite/portugal",
        has: [{ type: "host", value: "portugal.emigro.online" }],
        destination: "/",
        permanent: true,
      },
      // Lisboa-centric NIF note → Porto / Norte hand guide
      {
        source: "/notes/nif-lissabon-chto-puutayut",
        has: [{ type: "host", value: "portugal.emigro.online" }],
        destination: "/notes/nif-porto-kak-poluchit-2026",
        permanent: true,
      },
      {
        source: "/satellite/portugal/notes/nif-lissabon-chto-puutayut",
        destination: "/satellite/portugal/notes/nif-porto-kak-poluchit-2026",
        permanent: true,
      },
      ...portugalArchivedNoteRedirects(),
      // Merged into digital-nomad-vizy-evropy-sravnenie-2026 (canonical DN comparison)
      {
        source: "/ru/guides/digital-nomad-portugaliya-ispaniya-italiya-2026",
        destination: "/ru/guides/digital-nomad-vizy-evropy-sravnenie-2026",
        permanent: true,
      },
      // Merged into vnj-germaniya-2026 (canonical Germany VNJ)
      {
        source: "/ru/guides/germaniya-blue-card-chancenkarte-2026-sng",
        destination: "/ru/guides/vnj-germaniya-2026",
        permanent: true,
      },
      // Merged into rabota-v-evrope-dlya-rossiyan-2026 (canonical EU work comparison)
      {
        source: "/ru/guides/germaniya-vs-niderlandy-blue-card",
        destination: "/ru/guides/rabota-v-evrope-dlya-rossiyan-2026",
        permanent: true,
      },
      // Merged into visa-nomada-digital-espana-latam-2026 (canonical DN LATAM pillar)
      {
        source: "/es/guides/visa-nomada-digital-espana-uruguayos-2026",
        destination: "/es/guides/visa-nomada-digital-espana-latam-2026",
        permanent: true,
      },
      {
        source: "/es/guides/visa-nomada-digital-espana-ecuatorianos-2026",
        destination: "/es/guides/visa-nomada-digital-espana-latam-2026",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
