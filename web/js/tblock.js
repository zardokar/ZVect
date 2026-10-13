// tblock.js — LOGICAL functions of chapter "LLM - Stanford" (10.x): RNN path vs attention, seeded weights, one transformer block.
// Pure: no DOM, no fetch, no globals. Config and toy data come in as arguments (web/data/transformer.json).
import { matmul, attention, position } from "./attention.js";

const MODULUS = 2147483647;   // minstd: x = x * 48271 mod (2^31 - 1), same as the examples
const MULTIPLIER = 48271;

// RNN: information from token `from` reaches token `to` only through the hidden state, one step per token in between
export function rnnHops(tokens, from, to) {
  const a = tokens.indexOf(from);
  const b = tokens.indexOf(to);
  if (a < 0 || b < 0) {
    throw new Error("token not in the sentence");
  }
  return Math.abs(a - b);
}

// toy: the share of the old signal still in the hidden state after `hops` steps if every step keeps `keep` of it
export function kept(keep, hops) {
  return Math.pow(keep, hops);
}

// steps that must run one after another to read n tokens: RNN n, one attention layer 1 (all tokens at once)
export function sequentialSteps(mode, n) {
  if (mode === "rnn") {
    return n;
  }
  if (mode === "attention") {
    return 1;
  }
  throw new Error("unknown mode: " + mode);
}

// a repeatable rows x cols matrix of values in [-scale, scale] (minstd, first `burn` numbers thrown away)
export function seeded(seed, rows, cols, scale, burn) {
  let state = seed;
  const next = () => {
    state = (state * MULTIPLIER) % MODULUS;
    return state;
  };
  for (let i = 0; i < burn; i++) {
    next();
  }
  const M = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(((next() / MODULUS) * 2 - 1) * scale);
    }
    M.push(row);
  }
  return M;
}

export function addRows(A, B) {
  return A.map((row, i) => {
    return row.map((x, j) => {
      return x + B[i][j];
    });
  });
}

// layer norm per row: mean 0, variance 1 (no learned gain / bias in this toy)
export function layerNorm(A, eps) {
  return A.map((row) => {
    const mean = row.reduce((s, x) => {
      return s + x;
    }, 0) / row.length;
    const v = row.reduce((s, x) => {
      return s + (x - mean) * (x - mean);
    }, 0) / row.length;
    return row.map((x) => {
      return (x - mean) / Math.sqrt(v + eps);
    });
  });
}

export function relu(A) {
  return A.map((row) => {
    return row.map((x) => {
      return Math.max(0, x);
    });
  });
}

// all weights of one block from the config seeds: per head W_Q, W_K, W_V (d_model x d_k), W_O, FFN W1, W2
export function blockWeights(b) {
  const heads = [];
  for (let h = 0; h < b.heads; h++) {
    const s = b.seed + 10 * h;
    heads.push({ Wq: seeded(s + 1, b.dModel, b.dK, b.scale, b.burn), Wk: seeded(s + 2, b.dModel, b.dK, b.scale, b.burn),
      Wv: seeded(s + 3, b.dModel, b.dK, b.scale, b.burn) });
  }
  const Wo = seeded(b.seed + 101, b.heads * b.dK, b.dModel, b.scale, b.burn);
  const W1 = seeded(b.seed + 102, b.dModel, b.dFF, b.scale, b.burn);
  const W2 = seeded(b.seed + 103, b.dFF, b.dModel, b.scale, b.burn);
  return { heads, Wo, W1, W2 };
}

// one encoder block, every stage kept: + position -> multi-head attention -> W_O -> add & norm -> FFN -> add & norm
export function encoderBlock(X, b, base, causal) {
  const P = X.map((_, i) => {
    return position(i, b.dModel, base);
  });
  const X0 = addRows(X, P);
  const W = blockWeights(b);
  const heads = W.heads.map((h) => {
    return attention(X0, h.Wq, h.Wk, h.Wv, { scale: "sqrtDk", causal });
  });
  const concat = X0.map((_, i) => {
    return heads.flatMap((h) => {
      return h.out[i];
    });
  });
  const mha = matmul(concat, W.Wo);
  const norm1 = layerNorm(addRows(X0, mha), b.eps);
  const hidden = relu(matmul(norm1, W.W1));
  const ffn = matmul(hidden, W.W2);
  const out = layerNorm(addRows(norm1, ffn), b.eps);
  return { P, X0, heads, concat, mha, norm1, hidden, ffn, out };
}

// the shape of a matrix as "rows × cols"
export function shape(A) {
  return A.length + " × " + A[0].length;
}
