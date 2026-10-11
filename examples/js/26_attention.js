// 26 Attention starts with query . key: score_j = q . k_j ; the key with the highest score gets the most attention.
// Vectors from the SH AI Academy slide (~3:44). The slide printed 0.69 and 0.15; the real values are 0.70 and 0.23.
import { dot, fmt } from "../../lib/zvect.js";

const keys = [["key1", [0.2, 0.7, 0.4]], ["key2", [0.9, 0.1, 0.2]]];

function attend(q) {
  console.log("query = " + fmt(q));
  let best = null;
  for (const [name, k] of keys) {
    const byHand = q[0] * k[0] + q[1] * k[1] + q[2] * k[2];
    console.log("  q . " + name + " = " + fmt(byHand) + " (by hand) = " + fmt(dot(q, k)) + " (lib)");
    if (best === null || dot(q, k) > best[1]) best = [name, dot(q, k)];
  }
  console.log("  most attention: " + best[0]);
}

attend([0.1, 0.8, 0.3]);      // the slide's query
attend([0.9, 0.2, 0.1]);      // a query toward dim 1: key2 wins
