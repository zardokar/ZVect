// 12 Embedding matrix: one row per word. one-hot x matrix = pick that word's row (a lookup).
// axes of a row: animal, pet, vehicle
import { add, scale, fmt } from "../../lib/zvect.js";

const vocab = ["cat", "dog", "lion", "car", "bus"];
const E = [            // 5 words x 3 numbers
  [0.9, 0.9, 0.0],     // cat
  [0.9, 1.0, 0.0],     // dog
  [1.0, 0.2, 0.0],     // lion
  [0.0, 0.1, 0.9],     // car
  [0.1, 0.0, 1.0],     // bus
];
const oneHot = (w) => vocab.map((x) => (x === w ? 1 : 0));
// h x E = sum of (h_i * row i); only the row with h_i = 1 survives
const times = (h) => h.reduce((acc, hi, i) => add(acc, scale(E[i], hi)), [0, 0, 0]);

console.log("one-hot(dog) = " + fmt(oneHot("dog")));
console.log("one-hot(dog) x E = " + fmt(times(oneHot("dog"))));
console.log("row of dog (lookup by ID 1) = " + fmt(E[vocab.indexOf("dog")]));
for (const w of vocab) {
  const same = fmt(times(oneHot(w))) === fmt(E[vocab.indexOf(w)]);
  console.log(w + ": one-hot x E " + (same ? "==" : "!=") + " row " + vocab.indexOf(w));
}
