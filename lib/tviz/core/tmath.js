// tmath.js — LOGIC: matrix math of tviz (own copy, owner Q3 a). Pure: no DOM, no fetch, no globals.
// Same formulas and the same operation order as ZVect web/js/attention.js + tblock.js, so the numbers match bit for bit
// (tests/tviz_zvect.test.js). Matrices are row-major arrays of rows.

const MODULUS = 2147483647;
const MULTIPLIER = 48271;

// A (n x m) times B (m x p) = n x p
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

export function addRows(A, B) {
  return A.map((row, i) => {
    return row.map((x, j) => {
      return x + B[i][j];
    });
  });
}

// every value divided by d (division, not a multiply by 1/d, to stay equal to attention.js)
export function divideAll(A, d) {
  return A.map((row) => {
    return row.map((x) => {
      return x / d;
    });
  });
}

// rows of several matrices side by side: [[n x a], [n x b]] -> n x (a + b)
export function concatRows(parts) {
  return parts[0].map((_, i) => {
    return parts.flatMap((M) => {
      return M[i];
    });
  });
}

export function shapeOf(A) {
  const rows = Array.isArray(A) ? A.length : 0;
  const cols = rows && Array.isArray(A[0]) ? A[0].length : 0;
  return { rows, cols };
}

// weights > 0 that add up to 1; the max is subtracted first so large inputs do not overflow; -Infinity -> exactly 0
export function softmax(row) {
  const top = Math.max(...row);
  if (top === -Infinity) {
    return row.map(() => {
      return 0;
    });
  }
  const ex = row.map((x) => {
    return x === -Infinity ? 0 : Math.exp(x - top);
  });
  const total = ex.reduce((s, x) => {
    return s + x;
  }, 0);
  return ex.map((x) => {
    return x / total;
  });
}

export function softmaxRows(S) {
  return S.map((row) => {
    return softmax(row);
  });
}

// causal mask: position i may look at positions 0..i only (later ones become -Infinity)
export function causalMask(S) {
  return S.map((row, i) => {
    return row.map((x, j) => {
      return j <= i ? x : -Infinity;
    });
  });
}

// divisor of the scores: "sqrtDk" = sqrt(d_k) as in the paper, "none" = 1
export function scoreDivisor(mode, dk) {
  if (mode === "sqrtDk") {
    return Math.sqrt(dk);
  }
  if (mode === "none") {
    return 1;
  }
  throw new Error("tviz: unknown score scale: " + mode);
}

// layer norm per row: mean 0, variance 1 (no learned gain / bias)
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

// one minstd step: x -> x * 48271 mod (2^31 - 1)
export function lcgNext(state) {
  return (state * MULTIPLIER) % MODULUS;
}

// state -> uniform number in [0, 1); a state of 0 (or any multiple of the modulus) would stick, so it becomes 1
export function lcgUniform(state) {
  const start = ((Math.floor(state) % MODULUS) + MODULUS) % MODULUS || 1;
  const next = lcgNext(start);
  return { u: next / MODULUS, state: next };
}

// a repeatable rows x cols matrix of values in [-scale, scale] (minstd, first `burn` numbers thrown away)
export function seeded(seed, rows, cols, scale, burn) {
  let state = seed;
  for (let i = 0; i < burn; i++) {
    state = lcgNext(state);
  }
  const M = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      state = lcgNext(state);
      row.push(((state / MODULUS) * 2 - 1) * scale);
    }
    M.push(row);
  }
  return M;
}

// sinusoidal position vector of length d: (sin, cos) pairs, angle = pos / base^(i/d)
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

// n x d matrix of position vectors for positions 0..n-1
export function positions(n, d, base) {
  const P = [];
  for (let i = 0; i < n; i++) {
    P.push(position(i, d, base));
  }
  return P;
}
