import { distance } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { P, name, COLOR, HUBS, AXIS_NAMES, up, GRAPHS, greedy, brute } from "../js/graph.js";

// 5.6 HNSW (was "Vector search"; slug kept so old links work): the one-layer walk of 5.5 plus a top layer.
// Top layer: only 3 hubs; start at the hub closest to q. Bottom layer: the greedy walk of 5.5.
function walk(q, nb) {
  const seen = new Map();
  let cur = HUBS[0];
  for (const h of HUBS) { seen.set(h, distance(q, P[h])); if (seen.get(h) < seen.get(cur)) cur = h; }
  return greedy(q, nb, cur, seen);
}

export default {
  slug: "vector-search",
  title: "HNSW: กราฟหลายชั้น ขึ้นทางด่วนก่อน แล้วค่อยลงซอย",
  en: "HNSW: layered graph",
  example: "13_vector_search",
  axisNames: ["food", "animal", "tech"],
  view: { dist: 11, yaw: 0.75 },
  intro: `
    <p>บท 5.5 เดินบนกราฟชั้นเดียว ถ้าเริ่มไกลก็เดินวนนานหรือหยุดผิดที่ <b>HNSW</b> (ย่อมาจาก Hierarchical Navigable Small World: ความรู้ทั่วไป) เพิ่ม <b>ชั้นบน</b>
    ที่มีจุดน้อย ๆ ไว้กระโดดไกล เหมือนทางด่วน แล้วค่อยลงไปเดินในซอย:</p>
    <ol class="try"><li>ชั้นบน (ทางด่วน): มีแค่จุดศูนย์กลาง 3 จุด เลือกจุดที่ใกล้ query ที่สุด</li>
    <li>ชั้นล่าง (ถนนในซอย): ดูเพื่อนบ้านของจุดที่ยืนอยู่ ถ้ามีตัวที่ใกล้กว่าก็ย้ายไป ทำซ้ำจนไม่มีตัวไหนใกล้กว่า</li></ol>
    <p>วัดน้อยครั้งกว่ามาก แต่ <b>อาจหยุดผิดที่</b> ถ้าเพื่อนบ้านน้อยเกินไป (M = จำนวนเพื่อนบ้านต่อจุด)</p>`,
  try: [
    "ตั้ง M = 2 กับ query เริ่มต้น: เดินแล้วหยุดที่ a5 แต่จุดที่ใกล้ที่สุดจริงคือ a8",
    "เปลี่ยนเป็น M = 3: เดินต่อถึง a8 ได้ แต่วัดเพิ่มเป็น 9 ครั้ง",
    "ลาก query ไปกลางกลุ่ม tech แล้วดูว่าวัดกี่ครั้ง เทียบกับวัดทุกจุด 24 ครั้ง",
  ],
  stepsWhy: "2 ขั้นตอน = 2 ชั้นของกราฟ",
  steps: [
    ["ชั้นบน: เลือกจุดเริ่ม", "วัดแค่ไม่กี่ hub ก็ได้จุดเริ่มที่อยู่ใกล้คำตอบ"],
    ["ชั้นล่าง: เดินหาเพื่อนบ้าน", "เดินแบบบท 5.5 จากจุดเริ่มนั้น จึงเดินสั้นกว่าเริ่มจากที่ไกล"],
  ],
  lines: [
    [M.math(M.v("p"), M.o("="), M.sub(M.t("argmin"), M.t("hub")), M.o("&#x2061;"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.t("hub"), M.o(")"))),
      "ชั้นบน: เริ่มที่จุดศูนย์กลาง (hub) ที่ใกล้ q ที่สุด · q = query · p = จุดที่ยืนอยู่ · argmin = เลือกตัวที่ระยะน้อยสุด (วัดแค่ 3 hub)"],
    [M.math(M.t("move\u00a0"), M.v("p"), M.o("→"), M.v("p′"), M.t("\u00a0if\u00a0"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("p′"), M.o(")")), M.o("<"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("p"), M.o(")"))),
      "ชั้นล่าง: เดินแบบบท 5.5 · p′ = เพื่อนบ้านของ p · ถ้าใกล้ q กว่า ย้ายไป · ทำซ้ำจนไม่มีใครใกล้กว่า แล้วหยุด · เริ่มใกล้คำตอบแล้ว จึงเดินสั้นกว่า แต่ถ้า M น้อยก็ยังหยุดผิดที่ได้"],
  ],
  symbols: [
    ["q", "query: จุดที่อยากหาเพื่อนที่ใกล้ที่สุด", "ลากด้วยแถบเลื่อน"],
    ["p", "จุดที่กำลังยืนอยู่ในกราฟ", "เริ่มจากจุดศูนย์กลางที่ใกล้ q ที่สุด (ชั้นบน)"],
    ["p′", "เพื่อนบ้านของ p (จุดที่มีเส้นต่อกับ p)", "สร้างไว้ล่วงหน้าตอนทำดัชนี"],
    ["dist(q, p′) < dist(q, p)", "เพื่อนบ้านคนนี้ใกล้ q กว่าจุดที่ยืนอยู่ไหม", "ถ้าใช่ย้ายไป ถ้าไม่มีใครใกล้กว่า หยุด"],
    ["M", "จำนวนเพื่อนบ้านที่แต่ละจุดเชื่อมไว้", "M มาก = แม่นขึ้น แต่วัดมากขึ้นและใช้หน่วยความจำมากขึ้น"],
  ],
  formulaFrom: "ชั้นบนมีจุดน้อยและเส้นยาว ชั้นล่างมีครบทุกจุด เริ่มค้นที่ชั้นบน เดินจนไม่มีเพื่อนบ้านใกล้กว่าแล้วลงชั้น (ทางด่วน → ถนนหลัก → ซอย) มาจากคลิป Satyajit Das · บทนี้ย่อเหลือ 2 ชั้นและเลือก hub 3 จุดเอง (ผู้จัดทำเลือก)",
  notes: `
    <h2>HNSW ของจริง (คลิป Satyajit Das)</h2>
    <ul>
      <li>ชั้นล่างสุดมีบทความครบทุกชิ้น และมีเส้นสั้น ๆ ไปหาเพื่อนบ้านเยอะ · ชั้นที่สูงขึ้นมีจุดน้อยลงและเส้นยาวขึ้น · ชั้นบนสุดเป็นแผนที่ทางด่วนโล่ง ๆ</li>
      <li>ค้นโดยเริ่มที่จุดเข้า (entry point) ชั้นบนสุด ก้าวไปหาเพื่อนบ้านที่ใกล้คำถามกว่า พอไม่มีใครใกล้กว่าก็ลงชั้น และใช้จุดที่ดีที่สุดตอนนั้นเป็นจุดเริ่มของชั้นถัดไป</li>
      <li>คลิปเปรียบเป็น "ทางด่วน ถนนหลัก ซอย" ผลคือดูแค่ส่วนเล็ก ๆ ของข้อมูล แต่ยังได้ผู้สมัครที่ใช้ได้ภายในมิลลิวินาที</li>
      <li>บทถัดไป: ชั้นล่างสุดของจริงเก็บผู้สมัครไว้หลายตัวพร้อมกัน (beam, บท 5.7) และจุดได้ขึ้นชั้นบนด้วยการโยนเหรียญตอนสร้าง (บท 5.8)</li>
    </ul>
    <h2>จากทอล์ก Qdrant</h2>
    <ul>
      <li>HNSW เป็นกราฟความใกล้ ค้นแบบ greedy จนไม่ดีขึ้น ไม่รับประกันตัวที่ใกล้ที่สุดจริง</li>
      <li>ใส่จุดใหม่ใช้แรงราว 2 เท่าของการค้น และต้องเข้าถึงหน่วยความจำแบบสุ่ม จึงต้องอยู่ใน RAM (บนดิสก์ช้า)</li>
    </ul>
    <p class="fine">ปีของแนวคิด (ความรู้ทั่วไป ไม่ได้มาจากคลิป): HNSW ราวปี 2016</p>`,
  refs: [["hnsw", "ชั้นของ HNSW (ทางด่วน / ถนนหลัก / ซอย), entry point, ลงชั้นเมื่อไม่ดีขึ้น"],
    ["qdrant", "greedy ไม่รับประกันตัวใกล้สุด, ใส่จุดใหม่ ~2 เท่าของการค้น, ต้องใช้ RAM"]],
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
