// 36 Late interaction (ColBERT idea): keep ONE VECTOR PER TOKEN instead of one per sentence.
// score(q, d) = sum over query tokens of the best dot with any document token (MaxSim, then sum).
// Compared with the bi-encoder of lesson 09 (average of word vectors, then cosine). Toy vectors, axes: food, animal, tech.
import { encode, words, normalize, dot, fmt } from "../../lib/zvect.js";

const table = {
  eat: [1, 0, 0], rice: [1, 0, 0], noodle: [1, 0, 0], fish: [0.5, 0.5, 0],
  cat: [0, 1, 0], dog: [0, 1, 0], pet: [0, 1, 0], pets: [0, 1, 0], bark: [0.1, 0.9, 0],
  code: [0, 0, 1], computer: [0, 0, 1], phone: [0, 0, 1], app: [0, 0, 1], robot: [0, 0.2, 0.8], bug: [0, 0.5, 0.5],
};
const docs = [
  "cat and dog are pets", "eat rice and noodle", "write code on a computer", "the phone app has a bug",
  "my dog likes fish", "a robot pet that can bark", "my cat likes fish and rice and my phone app has a bug",
];
const tokens = (text) => words(text).filter((w) => w in table).map((w) => normalize(table[w]));   // one unit vector per known word
function late(q, d) {
  const qt = tokens(q), dt = tokens(d);
  return qt.reduce((sum, t) => sum + Math.max(...dt.map((u) => dot(t, u))), 0);
}

const query = "eat rice and fix a bug";
console.log("query: " + query);
let bi = { s: -Infinity }, li = { s: -Infinity };
docs.forEach((d, i) => {
  const c = dot(encode(query, table), encode(d, table)), s = late(query, d);
  console.log("d" + (i + 1) + "  cos " + fmt(c) + "  late " + fmt(s) + "  " + d);
  if (c > bi.s + 1e-9) bi = { s: c, i };
  if (s > li.s + 1e-9) li = { s, i };
});
console.log("bi-encoder picks d" + (bi.i + 1) + ", late interaction picks d" + (li.i + 1));
