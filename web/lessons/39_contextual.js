// Lesson 4.7 contextual — COMPONENT: controls, canvas and live box. One idea: a static model gives a word one vector,
// a contextual model mixes it with the sentence. Logic: web/js/contextual.js · text: 39_contextual.text.js · config: web/data/contextual.json.
import { cosine, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { contextualize, embed, senseCos, findSentence, row } from "../js/contextual.js";
import { TEXT, UI, at, fill } from "./39_contextual.text.js";

const SETUP = await fetch(new URL("../data/contextual.json", import.meta.url)).then((r) => {
  if (!r.ok) {
    throw new Error("contextual.json " + r.status);
  }
  return r.json();
});
const { config: CFG, data: DATA } = SETUP;
const TABLE = DATA.table;
const MODES = ["static", "contextual"];

function num(x) {
  return M.n(fmt(x).replace("-", "−"));
}
function tuple(v) {
  return M.tuple(v.map((x) => {
    return num(x);
  }));
}

// the word's vector in the chosen sentence and in the other sentence of the same case
function vectors(st) {
  const found = findSentence(DATA, st.s);
  const w = found.item.word;
  const here = embed(CFG, TABLE, w, found.sentence.words, st.mode);
  const there = embed(CFG, TABLE, w, found.other.words, st.mode);
  return { found, w, here, there };
}

// the canvas: every word of the case, the static row (grey), this sentence (pink), the other sentence (faint yellow)
function drawScene(s, st) {
  s.grid(4);
  s.axes(4.6);
  const { found, w, here, there } = vectors(st);
  const words = new Set([...found.sentence.words, ...found.other.words]);
  for (const x of words) {
    if (x === w || found.item.senses.includes(x)) {
      continue;
    }
    const inHere = found.sentence.words.includes(x);
    s.point(row(TABLE, x), inHere ? s.c.ink : s.c.muted, "", { r: inHere ? 5 : 3 });
    s.label(row(TABLE, x), x, inHere ? s.c.ink : s.c.muted, { dx: -8, dy: 16, size: inHere ? 13 : 11, align: "right" });
  }
  for (const x of found.item.senses) {
    s.point(row(TABLE, x), s.c.r, "", { r: 7, ring: true });
    s.label(row(TABLE, x), x, s.c.r, { dx: 12, dy: -6, size: 13, weight: 700 });
  }
  s.arrow([0, 0, 0], row(TABLE, w), s.c.muted, "", { width: 1.6 });
  s.arrow([0, 0, 0], there, s.c.b, "", { width: 1.4 });
  s.arrow([0, 0, 0], here, s.c.a, "", { width: 3.5, layer: 2 });
  s.label(here, w, s.c.a, { dx: -10, dy: -8, size: 14, weight: 800, align: "right" });
}

// the table of scores and weights of contextual steps 2-3
function weightTable(found, w) {
  const got = contextualize(CFG, TABLE, w, found.sentence.words);
  const rows = found.sentence.words.map((x, j) => {
    return `<tr><td>${x}</td><td>${fmt(got.scores[j])}</td><td>${fmt(got.weights[j])}</td></tr>`;
  }).join("");
  const head = UI.head.map((h) => {
    return `<th>${h}</th>`;
  }).join("");
  return `<p class="fintro">${fill(UI.scoreIntro, { s: found.sentence.text })}</p>` +
    `<div class="scroll"><table class="rank"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

// cos with each sense word, the closest sense, and the same word in the two sentences
function senseBox(st, v) {
  const sc = senseCos(v.here, TABLE, v.found.item.senses, CFG.tieEps);
  const lines = sc.list.map((x) => {
    return M.math(M.fn("cos"), M.row(M.o("("), M.v(st.mode === "static" ? "e" : "c"), M.o(","), M.v("E"), at(x.sense), M.o(")")), M.o("="), num(x.cos));
  }).join("");
  const verdict = sc.tie ? UI.tie : fill(UI.closest, { best: sc.best });
  const why = st.mode === "static" ? UI.whyStatic : UI.whyContextual;
  const between = fill(UI.between, { w: v.w, c: fmt(cosine(v.here, v.there)), why });
  return `<p class="fintro">${UI.senseIntro}</p>` + lines + `<p class="verdict">${verdict}</p><p class="ctl-note">${between}</p>`;
}

// the values box: e (static), the contextual steps when chosen, then the senses
function liveBox(st) {
  const v = vectors(st);
  const eLine = M.math(M.v("e"), M.o("="), M.v("E"), at(v.w), M.o("="), tuple(row(TABLE, v.w)));
  if (st.mode === "static") {
    return eLine + `<p class="fintro">${fill(UI.staticLine, { w: v.w })}</p>` + senseBox(st, v);
  }
  const cLine = M.math(M.v("c"), M.o("="), M.row(M.sum(M.i("j"), M.row()), M.sub(M.v("a"), M.i("j")), M.v("E"), at("xⱼ")), M.o("="), tuple(v.here));
  return eLine + weightTable(v.found, v.w) + cLine + senseBox(st, v);
}

// controls: the sentence (4 sentences, 2 per word) and the kind of embedding
function mountControls(ui, st) {
  const sentences = DATA.cases.flatMap((c) => {
    return c.sentences.map((s) => {
      return [s.id, s.text];
    });
  });
  const modes = MODES.map((m) => {
    return [m, UI.modes[m]];
  });
  ui.choice(UI.sentence, sentences, st, "s");
  ui.choice(UI.mode, modes, st, "mode");
  ui.note(UI.legend);
}

export default {
  slug: "contextual",
  title: "Static กับ contextual embedding: คำเดียวกัน คนละความหมาย",
  en: "Static vs contextual embeddings",
  example: "39_contextual",
  axisNames: ["dim 1", "dim 2", "dim 3"],
  view: { dist: 12, yaw: 0.6 },
  ...TEXT,
  mount(ui) {
    const st = { s: DATA.cases[0].sentences[0].id, mode: MODES[0] };
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
