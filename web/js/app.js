// app.js — lesson shell: sidebar, hash router, 3D canvas, formula, code tabs.
import { Scene3D } from "./scene3d.js";
import { makeUI } from "./kit.js";
import { highlight } from "./highlight.js";
import { VERSION } from "../../lib/zvect.js";
import { SOURCES } from "./sources.js";
import { dict } from "./dict/index.js";
import { mountDictPage } from "./dict/page.js";

import l1 from "../lessons/01_vector.js";
import l2 from "../lessons/02_dot_product.js";
import l3 from "../lessons/03_cosine.js";
import l4 from "../lessons/04_vector_space.js";
import l5 from "../lessons/05_latent_space.js";
import l6 from "../lessons/06_similarity.js";
import l7 from "../lessons/07_choose_metric.js";
import l8 from "../lessons/08_high_dimensions.js";
import l9 from "../lessons/09_bi_encoder.js";
import l10 from "../lessons/10_classification.js";
import l11 from "../lessons/11_distance.js";
import l12 from "../lessons/12_embedding_matrix.js";
import l13 from "../lessons/13_vector_search.js";
import l14 from "../lessons/14_reranker.js";
import l15 from "../lessons/15_vector_ops.js";
import l16 from "../lessons/16_length.js";
import l17 from "../lessons/17_binary_xor.js";
import l18 from "../lessons/18_search_distance.js";
import l19 from "../lessons/19_search_dot.js";
import l20 from "../lessons/20_matrix.js";
import l21 from "../lessons/21_token_id.js";
import l22 from "../lessons/22_one_hot.js";
import l23 from "../lessons/23_bag_of_words.js";
import l24 from "../lessons/24_learn_table.js";
import l25 from "../lessons/25_llm_input.js";
import l26 from "../lessons/26_attention.js";
import l27 from "../lessons/27_brute_force.js";
import l28 from "../lessons/28_ann_tree.js";
import l29 from "../lessons/29_nsw_graph.js";
import l30 from "../lessons/30_hnsw_beam.js";
import l31 from "../lessons/31_hnsw_build.js";
import l32 from "../lessons/32_filter_graph.js";
import l33 from "../lessons/33_keyword_search.js";
import l34 from "../lessons/34_tokenize.js";
import l35 from "../lessons/35_bpe.js";
import l36 from "../lessons/36_late_interaction.js";
import l37 from "../lessons/37_gpt_tokenizer.js";

// Chapters and lessons in teaching order, numbered 1, 1.1, 1.2, … (owner, 2026-10-11: one idea per lesson,
// "มันควรจะ 1 แล้ว 1.1 1.2"). Each lesson only uses ideas from earlier ones. File prefixes are the order the
// files were written; the displayed number comes from this list.
const GROUPS = [
  { title: "พื้นฐานเวกเตอร์", lessons: [l1, l16, l4, l15, l20] },
  { title: "วัดว่าสองเวกเตอร์ใกล้กันแค่ไหน", lessons: [l11, l2, l3] },
  { title: "เปลี่ยนข้อความเป็นเวกเตอร์", lessons: [l34, l35, l37, l21, l22, l23, l12, l24, l5] },
  { title: "ค้นหาของที่ใกล้ที่สุด", lessons: [l6, l18, l19, l7, l33] },
  { title: "ค้นให้เร็วเมื่อข้อมูลเยอะ", lessons: [l27, l8, l17, l28, l29, l13, l30, l31, l32] },
  { title: "การผสานทฤษฎี", lessons: [l9, l36, l14, l10] },   // was "ใช้งานจริง" (owner 15:55: still theory; 16:04 picked this name)
  { title: "เวกเตอร์ใน LLM", lessons: [l25, l26] },
];
const NUM = new Map(GROUPS.flatMap((g, gi) => g.lessons.map((l, li) => [l, `${gi + 1}.${li + 1}`])));
const CHAPTER = new Map(GROUPS.flatMap((g, gi) => g.lessons.map((l) => [l, `${gi + 1} ${g.title}`])));
const LESSONS = GROUPS.flatMap((g) => g.lessons);
const LANGS = [
  { key: "js", label: "JavaScript", ext: "js", run: (n) => `node examples/js/${n}.js` },
  { key: "cpp", label: "C++", ext: "cpp", run: (n) => `g++ -std=c++17 examples/cpp/${n}.cpp -o ${n}\n.\\${n}.exe   (Linux / macOS: ./${n})` },
  { key: "py", label: "Python", ext: "py", run: (n) => `python examples/py/${n}.py` },
];

const HINT = "ลากเพื่อหมุน ใช้ล้อเมาส์ซูม ดับเบิลคลิกเพื่อรีเซ็ต";
const CANVAS_LABEL = "ภาพ 3 มิติ ลากเพื่อหมุน ล้อเมาส์เพื่อซูม ดับเบิลคลิกเพื่อรีเซ็ต";

const $ = (s) => document.querySelector(s);
const scene = new Scene3D($("#scene"));
let lang = localGet("zvect.lang") || "js";

function localGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function localSet(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } }

// ---------- sidebar ----------
$("#nav").innerHTML = GROUPS.map((g, gi) => `<li class="group"><span class="group-title"><b>${gi + 1}</b> ${g.title}</span><ol>` +
  g.lessons.map((l) => `<li><a href="#/${l.slug}" data-slug="${l.slug}"><span class="num">${NUM.get(l)}</span><span>${l.en}</span></a></li>`).join("") +
  "</ol></li>").join("");
$("#version").textContent = "v" + VERSION;

// ---------- find a lesson: datalist suggestions + live filter of the list below ----------
// Typing narrows the sidebar list (matches title, English name, group, number). Picking a suggestion or
// pressing Enter opens the first match. The search box sits at the top so it never gets pushed down
// when lessons are added.
const findKey = (l, n, g) => `${n} ${l.en} ${l.title} ${g}`.toLowerCase();
const FIND = GROUPS.flatMap((g) => g.lessons.map((l) => ({ l, g: g.title }))).map((x) =>
  ({ ...x, n: NUM.get(x.l), label: `${NUM.get(x.l)} ${x.l.en}`, key: findKey(x.l, NUM.get(x.l), x.g) }));
$("#lessonlist").innerHTML = FIND.map((x) => `<option value="${x.label}">${x.l.title}</option>`).join("");

function findMatches(q) {
  const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return FIND.filter((x) => words.every((w) => x.key.includes(w)));
}
function filterNav(q) {
  const hit = new Set(findMatches(q).map((x) => x.l.slug));
  document.querySelectorAll("#nav a").forEach((a) => a.parentElement.hidden = !!q.trim() && !hit.has(a.dataset.slug));
  document.querySelectorAll("#nav .group").forEach((g) => g.hidden = ![...g.querySelectorAll("li")].some((li) => !li.hidden));
  $("#findnone").hidden = !q.trim() || hit.size > 0;
}
function openFound(x) { location.hash = "#/" + x.l.slug; $("#find").value = ""; filterNav(""); $("#find").blur(); }
$("#find").addEventListener("input", (e) => {
  const q = e.target.value, exact = FIND.find((x) => x.label === q);
  if (exact) return openFound(exact);           // picked from the datalist
  filterNav(q);
});
$("#find").addEventListener("keydown", (e) => {
  if (e.key === "Enter") { const m = findMatches(e.target.value); if (m.length) openFound(m[0]); }
  if (e.key === "Escape") { e.target.value = ""; filterNav(""); }
});
document.addEventListener("keydown", (e) => {        // "/" jumps to the search box
  if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) { e.preventDefault(); $("#find").focus(); }
});

// ---------- router ----------
window.addEventListener("hashchange", route);

function route() {
  const slug = location.hash.replace(/^#\/?/, "") || LESSONS[0].slug;
  // a word added on the Dict page changes what lessons computed when they loaded: start fresh when leaving it
  if (slug !== "dict" && dict.changed) return location.reload();
  document.querySelectorAll("#nav a, #libnav, #dictnav").forEach((a) =>
    a.dataset.slug === slug ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  $("#sidebar").classList.remove("open");
  if (slug === "lib") return showLib();
  if (slug === "dict") return showDict();
  const i = Math.max(0, LESSONS.findIndex((l) => l.slug === slug));
  showLesson(LESSONS[i], i);
}

// ---------- formula, one step at a time ----------
// L.lines = [[MathML, Thai explanation], ...] (owner, 2026-10-11: "ทำไมถึงไม่อธิบายทีละ line ให้เข้าใจ").
// Each line says what it does, what every letter means and why it is there. A lesson with more than one line also has
// L.steps = [[short name, why this step is there], ...] (one per line) and optional L.stepsWhy (owner, 14:30: "บรรทัด ->
// ขั้นตอน และควรอธิบายด้วยว่าทำไมมี 3 ขั้นตอน ... ขั้นตอนแต่ละขั้นคืออะไร มีไว้ทำไม"): the list is shown in the explanation
// block on top, and each formula line is labelled "ขั้นตอน i · name".
function formulaHTML(L) {
  if (!L.lines) return L.formula || "";
  const many = L.lines.length > 1;
  return '<ol class="flines">' + L.lines.map(([math, say], i) => {
    const name = L.steps?.[i]?.[0];
    const label = many ? `ขั้นตอน ${i + 1}${name ? " · " + name : ""}` : "";
    return `<li>${label ? `<span class="fstep">${label}</span>` : ""}<div class="fmath">${math}</div><p class="fsay">${say}</p></li>`;
  }).join("") + "</ol>";
}
function stepsHTML(L) {
  const st = L.steps || [];
  if (st.length < 2) return "";
  return `<h2>สูตรของบทนี้มี ${st.length} ขั้นตอน</h2>` + (L.stepsWhy ? `<p class="stepswhy">${L.stepsWhy}</p>` : "") +
    '<ol class="steplist">' + st.map(([name, why]) => `<li><b>${name}</b>: ${why}</li>`).join("") + "</ol>";
}

// ---------- three boxes: formula (top left), values put in (bottom left), list (right) ----------
// Owner, 2026-10-11: "Formula อยู่กล่องซ้ายบน กับ แทนค่าเข้าไป อยู่กล่องซ้ายล่าง แบ่งออกมาแยกกับ List เป็นกล่องขวา".
// Lessons keep returning one HTML string from live(); tables (with the line that introduces them and the
// small notes after them) are moved to the right-hand list box here, so no lesson code has to change.
// A table wrapped in div.keep (not .scroll) stays in the values box.
function splitList() {
  const live = $("#live"), list = $("#list");
  list.replaceChildren();
  const kids = [...live.children];
  kids.forEach((el, i) => {
    if (!el.matches(".scroll, table")) return;
    const prev = kids[i - 1];
    if (prev && prev.parentElement === live && prev.matches("p.verdict, p.fintro")) list.append(prev);
    list.append(el);
    for (let j = i + 1; j < kids.length && kids[j].matches("p.ctl-note"); j++) list.append(kids[j]);
  });
  const has = list.children.length > 0, val = live.textContent.trim().length > 0;
  $("#listbox").hidden = !has;
  $(".fbox-v").hidden = !val;          // a lesson whose live part is only a table shows just formula + list
  $(".formula").classList.toggle("haslist", has);
  $(".formula").classList.toggle("noval", !val);
}

// No scrollbars inside the boxes (owner, 2026-10-11 12:45: "ไม่ต้องการให้ Block มี Scroll เลย"). A formula wider than
// its box is drawn smaller until it fits (never below half its normal size).
function fitMath() {
  document.querySelectorAll(".formula math").forEach((m) => {
    m.style.fontSize = "";
    // the equation box (.eq) has padding: compare the formula's own width with the room inside the padding
    const cs = getComputedStyle(m), pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const room = m.clientWidth - pad, w = m.scrollWidth - parseFloat(cs.paddingLeft);
    if (room > 0 && w > room) m.style.fontSize = (Math.max(0.5, room / w) * parseFloat(cs.fontSize)).toFixed(2) + "px";
  });
}
new ResizeObserver(() => fitMath()).observe($(".formula"));

// ---------- one lesson ----------
function showLesson(L, i) {
  document.body.dataset.page = "lesson";
  document.title = `ZVect: ${L.en}`;
  $("#step").textContent = `บท ${NUM.get(L)} · ${CHAPTER.get(L)}`;
  $("#title").textContent = L.title;
  $("#intro").innerHTML = L.intro;
  $("#steps").innerHTML = stepsHTML(L);
  $("#try").innerHTML = L.try.map((t) => `<li>${t}</li>`).join("");
  // formulaFrom: where the formula comes from (owner, 2026-10-11: "ใช้สมการใคร ทำไมไม่บอก")
  $("#formula").innerHTML = formulaHTML(L) + (L.formulaFrom ? `<p class="from">ที่มาของสูตร: ${L.formulaFrom}</p>` : "");
  // L.notes = what the sources add, written out here (no "read more" detour); L.refs = [[sourceId, what this lesson used], ...]
  // L.symbols = [[symbol, meaning, why], ...]: the formula read one symbol at a time
  $("#p-sym").innerHTML = (L.symbols || []).length
    ? `<table class="rank symbols"><thead><tr><th>ในสูตร</th><th>คืออะไร</th><th>ทำไม / ตัวอย่าง</th></tr></thead><tbody>` +
      L.symbols.map(([s, m, w]) => `<tr><td class="sym">${s}</td><td>${m}</td><td class="dim">${w}</td></tr>`).join("") + "</tbody></table>"
    : "";
  // L.symbolsNote: reference lists that would crowd the controls (known words, documents), shown under the symbols
  if (L.symbolsNote) $("#p-sym").innerHTML += `<div class="symnote">${L.symbolsNote}</div>`;
  // L.extra (a summary the owner wanted kept, e.g. 4.4) opens the "สรุปจากแหล่ง" tab; the old "อธิบาย" tab is gone
  $("#p-notes").innerHTML = (L.extra ? `<div class="extra">${L.extra}</div>` : "") + (L.notes || "");
  $("#p-refs").innerHTML = refsHTML(L.refs || []);
  showPanel(panelTab);
  $("#hint").textContent = L.hint || HINT;
  $("#scene").setAttribute("aria-label", L.canvasLabel || CANVAS_LABEL);

  const panel = $("#controls");
  panel.innerHTML = "";
  panel.className = "controls";
  $("#ctools").replaceChildren();          // on/off buttons a lesson puts in the canvas corner (ui.corner)
  const live = $("#live");
  let inst;
  const refresh = () => { scene.render(); live.innerHTML = inst.live(); splitList(); fitMath(); };
  inst = L.mount(makeUI(panel, refresh));
  scene.axisNames = L.axisNames || ["x", "y", "z"];
  scene.setView(L.view || {});
  scene.draw = inst.draw || (() => {});
  scene.overlay = inst.draw2d || null; // flat chart lessons draw here instead of in 3D
  scene.flat = inst.zoom2d ? { zoom: 1, x: 0, y: 0 } : null;   // 2D picture that can be zoomed and moved (3.1, 3.2, 3.3)
  refresh();

  const prev = LESSONS[i - 1], next = LESSONS[i + 1];
  $("#pager").innerHTML =
    (prev ? `<a href="#/${prev.slug}">← ${NUM.get(prev)} ${prev.en}</a>` : "") +
    (next ? `<a href="#/${next.slug}" class="next">${NUM.get(next)} ${next.en} →</a>` : `<a href="#/lib" class="next">เอา lib ไปใช้ →</a>`);

  showCode(L.example);
  $("#main").scrollTo?.(0, 0);
  window.scrollTo(0, 0);
}

// ---------- bottom tabs: อ่านสูตร / สรุปจากแหล่ง / โค้ด / Ref ----------
// The explanation (intro + ลองทำ) is no longer a tab: it sits on top, full width (owner, 2026-10-11 13:54).
const PANES = [["sym", "อ่านสูตร"], ["notes", "สรุปจากแหล่ง"], ["code", "โค้ด"], ["refs", "Ref"]];
let panelTab = "sym";
$("#ptabs").innerHTML = PANES.map(([k, t]) =>
  `<button role="tab" id="pt-${k}" aria-controls="p-${k}" data-pane="${k}">${t}</button>`).join("");
$("#ptabs").onclick = (e) => { const b = e.target.closest("button"); if (b) showPanel(b.dataset.pane); };
$("#ptabs").onkeydown = (e) => {
  const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
  if (!d) return;
  const k = PANES.findIndex(([p]) => p === panelTab);
  showPanel(PANES[(k + d + PANES.length) % PANES.length][0]);
  $(`#pt-${panelTab}`).focus();
};
function showPanel(k) {
  panelTab = k;
  for (const [p] of PANES) {
    const on = p === k;
    $(`#pt-${p}`).setAttribute("aria-selected", on);
    $(`#pt-${p}`).tabIndex = on ? 0 : -1;
    $(`#p-${p}`).hidden = !on;
  }
  $(".pbody").scrollTop = 0;
}

function refsHTML(refs) {
  if (!refs.length) return "<p>บทนี้ไม่ได้ใช้แหล่งภายนอก</p>";
  return "<ol>" + refs.map(([id, used]) => {
    const s = SOURCES[id];
    return `<li><b>${s.title}</b><br><span class="by">${s.by} · ${s.date}</span><br>
      <span class="used">บทนี้ใช้: ${used}</span><br>
      <a href="${s.url}" target="_blank" rel="noopener">คลิปต้นฉบับ</a> ·
      <a href="${s.report}" target="_blank" rel="noopener">รายงานภาษาไทยฉบับเต็ม</a></li>`;
  }).join("") + "</ol>";
}

// ---------- code tabs: the same files as examples/ ----------
const cache = new Map();
async function fetchText(url) {
  if (!cache.has(url)) cache.set(url, fetch(url).then((r) => (r.ok ? r.text() : `// ${url}: ${r.status}`)));
  return cache.get(url);
}

function showCode(name) {
  const tabs = $("#tabs");
  tabs.innerHTML = LANGS.map((l) =>
    `<button role="tab" id="tab-${l.key}" aria-controls="codebox" aria-selected="${l.key === lang}" data-lang="${l.key}">${l.label}</button>`).join("");
  tabs.onclick = (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    lang = b.dataset.lang; localSet("zvect.lang", lang);
    showCode(name);
  };
  tabs.onkeydown = (e) => {
    const k = LANGS.findIndex((l) => l.key === lang);
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    lang = LANGS[(k + d + LANGS.length) % LANGS.length].key;
    showCode(name);
    $(`#tab-${lang}`).focus();
  };
  const L = LANGS.find((l) => l.key === lang);
  const path = `examples/${L.key}/${name}.${L.ext}`;
  $("#codepath").textContent = path;
  $("#run").textContent = L.run(name);
  fetchText("../" + path).then((src) => {
    $("#code").innerHTML = highlight(src, L.key);
    $("#copy").onclick = () => navigator.clipboard?.writeText(src).then(() => flash("#copy", "คัดลอกแล้ว"));
  });
}

function flash(sel, text) {
  const b = $(sel), old = b.textContent;
  b.textContent = text;
  setTimeout(() => (b.textContent = old), 1200);
}

// ---------- lib page ----------
async function showLib() {
  document.body.dataset.page = "lib";
  document.title = "ZVect: Library";
  const man = await fetch("../lib/MANIFEST.json").then((r) => r.json()).catch(() => null);
  const rows = (man?.files || []).map((f) =>
    `<tr><td><a href="../lib/${f.file}" download>${f.file}</a></td><td>${f.bytes.toLocaleString()} bytes</td>
     <td><code class="hash" title="${f.sha256}">${f.sha256.slice(0, 16)}…</code></td></tr>`).join("");
  $("#libpage").innerHTML = `
    <p class="step">ไลบรารี</p>
    <h1>เอา zvect ไปใช้</h1>
    <p class="lede">ไลบรารีเวกเตอร์ไฟล์เดียว ไม่มี dependency มีสามภาษาที่ใช้ API เดียวกัน
      ทุกบทเรียนในเว็บนี้ก็เรียกใช้ไฟล์เดียวกันนี้ (เวอร์ชัน ${man?.version ?? VERSION})</p>
    <table class="files"><thead><tr><th>ไฟล์</th><th>ขนาด</th><th>sha256</th></tr></thead><tbody>${rows}</tbody></table>
    <p><a href="../lib/MANIFEST.json">MANIFEST.json</a> เก็บ sha256 ของทุกไฟล์ไว้ตรวจว่าไฟล์ที่ดาวน์โหลดไม่ถูกแก้</p>

    <h2>ใช้ใน JavaScript (Node หรือ browser)</h2>
    <pre class="code">${highlight(`import { cosine, topK } from "./zvect.js";\n\nconsole.log(cosine([1, 2, 3], [2, 4, 6])); // 1`, "js")}</pre>
    <h2>ใช้ใน Python</h2>
    <pre class="code">${highlight(`from zvect import cosine, top_k\n\nprint(cosine([1, 2, 3], [2, 4, 6]))  # 1.0`, "py")}</pre>
    <h2>ใช้ใน C++17</h2>
    <pre class="code">${highlight(`#include "zvect.hpp"\n\nint main() { double c = zv::cosine({1, 2, 3}, {2, 4, 6}); }`, "cpp")}</pre>

    <h2>ให้ AI session อื่นใช้</h2>
    <p>ส่งลิงก์ไฟล์ <code>llms.txt</code> ที่ root ของ repo ให้ AI อ่าน ไฟล์นี้บอก API ทั้งหมด
      ลิงก์ดาวน์โหลดแบบ raw และวิธีตรวจ sha256 ไว้ในที่เดียว</p>
    <pre class="code">https://raw.githubusercontent.com/zardokar/ZVect/main/llms.txt</pre>
    <p class="fine">ใช้ได้เพื่อศึกษาและทดลอง ห้ามใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาต ดู <a href="../LICENSE">LICENSE</a></p>`;
}


// ---------- Dict page: web/js/dict/page.js (the dictionary itself is the facade in web/js/dict/index.js) ----------
function showDict() {
  document.body.dataset.page = "lib";
  mountDictPage($("#libpage"));
}

route(); // start after everything above is defined
