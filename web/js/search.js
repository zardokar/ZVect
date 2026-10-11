// search.js — shared data and scene for the three "search by ..." lessons (4.1 cosine, 4.2 distance, 4.3 dot).
// Each lesson uses ONE way to score (owner, 2026-10-11: the three ways were on one page and confused readers).
import { topK, distance, cosine, dot, norm, fmt } from "../../lib/zvect.js";
import { M } from "./kit.js";

// axes: x = food, y = animal, z = vehicle
export const ITEMS = [
  { id: "apple", v: [0.9, 0.1, 0.0] }, { id: "banana", v: [0.95, 0.05, 0.0] },
  { id: "rice", v: [0.85, 0.0, 0.05] }, { id: "cat", v: [0.05, 0.9, 0.1] },
  { id: "dog", v: [0.1, 0.95, 0.05] }, { id: "horse", v: [0.1, 0.8, 0.5] },
  { id: "car", v: [0.0, 0.05, 0.95] }, { id: "bike", v: [0.0, 0.1, 0.85] },
  { id: "food truck", v: [0.6, 0.0, 0.7] },
];
export const AXIS_NAMES = ["food", "animal", "vehicle"];
export const VIEW = { dist: 12, yaw: 0.75 };
const S = 4;
const up = (v) => v.map((x) => x * S);
const r3 = (x) => +x.toFixed(3);
const pair = (id) => M.row(M.o("("), M.v("q"), M.o(","), M.t(id), M.o(")"));

const METRICS = {
  cos: {
    rank: (q) => topK(q, ITEMS, 3),
    // cos(q, d) = (q·d) / (|q||d|) with the numbers of the #1 item
    show: (q, d) => M.math(M.fn("cos"), pair(d.id), M.o("="), M.frac(M.n(r3(dot(q, d.v))), M.row(M.n(r3(norm(q))), M.o("×"), M.n(r3(norm(d.v))))), M.o("="), M.n(cosine(q, d.v), "res")),
    order: "มากสุด = ใกล้สุด",
  },
  dist: {
    rank: (q) => topK(q, ITEMS, 3, (a, b) => -distance(a, b)).map((r) => ({ ...r, score: -r.score })),
    show: (q, d) => M.math(M.fn("dist"), pair(d.id), M.o("="),
      M.sqrt(...q.flatMap((x, i) => [i ? M.o("+") : "", M.sup(M.row(M.o("("), M.n(r3(x - d.v[i])), M.o(")")), M.n(2))])), M.o("="), M.n(distance(q, d.v), "res")),
    order: "น้อยสุด = ใกล้สุด",
  },
  dot: {
    rank: (q) => topK(q, ITEMS, 3, dot),
    show: (q, d) => M.math(M.v("q"), M.o("·"), M.t(d.id), M.o("="),
      ...q.flatMap((x, i) => [i ? M.o("+") : "", M.row(M.n(r3(x)), M.o("×"), M.n(r3(d.v[i])))]), M.o("="), M.n(dot(q, d.v), "res")),
    order: "มากสุด = ใกล้สุด",
  },
};

export function searchMount(ui, key) {
  const m = METRICS[key];
  const q = ui.vec3("query q", [0.7, 0.3, 0.0], { min: 0, max: 1, step: 0.05 });
  ui.buttons("ตั้ง query", [
    ["เริ่มต้น (0.7, 0.3, 0)", () => ui.setVec(q, [0.7, 0.3, 0])],
    ["query สั้น (0.5, 0.2, 0.1)", () => ui.setVec(q, [0.5, 0.2, 0.1])],
    ["ไปทาง vehicle (0.3, 0.1, 0.8)", () => ui.setVec(q, [0.3, 0.1, 0.8])],
  ]);
  return {
    draw(s) {
      s.grid(4); s.axes(4.6);
      const top = m.rank(q);
      top.forEach((r, i) => s.line(up(q), up(r.v), s.c.r, { width: 4 - i, alpha: 0.85 }));
      for (const it of ITEMS) {
        const k = top.findIndex((r) => r.id === it.id);
        s.point(up(it.v), k >= 0 ? s.c.r : s.c.ink, k >= 0 ? `${k + 1}. ${it.id}` : it.id, { r: k >= 0 ? 6 : 4 });
      }
      s.arrow([0, 0, 0], up(q), s.c.a, "q");
    },
    live() {
      const top = m.rank(q);
      const rows = top.map((r, i) => `<tr><td>${i + 1}</td><td${i ? "" : ' class="best"'}>${r.id}</td><td>${fmt(r.score)}</td></tr>`).join("");
      return `<p class="fintro">ขั้นตอน 1 กับอันดับ 1 (${top[0].id}):</p>` + m.show(q, top[0]) +
        `<p class="fintro">ขั้นตอน 2: ทำกับของทุกชิ้น แล้วเก็บ 3 อันดับ (${m.order})</p>` +
        `<div class="scroll"><table class="rank"><thead><tr><th>#</th><th>ของ</th><th>คะแนน</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    },
  };
}
