import { M, keep } from "../js/kit.js";

// 1.5 Matrix (WIP202610026): one idea only — many vectors stacked as rows; shape = rows × columns.
// Starts with 4 example rows. New rows appear only from the "Random" button (owner's rule), kept in this browser.
const BASE = [[2, 3, 1], [-1, 2, 3], [3, -2, 2], [1, 1, -3]];
const MAX_EXTRA = 4;
const isRows = (x) => Array.isArray(x) && x.length <= MAX_EXTRA &&
  x.every((v) => Array.isArray(v) && v.length === 3 && v.every(Number.isFinite));
const randInt = () => Math.floor(Math.random() * 9) - 4;    // whole number -4..4, inside the drawn grid
const COL = ["x", "y", "z"];
const a = (i) => M.sub(M.v("a"), M.n(i));

export default {
  slug: "matrix",
  title: "Matrix: เวกเตอร์หลายตัวเรียงเป็นแถว",
  en: "Matrix (rows of vectors)",
  example: "20_matrix",
  view: { dist: 20 },
  intro: `
    <p><b>Matrix</b> (เมทริกซ์) คือตารางตัวเลขที่เอาเวกเตอร์หลายตัวมา <b>เรียงเป็นแถว</b>: แถวหนึ่ง = เวกเตอร์หนึ่งตัว</p>
    <p>ขนาดของตารางบอกเป็น <b>แถว × คอลัมน์</b> เริ่มต้นมี 4 แถว (4 จุดในภาพ) × 3 คอลัมน์ (x, y, z)</p>`,
  try: [
    "กด \"แถวถัดไป\": ลูกศรย้ายไปที่จุดของแถวนั้น และแถวนั้นในตารางเปลี่ยนสี",
    "เลือกคอลัมน์ z: ตัวเลขที่เลือกคือค่า z ของแถวนั้น (เส้นหนาบนแกน z)",
    "กด \"เพิ่มแถว (Random)\": จำนวนแถวเพิ่ม แต่คอลัมน์ยังเป็น 3 เสมอ",
  ],
  steps: [
    ["เรียงเวกเตอร์เป็นแถว", "เก็บเวกเตอร์หลายตัวไว้ในที่เดียว"],
    ["บอกขนาดตาราง", "รู้ว่ามีกี่แถว กี่คอลัมน์"],
    ["ชี้ตัวเลขหนึ่งตัว", "ใช้เลขแถวกับเลขคอลัมน์อ้างถึงตัวเลขตัวใดตัวหนึ่ง"],
  ],
  lines: [
    [M.math(M.v("A"), M.o("="), M.mat([[a(1)], [a(2)], [M.o("⋮")], [M.sub(M.v("a"), M.i("n"))]])),
      "เอาเวกเตอร์มาเรียงเป็นแถว · <b>A</b> = ชื่อตาราง (matrix) · <b>a</b><sub>1</sub>, <b>a</b><sub>2</sub>, … = เวกเตอร์แต่ละตัว (จุดในภาพ) · n = จำนวนเวกเตอร์ · ไม่มีการคำนวณ แค่เก็บรวมไว้ในที่เดียว"],
    [M.math(M.t("shape of\u00a0"), M.v("A"), M.o("="), M.i("n"), M.o("×"), M.i("d")),
      "บอกขนาดตาราง · n = จำนวนแถว (มีเวกเตอร์กี่ตัว) · d = จำนวนคอลัมน์ (เวกเตอร์ละกี่ตัวเลข บทนี้ 3) · × ตรงนี้อ่านว่า \"คูณ\" แต่หมายถึง \"แถว by คอลัมน์\" · ทุกแถวต้องมีตัวเลขเท่ากัน ตารางจึงเป็นสี่เหลี่ยม"],
    [M.math(M.sub(M.v("A"), M.row(M.i("i"), M.i("j"))), M.o("="), M.t("number in row\u00a0"), M.i("i"), M.t(", column\u00a0"), M.i("j")),
      "ชี้ตัวเลขหนึ่งตัว · i = เลขแถว (เวกเตอร์ตัวที่เท่าไร) · j = เลขคอลัมน์ (ช่องที่เท่าไรของเวกเตอร์นั้น) · เช่น A<sub>23</sub> = ช่องที่ 3 (z) ของ <b>a</b><sub>2</sub>"],
  ],
  formulaFrom: "การนับขนาดเป็นแถว × คอลัมน์มาจากคลิป Under The Hood (ตาราง 8 × 3: แถว = จำนวนคำ คอลัมน์ = จำนวนมิติ) และ BlackBoard AI (50,000 × 300) · การเขียนแบบ A<sub>ij</sub> เป็นความรู้ทั่วไป (ผู้จัดทำเลือก) · ตัวเลข 4 แถวตัวอย่างผู้จัดทำแต่งเอง",
  symbols: [
    ["A", "matrix: ตารางตัวเลข", "ตัวหนาตัวใหญ่ = ตารางทั้งตาราง"],
    ["a<sub>i</sub>", "เวกเตอร์แถวที่ i", "แถวหนึ่ง = จุดหนึ่งจุดในภาพ"],
    ["n", "จำนวนแถว", "เริ่มที่ 4 เพิ่มได้ด้วยปุ่มสุ่ม"],
    ["d", "จำนวนคอลัมน์ = จำนวนตัวเลขในแต่ละเวกเตอร์", "บทนี้ 3 (x, y, z) ไม่เปลี่ยน"],
    ["n × d", "ขนาดของตาราง: แถว × คอลัมน์", "เช่น 4 × 3 = 4 แถว 3 คอลัมน์ (มีตัวเลข 12 ตัว)"],
    ["A<sub>ij</sub>", "ตัวเลขในแถว i คอลัมน์ j", "นับจาก 1 ในสูตร · ในโค้ดเริ่มนับที่ 0 จึงเขียน A[i − 1][j − 1] (ความรู้ทั่วไป)"],
  ],
  notes: `
    <h2>ตารางแบบนี้เจอที่ไหน</h2>
    <ul>
      <li>ตารางของคำ (embedding table): แถวละหนึ่งคำ คอลัมน์ = จำนวนมิติ คลิป BlackBoard AI ใช้ขนาด 50,000 × 300
        คือ 50,000 คำ คำละ 300 ตัวเลข รวม 15,000,000 ตัวเลข (ผลคูณคำนวณเอง)</li>
      <li>คลิป Under The Hood ใช้ตัวอย่างเล็ก 8 × 3: 8 คำ คำละ 3 ตัวเลข จำนวนแถวเท่ากับจำนวนคำ จำนวนคอลัมน์คือจำนวนมิติที่เลือกเอง</li>
      <li>อยากได้เวกเตอร์ของคำไหน ก็หยิบแถวของคำนั้น (บท 3.4 Embedding matrix ใช้เรื่องนี้)</li>
    </ul>
    <h2>เก็บเป็นตารางแล้วได้อะไร</h2>
    <ul>
      <li>คำนวณหลายแถวพร้อมกันได้ คลิปเทียบวิธีวัดมีโค้ด batch_cosine ที่รับสองตาราง (แถวละเวกเตอร์)
        แล้วหา cosine (บท 2.3) ของแถวที่ตรงกันทีละคู่ สไลด์เขียนกำกับว่าให้ทำแบบนี้ (vectorize) เพื่อความเร็ว</li>
    </ul>`,
  refs: [["wordemb", "ตาราง 8 × 3: แถว = จำนวนคำ คอลัมน์ = จำนวนมิติ"], ["blackboard", "ตารางขนาด 50,000 × 300 แถวละคำ"],
    ["metrics", "batch_cosine: ตารางที่แต่ละแถวเป็นเวกเตอร์ คำนวณทีละแถว"]],
  mount(ui) {
    const store = keep("matrix.random", [], isRows);
    const st = { i: 0, j: 0 };
    const rows = () => [...BASE, ...store.value];
    ui.buttons("เลือกแถว i", [
      ["← แถวก่อน", () => { st.i = (st.i - 1 + rows().length) % rows().length; }],
      ["แถวถัดไป →", () => { st.i = (st.i + 1) % rows().length; }],
    ]);
    ui.choice("เลือกคอลัมน์ j", [[0, "1 (x)"], [1, "2 (y)"], [2, "3 (z)"]], st, "j");
    ui.buttons("แถวในตาราง", [
      ["เพิ่มแถว (Random)", () => { if (store.value.length < MAX_EXTRA) { store.value.push([randInt(), randInt(), randInt()]); store.save(); } }],
      ["ล้างแถวที่สุ่ม", () => { store.value = []; store.save(); st.i = Math.min(st.i, BASE.length - 1); }],
    ]);
    return {
      draw(s) {
        s.grid(); s.axes();
        const R = rows(), v = R[st.i];
        R.forEach((p, k) => { if (k !== st.i) s.point(p, k < BASE.length ? s.c.ink : s.c.y, "a" + (k + 1), { r: 4.5 }); });
        const end = [0, 0, 0]; end[st.j] = v[st.j];
        s.line([0, 0, 0], end, s.c[COL[st.j]], { width: 5 });
        s.line(v, end, s.c.muted, { dash: [4, 4] });
        s.arrow([0, 0, 0], v, s.c.a, "a" + (st.i + 1));
      },
      live() {
        const R = rows(), v = R[st.i], n = R.length;
        const cells = R.map((r, k) => r.map((x, j) => M.n(x, k === st.i ? (j === st.j ? "res" : "ca") : "", false)));
        const tableMath = M.math(M.v("A"), M.o("="), M.mat(cells));
        return M.math(M.t("shape of\u00a0"), M.v("A"), M.o("="), M.n(n, "res"), M.o("×"), M.n(3)) +
          M.math(M.sub(M.v("A"), M.row(M.n(st.i + 1), M.n(st.j + 1))), M.o("="), M.n(v[st.j], "res")) +
          `<p class="verdict">แถว ${st.i + 1} คอลัมน์ ${st.j + 1} = ค่า ${COL[st.j]} ของ a${st.i + 1} = (${v.join(", ")})</p>` +
          `<p class="fintro">ขั้นตอน 1 ตอนนี้: ${n} แถว × 3 คอลัมน์</p><div class="scroll">${tableMath}</div>` +
          (store.value.length ? `<p class="ctl-note">แถว ${BASE.length + 1}–${n} มาจากปุ่มสุ่ม และจะยังอยู่ตอนเปิดหน้านี้ครั้งหน้า</p>` : "");
      },
    };
  },
};
