// validate.js — LOGIC: contract guards of plan §4.3. Returns { ok, errors: [{ key, path, vars }] }; keys -> text/*.json errors.
// Pure, no DOM; never throws on bad input. Limits come from config.limits.
import { isObject, finite, present, createCollector } from "./guards.js";

const POSITIONS = ["sincos", "none"];
const SCALES = ["sqrtDk", "none"];
const BOOLS = [true, false];
const SEED_INTS = ["seed", "dModel", "heads", "dK", "dFF"];
const SEED_NUMS = ["scale", "eps", "base"];
const HEAD_SCORES = ["raw", "scaled", "S"];
const HEAD_ROWS = ["Q", "K", "V", "out"];
const BLOCK_KEYS = ["concat", "mha", "norm1", "hidden", "ffn", "out"];

function checkTokens(c, tokens, max) {
  if (!Array.isArray(tokens) || tokens.length === 0) {
    c.add("tokensMissing", "tokens");
  } else if (tokens.length > max) {
    c.add("tooManyTokens", "tokens", { max });
  } else if (!tokens.every((t) => {
    return typeof t === "string";
  })) {
    c.add("tokenNotString", "tokens");
  } else {
    return true;
  }
  return false;
}

function checkSeed(c, s, limits) {
  for (const k of SEED_INTS) {
    if (s[k] !== undefined && !(Number.isInteger(s[k]) && s[k] >= 1)) {
      c.add("badInt", "seed." + k, { min: 1 });
    }
  }
  if (Number.isInteger(s.heads) && s.heads > limits.maxHeadsPerLayer) {
    c.add("tooMany", "seed.heads", { max: limits.maxHeadsPerLayer });
  }
  if (s.burn !== undefined && !(Number.isInteger(s.burn) && s.burn >= 0)) {
    c.add("badInt", "seed.burn", { min: 0 });
  }
  for (const k of SEED_NUMS) {
    if (s[k] !== undefined && !finite(s[k])) {
      c.add("badNumber", "seed." + k);
    }
  }
  c.oneOf(s.causal, BOOLS, "seed.causal");
}

function checkWeights(c, w, n, limits) {
  if (!c.matrix(w.X, "weights.X", n, null) || !c.list(w.heads, "weights.heads", limits.maxHeadsPerLayer)) {
    return;
  }
  const d = w.X[0].length;
  const dk = Array.isArray(w.heads[0].Wq) && Array.isArray(w.heads[0].Wq[0]) ? w.heads[0].Wq[0].length : null;
  w.heads.forEach((h, i) => {
    for (const k of ["Wq", "Wk", "Wv"]) {
      c.matrix(h[k], "weights.heads[" + i + "]." + k, d, dk);
    }
  });
  const given = ["Wo", "W1", "W2"].filter((k) => {
    return present(w[k]);
  });
  if (given.length > 0 && given.length < 3) {
    c.add("blockPartial", "weights");
  } else if (given.length === 3 && dk !== null) {
    c.matrix(w.Wo, "weights.Wo", w.heads.length * dk, d);
    if (c.matrix(w.W1, "weights.W1", d, null)) {
      c.matrix(w.W2, "weights.W2", w.W1[0].length, d);
    }
  }
  c.oneOf(w.position, POSITIONS, "weights.position");
  c.oneOf(w.scale, SCALES, "weights.scale");
  c.oneOf(w.causal, BOOLS, "weights.causal");
  for (const k of ["base", "eps"]) {
    if (w[k] !== undefined && !finite(w[k])) {
      c.add("badNumber", "weights." + k);
    }
  }
}

function checkHead(c, h, path, n, tolerance) {
  if (!present(h.A)) {
    c.add("missingA", path);
  } else if (c.matrix(h.A, path + ".A", n, n)) {
    const bad = h.A.some((row) => {
      const sum = row.reduce((s, x) => {
        return s + x;
      }, 0);
      return Math.abs(sum - 1) > tolerance;
    });
    if (bad) {
      c.add("rowSum", path + ".A");
    }
  }
  for (const k of HEAD_SCORES) {
    if (present(h[k])) {
      c.matrix(h[k], path + "." + k, n, n, k === "S");
    }
  }
  for (const k of HEAD_ROWS) {
    if (present(h[k])) {
      c.matrix(h[k], path + "." + k, n, null);
    }
  }
}

function checkTrace(c, t, n, limits) {
  if (!c.list(t.layers, "trace.layers", limits.maxLayers)) {
    return;
  }
  t.layers.forEach((L, l) => {
    const path = "trace.layers[" + l + "]";
    for (const k of ["X", "P", "X0"]) {
      if (present(L[k])) {
        c.matrix(L[k], path + "." + k, n, null);
      }
    }
    if (c.list(L.heads, path + ".heads", limits.maxHeadsPerLayer)) {
      L.heads.forEach((h, i) => {
        checkHead(c, isObject(h) ? h : {}, path + ".heads[" + i + "]", n, limits.rowSumTolerance);
      });
    }
    for (const k of BLOCK_KEYS) {
      if (isObject(L.block) && present(L.block[k])) {
        c.matrix(L.block[k], path + ".block." + k, n, null);
      }
    }
  });
}

function checkNext(c, next, path, limits) {
  if (!c.list(next.vocab, path + ".vocab", limits.maxVocab)) {
    return;
  }
  if (!next.vocab.every((v) => {
    return typeof v === "string";
  })) {
    c.add("tokenNotString", path + ".vocab");
  }
  if (!Array.isArray(next.logits) || next.logits.length !== next.vocab.length) {
    c.add("lengthMismatch", path + ".logits", { want: next.vocab.length, got: Array.isArray(next.logits) ? next.logits.length : 0 });
  } else if (!next.logits.every(finite)) {
    c.add("notFinite", path + ".logits");
  }
}

// the whole input of plan §4.3: tokens + exactly one of trace / weights / seed (+ optional next)
export function validate(input, config) {
  const c = createCollector();
  const limits = config.limits;
  if (!isObject(input)) {
    c.add("notObject", "input");
    return { ok: false, errors: c.errors };
  }
  const tokensOk = checkTokens(c, input.tokens, limits.maxTokens);
  const given = ["trace", "weights", "seed"].filter((k) => {
    return present(input[k]);
  });
  if (given.length === 0) {
    c.add("sourceNone", "input");
  } else if (given.length > 1) {
    c.add("sourceMany", "input");
  } else if (!isObject(input[given[0]])) {
    c.add("notObject", given[0]);
  } else if (given[0] === "seed") {
    checkSeed(c, input.seed, limits);
  } else if (tokensOk && given[0] === "weights") {
    checkWeights(c, input.weights, input.tokens.length, limits);
  } else if (tokensOk) {
    checkTrace(c, input.trace, input.tokens.length, limits);
  }
  for (const [next, path] of [[input.next, "next"], [isObject(input.trace) ? input.trace.next : null, "trace.next"]]) {
    if (isObject(next)) {
      checkNext(c, next, path, limits);
    }
  }
  return { ok: c.errors.length === 0, errors: c.errors };
}
