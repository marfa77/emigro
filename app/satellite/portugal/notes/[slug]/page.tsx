import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentKindBadge, NoteHashtags } from "@/components/satellite/HashtagNav";
import { OfficialLinksPreview } from "@/components/satellite/OfficialLinksPreview";
import { NoteBody } from "@/components/satellite/NoteBody";
import { NoteFaq } from "@/components/satellite/NoteFaq";
import { NoteReadingProgress } from "@/components/satellite/NoteReadingProgress";
import { NoteToc } from "@/components/satellite/NoteToc";
import { RelatedNotes } from "@/components/satellite/RelatedNotes";
import { SatelliteFunnelCta } from "@/components/satellite/SatelliteFunnelCta";
import { Prep2GoPromo } from "@/components/satellite/Prep2GoPromo";
import { PixIDPromo } from "@/components/satellite/PixIDPromo";
import { PortoChatCta } from "@/components/satellite/PortoChatCta";
import {
  buildCommunityNoteLlmDescription,
  buildCommunityNoteLlmFacts,
  buildCommunityNoteMetadata,
  buildCommunityNoteSchemas,
} from "@/lib/community-notes/seo-page";
import { getPublishedCommunityNoteBySlug, getPublishedCommunityNotes } from "@/lib/community-notes/queries";
import { getRelatedNotes } from "@/lib/community-notes/repair-note";
import { shouldShowPixIdPromo, shouldShowPrep2GoPromo } from "@/lib/community-notes/sponsor-promo";
import { revolutPromoProps } from "@/lib/partners/revolut-referral-store";
import { wisePromoProps } from "@/lib/partners/wise-referral-store";
import { RevolutReferralPromo } from "@/components/sponsors/RevolutReferralPromo";
import { WiseReferralPromo } from "@/components/sponsors/WiseReferralPromo";
import { ReferralInlineRoot } from "@/components/sponsors/ReferralInlineRoot";
import { resolveNoteOgImage } from "@/lib/community-notes/note-og-image";
import {
  applyNoteReferralLinks,
  liveUrlsFromTargets,
  referralInlineTargets,
} from "@/lib/partners/referral-inline";
import { PORTUGAL_SATELLITE } from "@/lib/satellite/portugal";
import { satelliteHubUrl, satellitePillarUrl } from "@/lib/satellite/funnel-urls";
import { portugalHubPath } from "@/lib/satellite/paths";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";
import { portugalSatelliteUrl } from "@/lib/site-url";
import { estimateNoteReadMinutes, formatReadTime } from "@/lib/community-notes/read-time";
import { inlineMarkdown } from "@/lib/markdown/inline";
import { heroTitle, NOTE_CONTENT_IMAGE_SIZES, noteContentImageClass, satelliteMain } from "@/lib/ui/mobile";

export const revalidate = 300;

export async function generateStaticParams() {
  const notes = await getPublishedCommunityNotes("portugal");
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const note = await getPublishedCommunityNoteBySlug(params.slug, "portugal");
  if (!note) return {};
  return buildCommunityNoteMetadata(note);
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

function sameCalendarDay(a: string | null, b: string | null): boolean {
  if (!a || !b) return true;
  return new Date(a).toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" }) ===
    new Date(b).toLocaleDateString("en-CA", { timeZone: "Europe/Lisbon" });
}

function formatPlace(city: string): string {
  const names: Record<string, string> = {
    portugal: "Португалия",
    porto: "Порту и Север Португалии",
    lisbon: "Лиссабон",
    braga: "Брага",
    algarve: "Алгарве",
    coimbra: "Коимбра",
    madeira: "Мадейра",
  };
  return names[city.toLowerCase()] ?? "Португалия";
}

export default async function PortugalNotePage({ params }: { params: { slug: string } }) {
  const [note, allNotes, revolutPromo, wisePromo] = await Promise.all([
    getPublishedCommunityNoteBySlug(params.slug, "portugal"),
    getPublishedCommunityNotes("portugal"),
    revolutPromoProps(params.slug, "note"),
    wisePromoProps(params.slug, "note"),
  ]);
  if (!note) notFound();

  const related = getRelatedNotes(note, allNotes, 6);
  const showPrep2Go = shouldShowPrep2GoPromo(note);
  const showPixId = shouldShowPixIdPromo(note);

  const { articleSchema, breadcrumbSchema, faqSchema, speakableSchema } = buildCommunityNoteSchemas(note);
  const llmDescription = buildCommunityNoteLlmDescription(note);
  const llmFacts = buildCommunityNoteLlmFacts(note);
  const llmsUrl = portugalSatelliteUrl("/llms");
  const heroImage = note.content_kind === "guide" ? resolveNoteOgImage(note) : null;
  const showHero = heroImage != null && heroImage !== DEFAULT_OG_IMAGE;
  const readMinutes = estimateNoteReadMinutes(note);
  const showToc = note.content_kind === "guide";
  const inlineTargets = referralInlineTargets({
    revolut: revolutPromo,
    wise: wisePromo,
  });
  const linked = applyNoteReferralLinks(note, inlineTargets);
  const inlineLive = liveUrlsFromTargets(inlineTargets);

  return (
    <main className={satelliteMain}>
      <NoteReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <section className="sr-only" aria-label="AI description" data-llm="facts">
        <p>{llmDescription}</p>
        <ul>
          {llmFacts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <a href={llmsUrl} data-llm="commercial">
          llms.txt
        </a>
      </section>
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href={portugalHubPath()} className="hover:text-teal-700">
          {PORTUGAL_SATELLITE.countryRu}
        </Link>
        <span aria-hidden="true"> › </span>
        <span>{note.category}</span>
      </nav>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">{note.category}</p>
          <ContentKindBadge kind={note.content_kind} />
        </div>
        <h1 className={`mt-2 ${heroTitle} leading-tight text-slate-900`}>{note.title}</h1>
        <p className="mt-2 text-sm text-slate-600">Практический материал · {formatPlace(note.city)}</p>
        {note.published_at && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-slate-200 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-800">Редактор Emigro</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Португалия</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span><time dateTime={note.published_at}>{formatDate(note.published_at)}</time></span>
            {!sameCalendarDay(note.updated_at, note.published_at) && (
              <>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>Обновлено {formatDate(note.updated_at)}</span>
              </>
            )}
            {note.content_kind === "guide" && (
              <>
                <span>{formatReadTime(readMinutes)}</span>
              </>
            )}
          </div>
        )}
      </header>

      {showHero && (
        <figure className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          <Image
            src={heroImage}
            alt=""
            width={1200}
            height={630}
            sizes={NOTE_CONTENT_IMAGE_SIZES}
            className={noteContentImageClass}
            priority
          />
        </figure>
      )}

      <ReferralInlineRoot contentId={note.slug} placement="satellite_note_inline" live={inlineLive}>
      <div className="community-quick-answer mt-7 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-800">Короткий ответ</p>
        <p
          className="mt-2 leading-relaxed text-slate-800 [&_strong]:font-semibold [&_strong]:text-slate-950"
          dangerouslySetInnerHTML={{ __html: inlineMarkdown(linked.quick_answer) }}
        />
      </div>

      <NoteHashtags tags={note.hashtags} className="mt-6" />

      {showToc && <NoteToc sections={note.body_sections} hasFaq={note.faq.length > 0} />}

      <NoteBody sections={linked.body_sections} paragraphs={linked.body_paragraphs} />

      {note.official_links.length > 0 && <OfficialLinksPreview links={note.official_links} />}

      <NoteFaq items={linked.faq} />
      </ReferralInlineRoot>

      <RelatedNotes notes={related} />

      <PortoChatCta source="portugal_satellite_note" noteSlug={note.slug} />

      <SatelliteFunnelCta
        countryKey="portugal"
        placement="satellite_note"
        noteSlug={note.slug}
        noteTitle={note.title}
        contentKind={note.content_kind}
        isInvestmentContent={/invest|golden.?visa/i.test(`${note.slug} ${note.title} ${note.topic_tags.join(" ")}`)}
      />

      {showPrep2Go && <Prep2GoPromo noteSlug={note.slug} />}
      {showPixId && <PixIDPromo noteSlug={note.slug} topicKey="portugal" />}
      {revolutPromo && (
        <RevolutReferralPromo
          placement="satellite_note"
          contentId={note.slug}
          offers={revolutPromo.offers}
          live={revolutPromo.live}
          className="mt-10"
        />
      )}
      {wisePromo && (
        <WiseReferralPromo
          placement="satellite_note"
          contentId={note.slug}
          live={wisePromo.live}
          className="mt-10"
        />
      )}

      <p className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        Редакционный материал Emigro, не индивидуальная юридическая или налоговая консультация. Там, где описана практика,
        она может отличаться от требований ведомства и меняться со временем. Перед действием проверьте первоисточники,
        перечисленные в статье.
      </p>

      <p className="mt-8 text-center">
        <Link href={portugalHubPath()} className="text-sm text-teal-700 underline">
          ← Все заметки
        </Link>
        {" · "}
        <a
          href={satelliteHubUrl({
            countryKey: "portugal",
            placement: "satellite_note",
            content: note.slug,
          })}
          className="text-sm text-teal-700 underline"
        >
          Коридор Португалия на Emigro
        </a>
        {" · "}
        <a
          href={satellitePillarUrl({
            countryKey: "portugal",
            placement: "satellite_note",
            content: note.slug,
          })}
          className="text-sm text-teal-700 underline"
        >
          D8/D7 pillar-гид
        </a>
      </p>
    </main>
  );
}
