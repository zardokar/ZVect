// format.js — LOGIC: numbers and templates as text. Symbols (−∞, %, ×, list separator) come from text/*.json "format".
// Pure, no DOM.

// x with `digits` decimals; -0 -> 0; exact ties round to even (same as ZVect lib fmt); ±∞ / NaN / null (masked) -> symbols
export function fmt(x, digits, symbols) {
  if (x === null || x === -Infinity) {
    return symbols.negInf;
  }
  if (x === Infinity) {
    return symbols.posInf;
  }
  if (!Number.isFinite(x)) {
    return symbols.nan;
  }
  const v = x + 0;
  const scale = Math.pow(10, digits);
  const s = Math.abs(v) * scale;
  const fl = Math.floor(s);
  if (s - fl === 0.5 && fl % 2 === 0) {
    return ((Math.sign(v) * fl) / scale).toFixed(digits);
  }
  return v.toFixed(digits);
}

// "{name}" -> vars[name] as text (arrays joined with sep); unknown names stay as they are
export function fill(template, vars, sep) {
  return template.replace(/\{(\w+)\}/g, (whole, name) => {
    if (!Object.hasOwn(vars, name)) {
      return whole;
    }
    const v = vars[name];
    return Array.isArray(v) && sep !== undefined ? v.join(sep) : String(v);
  });
}

// "rows × cols" of a matrix through the text template format.shape
export function shapeLabel(M, template) {
  const rows = Array.isArray(M) ? M.length : 0;
  const cols = rows && Array.isArray(M[0]) ? M[0].length : 0;
  return fill(template, { rows, cols });
}

// probability 0..1 -> "51.3%" through the text template format.pct
export function pct(p, digits, symbols) {
  return fill(symbols.pct, { v: fmt(p * 100, digits, symbols) });
}
