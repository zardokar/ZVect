// 02 Dot product: multiply matching parts, then add them up
import { vec, dot, project, fmt } from "../../lib/zvect.js";

const a = vec(1, 2, 3);
const b = vec(4, 5, 6);
console.log("by hand = " + fmt(1 * 4 + 2 * 5 + 3 * 6));
console.log("dot(a,b) = " + fmt(dot(a, b)));

// perpendicular vectors -> dot = 0
console.log("dot(x,y) = " + fmt(dot(vec(1, 0, 0), vec(0, 1, 0))));

// shadow of b on a (projection)
console.log("proj b on a = " + fmt(project(b, a)));
