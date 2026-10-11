import { distance, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { P, name, COLOR, AXIS_NAMES, up, GRAPHS, greedy, brute } from "../js/graph.js";

// 5.5 ANN with a one-layer graph (WIP202610027): one idea only — link every point to its nearest neighbours once,
// then search by walking: always step to the neighbour that is closer to the query, stop when none is closer.
// Same 24 points as 5.6 HNSW (web/js/graph.js); M = 2 links per point.
const NB = GRAPHS[2];
const START = { f1: 0, a1: 8, t1: 16 };

export default {
  slug: "graph-walk",
  title: "ANN แบบกราฟชั้นเดียว: เดินไปหาเพื่อนบ้านที่ใกล้กว่า",
  en: "ANN: neighbour graph walk",
  example: "29_nsw_graph",
  axisNames: AXIS_NAMES,
  view: { dist: 12.5, yaw: 0.75 },
  intro: `
    <p>ก่อนค้น ต่อเส้นจากทุกจุดไปหา <b>เพื่อนบ้านที่ใกล้ที่สุด</b> ไว้ล่วงหน้า (บทนี้จุดละ 2 เส้น) ได้เป็น <b>กราฟ</b></p>
    <p>ตอนค้น เริ่มจากจุดไหนก็ได้ แล้ว <b>ก้าวไปหาเพื่อนบ้านที่ใกล้ query กว่า</b> ทีละก้าว จนไม่มีเพื่อนบ้านคนไหนใกล้กว่า ก็หยุด
    จุดส่วนใหญ่ไม่ถูกวัดเลย แต่ถ้าเริ่มไกล อาจเดินวนนาน หรือหยุดผิดที่</p>`,
  try: [
    "เริ่มที่ a1 (อยู่กลุ่มเดียวกับคำตอบ): 5 ครั้งก็เจอ a2",
    "เริ่มที่ f1 (อีกกลุ่ม): ยังเจอ a2 แต่ต้องเดินอ้อมและวัดถึง 13 ครั้ง",
    "เริ่มที่ t1: เดินไปติดอยู่ที่ t8 เพราะไม่มีเพื่อนบ้านคนไหนใกล้กว่าแล้ว = หยุดผิดที่",
  ],
  steps: [
    ["ก้าวหนึ่งครั้ง", "ย้ายไปเพื่อนบ้านที่ใกล้ query กว่า โดยไม่ต้องวัดทุกจุด"],
    ["เมื่อไหร่หยุด", "หยุดเมื่อไม่มีเพื่อนบ้านคนไหนใกล้กว่า แล้วตอบจุดนั้น"],
  ],
  lines: [
    [M.math(M.t("move\u00a0"), M.v("p"), M.o("→"), M.v("p′"), M.t("\u00a0if\u00a0"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("p′"), M.o(")")), M.o("<"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("p"), M.o(")"))),
      "ก้าวหนึ่งครั้ง · <b>q</b> = query · <b>p</b> = จุดที่ยืนอยู่ · <b>p′</b> = เพื่อนบ้านของ p (จุดที่มีเส้นต่อกัน) ตัวที่ใกล้ q ที่สุด · ถ้าใกล้ q กว่าจุดที่ยืนอยู่ ก็ย้ายไป · dist = ระยะ (บท 2.1)"],
    [M.math(M.t("stop when no neighbour is closer;\u00a0answer"), M.o("="), M.v("p")),
      "หยุดเมื่อเพื่อนบ้านทุกคนไกลกว่าจุดที่ยืนอยู่ แล้วตอบจุดนั้น · ไม่รับประกันว่าเป็นจุดที่ใกล้ที่สุดจริง (อาจติดอยู่ในกลุ่มที่ผิด)"],
  ],
  formulaFrom: "กราฟเพื่อนบ้านและการเดินแบบ greedy (ก้าวไปหาเพื่อนบ้านที่ใกล้ query กว่า จนไม่มีใครใกล้กว่า) มาจากคลิป Satyajit Das และทอล์ก Qdrant · จุด 24 จุดและการต่อจุดละ 2 เส้นผู้จัดทำเลือกเอง",
  symbols: [
    ["q", "query", "ลากด้วยแถบเลื่อน"],
    ["p", "จุดที่กำลังยืนอยู่", "เริ่มที่จุดที่เลือกไว้"],
    ["p′", "เพื่อนบ้านของ p ที่ใกล้ q ที่สุด", "ดูเฉพาะจุดที่มีเส้นต่อกับ p"],
    ["dist(q, p′) < dist(q, p)", "เพื่อนบ้านใกล้กว่าจุดที่ยืนอยู่ไหม", "ใช่ = ก้าว · ไม่มีใครใกล้กว่า = หยุด"],
  ],
  notes: `
    <h2>จากคลิป Satyajit Das</h2>
    <ul>
      <li>ต่อแต่ละเวกเตอร์กับเพื่อนบ้านที่ใกล้ที่สุดไว้ เส้นเหล่านี้บอกว่าอะไรอยู่ใกล้อะไร โดยไม่ต้องวัดระยะทุกคู่ตอนค้น</li>
      <li>ตัวอย่างในคลิปเริ่มจากบทความสูตรขนมปัง sourdough (ไม่เกี่ยวเลย) แล้วก้าวไปหาเพื่อนบ้านที่ใกล้คำถามกว่าเรื่อย ๆ ระยะลดจาก 1.43 → 0.95 → 0.52
        จนถึง "End your membership" โดยไม่ได้แตะข้อมูลส่วนใหญ่เลย</li>
      <li>ข้อเสีย: กราฟชั้นเดียวอาจ "วนอยู่ในซอย" นานกว่าจะถึงย่านที่ถูก บท 5.6 HNSW แก้ด้วยการเพิ่มชั้นที่เหมือนทางด่วน</li>
    </ul>
    <h2>จากทอล์ก Qdrant</h2>
    <p>HNSW เป็นกราฟแบบนี้ ค้นแบบ greedy จนไม่มีอะไรดีขึ้น จึง <b>ไม่รับประกัน</b> ว่าได้ตัวที่ใกล้ที่สุดจริง</p>
    <p class="fine">ความรู้ทั่วไป (ไม่ได้มาจากคลิป): กราฟในบทนี้คือกราฟเพื่อนบ้านใกล้สุดแบบง่าย · แนวคิดที่ต่อยอดจากกราฟแบบนี้ชื่อ NSW (navigable small world) ราวปี 2014 ซึ่งสร้างโดยใส่จุดทีละจุด จึงมีเส้นยาวปนอยู่บ้าง</p>`,
  refs: [["hnsw", "กราฟเพื่อนบ้าน, เดิน greedy (1.43 → 0.95 → 0.52), ไม่แตะข้อมูลส่วนใหญ่, วนในซอย"], ["qdrant", "greedy จนไม่ดีขึ้น ไม่รับประกันตัวใกล้สุด"]],
  mount(ui) {
    const st = { start: "f1" };
    const q = ui.vec3("query q", [0.2, 0.75, 0.1], { min: 0, max: 1, step: 0.05 });
    const pick = ui.choice("จุดเริ่ม", [["a1", "a1 (กลุ่ม animal)"], ["f1", "f1 (กลุ่ม food)"], ["t1", "t1 (กลุ่ม tech)"]], st, "start");
    ui.buttons("", [["สุ่มจุดเริ่ม (Random)", () => { const i = Math.floor(Math.random() * P.length); START[name(i)] = i; st.start = name(i); pick.set(st.start); }]]);
    const run = () => greedy(q, NB, START[st.start]);
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        const r = run(), b = brute(q);
        NB.forEach((list, i) => list.forEach((j) => { if (j > i) s.line(up(P[i]), up(P[j]), s.c.muted, { alpha: 0.35 }); }));
        for (let k = 0; k < r.path.length - 1; k++) s.line(up(P[r.path[k]]), up(P[r.path[k + 1]]), s.c.r, { width: 4 });
        P.forEach((p, i) => {
          const measured = r.seen.has(i), lab = i === r.cur || i === b || i === r.path[0];
          s.point(up(p), s.c[COLOR[Math.floor(i / 8)]], lab ? name(i) : "", { r: measured ? 6 : 3.5, ring: i === r.path[0] });
        });
        s.line(up(q), up(P[b]), s.c.ink, { dash: [3, 4] });
        s.point(up(q), s.c.a, "q", { r: 7 });
      },
      live() {
        const r = run(), b = brute(q), ok = r.cur === b;
        const rows = r.path.map((i, k) => `<tr class="${k === r.path.length - 1 ? "win" : ""}"><td>${k}</td><td>${name(i)}</td><td>${fmt(distance(q, P[i]))}</td></tr>`).join("");
        return M.math(M.t("measured"), M.o("="), M.n(r.count, "res"), M.t("\u2003of\u00a0"), M.n(P.length), M.t("\u00a0points")) +
          `<p class="verdict">${ok ? `เจอจุดที่ใกล้ที่สุดจริง (${name(b)})` : `<b>หยุดผิดที่</b> ที่ ${name(r.cur)} · จุดที่ใกล้ที่สุดจริงคือ ${name(b)} (เส้นประ)`}</p>` +
          `<p class="fintro">ทางที่เดิน (ระยะถึง q ลดลงทุกก้าว):</p><div class="scroll"><table class="rank"><thead><tr><th>ก้าว</th><th>จุด</th><th>ระยะถึง q</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
