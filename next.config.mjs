/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
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
