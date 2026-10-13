// 40_transformer_why.text.js — CONSTANTS of lesson 10.1 (transformer-why): every text, label and formula line shown to the learner.
// The component (40_transformer_why.js) only fills in numbers; sources: docs/aimd (see refs), the rest is labelled ผู้จัดทำ.
import { M } from "../js/kit.js";

export const TEXT = {
  intro: `
    <p><b>Transformer</b> คือสถาปัตยกรรมของ neural network ที่เป็นแกนของ LLM (คลาส Stanford: ขยายขนาดจนเป็น LLM · Syntax: เป็น engine ของ LLM) มาจากบทความ "Attention Is All You Need" ปี 2017</p>
    <p>ก่อนหน้านั้น (ยุค 2010s) งานภาษาใช้ <b>RNN</b> ที่อ่านทีละคำ แล้วเก็บความหมายทั้งหมดไว้ในเวกเตอร์ตัวเดียว (hidden state) ที่ถูกแก้ทุกก้าว
      ข้อมูลจากคำที่อยู่ไกลจึงต้องเดินผ่านหลายก้าวกว่าจะถึง และต้องอ่านทีละคำจึงฝึกช้า Transformer ให้ทุกคำ <b>ต่อตรงกับทุกคำ</b> ด้วย attention ในก้าวเดียว</p>
    <p class="fine">ภาพนี้ย่อให้ง่าย (ผู้จัดทำ): ตัวเลข "เก็บไว้ 60% ต่อก้าว" เป็นค่าสมมติเพื่อให้เห็นแนวโน้ม RNN จริงไม่ได้ลดแบบนี้เป๊ะ · ประโยคมาจากคลาส Stanford CME295</p>`,
  try: [
    "เริ่มที่ RNN กับประโยคใกล้: \"It\" ห่างจาก \"teddy bear\" 5 ก้าว ถ้าเก็บไว้ 60% ต่อก้าว จะเหลือ 0.6⁵ ≈ 0.078 (ราว 8%)",
    "เปลี่ยนเป็นประโยคไกล (แทรกอีกประโยคหนึ่ง): ห่าง 15 ก้าว เหลือ 0.6¹⁵ ≈ 0.0005 (กล่องค่าปัดเป็น 0.000) แทบหายหมด นี่คือปัญหา long-range dependency",
    "เปลี่ยนเป็น attention: \"It\" ต่อตรงไปยัง \"teddy bear\" ก้าวเดียว ไม่ว่าห่างกี่คำ",
    "ดูจำนวนก้าวที่ต้องทำเรียงกัน: RNN ต้องทำเท่าจำนวนคำ (11 หรือ 21) ส่วน attention หนึ่งชั้นคำนวณทุกคำพร้อมกัน",
  ],
  stepsWhy: "3 ขั้นตอน: RNN ส่งข้อมูลทีละก้าวผ่าน hidden state · ของไกลจึงจาง (ค่าสมมติ) · attention ต่อตรงในก้าวเดียว",
  steps: [
    ["RNN ส่งต่อทีละก้าว", "อ่านทีละคำ แก้ hidden state ตัวเดียวทุกก้าว ข้อมูลของคำก่อนหน้าต้องผ่าน hidden state ทุกก้าว"],
    ["ของไกลจางลง", "ยิ่งห่างหลายก้าว ข้อมูลเดิมยิ่งเหลือน้อย (ค่าสมมติของผู้จัดทำ)"],
    ["attention ต่อตรง", "ทุกคำต่อกับทุกคำในก้าวเดียว และคำนวณทุกคำพร้อมกันได้ แต่ต้องเติมตำแหน่งเอง (บท {#position-encoding})"],
  ],
  lines: [
    [M.math(M.sub(M.v("h"), M.i("t")), M.o("="), M.v("f"), M.row(M.o("("), M.sub(M.v("h"), M.row(M.i("t"), M.o("−"), M.n(1))), M.o(","), M.sub(M.v("x"), M.i("t")), M.o(")"))),
      "RNN · <b>h</b><sub>t</sub> = hidden state หลังอ่านคำที่ t · <b>x</b><sub>t</sub> = คำที่ t · ทุกก้าวต้องรอ <b>h</b><sub>t−1</sub> จึงทำพร้อมกันไม่ได้"],
    [M.math(M.t("kept"), M.o("="), M.sup(M.i("ρ"), M.i("k"))),
      "ค่าสมมติของผู้จัดทำ · k = จำนวนก้าวระหว่างสองคำ · ρ = สัดส่วนที่เก็บไว้ต่อก้าว (บทนี้ 0.6) · k มาก ค่านี้เข้าใกล้ 0"],
    [M.math(M.sub(M.t("hops"), M.t("attention")), M.o("="), M.n(1)),
      "attention · ทุกคำต่อตรงกับทุกคำ ห่างกี่คำก็หนึ่งก้าว · ทุกคำคำนวณพร้อมกันได้"],
  ],
  formulaFrom: "RNN เก็บ hidden state, ปัญหาของไกล, vanishing gradient, LSTM, ต้องทำทีละ token และ attention ที่ต่อตรง มาจากคลาส Stanford CME295 (~48:26–57:16) · ประโยค teddy bear ... It is 3 feet tall มาจากคลาสเดียวกัน (~51:44) · " +
    "ค่า ρ = 0.6 และสูตร ρ^k <b>ผู้จัดทำแต่งเอง</b> เพื่อให้เห็นว่าของไกลจางลง ไม่ใช่สูตรของ RNN จริง · ประโยคที่แทรก \"We went to the park and played all day.\" ผู้จัดทำแต่ง",
  symbols: [
    ["h<sub>t</sub>", "hidden state ของ RNN หลังคำที่ t", "เวกเตอร์ตัวเดียวที่ถูกแก้ทุกก้าว"],
    ["x<sub>t</sub>", "คำที่ t ในประโยค", "เช่น It"],
    ["k", "จำนวนก้าวระหว่างสองคำ", "It กับ teddy bear: 5 หรือ 15"],
    ["ρ", "สัดส่วนที่เก็บไว้ต่อก้าว (สมมติ)", "0.6"],
    ["hops", "จำนวนก้าวที่ข้อมูลต้องเดิน", "RNN = k · attention = 1"],
  ],
  notes: `
    <h2>เส้นเวลาจากแหล่งที่อ่าน</h2>
    <ul>
      <li>Stanford CME295: ยุค 2010s มี model หนึ่งตัวต่องาน (วิเคราะห์ความรู้สึก, แปลภาษา, หาชื่อ) ส่วนใหญ่เป็น RNN · 2017 บทความ "Attention Is All You Need" เสนอ transformer ซึ่งผู้สอนบอกว่า scale ได้ดีมาก (ข้อมูล การคำนวณ พารามิเตอร์มากขึ้นแล้วผลดีขึ้นมาก) · ต่อมาขยายเป็น LLM · พ.ย. 2022 ChatGPT · 2026 coding agent</li>
      <li>Syntax (CJ): ปี 2016 ระบบแปลภาษาของ Google ใช้ LSTM อ่านทีละคำ ช้าเพราะแต่ละคำต้องรอคำก่อนหน้า · attention ของ Bahdanau, Cho, Bengio (2014) ให้มองย้อนไปที่ input แต่ยังติดกับ LSTM จึงยังช้า · 2017 Jakob Uszkoreit เสนอทิ้งส่วนที่ทำทีละลำดับ ใช้ attention อย่างเดียว ผู้เขียนแปดคน</li>
      <li>Under The Hood: RNN ประมวลผลทีละ token ส่วน Transformer ประมวลผลทุกคำพร้อมกัน จึงต้องใส่ตำแหน่งเพิ่ม</li>
      <li>Thu Vu: model แบบ transformer อ่านทั้งลำดับ แล้วปรับ embedding ด้วย self-attention</li>
    </ul>
    <h2>ลำดับเหตุผลตามคลาส Stanford CME295</h2>
    <ol>
      <li>one-hot: ทุกคำตั้งฉากกัน ไม่บอกความหมาย (บท {#one-hot})</li>
      <li>word2vec: ได้เวกเตอร์ที่มีความหมาย แต่หนึ่งคำหนึ่งเวกเตอร์ และไม่สนลำดับคำ (บท {#learn-table}, {#contextual})</li>
      <li>RNN / LSTM: อ่านทีละคำ เก็บ hidden state จึงรู้ลำดับ แต่ของไกลจางหาย และต้องทำทีละคำ ฝึกช้า</li>
      <li>attention → self-attention: ต่อตรงไปยังทุกคำ ทำทุกคำพร้อมกัน แต่ต้องเติมตำแหน่งเอง (บท {#self-attention}, {#position-encoding})</li>
    </ol>
    <h2>ปัญหาของ RNN ตามคลาส Stanford</h2>
    <ul>
      <li>hidden state เป็นเวกเตอร์เดียวที่ถูกแก้ไปเรื่อย ๆ จึงจำคำที่อยู่ไกลได้ยาก (long-range dependency) ต้นเหตุลึกคือ vanishing gradient ตอน backpropagate</li>
      <li>LSTM เพิ่ม cell state ให้พาข้อมูลไปได้ไกลขึ้น แต่ผู้สอนบอกว่ายังมีปัญหาเดิม</li>
      <li>จะทาย token ถัดไปต้องผ่านทุก token ก่อนหน้าทีละตัว การฝึกจึงช้ามาก</li>
    </ul>
    <h2>ชื่อ "Attention Is All You Need"</h2>
    <p>Stanford CME295: ตอนนั้น model ส่วนใหญ่เป็นแบบวนซ้ำ (RNN) บทความนี้ไม่เก็บ hidden state ทีละ token แต่ให้ทุก token ต่อตรงกับทุก token ผ่าน self-attention จึงเป็นที่มาของชื่อ
      บทถัดไปดูว่า self-attention คำนวณอย่างไร (บท {#self-attention})</p>`,
  refs: [
    ["stanford", "ยุค RNN, ปัญหาของไกล, LSTM, ช้าเพราะทีละ token, attention, เหตุของชื่อบทความ, ประโยค teddy bear (~12:42–1:10:44)"],
    ["syntaxllm", "LSTM ปี 2016, attention 2014, Uszkoreit 2017, transformer คือ engine ของ LLM (~30:48–32:33)"],
    ["wordemb", "RNN ทีละ token, Transformer ทุกคำพร้อมกันจึงต้องใส่ตำแหน่ง"],
    ["thuvu", "transformer อ่านทั้งลำดับ ปรับ embedding ด้วย self-attention"],
  ],
};

// labels of the controls, the canvas and the live box ({k}, {n} ... are filled by fill())
export const UI = {
  mode: "วิธีส่งข้อมูล",
  modes: { rnn: "RNN (ผ่าน hidden state)", attention: "attention (ต่อตรง)" },
  sentence: "ประโยค",
  sentences: { near: "ใกล้: My teddy bear is so cute. It is 3 feet tall", far: "ไกล: แทรกอีกหนึ่งประโยค" },
  legend: "สีชมพู = คำที่ถาม (It) · สีเหลือง = คำที่ต้องการ (teddy bear) · เส้นสีม่วง = ทางที่ข้อมูลเดิน",
  hops: "ข้อมูลจาก \"{to}\" ถึง \"{from}\" ต้องเดิน <b>{k}</b> ก้าว",
  keptLine: "ถ้าเก็บไว้ {p}% ต่อก้าว (สมมติ) จะเหลือ {v}",
  direct: "ต่อตรง ไม่ต้องผ่านคำที่อยู่ระหว่างกลาง",
  steps: "อ่านทั้งประโยค {n} คำ ต้องทำเรียงกัน <b>{s}</b> ก้าว",
  stepsWhy: { rnn: "(ต้องรอ hidden state ของคำก่อนหน้า)", attention: "(หนึ่งชั้นคำนวณทุกคำพร้อมกัน)" },
};

// replace {key} in a label with values[key]
export function fill(label, values) {
  return label.replace(/\{(\w+)\}/g, (all, key) => {
    return key in values ? String(values[key]) : all;
  });
}
