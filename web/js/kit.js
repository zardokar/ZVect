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
  math: (...xs) => `<math display="block" class="eq">${xs.join("")}</math>`,   // .eq = the equation box in style.css
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
export function makeUI(panel, notify) {
  const handles = new WeakMap(); // vector array -> its three sliders (for setVec)
  const syncers = [];            // widgets whose look depends on state another control may change (buttons with `pressed`)
  const onChange = () => { for (const f of syncers) f(); notify(); };
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
    panel, // the <form>; a lesson may add a layout class to it (app.js resets the class on every lesson)
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
    // a row of buttons: list = [[text, fn], ...]; fn runs, then the lesson redraws.
    // pressed (optional) = () => index of the button whose result is on screen now (-1 = none): that button is shown
    // pressed, and it updates after any change, e.g. typing over a sample (owner, 2026-10-11 14:55: "กดแล้วไม่เหมือนกด").
    // visible (optional) = () => whether the group is shown now: a lone "back to the default" button appears only after the
    // learner has changed something (owner, 2026-10-11 21:30: "ถ้ามันมีตัวเลือกเดียวจะแสดงทำไม").
    buttons(title, list, { pressed = null, visible = null } = {}) {
      const box = group(title);
      const wrap = document.createElement("div");
      wrap.className = pressed ? "seg pick" : "seg";
      const btns = list.map(([text, fn]) => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = text;
        b.addEventListener("click", () => { fn(); onChange(); });
        wrap.append(b);
        return b;
      });
      if (pressed) {
        const sync = () => { const k = pressed(); btns.forEach((b, i) => b.setAttribute("aria-pressed", String(i === k))); };
        syncers.push(sync);
        queueMicrotask(sync);
      }
      if (visible) {
        const sync = () => { box.style.display = visible() ? "" : "none"; };
        syncers.push(sync);
        sync();
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
      inp.setAttribute("aria-label", title.replace(/<[^>]*>/g, ""));
      inp.addEventListener("input", () => { state[key] = inp.value; onChange(); });
      box.append(inp);
      return inp;
    },
    // chips that can be on together (WIP202610029 languages): options = [[value, text, cssColourVar], ...],
    // state[key] = array of values that are on; at least one stays on. opts.all = text of an "all" chip:
    // all on -> back to opts.allOff(), otherwise -> everything on.
    toggles(title, options, state, key, { all = "", allOff = () => [options[0][0]], after = () => {} } = {}) {
      const box = group(title);
      const wrap = document.createElement("div");
      wrap.className = "seg tog";
      const every = () => options.every(([v]) => state[key].includes(v));
      const sync = () => {
        wrap.querySelectorAll("button[data-v]").forEach((b) => b.setAttribute("aria-pressed", String(state[key].includes(b.dataset.v))));
        allBtn?.setAttribute("aria-pressed", String(every()));
      };
      let allBtn = null;
      if (all) {
        allBtn = document.createElement("button");
        allBtn.type = "button"; allBtn.className = "all"; allBtn.textContent = all;
        allBtn.addEventListener("click", () => { state[key] = every() ? allOff() : options.map(([v]) => v); sync(); after(); onChange(); });
        wrap.append(allBtn);
      }
      for (const [value, text, css] of options) {
        const b = document.createElement("button");
        b.type = "button"; b.dataset.v = value; b.style.setProperty("--c", `var(${css})`);
        b.innerHTML = `<span class="dot" aria-hidden="true"></span>${text}`;
        b.addEventListener("click", () => {
          const on = state[key].includes(value);
          if (on && state[key].length === 1) return;                       // keep at least one
          state[key] = on ? state[key].filter((x) => x !== value) : options.map(([v]) => v).filter((v) => v === value || state[key].includes(v));
          sync(); after(); onChange();
        });
        wrap.append(b);
      }
      queueMicrotask(sync);
      box.append(wrap);
      return { sync };
    },
    // a text box with a small tag picker in front; each tag keeps its own text (state[textKey][tag]).
    // tags = [[value, text, cssColourVar], ...]; onTag runs when the tag changes. sync() re-reads the state.
    tagText(title, tags, state, tagKey, textKey, placeholder = "", onTag = () => {}) {
      const box = group(title);
      const row = document.createElement("div");
      row.className = "tagtext";
      const sel = document.createElement("select");
      sel.setAttribute("aria-label", "ภาษาที่พิมพ์");
      sel.innerHTML = tags.map(([v, t]) => `<option value="${v}">${t}</option>`).join("");
      const inp = document.createElement("input");
      inp.type = "text"; inp.placeholder = placeholder; inp.className = "txt";
      inp.setAttribute("aria-label", title.replace(/<[^>]*>/g, ""));
      const sync = () => {
        sel.value = state[tagKey]; inp.value = state[textKey][state[tagKey]] ?? "";
        sel.style.setProperty("--c", `var(${tags.find(([v]) => v === state[tagKey])[2]})`);
      };
      sel.addEventListener("change", () => { state[tagKey] = sel.value; onTag(); sync(); onChange(); });
      inp.addEventListener("input", () => { state[textKey] = { ...state[textKey], [state[tagKey]]: inp.value }; onChange(); });
      row.append(sel, inp);
      box.append(row);
      sync();
      return { sync, input: inp };
    },
    // an on/off button in the top-right corner of the canvas (owner, 2026-10-11 14:46: "เพิ่มปุ่ม ปิดเงา")
    corner(text, state, key) {
      const b = document.createElement("button");
      b.type = "button"; b.className = "ctool";
      const sync = () => { b.setAttribute("aria-pressed", String(!!state[key])); b.textContent = (state[key] ? "ซ่อน" : "แสดง") + text; };
      b.addEventListener("click", () => { state[key] = !state[key]; sync(); onChange(); });
      sync();
      document.querySelector("#ctools")?.append(b);
      return { sync };
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
