# Lake Como visual commerce design

## Goal

Turn the five English Lake Como guides into image-rich editorial pages that help travellers plan a real trip and convert qualified readers to Apartment Tulipani 11 or another ComoStay property.

The target is 8–10 useful, real photographs per guide. Images must explain the adjacent section, identify the actual place or transport mode, and avoid generic destination filler.

## Scope

The release covers:

- Lake Como ferries and timetables
- Lake Como hiking
- Madesimo skiing from Lake Como
- Lake Como transport and yellow pages
- Lake Como attractions
- The English Lake Como landing page where guide cards and accommodation promotion reuse this media

## Image sources and rights

Use only:

1. ComoStay-owned property photography.
2. Pexels or Unsplash photographs with a recorded source URL and creator credit.
3. Wikimedia Commons files whose file page explicitly permits reuse. Store author, source URL, and exact licence.

Do not use images copied from tourism boards, booking platforms, blogs, social media, Google Images, or attraction websites unless written reuse permission is available. Do not use AI-generated destination photographs.

Download and commit local WebP derivatives. Keep source and licence metadata in the guide data so every visible image has an accurate caption and credit.

## Editorial image plan

Each guide receives:

- one location-specific hero;
- one model-generated editorial map with verified routes and numbered points;
- five to seven section images tied to the adjacent route, attraction, station, pier, slope, or service;
- two or three ComoStay images placed only where the accommodation solves the planning problem;
- no duplicated editorial image within the same guide.

### Ferries

Show a Tremezzo or Cadenabbia pier, a passenger boat, a `Traghetto` car ferry, the central-lake triangle, and a pier or timetable-reading detail. The existing ferry hero may remain if it passes the final crop review.

### Hiking

Replace the current generic mountain hero. Show the Greenway, San Martino, Monte Crocione, Rifugio Menaggio or Monte Grona, and a real family-walk context. Captions identify the precise route and do not imply that one mountain is another.

### Madesimo

Replace the current snowmobile hero. Show Madesimo pistes, lift infrastructure, Alpe Motta or Larici, the village or approach road, and genuine skiing. Closed Groppera or Val di Lei infrastructure must not be presented as currently available.

### Transport and yellow pages

Show the Tremezzo/Cadenabbia transport context, C110 bus or stop, Varenna-Esino or Como rail context, passenger ferry versus car ferry, and useful wayfinding. Decorative town views cannot substitute for the service being explained.

### Attractions

Replace the weak generic hero crop. Show Villa Carlotta, Villa del Balbianello, Bellagio, Villa Monastero or Varenna, Isola Comacina or Sacro Monte, and the Greenway. Each image is paired with current opening or booking guidance in the surrounding copy.

## Generated guide maps

Create five original maps through the image model, following the established Portugal visual approach. These are editorial planning maps, not Google Maps embeds and not turn-by-turn navigation.

The image model generates a clean, premium cartographic base with Lake Como geography, terrain, water, roads or trail texture, and visual landmarks. Exact labels, route lines, numbered markers, distances, and the legend are overlaid programmatically after generation. This prevents malformed model text and makes factual corrections possible without regenerating the whole artwork.

Each map has a visible note that it is a planning overview and links to the relevant official live map, GPX, timetable, or operator.

### Hiking map

Show the real route geometry or verified route corridor for:

1. Greenway del Lago di Como, Colonno to Griante;
2. Tremezzo/Griante to San Martino, with the Sasso extension distinguished;
3. Rifugio Venini to Monte Crocione;
4. Breglia to Rifugio Menaggio and Monte Grona;
5. the recommended family option.

Numbered points identify trailheads, transport access, refuge or summit, route difficulty, approximate official time, and the most important hazard. Where an official GPX is available, use it to shape the route line. Conflicting official distances or ascent values stay in the guide copy rather than being silently resolved by the illustration.

### Ferry map

Show Tremezzo, Cadenabbia, Bellagio, Varenna, Menaggio, Lenno, and Como. Passenger routes and `Traghetto` car-ferry routes use different line styles. The legend explains that schedules are seasonal and links to Navigazione Laghi.

### Madesimo map

Show the Tremezzo–Colico–Chiavenna–Campodolcino–Madesimo travel spine, the Sky Express access point, principal ski-area zones, and the closed Groppera/Val di Lei infrastructure as unavailable rather than active.

### Transport and yellow-pages map

Show ferry piers, C110 bus spine, Como S. Giovanni, Varenna-Esino, Menaggio, key taxi or emergency context, and the distinction between Tremezzo passenger pier and Cadenabbia `Traghetto`.

### Attractions map

Show Tremezzo as the base and numbered points for Villa Carlotta, Balbianello, Bellagio, Varenna/Villa Monastero, Isola Comacina, Sacro Monte di Ossuccio, Como, and the Greenway corridor.

### Map quality gate

Reject or correct any map with:

- a distorted Lake Como shoreline that changes route relationships;
- a landmark on the wrong shore or in the wrong order;
- invented roads, trails, ferry links, stations, or ski lifts;
- generated text baked into the image;
- illegible route contrast or marker collisions;
- missing attribution for any geographic source used to verify the overlay.

Every final map is reviewed through vision at desktop and mobile sizes. Point numbers and legend descriptions must match the article one-to-one.

## Vision quality gate

Every candidate is inspected before inclusion and rejected if any condition fails:

- the subject matches the claimed place, route, attraction, or transport mode;
- resolution is sufficient for a 1200 px desktop presentation;
- focus, exposure, colour, horizon, and crop are acceptable;
- no visible watermark, embedded promotional text, malformed panorama, or obvious manipulation;
- no misleading season, unsafe behaviour, or obsolete infrastructure claim;
- people are incidental unless the licence and composition are clearly suitable;
- the image adds information or desire instead of repeating another view.

After implementation, inspect every guide at desktop and mobile widths. Confirm faces, landmarks, captions, credits, lazy-loaded images, and crops visually in the rendered page.

## Page presentation

Keep the existing article layout and add a reusable editorial image component:

- full-width landscape image for major sections;
- optional two-image grid when comparison is useful;
- full-width map figure followed by an accessible numbered point list;
- 4:3 crop on cards and natural editorial ratio in the article;
- caption with place, practical context, creator, source, and licence;
- `sizes`, responsive Next Image output, and lazy loading below the fold;
- hero remains priority-loaded and is the Open Graph image.

No carousel is required. Images should remain visible in the reading flow and accessible without interaction.

## ComoStay conversion design

Commercial placement is native and limited to three moments:

1. An early featured-stay block after the quick answer.
2. A context-specific property block inside the planning section.
3. A final stay-planning CTA.

Tulipani 11 photography should include the balcony/view, living room, and one additional high-quality room or amenity image when available. Copy links the property to the guide’s actual trip:

- ferries: central-lake base and access to Tremezzo/Cadenabbia;
- hiking: Greenway access, washing machine, kitchen, and recovery space;
- skiing: warm multi-night lake base, while warning that repeated ski days favour an overnight near Madesimo;
- transport: accountable local host and practical arrival support;
- attractions: Tremezzo base for Villa Carlotta, Greenway, Lenno, Bellagio, and Varenna.

The final CTA offers both Tulipani 11 and the complete ComoStay inventory. Avoid fake scarcity, unverified walking times, and hardcoded prices.

Use consistent UTMs:

- `utm_source=emigro`
- `utm_medium=guide`
- `utm_campaign=lake_como_2026`
- `utm_content=<guide-slug>-<placement>`

Track Tulipani clicks, inventory clicks, and property-image clicks through the existing analytics event layer.

## Data model

Extend the guide image record with:

- local `src`;
- descriptive `alt`;
- editorial `caption`;
- creator or owner;
- source page URL;
- licence name and licence URL;
- optional `position` or display variant.

Keep this metadata in `lib/italy/como-guides.ts` or a focused adjacent media module if the guide file becomes difficult to maintain. Rendering remains generic across all five guides.

## Performance and accessibility

- Store appropriately sized WebP files rather than full-resolution originals.
- Target roughly 120–350 KB per editorial image unless detail requires more.
- Provide accurate alt text; decorative repetition uses an empty alt.
- Keep captions readable and links keyboard accessible.
- Reserve dimensions to avoid layout shift.
- Lazy-load all below-fold images.
- Ensure a guide does not download all 8–10 full-resolution assets before scrolling.

## Verification

Before shipping:

1. Verify source licences and credits for every file.
2. Run a vision review on every source and rendered crop.
3. Run TypeScript, build/deploy checks, AEO checks, and the Italy satellite launch assertion.
4. Test all ComoStay URLs and UTM values.
5. Confirm analytics events in the rendered markup or browser.
6. After the Git-triggered production deployment is ready, open the landing page and all five guide URLs on `italy.emigro.online`.
7. Visually confirm desktop and mobile crops, image loading, captions, and CTA destinations on production.

## Acceptance criteria

- Every guide contains 8–10 approved real photographs.
- Every guide contains one model-generated, fact-checked map with numbered points and descriptions.
- The hiking map shows verified trail corridors and links to official maps or GPX where available.
- The four weak or misleading existing images are replaced.
- Every external image has explicit reusable rights and visible credit.
- Each guide contains three non-spammy, context-specific ComoStay conversion moments.
- Tulipani 11 and full-inventory destinations carry placement-specific UTMs.
- No broken images, misleading landmarks, layout shifts, or inaccessible captions remain.
- Production verification is completed on all six changed public surfaces.
