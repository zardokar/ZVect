// Lesson 4.6 same-model — COMPONENT: controls, canvas and live box. One idea: a vector only means something inside the
// model that made it. Logic: web/js/samemodel.js · text: 38_same_model.text.js · config: web/data/same_model.json.
import { scale, cosine, fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { train, rankDocs, relation, redrawGrouped, partnerOf, seedFrom } from "../js/samemodel.js";
import { TEXT, UI, at, fill } from "./38_same_model.text.js";

const SETUP = await fetch(new URL("../data/same_model.json", import.meta.url)).then((r) => {
  if (!r.ok) {
    throw new Error("same_model.json " + r.status);
  }
  return r.json();
});
const { config: CFG, data: DATA } = SETUP;
const MODELS = ["A", "B"];

function tableName(m) {
  return M.sub(M.v("E"), M.i(m));
}
function num(x) {
  return M.n(fmt(x).replace("-", "−"));
}
function tuple(v) {
  return M.tuple(v.map((x) => {
    return num(x);
  }));
}
function randomSeed() {
  return seedFrom(Math.random());
}

// the canvas: both tables (pink A, yellow B), arrows to the documents, the question arrow and a ring on top-1
function drawScene(s, st, model) {
  s.grid(4);
  s.axes(4.6);
  const col = { A: s.c.a, B: s.c.b };
  for (const m of MODELS) {
    const docs = m === st.d;
    for (const w of DATA.vocab) {
      const p = model[m][w];
      const mate = model[m][partnerOf(DATA.vocab, w)];
      if (docs) {
        s.arrow([0, 0, 0], p, col[m], "", { width: 1.4 });
      }
      s.point(p, col[m], "", { r: docs ? 6 : 4 });
      // partners end up close: the higher one is labelled above, the other below
      s.label(p, w + "·" + m, col[m], { dx: 10, dy: p[1] >= mate[1] ? -4 : 16, size: docs ? 13 : 11, weight: docs ? 700 : 500 });
    }
  }
  const q = model[st.q][st.w];
  const top = model[st.d][rankDocs(q, model[st.d], DATA.vocab)[0].id];
  s.arrow([0, 0, 0], q, col[st.q], "", { width: 3.5, layer: 2 });
  s.point(top, s.c.r, "", { r: 10, ring: true, layer: 2 });
  s.line(q, top, s.c.r, { dash: [4, 4], width: 1.5, layer: 2 });
  s.label(scale(q, 0.5), "q", col[st.q], { dx: -18, dy: 4, size: 15, weight: 800 });
}

// the ranking table (moved to the right-hand list box by app.js)
function rankTable(st, ranked) {
  const rows = ranked.map((x, i) => {
    const g = DATA.group[x.id];
    const note = fill(UI.relation[relation(x.id, st.w, DATA.group)], { g });
    const win = i === 0 ? ' class="win"' : "";
    return `<tr${win}><td>${i + 1}</td><td>${x.id}·${st.d}</td><td>${fmt(x.score)}</td><td class="dim">${note}</td></tr>`;
  }).join("");
  const head = UI.head.map((h) => {
    return `<th>${h}</th>`;
  }).join("");
  return `<p class="fintro">${fill(UI.listIntro, { n: ranked.length, d: st.d })}</p>` +
    `<div class="scroll"><table class="rank"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

// the values box: q, the same word from both models against the stored document, the verdict, the table
function liveBox(st, model) {
  const q = model[st.q][st.w];
  const ranked = rankDocs(q, model[st.d], DATA.vocab);
  const top = ranked[0].id;
  const cosLine = (m) => {
    const value = num(cosine(model[m][st.w], model[st.d][st.w]));
    const shown = m === st.q ? M.row(`<mrow class="res">${value}</mrow>`) : value;
    return M.math(M.fn("cos"), M.row(M.o("("), tableName(m), at(st.w), M.o(","), tableName(st.d), at(st.w), M.o(")")), M.o("="), shown);
  };
  const luck = top === st.w ? UI.luckRight : UI.luckWrong;
  const sameText = top === st.w ? UI.sameVerdict : UI.sameTie;
  const verdict = st.q === st.d ? fill(sameText, { q: st.q, top }) : fill(UI.mixedVerdict, { q: st.q, d: st.d, top, luck });
  const w0 = DATA.vocab[0];
  const mate = partnerOf(DATA.vocab, w0);
  const pairCos = (m) => {
    return fmt(cosine(model[m][w0], model[m][mate]));
  };
  const inside = fill(UI.inside, { w: w0, mate, a: pairCos("A"), b: pairCos("B") });
  return M.math(M.v("q"), M.o("="), tableName(st.q), at(st.w), M.o("="), tuple(q)) +
    `<p class="fintro">${fill(UI.crossIntro, { w: st.w, d: st.d })}</p>` + cosLine("A") + cosLine("B") +
    `<p class="verdict">${verdict}</p>` + rankTable(st, ranked) + `<p class="ctl-note">${inside}</p>`;
}

// controls: word, question model, document model, and B's random start
function mountControls(ui, st, model) {
  const models = MODELS.map((m) => {
    return [m, fill(UI.modelName, { m })];
  });
  const words = DATA.vocab.map((w) => {
    return [w, w];
  });
  ui.choice(UI.word, words, st, "w");
  ui.choice(UI.qModel, models, st, "q");
  ui.choice(UI.dModel, models, st, "d");
  const redraw = () => {
    // 5 passes are not always enough: draw again until B groups its words like the code's B does
    const got = redrawGrouped(CFG, DATA, randomSeed, st.seedB, CFG.maxTries);
    st.seedB = got.seed;
    model.B = got.E;
  };
  const byCode = () => {
    st.seedB = CFG.seedB;
    model.B = train(CFG, DATA, CFG.seedB);
  };
  const pressed = () => {
    return st.seedB === CFG.seedB ? 1 : 0;
  };
  ui.buttons(UI.seedGroup, [[UI.random, redraw], [fill(UI.byCode, { seed: CFG.seedB }), byCode]], { pressed });
  ui.note(UI.legend);
}

export default {
  slug: "same-model",
  title: "ต้องใช้ model เดียวกันทั้งคำถามและเอกสาร",
  en: "Same model for query and documents",
  example: "38_same_model",
  view: { dist: 12, yaw: 0.7 },
  ...TEXT,
  mount(ui) {
    const st = { w: DATA.vocab[0], q: "A", d: "A", seedB: CFG.seedB };
    const model = { A: train(CFG, DATA, CFG.seedA), B: train(CFG, DATA, CFG.seedB) };
    mountControls(ui, st, model);
    return {
      draw(s) {
        drawScene(s, st, model);
      },
      live() {
        return liveBox(st, model);
      },
    };
  },
};
