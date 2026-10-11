// 24 Learning the table (toy): rows start random, each step moves a word's row a little toward its context.
// c = (e_left + e_right) / 2 ; e_w <- e_w + eta * (c - e_w). A simplified rule to see the idea, not real word2vec.
import { add, sub, scale, mean, cosine, fmt } from "../../lib/zvect.js";

const ctx = { pet: [-0.5, 3.5, 0.5], sleeps: [0.5, 2.5, -0.5], drive: [3.5, 0, 0.5], fast: [2.5, 1, -0.5] };
const windows = [["pet", "cat", "sleeps"], ["pet", "dog", "sleeps"], ["drive", "car", "fast"], ["drive", "bus", "fast"]];
const E = { cat: [-2, -1, 2], dog: [2, -2, -1], car: [-1, 2, -2], bus: [1, 1, 2] };   // "random" start rows
const eta = 0.3;

function pass() {                       // every window once
  for (const [l, w, r] of windows) {
    const c = mean([ctx[l], ctx[r]]);   // context = mean of the left and right rows
    E[w] = add(E[w], scale(sub(c, E[w]), eta));
  }
}
const report = (n) => console.log("after " + n + " passes: cos(cat,dog) " + fmt(cosine(E.cat, E.dog)) +
  "  cos(car,bus) " + fmt(cosine(E.car, E.bus)) + "  cos(cat,car) " + fmt(cosine(E.cat, E.car)));

report(0);
let done = 0;
for (const n of [1, 5, 20]) { while (done < n) { pass(); done++; } report(n); }
console.log("cat row now = " + fmt(E.cat) + "  (context of cat = " + fmt(mean([ctx.pet, ctx.sleeps])) + ")");
