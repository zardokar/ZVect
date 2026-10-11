import { cosine, distance, dot, norm, normalize, scale, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// query A, two candidates B and C. B = k·A (same direction, longer), C = a different direction but close by.
const A = [3, 1, 0];
const METRICS = [
  ["cosine ↑", cosine, 1],
  ["distance ↓", distance, -1], // lower = closer, so it wins with the smallest value
  ["dot ↑", dot, 1],
];
const f3 = (x) => fmt(Math.abs(x) < 5e-4 ? 0 : x); // same printing as the examples, no "-0.000"

export default {
  slug: "choose-metric",
  title: "เลือก metric: cosine, distance หรือ dot",
  en: "Choose a metric",
  example: "07_choose_metric",
  view: { dist: 19, yaw: 0.2, pitch: 0.5 },
  intro: `
    <p>บท 4.1–4.3 ค้นด้วย cosine, distance และ dot ทีละแบบ ซึ่งอาจเลือกคนละตัว บทนี้ดูชัด ๆ ด้วยเวกเตอร์สามตัว:
    query <b>A = (3, 1, 0)</b>, <b>B = 2·A = (6, 2, 0)</b> ทิศเดียวกับ A แต่ยาวกว่า และ <b>C = (3, 2, 0)</b> ทิศต่างนิดหน่อยแต่อยู่ใกล้ A</p>
    <p>cosine กับ dot เลือก B เพราะทิศตรงกัน (dot ยังชอบที่ B ยาวด้วย) ส่วน distance เลือก C เพราะอยู่ใกล้กว่า
    แต่ถ้า <b>normalize ก่อน</b> (ทำให้ยาว 1 ทุกตัว) ทั้งสามแบบจะเรียงเหมือนกันเสมอ</p>`,
  try: [
    "สลับเป็น 'normalize ก่อน' แล้วดูว่าทั้งสามคอลัมน์เลือกตัวเดียวกัน",
    "เลื่อน k ให้ B สั้นลงจนใกล้ 1 เท่า: distance เปลี่ยนใจไปเลือก B",
    "ลากจุด C ไปทางอื่น แล้วดูว่าตอนไหนสามแบบเริ่มเห็นตรงกัน",
  ],
  linesIntro: "สองบรรทัดนี้อธิบายว่าทำไมพอกด \"normalize ก่อน\" ทั้งสามวิธีเรียงเหมือนกัน · หมวก ^ = ย่อให้ยาว 1 แล้ว",
  lines: [
    [M.math(M.v("â"), M.o("·"), M.v("b̂"), M.o("="), M.fn("cos"), M.i("θ")),
      "เวกเตอร์ยาว 1 ทั้งคู่ dot จะเท่ากับ cosine พอดี · จึงเรียงลำดับเหมือนกัน"],
    [M.math(M.sup(M.abs(M.v("â"), M.o("−"), M.v("b̂")), M.n(2)), M.o("="), M.n(2), M.o("−"), M.n(2), M.fn("cos"), M.i("θ")),
      "ระยะ (ยกกำลังสอง) ระหว่างเวกเตอร์ยาว 1 เขียนด้วย cos ได้ · cos มากขึ้น ระยะน้อยลง · distance จึงเรียงเหมือน cosine ด้วย"],
  ],
  extra: `
    <h2>เลือกแบบไหนดี (สรุปจากคลิป + ตรวจทานแล้ว)</h2>
    <ol>
      <li><b>ความยาวของเวกเตอร์มีความหมายไหม?</b> ถ้าไม่ (เช่น เอกสารสั้นหรือยาวแต่เรื่องเดียวกัน) ใช้ <b>cosine</b></li>
      <li>ถ้าค่ามีหน่วยจริง เช่น อายุ รายได้ พิกัด ใช้ <b>distance</b> (และควรปรับสเกลแต่ละแกนก่อน)</li>
      <li>ถ้าอยากให้ตัวที่ยาวกว่าได้คะแนนมากกว่า (เช่น ความนิยม) ใช้ <b>dot</b></li>
      <li>ถ้าเวกเตอร์ normalize แล้ว ใช้ <b>dot</b> ได้เลย เร็วที่สุด และเรียงเหมือน cosine กับ distance</li>
      <li>เวกเตอร์ศูนย์ไม่มีทิศ ต้องกันไว้ก่อนใช้ cosine</li>
    </ol>
    <h2>ตัวอย่างงาน</h2>
    <div class="scroll"><table class="rank">
      <thead><tr><th>งาน</th><th>มักใช้</th></tr></thead>
      <tbody>
        <tr><td>ค้นหาข้อความ, semantic search, RAG</td><td>cosine (หรือ dot ถ้า normalize แล้ว)</td></tr>
        <tr><td>feature ของรูปภาพแบบดิบ (pixel, color histogram), ค่าจากเซนเซอร์, ข้อมูลที่มีหน่วย</td><td>distance</td></tr>
        <tr><td>แนะนำสินค้าแบบ collaborative filtering</td><td>dot</td></tr>
        <tr><td>ระบบใหญ่หรือ real-time ที่ normalize แล้ว</td><td>dot</td></tr>
      </tbody>
    </table></div>`,
  symbols: [["â · b̂ = cos θ", "dot ของเวกเตอร์ยาว 1 เท่ากับ cosine", "normalize แล้ว dot กับ cosine เรียงเหมือนกัน"], ["|â − b̂|²", "ระยะยกกำลังสองระหว่างเวกเตอร์ยาว 1", ""], ["2 − 2 cos θ", "ระยะยกกำลังสอง เขียนด้วย cos θ", "cos มากขึ้น ระยะน้อยลง: distance ก็เรียงเหมือน cosine"]],
  notes: `
    <h2>ใครเป็นคนเลือก metric</h2>
    <ul>
      <li>ฟังก์ชันวัดระยะผูกกับโมเดลที่สร้างเวกเตอร์ ให้ใช้แบบที่โมเดลนั้นฝึกมา ผู้ร่วมก่อตั้ง Qdrant บอกว่าส่วนใหญ่เป็น dot product</li>
      <li>ถ้าเวกเตอร์ normalize แล้ว dot, cosine และ distance เรียงลำดับเหมือนกัน เลือกตัวที่เร็วที่สุดคือ dot</li>
    </ul>
    <h2>ข้อควรรู้ของการค้นหา</h2>
    <ul>
      <li>ทุกเวกเตอร์เป็นผลลัพธ์ได้เสมอ แม้ไม่เกี่ยวเลย จึงตั้งเกณฑ์ตัดคะแนนตายตัวไม่ได้ง่าย ๆ</li>
      <li>ค่าที่มีหน่วยจริงต่างกัน (อายุ รายได้) ต้องปรับสเกลก่อนใช้ distance ไม่อย่างนั้นแกนที่ตัวเลขใหญ่จะชนะเสมอ</li>
    </ul>`,
  refs: [["metrics", "ลำดับการเลือก metric และตารางตัวอย่างงาน"], ["qdrant", "metric ผูกกับโมเดล ส่วนใหญ่ใช้ dot, ไม่มีเกณฑ์ตัดคะแนนที่ชัด"]],
  mount(ui) {
    const st = { mode: "raw", k: 2 };
    const C = ui.vec3("เวกเตอร์ C", [3, 2, 0], { min: -5, max: 5, step: 0.5 });
    const mode = ui.choice("ใช้เวกเตอร์แบบ", [["raw", "ค่าดิบ"], ["unit", "normalize ก่อน"]], st, "mode");
    const kk = ui.number("ยืด B = k·A", "k", st, "k", { min: 0.25, max: 3, step: 0.25 });
    ui.buttons("ตั้งค่า", [["ชุด A, B, C เริ่มต้น (ค่าดิบ)", () => { mode.set("raw"); kk.set(2); ui.setVec(C, [3, 2, 0]); }]]);
    const B = () => scale(A, st.k);
    const use = (v) => (st.mode === "unit" ? normalize(v) : v);
    return {
      draw(s) {
        s.grid(5); s.axes(6.5);
        const O = [0, 0, 0], unit = st.mode === "unit";
        if (unit) {
          // unit vectors are drawn 4× bigger so they are visible; the numbers use the real length 1
          const Z = 4, big = (v) => scale(normalize(v), Z);
          s.sphere(Z);
          s.label([0, -Z - 0.6, 0], "ทรงกลมรัศมี 1 (ภาพขยาย 4 เท่า)", s.c.muted, { align: "center", size: 12, weight: 500 });
          for (const [v, col, name] of [[A, s.c.a, ""], [B(), s.c.b, "B̂ = Â"], [C, s.c.r, "Ĉ"]]) {
            s.line(O, v, col, { width: 1, dash: [3, 5], alpha: 0.4 });
            if (norm(v)) s.arrow(O, big(v), col, name, { width: 2.5 });
          }
          if (norm(C)) s.line(big(A), big(C), s.c.ink, { width: 1.5, dash: [2, 3] });
        } else {
          s.line(A, B(), s.c.b, { width: 1.5, dash: [4, 4], alpha: 0.8 });
          s.line(A, C, s.c.r, { width: 1.5, dash: [4, 4], alpha: 0.8 });
          s.arrow(O, B(), s.c.b, "B");
          s.arrow(O, C, s.c.r, "C");
          s.arrow(O, A, s.c.a, "A (query)");
        }
      },
      live() {
        const q = use(A), cand = [["B", use(B())], ["C", use(C)]];
        const score = cand.map(([, v]) => METRICS.map(([, f]) => f(q, v)));
        // a difference smaller than 1e-9 is rounding noise, so it counts as a tie (B wins ties)
        const win = METRICS.map(([, , sign], j) => (sign * (score[0][j] - score[1][j]) > -1e-9 ? 0 : 1));
        const head = METRICS.map(([name]) => `<th>${name}</th>`).join("");
        const body = cand.map(([id], i) => `<tr><td>${id}</td>` +
          score[i].map((x, j) => `<td class="${win[j] === i ? "best" : ""}">${f3(x)}</td>`).join("") + "</tr>").join("");
        const picks = METRICS.map(([name], j) => `${name.split(" ")[0]} เลือก ${cand[win[j]][0]}`).join(" · ");
        const same = new Set(win).size === 1;
        let out = `<p class="fintro">เทียบ B และ C กับ A (↑ มากดี · ↓ น้อยดี):</p><div class="scroll"><table class="rank"><thead><tr><th></th>${head}</tr></thead><tbody>${body}</tbody></table></div>` +
          `<p class="verdict">${picks}${same ? " (ตรงกันหมด)" : ""}</p>`;
        if (norm(C) === 0) out += `<p class="verdict">C เป็นเวกเตอร์ศูนย์ ไม่มีทิศ cosine จึงไม่นิยาม (lib คืน 0)</p>`;
        else if (st.mode === "unit") {
          const c = cosine(A, C), d = distance(normalize(A), normalize(C));
          out += M.math(M.sup(M.abs(M.v("Â"), M.o("−"), M.v("Ĉ")), M.n(2)), M.o("="), M.n(f3(d * d), "res"), M.o("="),
            M.n(2), M.o("−"), M.n(2), M.o("·"), M.n(f3(c)), M.o("="), M.n(f3(2 - 2 * c), "res"));
        }
        return out;
      },
    };
  },
};
