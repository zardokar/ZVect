// tokdraw.js — the "token → number" picture shared by 3.1 Tokenization, 3.2 BPE and 3.3 GPT tokenizer (WIP202610031, owner 2026-10-11 14:58:
// "อยากได้ภาพอธิบายแบบง่ายๆ แบบนี้" with the Character tokenization slide of the BPE clip). Each token sits in a box with
// an arrow straight down to its number; one line per row, the whole picture shrinks to fit and the learner zooms in.
// rows = [{ title, color, toks: [{ t, id }] }]  (id "?" = not in the vocabulary, drawn in the result colour)

// a space is drawn as ␣ and a lone combining mark (Thai vowel / tone mark) on a dotted circle, so every box shows something
export const show = (t) => [...t].map((ch, i) => (ch === " " ? "␣" : i === 0 && /\p{M}/u.test(ch) ? "◌" + ch : ch)).join("");

export function tokenRows(g, W, H, c, rows, view = null) {
  const font = getComputedStyle(g.canvas).fontFamily;
  const pad = 14;
  // one line per row, never wrapped (owner, 2026-10-11 15:45: "ทำ Zoom ดีกว่าขึ้นบรรทัดใหม่"): lay out at size 1,
  // then shrink the whole picture until the longest row fits; the learner zooms in with the wheel / pinch.
  const fs = 15, idfs = 14, bh = 26, gap = 5, arrow = 22, lineH = bh + arrow + idfs + 14, titleH = 22;
  const out = [];
  let y = pad, widest = 0;
  for (const r of rows) {
    out.push({ kind: "title", r, y: y + 14 });
    y += titleH;
    let x = pad;
    for (const tk of r.toks) {
      const label = show(tk.t);
      g.font = `600 ${fs}px ${font}`;
      const tw = g.measureText(label).width;
      g.font = `700 ${idfs}px ${font}`;
      const iw = g.measureText(String(tk.id)).width;
      const w = Math.max(tw + 12, iw + 6, 20);
      out.push({ kind: "tok", r, tk, label, x, y, w });
      x += w + gap;
    }
    g.font = `700 13.5px ${font}`;
    widest = Math.max(widest, x - gap + pad, g.measureText(r.title).width + 2 * pad);
    y += lineH + 8;
  }
  const room = view ? H - 26 : H;                            // keep the bottom strip free for the zoom hint
  const fit = Math.min(1, W / widest, room / (y + 4));        // the whole picture fits at zoom 1
  const v = view || { zoom: 1, x: 0, y: 0 };
  const cw = widest * fit * v.zoom, ch = (y + 4) * fit * v.zoom;  // keep the picture on screen while moving it
  v.x = Math.min(0, Math.max(Math.min(0, W - cw), v.x));
  v.y = ch <= room ? (room - ch) / 2 : Math.min(0, Math.max(H - ch, v.y));   // short picture: centred above the hint
  g.save();
  g.translate(v.x, v.y); g.scale(fit * v.zoom, fit * v.zoom);
  g.textAlign = "center";
  for (const b of out) {
    if (b.kind === "title") {
      g.textAlign = "left"; g.textBaseline = "alphabetic";
      g.fillStyle = b.r.color; g.font = `700 13.5px ${font}`;
      g.fillText(b.r.title, pad, b.y);
      g.textAlign = "center";
      continue;
    }
    const unk = b.tk.id === "?", col = unk ? c.r : b.r.color, cx = b.x + b.w / 2;
    g.strokeStyle = col; g.lineWidth = 1.6;
    g.beginPath(); g.roundRect ? g.roundRect(b.x, b.y, b.w, bh, 5) : g.rect(b.x, b.y, b.w, bh); g.stroke();
    g.fillStyle = c.ink; g.font = `600 ${fs}px ${font}`; g.textBaseline = "middle";
    g.fillText(b.label, cx, b.y + bh / 2 + 1);
    const y0 = b.y + bh + 3, y1 = y0 + arrow - 4;
    g.strokeStyle = c.muted; g.lineWidth = 1.3;
    g.beginPath(); g.moveTo(cx, y0); g.lineTo(cx, y1); g.stroke();
    g.fillStyle = c.muted;
    g.beginPath(); g.moveTo(cx - 3.5, y1 - 5); g.lineTo(cx + 3.5, y1 - 5); g.lineTo(cx, y1 + 1); g.fill();
    g.fillStyle = col; g.font = `700 ${idfs}px ${font}`; g.textBaseline = "top";
    g.fillText(String(b.tk.id), cx, y1 + 4);
  }
  g.restore();
  // how much it is zoomed, fixed in the corner (only when the picture is small or zoomed)
  if (view && (fit < 0.8 || v.zoom > 1)) {
    const say = `${Math.round(fit * v.zoom * 100)}% · ล้อเมาส์ / สองนิ้ว = ซูม · ลาก = เลื่อน · ดับเบิลคลิก = ทั้งหมด`;
    g.font = `600 12px ${font}`; g.textAlign = "right"; g.textBaseline = "bottom";
    const w = g.measureText(say).width + 12;
    g.fillStyle = c.bg; g.globalAlpha = 0.85; g.fillRect(W - w - 6, H - 24, w, 20); g.globalAlpha = 1;
    g.fillStyle = c.muted; g.fillText(say, W - 12, H - 8);
  }
  g.textAlign = "left"; g.textBaseline = "alphabetic";
}

// the same picture as a small static SVG (for the explanation block on top): words = [[token, id], ...] groups
export function tokenSVG(groups, { color = "var(--va)", cell = 26 } = {}) {
  const one = (grp) => {
    let x = 4, parts = "";
    for (const [t, id] of grp) {
      const cx = x + cell / 2;
      parts += `<rect x="${x + 1}" y="4" width="${cell - 2}" height="26" rx="4" style="fill:none;stroke:${color};stroke-width:1.5"/>` +
        `<text x="${cx}" y="22" text-anchor="middle" style="fill:var(--ink);font-size:15px;font-weight:600">${show(t)}</text>` +
        `<line x1="${cx}" y1="33" x2="${cx}" y2="54" style="stroke:var(--muted);stroke-width:1.3"/>` +
        `<path d="M${cx - 3.5} 50 L${cx + 3.5} 50 L${cx} 57 Z" style="fill:var(--muted)"/>` +
        `<text x="${cx}" y="73" text-anchor="middle" style="fill:${color};font-size:13.5px;font-weight:700">${id}</text>`;
      x += cell;
    }
    const w = x + 4;
    return `<svg viewBox="0 0 ${w} 80" width="${w}" height="80" aria-hidden="true">${parts}</svg>`;
  };
  // one small picture per word, in a row that wraps on narrow screens (letters keep their size)
  return `<div class="tokpic" role="img" style="display:flex;flex-wrap:wrap;gap:2px 10px;margin:6px 0" aria-label="${groups.map((g) => g.map(([t, id]) => `${t} ${id}`).join(" ")).join(", ")}">${groups.map(one).join("")}</div>`;
}
