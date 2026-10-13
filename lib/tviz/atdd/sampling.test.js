// core/sampling.js acceptance: the plan §3.3 table (temperature, top-k, top-p rule A), tie order, seeded draw, argmax.
import { test } from "node:test";
import assert from "node:assert/strict";
import { scaleLogits, softmaxT, rankOrder, topK, topP, renormalize, sampleSteps, drawIndex, argmax } from "../core/sampling.js";
import { NEXT, CONFIG } from "./fixtures.js";

const EPS = CONFIG.sampling.topPEpsilon;

function pct(probs) {
  return probs.map((p) => {
    return (p * 100).toFixed(1);
  });
}

// plan §3.3 rule B ("keep while cumulative <= p"), written here only to show it differs from rule A (owner Q11: rule A)
function ruleB(probs, p) {
  const order = probs.map((x, i) => {
    return i;
  }).sort((a, b) => {
    return probs[b] - probs[a] || a - b;
  });
  const keep = probs.map(() => {
    return false;
  });
  let cum = 0;
  for (const i of order) {
    cum += probs[i];
    if (cum > p) {
      break;
    }
    keep[i] = true;
  }
  return keep;
}

test("scaleLogits divides by T", () => {
  assert.deepEqual(scaleLogits([2, -1], 0.5), [4, -2]);
  assert.deepEqual(scaleLogits([2, -1], 1), [2, -1]);
});

test("plan §3.3: temperature 1, 0.5, 2", () => {
  assert.deepEqual(pct(softmaxT(NEXT.logits, 1)), ["51.3", "23.0", "15.4", "7.7", "2.6"]);
  assert.deepEqual(pct(softmaxT(NEXT.logits, 0.5)), ["75.9", "15.3", "6.9", "1.7", "0.2"]);
  assert.deepEqual(pct(softmaxT(NEXT.logits, 2)), ["35.3", "23.7", "19.4", "13.7", "7.9"]);
});

test("plan §3.3: top-k k = 3 at T = 1", () => {
  const p = softmaxT(NEXT.logits, 1);
  const keep = topK(p, 3);
  assert.deepEqual(keep, [true, true, true, false, false]);
  assert.deepEqual(pct(renormalize(p, keep)), ["57.1", "25.7", "17.2", "0.0", "0.0"]);
});

test("plan §3.3: top-p p = 0.8 follows rule A (smallest set with cumulative >= p), not rule B", () => {
  const p = softmaxT(NEXT.logits, 1);
  const keep = topP(p, 0.8, EPS);
  assert.deepEqual(keep, [true, true, true, false, false]);
  assert.deepEqual(pct(renormalize(p, keep)), ["57.1", "25.7", "17.2", "0.0", "0.0"]);
  const b = ruleB(p, 0.8);
  assert.deepEqual(pct(renormalize(p, b)), ["69.0", "31.0", "0.0", "0.0", "0.0"]);
  assert.notDeepEqual(keep, b);
});

test("top-p edges: cumulative exactly p stops there; p >= 1 keeps all; tiny p keeps the top one", () => {
  assert.deepEqual(topP([0.5, 0.3, 0.2], 0.8, EPS), [true, true, false]);
  assert.deepEqual(topP([0.5, 0.3, 0.2], 1, EPS), [true, true, true]);
  assert.deepEqual(topP([0.2, 0.5, 0.3], 0.01, EPS), [false, true, false]);
});

test("top-k ties at the boundary: exactly k kept, the earlier vocab index wins", () => {
  assert.deepEqual(topK([0.2, 0.3, 0.3, 0.2], 2), [false, true, true, false]);
  assert.deepEqual(topK([0.25, 0.25, 0.25, 0.25], 2), [true, true, false, false]);
  assert.deepEqual(topK([0.1, 0.3, 0.3, 0.3], 2), [false, true, true, false]);
  assert.deepEqual(topK([0.5, 0.5], 5), [true, true]);
});

test("top-p ties keep the earlier index first", () => {
  assert.deepEqual(topP([0.3, 0.3, 0.4], 0.6, EPS), [true, false, true]);
});

test("sampleSteps: every value of the formula card for each mode", () => {
  const none = sampleSteps(NEXT.logits, { temperature: 1, mode: "none", k: 3, p: 0.8 }, EPS);
  assert.deepEqual(none.keep, [true, true, true, true, true]);
  assert.deepEqual(none.scaled, NEXT.logits);
  assert.deepEqual(none.final, none.probs);
  assert.deepEqual(none.order, [0, 1, 2, 3, 4]);
  assert.equal(none.argmax, 0);
  const k = sampleSteps(NEXT.logits, { temperature: 1, mode: "topk", k: 3, p: 0.8 }, EPS);
  assert.deepEqual(pct(k.final), ["57.1", "25.7", "17.2", "0.0", "0.0"]);
  const p = sampleSteps(NEXT.logits, { temperature: 0.5, mode: "topp", k: 3, p: 0.8 }, EPS);
  assert.deepEqual(p.keep, [true, true, false, false, false]);
  assert.throws(() => {
    sampleSteps(NEXT.logits, { temperature: 1, mode: "beam" }, EPS);
  }, /mode/);
});

test("rankOrder: most likely first, ties keep the earlier index", () => {
  assert.deepEqual(rankOrder(softmaxT(NEXT.logits, 1)), [0, 1, 2, 3, 4]);
  assert.deepEqual(rankOrder([0.2, 0.5, 0.2, 0.1]), [1, 0, 2, 3]);
});

test("argmax: first index of the largest value", () => {
  assert.equal(argmax([0.1, 0.4, 0.4]), 1);
  assert.equal(argmax([3]), 0);
});

test("drawIndex: seeded, repeatable, only kept tokens, u in [0, 1); seed 0 does not get stuck", () => {
  const final = [0.5, 0, 0.5];
  const a = drawIndex(final, 1);
  assert.deepEqual(a, drawIndex(final, 1));
  assert.ok(a.u >= 0 && a.u < 1);
  assert.notEqual(a.state, 1);
  let state = 1;
  const seen = new Set();
  for (let i = 0; i < 200; i++) {
    const d = drawIndex(final, state);
    state = d.state;
    seen.add(d.index);
  }
  assert.deepEqual([...seen].sort(), [0, 2]);
  assert.notEqual(drawIndex(final, 0).state, 0);
  assert.equal(drawIndex([0, 1, 0], 99).index, 1);
});
