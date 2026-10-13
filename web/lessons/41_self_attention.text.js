// 41_self_attention.text.js — CONSTANTS of lesson 10.2 (self-attention): every text, label and formula line shown to the learner.
// The component (41_self_attention.js) only fills in numbers; sources: docs/aimd (see refs), the rest is labelled ผู้จัดทำ.
import { M } from "../js/kit.js";

function T(x) {
  return M.sup(x, M.i("T"));
}

export const TEXT = {
  intro: `
    <p><b>Self-attention</b> คือหัวใจของ transformer: เวกเตอร์ใหม่ของแต่ละคำ = <b>ผลรวมถ่วงน้ำหนักของทุกคำในประโยค</b> น้ำหนักมาจากว่าคำนั้น "ถาม" ตรงกับที่คำอื่น "มีให้" แค่ไหน</p>
    <p>ทุกคำมีสามเวกเตอร์ <b>query</b> (กำลังมองหาอะไร) <b>key</b> (มีอะไรให้) และ <b>value</b> (สิ่งที่ส่งต่อ) ได้จากการคูณแถวของคำกับเมทริกซ์ W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub> ที่ model เรียนมา
      แล้วรวมทั้งหมดเป็นสูตรเดียว <b>softmax(QK<sup>T</sup> / √d<sub>k</sub>) V</b> ซึ่งคลาส Stanford บอกว่าน่าจะเป็นสูตรที่สำคัญที่สุดของ transformer</p>
    <p class="fine">ภาพนี้ย่อให้ง่าย (ผู้จัดทำ): 5 คำ เวกเตอร์ 3 มิติ ตัวเลขและเมทริกซ์ผู้จัดทำแต่งเอง (W<sub>Q</sub> สลับมิติ 1 กับ 2 ส่วน W<sub>K</sub>, W<sub>V</sub> เป็นเมทริกซ์เอกลักษณ์ ให้ value = แถวเดิม เห็นง่าย) · ของจริงมีหลายร้อยมิติและหลาย head</p>`,
  try: [
    "เลือกคำ \"teddy bear\": น้ำหนักสูงสุดอยู่ที่ cute (0.538) ตามตัวอย่างในคลาส ว่า cute อธิบาย teddy bear ได้ดี · ลูกศรสีชมพู (ผลลัพธ์) จึงเอียงไปทาง cute",
    "เลือกคำ \"cute\": น้ำหนักไปที่ teddy bear (0.600) คำคุณศัพท์กับคำนามหากันเพราะ W<sub>Q</sub> สลับมิติ (ผู้จัดทำออกแบบให้เป็นแบบนี้)",
    "เปลี่ยนเป็น \"ไม่หาร √d\": น้ำหนักแหลมขึ้น teddy bear → cute เป็น 0.759 · คลาส Stanford: หาร √d<sub>k</sub> เพราะ d<sub>k</sub> มีผลต่อความแปรปรวนของคะแนน (ความรู้ทั่วไป: ถ้าไม่หาร มิติใหญ่ทำให้ softmax สุดโต่ง)",
    "เปิด mask (แบบ decoder): แต่ละคำเห็นแค่ตัวเองกับคำก่อนหน้า \"A\" ได้น้ำหนัก 1.000 ที่ตัวเอง · ช่องที่ถูกปิดเป็น 0",
  ],
  stepsWhy: "4 ขั้นตอน = สูตร softmax(QKᵀ/√d_k)V ตามคลาส Stanford CME295 ทีละส่วน",
  steps: [
    ["ฉายเป็น Q, K, V", "คูณตาราง X ของทั้งประโยคกับ W_Q, W_K, W_V ได้ query, key, value ของทุกคำ"],
    ["ให้คะแนนทุกคู่", "QKᵀ เป็นตาราง n × n ช่อง (i, j) = query ของคำ i · key ของคำ j แล้วหารด้วย √d_k"],
    ["softmax ทีละแถว", "แต่ละแถวกลายเป็นน้ำหนักที่รวมกันได้ 1 (ช่องที่ mask ไว้เป็น 0)"],
    ["ผสม value", "แถว i ของผลลัพธ์ = ผลรวมของ value ทุกคำ คูณน้ำหนักในแถว i"],
  ],
  lines: [
    [M.math(M.v("Q"), M.o("="), M.v("X"), M.sub(M.v("W"), M.i("Q")), M.o(","), M.v("K"), M.o("="), M.v("X"), M.sub(M.v("W"), M.i("K")), M.o(","), M.v("V"), M.o("="), M.v("X"), M.sub(M.v("W"), M.i("V"))),
      "ฉาย · <b>X</b> = ตารางของประโยค n × d<sub>model</sub> (แถวละคำ บท {#llm-input}) · <b>W</b> = เมทริกซ์ที่เรียนได้ ขนาด d<sub>model</sub> × d<sub>k</sub> · ได้ Q, K, V ขนาด n × d<sub>k</sub> (ต้องมี d<sub>q</sub> = d<sub>k</sub> จึงคูณกันได้)"],
    [M.math(M.v("S"), M.o("="), M.frac(M.row(M.v("Q"), T(M.v("K"))), M.sqrt(M.sub(M.i("d"), M.i("k"))))),
      "ให้คะแนน · ช่อง (i, j) = q<sub>i</sub> · k<sub>j</sub> คือ dot (บท {#dot-product}, {#attention}) · ขนาด n × n · หาร √d<sub>k</sub> เพราะขนาด d<sub>k</sub> มีผลต่อความแปรปรวนของผลรวม"],
    [M.math(M.v("A"), M.o("="), M.t("softmax"), M.row(M.o("("), M.v("S"), M.o(")"))),
      "softmax ทีละแถว · แถว i = น้ำหนักที่คำ i ให้ทุกคำ รวมกันได้ 1 · ถ้า mask ช่องหลังคำ i เป็น −∞ ซึ่ง softmax ทำให้เป็น 0"],
    [M.math(M.t("out"), M.o("="), M.v("A"), M.v("V"), M.o("⇒"), M.sub(M.t("out"), M.i("i")), M.o("="), M.sum(M.i("j"), M.row()), M.sub(M.v("A"), M.row(M.i("i"), M.i("j"))), M.sub(M.v("v"), M.i("j"))),
      "ผสม · แถว i ของผลลัพธ์ = value ทุกคำคูณน้ำหนักแล้วบวกกัน · ขนาด n × d<sub>v</sub> (บทนี้ 5 × 3 เท่ากับ X เพราะ d<sub>v</sub> = d<sub>model</sub>) · แต่ละแถวมีข้อมูลจากคำอื่นในประโยค"],
  ],
  formulaFrom: "สูตร softmax(QKᵀ/√d_k)V, บทบาทของ query / key / value, ขนาดเมทริกซ์, d_q = d_k, การหาร √d_k, mask ด้วย −∞ และตัวอย่าง teddy bear กับ cute มาจากคลาส Stanford CME295 (~59:54–1:09:01, ~1:30:47–1:35:19, ~1:41:37) · " +
    "ตาราง X, W_Q, W_K, W_V และตัวเลขทุกตัวในภาพ <b>ผู้จัดทำแต่งเอง</b> (ในคลาสผู้สอนพูดว่า \"สมมติว่า\" cute ได้คะแนนสูง)",
  symbols: [
    ["X", "ตารางของประโยค แถวละคำ", "5 × 3"],
    ["W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub>", "เมทริกซ์ฉายที่เรียนได้", "3 × 3 ในบทนี้"],
    ["Q, K, V", "query, key, value ของทุกคำ", "5 × 3"],
    ["d<sub>k</sub>", "จำนวนมิติของ key (= ของ query)", "3"],
    ["S", "คะแนนทุกคู่หลังหาร √d<sub>k</sub>", "5 × 5"],
    ["A", "น้ำหนักหลัง softmax (attention matrix)", "แต่ละแถวรวม 1"],
    ["out", "เวกเตอร์ใหม่ของทุกคำ", "ลูกศรสีชมพู"],
  ],
  notes: `
    <h2>Query, key, value (Stanford CME295)</h2>
    <ul>
      <li>query ของคำหนึ่งพยายามหาคำอื่นที่ช่วยสร้างตัวแทนที่มีความหมายให้ตัวเอง แล้วเทียบกับ key ของทุกคำ (เช่น dot product) ได้น้ำหนัก แล้วรวม value ตามน้ำหนัก</li>
      <li>ตัวอย่างในคลาส: "อะไรอธิบาย teddy bear ได้ดีที่สุด" cute อธิบายได้ดี dot product ของ q(teddy bear) กับ k(cute) อาจจะสูง ตัวแทนของ teddy bear จึงพึ่ง cute มาก</li>
      <li>Q, K, V ได้จากการฉายตัวแทนของ token ด้วยเมทริกซ์ที่เรียนได้ · เขียนรวมเป็น softmax(QKᵀ/√d<sub>k</sub>)V · QKᵀ เป็น n × n ช่องละความคล้ายของ query กับ key · softmax ทำให้แต่ละแถวรวมได้ 1</li>
      <li>หาร √d<sub>k</sub> เพราะขนาด d<sub>k</sub> มีผลต่อความแปรปรวนของผลรวม จึงหารด้วยส่วนเบี่ยงเบนมาตรฐานให้ปกติ</li>
      <li>mask: เมทริกซ์สามเหลี่ยมที่ใส่ −∞ ให้ช่องของคำที่ยังไม่ถึง softmax ของ −∞ คือ 0 ใช้ใน decoder ที่สร้างข้อความทีละคำ</li>
      <li>ถ้าทุกคำต่อถึงกันหมด จะไม่รู้ลำดับคำ ต้องบวกตำแหน่งเข้าไปก่อน (บท {#position-encoding})</li>
    </ul>
    <h2>จากแหล่งอื่น</h2>
    <ul>
      <li>Syntax (CJ): query = token นี้มองหาอะไร · key = แต่ละ token มีอะไรให้ · value = สิ่งที่ส่งต่อเมื่อจับคู่ได้ · bank ใน "Bank of the river was muddy" ถูกกำหนดโดย river กับ muddy ส่วนใน "deposit money" ถูกกำหนดโดย deposit กับ money</li>
      <li>NitMonk: attention ให้บริบทเปลี่ยนเวกเตอร์ของ bank ตามประโยค (บท {#contextual}) · SH AI Academy: ส่วนให้คะแนนคือ query · key (บท {#attention})</li>
    </ul>`,
  refs: [
    ["stanford", "Q / K / V, softmax(QKᵀ/√d_k)V, ขนาดเมทริกซ์, d_q = d_k, การหาร √d_k, mask, ตัวอย่าง teddy bear กับ cute"],
    ["syntaxllm", "บทบาทของ query / key / value, ตัวอย่าง bank สองประโยค"],
    ["nitmonk", "attention เปลี่ยนเวกเตอร์ตามบริบท"],
    ["metrics", "คะแนน attention = query · key"],
  ],
};

// labels of the controls and the live box ({w}, {v} ... are filled by fill())
export const UI = {
  word: "คำที่ดู (แถว i)",
  scale: "การหาร",
  scales: { sqrtDk: "หาร √d (ตามบทความ)", none: "ไม่หาร √d" },
  mask: "mask",
  masks: { off: "ไม่ mask (encoder)", causal: "mask (decoder)" },
  legend: "จุดสีเทา = แถว X ของแต่ละคำ (= value) · จุดสีเหลือง = คำที่ดู · ลูกศรสีชมพู = ผลลัพธ์ของคำที่ดู · เส้นสีม่วง = น้ำหนัก (หนา = มาก)",
  rowIntro: "แถวของ \"{w}\": คะแนน q · k / √d แล้ว softmax ได้น้ำหนัก",
  head: ["คำ j", "q·k", "หาร", "น้ำหนัก"],
  masked: "ปิด",
  verdict: "\"{w}\" ให้น้ำหนักมากสุดกับ <b>{top}</b> ({a})",
  matrixIntro: "ตาราง A ทั้งหมด (แถว = คำที่ดู, คอลัมน์ = คำที่ถูกดู ตามเลขลำดับ 1–5):",
};

// replace {key} in a label with values[key]
export function fill(label, values) {
  return label.replace(/\{(\w+)\}/g, (all, key) => {
    return key in values ? String(values[key]) : all;
  });
}
