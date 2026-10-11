import { add } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// 7.1 Vectors in an LLM (WIP202610026): one idea only — the model's input is one row per token (n × d),
// and a position vector is added to each row so word order shows. Sentence and IDs from the Under The Hood clip;
// the 3-number rows and position vectors are made up (my choice) so they can be drawn.
const IDS = { The: 791, cat: 8415, sat: 7731, on: 389, a: 264, mat: 5634 };
const E = { The: [0.1, 0.1, 0.1], cat: [0.9, 0.8, 0.0], sat: [0.2, 0.1, 0.9], on: [0.1, 0.4, 0.3], a: [0.1, 0.0, 0.2], mat: [0.3, 0.9, 0.2] };
const P = [[0.0, 0.3, 0.0], [0.3, 0.0, 0.0], [0.0, 0.0, 0.3], [0.3, 0.3, 0.0], [0.0, 0.3, 0.3], [0.3, 0.0, 0.3]];
const ORDER = ["The", "cat", "sat", "on", "a", "mat"];
const SWAP = ["The", "mat", "sat", "on", "a", "cat"];
const S = 3;
const up = (v) => v.map((x) => x * S);
const f2 = (v) => "(" + v.map((x) => x.toFixed(1)).join(", ") + ")";
const tup = (v, c = "") => M.tuple(v.map((x) => M.n(x.toFixed(1), c)));

export default {
  slug: "llm-input",
  title: "เวกเตอร์ใน LLM: แถวละ token แล้วบวกตำแหน่ง",
  en: "LLM input: embedding + position",
  example: "25_llm_input",
  axisNames: ["dim 1", "dim 2", "dim 3"],
  view: { dist: 13, yaw: 0.75 },
  intro: `
    <p>ก่อนเข้า LLM ประโยคถูกตัดเป็น token แล้วหยิบแถวจากตาราง embedding (บท 3.4) มาเรียง <b>แถวละ token</b>:
    6 token ได้ตาราง 6 × d (บท 1.5)</p>
    <p>LLM อ่านทุก token พร้อมกัน จึงต้อง <b>บวกเวกเตอร์ตำแหน่ง</b> (positional encoding) เข้าไปในแต่ละแถว ไม่งั้นจะไม่รู้ว่าคำไหนมาก่อน</p>`,
  try: [
    "กด \"แถวถัดไป\": ลูกศรสั้น ๆ คือเวกเตอร์ตำแหน่งที่บวกเข้าไป จุดจึงขยับจากแถวเดิมนิดหน่อย",
    "เลือก \"ไม่บวกตำแหน่ง\" แล้วกด \"สลับ cat กับ mat\": ตารางมีแถวชุดเดิมทุกแถว แค่สลับที่ ลำดับคำจึงหายไป",
    "เลือก \"บวกตำแหน่ง\" แล้วสลับอีกครั้ง: แถวของ cat เปลี่ยนตามตำแหน่งที่มันอยู่",
  ],
  linesIntro: "มี 2 บรรทัด: บรรทัด 1 เปลี่ยนประโยคเป็นตาราง · บรรทัด 2 บวกตำแหน่งเข้าไปทีละแถว",
  lines: [
    [M.math(M.v("X"), M.o("="), M.mat([[M.sub(M.v("e"), M.sub(M.i("t"), M.n(1)))], [M.o("⋮")], [M.sub(M.v("e"), M.sub(M.i("t"), M.i("n")))]]), M.t("\u2003("), M.i("n"), M.o("×"), M.i("d"), M.t(")")),
      "เรียงแถวของทุก token · t<sub>1</sub> … t<sub>n</sub> = token ในประโยคตามลำดับ · <b>e</b><sub>t</sub> = แถวของ token t ในตาราง embedding · n = จำนวน token (6) · d = จำนวนมิติ (บทนี้ 3)"],
    [M.math(M.sub(M.v("x"), M.i("i")), M.o("="), M.sub(M.v("e"), M.sub(M.i("t"), M.i("i"))), M.o("+"), M.sub(M.v("p"), M.i("i"))),
      "บวกตำแหน่งให้แถวที่ i · i = ตำแหน่งในประโยค (1 = คำแรก) · <b>p</b><sub>i</sub> = เวกเตอร์ของตำแหน่ง i (ขนาด d เท่ากัน) · <b>x</b><sub>i</sub> = แถวที่ส่งต่อเข้า attention (บท 7.2) · ขนาดตารางยังเป็น n × d เท่าเดิม แค่ค่าขยับนิดหน่อย"],
  ],
  formulaFrom: "ประโยค \"The cat sat on a mat\", ID 791, 8415, 7731, 389, 264, 5634, ตาราง 6 × d และการบวกเวกเตอร์ตำแหน่ง (ขนาดไม่เปลี่ยน) มาจากคลิป Under The Hood · ตัวเลข 3 ตัวของแต่ละแถวและของแต่ละตำแหน่งผู้จัดทำแต่งเอง (ของจริงมีหลายร้อยมิติ และค่าตำแหน่งได้จากการฝึกหรือจากสูตรคงที่)",
  symbols: [
    ["t<sub>i</sub>", "token ตำแหน่งที่ i", "t₂ = cat (ID 8415)"],
    ["e<sub>t</sub>", "แถวของ token t ในตาราง embedding", "หยิบด้วย ID (บท 3.4)"],
    ["X", "ตารางของทั้งประโยค: แถวละ token", "6 × d"],
    ["p<sub>i</sub>", "เวกเตอร์ของตำแหน่ง i", "ลูกศรสั้นในภาพ"],
    ["x<sub>i</sub>", "แถวหลังบวกตำแหน่ง", "จุดสีในภาพ"],
    ["n × d", "แถว × คอลัมน์ (บท 1.5)", "บวกตำแหน่งแล้วขนาดไม่เปลี่ยน"],
  ],
  notes: `
    <h2>Embedding layer ใน LLM</h2>
    <ul>
      <li>Under The Hood: ตัดประโยคเป็น token แล้วชั้น embedding ให้เวกเตอร์หนึ่งตัวต่อ token · "The cat sat on a mat" = 6 token ได้ตาราง 6 × (จำนวนมิติ)</li>
      <li>ชั้นนี้ไม่ใช่ Word2Vec: เป็นชั้นตื้น ๆ ที่ weight ทำหน้าที่เป็นตาราง lookup และ <b>ฝึกไปพร้อมกับทั้งโมเดล</b> (Word2Vec ฝึกแยก)</li>
      <li>SOFAR: ขนาดใน GPT · GPT-1 คำศัพท์ราว 40,000 คำ 768 มิติ · GPT-2 50,257 คำ 768–1,600 มิติ · GPT-3 12,288 มิติ</li>
    </ul>
    <h2>ทำไมต้องบวกตำแหน่ง</h2>
    <ul>
      <li>RNN อ่านทีละคำจึงรู้ลำดับเอง แต่ Transformer อ่านทุกคำพร้อมกัน จึงต้องใส่ตำแหน่งเข้าไปเอง</li>
      <li>เวกเตอร์ตำแหน่งได้มาสองแบบ: เป็นชั้นที่ฝึกได้ หรือเป็นค่าคงที่ที่ไม่ซ้ำกันในแต่ละตำแหน่ง · บวกแล้วขนาดตารางเท่าเดิม ค่าแค่ขยับนิดหน่อย</li>
      <li>SOFAR เรียงลำดับใน GPT: tokenization → vector embedding → positional embedding → contextual embedding → self-attention</li>
    </ul>
    <h2>ยังไม่รู้บริบท</h2>
    <ul>
      <li>แถวที่ได้ตอนนี้ยังเป็นแบบ "หนึ่งคำ หนึ่งแถว" (static) Byte Goose AI ยกตัวอย่าง: ใน Word2Vec คำว่า bank มีพิกัดเดียว ไม่ว่าประโยครอบข้างจะเป็นอะไร</li>
      <li>Under The Hood: embedding ให้ความหมายของคำ แต่ attention เป็นตัวให้บริบท บท 7.2 ดูส่วนหนึ่งของ attention: การให้คะแนนด้วย query · key</li>
    </ul>`,
  refs: [["wordemb", "The cat sat on a mat → 6 × d, ID บนจอ, ชั้น embedding ฝึกพร้อมโมเดล, positional encoding (ฝึกได้หรือคงที่, ขนาดไม่เปลี่ยน)"],
    ["sofar", "ลำดับขั้นใน GPT, ขนาดคำศัพท์และมิติของ GPT-1/2/3"], ["choose", "static (Word2Vec: bank มีพิกัดเดียว) กับ contextual"]],
  mount(ui) {
    const st = { i: 1, pos: "on", order: ORDER };
    ui.buttons("เลือกแถว i", [["← แถวก่อน", () => { st.i = (st.i + 5) % 6; }], ["แถวถัดไป →", () => { st.i = (st.i + 1) % 6; }]]);
    ui.choice("ตำแหน่ง", [["off", "ไม่บวกตำแหน่ง"], ["on", "บวกตำแหน่ง"]], st, "pos");
    ui.buttons("ลำดับคำ", [["สลับ cat กับ mat", () => { st.order = st.order === ORDER ? SWAP : ORDER; }]]);
    const rowOf = (k) => { const t = st.order[k]; return st.pos === "on" ? add(E[t], P[k]) : E[t]; };
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        st.order.forEach((t, k) => {
          const on = k === st.i, col = on ? s.c.a : t === "cat" || t === "mat" ? s.c.b : s.c.ink;
          if (st.pos === "on") {
            s.point(up(E[t]), s.c.muted, "", { r: 3 });
            s.line(up(E[t]), up(rowOf(k)), on ? s.c.r : s.c.muted, { width: on ? 3 : 1.5 });
          }
          s.point(up(rowOf(k)), col, `${k + 1} ${t}`, { r: on ? 7 : 5 });
        });
      },
      live() {
        const k = st.i, t = st.order[k], e = E[t], x = rowOf(k);
        const rows = st.order.map((w, j) => `<tr class="${j === k ? "win" : ""}"><td>${j + 1}</td><td>${w}</td><td class="dim">${IDS[w]}</td><td>${f2(rowOf(j))}</td></tr>`).join("");
        const math = st.pos === "on"
          ? M.math(M.sub(M.v("x"), M.n(k + 1)), M.o("="), tup(e), M.o("+"), tup(P[k]), M.o("="), tup(x, "res"))
          : M.math(M.sub(M.v("x"), M.n(k + 1)), M.o("="), tup(e, "res"));
        const note = st.pos === "on" ? "cat ได้แถวต่างกันเมื่ออยู่คนละตำแหน่ง ลำดับคำจึงยังอยู่ในตาราง"
          : "ไม่บวกตำแหน่ง: สลับคำแล้วได้แถวชุดเดิมทุกแถว ตารางไม่รู้ว่าคำไหนมาก่อน";
        const say = st.pos === "on" ? `x<sub>${k + 1}</sub> = e<sub>${t}</sub> + p<sub>${k + 1}</sub>` : `x<sub>${k + 1}</sub> = e<sub>${t}</sub> (ไม่บวกตำแหน่ง)`;
        return math + `<p class="verdict">${say} · ประโยค: ${st.order.join(" ")}</p>` +
          `<p class="fintro">บรรทัด 1: ตาราง X (แถวละ token)</p><div class="scroll"><table class="rank"><thead><tr><th>i</th><th>token</th><th>ID</th><th>แถว x<sub>i</sub></th></tr></thead><tbody>${rows}</tbody></table></div>` +
          `<p class="ctl-note">${note}</p>`;
      },
    };
  },
};
