// dict/page.js — the Dict page (#/dict): the four-language toy dictionary, add / remove words, export (owner, 2026-10-11 16:12–22:10).
// Talks to the dictionary only through the facade (index.js). Layout tokens and classes live in web/css/style.css (.dgrid, .dstat …).
import { dict } from "./index.js";
import { LANG } from "../multilang.js";
import { esc } from "../kit.js";
import { resolve } from "../chapters.js";

const L4 = dict.langs.map((id) => LANG[id]);
// which language a negation word is (for its colour): Thai letters, Japanese kana, Chinese 不 / 没, else English
const negLang = (w) => LANG[/[฀-๿]/.test(w) ? "th" : /[぀-ヿ]/.test(w) ? "jp" : /[一-鿿]/.test(w) ? "zh" : "en"];
// example word per language for the empty boxes of the form
const SAMPLE_WORD = { en: "soup (ต้องใส่)", th: "ซุป", zh: "汤", jp: "スープ" };

export function mountDictPage(root, msg = "") {
  const show = (m) => mountDictPage(root, m);
  const $ = (s) => root.querySelector(s);
  document.title = "ZVect: Dictionary";
  const d = dict.data, rowsIds = Object.keys(d.meanings).sort();
  const cell = (l, w) => `<span class="dw${dict.isMine(l.id, w) ? " mine" : ""}" style="--c: var(${l.css})">${esc(w)}` +
    (dict.isMine(l.id, w) ? `<button type="button" class="del" data-lang="${l.id}" data-word="${esc(w)}" aria-label="ลบคำ ${esc(w)}">×</button>` : "") + "</span>";
  const rows = rowsIds.map((m) => `<tr><td><code>${esc(m)}</code><br><span class="dim vec">(${d.meanings[m].join(", ")})</span></td>` +
    L4.map((l) => `<td>${dict.wordsOf(l.id, m).map((w) => cell(l, w)).join(" ")}</td>`).join("") + "<td></td></tr>").join("");
  const nMine = L4.reduce((n, l) => n + Object.keys(d.mine.words[l.id]).length, 0);
  root.innerHTML = resolve(`
    <p class="step">พจนานุกรม</p>
    <h1>พจนานุกรมของเล่น 4 ภาษา</h1>
    <p class="lede">คำที่บท {#tokenize} Tokenization, {#bi-encoder} Bi-Encoder, {#late-interaction} Late interaction และ {#reranker} Reranker รู้จัก แต่ละคำชี้ไปที่ <b>ความหมาย</b> หนึ่งตัว
      และความหมายมีเวกเตอร์ 3 ค่า (${d.axes.join(", ")}) คำที่เพิ่มเองเก็บไว้ในเบราว์เซอร์นี้ (localStorage) ใช้ได้ทันทีในทุกบทข้างบน</p>
    <p class="fintro">เพิ่มคำ: พิมพ์คำ EN (ใช้เป็นชื่อแถว) แล้วใส่คำแปลภาษาอื่นเท่าที่มี กด "+ เพิ่ม" · คำ EN ที่มีอยู่แล้วจะเพิ่มลงแถวเดิม คำ EN ใหม่จะสร้างแถวใหม่</p>
    <!-- one row in the same columns as the table (owner 21:41 / 21:48 / 22:10): where the words go, one box per language, the add button
         last on the right; no meaning box — the EN word names the row -->
    <form class="dictform dgrid" autocomplete="off">
      <p class="dstat dmean" aria-live="polite"></p>
      ${L4.map((l) => `<label style="color: var(${l.css})">${l.label} <input class="txt dword" data-lang="${l.id}" placeholder="${esc(SAMPLE_WORD[l.id] || "")}"></label>`).join("")}
      <button type="submit" class="btn dadd end">+ เพิ่ม</button>
      <fieldset class="dvec full" hidden disabled><legend>คำใหม่: ใกล้ food / animal / tech แค่ไหน (0 ถึง 1)</legend>
        ${d.axes.map((a, i) => `<label>${a} <input type="number" min="0" max="1" step="0.01" value="${i === 0 ? 1 : 0}" data-i="${i}"></label>`).join("")}</fieldset>
    </form>
    <p class="dmsg" role="status">${msg}</p>
    <div class="dtools dgrid"><button type="button" class="btn dexport">Export JSON</button>
      <button type="button" class="btn ghost span2 dreset"${nMine ? "" : " disabled"}>ลบคำที่เพิ่มเองทั้งหมด (${nMine})</button></div>
    <div class="scroll"><table class="rank dict"><colgroup><col class="c-mean">${L4.map(() => '<col class="c-lang">').join("")}<col class="c-act"></colgroup><thead><tr><th>ความหมาย<br><span class="dim vec">(เวกเตอร์)</span></th>${L4.map((l) => `<th style="color: var(${l.css})">${l.label}</th>`).join("")}<th aria-hidden="true"></th></tr></thead>
      <tbody>${rows}</tbody></table></div>
    <h2>คำปฏิเสธ (บท {#reranker})</h2>
    <p class="vocab">${Object.entries(d.neg).map(([w, side]) => `<span style="color: var(${negLang(w).css})">${esc(w)}</span> (${side === "before" ? "หน้าคำ" : "หลังคำ"})`).join(" · ")}</p>
    <p class="fine">ค่าเริ่มต้นอยู่ในไฟล์ <code>web/data/dict/</code> (meanings.json, en.json, th.json, zh.json, jp.json, negation.json) ·
      Export ให้ไฟล์เดียวที่มีทั้งค่าเริ่มต้นและคำที่เพิ่มเอง (ส่วน <code>mine</code>) · เป็นพจนานุกรมของเล่นที่ผู้จัดทำทำขึ้น ไม่ได้มาจากคลิป</p>`);

  const form = $(".dictform"), vecBox = $(".dvec"), stat = $(".dstat"), note = $(".dmsg");
  const enIn = form.querySelector('.dword[data-lang="en"]');
  const say = (text, err = false) => { note.textContent = text; note.classList.toggle("err", err); };
  const update = () => {
    const row = dict.rowOf(enIn.value), isNew = dict.isNewRow(enIn.value);
    vecBox.hidden = !isNew; vecBox.disabled = !isNew;
    stat.innerHTML = !row ? "พิมพ์คำ EN ก่อน" : isNew ? `แถวใหม่: <code>${esc(row)}</code>` : `เพิ่มลงแถว <code>${esc(row)}</code>`;
  };
  enIn.oninput = update; update();
  form.onsubmit = (e) => {
    e.preventDefault();
    const words = Object.fromEntries([...form.querySelectorAll(".dword")].map((x) => [x.dataset.lang, x.value]));
    if (!Object.values(words).some((w) => w.trim())) return say("พิมพ์คำอย่างน้อย 1 ภาษา", true);
    const r = dict.addRow(words, [...vecBox.querySelectorAll("input")].map((x) => Number(x.value)));
    const bad = r.errors.map(([l, m]) => `${LANG[l].label}: ${m}`).join(" · ");
    if (r.added.length) return show(`เพิ่ม ${r.added.map(([l, w]) => `"${esc(w)}" (${LANG[l].label})`).join(", ")} ในแถว ${esc(r.row)} แล้ว` +
      (bad ? ` · ไม่ได้เพิ่ม ${esc(bad)}` : ""));
    if (bad) return say(bad, true);
    say(`คำเหล่านี้อยู่ในแถว ${r.row} แล้ว`);
  };
  root.querySelectorAll("button.del").forEach((b) => b.onclick = () => { dict.remove(b.dataset.lang, b.dataset.word); show(`ลบ "${esc(b.dataset.word)}" แล้ว`); });
  $(".dexport").onclick = () => {
    const url = URL.createObjectURL(new Blob([dict.exportJSON()], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "zvect-dict.json" });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const reset = $(".dreset");
  reset.onclick = () => {                       // two clicks instead of a browser dialog
    if (reset.dataset.armed) { dict.reset(); show("ลบคำที่เพิ่มเองทั้งหมดแล้ว"); return; }
    reset.dataset.armed = "1"; reset.textContent = "กดอีกครั้งเพื่อยืนยัน";
  };
}
