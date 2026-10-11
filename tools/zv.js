// zv.js — vector calculator for the terminal that shows every step.
// Run:  npm run zv -- dot 1,2,3 4,5,6      or      node tools/zv.js cos 1,0,0 1,1,0
import * as zv from "../lib/zvect.js";

const HELP = `usage: node tools/zv.js <command> <a> [b | k]
  vectors are comma lists, e.g. 1,2,3

  norm a        length |a|
  normalize a   a / |a|
  add a b       a + b
  sub a b       a - b
  scale a k     k * a
  dot a b       a . b
  cos a b       cosine similarity
  angle a b     angle in degrees
  dist a b      distance |a - b|
  proj b a      shadow of b on a`;

const n = (x) => String(Math.round(x * 1000) / 1000 + 0);
const show = (v) => "[" + v.map(n).join(", ") + "]";
const parse = (s) => {
  const parts = String(s ?? "").split(",");
  const v = parts.map((p) => (p.trim() === "" ? NaN : Number(p)));
  if (!s || v.some(Number.isNaN)) throw new Error(`not a vector: "${s ?? ""}" (use 1,2,3)`);
  return v;
};
const pairs = (a, b, op) => a.map((x, i) => `${n(x)}${op}${n(b[i])}`);

const CMDS = {
  norm(a) {
    return [`|a| = sqrt(${a.map((x) => n(x) + "²").join(" + ")})`, `    = sqrt(${n(zv.dot(a, a))})`, `    = ${n(zv.norm(a))}`];
  },
  normalize(a) {
    return [`|a| = ${n(zv.norm(a))}`, `a / |a| = ${show(zv.normalize(a))}`, `check: length = ${n(zv.norm(zv.normalize(a)))}`];
  },
  add: (a, b) => [`a + b = (${pairs(a, b, " + ").join(", ")})`, `      = ${show(zv.add(a, b))}`],
  sub: (a, b) => [`a - b = (${pairs(a, b, " - ").join(", ")})`, `      = ${show(zv.sub(a, b))}`],
  scale(a, _b, k) {
    return [`${n(k)} * a = (${a.map((x) => `${n(k)}×${n(x)}`).join(", ")})`, `      = ${show(zv.scale(a, k))}`];
  },
  dot(a, b) {
    return [`a·b = ${pairs(a, b, "×").join(" + ")}`, `    = ${a.map((x, i) => n(x * b[i])).join(" + ")}`, `    = ${n(zv.dot(a, b))}`];
  },
  cos(a, b) {
    if (zv.norm(a) === 0 || zv.norm(b) === 0) return ["cos is undefined for a zero vector (the lib returns 0 by convention)"];
    return [
      `a·b = ${n(zv.dot(a, b))}   |a| = ${n(zv.norm(a))}   |b| = ${n(zv.norm(b))}`,
      `cos = a·b / (|a||b|) = ${n(zv.dot(a, b))} / ${n(zv.norm(a) * zv.norm(b))}`,
      `    = ${n(zv.cosine(a, b))}`,
    ];
  },
  angle(a, b) {
    if (zv.norm(a) === 0 || zv.norm(b) === 0) return ["angle is undefined for a zero vector"];
    const c = zv.cosine(a, b);
    return [`cos θ = ${n(c)}`, `θ = acos(${n(c)}) = ${n((zv.angle(a, b) * 180) / Math.PI)}°`];
  },
  dist(a, b) {
    const d = zv.sub(a, b);
    return [`a - b = ${show(d)}`, `|a - b| = sqrt(${d.map((x) => n(x) + "²").join(" + ")})`, `        = ${n(zv.distance(a, b))}`];
  },
  proj(b, a) {
    return [`proj = (a·b / a·a) * a = (${n(zv.dot(a, b))} / ${n(zv.dot(a, a))}) * ${show(a)}`, `     = ${show(zv.project(b, a))}`];
  },
};

const [cmd, x, y] = process.argv.slice(2);
if (!Object.prototype.hasOwnProperty.call(CMDS, cmd)) {
  console.log(HELP);
  process.exit(cmd ? 1 : 0);
}
try {
  const a = parse(x);
  const one = ["norm", "normalize"].includes(cmd);
  const k = cmd === "scale" && String(y ?? "").trim() !== "" ? Number(y) : NaN;
  if (cmd === "scale" && Number.isNaN(k)) throw new Error(`not a number: "${y}"`);
  const b = one || cmd === "scale" ? undefined : parse(y);
  if (b && b.length !== a.length) throw new Error(`size mismatch: ${a.length} vs ${b.length}`);
  console.log(cmd === "proj" ? `b = ${show(a)}\na = ${show(b)}` : `a = ${show(a)}` + (b ? `\nb = ${show(b)}` : ""));
  console.log(CMDS[cmd](a, b, k).join("\n"));
} catch (e) {
  console.error("error: " + e.message);
  process.exit(1);
}
