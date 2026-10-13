// Chapter 10 "LLM - Stanford": every logical function of web/js/attention.js and web/js/tblock.js, the numbers the lessons'
// try lists quote, and the examples agreeing with the config.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { fmt } from "../lib/zvect.js";
import { matmul, transpose, softmaxRows, causalMask, scoreDivisor, attention, position, handAngles, positionCos, indexOf } from "../web/js/attention.js";
import { rnnHops, kept, sequentialSteps, seeded, addRows, layerNorm, relu, blockWeights, encoderBlock, shape } from "../web/js/tblock.js";

const SETUP = JSON.parse(readFileSync(new URL("../web/data/transformer.json", import.meta.url), "utf8"));
const CFG = SETUP.config;
const DATA = SETUP.data;
const A = DATA.attn;

function text(file) {
  return readFileSync(new URL("../web/lessons/" + file, import.meta.url), "utf8");
}
function example(name) {
  return execFileSync(process.execPath, [fileURLToPath(new URL("../examples/js/" + name + ".js", import.meta.url))], { encoding: "utf8" });
}
function row(M, i) {
  return M[i].map((x) => {
    return fmt(x);
  });
}

test("matmul, transpose: shapes and values", () => {
  assert.deepEqual(matmul([[1, 2]], [[3], [4]]), [[11]]);
  assert.deepEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
});

test("softmaxRows: rows add up to 1, -Infinity becomes 0; causalMask hides later tokens", () => {
  const S = softmaxRows(causalMask([[1, 2], [3, 4]]));
  assert.deepEqual(S[0], [1, 0]);
  assert.ok(Math.abs(S[1][0] + S[1][1] - 1) < 1e-12);
  assert.ok(S[1][1] > S[1][0]);
});

test("scoreDivisor: sqrt(d_k) or 1, anything else throws", () => {
  assert.equal(scoreDivisor("sqrtDk", 4), 2);
  assert.equal(scoreDivisor("none", 4), 1);
  assert.throws(() => {
    scoreDivisor("x", 4);
  }, /unknown score scale/);
});

test("attention: the lesson's numbers (0.538, 0.600, 0.759, masked 1.000)", () => {
  const r = attention(A.X, A.Wq, A.Wk, A.Wv, { scale: "sqrtDk", causal: false });
  const tb = indexOf(A.tokens, "teddy bear");
  const cute = indexOf(A.tokens, "cute");
  assert.equal(fmt(r.A[tb][cute]), "0.538");
  assert.equal(fmt(r.A[cute][tb]), "0.600");
  assert.deepEqual(row(r.out, tb), ["1.273", "0.713", "0.508"]);
  const raw = attention(A.X, A.Wq, A.Wk, A.Wv, { scale: "none", causal: false });
  assert.equal(fmt(raw.A[tb][cute]), "0.759");
  const m = attention(A.X, A.Wq, A.Wk, A.Wv, { scale: "sqrtDk", causal: true });
  assert.equal(fmt(m.A[0][0]), "1.000");
  assert.equal(m.A[1][4], 0);
  assert.throws(() => {
    indexOf(A.tokens, "dog");
  }, /not in the sentence/);
});

test("position / handAngles / positionCos: clock hands and the similarity table", () => {
  const c = CFG.position;
  assert.deepEqual(handAngles(1, c.dim, c.base).map(fmt), ["1.000", "0.100", "0.010", "0.001"]);
  assert.deepEqual(position(0, c.dim, c.base), [0, 1, 0, 1, 0, 1, 0, 1]);
  assert.equal(position(1, c.dim, c.base)[0], Math.sin(1));
  assert.equal(position(1, c.dim, c.base)[1], Math.cos(1));
  const p10 = position(10, c.dim, c.base);
  const got = c.probes.map((k) => {
    return fmt(positionCos(p10, position(10 + k, c.dim, c.base)));
  });
  assert.deepEqual(got, ["0.884", "0.790", "0.493"]);
});

test("rnnHops / kept / sequentialSteps: near 5 steps (0.078), far 15 steps; attention 1", () => {
  const w = DATA.why;
  assert.equal(rnnHops(w.near, w.from, w.to), 5);
  assert.equal(rnnHops(w.far, w.from, w.to), 15);
  assert.equal(fmt(kept(CFG.why.keep, 5)), "0.078");
  assert.equal(sequentialSteps("rnn", w.near.length), 11);
  assert.equal(sequentialSteps("attention", w.far.length), 1);
  assert.throws(() => {
    sequentialSteps("x", 3);
  }, /unknown mode/);
  assert.throws(() => {
    rnnHops(w.near, "dog", w.to);
  }, /not in the sentence/);
});

test("seeded / layerNorm / relu: repeatable, mean 0, no negatives", () => {
  const b = CFG.block;
  assert.deepEqual(seeded(8, 2, 3, b.scale, b.burn), seeded(8, 2, 3, b.scale, b.burn));
  const n = layerNorm([[1, 2, 3, 6]], b.eps)[0];
  const mean = n.reduce((s, x) => {
    return s + x;
  }, 0) / n.length;
  assert.ok(Math.abs(mean) < 1e-12);
  assert.deepEqual(relu([[-1, 2]]), [[0, 2]]);
});

test("encoderBlock: every stage n × d_model except the FFN hidden layer; causal changes attention", () => {
  const b = CFG.block;
  const r = encoderBlock(DATA.block.X, b, b.base, false);
  for (const k of ["X0", "concat", "mha", "norm1", "ffn", "out"]) {
    assert.equal(shape(r[k]), "5 × 4", k);
  }
  assert.equal(shape(r.hidden), "5 × 8");
  assert.deepEqual(r.concat[2], [...r.heads[0].out[2], ...r.heads[1].out[2]]);
  assert.deepEqual(r.mha, matmul(r.concat, blockWeights(b).Wo));
  assert.deepEqual(r.norm1, layerNorm(addRows(r.X0, r.mha), b.eps));
  assert.deepEqual(r.out, layerNorm(addRows(r.norm1, r.ffn), b.eps));
  for (const rowOut of r.out) {
    const v = rowOut.reduce((acc, x) => {
      return acc + x * x;
    }, 0) / rowOut.length;
    assert.ok(Math.abs(v - 1) < 1e-3, String(v));
  }
  assert.deepEqual(addRows([[1, 2]], [[3, 4]]), [[4, 6]]);
  assert.equal(blockWeights(b).heads.length, b.heads);
  const d = encoderBlock(DATA.block.X, b, b.base, true);
  assert.equal(d.heads[0].A[0][1], 0);
  assert.notDeepEqual(d.out, r.out);
});

test("the try lists quote the numbers the code computes", () => {
  assert.ok(text("41_self_attention.text.js").includes("cute (0.538)"));
  assert.ok(text("41_self_attention.text.js").includes("teddy bear (0.600)"));
  assert.ok(text("41_self_attention.text.js").includes("เป็น 0.759"));
  assert.ok(text("42_position_encoding.text.js").includes("cos = 0.884 · กับ 15 = 0.790 · กับ 30 = 0.493"));
  assert.ok(text("40_transformer_why.text.js").includes("≈ 0.078"));
  assert.ok(text("40_transformer_why.text.js").includes("≈ " + kept(CFG.why.keep, 15).toFixed(4)));
  assert.ok(text("40_transformer_why.text.js").includes("(" + DATA.why.near.length + " หรือ " + DATA.why.far.length + ")"));
});

test("examples print what the logic computes", () => {
  const r = attention(A.X, A.Wq, A.Wk, A.Wv, { scale: "sqrtDk", causal: false });
  assert.ok(example("41_self_attention").includes("weights " + fmt(r.A[2]) + "  out " + fmt(r.out[2])));
  const b = encoderBlock(DATA.block.X, CFG.block, CFG.block.base, false);
  assert.ok(example("43_transformer_block").includes("teddy bear row " + fmt(b.out[2])));
  assert.ok(example("42_position_encoding").includes("PE(10) = " + fmt(position(10, CFG.position.dim, CFG.position.base))));
  const w = DATA.why;
  const ex40 = example("40_transformer_why");
  for (const t of [w.near, w.far]) {
    const h = rnnHops(t, w.from, w.to);
    assert.ok(ex40.includes("takes " + h + " steps, kept " + fmt(kept(CFG.why.keep, h))), String(h));
  }
  const ex42 = example("42_position_encoding");
  const p10 = position(10, CFG.position.dim, CFG.position.base);
  for (const k of CFG.position.probes) {
    assert.ok(ex42.includes("cos(PE(10), PE(" + (10 + k) + ")) = " + fmt(positionCos(p10, position(10 + k, CFG.position.dim, CFG.position.base)))), String(k));
  }
  const m = attention(A.X, A.Wq, A.Wk, A.Wv, { scale: "sqrtDk", causal: true });
  assert.ok(example("41_self_attention").includes("weights " + fmt(m.A[2])));
});

test("each chapter-10 lesson has one step per formula line (the app pairs them)", async () => {
  for (const f of ["40_transformer_why", "41_self_attention", "42_position_encoding", "43_transformer_block"]) {
    const m = await import(new URL("../web/lessons/" + f + ".text.js", import.meta.url));
    assert.equal(m.TEXT.steps.length, m.TEXT.lines.length, f);
  }
});
