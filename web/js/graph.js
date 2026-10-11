// graph.js — the small neighbour graph shared by 5.5 (one layer), 5.6 HNSW (two layers) and 5.7 (beam).
// 24 points in 3 groups (axes: x = food, y = animal, z = tech), each linked to its M nearest (both ways).
import { distance } from "../../lib/zvect.js";

export const P = [
  [0.9, 0.1, 0.0], [0.8, 0.2, 0.1], [1.0, 0.0, 0.1], [0.7, 0.1, 0.2], [0.9, 0.3, 0.0], [0.6, 0.2, 0.1], [0.8, 0.0, 0.3], [0.55, 0.45, 0.0],
  [0.1, 0.9, 0.0], [0.2, 0.8, 0.1], [0.0, 1.0, 0.1], [0.1, 0.7, 0.2], [0.3, 0.9, 0.0], [0.2, 0.6, 0.1], [0.0, 0.8, 0.3], [0.4, 0.6, 0.05],
  [0.0, 0.1, 0.9], [0.1, 0.2, 0.8], [0.1, 0.0, 1.0], [0.2, 0.1, 0.7], [0.0, 0.3, 0.9], [0.1, 0.2, 0.6], [0.3, 0.0, 0.8], [0.05, 0.4, 0.6],
];
export const name = (i) => "fat"[Math.floor(i / 8)] + (i % 8 + 1);
export const COLOR = ["x", "y", "z"];
export const HUBS = [0, 8, 16];
export const AXIS_NAMES = ["food", "animal", "tech"];
const S = 4;
export const up = (v) => v.map((x) => x * S);

function graph(M) {
  const nb = P.map(() => new Set());
  P.forEach((p, i) => {
    const near = P.map((q, j) => [distance(p, q), j]).filter(([, j]) => j !== i).sort((x, y) => x[0] - y[0] || x[1] - y[1]).slice(0, M);
    for (const [, j] of near) { nb[i].add(j); nb[j].add(i); }
  });
  return nb.map((s) => [...s].sort((x, y) => x - y));
}
export const GRAPHS = { 1: graph(1), 2: graph(2), 3: graph(3) };

// greedy walk from `start`: move to the neighbour closest to q while one is closer; seen = every point measured
export function greedy(q, nb, start, seen = new Map()) {
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
  return { cur, path, seen, count: seen.size };
}
export const brute = (q) => P.reduce((b, p, i) => (distance(q, p) < distance(q, P[b]) ? i : b), 0);

// beam search on the bottom layer (HNSW "efSearch"): keep the ef best points found so far, keep expanding the closest
// unexpanded one, stop when the closest unexpanded point is farther than the worst kept point.
export function beam(q, nb, start, ef, seen = new Map()) {
  const d = (i) => { if (!seen.has(i)) seen.set(i, distance(q, P[i])); return seen.get(i); };
  const byD = (a, b) => d(a) - d(b) || a - b;
  const visited = new Set([start]);
  let cand = [start], keep = [start];
  d(start);
  const expanded = [];
  while (cand.length) {
    cand.sort(byD);
    const c = cand.shift();
    if (d(c) > d(keep[keep.length - 1])) break;
    expanded.push(c);
    for (const e of nb[c]) {
      if (visited.has(e)) continue;
      visited.add(e);
      if (keep.length < ef || d(e) < d(keep[keep.length - 1])) {
        cand.push(e); keep.push(e); keep.sort(byD);
        if (keep.length > ef) keep.pop();
      }
    }
  }
  return { cur: keep[0], keep, expanded, seen, count: seen.size };
}
