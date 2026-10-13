// Lesson 10.1 transformer-why — COMPONENT: controls, flat picture and live box. One idea: an RNN passes information
// step by step through one hidden state; attention connects every token directly. Logic: web/js/tblock.js · text: 40_transformer_why.text.js.
import { fmt } from "../../lib/zvect.js";
import { rnnHops, kept, sequentialSteps } from "../js/tblock.js";
import { TEXT, UI, fill } from "./40_transformer_why.text.js";

const SETUP = await fetch(new URL("../data/transformer.json", import.meta.url)).then((r) => {
  if (!r.ok) {
    throw new Error("transformer.json " + r.status);
  }
  return r.json();
});
const CFG = SETUP.config.why;
const DATA = SETUP.data.why;

// token boxes laid out left to right, wrapping to a new row when the width runs out
function layout(g, tokens, W) {
  const boxes = [];
  let x = 24;
  let y = 60;
  for (const t of tokens) {
    const w = g.measureText(t).width + 18;
    if (x + w > W - 24) {
      x = 24;
      y += 92;
    }
    boxes.push({ t, x, y, w, h: 34 });
    x += w + 14;
  }
  return boxes;
}

function centre(b) {
  return [b.x + b.w / 2, b.y + b.h / 2];
}

// one arrow from point a to point b (straight, or bent upward when `lift` > 0)
function arrow(g, a, b, color, lift) {
  g.strokeStyle = color;
  g.lineWidth = 2.5;
  g.beginPath();
  g.moveTo(a[0], a[1]);
  const mid = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - lift];
  g.quadraticCurveTo(mid[0], mid[1], b[0], b[1]);
  g.stroke();
  g.fillStyle = color;
  g.beginPath();
  g.arc(b[0], b[1], 4, 0, 7);
  g.fill();
}

// one RNN step between neighbours; across a row break it leaves to the right edge and comes back from the left edge
function rnnHop(g, W, from, to, color) {
  const y1 = from.y + 26;
  const y2 = to.y + 26;
  if (from.y === to.y) {
    arrow(g, [from.x + from.w, y1], [to.x, y2], color, 0);
    return;
  }
  g.strokeStyle = color;
  g.lineWidth = 2.5;
  g.beginPath();
  g.moveTo(from.x + from.w, y1);
  g.lineTo(W - 12, y1);
  g.stroke();
  arrow(g, [12, y2], [to.x, y2], color, 0);
}

function drawPicture(g, W, c, st) {
  const font = getComputedStyle(g.canvas).fontFamily;
  g.font = `600 15px ${font}`;
  const tokens = DATA[st.s];
  const boxes = layout(g, tokens, W);
  const a = tokens.indexOf(DATA.to);
  const b = tokens.lastIndexOf(DATA.from);
  boxes.forEach((bx, i) => {
    const col = i === a ? c.b : i === b ? c.a : c.muted;
    g.strokeStyle = col;
    g.lineWidth = i === a || i === b ? 2.5 : 1.2;
    g.strokeRect(bx.x, bx.y, bx.w, bx.h);
    g.fillStyle = i === a || i === b ? col : c.ink;
    g.textBaseline = "middle";
    g.fillText(bx.t, bx.x + 9, bx.y + bx.h / 2);
  });
  if (st.mode === "rnn") {
    for (let i = a; i < b; i++) {
      rnnHop(g, W, boxes[i], boxes[i + 1], c.r);
    }
    return;
  }
  const p = centre(boxes[a]);
  const q = centre(boxes[b]);
  arrow(g, [p[0], p[1] - 17], [q[0], q[1] - 17], c.r, 40);
}

function liveBox(st) {
  const tokens = DATA[st.s];
  const hops = st.mode === "rnn" ? rnnHops(tokens, DATA.from, DATA.to) : 1;
  const lines = [`<p class="fintro">${fill(UI.hops, { from: DATA.from, to: DATA.to, k: hops })}</p>`];
  if (st.mode === "rnn") {
    lines.push(`<p class="verdict">${fill(UI.keptLine, { p: Math.round(CFG.keep * 100), v: fmt(kept(CFG.keep, hops)) })}</p>`);
  } else {
    lines.push(`<p class="verdict">${UI.direct}</p>`);
  }
  const s = sequentialSteps(st.mode, tokens.length);
  lines.push(`<p class="ctl-note">${fill(UI.steps, { n: tokens.length, s })} ${UI.stepsWhy[st.mode]}</p>`);
  return lines.join("");
}

function mountControls(ui, st) {
  const modes = Object.keys(UI.modes).map((m) => {
    return [m, UI.modes[m]];
  });
  const sentences = Object.keys(UI.sentences).map((k) => {
    return [k, UI.sentences[k]];
  });
  ui.choice(UI.mode, modes, st, "mode");
  ui.choice(UI.sentence, sentences, st, "s");
  ui.note(UI.legend);
}

export default {
  slug: "transformer-why",
  title: "Transformer มาจากไหน: จาก RNN ที่อ่านทีละคำ สู่ attention ที่ต่อตรง",
  en: "Why the Transformer",
  example: "40_transformer_why",
  ...TEXT,
  mount(ui) {
    const st = { mode: "rnn", s: "near" };
    mountControls(ui, st);
    return {
      draw2d(g, W, H, c) {
        drawPicture(g, W, c, st);
      },
      live() {
        return liveBox(st);
      },
    };
  },
};
