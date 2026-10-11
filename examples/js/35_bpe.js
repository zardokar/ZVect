// 35 BPE (Byte Pair Encoding): start from characters, merge the most frequent adjacent pair k times,
// then apply the merges in the same order to new text. Corpus and new sentence from the BPE clip.
// Every pair is counted; a tie goes to the pair seen first. Spaces and punctuation are characters. ASCII text only.
const CORPUS = "fred fed ted bread, and ted fed fred bread";
const NEW = "ted and fred are friends";
const K = 4;
const q = (t) => '"' + t + '"';

function merge(toks, a, b) {
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    if (i + 1 < toks.length && toks[i] === a && toks[i + 1] === b) { out.push(a + b); i++; } else out.push(toks[i]);
  }
  return out;
}
function topPair(toks) {                       // most frequent adjacent pair; first seen wins a tie
  const seen = [], count = new Map();
  for (let i = 0; i + 1 < toks.length; i++) {
    const k = toks[i] + "|" + toks[i + 1];
    if (!count.has(k)) { count.set(k, 0); seen.push([toks[i], toks[i + 1], k]); }
    count.set(k, count.get(k) + 1);
  }
  let best = null;
  for (const [a, b, k] of seen) if (!best || count.get(k) > best.n) best = { a, b, n: count.get(k) };
  return best;
}

let toks = CORPUS.split("");
const letters = (c) => /[A-Za-z0-9]/.test(c);
const vocab = [...new Set(toks)].sort((x, y) => (letters(x) !== letters(y) ? (letters(x) ? -1 : 1) : x < y ? -1 : x > y ? 1 : 0));
console.log("corpus: " + toks.length + " characters, vocabulary: " + vocab.length);
const rules = [];
for (let r = 1; r <= K; r++) {
  const p = topPair(toks);
  if (!p) break;                               // nothing left to merge
  rules.push([p.a, p.b]); vocab.push(p.a + p.b);
  toks = merge(toks, p.a, p.b);
  console.log("round " + r + ": " + q(p.a) + " + " + q(p.b) + " -> " + q(p.a + p.b) + " seen " + p.n + " times, corpus now " + toks.length + " tokens");
}
console.log("vocabulary: " + vocab.map((t, i) => q(t) + ":" + (i + 1)).join(" "));

let t = NEW.split("");
for (const [a, b] of rules) t = merge(t, a, b);
console.log(NEW + " -> " + t.map(q).join(" "));
console.log("ids: " + t.map((x) => { const i = vocab.indexOf(x); return i < 0 ? "?" : String(i + 1); }).join(" "));
