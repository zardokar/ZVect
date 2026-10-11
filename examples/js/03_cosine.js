// 03 Cosine similarity: compare DIRECTION only, ignore length
import { vec, cosine, angle, fmt } from "../../lib/zvect.js";

const a = vec(1, 1, 0);
console.log("same direction = " + fmt(cosine(a, vec(2, 2, 0))));   //  1
console.log("perpendicular  = " + fmt(cosine(a, vec(1, -1, 0)))); //  0
console.log("opposite       = " + fmt(cosine(a, vec(-1, -1, 0)))); // -1

// angle in degrees
const deg = (angle(a, vec(1, 0, 0)) * 180) / Math.PI;
console.log("angle(a,x) = " + fmt(deg) + " deg");
