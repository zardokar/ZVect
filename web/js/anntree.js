// anntree.js — the random-hyperplane tree of the ann-tree lesson (Annoy-style, as in the Serengil clip).
// Same steps as examples/*/28_ann_tree.*: pick two random points, split by the line halfway between them,
// repeat on each side until a group has at most LEAF points.
import { dot, sub, add, scale, distance } from "../../lib/zvect.js";

export const LEAF = 5;

export function minstd(seed) {          // x = x * 48271 mod (2^31 - 1), the first 10 numbers skipped
  const r = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let i = 0; i < 10; i++) r();
  return r;
}

export function makePoints(n, seed) {   // n points in [0, 100) x [0, 100), two decimals (floor, so every language agrees)
  const r = minstd(seed), P = [];
  for (let i = 0; i < n; i++) { const x = Math.floor(r() * 10000) / 100, y = Math.floor(r() * 10000) / 100; P.push([x, y]); }
  return P;
}

// normal n = v1 - v2, constant c = n . (v1 + v2) / 2 ; right if n . v > c, else left (ties go left, as in the clip)
export function plane(v1, v2) { const n = sub(v1, v2); return { n, c: dot(n, scale(add(v1, v2), 0.5)) }; }
export const side = (h, v) => (dot(h.n, v) > h.c ? "right" : "left");

export function build(vs, r) {
  if (vs.length <= LEAF) return { value: vs };
  let i = 0, j = 0;
  while (i === j) { i = Math.floor(r() * vs.length); j = Math.floor(r() * vs.length); }
  const h = plane(vs[i], vs[j]);
  const L = vs.filter((v) => side(h, v) === "left"), R = vs.filter((v) => side(h, v) === "right");
  if (!L.length || !R.length) return { value: vs };          // duplicate points: stop splitting
  return { h, value: vs, left: build(L, r), right: build(R, r) };
}

export function search(tree, q) {      // walk down by side(q) until a leaf; path = the nodes passed
  const path = [];
  let t = tree;
  while (t.h) { path.push(t); t = side(t.h, q) === "left" ? t.left : t.right; }
  let best = t.value[0];
  for (const v of t.value) if (distance(q, v) < distance(q, best)) best = v;
  return { path, leaf: t.value, best };
}

export function exact(P, q) {
  let best = P[0];
  for (const v of P) if (distance(q, v) < distance(q, best)) best = v;
  return best;
}
