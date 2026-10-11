import { norm } from "../../lib/zvect.js";
import { M, AX } from "../js/kit.js";

// Split out of 1.1 Vector (owner, 2026-10-11: one idea per lesson).
export default {
  slug: "length",
  title: "ความยาวของเวกเตอร์ (norm)",
  en: "Length (norm)",
  example: "16_length",
  intro: `
    <p>ความยาวของลูกศรเรียกว่า <b>norm</b> เขียนว่า <b>|v|</b></p>
    <p>หาด้วยพีทาโกรัส: ยกกำลังสองตัวเลขทุกตัว บวกกัน แล้วถอดราก</p>`,
  try: [
    "ตั้ง (3, 4, 0): ความยาว 5 พอดี (สามเหลี่ยม 3-4-5)",
    "ตั้ง (1, 2, 2): ความยาว 3",
    "เปลี่ยน x เป็นติดลบ: ทิศเปลี่ยน แต่ความยาวเท่าเดิม",
  ],
  lines: [
    [M.math(M.abs(M.v("v")), M.o("="), M.sqrt(M.sup(M.i("x", "cx"), M.n(2)), M.o("+"), M.sup(M.i("y", "cy"), M.n(2)), M.o("+"), M.sup(M.i("z", "cz"), M.n(2)))),
      "หาความยาวของลูกศร v · |v| อ่านว่า \"ความยาวของ v\" · ยกกำลังสองทุกตัว (ค่าติดลบกลายเป็นบวก) บวกกัน แล้วถอดราก"],
  ],
  symbols: [["|v|", "ความยาวของลูกศร (norm)", "ใช้ต่อในบท {#distance} Distance และ {#cosine} Cosine"], ["x², y², z²", "ยกกำลังสองแต่ละตัว", "ทำให้ค่าติดลบกลายเป็นบวก"], ["√( … )", "ถอดราก", "พีทาโกรัสใน 3 มิติ เช่น (3, 4, 0) ได้ 5"]],
  notes: `
    <h2>ทำไมต้องรู้ความยาว</h2>
    <ul>
      <li>บท {#distance} Euclidean distance คือความยาวของ a − b</li>
      <li>บท {#cosine} Cosine หารด้วยความยาว เพื่อให้เหลือแค่ทิศ</li>
      <li>ย่อเวกเตอร์ให้ยาว 1 (normalize) = หารทุกตัวด้วยความยาว ใช้ในบทค้นหาหลายบท</li>
    </ul>`,
  refs: [["metrics", "ระยะเส้นตรงคิดแบบพีทาโกรัสหลายมิติ (ส่วน Euclidean distance 2:15–3:08)"]],
  mount(ui) {
    const v = ui.vec3("เวกเตอร์ v", [3, 4, 0]);
    return {
      draw(s) {
        s.grid(); s.axes();
        const [x, y, z] = v;
        s.line([0, 0, 0], [x, 0, 0], s.c.x, { width: 2.5, dash: [6, 4] });
        s.line([x, 0, 0], [x, y, 0], s.c.y, { width: 2.5, dash: [6, 4] });
        s.line([x, y, 0], [x, y, z], s.c.z, { width: 2.5, dash: [6, 4] });
        s.arrow([0, 0, 0], v, s.c.r, "|v| = " + norm(v).toFixed(2));
      },
      live() {
        const [x, y, z] = v;
        return M.math(
          M.abs(M.v("v")), M.o("="),
          M.sqrt(...[x, y, z].flatMap((c, i) => [i ? M.o("+") : "", M.sup(M.n(c, AX[i], true), M.n(2))])),
          M.o("="), M.n(norm(v), "res"));
      },
    };
  },
};
