// 29 ANN with a one-layer neighbour graph: link each point to its M nearest, then walk greedily from a start point:
// step to the neighbour closest to q while it is closer; stop when no neighbour is closer.
import { distance, fmt } from "../../lib/zvect.js";

const P = [
  [0.9, 0.1, 0.0], [0.8, 0.2, 0.1], [1.0, 0.0, 0.1], [0.7, 0.1, 0.2], [0.9, 0.3, 0.0], [0.6, 0.2, 0.1], [0.8, 0.0, 0.3], [0.55, 0.45, 0.0],
  [0.1, 0.9, 0.0], [0.2, 0.8, 0.1], [0.0, 1.0, 0.1], [0.1, 0.7, 0.2], [0.3, 0.9, 0.0], [0.2, 0.6, 0.1], [0.0, 0.8, 0.3], [0.4, 0.6, 0.05],
  [0.0, 0.1, 0.9], [0.1, 0.2, 0.8], [0.1, 0.0, 1.0], [0.2, 0.1, 0.7], [0.0, 0.3, 0.9], [0.1, 0.2, 0.6], [0.3, 0.0, 0.8], [0.05, 0.4, 0.6],
];
const name = (i) => "fat"[Math.floor(i / 8)] + (i % 8 + 1);   // f1..f8 food, a1..a8 animal, t1..t8 tech

function graph(M) {                    // link each point to its M nearest, both ways
  const nb = P.map(() => new Set());
  P.forEach((p, i) => {
    const near = P.map((q, j) => [distance(p, q), j]).filter(([, j]) => j !== i).sort((x, y) => x[0] - y[0] || x[1] - y[1]).slice(0, M);
    for (const [, j] of near) { nb[i].add(j); nb[j].add(i); }
  });
  return nb.map((s) => [...s].sort((x, y) => x - y));
}

function walk(q, nb, start) {          // greedy walk; seen = every point we measured
  const seen = new Map();
  const d = (i) => { if (!seen.has(i)) seen.set(i, distance(q, P[i])); return seen.get(i); };
  let cur = start;
  d(cur);
  const path = [cur];
  for (;;) {
    let best = cur;
    for (const j of nb[cur]) if (d(j) < d(best)) best = j;
    if (best === cur) break;
    cur = best; path.push(cur);
  }
  return { cur, count: seen.size, path };
}

const nb = graph(2);
const q = [0.2, 0.75, 0.1];
let b = 0;
P.forEach((p, i) => { if (distance(q, p) < distance(q, P[b])) b = i; });
console.log("query = " + fmt(q) + ", true nearest = " + name(b));
for (const start of [8, 0, 16]) {      // a1, f1, t1
  const r = walk(q, nb, start);
  console.log("start " + name(start) + ": path " + r.path.map(name).join(" -> ") + ", measured " + r.count + " of " + P.length +
    (r.cur === b ? "  (found it)" : "  (stopped at the wrong point)"));
}
