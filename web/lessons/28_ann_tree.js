import { distance, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { LEAF, minstd, makePoints, build, search, exact } from "../js/anntree.js";

// 5.4 ANN with a tree (WIP202610027): one idea only — split the points again and again by a line halfway between two
// random points; a query walks down the splits to a small group and is compared only with that group.
// Follows the Serengil clip (1,000 2-D points, target (50, 50), groups of at most 5). Points and splits are my own random.
const N = 1000;
const P = makePoints(N, 42);

function clipLine(h, pts) {             // the part of the line n . x = c inside the box around pts
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const [a, b] = h.n, out = [];
  if (b) for (const x of [x0, x1]) { const y = (h.c - a * x) / b; if (y >= y0 - 1e-9 && y <= y1 + 1e-9) out.push([x, y]); }
  if (a) for (const y of [y0, y1]) { const x = (h.c - b * y) / a; if (x >= x0 - 1e-9 && x <= x1 + 1e-9) out.push([x, y]); }
  return out.length >= 2 ? [out[0], out[out.length - 1]] : null;
}

export default {
  slug: "ann-tree",
  title: "ANN แบบต้นไม้: แบ่งครึ่งซ้ำ ๆ แล้วเดินลงไปหากลุ่มเล็ก",
  en: "ANN: random-split tree",
  example: "28_ann_tree",
  hint: "ภาพนี้เป็นกราฟ 2 มิติ ไม่ต้องหมุน เลื่อน query ด้วยแถบเลื่อนด้านล่าง",
  canvasLabel: "จุด 1,000 จุดบนระนาบ เส้นสีฟ้าคือเส้นแบ่งที่ query เดินผ่าน จุดสีเหลืองคือกลุ่มสุดท้ายที่เอามาเทียบ",
  intro: `
    <p><b>ANN</b> (approximate nearest neighbour) = หาของที่ใกล้ที่สุด <b>แบบประมาณ</b>: วัดน้อยครั้งลงมาก โดยยอมพลาดได้บ้าง</p>
    <p>วิธีแบบต้นไม้: สุ่มสองจุด แล้วแบ่งข้อมูลด้วย <b>เส้นที่อยู่กึ่งกลางระหว่างสองจุดนั้น</b> ทำซ้ำในแต่ละฝั่งจนเหลือกลุ่มละไม่เกิน 5 จุด
    ตอนค้น query แค่ดูว่าตัวเองอยู่ฝั่งไหนของแต่ละเส้น แล้วเดินลงไปเทียบกับกลุ่มเล็ก ๆ ที่ปลายทาง</p>`,
  try: [
    "query (50, 50): เดิน 8 ขั้นก็ถึงกลุ่มสุดท้าย (3 จุด) วัดรวม 11 ครั้ง แทนการวัดครบ 1,000 จุด",
    "เลื่อน query ไปที่ (30, 30): จุดที่ใกล้ที่สุดจริง (วงสีม่วง) ถูกเส้นแบ่งไปอยู่อีกฝั่ง ต้นไม้จึงพลาด ลองที่อื่นดูด้วย",
    "กด \"สร้างต้นไม้ใหม่ (Random)\": เส้นแบ่งเปลี่ยน ผลอาจเปลี่ยนตาม",
  ],
  steps: [
    ["สร้างเส้นแบ่ง", "แบ่งข้อมูลเป็นสองฝั่งด้วยเส้นกึ่งกลางระหว่างสองจุดที่สุ่มมา"],
    ["ดูว่าอยู่ฝั่งไหน", "ใช้ทั้งตอนสร้าง (แบ่งทุกจุด) และตอนค้น (พา query ลงไปทีละเส้น)"],
    ["เทียบเฉพาะกลุ่มสุดท้าย", "เหลือไม่กี่จุดให้วัด จึงเร็ว แต่อาจพลาดถ้าคำตอบถูกแบ่งไปอีกฝั่ง"],
  ],
  lines: [
    [M.math(M.v("n"), M.o("="), M.sub(M.v("v"), M.n(1)), M.o("−"), M.sub(M.v("v"), M.n(2)), M.t(",\u2003"), M.i("c"), M.o("="), M.v("n"), M.o("·"), M.frac(M.row(M.sub(M.v("v"), M.n(1)), M.o("+"), M.sub(M.v("v"), M.n(2))), M.n(2))),
      "สร้างเส้นแบ่ง · <b>v</b><sub>1</sub>, <b>v</b><sub>2</sub> = สองจุดที่สุ่มมา · <b>n</b> = ทิศจาก v₂ ไป v₁ (เส้นแบ่งตั้งฉากกับทิศนี้) · (v₁ + v₂) / 2 = จุดกึ่งกลาง · c = ค่าคงที่ที่ทำให้เส้นผ่านจุดกึ่งกลาง · ทุกจุดบนเส้นห่าง v₁ และ v₂ เท่ากัน"],
    [M.math(M.t("side"), M.row(M.o("("), M.v("v"), M.o(")")), M.o("="), M.t("right if\u00a0"), M.v("n"), M.o("·"), M.v("v"), M.o(">"), M.i("c"), M.t(", else left")),
      "จุด <b>v</b> อยู่ฝั่งไหนของเส้น · n · v คือ dot (บท 2.2) · มากกว่า c = ขวา, ไม่มากกว่า = ซ้าย (เท่ากันพอดีไปซ้ายตามคลิป) · ตอนสร้างใช้แบ่งทุกจุด ตอนค้นใช้กับ query ทีละเส้นจนถึงกลุ่มสุดท้าย"],
    [M.math(M.t("answer"), M.o("="), M.t("nearest in the last group")),
      "เทียบ query เฉพาะจุดในกลุ่มสุดท้าย ซึ่งมีไม่เกิน 5 จุด (วัดแบบบท 5.1 แต่กับไม่กี่จุด) · เร็วมาก แต่ถ้าจุดที่ใกล้ที่สุดจริงถูกแบ่งไปอยู่อีกฝั่ง ก็จะพลาด = \"approximate\""],
  ],
  formulaFrom: "สูตรเส้นแบ่ง (normal = ผลต่าง, จุดกึ่งกลาง, constant = normal · กึ่งกลาง), กติกา \"> c = ขวา, เท่ากันไปซ้าย\", กลุ่มละไม่เกิน 5 จุด, 1,000 จุดใน [0, 100] และ query (50, 50) มาจากคลิป Serengil · ตำแหน่งจุดและการสุ่มเส้นในบทนี้ผู้จัดทำสุ่มเอง จำนวนขั้นจึงไม่ตรงกับ 9 ขั้นในคลิปเป๊ะ · การนับ \"วัด\" = จำนวนเส้นที่ดูฝั่ง + จำนวนจุดในกลุ่มสุดท้าย เป็นวิธีนับของผู้จัดทำ (คลิปเทียบ 9 ขั้นกับ 1,000 ครั้ง)",
  symbols: [
    ["v<sub>1</sub>, v<sub>2</sub>", "สองจุดที่สุ่มมาจากกลุ่ม", "ต้องเป็นคนละจุด"],
    ["n", "ทิศที่ตั้งฉากกับเส้นแบ่ง = v₁ − v₂", "บอกว่าฝั่งไหนคือ \"ขวา\""],
    ["c", "ค่าคงที่ของเส้น = n · จุดกึ่งกลาง", "เส้นคือทุกจุด x ที่ n · x = c"],
    ["side(v)", "ฝั่งของจุด v", "ใช้ทั้งตอนสร้างต้นไม้และตอนค้น"],
    ["≤ 5", "หยุดแบ่งเมื่อกลุ่มเหลือไม่เกิน 5 จุด", "subset_size = 5 ในคลิป"],
  ],
  notes: `
    <h2>จากคลิป Serengil (ANN from scratch)</h2>
    <ul>
      <li>ANN เป็นแกนของ vector database และดัชนีเวกเตอร์หลายตัว Spotify ใช้วิธีนี้ในไลบรารี Annoy เพื่อหาของใกล้สุดในข้อมูลเป็นล้านหรือพันล้านชิ้นภายในมิลลิวินาที</li>
      <li>คลิปใช้ 2 มิติเพื่อให้วาดได้ ข้อมูลจริงมีหลายมิติ (เช่น FaceNet 128 มิติ) เส้นแบ่งในมิติสูงคือ "hyperplane" แต่สูตรเหมือนเดิม</li>
      <li>ในคลิป ค้น (50, 50) ใช้ 9 ขั้น (ขนาดกลุ่ม 1000, 582, 264, 196, 113, 45, 34, 26, 9) ได้ 3 จุดที่อยู่ใกล้จริง เทียบกับ k-NN ที่ต้องเทียบครบ 1,000 ครั้ง
        = เร็วกว่าราว 111 เท่า <b>ถ้าสร้างต้นไม้ไว้ล่วงหน้า</b></li>
    </ul>
    <h2>ต้นไม้ต้นเดียวพลาดได้</h2>
    <p>ในไฟล์สรุปของคลิปนี้ ผู้จัดทำลองสร้างต้นไม้ 500 ต้น (คำนวณเอง ไม่ได้อยู่ในคลิป): ที่ query (50, 50) ได้จุดที่ใกล้ที่สุดจริงราว 74.6% ของครั้ง
    เพราะจุดที่ใกล้ที่สุดบางครั้งถูกเส้นแบ่งไปอยู่อีกฝั่ง การใช้ต้นไม้หลายต้นร่วมกันช่วยได้</p>
    <p class="fine">ปีของแนวคิด (ความรู้ทั่วไป ไม่ได้มาจากคลิป): Annoy เปิดให้ใช้ราวปี 2013</p>`,
  refs: [["ann", "สูตรเส้นแบ่ง, กติกาเลือกฝั่ง, กลุ่มละ 5 จุด, 1,000 จุด, 9 ขั้น vs 1,000 ครั้ง, Annoy, ทดลอง 500 ต้น (ในไฟล์สรุป)"]],
  mount(ui) {
    const st = { x: 50, y: 50, seed: 1 };
    let tree = build(P, minstd(st.seed)), treeSeed = st.seed;
    ui.number("query: แกนนอน", "x", st, "x", { min: 0, max: 100, step: 1 });
    ui.number("query: แกนตั้ง", "y", st, "y", { min: 0, max: 100, step: 1 });
    ui.buttons("ต้นไม้", [
      ["สร้างต้นไม้ใหม่ (Random)", () => { st.seed = 1 + Math.floor(Math.random() * 100000); }],
      ["ต้นไม้ตามโค้ด (seed 1)", () => { st.seed = 1; }],
    ]);
    const now = () => {
      if (treeSeed !== st.seed) { tree = build(P, minstd(st.seed)); treeSeed = st.seed; }
      const q = [st.x, st.y];
      return { q, ...search(tree, q), truth: exact(P, q) };
    };
    return {
      draw2d(g, W, H, c) {
        const r = now(), font = getComputedStyle(g.canvas).fontFamily;
        const S = Math.min(W, H) - 56, ox = (W - S) / 2, oy = (H - S) / 2 + S;
        const X = (p) => [ox + (p[0] / 100) * S, oy - (p[1] / 100) * S];
        g.strokeStyle = c.grid; g.lineWidth = 1; g.strokeRect(ox, oy - S, S, S);
        g.fillStyle = c.muted; g.font = `12px ${font}`; g.textAlign = "center"; g.textBaseline = "top";
        for (const t of [0, 50, 100]) { g.fillText(String(t), X([t, 0])[0], oy + 4); }
        g.textAlign = "right"; g.textBaseline = "middle";
        for (const t of [50, 100]) g.fillText(String(t), ox - 6, X([0, t])[1]);
        g.globalAlpha = 0.55; g.fillStyle = c.muted;
        for (const p of P) { const [x, y] = X(p); g.fillRect(x - 1, y - 1, 2.2, 2.2); }
        g.globalAlpha = 1;
        r.path.forEach((t, k) => {
          const seg = clipLine(t.h, t.value);
          if (!seg) return;
          g.strokeStyle = c.z; g.globalAlpha = 0.35 + 0.65 * ((k + 1) / r.path.length); g.lineWidth = 1.6;
          g.beginPath(); g.moveTo(...X(seg[0])); g.lineTo(...X(seg[1])); g.stroke();
        });
        g.globalAlpha = 1;
        g.fillStyle = c.b; for (const p of r.leaf) { g.beginPath(); g.arc(...X(p), 4, 0, 7); g.fill(); }
        g.strokeStyle = c.r; g.lineWidth = 2.2; g.beginPath(); g.arc(...X(r.truth), 8, 0, 7); g.stroke();
        g.fillStyle = c.a; g.beginPath(); g.arc(...X(r.q), 6, 0, 7); g.fill();
        g.font = `600 13px ${font}`; g.textAlign = "left"; g.textBaseline = "bottom"; g.fillText("q", X(r.q)[0] + 8, X(r.q)[1] - 4);
      },
      live() {
        const r = now(), ok = r.leaf.includes(r.truth), steps = r.path.length, measured = steps + r.leaf.length;
        const rows = r.path.map((t, k) => `<tr><td>${k + 1}</td><td>${t.value.length}</td></tr>`).join("") +
          `<tr class="win"><td>กลุ่มสุดท้าย</td><td>${r.leaf.length}</td></tr>`;
        return M.math(M.t("measured"), M.o("="), M.n(steps), M.t("\u00a0lines"), M.o("+"), M.n(r.leaf.length), M.t("\u00a0points"), M.o("="), M.n(measured, "res")) +
          `<p class="verdict">วัด ${measured} ครั้ง แทน ${N.toLocaleString()} ครั้งแบบ brute force · ${ok ? "เจอจุดที่ใกล้ที่สุดจริง" : "<b>พลาด</b>: จุดที่ใกล้ที่สุดจริง (วงสีม่วง) อยู่อีกฝั่งของเส้น"} · ได้ (${r.best.join(", ")}) ระยะ ${fmt(distance(r.q, r.best))}
            ${ok ? "" : ` · ตัวจริง (${r.truth.join(", ")}) ระยะ ${fmt(distance(r.q, r.truth))}`}</p>` +
          `<p class="fintro">ขนาดกลุ่มในแต่ละขั้นที่เดินลงไป:</p><div class="scroll"><table class="rank"><thead><tr><th>ขั้น</th><th>จำนวนจุด</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
