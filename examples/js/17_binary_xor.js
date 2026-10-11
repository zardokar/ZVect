// 17 1-bit vectors (Qdrant talk, 25:25): 1 bit per dimension (here: positive -> 1), compare with XOR + popcount
import { vec, distance, fmt } from "../../lib/zvect.js";

const p = vec(0.9, -0.2, 0.4, -0.7, 0.1, 0.3, -0.5, 0.8);
const q = vec(0.7, 0.1, 0.5, -0.6, -0.2, 0.2, -0.4, 0.9);
const pack = (v) => v.reduce((n, x, i) => n | ((x > 0 ? 1 : 0) << i), 0);   // dimension i -> bit i
const popcount = (n) => { let c = 0; while (n) { c += n & 1; n >>>= 1; } return c; };
const bitsText = (n, d) => Array.from({ length: d }, (_, i) => (n >> i) & 1).join("");
const P = pack(p), Q = pack(q);
console.log("bits p = " + bitsText(P, p.length));
console.log("bits q = " + bitsText(Q, q.length));
console.log("p XOR q = " + bitsText(P ^ Q, p.length));
console.log("popcount(p XOR q) = " + popcount(P ^ Q) + " of " + p.length + " dimensions differ");
console.log("full-precision distance(p, q) = " + fmt(distance(p, q)));
