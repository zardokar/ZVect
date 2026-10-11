import { distance, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { P, name, COLOR, HUBS, AXIS_NAMES, up, GRAPHS, beam, brute } from "../js/graph.js";

// 5.7 HNSW beam / efSearch (WIP202610027): one idea only — on the bottom layer keep ef candidates at once instead of one;
// a wider beam measures more points but misses less. Same graph as 5.5 / 5.6 (M = 2), top layer = the 3 hubs.
const NB = GRAPHS[2];
function run(q, ef) {
  const seen = new Map();
  let hub = HUBS[0];
  for (const h of HUBS) { seen.set(h, distance(q, P[h])); if (seen.get(h) < seen.get(hub)) hub = h; }
  return { hub, ...beam(q, NB, hub, ef, seen) };
}

export default {
  slug: "hnsw-beam",
  title: "HNSW: beam (efSearch) เก็บผู้สมัครไว้หลายตัวพร้อมกัน",
  en: "HNSW: beam width (efSearch)",
  example: "30_hnsw_beam",
  axisNames: AXIS_NAMES,
  view: { dist: 12.5, yaw: 0.75 },
  intro: `
    <p>บท 5.6 ชั้นล่างเดินแบบ "ถือผู้สมัครตัวเดียว" จึงหยุดผิดที่ได้ HNSW ของจริงเก็บ <b>ผู้สมัครไว้ ef ตัวพร้อมกัน</b> (เรียกว่า beam)
    แล้วขยายดูเพื่อนบ้านของตัวที่ดีที่สุดที่ยังไม่ได้ดูไปเรื่อย ๆ</p>
    <p>ef คือ <b>efSearch</b> ปรับได้ตอนค้น: กว้าง = วัดมากขึ้นแต่พลาดน้อยลง, แคบ = เร็วกว่าแต่อาจพลาด</p>`,
  try: [
    "ef = 1 กับ 2: หยุดที่ a5 ซึ่งไม่ใช่จุดที่ใกล้ที่สุด",
    "ef = 4: เจอ a8 (ตัวที่ใกล้ที่สุดจริง) แต่วัด 11 ครั้ง · ef = 8 วัด 14 ครั้ง",
    "ลาก query ไปที่อื่น: ef = 1 เจอตัวที่ใกล้ที่สุดราว 2 ใน 3 ครั้ง ef ยิ่งกว้างยิ่งพลาดน้อยลง แต่วัดเพิ่มขึ้น",
  ],
  steps: [
    ["เก็บผู้สมัคร ef ตัว", "ถือหลายตัวพร้อมกัน จึงหยุดผิดที่น้อยกว่าการถือตัวเดียว"],
    ["ขยายหนึ่งครั้ง", "ดูเพื่อนบ้านของผู้สมัครที่ดีที่สุดที่ยังไม่ได้ดู"],
    ["เมื่อไหร่หยุด", "หยุดเมื่อขยายต่อก็ไม่ได้ตัวที่ดีขึ้นแล้ว"],
  ],
  lines: [
    [M.math(M.t("keep"), M.o("="), M.i("ef"), M.t("\u00a0closest found so far")),
      "beam · ef = จำนวนผู้สมัครที่เก็บได้พร้อมกัน (efSearch) · ef = 1 ก็คือการเดินตัวเดียวแบบบท 5.6"],
    [M.math(M.t("expand\u00a0"), M.v("c"), M.o("="), M.t("closest not yet expanded")),
      "ขยายหนึ่งครั้ง · <b>c</b> = ผู้สมัครที่ใกล้ q ที่สุดที่ยังไม่ได้ดูเพื่อนบ้าน · ขยาย = ดูเพื่อนบ้านทุกตัวของ c · เพื่อนบ้านตัวไหนใกล้กว่าตัวที่แย่ที่สุดใน keep ก็เข้าไปแทน (keep มีได้ไม่เกิน ef ตัว)"],
    [M.math(M.t("stop if\u00a0"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("c"), M.o(")")), M.o(">"), M.t("worst kept")),
      "หยุดเมื่อผู้สมัครที่ดีที่สุดที่ยังไม่ได้ขยาย ยังไกลกว่าตัวที่แย่ที่สุดที่เก็บไว้ (ขยายต่อก็ไม่ช่วยแล้ว) แล้วตอบตัวที่ดีที่สุดใน keep"],
  ],
  formulaFrom: "การเก็บผู้สมัครหลายตัวที่ชั้นล่าง (beam), ความกว้าง = efSearch ปรับได้ตอนค้น, กว้าง = แม่นขึ้น แคบ = เร็วแต่อาจพลาด มาจากคลิป Satyajit Das และทอล์ก Qdrant · กติกาขยายและหยุดในขั้นตอน 2–3 เป็นความรู้ทั่วไป (ตามอัลกอริทึม HNSW) คลิปไม่ได้ลงรายละเอียด · จุดและกราฟเหมือนบท 5.5–5.6",
  symbols: [
    ["ef", "efSearch: จำนวนผู้สมัครที่เก็บพร้อมกันที่ชั้นล่าง", "เลือก 1, 2, 4, 8"],
    ["keep", "ผู้สมัคร ef ตัวที่ดีที่สุดที่เจอมา", "วงแหวนในภาพ"],
    ["c", "ผู้สมัครที่ใกล้ q ที่สุดที่ยังไม่ได้ขยาย", "จุดใหญ่สีม่วงในภาพ = ขยายแล้ว"],
    ["worst kept", "ตัวที่ไกล q ที่สุดใน keep", "ใช้ตัดสินว่าจะรับเพื่อนบ้านใหม่และจะหยุดเมื่อไหร่"],
  ],
  notes: `
    <h2>จากคลิป Satyajit Das</h2>
    <ul>
      <li>ชั้นล่างสุดเก็บชุดผู้สมัครเล็ก ๆ ไว้ (beam) ความกว้างคือ <b>efSearch</b> ปรับได้ตอนค้น</li>
      <li>beam กว้างตรวจผู้สมัครมากขึ้น มักได้คำตอบที่ดีกว่า · beam แคบเร็วกว่า แต่อาจพลาดตัวที่ดีกว่านิดหน่อย</li>
      <li>ตัวอย่างบนจอ: beam แคบได้ Subscription settings 1.70, Pause your plan 1.71, Manage billing 2.14 ·
        beam กว้างได้ End your membership today 1.10 (คำตอบที่ถูก), Membership FAQ 1.36, Account closure tips 1.39 …
        (คลิปไม่ได้บอกว่าตัวเลขระยะมาจากไหน ให้ถือเป็นตัวเลขประกอบภาพ)</li>
      <li>สรุปในคลิป: beam แคบ เร็ว บางทีพลาด ใช้หน่วยความจำน้อย · beam กว้าง ยังเร็วอยู่ มักเจอ ใช้หน่วยความจำปานกลาง เป็น "การแลกที่ปรับได้"</li>
    </ul>
    <h2>จากทอล์ก Qdrant</h2>
    <p>ขนาด beam คือตัวแลกระหว่างความแม่นกับความเร็ว</p>`,
  refs: [["hnsw", "beam ที่ชั้นล่าง, efSearch ปรับตอนค้น, ตัวอย่าง beam แคบ / กว้างบนจอ, การแลกที่ปรับได้"], ["qdrant", "beam size แลกความแม่นกับความเร็ว"]],
  mount(ui) {
    const st = { ef: 1 };
    const q = ui.vec3("query q", [0.5, 0.7, 0.1], { min: 0, max: 1, step: 0.05 });
    ui.choice("ความกว้าง beam (efSearch)", [[1, "ef = 1"], [2, "ef = 2"], [4, "ef = 4"], [8, "ef = 8"]], st, "ef");
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        const r = run(q, st.ef), b = brute(q);
        NB.forEach((list, i) => list.forEach((j) => { if (j > i) s.line(up(P[i]), up(P[j]), s.c.muted, { alpha: 0.3 }); }));
        P.forEach((p, i) => {
          const kept = r.keep.includes(i), exp = r.expanded.includes(i), measured = r.seen.has(i);
          s.point(up(p), exp ? s.c.r : s.c[COLOR[Math.floor(i / 8)]], kept || i === b ? name(i) : "", { r: exp ? 6.5 : measured ? 5 : 3, ring: kept });
        });
        s.line(up(q), up(P[r.cur]), s.c.r, { width: 3 });
        if (r.cur !== b) s.line(up(q), up(P[b]), s.c.ink, { dash: [3, 4] });
        s.point(up(q), s.c.a, "q", { r: 7 });
      },
      live() {
        const r = run(q, st.ef), b = brute(q), ok = r.cur === b;
        const rows = r.keep.map((i, k) => `<tr class="${k === 0 ? "win" : ""}"><td>${k + 1}</td><td>${name(i)}</td><td>${fmt(distance(q, P[i]))}</td></tr>`).join("");
        return M.math(M.t("measured"), M.o("="), M.n(r.count, "res"), M.t("\u2003of\u00a0"), M.n(P.length), M.t("\u2003(ef\u00a0"), M.o("="), M.n(st.ef), M.t(")")) +
          `<p class="verdict">เริ่มชั้นล่างที่ ${name(r.hub)} · ${ok ? `ได้ ${name(r.cur)} = จุดที่ใกล้ที่สุดจริง` : `<b>พลาด</b>: ได้ ${name(r.cur)} แต่จุดที่ใกล้ที่สุดจริงคือ ${name(b)}`}</p>` +
          `<p class="fintro">ผู้สมัครที่เก็บไว้ตอนจบ (keep, ไม่เกิน ef ตัว):</p><div class="scroll"><table class="rank"><thead><tr><th>#</th><th>จุด</th><th>ระยะถึง q</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
