// core/tmath.js acceptance: matrix math, softmax (overflow-safe), causal mask (diagonal kept), layer norm, seeded weights, position.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  matmul, transpose, addRows, divideAll, softmax, softmaxRows, causalMask, layerNorm, relu,
  lcgNext, lcgUniform, seeded, position, positions, concatRows, shapeOf, scoreDivisor,
} from "../core/tmath.js";
import { ATTN, row3 } from "./fixtures.js";

test("matmul, transpose, addRows, divideAll, concatRows, shapeOf", () => {
  assert.deepEqual(matmul([[1, 2]], [[3], [4]]), [[11]]);
  assert.deepEqual(matmul([[1, 0], [0, 1]], [[5, 6], [7, 8]]), [[5, 6], [7, 8]]);
  assert.deepEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
  assert.deepEqual(addRows([[1, 2]], [[3, 4]]), [[4, 6]]);
  assert.deepEqual(divideAll([[2, 4], [6, -8]], 2), [[1, 2], [3, -4]]);
  assert.deepEqual(concatRows([[[1], [2]], [[3], [4]]]), [[1, 3], [2, 4]]);
  assert.deepEqual(shapeOf([[1, 2, 3], [4, 5, 6]]), { rows: 2, cols: 3 });
  assert.deepEqual(shapeOf([]), { rows: 0, cols: 0 });
});

test("softmax: sums to 1, does not overflow on large inputs (max subtracted)", () => {
  const p = softmax([1000, 1001]);
  assert.ok(p.every(Number.isFinite), String(p));
  assert.deepEqual(row3(p), ["0.269", "0.731"]);
  const rows = softmaxRows([[1000, 1001], [-1000, -1001]]);
  assert.ok(rows.flat().every(Number.isFinite), String(rows));
  assert.deepEqual(row3(rows[1]), ["0.731", "0.269"]);
});

test("softmaxRows: -Infinity becomes exactly 0; an all-masked row stays all 0 (no NaN)", () => {
  const r = softmaxRows([[0, -Infinity, 0], [-Infinity, -Infinity]]);
  assert.deepEqual(r[0], [0.5, 0, 0.5]);
  assert.deepEqual(r[1], [0, 0]);
});

test("causalMask: keeps the diagonal and everything before it, hides later tokens", () => {
  const m = causalMask([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  assert.deepEqual(m, [[1, -Infinity, -Infinity], [4, 5, -Infinity], [7, 8, 9]]);
  for (let i = 0; i < 3; i++) {
    assert.ok(Number.isFinite(m[i][i]), "diagonal " + i);
  }
});

test("scoreDivisor: sqrtDk = sqrt(d_k), none = 1, anything else throws", () => {
  assert.equal(scoreDivisor("sqrtDk", 4), 2);
  assert.equal(scoreDivisor("none", 4), 1);
  assert.throws(() => {
    scoreDivisor("half", 4);
  }, /scale/);
});

test("layerNorm (mean 0, variance 1) and relu", () => {
  const n = layerNorm([[1, 2, 3, 6]], 1e-5)[0];
  const mean = n.reduce((s, x) => {
    return s + x;
  }, 0) / n.length;
  const v = n.reduce((s, x) => {
    return s + x * x;
  }, 0) / n.length;
  assert.ok(Math.abs(mean) < 1e-12);
  assert.ok(Math.abs(v - 1) < 1e-4);
  assert.deepEqual(relu([[-1, 2], [0, -0.5]]), [[0, 2], [0, 0]]);
});

test("lcgNext / seeded: minstd, repeatable, values inside [-scale, scale], burn skips numbers", () => {
  assert.equal(lcgNext(1), 48271);
  assert.equal(lcgNext(48271), 182605794);
  const a = seeded(8, 3, 4, 0.8, 10);
  assert.deepEqual(a, seeded(8, 3, 4, 0.8, 10));
  assert.deepEqual(shapeOf(a), { rows: 3, cols: 4 });
  assert.ok(a.flat().every((x) => {
    return x >= -0.8 && x <= 0.8;
  }));
  assert.notDeepEqual(seeded(8, 1, 4, 0.8, 0), seeded(8, 1, 4, 0.8, 10));
});

test("lcgUniform: u in [0, 1) with the next state; 0, negative and huge seeds are folded into a working state", () => {
  assert.deepEqual(lcgUniform(1), { u: 48271 / 2147483647, state: 48271 });
  assert.deepEqual(lcgUniform(0), lcgUniform(1));
  assert.deepEqual(lcgUniform(2147483647), lcgUniform(1));
  const neg = lcgUniform(-5);
  assert.ok(neg.u >= 0 && neg.u < 1 && neg.state > 0);
});

test("position / positions: sin, cos pairs; position 0 = (0, 1, 0, 1)", () => {
  assert.deepEqual(position(0, 4, 10000), [0, 1, 0, 1]);
  assert.equal(position(1, 4, 10000)[0], Math.sin(1));
  assert.equal(position(1, 4, 10000)[3], Math.cos(1 / 100));
  assert.equal(position(2, 3, 10000).length, 3);
  const P = positions(3, 4, 10000);
  assert.deepEqual(P[2], position(2, 4, 10000));
  assert.equal(P.length, 3);
});

test("plan §3.2 step 1–2: q of 'teddy bear' and its raw score row", () => {
  const Q = matmul(ATTN.X, ATTN.Wq);
  const K = matmul(ATTN.X, ATTN.Wk);
  assert.deepEqual(row3(Q[2]), ["2.000", "0.600", "0.400"]);
  const raw = matmul(Q, transpose(K));
  assert.deepEqual(row3(raw[2]), ["0.560", "4.320", "2.560", "0.760", "1.960"]);
});
