// 11 Euclidean distance: how far apart two points are = the length of a - b
import { vec, sub, norm, distance, scale, fmt } from "../../lib/zvect.js";

const a = vec(1, 2, 2);
const b = vec(4, 6, 2);
console.log("a - b = " + fmt(sub(a, b)));
console.log("|a - b| = " + fmt(norm(sub(a, b))));
console.log("distance(a, b) = " + fmt(distance(a, b)));
console.log("distance(b, a) = " + fmt(distance(b, a)));
console.log("distance(a, a) = " + fmt(distance(a, a)));

// same direction, different length: the tips are still apart
const c = scale(a, 2);
console.log("c = 2a = " + fmt(c) + "   distance(a, c) = " + fmt(distance(a, c)));
