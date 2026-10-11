import { encode, topK, words } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// toy word vectors. axes: x = food, y = animal, z = tech
const TABLE = {
  eat: [1, 0, 0], rice: [1, 0, 0], noodle: [1, 0, 0], hungry: [0.9, 0.1, 0], feed: [0.8, 0.2, 0],
  cat: [0, 1, 0], dog: [0, 1, 0], pets: [0, 1, 0], code: [0, 0, 1], computer: [0, 0, 1],
};
const DOCS = ["the dog is not hungry", "feed my hungry dog rice", "cat and dog are pets", "eat rice and noodle", "write code on a computer"];
const DOCV = DOCS.map((d, i) => ({ id: d, tag: "d" + (i + 1), v: encode(d, TABLE) }));
const S = 3.2;
const up = (v) => v.map((x) => x * S);

// toy reranker: reads query and doc together. Count query words in the doc that are not right after "no" / "not".
function matches(query, doc) {
  const q = new Set(words(query)), w = words(doc), found = new Set();
  w.forEach((x, i) => { if (q.has(x) && !(i > 0 && (w[i - 1] === "no" || w[i - 1] === "not"))) found.add(x); });
  return found.size;
}

export default {
  slug: "reranker",
  title: "Reranker: คัดเร็วก่อน แล้วจัดอันดับใหม่ให้แม่น",
  en: "Reranker",
  example: "14_reranker",
  axisNames: ["food", "animal", "tech"],
  view: { dist: 10, yaw: 0.7 },
  intro: `
    <p>bi-encoder (บทก่อน) อัดทั้งเอกสารเป็นเวกเตอร์เดียวก่อนเห็นคำถาม จึงพลาดรายละเอียด เช่นคำว่า <b>not</b>:
    "the dog is not hungry" ได้เวกเตอร์เดียวกับ "hungry dog" พอดี</p>
    <p>ระบบจริงจึงค้นสองขั้น: <b>ขั้น 1</b> bi-encoder คัดผู้สมัครอย่างเร็ว (บทนี้ 3 ชิ้น)
    <b>ขั้น 2</b> reranker อ่านคำถามกับเอกสาร <b>พร้อมกันทีละคู่</b> แล้วจัดอันดับใหม่ ช้ากว่าแต่แม่นกว่า จึงใช้กับผู้สมัครไม่กี่ชิ้น</p>
    <p>reranker ในบทนี้เป็นของจำลอง: นับคำของคำถามที่อยู่ในเอกสาร โดยไม่นับคำที่ตามหลัง no / not แล้วบวก cosine ไว้ตัดสินเมื่อเสมอ</p>`,
  try: [
    "ดูขั้น 1: \"the dog is not hungry\" ได้อันดับ 1 ด้วย cosine 1.000",
    "สลับเป็นขั้น 2: \"feed my hungry dog rice\" ขึ้นมาอันดับ 1 แทน",
    "พิมพ์ \"hungry cat\" แล้วดูว่าสองขั้นเห็นตรงกันไหม",
  ],
  lines: [
    [M.math(M.t("top 3 by\u00a0"), M.fn("cos"), M.row(M.o("("), M.v("q"), M.o(","), M.v("d"), M.o(")"))),
      "ขั้น 1 (bi-encoder): ให้คะแนนทุกเอกสารด้วย cos แล้วเก็บ 3 อันดับแรก · <b>q</b>, <b>d</b> ตัวหนา = เวกเตอร์ของคำถามและเอกสาร · เร็ว จึงใช้คัดจากของจำนวนมาก"],
    [M.math(M.fn("score"), M.row(M.o("("), M.i("q"), M.o(","), M.i("d"), M.o(")")), M.o("="), M.fn("matched"), M.row(M.o("("), M.i("q"), M.o(","), M.i("d"), M.o(")")), M.o("+"), M.fn("cos"), M.row(M.o("("), M.v("q"), M.o(","), M.v("d"), M.o(")"))),
      "ขั้น 2 (reranker): อ่านข้อความคำถาม q กับเอกสาร d (ตัวเอียง = ข้อความ) · matched = จำนวนคำของคำถามที่เจอในเอกสาร ไม่นับคำหลัง no / not · บวก cos ไว้ตัดสินตอนนับคำได้เท่ากัน"],
  ],
  symbols: [
    ["q, d (ตัวหนา)", "เวกเตอร์ของคำถามและเอกสาร ทำแยกกันจาก encoder", "เวกเตอร์เอกสารทำไว้ล่วงหน้าได้"],
    ["cos(q, d)", "ขั้น 1: คะแนนของ bi-encoder", "เร็ว ใช้คัดจากเอกสารจำนวนมาก"],
    ["q, d (ตัวเอียง)", "ข้อความของคำถามและเอกสาร (ไม่ใช่เวกเตอร์)", "reranker อ่านข้อความทั้งคู่พร้อมกัน"],
    ["คำที่ตรง (ไม่ถูกปฏิเสธ)", "จำนวนคำของคำถามที่เจอในเอกสาร ไม่นับคำหลัง no / not", "ตัวอย่าง: \"dog is not hungry\" นับได้แค่ dog = 1"],
    ["score(q, d)", "ขั้น 2: คะแนนใหม่ ใช้เรียงผู้สมัครใหม่", "cos อยู่ระหว่าง 0–1 จึงตัดสินแค่ตอนนับคำได้เท่ากัน"],
  ],
  notes: `
    <h2>bi-encoder กับ cross-encoder</h2>
    <ul>
      <li><b>bi-encoder</b> แปลงคำถามกับเอกสารแยกกัน เทียบด้วย dot หรือ cosine เร็วพอค้นเอกสารนับล้าน</li>
      <li><b>cross-encoder</b> (reranker จริง) ป้อนคำถามกับเอกสารเข้าโมเดลพร้อมกัน ให้ attention ดูทุกคู่คำ
        เช่นรู้ว่า "apple" ในคำถามโยงกับ "fruit" ในเอกสาร ไม่ใช่บริษัท</li>
      <li>ต้องรันโมเดลหนึ่งรอบต่อหนึ่งคู่และคำนวณล่วงหน้าไม่ได้ จึงช้า</li>
      <li>รูปแบบมาตรฐาน: bi-encoder คัดผู้สมัครจำนวนมาก แล้ว cross-encoder จัดอันดับเฉพาะ 10–100 ชิ้นบนสุด</li>
    </ul>
    <h2>ทำไมคุ้ม</h2>
    <ul>
      <li>ในงานวิจัยหนึ่งบนเอกสารนโยบายสาธารณสุข ค่า faithfulness ของคำตอบเพิ่มจาก 0.621 (RAG พื้นฐาน) เป็น 0.797 เมื่อเพิ่ม cross-encoder rerank</li>
      <li>embedding มัก "เห็นคำแล้วตอบใช่" แม้มีคำปฏิเสธ เช่นบันทึกที่เขียนว่าไม่มีเบาหวาน ยังถูกดึงมาเมื่อค้นเบาหวาน reranker หรือ LLM ตรวจซ้ำช่วยกรองได้</li>
    </ul>`,
  refs: [["choose", "bi-encoder กับ cross-encoder, pipeline สองขั้น 10–100 ชิ้น, faithfulness 0.621 → 0.797, ปัญหาคำปฏิเสธ"]],
  mount(ui) {
    const st = { q: "hungry dog", stage: "2" };
    ui.text("คำถาม (ภาษาอังกฤษ)", st, "q", "type a query");
    ui.choice("แสดงผล", [["1", "ขั้น 1: bi-encoder"], ["2", "ขั้น 2: rerank"]], st, "stage");
    ui.note("คำที่รู้จัก: " + Object.keys(TABLE).map((w) => `<code>${w}</code>`).join(" "));
    const run = () => {
      const qv = encode(st.q, TABLE);
      if (!qv.some((x) => x)) return { qv, s1: [], s2: [] };
      const s1 = topK(qv, DOCV, 3).map((r) => ({ ...r, tag: DOCV.find((d) => d.id === r.id).tag }));
      const s2 = s1.map((r) => ({ ...r, m: matches(st.q, r.id), rs: matches(st.q, r.id) + r.score })).sort((a, b) => b.rs - a.rs);
      return { qv, s1, s2 };
    };
    return {
      draw(s) {
        s.axes(3.8); s.sphere(S);
        const { qv, s1, s2 } = run();
        const list = st.stage === "1" ? s1 : s2;
        for (const d of DOCV) {
          const k = list.findIndex((t) => t.id === d.id);
          s.point(up(d.v), k === 0 ? s.c.r : k > 0 ? s.c.b : s.c.ink, k >= 0 ? `${k + 1}. ${d.tag}` : d.tag, { r: k === 0 ? 7 : k > 0 ? 5.5 : 4 });
        }
        if (list.length) s.line(up(qv), up(list[0].v), s.c.r, { width: 3 });
        if (qv.some((x) => x)) s.arrow([0, 0, 0], up(qv), s.c.a, "q");
      },
      live() {
        const { s1, s2 } = run();
        if (!s1.length) return `<p class="verdict">ยังไม่มีคำที่ encoder รู้จัก</p>`;
        const rank2 = (id) => s2.findIndex((r) => r.id === id) + 1;
        const rows = s1.map((r, i) => `<tr class="${(st.stage === "1" ? i === 0 : rank2(r.id) === 1) ? "win" : ""}"><td>${r.tag}</td><td>${r.id}</td>
          <td class="nw">${i + 1} <span class="dim">${r.score.toFixed(3)}</span></td><td>${matches(st.q, r.id)}</td><td class="nw">${rank2(r.id)} <span class="dim">${(matches(st.q, r.id) + r.score).toFixed(3)}</span></td></tr>`).join("");
        const moved = s1[0].id !== s2[0].id;
        return `<p class="fintro">ขั้น 1 = อันดับตาม cos · ตรง = จำนวนคำของคำถามที่เจอ · ขั้น 2 = อันดับตาม score (ตรง + cos)</p><div class="scroll"><table class="rank"><thead><tr><th></th><th>เอกสาร</th><th>ขั้น 1</th><th>ตรง</th><th>ขั้น 2</th></tr></thead><tbody>${rows}</tbody></table></div>
          <p class="verdict">${moved ? `reranker เปลี่ยนอันดับ 1 จาก <b>${s1[0].id}</b> เป็น <b>${s2[0].id}</b>` : "สองขั้นได้อันดับ 1 ตรงกัน"}</p>`;
      },
    };
  },
};
