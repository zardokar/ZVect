import { dot, fmt } from "../../lib/zvect.js";
import { M, AX } from "../js/kit.js";

// 7.2 Attention starts with query · key (WIP202610026): one idea only — the attention score of a key is a dot
// product with the query; the key with the bigger score gets more attention. Vectors from the SH AI Academy slide
// (~3:44). The slide's printed results 0.69 / 0.15 are wrong; recomputed 0.70 / 0.23 (same as lesson 2.2).
const KEYS = [{ id: "k₁", v: [0.2, 0.7, 0.4] }, { id: "k₂", v: [0.9, 0.1, 0.2] }];
const S = 4;
const up = (v) => v.map((x) => x * S);
const r2 = (x) => Math.round(x * 100) / 100;

export default {
  slug: "attention",
  title: "Attention: ให้คะแนนด้วย query · key",
  en: "Attention: query · key",
  example: "26_attention",
  axisNames: ["dim 1", "dim 2", "dim 3"],
  view: { dist: 12.5, yaw: 0.6 },
  intro: `
    <p>ใน Transformer (โมเดลแบบ GPT) ชั้น <b>attention</b> ทำให้คำรู้บริบทของประโยค ส่วนหนึ่งของมันคือการให้คะแนนด้วย <b>dot product</b> (บท 2.2)</p>
    <p>เอา <b>query</b> หนึ่งตัวไป dot กับ <b>key</b> ทุกตัว key ที่ได้คะแนนมากกว่า ได้รับความสนใจมากกว่า</p>`,
  try: [
    "เริ่มต้น (ตามสไลด์): q · k₁ = 0.70 มากกว่า q · k₂ = 0.23 → k₁ ได้ความสนใจมากกว่า",
    "เลื่อน query ไปทางแกน dim 1: คะแนนของ k₂ แซงขึ้นมา",
    "ลดทุกช่องของ query ลงครึ่งหนึ่ง: คะแนนลดลงครึ่งหนึ่งทั้งคู่ แต่ลำดับเท่าเดิม",
  ],
  steps: [
    ["ให้คะแนน key หนึ่งตัว", "dot ของ query กับ key"],
    ["เทียบทุก key", "ทำขั้นตอน 1 กับทุก key แล้วดูว่าใครได้คะแนนมากสุด = ได้รับความสนใจมากสุด"],
  ],
  lines: [
    [M.math(M.sub(M.t("score"), M.i("j")), M.o("="), M.v("q"), M.o("·"), M.sub(M.v("k"), M.i("j")), M.o("="),
      M.sum(M.row(M.i("i"), M.o("="), M.n(1)), M.i("d")), M.sub(M.i("q"), M.i("i")), M.sub(M.i("k"), M.row(M.i("j"), M.o(","), M.i("i")))),
      "ให้คะแนน key ตัวที่ j · <b>q</b> = query · <b>k</b><sub>j</sub> = key ตัวที่ j · i = เลขช่อง (1 ถึง d) · คูณช่องที่ตรงกันแล้วบวก = dot (บท 2.2) · ไม่หารด้วยความยาว ต่างจาก cosine"],
    [M.math(M.t("most attention"), M.o("="), M.t("highest\u00a0"), M.sub(M.t("score"), M.i("j"))),
      "ทำขั้นตอน 1 กับทุก key แล้วเทียบ · คะแนนมาก = ได้รับความสนใจมาก · บทนี้มี key สองตัว (k₁, k₂)"],
  ],
  formulaFrom: "เวกเตอร์ query (0.1, 0.8, 0.3), key₁ (0.2, 0.7, 0.4), key₂ (0.9, 0.1, 0.2) และคำว่า attention ใช้ query · key มาจากสไลด์ของคลิป SH AI Academy (~3:44) · <b>สไลด์พิมพ์ผลไว้ 0.69 และ 0.15 ซึ่งผิด</b> คำนวณใหม่ได้ 0.70 และ 0.23 (ลำดับเหมือนเดิม) ตรงกับเรื่องเสริมในบท 2.2",
  symbols: [
    ["q", "query: เวกเตอร์ที่เอาไปถาม", "ลากด้วยแถบเลื่อน"],
    ["k<sub>j</sub>", "key ตัวที่ j", "k₁ = (0.2, 0.7, 0.4), k₂ = (0.9, 0.1, 0.2)"],
    ["i", "เลขช่องของเวกเตอร์", "บทนี้ d = 3 ช่อง"],
    ["score<sub>j</sub>", "คะแนนของ key ตัวที่ j = q · k<sub>j</sub>", "มาก = สนใจมาก"],
    ["∑", "บวกทุกช่อง", "q₁k₁ + q₂k₂ + q₃k₃"],
  ],
  notes: `
    <h2>จากแหล่งที่อ่าน</h2>
    <ul>
      <li>SH AI Academy: dot product ใช้มากใน attention ของ Transformer (query · key) · ตัวอย่างบนสไลด์ key₁ ได้คะแนนมากกว่า key₂
        (สไลด์พิมพ์ 0.69 กับ 0.15 แต่ค่าจริงคือ 0.70 กับ 0.23)</li>
      <li>SH AI Academy: dot คำนวณเร็วที่สุดในสามแบบ (คูณแล้วบวก ไม่มีถอดราก ไม่มีหาร)</li>
      <li>Under The Hood: attention เป็นชั้นแรกของ decoder block ถูกเรียกว่าหัวใจของ LLM · embedding ให้ความหมายของคำ ส่วน attention ให้บริบท</li>
      <li>SOFAR: ลำดับใน GPT คือ embedding → positional embedding → contextual embedding → self-attention</li>
    </ul>
    <h2>ที่แหล่งยังไม่ได้อธิบาย</h2>
    <p>คลิปที่อ่านไม่ได้บอกว่า query กับ key คำนวณมาจากแถว x ของบท 7.1 อย่างไร และหลังได้คะแนนแล้วทำอะไรต่อ
    บทนี้จึงดูแค่ส่วนนี้: ให้คะแนนด้วย dot แล้วดูว่า key ไหนได้มากสุด (Under The Hood บอกว่าเรื่อง attention อยู่ในคลิปถัดไปของเขา ซึ่งยังไม่ได้อ่าน)</p>`,
  refs: [["metrics", "attention = query · key, เวกเตอร์บนสไลด์ (~3:44), ผลบนสไลด์ผิด (0.69/0.15 → 0.70/0.23), dot คำนวณเร็วสุด"],
    ["wordemb", "attention คือชั้นแรกของ decoder block, ให้บริบท"], ["sofar", "ลำดับขั้นใน GPT ถึง self-attention"]],
  mount(ui) {
    const q = ui.vec3("query q", [0.1, 0.8, 0.3], { min: 0, max: 1, step: 0.05 });
    ui.buttons("ตั้ง query", [
      ["ตามสไลด์ (0.1, 0.8, 0.3)", () => ui.setVec(q, [0.1, 0.8, 0.3])],
      ["ไปทาง dim 1 (0.9, 0.2, 0.1)", () => ui.setVec(q, [0.9, 0.2, 0.1])],
      ["ครึ่งหนึ่ง (0.05, 0.4, 0.15)", () => ui.setVec(q, [0.05, 0.4, 0.15])],
    ]);
    const scores = () => KEYS.map((k) => ({ ...k, s: dot(q, k.v) }));
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        const sc = scores(), best = sc[0].s >= sc[1].s ? 0 : 1;
        sc.forEach((k, j) => s.arrow([0, 0, 0], up(k.v), j === best ? s.c.r : s.c.b, `${k.id}  ${fmt(k.s)}`));
        s.arrow([0, 0, 0], up(q), s.c.a, "q");
      },
      live() {
        const sc = scores(), best = sc[0].s === sc[1].s ? -1 : sc[0].s > sc[1].s ? 0 : 1;
        const line = (k) => M.math(M.v("q"), M.o("·"), M.t(k.id), M.o("="),
          ...q.flatMap((x, i) => [i ? M.o("+") : "", M.row(M.n(r2(x), AX[i]), M.o("×"), M.n(k.v[i]))]), M.o("="), M.n(fmt(k.s), "res"));
        const rows = sc.map((k, j) => `<tr class="${j === best ? "win" : ""}"><td>${k.id}</td><td>(${k.v.join(", ")})</td><td>${fmt(k.s)}</td><td class="dim">${j === best ? "สนใจมากกว่า" : ""}</td></tr>`).join("");
        return line(sc[best < 0 ? 0 : best]) +
          `<p class="fintro">ขั้นตอน 2: เทียบทุก key</p><div class="scroll"><table class="rank"><thead><tr><th>key</th><th>เวกเตอร์</th><th>score</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` +
          `<p class="ctl-note">${best < 0 ? "คะแนนเท่ากัน" : `${sc[best].id} ได้ความสนใจมากกว่า`}</p>`;
      },
    };
  },
};
