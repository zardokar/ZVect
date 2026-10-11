// Edge-case rules that must be identical in JS / Python / C++ (run by npm run check)
import * as zv from "../../../lib/zvect.js";

const tryIt = (name, f) => { try { console.log(name + " = " + f()); } catch (e) { console.log(name + " throws " + e.message); } };
tryIt("add size mismatch", () => zv.fmt(zv.add([1, 2, 3], [1, 2])));
tryIt("dot size mismatch", () => zv.fmt(zv.dot([1, 2], [1, 2, 3])));
tryIt("mean empty", () => zv.fmt(zv.mean([])));
tryIt("mean ragged", () => zv.fmt(zv.mean([[1, 2], [1, 2, 3]])));
tryIt("classify empty", () => zv.classify([1, 0], {}).label);
tryIt("encode empty table", () => zv.fmt(zv.encode("cat", {})));
console.log("cosine zero = " + zv.fmt(zv.cosine([0, 0, 0], [1, 2, 3])));
console.log("normalize zero = " + zv.fmt(zv.normalize([0, 0])));
console.log("fmt tie 0.0625 = " + zv.fmt(0.0625));
console.log("fmt tie 0.0375 = " + zv.fmt(0.0375));
console.log("fmt -0 = " + zv.fmt(-0));
const tie = zv.classify([1, 1], { b: [1, 0], a: [0, 1] });
console.log("classify tie = " + tie.label);
const top = zv.topK([1, 0], [{ id: "p", v: [1, 1] }, { id: "q", v: [1, 1] }], 1);
console.log("topK tie = " + top[0].id);
const T = { "แมว": [0, 1], "กิน": [1, 0], cat: [0, 1] };
console.log("encode thai = " + zv.fmt(zv.encode("แมว กิน", T)));
console.log("encode CAT = " + zv.fmt(zv.encode("CAT!!", T)));
console.log("encode unknown = " + zv.fmt(zv.encode("constructor toString", T)));
// near-zero: 1e-300 squared underflows to 0, so the lib treats it as a zero vector; 1e-150 still works
console.log("cosine near-zero 1e-300 = " + zv.fmt(zv.cosine([1e-300, 0, 0], [1, 2, 3])));
console.log("cosine tiny 1e-150 = " + zv.fmt(zv.cosine([1e-150, 0, 0], [1, 2, 3])));
console.log("normalize near-zero = " + zv.fmt(zv.normalize([1e-300, 0])));
// on unit vectors dot == cosine and |a-b|^2 == 2 - 2cos
const ua = zv.normalize([3, 1, 0]), ub = zv.normalize([3, 2, 0]);
console.log("unit dot = " + zv.fmt(zv.dot(ua, ub)) + " cosine = " + zv.fmt(zv.cosine([3, 1, 0], [3, 2, 0])));
console.log("unit dist^2 = " + zv.fmt(zv.distance(ua, ub) ** 2) + " 2-2cos = " + zv.fmt(2 - 2 * zv.cosine(ua, ub)));
