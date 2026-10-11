// 14 Reranker: stage 1 = bi-encoder picks the top 3 fast (cosine on vectors made separately),
// stage 2 = a reranker reads query and document TOGETHER and re-orders those 3.
// toy reranker: count query words found in the doc, but not right after "no" / "not"; cosine breaks ties.
import { encode, topK, words, fmt } from "../../lib/zvect.js";

const table = {
  eat: [1, 0, 0], rice: [1, 0, 0], noodle: [1, 0, 0], hungry: [0.9, 0.1, 0], feed: [0.8, 0.2, 0],
  cat: [0, 1, 0], dog: [0, 1, 0], pets: [0, 1, 0], code: [0, 0, 1], computer: [0, 0, 1],
};
const docs = ["the dog is not hungry", "feed my hungry dog rice", "cat and dog are pets", "eat rice and noodle", "write code on a computer"];

function matches(query, doc) {
  const q = new Set(words(query)), w = words(doc), found = new Set();
  w.forEach((x, i) => { if (q.has(x) && !(i > 0 && (w[i - 1] === "no" || w[i - 1] === "not"))) found.add(x); });
  return found.size;
}

const query = "hungry dog";
const stage1 = topK(encode(query, table), docs.map((d) => ({ id: d, v: encode(d, table) })), 3);
console.log("stage 1 (bi-encoder, cosine):");
for (const r of stage1) console.log("  " + fmt(r.score) + "  " + r.id);
const stage2 = stage1.map((r) => ({ id: r.id, m: matches(query, r.id), s: matches(query, r.id) + r.score }))
  .sort((x, y) => y.s - x.s);
console.log("stage 2 (rerank = matched words + cosine):");
for (const r of stage2) console.log("  " + fmt(r.s) + "  " + r.id + "  (matched " + r.m + ")");
