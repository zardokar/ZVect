// 43_transformer_block.text.js — CONSTANTS of lesson 10.4 (transformer-block): every text, label and formula line shown to the learner.
// The component (43_transformer_block.js) only fills in numbers; sources: docs/aimd (see refs), the rest is labelled ผู้จัดทำ.
import { M } from "../js/kit.js";

export const TEXT = {
  intro: `
    <p>หนึ่ง <b>transformer block</b> มีสองงานหลัก: <b>multi-head self-attention</b> ที่ให้คำแลกข้อมูลกัน (บท {#self-attention}) และ <b>feed forward</b> ที่ทำทีละคำ
      ระหว่างทางมี <b>residual</b> (บวกของเดิมกลับ) และ <b>layer norm</b> แล้วซ้อน block หลายชั้น (บทความเดิม N = 6)</p>
    <p>สิ่งที่ควรสังเกต: <b>ตารางเข้า n × d<sub>model</sub> ตารางออกก็ n × d<sub>model</sub></b> จึงซ้อนชั้นต่อกันได้เรื่อย ๆ</p>
    <p class="fine">ภาพนี้ย่อให้ง่าย (ผู้จัดทำ): 5 คำ d<sub>model</sub> = 4, 2 head (d<sub>k</sub> = 2), d<sub>ff</sub> = 8, weight สุ่มจาก seed ไม่ได้ฝึก ตัวเลขจึงไม่มีความหมาย ดูแค่ขนาดและลำดับขั้น · layer norm ไม่มี gain / bias ที่เรียนได้ · feed forward ไม่มี bias (บทความมี b<sub>1</sub>, b<sub>2</sub>) · ไม่มี dropout</p>`,
  try: [
    "กดเลือกขั้นทีละขั้นจากบนลงล่าง ดูขนาดตารางในกล่องค่า: ทุกขั้นเป็น 5 × 4 ยกเว้นชั้นซ่อนของ feed forward ที่ขยายเป็น 5 × 8 แล้วหดกลับ",
    "ขั้น \"ต่อ 2 head\": head ละ 2 คอลัมน์ ต่อกันได้ 4 แล้ว W_O ฉายกลับเป็น d_model",
    "ขั้น \"บวกกลับ + norm\": ทุกแถวมีค่าเฉลี่ย 0 หลัง layer norm (บวกเลขในแถวดูได้)",
    "เปลี่ยนเป็น decoder: ภาพเพิ่ม masked self-attention และ cross-attention ที่ query มาจาก decoder ส่วน key กับ value มาจาก encoder",
  ],
  stepsWhy: "ลำดับในหนึ่ง block ตามคลาส Stanford CME295 และภาพในบทความต้นฉบับ (ก่อน block แรกบวกตำแหน่ง X + PE แล้ว บท {#position-encoding})",
  steps: [
    ["multi-head attention", "แต่ละ head คำนวณ softmax(QKᵀ/√d_k)V ของตัวเอง แล้วต่อกันและคูณ W_O กลับเป็น d_model"],
    ["บวกกลับ + norm", "x + attention(x) แล้ว layer norm: แก้ x ไม่ใช่แทนที่ x"],
    ["feed forward", "ทีละคำ: ขยายเป็น d_ff ผ่าน ReLU แล้วหดกลับเป็น d_model"],
    ["บวกกลับ + norm", "อีกครั้ง ได้ผลของ block ขนาดเท่าเดิม ส่งต่อ block ถัดไป"],
  ],
  lines: [
    [M.math(M.t("MHA"), M.row(M.o("("), M.v("X"), M.o(")")), M.o("="), M.t("concat"), M.row(M.o("("), M.sub(M.t("head"), M.n(1)), M.o(","), M.o("…"), M.o(","), M.sub(M.t("head"), M.i("h")), M.o(")")), M.sub(M.v("W"), M.i("O"))),
      "multi-head · head ละ softmax(QKᵀ/√d<sub>k</sub>)V ด้วย W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub> ของตัวเอง · ต่อกันได้ n × h·d<sub>v</sub> · <b>W</b><sub>O</sub> ขนาด h·d<sub>v</sub> × d<sub>model</sub> ฉายกลับ"],
    [M.math(M.v("Z"), M.o("="), M.t("LayerNorm"), M.row(M.o("("), M.v("X"), M.o("+"), M.t("MHA"), M.row(M.o("("), M.v("X"), M.o(")")), M.o(")"))),
      "residual + norm · บวกของเดิมกลับ (x + f(x)) แก้ x แทนการแทนที่ ช่วยตอน backpropagation · layer norm ทำให้แต่ละแถวมีค่าเฉลี่ย 0 ความแปรปรวน 1"],
    [M.math(M.t("FFN"), M.row(M.o("("), M.v("Z"), M.o(")")), M.o("="), M.t("ReLU"), M.row(M.o("("), M.v("Z"), M.sub(M.v("W"), M.n(1)), M.o(")")), M.sub(M.v("W"), M.n(2))),
      "feed forward ทีละคำ · <b>W</b><sub>1</sub> ขนาด d<sub>model</sub> × d<sub>ff</sub> (ขยาย) · ReLU = ค่าลบเป็น 0 · <b>W</b><sub>2</sub> ขนาด d<sub>ff</sub> × d<sub>model</sub> (หดกลับ) · บทนี้ตัด bias ออก (ผู้จัดทำ)"],
    [M.math(M.t("out"), M.o("="), M.t("LayerNorm"), M.row(M.o("("), M.v("Z"), M.o("+"), M.t("FFN"), M.row(M.o("("), M.v("Z"), M.o(")")), M.o(")"))),
      "ผลของ block · ขนาด n × d<sub>model</sub> เท่ากับขาเข้า · ซ้อน N block ต่อกัน"],
  ],
  formulaFrom: "ลำดับ attention → feed forward, residual (x + f(x)), layer norm, multi-head ที่ต่อกันแล้วฉายด้วย W_O, d_ff ที่ใหญ่กว่า d_model, N = 6, mask และ cross-attention มาจากคลาส Stanford CME295 (~1:16:27–1:27:08, ~1:30:14–1:39:31) · " +
    "ReLU ตรงกับบทความต้นฉบับ (ผลตรวจของผู้จัดทำ) · layer norm แบบไม่มี gain / bias และ feed forward ไม่มี bias เป็น<b>การย่อของผู้จัดทำ</b> · ค่า h = 8, d_model = 512, d_ff = 2048 มาจากบทความ (ผลตรวจของผู้จัดทำ) · ขนาดและ weight ในภาพผู้จัดทำกำหนดเอง",
  symbols: [
    ["n", "จำนวนคำ", "5"],
    ["d<sub>model</sub>", "ขนาดเวกเตอร์ของแต่ละคำตลอด block", "4 (บทความ 512)"],
    ["h", "จำนวน head", "2 (บทความ 8)"],
    ["d<sub>k</sub> = d<sub>v</sub>", "ขนาดของ query / key / value ต่อ head", "2 (บทความ 64)"],
    ["d<sub>ff</sub>", "ขนาดชั้นซ่อนของ feed forward", "8 (บทความ 2048)"],
    ["W<sub>O</sub>", "ฉายผลที่ต่อกันกลับเป็น d<sub>model</sub>", "4 × 4"],
    ["N", "จำนวน block ที่ซ้อน", "บทความ 6"],
  ],
  notes: `
    <h2>Stanford CME295</h2>
    <ul>
      <li>encoder: self-attention ให้ token เป็นฟังก์ชันของทุก token แล้ว feed forward ฉายไปมิติสูงขึ้นพร้อม activation เพื่อเรียนความไม่เป็นเชิงเส้น · ปลาย encoder ได้ตัวแทนที่รู้บริบทของทุก token</li>
      <li>decoder: เริ่มจาก [BOS] มี masked self-attention (เห็นแค่ token ที่สร้างแล้ว) แล้ว cross-attention ที่ query มาจาก decoder ส่วน key และ value มาจาก encoder จากนั้น feed forward, linear, softmax ได้ความน่าจะเป็นของ token ถัดไป แล้ววนจนได้ [EOS]</li>
      <li>เทคนิค: residual (ผลของชั้นคือ f(x) + x ช่วย backpropagation) · layer norm (ช่วยลู่เข้า) · multi-head (หลายชุดของการฉาย เปรียบกับ filter ของ CNN) · dropout · label smoothing</li>
      <li>หลายการดำเนินการใน transformer รักษาขนาด d<sub>model</sub> ไว้ · ถ้าต้องสรุปแก่น Shervine ตอบว่าคือ attention กับ feed forward ที่เก็บพารามิเตอร์ส่วนใหญ่</li>
    </ul>
    <h2>จากแหล่งอื่น</h2>
    <ul>
      <li>Syntax (CJ): block หนึ่งมี attention ที่ token แลกข้อมูลกันกับ feed forward ที่ทำทีละ token · LLM ซ้อนหลายสิบถึงหลายร้อยชั้น ทุกชั้นรับและส่งรูปร่างเดิม (หนึ่งเวกเตอร์ต่อ token)</li>
      <li>SOFAR: ลำดับใน GPT tokenization → embedding → positional → contextual → self-attention</li>
    </ul>
    <h2>ผลตรวจและความรู้ทั่วไป (ผู้จัดทำ)</h2>
    <ul>
      <li>ค่าในบทความ base: d<sub>model</sub> 512, h 8, d<sub>k</sub> = d<sub>v</sub> 64, d<sub>ff</sub> 2048, N = 6 ทั้ง encoder และ decoder, dropout 0.1, label smoothing 0.1</li>
      <li>"พารามิเตอร์ส่วนใหญ่อยู่ใน feed forward" ถูกในระดับ encoder layer (2·512·2048 ≈ 2.1 ล้าน เทียบ attention 4·512² ≈ 1.05 ล้าน) แต่ทั้ง model base ส่วน feed forward ราว 39%</li>
      <li>LLM แบบ GPT ใช้แค่ฝั่ง decoder ที่ไม่มี cross-attention (ความรู้ทั่วไป)</li>
    </ul>`,
  refs: [
    ["stanford", "encoder / decoder, residual, layer norm, mask, multi-head + W_O, d_ff, N = 6, cross-attention (~1:09:35–1:41:37)"],
    ["syntaxllm", "attention + feed forward = หนึ่ง block, ซ้อนหลายชั้นรูปร่างเดิม"],
    ["sofar", "ลำดับขั้นใน GPT"],
  ],
};

// labels of the controls, the diagram and the live box
export const UI = {
  part: "ฝั่ง",
  parts: { encoder: "encoder", decoder: "decoder (มี mask + cross)" },
  stage: "ขั้นใน block",
  stages: { X0: "X + ตำแหน่ง", concat: "ต่อ 2 head", mha: "× W_O", norm1: "บวกกลับ + norm", hidden: "FFN ชั้นซ่อน", ffn: "FFN ออก", out: "บวกกลับ + norm (ผล)" },
  boxes: {
    encoder: ["X + ตำแหน่ง", "Multi-head self-attention", "บวกกลับ + norm", "Feed forward", "บวกกลับ + norm"],
    decoder: ["Y + ตำแหน่ง ([BOS] …)", "Masked self-attention", "บวกกลับ + norm", "Cross-attention (Q จาก decoder)", "บวกกลับ + norm", "Feed forward", "บวกกลับ + norm"],
  },
  boxOf: { X0: 0, concat: 1, mha: 1, norm1: 2, hidden: 3, ffn: 3, out: 4 },
  legend: "กล่องสีชมพู = ขั้นที่เลือก · ตัวเลขข้างกล่อง = ขนาดตาราง · ตัวเลขในกล่องค่าใช้ประโยคเดียวกับ encoder เสมอ",
  tableIntro: "ตารางหลังขั้น \"{s}\" ขนาด <b>{shape}</b>:",
  decoderNote: "ฝั่ง decoder (ย่อโดยผู้จัดทำ): ตัวเลขใช้ประโยคเดิม ไม่ใช่ [BOS] … และคำนวณแค่ masked self-attention แล้วต่อ feed forward เลย ข้าม cross-attention (คล้าย block ของ GPT) · cross-attention แสดงในภาพเท่านั้น",
  headIntro: "น้ำหนัก attention ของ \"{w}\" ในแต่ละ head:",
};

// replace {key} in a label with values[key]
export function fill(label, values) {
  return label.replace(/\{(\w+)\}/g, (all, key) => {
    return key in values ? String(values[key]) : all;
  });
}
