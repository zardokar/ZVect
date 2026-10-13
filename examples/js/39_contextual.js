// 39 Static vs contextual embeddings (toy): a static model gives a word one row of its table in every sentence;
// a contextual model mixes that row with the rows of the sentence's words. Mixing rule (simplified attention, author's toy):
// score_j = (e . E[x_j]) / sqrt(d) ; a = softmax(score) ; c = sum_j a_j * E[x_j]. Table and numbers made up by the author.
import { dot, cosine, fmt } from "../../lib/zvect.js";

const table = {
  bank: [2, 2, 0.5], deposited: [3.5, 0, 0.5], money: [4, 0.5, 0], reached: [0.5, 1, 1], river: [0.5, 4, 0],
  apple: [2, 0.5, 2], ate: [0, 1, 3.5], released: [3.5, 1, 0], phone: [4, 0, 1], fruit: [0.5, 0.5, 4], company: [4, 0.5, 0.5],
};
const cases = [
  { word: "bank", senses: ["money", "river"], sentences: [["I deposited money in the bank", ["deposited", "money", "bank"]],
    ["I reached Yamuna river bank", ["reached", "river", "bank"]]] },
  { word: "apple", senses: ["fruit", "company"], sentences: [["I ate an apple", ["ate", "apple"]],
    ["Apple released a phone", ["apple", "released", "phone"]]] },
];

// the contextual vector of word in a sentence, and the weight of each word of the sentence
function contextualize(word, words) {
  const e = table[word];
  const scores = words.map((w) => {
    return dot(e, table[w]) / Math.sqrt(e.length);
  });
  const top = Math.max(...scores);
  const ex = scores.map((s) => {
    return Math.exp(s - top);                     // subtract the largest score first: same weights, no overflow
  });
  const total = ex.reduce((s, x) => {
    return s + x;
  }, 0);
  const weights = ex.map((x) => {
    return x / total;
  });
  const c = [0, 0, 0];
  words.forEach((w, j) => {
    for (let i = 0; i < 3; i++) {
      c[i] += weights[j] * table[w][i];
    }
  });
  return { c, weights };
}

function senseLine(name, v, senses) {
  const parts = senses.map((s) => {
    return "cos(" + name + ", " + s + ") " + fmt(cosine(v, table[s]));
  });
  return parts.join("  ");
}

for (const k of cases) {
  const e = table[k.word];
  console.log("word \"" + k.word + "\"");
  console.log("  static: e = " + fmt(e) + "  " + senseLine("e", e, k.senses) + "  (same row in every sentence)");
  const got = [];
  for (const [text, words] of k.sentences) {
    const r = contextualize(k.word, words);
    got.push(r.c);
    const w = words.map((x, j) => {
      return x + " " + fmt(r.weights[j]);
    });
    console.log("  sentence \"" + text + "\"");
    console.log("    weights: " + w.join(", "));
    console.log("    c = " + fmt(r.c) + "  " + senseLine("c", r.c, k.senses));
  }
  console.log("  same word, two sentences: static cos " + fmt(cosine(e, e)) + ", contextual cos " + fmt(cosine(got[0], got[1])));
}
