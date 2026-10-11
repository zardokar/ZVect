import { M, esc } from "../js/kit.js";
import { LANGS, LANG, SAMPLES, split, langOf, vocab } from "../js/multilang.js";
import { tokenRows, tokenSVG, show } from "../js/tokdraw.js";

// 3.1 Tokenization (owner 2026-10-11 15:11: "หัวข้อแปลง Token แยกออกมาอธิบายเลย แยกกับ BPE"; 15:17: "มีตัวอย่างให้ลองเติม
// โดยใช้ภาษาเท่ากับของ Bi-Encoder"). One idea: text is cut into tokens (characters or words) and every token is looked up
// in a vocabulary to get its number. Source: the BPE clip (Raj Pulapakura) — character vocabulary a–z = 1–26, ! @ # $ = 27–30,
// word vocabulary built from the unique words of a training corpus, small vocabulary + long sequence vs big vocabulary +
// short sequence. The training corpus here is the 6 four-language samples of 6.1 Bi-Encoder (author's choice), and words
// are cut with the same toy dictionary as 6.1 (Thai, Chinese and Japanese have no spaces between words).
const CORPUS = SAMPLES.flatMap((s) => LANGS.map((l) => s.text[l.id]));

// characters: every letter, one at a time; spaces get no number (as on the clip's slide)
const chars = (text) => [...text].filter((ch) => !/\s/u.test(ch));
// words: the 6.1 split (spaces for English, longest dictionary match inside Thai / Chinese / Japanese chunks)
const wordsOf = (text) => split(text, "dict").map((x) => x.t);

// vocabularies. Characters start with the clip's 30 (a–z, ! @ # $), then the whole Thai block ก … ๛ (author's choice, 2026-10-11 15:49:
// like a–z on the slide, every Thai letter is known, so Thai typed by the learner never gives "?" by character), then every other
// character of the corpus (Chinese, Japanese, capitals …) in code order.
const SLIDE = [..."abcdefghijklmnopqrstuvwxyz!@#$"];
const THAI = [];
for (let cp = 0x0e01; cp <= 0x0e5b; cp++) if (cp <= 0x0e3a || cp >= 0x0e3f) THAI.push(String.fromCodePoint(cp));
const byCode = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const FIXED = [...SLIDE, ...THAI];
const CHAR_V = [...FIXED, ...[...new Set(CORPUS.flatMap(chars))].filter((ch) => !FIXED.includes(ch)).sort(byCode)];
// words of the samples + every word in the dictionary (so a word added on the Dict page gets a number here too),
// sorted like the clip: a:1, ab:2, abbreviation:3 …
const WORD_V = [...new Set([...CORPUS.flatMap(wordsOf), ...LANGS.flatMap((l) => vocab(l.id))])].sort(byCode);
const IDX = { char: new Map(CHAR_V.map((t, i) => [t, i + 1])), word: new Map(WORD_V.map((t, i) => [t, i + 1])) };
const VOC = { char: CHAR_V, word: WORD_V };
const CUT = { char: chars, word: wordsOf };
const NAME = { char: "ตัวอักษร", word: "คำ" };

// colour of each vocabulary entry = the language it first appears in (samples scanned EN, TH, 中文, 日本語; the slide's 30 = EN,
// the Thai block = TH), the same colours as the language chips (owner, 16:12: "ทำเป็นสีตามภาษา ให้ตรงกัน")
const CHAR_LANG = new Map(), WORD_LANG = new Map();
for (const ch of SLIDE) CHAR_LANG.set(ch, LANG.en);
for (const ch of THAI) CHAR_LANG.set(ch, LANG.th);
for (const l of LANGS) for (const s of SAMPLES) {
  for (const ch of chars(s.text[l.id])) if (!CHAR_LANG.has(ch)) CHAR_LANG.set(ch, l);
  for (const w of wordsOf(s.text[l.id])) if (!WORD_LANG.has(w)) WORD_LANG.set(w, langOf(w) || l);
}
for (const w of WORD_V) if (!WORD_LANG.has(w) && langOf(w)) WORD_LANG.set(w, langOf(w));   // words only in the dictionary
const tint = (t, html, map) => { const l = map.get(t); return l ? `<span style="color: var(${l.css})">${html}</span>` : html; };
const LEGEND = `<p class="vocab">${LANGS.map((l) => `<b style="color: var(${l.css})">● ${l.label}</b>`).join(" ")}</p>`;

const tokenize = (text, level) => CUT[level](text).map((t) => ({ t, id: IDX[level].get(t) ?? "?" }));

const HELLO = "hello there you are amazing".split(" ").map((w) => [...w].map((ch) => [ch, IDX.char.get(ch)]));

export default {
  slug: "tokenize",
  title: "Tokenization: ตัดข้อความเป็น token แล้วแปลงเป็นเลข",
  en: "Tokenization",
  example: "34_tokenize",
  hint: "ภาพ 2 มิติ แถวละหนึ่งภาษา ใช้ล้อเมาส์ (หรือสองนิ้ว) ซูม ลากเพื่อเลื่อน ดับเบิลคลิกเพื่อดูทั้งหมด",
  canvasLabel: "ข้อความแต่ละภาษาถูกตัดเป็นกล่อง token แต่ละกล่องมีลูกศรชี้ลงไปหาเลขของมันในคลัง เครื่องหมายคำถามคือ token ที่ไม่มีในคลัง",
  intro: `
    <p>คอมพิวเตอร์เข้าใจแต่ตัวเลข ก่อนทำอะไรกับข้อความจึงต้อง <b>tokenize</b>: ตัดข้อความเป็นชิ้น (token) แล้วเปิด <b>คลัง (vocabulary)</b> ดูว่าแต่ละชิ้นได้เลขอะไร</p>
    <p>ตัดได้สองแบบสุดทาง: <b>ทีละตัวอักษร</b> คลังเล็ก (สไลด์ในคลิปมี 30 ตัว a = 1 … z = 26) แต่ได้เลขยาว
    และ <b>ทีละคำ</b> ได้เลขสั้น แต่คลังใหญ่มาก ทางกลางคือ subword (บท 3.2 BPE)</p>
    ${tokenSVG(HELLO)}
    <p class="fine">ภาพบน: "hello there you are amazing" ตัดทีละตัวอักษร ได้ 23 เลข ช่องว่างไม่ได้เลข (ตามสไลด์ในคลิป)</p>`,
  try: [
    "กด \"ทั้งหมด\" ในแถว \"แสดง\": ตัดทีละตัวอักษร ภาษาไทยได้เลขยาวที่สุดในทุกตัวอย่าง ภาษาจีนสั้นที่สุด (ตัวอย่าง \"หมากับแมว\" จีนเท่ากับญี่ปุ่น)",
    "สลับ \"ตัดเป็น\" เป็นคำ: ทุกภาษาได้เลขสั้นลง เช่น EN จาก 13 เหลือ 4 และ 中文 จาก 5 เหลือ 4 (ดูตารางด้านขวา) แล้วกดตัวอย่างอื่นดูว่าลดลงเท่าไร",
    "พิมพ์ภาษาอังกฤษว่า \"zebra\": ทีละตัวอักษรได้เลขครบ (z, e, b, r, a อยู่ในคลัง 30 ตัว) แต่ทีละคำได้ ? เพราะไม่มีคำนี้ในประโยคที่ใช้สร้างคลัง",
    "เลือกพิมพ์ TH แล้วพิมพ์ \"กินบะหมี่\": ภาพเหลือแถวเดียว (ข้อความที่พิมพ์เองไม่มีคำแปล) ทีละตัวอักษรได้เลขครบ แต่ทีละคำ \"บะหมี่\" เป็น ? เพราะพจนานุกรมของเล่นไม่รู้จัก",
    "ดูภาษาไทยทีละตัวอักษร: สระบนและสระล่าง เช่น ั ิ เป็นตัวอักษรแยกของมันเอง (แสดงบนวงกลมจุด ◌)",
  ],
  steps: [
    ["ตัดเป็น token", "เลือกหน่วยที่จะตัด: ทีละตัวอักษร หรือทีละคำ ได้รายการ token ตามลำดับในข้อความ"],
    ["เปิดคลังหาเลข", "แต่ละ token มีเลขประจำตัวในคลัง ไล่แปลงทีละ token ได้ลำดับเลข ถ้าไม่มีในคลังก็แปลงไม่ได้ (?)"],
  ],
  stepsWhy: "คลังสร้างไว้ก่อนจากข้อความชุดหนึ่ง (บทนี้ใช้ประโยคตัวอย่าง 6 ประโยค × 4 ภาษา) แล้วใช้คลังเดิมแปลงข้อความใหม่ทุกครั้ง",
  lines: [
    [M.math(M.t("tokens"), M.o("="), M.fn("split"), M.row(M.o("("), M.t("text"), M.o(")")), M.o("="), M.tuple([M.sub(M.i("t"), M.n(1)), M.sub(M.i("t"), M.n(2)), M.o("…"), M.sub(M.i("t"), M.i("n"))])),
      "ตัดข้อความเป็น token · <b>ตัวอักษร</b> = ทีละตัว ข้ามช่องว่าง ตัวพิมพ์ใหญ่และเครื่องหมายก็เป็นตัวอักษร · <b>คำ</b> = ทำ A–Z เป็นตัวเล็ก ตัดที่ช่องว่างและเครื่องหมาย แล้วภาษาไทย จีน ญี่ปุ่นใช้พจนานุกรมชุดเดียวกับบท 6.1 (หยิบคำที่ยาวที่สุดที่รู้จัก; กติกาเดียวกับบท 6.1, ผู้จัดทำเลือก) · t<sub>i</sub> = token ตัวที่ i · n = จำนวน token"],
    [M.math(M.t("ids"), M.o("="), M.tuple([M.row(M.i("id"), M.o("("), M.sub(M.i("t"), M.n(1)), M.o(")")), M.o("…"), M.row(M.i("id"), M.o("("), M.sub(M.i("t"), M.i("n")), M.o(")"))])),
      "แปลงทีละ token · id(t) = ลำดับของ t ในคลัง V (เริ่มที่ 1) · ไม่มี t ในคลัง = ? · จำนวนเลขเท่ากับจำนวน token เสมอ"],
  ],
  formulaFrom: "การแปลงข้อความเป็นตัวเลข (tokenization), คลังตัวอักษร a–z = 1–26 และ ! @ # $ = 27–30, คลังคำที่สร้างจากคำไม่ซ้ำในข้อความฝึก และข้อแลกระหว่างคลังเล็ก / เลขยาว กับคลังใหญ่ / เลขสั้น มาจากคลิป BPE ของ Raj Pulapakura · ประโยค 4 ภาษาและพจนานุกรมของเล่นใช้ชุดเดียวกับบท 6.1 (ผู้จัดทำเลือก)",
  symbols: [
    ["text", "ข้อความที่จะแปลง", "พิมพ์ในกล่อง หรือกดตัวอย่าง"],
    ["t<sub>i</sub>", "token ตัวที่ i", "ตัวอักษรหนึ่งตัว หรือคำหนึ่งคำ"],
    ["n", "จำนวน token = จำนวนเลขที่ได้", "ตัวอักษร: n มาก · คำ: n น้อย"],
    ["V", "คลัง (vocabulary): รายการ token ทั้งหมดที่รู้จัก", `ตัวอักษร ${CHAR_V.length} ตัว (30 ตัวของสไลด์ + ไทยครบชุด + ตัวอื่นจากประโยคตัวอย่าง) · คำ ${WORD_V.length} คำ (จาก 24 ประโยคตัวอย่าง + คำในพจนานุกรม)`],
    ["id(t)", "เลขของ t = ลำดับใน V", "a = 1, h = 8 ตามสไลด์ในคลิป"],
    ["?", "token ที่ไม่มีในคลัง", "แปลงเป็นเลขไม่ได้"],
  ],
  symbolsNote: `<h2>คลังตัวอักษร (${CHAR_V.length} ตัว)</h2>${LEGEND}<p class="vocab">${CHAR_V.map((t, i) => tint(t, `${esc(show(t))}:${i + 1}`, CHAR_LANG)).join(" ")}</p>` +
    `<h2>คลังคำ (${WORD_V.length} คำ เรียงแบบพจนานุกรม)</h2><p class="vocab">${WORD_V.map((t, i) => tint(t, `${esc(t)}:${i + 1}`, WORD_LANG)).join(" · ")}</p>` +
    `<p class="fine">สี = ภาษาที่ token นั้นมาจาก (เจอครั้งแรกในประโยคตัวอย่างภาษาไหน: EN, TH, 中文, 日本語 ตามลำดับ) · เพิ่มคำของตัวเองได้ที่หน้า <a href="#/dict">พจนานุกรม</a></p>`,
  notes: `
    <h2>จากคลิป BPE (Raj Pulapakura)</h2>
    <ul>
      <li>เครื่องเข้าใจแต่ตัวเลข การแปลงข้อความเป็นตัวเลขเรียกว่า tokenization ตัวเลขที่ได้เอาไปใช้ต่อ เช่น ทายอารมณ์ของข้อความ หรือสร้างข้อความต่อ</li>
      <li><b>ทีละตัวอักษร:</b> สไลด์มีคลัง 30 ตัว (a–z = 1–26, ! @ # $ = 27–30) ถ้าเพิ่มตัวพิมพ์ใหญ่และสัญลักษณ์อื่น ผู้สอนบอกว่าน่าจะไม่เกินราว 100 ตัว
        "hello" ได้ 8, 5, 12, 12, 15</li>
      <li><b>ทีละคำ:</b> คลังในสไลด์เรียงแบบพจนานุกรม a = 1, ab = 2, abbreviation = 3 … zulu = 173248 และ hello = 86241, there = 129041
        คลังไม่ได้ใส่ทุกคำในภาษา แต่เก็บคำไม่ซ้ำจากข้อความที่ใช้ฝึก</li>
      <li><b>ข้อแลก:</b> ตัวอักษรได้คลังเล็ก (ประหยัดหน่วยความจำ) แต่ลำดับเลขยาว โมเดลจึงประมวลผลนานขึ้น · คำได้ลำดับสั้น แต่คลังใหญ่มาก
        ทางกลางคือ <b>subword</b> เช่น ly, ence, tion (บท 3.2)</li>
    </ul>
    <h2>ในบทนี้ต่างจากคลิปตรงไหน (ผู้จัดทำ)</h2>
    <ul>
      <li>คลังสร้างจากประโยคตัวอย่าง 6 ประโยค × 4 ภาษา ชุดเดียวกับบท 6.1 คลังตัวอักษรเริ่มด้วย 30 ตัวของสไลด์ ตามด้วยตัวอักษรไทยครบทุกตัว (ก … ๛) แล้วต่อด้วยตัวอักษรอื่นที่เจอในประโยคเรียงตามรหัส
        พิมพ์ภาษาไทยเองจึงไม่ได้ ? เมื่อตัดทีละตัวอักษร</li>
      <li>ข้อความที่พิมพ์เองแสดงเฉพาะภาษาที่พิมพ์ เพราะภาษาอื่นไม่มีคำแปลของข้อความนั้น</li>
      <li><b>ภาษาไทยตัดทีละคำอย่างไร (ความรู้ทั่วไป ไม่ได้มาจากคลิป):</b> ภาษาไทยไม่เว้นวรรค ต้องใช้พจนานุกรมหาคำที่ยาวที่สุด (แบบบทนี้และบท 6.1) หรือใช้โมเดลที่ฝึกมาตัดคำ
        คำที่พจนานุกรมไม่มี เช่น คำสแลง จะตัดผิดหรือเป็น ? ส่วน tokenizer ของ LLM ไม่ตัดเป็นคำก่อน แต่ใช้ subword แบบ BPE (บท 3.2) คำที่ไม่รู้จักจึงแตกเป็นชิ้นที่รู้จักได้เสมอ</li>
      <li>ภาษาไทยเก็บสระบนล่างและวรรณยุกต์เป็นตัวอักษรแยก (เป็นรหัสแยกในคอมพิวเตอร์) ภาษาจีนหนึ่งตัวอักษรมักเป็นหนึ่งคำอยู่แล้ว เลขของจีนจึงสั้น</li>
      <li>คำที่พจนานุกรมของเล่นไม่รู้จัก เช่น "ของฉัน" ถูกเก็บเป็น token ก้อนเดียวทั้งก้อน</li>
      <li>คลังคำในบทนี้สร้างจากแค่ 24 ประโยคกับพจนานุกรมของเล่น (${WORD_V.length} คำ) จึงยังเล็กกว่าคลังตัวอักษร (${CHAR_V.length} ตัว ซึ่งรวมอักษรไทยครบชุด และอักษรจีนกับญี่ปุ่นที่ใช้แยกกันหลายตัว)
        ถ้าใส่ข้อความเพิ่ม คลังคำจะโตตามทุกคำใหม่ที่เจอ (สไลด์ในคลิปถึง 173,248) ส่วนคลังตัวอักษรภาษาอังกฤษหยุดที่ราว 100 ตามที่ผู้สอนบอก
        คำที่เพิ่มในหน้า <a href="#/dict">พจนานุกรม</a> ได้เลขในคลังคำทันที (ทั้งตัดคำและแปลงเป็นเลข)</li>
    </ul>
    <h2>บทถัดไป</h2>
    <p>บท 3.2 BPE สร้างคลังแบบ subword โดยเริ่มจากตัวอักษร แล้วรวมคู่ที่เจอบ่อยทีละรอบ · บท 3.4 Token ID ดูว่าเลขที่ได้ใช้วัดความหมายไม่ได้</p>`,
  refs: [["bpe", "tokenization คืออะไร, คลังตัวอักษร a–z = 1–26 และ ! @ # $ = 27–30, hello → 8 5 12 12 15, คลังคำจากข้อความฝึก, ข้อแลกคลังเล็ก / เลขยาว กับคลังใหญ่ / เลขสั้น"],
    ["choose", "ประโยค 4 ภาษาและการตัดคำด้วยพจนานุกรม ใช้ชุดเดียวกับบท 6.1"]],
  mount(ui) {
    const st = { show: LANGS.map((l) => l.id), type: "en", level: "char", text: { ...SAMPLES[0].text } };
    ui.panel.classList.add("stack");
    const opts = LANGS.map((l) => [l.id, l.label, l.css]);
    // the learner's text first (owner, 2026-10-11 15:45: "ควรเอา input ข้อความจาก User ไว้ด้านบน"), then samples, languages, unit
    const box = ui.tagText("ข้อความ", opts, st, "type", "text", "พิมพ์ข้อความ",
      () => { if (!st.show.includes(st.type)) { st.show.push(st.type); langs.sync(); } });
    ui.buttons("ตัวอย่าง (เติมครบ 4 ภาษา)", SAMPLES.map((p) => [p.label, () => { st.text = { ...p.text }; box.sync(); }]),
      { pressed: () => SAMPLES.findIndex((p) => p.text[st.type] === st.text[st.type]) });
    const langs = ui.toggles("แสดง", opts, st, "show", { all: "ทั้งหมด", allOff: () => [st.type],
      after: () => { if (!st.show.includes(st.type)) { st.type = st.show[0]; box.sync(); } } });
    ui.choice("ตัดเป็น", [["char", "ตัวอักษร"], ["word", "คำ"]], st, "level");
    // text the learner typed has no translation in the other languages, so it is shown alone (owner, 15:49: "ใส่ข้อความแล้วมันก็ไม่ได้
    // เข้ากับที่ input ก็ไม่ต้องเอามาวางด้วยกันก็ได้"); a sample shows every language that is switched on
    const own = () => !SAMPLES.some((p) => p.text[st.type] === st.text[st.type]);
    const shown = () => (own() ? [LANG[st.type]] : LANGS.filter((l) => st.show.includes(l.id)));
    return {
      zoom2d: true,
      draw2d(g, W, H, c, view) {
        tokenRows(g, W, H, c, shown().map((l) => {
          const toks = tokenize(st.text[l.id] || "", st.level);
          return { title: `${l.label} · ทีละ${NAME[st.level]} · ${toks.length} เลข`, color: c[l.sc], toks };
        }), view);
      },
      live() {
        const L = LANG[st.type], toks = tokenize(st.text[st.type] || "", st.level);
        const unk = toks.filter((x) => x.id === "?").length;
        const rows = shown().map((l) => {
          const t = st.text[l.id] || "", a = tokenize(t, "char"), b = tokenize(t, "word");
          return `<tr><td><b style="color: var(${l.css})">${l.label}</b></td><td class="${st.level === "char" ? "win" : ""}">${a.length}</td><td class="${st.level === "word" ? "win" : ""}">${b.length}</td></tr>`;
        }).join("");
        return M.math(M.t("ids"), M.o("="), toks.length ? M.tuple(toks.map((x) => M.n(String(x.id), x.id === "?" ? "res" : "ca"))) : M.tuple([M.t("ว่าง")])) +
          `<p class="verdict">${L.label} ตัดทีละ${NAME[st.level]}: <b>${toks.length} token → ${toks.length} เลข</b>` +
          (unk ? ` · ไม่มีในคลัง ${unk} ตัว (?)` : "") + ` · คลัง${NAME[st.level]}มี ${VOC[st.level].length} ${st.level === "char" ? "ตัว" : "คำ"}</p>` +
          (own() ? `<p class="ctl-note">ข้อความที่พิมพ์เอง: แสดงเฉพาะ ${L.label} (ภาษาอื่นไม่มีคำแปลของข้อความนี้) กดตัวอย่างเพื่อดูหลายภาษาพร้อมกัน</p>` : "") +
          (unk && st.level === "word" && st.type !== "en" ? `<p class="ctl-note">ภาษา${L.id === "th" ? "ไทย" : L.id === "zh" ? "จีน" : "ญี่ปุ่น"}ไม่เว้นวรรค ตัดคำได้เฉพาะคำที่พจนานุกรมของเล่นรู้จัก ส่วนที่ไม่รู้จักจึงเป็นก้อนเดียวและได้ ? · ลองสลับเป็น "ตัวอักษร" หรือดูบท 3.2 BPE ที่ตัดเป็นชิ้นย่อยกว่าคำ</p>` : "") +
          `<p class="fintro">จำนวนเลขของข้อความเดียวกัน (คลังตัวอักษร ${CHAR_V.length} ตัว · คลังคำ ${WORD_V.length} คำ):</p>` +
          `<div class="scroll"><table class="rank"><thead><tr><th>ภาษา</th><th>ทีละตัวอักษร</th><th>ทีละคำ</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
