#!/usr/bin/env npx tsx
import assert from "node:assert/strict";
import { tokenExpiresAtIso } from "../lib/threads/tokens";

const now = new Date("2026-09-17T08:00:00.000Z");
assert.equal(
  tokenExpiresAtIso(60 * 86400, now),
  "2026-11-16T08:00:00.000Z"
);
assert.equal(tokenExpiresAtIso(undefined, now), undefined);
assert.equal(tokenExpiresAtIso(0, now), undefined);

console.log("threads token lifecycle ok");
