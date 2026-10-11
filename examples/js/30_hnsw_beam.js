// 30 HNSW beam (efSearch): on the bottom layer keep the ef closest points found so far instead of one.
// Top layer: start at the closest of 3 hubs. Wider beam = more points measured, fewer misses.
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

const HUBS = [0, 8, 16];

function search(q, nb, ef) {
  const seen = new Map();
  const d = (i) => { if (!seen.has(i)) seen.set(i, distance(q, P[i])); return seen.get(i); };
  const byD = (a, b) => d(a) - d(b) || a - b;
  let start = HUBS[0];
  for (const h of HUBS) if (d(h) < d(start)) start = h;          // top layer
  const visited = new Set([start]);
  const cand = [start], keep = [start];                          // bottom layer: beam of width ef
  while (cand.length) {
    cand.sort(byD);
    const c = cand.shift();                                      // closest point not expanded yet
    if (d(c) > d(keep[keep.length - 1])) break;                  // farther than the worst kept: stop
    for (const e of nb[c]) {
      if (visited.has(e)) continue;
      visited.add(e);
      if (keep.length < ef || d(e) < d(keep[keep.length - 1])) {
        cand.push(e); keep.push(e); keep.sort(byD);
        if (keep.length > ef) keep.pop();
      }
    }
  }
  return { best: keep[0], keep, measured: seen.size };
}

const nb = graph(2);
const q = [0.5, 0.7, 0.1];
let b = 0;
P.forEach((p, i) => { if (distance(q, p) < distance(q, P[b])) b = i; });
console.log("query = " + fmt(q) + ", true nearest = " + name(b));
for (const ef of [1, 2, 4, 8]) {
  const r = search(q, nb, ef);
  console.log("ef = " + ef + ": answer " + name(r.best) + ", kept " + r.keep.map(name).join(" ") + ", measured " + r.measured + " of " + P.length +
    (r.best === b ? "  (found it)" : "  (missed)"));
}
