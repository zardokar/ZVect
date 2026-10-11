// 14 Reranker: stage 1 = bi-encoder picks the top 3 fast (cosine on vectors made separately),
// stage 2 = a reranker reads query and document TOGETHER and re-orders those 3.
// toy reranker: count query words found in the doc, but not right after "no" / "not"; cosine breaks ties.
// Part 2 runs the same search in Thai: split by dictionary first (Thai has no spaces), turn each known Thai
// word into the English word with the same meaning, then reuse the same two stages. "ไม่" = "not".
import { encode, topK, words, fmt } from "../../lib/zvect.js";

const table = {
  eat: [1, 0, 0], rice: [1, 0, 0], noodle: [1, 0, 0], hungry: [0.9, 0.1, 0], feed: [0.8, 0.2, 0],
  cat: [0, 1, 0], dog: [0, 1, 0], pets: [0, 1, 0], code: [0, 0, 1], computer: [0, 0, 1],
};
const docs = ["the dog is not hungry", "feed my hungry dog rice", "cat and dog are pets", "eat rice and noodle", "write code on a computer"];
const thaiDocs = ["หมาไม่หิว", "ให้ข้าวหมาที่หิว", "แมวกับหมาเป็นสัตว์เลี้ยง", "กินข้าวและก๋วยเตี๋ยว", "เขียนโค้ดบนคอมพิวเตอร์"];
const thai = {
  "หมา": "dog", "หิว": "hungry", "ไม่": "not", "ข้าว": "rice", "แมว": "cat", "สัตว์เลี้ยง": "pets",
  "กิน": "eat", "ก๋วยเตี๋ยว": "noodle", "โค้ด": "code", "คอมพิวเตอร์": "computer",
};

function matches(query, doc) {
  const q = new Set(words(query)), w = words(doc), found = new Set();
  w.forEach((x, i) => { if (q.has(x) && !(i > 0 && (w[i - 1] === "no" || w[i - 1] === "not"))) found.add(x); });
  return found.size;
}
// longest match: at each place take the longest dictionary word; unknown letters are skipped here
function toEnglish(text) {
  const ch = [...text], out = [];
  const longest = Math.max(...Object.keys(thai).map((w) => [...w].length));
  for (let i = 0; i < ch.length;) {
    let n = Math.min(longest, ch.length - i);
    while (n > 0 && !Object.prototype.hasOwnProperty.call(thai, ch.slice(i, i + n).join(""))) n--;
    if (n === 0) { i++; continue; }
    out.push(thai[ch.slice(i, i + n).join("")]);
    i += n;
  }
  return out.join(" ");
}
// query and docs in English words; show[i] = how document i is printed
function search(query, docs, show) {
  const stage1 = topK(encode(query, table), docs.map((d, i) => ({ id: i, v: encode(d, table) })), 3);
  console.log("stage 1 (bi-encoder, cosine):");
  for (const r of stage1) console.log("  " + fmt(r.score) + "  " + show[r.id]);
  const stage2 = stage1.map((r) => ({ id: r.id, m: matches(query, docs[r.id]), s: matches(query, docs[r.id]) + r.score }))
    .sort((x, y) => y.s - x.s);
  console.log("stage 2 (rerank = matched words + cosine):");
  for (const r of stage2) console.log("  " + fmt(r.s) + "  " + show[r.id] + "  (matched " + r.m + ")");
}

search("hungry dog", docs, docs);
console.log("thai: หมาหิว -> " + toEnglish("หมาหิว") + ", หมาไม่หิว -> " + toEnglish("หมาไม่หิว"));
search(toEnglish("หมาหิว"), thaiDocs.map(toEnglish), thaiDocs);
