import { cosine, dot, normalize, fmt } from "../../lib/zvect.js";
import { M, esc } from "../js/kit.js";
import { LANGS, LANG, split, encodeTokens, chips, vecOf } from "../js/multilang.js";

// 6.2 Late interaction (ColBERT) (owner, 2026-10-11 16:06–16:08: put the ColBERT clip between Bi-Encoder and Cross-Encoder).
// One idea: keep one vector per token instead of one per sentence; each query token takes its best match in the document
// (MaxSim) and the matches are added up (Σ). Source: the Prompt Engineering ColBERT clip (tokenize, embed every token,
// compare every query token with every document token, combine; MaxSim + Σ from the paper figure on screen; a long chunk
// squeezed into one vector loses detail). Toy word vectors and documents d1–d6 are the ones of 6.1; d7 is a long chunk that
// mixes topics (author's choice). Toy token vectors do not depend on context — real ColBERT vectors do (said in the notes).
const SAMPLES = await fetch(new URL("../data/samples_late.json", import.meta.url)).then((r) => r.json());
const DOCS = [
  "cat and dog are pets",
  "eat rice and noodle",
  "write code on a computer",
  "the phone app has a bug",
  "my dog likes fish",
  "a robot pet that can bark",
  "my cat likes fish and rice and my phone app has a bug",
];
const known = (tokens) => tokens.filter((x) => x.c && x.c !== "NOT" && vecOf(x.c));
const tokVec = (x) => normalize(vecOf(x.c));                     // one unit vector per token (toy: no context)
const DOC = DOCS.map((text, i) => {
  const tk = split(text, "space");
  return { tag: "d" + (i + 1), text, tk, kn: known(tk), v: encodeTokens(tk) };
});
// late interaction: for every query token the best dot with a document token (MaxSim), then the sum (Σ)
function late(qk, d) {
  const rows = qk.map((q) => d.kn.map((t) => dot(tokVec(q), tokVec(t))));
  const best = rows.map((r) => (r.length ? Math.max(...r) : 0));
  return { rows, best, sum: best.reduce((a, b) => a + b, 0) };
}
function run(text, mode) {
  const qt = split(text, mode), qk = known(qt), q = encodeTokens(qt);
  const res = DOC.map((d) => ({ ...d, bi: qk.length ? cosine(q, d.v) : 0, li: late(qk, d) }));
  const top = (k) => (qk.length ? res.reduce((a, b) => (b[k] > a[k] + 1e-9 ? b : a)) : null);
  return { qt, qk, res, biTop: top("bi"), liTop: qk.length ? res.reduce((a, b) => (b.li.sum > a.li.sum + 1e-9 ? b : a)) : null };
}

export default {
  slug: "late-interaction",
  title: "Late interaction (ColBERT): เก็บเวกเตอร์ทุก token แล้วจับคู่ทีละคำ",
  en: "Late interaction (ColBERT)",
  example: "36_late_interaction",
  hint: "ภาพ 2 มิติ ตารางจับคู่ token ใช้ล้อเมาส์ (หรือสองนิ้ว) ซูม ลากเพื่อเลื่อน ดับเบิลคลิกเพื่อดูทั้งหมด",
  canvasLabel: "ตาราง แถวคือ token ของคำถาม คอลัมน์คือ token ของเอกสาร ช่องคือค่าความคล้าย ค่าที่สูงที่สุดในแต่ละแถวมีกรอบ และผลรวมอยู่ด้านล่าง",
  intro: `
    <p>bi-encoder (บท 6.1) อัด <b>ทั้งประโยคเป็นเวกเตอร์เดียว</b> ถ้าเอกสารยาวและมีหลายเรื่อง รายละเอียดจะถูกเฉลี่ยจนหาย
    <b>late interaction</b> (ColBERT) เก็บ <b>เวกเตอร์ทุก token</b> ไว้แทน</p>
    <p>ตอนค้น token แต่ละตัวของคำถามหา token ในเอกสารที่ใกล้ที่สุด (<b>MaxSim</b>) แล้วบวกทุกตัวเข้าด้วยกัน (<b>Σ</b>) เป็นคะแนนของเอกสาร
    (ผู้จัดทำวางบทนี้ไว้ตรงกลางระหว่าง bi-encoder ที่เร็วแต่หยาบ กับ cross-encoder บท 6.3 ที่ละเอียดแต่ช้า)</p>`,
  try: [
    "กดตัวอย่าง \"กินข้าวแล้วแก้บั๊ก\": bi-encoder เลือก d2 (เรื่องอาหารล้วน) แต่ late interaction เลือก d7 ซึ่งมีทั้ง rice และ bug",
    "กด \"แมวกับแอป\": bi-encoder เลือก d6 (หุ่นยนต์สัตว์เลี้ยง) ส่วน late interaction เลือก d7 ที่มีทั้ง cat และ app",
    "กด \"หมากินปลา\" ภาษา EN: ทั้งสองวิธีได้ d5 (คำว่า eats ไม่อยู่ในพจนานุกรม และ d7 ได้คะแนนเท่ากันแต่มาทีหลัง) สลับเป็น TH: มีคำว่า กิน เพิ่ม late interaction จึงเลือก d7 เพราะเอกสารยาวมี rice ให้จับคู่ด้วย",
    "สลับภาษาในช่องข้อความเป็น TH แล้วเลือก \"ตัดคำ\" เป็นช่องว่าง: token ที่รู้จักหายหมด ตารางว่าง (ต้องตัดคำก่อนเสมอ บท 3.1)",
  ],
  steps: [
    ["ตัดเป็น token", "ทั้งคำถามและเอกสาร (บท 3.1) เก็บเฉพาะ token ที่มีเวกเตอร์"],
    ["เวกเตอร์ทุก token", "ไม่เฉลี่ยรวมเป็นตัวเดียว เอกสารยาวจึงมีหลายเวกเตอร์"],
    ["MaxSim", "token แต่ละตัวของคำถามเลือกค่าความคล้ายที่สูงที่สุดในเอกสาร"],
    ["Σ รวมคะแนน", "บวกค่าที่เลือกได้ของทุก token เป็นคะแนนของเอกสาร แล้วเรียงจากมากไปน้อย"],
  ],
  stepsWhy: "bi-encoder มีแค่ \"เวกเตอร์เดียว แล้ว cosine ครั้งเดียว\" late interaction แยกเป็นสี่ขั้นนี้เพื่อให้ทุก token มีส่วนในคะแนน",
  lines: [
    [M.math(M.v("q"), M.o("="), M.tuple([M.sub(M.i("q"), M.n(1)), M.o("…"), M.sub(M.i("q"), M.i("n"))]), M.o(","), M.v("d"), M.o("="), M.tuple([M.sub(M.i("d"), M.n(1)), M.o("…"), M.sub(M.i("d"), M.i("m"))])),
      "ตัดเป็น token · q = คำถาม มี n token · d = เอกสาร มี m token · นับเฉพาะ token ที่พจนานุกรมมีเวกเตอร์ (ตัวที่ไม่รู้จักข้ามไป)"],
    [M.math(M.sub(M.v("e"), M.i("t")), M.o("="), M.fn("normalize"), M.row(M.o("("), M.t("vector of\u00a0"), M.i("t"), M.o(")"))),
      "เวกเตอร์ของแต่ละ token ยาว 1 · ในของเล่นนี้เอามาจากพจนานุกรมตรง ๆ (ไม่ขึ้นกับคำรอบข้าง) ส่วน ColBERT จริงคำนวณจากประโยคทั้งประโยค (contextualized)"],
    [M.math(M.sub(M.t("best"), M.i("i")), M.o("="), M.sub(M.fn("max"), M.i("j")), M.sub(M.v("e"), M.sub(M.i("q"), M.i("i"))), M.o("·"), M.sub(M.v("e"), M.sub(M.i("d"), M.i("j")))),
      "MaxSim · token ที่ i ของคำถามเทียบกับ token ทุกตัว j ของเอกสาร แล้วเก็บค่าที่สูงที่สุด · ยาว 1 ทั้งคู่ dot จึงเท่ากับ cosine (บท 2.3)"],
    [M.math(M.fn("score"), M.row(M.o("("), M.v("q"), M.o(","), M.v("d"), M.o(")")), M.o("="), M.sum(M.row(M.i("i"), M.o("="), M.n(1)), M.i("n")), M.sub(M.t("best"), M.i("i"))),
      "Σ รวมคะแนน · บวก best ของทุก token ในคำถาม · ค่าสูงสุดเป็นไปได้ = n (ทุก token เจอคู่ที่เหมือนกันพอดี) · เอกสารที่คะแนนสูงกว่าขึ้นก่อน"],
  ],
  formulaFrom: "การตัดเป็น token, เวกเตอร์ทุก token, การเทียบทุก token ของคำถามกับทุก token ของเอกสารแล้วรวมเป็นคะแนน และปัญหาที่ chunk ยาวถูกบีบเป็นเวกเตอร์เดียว มาจากคลิป ColBERT ของ Prompt Engineering · MaxSim และ Σ อ่านจากรูปในเปเปอร์ที่ผู้สอนเปิดบนจอ · เวกเตอร์คำของเล่น เอกสาร d1–d6 (ชุดเดียวกับบท 6.1) และ d7 (chunk ยาวหลายเรื่อง) เป็นสิ่งที่ผู้จัดทำเลือก",
  symbols: [
    ["q, d", "คำถาม และเอกสาร (หลังตัดเป็น token)", "ช่องข้อความ และ d1–d7"],
    ["n, m", "จำนวน token ที่รู้จักในคำถาม และในเอกสาร", "เป็นจำนวนแถว และจำนวนคอลัมน์ของตาราง"],
    ["e<sub>t</sub>", "เวกเตอร์ยาว 1 ของ token t", "มาจากพจนานุกรม (หน้า <a href=\"#/dict\">พจนานุกรม</a>)"],
    ["·", "dot product (บท 2.2)", "ยาว 1 ทั้งคู่ = cosine"],
    ["best<sub>i</sub>", "ค่าที่ดีที่สุดของ token ที่ i (MaxSim)", "ช่องที่มีกรอบในตาราง"],
    ["Σ", "บวกทุกแถว", "คะแนนของเอกสาร"],
  ],
  symbolsNote: `<h2>เอกสาร (ภาษาอังกฤษ)</h2><p class="vocab">${DOC.map((d) => `${d.tag} ${esc(d.text)}`).join(" · ")}</p>
    <p class="fine">d1–d6 ชุดเดียวกับบท 6.1 · d7 เป็น chunk ยาวที่มีหลายเรื่อง (ผู้จัดทำเพิ่มเพื่อให้เห็นเรื่องที่คลิปพูด: เวกเตอร์เดียวเฉลี่ยรายละเอียดหาย)</p>`,
  notes: `
    <h2>จากคลิป ColBERT (Prompt Engineering)</h2>
    <ul>
      <li>dense embedding ใน RAG ใช้เวกเตอร์เดียวต่อ chunk ถ้า chunk เป็นหลายย่อหน้า ทุกอย่างถูกบีบลงเวกเตอร์เดียว ซึ่งอาจแทนทั้ง chunk ไม่ได้ ผู้สอนเรียกว่าการเสียข้อมูล</li>
      <li>ColBERT (contextualized late interaction): ตัดเอกสารและคำถามเป็น token, ทำ embedding ทุก token (ขึ้นกับบริบท), ทุก token ของคำถามเทียบกับทุก token ของเอกสาร แล้วรวมเป็นคะแนน
        ผู้สอนบอกว่าเป็นคำอธิบายแบบง่าย ส่วนวิธีรวม (MaxSim แล้ว Σ) อ่านจากรูปของเปเปอร์ที่ขึ้นบนจอ</li>
      <li>ลองจริงด้วย RAGatouille บนเปเปอร์ Orca: chunk 256 → 219 passages (log บนจอ: ราว 34,104 embeddings คือหนึ่งเวกเตอร์ต่อ token)
        ในตัวอย่างของคลิป ColBERT ไม่ดึงหน้าสารบัญมาปน ส่วน dense (OpenAI, BGE small) ดึงมา แต่ผู้สอนบอกเองว่าเป็นตัวอย่างเดียว และ dense ตัวใหญ่ได้ผลใกล้เคียง</li>
    </ul>
    <h2>ของเล่นในบทนี้ต่างจาก ColBERT จริงตรงไหน (ผู้จัดทำ)</h2>
    <ul>
      <li>เวกเตอร์ของ token มาจากพจนานุกรม 3 มิติ ไม่ขึ้นกับคำรอบข้าง และคำที่มีความหมายกลุ่มเดียวกัน เช่น cat กับ dog ได้เวกเตอร์เดียวกัน</li>
      <li>เอกสารยาวมีคำมาก จึงมีโอกาสได้คะแนน Σ สูง (d7 เสมอกับเอกสารที่ตรงกว่าในบางคำถาม) ตารางจึงแสดงคะแนนทั้งสองแบบไว้คู่กัน</li>
      <li>ต้นทุน: เก็บหนึ่งเวกเตอร์ต่อ token ใช้ที่มากกว่าหนึ่งเวกเตอร์ต่อเอกสารหลายเท่า (ในคลิป 219 passages → ราว 34,104 เวกเตอร์) และต้องเทียบ n × m คู่ต่อเอกสาร</li>
    </ul>`,
  refs: [["colbert", "ปัญหาเวกเตอร์เดียวต่อ chunk, เวกเตอร์ทุก token, เทียบทุก token ของคำถามกับทุก token ของเอกสารแล้วรวม, MaxSim + Σ (รูปบนจอ), 219 passages / 34,104 embeddings"],
    ["choose", "bi-encoder กับ cross-encoder (ผู้จัดทำวาง late interaction ไว้ระหว่างสองแบบ)"]],
  mount(ui) {
    const st = { type: "en", mode: "dict", text: { ...SAMPLES[0].text }, pick: "auto" };
    ui.panel.classList.add("stack");
    const opts = LANGS.map((l) => [l.id, l.label, l.css]);
    // the learner's text first (owner, 15:45), then samples, word cutting, which document the table shows
    const box = ui.tagText("คำถาม", opts, st, "type", "text", "พิมพ์คำถาม");
    ui.buttons("ตัวอย่าง (เติมครบ 4 ภาษา)", SAMPLES.map((p) => [p.label, () => { st.text = { ...p.text }; box.sync(); }]),
      { pressed: () => SAMPLES.findIndex((p) => p.text[st.type] === st.text[st.type]) });
    ui.choice("ตัดคำ", [["space", "ช่องว่าง"], ["dict", "พจนานุกรม"]], st, "mode");
    ui.choice("ตารางของเอกสาร", [["auto", "อันดับ 1"], ...DOC.map((d) => [d.tag, d.tag])], st, "pick");
    const cur = () => run(st.text[st.type] || "", st.mode);
    const shownDoc = (r) => (st.pick === "auto" ? r.liTop || r.res[0] : r.res.find((d) => d.tag === st.pick));
    return {
      zoom2d: true,
      draw2d(g, W, H, c, view) {
        const r = cur(), d = shownDoc(r), L = LANG[st.type], font = getComputedStyle(g.canvas).fontFamily;
        const pad = 14, cellW = 64, cellH = 34, left = 120, top = 74;
        const cols = d.kn, rows = r.qk;
        const w = left + Math.max(cols.length, 1) * cellW + 120, h = top + Math.max(rows.length, 1) * cellH + 70;
        const fit = Math.min(1, W / w, H / h), v = view || { zoom: 1, x: 0, y: 0 }, s = fit * v.zoom;
        v.x = Math.min(0, Math.max(Math.min(0, W - w * s), v.x)); v.y = h * s <= H ? (H - h * s) / 2 : Math.min(0, Math.max(H - h * s, v.y));
        g.save(); g.translate(v.x, v.y); g.scale(s, s);
        g.textBaseline = "middle";
        g.fillStyle = c.muted; g.font = `600 13px ${font}`; g.textAlign = "left";
        g.fillText(`${d.tag}: ${d.text}`.slice(0, 80), pad, 18);
        g.fillText(`แถว = token ของคำถาม (${L.label}) · คอลัมน์ = token ของเอกสาร`, pad, 38);
        if (!rows.length) { g.fillStyle = c.r; g.font = `700 15px ${font}`; g.fillText("คำถามไม่มี token ที่รู้จัก", pad, top + 20); g.restore(); return; }
        g.textAlign = "center"; g.font = `700 14px ${font}`;
        cols.forEach((t, j) => { g.fillStyle = c.ink; g.fillText(t.t, left + j * cellW + cellW / 2, top - 14); });
        rows.forEach((q, i) => {
          const y = top + i * cellH;
          g.textAlign = "right"; g.fillStyle = c[L.sc]; g.font = `700 14px ${font}`; g.fillText(q.t, left - 10, y + cellH / 2);
          g.textAlign = "center";
          const row = d.li.rows[i], best = d.li.best[i], jm = row.indexOf(best);
          row.forEach((val, j) => {
            const x = left + j * cellW, hot = j === jm;
            g.strokeStyle = hot ? c.r : c.grid; g.lineWidth = hot ? 2.2 : 1;
            g.beginPath(); g.roundRect ? g.roundRect(x + 3, y + 3, cellW - 6, cellH - 6, 5) : g.rect(x + 3, y + 3, cellW - 6, cellH - 6); g.stroke();
            g.fillStyle = hot ? c.r : c.muted; g.font = `${hot ? 700 : 400} 13.5px ${font}`; g.fillText(fmt(val), x + cellW / 2, y + cellH / 2);
          });
          g.textAlign = "left"; g.fillStyle = c.r; g.font = `700 14px ${font}`;
          g.fillText(cols.length ? `max ${fmt(best)}` : "max 0", left + Math.max(cols.length, 1) * cellW + 10, y + cellH / 2);
        });
        g.fillStyle = c.y; g.font = `700 16px ${font}`; g.textAlign = "left";
        g.fillText(`Σ = ${fmt(d.li.sum)}`, left + Math.max(cols.length, 1) * cellW + 10, top + rows.length * cellH + 22);
        g.restore();
      },
      live() {
        const r = cur(), d = shownDoc(r), L = LANG[st.type];
        const toks = `<div class="toks"><span class="lab">${L.label} ตัดแบบ${st.mode === "dict" ? "พจนานุกรม" : "ช่องว่าง"}:</span>${chips(r.qt, L.css)}</div>`;
        if (!r.qk.length) return toks + `<p class="verdict">คำถามไม่มี token ที่รู้จัก จึงคิดคะแนนไม่ได้</p>`;
        const head = M.math(M.fn("score"), M.row(M.o("("), M.v("q"), M.o(","), M.t(d.tag), M.o(")")), M.o("="),
          ...d.li.best.flatMap((b, i) => (i ? [M.o("+"), M.n(fmt(b), "res")] : [M.n(fmt(b), "res")])), M.o("="), M.n(fmt(d.li.sum), "cy"));
        const same = r.biTop.tag === r.liTop.tag;
        const say = same ? `ทั้งสองวิธีได้อันดับ 1 เดียวกัน: <b>${r.liTop.tag}</b>`
          : `bi-encoder (บท 6.1) เลือก <b>${r.biTop.tag}</b> · late interaction เลือก <b>${r.liTop.tag}</b>`;
        const rows = [...r.res].sort((a, b) => b.li.sum - a.li.sum || b.bi - a.bi).map((x) =>
          `<tr class="${x.tag === d.tag ? "win" : ""}"><td>${x.tag}</td><td>${fmt(x.li.sum)}${x.tag === r.liTop.tag ? " ★" : ""}</td><td>${fmt(x.bi)}${x.tag === r.biTop.tag ? " ★" : ""}</td></tr>`).join("");
        return toks + head + `<p class="verdict">${say}</p>` +
          `<p class="fintro">ทุกเอกสาร (เรียงตาม late interaction · ★ = อันดับ 1 ของแต่ละวิธี · ข้อความของ d1–d7 อยู่ใต้ตารางอ่านสูตร):</p><div class="scroll"><table class="rank"><thead><tr><th>เอกสาร</th><th>Σ MaxSim</th><th>cos (6.1)</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
