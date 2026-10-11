// 38 Same model for the question and the documents (toy): two tables trained with the same rule from different random
// starts. Inside each model cat is near dog, but cat in model A and cat in model B are unrelated vectors.
// Training rule = 24_learn_table (c = (e_left + e_right) / 2 ; e_w <- e_w + eta * (c - e_w)); context rows start random too.
import { add, sub, scale, mean, cosine, topK, fmt } from "../../lib/zvect.js";

const windows = [["pet", "cat", "sleeps"], ["pet", "dog", "sleeps"], ["drive", "car", "fast"], ["drive", "bus", "fast"]];
const ctxWords = ["pet", "sleeps", "drive", "fast"];
const vocab = ["cat", "dog", "car", "bus"];
const eta = 0.3;
const passes = 5;

// a tiny repeatable random (minstd), so JS / Python / C++ make the same tables: x = x * 48271 mod (2^31 - 1)
function train(seed) {
  const next = () => {
    seed = (seed * 48271) % 2147483647;
    return seed;
  };
  for (let i = 0; i < 10; i++) {
    next();                                       // the first numbers after a small seed are tiny; skip them
  }
  const row = () => {
    return [0, 0, 0].map(() => {
      return ((next() % 17) - 8) / 2;             // -4 .. 4 in steps of 0.5
    });
  };
  const ctx = {};
  const E = {};
  for (const w of ctxWords) {
    ctx[w] = row();
  }
  for (const w of vocab) {
    E[w] = row();
  }
  for (let p = 0; p < passes; p++) {
    for (const [l, w, r] of windows) {
      const c = mean([ctx[l], ctx[r]]);
      E[w] = add(E[w], scale(sub(c, E[w]), eta));
    }
  }
  return E;
}

const model = { A: train(16), B: train(18) };   // same sentences, same rule; only the random start (seed) differs
for (const m of ["A", "B"]) {
  const E = model[m];
  console.log("inside " + m + ": cos(cat,dog) " + fmt(cosine(E.cat, E.dog)) + "  cos(car,bus) " + fmt(cosine(E.car, E.bus)) +
    "  cos(cat,car) " + fmt(cosine(E.cat, E.car)));
}
console.log("cat in A = " + fmt(model.A.cat) + "   cat in B = " + fmt(model.B.cat));
console.log("same word, two models: cos(cat_A, cat_B) = " + fmt(cosine(model.A.cat, model.B.cat)));

// search: documents are stored by one model, the question is turned into a vector by one model
console.log("question \"cat\"");
for (const [q, d] of [["A", "A"], ["B", "A"], ["B", "B"], ["A", "B"]]) {
  const docs = vocab.map((w) => {
    return { id: w, v: model[d][w] };
  });
  const ranked = topK(model[q].cat, docs, 4);
  const list = ranked.map((r) => {
    return r.id + " " + fmt(r.score);
  });
  console.log("  question by " + q + ", documents by " + d + ": " + list.join(", ") +
    "  -> top-1 " + ranked[0].id + (q === d ? "  (same model)" : "  (mixed: meaningless)"));
}
