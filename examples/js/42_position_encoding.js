// 42 Sinusoidal position encoding. Pair i is a clock hand with angle theta_i = pos / 10000^(2i/d);
// PE = (sin theta_0, cos theta_0, sin theta_1, cos theta_1, ...). Close positions are similar (cosine), far ones less.
// Idea (clock hands at different speeds) from Stanford CME295 Lecture 1; formula from the 2017 paper; d = 8 chosen by the author.
import { cosine, fmt } from "../../lib/zvect.js";

const d = 8;
const base = 10000;

function position(pos) {
  const out = [];
  for (let i = 0; i < d; i += 2) {
    const angle = pos / Math.pow(base, i / d);
    out.push(Math.sin(angle));
    out.push(Math.cos(angle));
  }
  return out;
}

for (const pos of [0, 1, 10, 60]) {
  console.log("PE(" + pos + ") = " + fmt(position(pos)));
}
for (const k of [1, 5, 20]) {
  console.log("cos(PE(10), PE(" + (10 + k) + ")) = " + fmt(cosine(position(10), position(10 + k))) + "  (" + k + " apart)");
}
