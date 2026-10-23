import assert from "node:assert/strict";
import test from "node:test";

import { cleanInboundUrl } from "../src/shared/lib/cleanInboundUrl.ts";

const baseUrl = "https://nanaaddodba.github.io/rent-car-react/";

test("removes an incoming UTM referral without losing the fleet route", () => {
  const incoming = baseUrl + "?utm_source=referral.example#/fleet";
  assert.equal(cleanInboundUrl(incoming), baseUrl + "#/fleet");
});

test("preserves booking dates and non-tracking query parameters", () => {
  const incoming =
    baseUrl +
    "?ref=partner&utm_medium=link&gclid=click-id" +
    "#/fleet?city=Munich&pickup=2026-11-04&return=2026-11-07";

  assert.equal(
    cleanInboundUrl(incoming),
    baseUrl +
      "?ref=partner#/fleet?city=Munich&pickup=2026-11-04&return=2026-11-07",
  );
});

test("removes referral tags from HashRouter queries while keeping filters", () => {
  const incoming =
    baseUrl +
    "#/fleet?utm_source=referrer&city=Berlin&category=SUV&pickup=2026-11-04&return=2026-11-07";

  assert.equal(
    cleanInboundUrl(incoming),
    baseUrl +
      "#/fleet?city=Berlin&category=SUV&pickup=2026-11-04&return=2026-11-07",
  );
});

test("handles multiple marketing tags case-insensitively", () => {
  const incoming =
    baseUrl +
    "?UTM_SOURCE=external&utm_campaign=launch&fbclid=click-id#/favorites";

  assert.equal(cleanInboundUrl(incoming), baseUrl + "#/favorites");
});

test("leaves clean links, arbitrary query keys, and ordinary anchors untouched", () => {
  const clean = baseUrl + "#/book/urban-hybrid?city=Berlin&pickup=2026-11-04&return=2026-11-07";
  const ordinaryQuery = baseUrl + "?ref=partner#about";

  assert.equal(cleanInboundUrl(clean), clean);
  assert.equal(cleanInboundUrl(ordinaryQuery), ordinaryQuery);
});

test("returns malformed input without throwing", () => {
  assert.equal(cleanInboundUrl("not a valid URL"), "not a valid URL");
});
