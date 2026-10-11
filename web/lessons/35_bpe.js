import { M, esc } from "../js/kit.js";
import { tokenRows, show } from "../js/tokdraw.js";

// 3.2 BPE (owner 2026-10-11 15:11: BPE is its own topic, apart from 3.1 Tokenization). One idea: start from single
// characters and merge the most frequent adjacent pair, k times; the merges, in order, are the rules for new text.
// Source: the BPE clip (Raj Pulapakura): corpus "fred fed ted bread, and ted fed fred bread", spaces and punctuation are
// characters, k merges, new sentence "ted and fred are friends", unseen letters get "?". Every number here is counted live
// (ties: the pair seen first). Counting every pair gives merges 3–4 = "ed␣f", "ed␣b"; the clip's slides show "fr", "fred␣"
// and two round-2 counts one too high — explained in the notes, not copied.
const CLIP = "fred fed ted bread, and ted fed fred bread";
const NEW = "ted and fred are friends";
const KMAX = 10;

// first vocabulary: the characters of the corpus, letters and digits first (a b d e f n r t), then space and marks,
// so the clip's numbering a = 1 … t = 8, space = 9 comes out the same
const key = (ch) => (/[\p{L}\p{N}]/u.test(ch) ? "0" : "1") + ch;
function merge(toks, a, b) {
  const out = [];
  for (let i = 0; i < toks.length; i++) {
    if (i + 1 < toks.length && toks[i] === a && toks[i + 1] === b) { out.push(a + b); i++; } else out.push(toks[i]);
  }
  return out;
}
function countPairs(toks) {                       // Map keeps the order pairs were first seen (used to break ties)
  const m = new Map();
  for (let i = 0; i + 1 < toks.length; i++) { const k = toks[i] + "\u0000" + toks[i + 1]; m.set(k, (m.get(k) || 0) + 1); }
  return [...m].map(([k, n], order) => { const [a, b] = k.split("\u0000"); return { a, b, n, order }; })
    .sort((x, y) => y.n - x.n || x.order - y.order);
}
function train(corpus, k) {
  let toks = [...corpus];
  const vocab = [...new Set(toks)].sort((x, y) => (key(x) < key(y) ? -1 : key(x) > key(y) ? 1 : 0));
  const rules = [];
  for (let r = 0; r < k; r++) {
    const pairs = countPairs(toks);
    if (!pairs.length) break;
    const { a, b, n } = pairs[0];
    rules.push({ a, b, n });
    vocab.push(a + b);
    toks = merge(toks, a, b);
  }
  return { toks, vocab, rules, next: countPairs(toks) };
}
function encode(text, vocab, rules) {
  let toks = [...text];
  for (const { a, b } of rules) toks = merge(toks, a, b);
  const id = new Map(vocab.map((t, i) => [t, i + 1]));
  return toks.map((t) => ({ t, id: id.get(t) ?? "?" }));
}
const q = (t) => `<code>${esc(show(t))}</code>`;

export default {
  slug: "bpe",
  title: "BPE: เริ่มจากตัวอักษร แล้วรวมคู่ที่เจอบ่อยทีละรอบ",
  en: "BPE (Byte Pair Encoding)",
  example: "35_bpe",
  hint: "ภาพ 2 มิติ ใช้ล้อเมาส์ (หรือสองนิ้ว) ซูม ลากเพื่อเลื่อน ดับเบิลคลิกเพื่อดูทั้งหมด",
  canvasLabel: "สองแถวของกล่อง token: ข้อความฝึกหลังรวม k รอบ และประโยคใหม่ที่ใช้กฎเดียวกัน แต่ละกล่องมีลูกศรลงไปหาเลขในคลัง",
  intro: `
    <p><b>BPE</b> (Byte Pair Encoding) สร้างคลังแบบ <b>subword</b>: ชิ้นที่ใหญ่กว่าตัวอักษรแต่เล็กกว่าคำ เป็นทางกลางระหว่างสองแบบในบท 3.1 คลิปบอกว่า GPT ใช้วิธีนี้</p>
    <p>เริ่มจากคลังตัวอักษร แล้วทำซ้ำ k รอบ: <b>นับทุกคู่ที่อยู่ติดกัน</b> → <b>รวมคู่ที่เจอบ่อยที่สุด</b>เป็น token ใหม่ → แทนคู่นั้นทุกจุดในข้อความ
    การรวมแต่ละรอบจดไว้เป็น <b>กฎ</b> ข้อความใหม่ต้องใช้กฎตามลำดับเดิม แล้วจึงเปิดคลังหาเลข</p>`,
  try: [
    "เลื่อนจำนวนรอบจาก 0 ไป 1: คู่ d + ␣ เจอ 7 ครั้ง ถูกรวมเป็น d␣ ข้อความฝึกเหลือ 35 token จาก 42",
    "เลื่อนไป 2: e + d␣ (6 ครั้ง) กลายเป็น ed␣ แล้วดูตาราง \"รอบถัดไป\": ed␣ + f เจอ 3 ครั้ง ชนะ f + r ที่เจอ 2 ครั้ง",
    "ดูประโยคใหม่ \"ted and fred are friends\": i กับ s เป็น ? ทุกจำนวนรอบ เพราะไม่มีในข้อความฝึกเลย",
    "เลื่อนไป 10: token ยาวขึ้นเรื่อย ๆ และข้ามช่องว่างได้ เช่น ed␣bread เพราะช่องว่างนับเป็นตัวอักษร ข้อความฝึกสั้นลง แต่คลังโตขึ้นรอบละ 1",
  ],
  steps: [
    ["เริ่มจากตัวอักษร", "คลังแรกคือตัวอักษรทุกตัวที่ไม่ซ้ำในข้อความฝึก ช่องว่างและเครื่องหมายก็นับเป็นตัวอักษร"],
    ["นับคู่ที่อยู่ติดกัน", "ไล่ทั้งข้อความ นับว่าแต่ละคู่ (token ตัวหนึ่งกับตัวถัดไป) เจอกี่ครั้ง ต้องนับทุกคู่ ไม่ใช่แค่คู่ที่เห็นชัด"],
    ["รวมคู่ที่บ่อยที่สุด", "เพิ่มคู่นั้นเป็น token ใหม่ในคลัง จดเป็นกฎ แล้วแทนทุกจุดในข้อความ กลับไปนับใหม่จนครบ k รอบ"],
    ["ใช้กฎกับข้อความใหม่", "แตกเป็นตัวอักษร ใช้กฎทีละข้อตามลำดับที่ได้ตอนฝึก แล้วเปิดคลังหาเลข (บท 3.1)"],
  ],
  stepsWhy: "ขั้น 1–3 คือการฝึก (ทำครั้งเดียว ได้คลังกับกฎ) ขั้น 4 คือการใช้งานกับข้อความใหม่ทุกครั้ง",
  lines: [
    [M.math(M.sub(M.i("V"), M.n(0)), M.o("="), M.t("characters of the corpus")),
      "คลังเริ่มต้น · V<sub>0</sub> = ตัวอักษรไม่ซ้ำในข้อความฝึก เรียงตัวอักษรก่อน แล้วตามด้วยช่องว่างและเครื่องหมาย (a = 1 … t = 8, ␣ = 9 ตรงกับสไลด์ในคลิป และในบทนี้มีจุลภาคต่อเป็น 10)"],
    [M.math(M.fn("count"), M.row(M.o("("), M.i("a"), M.o(","), M.i("b"), M.o(")")), M.o("="), M.t("how many times\u00a0"), M.i("a"), M.t("\u00a0is followed by\u00a0"), M.i("b")),
      "นับคู่ · a, b = token สองตัวที่อยู่ติดกัน (b อยู่ถัดจาก a) · นับในข้อความฝึกปัจจุบัน ซึ่งเปลี่ยนไปทุกรอบ"],
    [M.math(M.row(M.o("("), M.sup(M.i("a"), M.o("*")), M.o(","), M.sup(M.i("b"), M.o("*")), M.o(")")), M.o("="), M.fn("argmax"), M.fn("count"), M.o(";"), M.i("V"), M.o("←"), M.i("V"), M.o("∪"), M.row(M.o("{"), M.sup(M.i("a"), M.o("*")), M.sup(M.i("b"), M.o("*")), M.o("}"))),
      "รวมคู่ · argmax = เลือกคู่ที่ count มากที่สุด (เท่ากันหลายคู่ = เลือกคู่ที่เจอก่อน: ผู้จัดทำเลือก) · a*b* = ต่อสองชิ้นเป็นชิ้นเดียว เพิ่มเข้าคลัง V และแทนทุกจุดในข้อความ · ทำ k รอบ"],
    [M.math(M.fn("encode"), M.row(M.o("("), M.t("text"), M.o(")")), M.o("="), M.i("id"), M.row(M.o("("), M.sub(M.t("rule"), M.i("k")), M.o("∘"), M.o("…"), M.o("∘"), M.sub(M.t("rule"), M.n(1)), M.row(M.o("("), M.t("chars"), M.o(")")), M.o(")"))),
      "ใช้กับข้อความใหม่ · chars = แตกเป็นตัวอักษร · rule<sub>1</sub> ใช้ก่อน แล้ว rule<sub>2</sub> … ถึง rule<sub>k</sub> (ตามลำดับที่ได้ตอนฝึก) · id = เปิดคลังหาเลข ไม่มีในคลัง = ?"],
  ],
  formulaFrom: "ขั้นตอน BPE (เริ่มจากตัวอักษรทุกตัว, เลือกคู่ที่ติดกันบ่อยที่สุด, เพิ่มเข้าคลัง, แทนในข้อความ, ทำ k รอบ, ใช้กฎตามลำดับกับประโยคใหม่) ข้อความฝึก ประโยคใหม่ และเลขของคลัง มาจากคลิป BPE ของ Raj Pulapakura · ตัวเลขทุกตัวในบทนี้นับสดด้วยโค้ด · การเลือกคู่ที่เจอก่อนเมื่อเสมอกันเป็นสิ่งที่ผู้จัดทำเลือก (คลิปไม่ได้พูด)",
  symbols: [
    ["V", "คลัง (vocabulary)", "เริ่มด้วยตัวอักษร แล้วโตขึ้นรอบละ 1 token"],
    ["a, b", "token สองตัวที่อยู่ติดกัน", "d กับ ␣ ใน \"fred fed\""],
    ["count(a, b)", "จำนวนครั้งที่ a ตามด้วย b", "d + ␣ = 7 ในรอบแรก"],
    ["argmax", "เลือกตัวที่ค่ามากที่สุด", "คู่ที่ชนะในรอบนั้น"],
    ["a*b*", "token ใหม่ที่ได้จากการรวม", "d␣, ed␣ …"],
    ["k", "จำนวนรอบที่รวม", "ตัวเลื่อน \"จำนวนรอบ\""],
    ["rule<sub>i</sub>", "กฎข้อที่ i = การรวมในรอบที่ i", "ใช้กับข้อความใหม่ตามลำดับ"],
    ["?", "token ที่ไม่มีในคลัง", "i, s ใน friends"],
  ],
  notes: `
    <h2>จากคลิป BPE (Raj Pulapakura)</h2>
    <ul>
      <li>subword คือชิ้นข้อความที่มักไม่ใช่ทั้งคำ แต่ก็ไม่ใช่ตัวอักษรเดียว เช่น ly, ence, tion วิธีที่นิยมมีสามแบบ: BPE (GPT), WordPiece (BERT), Unigram Language Modeling (T5)</li>
      <li>ข้อความฝึกในคลิป: "fred fed ted bread, and ted fed fred bread" ช่องว่างและเครื่องหมายนับเป็นตัวอักษร คลังเริ่มต้นในสไลด์คือ a b d e f n r t ␣ (ผู้สอนบอกเองว่าลืมใส่จุลภาค)</li>
      <li>รอบแรกนับได้ d␣ 7, ed 6, re 4, ␣f 3 ผู้สอนย้ำว่าของจริงต้องนับทุกคู่ แล้วรวม d␣ · รอบสองรวม ed␣ (6 ครั้ง)</li>
      <li>ข้อความใหม่ใช้กฎทีละข้อตามลำดับ แล้วแปลง token เป็นเลข "ted and fred are friends" ได้ 16 เลข โดย i กับ s เป็น ? เพราะไม่เคยเห็นตอนฝึก
        ผู้สอนบอกว่ากรณีนี้เกิดยาก เพราะข้อความฝึกจริงมีตัวอักษรครบ</li>
    </ul>
    <h2>บทนี้ต่างจากสไลด์ในคลิปตรงไหน (ผู้จัดทำนับด้วยโค้ด)</h2>
    <div class="scroll"><table class="rank"><thead><tr><th>จุด</th><th>สไลด์ในคลิป</th><th>นับทุกคู่</th></tr></thead><tbody>
      <tr><td>รอบ 1: d␣, ed, re, ␣f</td><td>7, 6, 4, 3</td><td>7, 6, 4, 3 (ตรง)</td></tr>
      <tr><td>รอบ 2: d␣ ตามด้วย f / f + r</td><td>4 / 3</td><td>3 / 2</td></tr>
      <tr><td>กฎข้อ 3, 4</td><td>f + r → fr · fr + ed␣ → fred␣</td><td>ed␣ + f (3 ครั้ง) · ed␣ + b (2 ครั้ง เสมอหลายคู่)</td></tr>
      <tr><td>เลขของ fred␣ ในผลลัพธ์</td><td>7</td><td>13 ตามคลังของสไลด์ (7 คือ r)</td></tr>
      <tr><td>ประโยคใหม่หลังใช้กฎ 4 ข้อ</td><td>16 token</td><td>19 token (กฎข้อ 3–4 ต่างกัน จึงตัดต่างกัน)</td></tr>
    </tbody></table></div>
    <p class="fine">กฎข้อ 3–4 ในสไลด์ใช้อธิบายวิธีได้ แต่ไม่ใช่ผลของการนับทุกคู่ บทนี้จึงนับสดทุกรอบแทนการลอกตัวเลขจากสไลด์ และคลังในบทนี้มีจุลภาค เลขของ token ที่รวมแล้วจึงเริ่มที่ 11</p>
    <p class="fine">ความรู้ทั่วไป (ไม่ได้มาจากคลิป): tokenizer จริงส่วนใหญ่ตัดที่ช่องว่างก่อนแล้วจึงรวมคู่ภายในแต่ละคำ token จึงไม่ข้ามคำแบบ ed␣bread ในบทนี้</p>
    <p class="fine">ความรู้ทั่วไป (ไม่ได้มาจากคลิป): GPT-2 และรุ่นถัดมาใช้ BPE แบบ byte-level คือเริ่มคลังจาก 256 ค่าของไบต์แทนตัวอักษร ทุกข้อความจึงแตกเป็นไบต์ได้เสมอ ไม่มี ? (บท 3.3 Tokenizer ของ GPT ให้ลองแบบนี้)</p>`,
  refs: [["bpe", "ขั้นตอน BPE, ข้อความฝึก fred fed ted bread…, ตัวเลขรอบแรก, การใช้กฎตามลำดับกับ ted and fred are friends, ตัวที่ไม่รู้จักเป็น ?, BPE / WordPiece / Unigram"]],
  mount(ui) {
    const st = { corpus: CLIP, k: 2, text: NEW };
    ui.panel.classList.add("stack");
    // the learner's text first (owner, 2026-10-11 15:45: "ควรเอา input ข้อความจาก User ไว้ด้านบน"), then the round slider
    const corp = ui.text("ข้อความฝึก", st, "corpus", "พิมพ์ข้อความฝึก");
    const sent = ui.text("ประโยคใหม่", st, "text", "พิมพ์ประโยคใหม่");
    // shown only after the learner has typed over the clip's text (owner 21:30: one option that cannot be picked is noise)
    ui.buttons("", [["คืนเป็นข้อความในคลิป", () => { st.corpus = CLIP; st.text = NEW; corp.value = CLIP; sent.value = NEW; }]],
      { visible: () => st.corpus !== CLIP || st.text !== NEW });
    ui.number("จำนวนรอบ (k)", "k", st, "k", { min: 0, max: KMAX, step: 1 });
    const run = () => {
      const T = train(st.corpus, Math.round(st.k));
      return { T, enc: encode(st.text, T.vocab, T.rules), id: new Map(T.vocab.map((t, i) => [t, i + 1])) };
    };
    return {
      zoom2d: true,
      draw2d(g, W, H, c, view) {
        const { T, enc, id } = run();
        tokenRows(g, W, H, c, [
          { title: `ข้อความฝึกหลังรวม ${T.rules.length} รอบ · ${T.toks.length} token`, color: c.a, toks: T.toks.map((t) => ({ t, id: id.get(t) })) },
          { title: `ประโยคใหม่ (ใช้กฎ ${T.rules.length} ข้อ) · ${enc.length} token`, color: c.b, toks: enc },
        ], view);
      },
      live() {
        const { T, enc } = run(), nx = T.next[0];
        const head = nx
          ? M.math(M.t("next:"), M.fn("count"), M.row(M.o("("), M.t(esc(show(nx.a))), M.o(","), M.t(esc(show(nx.b))), M.o(")")), M.o("="), M.n(nx.n, "res")) +
            `<p class="verdict">รอบที่ ${T.rules.length + 1} จะรวม ${q(nx.a)} + ${q(nx.b)} → ${q(nx.a + nx.b)} (เจอ ${nx.n} ครั้ง)</p>`
          : `<p class="verdict">${T.toks.length ? "ข้อความฝึกเหลือ token เดียว ไม่มีคู่ให้รวมแล้ว" : "ยังไม่มีข้อความฝึก: พิมพ์ในช่อง \"ข้อความฝึก\""}</p>`;
        const rules = T.rules.length
          ? `<p class="fintro">กฎที่ได้ (ใช้ตามลำดับนี้):</p><div class="scroll"><table class="rank"><thead><tr><th>ข้อ</th><th>รวม</th><th>เจอ</th><th>เลข</th></tr></thead><tbody>` +
            T.rules.map((r, i) => `<tr><td>${i + 1}</td><td>${q(r.a)} + ${q(r.b)} → ${q(r.a + r.b)}</td><td>${r.n}</td><td>${T.vocab.length - T.rules.length + i + 1}</td></tr>`).join("") + "</tbody></table></div>"
          : `<p class="fintro">ยังไม่มีกฎ (k = 0): ทุก token เป็นตัวอักษรเดี่ยว</p>`;
        const pairs = `<p class="fintro">คู่ที่นับได้ตอนนี้ (รอบถัดไป เรียงจากมากไปน้อย):</p><div class="scroll"><table class="rank"><thead><tr><th>คู่</th><th>เจอ</th></tr></thead><tbody>` +
          T.next.slice(0, 6).map((p, i) => `<tr class="${i === 0 ? "win" : ""}"><td>${q(p.a)} + ${q(p.b)}</td><td>${p.n}</td></tr>`).join("") + "</tbody></table></div>";
        const unk = enc.filter((x) => x.id === "?").length;
        return head +
          `<p>คลังตอนนี้ ${T.vocab.length} token: ${T.vocab.map((t, i) => `${q(t)}:${i + 1}`).join(" ")}</p>` +
          `<p>ประโยคใหม่ → (${enc.map((x) => x.id).join(", ")})${unk ? ` · ไม่มีในคลัง ${unk} ตัว` : ""}</p>` + rules + pairs;
      },
    };
  },
};
