// zvect.js — tiny vector library for learning. Zero dependencies.
// Works in Node (ESM) and in the browser. A vector is a plain array of numbers.
// Same API and same rules as zvect.py and zvect.hpp. License: see LICENSE (non-commercial).
// Rules: size mismatch / empty list / empty table -> throws Error.

export const VERSION = "0.1.0";

function same(a, b) {
  if (a.length !== b.length) throw new Error(`size mismatch: ${a.length} vs ${b.length}`);
}

// ---------- basics ----------
export const vec = (...xs) => xs;                                       // vec(1,2,3) -> [1,2,3]
export const add = (a, b) => (same(a, b), a.map((x, i) => x + b[i]));   // a + b
export const sub = (a, b) => (same(a, b), a.map((x, i) => x - b[i]));   // a - b
export const scale = (a, k) => a.map((x) => x * k);                     // k * a

// ---------- products & lengths ----------
export function dot(a, b) {                                // Σ a_i * b_i
  same(a, b);
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}
export const norm = (a) => Math.sqrt(dot(a, a));           // |a|
export function normalize(a) {                             // a / |a|  (zero stays zero)
  const n = norm(a);
  return n === 0 ? a.map(() => 0) : scale(a, 1 / n);
}
export const distance = (a, b) => norm(sub(a, b));         // |a - b|

// ---------- angles & similarity ----------
export function cosine(a, b) {                             // (a·b) / (|a||b|), 0 if a zero vector
  const n = norm(a) * norm(b);
  return n === 0 ? 0 : dot(a, b) / n;
}
export const angle = (a, b) =>                             // θ in radians
  Math.acos(Math.min(1, Math.max(-1, cosine(a, b))));
export function project(b, a) {                            // projection of b onto a
  const aa = dot(a, a);
  return aa === 0 ? a.map(() => 0) : scale(a, dot(a, b) / aa);
}

// ---------- many vectors ----------
export function mean(list) {                               // centroid
  if (list.length === 0) throw new Error("empty list");
  const out = new Array(list[0].length).fill(0);
  for (const v of list) { same(out, v); for (let i = 0; i < v.length; i++) out[i] += v[i]; }
  return scale(out, 1 / list.length);
}

// items: [{ id, v }]  ->  [{ id, v, score }] best first (ties keep input order)
export function topK(query, items, k = 3, metric = cosine) {
  return items
    .map((it) => ({ ...it, score: metric(query, it.v) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k);
}

// centroids: { label: vector }  ->  { label, score } (ties: first label wins)
export function classify(x, centroids, metric = cosine) {
  const entries = Object.entries(centroids);
  if (entries.length === 0) throw new Error("no centroids");
  let best = { label: null, score: -Infinity };
  for (const [label, c] of entries) {
    const s = metric(x, c);
    if (s > best.score) best = { label, score: s };
  }
  return best;
}

// ---------- printing (same output in JS / Python / C++) ----------
function f3(x) {
  x += 0; // turns -0 into 0
  const s = Math.abs(x) * 1000, fl = Math.floor(s);
  // exact ties round to even, like printf and Python
  if (s - fl === 0.5 && fl % 2 === 0) return (Math.sign(x) * fl / 1000).toFixed(3);
  return x.toFixed(3);
}
export const fmt = (x) => (Array.isArray(x) ? "[" + x.map(f3).join(", ") + "]" : f3(x));

// ---------- toy bi-encoder ----------
// table: { word: vector }. Words = runs of [a-z0-9] or any non-ASCII letter
// (so Thai works). Only A-Z is lower-cased. Unknown words are skipped.
// Returns a unit vector, or a zero vector if no word is known.
export function words(text) {
  return text.replace(/[A-Z]/g, (c) => c.toLowerCase()).split(/[\x00-\x2f\x3a-\x60\x7b-\x7f]+/).filter(Boolean);
}
export function encode(text, table) {
  const dims = Object.values(table);
  if (dims.length === 0) throw new Error("empty table");
  const known = words(text).filter((w) => Object.prototype.hasOwnProperty.call(table, w));
  if (known.length === 0) return dims[0].map(() => 0);
  return normalize(mean(known.map((w) => table[w])));
}
