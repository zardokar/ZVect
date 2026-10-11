// 25 LLM input: one row per token (n x d), then add a position vector to each row: x_i = e_(t_i) + p_i
// Sentence and IDs from the clip; the 3-number rows and position vectors are made up so they can be drawn.
import { add, fmt } from "../../lib/zvect.js";

const id = { The: 791, cat: 8415, sat: 7731, on: 389, a: 264, mat: 5634 };
const E = { The: [0.1, 0.1, 0.1], cat: [0.9, 0.8, 0.0], sat: [0.2, 0.1, 0.9], on: [0.1, 0.4, 0.3], a: [0.1, 0.0, 0.2], mat: [0.3, 0.9, 0.2] };
const P = [[0.0, 0.3, 0.0], [0.3, 0.0, 0.0], [0.0, 0.0, 0.3], [0.3, 0.3, 0.0], [0.0, 0.3, 0.3], [0.3, 0.0, 0.3]];

function table(tokens, withPos) {
  return tokens.map((t, i) => (withPos ? add(E[t], P[i]) : E[t]));
}
const s1 = ["The", "cat", "sat", "on", "a", "mat"];
const s2 = ["The", "mat", "sat", "on", "a", "cat"];      // cat and mat swapped

const X = table(s1, true);
console.log("tokens: " + s1.join(" ") + "  IDs: " + s1.map((t) => id[t]).join(", "));
console.log("shape of X = " + X.length + " x " + X[0].length + " (position added, shape unchanged)");
X.forEach((row, i) => console.log("x" + (i + 1) + " " + s1[i] + " = " + fmt(row)));

// Without positions the swapped sentence has the same rows, only reordered. With positions, cat's row changes.
const sameSet = (A, B) => A.map(fmt).sort().join() === B.map(fmt).sort().join();
console.log("no position:   same set of rows after swap? " + sameSet(table(s1, false), table(s2, false)));
console.log("with position: same set of rows after swap? " + sameSet(table(s1, true), table(s2, true)));
console.log("cat at position 2 = " + fmt(table(s1, true)[1]) + ", cat at position 6 = " + fmt(table(s2, true)[5]));
