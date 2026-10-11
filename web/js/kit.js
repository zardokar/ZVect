// kit.js — small helpers for lessons: MathML builders and form controls.
// MathML is built into modern browsers, so formulas need no library.

// ---------- numbers ----------
export const r2 = (x) => {
  const v = Math.round(x * 100) / 100;
  return Object.is(v, -0) ? 0 : v;
};
export const deg = (rad) => (rad * 180) / Math.PI;

// ---------- MathML ----------
const cls = (c) => (c ? ` class="${c}"` : "");
export const M = {
  math: (...xs) => `<math display="block">${xs.join("")}</math>`,
  row: (...xs) => `<mrow>${xs.join("")}</mrow>`,
  i: (s, c = "") => `<mi${cls(c)}>${s}</mi>`,
  // bold vector name, e.g. M.v("a")
  v: (s, c = "") => `<mi class="vecname${c ? " " + c : ""}">${s}</mi>`,
  o: (s) => `<mo>${s}</mo>`,
  // function name like cos, with proper spacing after it
  fn: (name) => `<mi>${name}</mi><mspace width="0.2em"></mspace>`,
  t: (s) => `<mtext>${s}</mtext>`,
  // number; negatives get parentheses when wrap = true
  n: (x, c = "", wrap = false) => {
    const s = typeof x === "number" ? String(r2(x)).replace("-", "−") : x;
    const mn = `<mn${cls(c)}>${s}</mn>`;
    return wrap && typeof x === "number" && r2(x) < 0 ? `<mrow><mo>(</mo>${mn}<mo>)</mo></mrow>` : mn;
  },
  sup: (b, e) => `<msup>${b}${e}</msup>`,
  sub: (b, s) => `<msub>${b}${s}</msub>`,
  sqrt: (...xs) => `<msqrt>${xs.join("")}</msqrt>`,
  frac: (a, b) => `<mfrac><mrow>${a}</mrow><mrow>${b}</mrow></mfrac>`,
  abs: (...xs) => `<mrow><mo>|</mo>${xs.join("")}<mo>|</mo></mrow>`,
  // ( a, b, c ) tuple
  tuple: (parts) => `<mrow><mo>(</mo>${parts.join("<mo>,</mo>")}<mo>)</mo></mrow>`,
  sum: (lo, hi) => `<munderover><mo>∑</mo>${lo}${hi}</munderover>`,
  // matrix in square brackets: rows = [[cell, ...], ...] (cells are MathML strings)
  mat: (rows) => `<mrow><mo>[</mo><mtable>${rows.map((r) => `<mtr>${r.map((c) => `<mtd>${c}</mtd>`).join("")}</mtr>`).join("")}</mtable><mo>]</mo></mrow>`,
};
export const AX = ["cx", "cy", "cz"]; // CSS classes that color x / y / z parts

// ---------- controls ----------
// Each lesson gets a `ui` built on its control panel; any change calls onChange().
export function makeUI(panel, onChange) {
  const handles = new WeakMap(); // vector array -> its three sliders (for setVec)
  const group = (title) => {
    const box = document.createElement("fieldset");
    box.className = "ctl-group";
    if (title) box.innerHTML = `<legend>${title}</legend>`;
    panel.append(box);
    return box;
  };

  function slider(box, { label, cls: c = "", min = -5, max = 5, step = 0.5, value = 0, onInput }) {
    const id = "s" + Math.random().toString(36).slice(2, 8);
    const row = document.createElement("div");
    row.className = "ctl";
    row.innerHTML = `<label for="${id}" class="${c}">${label}</label>
      <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}">
      <output for="${id}">${r2(value)}</output>`;
    const inp = row.querySelector("input"), out = row.querySelector("output");
    inp.addEventListener("input", () => { out.textContent = r2(+inp.value); onInput(+inp.value); onChange(); });
    box.append(row);
    return { set(v) { v = Math.min(max, Math.max(min, v)); inp.value = v; out.textContent = r2(v); onInput(v); } };
  }

  return {
    // three sliders x, y, z that edit the array `v` in place
    vec3(title, v, { min = -5, max = 5, step = 0.5 } = {}) {
      const box = group(title);
      handles.set(v, ["x", "y", "z"].map((k, i) =>
        slider(box, { label: k, cls: AX[i], min, max, step, value: v[i], onInput: (x) => (v[i] = x) })));
      return v;
    },
    // move the sliders of a vec3 (and the vector) to new values; call from a button
    setVec(v, values) {
      (handles.get(v) || []).forEach((s, i) => s.set(values[i]));
    },
    // a row of buttons: list = [[text, fn], ...]; fn runs, then the lesson redraws
    buttons(title, list) {
      const box = group(title);
      const wrap = document.createElement("div");
      wrap.className = "seg";
      for (const [text, fn] of list) {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = text;
        b.addEventListener("click", () => { fn(); onChange(); });
        wrap.append(b);
      }
      box.append(wrap);
    },
    number(title, label, state, key, { min = -2, max = 2, step = 0.1 } = {}) {
      const box = group(title);
      return slider(box, { label, min, max, step, value: state[key], onInput: (x) => (state[key] = x) });
    },
    choice(title, options, state, key) {
      const box = group(title);
      const wrap = document.createElement("div");
      wrap.className = "seg";
      wrap.setAttribute("role", "radiogroup");
      const sync = () => wrap.querySelectorAll("button").forEach((x, i) =>
        x.setAttribute("aria-checked", String(options[i][0] === state[key])));
      for (const [value, text] of options) {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = text; b.setAttribute("role", "radio");
        b.addEventListener("click", () => { state[key] = value; sync(); onChange(); });
        wrap.append(b);
      }
      queueMicrotask(sync);
      box.append(wrap);
      return { set(v) { state[key] = v; sync(); } }; // for preset buttons
    },
    // several dropdowns in one row: slots = [[key, prefix], ...]
    select(title, slots, options, state) {
      const box = group(title);
      const row = document.createElement("div");
      row.className = "selects";
      for (const [key, prefix] of slots) {
        if (prefix) row.insertAdjacentHTML("beforeend", `<span class="op">${prefix}</span>`);
        const sel = document.createElement("select");
        sel.setAttribute("aria-label", key);
        sel.innerHTML = options.map(([v, t]) => `<option value="${v}"${v === state[key] ? " selected" : ""}>${t}</option>`).join("");
        sel.addEventListener("change", () => { state[key] = sel.value; onChange(); });
        row.append(sel);
      }
      box.append(row);
    },
    text(title, state, key, placeholder = "") {
      const box = group(title);
      const inp = document.createElement("input");
      inp.type = "text"; inp.value = state[key]; inp.placeholder = placeholder; inp.className = "txt";
      inp.addEventListener("input", () => { state[key] = inp.value; onChange(); });
      box.append(inp);
      return inp;
    },
    note(html) {
      const p = document.createElement("p");
      p.className = "ctl-note"; p.innerHTML = html;
      panel.append(p);
      return p;
    },
  };
}

// keep(): a lesson's own data, saved in THIS browser (localStorage). GitHub Pages is static (no server), so the
// lesson ships DEFAULTS in its code, and anything the learner adds is stored under "zvect.<key>" on their browser.
// Keys carry the "zvect." prefix because every repo under zardokar.github.io shares one localStorage.
// valid(value) rejects broken or edited data, and then the defaults are used. Private mode: works, just not saved.
export function keep(key, defaults, valid = () => true) {
  const k = "zvect." + key, copy = () => JSON.parse(JSON.stringify(defaults));
  let loaded = null;
  try { loaded = JSON.parse(localStorage.getItem(k)); } catch { loaded = null; }
  const store = {
    value: loaded !== null && valid(loaded) ? loaded : copy(),
    fromBrowser: loaded !== null && valid(loaded),
    save() { try { localStorage.setItem(k, JSON.stringify(store.value)); } catch { /* storage blocked */ } },
    reset() { store.value = copy(); store.fromBrowser = false; try { localStorage.removeItem(k); } catch { /* blocked */ } },
  };
  return store;
}

// escape text that may come back from storage before putting it into HTML
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// a small horizontal meter for values in [-1, 1]
export function meter(value, label = "") {
  const pct = ((Math.max(-1, Math.min(1, value)) + 1) / 2) * 100;
  return `<div class="meter" role="img" aria-label="${label} ${r2(value)}">
    <span class="meter-mid"></span><span class="meter-dot" style="left:${pct}%"></span>
    <span class="meter-l">−1</span><span class="meter-c">0</span><span class="meter-r">1</span></div>`;
}
