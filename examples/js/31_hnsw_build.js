// 31 HNSW build: every point is on level 0; flip a coin with heads chance 1/M, heads = also on the next level, repeat.
// Count the points on each level and compare with the expected N * (1/M)^k.
import { fmt } from "../../lib/zvect.js";
function minstd(seed) {                         // tiny repeatable random, same in JS / Python / C++
  const r = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let i = 0; i < 10; i++) r();
  return r;
}

const N = 1000000;
for (const M of [16, 2]) {
  const r = minstd(7), count = [];
  for (let i = 0; i < N; i++) {
    let level = 0;
    while (r() < 1 / M) level++;               // heads: one level up, flip again; tails: stop
    for (let k = 0; k <= level; k++) count[k] = (count[k] || 0) + 1;
  }
  console.log("M = " + M + ", N = " + N + ": " + count.length + " levels");
  count.slice(0, 6).forEach((c, k) => console.log("  level " + k + ": " + c + "   expected " + fmt(N * (1 / M) ** k)));
}
