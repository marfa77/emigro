/**
 * CLI report: guides grouped by review tier.
 *
 *   npm run guides:review-tiers
 *   npm run guides:review-tiers -- --tier=volatile
 *   npm run guides:review-tiers -- --json
 */
import { listGuides } from "@/lib/guides/load";
import {
  getFactcheckCadence,
  getGuideReviewTier,
  listEvergreenGuides,
  listVolatileGuides,
  type GuideReviewTier,
} from "@/lib/guides/review-tiers";

function parseArgs() {
  const args = process.argv.slice(2);
  let tier: GuideReviewTier | undefined;
  let json = false;

  for (const arg of args) {
    if (arg.startsWith("--tier=")) {
      const value = arg.slice(7);
      if (value === "volatile" || value === "evergreen") tier = value;
    } else if (arg === "--json") {
      json = true;
    }
  }

  return { tier, json };
}

function main() {
  const { tier, json } = parseArgs();
  const guides = listGuides();
  const volatile = listVolatileGuides(guides);
  const evergreen = listEvergreenGuides(guides);

  const filtered =
    tier === "volatile" ? volatile : tier === "evergreen" ? evergreen : guides;

  if (json) {
    console.log(
      JSON.stringify(
        {
          total: guides.length,
          volatile: volatile.length,
          evergreen: evergreen.length,
          guides: filtered.map((g) => ({
            slug: g.slug,
            title: g.title,
            review_tier: g.review_tier,
            factcheck_cadence: g.factcheck_cadence,
          })),
        },
        null,
        2
      )
    );
    return;
  }

  console.log("Guide review tiers");
  console.log(`  total: ${guides.length}`);
  console.log(`  volatile (quarterly): ${volatile.length}`);
  console.log(`  evergreen (annual/on-report): ${evergreen.length}`);
  console.log("");

  const byTier: Record<GuideReviewTier, typeof guides> = {
    volatile: [],
    evergreen: [],
  };

  for (const guide of filtered) {
    byTier[getGuideReviewTier(guide.slug, guide.review_tier)].push(guide);
  }

  for (const tierId of ["volatile", "evergreen"] as const) {
    const items = byTier[tierId];
    if (items.length === 0) continue;
    console.log(`## ${tierId} (${items.length})`);
    for (const guide of items) {
      const cadence = getFactcheckCadence(guide.slug, guide.review_tier);
      console.log(`- ${guide.slug}`);
      console.log(`  ${guide.title}`);
      console.log(`  cadence: ${cadence}`);
    }
    console.log("");
  }
}

main();
