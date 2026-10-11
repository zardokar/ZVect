// Run: npm test   (uses node:test, built into Node >= 18)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as zv from "../lib/zvect.js";

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test("add / sub / scale", () => {
  assert.deepEqual(zv.add([1, 2, 3], [4, 5, 6]), [5, 7, 9]);
  assert.deepEqual(zv.sub([4, 5, 6], [1, 2, 3]), [3, 3, 3]);
  assert.deepEqual(zv.scale([1, -2, 3], 2), [2, -4, 6]);
});

test("dot / norm / distance", () => {
  assert.equal(zv.dot([1, 2, 3], [4, 5, 6]), 32);
  assert.equal(zv.norm([3, 4, 0]), 5);
  assert.equal(zv.distance([1, 1, 1], [4, 5, 1]), 5);
});

test("normalize gives length 1, zero stays zero", () => {
  near(zv.norm(zv.normalize([2, 3, 6])), 1);
  assert.deepEqual(zv.normalize([0, 0, 0]), [0, 0, 0]);
});

test("cosine: same / perpendicular / opposite / zero", () => {
  near(zv.cosine([1, 1, 0], [5, 5, 0]), 1);
  near(zv.cosine([1, 0, 0], [0, 1, 0]), 0);
  near(zv.cosine([1, 2, 3], [-1, -2, -3]), -1);
  assert.equal(zv.cosine([0, 0, 0], [1, 2, 3]), 0);
});

test("angle never NaN (rounding past 1)", () => {
  const a = [0.1, 0.2, 0.3];
  assert.ok(!Number.isNaN(zv.angle(a, a)));
  near(zv.angle([1, 0, 0], [0, 1, 0]), Math.PI / 2);
});

test("unit vectors: dot == cosine, |a-b|^2 == 2 - 2cos; near-zero acts as zero", () => {
  const a = [3, 1, 0], b = [3, 2, 0], ua = zv.normalize(a), ub = zv.normalize(b);
  near(zv.dot(ua, ub), zv.cosine(a, b));
  near(zv.distance(ua, ub) ** 2, 2 - 2 * zv.cosine(a, b));
  assert.equal(zv.cosine([1e-300, 0, 0], [1, 2, 3]), 0);
});

test("project: shadow of b on a", () => {
  assert.deepEqual(zv.project([3, 4, 0], [1, 0, 0]), [3, 0, 0]);
});

test("mean / topK / classify", () => {
  assert.deepEqual(zv.mean([[0, 0, 0], [2, 4, 6]]), [1, 2, 3]);
  const items = [{ id: "x", v: [1, 0, 0] }, { id: "y", v: [0, 1, 0] }];
  assert.equal(zv.topK([0.9, 0.1, 0], items, 1)[0].id, "x");
  assert.equal(zv.classify([0, 2, 0], { x: [1, 0, 0], y: [0, 1, 0] }).label, "y");
});

test("encode: mean of known words, unit length, unknown -> zero", () => {
  const t = { a: [1, 0, 0], b: [0, 1, 0] };
  const v = zv.encode("A and b!", t);
  near(v[0], Math.SQRT1_2);
  near(zv.norm(v), 1);
  assert.deepEqual(zv.encode("nothing here", t), [0, 0, 0]);
});

test("rules: size mismatch / empty input throw", () => {
  assert.throws(() => zv.add([1, 2, 3], [1, 2]), /size mismatch/);
  assert.throws(() => zv.dot([1], [1, 2]), /size mismatch/);
  assert.throws(() => zv.mean([]), /empty list/);
  assert.throws(() => zv.classify([1], {}), /no centroids/);
  assert.throws(() => zv.encode("a", {}), /empty table/);
});

test("encode ignores inherited keys and keeps Thai words", () => {
  assert.deepEqual(zv.encode("constructor toString", { a: [1, 0] }), [0, 0]);
  near(zv.encode("แมว", { "แมว": [0, 2] })[1], 1);
});

test("fmt prints 3 decimals and no -0.000", () => {
  assert.equal(zv.fmt([1, -0, 0.5]), "[1.000, 0.000, 0.500]");
  assert.equal(zv.fmt(2), "2.000");
  assert.equal(zv.fmt(0.0625), "0.062"); // exact tie -> even, same as printf / Python
});

test("policy: zero dependencies (see docs/APPROVALS.md)", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
  for (const k of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
    assert.ok(!pkg[k] || Object.keys(pkg[k]).length === 0, `${k} must be empty unless approved`);
  }
});

test("lib/MANIFEST.json matches lib files (run: npm run manifest)", async () => {
  const { buildManifest } = await import("../tools/manifest.js");
  const onDisk = JSON.parse(readFileSync(new URL("../lib/MANIFEST.json", import.meta.url)));
  assert.deepEqual(onDisk, buildManifest());
});

test("all three libs carry the same VERSION as package.json", () => {
  const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
  assert.equal(zv.VERSION, pkg.version);
  for (const f of ["zvect.py", "zvect.hpp"]) {
    const src = readFileSync(new URL("../lib/" + f, import.meta.url), "utf8");
    assert.ok(src.includes(`VERSION = "${pkg.version}"`), f + " VERSION out of date");
  }
});
