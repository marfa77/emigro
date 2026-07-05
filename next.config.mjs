/** @type {import('next').NextConfig} */
function usePortugalSubdomainFlag() {
  const flag = process.env.PORTUGAL_SATELLITE_USE_SUBDOMAIN?.trim()?.toLowerCase();
  if (flag === "false") return false;
  if (flag === "true") return true;
  return process.env.NODE_ENV === "production";
}

const usePortugalSubdomain = usePortugalSubdomainFlag();

const nextConfig = {
  reactStrictMode: true,
  env: {
    PORTUGAL_SATELLITE_USE_SUBDOMAIN: usePortugalSubdomain ? "true" : "false",
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
        missing: [{ type: "host", value: "portugal.emigro.online" }],
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
    ];
  },
};

export default nextConfig;
