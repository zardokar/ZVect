// core/trace.js acceptance: the plan §3.2 table (weights mode), seed mode, trace mode (null <-> -Infinity), block stages.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  headAttention, weightsFromSeed, traceFromWeights, normalizeTrace, exportTrace, buildTrace, maskedFromJSON, maskedToJSON,
} from "../core/trace.js";
import { shapeOf } from "../core/tmath.js";
import { ATTN, BLOCK, NEXT, CONFIG, attnWeights, row3 } from "./fixtures.js";

const TB = 2;

test("plan §3.2, causal off: q, raw, scaled, softmax 0.538, out of 'teddy bear'", () => {
  const t = buildTrace({ tokens: ATTN.tokens, weights: attnWeights(false) }, CONFIG);
  const L = t.layers[0];
  const h = L.heads[0];
  assert.equal(t.source, "weights");
  assert.equal(L.P, null);
  assert.deepEqual(row3(L.X0[TB]), ["0.600", "2.000", "0.400"]);
  assert.deepEqual(row3(h.Q[TB]), ["2.000", "0.600", "0.400"]);
  assert.deepEqual(row3(h.raw[TB]), ["0.560", "4.320", "2.560", "0.760", "1.960"]);
  assert.deepEqual(row3(h.scaled[TB]), ["0.323", "2.494", "1.478", "0.439", "1.132"]);
  assert.deepEqual(h.S, h.scaled);
  assert.deepEqual(row3(h.A[TB]), ["0.061", "0.538", "0.195", "0.069", "0.138"]);
  assert.deepEqual(row3(h.out[TB]), ["1.273", "0.713", "0.508"]);
  assert.equal(h.dk, 3);
  assert.equal(h.causal, false);
  assert.equal(L.block, null);
});

test("plan §3.2, causal on: mask row 0.323 · 2.494 · 1.478 · −∞ · −∞, softmax 0.077 · 0.677 · 0.245 · 0 · 0", () => {
  const h = buildTrace({ tokens: ATTN.tokens, weights: attnWeights(true) }, CONFIG).layers[0].heads[0];
  assert.deepEqual(row3(h.S[TB].slice(0, 3)), ["0.323", "2.494", "1.478"]);
  assert.deepEqual(h.S[TB].slice(3), [-Infinity, -Infinity]);
  assert.deepEqual(row3(h.scaled[TB]), ["0.323", "2.494", "1.478", "0.439", "1.132"]);
  assert.deepEqual(row3(h.A[TB]), ["0.077", "0.677", "0.245", "0.000", "0.000"]);
  assert.equal(h.A[TB][3], 0);
  assert.equal(h.causal, true);
});

test("headAttention: scale none divides by 1 (lesson 10.2's 0.759)", () => {
  const h = headAttention(ATTN.X, ATTN.Wq, ATTN.Wk, ATTN.Wv, { scale: "none", causal: false });
  assert.deepEqual(h.scaled, h.raw);
  assert.equal(h.A[TB][1].toFixed(3), "0.759");
});

test("weightsFromSeed: shapes from the seed object, repeatable, seed plan from config", () => {
  const w = weightsFromSeed(BLOCK.config, 5, CONFIG.seedPlan);
  assert.deepEqual(shapeOf(w.X), { rows: 5, cols: 4 });
  assert.equal(w.heads.length, 2);
  assert.deepEqual(shapeOf(w.heads[1].Wv), { rows: 4, cols: 2 });
  assert.deepEqual(shapeOf(w.Wo), { rows: 4, cols: 4 });
  assert.deepEqual(shapeOf(w.W1), { rows: 4, cols: 8 });
  assert.deepEqual(shapeOf(w.W2), { rows: 8, cols: 4 });
  assert.deepEqual(w, weightsFromSeed(BLOCK.config, 5, CONFIG.seedPlan));
  assert.notDeepEqual(w.heads[0].Wq, w.heads[1].Wq);
  assert.equal(w.position, "sincos");
});

test("seed mode: labelled as seed, full block with every stage, missing seed keys come from config", () => {
  const t = buildTrace({ tokens: ATTN.tokens, seed: { seed: 3 } }, CONFIG);
  assert.equal(t.source, "seed");
  const L = t.layers[0];
  assert.equal(L.heads.length, CONFIG.seed.heads);
  assert.deepEqual(shapeOf(L.P), { rows: 5, cols: CONFIG.seed.dModel });
  for (const k of ["concat", "mha", "norm1", "ffn", "out"]) {
    assert.deepEqual(shapeOf(L.block[k]), { rows: 5, cols: CONFIG.seed.dModel }, k);
  }
  assert.deepEqual(shapeOf(L.block.hidden), { rows: 5, cols: CONFIG.seed.dFF });
  assert.equal(t.next, null);
});

test("weights mode with Wo/W1/W2: block = ZVect encoderBlock layout (X0 = X + P, residuals, layer norm)", () => {
  const w = weightsFromSeed(BLOCK.config, 5, CONFIG.seedPlan);
  w.X = BLOCK.X;
  const L = traceFromWeights(w).layers[0];
  assert.deepEqual(L.block.concat[TB], [...L.heads[0].out[TB], ...L.heads[1].out[TB]]);
  assert.deepEqual(row3(L.block.out[TB]), ["1.572", "0.144", "-0.726", "-0.990"]);
  assert.deepEqual(row3(L.heads[0].A[TB]), ["0.184", "0.113", "0.141", "0.262", "0.300"]);
});

test("null <-> -Infinity: JSON trace S nulls become -Infinity inside, and back on export (round trip)", () => {
  assert.deepEqual(maskedFromJSON([[1, null], [2, 3]]), [[1, -Infinity], [2, 3]]);
  assert.deepEqual(maskedToJSON([[1, -Infinity], [2, 3]]), [[1, null], [2, 3]]);
  const built = buildTrace({ tokens: ATTN.tokens, weights: attnWeights(true) }, CONFIG);
  const wire = JSON.parse(JSON.stringify(exportTrace(built)));
  assert.equal(wire.layers[0].heads[0].S[TB][4], null);
  const back = buildTrace({ tokens: ATTN.tokens, trace: wire }, CONFIG);
  assert.deepEqual(back.layers[0].heads[0].S, built.layers[0].heads[0].S);
  assert.deepEqual(back.layers[0].heads[0].A, built.layers[0].heads[0].A);
  assert.equal(back.source, "trace");
});

test("trace mode: only A required; missing matrices stay missing (nothing invented); next passes through", () => {
  const A = [[1, 0], [0.4, 0.6]];
  const t = normalizeTrace({ version: 1, layers: [{ heads: [{ A }] }], next: NEXT }, ["a", "b"]);
  const h = t.layers[0].heads[0];
  assert.deepEqual(h.A, A);
  for (const k of ["Q", "K", "V", "raw", "scaled", "S", "out"]) {
    assert.equal(h[k], null, k);
  }
  assert.equal(t.layers[0].X0, null);
  assert.equal(t.layers[0].block, null);
  assert.deepEqual(t.next, NEXT);
  assert.deepEqual(t.tokens, ["a", "b"]);
});

test("trace mode: scaled is taken from S only when the head is not causal", () => {
  const S = [[0.1, 0.2], [0.3, 0.4]];
  const A = [[0.5, 0.5], [0.5, 0.5]];
  const open = normalizeTrace({ layers: [{ heads: [{ S, A, causal: false }] }] }, ["a", "b"]);
  assert.deepEqual(open.layers[0].heads[0].scaled, S);
  const shut = normalizeTrace({ layers: [{ heads: [{ S: [[0.1, null], [0.3, 0.4]], A, causal: true }] }] }, ["a", "b"]);
  assert.equal(shut.layers[0].heads[0].scaled, null);
  assert.equal(shut.layers[0].heads[0].S[0][1], -Infinity);
});

test("normalizeTrace does not change the caller's object", () => {
  const input = { layers: [{ heads: [{ S: [[0, null]], A: [[1, 0]] }] }] };
  const copy = JSON.parse(JSON.stringify(input));
  normalizeTrace(input, ["a"]);
  assert.deepEqual(input, copy);
});
