// 22 One-hot: one 1 at the word's position, 0 everywhere else. Every pair of words is equally far apart.
import { cosine, distance, fmt } from "../../lib/zvect.js";

const vocab = ["good", "bad", "great"];                 // V = 3 words, so a one-hot vector has 3 numbers
const oneHot = (w) => vocab.map((x) => (x === w ? 1 : 0));

for (const w of vocab) console.log("one-hot(" + w + ") = " + fmt(oneHot(w)));
for (const [a, b] of [["good", "bad"], ["good", "great"], ["bad", "great"]]) {
  console.log(a + " vs " + b + ": cos " + fmt(cosine(oneHot(a), oneHot(b))) + ", dist " + fmt(distance(oneHot(a), oneHot(b))));
}
console.log("same word: cos " + fmt(cosine(oneHot("good"), oneHot("good"))) + ", dist " + fmt(distance(oneHot("good"), oneHot("good"))));

// A real vocabulary: 50,000 words -> 50,000 numbers per word, only one of them is 1
const V = 50000, big = new Array(V).fill(0);
big[123] = 1;                                           // some word at position 123
console.log("V = " + V + ": ones = " + big.filter((x) => x === 1).length + ", zeros = " + big.filter((x) => x === 0).length);
