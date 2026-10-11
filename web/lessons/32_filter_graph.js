import { M } from "../js/kit.js";
import { minstd } from "../js/anntree.js";

// 5.9 Filtering during the search (WIP202610027): one idea only — a filter keeps only some points; the graph walk may use
// only those, and when too few are kept the graph falls apart (Qdrant talk: threshold about 1/k links). A random-link
// graph of 2,000 points, k links each (same as examples/*/32_filter_graph.*).
const N = 2000;
const KEEP_U = (() => { const r = minstd(9); return Array.from({ length: N }, () => r()); })();   // point i passes if u_i < kept
function makeGraph(k) {
  const r = minstd(5), nb = Array.from({ length: N }, () => new Set());
  for (let i = 0; i < N; i++) for (let t = 0; t < k / 2; t++) { let j = Math.floor(r() * N); if (j === i) j = (j + 1) % N; nb[i].add(j); nb[j].add(i); }
  return nb;
}
function biggest(nb, f) {                 // share of the kept points that sit in the largest connected group
  const kept = new Set(), seen = new Set();
  for (let i = 0; i < N; i++) if (KEEP_U[i] < f) kept.add(i);
  let big = 0;
  for (const s of kept) {
    if (seen.has(s)) continue;
    let c = 0; const stack = [s]; seen.add(s);
    while (stack.length) { const x = stack.pop(); c++; for (const y of nb[x]) if (kept.has(y) && !seen.has(y)) { seen.add(y); stack.push(y); } }
    big = Math.max(big, c);
  }
  return { kept: kept.size, share: kept.size ? big / kept.size : 0 };
}
const FS = Array.from({ length: 50 }, (_, i) => (i + 1) / 50);    // 2 %, 4 %, … 100 %

export default {
  slug: "filter-graph",
  title: "กรองระหว่างค้น: กรองเยอะเกินไป กราฟขาด",
  en: "Filtering breaks the graph",
  example: "32_filter_graph",
  hint: "ภาพนี้เป็นกราฟเส้น 2 มิติ ไม่ต้องหมุน เปลี่ยนจำนวนเส้นต่อจุดและสัดส่วนที่ผ่านตัวกรองจากด้านล่าง",
  canvasLabel: "กราฟเส้น แกนนอนคือสัดส่วนจุดที่ผ่านตัวกรอง แกนตั้งคือสัดส่วนที่ยังเดินถึงกันได้ เส้นประแนวตั้งคือขีด 1/k",
  intro: `
    <p>การค้นจริงมักมีเงื่อนไข เช่น "ราคาไม่เกิน 100" หรือ "ใกล้ฉัน" ถ้ากรองระหว่างเดินกราฟ (บท 5.5–5.7) ก็เดินได้แค่ <b>จุดที่ผ่านตัวกรอง</b></p>
    <p>ถ้าผ่านน้อยเกินไป จุดเหล่านั้นจะ <b>ไม่มีเส้นต่อถึงกัน</b> กราฟแตกเป็นเกาะเล็ก ๆ เดินไปหาคำตอบไม่ได้
    ทอล์ก Qdrant บอกว่าขีดอยู่ราว <b>1/k</b> เมื่อแต่ละจุดมี k เส้น</p>`,
  try: [
    "k = 8 (ดูตาราง): ผ่าน 25% ยังเดินถึงกันได้ 79% · ผ่าน 12.5% เหลือแค่ 9% (ขีด 1/8 = 12.5%)",
    "เปลี่ยนเป็น k = 16: ทนการกรองได้มากขึ้น เส้นตกชันแถว ๆ 1/16 ≈ 6%",
    "k = 4: แค่ผ่าน 30% กราฟก็แตกแล้ว",
  ],
  linesIntro: "มี 2 บรรทัด: บรรทัด 1 ตัวกรองเหลือจุดเท่าไร · บรรทัด 2 เมื่อไหร่กราฟขาด",
  lines: [
    [M.math(M.t("walk only on kept points")),
      "กรองระหว่างเดิน (in-place filtering) · kept = จุดที่ผ่านเงื่อนไข · เส้นที่ต่อไปยังจุดที่ไม่ผ่านใช้ไม่ได้ · ถ้าจุดที่ผ่านไม่มีเส้นต่อกัน ก็เดินไม่ถึง"],
    [M.math(M.t("breaks when kept fraction"), M.o("<"), M.frac(M.n(1), M.i("k"))),
      "ขีดที่กราฟขาด · k = จำนวนเส้นต่อจุด · ตัวอย่างในทอล์ก: 10 เส้น → กรองออก 90% (เหลือ 10%) กราฟก็ขาด · เส้นมาก = ทนการกรองได้มากกว่า"],
  ],
  formulaFrom: "ปัญหากรองแล้วกราฟขาด, ขีดตามทฤษฎี percolation ราว 1/k, ตัวอย่าง 10 เส้น → กรองออก 90%, กรองระหว่างเดิน (in-place) และวิธีแก้ด้วยเส้นเสริม มาจากทอล์ก Qdrant · กราฟในภาพเป็นกราฟสุ่ม 2,000 จุดที่ผู้จัดทำสร้างเอง (จุดละ k เส้นโดยเฉลี่ย) ตัวเลขจึงเป็นการทดลอง ไม่ใช่ตัวเลขจากทอล์ก",
  symbols: [
    ["kept", "จุดที่ผ่านตัวกรอง", "เลื่อนด้วยแถบ \"ผ่านตัวกรอง\""],
    ["kept fraction", "สัดส่วนจุดที่ผ่าน", "0.1 = ผ่าน 10%"],
    ["k", "จำนวนเส้นต่อจุดในกราฟ", "คล้าย M ของ HNSW"],
    ["1/k", "ขีดที่กราฟเริ่มขาด (ตามทฤษฎี)", "k = 10 → 10%"],
    ["largest group", "สัดส่วนของจุดที่ผ่าน ที่ยังเดินถึงกันได้", "แกนตั้งของกราฟ"],
  ],
  notes: `
    <h2>จากทอล์ก Qdrant (Andrey Vasnetsov)</h2>
    <ul>
      <li>การกรองที่พบบ่อย: ร้านค้าออนไลน์ "ราคาไม่เกิน $100", "ใกล้ฉัน" · กรองทีหลัง (post-filtering) และกรองก่อน (pre-filtering) ต่างก็มีปัญหา
        Qdrant จึงเช็คเงื่อนไข <b>ระหว่างเดินกราฟ</b> เท่าที่จำเป็น</li>
      <li>ตัวกรองที่เข้มทำให้กราฟขาด ตามทฤษฎี percolation ขีดอยู่ราว 1/k: กราฟที่มี 10 เส้นต่อจุด ถ้ากรองออก 90% ก็ขาด ·
        กราฟความแม่นที่วัดได้ตกลงจนเกือบศูนย์ ตรงกับทฤษฎี และขึ้นกับจำนวนเส้นต่อจุด</li>
      <li>วิธีแก้: ตัวกรองใช้ค่าที่รู้ล่วงหน้า (payload) จึงสร้างกราฟย่อยของแต่ละค่า (เช่นแต่ละหมวด) แล้วรวมเส้นเข้ากราฟหลัก
        กราฟจึงยังต่อกันสำหรับเงื่อนไขนั้น · เส้นเสริมใช้เฉพาะเมื่อเส้นเดิมถูกกรองออก จึงไม่ทำให้ค้นช้าลง</li>
    </ul>
    <h2>เสริม (คำนวณเองในไฟล์สรุป ไม่ได้อยู่ในทอล์ก)</h2>
    <p>ขีดกรองออก 1 − 1/k: k = 4 → 75%, 8 → 87.5%, 10 → 90%, 16 → 93.8%, 32 → 96.9%, 64 → 98.4%</p>`,
  refs: [["qdrant", "กรองระหว่างเดิน, กรองเข้มแล้วกราฟขาด, ขีด 1/k (10 เส้น → 90%), เส้นเสริมต่อค่า payload, ตาราง 1 − 1/k (ในไฟล์สรุป)"]],
  mount(ui) {
    const st = { k: 8, f: 0.24 };
    ui.choice("เส้นต่อจุด k", [[4, "k = 4"], [8, "k = 8"], [16, "k = 16"]], st, "k");
    ui.number("ผ่านตัวกรอง (สัดส่วน)", "kept", st, "f", { min: 0.02, max: 1, step: 0.02 });
    const cache = {};
    const curve = (k) => { if (!cache[k]) { const nb = makeGraph(k); cache[k] = { nb, pts: FS.map((f) => biggest(nb, f).share) }; } return cache[k]; };
    return {
      draw2d(g, W, H, c) {
        const font = getComputedStyle(g.canvas).fontFamily, cv = curve(st.k);
        const x0 = 56, y0 = H - 50, w = W - x0 - 28, h = H - 100;
        const X = (f) => x0 + f * w, Y = (v) => y0 - v * h;
        g.strokeStyle = c.grid; g.lineWidth = 1; g.fillStyle = c.muted; g.font = `12px ${font}`;
        for (const t of [0, 0.25, 0.5, 0.75, 1]) {
          g.beginPath(); g.moveTo(x0, Y(t)); g.lineTo(x0 + w, Y(t)); g.stroke();
          g.textAlign = "right"; g.textBaseline = "middle"; g.fillText(Math.round(t * 100) + "%", x0 - 6, Y(t));
          g.textAlign = "center"; g.textBaseline = "top"; g.fillText(Math.round(t * 100) + "%", X(t), y0 + 6);
        }
        g.fillText("ผ่านตัวกรอง →", X(0.5), y0 + 24);
        g.strokeStyle = c.r; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(X(1 / st.k), Y(0)); g.lineTo(X(1 / st.k), Y(1)); g.stroke(); g.setLineDash([]);
        g.fillStyle = c.r; g.textAlign = "left"; g.textBaseline = "top"; g.fillText(`1/k = ${(100 / st.k).toFixed(1)}%`, X(1 / st.k) + 4, Y(1) + 2);
        g.strokeStyle = c.z; g.lineWidth = 2.5; g.beginPath();
        cv.pts.forEach((v, i) => (i ? g.lineTo(X(FS[i]), Y(v)) : g.moveTo(X(FS[i]), Y(v)))); g.stroke();
        const now = biggest(cv.nb, st.f);
        g.fillStyle = c.a; g.beginPath(); g.arc(X(st.f), Y(now.share), 6, 0, 7); g.fill();
        g.fillStyle = c.ink; g.textAlign = "left"; g.textBaseline = "bottom"; g.font = `600 13px ${font}`;
        g.fillText("เดินถึงกันได้ (กลุ่มใหญ่สุด)", x0 + 4, Y(1) - 6);
      },
      live() {
        const now = biggest(curve(st.k).nb, st.f), pct = (x) => (x * 100).toFixed(0) + "%";
        const rows = [0.5, 0.25, 0.125, 0.0625].map((f) => `<tr class="${Math.abs(f - st.f) < 0.011 ? "win" : ""}"><td>${f * 100}%</td><td>${pct(biggest(curve(st.k).nb, f).share)}</td></tr>`).join("");
        return M.math(M.t("kept"), M.o("="), M.n(pct(st.f)), M.o("="), M.n(now.kept.toLocaleString()), M.t("\u00a0points;\u2003"), M.frac(M.n(1), M.n(st.k)), M.o("="), M.n((100 / st.k).toFixed(1) + "%", "res")) +
          `<p class="verdict">เดินถึงกันได้ <b>${pct(now.share)}</b> ของจุดที่ผ่าน · ${now.share < 0.5 ? "<b>กราฟแตกเป็นเกาะ</b> (กลุ่มใหญ่สุดไม่ถึงครึ่ง)" : "กราฟส่วนใหญ่ยังต่อกัน"} · ${st.f < 1 / st.k ? "ต่ำกว่าขีด 1/k" : "สูงกว่าขีด 1/k"}</p>` +
          `<p class="fintro">k = ${st.k}: ผ่านตัวกรองเท่านี้ → เดินถึงกันได้เท่าไร</p><div class="scroll"><table class="rank"><thead><tr><th>ผ่าน</th><th>ถึงกันได้</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
