// Lesson 10.3 position-encoding — COMPONENT: slider, clock dials and live box. One idea: a position is a set of clock hands
// turning at different speeds; (sin, cos) of every hand is the position vector. Logic: web/js/attention.js · text: 42_position_encoding.text.js.
import { fmt } from "../../lib/zvect.js";
import { M } from "../js/kit.js";
import { position, handAngles, positionCos } from "../js/attention.js";
import { TEXT, UI, fill } from "./42_position_encoding.text.js";

const SETUP = await fetch(new URL("../data/transformer.json", import.meta.url)).then((r) => {
  if (!r.ok) {
    throw new Error("transformer.json " + r.status);
  }
  return r.json();
});
const CFG = SETUP.config.position;

function dial(g, cx, cy, r, angle, c, title, sub, font) {
  g.strokeStyle = c.grid;
  g.lineWidth = 2;
  g.beginPath();
  g.arc(cx, cy, r, 0, 7);
  g.stroke();
  const x = cx + r * 0.85 * Math.sin(angle);
  const y = cy - r * 0.85 * Math.cos(angle);
  g.strokeStyle = c.a;
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(cx, cy);
  g.lineTo(x, y);
  g.stroke();
  g.fillStyle = c.ink;
  g.textAlign = "center";
  g.font = `700 14px ${font}`;
  g.fillText(title, cx, cy + r + 22);
  g.font = `12px ${font}`;
  g.fillStyle = c.muted;
  g.fillText(sub, cx, cy + r + 40);
}

function drawDials(g, W, H, c, st) {
  const font = getComputedStyle(g.canvas).fontFamily;
  const angles = handAngles(st.pos, CFG.dim, CFG.base);
  const n = angles.length;
  const r = Math.min(W / (n * 2.6), H / 3.4);
  angles.forEach((a, i) => {
    const cx = (W / n) * (i + 0.5);
    const title = fill(UI.hand, { i: i + 1 });
    const speed = i === 0 ? UI.fastest : i === n - 1 ? UI.slowest : "";
    const sub = "θ = " + fmt(a) + (speed ? " · " + speed : "");
    dial(g, cx, H / 2 - 20, r, a, c, title, sub, font);
  });
  g.textAlign = "left";
  g.fillStyle = c.ink;
  g.font = `700 16px ${font}`;
  g.fillText(UI.posLabel + " = " + st.pos, 20, 30);
}

function liveBox(st) {
  const pe = position(st.pos, CFG.dim, CFG.base);
  const vec = M.math(M.sub(M.t("PE"), M.n(st.pos)), M.o("="), M.tuple(pe.map((x) => {
    return M.n(fmt(x).replace("-", "−"));
  })));
  const rows = CFG.probes.map((k) => {
    const other = st.pos + k;
    const cs = positionCos(pe, position(other, CFG.dim, CFG.base));
    return `<tr><td>pos ${other}</td><td>${k}</td><td>${fmt(cs)}</td></tr>`;
  }).join("");
  const head = UI.head.map((h) => {
    return `<th>${h}</th>`;
  }).join("");
  return `<p class="fintro">${fill(UI.vecIntro, { p: st.pos, d: CFG.dim })}</p>` + vec + `<p class="fintro">${UI.simIntro}</p>` +
    `<div class="scroll"><table class="rank"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

export default {
  slug: "position-encoding",
  title: "ตำแหน่งแบบ sin / cos: เข็มนาฬิกาหลายความเร็ว",
  en: "Sinusoidal position encoding",
  example: "42_position_encoding",
  ...TEXT,
  mount(ui) {
    const st = { pos: CFG.start };
    ui.number(UI.pos, UI.posLabel, st, "pos", { min: 0, max: CFG.maxPos, step: 1 });
    ui.note(UI.legend);
    return {
      draw2d(g, W, H, c) {
        drawDials(g, W, H, c, st);
      },
      live() {
        return liveBox(st);
      },
    };
  },
};
