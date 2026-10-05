# Lake Como Visual Commerce Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 8–10 vision-approved real photographs, one model-generated fact-checked map, and three tracked ComoStay conversion moments to each of the five English Lake Como guides.

**Architecture:** Keep guide prose in `lib/italy/como-guides.ts`, move image and map metadata into `lib/italy/como-media.ts`, and render it through focused server components. Model-generated maps provide text-free cartographic artwork; exact routes, markers, labels, and accessible descriptions remain structured data rendered as SVG/HTML overlays.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Next Image, Tailwind CSS, Sharp, Wikimedia Commons API, Cursor image generation, existing Emigro analytics.

## Global Constraints

- Each guide contains 8–10 real photographs plus exactly one generated guide map.
- Use ComoStay-owned images, Pexels/Unsplash, or explicitly reusable Wikimedia Commons files only.
- Do not use Google Maps, copied tourism-board imagery, AI destination photographs, or generated text inside map artwork.
- Every source and rendered crop must pass vision review.
- Maps are planning overviews; official GPX, timetable, or operator links remain the navigation authority.
- Exact map labels and routes are structured overlays, not baked into generated images.
- Each guide has early, contextual, and final ComoStay conversion moments.
- UTMs use `utm_source=emigro`, `utm_medium=guide`, `utm_campaign=lake_como_2026`, and placement-specific `utm_content`.
- Preserve unrelated working-tree changes and do not deploy until all checks pass.
- Production completion requires visual verification of the landing page and all five guides on `italy.emigro.online`.

---

### Task 1: Define and test the media contract

**Files:**
- Create: `lib/italy/como-media.ts`
- Create: `scripts/test-italy-como-visual-commerce.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `ComoPhoto`, `ComoMapPoint`, `ComoMapRoute`, `ComoGuideMap`, `ComoGuideMedia`, `COMO_GUIDE_MEDIA`, `getComoGuideMedia(slug)`.
- Consumes: the five slugs exported through `COMO_GUIDES`.

- [ ] **Step 1: Write the failing contract test**

Create `scripts/test-italy-como-visual-commerce.ts`:

```ts
import assert from "node:assert/strict";
import { COMO_GUIDES } from "../lib/italy/como-guides";
import { COMO_GUIDE_MEDIA } from "../lib/italy/como-media";

assert.equal(Object.keys(COMO_GUIDE_MEDIA).length, COMO_GUIDES.length);

for (const guide of COMO_GUIDES) {
  const media = COMO_GUIDE_MEDIA[guide.slug];
  assert.ok(media, `missing media for ${guide.slug}`);
  assert.ok(media.photos.length >= 8 && media.photos.length <= 10, `${guide.slug}: expected 8–10 photos`);
  assert.equal(media.map.points.length >= 4, true, `${guide.slug}: map needs at least four points`);
  assert.equal(media.map.routes.length >= 1, true, `${guide.slug}: map needs a route`);
  assert.match(media.map.officialUrl, /^https:\/\//);

  const srcs = media.photos.map((photo) => photo.src);
  assert.equal(new Set(srcs).size, srcs.length, `${guide.slug}: duplicate photo`);
  const assigned = Object.values(media.sectionPhotos).flat();
  assert.ok(assigned.every((src) => srcs.includes(src)), `${guide.slug}: section references unknown photo`);

  for (const photo of media.photos) {
    assert.match(photo.src, /^\/images\/como\//);
    assert.ok(photo.alt.trim().length >= 20, `${photo.src}: weak alt`);
    assert.ok(photo.caption.trim().length >= 20, `${photo.src}: weak caption`);
    assert.match(photo.creditUrl, /^https:\/\//);
    assert.ok(photo.license.length > 0, `${photo.src}: missing licence`);
    assert.match(photo.licenseUrl, /^https:\/\//);
  }
}

console.log("italy Como visual commerce: OK");
```

- [ ] **Step 2: Add the test command and verify the test fails**

Add to `package.json`:

```json
"italy:test-como-visuals": "tsx scripts/test-italy-como-visual-commerce.ts"
```

Run:

```bash
npm run italy:test-como-visuals
```

Expected: FAIL because `lib/italy/como-media.ts` does not exist.

- [ ] **Step 3: Implement the typed media skeleton**

Create `lib/italy/como-media.ts` with these public types:

```ts
export type ComoPhoto = {
  src: string;
  alt: string;
  caption: string;
  credit: string;
  creditUrl: string;
  license: string;
  licenseUrl: string;
  width: number;
  height: number;
};

export type ComoMapPoint = {
  id: number;
  label: string;
  description: string;
  x: number;
  y: number;
};

export type ComoMapRoute = {
  label: string;
  points: string;
  color: string;
  dashed?: boolean;
};

export type ComoGuideMap = {
  baseSrc: string;
  alt: string;
  caption: string;
  officialLabel: string;
  officialUrl: string;
  points: ComoMapPoint[];
  routes: ComoMapRoute[];
};

export type ComoGuideMedia = {
  photos: ComoPhoto[];
  sectionPhotos: Record<string, string[]>;
  map: ComoGuideMap;
};

export const COMO_GUIDE_MEDIA: Record<string, ComoGuideMedia> = {};

export function getComoGuideMedia(slug: string): ComoGuideMedia | undefined {
  return COMO_GUIDE_MEDIA[slug];
}
```

- [ ] **Step 4: Run static verification**

Run:

```bash
npx tsc --noEmit
```

Expected: PASS. The visual contract test still fails because the record is empty.

- [ ] **Step 5: Commit the contract**

```bash
git add lib/italy/como-media.ts scripts/test-italy-como-visual-commerce.ts package.json
git commit -m "test(italy): define Lake Como media contract"
```

---

### Task 2: Build the licensed image acquisition pipeline

**Files:**
- Create: `scripts/italy-como-media-manifest.ts`
- Create: `scripts/italy-como-download-media.ts`
- Modify: `package.json`
- Create: `public/images/como/editorial/*.webp`

**Interfaces:**
- Produces: local WebP files and exported `COMO_MEDIA_MANIFEST`.
- Consumes: Wikimedia file titles, existing ComoStay images, and existing Pexels hero metadata.

- [ ] **Step 1: Create the explicit source manifest**

Define:

```ts
export type ComoSourceAsset = {
  id: string;
  fileTitle: string;
  output: string;
  expectedLicense: RegExp;
};

export const COMO_MEDIA_MANIFEST: ComoSourceAsset[] = [
  { id: "san-martino", fileTitle: "File:Griante San Martino.JPG", output: "hiking-san-martino.webp", expectedLicense: /CC BY-SA 3\.0/i },
  { id: "monte-grona", fileTitle: "File:Cima del Monte Grona 1.736 m s.l.m, vista da sud con betulle autunnali - 2015-10-25, Plesio (Como).JPG", output: "hiking-monte-grona.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "monte-crocione", fileTitle: "File:Panorama dal Pizzo della Croce (6).jpg", output: "hiking-monte-crocione.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "sacro-monte", fileTitle: "File:Sacro Monte di Ossuccio (Como) 02.jpg", output: "hiking-greenway-ossuccio.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "madesimo-larici", fileTitle: "File:ITA — Lombardia — Provincia di Sondrio — Madesimo — Larici (Talstation) 2020.JPG", output: "madesimo-larici.webp", expectedLicense: /CC BY 3\.0 DE/i },
  { id: "madesimo-piste", fileTitle: "File:Madesimo piste.jpg", output: "madesimo-piste.webp", expectedLicense: /CC BY-SA 3\.0/i },
  { id: "madesimo-groppera", fileTitle: "File:Groppera e Canalone di Madesimo - panoramio.jpg", output: "madesimo-groppera.webp", expectedLicense: /CC BY-SA 3\.0/i },
  { id: "madesimo-motta", fileTitle: "File:Mountain view, Alpe Motta-Madesimo, Italy.jpg", output: "madesimo-alpe-motta.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "madesimo-road", fileTitle: "File:Strada statale 36 del Lago di Como e dello Spluga - panoramio.jpg", output: "madesimo-ss36.webp", expectedLicense: /CC BY 3\.0/i },
  { id: "ferry-lario", fileTitle: "File:Ferry Lario on Lake Como (Cadenabbia) - June 2020.jpg", output: "ferry-cadenabbia-traghetto.webp", expectedLicense: /CC BY 3\.0/i },
  { id: "ferry-triangle", fileTitle: "File:Bellagio and Lake Como from Menaggio-Varenna ferry.jpg", output: "ferry-central-triangle.webp", expectedLicense: /CC BY-SA 3\.0/i },
  { id: "ferry-bellagio", fileTitle: "File:Bellagio - Lario Ferry on Lake Como.jpg", output: "ferry-bellagio-lario.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "villa-carlotta", fileTitle: "File:Villa Carlotta, Tremezzo, Lake Como-2.jpg", output: "attraction-villa-carlotta.webp", expectedLicense: /CC BY 2\.0/i },
  { id: "villa-balbianello", fileTitle: "File:Villa Balbianello.jpg", output: "attraction-balbianello.webp", expectedLicense: /CC BY 2\.0/i },
  { id: "villa-monastero", fileTitle: "File:Villa Monastero Vista sul Lago di Como.jpg", output: "attraction-villa-monastero.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "isola-comacina", fileTitle: "File:Comacina Island View - Como Lake - from Perledo.png", output: "attraction-isola-comacina.webp", expectedLicense: /CC BY-SA 4\.0/i },
  { id: "varenna", fileTitle: "File:Varenna - Coast, hotel Olivedo.jpg", output: "attraction-varenna.webp", expectedLicense: /CC BY-SA 4\.0/i }
];
```

- [ ] **Step 2: Implement Commons resolution, licence validation, and conversion**

In `scripts/italy-como-download-media.ts`:

```ts
const api = new URL("https://commons.wikimedia.org/w/api.php");
api.searchParams.set("action", "query");
api.searchParams.set("format", "json");
api.searchParams.set("prop", "imageinfo");
api.searchParams.set("iiprop", "url|extmetadata|size");
api.searchParams.set("titles", asset.fileTitle);
api.searchParams.set("origin", "*");
```

For every asset:

1. Read `LicenseShortName`, `Artist`, and `CanonicalTitle`.
2. Reject the file unless `expectedLicense` matches.
3. Download the original.
4. Use Sharp with `.rotate().resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 82 })`.
5. Reject output below 1200 px wide or 70 KB.
6. Write a JSON audit report to `scripts/output/italy-como-media-audit.json`.

- [ ] **Step 3: Add and run the download command**

Add:

```json
"italy:download-como-media": "tsx scripts/italy-como-download-media.ts"
```

Run:

```bash
npm run italy:download-como-media
```

Expected: every manifest row logs `OK`, and all WebPs exist under `public/images/como/editorial/`.

- [ ] **Step 4: Vision-review every downloaded image**

Open every output with the image-reading tool. Reject wrong landmarks, unusable crops, watermarks, weak focus, or misleading seasonal context. For any rejected source, use the Commons API search with a subject-specific query and accept only a replacement whose file page shows CC/PD reuse rights.

Record accepted author, source page, and licence values from the audit JSON in `lib/italy/como-media.ts`.

- [ ] **Step 5: Commit the acquisition pipeline and approved assets**

```bash
git add package.json scripts/italy-como-media-manifest.ts scripts/italy-como-download-media.ts scripts/output/italy-como-media-audit.json public/images/como/editorial
git commit -m "feat(italy): add licensed Lake Como editorial media"
```

---

### Task 3: Generate and verify five cartographic bases

**Files:**
- Create: `public/images/como/maps/ferries-base.webp`
- Create: `public/images/como/maps/hiking-base.webp`
- Create: `public/images/como/maps/madesimo-base.webp`
- Create: `public/images/como/maps/transport-base.webp`
- Create: `public/images/como/maps/attractions-base.webp`

**Interfaces:**
- Produces: five text-free 1600×1040 map backgrounds.
- Consumes: the approved map geography and route scope in the design specification.

- [ ] **Step 1: Generate the hiking base through the image model**

Prompt:

```text
Premium editorial topographic map illustration of central Lake Como and Tremezzina, landscape 1600x1040. Accurate recognizable inverted-Y Lake Como shoreline, western shore from Colonno through Ossuccio, Lenno, Tremezzo, Griante and Menaggio, mountain terrain west of the lake extending to Monte Crocione and Monte Grona. Elegant muted alpine palette, contour lines, subtle relief, deep blue water, cream land, clean travel-magazine cartography. No text, no letters, no numbers, no pins, no route lines, no logos, no compass, no decorative fantasy landmarks.
```

Save as `hiking-base.webp`.

- [ ] **Step 2: Generate the ferry and transport bases**

Use the same visual canon. Ferry base covers Como to Colico with extra visual space around Tremezzo–Bellagio–Varenna–Menaggio. Transport base includes the lake, Como rail approach, Varenna rail approach, and west-shore road corridor. Explicitly request no text, pins, routes, or logos.

- [ ] **Step 3: Generate the attractions base**

Cover Tremezzo, Lenno, Ossuccio, Bellagio, Varenna, and Como with accurate shoreline and subtle villa/garden visual language but no named or invented landmark icons.

- [ ] **Step 4: Generate the Madesimo base**

Prompt:

```text
Premium editorial winter route-map background, landscape 1600x1040, geographically coherent corridor from Tremezzo on Lake Como north through Colico and Chiavenna to Campodolcino and Madesimo. Lake terrain transitions into snowy Alpine valley and ski-area relief. Elegant travel-magazine cartography, muted blue, white and warm cream, subtle roads and contours. No text, no letters, no numbers, no pins, no route line, no ski-lift labels, no logos, no fantasy geography.
```

- [ ] **Step 5: Perform the vision geography gate**

Inspect every base. Reject:

- malformed Lake Como shoreline;
- impossible shore ordering;
- duplicated lakes or mountains;
- generated text;
- fake roads or prominent invented structures;
- insufficient contrast for SVG overlays.

Regenerate until all five pass.

- [ ] **Step 6: Commit approved map bases**

```bash
git add public/images/como/maps
git commit -m "feat(italy): add generated Lake Como map artwork"
```

---

### Task 4: Populate exact map overlays and media assignments

**Files:**
- Modify: `lib/italy/como-media.ts`
- Modify: `scripts/test-italy-como-visual-commerce.ts`

**Interfaces:**
- Produces: complete `COMO_GUIDE_MEDIA` entries for all five guide slugs.
- Consumes: approved photos and map bases from Tasks 2–3.

- [ ] **Step 1: Add a normalized map-overlay invariant**

Extend the test:

```ts
for (const point of media.map.points) {
  assert.ok(point.x >= 0 && point.x <= 1000, `${guide.slug}: point x outside viewBox`);
  assert.ok(point.y >= 0 && point.y <= 650, `${guide.slug}: point y outside viewBox`);
  assert.ok(point.description.length >= 30, `${guide.slug}: weak point description`);
}

for (const route of media.map.routes) {
  assert.match(route.points, /^\d+,\d+( \d+,\d+)+$/);
}
```

Run `npm run italy:test-como-visuals`; expected: FAIL on incomplete entries.

- [ ] **Step 2: Populate the hiking map**

Use numbered points for Colonno, Ossuccio/Lenno, Tremezzo/Griante, San Martino, Rifugio Venini, Monte Crocione, Breglia, Rifugio Menaggio, and Monte Grona. Use separate route colours for Greenway, San Martino/Sasso, Crocione, and Grona.

Set the official link to the Regione Lombardia Greenway GPX page:

```ts
officialUrl: "https://edt.in-lombardia.it/en/tours/greenway-lago-di-como"
```

Point descriptions include official time/difficulty and the key hazard; conflicting Greenway ascent figures remain in guide prose.

- [ ] **Step 3: Populate the ferry and transport maps**

Ferry points: Tremezzo, Cadenabbia `Traghetto`, Bellagio, Varenna, Menaggio, Lenno, Como. Use solid routes for passenger services and dashed routes for car-ferry services.

Transport points: Tremezzo passenger pier, Cadenabbia car ferry, C110 stop, Menaggio, Como S. Giovanni, Varenna-Esino, and Como. Link to the live operator hubs, not seasonal PDF URLs.

- [ ] **Step 4: Populate the Madesimo and attractions maps**

Madesimo points: Tremezzo, Colico, Chiavenna, Campodolcino/Sky Express, Madesimo/Larici, Alpe Motta, and unavailable Groppera/Val di Lei. The unavailable zone uses a muted dashed style and explicit description.

Attractions points: Villa Carlotta, Balbianello, Bellagio, Villa Monastero/Varenna, Isola Comacina, Sacro Monte, Como, and the Greenway corridor.

- [ ] **Step 5: Assign 8–10 photos per guide**

Each entry includes:

- one approved subject-specific hero;
- five to seven editorial photos;
- `tulipani-11-balcony.webp` and `tulipani-11-living.webp`;
- a third ComoStay image only when a verified owned file is available;
- exact credit and licence metadata.

Populate `sectionPhotos` with exact guide section headings as keys and approved local `src` values as arrays. Assign each non-property editorial image to one section.

Do not count the generated map as a real photograph.

- [ ] **Step 6: Run the media contract**

```bash
npm run italy:test-como-visuals
```

Expected: `italy Como visual commerce: OK`.

- [ ] **Step 7: Commit the completed media registry**

```bash
git add lib/italy/como-media.ts scripts/test-italy-como-visual-commerce.ts
git commit -m "feat(italy): map Lake Como guide media"
```

---

### Task 5: Render accessible photos and generated maps

**Files:**
- Create: `components/satellite/ComoGuidePhoto.tsx`
- Create: `components/satellite/ComoGuideMap.tsx`
- Modify: `app/satellite/italy/en/guides/[slug]/page.tsx`

**Interfaces:**
- `ComoGuidePhoto({ photo, priority?, variant? })`.
- `ComoGuideMap({ map })`.
- Consumes: `getComoGuideMedia(guide.slug)`.

- [ ] **Step 1: Add a render smoke test**

Extend `scripts/test-italy-como-visual-commerce.ts` to read the two component source files and assert that the map renderer contains `<svg`, `<polyline`, a numbered list, and the official link. Run the test and expect failure because the components do not exist.

- [ ] **Step 2: Implement `ComoGuidePhoto`**

The component renders:

```tsx
<figure className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
  <Image
    src={photo.src}
    alt={photo.alt}
    width={photo.width}
    height={photo.height}
    sizes="(min-width: 768px) 736px, calc(100vw - 32px)"
    className="h-auto w-full object-cover"
    priority={priority}
  />
  <figcaption className="px-4 py-3 text-xs leading-relaxed text-slate-600">
    {photo.caption} Photo:{" "}
    <a href={photo.creditUrl} rel="noopener noreferrer" target="_blank" className="underline">
      {photo.credit}
    </a>{" "}
    · <a href={photo.licenseUrl} rel="noopener noreferrer" target="_blank" className="underline">{photo.license}</a>
  </figcaption>
</figure>
```

- [ ] **Step 3: Implement `ComoGuideMap`**

Render the base with Next Image and an absolutely positioned SVG using `viewBox="0 0 1000 650"`. Render every route as a polyline and every point as a numbered circle. Follow with an ordered HTML list of matching labels/descriptions and a visible official-map link.

The overlay itself is `aria-hidden="true"`; the HTML list carries the accessible meaning.

- [ ] **Step 4: Wire media into the guide page**

In `page.tsx`:

```ts
const media = getComoGuideMedia(guide.slug);
if (!media) notFound();
```

Use `media.photos[0]` as the hero and Open Graph image. Insert the map after the quick answer. Distribute the remaining photos after matching sections through an explicit section-to-photo assignment in the media registry rather than array-index guessing.

- [ ] **Step 5: Verify rendering and types**

Run:

```bash
npm run italy:test-como-visuals
npx tsc --noEmit
```

Expected: both PASS.

- [ ] **Step 6: Commit the render layer**

```bash
git add components/satellite/ComoGuidePhoto.tsx components/satellite/ComoGuideMap.tsx app/satellite/italy/en/guides/[slug]/page.tsx
git commit -m "feat(italy): render Lake Como maps and galleries"
```

---

### Task 6: Add tracked, placement-specific ComoStay conversion

**Files:**
- Create: `components/satellite/ComoStayLink.tsx`
- Modify: `lib/analytics/events.ts`
- Modify: `lib/italy/como-guides.ts`
- Modify: `app/satellite/italy/en/guides/[slug]/page.tsx`
- Modify: `scripts/test-italy-como-visual-commerce.ts`

**Interfaces:**
- Produces: `ComoStayLink({ href, guideSlug, placement, destination, children, className })`.
- Emits: `como_stay_click`.

- [ ] **Step 1: Add the failing analytics assertions**

Assert that `lib/analytics/events.ts` contains `"como_stay_click"` and that every generated ComoStay URL includes all four UTM keys with placement-specific `utm_content`.

- [ ] **Step 2: Add the typed event**

Add:

```ts
| "como_stay_click"
```

to `EmigroEventName`.

- [ ] **Step 3: Implement the client link**

Create a `"use client"` component that calls:

```ts
trackEvent("como_stay_click", {
  guide_slug: guideSlug,
  placement,
  destination
});
```

on click, then behaves as a normal sponsored external anchor.

- [ ] **Step 4: Generate placement-specific URLs**

Replace static constants with:

```ts
export function comoStayUrl(
  guideSlug: string,
  placement: "early" | "context" | "final" | "property-image",
  destination: "tulipani" | "inventory"
): string
```

Use `URL` and `searchParams` to set the required UTMs. `utm_content` is `${guideSlug}-${placement}-${destination}`.

- [ ] **Step 5: Place three native commercial moments**

Keep:

1. early featured stay after quick answer/map;
2. one context-specific stay section tied to the guide’s trip logic;
3. final Tulipani plus full-inventory CTA.

Wrap clickable property images with `placement="property-image"`. Remove duplicate untracked raw ComoStay anchors.

- [ ] **Step 6: Run analytics and type checks**

```bash
npm run italy:test-como-visuals
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 7: Commit conversion tracking**

```bash
git add components/satellite/ComoStayLink.tsx lib/analytics/events.ts lib/italy/como-guides.ts app/satellite/italy/en/guides/[slug]/page.tsx scripts/test-italy-como-visual-commerce.ts
git commit -m "feat(italy): track ComoStay guide conversion"
```

---

### Task 7: Upgrade the English landing page visual merchandising

**Files:**
- Modify: `app/satellite/italy/en/page.tsx`
- Modify: `lib/italy/como-media.ts`

**Interfaces:**
- Consumes: each guide’s approved hero and `ComoStayLink`.
- Produces: visually consistent guide cards and tracked accommodation CTAs.

- [ ] **Step 1: Add landing-page assertions**

Extend the smoke test to assert that the landing page imports `getComoGuideMedia` and does not hardcode the five old hero paths.

- [ ] **Step 2: Render approved heroes**

For each guide card, resolve `getComoGuideMedia(guide.slug)?.photos[0]`, use descriptive alt text and responsive `sizes`, and keep the existing editorial excerpt.

- [ ] **Step 3: Track landing accommodation links**

Use `ComoStayLink` with a landing-specific guide slug value `lake-como-hub` and `early`/`final` placements.

- [ ] **Step 4: Verify**

Run:

```bash
npm run italy:test-como-visuals
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: Commit landing changes**

```bash
git add app/satellite/italy/en/page.tsx lib/italy/como-media.ts scripts/test-italy-como-visual-commerce.ts
git commit -m "feat(italy): merchandise Lake Como guides visually"
```

---

### Task 8: Full visual, SEO, performance, and production verification

**Files:**
- Modify only if verification finds a defect.

**Interfaces:**
- Consumes: completed guide and landing implementation.
- Produces: verified production release.

- [ ] **Step 1: Run the complete local gate**

```bash
npm run italy:test-como-visuals
npx tsc --noEmit
npm run check:aeo
npm run satellite:assert-launch -- --country=italy --city=milan
npm run deploy:check
```

Expected: every command exits 0.

- [ ] **Step 2: Run local browser verification**

Open:

- `/en`
- `/en/guides/lake-como-ferry-guide-timetables`
- `/en/guides/lake-como-hiking-best-trails`
- `/en/guides/madesimo-ski-trip-from-lake-como`
- `/en/guides/lake-como-yellow-pages-transport-services`
- `/en/guides/best-things-to-do-lake-como-tremezzo`

At desktop and mobile widths, verify:

- all images load and crop correctly;
- map numbers match descriptions;
- no generated text appears in map bases;
- overlays remain legible;
- captions and licences are visible;
- below-fold media lazy-loads;
- every CTA opens the correct ComoStay target with exact UTMs.

- [ ] **Step 3: Run a final vision review**

Capture each full page and inspect every rendered image and map. Replace or recrop any generic, misleading, low-quality, or poorly aligned asset before shipping.

- [ ] **Step 4: Commit verification fixes**

If fixes were needed:

```bash
git add app/satellite/italy/en/page.tsx app/satellite/italy/en/guides/\[slug\]/page.tsx components/satellite/ComoGuidePhoto.tsx components/satellite/ComoGuideMap.tsx components/satellite/ComoStayLink.tsx lib/italy/como-guides.ts lib/italy/como-media.ts public/images/como
git commit -m "fix(italy): polish Lake Como visual guides"
```

- [ ] **Step 5: Push exactly once**

```bash
git push origin main
```

Do not run a CLI production deploy for the same commit.

- [ ] **Step 6: Wait for Git-triggered Production Ready**

```bash
npm run deploy:status
```

Expected: the newest Production deployment is `Ready`.

- [ ] **Step 7: Verify every public URL**

Open the six public URLs on `https://italy.emigro.online`. Confirm the deployed title, maps, all image groups, credits, and ComoStay CTAs are actually live. Test representative Tulipani and inventory links and confirm their UTMs.

- [ ] **Step 8: Report completion**

Report the commit hash, checks, six verified URLs, image count per guide, and any source that was rejected during vision review.
