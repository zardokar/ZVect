// 09 Bi-encoder: query and documents are encoded SEPARATELY into vectors,
// then compared with cosine. Docs are encoded once, ahead of time.
// toy encoder = average of word vectors. axes: x = food, y = animal, z = tech
// Part 2 asks the same question in Thai. Thai puts no spaces between words, so words() sees the whole
// sentence as ONE unknown word. A dictionary split (longest known word first) finds the words again.
import { encode, topK, words, fmt } from "../../lib/zvect.js";

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
// Thai word -> the English word with the same meaning (so it gets the same vector)
const thai = { "สัตว์เลี้ยง": "pet", "หิว": "hungry", "หมา": "dog", "แมว": "cat", "กิน": "eat", "ข้าว": "rice" };

// longest match: at each place take the longest dictionary word; unknown letters are kept together
function splitDict(text, dict) {
  const ch = [...text], out = [];
  const longest = Math.max(...Object.keys(dict).map((w) => [...w].length));
  let unk = "";
  for (let i = 0; i < ch.length;) {
    let n = Math.min(longest, ch.length - i);
    while (n > 0 && !Object.prototype.hasOwnProperty.call(dict, ch.slice(i, i + n).join(""))) n--;
    if (n === 0) { unk += ch[i]; i++; continue; }
    if (unk) { out.push(unk); unk = ""; }
    out.push(ch.slice(i, i + n).join(""));
    i += n;
  }
  if (unk) out.push(unk);
  return out;
}

const docVecs = docs.map((d) => ({ id: d, v: encode(d, table) }));  // offline
const q = encode("my pet is hungry", table);                          // online
console.log("query = " + fmt(q));
for (const r of topK(q, docVecs, 2)) console.log(fmt(r.score) + "  " + r.id);

const th = "สัตว์เลี้ยงของฉันหิว";                                     // "my pet is hungry"
console.log("thai, split at spaces: " + words(th).join(" | ") + "  -> " + fmt(encode(th, table)));
const parts = splitDict(th, thai);
const qth = encode(parts.filter((w) => w in thai).map((w) => thai[w]).join(" "), table);
console.log("thai, split by dictionary: " + parts.join(" | ") + "  -> " + fmt(qth));
for (const r of topK(qth, docVecs, 2)) console.log(fmt(r.score) + "  " + r.id);
