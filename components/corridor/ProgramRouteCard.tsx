import Link from "next/link";
import Image from "next/image";
import { ProgramTypeBadge } from "@/components/visuals/ProgramTypeBadge";
import { getProgramCardImage } from "@/lib/corridor/program-images";

type Props = {
  slug: string;
  programType: string;
  title: string;
  summary: string;
  href?: string;
  countrySegment?: string;
  interactive?: boolean;
};

function CardBody({
  slug,
  programType,
  title,
  summary,
  countrySegment,
}: Omit<Props, "href" | "interactive">) {
  const imageSrc = getProgramCardImage(slug, countrySegment);

  return (
    <>
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" aria-hidden />
      </div>
      <div className="p-5">
        <ProgramTypeBadge type={programType} />
        <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{summary}</p>
      </div>
    </>
  );
}

export function ProgramRouteCard({
  slug,
  programType,
  title,
  summary,
  href,
  countrySegment,
  interactive = true,
}: Props) {
  const className = interactive
    ? "group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-corridor-500 hover:shadow-md"
    : "overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50 opacity-90";

  const body = (
    <CardBody
      slug={slug}
      programType={programType}
      title={title}
      summary={summary}
      countrySegment={countrySegment}
    />
  );

  if (interactive && href) {
    return (
      <Link href={href} className={className}>
        {body}
      </Link>
    );
  }

  return <div className={className}>{body}</div>;
}
