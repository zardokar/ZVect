import { words, encode, cosine, fmt } from "../../lib/zvect.js";
import { M, esc } from "../js/kit.js";

// 4.5 Keyword search vs meaning (WIP202610027): one idea only — a keyword index finds documents that contain the SAME
// words (fast, exact, blind to synonyms); a vector search finds documents with a SIMILAR meaning (may miss exact codes).
// Documents follow the Satyajit Das clip's help-center example plus one ticket code; the word vectors are my own toy table.
const DOCS = ["Cancel anytime", "Cancellation policy", "Order cancellation timeline", "End your membership today",
  "Pause your plan", "Manage billing", "Sourdough bread recipe", "Ticket ZV-1042 login error"];
// axes: leave (stop using), money, food — made up for this lesson
const TABLE = {
  cancel: [1, 0.2, 0], cancellation: [1, 0.3, 0], end: [0.9, 0, 0], membership: [0.7, 0.4, 0], subscription: [0.7, 0.5, 0],
  pause: [0.8, 0.3, 0], plan: [0.5, 0.6, 0], order: [0.3, 0.6, 0.2], policy: [0.3, 0.5, 0], billing: [0.2, 1, 0],
  manage: [0.1, 0.5, 0], sourdough: [0, 0, 1], bread: [0, 0.1, 1], recipe: [0, 0.1, 0.9], quit: [1, 0.1, 0], stop: [0.9, 0.1, 0],
};
const INDEX = new Map();                // inverted index: word -> documents that contain it
DOCS.forEach((d, i) => { for (const w of new Set(words(d))) { if (!INDEX.has(w)) INDEX.set(w, []); INDEX.get(w).push(i); } });
const DVEC = DOCS.map((d) => encode(d, TABLE));
const S = 4;
const up = (v) => v.map((x) => x * S);

function keyword(q) {                   // documents that share words with q, most shared words first
  const hits = new Map();
  for (const w of new Set(words(q))) for (const i of INDEX.get(w) || []) hits.set(i, (hits.get(i) || 0) + 1);
  return [...hits].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([i, n]) => ({ i, n }));
}
function vector(q) {
  const qv = encode(q, TABLE);
  return { qv, top: DOCS.map((_, i) => ({ i, s: cosine(qv, DVEC[i]) })).filter((r) => r.s > 0).sort((a, b) => b.s - a.s || a.i - b.i).slice(0, 3) };
}

export default {
  slug: "keyword-vs-meaning",
  title: "ค้นด้วยคำ vs ค้นด้วยความหมาย",
  en: "Keyword vs meaning",
  example: "33_keyword_search",
  axisNames: ["leave", "money", "food"],
  view: { dist: 13, yaw: 0.35 },
  intro: `
    <p><b>ค้นด้วยคำ</b> เก็บไว้ล่วงหน้าว่า <b>คำไหนอยู่ในเอกสารไหน</b> (inverted index) เร็วและตรงเป๊ะ แต่ไม่รู้ว่า "cancel" กับ "end your membership" หมายถึงเรื่องเดียวกัน</p>
    <p><b>ค้นด้วยความหมาย</b> (บท 4.1) เทียบเวกเตอร์ จึงเจอคำพ้องความหมาย แต่ไม่ถนัดของที่ต้องตรงเป๊ะ เช่น เลข ticket</p>`,
  try: [
    "query \"cancel my subscription\": ค้นด้วยคำเจอแค่ \"Cancel anytime\" แต่ค้นด้วยความหมายเจอ \"End your membership today\" ด้วย ทั้งที่ไม่มีคำตรงกันเลย",
    "กด \"ZV-1042\": ค้นด้วยคำเจอ ticket ทันที แต่ตารางคำของเวกเตอร์ไม่รู้จักรหัสนี้ จึงหาไม่เจอ",
    "พิมพ์ query เองได้ (คำที่ตารางเวกเตอร์รู้จัก: cancel, end, quit, stop, membership, subscription, pause, plan, billing, bread …)",
  ],
  steps: [
    ["สร้างดัชนีคำ", "ทำครั้งเดียวตอนเก็บเอกสาร ตอนค้นจึงเร็ว"],
    ["ค้นด้วยคำ", "หาเอกสารที่มีคำเดียวกับ query"],
    ["ค้นด้วยความหมาย", "ทำแบบบท 4.1 ไว้เทียบว่าเจออะไรต่างกัน"],
  ],
  lines: [
    [M.math(M.t("index"), M.row(M.o("["), M.i("w"), M.o("]")), M.o("="), M.t("documents that contain word\u00a0"), M.i("w")),
      "inverted index · w = คำหนึ่งคำ · ทำครั้งเดียวตอนเก็บเอกสาร · ค้นแล้วแค่เปิดดูรายการของคำนั้น จึงเร็วมาก"],
    [M.math(M.t("keyword hits"), M.o("="), M.t("documents in index[w] for the words\u00a0"), M.i("w"), M.t("\u00a0of\u00a0"), M.v("q")),
      "ค้นด้วยคำ · <b>q</b> = query · เอกสารที่มีคำเดียวกันเท่านั้นที่ถูกพบ (บทนี้เรียงตามจำนวนคำที่ตรง) · คำพ้องความหมายไม่ช่วย"],
    [M.math(M.t("meaning hits"), M.o("="), M.t("top-3 by\u00a0"), M.fn("cos"), M.row(M.o("("), M.t("vec(q)"), M.o(","), M.t("vec(d)"), M.o(")"))),
      "ค้นด้วยความหมายแบบบท 4.1 · vec() = แปลงข้อความเป็นเวกเตอร์: เอาเวกเตอร์ของทุกคำที่ตารางรู้จักมาเฉลี่ยกัน (คำที่ไม่รู้จักถูกข้าม) แล้วย่อให้ยาว 1 · d = เอกสาร"],
  ],
  formulaFrom: "inverted index (คำ → เอกสาร), ตัวอย่าง \"cancel\" ได้ #15 Cancel anytime / #103 Cancellation policy / #588 Order cancellation timeline แต่พลาด \"End your membership today\" มาจากคลิป Satyajit Das · BM25 ชนะเวกเตอร์บนเอกสารบริษัทเพราะรหัส ตัวย่อ เลข ticket มาจากคลิป Devsplainers · เอกสาร 8 ชิ้น (รวม ticket ZV-1042) และตารางเวกเตอร์คำ 3 แกนผู้จัดทำแต่งเอง · ดัชนีบทนี้จับคู่คำตรงตัว ระบบจริงมักตัดคำให้เหลือรากศัพท์ด้วย (ความรู้ทั่วไป) คลิปจึงน่าจะเจอ Cancellation ด้วยเหตุนี้ (ผู้จัดทำเดา คลิปไม่ได้อธิบาย)",
  symbols: [
    ["w", "คำหนึ่งคำ", "ตัดคำด้วย words() ของ lib"],
    ["index[w]", "รายการเอกสารที่มีคำ w", "ตารางทางขวา"],
    ["q", "query", "พิมพ์หรือกดตัวอย่าง"],
    ["vec(q), vec(d)", "เวกเตอร์ของ query / เอกสาร", "ค่าเฉลี่ยของเวกเตอร์คำที่รู้จัก แล้วย่อให้ยาว 1"],
    ["cos", "cosine (บท 2.3)", "ยิ่งมากยิ่งความหมายใกล้"],
  ],
  notes: `
    <h2>จากคลิป Satyajit Das</h2>
    <ul>
      <li>inverted index = แผนที่จากแต่ละคำไปหาบทความที่มีคำนั้น คำว่า "cancel" ได้ผลทันที (#15 Cancel anytime, #103 Cancellation policy, #588 Order cancellation timeline)</li>
      <li>แต่คำตอบที่ถูกของ "How do I cancel my subscription?" คือ "End your membership today" ซึ่งไม่มีทั้ง cancel และ subscription จึงหลุดไปเลย: คำพ้องความหมายทำให้วิธีนี้พัง</li>
      <li>สรุปในคลิป: ค้นด้วยคำ = เร็วแต่มองไม่เห็นคำพ้องความหมาย · embedding = ความหมายกลายเป็นตำแหน่ง</li>
    </ul>
    <h2>จากคลิป Devsplainers (Vector Databases Are Dead)</h2>
    <ul>
      <li>ในลูปของเอเจนต์ BM25 (จัดอันดับด้วยคำที่ตรงกัน) มักชนะเวกเตอร์ บนเอกสารบริษัทครึ่งล้านชิ้น (Slack, Gmail, Jira, Confluence, GitHub): BM25 68.8% เวกเตอร์ 51.4%
        เพราะ embedding ที่ฝึกจากข้อความสาธารณะไม่รู้จักชื่อรหัส ตัวย่อ และเลข ticket (คลิปยกคำพูดจาก Reddit: "Customer ID ต้องเท่ากันเป๊ะ ไม่ใช่หาเนื้อคู่")</li>
      <li>แต่เวกเตอร์ก็ยังช่วย: BrowseComp-Plus เอเจนต์ที่ใช้ embedding ได้ 70.1% เทียบ BM25 55.9% · Cursor แม่นขึ้น 12.5% เมื่อเพิ่มการค้นด้วยความหมายบน grep</li>
      <li>ข้อสรุปของคลิป: ใช้ค้นด้วยคำก่อน แล้วใช้เวกเตอร์กับเรื่องที่ความหมายคลุมเครือ</li>
    </ul>`,
  refs: [["hnsw", "inverted index, ตัวอย่าง cancel (#15, #103, #588), พลาด End your membership today"],
    ["vdbdead", "BM25 68.8% vs เวกเตอร์ 51.4%, รหัส / ตัวย่อ / ticket, BrowseComp-Plus 70.1 vs 55.9, Cursor +12.5%, keyword ก่อน"]],
  mount(ui) {
    const st = { q: "cancel my subscription" };
    const inp = ui.text("query", st, "q", "พิมพ์คำค้น");
    ui.buttons("ตัวอย่าง", [
      ["cancel my subscription", () => { st.q = inp.value = "cancel my subscription"; }],
      ["ZV-1042", () => { st.q = inp.value = "ZV-1042"; }],
      ["bread", () => { st.q = inp.value = "bread"; }],
    ]);
    return {
      draw(s) {
        s.grid(4); s.axes(4.6);
        const { qv, top } = vector(st.q), kw = new Set(keyword(st.q).map((r) => r.i));
        DOCS.forEach((d, i) => {
          if (!DVEC[i].some((x) => x)) return;                     // no known word: no vector to draw
          const hit = top.some((r) => r.i === i);
          s.point(up(DVEC[i]), hit ? s.c.r : kw.has(i) ? s.c.b : s.c.ink, hit || kw.has(i) ? d : "", { r: hit ? 6.5 : 4.5, ring: kw.has(i) });   // name only the hits, so labels do not pile up
        });
        if (qv.some((x) => x)) s.arrow([0, 0, 0], up(qv), s.c.a, "q");
      },
      live() {
        const qw = [...new Set(words(st.q))], kw = keyword(st.q), { top } = vector(st.q);
        const idx = qw.map((w) => `<tr><td>${esc(w)}</td><td>${(INDEX.get(w) || []).map((i) => esc(DOCS[i])).join(" · ") || '<span class="dim">ไม่มีเอกสาร</span>'}</td></tr>`).join("");
        const kwText = kw.length ? kw.map((r) => esc(DOCS[r.i])).join(" · ") : "ไม่เจออะไรเลย";
        const vText = top.length ? top.map((r) => `${esc(DOCS[r.i])} (${fmt(r.s)})`).join(" · ") : "ไม่เจอ (ไม่มีคำที่ตารางเวกเตอร์รู้จัก)";
        return `<p class="verdict"><b>ค้นด้วยคำ:</b> ${kwText}</p><p class="verdict"><b>ค้นด้วยความหมาย:</b> ${vText}</p>` +
          `<p class="fintro">ขั้นตอน 1: index ของคำใน query</p><div class="scroll"><table class="rank"><thead><tr><th>คำ</th><th>เอกสารที่มีคำนี้</th></tr></thead><tbody>${idx || '<tr><td colspan="2" class="dim">ยังไม่มีคำ</td></tr>'}</tbody></table></div>`;
      },
    };
  },
};
