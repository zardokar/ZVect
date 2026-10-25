import { distance, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { P, name, AXIS_NAMES, GRAPHS, greedySteps, brute } from "../js/graph.js";
import { makeBoard, tag, COL, VIEW } from "../js/boardview.js";

// ANN with a one-layer graph (WIP202610027): one idea only — link every point to its nearest neighbours once,
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
  view: VIEW.board,
  wide: true,
  hint: "ลากเพื่อหมุน ใช้ล้อเมาส์ซูม ดับเบิลคลิกเพื่อรีเซ็ต · มุมขวาบนสลับ แบบกระดาน / ตำแหน่งจริง 3 มิติ",
  intro: `
    <p>ก่อนค้น ต่อเส้นจากทุกจุดไปหา <b>เพื่อนบ้านที่ใกล้ที่สุด</b> ไว้ล่วงหน้า (บทนี้จุดละ 2 เส้น) ได้เป็น <b>กราฟ</b></p>
    <p>ตอนค้น เริ่มจากจุดไหนก็ได้ แล้ว <b>ก้าวไปหาเพื่อนบ้านที่ใกล้ query กว่า</b> ทีละก้าว จนไม่มีเพื่อนบ้านคนไหนใกล้กว่า ก็หยุด
    จุดส่วนใหญ่ไม่ถูกวัดเลย แต่ถ้าเริ่มไกล อาจเดินวนนาน หรือหยุดผิดที่</p>`,
  try: [
    "เริ่มที่ a1 (อยู่กลุ่มเดียวกับคำตอบ): 5 ครั้งก็เจอ a2",
    "เริ่มที่ f1 (อีกกลุ่ม): ยังเจอ a2 แต่ต้องเดินอ้อมและวัดถึง 13 ครั้ง",
    "เริ่มที่ t1: เดินไปติดอยู่ที่ t8 เพราะไม่มีเพื่อนบ้านคนไหนใกล้กว่าแล้ว = หยุดผิดที่",
    "กด \"ทีละขั้น\" ดูว่าแต่ละก้าววัดเพื่อนบ้านตัวไหน (เส้นประเหลือง) แล้วกด \"ตำแหน่งจริง 3 มิติ\" ดูว่ากล่องเหล่านั้นอยู่ที่ไหนจริง",
  ],
  steps: [
    ["ก้าวหนึ่งครั้ง", "ย้ายไปเพื่อนบ้านที่ใกล้ query กว่า โดยไม่ต้องวัดทุกจุด"],
    ["เมื่อไหร่หยุด", "หยุดเมื่อไม่มีเพื่อนบ้านคนไหนใกล้กว่า แล้วตอบจุดนั้น"],
  ],
  lines: [
    [M.math(M.t("move\u00a0"), M.v("p"), M.o("→"), M.v("p′"), M.t("\u00a0if\u00a0"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("p′"), M.o(")")), M.o("<"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("p"), M.o(")"))),
      "ก้าวหนึ่งครั้ง · <b>q</b> = query · <b>p</b> = จุดที่ยืนอยู่ · <b>p′</b> = เพื่อนบ้านของ p (จุดที่มีเส้นต่อกัน) ตัวที่ใกล้ q ที่สุด · ถ้าใกล้ q กว่าจุดที่ยืนอยู่ ก็ย้ายไป · dist = ระยะ (บท {#distance})"],
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
      <li>ข้อเสีย: กราฟชั้นเดียวอาจ "วนอยู่ในซอย" นานกว่าจะถึงย่านที่ถูก บท {#vector-search} HNSW แก้ด้วยการเพิ่มชั้นที่เหมือนทางด่วน</li>
    </ul>
    <h2>จากทอล์ก Qdrant</h2>
    <p>HNSW เป็นกราฟแบบนี้ ค้นแบบ greedy จนไม่มีอะไรดีขึ้น จึง <b>ไม่รับประกัน</b> ว่าได้ตัวที่ใกล้ที่สุดจริง</p>
    <p class="fine">ความรู้ทั่วไป (ไม่ได้มาจากคลิป): กราฟในบทนี้คือกราฟเพื่อนบ้านใกล้สุดแบบง่าย · แนวคิดที่ต่อยอดจากกราฟแบบนี้ชื่อ NSW (navigable small world) ราวปี 2014 ซึ่งสร้างโดยใส่จุดทีละจุด จึงมีเส้นยาวปนอยู่บ้าง</p>`,
  refs: [["hnsw", "กราฟเพื่อนบ้าน, เดิน greedy (1.43 → 0.95 → 0.52), ไม่แตะข้อมูลส่วนใหญ่, วนในซอย"], ["qdrant", "greedy จนไม่ดีขึ้น ไม่รับประกันตัวใกล้สุด"],
    ["weaviate", "หน้าตาแบบกระดาน (พื้นตาราง กล่อง entry point query) และการเดินทีละขั้น"]],
  mount(ui) {
    const st = { start: "f1", at: 0, timer: null };
    const q = ui.vec3("query q", [0.2, 0.75, 0.1], { min: 0, max: 1, step: 0.05 });
    const pick = ui.choice("จุดเริ่ม", [["a1", "a1 (กลุ่ม animal)"], ["f1", "f1 (กลุ่ม food)"], ["t1", "t1 (กลุ่ม tech)"]], st, "start");
    ui.buttons("", [["สุ่มจุดเริ่ม (Random)", () => { const i = Math.floor(Math.random() * P.length); START[name(i)] = i; st.start = name(i); pick.set(st.start); }]]);
    const v = makeBoard();
    v.switch();
    let key = "", steps = [];
    const run = () => {                                    // recompute the walk when q or the start changed; back to step 0
      const k = q.join() + "|" + st.start;
      if (k !== key) { key = k; steps = greedySteps(q, NB, START[st.start]); st.at = 0; }
      return steps;
    };
    const stop = () => { clearInterval(st.timer); st.timer = null; };
    ui.buttons("ทีละขั้น", [
      ["◀ ย้อน", () => { stop(); st.at = Math.max(0, st.at - 1); }],
      ["ทีละขั้น ▶", () => { stop(); st.at = Math.min(run().length - 1, st.at + 1); }],
      ["▶ เล่น", () => {
        if (st.timer) return stop();
        if (st.at >= run().length - 1) st.at = 0;
        st.timer = setInterval(() => {
          if (v.scene?.draw !== draw || st.at >= run().length - 1) return stop();   // left the lesson, or at the end
          st.at++; ui.redraw();
        }, 1000);
      }],
      ["จบ ⏭", () => { stop(); st.at = run().length - 1; }],
    ]);
    const draw = (s) => {
      const tr = run(), r = tr[Math.min(st.at, tr.length - 1)], b = brute(q), start = START[st.start];
      const { qw } = v.draw(s, { r, b, q, nb: NB });
      tag(s, qw, "q", COL.q, 16, 14);
      if (r.cur !== start) tag(s, v.pos(P[start]), name(start) + " = จุดเริ่ม", "#cdd9e5", 24, -26);
      tag(s, v.pos(P[r.cur]), name(r.cur) + (r.done ? (r.cur === b ? " = คำตอบ ✓" : " = หยุดผิดที่ ✗") : st.at === 0 ? " = จุดเริ่ม" : " = ยืนอยู่"), COL.best, 26, -30);
      if (r.done && r.cur !== b) tag(s, v.pos(P[b]), name(b) + " ใกล้ที่สุดจริง", COL.truth, -150, -34);
    };
    return {
      draw,
      live() {
        const tr = run(), r = tr[Math.min(st.at, tr.length - 1)], b = brute(q), last = tr.length - 1;
        const say = st.at === 0 ? `ขั้น 0: ยืนที่ ${name(r.cur)} (จุดเริ่ม) และวัดระยะถึง q ครั้งแรก`
          : r.done ? `หยุด: เพื่อนบ้านของ ${name(r.cur)} ไม่มีตัวไหนใกล้ q กว่า ${name(r.cur)} (${fmt(distance(q, P[r.cur]))}) จึงตอบ ${name(r.cur)}`
          : `ขั้น ${st.at}: วัดเพื่อนบ้านของ ${name(r.from)} (เส้นประเหลือง) ตัวที่ใกล้ q ที่สุดคือ ${name(r.cur)} (${fmt(distance(q, P[r.cur]))}) ใกล้กว่า ${name(r.from)} (${fmt(distance(q, P[r.from]))}) จึงก้าวไป`;
        const verdict = r.done ? (r.cur === b ? `เจอจุดที่ใกล้ที่สุดจริง (${name(b)})` : `<b>หยุดผิดที่</b> ที่ ${name(r.cur)} · จุดที่ใกล้ที่สุดจริงคือ ${name(b)} (วงสีขาว)`) : "ยังเดินอยู่";
        const rows = r.path.map((i, k) => `<tr class="${k === r.path.length - 1 ? "win" : ""}"><td>${k}</td><td>${name(i)}</td><td>${fmt(distance(q, P[i]))}</td></tr>`).join("");
        return M.math(M.t("step"), M.o("="), M.n(st.at, "res"), M.t("\u00a0/\u00a0"), M.n(last), M.t("\u2003measured"), M.o("="), M.n(r.seen.size, "res"), M.t("\u2003of\u00a0"), M.n(P.length), M.t("\u00a0points")) +
          `<p class="stepsay">${say}</p><p class="verdict">${verdict}</p>` +
          `<p class="fintro">ทางที่เดินถึงขั้นนี้ (ระยะถึง q ลดลงทุกก้าว):</p><div class="scroll"><table class="rank"><thead><tr><th>ก้าว</th><th>จุด</th><th>ระยะถึง q</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
