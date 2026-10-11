// 13 Vector search: a small 2-layer graph walk (the idea behind HNSW) instead of measuring every point.
// top layer = 3 hubs (one per group), bottom layer = each point linked to its M nearest points.
import { distance, fmt } from "../../lib/zvect.js";

const P = [
  [0.9, 0.1, 0.0], [0.8, 0.2, 0.1], [1.0, 0.0, 0.1], [0.7, 0.1, 0.2], [0.9, 0.3, 0.0], [0.6, 0.2, 0.1], [0.8, 0.0, 0.3], [0.55, 0.45, 0.0],
  [0.1, 0.9, 0.0], [0.2, 0.8, 0.1], [0.0, 1.0, 0.1], [0.1, 0.7, 0.2], [0.3, 0.9, 0.0], [0.2, 0.6, 0.1], [0.0, 0.8, 0.3], [0.4, 0.6, 0.05],
  [0.0, 0.1, 0.9], [0.1, 0.2, 0.8], [0.1, 0.0, 1.0], [0.2, 0.1, 0.7], [0.0, 0.3, 0.9], [0.1, 0.2, 0.6], [0.3, 0.0, 0.8], [0.05, 0.4, 0.6],
];
const name = (i) => "fat"[Math.floor(i / 8)] + (i % 8 + 1);   // f1..f8 food, a1..a8 animal, t1..t8 tech
const HUBS = [0, 8, 16];

function graph(M) {               // link each point to its M nearest, both ways
  const nb = P.map(() => new Set());
  P.forEach((p, i) => {
    const near = P.map((q, j) => [distance(p, q), j]).filter(([, j]) => j !== i)
      .sort((x, y) => x[0] - y[0] || x[1] - y[1]).slice(0, M);
    for (const [, j] of near) { nb[i].add(j); nb[j].add(i); }
  });
  return nb.map((s) => [...s].sort((x, y) => x - y));
}

function walk(q, nb) {            // greedy: keep moving to a closer neighbour, stop when none is closer
  const seen = new Map();
  const d = (i) => { if (!seen.has(i)) seen.set(i, distance(q, P[i])); return seen.get(i); };
  let cur = HUBS[0];
  for (const h of HUBS) if (d(h) < d(cur)) cur = h;   // top layer
  const path = [cur];
  for (;;) {                                          // bottom layer
    let best = cur;
    for (const j of nb[cur]) if (d(j) < d(best)) best = j;
    if (best === cur) break;
    cur = best; path.push(cur);
  }
  return { cur, count: seen.size, path };
}

const q = [0.5, 0.7, 0.1];
let b = 0;
P.forEach((p, i) => { if (distance(q, p) < distance(q, P[b])) b = i; });
console.log("query = " + fmt(q));
console.log("measure all 24 points -> " + name(b) + " " + fmt(distance(q, P[b])));
for (const M of [1, 2, 3]) {
  const r = walk(q, graph(M));
  console.log("graph M=" + M + ": measured " + r.count + " points, path " + r.path.map(name).join(" > ") +
    " -> " + name(r.cur) + " " + fmt(distance(q, P[r.cur])) + (r.cur === b ? "  (same)" : "  (missed)"));
}
