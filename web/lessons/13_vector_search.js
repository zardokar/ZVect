import { distance } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// 24 points in 3 groups. axes: x = food, y = animal, z = tech
const P = [
  [0.9, 0.1, 0.0], [0.8, 0.2, 0.1], [1.0, 0.0, 0.1], [0.7, 0.1, 0.2], [0.9, 0.3, 0.0], [0.6, 0.2, 0.1], [0.8, 0.0, 0.3], [0.55, 0.45, 0.0],
  [0.1, 0.9, 0.0], [0.2, 0.8, 0.1], [0.0, 1.0, 0.1], [0.1, 0.7, 0.2], [0.3, 0.9, 0.0], [0.2, 0.6, 0.1], [0.0, 0.8, 0.3], [0.4, 0.6, 0.05],
  [0.0, 0.1, 0.9], [0.1, 0.2, 0.8], [0.1, 0.0, 1.0], [0.2, 0.1, 0.7], [0.0, 0.3, 0.9], [0.1, 0.2, 0.6], [0.3, 0.0, 0.8], [0.05, 0.4, 0.6],
];
const name = (i) => "fat"[Math.floor(i / 8)] + (i % 8 + 1);
const COLOR = ["x", "y", "z"];
const HUBS = [0, 8, 16];
const S = 4;
const up = (v) => v.map((x) => x * S);

function graph(M) {   // link each point to its M nearest, both ways
  const nb = P.map(() => new Set());
  P.forEach((p, i) => {
    const near = P.map((q, j) => [distance(p, q), j]).filter(([, j]) => j !== i).sort((x, y) => x[0] - y[0] || x[1] - y[1]).slice(0, M);
    for (const [, j] of near) { nb[i].add(j); nb[j].add(i); }
  });
  return nb.map((s) => [...s].sort((x, y) => x - y));
}
const GRAPHS = { 1: graph(1), 2: graph(2), 3: graph(3) };

function walk(q, nb) {   // top layer: best hub; bottom layer: move to a closer neighbour until none is closer
  const seen = new Map();
  const d = (i) => { if (!seen.has(i)) seen.set(i, distance(q, P[i])); return seen.get(i); };
  let cur = HUBS[0];
  for (const h of HUBS) if (d(h) < d(cur)) cur = h;
  const path = [cur];
  for (;;) {
    let best = cur;
    for (const j of nb[cur]) if (d(j) < d(best)) best = j;
    if (best === cur) break;
    cur = best; path.push(cur);
  }
  return { cur, count: seen.size, path, seen };
}
const brute = (q) => P.reduce((b, p, i) => (distance(q, p) < distance(q, P[b]) ? i : b), 0);

export default {
  slug: "vector-search",
  title: "Vector search: ค้นเร็วโดยไม่วัดทุกจุด",
  en: "Vector search",
  example: "13_vector_search",
  axisNames: ["food", "animal", "tech"],
  view: { dist: 11, yaw: 0.75 },
  intro: `
    <p>บท 4.1–4.3 วัด query กับ <b>ทุกชิ้น</b> ถ้ามีล้านชิ้นก็ต้องวัดล้านครั้งต่อคำถาม
    ดัชนีแบบ <b>กราฟ</b> (แนวคิดของ HNSW) เก็บไว้ล่วงหน้าว่าจุดไหนอยู่ใกล้จุดไหน แล้วค้นด้วยการ <b>เดิน</b>:</p>
    <ol class="try"><li>ชั้นบน (ทางด่วน): มีแค่จุดศูนย์กลาง 3 จุด เลือกจุดที่ใกล้ query ที่สุด</li>
    <li>ชั้นล่าง (ถนนในซอย): ดูเพื่อนบ้านของจุดที่ยืนอยู่ ถ้ามีตัวที่ใกล้กว่าก็ย้ายไป ทำซ้ำจนไม่มีตัวไหนใกล้กว่า</li></ol>
    <p>วัดน้อยครั้งกว่ามาก แต่ <b>อาจหยุดผิดที่</b> ถ้าเพื่อนบ้านน้อยเกินไป (M = จำนวนเพื่อนบ้านต่อจุด)</p>`,
  try: [
    "ตั้ง M = 2 กับ query เริ่มต้น: เดินแล้วหยุดที่ a5 แต่จุดที่ใกล้ที่สุดจริงคือ a8",
    "เปลี่ยนเป็น M = 3: เดินต่อถึง a8 ได้ แต่วัดเพิ่มเป็น 9 ครั้ง",
    "ลาก query ไปกลางกลุ่ม tech แล้วดูว่าวัดกี่ครั้ง เทียบกับวัดทุกจุด 24 ครั้ง",
  ],
  lines: [
    [M.math(M.v("p"), M.o("="), M.sub(M.t("argmin"), M.t("hub")), M.o("&#x2061;"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.t("hub"), M.o(")"))),
      "ชั้นบน: เริ่มที่จุดศูนย์กลาง (hub) ที่ใกล้ q ที่สุด · q = query · p = จุดที่ยืนอยู่ · argmin = เลือกตัวที่ระยะน้อยสุด"],
    [M.math(M.t("move\u00a0"), M.v("p"), M.o("→"), M.v("p′"), M.t("\u00a0if\u00a0"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("p′"), M.o(")")), M.o("<"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("p"), M.o(")"))),
      "ชั้นล่าง: p′ = เพื่อนบ้านของ p (จุดที่มีเส้นต่อกัน) · ถ้าเพื่อนบ้านใกล้ q กว่า ย้ายไป · ทำซ้ำจนไม่มีใครใกล้กว่า แล้วหยุด (อาจหยุดผิดที่ถ้า M น้อย)"],
  ],
  symbols: [
    ["q", "query: จุดที่อยากหาเพื่อนที่ใกล้ที่สุด", "ลากด้วยแถบเลื่อน"],
    ["p", "จุดที่กำลังยืนอยู่ในกราฟ", "เริ่มจากจุดศูนย์กลางที่ใกล้ q ที่สุด (ชั้นบน)"],
    ["p′", "เพื่อนบ้านของ p (จุดที่มีเส้นต่อกับ p)", "สร้างไว้ล่วงหน้าตอนทำดัชนี"],
    ["dist(q, p′) < dist(q, p)", "เพื่อนบ้านคนนี้ใกล้ q กว่าจุดที่ยืนอยู่ไหม", "ถ้าใช่ย้ายไป ถ้าไม่มีใครใกล้กว่า หยุด"],
    ["M", "จำนวนเพื่อนบ้านที่แต่ละจุดเชื่อมไว้", "M มาก = แม่นขึ้น แต่วัดมากขึ้นและใช้หน่วยความจำมากขึ้น"],
  ],
  notes: `
    <h2>ทำไมต้องมีดัชนี</h2>
    <ul>
      <li>embedding ทำให้ค้นด้วยความหมายได้ แต่ไม่ได้ทำให้เร็วขึ้น: ค้นทุกชิ้นยังต้องวัดเท่าจำนวนเอกสาร</li>
      <li>ดัชนีแบบประมาณ (ANN) ยอมพลาดบ้างเล็กน้อยเพื่อให้เร็วขึ้นมาก</li>
    </ul>
    <h2>HNSW ของจริง</h2>
    <ul>
      <li>มีหลายชั้นเหมือนทางด่วน ถนนใหญ่ และซอย เริ่มที่ชั้นบนสุด เดินจนไม่มีเพื่อนบ้านใกล้กว่า แล้วลงชั้นถัดไป</li>
      <li>ชั้นล่างสุดเก็บผู้สมัครไว้หลายตัวพร้อมกัน จำนวนนี้คือ <b>efSearch</b> ตัวเดียวที่ปรับได้ตอนค้น</li>
      <li><b>M</b> (เพื่อนบ้านต่อจุด) และ <b>efConstruction</b> (ความพยายามตอนสร้าง) ตั้งตอนสร้างดัชนี</li>
      <li>จุดส่วนใหญ่อยู่แค่ชั้นล่าง: ตอนใส่จุดใหม่จะสุ่มว่าได้ขึ้นชั้นบนต่อไหม โอกาสราว 1/M ต่อชั้น</li>
      <li>ใช้หน่วยความจำมาก ระบบจึงมักบีบเวกเตอร์ (เช่นเหลือ 1 บิตต่อมิติ) ค้นก่อน แล้วคำนวณใหม่ด้วยค่าเต็ม</li>
    </ul>
    <h2>อีกแบบ: ต้นไม้แบ่งระนาบ</h2>
    <p>Annoy แบ่งจุดเป็นสองฝั่งด้วยระนาบซ้ำ ๆ จนเหลือกลุ่มเล็ก แล้วพา query ลงต้นไม้ราว 9–10 ขั้น ต้นเดียวพลาดได้ ใช้หลายต้นช่วย</p>`,
  refs: [["hnsw", "ปัญหาค้นทุกชิ้น, กราฟเพื่อนบ้าน, ชั้นของ HNSW, M, efSearch, efConstruction"],
    ["qdrant", "HNSW ใช้ RAM มาก, binary quantization แล้ว rescore, กราฟขาดเมื่อกรองข้อมูล"], ["ann", "ต้นไม้แบ่งระนาบแบบ Annoy"]],
  mount(ui) {
    const st = { m: 2 };
    const q = ui.vec3("query q", [0.5, 0.7, 0.1], { min: 0, max: 1, step: 0.05 });
    ui.choice("เพื่อนบ้านต่อจุด (M)", [[1, "M = 1"], [2, "M = 2"], [3, "M = 3"]], st, "m");
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        const nb = GRAPHS[st.m], r = walk(q, nb), b = brute(q);
        nb.forEach((list, i) => list.forEach((j) => { if (j > i) s.line(up(P[i]), up(P[j]), s.c.muted, { alpha: 0.35 }); }));
        for (let k = 0; k < r.path.length - 1; k++) s.line(up(P[r.path[k]]), up(P[r.path[k + 1]]), s.c.r, { width: 4 });
        P.forEach((p, i) => {
          const hub = HUBS.includes(i), measured = r.seen.has(i);
          s.point(up(p), s.c[COLOR[Math.floor(i / 8)]], i === r.cur || i === b || hub ? name(i) : "", { r: measured ? 6 : 3.5, ring: hub });
        });
        s.line(up(q), up(P[b]), s.c.ink, { dash: [3, 4] });
        s.point(up(q), s.c.a, "q", { r: 7 });
      },
      live() {
        const r = walk(q, GRAPHS[st.m]), b = brute(q);
        const same = r.cur === b;
        return `<div class="scroll"><table class="rank"><thead><tr><th>วิธี</th><th>วัดระยะ</th><th>ได้จุด</th><th>ระยะ</th></tr></thead><tbody>
          <tr><td>วัดทุกจุด</td><td>24 ครั้ง</td><td>${name(b)}</td><td>${distance(q, P[b]).toFixed(3)}</td></tr>
          <tr class="win"><td>เดินกราฟ M = ${st.m}</td><td>${r.count} ครั้ง</td><td>${name(r.cur)}</td><td>${distance(q, P[r.cur]).toFixed(3)}</td></tr>
          </tbody></table></div>
          <p class="verdict">ทางที่เดิน: ${r.path.map(name).join(" → ")} · ${same ? "ได้จุดเดียวกับวัดทุกจุด" : "<b>หยุดก่อนถึงจุดที่ใกล้ที่สุด</b> (เพื่อนบ้านไม่มีใครใกล้กว่า)"}</p>`;
      },
    };
  },
};
