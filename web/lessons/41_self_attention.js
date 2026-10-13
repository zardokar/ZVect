// Lesson 10.2 self-attention — COMPONENT: controls, canvas and live box. One idea: each token's new vector is a weighted
// mix of all value vectors, weights = softmax(QKᵀ/√d_k). Logic: web/js/attention.js · text: 41_self_attention.text.js.
import { scale, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { attention, indexOf } from "../js/attention.js";
import { TEXT, UI, fill } from "./41_self_attention.text.js";

const SETUP = await fetch(new URL("../data/transformer.json", import.meta.url)).then((r) => {
  if (!r.ok) {
    throw new Error("transformer.json " + r.status);
  }
  return r.json();
});
const DATA = SETUP.data.attn;
const DRAW = 2;   // canvas scale: toy values 0..2 drawn 0..4

function up(v) {
  return scale(v, DRAW);
}
function tuple(v) {
  return M.tuple(v.map((x) => {
    return M.n(fmt(x));
  }));
}
function run(st) {
  return attention(DATA.X, DATA.Wq, DATA.Wk, DATA.Wv, { scale: st.scale, causal: st.mask === "causal" });
}

function drawScene(s, st) {
  s.grid(4);
  s.axes(4.6);
  const r = run(st);
  const i = indexOf(DATA.tokens, st.w);
  DATA.X.forEach((x, j) => {
    const w = r.A[i][j];
    if (w > 0) {
      s.line(up(r.out[i]), up(x), s.c.r, { width: 0.5 + 8 * w, alpha: 0.35 + 0.65 * w });
    }
    s.point(up(x), j === i ? s.c.b : s.c.muted, "", { r: j === i ? 7 : 5 });
    s.label(up(x), DATA.tokens[j], j === i ? s.c.b : s.c.ink, { dx: 10, dy: -6, size: 13 });
  });
  s.arrow([0, 0, 0], up(r.out[i]), s.c.a, "", { width: 3.5, layer: 2 });
  s.label(up(r.out[i]), "out", s.c.a, { dx: -10, dy: -12, size: 14, weight: 800, align: "right" });
}

function rowTable(r, i) {
  const rows = DATA.tokens.map((t, j) => {
    const off = r.S[i][j] === -Infinity;
    const cls = r.A[i][j] === Math.max(...r.A[i]) ? ' class="win"' : "";
    const sc = off ? UI.masked : fmt(r.S[i][j]);
    return `<tr${cls}><td>${t}</td><td>${fmt(r.raw[i][j])}</td><td>${sc}</td><td>${fmt(r.A[i][j])}</td></tr>`;
  }).join("");
  const head = UI.head.map((h) => {
    return `<th>${h}</th>`;
  }).join("");
  return `<div class="scroll"><table class="rank"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function matrixTable(r) {
  const head = DATA.tokens.map((t, j) => {
    return `<th>${j + 1}</th>`;
  }).join("");
  const rows = r.A.map((row, i) => {
    const cells = row.map((a) => {
      return `<td>${fmt(a)}</td>`;
    }).join("");
    return `<tr><td>${i + 1}</td>${cells}</tr>`;
  }).join("");
  const key = DATA.tokens.map((t, j) => {
    return j + 1 + " " + t;
  }).join(" · ");
  return `<p class="fintro">${UI.matrixIntro} ${key}</p><div class="scroll"><table class="rank"><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function liveBox(st) {
  const r = run(st);
  const i = indexOf(DATA.tokens, st.w);
  const best = r.A[i].indexOf(Math.max(...r.A[i]));
  const qLine = M.math(M.sub(M.v("q"), M.i("i")), M.o("="), tuple(r.Q[i]));
  const outLine = M.math(M.sub(M.t("out"), M.i("i")), M.o("="), M.row(`<mrow class="res">${tuple(r.out[i])}</mrow>`));
  const verdict = fill(UI.verdict, { w: st.w, top: DATA.tokens[best], a: fmt(r.A[i][best]) });
  return qLine + `<p class="fintro">${fill(UI.rowIntro, { w: st.w })}</p>` + rowTable(r, i) + outLine +
    `<p class="verdict">${verdict}</p>` + matrixTable(r);
}

function mountControls(ui, st) {
  const words = DATA.tokens.map((t) => {
    return [t, t];
  });
  const scales = Object.keys(UI.scales).map((k) => {
    return [k, UI.scales[k]];
  });
  const masks = Object.keys(UI.masks).map((k) => {
    return [k, UI.masks[k]];
  });
  ui.choice(UI.word, words, st, "w");
  ui.choice(UI.scale, scales, st, "scale");
  ui.choice(UI.mask, masks, st, "mask");
  ui.note(UI.legend);
}

export default {
  slug: "self-attention",
  title: "Self-attention เต็มสูตร: softmax(QKᵀ/√d)V",
  en: "Self-attention, the full formula",
  example: "41_self_attention",
  axisNames: ["dim 1", "dim 2", "dim 3"],
  view: { dist: 12, yaw: 0.65 },
  ...TEXT,
  mount(ui) {
    const st = { w: DATA.tokens[indexOf(DATA.tokens, DATA.start)], scale: SETUP.config.attn.scale, mask: "off" };
    mountControls(ui, st);
    return {
      draw(s) {
        drawScene(s, st);
      },
      live() {
        return liveBox(st);
      },
    };
  },
};
