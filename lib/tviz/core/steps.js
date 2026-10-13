// steps.js — LOGIC: the 7 attention steps of plan §3.2 (what each shows, which exist in this trace), player moves,
// the block stages of view V6, and a head summary for the head grid. Pure, no DOM. labelKey -> text steps / stages.

export const STEP_IDS = ["x", "qkv", "raw", "scaled", "mask", "softmax", "out"];

function has(...matrices) {
  return matrices.every((M) => {
    return Array.isArray(M);
  });
}

// one entry per step: { index, id, labelKey, enabled, skip, matrices }; causal off -> "mask: off" (listed, skipped)
export function attentionSteps(layer, head) {
  const x = layer.X0 ? "X0" : "X";
  const causal = Boolean(head.causal);
  const rows = [
    { enabled: has(layer[x]), matrices: [x] },
    { enabled: has(head.Q, head.K, head.V), matrices: ["Q", "K", "V"] },
    { enabled: has(head.raw), matrices: ["raw"] },
    { enabled: has(head.scaled), matrices: ["scaled"] },
    { enabled: causal ? has(head.S) : has(head.scaled), matrices: [causal ? "S" : "scaled"] },
    { enabled: has(head.A), matrices: ["A"] },
    { enabled: has(head.out), matrices: ["out"] },
  ];
  return rows.map((r, index) => {
    const id = STEP_IDS[index];
    const maskOff = id === "mask" && !causal;
    return { index, id, labelKey: maskOff ? "maskOff" : id, enabled: r.enabled, skip: maskOff, matrices: r.matrices };
  });
}

// indexes the player may stop at (enabled and not skipped)
export function playable(steps) {
  return steps.filter((s) => {
    return s.enabled && !s.skip;
  }).map((s) => {
    return s.index;
  });
}

export function firstStep(steps) {
  const p = playable(steps);
  return p.length ? p[0] : null;
}

export function lastStep(steps) {
  const p = playable(steps);
  return p.length ? p[p.length - 1] : null;
}

// the next playable step from `current` in direction dir (+1 / -1); stays at current when there is none
export function nextStep(steps, current, dir) {
  const p = playable(steps);
  const ahead = dir > 0 ? p.filter((i) => {
    return i > current;
  }) : p.filter((i) => {
    return i < current;
  }).reverse();
  return ahead.length ? ahead[0] : current;
}

function shapeOrNull(M) {
  return Array.isArray(M) ? { rows: M.length, cols: M[0].length } : null;
}

// the five columns of V6: name (text key), matrix key, residual source, shape, enabled
export function blockStages(layer) {
  const b = layer.block || {};
  const cols = [
    { name: "x0", M: layer.X0, residualFrom: null },
    { name: "mha", M: b.mha, residualFrom: null },
    { name: "norm1", M: b.norm1, residualFrom: "x0" },
    { name: "ffn", M: b.hidden, residualFrom: null },
    { name: "out", M: b.out, residualFrom: "norm1" },
  ];
  return cols.map((c) => {
    return { name: c.name, residualFrom: c.residualFrom, shape: shapeOrNull(c.M), enabled: Array.isArray(c.M) };
  });
}

// max weight and mean row entropy in nats (0 = every row looks at one token, ln n = evenly spread)
export function headSummary(A) {
  let max = 0;
  let total = 0;
  for (const row of A) {
    let h = 0;
    for (const p of row) {
      max = Math.max(max, p);
      h -= p > 0 ? p * Math.log(p) : 0;
    }
    total += h;
  }
  return { max, entropy: total / A.length + 0 };
}
