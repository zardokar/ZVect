// core/validate.js acceptance: contract guards of plan §4.3; every error key has an English and a Thai text.
import { test } from "node:test";
import assert from "node:assert/strict";
import { validate } from "../core/validate.js";
import { ATTN, NEXT, CONFIG, EN, TH, attnWeights } from "./fixtures.js";

function keys(result) {
  return result.errors.map((e) => {
    return e.key;
  });
}

function seedInput(extra) {
  return { tokens: ATTN.tokens, seed: { seed: 7, ...extra } };
}

test("valid inputs pass: weights, seed, trace", () => {
  assert.deepEqual(validate({ tokens: ATTN.tokens, weights: attnWeights(false) }, CONFIG), { ok: true, errors: [] });
  assert.deepEqual(validate(seedInput({}), CONFIG).errors, []);
  const trace = { version: 1, layers: [{ heads: [{ A: [[1, 0], [0.5, 0.5]], S: [[0, null], [1, 1]] }] }], next: NEXT };
  assert.deepEqual(validate({ tokens: ["a", "b"], trace }, CONFIG).errors, []);
});

test("tokens: missing, empty, not text, more than maxTokens", () => {
  assert.deepEqual(keys(validate({ seed: {} }, CONFIG)), ["tokensMissing"]);
  assert.deepEqual(keys(validate({ tokens: [], seed: {} }, CONFIG)), ["tokensMissing"]);
  assert.deepEqual(keys(validate({ tokens: ["a", 3], seed: {} }, CONFIG)), ["tokenNotString"]);
  const many = new Array(CONFIG.limits.maxTokens + 1).fill("t");
  const r = validate({ tokens: many, seed: {} }, CONFIG);
  assert.deepEqual(keys(r), ["tooManyTokens"]);
  assert.equal(r.errors[0].vars.max, CONFIG.limits.maxTokens);
  assert.deepEqual(keys(validate(null, CONFIG)), ["notObject"]);
});

test("exactly one of trace, weights, seed", () => {
  assert.deepEqual(keys(validate({ tokens: ["a"] }, CONFIG)), ["sourceNone"]);
  assert.deepEqual(keys(validate({ tokens: ["a"], seed: {}, trace: {} }, CONFIG)), ["sourceMany"]);
});

test("weights: a ragged matrix is rejected with its path", () => {
  const w = attnWeights(false);
  w.heads = [{ Wq: [[0, 1, 0], [1, 0], [0, 0, 1]], Wk: ATTN.Wk, Wv: ATTN.Wv }];
  const r = validate({ tokens: ATTN.tokens, weights: w }, CONFIG);
  assert.equal(r.ok, false);
  assert.deepEqual(r.errors[0], { key: "ragged", path: "weights.heads[0].Wq", vars: {} });
});

test("weights: non-finite values and shape mismatches", () => {
  const w = attnWeights(false);
  w.X = ATTN.X.map((r, i) => {
    return i === 1 ? [r[0], Infinity, r[2]] : r;
  });
  assert.deepEqual(keys(validate({ tokens: ATTN.tokens, weights: w }, CONFIG)), ["notFinite"]);
  const short = { tokens: ATTN.tokens.slice(0, 4), weights: attnWeights(false) };
  const r = validate(short, CONFIG);
  assert.deepEqual(r.errors, [{ key: "rowsMismatch", path: "weights.X", vars: { want: 4, got: 5 } }]);
  const bad = attnWeights(false);
  bad.heads = [{ Wq: ATTN.Wq, Wk: [[1, 0], [0, 1], [0, 0]], Wv: ATTN.Wv }];
  assert.deepEqual(keys(validate({ tokens: ATTN.tokens, weights: bad }, CONFIG)), ["colsMismatch"]);
  const part = attnWeights(false);
  part.Wo = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  assert.deepEqual(keys(validate({ tokens: ATTN.tokens, weights: part }, CONFIG)), ["blockPartial"]);
  const enumBad = attnWeights(false);
  enumBad.position = "learned";
  const e = validate({ tokens: ATTN.tokens, weights: enumBad }, CONFIG).errors;
  assert.deepEqual(e, [{ key: "badEnum", path: "weights.position", vars: { allowed: ["sincos", "none"] } }]);
});

test("seed: whole numbers >= 1, heads within the limit", () => {
  assert.deepEqual(keys(validate(seedInput({ dModel: 0 }), CONFIG)), ["badInt"]);
  assert.deepEqual(keys(validate(seedInput({ heads: 1.5 }), CONFIG)), ["badInt"]);
  assert.deepEqual(keys(validate(seedInput({ heads: CONFIG.limits.maxHeadsPerLayer + 1 }), CONFIG)), ["tooMany"]);
  assert.deepEqual(keys(validate(seedInput({ scale: Infinity }), CONFIG)), ["badNumber"]);
});

test("trace: layers needed, A needed, A rows sum to 1, matrices n rows, next consistent", () => {
  const tok = ["a", "b"];
  assert.deepEqual(keys(validate({ tokens: tok, trace: { layers: [] } }, CONFIG)), ["emptyList"]);
  assert.deepEqual(keys(validate({ tokens: tok, trace: { layers: [{ heads: [{}] }] } }, CONFIG)), ["missingA"]);
  const sum = { layers: [{ heads: [{ A: [[0.5, 0.4], [0.5, 0.5]] }] }] };
  assert.deepEqual(keys(validate({ tokens: tok, trace: sum }, CONFIG)), ["rowSum"]);
  const rows = { layers: [{ heads: [{ A: [[1, 0], [0, 1]], Q: [[1, 2]] }] }] };
  assert.deepEqual(keys(validate({ tokens: tok, trace: rows }, CONFIG)), ["rowsMismatch"]);
  const next = { layers: [{ heads: [{ A: [[1, 0], [0, 1]] }] }], next: { vocab: ["x", "y"], logits: [1] } };
  assert.deepEqual(keys(validate({ tokens: tok, trace: next }, CONFIG)), ["lengthMismatch"]);
  const top = { tokens: tok, seed: {}, next: { vocab: ["x"], logits: [NaN] } };
  assert.deepEqual(keys(validate(top, CONFIG)), ["notFinite"]);
});

test("every error key validate can return has an English and a Thai text", () => {
  for (const key of Object.keys(EN.errors)) {
    assert.equal(typeof TH.errors[key], "string", key);
  }
  const seen = ["notObject", "tokensMissing", "tooManyTokens", "tokenNotString", "sourceNone", "sourceMany", "notMatrix",
    "ragged", "notFinite", "rowsMismatch", "colsMismatch", "lengthMismatch", "blockPartial", "missingA", "rowSum", "emptyList", "tooMany", "badInt", "badEnum", "badNumber"];
  for (const key of seen) {
    assert.equal(typeof EN.errors[key], "string", key);
  }
});
