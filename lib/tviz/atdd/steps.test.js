// core/steps.js acceptance: the 7 attention steps of plan §3.2 (mask off = listed but skipped), player moves, block stages, head summary.
import { test } from "node:test";
import assert from "node:assert/strict";
import { STEP_IDS, attentionSteps, playable, nextStep, firstStep, lastStep, blockStages, headSummary } from "../core/steps.js";
import { buildTrace, normalizeTrace } from "../core/trace.js";
import { ATTN, CONFIG, EN, TH, attnWeights } from "./fixtures.js";

function layerOf(causal) {
  return buildTrace({ tokens: ATTN.tokens, weights: attnWeights(causal) }, CONFIG).layers[0];
}

test("7 steps in both modes; the ids and labels of plan §3.2", () => {
  assert.deepEqual(STEP_IDS, ["x", "qkv", "raw", "scaled", "mask", "softmax", "out"]);
  for (const causal of [false, true]) {
    const L = layerOf(causal);
    const s = attentionSteps(L, L.heads[0]);
    assert.equal(s.length, 7);
    assert.deepEqual(s.map((x) => {
      return x.index;
    }), [0, 1, 2, 3, 4, 5, 6]);
  }
  for (const id of [...STEP_IDS, "maskOff"]) {
    assert.equal(typeof EN.steps[id], "string", id);
    assert.equal(typeof TH.steps[id], "string", id);
    assert.equal(typeof EN.captions[id], "string", id);
    assert.equal(typeof TH.captions[id], "string", id);
  }
});

test("causal off: step 4 is 'mask: off', listed, enabled, skipped by the player", () => {
  const L = layerOf(false);
  const s = attentionSteps(L, L.heads[0]);
  assert.equal(s[4].labelKey, "maskOff");
  assert.equal(s[4].skip, true);
  assert.equal(nextStep(s, 3, 1), 5);
  assert.equal(nextStep(s, 5, -1), 3);
  assert.deepEqual(playable(s), [0, 1, 2, 3, 5, 6]);
});

test("causal on: step 4 is 'mask' and plays", () => {
  const L = layerOf(true);
  const s = attentionSteps(L, L.heads[0]);
  assert.equal(s[4].labelKey, "mask");
  assert.equal(s[4].skip, false);
  assert.equal(nextStep(s, 3, 1), 4);
  assert.deepEqual(s[4].matrices, ["S"]);
  assert.deepEqual(s[1].matrices, ["Q", "K", "V"]);
});

test("trace with only A: steps 0–4 and 6 disabled, never invented; player starts at softmax", () => {
  const t = normalizeTrace({ layers: [{ heads: [{ A: [[1, 0], [0.5, 0.5]] }] }] }, ["a", "b"]);
  const L = t.layers[0];
  const s = attentionSteps(L, L.heads[0]);
  assert.deepEqual(s.map((x) => {
    return x.enabled;
  }), [false, false, false, false, false, true, false]);
  assert.equal(firstStep(s), 5);
  assert.equal(lastStep(s), 5);
  assert.equal(nextStep(s, 5, 1), 5);
  assert.equal(nextStep(s, 5, -1), 5);
});

test("nextStep stays inside the list and clamps at both ends", () => {
  const L = layerOf(true);
  const s = attentionSteps(L, L.heads[0]);
  assert.equal(firstStep(s), 0);
  assert.equal(lastStep(s), 6);
  assert.equal(nextStep(s, 6, 1), 6);
  assert.equal(nextStep(s, 0, -1), 0);
});

test("blockStages: five columns with residual sources, shapes and text keys", () => {
  const t = buildTrace({ tokens: ATTN.tokens, seed: { seed: 7 } }, CONFIG);
  const st = blockStages(t.layers[0]);
  assert.deepEqual(st.map((x) => {
    return x.name;
  }), ["x0", "mha", "norm1", "ffn", "out"]);
  assert.equal(st[2].residualFrom, "x0");
  assert.equal(st[4].residualFrom, "norm1");
  assert.deepEqual(st[3].shape, { rows: 5, cols: CONFIG.seed.dFF });
  assert.ok(st.every((x) => {
    return x.enabled;
  }));
  for (const x of st) {
    assert.equal(typeof EN.stages[x.name], "string", x.name);
    assert.equal(typeof TH.stageFormulas[x.name], "string", x.name);
  }
  const none = blockStages(layerOf(false));
  assert.ok(none.slice(1).every((x) => {
    return !x.enabled;
  }));
});

test("headSummary: max weight and mean row entropy (nats)", () => {
  const sharp = headSummary([[1, 0], [0, 1]]);
  assert.deepEqual(sharp, { max: 1, entropy: 0 });
  const flat = headSummary([[0.5, 0.5], [0.5, 0.5]]);
  assert.equal(flat.max, 0.5);
  assert.equal(flat.entropy.toFixed(3), Math.log(2).toFixed(3));
});
