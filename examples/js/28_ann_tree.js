// 28 ANN with a random-split tree (Annoy-style, as in the Serengil clip):
// split by the line halfway between two random points, repeat until a group has <= 5 points; walk down to search.
import { dot, sub, add, scale, distance, fmt } from "../../lib/zvect.js";

const LEAF = 5;
function minstd(seed) {                       // tiny repeatable random, same in JS / Python / C++
  const r = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let i = 0; i < 10; i++) r();
  return r;
}
function makePoints(n, seed) {                // n points in [0, 100), two decimals
  const r = minstd(seed), P = [];
  for (let i = 0; i < n; i++) { const x = Math.floor(r() * 10000) / 100, y = Math.floor(r() * 10000) / 100; P.push([x, y]); }
  return P;
}
// normal n = v1 - v2, constant c = n . (v1 + v2) / 2 ; right if n . v > c, else left
const plane = (v1, v2) => { const n = sub(v1, v2); return { n, c: dot(n, scale(add(v1, v2), 0.5)) }; };
const side = (h, v) => (dot(h.n, v) > h.c ? "right" : "left");

function build(vs, r) {
  if (vs.length <= LEAF) return { value: vs };
  let i = 0, j = 0;
  while (i === j) { i = Math.floor(r() * vs.length); j = Math.floor(r() * vs.length); }
  const h = plane(vs[i], vs[j]);
  const L = vs.filter((v) => side(h, v) === "left"), R = vs.filter((v) => side(h, v) === "right");
  if (L.length === 0 || R.length === 0) return { value: vs };
  return { h, value: vs, left: build(L, r), right: build(R, r) };
}

const P = makePoints(1000, 42);
const tree = build(P, minstd(1));
for (const q of [[50, 50], [30, 30]]) {
  let t = tree;
  const sizes = [];
  while (t.h) { sizes.push(t.value.length); t = side(t.h, q) === "left" ? t.left : t.right; }
  let best = t.value[0], truth = P[0];
  for (const v of t.value) if (distance(q, v) < distance(q, best)) best = v;
  for (const v of P) if (distance(q, v) < distance(q, truth)) truth = v;
  console.log("query " + fmt(q) + ": " + sizes.length + " steps, group sizes " + sizes.join(" > ") + " > " + t.value.length);
  console.log("  tree answer " + fmt(best) + " dist " + fmt(distance(q, best)) + " | true nearest " + fmt(truth) + " dist " + fmt(distance(q, truth)));
  console.log("  measured " + (sizes.length + t.value.length) + " instead of " + P.length + (best === truth ? "  (found the true nearest)" : "  (missed)"));
}
