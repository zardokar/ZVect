// core/color.js acceptance: hex parsing, ramps between theme stops, value domains that skip masked cells, rgba text, legend stops.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseHex, mix, ramp, domain, symmetric, unit, rgba, alphaOf, legendStops } from "../core/color.js";

test("parseHex: #rgb and #rrggbb, case-insensitive; anything else throws", () => {
  assert.deepEqual(parseHex("#ff8000"), [255, 128, 0]);
  assert.deepEqual(parseHex("#F80"), [255, 136, 0]);
  assert.deepEqual(parseHex(" #0a0B0c "), [10, 11, 12]);
  assert.throws(() => {
    parseHex("red");
  }, /hex/);
});

test("mix and ramp: ends are the stops, middle is between, t is clamped", () => {
  assert.deepEqual(mix([0, 0, 0], [255, 255, 255], 0.5), [128, 128, 128]);
  const stops = ["#000000", "#ff0000", "#ffffff"];
  assert.deepEqual(ramp(stops, 0), [0, 0, 0]);
  assert.deepEqual(ramp(stops, 0.5), [255, 0, 0]);
  assert.deepEqual(ramp(stops, 1), [255, 255, 255]);
  assert.deepEqual(ramp(stops, 0.25), [128, 0, 0]);
  assert.deepEqual(ramp(stops, -3), [0, 0, 0]);
  assert.deepEqual(ramp(stops, 7), [255, 255, 255]);
  assert.deepEqual(ramp(["#123456"], 0.7), [18, 52, 86]);
});

test("domain: min and max over finite values only (masked -Infinity and null skipped)", () => {
  assert.deepEqual(domain([[1, -Infinity], [null, -2], [5, 0]]), { min: -2, max: 5 });
  assert.deepEqual(domain([[-Infinity]]), { min: 0, max: 0 });
  assert.deepEqual(symmetric({ min: -2, max: 5 }), { min: -5, max: 5 });
  assert.deepEqual(symmetric({ min: 0, max: 0 }), { min: 0, max: 0 });
});

test("unit: value -> 0..1 inside the domain, clamped; flat domain -> 0.5", () => {
  assert.equal(unit(5, { min: 0, max: 10 }), 0.5);
  assert.equal(unit(-1, { min: 0, max: 10 }), 0);
  assert.equal(unit(11, { min: 0, max: 10 }), 1);
  assert.equal(unit(3, { min: 3, max: 3 }), 0.5);
});

test("rgba text and line alpha from a weight", () => {
  assert.equal(rgba([1, 2, 3], 0.5), "rgba(1, 2, 3, 0.5)");
  assert.equal(rgba([1, 2, 3], 2), "rgba(1, 2, 3, 1)");
  assert.equal(alphaOf(0, 0.15, 0.95), 0.15);
  assert.equal(alphaOf(1, 0.15, 0.95), 0.95);
  assert.equal(alphaOf(0.5, 0, 1), 0.5);
  assert.equal(alphaOf(9, 0, 1), 1);
});

test("legendStops: evenly spaced t with their values, ends included", () => {
  assert.deepEqual(legendStops({ min: 0, max: 1 }, 3), [{ t: 0, value: 0 }, { t: 0.5, value: 0.5 }, { t: 1, value: 1 }]);
  assert.deepEqual(legendStops({ min: -2, max: 2 }, 2), [{ t: 0, value: -2 }, { t: 1, value: 2 }]);
  assert.deepEqual(legendStops({ min: 4, max: 4 }, 1), [{ t: 0, value: 4 }]);
});
