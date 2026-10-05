import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { COMO_EDITORIAL_ASSETS } from "../lib/italy/como-media";
import { COMO_MEDIA_MANIFEST } from "./italy-como-media-manifest";
import {
  artistCredit,
  buildImageInfoUrl,
  licenceRejection,
  outputMeetsEditorialGate,
  resolveCommonsPage,
  stripHtml,
  type CommonsPage,
} from "./italy-como-download-media";

const sanMartino = COMO_MEDIA_MANIFEST.find((asset) => asset.id === "san-martino");
const madesimoLarici = COMO_MEDIA_MANIFEST.find((asset) => asset.id === "madesimo-larici");
const madesimoRoad = COMO_MEDIA_MANIFEST.find((asset) => asset.id === "madesimo-road");
assert.ok(sanMartino);
assert.ok(madesimoLarici);
assert.ok(madesimoRoad);

const ids = COMO_MEDIA_MANIFEST.map((asset) => asset.id);
const outputs = COMO_MEDIA_MANIFEST.map((asset) => asset.output);
assert.equal(new Set(ids).size, COMO_MEDIA_MANIFEST.length);
assert.equal(new Set(outputs).size, COMO_MEDIA_MANIFEST.length);
assert.ok(outputs.every((output) => output.endsWith(".webp")));

const api = buildImageInfoUrl(sanMartino.fileTitle);
assert.equal(`${api.origin}${api.pathname}`, "https://commons.wikimedia.org/w/api.php");
assert.equal(api.searchParams.get("action"), "query");
assert.equal(api.searchParams.get("format"), "json");
assert.equal(api.searchParams.get("prop"), "imageinfo");
assert.equal(api.searchParams.get("iiprop"), "url|extmetadata|size");
assert.equal(api.searchParams.get("titles"), "File:Griante San Martino.JPG");
assert.equal(api.searchParams.get("origin"), "*");

assert.equal(
  stripHtml('<a href="//commons.wikimedia.org/wiki/User:Paebi" title="User:Paebi">Paebi</a>'),
  "Paebi",
);
assert.equal(
  artistCredit('<a href="//commons.wikimedia.org/wiki/User:Paebi" title="User:Paebi">Paebi</a>'),
  "Paebi",
);
assert.equal(
  artistCredit(
    '<a href="//commons.wikimedia.org/wiki/User:Rexcornot" title="User:Rexcornot"><b>Xavier Caré</b></a>. Please credit : Xavier Caré / Wikimedia Commons / CC-BY-SA.',
  ),
  "Xavier Caré",
);

const balbianello = COMO_MEDIA_MANIFEST.find((asset) => asset.id === "villa-balbianello");
assert.ok(balbianello);
assert.equal(licenceRejection("CC BY 2.0", /CC BY 2\.0/i), null);
assert.ok(licenceRejection("CC BY-SA 2.0", /CC BY 2\.0/i));
assert.equal(licenceRejection("CC BY-SA 2.0", balbianello.expectedLicense), null);

function page(license: string, extra: Partial<CommonsPage> = {}): CommonsPage {
  return {
    title: "File:Griante San Martino.JPG",
    imageinfo: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/4/41/Griante_San_Martino.JPG",
        descriptionurl: "https://commons.wikimedia.org/wiki/File:Griante_San_Martino.JPG",
        width: 1958,
        height: 1414,
        extmetadata: {
          LicenseShortName: { value: license },
          Artist: { value: '<a href="//commons.wikimedia.org/wiki/User:Paebi">Paebi</a>' },
          LicenseUrl: { value: "https://creativecommons.org/licenses/by-sa/3.0" },
          Restrictions: { value: "" },
        },
      },
    ],
    ...extra,
  };
}

const accepted = resolveCommonsPage(page("CC BY-SA 3.0"), sanMartino);
assert.equal(accepted.ok, true);
if (accepted.ok) {
  assert.equal(accepted.author, "Paebi");
  assert.equal(accepted.license, "CC BY-SA 3.0");
  assert.equal(accepted.canonicalTitle, "File:Griante San Martino.JPG");
  assert.equal(accepted.licenseUrl, "https://creativecommons.org/licenses/by-sa/3.0");
  assert.equal(accepted.originalUrl, "https://upload.wikimedia.org/wikipedia/commons/4/41/Griante_San_Martino.JPG");
}

const nonCommercial = resolveCommonsPage(page("CC BY-NC-SA 3.0"), sanMartino);
assert.equal(nonCommercial.ok, false);
if (!nonCommercial.ok) assert.match(nonCommercial.reason, /non-reusable/);

const noDerivatives = resolveCommonsPage(page("CC BY-ND 2.0"), sanMartino);
assert.equal(noDerivatives.ok, false);

const shareAlikeIsNotByOnly = licenceRejection("CC BY-SA 3.0", /CC BY 3\.0/i);
assert.ok(shareAlikeIsNotByOnly);

const germanBy = licenceRejection("CC BY 3.0 DE", madesimoLarici.expectedLicense);
assert.equal(germanBy, null);
assert.equal(licenceRejection("CC BY-SA 4.0", madesimoRoad.expectedLicense), null);
assert.ok(licenceRejection("CC BY 3.0", madesimoRoad.expectedLicense));

const missing = resolveCommonsPage({ title: "File:Nope.jpg", missing: "" }, sanMartino);
assert.equal(missing.ok, false);

const offHost = resolveCommonsPage(
  page("CC BY-SA 3.0", {
    imageinfo: [
      {
        url: "https://images.example-tourism-board.test/villa.jpg",
        descriptionurl: "https://commons.wikimedia.org/wiki/File:Griante_San_Martino.JPG",
        extmetadata: {
          LicenseShortName: { value: "CC BY-SA 3.0" },
          Artist: { value: "Paebi" },
          LicenseUrl: { value: "https://creativecommons.org/licenses/by-sa/3.0" },
        },
      },
    ],
  }),
  sanMartino,
);
assert.equal(offHost.ok, false);
if (!offHost.ok) assert.match(offHost.reason, /upload\.wikimedia\.org/);

assert.equal(outputMeetsEditorialGate(1199, 80 * 1024), false);
assert.equal(outputMeetsEditorialGate(1800, 70 * 1024 - 1), false);
assert.equal(outputMeetsEditorialGate(1800, 70 * 1024), true);

assert.equal(COMO_EDITORIAL_ASSETS.length, COMO_MEDIA_MANIFEST.length);
for (const asset of COMO_MEDIA_MANIFEST) {
  const credit = COMO_EDITORIAL_ASSETS.find((row) => row.id === asset.id);
  assert.ok(credit, `missing credit for ${asset.id}`);
  assert.equal(credit.src, `/images/como/editorial/${asset.output}`);
  assert.match(credit.creditUrl, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
  assert.match(credit.license, /^(CC BY-SA|CC BY|CC0|Public domain)\b/);
  assert.match(credit.licenseUrl, /^https:\/\//);
  assert.ok(credit.credit.trim().length > 0);
  assert.ok(credit.width >= 1200);
  assert.equal(asset.expectedLicense.test(credit.license), true, asset.id);
  const filePath = path.join(process.cwd(), "public/images/como/editorial", asset.output);
  assert.equal(fs.existsSync(filePath), true, asset.output);
  assert.ok(fs.statSync(filePath).size >= 70 * 1024, asset.output);
}

console.log("italy Como media download: OK");
