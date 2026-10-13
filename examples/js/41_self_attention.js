// 41 Self-attention, the full formula: A = softmax(Q K^T / sqrt(d_k)), out = A V, with Q = X Wq, K = X Wk, V = X Wv.
// Formula from Stanford CME295 Lecture 1; the 5 tokens are the lecture's sentence, every number is made up by the author
// (Wq swaps dims 1 and 2, Wk = Wv = I). Also: no scaling (peakier weights) and the decoder's causal mask (later tokens get 0).
import { fmt } from "../../lib/zvect.js";

const tokens = ["A", "cute", "teddy bear", "is", "reading"];
const X = [[0.2, 0.2, 0.1], [2.0, 0.4, 0.2], [0.6, 2.0, 0.4], [0.2, 0.2, 0.6], [0.4, 0.6, 2.0]];
const Wq = [[0, 1, 0], [1, 0, 0], [0, 0, 1]];
const Wk = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
const Wv = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

function matmul(A, B) {
  const out = [];
  for (const row of A) {
    const r = new Array(B[0].length).fill(0);
    for (let k = 0; k < row.length; k++) {
      for (let j = 0; j < r.length; j++) {
        r[j] += row[k] * B[k][j];
      }
    }
    out.push(r);
  }
  return out;
}

function attend(scaled, causal) {
  const Q = matmul(X, Wq);
  const K = matmul(X, Wk);
  const V = matmul(X, Wv);
  const div = scaled ? Math.sqrt(K[0].length) : 1;
  const A = [];
  for (let i = 0; i < Q.length; i++) {
    const s = [];
    for (let j = 0; j < K.length; j++) {
      let d = 0;
      for (let c = 0; c < K[j].length; c++) {
        d += Q[i][c] * K[j][c];
      }
      s.push(causal && j > i ? -Infinity : d / div);
    }
    const top = Math.max(...s);
    const e = s.map((x) => {
      return x === -Infinity ? 0 : Math.exp(x - top);
    });
    const total = e.reduce((a, b) => {
      return a + b;
    }, 0);
    A.push(e.map((x) => {
      return x / total;
    }));
  }
  return [A, matmul(A, V)];
}

for (const [title, scaled, causal] of [["scaled by sqrt(d_k)", true, false], ["not scaled", false, false], ["scaled + causal mask", true, true]]) {
  const [A, out] = attend(scaled, causal);
  console.log(title);
  for (let i = 0; i < tokens.length; i++) {
    console.log("  " + tokens[i].padEnd(11) + " weights " + fmt(A[i]) + "  out " + fmt(out[i]));
  }
}
