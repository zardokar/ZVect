// core/tween.js acceptance (owner Q21 b): easing ends at 0 and 1, monotonic, t clamped; progress; numbers, vectors, matrices tween.
import { test } from "node:test";
import assert from "node:assert/strict";
import { EASINGS, ease, progress, lerp, lerpArray, lerpMatrix, tweenAt } from "../core/tween.js";
import { CONFIG } from "./fixtures.js";

test("every easing: f(0) = 0, f(1) = 1, monotonic non-decreasing on 0..1", () => {
  assert.deepEqual(Object.keys(EASINGS).sort(), ["easeInCubic", "easeInOutCubic", "easeOutCubic", "linear"]);
  for (const name of Object.keys(EASINGS)) {
    assert.equal(ease(name, 0), 0, name);
    assert.equal(ease(name, 1), 1, name);
    let prev = 0;
    for (let k = 1; k <= 100; k++) {
      const v = ease(name, k / 100);
      assert.ok(v >= prev, name + " at " + k);
      prev = v;
    }
  }
  assert.equal(ease("easeInOutCubic", 0.5), 0.5);
  assert.ok(ease("easeInCubic", 0.5) < 0.5);
  assert.ok(ease("easeOutCubic", 0.5) > 0.5);
});

test("ease clamps t outside 0..1; unknown easing throws; config easing exists", () => {
  assert.equal(ease("linear", -2), 0);
  assert.equal(ease("easeOutCubic", 3), 1);
  assert.throws(() => {
    ease("bounce", 0.5);
  }, /bounce/);
  assert.ok(CONFIG.animation.easing in EASINGS);
});

test("progress: 0 at start, 1 at the end and after, duration 0 = instant (reduced motion)", () => {
  assert.equal(progress(100, 100, 400), 0);
  assert.equal(progress(300, 100, 400), 0.5);
  assert.equal(progress(500, 100, 400), 1);
  assert.equal(progress(900, 100, 400), 1);
  assert.equal(progress(50, 100, 400), 0);
  assert.equal(progress(100, 100, 0), 1);
});

test("lerp, lerpArray, lerpMatrix: endpoints exact, middle between, t clamped", () => {
  assert.equal(lerp(2, 6, 0), 2);
  assert.equal(lerp(2, 6, 1), 6);
  assert.equal(lerp(2, 6, 0.25), 3);
  assert.equal(lerp(2, 6, 2), 6);
  assert.deepEqual(lerpArray([0, 10], [10, 0], 0.5), [5, 5]);
  assert.deepEqual(lerpMatrix([[0, 1], [2, 3]], [[4, 5], [6, 7]], 0.5), [[2, 3], [4, 5]]);
});

test("non-finite ends (masked −∞) do not make NaN: they jump at the end of the tween", () => {
  assert.equal(lerp(1, -Infinity, 0.5), 1);
  assert.equal(lerp(1, -Infinity, 1), -Infinity);
  assert.equal(lerp(-Infinity, 2, 0.5), -Infinity);
  assert.equal(lerp(-Infinity, 2, 1), 2);
  assert.equal(lerp(-Infinity, -Infinity, 0.5), -Infinity);
});

test("tweenAt: value at a time with an easing; shapes that differ snap to the target", () => {
  const spec = { from: [[0, 0]], to: [[10, 20]], start: 0, duration: 100, easing: "linear" };
  assert.deepEqual(tweenAt(spec, 50), { value: [[5, 10]], done: false });
  assert.deepEqual(tweenAt(spec, 100), { value: [[10, 20]], done: true });
  assert.deepEqual(tweenAt({ ...spec, from: 0, to: 4 }, 25), { value: 1, done: false });
  assert.deepEqual(tweenAt({ ...spec, from: [[1]] }, 10), { value: [[10, 20]], done: true });
  assert.deepEqual(tweenAt({ ...spec, from: null }, 10), { value: [[10, 20]], done: true });
});
