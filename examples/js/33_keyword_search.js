// 33 Keyword search vs meaning: an inverted index (word -> documents) finds the same words;
// a vector search (mean of word vectors, cosine) finds similar meaning. The word vectors are a made-up toy table.
import { words, encode, cosine, fmt } from "../../lib/zvect.js";

const docs = ["Cancel anytime", "Cancellation policy", "Order cancellation timeline", "End your membership today",
  "Pause your plan", "Manage billing", "Sourdough bread recipe", "Ticket ZV-1042 login error"];
const table = {            // axes: leave, money, food
  cancel: [1, 0.2, 0], cancellation: [1, 0.3, 0], end: [0.9, 0, 0], membership: [0.7, 0.4, 0], subscription: [0.7, 0.5, 0],
  pause: [0.8, 0.3, 0], plan: [0.5, 0.6, 0], order: [0.3, 0.6, 0.2], policy: [0.3, 0.5, 0], billing: [0.2, 1, 0],
  manage: [0.1, 0.5, 0], sourdough: [0, 0, 1], bread: [0, 0.1, 1], recipe: [0, 0.1, 0.9], quit: [1, 0.1, 0], stop: [0.9, 0.1, 0],
};

const index = new Map();   // inverted index: word -> documents that contain it
docs.forEach((d, i) => { for (const w of new Set(words(d))) { if (!index.has(w)) index.set(w, []); index.get(w).push(i); } });

for (const q of ["cancel my subscription", "ZV-1042"]) {
  console.log("query: " + q);
  const hits = new Map();
  for (const w of new Set(words(q))) {
    const list = index.get(w) || [];
    console.log("  index[" + w + "] = " + (list.length ? list.map((i) => docs[i]).join(" | ") : "-"));
    for (const i of list) hits.set(i, (hits.get(i) || 0) + 1);
  }
  const kw = [...hits].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([i]) => docs[i]);
  console.log("  keyword: " + (kw.length ? kw.join(" | ") : "nothing"));
  const qv = encode(q, table);
  const top = docs.map((d, i) => [i, cosine(qv, encode(d, table))]).filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1] || a[0] - b[0]).slice(0, 3);
  console.log("  meaning: " + (top.length ? top.map(([i, s]) => docs[i] + " " + fmt(s)).join(" | ") : "nothing (no known word)"));
}
