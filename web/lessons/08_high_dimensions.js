import { cosine, distance, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// tiny seeded random numbers, the same as examples/*/08_high_dimensions.*: x = x * 48271 mod (2^31 - 1)
function sample(d, seed) {
  const rand = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let i = 0; i < 10; i++) rand(); // the first numbers after a small seed are tiny; skip them
  const point = () => Array.from({ length: d }, rand);
  const q = point(), ds = [], cs = [];
  for (let i = 0; i < 200; i++) { const p = point(); ds.push(distance(q, p)); cs.push(cosine(q, p)); }
  return { ds, cs, lo: Math.min(...ds), hi: Math.max(...ds), clo: Math.min(...cs), chi: Math.max(...cs) };
}

const BINS = 25;
function hist(values) {
  const n = new Array(BINS).fill(0);
  for (const v of values) n[Math.min(BINS - 1, Math.max(0, Math.floor(v * BINS)))]++;
  return n;
}

// one histogram panel on a 2D canvas; values are already in [0, 1]
function panel(g, c, font, box, values, color, title, lo, hi) {
  const { x, y, w, h } = box, n = hist(values), top = Math.max(...n);
  g.font = `600 13px ${font}`; g.fillStyle = c.ink; g.textBaseline = "alphabetic";
  g.fillText(title, x, y - 8);
  g.strokeStyle = c.grid; g.lineWidth = 1;
  g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + w, y + h); g.stroke();
  const bw = w / BINS;
  g.fillStyle = color;
  n.forEach((k, i) => { const bh = (k / top) * (h - 6); g.fillRect(x + i * bw + 1, y + h - bh, bw - 2, bh); });
  // min .. max bracket
  g.strokeStyle = c.r; g.lineWidth = 2;
  const ax = x + lo * w, bx = x + hi * w, by = y + h + 10;
  g.beginPath(); g.moveTo(ax, by - 4); g.lineTo(ax, by); g.lineTo(bx, by); g.lineTo(bx, by - 4); g.stroke();
  g.font = `12px ${font}`; g.fillStyle = c.muted; g.textBaseline = "top";
  for (const t of [0, 0.5, 1]) { g.textAlign = t === 0 ? "left" : t === 1 ? "right" : "center"; g.fillText(String(t), x + t * w, by + 4); }
  g.textAlign = "left";
}

export default {
  slug: "high-dimensions",
  title: "มิติสูง: เมื่อทุกจุดอยู่ไกลพอ ๆ กัน",
  en: "High dimensions",
  example: "08_high_dimensions",
  hint: "ภาพนี้เป็นกราฟแท่ง (histogram) 2 มิติ ไม่ต้องหมุน เปลี่ยนจำนวนมิติจากปุ่มด้านล่าง",
  canvasLabel: "กราฟแท่งสองชุด: ระยะจาก query ไปยัง 200 จุด และค่า cosine ตัวเลขสรุปอยู่ในตารางข้างสูตร",
  intro: `
    <p>บทก่อน ๆ ใช้แค่ 3 มิติ แต่ embedding จริงมีหลายร้อยมิติ บทนี้สุ่มจุด 200 จุดในกล่อง [0, 1]<sup>d</sup>
    กับ query หนึ่งจุด แล้วดูว่าระยะจาก query ไปทุกจุด <b>กระจายแค่ไหน</b></p>
    <p>เมื่อ d สูงขึ้น จุดใกล้สุดกับไกลสุดห่างพอ ๆ กัน (เรียกว่า <b>curse of dimensionality</b>)
    และ cosine ก็บีบเข้าหากันด้วย ไม่ใช่แค่ distance ข้อมูลจริงไม่ได้สุ่มกระจายแบบนี้ แต่มีโครงสร้าง จึงยังค้นหาได้</p>
    <p class="fine">ตัวเลขต่างจากตารางในสรุปคลิปเล็กน้อย เพราะสรุปคลิปใช้ตัวสุ่มของ Python ส่วนบทนี้ใช้ตัวสุ่มเล็ก ๆ ที่เขียนเองให้ได้ผลเหมือนกันทั้งสามภาษา แนวโน้มเหมือนกัน</p>`,
  try: [
    "กด d = 2 แล้วค่อย ๆ เพิ่มไป 1000: แท่งกราฟบีบเป็นกองแคบ ๆ ทางขวา",
    "ดูค่า spread ในตาราง: ที่ d = 2 ไกลสุดไกลกว่าใกล้สุดกว่าสิบเท่า ที่ d = 1000 ต่างกันแค่ราว 10%",
    "กด 'สุ่มใหม่' หลายครั้ง ตัวเลขเปลี่ยนแต่แนวโน้มเหมือนเดิม",
  ],
  lines: [
    [M.math(M.t("spread"), M.o("="), M.frac(M.row(M.sub(M.i("dist"), M.t("max")), M.o("−"), M.sub(M.i("dist"), M.t("min"))), M.sub(M.i("dist"), M.t("min")))),
      "วัดว่าจุดใกล้สุดกับไกลสุดต่างกันแค่ไหน · dist<sub>max</sub> = ระยะจาก query ถึงจุดที่ไกลที่สุด · dist<sub>min</sub> = ถึงจุดที่ใกล้ที่สุด · ค่าน้อย = ทุกจุดห่างพอ ๆ กัน แยกใกล้ไกลยาก"],
  ],
  symbols: [["dist_max", "ระยะจาก query ถึงจุดที่ไกลที่สุด", ""], ["dist_min", "ระยะจาก query ถึงจุดที่ใกล้ที่สุด", ""], ["spread", "(ไกลสุด − ใกล้สุด) ÷ ใกล้สุด", "ค่าน้อย = ทุกจุดห่างพอ ๆ กัน แยกใกล้ไกลยาก ยิ่งมิติมาก ค่านี้ยิ่งลด"]],
  notes: `
    <h2>มิติมากขึ้น ราคาแพงขึ้น</h2>
    <ul>
      <li>เวกเตอร์ float32 ใช้ 4 ไบต์ต่อมิติ: เอกสาร 100 ล้านชิ้น × 3,072 มิติ ≈ 1,229 GB, × 768 มิติ ≈ 307 GB (ยังไม่รวมดัชนี)</li>
      <li>Matryoshka (MRL) ฝึกให้ข้อมูลสำคัญอยู่ที่มิติแรก ๆ จึงตัดท้ายทิ้งได้ เช่น 1,024 เหลือ 256 โดยเสียความแม่นไม่มาก</li>
      <li>ระบบใหญ่ยังบีบเวกเตอร์ เช่น binary quantization เหลือ 1 บิตต่อมิติ (เล็กลง 32 เท่า) แล้วค่อยคำนวณใหม่ด้วยค่าเต็มสำหรับผลชุดสุดท้าย</li>
    </ul>
    <h2>ค้นแบบประมาณ</h2>
    <ul>
      <li>ต้นไม้แบ่งระนาบแบบสุ่ม (Annoy) พา query ลงไปถึงกลุ่มเล็ก ๆ ในราว 9–10 ขั้น แทนการเทียบทุกจุด</li>
      <li>ต้นไม้ต้นเดียวพลาดจุดที่ใกล้ที่สุดได้ (ราว 25–30% ในการทดลองซ้ำที่อยู่ในรายงาน) ใช้หลายต้นรวมกันช่วยได้</li>
    </ul>`,
  refs: [["metrics", "ข้อสังเกตเรื่องมิติสูง"], ["choose", "ต้นทุน RAM ตามจำนวนมิติ, Matryoshka (MRL)"], ["qdrant", "binary quantization 32 เท่า แล้ว rescore"], ["ann", "ต้นไม้แบ่งระนาบ จำนวนขั้น และความพลาดของต้นไม้ต้นเดียว"]],
  mount(ui) {
    const st = { d: 2, seed: 7 };
    ui.choice("จำนวนมิติ d", [[2, "2"], [3, "3"], [10, "10"], [100, "100"], [1000, "1000"]], st, "d");
    ui.buttons("สุ่ม", [["สุ่มใหม่", () => (st.seed = (st.seed % 1000) + 1)], ["seed 7 (เหมือนโค้ด)", () => (st.seed = 7)]]);
    let cache = null;
    const data = () => {
      if (!cache || cache.d !== st.d || cache.seed !== st.seed) cache = { d: st.d, seed: st.seed, ...sample(st.d, st.seed) };
      return cache;
    };
    return {
      draw2d(g, W, H, c) {
        const r = data(), font = getComputedStyle(g.canvas).fontFamily;
        const x = 24, w = W - 48, h = Math.max(40, (H - 120) / 2);
        panel(g, c, font, { x, y: 34, w, h }, r.ds.map((v) => v / r.hi), c.z,
          `distance ÷ ไกลสุด (d = ${st.d})`, r.lo / r.hi, 1);
        panel(g, c, font, { x, y: 34 + h + 62, w, h }, r.cs, c.y,
          "cosine", r.clo, r.chi);
      },
      live() {
        const r = data();
        return M.math(M.t("spread"), M.o("="), M.frac(M.row(M.n(fmt(r.hi)), M.o("−"), M.n(fmt(r.lo))), M.n(fmt(r.lo))),
            M.o("="), M.n(fmt((r.hi - r.lo) / r.lo), "res")) +
          `<p class="fintro">ช่วงค่าจาก query ถึง 200 จุด (ต่ำสุด .. สูงสุด):</p><div class="scroll"><table class="rank"><thead><tr><th>d</th><th>distance</th><th>cosine</th></tr></thead>
          <tbody><tr><td>${st.d}</td><td>${fmt(r.lo)} .. ${fmt(r.hi)}</td><td>${fmt(r.clo)} .. ${fmt(r.chi)}</td></tr></tbody></table></div>` +
          `<p class="verdict">ไกลสุดไกลกว่าใกล้สุด ${(r.hi / r.lo).toFixed(2)} เท่า (seed ${st.seed})</p>`;
      },
    };
  },
};
