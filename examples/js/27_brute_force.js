// 27 Brute force (exact k-NN): measure the query against every point; the work equals N.
import { distance, fmt } from "../../lib/zvect.js";

// a tiny repeatable random (minstd), so JS / Python / C++ make the same points: x = x * 48271 mod (2^31 - 1)
function points(n, seed) {
  const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let i = 0; i < 10; i++) rand();             // the first numbers after a small seed are tiny; skip them
  const P = [];
  for (let i = 0; i < n; i++) { const x = rand() * 8 - 4, y = rand() * 8 - 4, z = rand() * 8 - 4; P.push([x, y, z]); }
  return P;
}

function nearest(q, P) {
  let best = 0, measured = 0;
  for (let i = 0; i < P.length; i++) {
    measured++;
    if (distance(q, P[i]) < distance(q, P[best])) best = i;
  }
  return { best, measured };
}

const q = [1, 1, 1];
for (const n of [10, 100, 1000]) {
  const P = points(n, 7), r = nearest(q, P);
  console.log("N = " + n + ": nearest = point " + (r.best + 1) + " " + fmt(P[r.best]) + ", dist " + fmt(distance(q, P[r.best])) + ", measured " + r.measured);
}
