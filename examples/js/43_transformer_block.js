// 43 One transformer block: X + PE -> 2-head self-attention -> concat x W_O -> add & layer norm -> FFN (ReLU) -> add & norm.
// Every stage keeps n x d_model (5 x 4) except the FFN hidden layer (5 x 8). Structure from Stanford CME295 Lecture 1;
// sizes, input rows and random weights (minstd seeds) chosen by the author, so the numbers carry no meaning.
import { fmt } from "../../lib/zvect.js";

const X = [[0.2, 0.2, 0.1, 0.0], [2.0, 0.4, 0.2, 0.1], [0.6, 2.0, 0.4, 0.2], [0.2, 0.2, 0.6, 0.1], [0.4, 0.6, 2.0, 0.3]];
const dModel = 4;
const heads = 2;
const dK = 2;
const dFF = 8;
const seed = 7;
const span = 0.8;

function seeded(s, rows, cols) {
  let state = s;
  for (let i = 0; i < 10; i++) {
    state = (state * 48271) % 2147483647;   // minstd; the first 10 numbers are thrown away
  }
  const M = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      state = (state * 48271) % 2147483647;
      row.push(((state / 2147483647) * 2 - 1) * span);
    }
    M.push(row);
  }
  return M;
}

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

function add(A, B) {
  return A.map((row, i) => {
    return row.map((x, j) => {
      return x + B[i][j];
    });
  });
}

function norm(A) {
  const out = [];
  for (const row of A) {
    let mean = 0;
    for (const x of row) {
      mean += x;
    }
    mean /= row.length;
    let v = 0;
    for (const x of row) {
      v += (x - mean) * (x - mean);
    }
    v /= row.length;
    out.push(row.map((x) => {
      return (x - mean) / Math.sqrt(v + 0.00001);
    }));
  }
  return out;
}

function head(X0, h) {
  const s = seed + 10 * h;
  const Q = matmul(X0, seeded(s + 1, dModel, dK));
  const K = matmul(X0, seeded(s + 2, dModel, dK));
  const V = matmul(X0, seeded(s + 3, dModel, dK));
  const A = [];
  for (let i = 0; i < Q.length; i++) {
    const sc = [];
    for (let j = 0; j < K.length; j++) {
      let d = 0;
      for (let c = 0; c < dK; c++) {
        d += Q[i][c] * K[j][c];
      }
      sc.push(d / Math.sqrt(dK));
    }
    const top = Math.max(...sc);
    const e = sc.map((x) => {
      return Math.exp(x - top);
    });
    let total = 0;
    for (const x of e) {
      total += x;
    }
    A.push(e.map((x) => {
      return x / total;
    }));
  }
  return matmul(A, V);
}

const X0 = X.map((row, p) => {
  return row.map((x, i) => {
    const angle = p / Math.pow(10000, (i - (i % 2)) / dModel);
    return x + (i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
  });
});
const outs = [];
for (let h = 0; h < heads; h++) {
  outs.push(head(X0, h));
}
const concat = X0.map((_, i) => {
  return outs[0][i].concat(outs[1][i]);
});
const mha = matmul(concat, seeded(seed + 101, heads * dK, dModel));
const norm1 = norm(add(X0, mha));
const hidden = matmul(norm1, seeded(seed + 102, dModel, dFF)).map((row) => {
  return row.map((x) => {
    return Math.max(0, x);
  });
});
const ffn = matmul(hidden, seeded(seed + 103, dFF, dModel));
const out = norm(add(norm1, ffn));
for (const [name, M] of [["X + PE", X0], ["concat", concat], ["x W_O", mha], ["add & norm", norm1], ["FFN hidden", hidden], ["FFN out", ffn], ["block out", out]]) {
  console.log(name.padEnd(11) + M.length + " x " + M[0].length + "  teddy bear row " + fmt(M[2]));
}
