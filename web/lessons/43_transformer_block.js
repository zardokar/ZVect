// Lesson 10.4 transformer-block — COMPONENT: controls, block diagram and live box. One idea: every stage of a block takes
// n × d_model and gives n × d_model back, so blocks stack. Logic: web/js/tblock.js · text: 43_transformer_block.text.js.
import { fmt } from "../../lib/zvect.js";
import { encoderBlock, shape } from "../js/tblock.js";
import { indexOf } from "../js/attention.js";
import { TEXT, UI, fill } from "./43_transformer_block.text.js";

const SETUP = await fetch(new URL("../data/transformer.json", import.meta.url)).then((r) => {
  if (!r.ok) {
    throw new Error("transformer.json " + r.status);
  }
  return r.json();
});
const CFG = SETUP.config.block;
const DATA = SETUP.data.block;
const FOCUS = DATA.tokens[indexOf(DATA.tokens, DATA.focus)];

function run(st) {
  return encoderBlock(DATA.X, CFG, CFG.base, st.part === "decoder");
}

// which diagram box is lit for the chosen stage (the decoder has two extra boxes before its FFN)
function litBox(st) {
  const i = UI.boxOf[st.stage];
  if (st.part === "decoder" && i >= 3) {
    return i + 2;
  }
  return i;
}

function drawBlock(g, W, H, c, st) {
  const font = getComputedStyle(g.canvas).fontFamily;
  const boxes = UI.boxes[st.part];
  const lit = litBox(st);
  const gap = Math.min(64, (H - 60) / boxes.length);
  const bw = Math.min(460, W - 160);
  const x = (W - bw) / 2;
  g.textBaseline = "middle";
  boxes.forEach((name, i) => {
    const y = 30 + i * gap;
    g.strokeStyle = i === lit ? c.a : c.muted;
    g.lineWidth = i === lit ? 3 : 1.3;
    g.strokeRect(x, y, bw, gap - 22);
    g.fillStyle = i === lit ? c.a : c.ink;
    g.font = `${i === lit ? 700 : 500} 14px ${font}`;
    g.textAlign = "center";
    g.fillText(name, x + bw / 2, y + (gap - 22) / 2);
    if (i < boxes.length - 1) {
      g.strokeStyle = c.muted;
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(x + bw / 2, y + gap - 22);
      g.lineTo(x + bw / 2, y + gap);
      g.stroke();
    }
  });
  g.textAlign = "left";
  g.fillStyle = c.muted;
  g.font = `12px ${font}`;
  g.fillText("n × d_model", x + bw + 10, 30 + (gap - 22) / 2);
  g.fillText("n × d_model", x + bw + 10, 30 + (boxes.length - 1) * gap + (gap - 22) / 2);
}

function matrixTable(A, tokens) {
  const head = A[0].map((_, j) => {
    return `<th>${j + 1}</th>`;
  }).join("");
  const rows = A.map((row, i) => {
    const cells = row.map((v) => {
      return `<td>${fmt(v).replace("-", "−")}</td>`;
    }).join("");
    return `<tr${tokens[i] === FOCUS ? ' class="win"' : ""}><td>${tokens[i]}</td>${cells}</tr>`;
  }).join("");
  return `<div class="scroll"><table class="rank"><thead><tr><th></th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function liveBox(st) {
  const r = run(st);
  const A = r[st.stage];
  const out = [`<p class="fintro">${fill(UI.tableIntro, { s: UI.stages[st.stage], shape: shape(A) })}</p>`, matrixTable(A, DATA.tokens)];
  const i = indexOf(DATA.tokens, FOCUS);
  const heads = r.heads.map((h, k) => {
    const w = h.A[i].map((v, j) => {
      return DATA.tokens[j] + " " + fmt(v);
    });
    return `<li>head ${k + 1}: ${w.join(" · ")}</li>`;
  }).join("");
  out.push(`<p class="fintro">${fill(UI.headIntro, { w: FOCUS })}</p><ul class="ctl-note">${heads}</ul>`);
  if (st.part === "decoder") {
    out.push(`<p class="ctl-note">${UI.decoderNote}</p>`);
  }
  return out.join("");
}

function mountControls(ui, st) {
  const parts = Object.keys(UI.parts).map((k) => {
    return [k, UI.parts[k]];
  });
  const stages = Object.keys(UI.stages).map((k) => {
    return [k, UI.stages[k]];
  });
  ui.choice(UI.part, parts, st, "part");
  ui.choice(UI.stage, stages, st, "stage");
  ui.note(UI.legend);
}

export default {
  slug: "transformer-block",
  title: "Transformer block: attention + feed forward ซ้อนกันได้เพราะขนาดไม่เปลี่ยน",
  en: "The Transformer block",
  example: "43_transformer_block",
  ...TEXT,
  mount(ui) {
    const st = { part: "encoder", stage: "X0" };
    mountControls(ui, st);
    return {
      draw2d(g, W, H, c) {
        drawBlock(g, W, H, c, st);
      },
      live() {
        return liveBox(st);
      },
    };
  },
};
