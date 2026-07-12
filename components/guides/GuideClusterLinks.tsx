import Link from "next/link";
import { Route } from "lucide-react";
import type { ClusterLink as ClusterLinkType, SeoCluster } from "@/lib/seo/cluster-links";

type Props = {
  cluster?: SeoCluster;
  crossLinks?: ClusterLinkType[];
};

function ClusterLinkItem({ link }: { link: ClusterLinkType }) {
  const className =
    "group block rounded-lg border border-slate-200 bg-white p-3 transition hover:border-corridor-300 hover:shadow-sm";

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        <p className="font-medium text-slate-900 group-hover:text-corridor-700">{link.label}</p>
        {link.description && <p className="mt-1 text-xs text-slate-600">{link.description}</p>}
      </a>
    );
  }

  return (
    <Link href={link.href} className={className}>
      <p className="font-medium text-slate-900 group-hover:text-corridor-700">{link.label}</p>
      {link.description && <p className="mt-1 text-xs text-slate-600">{link.description}</p>}
    </Link>
  );
}

export function GuideClusterLinks({ cluster, crossLinks = [] }: Props) {
  if (!cluster && crossLinks.length === 0) return null;

  return (
    <section
      className="mt-8 rounded-[2rem] border border-corridor-100 bg-gradient-to-br from-corridor-50/80 to-white p-6 shadow-sm ring-1 ring-corridor-100 sm:p-7"
      aria-labelledby="cluster-links-heading"
    >
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-corridor-100 p-2 text-corridor-700">
          <Route className="h-5 w-5" />
        </span>
        <div>
          <h2 id="cluster-links-heading" className="text-lg font-semibold text-slate-900">
            {cluster ? cluster.title : "Сравнение маршрутов"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {cluster
              ? "Связанные страницы коридора — от pillar-гайда до практики и Barakhlo."
              : "Связанные сравнения и pillar-гайды коридоров."}
          </p>
        </div>
      </div>

      {cluster && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {cluster.links.map((link) => (
            <ClusterLinkItem key={link.href} link={link} />
          ))}
        </div>
      )}

      {crossLinks.length > 0 && (
        <div className={cluster ? "mt-5 border-t border-corridor-100 pt-5" : "mt-5"}>
          <p className="text-xs font-semibold uppercase tracking-wide text-corridor-700">Сравнение</p>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {crossLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-corridor-700 hover:underline"
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href} className="font-medium text-corridor-700 hover:underline">
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
      )}
    </section>
  );
}
