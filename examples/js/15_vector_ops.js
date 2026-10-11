// 15 Add, subtract, scale: make new vectors from the ones you have (the result still has 3 numbers)
import { vec, add, sub, scale, fmt } from "../../lib/zvect.js";

const a = vec(2, 0, 1);
const b = vec(0, 1, 2);
console.log("a + b = " + fmt(add(a, b)));
console.log("a - b = " + fmt(sub(a, b)));
console.log("2 * a = " + fmt(scale(a, 2)));

// every 3D vector = a mix of the 3 basis vectors e1, e2, e3
const e1 = vec(1, 0, 0), e2 = vec(0, 1, 0), e3 = vec(0, 0, 1);
const v = add(add(scale(e1, 2), scale(e2, 3)), scale(e3, 1));
console.log("2e1 + 3e2 + 1e3 = " + fmt(v));
