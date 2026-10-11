// 07 Bi-encoder: query and documents are encoded SEPARATELY into vectors,
// then compared with cosine. Docs are encoded once, ahead of time.
// toy encoder = average of word vectors. axes: x = food, y = animal, z = tech
import { encode, topK, fmt } from "../../lib/zvect.js";

const table = {
  eat: [1, 0, 0], rice: [1, 0, 0], noodle: [1, 0, 0], hungry: [0.9, 0.1, 0],
  cat: [0, 1, 0], dog: [0, 1, 0], pet: [0, 1, 0], bark: [0.1, 0.9, 0],
  code: [0, 0, 1], computer: [0, 0, 1], phone: [0, 0, 1], app: [0, 0, 1],
  bug: [0, 0.5, 0.5],
};
const docs = [
  "cat and dog are pets",
  "eat rice and noodle",
  "write code on a computer",
  "the phone app has a bug",
];

const docVecs = docs.map((d) => ({ id: d, v: encode(d, table) }));  // offline
const q = encode("my pet is hungry", table);                          // online
console.log("query = " + fmt(q));
for (const r of topK(q, docVecs, 2)) console.log(fmt(r.score) + "  " + r.id);
