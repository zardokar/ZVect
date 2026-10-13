// sampling.js — LOGIC: next-token probabilities of view V7 (plan §3.3): temperature, top-k, top-p (rule A, owner Q11),
// the values of the formula card, and a seeded draw + argmax (owner Q14). Pure, no DOM.
import { softmax, lcgUniform } from "./tmath.js";

export function scaleLogits(logits, T) {
  return logits.map((z) => {
    return z / T;
  });
}

export function softmaxT(logits, T) {
  return softmax(scaleLogits(logits, T));
}

// indexes from the most to the least likely; equal values keep the earlier index first (stable)
export function rankOrder(probs) {
  return probs.map((_, i) => {
    return i;
  }).sort((a, b) => {
    return probs[b] - probs[a] || a - b;
  });
}

function keepFirst(probs, count) {
  const keep = probs.map(() => {
    return false;
  });
  rankOrder(probs).slice(0, count).forEach((i) => {
    keep[i] = true;
  });
  return keep;
}

// keep exactly k (or all when fewer); a tie at the boundary goes to the earlier vocab index
export function topK(probs, k) {
  return keepFirst(probs, k);
}

// rule A: the smallest set of the most likely tokens whose sum reaches p (eps absorbs float error); at least one
export function topP(probs, p, eps) {
  let cum = 0;
  let count = 0;
  for (const i of rankOrder(probs)) {
    cum += probs[i];
    count++;
    if (cum >= p - eps) {
      break;
    }
  }
  return keepFirst(probs, count);
}

// kept probabilities scaled to add up to 1, dropped ones 0
export function renormalize(probs, keep) {
  const total = probs.reduce((s, x, i) => {
    return keep[i] ? s + x : s;
  }, 0);
  return probs.map((x, i) => {
    return keep[i] ? x / total : 0;
  });
}

export function argmax(xs) {
  let best = 0;
  xs.forEach((x, i) => {
    if (x > xs[best]) {
      best = i;
    }
  });
  return best;
}

// every value of the formula card: logit / T -> softmax -> filter -> renormalize; mode "none" | "topk" | "topp"
export function sampleSteps(logits, opts, eps) {
  const scaled = scaleLogits(logits, opts.temperature);
  const probs = softmax(scaled);
  const filters = {
    none: () => {
      return probs.map(() => {
        return true;
      });
    },
    topk: () => {
      return topK(probs, opts.k);
    },
    topp: () => {
      return topP(probs, opts.p, eps);
    },
  };
  if (!Object.hasOwn(filters, opts.mode)) {
    throw new Error("tviz: unknown sampling mode: " + opts.mode);
  }
  const keep = filters[opts.mode]();
  const final = renormalize(probs, keep);
  return { scaled, probs, keep, final, order: rankOrder(probs), argmax: argmax(final) };
}

// seeded draw from the final probabilities: u from minstd, first index whose running sum passes u; returns the next state
export function drawIndex(final, state) {
  const r = lcgUniform(state);
  let cum = 0;
  let index = argmax(final);
  for (let i = 0; i < final.length; i++) {
    cum += final[i];
    if (final[i] > 0 && r.u < cum) {
      index = i;
      break;
    }
  }
  return { index, u: r.u, state: r.state };
}
