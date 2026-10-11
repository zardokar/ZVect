import { add, sub, scale, mean, cosine, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// 3.8 Learning the table (WIP202610026): one idea only — rows start random and are nudged a little at a time
// toward what their context says; words used in the same context end up close. A TOY update (my choice), not real
// word2vec training: context rows stay fixed and the center row moves toward their mean.
const CTX = { pet: [-0.5, 3.5, 0.5], sleeps: [0.5, 2.5, -0.5], drive: [3.5, 0, 0.5], fast: [2.5, 1, -0.5] };
const WINDOWS = [["pet", "cat", "sleeps"], ["pet", "dog", "sleeps"], ["drive", "car", "fast"], ["drive", "bus", "fast"]];
const START = { cat: [-2, -1, 2], dog: [2, -2, -1], car: [-1, 2, -2], bus: [1, 1, 2] };
const ETA = 0.3;
const WORDS = Object.keys(START);
const copy = (o) => JSON.parse(JSON.stringify(o));
const f2 = (v) => "(" + v.map((x) => (Math.abs(x) < 0.005 ? 0 : x).toFixed(2)).join(", ") + ")";
const tup = (v) => M.tuple(v.map((x) => M.n((Math.abs(x) < 0.005 ? 0 : x).toFixed(2))));
const randRow = () => [0, 0, 0].map(() => Math.round((Math.random() * 8 - 4) * 2) / 2);   // -4..4 in steps of 0.5

// one pass = every window once, in order
function pass(E) {
  for (const [l, w, r] of WINDOWS) {
    const c = mean([CTX[l], CTX[r]]);
    E[w] = add(E[w], scale(sub(c, E[w]), ETA));
  }
}

export default {
  slug: "learn-table",
  title: "ตาราง embedding มาจากไหน: เริ่มสุ่ม แล้วปรับทีละนิด",
  en: "Learning the table",
  example: "24_learn_table",
  view: { dist: 17, yaw: 0.9 },
  intro: `
    <p>ตาราง embedding (บท 3.7) <b>ไม่มีใครเขียนเอง</b> แถวทุกแถวเริ่มจากเลขสุ่ม แล้วโมเดลค่อย ๆ <b>ปรับทีละนิด</b> จากข้อความจำนวนมาก</p>
    <p>วิธีหนึ่งคือ <b>CBOW</b>: ใช้คำรอบข้างเดาคำกลาง ฝึกซ้ำไปเรื่อย ๆ คำที่อยู่ในบริบทเดียวกัน (cat กับ dog) จึงถูกดันมาอยู่ใกล้กัน</p>
    <p class="fine">ภาพในบทนี้ใช้กติกาย่อของแนวคิดนี้ (ผู้จัดทำเลือก) ไม่ใช่การฝึก CBOW จริง</p>`,
  try: [
    "กด \"ฝึก 1 รอบ\" ทีละครั้ง: จุดของแต่ละคำขยับเข้าหาคำรอบข้างของมัน (เส้นประคือทางที่เดินมา)",
    "ดูตาราง: cosine ของ cat กับ dog เริ่มติดลบ (รอบแรกอาจลดลงอีก) แล้วขึ้นไปใกล้ 1 ส่วน cat กับ car ขยับขึ้นนิดเดียวแล้วค้างที่ราว 0.16",
    "กด \"เริ่มใหม่ (Random)\": จุดเริ่มต่างไป แต่ฝึกพอแล้วได้กลุ่มเดิม",
  ],
  stepsWhy: "3 ขั้นตอน = การฝึกหนึ่งครั้งของคำกลางหนึ่งคำ ทำซ้ำทุกหน้าต่าง หลายรอบ",
  steps: [
    ["ดูคำรอบข้าง", "เฉลี่ยแถวของคำซ้ายและขวาเป็นบริบท c"],
    ["วัดว่าห่างแค่ไหน", "ดูว่าแถวของคำกลางต่างจากบริบทเท่าไร"],
    ["ขยับแถวนิดเดียว", "ขยับเข้าหาบริบท 30% ของระยะที่เหลือ ไม่กระโดดไปทีเดียว"],
  ],
  lines: [
    [M.math(M.v("c"), M.o("="), M.frac(M.row(M.sub(M.v("e"), M.t("left")), M.o("+"), M.sub(M.v("e"), M.t("right"))), M.n(2))),
      "รวมคำรอบข้าง · หน้าต่างกว้าง 3 คำ: ซ้าย 1 คำ กลาง 1 คำ ขวา 1 คำ · <b>e</b><sub>left</sub>, <b>e</b><sub>right</sub> = แถวของคำซ้ายและขวา · <b>c</b> = context (ค่าเฉลี่ยของสองแถว)"],
    [M.math(M.t("error"), M.o("="), M.v("c"), M.o("−"), M.sub(M.v("e"), M.i("w"))),
      "แถวของคำกลางต่างจากบริบทเท่าไร · w = คำกลาง · <b>e</b><sub>w</sub> = แถวของ w ตอนนี้ · error ยาว = ยังห่าง, error สั้น = ใกล้แล้ว"],
    [M.math(M.sub(M.v("e"), M.i("w")), M.o("←"), M.sub(M.v("e"), M.i("w")), M.o("+"), M.i("η"), M.o("×"), M.t("error")),
      "ขยับแถวของ w เข้าหาบริบทนิดเดียว · ← = เอาค่าทางขวาไปเขียนทับ · η (eta) = ขนาดก้าว บทนี้ 0.3 = ขยับ 30% ของระยะที่เหลือ · ทำซ้ำทุกหน้าต่าง หลายรอบ"],
  ],
  formulaFrom: "ขั้นตอน เริ่มสุ่ม → ทาย → วัดความผิด → ปรับทีละนิด → ทำซ้ำ มาจากคลิป BlackBoard AI และ SOFAR · หน้าต่าง CBOW (คำรอบข้าง → คำกลาง) มาจากคลิป Under The Hood · <b>สูตรสามขั้นตอนนี้เป็นกติกาย่อที่ผู้จัดทำเลือก</b> เพื่อให้เห็นภาพ ไม่ใช่การฝึกจริง (ของจริงมีชั้น output ขนาดเท่าจำนวนคำ และปรับทุก weight ด้วย backpropagation) · ประโยคและตัวเลขในภาพผู้จัดทำแต่งเอง",
  symbols: [
    ["w", "คำกลางของหน้าต่าง (คำที่กำลังฝึก)", "cat, dog, car, bus"],
    ["e<sub>w</sub>", "แถวของ w ในตาราง", "เริ่มจากค่าสุ่ม"],
    ["e<sub>left</sub>, e<sub>right</sub>", "แถวของคำซ้ายและขวา", "บทนี้ตรึงไว้ไม่ขยับ (ย่อให้ง่าย)"],
    ["c", "context: ค่าเฉลี่ยของคำรอบข้าง", "pet + sleeps → กลุ่มสัตว์ · drive + fast → กลุ่มรถ"],
    ["error", "c − e<sub>w</sub>: ระยะที่ยังห่าง", "ลูกศรจากแถวไปหาบริบท"],
    ["η", "ขนาดก้าว (learning rate)", "0.3 = ขยับ 30% ของ error ต่อครั้ง"],
    ["←", "เขียนทับค่าเดิม", "ไม่ใช่ \"เท่ากับ\""],
  ],
  notes: `
    <h2>ของจริงทำอย่างไร</h2>
    <ul>
      <li>BlackBoard AI: แถวเริ่มเป็นเลขสุ่มเล็ก ๆ · โมเดลทายคำผิด (คำที่ถูกคือ crown) → คำนวณความผิด → ปรับแถวของ queen นิดเดียว
        · ทำซ้ำเป็นล้านครั้งกับข้อความปริมาณระดับอินเทอร์เน็ต คำที่อยู่ในบริบทคล้ายกัน (king, queen) จึงถูกดันไปทางเดียวกัน</li>
      <li>Under The Hood (Word2Vec แบบ CBOW): หน้าต่างกว้าง 3 = คำรอบข้างข้างละ 1 คำ เช่น fox กับ over → เดา jumps
        · ใส่คำรอบข้างเป็น one-hot (บท 3.5) · ชั้นกลางมีจำนวน neuron = จำนวนมิติของ embedding · ชั้น output = จำนวนคำ
        · คำนวณ error แล้ว backpropagate แล้วเลื่อนหน้าต่างไปคำถัดไป</li>
      <li>ฝึกเสร็จ weight ของชั้นแรก (จำนวนคำ × จำนวนมิติ) ก็คือตาราง embedding นั่นเอง</li>
      <li>Skip-gram ทำกลับกัน: ใช้คำกลางเดาคำรอบข้าง ทั้งสองแบบใช้ได้ดี</li>
    </ul>
    <h2>ผลของการฝึกจริง</h2>
    <ul>
      <li>SOFAR เปิด Word2Vec ของ Google (3 ล้านคำ คำละ 300 มิติ): king กับ queen ได้ 0.651 แต่ king กับ man ได้แค่ 0.229</li>
    </ul>`,
  refs: [["blackboard", "เริ่มสุ่ม → ทายผิด → ปรับทีละนิด ซ้ำเป็นล้านครั้ง (ตัวอย่าง crown / queen)"],
    ["wordemb", "CBOW หน้าต่าง 3, fox + over → jumps, weight กลายเป็นตาราง, skip-gram"],
    ["sofar", "สุ่ม → ทาย → error → gradient → ปรับ, Word2Vec 3 ล้านคำ × 300, king–queen 0.651"]],
  mount(ui) {
    const st = { E: copy(START), trail: Object.fromEntries(WORDS.map((w) => [w, [START[w]]])), steps: 0 };
    const run = (k) => { for (let i = 0; i < k; i++) { pass(st.E); st.steps++; WORDS.forEach((w) => st.trail[w].push(st.E[w])); } };
    const restart = (E) => { st.E = E; st.steps = 0; st.trail = Object.fromEntries(WORDS.map((w) => [w, [E[w]]])); };
    ui.buttons("ฝึก (ทุกหน้าต่าง 1 ครั้ง = 1 รอบ)", [["ฝึก 1 รอบ", () => run(1)], ["ฝึก 10 รอบ", () => run(10)]]);
    ui.buttons("ค่าเริ่มต้น", [
      ["เริ่มใหม่ (Random)", () => restart(Object.fromEntries(WORDS.map((w) => [w, randRow()])))],
      ["ค่าเริ่มต้นตามโค้ด", () => restart(copy(START))],
    ]);
    return {
      draw(s) {
        s.grid(); s.axes();
        for (const [k, v] of Object.entries(CTX)) s.point(v, s.c.muted, k, { r: 4 });
        WORDS.forEach((w) => {
          const col = w === "cat" || w === "dog" ? s.c.a : s.c.b;
          s.polyline(st.trail[w], col, { dash: [3, 4], width: 1.2 });
          s.point(st.E[w], col, "", { r: 6.5 });
          s.label(st.E[w], w, col, { dx: 10, dy: w === "dog" || w === "bus" ? 16 : -2 });   // partners end up together: keep both names readable
        });
      },
      live() {
        const [l, w, r] = WINDOWS[0], c = mean([CTX[l], CTX[r]]), e = st.E[w];
        const next = add(e, scale(sub(c, e), ETA));
        const pairs = [["cat", "dog"], ["car", "bus"], ["cat", "car"]];
        const rows = pairs.map(([a, b]) => `<tr><td>${a} กับ ${b}</td><td>${fmt(cosine(st.E[a], st.E[b]))}</td><td class="dim">${a === "cat" && b === "car" ? "คนละบริบท" : "บริบทเดียวกัน"}</td></tr>`).join("");
        const err = sub(c, e);
        return M.math(M.t("error"), M.o("="), tup(c), M.o("−"), tup(e), M.o("="), tup(err)) +
          M.math(M.sub(M.v("e"), M.t("cat")), M.o("←"), tup(e), M.o("+"), M.n(ETA), M.o("×"), tup(err), M.o("="), M.row(`<mrow class="res">${tup(next)}</mrow>`)) +
          `<p class="verdict">ฝึกไปแล้ว <b>${st.steps}</b> รอบ · หน้าต่าง "pet cat sleeps": c = ค่าเฉลี่ยของ pet กับ sleeps = ${f2(c)}</p>` +
          `<p class="fintro">cosine ระหว่างแถวตอนนี้:</p><div class="scroll"><table class="rank"><thead><tr><th>คู่</th><th>cosine</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` +
          `<p class="ctl-note">ประโยคฝึก: pet cat sleeps · pet dog sleeps · drive car fast · drive bus fast</p>`;
      },
    };
  },
};
