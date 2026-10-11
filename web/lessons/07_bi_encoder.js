import { encode, topK, words } from "/lib/zvect.js";
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
  example: "07_bi_encoder",
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
  formula: M.math(M.v("q"), M.o("="), M.fn("normalize"), M.row(M.o("("),
      M.frac(M.n(1), M.i("n")), M.sum(M.row(M.i("w"), M.o("∈"), M.t("คำที่รู้จัก")), M.t("")), M.sub(M.v("e"), M.i("w")), M.o(")"))) +
    M.math(M.fn("score"), M.row(M.o("("), M.v("q"), M.o(","), M.v("d"), M.o(")")), M.o("="), M.v("q"), M.o("·"), M.v("d"),
      M.o("&#x2003;"), M.t("(ยาว 1 ทั้งคู่ dot = cosine)")) +
    `<p class="verdict">n = จำนวนคำในคำถามที่ encoder รู้จัก, e<sub>w</sub> = เวกเตอร์ของคำ w</p>`,
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
