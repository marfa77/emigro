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

const usePortugalSubdomain = usePortugalSubdomainFlag();
const useSpainSubdomain = useSpainSubdomainFlag();

const nextConfig = {
  reactStrictMode: true,
  // Satellite + corridor SSG can exceed the default 60s on cold Turbo builds.
  staticPageGenerationTimeout: 180,
  env: {
    PORTUGAL_SATELLITE_USE_SUBDOMAIN: usePortugalSubdomain ? "true" : "false",
    SPAIN_SATELLITE_USE_SUBDOMAIN: useSpainSubdomain ? "true" : "false",
  },
  async redirects() {
    const satelliteNotes = usePortugalSubdomain
      ? "https://portugal.emigro.online/notes/:slug"
      : "/satellite/portugal/notes/:slug";
    const satelliteTag = usePortugalSubdomain
      ? "https://portugal.emigro.online/tag/:tag"
      : "/satellite/portugal/tag/:tag";

    return [
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
