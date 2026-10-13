// attention.js — LOGICAL functions of chapter "LLM - Stanford" (10.x): matrices, softmax, self-attention, mask, positions.
// Pure: no DOM, no fetch, no globals. Config and toy data come in as arguments (web/data/transformer.json).
import { dot } from "../../lib/zvect.js";

// rows x cols, row-major: A (n x m) times B (m x p) = n x p
export function matmul(A, B) {
  const p = B[0].length;
  return A.map((row) => {
    const out = new Array(p).fill(0);
    row.forEach((a, k) => {
      for (let j = 0; j < p; j++) {
        out[j] += a * B[k][j];
      }
    });
    return out;
  });
}

export function transpose(A) {
  return A[0].map((_, j) => {
    return A.map((row) => {
      return row[j];
    });
  });
}

// each row becomes weights > 0 that add up to 1; -Infinity (masked) becomes exactly 0
export function softmaxRows(S) {
  return S.map((row) => {
    const top = Math.max(...row);
    const ex = row.map((x) => {
      return x === -Infinity ? 0 : Math.exp(x - top);
    });
    const total = ex.reduce((s, x) => {
      return s + x;
    }, 0);
    return ex.map((x) => {
      return x / total;
    });
  });
}

// causal mask: position i may only look at positions 0..i (later ones become -Infinity)
export function causalMask(S) {
  return S.map((row, i) => {
    return row.map((x, j) => {
      return j <= i ? x : -Infinity;
    });
  });
}

// the divisor of the scores: "sqrtDk" = sqrt(d_k) as in the paper, "none" = 1 (to see why the scaling is there)
export function scoreDivisor(mode, dk) {
  if (mode === "sqrtDk") {
    return Math.sqrt(dk);
  }
  if (mode === "none") {
    return 1;
  }
  throw new Error("unknown score scale: " + mode);
}

// one head of scaled dot-product attention: softmax(Q K^T / sqrt(d_k)) V, every step kept for the live box
export function attention(X, Wq, Wk, Wv, opts) {
  const Q = matmul(X, Wq);
  const K = matmul(X, Wk);
  const V = matmul(X, Wv);
  const k = scoreDivisor(opts.scale, K[0].length);
  const raw = matmul(Q, transpose(K));
  const scaled = raw.map((row) => {
    return row.map((x) => {
      return x / k;
    });
  });
  const S = opts.causal ? causalMask(scaled) : scaled;
  const A = softmaxRows(S);
  return { Q, K, V, raw, S, A, out: matmul(A, V) };
}

// sinusoidal position vector of length d: (sin, cos) pairs whose angle turns slower for every next pair (clock hands)
export function position(pos, d, base) {
  const out = [];
  for (let i = 0; i < d; i += 2) {
    const angle = pos / Math.pow(base, i / d);
    out.push(Math.sin(angle));
    if (i + 1 < d) {
      out.push(Math.cos(angle));
    }
  }
  return out;
}

// the angle (radians) of every clock hand = every (sin, cos) pair at a position
export function handAngles(pos, d, base) {
  const out = [];
  for (let i = 0; i < d; i += 2) {
    out.push(pos / Math.pow(base, i / d));
  }
  return out;
}

// cosine similarity of two position vectors (same length)
export function positionCos(a, b) {
  return dot(a, b) / Math.sqrt(dot(a, a) * dot(b, b));
}

// index of a token in a sentence; a missing token throws
export function indexOf(tokens, t) {
  const i = tokens.indexOf(t);
  if (i < 0) {
    throw new Error("token not in the sentence: " + t);
  }
  return i;
}
