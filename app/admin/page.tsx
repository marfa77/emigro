import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteLayout";

const sections = [
  {
    title: "Ops",
    links: [
      { href: "/admin/stats", label: "Site statistics" },
      { href: "/admin/leads", label: "Manual leads" },
      { href: "/admin/corridors", label: "Corridor publish status" },
      { href: "/admin/topics", label: "News destinations (DB)" },
      { href: "/admin/digest", label: "Corridor digest (DB)" },
    ],
  },
  {
    title: "Ops API (Bearer EMIGRO_ADMIN_SECRET)",
    links: [
      { href: "/api/v1/admin/news-topics", label: "GET/POST news-topics" },
      { href: "/api/v1/admin/corridors/ru-speaking-to-portugal", label: "PATCH corridor publish_status" },
    ],
  },
];

export default function AdminHubPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-bold">Emigro Admin</h1>
        <p className="mt-2 text-slate-600">
          Данные в Supabase — без деплоя. Добавление страны, справочника, программ через API или SQL.
        </p>

        {sections.map((section) => (
          <section key={section.title} className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{section.title}</h2>
            <ul className="mt-3 space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-corridor-600 hover:underline">
                    {link.label}
                  </Link>
                  <span className="ml-2 text-xs text-slate-400">{link.href}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-medium text-slate-900">Добавить страну новостей (curl)</p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
{`curl -X POST http://localhost:3000/api/v1/admin/news-topics \\
  -H "Authorization: Bearer $EMIGRO_ADMIN_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "austria",
    "url_segment": "austria",
    "country_ru": "Австрия",
    "country_en": "Austria",
    "flag": "🇦🇹",
    "audience_ru": "русскоязычные в Австрии",
    "focus_hint_ru": "RWR+, Blue Card, гражданство",
    "rss_queries": ["Austria immigration law residency"],
    "seo_tags": ["Австрия ВНЖ"]
  }'`}
          </pre>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
