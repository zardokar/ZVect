import { add, scale } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// 3.4 Embedding matrix — one idea only (WIP202610026): one-hot × E = the word's row, so a lookup is enough.
// The one-hot comparison moved to 3.2 One-hot; how the table is learned is 3.5; meaning of the axes is 3.6.
// one row per word. axes of a row: animal, pet, vehicle
const VOCAB = ["cat", "dog", "lion", "car", "bus"];
const E = [[0.9, 0.9, 0.0], [0.9, 1.0, 0.0], [1.0, 0.2, 0.0], [0.0, 0.1, 0.9], [0.1, 0.0, 1.0]];
const oneHot = (w) => VOCAB.map((x) => (x === w ? 1 : 0));
const times = (h) => h.reduce((acc, hi, i) => add(acc, scale(E[i], hi)), [0, 0, 0]);
const row = (w) => E[VOCAB.indexOf(w)];
const S = 4;
const up = (v) => v.map((x) => x * S);
const f2 = (v) => "(" + v.map((x) => x.toFixed(2)).join(", ") + ")";

export default {
  slug: "embedding-matrix",
  title: "Embedding matrix: ตารางที่เปลี่ยนคำเป็นเวกเตอร์",
  en: "Embedding matrix",
  example: "12_embedding_matrix",
  axisNames: ["animal", "pet", "vehicle"],
  view: { dist: 13, yaw: 0.8 },
  intro: `
    <p><b>Embedding matrix</b> คือตาราง (matrix, บท 1.5) ที่มี <b>หนึ่งแถวต่อหนึ่งคำ</b> แต่ละแถวเป็นเวกเตอร์สั้น ๆ ของคำนั้น</p>
    <p>เอา one-hot ของคำ (บท 3.2) คูณตาราง ผลคือ <b>แถวของคำนั้นพอดี</b> ระบบจริงจึงแค่ "เปิดดูแถว" ไม่ต้องคูณจริง</p>`,
  try: [
    "เลือก dog: แถวที่ได้ × 1 คือแถวของ dog แถวอื่น × 0 หายไป",
    "เลือก car: เลข 1 ใน one-hot ย้ายไปช่องที่ 4 ผลคูณจึงเป็นแถวที่ 4",
  ],
  steps: [
    ["เขียนเป็นการคูณ", "เขียนการเปลี่ยนคำเป็นเวกเตอร์เป็น one-hot (บท 3.2) คูณตาราง"],
    ["ผลคูณ = หยิบแถว", "แถวที่คูณ 0 หายไปหมด ระบบจริงจึงแค่หยิบแถว ไม่ต้องคูณ"],
  ],
  lines: [
    [M.math(M.sub(M.v("e"), M.i("w")), M.o("="), M.sub(M.v("h"), M.i("w")), M.o("×"), M.v("E")),
      "เปลี่ยนคำเป็นเวกเตอร์ · w = คำที่เลือก · h<sub>w</sub> = one-hot ของ w (บท 3.2) · E = ตาราง embedding (แถวละคำ) · e<sub>w</sub> = ผลลัพธ์"],
    [M.math(M.sub(M.v("h"), M.i("w")), M.o("×"), M.v("E"), M.o("="), M.t("row\u00a0"), M.i("w"), M.t("\u00a0of\u00a0"), M.v("E")),
      "ผลคูณคือแถวของคำนั้นพอดี เพราะแถวที่คูณ 0 หายไป เหลือแถวที่คูณ 1 · ระบบจริงจึงแค่หยิบแถว ไม่ต้องคูณ"],
  ],
  formulaFrom: "one-hot × ตาราง = แถวของคำ และระบบจริงแค่หยิบแถว มาจากคลิป Under The Hood และ BlackBoard AI · คำ 5 คำ ตัวเลขในตาราง และชื่อแกน animal / pet / vehicle ผู้จัดทำแต่งเอง",
  symbols: [
    ["w", "คำที่เลือก เช่น dog", ""],
    ["h<sub>w</sub>", "one-hot ของ w: ยาวเท่าจำนวนคำ (บทนี้ 5) มีเลข 1 ตัวเดียว", "dog = (0, 1, 0, 0, 0)"],
    ["E", "embedding matrix: 5 แถว (คำ) × 3 คอลัมน์ (มิติ)", "แถวหนึ่ง = เวกเตอร์ของคำหนึ่ง"],
    ["h<sub>w</sub> × E", "คูณ one-hot กับตาราง = เอาแต่ละแถวคูณเลขในช่องนั้นแล้วบวกกัน", "แถวที่คูณ 0 หายไป เหลือแถวที่คูณ 1"],
    ["e<sub>w</sub>", "embedding ของคำ w (ผลลัพธ์)", "dog = (0.90, 1.00, 0.00)"],
  ],
  notes: `
    <h2>ตารางจริงใหญ่แค่ไหน</h2>
    <ul>
      <li>BlackBoard AI: ขนาด (จำนวนคำ × จำนวนมิติ) เช่น 50,000 × 300: แถว = จำนวนคำใน vocabulary คอลัมน์ = จำนวนมิติที่เลือกเอง</li>
      <li>Under The Hood ใช้ตารางเล็ก 8 × 3 (8 คำ คำละ 3 ตัวเลข) และเรียกตารางนี้ว่า lookup table</li>
    </ul>
    <h2>หยิบแถวด้วย ID</h2>
    <ul>
      <li>ขั้นตอนตามคลิป BlackBoard AI: มี vocabulary และ ID → มีตาราง → หาแถวด้วย ID (lookup) → ปรับค่าระหว่างฝึก</li>
      <li>เลขประจำคำ (บท 3.1) ใช้วัดความใกล้ไม่ได้ แต่ใช้เป็น <b>ที่อยู่ของแถว</b> ได้พอดี</li>
      <li>ตัวเลขในตารางเริ่มจากค่าสุ่ม แล้วปรับระหว่างฝึก (บท 3.5) ส่วนแกนมีความหมายอย่างไรดูบท 3.6</li>
    </ul>`,
  refs: [["wordemb", "embedding matrix = ตาราง lookup 8 × 3, one-hot × ตาราง = แถวของคำ"],
    ["blackboard", "ขนาด 50,000 × 300, หยิบแถวด้วย ID, สี่ขั้นตอน"]],
  mount(ui) {
    const st = { a: "dog" };
    ui.select("เลือกคำ", [["a", ""]], VOCAB.map((w) => [w, w]), st);
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        VOCAB.forEach((w, i) => s.point(up(E[i]), w === st.a ? s.c.a : s.c.ink, w, { r: w === st.a ? 7 : 4.5 }));
        s.arrow([0, 0, 0], up(row(st.a)), s.c.a, "");
      },
      live() {
        const h = oneHot(st.a);
        const rows = VOCAB.map((w, i) => `<tr class="${h[i] ? "win" : ""}"><td>${h[i]}</td><td>${w}</td><td>${f2(E[i])}</td><td class="dim">${h[i] ? "× 1 = เก็บแถวนี้" : "× 0 = หาย"}</td></tr>`).join("");
        return `<p class="verdict">one-hot(${st.a}) = (${h.join(", ")}) · ผลคูณ = <b>${f2(times(h))}</b> = แถวที่ ${VOCAB.indexOf(st.a) + 1} ของ E</p>
          <div class="scroll"><table class="rank"><thead><tr><th>h</th><th>คำ</th><th>แถวใน E</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
