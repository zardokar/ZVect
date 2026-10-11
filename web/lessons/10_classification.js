import { mean, cosine, classify } from "../../lib/zvect.js";
import { M, AX } from "../js/kit.js";

// axes: x = food, y = animal, z = tech. Class color = its main axis color.
const TRAIN = {
  food: [[0.9, 0.1, 0.0], [0.8, 0.0, 0.1], [1.0, 0.2, 0.0], [0.7, 0.1, 0.2]],
  animal: [[0.1, 0.9, 0.0], [0.0, 1.0, 0.1], [0.2, 0.8, 0.1], [0.1, 0.7, 0.3]],
  tech: [[0.0, 0.1, 0.9], [0.1, 0.0, 1.0], [0.0, 0.2, 0.8], [0.3, 0.1, 0.7]],
};
const COLOR = { food: "x", animal: "y", tech: "z" };
const CENT = Object.fromEntries(Object.entries(TRAIN).map(([k, pts]) => [k, mean(pts)]));
const S = 4;
const up = (v) => v.map((x) => x * S);

export default {
  slug: "classification",
  title: "Classification: จัดกลุ่มด้วยเวกเตอร์",
  en: "Classification",
  example: "10_classification",
  axisNames: ["food", "animal", "tech"],
  view: { dist: 12, yaw: 0.75 },
  intro: `
    <p>วิธีจัดกลุ่มที่ง่ายที่สุด: <b>หาค่าเฉลี่ย (centroid)</b> ของตัวอย่างในแต่ละกลุ่ม
    พอมีจุดใหม่เข้ามา ให้ดูว่ามันคล้าย centroid ไหนมากที่สุด แล้วตอบกลุ่มนั้น (nearest centroid)</p>
    <p>ระบบจริงทำแบบเดียวกัน: ใช้ encoder แปลงข้อความเป็นเวกเตอร์ แล้วจัดกลุ่มด้วย cosine
    แค่มีตัวอย่างไม่กี่ชิ้นต่อกลุ่มก็จัดได้แล้ว</p>`,
  try: [
    "เลื่อนจุด x ไปกลางระหว่าง food กับ animal แล้วดูว่าคะแนนสูสีกัน",
    "เส้นที่หนาที่สุดชี้ไปที่ centroid ที่ชนะ",
  ],
  steps: [
    ["หาตัวแทนของแต่ละกลุ่ม", "เฉลี่ยตัวอย่างในกลุ่มเป็นจุดเดียว (centroid) จะได้ไม่ต้องเทียบกับทุกตัวอย่าง"],
    ["ทายกลุ่มของจุดใหม่", "เทียบ cos กับตัวแทนทุกกลุ่ม แล้วตอบกลุ่มที่ได้ค่าสูงสุด"],
  ],
  lines: [
    [M.math(M.sub(M.v("c"), M.i("k")), M.o("="), M.frac(M.n(1), M.sub(M.i("n"), M.i("k"))), M.sum(M.row(M.v("p"), M.o("∈"), M.i("k")), M.t("")), M.v("p")),
      "หาตัวแทนของกลุ่ม (centroid) · k = ชื่อกลุ่ม · p = ตัวอย่างในกลุ่ม · บวกทุกตัวอย่างแล้วหารด้วยจำนวน n<sub>k</sub> = ค่าเฉลี่ย · ทำ 3 รอบ (food, animal, tech)"],
    [M.math(M.i("ŷ"), M.o("="), M.sub(M.t("argmax"), M.i("k")), M.o("&#x2061;"), M.fn("cos"), M.row(M.o("("), M.v("x"), M.o(","), M.sub(M.v("c"), M.i("k")), M.o(")"))),
      "จัดกลุ่มจุดใหม่ x · เทียบ cos กับตัวแทนทุกกลุ่ม แล้วตอบกลุ่มที่ได้ค่าสูงสุด · ŷ = คำตอบที่ทาย (หมวก ^ = ค่าที่ทาย)"],
  ],
  symbols: [["k", "ชื่อกลุ่ม: food, animal, tech", "ทำสูตรแรก 3 รอบ รอบละกลุ่ม"], ["p ∈ k", "ตัวอย่าง p ที่เป็นของกลุ่ม k เช่น (0.9, 0.1, 0.0)", "ข้อมูลที่รู้คำตอบอยู่แล้ว"], ["nₖ", "จำนวนตัวอย่างในกลุ่ม k (บทนี้ = 4)", ""], ["cₖ = (1/nₖ) ∑ p", "บวกทุกตัวอย่างของกลุ่มแล้วหารด้วยจำนวน = ค่าเฉลี่ย (centroid)", "ใช้จุดเดียวแทนทั้งกลุ่ม เช่น food = (0.85, 0.10, 0.075)"], ["x", "จุดใหม่ที่ยังไม่รู้กลุ่ม", ""], ["cos(x, cₖ)", "ความคล้ายเชิงทิศระหว่าง x กับ centroid", ""], ["argmaxₖ", "ลองทุกกลุ่ม แล้วตอบชื่อกลุ่มที่ได้ค่าสูงสุด", "ตอบเป็นชื่อกลุ่ม ไม่ใช่ตัวเลข"], ["ŷ", "คำตอบที่ระบบเดา (หมวก ^ = ค่าที่ทาย)", "x = (0.50, 0.45, 0.10) ได้ food 0.817 > animal 0.757 > tech 0.307 จึงตอบ food"]],
  notes: `
    <h2>เมื่อไรวิธีนี้ใช้ได้ดี</h2>
    <ul>
      <li>classifier ต้องการให้แต่ละกลุ่มอยู่แยกกันชัดในพื้นที่เวกเตอร์ (แบ่งด้วยเส้นตรงได้)</li>
      <li>สำหรับงานจัดกลุ่ม โมเดลที่ทำมาเพื่อแปลงข้อความ (encoder-only เช่น RoBERTa) มักแยกกลุ่มได้ดีกว่าโมเดล multimodal ขนาดใหญ่แบบทั่วไป (ตามคลิป)</li>
    </ul>
    <h2>ใช้ในงานจริง</h2>
    <ul>
      <li>จัดหมวดข้อความหรือ ticket อัตโนมัติ จากตัวอย่างไม่กี่ชิ้นต่อหมวด</li>
      <li>หาสิ่งผิดปกติ: รายการที่อยู่ห่างจากทุกกลุ่มอาจเป็นการโกง</li>
    </ul>`,
  refs: [["choose", "linear separability และโมเดล encoder-only สำหรับ classification"], ["beginner", "การใช้งานจัดกลุ่มและหาสิ่งผิดปกติ"]],
  mount(ui) {
    const x = ui.vec3("จุดใหม่ x", [0.5, 0.45, 0.1], { min: 0, max: 1, step: 0.05 });
    const st = { mode: "" };
    ui.choice("แสดง", [["", "centroid + เส้นคะแนน"], ["pts", "เฉพาะจุด"]], st, "mode");
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        const pred = classify(x, CENT).label;
        for (const [k, pts] of Object.entries(TRAIN)) for (const p of pts) s.point(up(p), s.c[COLOR[k]], "", { r: 4 });
        if (st.mode !== "pts") {
          for (const [k, c] of Object.entries(CENT)) {
            const sc = cosine(x, c);
            s.line(up(x), up(c), s.c[COLOR[k]], { width: k === pred ? 4 : 1.5, dash: k === pred ? null : [5, 4] });
            s.point(up(c), s.c[COLOR[k]], `${k} ${sc.toFixed(2)}`, { r: 8, ring: true });
          }
        }
        s.point(up(x), s.c[COLOR[pred]], "x → " + pred, { r: 7 });
      },
      live() {
        const r = classify(x, CENT);
        const rows = Object.entries(CENT).map(([k, c]) =>
          `<tr class="${k === r.label ? "win" : ""}"><td><span class="sw ${AX[["food", "animal", "tech"].indexOf(k)]}"></span>${k}</td>
           <td>(${c.map((v) => v.toFixed(2)).join(", ")})</td><td>${cosine(x, c).toFixed(3)}</td></tr>`).join("");
        return M.math(M.i("ŷ"), M.o("="), M.t(r.label)) +
          `<table class="rank"><thead><tr><th>class</th><th>centroid</th><th>cos(x, c)</th></tr></thead><tbody>${rows}</tbody></table>`;
      },
    };
  },
};
