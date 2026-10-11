import { distance } from "../../lib/zvect.js";
import { M, AX } from "../js/kit.js";

// Split out of the Distance lesson (owner, 2026-10-11: one idea per lesson). Source: Qdrant talk 25:25–27:15.
// The bit rule "positive = 1" is my choice; the talk only says "1 bit per dimension".
const bit = (v) => v.map((x) => (x > 0 ? 1 : 0));
const CUBE = 4;   // draw the bit cube 0..4 so it is easy to see

export default {
  slug: "binary-xor",
  title: "เวกเตอร์ 1 บิต: เทียบด้วย XOR + popcount",
  en: "1-bit vectors: XOR + popcount",
  example: "17_binary_xor",
  view: { dist: 15 },
  intro: `
    <p>ระบบใหญ่บีบเวกเตอร์ให้เหลือ <b>1 บิตต่อมิติ</b> (binary quantization) เล็กลง 32 เท่า</p>
    <p>เทียบสองเวกเตอร์บิตด้วย <b>XOR</b> (ช่องที่ต่างกันได้ 1) แล้ว <b>popcount</b> (นับเลข 1)
    ได้จำนวนมิติที่ต่างกัน ยิ่งน้อยยิ่งใกล้ ใช้แค่สองคำสั่งของ CPU จึงเร็วมาก</p>`,
  try: [
    "เลื่อน y ของ b ให้ติดลบ: บิตแกน y เปลี่ยน popcount เพิ่ม 1 (เส้นหนาบนลูกบาศก์ยาวขึ้นหนึ่งขอบ)",
    "กด b = 2a: บิตเหมือนกันทุกช่อง popcount = 0 แม้ระยะ Euclidean จะเป็น 3",
  ],
  formulaFrom: `คลิป Qdrant (CMU Database Group) ช่วง 25:25–27:15: 1 บิตต่อมิติ, เทียบด้วย bitwise XOR + popcount · วิธีตัดบิต "บวก = 1" ผู้จัดทำเลือกเอง`,
  lines: [
    [M.math(M.fn("bit"), M.row(M.o("("), M.i("x"), M.o(")")), M.o("="), M.n(1), M.t("\u00a0if\u00a0"), M.i("x"), M.o(">"), M.n(0), M.t("\u00a0else\u00a0"), M.n(0)),
      "บีบตัวเลขหนึ่งช่องเหลือ 1 บิต · บวก = 1 · ศูนย์หรือติดลบ = 0 · ทำกับทุกช่องของ a และ b"],
    [M.math(M.t("popcount"), M.row(M.o("("), M.fn("bit"), M.row(M.o("("), M.v("a"), M.o(")")), M.o("XOR"), M.fn("bit"), M.row(M.o("("), M.v("b"), M.o(")")), M.o(")"))),
      "XOR เทียบทีละช่อง: ต่างกันได้ 1 เหมือนกันได้ 0 · popcount นับเลข 1 = จำนวนช่องที่ต่างกัน · ยิ่งน้อยยิ่งใกล้"],
  ],
  symbols: [["bit(x)", "บีบค่าหนึ่งช่องเหลือ 1 บิต", "บวก = 1, ไม่บวก = 0 (ผู้จัดทำเลือก)"], ["XOR", "เทียบบิตทีละช่อง: ต่างกันได้ 1", "CPU ทำทีละ 64 ช่องในคำสั่งเดียว"], ["popcount", "นับว่ามีเลข 1 กี่ตัว", "= จำนวนมิติที่บิตต่างกัน"]],
  notes: `
    <h2>XOR + popcount ในระบบจริง (คลิป Qdrant)</h2>
    <ul>
      <li>binary quantization เก็บ 1 บิตต่อมิติ: เล็กลง 32 เท่าจาก float 32 บิต</li>
      <li>เทียบได้ด้วยสองคำสั่งของ CPU คือ bitwise XOR กับ popcount เหมาะกับเวกเตอร์ใหญ่ เช่น ราว 1,500 มิติของโมเดล OpenAI</li>
      <li>บิตหยาบกว่าค่าเต็ม จึงใช้คัดผู้สมัครในหน่วยความจำก่อน แล้ว rescore ผู้สมัคร (เช่น 100 อันดับแรก) ด้วยเวกเตอร์ต้นฉบับ</li>
      <li>จำนวนบิตที่ต่างกันมีชื่อเรียกว่า Hamming distance (ชื่อนี้เป็นความรู้ทั่วไป คลิปไม่ได้ใช้)</li>
    </ul>`,
  refs: [["qdrant", "binary quantization 1 บิตต่อมิติ เล็กลง 32 เท่า เทียบด้วย XOR + popcount แล้ว rescore top 100 ด้วยค่าเต็ม (25:25–27:15)"]],
  mount(ui) {
    const a = ui.vec3("เวกเตอร์ a", [1, 2, 2], { min: -5, max: 6, step: 0.5 });
    const b = ui.vec3("เวกเตอร์ b", [3, -2, 1], { min: -5, max: 6, step: 0.5 });
    ui.buttons("ตั้งค่า", [
      ["b = (3, −2, 1)", () => ui.setVec(b, [3, -2, 1])],
      ["b = 2a", () => ui.setVec(b, a.map((x) => 2 * x))],
    ]);
    return {
      draw(s) {
        s.grid(); s.axes();
        const O = [0, 0, 0];
        s.arrow(O, a, s.c.a, "a");
        s.arrow(O, b, s.c.b, "b");
        // the 8 corners of a cube are all possible 3-bit vectors; popcount = edges walked between two corners
        const C = (bits) => bits.map((x) => x * CUBE);
        for (let m = 0; m < 8; m++) for (let k = 0; k < 3; k++) if (!((m >> k) & 1)) {
          const p = [0, 1, 2].map((j) => (m >> j) & 1), q = [...p]; q[k] = 1;
          s.line(C(p), C(q), s.c.muted, { alpha: 0.35 });
        }
        const ba = bit(a), bb = bit(b);
        let cur = [...bb];
        [0, 1, 2].forEach((k) => {
          if (ba[k] !== bb[k]) { const nxt = [...cur]; nxt[k] = ba[k]; s.line(C(cur), C(nxt), [s.c.x, s.c.y, s.c.z][k], { width: 4 }); cur = nxt; }
        });
        s.point(C(ba), s.c.a, "bit(a) " + ba.join(""), { r: 6 });
        s.point(C(bb), s.c.b, "bit(b) " + bb.join(""), { r: 6, ring: true });
      },
      live() {
        const ba = bit(a), bb = bit(b), x = ba.map((v, i) => v ^ bb[i]), pc = x.reduce((s, v) => s + v, 0);
        const rows = ["x", "y", "z"].map((n, i) => `<tr><td class="${AX[i]}">${n}</td><td>${a[i]}</td><td>${ba[i]}</td><td>${b[i]}</td><td>${bb[i]}</td><td>${x[i] ? "<b>1</b>" : "0"}</td></tr>`).join("");
        return `<div class="scroll"><table class="rank"><thead><tr><th>แกน</th><th>a</th><th>bit a</th><th>b</th><th>bit b</th><th>XOR</th></tr></thead><tbody>${rows}</tbody></table></div>` +
          M.math(M.t("popcount(" + x.join("") + ")"), M.o("="), M.n(pc, "res")) +
          `<p class="verdict">ต่างกัน ${pc} จาก 3 มิติ · ระยะ Euclidean ค่าเต็ม = ${distance(a, b).toFixed(2)} (บิตหยาบกว่า จึงใช้คัดก่อนแล้ว rescore)</p>`;
      },
    };
  },
};
