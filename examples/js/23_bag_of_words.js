// 23 Bag of words: count each word -> a vector; compare two sentences with cosine (examples from StatQuest)
import { words, cosine, angle, fmt } from "../../lib/zvect.js";

function bag(a, b) {
  const wa = words(a), wb = words(b);
  const vocab = [...new Set([...wa, ...wb])];          // every different word, in the order first seen
  const count = (ws) => vocab.map((v) => ws.filter((w) => w === v).length);
  return { vocab, A: count(wa), B: count(wb) };
}

const pairs = [
  ["Hello, World!", "Hello!"],
  ["Hello, World!", "Hello Hello Hello!"],
  ["Hello, World!", "Hello, World!"],
  ["Hello!", "World!"],
  ["I love Troll 2!", "I love Gymkata!"],
];
for (const [a, b] of pairs) {
  const { vocab, A, B } = bag(a, b);
  console.log(a + " | " + b);
  console.log("  words " + vocab.join(",") + "  A = " + fmt(A) + "  B = " + fmt(B));
  console.log("  cos = " + fmt(cosine(A, B)) + "  angle = " + fmt(angle(A, B) * 180 / Math.PI) + " deg");
}
