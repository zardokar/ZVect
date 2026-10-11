import { cosine, fmt } from "../../lib/zvect.js";
import { M, esc } from "../js/kit.js";
import { LANGS, LANG, AXIS_NAMES, NEG, split, encodeTokens, matches, chips, mountPanel, sampleOf } from "../js/multilang.js";

// 6.2 Reranker in four languages (WIP202610029): stage 1 = bi-encoder top 3 by cosine, stage 2 = a toy reranker that
// reads query and document text together and does not count a word that a negation word denies.
// The five documents are written in all four languages; each language searches its own translation.
// Negation sits before the word in English (not), Thai (ไม่), Chinese (不 / 没) and after it in Japanese (ない).
const DOCS = {
  en: ["the dog is not hungry", "feed my hungry dog rice", "cat and dog are pets", "eat rice and noodle", "write code on a computer"],
  th: ["หมาไม่หิว", "ให้ข้าวหมาที่หิว", "แมวกับหมาเป็นสัตว์เลี้ยง", "กินข้าวและก๋วยเตี๋ยว", "เขียนโค้ดบนคอมพิวเตอร์"],
  zh: ["狗不饿", "给我饿了的狗喂米饭", "猫和狗是宠物", "吃米饭和面条", "在电脑上写代码"],
  jp: ["犬は空腹ではない", "空腹の犬にご飯をあげる", "猫と犬はペットです", "ご飯と麺を食べる", "パソコンでコードを書く"],
};
const SAMPLES = [
  { label: "หมาหิว", want: "d2", text: { en: "hungry dog", th: "หมาหิว", zh: "饥饿的狗", jp: "空腹の犬" } },
  { label: "แมวกับหมา", want: "d3", text: { en: "cat and dog", th: "แมวกับหมา", zh: "猫和狗", jp: "猫と犬" } },
  { label: "กินก๋วยเตี๋ยว", want: "d4", text: { en: "eat noodle", th: "กินก๋วยเตี๋ยว", zh: "吃面条", jp: "麺を食べる" } },
];
const S = 3.2;
const up = (v) => v.map((x) => x * S);

function run(lang, text, mode) {                       // -> { qt, q, s1: top 3 by cos, s2: s1 re-ordered by the reranker }
  const qt = split(text, mode), q = encodeTokens(qt);
  const docs = DOCS[lang].map((d, i) => { const tk = split(d, mode); return { tag: "d" + (i + 1), text: d, tk, v: encodeTokens(tk) }; });
  if (!q.some((x) => x)) return { qt, q, docs, s1: [], s2: [] };
  const s1 = docs.map((d) => ({ ...d, cos: cosine(q, d.v) })).sort((a, b) => b.cos - a.cos).slice(0, 3);
  const s2 = s1.map((d) => ({ ...d, m: matches(qt, d.tk), score: matches(qt, d.tk) + d.cos })).sort((a, b) => b.score - a.score);
  return { qt, q, docs, s1, s2 };
}
const ACC = Object.fromEntries(LANGS.map((l) => [l.id, Object.fromEntries(["space", "dict"].map((m) => {
  const r = SAMPLES.map((s) => run(l.id, s.text[l.id], m));
  return [m, { s1: r.filter((x, i) => x.s1[0]?.tag === SAMPLES[i].want).length, s2: r.filter((x, i) => x.s2[0]?.tag === SAMPLES[i].want).length }];
}))]));
// a document as one line: words that count are bold, a negation word is red, the word it denies is struck through
function said(tk, qt) {
  const want = new Set(qt.map((x) => x.c).filter((c) => c && c !== "NOT")), k = tk.filter((x) => x.c);
  const gap = tk.some((x) => /^[\x00-\x7f]+$/.test(x.t)) ? " " : "";
  return tk.map((x) => {
    const i = k.indexOf(x), denied = x.c && x.c !== "NOT" && ((i > 0 && NEG[k[i - 1].t] === "before") || (i + 1 < k.length && NEG[k[i + 1].t] === "after"));
    const t = esc(x.t);
    return x.c === "NOT" ? `<span class="negw">${t}</span>` : denied && want.has(x.c) ? `<s>${t}</s>` : want.has(x.c) ? `<b>${t}</b>` : t;
  }).join(gap);
}
const bar = (n, css) => `<span class="bar${n ? "" : " zero"}" style="--c: var(${css}); width: ${Math.round((n / SAMPLES.length) * 36)}px"></span>${n}/${SAMPLES.length}`;

export default {
  slug: "reranker",
  title: "Reranker (Cross-Encoder): คัดเร็วก่อน แล้วจัดอันดับใหม่ให้แม่น",
  en: "Reranker (Cross-Encoder)",
  example: "14_reranker",
  axisNames: AXIS_NAMES,
  view: { dist: 10, yaw: 0.7 },
  intro: `
    <p>bi-encoder (บท 6.1) อัดทั้งเอกสารเป็นเวกเตอร์เดียวก่อนเห็นคำถาม จึงพลาดรายละเอียด เช่นคำปฏิเสธ:
    "the dog is not hungry" ได้เวกเตอร์เดียวกับ "hungry dog" พอดี (ใน encoder ของเล่น)</p>
    <p>ระบบจริงจึงค้นสองขั้น: <b>ขั้น 1</b> bi-encoder คัดผู้สมัครอย่างเร็ว (บทนี้ 3 ชิ้น)
    <b>ขั้น 2</b> reranker อ่านคำถามกับเอกสาร <b>พร้อมกันทีละคู่</b> แล้วจัดอันดับใหม่ ช้ากว่าแต่แม่นกว่า
    (reranker ในระบบจริงคือ <b>cross-encoder</b>: ป้อนคำถามกับเอกสารเข้า attention ด้วยกัน)</p>
    <p>reranker ในบทนี้เป็นของจำลอง: นับคำของคำถามที่อยู่ในเอกสาร ไม่นับคำที่ถูกปฏิเสธ แล้วบวก cos ไว้ตัดสินตอนเสมอ
    คำปฏิเสธอยู่ <b>หน้าคำ</b> ในภาษาอังกฤษ ไทย จีน (not · ไม่ · 不) แต่อยู่ <b>หลังคำ</b> ในภาษาญี่ปุ่น (空腹ではない)</p>`,
  try: [
    "สลับ \"แสดงผล\" เป็นขั้น 1: \"the dog is not hungry\" ได้อันดับ 1 ด้วย cos 1.000 · กลับเป็นขั้น 2: \"feed my hungry dog rice\" ขึ้นมาแทน",
    "กด \"ทั้งหมด\": ทุกภาษาพลาดที่ขั้น 1 และ reranker แก้ได้ทุกภาษา ภาษาญี่ปุ่นได้ด้วยเพราะดูคำปฏิเสธที่อยู่หลังคำ",
    "สลับ \"ตัดคำ\" เป็นช่องว่าง: TH / 中文 / 日本語 ไม่ได้ผลทั้งสองขั้น เพราะขั้น 1 หาไม่เจอตั้งแต่แรก",
  ],
  stepsWhy: "คำถามถูกตัดคำแบบบท 6.1 ก่อนเข้าสองขั้นตอนนี้",
  steps: [
    ["คัดเร็วด้วยเวกเตอร์", "cos เร็ว ใช้คัดจากเอกสารจำนวนมากให้เหลือ 3 ชิ้น"],
    ["จัดอันดับใหม่ด้วยข้อความ", "อ่านคำถามกับเอกสารพร้อมกัน จึงจับคำปฏิเสธที่เวกเตอร์มองไม่เห็น แต่ช้ากว่า จึงใช้กับแค่ 3 ชิ้น"],
  ],
  lines: [
    [M.math(M.t("top 3 by\u00a0"), M.fn("cos"), M.row(M.o("("), M.v("q"), M.o(","), M.v("d"), M.o(")"))),
      "ขั้น 1 (bi-encoder): ให้คะแนนทุกเอกสารด้วย cos แล้วเก็บ 3 อันดับแรก · <b>q</b>, <b>d</b> ตัวหนา = เวกเตอร์ของคำถามและเอกสาร · เร็ว จึงใช้คัดจากของจำนวนมาก"],
    [M.math(M.fn("score"), M.row(M.o("("), M.i("q"), M.o(","), M.i("d"), M.o(")")), M.o("="), M.fn("matched"), M.row(M.o("("), M.i("q"), M.o(","), M.i("d"), M.o(")")), M.o("+"), M.fn("cos"), M.row(M.o("("), M.v("q"), M.o(","), M.v("d"), M.o(")"))),
      "ขั้น 2 (reranker): อ่านข้อความคำถาม q กับเอกสาร d (ตัวเอียง = ข้อความ) · matched = จำนวนคำของคำถามที่เจอในเอกสาร ไม่นับคำที่ถูกปฏิเสธ (คำที่รู้จักตัวที่อยู่ติดหลัง not · ไม่ · 不 · 没 หรือติดหน้า ない) · บวก cos ไว้ตัดสินตอนนับคำได้เท่ากัน"],
  ],
  formulaFrom: "การค้นสองขั้น (bi-encoder คัด แล้ว cross-encoder จัดอันดับ 10–100 ชิ้นบนสุด) และปัญหาคำปฏิเสธ มาจากคลิป Byte Goose AI · reranker แบบนับคำ, ตำแหน่งคำปฏิเสธของแต่ละภาษา และเอกสาร 5 ชิ้นใน 4 ภาษา เป็นความรู้ทั่วไป / ผู้จัดทำเลือก · ตัวเลขความแม่นมาจากของเล่นนี้ ไม่ใช่ความแม่นของโมเดลจริง",
  symbols: [
    ["q, d (ตัวหนา)", "เวกเตอร์ของคำถามและเอกสาร ทำแยกกันจาก encoder", "เวกเตอร์เอกสารทำไว้ล่วงหน้าได้"],
    ["cos(q, d)", "ขั้น 1: คะแนนของ bi-encoder", "เร็ว ใช้คัดจากเอกสารจำนวนมาก"],
    ["q, d (ตัวเอียง)", "ข้อความของคำถามและเอกสาร (ไม่ใช่เวกเตอร์)", "reranker อ่านข้อความทั้งคู่พร้อมกัน"],
    ["matched(q, d)", "จำนวนคำของคำถามที่เจอในเอกสาร ไม่นับคำที่ถูกปฏิเสธ", "\"หมาไม่หิว\" นับได้แค่ หมา = 1 · \"犬は空腹ではない\" นับได้แค่ 犬 = 1"],
    ["score(q, d)", "ขั้น 2: คะแนนใหม่ ใช้เรียงผู้สมัครใหม่", "cos อยู่ระหว่าง 0–1 จึงตัดสินแค่ตอนนับคำได้เท่ากัน"],
  ],
  symbolsNote: `<h2>คำปฏิเสธที่ reranker ของเล่นรู้จัก</h2><p class="vocab">อยู่หน้าคำ: not · no · ไม่ · 不 · 没 &nbsp;|&nbsp; อยู่หลังคำ: ない</p>` +
    `<h2>เอกสาร 5 ชิ้น (แปลครบ 4 ภาษา แต่ละภาษาค้นในฉบับของตัวเอง)</h2>` +
    LANGS.map((l) => `<p class="vocab"><b style="color: var(${l.css})">${l.label}</b> ${DOCS[l.id].map((d, i) => `d${i + 1} ${d}`).join(" · ")}</p>`).join("") +
    `<p class="vocab dim">คำที่ตารางรู้จักเหมือนบท 6.1</p>`,
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
      <li>คลิปบอกว่า faithfulness ของคำตอบขึ้นจาก 0.347 เป็น 0.797 เมื่อใช้ RAG ขั้นสูงที่มี reranker · ตรวจทานกับงานวิจัย (เอกสารนโยบายสาธารณสุข):
        0.347 = ไม่ค้นเลย, 0.621 = RAG พื้นฐาน, 0.797 = RAG ขั้นสูง (ตัดเอกสารดีขึ้น + cross-encoder) จึงยกส่วนต่างทั้งหมดให้ reranker อย่างเดียวไม่ได้</li>
      <li>embedding มัก "เห็นคำแล้วตอบใช่" แม้มีคำปฏิเสธ เช่นบันทึกที่เขียนว่าไม่มีเบาหวาน ยังถูกดึงมาเมื่อค้นเบาหวาน reranker หรือ LLM ตรวจซ้ำ (negation verifier) ช่วยกรองได้</li>
    </ul>
    <p class="fine">ความรู้ทั่วไป (ไม่ได้มาจากคลิป): reranker จริงไม่ได้มีกฎคำปฏิเสธเขียนไว้ แต่เรียนรู้จากตัวอย่างว่าคำไหนไปกับคำไหน ภาษาที่วางคำปฏิเสธไว้ต่างที่ (เช่นภาษาญี่ปุ่นวางไว้ท้าย) จึงต้องมีตัวอย่างฝึกของภาษานั้นมากพอ</p>`,
  refs: [["choose", "bi-encoder กับ cross-encoder, pipeline สองขั้น 10–100 ชิ้น, faithfulness 0.347 → 0.797 (ตรวจทาน: 0.621 = RAG พื้นฐาน), ปัญหาคำปฏิเสธ, negation verifier"]],
  mount(ui) {
    const st = { show: ["en"], type: "en", mode: "dict", stage: "2", text: { ...SAMPLES[0].text } };
    mountPanel(ui, st, SAMPLES);
    ui.choice("แสดงผล", [["1", "ขั้น 1: bi-encoder"], ["2", "ขั้น 2: rerank"]], st, "stage");
    const shown = () => LANGS.filter((l) => st.show.includes(l.id));
    const pick = (r) => (st.stage === "1" ? r.s1 : r.s2);
    return {
      draw(s) {
        s.axes(3.8); s.sphere(S);
        const cur = run(st.type, st.text[st.type] || "", st.mode), list = pick(cur);
        for (const d of cur.docs) {                                   // documents of the typed language
          const k = list.findIndex((t) => t.tag === d.tag);
          s.point(up(d.v), k === 0 ? s.c.r : k > 0 ? s.c.b : s.c.ink, k >= 0 ? `${k + 1}. ${d.tag}` : d.tag, { r: k === 0 ? 7 : k > 0 ? 5.5 : 4 });
        }
        if (list.length) s.line(up(cur.q), up(list[0].v), s.c.r, { width: 3 });
        const ls = shown();                                           // colour = language (same as the chips)
        ls.forEach((l, i) => {
          const r = run(l.id, st.text[l.id] || "", st.mode);
          if (!r.s1.length) return;
          s.arrow([0, 0, 0], up(r.q), s.c[l.sc], "", { width: 6 - i * 1.3 });
          if (ls.length === 1) s.label(up(r.q), "q", s.c[l.sc], { dx: -12, dy: -6, align: "right" });
        });
      },
      live() {
        const L = LANG[st.type], cur = run(st.type, st.text[st.type] || "", st.mode);
        const head = `<div class="toks"><span class="lab">${L.label} คำถามหลังตัดคำ:</span>${chips(cur.qt, L.css)}</div>`;
        if (!cur.s1.length) return head + `<p class="verdict">${L.label}: ไม่มีคำที่ตารางรู้จัก ขั้น 1 จึงคัดอะไรไม่ได้ ขั้น 2 ก็ไม่มีอะไรให้จัดอันดับ</p>` + lists();
        const rank2 = (tag) => cur.s2.findIndex((r) => r.tag === tag) + 1;
        const rows = cur.s1.map((r, i) => `<tr class="${(st.stage === "1" ? i === 0 : rank2(r.tag) === 1) ? "win" : ""}"><td>${r.tag}</td><td>${said(r.tk, cur.qt)}</td>
          <td class="nw">${i + 1} <span class="dim">${fmt(r.cos)}</span></td><td>${matches(cur.qt, r.tk)}</td><td class="nw">${rank2(r.tag)} <span class="dim">${fmt(matches(cur.qt, r.tk) + r.cos)}</span></td></tr>`).join("");
        const moved = cur.s1[0].tag !== cur.s2[0].tag;
        return head + `<p class="verdict">${moved ? `${L.label}: reranker เปลี่ยนอันดับ 1 จาก <b>${cur.s1[0].tag}</b> เป็น <b>${cur.s2[0].tag}</b>` : `${L.label}: สองขั้นได้อันดับ 1 ตรงกัน (${cur.s1[0].tag})`}</p>` +
          `<p class="fintro">ผู้สมัคร 3 ชิ้นของ ${L.label} · ขั้น 1 = อันดับตาม cos · ตรง = จำนวนคำที่ตรง (ตัวหนา = นับ, ขีดฆ่า = ถูกปฏิเสธ, สีแดง = คำปฏิเสธ) · ขั้น 2 = อันดับตาม score</p><div class="keep"><table class="rank cands"><thead><tr><th></th><th>เอกสาร</th><th>ขั้น 1</th><th>ตรง</th><th>ขั้น 2</th></tr></thead><tbody>${rows}</tbody></table></div>` + lists();   // div.keep: the candidates stay in the values box (wider), see app.js splitList
      },
    };
    function lists() {
      const rows = shown().map((l) => {
        const r = run(l.id, st.text[l.id] || "", st.mode), smp = sampleOf(SAMPLES, l.id, st.text[l.id]);
        const top = (x) => (x[0] ? x[0].tag : "–");
        const ok = (x) => (!x[0] || !smp ? "" : x[0].tag === smp.want ? ' <span class="ok">✓</span>' : ' <span class="bad">✗</span>');
        return `<tr class="${l.id === st.type ? "win" : ""}"><td class="nw"><span class="sw" style="background: var(${l.css})"></span>${l.label}</td><td class="nw">${top(r.s1)}${ok(r.s1)}</td><td class="nw">${top(r.s2)}${ok(r.s2)}</td></tr>`;
      }).join("");
      const acc = LANGS.map((l) => `<tr class="${st.show.includes(l.id) ? "" : "dimrow"}"><td class="nw"><span class="sw" style="background: var(${l.css})"></span>${l.label}</td><td class="nw">${bar(ACC[l.id][st.mode].s1, l.css)}</td><td class="nw">${bar(ACC[l.id][st.mode].s2, l.css)}</td></tr>`).join("");
      return `<p class="fintro">อันดับ 1 ของแต่ละภาษา:</p><div class="scroll"><table class="rank"><thead><tr><th>ภาษา</th><th>ขั้น 1</th><th>ขั้น 2</th></tr></thead><tbody>${rows}</tbody></table></div>` +
        `<p class="fintro">ความแม่นของ 3 ประโยคตัวอย่าง (ตัดแบบ${st.mode === "dict" ? "พจนานุกรม" : "ช่องว่าง"}):</p><div class="scroll"><table class="rank"><thead><tr><th>ภาษา</th><th>ขั้น 1</th><th>ขั้น 2</th></tr></thead><tbody>${acc}</tbody></table></div>` +
        `<p class="ctl-note">ตัวเลขจากของเล่นในบทนี้ ไม่ใช่ความแม่นของโมเดลจริง</p>`;
    }
  },
};
