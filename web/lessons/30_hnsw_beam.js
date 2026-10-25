import { distance, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { P, name, AXIS_NAMES, GRAPHS, beamSteps, brute } from "../js/graph.js";
import { makeBoard, tag, COL, VIEW } from "../js/boardview.js";

// HNSW beam / efSearch (WIP202610027): one idea only — on the bottom layer keep ef candidates at once instead of one;
// a wider beam measures more points but misses less. Same graph as 5.5 / 5.6 (M = 2), top layer = the 3 hubs.
const NB = GRAPHS[2];

export default {
  slug: "hnsw-beam",
  title: "HNSW: beam (efSearch) เก็บผู้สมัครไว้หลายตัวพร้อมกัน",
  en: "HNSW: beam width (efSearch)",
  example: "30_hnsw_beam",
  axisNames: AXIS_NAMES,
  view: VIEW.board,
  wide: true,
  hint: "ลากเพื่อหมุน ใช้ล้อเมาส์ซูม ดับเบิลคลิกเพื่อรีเซ็ต · มุมขวาบนสลับ แบบกระดาน / ตำแหน่งจริง 3 มิติ",
  intro: `
    <p>บท {#vector-search} ชั้นล่างเดินแบบ "ถือผู้สมัครตัวเดียว" จึงหยุดผิดที่ได้ HNSW ของจริงเก็บ <b>ผู้สมัครไว้ ef ตัวพร้อมกัน</b> (เรียกว่า beam)
    แล้วขยายดูเพื่อนบ้านของตัวที่ดีที่สุดที่ยังไม่ได้ดูไปเรื่อย ๆ</p>
    <p>ef คือ <b>efSearch</b> ปรับได้ตอนค้น: กว้าง = วัดมากขึ้นแต่พลาดน้อยลง, แคบ = เร็วกว่าแต่อาจพลาด</p>`,
  try: [
    "ef = 1 กับ 2: หยุดที่ a5 ซึ่งไม่ใช่จุดที่ใกล้ที่สุด",
    "ef = 4: เจอ a8 (ตัวที่ใกล้ที่สุดจริง) แต่วัด 11 ครั้ง · ef = 8 วัด 14 ครั้ง",
    "ลาก query ไปที่อื่น: ef = 1 เจอตัวที่ใกล้ที่สุดราว 2 ใน 3 ครั้ง ef ยิ่งกว้างยิ่งพลาดน้อยลง แต่วัดเพิ่มขึ้น",
    "ef = 3 แล้วกด \"ทีละขั้น\": เหมือนภาพในคลิป Weaviate · เก็บ 3 ตัวที่ใกล้ที่สุด (เขียว + เหลือง) แล้วย้ายไปขยายตัวที่ดีที่สุด (เหลือง)",
  ],
  steps: [
    ["เก็บผู้สมัคร ef ตัว", "ถือหลายตัวพร้อมกัน จึงหยุดผิดที่น้อยกว่าการถือตัวเดียว"],
    ["ขยายหนึ่งครั้ง", "ดูเพื่อนบ้านของผู้สมัครที่ดีที่สุดที่ยังไม่ได้ดู"],
    ["เมื่อไหร่หยุด", "หยุดเมื่อขยายต่อก็ไม่ได้ตัวที่ดีขึ้นแล้ว"],
  ],
  lines: [
    [M.math(M.t("keep"), M.o("="), M.i("ef"), M.t("\u00a0closest found so far")),
      "beam · ef = จำนวนผู้สมัครที่เก็บได้พร้อมกัน (efSearch) · ef = 1 ก็คือการเดินตัวเดียวแบบบท {#vector-search}"],
    [M.math(M.t("expand\u00a0"), M.v("c"), M.o("="), M.t("closest not yet expanded")),
      "ขยายหนึ่งครั้ง · <b>c</b> = ผู้สมัครที่ใกล้ q ที่สุดที่ยังไม่ได้ดูเพื่อนบ้าน · ขยาย = ดูเพื่อนบ้านทุกตัวของ c · เพื่อนบ้านตัวไหนใกล้กว่าตัวที่แย่ที่สุดใน keep ก็เข้าไปแทน (keep มีได้ไม่เกิน ef ตัว)"],
    [M.math(M.t("stop if\u00a0"), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.v("c"), M.o(")")), M.o(">"), M.t("worst kept")),
      "หยุดเมื่อผู้สมัครที่ดีที่สุดที่ยังไม่ได้ขยาย ยังไกลกว่าตัวที่แย่ที่สุดที่เก็บไว้ (ขยายต่อก็ไม่ช่วยแล้ว) แล้วตอบตัวที่ดีที่สุดใน keep"],
  ],
  formulaFrom: "การเก็บผู้สมัครหลายตัวที่ชั้นล่าง (beam), ความกว้าง = efSearch ปรับได้ตอนค้น, กว้าง = แม่นขึ้น แคบ = เร็วแต่อาจพลาด มาจากคลิป Satyajit Das และทอล์ก Qdrant · กติกาขยายและหยุดในขั้นตอน 2–3 เป็นความรู้ทั่วไป (ตามอัลกอริทึม HNSW) คลิปไม่ได้ลงรายละเอียด · จุดและกราฟเหมือนบท {#graph-walk}–{#vector-search}",
  symbols: [
    ["ef", "efSearch: จำนวนผู้สมัครที่เก็บพร้อมกันที่ชั้นล่าง", "เลือก 1, 2, 3, 4, 8 (คลิป Weaviate ใช้ 3)"],
    ["keep", "ผู้สมัคร ef ตัวที่ดีที่สุดที่เจอมา", "กล่องสีเขียว (และสีเหลือง) ในภาพ"],
    ["c", "ผู้สมัครที่ใกล้ q ที่สุดที่ยังไม่ได้ขยาย", "กล่องสีเหลือง = กำลังขยาย"],
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
  refs: [["hnsw", "beam ที่ชั้นล่าง, efSearch ปรับตอนค้น, ตัวอย่าง beam แคบ / กว้างบนจอ, การแลกที่ปรับได้"], ["qdrant", "beam size แลกความแม่นกับความเร็ว"],
    ["weaviate", "ภาพการค้นด้วย ef = 3: calculate 3 closest to query, recenter on best candidate, หน้าตาแบบกระดาน"]],
  mount(ui) {
    const st = { ef: 3, at: 0, timer: null };
    const q = ui.vec3("query q", [0.5, 0.7, 0.1], { min: 0, max: 1, step: 0.05 });
    ui.choice("ความกว้าง beam (efSearch)", [[1, "ef = 1"], [2, "ef = 2"], [3, "ef = 3"], [4, "ef = 4"], [8, "ef = 8"]], st, "ef");
    const v = makeBoard();
    v.switch();
    let key = "", steps = [];
    const run = () => {
      const k = q.join() + "|" + st.ef;
      if (k !== key) { key = k; steps = beamSteps(q, NB, st.ef); st.at = 0; }
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
          if (v.scene?.draw !== draw || st.at >= run().length - 1) return stop();
          st.at++; ui.redraw();
        }, 1000);
      }],
      ["จบ ⏭", () => { stop(); st.at = run().length - 1; }],
    ]);
    const draw = (s) => {
      const tr = run(), r = tr[Math.min(st.at, tr.length - 1)], b = brute(q);
      const { qw } = v.draw(s, { r, b, q, nb: NB });
      tag(s, qw, "q", COL.q, 16, 14);
      tag(s, v.pos(P[r.cur]), name(r.cur) + (r.done ? (r.cur === b ? " = คำตอบ ✓" : " = พลาด ✗") : st.at === 0 ? " = เริ่มชั้นล่าง" : " = กำลังขยาย"), COL.best, 26, -30);
      if (r.done && r.cur !== b) tag(s, v.pos(P[b]), name(b) + " ใกล้ที่สุดจริง", COL.truth, -150, -34);
    };
    return {
      draw,
      live() {
        const tr = run(), r = tr[Math.min(st.at, tr.length - 1)], b = brute(q), last = tr.length - 1;
        const say = st.at === 0 ? `ขั้น 0: ชั้นบนวัด hub 3 จุด (f1, a1, t1) แล้วลงมาเริ่มชั้นล่างที่ ${name(r.hub)} ซึ่งใกล้ q ที่สุด`
          : r.done ? `หยุด: ตัวที่ยังไม่ได้ขยายไกลกว่าตัวที่แย่ที่สุดใน ${st.ef} ตัวที่เก็บไว้ จึงตอบ ${name(r.cur)} (${fmt(distance(q, P[r.cur]))})`
          : `ขั้น ${st.at}: ขยาย ${name(r.cur)} (สีเหลือง) วัดเพื่อนบ้านใหม่ ${r.hot.length} จุด แล้วเก็บไว้ ${st.ef} ตัวที่ใกล้ q ที่สุด (${r.added ? "มีตัวใหม่เข้า " + r.added : "ไม่มีตัวใหม่เข้า"})`;
        const verdict = r.done ? (r.cur === b ? `ได้ ${name(r.cur)} = จุดที่ใกล้ที่สุดจริง` : `<b>พลาด</b>: ได้ ${name(r.cur)} แต่จุดที่ใกล้ที่สุดจริงคือ ${name(b)} (วงสีขาว)`) : "ยังขยายอยู่";
        const rows = r.keep.map((i, k) => `<tr class="${k === 0 ? "win" : ""}"><td>${k + 1}</td><td>${name(i)}</td><td>${fmt(distance(q, P[i]))}</td></tr>`).join("");
        return M.math(M.t("step"), M.o("="), M.n(st.at, "res"), M.t("\u00a0/\u00a0"), M.n(last), M.t("\u2003measured"), M.o("="), M.n(r.seen.size, "res"), M.t("\u2003of\u00a0"), M.n(P.length), M.t("\u2003(ef\u00a0"), M.o("="), M.n(st.ef), M.t(")")) +
          `<p class="stepsay">${say}</p><p class="verdict">${verdict}</p>` +
          `<p class="fintro">ผู้สมัครที่เก็บไว้ตอนนี้ (keep, ไม่เกิน ef ตัว):</p><div class="scroll"><table class="rank"><thead><tr><th>#</th><th>จุด</th><th>ระยะถึง q</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
