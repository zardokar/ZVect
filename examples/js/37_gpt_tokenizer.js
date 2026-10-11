// 37 GPT tokenizer (byte-level BPE): turn text into UTF-8 bytes (0-255), merge the most frequent adjacent pair
// k times with new ids 256, 257, ..., then encode new text (oldest rule first) and decode it back.
// From Karpathy's "Let's build the GPT Tokenizer". Ties go to the pair seen first. Sample text: author's choice.
const CORPUS = "แมวกินปลา แมวกินนม หมากินข้าว แมวนอน หมานอน";
const NEW = "แมวกินข้าว";
const K = 6;
const utf8 = (s) => [...Buffer.from(s, "utf8")];

function merge(ids, a, b, idx) {
  const out = [];
  for (let i = 0; i < ids.length; i++) {
    if (i + 1 < ids.length && ids[i] === a && ids[i + 1] === b) { out.push(idx); i++; } else out.push(ids[i]);
  }
  return out;
}
function topPair(ids) {                        // most frequent adjacent pair; first seen wins a tie
  const seen = [], count = new Map();
  for (let i = 0; i + 1 < ids.length; i++) {
    const k = ids[i] + "," + ids[i + 1];
    if (!count.has(k)) { count.set(k, 0); seen.push([ids[i], ids[i + 1], k]); }
    count.set(k, count.get(k) + 1);
  }
  let best = null;
  for (const [a, b, k] of seen) if (!best || count.get(k) > best.n) best = { a, b, n: count.get(k) };
  return best;
}

const bytes = utf8(CORPUS);
console.log("corpus: " + [...CORPUS].length + " characters, " + bytes.length + " bytes");
console.log("first character " + [...CORPUS][0] + " -> bytes " + utf8([...CORPUS][0]).join(" "));
const vocab = new Map();
for (let i = 0; i < 256; i++) vocab.set(i, [i]);
const rules = [];                                // [a, b, new id], in the order they were made
let ids = bytes;
for (let r = 0; r < K; r++) {
  const p = topPair(ids);
  if (!p) break;
  const idx = 256 + r;
  rules.push([p.a, p.b, idx]); vocab.set(idx, [...vocab.get(p.a), ...vocab.get(p.b)]);
  ids = merge(ids, p.a, p.b, idx);
  console.log("merge " + (r + 1) + ": (" + p.a + ", " + p.b + ") -> " + idx + " seen " + p.n + " times, bytes " + vocab.get(idx).join(" "));
}
console.log("corpus: " + bytes.length + " bytes -> " + ids.length + " tokens, ratio " + (bytes.length / ids.length).toFixed(2));

function encode(text) {
  let t = utf8(text);
  while (t.length >= 2) {
    let best = null;                             // the pair with the oldest rule (smallest new id)
    for (let i = 0; i + 1 < t.length; i++) {
      for (const [a, b, idx] of rules) if (t[i] === a && t[i + 1] === b && (best === null || idx < best[2])) best = [a, b, idx];
    }
    if (best === null) break;
    t = merge(t, best[0], best[1], best[2]);
  }
  return t;
}
const out = encode(NEW);
console.log(NEW + ": " + utf8(NEW).length + " bytes -> " + out.length + " tokens: " + out.join(" "));
const back = Buffer.from(out.flatMap((i) => vocab.get(i))).toString("utf8");
console.log("decode -> " + back + (back === NEW ? " (same as the input)" : " (different)"));
console.log("token 256 alone = bytes " + vocab.get(256).join(" ") + " (not a whole character)");
