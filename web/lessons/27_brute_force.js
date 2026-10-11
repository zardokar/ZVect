import { distance, fmt } from "../../lib/zvect.js";
import { M, AX } from "../js/kit.js";

// 5.1 Brute force (WIP202610027): one idea only — exact search measures the query against EVERY point, so the work
// grows with the number of points. Points come from a tiny seeded random (same as examples/*/27_brute_force.*).
function points(n, seed = 7) {
  const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let i = 0; i < 10; i++) rand();                 // the first numbers after a small seed are tiny; skip them
  return Array.from({ length: n }, () => [rand() * 8 - 4, rand() * 8 - 4, rand() * 8 - 4]);
}
const SETS = { 10: points(10), 100: points(100), 1000: points(1000) };
const r2 = (x) => Math.round(x * 100) / 100;

function search(q, P) {
  let best = 0, count = 0, bd = Infinity;
  P.forEach((p, i) => { const d = distance(q, p); count++; if (d < bd) { bd = d; best = i; } });
  return { best, d: bd, count };
}

export default {
  slug: "brute-force",
  title: "ค้นทุกชิ้น (brute force): ถูกเสมอ แต่ช้าตามจำนวนข้อมูล",
  en: "Brute force (exact k-NN)",
  example: "27_brute_force",
  view: { dist: 14 },
  intro: `
    <p>วิธีที่ตรงที่สุดในการหาจุดที่ใกล้ query คือ <b>วัดระยะกับทุกจุด</b> แล้วเลือกตัวที่ใกล้สุด (บท 4.1–4.3 ทำแบบนี้)</p>
    <p>ได้คำตอบถูกเสมอ แต่ <b>มี N จุดก็ต้องวัด N ครั้ง</b> ต่อคำถามหนึ่งข้อ ข้อมูลเพิ่ม 2 เท่า ก็ช้าลง 2 เท่า</p>`,
  try: [
    "เลือก N = 10 แล้ว 1000: จุดที่ใกล้สุดยังหาเจอทุกครั้ง แต่จำนวนครั้งที่วัดเพิ่มตาม N",
    "เลื่อน query ไปที่ไหนก็ได้: จำนวนครั้งที่วัดไม่เปลี่ยน เพราะต้องดูครบทุกจุดเสมอ",
  ],
  linesIntro: "มี 2 บรรทัด: บรรทัด 1 หาจุดที่ใกล้ที่สุด · บรรทัด 2 นับว่าต้องวัดกี่ครั้ง",
  lines: [
    [M.math(M.t("nearest"), M.o("="), M.sub(M.t("argmin"), M.i("i")), M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.sub(M.v("p"), M.i("i")), M.o(")"))),
      "หาจุดที่ใกล้ query ที่สุด · argmin<sub>i</sub> = \"จุด i ที่ทำให้ค่าข้างหลังน้อยที่สุด\" โดยลองทุก i ตั้งแต่ 1 ถึง N · <b>q</b> = query · <b>p</b><sub>i</sub> = จุดที่ i ในคลัง · N = จำนวนจุดทั้งหมด · dist = Euclidean distance (บท 2.1) · วัดทีละจุด จำตัวที่ใกล้ที่สุดไว้"],
    [M.math(M.t("measured"), M.o("="), M.i("N")),
      "นับงาน · ต้องวัดครบทุกจุด จึงเท่ากับจำนวนข้อมูลพอดี ไม่ว่า query อยู่ตรงไหน · ข้อมูลล้านชิ้น = วัดล้านครั้งต่อคำถาม"],
  ],
  formulaFrom: "วิธีค้นทุกชิ้น (อ่านทีละบทความ / วัดระยะกับเวกเตอร์ทุกตัว, ล้านชิ้น = ล้านครั้ง, ข้อมูล 2 เท่า = ช้า 2 เท่า) มาจากคลิป Satyajit Das · k-NN ต้องเทียบครบ 1,000 จุด มาจากคลิป Serengil · จุดในภาพสุ่มเองด้วยตัวสุ่มเล็ก ๆ ที่ให้ผลเหมือนกันทั้งสามภาษา",
  symbols: [
    ["q", "query: สิ่งที่ค้น", "ลากด้วยแถบเลื่อน"],
    ["p<sub>i</sub>", "จุดที่ i ในคลัง", "จุดสีเทาในภาพ"],
    ["N", "จำนวนจุดทั้งหมด", "เลือก 10, 100 หรือ 1000"],
    ["dist(q, p<sub>i</sub>)", "ระยะเส้นตรง (บท 2.1)", "น้อย = ใกล้"],
    ["argmin<sub>i</sub>", "เลือก i ที่ทำให้ค่าน้อยที่สุด", "ต้องลองครบทุก i"],
    ["measured", "จำนวนครั้งที่ต้องวัด", "เท่ากับ N เสมอ"],
  ],
  notes: `
    <h2>จากคลิป Satyajit Das (Vector Search and HNSW)</h2>
    <ul>
      <li>ศูนย์ช่วยเหลือมีบทความ 1,000,000 ชิ้น วิธีแรกคืออ่านทีละชิ้นจนเจอ (บนจอเจอที่ชิ้น #847,392) ใช้ได้กับเว็บเล็ก ๆ แต่ต้องอ่านราวล้านครั้งต่อคำถาม และข้อมูลเพิ่มเป็น 2 เท่าก็ช้าลง 2 เท่า</li>
      <li>เปลี่ยนเป็นเวกเตอร์ (embedding) แล้วก็ยังเจอปัญหาเดิม: ถ้าวัดทุกตัวก็ยังต้องวัดล้านครั้ง คลิปสรุปว่า embedding แก้เรื่องความหมาย แต่ไม่ได้แก้เรื่องความเร็ว</li>
    </ul>
    <h2>จากคลิป Serengil (ANN from scratch)</h2>
    <ul><li>k-NN ต้องเทียบกับทั้ง 1,000 จุด ส่วนต้นไม้ (บท 5.4) ใช้แค่ราว 9 ขั้น</li></ul>
    <h2>บทถัดไป</h2>
    <p>บท 5.2–5.3 ยังวัดทุกจุด แต่ดูว่ามิติสูงทำให้ยากอย่างไร และทำให้การวัดแต่ละครั้งถูกลงได้อย่างไร · บท 5.4 เป็นต้นไปเป็นวิธี <b>ANN</b>
    (approximate nearest neighbour) ที่วัดน้อยครั้งลง โดยยอมพลาดได้บ้าง</p>
    <p class="fine">ปีของแนวคิด (ความรู้ทั่วไป ไม่ได้มาจากคลิป): k-NN ราวปี 1951</p>`,
  refs: [["hnsw", "อ่านทีละชิ้น ล้านครั้งต่อคำถาม, ข้อมูล 2 เท่า = ช้า 2 เท่า, embedding ไม่ได้แก้ความเร็ว"], ["ann", "k-NN เทียบครบ 1,000 จุด"]],
  mount(ui) {
    const st = { n: 100 };
    const q = ui.vec3("query q", [1, 1, 1], { min: -4, max: 4, step: 0.5 });
    ui.choice("จำนวนจุด N", [[10, "10"], [100, "100"], [1000, "1000"]], st, "n");
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        const P = SETS[st.n], r = search(q, P);
        P.forEach((p, i) => { if (i !== r.best) s.point(p, s.c.muted, "", { r: st.n > 100 ? 2 : 3.5 }); });
        s.line(q, P[r.best], s.c.r, { width: 3 });
        s.point(P[r.best], s.c.r, "ใกล้สุด", { r: 6 });
        s.point(q, s.c.a, "q", { r: 7 });
      },
      live() {
        const P = SETS[st.n], r = search(q, P), p = P[r.best];
        const rows = [10, 100, 1000].map((n) => `<tr class="${n === st.n ? "win" : ""}"><td>${n.toLocaleString()}</td><td>${search(q, SETS[n]).count.toLocaleString()}</td></tr>`).join("") +
          `<tr><td class="dim">1,000,000 (คลิป)</td><td class="dim">1,000,000</td></tr>`;
        return M.math(M.fn("dist"), M.row(M.o("("), M.v("q"), M.o(","), M.t("nearest"), M.o(")")), M.o("="),
            M.sqrt(...q.flatMap((x, i) => [i ? M.o("+") : "", M.sup(M.row(M.o("("), M.n(r2(x - p[i]), AX[i]), M.o(")")), M.n(2))])), M.o("="), M.n(fmt(r.d), "res")) +
          `<p class="verdict">วัดไป <b>${r.count.toLocaleString()}</b> ครั้ง (= N) จุดที่ใกล้สุดคือจุดที่ ${r.best + 1}</p>` +
          `<p class="fintro">บรรทัด 2: จำนวนครั้งที่วัด เทียบตาม N</p><div class="scroll"><table class="rank"><thead><tr><th>N</th><th>วัดกี่ครั้ง</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
