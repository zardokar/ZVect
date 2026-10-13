// core/format.js acceptance: number text (ties to even, -0, ±∞ from the text file), templates, shapes, percents; en/th key parity.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fmt, fill, shapeLabel, pct } from "../core/format.js";
import { EN, TH, keyPaths, at } from "./fixtures.js";

test("fmt: fixed digits, -0 prints as 0, exact ties round to even (same as ZVect lib fmt)", () => {
  assert.equal(fmt(0.5377, 3, EN.format), "0.538");
  assert.equal(fmt(-0, 3, EN.format), "0.000");
  assert.equal(fmt(-0.0001, 3, EN.format), "-0.000");
  assert.equal(fmt(0.0625, 3, EN.format), "0.062");
  assert.equal(fmt(0.0675, 3, EN.format), "0.068");
  assert.equal(fmt(2, 0, EN.format), "2");
  assert.equal(fmt(1.25, 1, EN.format), "1.2");
});

test("fmt: infinities and NaN use the text file's symbols", () => {
  assert.equal(fmt(-Infinity, 3, EN.format), "−∞");
  assert.equal(fmt(Infinity, 3, EN.format), "+∞");
  assert.equal(fmt(NaN, 3, EN.format), "—");
  assert.equal(fmt(null, 3, EN.format), "−∞");
});

test("fill: {name} placeholders, unknown ones kept, values turned to text", () => {
  assert.equal(fill("step {i} of {n}", { i: 3, n: 7 }), "step 3 of 7");
  assert.equal(fill("q_{i} · k_{j} = {v}", { i: 2, j: 1, v: "0.538" }), "q_2 · k_1 = 0.538");
  assert.equal(fill("{a} and {b}", { a: "x" }), "x and {b}");
  assert.equal(fill("no slots", { a: 1 }), "no slots");
  assert.equal(fill("{a}{a}", { a: 0 }), "00");
  assert.equal(fill("one of {allowed}", { allowed: ["sincos", "none"] }, EN.format.listSep), "one of sincos, none");
});

test("shapeLabel and pct", () => {
  assert.equal(shapeLabel([[1, 2, 3], [4, 5, 6]], EN.format.shape), "2 × 3");
  assert.equal(shapeLabel([], EN.format.shape), "0 × 0");
  assert.equal(pct(0.5129, 1, EN.format), "51.3%");
  assert.equal(pct(0.0025, 1, EN.format), "0.2%");
});

test("en.json and th.json have exactly the same keys, every value non-empty text", () => {
  const en = keyPaths(EN, "").filter((k) => {
    return !k.startsWith("_how");
  }).sort();
  const th = keyPaths(TH, "").filter((k) => {
    return !k.startsWith("_how");
  }).sort();
  assert.deepEqual(th, en);
  for (const k of en) {
    assert.equal(typeof at(EN, k), "string", k);
    assert.ok(at(EN, k).length > 0, k);
    assert.ok(at(TH, k).length > 0, k);
  }
  assert.equal(EN.lang, "en");
  assert.equal(TH.lang, "th");
});

test("th.json: a space between Thai and Latin letters or digits (house writing rule)", () => {
  const thai = "[\\u0E00-\\u0E7F]";
  const latin = "[A-Za-z0-9]";
  const glued = new RegExp(thai + latin + "|" + latin + thai);
  for (const k of keyPaths(TH, "")) {
    const v = at(TH, k);
    if (typeof v === "string") {
      assert.ok(!glued.test(v), k + ": " + v);
    }
  }
});
