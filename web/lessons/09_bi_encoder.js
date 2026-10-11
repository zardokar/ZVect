import { encode, topK, words } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// toy word vectors. axes: x = food, y = animal, z = tech
const TABLE = {
  eat: [1, 0, 0], rice: [1, 0, 0], noodle: [1, 0, 0], hungry: [0.9, 0.1, 0], pizza: [1, 0, 0],
  cat: [0, 1, 0], dog: [0, 1, 0], pet: [0, 1, 0], pets: [0, 1, 0], bark: [0.1, 0.9, 0], fish: [0.5, 0.5, 0],
  code: [0, 0, 1], computer: [0, 0, 1], phone: [0, 0, 1], app: [0, 0, 1], robot: [0, 0.2, 0.8],
  bug: [0, 0.5, 0.5],
};
const DOCS = [
  "cat and dog are pets",
  "eat rice and noodle",
  "write code on a computer",
  "the phone app has a bug",
  "my dog likes fish",
  "a robot pet that can bark",
];
const S = 3.2;
const up = (v) => v.map((x) => x * S);
const DOCV = DOCS.map((d, i) => ({ id: d, tag: "d" + (i + 1), v: encode(d, TABLE) })); // encoded once, offline

export default {
  slug: "bi-encoder",
  title: "Bi-Encoder: ค้นหาด้วยความหมาย",
  en: "Bi-Encoder",
  example: "09_bi_encoder",
  axisNames: ["food", "animal", "tech"],
  view: { dist: 10, yaw: 0.7 },
  intro: `
    <p><b>Bi-Encoder</b> คือการ <b>แปลงคำถามและเอกสารเป็นเวกเตอร์แยกกัน</b> แล้วเทียบด้วย cosine
    (encoder ของสองฝั่งอาจเป็นตัวเดียวกันหรือคนละตัวก็ได้ บทนี้ใช้ตัวเดียวกัน)
    ข้อดีคือเอกสารแปลงไว้ล่วงหน้าได้ครั้งเดียว ตอนค้นหาจึงแปลงแค่คำถาม เร็วมาก</p>
    <p>encoder จริงเป็น neural network ในบทนี้ใช้ encoder จำลอง:
    เอาเวกเตอร์ของแต่ละคำมา <b>เฉลี่ย</b> (mean pooling) แล้ว normalize ให้ยาว 1</p>`,
  try: [
    "พิมพ์ \"robot bug\" หรือ \"hungry cat\" แล้วดูว่าเอกสารไหนขึ้นมา",
    "คำที่ encoder ไม่รู้จักจะถูกข้าม ลองพิมพ์ \"my lovely pet\"",
  ],
  lines: [
    [M.math(M.v("q"), M.o("="), M.fn("normalize"), M.row(M.o("("), M.frac(M.n(1), M.i("n")), M.sum(M.row(M.i("w"), M.o("∈"), M.t("known")), M.t("")), M.sub(M.v("e"), M.i("w")), M.o(")"))),
      "แปลงคำถามเป็นเวกเตอร์ · e<sub>w</sub> = เวกเตอร์ของคำ w จากตาราง · บวกทุกคำที่ encoder รู้จัก (known) แล้วหารด้วยจำนวนคำ n = ค่าเฉลี่ย · normalize = ย่อให้ยาว 1"],
    [M.math(M.fn("score"), M.row(M.o("("), M.v("q"), M.o(","), M.v("d"), M.o(")")), M.o("="), M.v("q"), M.o("·"), M.v("d")),
      "ให้คะแนนเอกสาร d (เวกเตอร์ของเอกสาร ทำแบบเดียวกันไว้ล่วงหน้า) · ยาว 1 ทั้งคู่ dot จึงเท่ากับ cosine · คะแนนสูงสุดขึ้นก่อน"],
  ],
  symbols: [["q", "เวกเตอร์ของคำถาม", ""], ["e<sub>w</sub>", "เวกเตอร์ของคำ w จากตาราง", ""], ["(1/n) ∑ e<sub>w</sub>", "ค่าเฉลี่ยของเวกเตอร์ทุกคำที่ encoder รู้จัก", "รวมหลายคำเป็นเวกเตอร์เดียว"], ["normalize( )", "ย่อให้ยาว 1", "ทำให้ dot เท่ากับ cosine"], ["score(q, d) = q · d", "คะแนนของเอกสาร d", "เอกสารคะแนนสูงสุดขึ้นก่อน"]],
  notes: `
    <h2>encoder จริงแปลงคำเป็นเวกเตอร์อย่างไร</h2>
    <ul>
      <li>มีตาราง embedding ขนาด (จำนวนคำ × จำนวนมิติ) เช่น 50,000 × 300 แปลงคำ = หาแถวของคำนั้นในตาราง</li>
      <li>ตอนแรกค่าในตารางสุ่ม แล้วถูกปรับทีละนิดทุกครั้งที่โมเดลเดาผิด คำที่ใช้ในบริบทคล้ายกันจึงถูกดันไปทางเดียวกัน</li>
    </ul>
    <h2>bi-encoder กับ cross-encoder</h2>
    <ul>
      <li><b>bi-encoder</b> (บทนี้) แปลงคำถามกับเอกสารแยกกัน เอกสารแปลงเก็บไว้ล่วงหน้าได้ จึงเร็วพอค้นเอกสารนับล้าน</li>
      <li>ข้อเสีย: อัดทั้งเอกสารเป็นเวกเตอร์เดียวก่อนเห็นคำถาม รายละเอียดบางอย่างหายไป</li>
      <li><b>cross-encoder</b> อ่านคำถามกับเอกสารพร้อมกัน แม่นกว่าแต่ต้องรันโมเดลทุกคู่ จึงใช้ได้กับผลไม่กี่ชิ้น</li>
      <li>ระบบจริงใช้สองขั้น: bi-encoder คัดผู้สมัครจำนวนมาก แล้ว cross-encoder จัดอันดับ 10–100 ชิ้นบนสุด</li>
    </ul>
    <h2>ข้อจำกัดที่ควรรู้</h2>
    <ul>
      <li>embedding อ่านตัวเลขไม่เก่ง ในงานวิจัยหนึ่ง 13 โมเดลแม่นเฉลี่ยราว 54% กับคำถามการเงินที่ต้องเทียบตัวเลข จึงควรกรองตัวเลขด้วย filter</li>
      <li>คำปฏิเสธ เช่น "ไม่มีเบาหวาน" ยังถูกดึงมาเมื่อค้นคำว่าเบาหวาน ต้องมีขั้นกรองอีกชั้น</li>
    </ul>`,
  refs: [["blackboard", "ตาราง embedding, การแปลงคำ = ค้นหาแถว, การปรับค่าระหว่างฝึก"], ["choose", "bi-encoder กับ cross-encoder, pipeline สองขั้น, ตัวเลขและคำปฏิเสธ"]],
  mount(ui) {
    const st = { q: "my pet is hungry" };
    ui.text("คำถาม (ภาษาอังกฤษ)", st, "q", "type a query");
    ui.note("คำที่ encoder รู้จัก: " + Object.keys(TABLE).map((w) => `<code>${w}</code>`).join(" "));
    ui.note("<b>เอกสาร</b> (หน้าเว็บมี d5, d6 และคำศัพท์เพิ่มจากไฟล์ตัวอย่าง)<br>" + DOCV.map((d) => `${d.tag}: ${d.id}`).join("<br>"));
    const run = () => {
      const qv = encode(st.q, TABLE);
      return { qv, top: qv.some((x) => x) ? topK(qv, DOCV, 2) : [] };
    };
    return {
      draw(s) {
        s.axes(3.8); s.sphere(S);
        const { qv, top } = run();
        for (const d of DOCV) {
          const hit = top.some((t) => t.id === d.id);
          s.point(up(d.v), hit ? s.c.r : s.c.ink, d.tag, { r: hit ? 6.5 : 4.5 });
        }
        top.forEach((t, i) => s.line(up(qv), up(t.v), s.c.r, { width: 3 - i, alpha: 0.8 }));
        if (qv.some((x) => x)) s.arrow([0, 0, 0], up(qv), s.c.a, "q");
      },
      live() {
        const { qv, top } = run();
        const known = words(st.q).filter((w) => Object.prototype.hasOwnProperty.call(TABLE, w));
        if (!top.length) return `<p class="verdict">ยังไม่มีคำที่ encoder รู้จัก ลองพิมพ์คำจากรายการคำที่รู้จัก</p>`;
        const flow = `<ol class="flow">
          <li><span>คำที่รู้จัก</span><b>${known.join(", ")}</b></li>
          <li><span>เวกเตอร์ q</span><b>(${qv.map((x) => x.toFixed(2)).join(", ")})</b></li>
          <li><span>เทียบกับเอกสาร</span><b>${top.map((t) => `${t.tag} ${t.score.toFixed(3)}`).join(" , ")}</b></li></ol>`;
        return flow + `<p class="verdict">อันดับ 1: <b>${top[0].id}</b></p>`;
      },
    };
  },
};
