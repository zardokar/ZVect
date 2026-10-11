import { words, cosine, angle, dot, norm, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// 3.6 Bag of words (WIP202610026): one idea only — a sentence becomes a vector by counting each word.
// Presets are the StatQuest examples. Two different words fit on a flat graph; more words = more dimensions,
// shown as a table only (StatQuest: a 5-word example needs a 5-D graph nobody can draw).
const PRESETS = [
  ["Hello, World!", "Hello!"],
  ["Hello, World!", "Hello Hello Hello!"],
  ["Hello, World!", "Hello, World!"],
  ["Hello!", "World!"],
  ["I love Troll 2!", "I love Gymkata!"],
];
const LABELS = ["1. มุม 45°", "2. Hello × 3", "3. เหมือนกัน", "4. ไม่มีคำร่วม", "5. มี 5 คำ"];
function bag(a, b) {
  const wa = words(a), wb = words(b);
  const vocab = [...new Set([...wa, ...wb])];
  const count = (ws) => vocab.map((v) => ws.filter((w) => w === v).length);
  return { vocab, A: count(wa), B: count(wb) };
}
const deg = (r) => (r * 180) / Math.PI;

export default {
  slug: "bag-of-words",
  title: "Bag of words: นับคำแล้วได้เวกเตอร์",
  en: "Bag of words",
  example: "23_bag_of_words",
  hint: "ภาพนี้เป็นกราฟ 2 มิติ ไม่ต้องหมุน พิมพ์ประโยคหรือกดตัวอย่างด้านล่าง",
  canvasLabel: "กราฟนับคำ แกนนอนคือจำนวนคำแรก แกนตั้งคือจำนวนคำที่สอง มีเส้นจากจุดศูนย์ไปหาสองประโยคและมุมระหว่างเส้น",
  intro: `
    <p><b>Bag of words</b> เปลี่ยนประโยคเป็นเวกเตอร์ด้วยการ <b>นับคำ</b>: หนึ่งช่องต่อหนึ่งคำ ใส่จำนวนครั้งที่คำนั้นโผล่มา</p>
    <p>"Hello, World!" = (hello 1, world 1) และ "Hello!" = (hello 1, world 0) แล้วเทียบสองประโยคด้วย cosine (บท 2.3)</p>`,
  try: [
    "กดตัวอย่างที่ 1 แล้วตัวอย่างที่ 2: \"Hello Hello Hello\" ลูกศรยาวขึ้น แต่มุมยังเป็น 45° cosine จึงเท่าเดิม",
    "กดตัวอย่างที่ 4 (Hello! กับ World!): ไม่มีคำร่วมกันเลย มุม 90° cosine 0",
    "กดตัวอย่างที่ 5 (I love Troll 2! กับ I love Gymkata!): มี 5 คำ = 5 มิติ วาดไม่ได้ แต่สูตรยังคำนวณได้ (0.577 ≈ 0.58)",
  ],
  steps: [
    ["นับคำ", "เปลี่ยนประโยคเป็นเวกเตอร์ด้วยการนับว่าแต่ละคำโผล่กี่ครั้ง"],
    ["เทียบด้วย cosine", "ดูว่าสองประโยคใช้คำในสัดส่วนคล้ายกันแค่ไหน (บท 2.3)"],
  ],
  lines: [
    [M.math(M.v("A"), M.o("="), M.tuple([M.sub(M.t("count"), M.n(1)), M.o("…"), M.sub(M.t("count"), M.i("n"))])),
      "นับคำ · <b>A</b> = ประโยคหนึ่ง (ทำแบบเดียวกันกับ <b>B</b>) · n = จำนวนคำต่างกันทั้งหมดที่เจอในสองประโยค · count<sub>i</sub> = คำที่ i โผล่ใน A กี่ครั้ง · ได้เวกเตอร์ยาว n"],
    [M.math(M.fn("cos"), M.row(M.o("("), M.v("A"), M.o(","), M.v("B"), M.o(")")), M.o("="),
      M.frac(M.row(M.sum(M.row(M.i("i"), M.o("="), M.n(1)), M.i("n")), M.sub(M.i("A"), M.i("i")), M.sub(M.i("B"), M.i("i"))),
        M.row(M.sqrt(M.sum(M.row(M.i("i"), M.o("="), M.n(1)), M.i("n")), M.sup(M.sub(M.i("A"), M.i("i")), M.n(2))), M.sqrt(M.sum(M.row(M.i("i"), M.o("="), M.n(1)), M.i("n")), M.sup(M.sub(M.i("B"), M.i("i")), M.n(2)))))),
      "เทียบสองประโยค · ∑ = บวกทุกช่อง · i = คำที่ i ในตาราง (เริ่มที่ 1) · A<sub>i</sub>, B<sub>i</sub> = จำนวนของคำนั้นในแต่ละประโยค · ข้างบนคือ dot ข้างล่างคือความยาวสองตัวคูณกัน · ได้ 1 = มุม 0° (สัดส่วนการนับเท่ากัน), 0 = ไม่มีคำร่วมกัน"],
  ],
  formulaFrom: "ตารางนับคำ กราฟ hello / world มุม 45° → 0.71 และสูตร cosine แบบ ∑ มาจากคลิป StatQuest · คำว่า bag of words และ n-gram มาจากคลิป Under The Hood",
  symbols: [
    ["A, B", "สองประโยคที่เทียบ (หลังนับคำแล้ว)", "\"Hello, World!\" = (1, 1)"],
    ["n", "จำนวนคำต่างกันทั้งหมดในสองประโยค", "hello / world = 2 · ตัวอย่าง Troll 2 = 5"],
    ["i", "เลขช่อง = คำที่เท่าไรในตาราง", "i = 1 คือ hello"],
    ["A<sub>i</sub>", "จำนวนครั้งที่คำที่ i โผล่ใน A", "ไม่มีวันติดลบ"],
    ["∑", "บวกทุกตัวตั้งแต่ i = 1 ถึง n", "StatQuest: \"บวกหลาย ๆ อย่างเข้าด้วยกัน\""],
    ["cos(A, B)", "cosine ของสองประโยค", "ขึ้นกับมุมอย่างเดียว ไม่ขึ้นกับความยาว"],
  ],
  notes: `
    <h2>จาก StatQuest</h2>
    <ul>
      <li>ประโยคที่มีแค่ hello กับ world วาดเป็นจุดบนกราฟ 2 มิติได้: แกนนอน = จำนวน hello แกนตั้ง = จำนวน world</li>
      <li>ลากเส้นจากจุด (0, 0) ไปหาสองประโยค มุมระหว่างเส้นบอกความเหมือน: 45° → 0.71, 0° → 1, 90° → 0</li>
      <li>"Hello Hello Hello" อยู่ไกลออกไป แต่มุมเท่าเดิม cosine จึงเท่าเดิม ค่าขึ้นกับมุมอย่างเดียว ไม่ขึ้นกับความยาวเส้น</li>
      <li>"I love Troll 2!" กับ "I love Gymkata!" มี 5 คำ ต้องใช้กราฟ 5 มิติซึ่งวาดไม่ได้ แต่สูตรให้ 0.58 ได้ทันที</li>
      <li>เพราะจำนวนคำไม่ติดลบ ค่าจึงอยู่ระหว่าง 0 ถึง 1 (ข้อเสริมในไฟล์สรุป ไม่ได้อยู่ในคลิป)</li>
    </ul>
    <h2>จาก Under The Hood</h2>
    <ul>
      <li>ข้อเสีย: ข้อมูลเยอะทำให้เวกเตอร์ยาวมากและเกือบทั้งหมดเป็น 0 และไม่เข้าใจความหมายลึก (การนับคู่คำแบบ n-gram ช่วยเรื่องบริบทได้นิดหน่อย แต่ยิ่งยาวขึ้นอีก)</li>
    </ul>
    <h2>นับคำไม่ใช่ความหมาย</h2>
    <p>"Troll 2 is bad." กับ "I love Troll 2!" ได้ 0.50 ทั้งที่ความเห็นตรงข้ามกัน เพราะสูตรแค่ดูว่ามีคำร่วมกันกี่คำ
    (ตัวเลขนี้คำนวณเองในไฟล์สรุปของ StatQuest ไม่ได้อยู่ในคลิป) บท 3.7 จึงใช้ตารางที่ทำให้คำมีความหมายแทน</p>`,
  refs: [["statquest", "ตารางนับคำ, กราฟ hello / world, 45° → 0.71, ความยาวไม่มีผล, สูตร ∑, ตัวอย่าง 5 คำ → 0.58"],
    ["wordemb", "bag of words, unigram / bigram / n-gram และข้อเสีย"]],
  mount(ui) {
    const st = { a: PRESETS[0][0], b: PRESETS[0][1] };
    const ia = ui.text("ประโยค A", st, "a", "พิมพ์ประโยค");
    const ib = ui.text("ประโยค B", st, "b", "พิมพ์ประโยค");
    ui.buttons("ตัวอย่างจาก StatQuest", PRESETS.map(([a, b], k) => [LABELS[k], () => { st.a = ia.value = a; st.b = ib.value = b; }]));
    return {
      draw2d(g, W, H, c) {
        const { vocab, A, B } = bag(st.a, st.b), font = getComputedStyle(g.canvas).fontFamily;
        g.font = `600 15px ${font}`; g.fillStyle = c.ink; g.textAlign = "center"; g.textBaseline = "middle";
        if (vocab.length > 2 || vocab.length === 0) {
          g.fillText(vocab.length ? `มี ${vocab.length} คำ = ${vocab.length} มิติ วาดเป็นกราฟไม่ได้` : "ยังไม่มีคำ", W / 2, H / 2 - 12);
          g.font = `14px ${font}`; g.fillStyle = c.muted;
          g.fillText(vocab.length ? "แต่สูตรยังคำนวณได้ ดูตารางนับคำข้างสูตร" : "พิมพ์ประโยคด้านล่าง", W / 2, H / 2 + 14);
          g.textAlign = "left"; return;
        }
        const a2 = [A[0], A[1] ?? 0], b2 = [B[0], B[1] ?? 0];
        const top = Math.max(3, ...a2, ...b2), s = Math.min(W - 170, H - 150) / top;
        const ox = (W - top * s) / 2, oy = H - (H - top * s) / 2, P = ([x, y]) => [ox + x * s, oy - y * s];
        g.strokeStyle = c.grid; g.lineWidth = 1; g.font = `12px ${font}`; g.fillStyle = c.muted;
        for (let t = 0; t <= top; t++) {
          g.beginPath(); g.moveTo(...P([t, 0])); g.lineTo(...P([t, top])); g.stroke();
          g.beginPath(); g.moveTo(...P([0, t])); g.lineTo(...P([top, t])); g.stroke();
          g.fillText(String(t), P([t, 0])[0], oy + 14); g.fillText(String(t), ox - 14, P([0, t])[1]);
        }
        g.font = `600 14px ${font}`; g.fillStyle = c.x; g.fillText(`จำนวน ${vocab[0]} →`, P([top / 2, 0])[0], oy + 38);
        g.save(); g.translate(ox - 40, P([0, top / 2])[1]); g.rotate(-Math.PI / 2); g.fillStyle = c.y;
        g.fillText(vocab[1] ? `จำนวน ${vocab[1]} →` : "(ไม่มีคำที่สอง)", 0, 0); g.restore();
        const ray = (v, col) => {
          g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(...P([0, 0])); g.lineTo(...P(v)); g.stroke();
          g.fillStyle = col; g.beginPath(); g.arc(...P(v), 6, 0, 7); g.fill();
        };
        ray(a2, c.a); ray(b2, c.b);
        g.font = `600 14px ${font}`; g.textAlign = "left";
        g.fillStyle = c.a; g.fillText(`A (${a2.join(", ")})`, P(a2)[0] + 10, P(a2)[1] - 12);
        g.fillStyle = c.b; g.fillText(`B (${b2.join(", ")})`, P(b2)[0] + 10, P(b2)[1] + 14);
        const ta = Math.atan2(a2[1], a2[0]), tb = Math.atan2(b2[1], b2[0]), r = Math.min(70, s * 0.8);
        if (norm(a2) && norm(b2)) {
          g.strokeStyle = c.r; g.lineWidth = 2; g.beginPath(); g.arc(...P([0, 0]), r, -Math.max(ta, tb), -Math.min(ta, tb)); g.stroke();
          g.fillStyle = c.r; g.font = `700 14px ${font}`;
          const mid = (ta + tb) / 2; g.fillText(`${Math.round(deg(Math.abs(ta - tb)))}°`, P([0, 0])[0] + (r + 8) * Math.cos(mid), P([0, 0])[1] - (r + 8) * Math.sin(mid));
        }
        g.textAlign = "left";
      },
      live() {
        const { vocab, A, B } = bag(st.a, st.b);
        if (!vocab.length) return `<p class="verdict">พิมพ์ประโยคก่อน</p>`;
        const rows = vocab.map((w, i) => `<tr><td>${i + 1}</td><td>${w.replace(/[&<>"]/g, "")}</td><td>${A[i]}</td><td>${B[i]}</td></tr>`).join("");
        const c = cosine(A, B);
        return M.math(M.fn("cos"), M.o("="), M.frac(M.n(dot(A, B)), M.row(M.sqrt(M.n(dot(A, A))), M.o("×"), M.sqrt(M.n(dot(B, B))))), M.o("="), M.n(fmt(c), "res")) +
          `<p class="verdict">มุม ${fmt(deg(angle(A, B)))}° · A = (${A.join(", ")}) · B = (${B.join(", ")})</p>` +
          `<p class="fintro">ขั้นตอน 1: ตารางนับคำ (n = ${vocab.length})</p><div class="scroll"><table class="rank"><thead><tr><th>i</th><th>คำ</th><th>A</th><th>B</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
