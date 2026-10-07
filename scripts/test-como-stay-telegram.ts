import assert from "node:assert/strict";
import { formatComoStayClickTelegram } from "../lib/italy/format-telegram";

const text = formatComoStayClickTelegram(
  {
    guide_slug: "lake-como-hiking-best-trails",
    placement: "early",
    destination: "tulipani",
  },
  {
    pagePath: "/en/guides/lake-como-hiking-best-trails",
    geoCountryRu: "Германия",
  },
);

assert.match(text, /ComoStay — клик/);
assert.match(text, /Tulipani 11/);
assert.match(text, /lake-como-hiking-best-trails/);
assert.match(text, /EMIGRO5/);
assert.match(text, /Германия/);

const inventory = formatComoStayClickTelegram({
  guide_slug: "lake-como-hub",
  placement: "final",
  destination: "inventory",
});
assert.match(inventory, /весь каталог ComoStay/);

console.log("como stay telegram: OK");
