// 39_contextual.text.js — CONSTANTS of lesson 4.7 (contextual): every text, label and formula line shown to the learner.
// The component (39_contextual.js) only fills in numbers; sources: docs/aimd (see refs), the rest is labelled ผู้จัดทำ.
import { M } from "../js/kit.js";

// "[w]" after a table name = open the row of w
export function at(w) {
  return M.row(M.o("["), M.t(w), M.o("]"));
}

export const TEXT = {
  intro: `
    <p>คำเดียวกันมีได้หลายความหมาย เช่น <b>bank</b> ที่แปลว่าธนาคาร หรือริมฝั่งแม่น้ำ</p>
    <p><b>Static embedding</b> (เช่น word2vec) ให้คำหนึ่งคำมีเวกเตอร์เดียว จะอยู่ในประโยคไหนก็ได้แถวเดิมจากตาราง (บท {#embedding-matrix})
      ส่วน <b>contextual embedding</b> (เช่น ELMo, BERT, GPT) ให้คำเดียวกันได้เวกเตอร์ต่างกันตามประโยคที่มันอยู่</p>
    <p class="fine">ภาพนี้ย่อให้ง่าย (ผู้จัดทำ): ตาราง 3 มิติและตัวเลขทุกตัวผู้จัดทำแต่งเอง · ประโยคมาจากคลิป NitMonk เหลือแค่คำที่มีความหมาย ·
      กติกาผสมเวกเตอร์เป็นแบบย่อของ attention (บท {#attention}) ที่ไม่มีตาราง W ที่ model จริงฝึกมา</p>`,
  try: [
    "เริ่มที่ประโยค \"I deposited money in the bank\" แบบ static: bank ได้แถวเดิม ใกล้ money กับ river เท่ากัน (0.777 ทั้งคู่)",
    "เปลี่ยนเป็น contextual: เวกเตอร์ของ bank เอียงไปทาง money (cos 0.987) เพราะ money กับ deposited อยู่ในประโยค",
    "เปลี่ยนประโยคเป็น \"I reached Yamuna river bank\": bank ย้ายไปทาง river (cos 0.977) · cos ของ bank สองประโยคเหลือ 0.563 ส่วนแบบ static เป็น 1.000 เสมอ",
    "ลองคู่ apple (\"I ate an apple\" กับ \"Apple released a phone\"): แบบ contextual ใกล้ fruit ในประโยคแรก และใกล้ company ในประโยคที่สอง",
  ],
  stepsWhy: "ขั้นตอน 1 คือทั้งหมดของ static · ขั้นตอน 2–4 คือส่วนที่ contextual เพิ่มเข้ามา (แบบย่อของผู้จัดทำ: ให้คะแนนด้วย dot แบบที่ NitMonk อธิบาย attention แล้วผสมเวกเตอร์)",
  steps: [
    ["เปิดแถวของคำ", "static: ได้แถวเดียวกันทุกประโยค จบแค่นี้"],
    ["ให้คะแนนคำในประโยค", "dot ของแถวคำที่สนใจกับแถวของทุกคำในประโยค (รวมตัวมันเอง) หารด้วย √d"],
    ["แปลงคะแนนเป็นน้ำหนัก", "softmax: ทุกน้ำหนักเป็นบวกและรวมกันได้ 1 · คะแนนมากได้น้ำหนักมาก"],
    ["ผสมเวกเตอร์", "เอาแถวของทุกคำในประโยคคูณน้ำหนักแล้วบวกกัน ได้เวกเตอร์ใหม่ของคำนั้นในประโยคนี้"],
  ],
  lines: [
    [M.math(M.v("e"), M.o("="), M.v("E"), at("w")),
      "เปิดแถว · <b>E</b> = ตาราง static · w = คำที่สนใจ (bank หรือ apple) · <b>e</b> = เวกเตอร์ static ของ w เหมือนกันทุกประโยค (บท {#embedding-matrix})"],
    [M.math(M.sub(M.t("score"), M.i("j")), M.o("="), M.frac(M.row(M.v("e"), M.o("·"), M.v("E"), at("xⱼ")), M.sqrt(M.i("d")))),
      "ให้คะแนน · x<sub>j</sub> = คำที่ j ในประโยค · เครื่องหมาย · คือ dot (บท {#dot-product}) · d = จำนวนมิติ (บทนี้ 3) · การหารด้วย √d มาจากสูตร attention ที่ใช้กันทั่วไป (ความรู้ทั่วไป)"],
    [M.math(M.sub(M.v("a"), M.i("j")), M.o("="), M.frac(M.row(M.t("exp"), M.o("("), M.sub(M.t("score"), M.i("j")), M.o(")")),
      M.row(M.sum(M.i("k"), M.row()), M.t("exp"), M.o("("), M.sub(M.t("score"), M.i("k")), M.o(")")))),
      "softmax · a<sub>j</sub> = น้ำหนักของคำที่ j · exp = e ยกกำลัง · หารด้วยผลรวมของทุกคำ น้ำหนักจึงรวมกันได้ 1"],
    [M.math(M.v("c"), M.o("="), M.sum(M.i("j"), M.row()), M.sub(M.v("a"), M.i("j")), M.v("E"), at("xⱼ")),
      "ผสม · <b>c</b> = เวกเตอร์ contextual ของ w ในประโยคนี้ · เปลี่ยนประโยค น้ำหนักเปลี่ยน <b>c</b> ก็เปลี่ยน"],
  ],
  formulaFrom: "static vs contextual และตัวอย่าง bank มาจาก Thu Vu (~15:13), Byte Goose AI (~1:55) และ NitMonk (~32:59) · ประโยค bank และ apple มาจาก NitMonk · " +
    "ขั้นตอน 2–4 <b>ผู้จัดทำย่อเอง</b>: model จริงฝึกตาราง W<sub>q</sub>, W<sub>k</sub>, W<sub>v</sub> และทำหลายชั้น บทนี้ใช้แถว static ตรง ๆ ทั้งหมด · ตารางและตัวเลขในภาพผู้จัดทำแต่งเอง",
  symbols: [
    ["E", "ตาราง static (หนึ่งแถวต่อหนึ่งคำ)", "11 คำ 3 มิติ ผู้จัดทำแต่งเอง"],
    ["w", "คำที่มีหลายความหมาย", "bank, apple"],
    ["e", "เวกเตอร์ static ของ w", "ลูกศรสีเทาในภาพ"],
    ["x<sub>j</sub>", "คำที่ j ในประโยค", "เช่น deposited, money, bank"],
    ["score<sub>j</sub>", "คะแนนของคำที่ j", "dot หารด้วย √3"],
    ["a<sub>j</sub>", "น้ำหนักหลัง softmax", "บวกทุกตัวและรวมกันได้ 1"],
    ["c", "เวกเตอร์ contextual ของ w ในประโยคนี้", "ลูกศรหนาในภาพ"],
    ["cos", "cosine (บท {#cosine})", "1 = ทิศเดียวกัน"],
  ],
  notes: `
    <h2>จากแหล่งที่อ่าน</h2>
    <ul>
      <li>Thu Vu: word2vec และ network ตื้น ๆ แบบเดียวกันให้ static embedding คือหนึ่งคำหนึ่งเวกเตอร์ เช่น bank ผู้สอนบอกว่าเป็นปัญหาใหญ่เพราะภาษาขึ้นกับบริบท
        · ELMo, BERT, GPT ให้ contextual embedding คำเดียวกันได้เวกเตอร์ต่างกันในบริบทต่างกัน · model ที่ใช้สถาปัตยกรรม transformer อ่านทั้งลำดับและปรับ embedding ด้วย self-attention</li>
      <li>Byte Goose AI: model แบบ static มองไม่เห็นบริบท (word2vec ให้ bank มีพิกัดเดียว) ต่างจาก model แบบ transformer (encoder แบบ BERT หรือ decoder ของ LLM)</li>
      <li>NitMonk: "I deposited money in the bank" กับ "I reached Yamuna river bank" ก่อน attention bank มี embedding ตายตัวตัวเดียว หลัง attention บริบทเปลี่ยนเวกเตอร์ (contextual embedding)
        · บนหน้าเว็บของผู้สอนมีคู่ "I ate an apple" กับ "Apple released a phone" · ผู้สอนอธิบาย attention ว่าเป็น dot product ของเวกเตอร์คำ (สรุปของผู้จัดทำชี้ว่าเป็นคำอธิบายแบบย่อ ของจริงมี W<sub>q</sub>, W<sub>k</sub>, W<sub>v</sub>)</li>
      <li>Annie Sexton: คำหลายความหมาย เช่น train ใน "I train my dog" กับ train ในประโยค "midnight train" · embedding ของ token เป็นแค่จุดเริ่ม model ดูคำรอบข้างแล้วปรับให้เป็น embedding ที่ไวต่อบริบท
        (สไลด์ของผู้สอนเขียนไว้ว่าภาพนี้หยาบมาก ของจริงซับซ้อนกว่ามาก)</li>
      <li>SOFAR (~7:56): ผู้สอนเล่าขั้นตอนใน GPT ว่า tokenization → vector embedding → positional embedding → contextual embedding → self-attention</li>
    </ul>
    <h2>ที่ผู้จัดทำย่อไว้</h2>
    <ul>
      <li>attention จริงสร้าง query, key, value จากแถวของคำด้วยตาราง W<sub>q</sub>, W<sub>k</sub>, W<sub>v</sub> ที่ฝึกมา และซ้อนกันหลายชั้น (ความรู้ทั่วไป) บทนี้ข้ามส่วนนั้นไปเพื่อให้เห็นแค่ความคิดหลัก:
        เวกเตอร์ของคำถูกผสมกับคำอื่นในประโยค</li>
      <li>ประโยคเหลือแค่คำที่มีความหมาย (ตัด I, in, the, an, a, Yamuna) และทุกคำในประโยคใช้แถว static ของมันเอง</li>
      <li>ELMo ไม่ได้ใช้ transformer (ความรู้ทั่วไป) แต่ก็ให้ contextual embedding เหมือนกัน</li>
      <li>บท {#same-model} ใช้คำเดียวต่อเอกสาร จึงเหมือน static · embedding model ที่ใช้จริงในระบบค้นมักเป็นแบบ contextual (ความรู้ทั่วไป)</li>
    </ul>`,
  refs: [
    ["thuvu", "static (word2vec, bank) vs contextual (ELMo, BERT, GPT) · ส่วน model ที่ใช้ transformer ปรับ embedding ด้วย self-attention (~15:13)"],
    ["choose", "word2vec ให้ bank พิกัดเดียว vs model แบบ transformer (~1:55)"],
    ["nitmonk", "ประโยค bank สองความหมาย, คู่ apple, attention = dot ของเวกเตอร์คำ (~31:13–32:59)"],
    ["annie", "คำหลายความหมาย (train), embedding ของ token เป็นแค่จุดเริ่ม (~4:02)"],
    ["sofar", "ลำดับขั้นใน GPT ถึง contextual embedding (~7:56)"],
  ],
};

// labels of the controls and the live box ({w}, {s} ... are filled by fill())
export const UI = {
  sentence: "ประโยค",
  mode: "แบบของ embedding",
  modes: { static: "static (หนึ่งคำหนึ่งเวกเตอร์)", contextual: "contextual (ดูประโยค)" },
  legend: "ลูกศรสีเทา = เวกเตอร์ static (e) · ลูกศรสีชมพู = คำที่สนใจในประโยคนี้ · ลูกศรสีเหลืองเส้นบาง = คำเดียวกันในอีกประโยค · วงสีม่วง = คำบอกความหมาย · จุดสีขาว = คำอื่นในประโยคนี้ · จุดสีเทาเล็ก = คำในอีกประโยค",
  staticLine: "แบบ static: {w} ได้แถวเดิม ไม่ว่าอยู่ในประโยคไหน (ลูกศรสีเทา สีเหลือง และสีชมพูจึงทับกันเป็นเส้นเดียว)",
  scoreIntro: "ประโยค \"{s}\": ให้คะแนนคำในประโยคแล้วแปลงเป็นน้ำหนัก",
  head: ["คำในประโยค", "score", "น้ำหนัก a"],
  senseIntro: "เทียบกับคำบอกความหมาย:",
  closest: "ใกล้ <b>{best}</b> ที่สุด",
  tie: "ใกล้สองความหมายเท่ากัน",
  between: "{w} ในสองประโยค: cos(ประโยคนี้, อีกประโยค) = {c} {why}",
  whyStatic: "(static ได้เวกเตอร์เดียวกันเสมอ)",
  whyContextual: "(ยิ่งต่ำกว่า 1 มาก ยิ่งต่างกันตามบริบทมาก)",
};

// replace {key} in a label with values[key]
export function fill(label, values) {
  return label.replace(/\{(\w+)\}/g, (all, key) => {
    return key in values ? String(values[key]) : all;
  });
}
