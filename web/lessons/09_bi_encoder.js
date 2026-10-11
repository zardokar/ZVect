import { cosine, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { LANGS, LANG, AXIS_NAMES, SAMPLES, split, encodeTokens, chips, vocab, mountPanel, sampleOf } from "../js/multilang.js";
const escV = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Bi-Encoder in four languages (WIP202610029, owner 2026-10-11 13:42): the same sentence in EN / TH / 中文 / 日本語,
// one shared toy vocabulary, documents stay in English. Shows (1) same meaning -> same place, whatever the language,
// (2) it only works when the text is cut into words first: Thai, Chinese and Japanese have no spaces between words.
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
const DOCV = DOCS.map((d, i) => ({ tag: "d" + (i + 1), text: d, v: encodeTokens(split(d, "space")) })); // encoded once, offline
// six samples, each written in all four languages, and the document that should come first: web/data/samples.json

function search(text, mode) {                         // -> { tokens, q, top: {tag, text, score} | null }
  const tokens = split(text, mode), q = encodeTokens(tokens);
  if (!q.some((x) => x)) return { tokens, q, top: null };
  let top = null;
  for (const d of DOCV) { const s = cosine(q, d.v); if (!top || s > top.score) top = { ...d, score: s }; }
  return { tokens, q, top };
}
// accuracy of the six samples per language and split mode (fixed, so worked out once)
const ACC = Object.fromEntries(LANGS.map((l) => [l.id, Object.fromEntries(["space", "dict"].map((m) =>
  [m, SAMPLES.filter((s) => search(s.text[l.id], m).top?.tag === s.want).length]))]));

const bar = (n, css) => `<span class="bar${n ? "" : " zero"}" style="--c: var(${css}); width: ${Math.round((n / SAMPLES.length) * 44)}px"></span>${n}/${SAMPLES.length}`;

export default {
  slug: "bi-encoder",
  title: "Bi-Encoder: ค้นหาด้วยความหมาย 4 ภาษา",
  en: "Bi-Encoder",
  example: "09_bi_encoder",
  axisNames: AXIS_NAMES,
  view: { dist: 10, yaw: 0.7 },
  intro: `
    <p><b>Bi-Encoder</b> แปลงคำถามและเอกสาร <b>แยกกัน</b> เป็นเวกเตอร์ แล้วเทียบด้วย cosine เอกสารแปลงเก็บไว้ล่วงหน้าได้ ตอนค้นจึงแปลงแค่คำถาม เร็วมาก</p>
    <p>encoder หลายภาษาวางคำที่ความหมายเดียวกันไว้ใกล้กัน เช่น "หิว", "hungry", "饿", "空腹" (ในของเล่นบทนี้ได้เวกเตอร์เท่ากันพอดี) ถามภาษาไทยจึงเจอเอกสารภาษาอังกฤษได้
    แต่ต้อง <b>ตัดคำ</b> ให้ถูกก่อน เพราะภาษาไทย จีน ญี่ปุ่น ไม่เว้นวรรคระหว่างคำ</p>
    <p>encoder ในบทนี้เป็นของจำลอง: เอาเวกเตอร์ของคำที่รู้จักมาเฉลี่ย แล้วย่อให้ยาว 1</p>`,
  try: [
    "กด \"ทั้งหมด\": อันดับ 1 เป็น d5 ทุกภาษา แต่ลูกศร EN ต่างจากอีกสามภาษาราว 27° เพราะตารางรู้จัก eat แต่ไม่รู้จัก eats",
    "สลับ \"ตัดคำ\" เป็นช่องว่าง: TH / 中文 / 日本語 หาไม่เจอเลย เพราะทั้งประโยคกลายเป็นก้อนเดียวที่ไม่รู้จัก",
    "เปิด 中文 แล้วกด \"หุ่นยนต์เห่า\": 机器狗 (หมาหุ่นยนต์) เป็นคำผสมที่ตารางไม่มี จึงไปได้ d1 แทน d6",
    "เลือกพิมพ์ TH แล้วพิมพ์เว้นวรรคเอง เช่น \"หมา กิน ปลา\": ตัดด้วยช่องว่างก็เจอ",
  ],
  steps: [
    ["ตัดข้อความเป็นคำ", "ต้องรู้ก่อนว่ามีคำอะไรบ้าง ภาษาไทย จีน ญี่ปุ่นไม่เว้นวรรค ขั้นนี้จึงชี้ขาดว่าจะค้นเจอหรือไม่"],
    ["รวมคำเป็นเวกเตอร์", "เฉลี่ยเวกเตอร์ของคำที่รู้จัก ได้เวกเตอร์เดียวแทนทั้งคำถาม"],
    ["ให้คะแนนเอกสาร", "เทียบกับเวกเตอร์เอกสารที่ทำไว้ล่วงหน้า แล้วเรียงจากคะแนนสูงสุด"],
  ],
  lines: [
    [M.math(M.t("tokens"), M.o("="), M.fn("split"), M.row(M.o("("), M.t("text"), M.o(")"))),
      "ตัดข้อความเป็นคำ · <b>ช่องว่าง</b> = ตัดตรงที่เว้นวรรค ภาษาไทย จีน ญี่ปุ่นจึงได้ทั้งประโยคเป็นก้อนเดียว · <b>พจนานุกรม</b> = เริ่มจากซ้าย หยิบคำที่ยาวที่สุดที่ตารางรู้จักทีละคำ ตัวที่ไม่รู้จักรวมเป็นก้อนสีเทา (ภาษาอังกฤษตัดที่ช่องว่างเหมือนเดิม)"],
    [M.math(M.v("q"), M.o("="), M.fn("normalize"), M.row(M.o("("), M.frac(M.n(1), M.i("n")), M.sum(M.row(M.i("w"), M.o("∈"), M.t("tokens"), M.o("∩"), M.t("known")), M.t("")), M.sub(M.v("e"), M.i("w")), M.o(")"))),
      "แปลงคำถามเป็นเวกเตอร์ · e<sub>w</sub> = เวกเตอร์ของคำ w จากตาราง (ในของเล่นนี้คำแปลทุกภาษาได้เวกเตอร์เดียวกัน) · known = คำที่ตารางรู้จัก · n = จำนวนคำที่รู้จัก · ไม่มีคำที่รู้จักเลย = q เป็นศูนย์ ค้นไม่ได้"],
    [M.math(M.fn("score"), M.row(M.o("("), M.v("q"), M.o(","), M.v("d"), M.o(")")), M.o("="), M.v("q"), M.o("·"), M.v("d")),
      "ให้คะแนนเอกสาร d (เวกเตอร์ของเอกสาร ทำแบบเดียวกันไว้ล่วงหน้า) · ยาว 1 ทั้งคู่ dot จึงเท่ากับ cosine · คะแนนสูงสุดขึ้นก่อน"],
  ],
  formulaFrom: "bi-encoder แปลงคำถามกับเอกสารแยกกันแล้วเทียบด้วย cosine และชื่อโมเดลหลายภาษา มาจากคลิป Byte Goose AI · encoder จำลองแบบเฉลี่ยเวกเตอร์คำ, การตัดคำแบบหยิบคำที่ยาวที่สุด (longest match) และตารางคำ 4 ภาษา เป็นความรู้ทั่วไป / ผู้จัดทำเลือก · ตัวเลขความแม่นมาจากตารางของเล่นนี้ ไม่ใช่ความแม่นของโมเดลจริง (แหล่งที่ใช้ไม่มีตัวเลขแยกภาษา)",
  symbols: [
    ["tokens", "คำที่ตัดได้จากข้อความ", "ชิปในกล่องแทนค่า: สี = รู้จัก, เทา = ไม่รู้จัก"],
    ["split( )", "วิธีตัดคำ: ช่องว่าง หรือ พจนานุกรม", "ปุ่ม \"ตัดคำ\""],
    ["known", "คำที่ตารางรู้จัก (ตารางเดียวใช้ทุกภาษา)", "รายการคำด้านล่าง"],
    ["e<sub>w</sub>", "เวกเตอร์ของคำ w", "หิว = hungry = 饿 = 空腹 ได้ค่าเดียวกัน"],
    ["n", "จำนวนคำที่รู้จักในคำถาม", "ใช้หารเพื่อหาค่าเฉลี่ย"],
    ["q", "เวกเตอร์ของคำถาม", "ลูกศรสีตามภาษาในภาพ"],
    ["score(q, d) = q · d", "คะแนนของเอกสาร d", "เอกสารคะแนนสูงสุดขึ้นก่อน"],
  ],
  symbolsNote: `<h2>คำที่ตารางรู้จัก (ตารางของเล่น 3 แกน: food, animal, tech)</h2>` +
    LANGS.map((l) => `<p class="vocab"><b style="color: var(${l.css})">${l.label}</b> <span style="color: var(${l.css})">${vocab(l.id).map(escV).join(" · ")}</span></p>`).join("") +
    `<p class="fine">เพิ่มคำของตัวเองได้ที่หน้า <a href="#/dict">พจนานุกรม</a></p>` +
    `<h2>เอกสาร (ภาษาอังกฤษ แปลงเป็นเวกเตอร์ไว้ล่วงหน้า)</h2><p class="vocab">${DOCV.map((d) => `${d.tag} ${d.text}`).join(" · ")}</p>`,
  notes: `
    <h2>encoder จริงแปลงคำเป็นเวกเตอร์อย่างไร</h2>
    <ul>
      <li>มีตาราง embedding ขนาด (จำนวนคำ × จำนวนมิติ) เช่น 50,000 × 300 แปลงคำ = หาแถวของคำนั้นในตาราง</li>
      <li>ตอนแรกค่าในตารางสุ่ม แล้วถูกปรับทีละนิดทุกครั้งที่โมเดลเดาผิด คำที่ใช้ในบริบทคล้ายกันจึงถูกดันไปทางเดียวกัน</li>
    </ul>
    <p class="fine">ความรู้ทั่วไป (ไม่ได้มาจากคลิปนี้): ตารางนี้คือชั้นแรกของ encoder สมัยใหม่ ชั้น transformer ถัดไปผสมบริบทของคำรอบข้างเข้าไป (บท {#llm-input}–{#attention}) ก่อนรวมเป็นเวกเตอร์ของทั้งประโยค</p>
    <h2>bi-encoder กับ cross-encoder</h2>
    <ul>
      <li><b>bi-encoder</b> (บทนี้) แปลงคำถามกับเอกสารแยกกัน เอกสารแปลงเก็บไว้ล่วงหน้าได้ จึงเร็วพอค้นเอกสารนับล้าน</li>
      <li>ข้อเสีย: อัดทั้งเอกสารเป็นเวกเตอร์เดียวก่อนเห็นคำถาม รายละเอียดบางอย่างหายไป</li>
      <li><b>cross-encoder</b> อ่านคำถามกับเอกสารพร้อมกัน แม่นกว่าแต่ต้องรันโมเดลทุกคู่ จึงใช้ได้กับผลไม่กี่ชิ้น</li>
      <li>ระบบจริงใช้สองขั้น: bi-encoder คัดผู้สมัครจำนวนมาก แล้ว cross-encoder จัดอันดับ 10–100 ชิ้นบนสุด (บท {#reranker})</li>
    </ul>
    <h2>โมเดลหลายภาษาที่คลิปพูดถึง</h2>
    <ul>
      <li>ผู้ดำเนินรายการเรียก Qwen3-Embedding-8B ว่าดีที่สุดสำหรับงานหลายภาษา (ตรวจทาน: อันดับ 1 ของ MTEB multilingual เมื่อ 2025-06-05)</li>
      <li>บน Vertex AI มี text-multilingual-embedding-002 (768 มิติ) สำหรับหลายภาษาโดยเฉพาะ</li>
      <li>คลิปยกอีกสองตัวไว้ใช้งานอื่น: BGE-M3 สำหรับค้นแบบผสม (dense, sparse, multi-vector ในรอบเดียว) และ EmbeddingGemma 300M สำหรับอุปกรณ์เล็ก
        (ตรวจทาน: ทั้งสองตัวรองรับกว่า 100 ภาษา)</li>
      <li>คลิปไม่ได้ให้ตัวเลขความแม่นแยกตามภาษา ตัวเลขในบทนี้จึงมาจากตารางของเล่นเท่านั้น</li>
    </ul>
    <h2>ข้อจำกัดที่ควรรู้</h2>
    <ul>
      <li>embedding อ่านตัวเลขไม่เก่ง ในงานวิจัยหนึ่ง 13 โมเดลแม่นเฉลี่ยราว 54% กับคำถามการเงินที่ต้องเทียบตัวเลข ส่วนหนึ่งเพราะ tokenizer ตัดตัวเลขเป็นชิ้น ๆ จึงควรกรองตัวเลขด้วย filter</li>
      <li>คำปฏิเสธ เช่น "ไม่มีเบาหวาน" ยังถูกดึงมาเมื่อค้นคำว่าเบาหวาน ต้องมีขั้นกรองอีกชั้น (บท {#reranker})</li>
    </ul>
    <p class="fine">ความรู้ทั่วไป (ไม่ได้มาจากคลิป): โมเดลหลายภาษาจริงใช้คลังคำ (vocabulary) ชุดเดียวกันทุกภาษา และตัดคำเป็นชิ้นย่อย (subword) แทนการเปิดพจนานุกรมแบบบทนี้ ภาษาที่มีข้อมูลฝึกน้อยมักได้เวกเตอร์ที่แม่นน้อยกว่า</p>`,
  refs: [["blackboard", "ตาราง embedding, การแปลงคำ = ค้นหาแถว, การปรับค่าระหว่างฝึก"],
    ["choose", "bi-encoder กับ cross-encoder, pipeline สองขั้น, ตัวเลขและคำปฏิเสธ, tokenizer ตัดตัวเลข, โมเดลหลายภาษา (Qwen3-Embedding-8B, text-multilingual-embedding-002), BGE-M3 / EmbeddingGemma (ค้นแบบผสม / อุปกรณ์เล็ก)"]],
  mount(ui) {
    const st = { show: ["en"], type: "en", mode: "dict", text: { ...SAMPLES[0].text } };
    mountPanel(ui, st, SAMPLES);
    const shown = () => LANGS.filter((l) => st.show.includes(l.id));
    return {
      draw(s) {
        s.axes(3.8); s.sphere(S);
        const runs = shown().map((l) => ({ l, ...search(st.text[l.id] || "", st.mode) }));
        const hits = new Set(runs.map((r) => r.top?.tag).filter(Boolean));
        for (const d of DOCV) s.point(up(d.v), hits.has(d.tag) ? s.c.r : s.c.ink, d.tag, { r: hits.has(d.tag) ? 6.5 : 4.5 });
        // thick to thin, so arrows that lie on top of each other all stay visible. The colour says the language
        // (same colours as the "แสดง" chips); only a single arrow gets a name, so labels never pile up.
        runs.forEach((r, i) => {
          if (!r.top) return;
          s.arrow([0, 0, 0], up(r.q), s.c[r.l.sc], "", { width: 6 - i * 1.3 });
          if (runs.length === 1) s.label(up(r.q), "q", s.c[r.l.sc], { dx: -12, dy: -6, align: "right" });   // left of the tip: the document name sits on the right
        });
      },
      live() {
        const L = LANG[st.type], cur = search(st.text[st.type] || "", st.mode);
        const other = st.mode === "dict" ? "space" : "dict", name = { space: "ช่องว่าง", dict: "พจนานุกรม" };
        const tok = (m, on) => `<div class="toks${on ? "" : " off"}"><span class="lab">${L.label} ตัดแบบ${name[m]}${on ? " (ใช้อยู่)" : " (เทียบ)"}:</span>${chips(split(st.text[st.type] || "", m), L.css)}</div>`;
        const qline = cur.top
          ? M.math(M.v("q"), M.o("="), M.tuple(cur.q.map((x) => M.n(fmt(x))))) +
            `<p class="verdict">${L.label} อันดับ 1: <b>${cur.top.tag} ${cur.top.text}</b> · cos ${fmt(cur.top.score)}</p>`
          : `<p class="verdict">${L.label}: ไม่มีคำที่ตารางรู้จัก q จึงเป็นศูนย์ ค้นไม่ได้</p>`;
        const rows = shown().map((l) => {
          const r = search(st.text[l.id] || "", st.mode), smp = sampleOf(SAMPLES, l.id, st.text[l.id]);
          const ok = !r.top ? '<span class="dim">ไม่เจอ</span>' : !smp ? '<span class="dim">–</span>' : r.top.tag === smp.want ? '<span class="ok">✓</span>' : `<span class="bad">✗</span> <span class="dim">(${smp.want})</span>`;
          return `<tr class="${l.id === st.type ? "win" : ""}"><td class="nw"><span class="sw" style="background: var(${l.css})"></span>${l.label}</td><td>${r.top ? r.top.tag : "–"}</td><td>${r.top ? fmt(r.top.score) : "–"}</td><td class="nw">${ok}</td></tr>`;
        }).join("");
        const acc = LANGS.map((l) => `<tr class="${st.show.includes(l.id) ? "" : "dimrow"}"><td class="nw"><span class="sw" style="background: var(${l.css})"></span>${l.label}</td><td class="nw">${bar(ACC[l.id].space, l.css)}</td><td class="nw">${bar(ACC[l.id].dict, l.css)}</td></tr>`).join("");
        return tok(st.mode, true) + tok(other, false) + qline +
          `<p class="fintro">อันดับ 1 ของแต่ละภาษา (ตัดแบบ${name[st.mode]}):</p><div class="scroll"><table class="rank"><thead><tr><th>ภาษา</th><th>อันดับ 1</th><th>cos</th><th>ถูก?</th></tr></thead><tbody>${rows}</tbody></table></div>` +
          `<p class="fintro">ความแม่นของ 6 ประโยคตัวอย่าง (อันดับ 1 ถูก):</p><div class="scroll"><table class="rank"><thead><tr><th>ภาษา</th><th>ช่องว่าง</th><th>พจนานุกรม</th></tr></thead><tbody>${acc}</tbody></table></div>` +
          `<p class="ctl-note">ตัวเลขจากตารางคำของเล่นในบทนี้ ไม่ใช่ความแม่นของโมเดลจริง</p>`;
      },
    };
  },
};
