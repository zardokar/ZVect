import { cosine, distance, dot, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// 3.2 One-hot (WIP202610026): one idea only — one 1 at the word's position, the rest 0; every pair of words
// ends up equally far apart. A 3-word vocabulary so each one-hot vector is one axis of the 3D room.
const VOCAB = ["good", "bad", "great"];
const oneHot = (w) => VOCAB.map((x) => (x === w ? 1 : 0));
const S = 3;                                     // drawing scale only; the numbers stay 0 and 1
const up = (v) => v.map((x) => x * S);

export default {
  slug: "one-hot",
  title: "One-hot: เลข 1 ตัวเดียวตรงตำแหน่งของคำ",
  en: "One-hot",
  example: "22_one_hot",
  axisNames: ["position 1", "position 2", "position 3"],
  view: { dist: 13, yaw: 0.8 },
  intro: `
    <p><b>One-hot</b> แทนคำด้วยเวกเตอร์ที่ยาวเท่าจำนวนคำทั้งหมด มีเลข <b>1 ตัวเดียว</b> ตรงตำแหน่งของคำนั้น ช่องอื่นเป็น 0</p>
    <p>ทุกคู่คำจึง <b>ห่างกันเท่ากันหมด</b> ลำดับปลอมของเลขประจำคำ (บท 3.1) หายไป แต่ก็บอกไม่ได้ว่าคู่ไหนความหมายใกล้กัน</p>`,
  try: [
    "เลือก good กับ great แล้วเปลี่ยนเป็น bad กับ great: cosine และ distance เท่าเดิมทุกคู่",
    "เลือกคำเดียวกันทั้งสองช่อง: cosine 1, distance 0",
    "หมุนภาพ: ลูกศรทั้งสามตั้งฉากกัน เส้นประระหว่างปลายยาวเท่ากันทุกเส้น",
  ],
  linesIntro: "มี 3 บรรทัด: บรรทัด 1 สร้าง one-hot · บรรทัด 2 และ 3 วัดสองคำด้วย cosine (บท 2.3) และ distance (บท 2.1) แล้วดูว่าได้ค่าเดิมทุกคู่",
  lines: [
    [M.math(M.sub(M.v("h"), M.i("w")), M.o("="), M.tuple([M.n(0), M.o("…"), M.n(1, "res"), M.o("…"), M.n(0)])),
      "สร้าง one-hot ของคำ w · <b>h</b><sub>w</sub> = one-hot ของ w · ยาวเท่าจำนวนคำใน vocabulary (V ช่อง) · ช่องของ w เป็น 1 (สีม่วง) ช่องอื่นเป็น 0 · บทนี้ V = 3: good = (1, 0, 0), bad = (0, 1, 0), great = (0, 0, 1)"],
    [M.math(M.fn("cos"), M.row(M.o("("), M.sub(M.v("h"), M.i("a")), M.o(","), M.sub(M.v("h"), M.i("b")), M.o(")")), M.o("="), M.frac(M.row(M.sub(M.v("h"), M.i("a")), M.o("·"), M.sub(M.v("h"), M.i("b"))), M.row(M.n(1), M.o("×"), M.n(1))), M.o("="), M.n(0), M.t("\u2003if\u00a0"), M.i("a"), M.o("≠"), M.i("b")),
      "a, b = สองคำที่ต่างกัน · เลข 1 อยู่คนละช่อง คูณช่องที่ตรงกันได้ 0 ทุกช่อง dot จึงเป็น 0 · ความยาวของ one-hot เป็น 1 เสมอ · cosine = 0 คือตั้งฉากกัน ไม่ว่าคำคู่ไหน"],
    [M.math(M.abs(M.sub(M.v("h"), M.i("a")), M.o("−"), M.sub(M.v("h"), M.i("b"))), M.o("="), M.sqrt(M.sup(M.n(1), M.n(2)), M.o("+"), M.sup(M.row(M.o("−"), M.n(1)), M.n(2))), M.o("="), M.sqrt(M.n(2)), M.o("≈"), M.n("1.414")),
      "ลบกันแล้วเหลือ 1 กับ −1 อย่างละช่อง ที่เหลือเป็น 0 · ยกกำลังสองบวกกันได้ 2 ถอดรากได้ √2 · ทุกคู่ห่างกันเท่านี้พอดี"],
  ],
  formulaFrom: "one-hot (ยาวเท่าจำนวนคำ มี 1 ตัวเดียว) จากคลิป Under The Hood และ BlackBoard AI · ค่า cosine 0 และ distance √2 ≈ 1.414 ทุกคู่ คำนวณเองในไฟล์สรุปของทั้งสองคลิป (คลิปพูดแค่ว่า \"ทุกคำต่างกันเท่ากัน\")",
  symbols: [
    ["w", "คำหนึ่งคำ", "good, bad, great"],
    ["V", "จำนวนคำใน vocabulary = ความยาวของ one-hot", "บทนี้ 3 · คลิปยกตัวอย่าง 50,000"],
    ["h<sub>w</sub>", "one-hot ของ w", "great = (0, 0, 1)"],
    ["a, b", "สองคำที่เทียบ", "เลือกจากเมนูด้านล่าง"],
    ["h<sub>a</sub> · h<sub>b</sub>", "dot (บท 2.2)", "0 ถ้าคนละคำ, 1 ถ้าคำเดียวกัน"],
    ["√2 ≈ 1.414", "ระยะของทุกคู่ที่ต่างคำกัน", "ด้านของสามเหลี่ยมเส้นประในภาพ"],
  ],
  notes: `
    <h2>ข้อดี</h2>
    <ul>
      <li>ไม่มีลำดับปลอม: good, bad, great อยู่ห่างกันเท่ากันหมด ไม่มีคู่ไหนดูใกล้กว่ากันเพราะเลขบังเอิญติดกัน</li>
      <li>สร้างง่าย: รู้ตำแหน่งของคำก็สร้างได้ทันที</li>
    </ul>
    <h2>ข้อเสีย</h2>
    <ul>
      <li>ยาวมาก: vocabulary 50,000 คำ ก็ต้องมี 50,000 ช่องต่อคำ เกือบทั้งหมดเป็น 0 (เรียกว่า sparse) เปลืองหน่วยความจำและคำนวณช้า</li>
      <li>ไม่มีความหมาย: good กับ great ห่างกันเท่ากับ good กับ bad โมเดลจึงไม่รู้ว่าคำไหนคล้ายกัน</li>
      <li>คลิป BlackBoard AI ให้ตัวอย่าง 'cat' → [1, 0, 0, 0] และ 'dog' → [0, 0, 0, 1]</li>
    </ul>
    <h2>บทถัดไป</h2>
    <p>บท 3.3 นับคำทั้งประโยค (bag of words) ส่วนบท 3.4 ใช้ one-hot เป็นตัวชี้ว่าจะหยิบแถวไหนจากตาราง embedding</p>`,
  refs: [["wordemb", "one-hot ยาวเท่าจำนวนคำ, ไม่มีลำดับปลอม, sparse 50,000 มิติ, ไม่มีความหมาย"],
    ["blackboard", "one-hot ยาว 50,000+ ทุกคำต่างกันเท่ากัน, ตัวอย่าง cat / dog"]],
  mount(ui) {
    const st = { a: "good", b: "great" };
    ui.select("เลือกสองคำ", [["a", ""], ["b", "เทียบกับ"]], VOCAB.map((w) => [w, w]), st);
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        const tips = VOCAB.map((w) => up(oneHot(w)));
        for (let i = 0; i < 3; i++) s.line(tips[i], tips[(i + 1) % 3], s.c.muted, { dash: [5, 5] });
        VOCAB.forEach((w, i) => {
          const col = w === st.a ? s.c.a : w === st.b ? s.c.b : s.c.ink;
          s.arrow([0, 0, 0], tips[i], col, w);
        });
        if (st.a !== st.b) s.line(up(oneHot(st.a)), up(oneHot(st.b)), s.c.r, { width: 3.5 });
      },
      live() {
        const ha = oneHot(st.a), hb = oneHot(st.b);
        const pairs = [["good", "bad"], ["good", "great"], ["bad", "great"]];
        const rows = pairs.map(([p, q]) => {
          const on = (p === st.a && q === st.b) || (p === st.b && q === st.a);
          return `<tr class="${on ? "win" : ""}"><td>${p} กับ ${q}</td><td>${fmt(cosine(oneHot(p), oneHot(q)))}</td><td>${fmt(distance(oneHot(p), oneHot(q)))}</td></tr>`;
        }).join("");
        return `<p class="verdict">h<sub>${st.a}</sub> = (${ha.join(", ")}) · h<sub>${st.b}</sub> = (${hb.join(", ")})</p>` +
          M.math(M.fn("cos"), M.o("="), M.frac(M.n(dot(ha, hb)), M.row(M.n(1), M.o("×"), M.n(1))), M.o("="), M.n(fmt(cosine(ha, hb)), "res"),
            M.t("\u2003dist"), M.o("="), M.n(fmt(distance(ha, hb)), "res")) +
          `<p class="fintro">ทุกคู่ที่ต่างคำกัน:</p><div class="scroll"><table class="rank"><thead><tr><th>คู่</th><th>cosine</th><th>distance</th></tr></thead><tbody>${rows}</tbody></table></div>` +
          `<p class="ctl-note">ทุกแถวเท่ากัน: one-hot ไม่รู้ว่า good ใกล้ great มากกว่า bad</p>`;
      },
    };
  },
};
