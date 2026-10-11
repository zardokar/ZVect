// 08 High dimensions: with many dimensions, every point is almost the same distance away
// 200 random points in [0, 1]^d and one random query; how spread out are the distances?
import { cosine, distance, fmt } from "../../lib/zvect.js";

// tiny seeded random numbers (same in JS / Python / C++): x = x * 48271 mod (2^31 - 1)
// the first few numbers after a small seed are tiny, so start() throws 10 away
let seed = 7;
const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
const start = (s) => { seed = s; for (let i = 0; i < 10; i++) rand(); };
const point = (d) => Array.from({ length: d }, rand);

for (const d of [2, 10, 100, 1000]) {
  start(7);
  const q = point(d);
  const ds = [], cs = [];
  for (let i = 0; i < 200; i++) { const p = point(d); ds.push(distance(q, p)); cs.push(cosine(q, p)); }
  const lo = Math.min(...ds), hi = Math.max(...ds);
  console.log("d=" + d + "  distance " + fmt(lo) + " .. " + fmt(hi) + "  spread " + fmt((hi - lo) / lo) +
    "  cosine " + fmt(Math.min(...cs)) + " .. " + fmt(Math.max(...cs)));
}
