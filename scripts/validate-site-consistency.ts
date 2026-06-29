/**
 * Static site consistency checks (no DB) — safe for CI.
 * Usage: npm run validate:site-consistency
 */
import {
  ACTIVE_CORRIDOR_SLUGS,
  ASSIST_CORRIDOR_SLUGS,
  CORRIDOR_REGISTRY,
  CORRIDOR_SLUG_TO_SEGMENT,
  ISO2_TO_SEGMENT,
  getAssistCountryOptions,
} from "../lib/corridor/registry";
import {
  corridorLandingPath,
  corridorSlugToSegment,
  corridorWizardPath,
} from "../lib/corridor/paths";
import { getAllProviders, PREP2GO_TOPIC_KEYS } from "../lib/providers/registry";

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

const segmentSet = new Set<string>();
for (const entry of CORRIDOR_REGISTRY) {
  if (!entry.active) continue;
  if (segmentSet.has(entry.segment)) {
    fail(`Duplicate registry segment: ${entry.segment}`);
  }
  segmentSet.add(entry.segment);
  if (CORRIDOR_SLUG_TO_SEGMENT[entry.slug] !== entry.segment) {
    fail(`CORRIDOR_SLUG_TO_SEGMENT drift for ${entry.slug}`);
  }
  for (const iso2 of entry.destinationIso2) {
    if (ISO2_TO_SEGMENT[iso2] !== entry.segment) {
      fail(`ISO2_TO_SEGMENT drift: ${iso2} should map to ${entry.segment}`);
    }
  }
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

const assistOptions = getAssistCountryOptions();
if (assistOptions.length !== ASSIST_CORRIDOR_SLUGS.length) {
  fail("getAssistCountryOptions() count mismatch with ASSIST_CORRIDOR_SLUGS");
}
for (const opt of assistOptions) {
  if (!assistSet.has(opt.corridorSlug)) {
    fail(`Assist option references unknown corridor ${opt.corridorSlug}`);
  }
  if (corridorSlugToSegment(opt.corridorSlug) !== opt.value) {
    fail(`Assist option segment mismatch for ${opt.corridorSlug}`);
  }
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
