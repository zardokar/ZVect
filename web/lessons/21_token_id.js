import { distance } from "../../lib/zvect.js";
import { M } from "../js/kit.js";

// 3.4 Token ID (WIP202610026): one idea only — a word's ID number is a name tag, not a position,
// so "closeness" of IDs means nothing. IDs good 6, bad 22, great 21 are from the Under The Hood clip.
const CLIP = { good: 6, bad: 22, great: 21 };
const WORDS = ["good", "bad", "great"];
const SAME = { "good-great": true, "bad-great": false, "good-bad": false };   // meaning (from the clip)
const MAXID = 30;

function shuffleIds() {                 // three different whole numbers 0..29
  const pool = Array.from({ length: MAXID }, (_, i) => i);
  for (let i = pool.length - 1; i > 0; i--) { const k = Math.floor(Math.random() * (i + 1)); [pool[i], pool[k]] = [pool[k], pool[i]]; }
  return { good: pool[0], bad: pool[1], great: pool[2] };
}
const gap = (ids, a, b) => distance([ids[a]], [ids[b]]);   // a 1-number vector: distance = |id(a) − id(b)|

export default {
  slug: "token-id",
  title: "Token ID: ทำไมเลขประจำคำยังไม่ใช่เวกเตอร์ที่ดี",
  en: "Token ID",
  example: "21_token_id",
  hint: "ภาพนี้เป็นเส้นจำนวน 2 มิติ ไม่ต้องหมุน เลือกคู่คำจากปุ่มด้านล่าง",
  canvasLabel: "เส้นจำนวน 0 ถึง 30 มีคำ good, bad, great วางตามเลขประจำคำ และวงเล็บบอกผลต่างของเลขคู่ที่เลือก",
  intro: `
    <p>ตัดข้อความเป็น token แล้ว (บท 3.1) แต่ละ token ได้ <b>เลขประจำคำ (token ID)</b> จากคลัง เช่น good = 6, bad = 22, great = 21</p>
    <p>แต่เลขนี้เป็นแค่ <b>ป้ายชื่อ</b> ถ้าเอาไปวัดความใกล้ จะได้ว่า bad ใกล้ great (ห่าง 1) มากกว่า good (ห่าง 15) ซึ่งผิดความหมาย</p>`,
  try: [
    "เลือก good กับ great แล้วเลือก bad กับ great: คู่ไหนเลขใกล้กันกว่า",
    "กด \"แจกเลขใหม่ (Random)\": ความหมายของคำไม่เปลี่ยน แต่คู่ที่ \"ใกล้\" เปลี่ยนไปตามเลข",
  ],
  steps: [
    ["แจกเลขให้คำ", "คอมพิวเตอร์ต้องการตัวเลข จึงเริ่มจากเลขประจำคำ"],
    ["วัดความใกล้จากเลข", "ลองใช้เลขเป็นตำแหน่ง แล้วดูว่าความใกล้ผิดตรงไหน"],
  ],
  lines: [
    [M.math(M.i("id"), M.row(M.o("("), M.i("w"), M.o(")")), M.o("="), M.t("the number given to word\u00a0"), M.i("w")),
      "แจกเลขให้แต่ละคำ · w = คำ (word) · id(w) = เลขประจำคำ เช่น id(good) = 6 · เลขไม่ได้มาจากความหมาย (ใครได้เลขอะไรมักขึ้นกับลำดับที่ใส่ลง vocabulary: ความรู้ทั่วไป)"],
    [M.math(M.t("gap"), M.row(M.o("("), M.i("a"), M.o(","), M.i("b"), M.o(")")), M.o("="), M.abs(M.i("id"), M.row(M.o("("), M.i("a"), M.o(")")), M.o("−"), M.i("id"), M.row(M.o("("), M.i("b"), M.o(")")))),
      "ถ้าใช้เลขเป็นตำแหน่งบนเส้นจำนวน ความห่างของสองคำคือผลต่างของเลข · a, b = สองคำที่เทียบ · |…| = ค่าสัมบูรณ์ (ตัดเครื่องหมายลบทิ้ง) · ก็คือ Euclidean distance (บท 2.1) ของเวกเตอร์ที่มีตัวเลขตัวเดียว · ค่าน้อย = \"ดูเหมือนใกล้\" ทั้งที่ความหมายอาจไม่เกี่ยวกันเลย"],
  ],
  formulaFrom: "เลข good = 6, bad = 22, great = 21 และข้อสังเกตว่า bad กับ great จะดูเหมือนคล้ายกัน มาจากคลิป Under The Hood · ผลต่าง 15 กับ 1 คำนวณเอง · ปุ่มแจกเลขใหม่เป็นสิ่งที่ผู้จัดทำเพิ่มเพื่อให้เห็นว่าเลขเปลี่ยนได้ตามใจ",
  symbols: [
    ["w", "word: คำหนึ่งคำ", "good, bad, great"],
    ["id(w)", "เลขประจำคำ (token ID)", "เป็นป้ายชื่อ ไม่ใช่การวัด"],
    ["a, b", "สองคำที่เอามาเทียบ", "เลือกจากปุ่ม \"เลือกคู่\""],
    ["|x|", "ค่าสัมบูรณ์: ตัดเครื่องหมายลบทิ้ง", "|6 − 21| = |−15| = 15"],
    ["gap(a, b)", "ผลต่างของเลขประจำคำ", "ค่าน้อยไม่ได้แปลว่าความหมายใกล้"],
  ],
  notes: `
    <h2>เลขแบบไหนใช้ได้ แบบไหนใช้ไม่ได้</h2>
    <ul>
      <li>ภาพขาวดำแปลงเป็นตัวเลขได้ตรง ๆ: จุดที่สว่างที่สุด = 1 มืดที่สุด = 0 สีเทาอยู่ระหว่างกลาง เพราะความสว่างเป็นค่าที่วัดได้จริง</li>
      <li>เลขเรียงลำดับใช้ได้กับของที่มีลำดับจริง เช่น ต่ำ / กลาง / สูง</li>
      <li>คำไม่มีลำดับแบบนั้น: ประโยค "This movie was good / bad / great" ได้เลข good 6, bad 22, great 21
        เลข 21 กับ 22 ติดกัน โมเดลอาจเข้าใจว่า bad คล้าย great แล้วทายผิด ทั้งที่ good กับ great ต่างหากที่ความหมายใกล้กัน</li>
    </ul>
    <h2>อีกสองคลิปพูดเรื่องเดียวกัน</h2>
    <ul>
      <li>SOFAR: ประโยคเรื่อง cat, lion, dog ได้เลขเช่น cat 23, lion 50, dog 150 เลขพวกนี้ไม่บอกว่า cat ใกล้ dog หรือ lion เป็นสัตว์เลี้ยงน้อยกว่า
        การจับคู่คำกับเลขแบบนี้เรียกว่า vocabulary</li>
      <li>BlackBoard AI: King → 0, Queen → 1, Man → 2, Woman → 3 แล้วใช้เลขนี้เป็น <b>ที่อยู่</b> สำหรับหยิบแถวในตาราง (บท 3.7) ไม่ได้ใช้วัดความใกล้</li>
    </ul>
    <h2>บทถัดไป</h2>
    <p>บท 3.5 One-hot แก้ปัญหาลำดับปลอมนี้ โดยให้ทุกคำห่างกันเท่ากันหมด</p>`,
  refs: [["wordemb", "เลข good 6, bad 22, great 21; เลขเหมาะกับของที่มีลำดับเท่านั้น; ภาพขาวดำ 0–1"],
    ["sofar", "เลขประจำคำไม่มีความหมาย (cat 23, lion 50, dog 150); vocabulary"], ["blackboard", "Vocabulary mapping King → 0 … ใช้เลขเป็นที่อยู่ของแถว"]],
  mount(ui) {
    const st = { pair: "bad-great", ids: { ...CLIP } };
    ui.choice("เลือกคู่", [["good-great", "good กับ great"], ["bad-great", "bad กับ great"], ["good-bad", "good กับ bad"]], st, "pair");
    ui.buttons("เลขประจำคำ", [
      ["เลขตามคลิป (6, 22, 21)", () => { st.ids = { ...CLIP }; }],
      ["แจกเลขใหม่ (Random)", () => { st.ids = shuffleIds(); }],
    ]);
    return {
      draw2d(g, W, H, c) {
        const font = getComputedStyle(g.canvas).fontFamily;
        const [a, b] = st.pair.split("-");
        const x0 = 40, x1 = W - 40, y = H * 0.5, X = (id) => x0 + (id / MAXID) * (x1 - x0);
        g.strokeStyle = c.muted; g.lineWidth = 2;
        g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
        g.font = `12px ${font}`; g.fillStyle = c.muted; g.textAlign = "center"; g.textBaseline = "top";
        for (let t = 0; t <= MAXID; t += 5) { g.beginPath(); g.moveTo(X(t), y - 5); g.lineTo(X(t), y + 5); g.stroke(); g.fillText(String(t), X(t), y + 10); }
        WORDS.forEach((w, k) => {
          const on = w === a || w === b, col = w === a ? c.a : w === b ? c.b : c.ink;
          g.fillStyle = col; g.beginPath(); g.arc(X(st.ids[w]), y, on ? 8 : 6, 0, 7); g.fill();
          g.font = `600 ${on ? 16 : 14}px ${font}`; g.textBaseline = "bottom";
          g.fillText(`${w} = ${st.ids[w]}`, X(st.ids[w]), y - 16 - (k % 2) * 22);
        });
        const xa = X(st.ids[a]), xb = X(st.ids[b]), by = y + 44;
        g.strokeStyle = c.r; g.lineWidth = 2;
        g.beginPath(); g.moveTo(xa, by - 6); g.lineTo(xa, by); g.lineTo(xb, by); g.lineTo(xb, by - 6); g.stroke();
        g.fillStyle = c.r; g.font = `700 15px ${font}`; g.textBaseline = "top";
        g.fillText(`gap = ${gap(st.ids, a, b)}`, (xa + xb) / 2, by + 6);
        g.textAlign = "left";
      },
      live() {
        const [a, b] = st.pair.split("-"), ids = st.ids;
        const rows = [["good", "great"], ["bad", "great"], ["good", "bad"]].map(([p, q]) =>
          `<tr class="${p + "-" + q === st.pair ? "win" : ""}"><td>${p} กับ ${q}</td><td>|${ids[p]} − ${ids[q]}| = ${gap(ids, p, q)}</td><td class="dim">${SAME[p + "-" + q] ? "ความหมายใกล้กัน" : "ความหมายต่างกัน"}</td></tr>`).join("");
        const gb = gap(ids, "bad", "great"), gg = gap(ids, "good", "great");
        const say = gb < gg ? `คำที่ "ใกล้" great ที่สุดคือ <b>bad</b> (ผิดความหมาย)`
          : gb > gg ? `คำที่ "ใกล้" great ที่สุดคือ <b>good</b> (บังเอิญถูก เพราะเลขออกมาแบบนี้)` : "good กับ bad ห่างจาก great เท่ากัน";
        return M.math(M.t("gap"), M.row(M.o("("), M.t(a), M.o(","), M.t(b), M.o(")")), M.o("="),
            M.abs(M.n(ids[a], "ca"), M.o("−"), M.n(ids[b], "cb")), M.o("="), M.n(gap(ids, a, b), "res")) +
          `<p class="verdict">ตามเลข: ${say}</p>` +
          `<p class="fintro">ทุกคู่ (ขั้นตอน 2):</p><div class="scroll"><table class="rank"><thead><tr><th>คู่</th><th>gap</th><th>ความหมายจริง</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      },
    };
  },
};
