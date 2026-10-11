import { M, AX, keep } from "../js/kit.js";

// Beginner version (owner, 2026-10-11): one idea only — the space is a 3D room, data are points in it.
// Starts with ONE example point p1 (the sliders move it). New points appear only from the "Random" button
// (owner: "มีปุ่ม Random จุด ถึงจะค่อยมี จุดใหม่"). Random points are kept in the learner's browser (localStorage).
// Add / subtract / scale live in 15_vector_ops.
const MAX_POINTS = 40;
const isPoints = (x) => Array.isArray(x) && x.length <= MAX_POINTS &&
  x.every((v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite));
const randInt = () => Math.floor(Math.random() * 9) - 4;    // whole number -4..4, stays inside the drawn grid

export default {
  slug: "vector-space",
  title: "Vector space: ห้องที่ข้อมูลอยู่",
  en: "Vector space",
  example: "04_vector_space",
  view: { dist: 22 },   // far enough back that every point in -4..4 is on screen
  intro: `
    <p><b>Vector space</b> คือห้อง 3 มิติ ทุกตำแหน่งในห้องบอกได้ด้วยตัวเลข 3 ตัว (x, y, z)</p>
    <p><b>ข้อมูล</b> คือจุดที่อยู่ในห้อง ตอนนี้มีจุดตัวอย่างจุดเดียวคือ p₁ กด "สุ่มจุด" เพื่อเพิ่มจุดใหม่ ห้องมีอยู่ก่อนแล้ว จะมีกี่จุดก็ได้</p>`,
  try: [
    "เลื่อน x, y, z แล้วดูว่า p₁ ย้ายไปไหน",
    "กด \"สุ่มจุด\" หลาย ๆ ครั้ง แล้วลากภาพเพื่อหมุนดู",
    "กด \"ล้างจุดที่สุ่ม\": จุดใหม่หายหมด แต่ห้อง (เส้นตารางและแกน) ยังอยู่",
  ],
  lines: [
    [M.math(M.v("p"), M.o("="), M.tuple([M.i("x", "cx"), M.i("y", "cy"), M.i("z", "cz")])),
      "จุดหนึ่งจุดบอกด้วยตัวเลข 3 ตัว · <b>p</b> = point (จุด = ข้อมูลหนึ่งชิ้น) · ไม่มีการคำนวณ แค่บอกตำแหน่งในห้อง"],
  ],
  symbols: [
    ["p", "point: จุดหนึ่งจุด = ข้อมูลหนึ่งชิ้นในห้อง", "p₁ คือจุดตัวอย่าง p₂, p₃, … มาจากปุ่มสุ่ม"],
    ["(x, y, z)", "ตัวเลข 3 ตัวที่บอกตำแหน่งของ p", "x = ซ้ายขวา · y = ขึ้นลง · z = หน้าหลัง"],
    ["ℝ³", "ชื่อทางคณิตศาสตร์ของห้องนี้ (ไม่ต้องจำ)", "ℝ = ตัวเลขจริง · ³ = มี 3 ตัว"],
  ],
  notes: `
    <h2>ห้องกับข้อมูลไม่ใช่สิ่งเดียวกัน</h2>
    <ul>
      <li>ห้อง (space) คือที่ว่างทั้งหมด ข้อมูลคือจุดที่เราเก็บไว้ในห้องนั้น</li>
      <li>ล้างข้อมูลออกหมด ห้องก็ยังอยู่</li>
      <li>เพิ่มข้อมูลใหม่ได้ตลอด ถ้าทุกจุดมีจำนวนตัวเลขเท่ากัน และแต่ละแกนหมายถึงเรื่องเดียวกันทุกจุด</li>
      <li>ข้อความหรือรูปต้องแปลงเป็นตัวเลขด้วยโมเดลตัวเดิม เปลี่ยนโมเดลแล้วต้องแปลงข้อมูลเก่าใหม่หมด เพราะคนละโมเดลคือคนละห้อง</li>
    </ul>
    <h2>บทถัดไป</h2>
    <p>บท "บวก ลบ คูณ" ใช้จุดที่มีอยู่สร้างจุดใหม่ และผลที่ได้ก็ยังอยู่ในห้องเดิม</p>`,
  refs: [["3b1b", "เวกเตอร์คือลิสต์ตัวเลขที่บอกตำแหน่ง พิกัดคือคำสั่งเดินตามแกน"]],
  mount(ui) {
    const p1 = ui.vec3("p₁ (จุดตัวอย่าง)", [2, 3, 1]);
    const store = keep("vector-space.random", [], isPoints);   // random points p2, p3, …
    ui.buttons("ข้อมูลในห้อง", [
      ["สุ่มจุด (Random)", () => { if (store.value.length < MAX_POINTS - 1) { store.value.push([randInt(), randInt(), randInt()]); store.save(); } }],
      ["ล้างจุดที่สุ่ม", () => { store.value = []; store.save(); }],
    ]);
    return {
      draw(s) {
        s.grid(); s.axes();
        // guide lines show how x, y, z lead to p1
        const g1 = [p1[0], 0, 0], g2 = [p1[0], 0, p1[2]];
        s.line([0, 0, 0], g1, s.c.x, { dash: [4, 4] }); s.line(g1, g2, s.c.z, { dash: [4, 4] }); s.line(g2, p1, s.c.y, { dash: [4, 4] });
        store.value.forEach((v, i) => s.point(v, s.c.y, "p" + (i + 2), { r: 5 }));
        s.point(p1, s.c.a, "p1", { r: 6 });
      },
      live() {
        const pts = [[...p1], ...store.value];
        const now = M.math(M.sub(M.v("p"), M.n(1)), M.o("="), M.tuple(p1.map((x, i) => M.n(x, AX[i]))));
        const rows = pts.map((v, i) => `<tr><td>p${i + 1}</td><td>(${v.map((x) => +x.toFixed(2)).join(", ")})</td><td>${i ? "สุ่ม" : "ตัวอย่าง"}</td></tr>`).join("");
        return now + `<p class="verdict">ในห้องตอนนี้มีข้อมูล ${pts.length} จุด</p>` +
          `<div class="scroll"><table class="rank"><thead><tr><th>จุด</th><th>(x, y, z)</th><th>มาจาก</th></tr></thead><tbody>${rows}</tbody></table></div>` +
          (store.value.length ? `<p class="ctl-note">จุดที่สุ่มจะยังอยู่ตอนเปิดหน้านี้ครั้งหน้า</p>` : "");
      },
    };
  },
};
