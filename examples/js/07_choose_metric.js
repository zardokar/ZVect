// 07 Choose a metric: cosine, distance and dot can pick different winners
// A = query, B = 2·A (same direction, longer), C = close to A but a different direction
import { cosine, distance, dot, normalize, fmt } from "../../lib/zvect.js";

const A = [3, 1, 0], B = [6, 2, 0], C = [3, 2, 0];

function show(title, q, b, c) {
  console.log(title);
  console.log("  B  cos " + fmt(cosine(q, b)) + "  dist " + fmt(distance(q, b)) + "  dot " + fmt(dot(q, b)));
  console.log("  C  cos " + fmt(cosine(q, c)) + "  dist " + fmt(distance(q, c)) + "  dot " + fmt(dot(q, c)));
}

show("raw (cos and dot pick B, distance picks C):", A, B, C);
show("normalized (all three pick B):", normalize(A), normalize(B), normalize(C));

// on unit vectors: |a - b|^2 = 2 - 2 cos
const d = distance(normalize(A), normalize(C));
console.log("dist^2 = " + fmt(d * d) + "  2 - 2cos = " + fmt(2 - 2 * cosine(A, C)));
