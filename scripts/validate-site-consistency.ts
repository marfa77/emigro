/**
 * Static site consistency checks (no DB) — safe for CI.
 * Usage: npm run validate:site-consistency
 */
import {
  ACTIVE_CORRIDOR_SLUGS,
  CORRIDOR_SLUG_TO_SEGMENT,
  ISO2_TO_SEGMENT,
  corridorLandingPath,
  corridorSlugToSegment,
  corridorWizardPath,
} from "../lib/corridor/paths";
import { getAllProviders, PREP2GO_TOPIC_KEYS } from "../lib/providers/registry";

/** Keep in sync with COUNTRY_OPTIONS in app/ru/assist/page.tsx */
const ASSIST_CORRIDOR_SLUGS = [
  "ru-speaking-to-portugal",
  "ru-speaking-to-spain",
  "ru-speaking-to-france",
  "ru-speaking-to-italy",
  "ru-speaking-to-germany",
  "ru-speaking-to-netherlands",
  "ru-speaking-to-scandinavia",
  "ru-speaking-to-poland",
  "ru-speaking-to-czechia",
  "ru-speaking-to-austria",
] as const;

const NEWS_ONLY_TOPIC_KEYS = new Set([
  "serbia",
  "armenia",
  "uae",
  "thailand",
  "georgia",
  "turkey",
  "montenegro",
  "kazakhstan",
]);

const REQUIRED_DESTINATION_ISO2 = ["PT", "ES", "FR", "IT", "DE", "NL", "SE", "DK", "PL", "CZ", "AT"];

function fail(message: string): never {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

for (const slug of ACTIVE_CORRIDOR_SLUGS) {
  const segment = corridorSlugToSegment(slug);
  if (!segment) fail(`No URL segment for active corridor ${slug}`);
  if (corridorLandingPath(slug) !== `/ru/${segment}`) {
    fail(`Landing path mismatch for ${slug}`);
  }
  if (corridorWizardPath(slug) !== `/ru/${segment}/wizard`) {
    fail(`Wizard path mismatch for ${slug}`);
  }
}

const assistSet = new Set<string>(ASSIST_CORRIDOR_SLUGS);
const activeSet = new Set<string>(ACTIVE_CORRIDOR_SLUGS);

for (const slug of ACTIVE_CORRIDOR_SLUGS) {
  if (!assistSet.has(slug)) fail(`Assist page missing active corridor ${slug}`);
}
for (const slug of ASSIST_CORRIDOR_SLUGS) {
  if (!activeSet.has(slug)) fail(`Assist page lists unknown corridor ${slug}`);
}

const validTopicKeys = new Set([...Object.values(CORRIDOR_SLUG_TO_SEGMENT), ...NEWS_ONLY_TOPIC_KEYS]);
const prep2goTopics = new Set<string>(PREP2GO_TOPIC_KEYS);

for (const provider of getAllProviders()) {
  for (const slug of provider.corridorSlugs ?? []) {
    if (!corridorSlugToSegment(slug)) {
      fail(`Provider ${provider.id}: unknown corridor slug ${slug}`);
    }
  }
  for (const key of provider.topicKeys ?? []) {
    if (!validTopicKeys.has(key)) {
      fail(`Provider ${provider.id}: unknown topic key ${key}`);
    }
  }
  for (const exam of provider.examsRu ?? []) {
    if (!prep2goTopics.has(exam.topicKey)) {
      fail(`Provider ${provider.id}: exam topicKey ${exam.topicKey} not in PREP2GO_TOPIC_KEYS`);
    }
  }
}

for (const iso2 of REQUIRED_DESTINATION_ISO2) {
  if (!ISO2_TO_SEGMENT[iso2]) fail(`ISO2_TO_SEGMENT missing ${iso2}`);
}

console.log("Site consistency: OK");
console.log(`  active corridors: ${ACTIVE_CORRIDOR_SLUGS.length}`);
console.log(`  assist corridors: ${ASSIST_CORRIDOR_SLUGS.length}`);
console.log(`  providers: ${getAllProviders().length}`);
