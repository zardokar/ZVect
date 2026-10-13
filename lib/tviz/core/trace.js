// trace.js — LOGIC: input (trace | weights | seed) -> one trace object every view reads (plan §4.3). Pure, no DOM.
// Masked scores are -Infinity inside and null in JSON. Missing trace matrices stay null: nothing is invented (R7).
import {
  matmul, transpose, addRows, divideAll, concatRows, softmaxRows, causalMask, scoreDivisor, layerNorm, relu, seeded, positions,
} from "./tmath.js";

const HEAD_KEYS = ["Q", "K", "V", "raw", "scaled", "S", "A", "out"];
const BLOCK_KEYS = ["concat", "mha", "norm1", "hidden", "ffn", "out"];

function copyMatrix(M) {
  return M.map((row) => {
    return row.slice();
  });
}

// JSON null (masked) -> -Infinity
export function maskedFromJSON(M) {
  return M.map((row) => {
    return row.map((x) => {
      return x === null ? -Infinity : x;
    });
  });
}

// -Infinity (masked) -> null, so the matrix survives JSON.stringify
export function maskedToJSON(M) {
  return M.map((row) => {
    return row.map((x) => {
      return x === -Infinity ? null : x;
    });
  });
}

// one head of scaled dot-product attention, every step kept: softmax(mask(Q K^T / divisor)) V
export function headAttention(X, Wq, Wk, Wv, opts) {
  const Q = matmul(X, Wq);
  const K = matmul(X, Wk);
  const V = matmul(X, Wv);
  const dk = K[0].length;
  const raw = matmul(Q, transpose(K));
  const scaled = divideAll(raw, scoreDivisor(opts.scale, dk));
  const S = opts.causal ? causalMask(scaled) : scaled;
  const A = softmaxRows(S);
  return { Q, K, V, raw, scaled, S, A, out: matmul(A, V), dk, causal: Boolean(opts.causal) };
}

// seed object -> weights of plan §4.3 (seed offsets = ZVect blockWeights, see config seedPlan)
export function weightsFromSeed(s, n, plan) {
  const make = (offset, rows, cols) => {
    return seeded(s.seed + offset, rows, cols, s.scale, s.burn);
  };
  const heads = [];
  for (let h = 0; h < s.heads; h++) {
    const base = plan.headStride * h;
    heads.push({ Wq: make(base + plan.q, s.dModel, s.dK), Wk: make(base + plan.k, s.dModel, s.dK), Wv: make(base + plan.v, s.dModel, s.dK) });
  }
  return {
    X: make(plan.x, n, s.dModel),
    heads,
    Wo: make(plan.wo, s.heads * s.dK, s.dModel),
    W1: make(plan.w1, s.dModel, s.dFF),
    W2: make(plan.w2, s.dFF, s.dModel),
    position: "sincos",
    base: s.base,
    eps: s.eps,
    causal: Boolean(s.causal),
    scale: "sqrtDk",
  };
}

// the block stages of ZVect encoderBlock: W_O -> add & norm -> FFN -> add & norm (null without Wo / W1 / W2)
function blockOf(X0, heads, w) {
  if (!w.Wo || !w.W1 || !w.W2) {
    return null;
  }
  const concat = concatRows(heads.map((h) => {
    return h.out;
  }));
  const mha = matmul(concat, w.Wo);
  const norm1 = layerNorm(addRows(X0, mha), w.eps);
  const hidden = relu(matmul(norm1, w.W1));
  const ffn = matmul(hidden, w.W2);
  const out = layerNorm(addRows(norm1, ffn), w.eps);
  return { concat, mha, norm1, hidden, ffn, out };
}

// weights -> { layers: [one layer] } with every stage computed (defaults: no position, sqrt(d_k), not causal)
export function traceFromWeights(w) {
  const X = w.X;
  const P = w.position === "sincos" ? positions(X.length, X[0].length, w.base) : null;
  const X0 = P ? addRows(X, P) : X;
  const opts = { scale: w.scale || "sqrtDk", causal: Boolean(w.causal) };
  const heads = w.heads.map((h) => {
    return headAttention(X0, h.Wq, h.Wk, h.Wv, opts);
  });
  return { layers: [{ X, P, X0, heads, block: blockOf(X0, heads, w) }] };
}

function headFromJSON(h) {
  const out = { dk: Number.isFinite(h.dk) ? h.dk : null, causal: Boolean(h.causal) };
  for (const k of HEAD_KEYS) {
    out[k] = Array.isArray(h[k]) ? maskedFromJSON(h[k]) : null;
  }
  if (!out.scaled && out.S && !out.causal) {
    out.scaled = copyMatrix(out.S);
  }
  return out;
}

function blockFromJSON(b) {
  if (!b) {
    return null;
  }
  const out = {};
  for (const k of BLOCK_KEYS) {
    out[k] = Array.isArray(b[k]) ? copyMatrix(b[k]) : null;
  }
  return out;
}

function matrixOrNull(M) {
  return Array.isArray(M) ? copyMatrix(M) : null;
}

function copyNext(next) {
  return next ? { vocab: next.vocab.slice(), logits: next.logits.slice() } : null;
}

// a JSON trace -> the inside form (copies; null -> -Infinity; missing -> null)
export function normalizeTrace(raw, tokens) {
  const layers = raw.layers.map((L) => {
    const X = matrixOrNull(L.X);
    const X0 = matrixOrNull(L.X0) || X;
    return { X, P: matrixOrNull(L.P), X0, heads: L.heads.map(headFromJSON), block: blockFromJSON(L.block) };
  });
  return { version: 1, source: "trace", tokens: tokens.slice(), layers, next: copyNext(raw.next) };
}

// the inside form -> JSON-safe trace (masked -Infinity -> null)
export function exportTrace(t) {
  const layers = t.layers.map((L) => {
    const heads = L.heads.map((h) => {
      const out = { dk: h.dk, causal: h.causal };
      for (const k of HEAD_KEYS) {
        out[k] = h[k] ? maskedToJSON(h[k]) : null;
      }
      return out;
    });
    return { X: L.X, P: L.P, X0: L.X0, heads, block: L.block };
  });
  return { version: 1, tokens: t.tokens, layers, next: t.next };
}

// input (already validated) -> trace; missing seed keys and weights base / eps come from config.seed;
// input.next (vocab + logits) rides along in weights / seed mode
export function buildTrace(input, config) {
  if (input.trace) {
    return normalizeTrace(input.trace, input.tokens);
  }
  const source = input.weights ? "weights" : "seed";
  const given = input.weights ? { base: config.seed.base, eps: config.seed.eps, ...input.weights } : null;
  const w = given || weightsFromSeed({ ...config.seed, ...input.seed }, input.tokens.length, config.seedPlan);
  const built = traceFromWeights(w);
  return { version: 1, source, tokens: input.tokens.slice(), layers: built.layers, next: copyNext(input.next) };
}
