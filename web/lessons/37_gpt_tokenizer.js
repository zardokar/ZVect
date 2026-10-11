import { M, esc } from "../js/kit.js";
import { tokenRows, show } from "../js/tokdraw.js";

// Tokenizer ของ GPT (WIP202610038, owner 2026-10-11 17:12: "ขั้นตอนให้ชัดแบบมี Build ตัวอย่าง GPT ใน html ให้เล่นได้",
// 17:17 "ทำตามตาราง": a new topic after 3.2 BPE, a GPT tokenizer playground). One idea: the same BPE as 3.2, but it starts
// from the 256 values of a UTF-8 byte instead of from characters, so new tokens get ids 256, 257, … and nothing is ever
// unknown. Source: Karpathy, "Let's build the GPT Tokenizer" (get_stats / merge / train / encode lowest-rank-first /
// decode with errors="replace", the GPT-2 split regex). Ties go to the pair seen first (Python's max over a dict does the
// same). The sample texts are the author's choice; every number is counted live.
const SAMPLES = [
  ["ภาษาไทย", "แมวกินปลา แมวกินนม หมากินข้าว แมวนอน หมานอน", "แมวกิน"],
  ["อังกฤษ", "the cat sat on the mat, the cat ate the rat", "the rat sat on the cat"],
  ["ไทย + อังกฤษ", "แมว cat แมว cats แมวกิน cat eats", "cat กิน แมว"],
];
const KMAX = 40;
const SPLIT = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;   // GPT-2 (encoder.py)
const utf8 = new TextEncoder();
const utf8back = new TextDecoder("utf-8");          // not fatal: a broken byte sequence becomes � (errors="replace")

const chunksOf = (text, split) => (split ? text.match(SPLIT) || [] : text ? [text] : []);
const bytesOf = (s) => [...utf8.encode(s)];
const hex = (b) => b.toString(16).toUpperCase().padStart(2, "0");

// a token's bytes as text: whole UTF-8 characters are shown as characters, stray bytes in brackets: ⟨E0·B8⟩
function label(bytes) {
  let out = "", stray = [], i = 0;
  const flush = () => { if (stray.length) { out += `⟨${stray.join("·")}⟩`; stray = []; } };
  while (i < bytes.length) {
    const b = bytes[i], n = b < 0x80 ? 1 : b >> 5 === 6 ? 2 : b >> 4 === 14 ? 3 : b >> 3 === 30 ? 4 : 0;
    const ok = n > 0 && i + n <= bytes.length && bytes.slice(i + 1, i + n).every((c) => c >> 6 === 2);
    if (ok) { flush(); out += utf8back.decode(new Uint8Array(bytes.slice(i, i + n))); i += n; } else { stray.push(hex(b)); i++; }
  }
  flush();
  return out;
}
// one byte in the picture: a printable ASCII byte as its character, any other byte as two hex digits (narrow boxes)
const byteLabel = (b) => (b > 32 && b < 127 ? String.fromCharCode(b) : b === 32 ? " " : hex(b));
const whole = (bytes) => !label(bytes).includes("⟨");

function merge(ids, a, b, id) {
  const out = [];
  for (let i = 0; i < ids.length; i++) {
    if (i + 1 < ids.length && ids[i] === a && ids[i + 1] === b) { out.push(id); i++; } else out.push(ids[i]);
  }
  return out;
}
// count adjacent pairs inside every chunk; Map keeps the order pairs were first seen (ties: first seen wins)
function countPairs(chunks) {
  const m = new Map();
  for (const c of chunks) for (let i = 0; i + 1 < c.length; i++) { const k = c[i] + "," + c[i + 1]; m.set(k, (m.get(k) || 0) + 1); }
  return [...m].map(([k, n], order) => { const [a, b] = k.split(",").map(Number); return { a, b, n, order }; })
    .sort((x, y) => y.n - x.n || x.order - y.order);
}
function train(text, k, split) {
  let chunks = chunksOf(text, split).map(bytesOf);
  const before = chunks.reduce((s, c) => s + c.length, 0);
  const vocab = new Map(Array.from({ length: 256 }, (_, i) => [i, [i]]));
  const merges = [];
  for (let r = 0; r < k; r++) {
    const top = countPairs(chunks)[0];
    if (!top) break;                                  // every chunk is a single token: nothing left to merge
    const id = 256 + r;
    merges.push({ ...top, id });
    vocab.set(id, [...vocab.get(top.a), ...vocab.get(top.b)]);
    chunks = chunks.map((c) => merge(c, top.a, top.b, id));
  }
  const rank = new Map(merges.map((m) => [m.a + "," + m.b, m.id]));
  return { merges, vocab, rank, before, after: chunks.reduce((s, c) => s + c.length, 0), next: countPairs(chunks) };
}
// encode: bytes of each chunk, then always merge the pair with the oldest rule (lowest id) until no pair has a rule
function encode(text, T, split) {
  return chunksOf(text, split).flatMap((c) => {
    let ids = bytesOf(c);
    while (ids.length >= 2) {
      let best = null;
      for (let i = 0; i + 1 < ids.length; i++) {
        const id = T.rank.get(ids[i] + "," + ids[i + 1]);
        if (id !== undefined && (best === null || id < best.id)) best = { a: ids[i], b: ids[i + 1], id };
      }
      if (!best) break;
      ids = merge(ids, best.a, best.b, best.id);
    }
    return ids;
  });
}
const decode = (ids, vocab) => utf8back.decode(new Uint8Array(ids.flatMap((i) => vocab.get(i))));
const q = (s) => `<code>${esc(show(s))}</code>`;
const r2 = (x) => (Math.round(x * 100) / 100).toFixed(2);

export default {
  slug: "gpt-tokenizer",
  title: "Tokenizer ของ GPT: BPE ที่เริ่มจากไบต์ UTF-8",
  en: "GPT Tokenizer (byte-level BPE)",
  example: "37_gpt_tokenizer",
  hint: "ภาพ 2 มิติ ใช้ล้อเมาส์ (หรือสองนิ้ว) ซูม ลากเพื่อเลื่อน ดับเบิลคลิกเพื่อดูทั้งหมด",
  canvasLabel: "สองแถวของกล่อง: ข้อความทดสอบเป็นไบต์ UTF-8 ทีละไบต์ และหลังใช้กฎรวม k ข้อ แต่ละกล่องมีลูกศรลงไปหาเลข token",
  intro: `
    <p>บท {#bpe} เริ่ม BPE จาก<b>ตัวอักษร</b> ตัวที่ไม่เคยเห็นจึงเป็น ? แต่ tokenizer ของ GPT เริ่มจาก<b>ไบต์</b>: แปลงข้อความเป็น <b>UTF-8</b> ก่อน
    ทุกไบต์มีค่า 0–255 คลังแรกจึงมี 256 ตัวเสมอ แล้วรวมคู่ที่ติดกันบ่อยที่สุดเหมือนเดิม token ใหม่ได้เลข <b>256, 257, …</b> ข้อความใด ๆ แตกเป็นไบต์ได้ จึงไม่มี ?</p>
    <p>ตัวอักษรอังกฤษใช้ 1 ไบต์ แต่<b>ตัวอักษรไทยใช้ 3 ไบต์</b> ข้อความไทยจึงเริ่มยาวกว่าราว 3 เท่า และต้องรวมหลายรอบกว่าจะสั้นลง</p>`,
  try: [
    "ตัวอย่างภาษาไทย k = 0: \"แมวกิน\" 6 ตัวอักษรเป็น 18 ไบต์ ทุกตัวขึ้นต้นด้วย 224 (E0) แล้วตามด้วย 184 หรือ 185",
    "เลื่อน k เป็น 1: คู่ 224 + 184 เจอบ่อยที่สุด กลายเป็น token 256 ซึ่งยังไม่ใช่ตัวอักษรครบตัว (แสดงเป็น ⟨E0·B8⟩)",
    "เลื่อน k ขึ้นไปเรื่อย ๆ ดูตาราง \"กฎที่ได้\": token บางตัวคร่อมรอยต่อระหว่างตัวอักษร เพราะ BPE รวมไบต์ ไม่ได้ดูว่าตัวอักษรเริ่มตรงไหน",
    "เลือกตัวอย่างอังกฤษ k = 12 แบบไม่แบ่ง: token โตจนข้ามคำ (the cat sat …) แล้วกด \"แบ่งด้วย regex ของ GPT-2\" token จะหยุดที่ขอบคำ",
  ],
  steps: [
    ["ข้อความ → ไบต์", "แปลงด้วย UTF-8: อังกฤษ 1 ไบต์ ไทย 3 ไบต์ต่อตัว ทุกไบต์คือเลข 0–255 ซึ่งเป็น token ตั้งต้น"],
    ["นับคู่ที่ติดกัน", "get_stats: นับทุกคู่ของเลขที่อยู่ติดกัน (ถ้าแบ่งด้วย regex นับเฉพาะภายในชิ้น)"],
    ["รวมคู่ที่บ่อยที่สุด", "merge: ให้เลขใหม่ 256 + i แทนคู่นั้นทุกจุด จดเป็นกฎ ทำ k รอบ"],
    ["encode ข้อความใหม่", "แปลงเป็นไบต์ แล้วรวมคู่ที่มีกฎเก่าที่สุด (เลขน้อยสุด) ก่อน จนไม่มีคู่ไหนมีกฎ"],
    ["decode กลับ", "ต่อไบต์ของทุก token แล้วถอด UTF-8 ไบต์ที่ไม่ครบตัวจะกลายเป็น �"],
  ],
  stepsWhy: "ขั้น 1–3 คือการฝึก tokenizer (ทำครั้งเดียว ได้กฎการรวม) ขั้น 4–5 คือการใช้งานทุกครั้ง: ข้อความ → เลข และเลข → ข้อความ",
  lines: [
    [M.math(M.i("ids"), M.o("="), M.fn("UTF-8"), M.row(M.o("("), M.t("text"), M.o(")")), M.o(","), M.n(0), M.o("≤"), M.i("id"), M.o("≤"), M.n(255)),
      "ข้อความ → ไบต์ · UTF-8 = วิธีเขียนตัวอักษรเป็นไบต์ 1–4 ไบต์ต่อตัว (อังกฤษ 1, ไทย 3) · ids = ลำดับไบต์ ใช้เป็น token ตั้งต้น คลังแรกมี 256 ตัวเสมอ"],
    [M.math(M.fn("count"), M.row(M.o("("), M.i("a"), M.o(","), M.i("b"), M.o(")")), M.o("="), M.t("how many times "), M.i("a"), M.t(" is followed by "), M.i("b")),
      "นับคู่ (get_stats) · a, b = เลข token สองตัวที่อยู่ติดกัน · ถ้าแบ่งข้อความด้วย regex จะนับเฉพาะคู่ที่อยู่ในชิ้นเดียวกัน"],
    [M.math(M.row(M.o("("), M.sup(M.i("a"), M.o("*")), M.o(","), M.sup(M.i("b"), M.o("*")), M.o(")")), M.o("="), M.fn("argmax"), M.fn("count"), M.o(";"),
      M.sub(M.t("rule"), M.i("i")), M.o(":"), M.row(M.o("("), M.sup(M.i("a"), M.o("*")), M.o(","), M.sup(M.i("b"), M.o("*")), M.o(")")), M.o("→"), M.n(256), M.o("+"), M.i("i")),
      "รวมคู่ (merge) · argmax = คู่ที่ count มากที่สุด (เสมอกัน = คู่ที่เจอก่อน) · รอบที่ i (เริ่ม 0) ได้เลขใหม่ 256 + i แทนทุกจุด · ทำ k รอบ คลังจึงมี 256 + k ตัว"],
    [M.math(M.fn("encode"), M.o(":"), M.t("oldest rule first, repeat")),
      "encode · แปลงข้อความใหม่เป็นไบต์ แล้วหาคู่ที่ติดกันที่มีกฎ เลือกกฎที่เลขน้อยที่สุด (เก่าที่สุด) รวม แล้วหาใหม่ จนไม่เหลือคู่ที่มีกฎ (กฎหลังอาจใช้ token ของกฎก่อน)"],
    [M.math(M.fn("decode"), M.row(M.o("("), M.i("ids"), M.o(")")), M.o("="), M.sup(M.fn("UTF-8"), M.n(-1)), M.row(M.o("("), M.t("bytes of each id, joined"), M.o(")"))),
      "decode · ต่อไบต์ของทุก token แล้วถอด UTF-8 กลับ · ไบต์ที่ไม่ครบตัวอักษรถอดไม่ได้ จะแทนด้วย � (errors=\"replace\")"],
  ],
  formulaFrom: "ขั้นตอน byte-level BPE จากคลิป Let's build the GPT Tokenizer ของ Andrej Karpathy: ไบต์ UTF-8 เป็นคลังตั้งต้น 256 ตัว, get_stats, merge ด้วยเลขใหม่ 256 + i, encode โดยใช้กฎที่เลขน้อยสุดก่อน, decode ด้วย errors=\"replace\" และ regex ของ GPT-2 สำหรับแบ่งก่อนรวม · ข้อความตัวอย่างผู้จัดทำเลือก · ตัวเลขทุกตัวนับสดด้วยโค้ด",
  symbols: [
    ["UTF-8", "วิธีเขียนตัวอักษรเป็นไบต์", "a = 97 (1 ไบต์) · แ = 224 185 129 (3 ไบต์)"],
    ["ไบต์", "เลข 0–255", "token ตั้งต้น 256 ตัว"],
    ["a, b", "เลข token สองตัวที่อยู่ติดกัน", "224 กับ 184"],
    ["count(a, b)", "จำนวนครั้งที่ a ตามด้วย b", "นับในข้อความฝึก"],
    ["256 + i", "เลขของ token ที่สร้างในรอบ i", "รอบแรกได้ 256"],
    ["rule<sub>i</sub>", "กฎข้อที่ i (คู่ → เลขใหม่)", "encode ใช้ข้อที่เลขน้อยก่อน"],
    ["⟨E0·B8⟩", "ไบต์ที่ยังไม่ครบตัวอักษร (ฐานสิบหก)", "สองไบต์แรกของตัวอักษรไทย"],
    ["E0", "ไบต์หนึ่งไบต์ในภาพ เขียนฐานสิบหก", "E0 = 224"],
    ["�", "ตัวแทนเมื่อถอด UTF-8 ไม่ได้", "decode token 224 ตัวเดียว"],
    ["อัตราบีบ", "จำนวนไบต์ ÷ จำนวน token", "คลิป: 20 รอบ ได้ 1.27 เท่า"],
  ],
  notes: `
    <h2>จากคลิป Let's build the GPT Tokenizer (Andrej Karpathy)</h2>
    <ul>
      <li>tokenizer เป็นขั้นที่แยกจาก LLM มีชุดข้อความฝึกของตัวเอง ฝึกครั้งเดียว แล้วใช้แปลงข้อความ ↔ เลข token ตัว LLM เห็นแต่เลข</li>
      <li>สตริงคือลำดับ Unicode code point (ราว 150,000 ตัว) ใช้เป็นคลังตรง ๆ ไม่ได้เพราะใหญ่และเปลี่ยนเรื่อย ๆ UTF-8 แปลงเป็น 1–4 ไบต์ต่อตัว
        แต่ไบต์ดิบมีแค่ 256 ค่า ลำดับยาวเกิน context จึงใช้ BPE บีบลำดับไบต์ให้สั้นลง</li>
      <li>ในคลิป: ย่อหน้า 533 code point เป็น 616 ไบต์ คู่บ่อยสุดคือ (101, 32) = "e␣" 20 ครั้ง รวมเป็น 256 แล้วเหลือ 596 ·
        ฝึกบนบล็อกทั้งโพสต์ 20 รอบ (vocab_size 276) จาก 24,597 ไบต์เหลือ 19,438 token = บีบได้ 1.27 เท่า</li>
      <li>decode ต้องใช้ errors="replace" เพราะไม่ใช่ทุกลำดับไบต์เป็น UTF-8 ที่ถูกต้อง เช่น token 128 ตัวเดียว · encode แล้ว decode ควรได้ข้อความเดิม แต่ decode แล้ว encode ไม่จำเป็น</li>
      <li>GPT-2 แบ่งข้อความด้วย regex ก่อน (ตัวอักษร / ตัวเลข / เครื่องหมาย / ช่องว่าง) แล้ว BPE ในแต่ละชิ้น จึงไม่มี token อย่าง "dog." ที่ปนเครื่องหมาย ·
        GPT-4 (cl100k_base) เปลี่ยน regex และมีคลังราว 100k</li>
      <li>ภาษาที่ไม่ใช่อังกฤษใช้ token มากกว่า ส่วนหนึ่งเพราะชุดฝึกของ tokenizer มีอังกฤษมากกว่า ("hello how are you" 5 token, ภาษาเกาหลี 15 token)</li>
    </ul>
    <p class="fine">ผู้จัดทำ (ไม่ได้มาจากคลิป): ตัวอักษรไทยอยู่ช่วง U+0E00–U+0E7F จึงเป็น 3 ไบต์ทุกตัว ขึ้นต้นด้วย 224, 184 (ก–ฮ สระส่วนใหญ่) หรือ 224, 185 (เ แ โ ใ ไ วรรณยุกต์ เลขไทย)
      คู่ 224 + 184 จึงมักถูกรวมเป็นกฎแรกของข้อความไทย และ token ที่ได้ยังไม่ใช่ตัวอักษรครบตัว</p>
    <p class="fine">ผู้จัดทำ (ไม่ได้มาจากคลิป): สระบน สระล่าง และวรรณยุกต์ของไทย (เช่น ิ ี ่ ้) ไม่ใช่ \\p{L} แต่เป็นเครื่องหมาย (\\p{M}) regex ของ GPT-2 จึงตัดออกเป็นชิ้นของตัวเอง
      เช่น "กิน" แบ่งเป็น "ก", "ิ", "น" ดูได้จากรายการชิ้นเมื่อเลือก "แบ่งด้วย regex ของ GPT-2"</p>`,
  refs: [["karpathy", "BPE บนไบต์ UTF-8 (คลัง 256, เลขใหม่ 256 + i), get_stats / merge / encode กฎเก่าก่อน / decode errors=\"replace\", ตัวเลข 616 → 596 และ 1.27 เท่า, regex ของ GPT-2, ภาษาอื่นใช้ token มากกว่า"],
    ["bpe", "ขั้นตอน BPE บนตัวอักษรของบท {#bpe} ที่บทนี้ต่อยอด"]],
  mount(ui) {
    const st = { corpus: SAMPLES[0][1], text: SAMPLES[0][2], k: 1, split: "none" };
    ui.panel.classList.add("stack");
    const corp = ui.text("ข้อความฝึก", st, "corpus", "พิมพ์ข้อความฝึก");
    const sent = ui.text("ข้อความทดสอบ", st, "text", "พิมพ์ข้อความที่จะ encode");
    ui.buttons("ตัวอย่าง (ผู้จัดทำเลือก)", SAMPLES.map(([name, c, t]) => [name, () => { st.corpus = c; st.text = t; corp.value = c; sent.value = t; }]),
      { pressed: () => SAMPLES.findIndex(([, c, t]) => st.corpus === c && st.text === t) });
    ui.number("จำนวนรอบที่รวม (k)", "k", st, "k", { min: 0, max: KMAX, step: 1 });
    ui.choice("ก่อนรวม", [["none", "ไม่แบ่ง (ไบต์ล้วน)"], ["gpt2", "แบ่งด้วย regex ของ GPT-2"]], st, "split");
    let memo = null;
    const run = () => {
      const key = [st.corpus, st.text, Math.round(st.k), st.split].join("\u0000");
      if (memo && memo.key === key) return memo;
      const split = st.split === "gpt2", T = train(st.corpus, Math.round(st.k), split);
      const ids = encode(st.text, T, split);
      return (memo = { key, split, T, ids, bytes: bytesOf(st.text) });
    };
    return {
      zoom2d: true,
      draw2d(g, W, H, c, view) {
        const { T, ids, bytes } = run();
        tokenRows(g, W, H, c, [
          { title: `ข้อความทดสอบเป็นไบต์ UTF-8 · ${bytes.length} ไบต์ (กล่อง = ฐานสิบหก, เลขล่าง = id 0–255)`, color: c.a, toks: bytes.map((b) => ({ t: byteLabel(b), id: b })) },
          { title: `หลังใช้กฎ ${T.merges.length} ข้อ · ${ids.length} token`, color: c.b, toks: ids.map((i) => ({ t: label(T.vocab.get(i)), id: i })) },
        ], view);
      },
      live() {
        const { T, ids, bytes, split } = run();
        const chars = [...st.text];
        const back = decode(ids, T.vocab);
        const head = bytes.length
          ? `<p class="verdict">ข้อความทดสอบ ${chars.length} ตัวอักษร → ${bytes.length} ไบต์ → <b>${ids.length} token</b>` +
            (ids.length ? ` · บีบได้ ${r2(bytes.length / ids.length)} เท่า` : "") + "</p>"
          : `<p class="verdict">ยังไม่มีข้อความทดสอบ: พิมพ์ในช่อง "ข้อความทดสอบ"</p>`;
        const seen = [...new Set(chars)].slice(0, 10);
        const table = seen.length
          ? `<p class="fintro">ตัวอักษร → ไบต์ UTF-8 (${seen.length < new Set(chars).size ? "10 ตัวแรกที่ไม่ซ้ำ" : "ทุกตัวที่ไม่ซ้ำ"}):</p><div class="scroll"><table class="rank"><thead><tr><th>ตัว</th><th>code point</th><th>ไบต์</th></tr></thead><tbody>` +
            seen.map((ch) => `<tr><td>${q(ch)}</td><td>U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}</td><td>${bytesOf(ch).join(" ")}</td></tr>`).join("") + "</tbody></table></div>"
          : "";
        const round = bytes.length
          ? `<p>decode กลับ → ${q(back)} ${back === st.text ? "✓ ตรงกับข้อความเดิม" : "✗ ไม่ตรง"}</p>`
          : "";
        const broken = ids.find((i) => !whole(T.vocab.get(i)));
        const lone = broken !== undefined
          ? `<p>token ${broken} ตัวเดียว = ไบต์ ${T.vocab.get(broken).join(" ")} ยังไม่ครบตัวอักษร: decode ได้ ${q(decode([broken], T.vocab))}</p>`
          : "";
        const train = `<p>ข้อความฝึก: ${T.before} ไบต์ → ${T.after} token หลังรวม ${T.merges.length} รอบ` +
          (T.after ? ` = บีบได้ ${r2(T.before / T.after)} เท่า` : "") + ` · คลังมี ${256 + T.merges.length} ตัว</p>`;
        const rules = T.merges.length
          ? `<p class="fintro">กฎที่ได้ (encode ใช้ข้อที่เลขน้อยก่อน):</p><div class="scroll"><table class="rank"><thead><tr><th>เลขใหม่</th><th>รวม</th><th>ได้</th><th>เจอ</th></tr></thead><tbody>` +
            T.merges.map((m) => `<tr><td>${m.id}</td><td>${m.a} + ${m.b}</td><td>${q(label(T.vocab.get(m.id)))}</td><td>${m.n}</td></tr>`).join("") + "</tbody></table></div>"
          : `<p class="fintro">ยังไม่มีกฎ (k = 0): ทุก token คือไบต์เดี่ยว 0–255</p>`;
        const nx = T.next.slice(0, 5);
        const pairs = nx.length
          ? `<p class="fintro">คู่ที่นับได้ตอนนี้ (รอบถัดไปจะได้เลข ${256 + T.merges.length}):</p><div class="scroll"><table class="rank"><thead><tr><th>คู่</th><th>เป็น</th><th>เจอ</th></tr></thead><tbody>` +
            nx.map((p, i) => `<tr class="${i === 0 ? "win" : ""}"><td>${p.a} + ${p.b}</td><td>${q(label([...T.vocab.get(p.a), ...T.vocab.get(p.b)]))}</td><td>${p.n}</td></tr>`).join("") + "</tbody></table></div>"
          : `<p class="fintro">ไม่เหลือคู่ให้รวมแล้ว${split ? " (ทุกชิ้นเหลือ token เดียว)" : ""}</p>`;
        const chunks = split
          ? `<p class="fintro">ชิ้นจาก regex ของ GPT-2 (รวมได้เฉพาะภายในชิ้น):</p><p>${chunksOf(st.text, true).map(q).join(" ") || "—"}</p>`
          : "";
        return head + table + round + lone + chunks + train + rules + pairs;
      },
    };
  },
};
