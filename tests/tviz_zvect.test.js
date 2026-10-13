// Drift guard (WIP202610052, ZVect only): lib/tviz/core gives the same numbers as web/js/attention.js and web/js/tblock.js
// on web/data/transformer.json, and the tviz test fixtures are an exact copy of that file's toy data.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fmt as zfmt } from "../lib/zvect.js";
import * as Z from "../web/js/attention.js";
import * as ZB from "../web/js/tblock.js";
import * as T from "../lib/tviz/core/tmath.js";
import { buildTrace, weightsFromSeed, traceFromWeights } from "../lib/tviz/core/trace.js";
import { fmt } from "../lib/tviz/core/format.js";
import { ATTN, BLOCK, CONFIG, EN } from "../lib/tviz/atdd/fixtures.js";

const SETUP = JSON.parse(readFileSync(new URL("../web/data/transformer.json", import.meta.url), "utf8"));
const A = SETUP.data.attn;
const B = SETUP.config.block;

test("fixtures are an exact copy of transformer.json (attn, block data, block config)", () => {
  for (const k of ["tokens", "X", "Wq", "Wk", "Wv"]) {
    assert.deepEqual(ATTN[k], A[k], k);
  }
  assert.deepEqual(BLOCK.tokens, SETUP.data.block.tokens);
  assert.deepEqual(BLOCK.X, SETUP.data.block.X);
  assert.deepEqual(BLOCK.config, B);
});

test("tmath = attention.js / tblock.js, bit for bit", () => {
  assert.deepEqual(T.matmul(A.X, A.Wq), Z.matmul(A.X, A.Wq));
  assert.deepEqual(T.transpose(A.X), Z.transpose(A.X));
  const S = [[0.3, 2.5, -1], [1, -Infinity, 0.2]];
  assert.deepEqual(T.softmaxRows(S), Z.softmaxRows(S));
  assert.deepEqual(T.causalMask(A.X.map((r) => {
    return [...r, 1, 2];
  })), Z.causalMask(A.X.map((r) => {
    return [...r, 1, 2];
  })));
  assert.equal(T.scoreDivisor("sqrtDk", 3), Z.scoreDivisor("sqrtDk", 3));
  for (const pos of [0, 1, 7, 33]) {
    assert.deepEqual(T.position(pos, 8, 10000), Z.position(pos, 8, 10000), String(pos));
  }
  assert.deepEqual(T.seeded(8, 3, 5, B.scale, B.burn), ZB.seeded(8, 3, 5, B.scale, B.burn));
  assert.deepEqual(T.layerNorm(SETUP.data.block.X, B.eps), ZB.layerNorm(SETUP.data.block.X, B.eps));
  assert.deepEqual(T.relu([[-1, 2]]), ZB.relu([[-1, 2]]));
  assert.deepEqual(T.addRows(A.X, A.X), ZB.addRows(A.X, A.X));
});

test("buildTrace (weights) = attention() for causal off and on, incl. the 0.538 of plan §3.2", () => {
  for (const causal of [false, true]) {
    const z = Z.attention(A.X, A.Wq, A.Wk, A.Wv, { scale: SETUP.config.attn.scale, causal });
    const weights = { X: A.X, heads: [{ Wq: A.Wq, Wk: A.Wk, Wv: A.Wv }], position: "none", causal, scale: SETUP.config.attn.scale };
    const h = buildTrace({ tokens: A.tokens, weights }, CONFIG).layers[0].heads[0];
    for (const k of ["Q", "K", "V", "raw", "S", "A", "out"]) {
      assert.deepEqual(h[k], z[k], k + " causal " + causal);
    }
  }
  const h = buildTrace({ tokens: A.tokens, weights: { X: A.X, heads: [{ Wq: A.Wq, Wk: A.Wk, Wv: A.Wv }] } }, CONFIG).layers[0].heads[0];
  const tb = Z.indexOf(A.tokens, A.start);
  assert.equal(fmt(h.A[tb][Z.indexOf(A.tokens, "cute")], 3, EN.format), "0.538");
});

test("seed plan = blockWeights; weights mode with the block = encoderBlock (every stage, every head)", () => {
  const w = weightsFromSeed(B, A.tokens.length, CONFIG.seedPlan);
  const zw = ZB.blockWeights(B);
  assert.deepEqual(w.heads, zw.heads);
  assert.deepEqual([w.Wo, w.W1, w.W2], [zw.Wo, zw.W1, zw.W2]);
  for (const causal of [false, true]) {
    const z = ZB.encoderBlock(SETUP.data.block.X, B, B.base, causal);
    const L = traceFromWeights({ ...w, X: SETUP.data.block.X, causal }).layers[0];
    assert.deepEqual([L.P, L.X0], [z.P, z.X0]);
    for (const k of ["concat", "mha", "norm1", "hidden", "ffn", "out"]) {
      assert.deepEqual(L.block[k], z[k], k + " causal " + causal);
    }
    L.heads.forEach((h, i) => {
      assert.deepEqual(h.A, z.heads[i].A, "head " + i);
    });
  }
});

test("seed mode with the ZVect block config = the same weights and stages as encoderBlock on seeded X", () => {
  const t = buildTrace({ tokens: A.tokens, seed: B }, CONFIG);
  const X = ZB.seeded(B.seed + CONFIG.seedPlan.x, A.tokens.length, B.dModel, B.scale, B.burn);
  assert.deepEqual(t.layers[0].X, X);
  const z = ZB.encoderBlock(X, B, B.base, false);
  assert.deepEqual(t.layers[0].block.out, z.out);
});

test("tviz fmt with 3 digits = ZVect lib fmt", () => {
  for (const x of [0.5377, -0, 0.0625, 0.0675, 1.2345, -2.0005, 123.4565, 1e-9]) {
    assert.equal(fmt(x, 3, EN.format), zfmt(x), String(x));
  }
});
