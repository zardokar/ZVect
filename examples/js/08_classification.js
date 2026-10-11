// 08 Classification: average each class into a centroid,
// then a new point gets the label of the most similar centroid
import { mean, classify, fmt } from "../../lib/zvect.js";

const train = {
  food: [[0.9, 0.1, 0.0], [0.8, 0.0, 0.1], [1.0, 0.2, 0.0]],
  animal: [[0.1, 0.9, 0.0], [0.0, 1.0, 0.1], [0.2, 0.8, 0.1]],
  tech: [[0.0, 0.1, 0.9], [0.1, 0.0, 1.0], [0.0, 0.2, 0.8]],
};

const centroids = {};
for (const [label, pts] of Object.entries(train)) centroids[label] = mean(pts);
for (const [label, c] of Object.entries(centroids)) console.log(label + " centroid " + fmt(c));

for (const x of [[0.7, 0.2, 0.1], [0.1, 0.3, 0.9], [0.4, 0.5, 0.0]]) {
  const r = classify(x, centroids);
  console.log(fmt(x) + " -> " + r.label + " " + fmt(r.score));
}
