import { M } from "../js/kit.js";
import { minstd } from "../js/anntree.js";

// 5.8 HNSW build (WIP202610027): one idea only — when a point is inserted, a biased coin (heads with chance 1/M) decides
// how many layers up it also appears, so each layer has about 1/M of the points of the layer below.
// Coin rule from the Satyajit Das clip; counts below use the same tiny random as examples/*/31_hnsw_build.*.
function layers(n, m, seed) {
  const r = minstd(seed), count = [];
  for (let i = 0; i < n; i++) {
    let level = 0;
    while (r() < 1 / m) level++;
    for (let k = 0; k <= level; k++) count[k] = (count[k] || 0) + 1;     // a point on level L is also on every level below
  }
  return count;
}
const CLIP = ["HEAD", "HEAD", "TAIL"];          // the clip's example insert: "Pause billing during vacations" -> max layer 2
const fmtN = (x) => (x >= 10 ? Math.round(x).toLocaleString() : x.toFixed(2));

export default {
  slug: "hnsw-build",
  title: "HNSW: สร้างชั้นด้วยการโยนเหรียญ",
  en: "HNSW: building the layers",
  example: "31_hnsw_build",
  hint: "ภาพนี้เป็นกราฟแท่ง 2 มิติ (แกนตั้งแบบ log) ไม่ต้องหมุน เปลี่ยน M หรือ N จากปุ่มด้านล่าง",
  canvasLabel: "กราฟแท่งจำนวนจุดในแต่ละชั้นของ HNSW เทียบกับค่าที่คาดไว้ N × (1/M) ยกกำลัง k",
  intro: `
    <p>บท 5.6 ใช้ hub 3 จุดที่เลือกเองเป็นชั้นบน HNSW ของจริงเลือกด้วยการ <b>โยนเหรียญ</b> ตอนใส่จุดใหม่ทีละจุด:</p>
    <p>ทุกจุดอยู่ชั้น 0 เสมอ แล้วโยนเหรียญที่ออกหัวด้วยโอกาส <b>1/M</b> ได้หัว = ขึ้นไปอยู่ชั้นถัดไปด้วย แล้วโยนต่อ จนได้ก้อยก็หยุด
    จุดส่วนใหญ่จึงอยู่แค่ชั้นล่าง มีน้อยมากที่ขึ้นไปถึงชั้นบน และกลายเป็น "ทางด่วน"</p>`,
  try: [
    "M = 16, N = 1,000,000: นับได้ชั้น 1 = 62,214 · ชั้น 2 = 3,904 · ชั้น 3 = 230 · ชั้น 4 = 11 ใกล้ค่าที่คาดไว้ (62,500 · 3,906 · 244 · 15)",
    "เปลี่ยนเป็น M = 2: แต่ละชั้นเหลือครึ่งหนึ่งของชั้นล่าง จึงมีชั้นเยอะขึ้นมาก",
    "กด \"ใส่จุดใหม่ 1 จุด (Random)\" หลายครั้ง: ส่วนใหญ่ได้ก้อยตั้งแต่ครั้งแรก (อยู่แค่ชั้น 0)",
  ],
  steps: [
    ["ใส่จุดหนึ่งจุด", "โยนเหรียญเลือกว่าจุดนี้ขึ้นไปอยู่ถึงชั้นไหน"],
    ["ผลเมื่อใส่ครบ N จุด", "คำนวณว่าแต่ละชั้นควรมีกี่จุด ชั้นบนจึงเล็กลงเรื่อย ๆ"],
  ],
  lines: [
    [M.math(M.t("level"), M.o("="), M.n(0), M.t(";\u2003while coin(1/"), M.i("M"), M.t(") = HEAD:\u00a0level"), M.o("←"), M.t("level"), M.o("+"), M.n(1)),
      "ใส่จุดหนึ่งจุด · level = ชั้นสูงสุดที่จุดนี้อยู่ (เริ่มชั้น 0) · coin(1/M) = เหรียญที่ออกหัวด้วยโอกาส 1/M · ได้หัวขึ้นอีกชั้นแล้วโยนต่อ ได้ก้อยหยุด · จุดที่อยู่ชั้น L ก็อยู่ทุกชั้นที่ต่ำกว่าด้วย"],
    [M.math(M.t("expected on level ≥\u00a0"), M.i("k"), M.o("="), M.i("N"), M.o("×"), M.sup(M.row(M.o("("), M.frac(M.n(1), M.i("M")), M.o(")")), M.i("k"))),
      "ใส่ครบ N จุด · ชั้นที่ k ต้องได้หัวติดกัน k ครั้ง โอกาส (1/M)<sup>k</sup> · N = จำนวนจุดทั้งหมด · แต่ละชั้นจึงเหลือราว 1/M ของชั้นล่าง"],
  ],
  formulaFrom: "การโยนเหรียญที่โอกาสราว 1/M ทุกจุดอยู่ชั้น 0 ได้หัวขึ้นชั้น จนได้ก้อยหยุด และตัวอย่าง \"Pause billing during vacations\" (หัว หัว ก้อย → ชั้นสูงสุด 2) มาจากคลิป Satyajit Das · ตาราง N × (1/M)<sup>k</sup> สำหรับ M = 16, N = 1,000,000 คำนวณเองในไฟล์สรุปของคลิป",
  symbols: [
    ["M", "จำนวนเพื่อนบ้านที่แต่ละจุดเก็บ (ค่าตั้งตอนสร้าง)", "ใช้กำหนดโอกาสได้หัว 1/M ด้วย"],
    ["coin(1/M)", "เหรียญที่ออกหัวด้วยโอกาส 1/M", "M = 16 → หัว 1 ใน 16"],
    ["level", "ชั้นสูงสุดของจุดนั้น", "อยู่ชั้นที่ต่ำกว่าทุกชั้นด้วย"],
    ["k", "เลขชั้น (0 = ล่างสุด)", ""],
    ["N × (1/M)<sup>k</sup>", "จำนวนจุดที่คาดว่าอยู่ชั้น k ขึ้นไป", "1,000,000 × (1/16)² ≈ 3,906"],
  ],
  notes: `
    <h2>จากคลิป Satyajit Das</h2>
    <ul>
      <li>สร้างโดยใส่บทความทีละชิ้น แต่ละชิ้นโยนเหรียญที่ลำเอียง (โอกาสราว 1/M) เพื่อขึ้นชั้นถัดไป และโยนซ้ำจนพลาด</li>
      <li>ส่วนใหญ่อยู่ชั้น 0 บางส่วนขึ้นได้ครั้งเดียว น้อยมากที่รอดได้ 2–3 ครั้ง จุดที่ขึ้นได้สูงซึ่งหายากเหล่านี้กลายเป็นทางด่วน</li>
      <li>ตัวอย่างบนจอ: บทความใหม่ "Pause billing during vacations" อยู่ชั้น 0 เสมอ โยนครั้งที่ 1 หัว → ชั้น 1, ครั้งที่ 2 หัว → ชั้น 2, ครั้งที่ 3 ก้อย → หยุด = ชั้นสูงสุด 2</li>
      <li>ค่าที่ตั้งได้: M (เพื่อนบ้านต่อจุด), efConstruction (ความพยายามค้นตอนสร้าง), efSearch (บท 5.7) แลกกันระหว่างหน่วยความจำ เวลาสร้าง ความเร็ว และความแม่น</li>
    </ul>
    <h2>เสริม (ในไฟล์สรุป ไม่ได้อยู่ในคลิป)</h2>
    <p>(ความรู้ทั่วไป) หลายการใช้งานและ paper ต้นฉบับให้ชั้น 0 มีเส้นได้มากกว่า M (มักเป็น 2M) และสูตรโอกาส (1/M)<sup>k</sup> สอดคล้องกับคำว่า "ราว 1/M" ในคลิป</p>
    <h2>จากทอล์ก Qdrant</h2>
    <p>ใส่จุดใหม่ใช้แรงราว 2 เท่าของการค้น เพราะต้องค้นหาเพื่อนบ้านของจุดใหม่ด้วย</p>`,
  refs: [["hnsw", "โยนเหรียญ ~1/M ตอนใส่จุด, ตัวอย่าง Pause billing (หัว หัว ก้อย), ค่า M / efConstruction / efSearch, ตาราง N × (1/M)^k (ในไฟล์สรุป)"],
    ["qdrant", "ใส่จุดใหม่ ~2 เท่าของการค้น"]],
  mount(ui) {
    const st = { m: 16, n: 1000000, flips: CLIP, clip: true };
    ui.choice("M", [[2, "M = 2"], [4, "M = 4"], [16, "M = 16"]], st, "m");
    ui.choice("จำนวนจุด N", [[1000, "1,000"], [1000000, "1,000,000"]], st, "n");
    ui.buttons("ใส่จุดใหม่", [["ใส่จุดใหม่ 1 จุด (Random)", () => {
      const f = [];
      while (Math.random() < 1 / st.m) f.push("HEAD");
      f.push("TAIL"); st.flips = f; st.clip = false;
    }], ["ตัวอย่างในคลิป", () => { st.flips = CLIP; st.clip = true; }]]);
    let key = "", cache = null;
    const data = () => { const k = st.m + "/" + st.n; if (k !== key) { key = k; cache = layers(st.n, st.m, 7); } return cache; };
    return {
      draw2d(g, W, H, c) {
        const cnt = data(), font = getComputedStyle(g.canvas).fontFamily;
        const K = Math.min(cnt.length, 12), x0 = 64, y0 = H - 46, w = W - x0 - 24, h = H - 96;
        const top = Math.log10(st.n), Y = (v) => y0 - (v <= 0 ? 0 : (Math.log10(v) + 0.3) / (top + 0.3)) * h;
        g.strokeStyle = c.grid; g.fillStyle = c.muted; g.font = `12px ${font}`; g.textAlign = "right"; g.textBaseline = "middle";
        for (let e = 0; e <= top; e++) { const y = Y(10 ** e); g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + w, y); g.stroke(); g.fillText((10 ** e).toLocaleString(), x0 - 6, y); }
        const bw = w / K;
        for (let k = 0; k < K; k++) {
          const x = x0 + k * bw, exp = st.n * (1 / st.m) ** k;
          g.fillStyle = c.b; g.fillRect(x + bw * 0.18, Y(cnt[k]), bw * 0.64, y0 - Y(cnt[k]));
          g.strokeStyle = c.r; g.lineWidth = 2; g.beginPath(); g.moveTo(x + bw * 0.1, Y(exp)); g.lineTo(x + bw * 0.9, Y(exp)); g.stroke();
          g.fillStyle = c.ink; g.textAlign = "center"; g.textBaseline = "bottom"; g.font = `600 12px ${font}`;
          g.fillText(cnt[k].toLocaleString(), x + bw / 2, Y(cnt[k]) - 3);
          g.fillStyle = c.muted; g.textBaseline = "top"; g.font = `12px ${font}`; g.fillText("ชั้น " + k, x + bw / 2, y0 + 6);
        }
        g.textAlign = "left"; g.textBaseline = "top"; g.font = `13px ${font}`;
        g.fillStyle = c.b; g.fillText("■ นับได้จริง", x0, 10); g.fillStyle = c.r; g.fillText("— คาดไว้ N × (1/M)^k", x0 + 110, 10);
      },
      live() {
        const cnt = data(), lvl = st.flips.length - 1;
        const steps = ["ชั้น 0 (เสมอ)", ...st.flips.map((f, i) => (f === "HEAD" ? `หัว → ชั้น ${i + 1}` : "ก้อย → หยุด"))].join(" · ");
        const rows = cnt.slice(0, 8).map((n, k) => `<tr><td>${k}</td><td>${n.toLocaleString()}</td><td class="dim">${fmtN(st.n * (1 / st.m) ** k)}</td></tr>`).join("");
        return M.math(M.t("expected on level ≥ 2"), M.o("="), M.n(st.n.toLocaleString()), M.o("×"), M.sup(M.row(M.o("("), M.frac(M.n(1), M.n(st.m)), M.o(")")), M.n(2)), M.o("="), M.n(fmtN(st.n / st.m ** 2), "res")) +
          `<p class="verdict">${st.clip ? "ตัวอย่างในคลิป" : "จุดใหม่"}: ${steps} → ชั้นสูงสุด <b>${lvl}</b></p>` +
          `<p class="fintro">จำนวนจุดในแต่ละชั้น (N = ${st.n.toLocaleString()}, M = ${st.m}):</p><div class="scroll"><table class="rank"><thead><tr><th>ชั้น k</th><th>นับได้</th><th>คาดไว้</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
