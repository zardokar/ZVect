// 21 Token ID: a word's number is a name tag, not a position. gap(a, b) = |id(a) - id(b)|
import { vec, distance, fmt } from "../../lib/zvect.js";

const id = { good: 6, bad: 22, great: 21 };      // IDs from the clip ("This movie was good / bad / great")
// one number = a 1-number vector, so the gap is the Euclidean distance of lesson 2.1
const gap = (ids, a, b) => distance(vec(ids[a]), vec(ids[b]));
const pairs = [["good", "great"], ["bad", "great"], ["good", "bad"]];

for (const [a, b] of pairs) console.log("gap(" + a + ", " + b + ") = " + fmt(gap(id, a, b)));
console.log("by ID, closest to great: " + (gap(id, "bad", "great") < gap(id, "good", "great") ? "bad" : "good") + "  (wrong: good and great mean almost the same)");

// Give the same words other numbers (here: alphabetical order). Meaning did not change, the "closeness" did.
const abc = { bad: 0, good: 1, great: 2 };
for (const [a, b] of pairs) console.log("alphabetical IDs: gap(" + a + ", " + b + ") = " + fmt(gap(abc, a, b)));
