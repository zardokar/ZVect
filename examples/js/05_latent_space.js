// 05 Latent space: each word is a point; similar meaning = nearby.
// Real models learn hundreds of unnamed axes; here we name 3 by hand:
// x = royal, y = gender (+male / -female), z = adult
import { add, sub, topK, fmt } from "../../lib/zvect.js";

const W = {
  king: [0.9, 0.9, 0.9],  queen: [0.9, -0.9, 0.9],
  man: [0.1, 0.9, 0.9],   woman: [0.1, -0.9, 0.9],
  prince: [0.8, 0.9, 0.2], princess: [0.8, -0.9, 0.2],
  boy: [0.1, 0.9, 0.1],   girl: [0.1, -0.9, 0.1],
};

// king - man + woman = ?
const x = add(sub(W.king, W.man), W.woman);
console.log("king - man + woman = " + fmt(x));

const items = Object.entries(W)
  .filter(([id]) => !["king", "man", "woman"].includes(id))
  .map(([id, v]) => ({ id, v }));
// topK = sort by cosine, keep the best k (more in the Similarity search lesson)
for (const r of topK(x, items, 2)) console.log(r.id + " " + fmt(r.score));
