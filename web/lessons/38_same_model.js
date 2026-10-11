import { add, sub, scale, mean, cosine, topK, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// Same model for the question and the documents (WIP202610041): one idea only — a vector means something only inside the
// model that made it. Two tables trained with the same rule from different random starts both learn "cat is near dog",
// but cat-in-A and cat-in-B are unrelated, so comparing across models is meaningless. Same data and training as
// examples/*/38_same_model.* (rule of {#learn-table}, context rows random too; seeds 16 / 18 chosen by me to show it clearly).
const WINDOWS = [["pet", "cat", "sleeps"], ["pet", "dog", "sleeps"], ["drive", "car", "fast"], ["drive", "bus", "fast"]];
const CTX_WORDS = ["pet", "sleeps", "drive", "fast"];
const VOCAB = ["cat", "dog", "car", "bus"];
const GROUP = { cat: "สัตว์", dog: "สัตว์", car: "รถ", bus: "รถ" };
const ETA = 0.3, PASSES = 5, SEED_A = 16, SEED_B = 18;

// a tiny repeatable random (minstd), the same as the examples: x = x * 48271 mod (2^31 - 1)
function train(seed) {
  const next = () => (seed = (seed * 48271) % 2147483647);
  for (let i = 0; i < 10; i++) next();                                // the first numbers after a small seed are tiny
  const row = () => [0, 0, 0].map(() => ((next() % 17) - 8) / 2);     // -4 .. 4 in steps of 0.5
  const ctx = {}, E = {};
  for (const w of CTX_WORDS) ctx[w] = row();
  for (const w of VOCAB) E[w] = row();
  for (let p = 0; p < PASSES; p++)
    for (const [l, w, r] of WINDOWS) {
      const c = mean([ctx[l], ctx[r]]);
      E[w] = add(E[w], scale(sub(c, E[w]), ETA));
    }
  return E;
}

// B "groups its words" = partners are close (cos > 0.9) and each word's nearest other word is its partner
const grouped = (E) => cosine(E.cat, E.dog) > 0.9 && cosine(E.car, E.bus) > 0.9 &&
  VOCAB.every((w, i) => VOCAB.filter((x) => x !== w).every((x) => x === VOCAB[i ^ 1] || cosine(E[w], E[x]) < cosine(E[w], E[VOCAB[i ^ 1]])));
const ET = (m) => M.sub(M.v("E"), M.i(m));
const at = (w) => M.row(M.o("["), M.t(w), M.o("]"));
const tup = (v) => M.tuple(v.map((x) => M.n(fmt(x).replace("-", "−"))));
const num = (x) => M.n(fmt(x).replace("-", "−"));

export default {
  slug: "same-model",
  title: "ต้องใช้ model เดียวกันทั้งคำถามและเอกสาร",
  en: "Same model for query and documents",
  example: "38_same_model",
  view: { dist: 12, yaw: 0.7 },
  intro: `
    <p>ระบบถาม-ตอบเก็บเอกสารเป็นเวกเตอร์ไว้ก่อน พอมีคำถามก็แปลงคำถามเป็นเวกเตอร์ <b>ด้วย embedding model ตัวเดียวกัน</b> แล้วหาเอกสารที่ใกล้ที่สุด</p>
    <p>ทำไมต้องตัวเดียวกัน: ตารางของทุก model <b>เริ่มจากเลขสุ่ม</b> แล้วค่อยฝึก (บท {#learn-table}) สอง model ที่ฝึกแบบเดียวกันจึงรู้เหมือนกันว่า cat ใกล้ dog
      แต่ <b>เขียนด้วยพิกัดคนละชุด</b> cat ของ model A กับ cat ของ model B จึงไม่เกี่ยวกันเลย เอามาเทียบกันก็ไม่มีความหมาย (เหตุผลข้อนี้: ผู้จัดทำ / ความรู้ทั่วไป)</p>
    <p class="fine">ภาพนี้ย่อให้ง่าย: เอกสารแต่ละชิ้นเป็นคำเดียว · ตาราง A และ B ผู้จัดทำฝึกเองด้วยกติกาของบท {#learn-table} 5 รอบ ต่างกันแค่เลขสุ่มตอนเริ่ม · ตัวเลข −0.968 เป็นกรณีที่ผู้จัดทำเลือกให้เห็นชัด ถ้าสุ่มใหม่จะได้ค่าอะไรก็ได้</p>`,
  try: [
    "เริ่มที่ คำถาม = A และ เอกสาร = A: อันดับ 1 คือ cat (1.000 = ตัวมันเอง) และ <b>อันดับ 2 คือ dog (0.995)</b> คำกลุ่มเดียวกันจริง",
    "เปลี่ยน \"model ที่แปลงคำถาม\" เป็น B: cat ของ B ชี้ไปอีกทาง อันดับ 1 กลายเป็น bus และ cat ตกไปท้ายสุด (−0.968)",
    "เปลี่ยนเอกสารเป็น B ด้วย: ใช้ B ทั้งคู่ก็ถูกอีกครั้ง ลองคำอื่น (dog, car, bus): ใช้ model เดียวกัน อันดับ 2 เป็นคู่ของมันเสมอ",
    "กด \"สุ่มจุดเริ่มของ B ใหม่\": B ได้พิกัดใหม่ ภายใน B ยังจัดกลุ่มถูก (ผู้จัดทำสุ่มซ้ำจนกว่า B จัดกลุ่มได้) แต่ผลข้าม model เปลี่ยนไปเรื่อย ๆ บางครั้งบังเอิญถูก ก็ยังเป็นแค่ความบังเอิญ",
  ],
  stepsWhy: "3 ขั้นตอน = การค้นหนึ่งครั้งตามคลิป Colin Talks Tech (คลิปวัดด้วยระยะ บทนี้ใช้ cosine) · ขั้นตอน 1 กับ 2 ต้องใช้ตาราง E ตัวเดียวกัน",
  steps: [
    ["แปลงเอกสาร", "เปิดแถวของเอกสารแต่ละชิ้นในตารางของ model ที่ใช้เก็บ ทำครั้งเดียวตอนเก็บเข้าคลัง"],
    ["แปลงคำถาม", "เปิดแถวของคำถามในตารางของ model ที่ใช้แปลงคำถาม ต้องเป็นตารางเดียวกับขั้นตอน 1"],
    ["หาเอกสารที่ใกล้ที่สุด", "ให้คะแนนทุกชิ้นด้วย cosine (บท {#cosine}) แล้วเลือกชิ้นที่คะแนนสูงสุด"],
  ],
  lines: [
    [M.math(M.sub(M.v("d"), M.i("i")), M.o("="), M.sub(M.v("E"), M.t("docs")), at("doc i")),
      "แปลงเอกสาร · <b>E</b><sub>docs</sub> = ตารางของ model ที่ใช้เก็บเอกสาร · [doc i] = เปิดแถวของเอกสารชิ้นที่ i (บท {#embedding-matrix}) · <b>d</b><sub>i</sub> = เวกเตอร์ที่เก็บไว้"],
    [M.math(M.v("q"), M.o("="), M.sub(M.v("E"), M.t("query")), at("w")),
      "แปลงคำถาม · w = คำที่ค้น · <b>E</b><sub>query</sub> = ตารางของ model ที่ใช้แปลงคำถาม · <b>ต้องเป็นตารางเดียวกับ E</b><sub>docs</sub> เพราะพิกัดของแต่ละ model มีความหมายเฉพาะในตารางของมันเอง"],
    [M.math(M.t("top-1"), M.o("="), M.t("the d "), M.i("i"), M.t(" with the largest "), M.fn("cos"), M.row(M.o("("), M.v("q"), M.o(","), M.sub(M.v("d"), M.i("i")), M.o(")"))),
      "หาเอกสารที่ใกล้ที่สุด · cos = cosine (บท {#cosine}) · ถ้า <b>q</b> กับ <b>d</b> มาจากคนละตาราง คะแนนยังคำนวณได้ แต่ตัวเลขไม่ได้บอกความใกล้ของความหมาย"],
  ],
  formulaFrom: "ขั้นตอน เก็บเอกสารด้วย model → แปลงคำถามด้วย model เดียวกัน → หาเวกเตอร์ที่ใกล้ที่สุด มาจากคลิป Colin Talks Tech (~5:25) · cosine จากบท {#cosine} · " +
    "ตาราง A และ B ฝึกด้วยกติกาย่อของบท {#learn-table} (<b>ผู้จัดทำเลือก</b>: แถวบริบทเริ่มสุ่มแล้วตรึงไว้ เหมือนบท {#learn-table} ตรึงแถวบริบท, ฝึก 5 รอบ, seed 16 และ 18 เลือกให้เห็นผลชัด, ปุ่มสุ่มจะสุ่มซ้ำจนกว่า B จัดกลุ่มได้) · คำและตัวเลขในภาพผู้จัดทำแต่งเอง",
  symbols: [
    ["E<sub>A</sub>, E<sub>B</sub>", "ตาราง embedding ของ model A และ model B", "ฝึกแบบเดียวกัน ต่างกันแค่เลขสุ่มตอนเริ่ม"],
    ["E<sub>docs</sub>", "ตารางที่ใช้แปลงเอกสารตอนเก็บ", "เลือกใน \"model ที่แปลงเอกสาร\""],
    ["E<sub>query</sub>", "ตารางที่ใช้แปลงคำถาม", "ต้องเป็นตัวเดียวกับ E<sub>docs</sub>"],
    ["w", "คำที่ค้น", "cat, dog, car, bus"],
    ["q", "เวกเตอร์ของคำถาม", "ลูกศรหนาในภาพ"],
    ["d<sub>i</sub>", "เวกเตอร์ของเอกสารชิ้นที่ i", "4 ชิ้น: cat, dog, car, bus"],
    ["cos(q, d<sub>i</sub>)", "คะแนนความใกล้ของทิศ", "1 = ทิศเดียวกัน · −1 = ตรงข้าม"],
    ["top-1", "เอกสารที่ได้คะแนนสูงสุด", "วงสีม่วงในภาพ"],
  ],
  notes: `
    <h2>ทำไมต้องใช้ model เดียวกัน</h2>
    <ul>
      <li>Colin Talks Tech: ระบบถาม-ตอบแปลงข้อมูลทั้งหมดเป็น embedding ก่อน แล้วแปลงคำถาม (เช่น "how do I open a support ticket?") <b>ด้วย embedding model ตัวเดียวกัน</b>
        จากนั้น vector database หา embedding ที่ใกล้ที่สุดแล้วส่งกลับ</li>
      <li>BlackBoard AI: ตาราง embedding เริ่มเป็นเลขสุ่มเล็ก ๆ แล้วฝึกด้วยการทาย → วัดความผิด → ปรับทีละนิด ซ้ำเป็นล้านครั้ง ตัวเลขในตารางจึงมาจากการฝึก ไม่มีใครเขียนเอง</li>
      <li>SOFAR: เริ่มจาก weight สุ่ม → ทาย → error → gradient → ปรับ · จะโหลด Word2Vec ที่ฝึกแล้วมาใช้ หรือฝึกตารางของตัวเองก็ได้
        · คำที่ model ไม่เคยเห็นไม่มีแถวในตาราง (Bill_Gates → KeyError)</li>
      <li>Under The Hood: เรากำหนดเองไม่ได้ว่าแต่ละมิติของ embedding หมายถึงอะไร ขึ้นกับข้อมูลที่ใช้ฝึก</li>
      <li>Byte Goose AI: แต่ละ model มีขนาดเวกเตอร์ไม่เท่ากัน เช่น text-embedding-005 มี 768 มิติ, gemini-embedding-001 สูงสุด 3072 มิติ · EmbeddingGemma (300M) ก็เป็น embedding model อีกตัวหนึ่ง</li>
      <li>Qdrant (Andrey Vasnetsov): การ embed ข้อมูลใหม่ทั้งหมดเมื่อเปลี่ยน encoder เป็นเรื่องปกติ ผู้พูดจึงแนะนำว่าไม่ควรใช้ vector search engine เป็นที่เก็บข้อมูลหลัก</li>
    </ul>
    <h2>ผลที่ตามมา (ผู้จัดทำ / ความรู้ทั่วไป)</h2>
    <ul>
      <li>เปลี่ยน model = ต้องแปลงเอกสารทั้งคลังใหม่ด้วย model ใหม่ ใช้เวกเตอร์เก่าปนกับใหม่ไม่ได้</li>
      <li>ถ้าจำนวนมิติไม่เท่ากัน (เช่น 768 กับ 3072) เทียบกันไม่ได้เลย zvect จะแจ้ง size mismatch · ถ้ามิติเท่ากันจะคำนวณได้ แต่ได้ตัวเลขที่ไม่มีความหมาย แบบในภาพนี้</li>
      <li>เปรียบเทียบ: สองคนวาดแผนที่เมืองเดียวกันคนละแผ่น เลือกจุดเริ่มและทิศของแกนไม่เหมือนกัน ทั้งสองแผ่นถูกเรื่องว่าร้านไหนอยู่ใกล้ร้านไหน แต่เอาพิกัดจากแผ่นหนึ่งไปจิ้มอีกแผ่นจะไปผิดที่</li>
      <li>nomic-embed ไม่อยู่ในแหล่งที่ใช้ทำบทเรียนนี้ (ความรู้ทั่วไป: เป็น embedding model อีกตัวหนึ่ง ใช้กฎเดียวกัน)</li>
    </ul>
    <h2>ขั้นตอนข้างใน embedding model โดยย่อ</h2>
    <ol>
      <li>ตัดข้อความเป็น token แล้วเปิดคลังหาเลข (บท {#tokenize})</li>
      <li>เปิดแถวของแต่ละ token ในตาราง (บท {#embedding-matrix}, BlackBoard AI)</li>
      <li>model แบบ transformer ปรับเวกเตอร์ของแต่ละ token ตามคำรอบข้าง (SOFAR: tokenization → vector embedding → positional → contextual → self-attention;
        Byte Goose AI: word2vec ให้ "bank" มีพิกัดเดียวเสมอ ส่วน transformer ดูบริบท)</li>
      <li>รวมหลาย token เป็นเวกเตอร์เดียว แล้วมักปรับให้ยาว 1 (ความรู้ทั่วไป)</li>
    </ol>
    <p>ทุกขั้นใช้ตัวเลขที่ model ตัวนั้นฝึกมาเอง เวกเตอร์ที่ได้จึงอ่านได้เฉพาะในระบบพิกัดของ model ตัวนั้น (ผู้จัดทำ / ความรู้ทั่วไป)</p>`,
  refs: [
    ["beginner", "ระบบถาม-ตอบ: embed เอกสารก่อน แล้ว embed คำถามด้วย model ตัวเดียวกัน (~5:25)"],
    ["blackboard", "ตารางเริ่มจากเลขสุ่มเล็ก ๆ แล้วฝึก, หาแถวด้วยการเปิดตาราง"],
    ["sofar", "เริ่มสุ่ม → ทาย → error → ปรับ, Word2Vec ที่ฝึกแล้ว vs ฝึกเอง, คำนอกคลังไม่มีแถว, ขั้นตอนใน GPT"],
    ["wordemb", "ความหมายของแต่ละมิติกำหนดเองไม่ได้ ขึ้นกับข้อมูลที่ฝึก"],
    ["choose", "768 vs 3072 มิติ, EmbeddingGemma, word2vec (\"bank\" พิกัดเดียว) vs transformer"],
    ["qdrant", "เปลี่ยน encoder แล้ว embed ใหม่ทั้งหมดเป็นเรื่องปกติ"],
  ],
  mount(ui) {
    const st = { w: "cat", q: "A", d: "A", seedB: SEED_B };
    const model = { A: train(SEED_A), B: train(SEED_B) };
    const rank = () => topK(model[st.q][st.w], VOCAB.map((w) => ({ id: w, v: model[st.d][w] })), VOCAB.length);
    ui.choice("คำที่ค้น (w)", VOCAB.map((w) => [w, w]), st, "w");
    ui.choice("model ที่แปลงคำถาม", [["A", "model A"], ["B", "model B"]], st, "q");
    ui.choice("model ที่แปลงเอกสาร", [["A", "model A"], ["B", "model B"]], st, "d");
    ui.buttons("จุดเริ่มสุ่มของ model B", [
      ["สุ่มจุดเริ่มของ B ใหม่", () => {
        // 5 passes are not always enough: draw again until B groups its words (cat~dog, car~bus) like the code's B does
        do { st.seedB = 1 + Math.floor(Math.random() * 2147483645); model.B = train(st.seedB); }
        while (st.seedB === SEED_B || !grouped(model.B));
      }],
      ["B ตามโค้ด (seed 18)", () => { st.seedB = SEED_B; model.B = train(SEED_B); }],
    ], { pressed: () => (st.seedB === SEED_B ? 1 : 0) });
    ui.note("สีชมพู = model A · สีเหลือง = model B · ลูกศรหนา = คำถาม · ลูกศรบาง = เอกสาร · วงสีม่วง = อันดับ 1");
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        const col = { A: s.c.a, B: s.c.b };
        const top = rank()[0].id;
        for (const m of ["A", "B"]) {
          const docs = m === st.d, E = model[m];
          VOCAB.forEach((w, i) => {
            const p = E[w], mate = E[VOCAB[i ^ 1]];          // partners (cat/dog, car/bus) end up close: the higher one is labelled above
            if (docs) s.arrow([0, 0, 0], p, col[m], "", { width: 1.4 });
            s.point(p, col[m], "", { r: docs ? 6 : 4 });
            s.label(p, w + "·" + m, col[m], { dx: 10, dy: p[1] >= mate[1] ? -4 : 16, size: docs ? 13 : 11, weight: docs ? 700 : 500 });
          });
        }
        const q = model[st.q][st.w], d1 = model[st.d][top];
        s.arrow([0, 0, 0], q, col[st.q], "", { width: 3.5, layer: 2 });
        s.point(d1, s.c.r, "", { r: 10, ring: true, layer: 2 });
        s.line(q, d1, s.c.r, { dash: [4, 4], width: 1.5, layer: 2 });
        s.label(scale(q, 0.5), "q", col[st.q], { dx: -18, dy: 4, size: 15, weight: 800 });
      },
      live() {
        const r = rank(), top = r[0].id, same = st.q === st.d, right = top === st.w;
        const q = model[st.q][st.w];
        const rows = r.map((x, i) => {
          const note = x.id === st.w ? "คำเดียวกับคำถาม" : GROUP[x.id] === GROUP[st.w] ? "กลุ่มเดียวกัน (" + GROUP[x.id] + ")" : "คนละกลุ่ม (" + GROUP[x.id] + ")";
          return `<tr${i === 0 ? ' class="win"' : ""}><td>${i + 1}</td><td>${x.id}·${st.d}</td><td>${fmt(x.score)}</td><td class="dim">${note}</td></tr>`;
        }).join("");
        const inside = (m) => fmt(cosine(model[m].cat, model[m].dog));
        const cross = (m) => cosine(model[m][st.w], model[st.d][st.w]);
        const cosLine = (m) => M.math(M.fn("cos"), M.row(M.o("("), ET(m), at(st.w), M.o(","), ET(st.d), at(st.w), M.o(")")), M.o("="),
          m === st.q ? M.row(`<mrow class="res">${num(cross(m))}</mrow>`) : num(cross(m)));
        return M.math(M.v("q"), M.o("="), ET(st.q), at(st.w), M.o("="), tup(q)) +
          `<p class="fintro">คำเดียวกัน (${st.w}) จากสอง model เทียบกับเอกสาร ${st.w} ที่เก็บด้วย model ${st.d}:</p>` + cosLine("A") + cosLine("B") +
          `<p class="verdict">${same
            ? `คำถามและเอกสารใช้ model ${st.q} ทั้งคู่ → อันดับ 1 คือ <b>${top}</b> ถูกต้อง`
            : `คำถามใช้ model ${st.q} แต่เอกสารใช้ model ${st.d} → อันดับ 1 คือ <b>${top}</b> ${right ? "(ถูกโดยบังเอิญ)" : "ผิด"} · เทียบข้าม model ไม่มีความหมาย`}</p>` +
          `<p class="fintro">เอกสาร 4 ชิ้น (แปลงด้วย model ${st.d}) เรียงตาม cos กับ q:</p><div class="scroll"><table class="rank"><thead><tr><th>อันดับ</th><th>เอกสาร</th><th>cos</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` +
          `<p class="ctl-note">ภายใน model A: cos(cat, dog) = ${inside("A")} · ภายใน model B: cos(cat, dog) = ${inside("B")} · ทั้งสอง model รู้ว่า cat ใกล้ dog แต่เขียนด้วยพิกัดคนละชุด</p>`;
      },
    };
  },
};
