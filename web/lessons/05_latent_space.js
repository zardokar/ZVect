import { add, sub, topK, cosine } from "../../lib/zvect.js";
import { M, AX } from "../js/kit.js";

// 3 hidden "meanings": x = royal, y = gender (+male / −female), z = adult
const W = {
  king: [0.9, 0.9, 0.9], queen: [0.9, -0.9, 0.9],
  man: [0.1, 0.9, 0.9], woman: [0.1, -0.9, 0.9],
  prince: [0.8, 0.9, 0.2], princess: [0.8, -0.9, 0.2],
  boy: [0.1, 0.9, 0.1], girl: [0.1, -0.9, 0.1],
};
const S = 3; // draw scale so points are not crowded at the origin
const up = (v) => v.map((x) => x * S);
const words = Object.keys(W).map((w) => [w, w]);

export default {
  slug: "latent-space",
  title: "Latent space: พื้นที่ของความหมาย",
  en: "Latent space",
  example: "05_latent_space",
  axisNames: ["royal", "gender", "adult"],
  view: { dist: 15, pitch: 0.3 },
  intro: `
    <p><b>Latent space</b> คือ vector space ที่โมเดล AI เรียนรู้เองว่าจะวางคำหรือรูปภาพไว้ตรงไหน
    (latent = แฝง) ของที่ความหมายคล้ายกันจะอยู่ใกล้กัน และ <b>ทิศทาง</b> ก็มีความหมาย
    เช่น ทิศจาก man ไป woman คือ "เปลี่ยนเพศ"</p>
    <p>โมเดลจริงมีหลายร้อยถึงหลายพันมิติ (word2vec ใช้ 300) และแกนเดี่ยว ๆ มักอ่านความหมายไม่ออก
    บทนี้เราจึง <b>ตั้งชื่อแกนเองแค่ 3 แกน</b> ให้มองเห็นได้:
    x = ความเป็นราชวงศ์, y = เพศ (+ชาย, −หญิง), z = ความเป็นผู้ใหญ่</p>`,
  try: [
    "ค่าเริ่มต้นคือ king − man + woman ผลลัพธ์ตกลงตรง queen พอดี",
    "ลอง prince − boy + girl แล้วดูว่าได้คำไหน",
  ],
  lines: [
    [M.math(M.v("x"), M.o("="), M.v("A"), M.o("−"), M.v("B"), M.o("+"), M.v("C")),
      "สร้างเวกเตอร์ใหม่ · A, B, C = คำที่เลือก เช่น king − man + woman · ลบ B = เอาความหมายของ B ออก · บวก C = ใส่ความหมายของ C เข้าไป"],
    [M.math(M.t("answer"), M.o("="), M.sub(M.t("argmax"), M.i("w")), M.o("&#x2061;"), M.fn("cos"), M.row(M.o("("), M.v("x"), M.o(","), M.v("w"), M.o(")"))),
      "หาคำในคลังที่ใกล้ x ที่สุด · w = แต่ละคำในคลัง · argmax = ลองทุก w แล้วเลือกตัวที่ cos สูงสุด · ตอบเป็นคำ ไม่ใช่ตัวเลข"],
  ],
  symbols: [["A, B, C", "เวกเตอร์ของคำที่เลือก เช่น king, man, woman", ""], ["x = A − B + C", "เอาความหมายของ B ออก แล้วใส่ความหมายของ C", "king − man + woman = ราชา ที่เปลี่ยนจากชายเป็นหญิง"], ["w", "เวกเตอร์ของคำแต่ละคำในคลัง", "ผู้สมัครที่จะเป็นคำตอบ"], ["argmax cos(x, w)", "ลองทุกคำ w แล้วเลือกคำที่ cosine กับ x สูงที่สุด", "ตอบเป็น \"คำ\" ไม่ใช่ตัวเลข"]],
  notes: `
    <h2>ทำไมไม่ใช้เลขประจำคำ หรือ one-hot</h2>
    <ul>
      <li>ให้เลขกับคำตรง ๆ (เช่น good = 6, bad = 22, great = 21) ทำให้โมเดลคิดว่า bad กับ great ใกล้กันเพราะเลขติดกัน</li>
      <li>one-hot (มี 1 ตัวเดียว ที่เหลือ 0) แก้เรื่องนี้ได้ แต่ยาวเท่าจำนวนคำทั้งหมด (เช่น 50,000 มิติ) และทุกคำห่างกันเท่ากันหมด จึงไม่มีความหมาย</li>
    </ul>
    <h2>embedding = เวกเตอร์สั้นที่ตำแหน่งมีความหมาย</h2>
    <ul>
      <li>แต่ละมิติเหมือนคำถามหนึ่งข้อ (เป็นสัตว์ไหม เป็นสัตว์เลี้ยงไหม กินได้ไหม) ตอบเป็นค่า 0–1 ไม่ใช่แค่ใช่/ไม่ใช่ เช่น สิงโตเป็นสัตว์เลี้ยงได้น้อย</li>
      <li>ในโมเดลจริงเราไม่ได้ตั้งชื่อมิติเอง ค่าเริ่มแบบสุ่ม แล้วถูกปรับระหว่างฝึกจนคำที่ใช้ในบริบทคล้ายกันอยู่ใกล้กัน</li>
      <li>ขนาดที่ใช้จริง: Word2Vec 300 มิติ, GPT-2 768 ถึง 1,600 มิติ</li>
      <li>บวกลบได้: king − man + woman ใกล้ queen และตัวอย่างในคลิป Beijing − China + Japan ใกล้ Tokyo</li>
    </ul>
    <h2>ใช้ทำอะไร</h2>
    <p>ระบบแนะนำ, ค้นหาด้วยความหมาย (ข้อความหรือรูป), แชตบอตตอบจากเอกสาร และหาสิ่งผิดปกติที่หลุดออกนอกกลุ่ม</p>`,
  refs: [["wordemb", "ปัญหาของเลขประจำคำและ one-hot, king − man + woman, Beijing − China + Japan"], ["sofar", "มิติเหมือนคำถามที่ตอบเป็นค่า 0–1, ขนาด Word2Vec และ GPT"], ["beginner", "ตัวอย่างการใช้งาน: แนะนำ ค้นหา แชตบอต หาสิ่งผิดปกติ"]],
  mount(ui) {
    const st = { A: "king", B: "man", C: "woman" };
    ui.select("A − B + C", [["A", ""], ["B", "−"], ["C", "+"]], words, st);
    const calc = () => {
      const x = add(sub(W[st.A], W[st.B]), W[st.C]);
      const items = Object.entries(W).filter(([w]) => ![st.A, st.B, st.C].includes(w)).map(([id, v]) => ({ id, v }));
      return { x, best: topK(x, items, 1)[0] };
    };
    return {
      draw(s) {
        s.grid(); s.axes(4);
        const { x, best } = calc();
        for (const [w, v] of Object.entries(W)) {
          const hit = best && w === best.id;
          s.line(up(v), [v[0] * S, 0, v[2] * S], s.c.grid, { dash: [2, 4] });
          s.point(up(v), hit ? s.c.r : s.c.ink, w, { r: hit ? 7 : 4.5 });
        }
        // B -> A is a "meaning direction"; apply it at C
        s.arrow(up(W[st.B]), up(W[st.A]), s.c.a, "", { width: 2 });
        s.arrow(up(W[st.C]), up(x), s.c.a, "", { width: 2 });
        s.point(up(x), s.c.r, "", { r: 9, ring: true });
        s.label(up(x), "ผลลัพธ์", s.c.r, { dx: -14, align: "right" });
      },
      live() {
        const { x, best } = calc();
        return M.math(
          M.t(st.A), M.o("−"), M.t(st.B), M.o("+"), M.t(st.C), M.o("="),
          M.tuple(x.map((c, i) => M.n(c, AX[i])))
        ) + `<p class="verdict">ใกล้ที่สุด: <b>${best.id}</b> (cos = ${cosine(x, W[best.id]).toFixed(3)})</p>`;
      },
    };
  },
};
