import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { COMO_GUIDES, COMO_STAY_OFFER, comoStayUrl } from "../lib/italy/como-guides";
import { COMO_EDITORIAL_ASSETS, COMO_GUIDE_MEDIA } from "../lib/italy/como-media";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PROPERTY_SRCS = new Set([
  "/images/como/tulipani-11-balcony.webp",
  "/images/como/tulipani-11-living.webp",
]);
const ALLOWED_CREDIT_HOSTS = new Set([
  "commons.wikimedia.org",
  "www.pexels.com",
  "pexels.com",
  "unsplash.com",
  "www.unsplash.com",
  "comostay.net",
]);
const MAP_BASES: Record<string, string> = {
  "lake-como-hiking-best-trails": "/images/como/maps/hiking-base.webp",
  "lake-como-ferry-guide-timetables": "/images/como/maps/ferries-base.webp",
  "lake-como-yellow-pages-transport-services": "/images/como/maps/transport-base.webp",
  "madesimo-ski-trip-from-lake-como": "/images/como/maps/madesimo-base.webp",
  "best-things-to-do-lake-como-tremezzo": "/images/como/maps/attractions-base.webp",
};

function hostOf(url: string): string {
  return new URL(url).host;
}

async function main() {
for (const placement of ["early", "context", "final", "property-image"] as const) {
  for (const destination of ["tulipani", "inventory"] as const) {
    const url = new URL(comoStayUrl("test-guide", placement, destination));
    assert.equal(url.searchParams.get("utm_source"), "emigro");
    assert.equal(url.searchParams.get("utm_medium"), "guide");
    assert.equal(url.searchParams.get("utm_campaign"), "lake_como_2026");
    assert.equal(url.searchParams.get("utm_content"), `test-guide-${placement}-${destination}`);
    assert.equal(url.searchParams.get("coupon"), "EMIGRO5");
    assert.equal(
      url.pathname,
      destination === "tulipani" ? "/en/apartment-tulipani-11---tremezzo" : "/",
    );
  }
}
assert.equal(COMO_STAY_OFFER.percent, 5);
assert.equal(COMO_STAY_OFFER.code, "EMIGRO5");
assert.match(
  fs.readFileSync(path.join(root, "lib/analytics/events.ts"), "utf8"),
  /"como_stay_click"/,
  "ComoStay analytics event must be registered",
);
assert.match(
  fs.readFileSync(path.join(root, "app/api/v1/events/route.ts"), "utf8"),
  /"como_stay_click"/,
  "ComoStay click must be allowed by /api/v1/events",
);
assert.match(
  fs.readFileSync(path.join(root, "app/api/v1/events/route.ts"), "utf8"),
  /notifyComoStayClick/,
  "ComoStay click must notify owner Telegram DM",
);
assert.match(
  fs.readFileSync(path.join(root, "lib/italy/format-telegram.ts"), "utf8"),
  /ComoStay — клик/,
  "ComoStay Telegram copy must exist",
);

assert.deepEqual(
  Object.keys(COMO_GUIDE_MEDIA).sort(),
  COMO_GUIDES.map((guide) => guide.slug).sort(),
  "guide media slugs must match COMO_GUIDES exactly",
);

for (const guide of COMO_GUIDES) {
  const media = COMO_GUIDE_MEDIA[guide.slug];
  assert.ok(media, `missing media for ${guide.slug}`);
  assert.ok(media.photos.length >= 8 && media.photos.length <= 10, `${guide.slug}: expected 8–10 photos`);
  assert.equal(media.map.points.length >= 4, true, `${guide.slug}: map needs at least four points`);
  assert.equal(media.map.routes.length >= 1, true, `${guide.slug}: map needs a route`);
  assert.match(media.map.officialUrl, /^https:\/\//);
  assert.doesNotMatch(media.map.officialUrl, /\.pdf($|\?)/i, `${guide.slug}: official link must be a live hub`);
  assert.equal(media.map.baseSrc, MAP_BASES[guide.slug], `${guide.slug}: unexpected map base`);
  assert.ok(fs.existsSync(path.join(root, "public", media.map.baseSrc)), `${guide.slug}: missing map base`);
  assert.ok(media.map.alt.trim().length >= 20, `${guide.slug}: weak map alt`);
  assert.ok(media.map.caption.trim().length >= 30, `${guide.slug}: weak map caption`);
  assert.ok(media.map.officialLabel.trim().length >= 8, `${guide.slug}: weak official label`);
  assert.match(media.map.caption, /planning overview/i, `${guide.slug}: map caption must say it is a planning overview`);

  const srcs = media.photos.map((photo) => photo.src);
  assert.equal(new Set(srcs).size, srcs.length, `${guide.slug}: duplicate photo`);
  assert.ok(media.photos.every((photo) => !photo.src.includes("/maps/")), `${guide.slug}: map art counted as a photo`);
  assert.ok(srcs.includes("/images/como/tulipani-11-balcony.webp"), `${guide.slug}: missing balcony photo`);
  assert.ok(srcs.includes("/images/como/tulipani-11-living.webp"), `${guide.slug}: missing living-room photo`);

  const headings = new Set(guide.sections.map((section) => section.heading));
  const sectionEntries = Object.entries(media.sectionPhotos);
  assert.ok(sectionEntries.length > 0, `${guide.slug}: empty sectionPhotos`);
  const assigned = sectionEntries.flatMap(([, photos]) => photos);
  assert.ok(assigned.every((src) => srcs.includes(src)), `${guide.slug}: section references unknown photo`);
  for (const [heading, photos] of sectionEntries) {
    assert.ok(headings.has(heading), `${guide.slug}: sectionPhotos key is not a guide heading: ${heading}`);
    assert.ok(photos.length > 0, `${guide.slug}: empty photos for ${heading}`);
  }
  for (const src of srcs.filter((item) => !PROPERTY_SRCS.has(item))) {
    assert.equal(assigned.filter((item) => item === src).length, 1, `${guide.slug}: editorial photo not assigned once: ${src}`);
  }

  for (const photo of media.photos) {
    assert.match(photo.src, /^\/images\/como\//);
    assert.ok(photo.alt.trim().length >= 20, `${photo.src}: weak alt`);
    assert.ok(photo.caption.trim().length >= 20, `${photo.src}: weak caption`);
    assert.ok(photo.credit.trim().length > 0, `${photo.src}: missing credit`);
    assert.match(photo.creditUrl, /^https:\/\//);
    assert.ok(ALLOWED_CREDIT_HOSTS.has(hostOf(photo.creditUrl)), `${photo.src}: credit host not allowed`);
    assert.ok(photo.license.length > 0, `${photo.src}: missing licence`);
    assert.doesNotMatch(photo.license, /NC|ND|non-commercial|no-derivatives|fair use/i, `${photo.src}: disallowed licence`);
    assert.match(photo.licenseUrl, /^https:\/\//);
    assert.ok(photo.width >= 1200, `${photo.src}: width below 1200`);
    assert.ok(photo.height > 0, `${photo.src}: missing height`);
    const file = path.join(root, "public", photo.src);
    assert.ok(fs.existsSync(file), `${photo.src}: file missing`);
    const meta = await sharp(file).metadata();
    assert.equal(meta.width, photo.width, `${photo.src}: width mismatch`);
    assert.equal(meta.height, photo.height, `${photo.src}: height mismatch`);

    if (PROPERTY_SRCS.has(photo.src)) {
      for (const [urlString, destination] of [
        [photo.creditUrl, "tulipani"],
        [photo.licenseUrl, "inventory"],
      ] as const) {
        const url = new URL(urlString);
        assert.equal(url.searchParams.get("utm_source"), "emigro");
        assert.equal(url.searchParams.get("utm_medium"), "guide");
        assert.equal(url.searchParams.get("utm_campaign"), "lake_como_2026");
        assert.equal(
          url.searchParams.get("utm_content"),
          `${guide.slug}-property-image-${destination}`,
        );
        assert.equal(url.searchParams.get("coupon"), "EMIGRO5");
      }
    } else {
      const asset = COMO_EDITORIAL_ASSETS.find((item) => item.src === photo.src);
      assert.ok(asset, `${photo.src}: not an approved editorial asset`);
      assert.equal(photo.credit, asset.credit);
      assert.equal(photo.creditUrl, asset.creditUrl);
      assert.equal(photo.license, asset.license);
      assert.equal(photo.licenseUrl, asset.licenseUrl);
      assert.equal(photo.width, asset.width);
      assert.equal(photo.height, asset.height);
    }

    if (photo.src.endsWith("hiking-greenway-ossuccio.webp")) {
      assert.match(photo.caption, /Sacro Monte/);
      assert.match(photo.caption, /not the lakeside Greenway/);
    }
    if (photo.src.endsWith("madesimo-groppera.webp")) {
      assert.match(photo.caption, /unavailable/);
      assert.match(photo.caption, /redevelopment/);
      assert.doesNotMatch(photo.caption, /open lift|groomed piste/i);
    }
    if (photo.src.endsWith("madesimo-larici.webp")) {
      assert.match(photo.caption, /green season/);
      assert.match(photo.caption, /not a snow photograph/);
    }
    if (photo.src.endsWith("madesimo-alpe-motta.webp")) {
      assert.match(photo.caption, /[Ss]ummer/);
      assert.match(photo.caption, /not a groomed winter piste/);
    }
    if (photo.src.endsWith("madesimo-ss36.webp")) {
      assert.match(photo.caption, /Passo dello Spluga/);
      assert.match(photo.caption, /not a live road report/);
    }
    if (photo.src.endsWith("madesimo-piste.webp")) {
      assert.match(photo.caption, /not a live lift-status report/);
    }
  }

  for (const point of media.map.points) {
    assert.ok(point.x >= 0 && point.x <= 1000, `${guide.slug}: point x outside viewBox`);
    assert.ok(point.y >= 0 && point.y <= 650, `${guide.slug}: point y outside viewBox`);
    assert.ok(point.description.length >= 30, `${guide.slug}: weak point description`);
  }

  for (const route of media.map.routes) {
    assert.match(route.points, /^\d+,\d+( \d+,\d+)+$/);
    for (const pair of route.points.split(" ")) {
      const [x, y] = pair.split(",").map(Number);
      assert.ok(x >= 0 && x <= 1000, `${guide.slug}: route x outside viewBox`);
      assert.ok(y >= 0 && y <= 650, `${guide.slug}: route y outside viewBox`);
    }
  }
}

const hiking = COMO_GUIDE_MEDIA["lake-como-hiking-best-trails"];
assert.equal(hiking.map.officialUrl, "https://edt.in-lombardia.it/en/tours/greenway-lago-di-como");
for (const label of ["Colonno", "Ossuccio", "Tremezzo", "San Martino", "Venini", "Crocione", "Breglia", "Menaggio", "Grona"]) {
  assert.ok(hiking.map.points.some((point) => point.label.includes(label)), `hiking point missing ${label}`);
}
assert.equal(new Set(hiking.map.routes.map((route) => route.color)).size >= 4, true, "hiking routes need four colours");
assert.ok(!hiking.map.points.some((point) => /2\.20|257 m/.test(point.description)), "Greenway ascent conflict must stay out of the map");

const ferries = COMO_GUIDE_MEDIA["lake-como-ferry-guide-timetables"];
assert.equal(ferries.map.officialUrl, "https://www.navigazionelaghi.it/en/tickets-and-timetables-lake-como/");
for (const label of ["Tremezzo", "Cadenabbia", "Traghetto", "Bellagio", "Varenna", "Menaggio", "Lenno", "Como"]) {
  assert.ok(ferries.map.points.some((point) => point.label.includes(label)), `ferry point missing ${label}`);
}
assert.ok(ferries.map.routes.some((route) => !route.dashed), "ferry map needs a solid passenger route");
assert.ok(ferries.map.routes.some((route) => route.dashed), "ferry map needs a dashed car-ferry route");

const transport = COMO_GUIDE_MEDIA["lake-como-yellow-pages-transport-services"];
for (const label of ["Tremezzo", "Cadenabbia", "C110", "Menaggio", "Como S. Giovanni", "Varenna-Esino"]) {
  assert.ok(transport.map.points.some((point) => point.label.includes(label)), `transport point missing ${label}`);
}
assert.ok(
  transport.map.points.some((point) => /\bComo\b/.test(point.label) && !point.label.includes("Giovanni")),
  "transport point missing Como city",
);

const madesimo = COMO_GUIDE_MEDIA["madesimo-ski-trip-from-lake-como"];
for (const label of ["Tremezzo", "Colico", "Chiavenna", "Campodolcino", "Madesimo", "Motta", "Groppera"]) {
  assert.ok(madesimo.map.points.some((point) => point.label.includes(label)), `madesimo point missing ${label}`);
}
const closed = madesimo.map.routes.find((route) => /Groppera|Val di Lei/.test(route.label));
assert.ok(closed?.dashed, "unavailable Groppera zone must be dashed");
assert.match(closed?.label ?? "", /unavailable/i);
assert.match(madesimo.map.points.find((point) => /Groppera/.test(point.label))?.description ?? "", /unavailable/i);

const attractions = COMO_GUIDE_MEDIA["best-things-to-do-lake-como-tremezzo"];
for (const label of ["Villa Carlotta", "Balbianello", "Bellagio", "Monastero", "Comacina", "Sacro Monte", "Como", "Greenway"]) {
  assert.ok(attractions.map.points.some((point) => point.label.includes(label)), `attractions point missing ${label}`);
}

console.log("italy Como visual commerce: OK");
}

main();
