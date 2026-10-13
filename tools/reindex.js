// npm run reindex  [--check] [--dry]
// Rebuilds every chapter number in the docs from web/data/chapters.json (the ONE place for chapters and order).
//   README.md      table between <!-- chapters:start --> and <!-- chapters:end -->
//   llms.txt       the "- Lessons ..." line (after "numbered chapter.topic: ")
//   REFERENCE.md   the chapter list line + every chapter.topic number in "บท" / "เสนอ:" lines and in the
//                  "ใช้ในบท" column, mapped old -> new by slug through web/data/chapters.lock.json
//   lock file      rewritten with the new numbers (so the next run maps from here)
// --check : change nothing, exit 1 if a file is out of date (used by tests)
// --dry   : print every REFERENCE.md number change, write nothing
// Lesson text and the Dict page never hold numbers: they write {#slug} and web/js/chapters.js resolves it.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const P = (f) => join(ROOT, f);
const CHECK = process.argv.includes("--check");
const DRY = process.argv.includes("--dry");

export function plan(doc) {
  const errors = [];
  const num = new Map(); // slug -> "c.t"
  const chapterNo = new Map(); // chapter id -> c
  const ids = new Set();
  doc.chapters.forEach((c, ci) => {
    if (ids.has(c.id)) errors.push(`duplicate chapter id ${c.id}`);
    ids.add(c.id);
    chapterNo.set(c.id, ci + 1);
    for (const k of ["id", "title", "en"]) if (!c[k]) errors.push(`chapter ${ci + 1} has no ${k}`);
    c.lessons.forEach((l, li) => {
      if (num.has(l.slug)) errors.push(`duplicate slug ${l.slug}`);
      num.set(l.slug, `${ci + 1}.${li + 1}`);
      for (const k of ["file", "slug", "short", "readme", "llms"]) if (!l[k]) errors.push(`${l.slug || l.file}: no ${k}`);
    });
  });
  return { num, chapterNo, errors };
}

// old number -> new number, by slug; an unknown topic keeps its topic and follows its chapter id.
export function mapper(lock, num, chapterNo) {
  const oldSlug = new Map(Object.entries(lock.numbers).map(([s, n]) => [n, s]));
  const oldChapterId = new Map(Object.entries(lock.chapters).map(([id, c]) => [String(c), id]));
  const warn = [];
  const one = (n) => {
    const s = oldSlug.get(n);
    if (s && num.has(s)) return num.get(s);
    const [c, t] = n.split(".");
    if (!s && t.length > 1) return n; // 7.25, 3.59: a value, not a topic (topics past 9 must be in the lock)
    const id = oldChapterId.get(c);
    if (s && !num.has(s)) warn.push(`${n} (${s}) was removed`);
    if (id && chapterNo.has(id)) return `${chapterNo.get(id)}.${t}`;
    warn.push(`${n} has no new place, left as is`);
    return n;
  };
  const key = (n) => n.split(".").map(Number);
  // "a–b" -> every old topic a..b -> new numbers -> grouped back into runs
  const range = (a, b) => {
    const [ca, ta] = key(a), [cb, tb] = key(b);
    if (ca !== cb || tb < ta) return `${one(a)}–${one(b)}`;
    const all = [];
    for (let t = ta; t <= tb; t++) all.push(one(`${ca}.${t}`));
    return runs(all);
  };
  return { one, range, warn };
}

export function runs(list) {
  const k = (n) => n.split(".").map(Number);
  const out = [];
  let start = list[0], prev = list[0];
  const push = () => out.push(start === prev ? start : `${start}–${prev}`);
  for (const n of list.slice(1)) {
    const [pc, pt] = k(prev), [c, t] = k(n);
    if (c === pc && t === pt + 1) { prev = n; continue; }
    push(); start = prev = n;
  }
  push();
  return out.join(", ");
}

// numbers like 3.7 or 4.1–4.3; not 0.95, 68.8, 1.43, −3.6, ~1.5 ms, 1.2 เท่า, v1.2.3, a point Q(8.5,1.2)
const NUM_RE = /(?<![\d.\-−+$~×,])([1-9]\.[1-9]\d?)(?:–([1-9]\.[1-9]\d?))?(?![\d%]|\.\d|,\d|\s?(?:ms|s\b|x\b|×|เท่า|วินาที|GB|MB|KB))/g;

export function remapText(text, m, log) {
  return text.replace(NUM_RE, (all, a, b) => {
    const to = b ? m.range(a, b) : m.one(a);
    if (to !== all && log) log.push(`${all} -> ${to}`);
    return to;
  });
}

function referenceList(doc, num) {
  const n = doc.chapters.reduce((s, c) => s + c.lessons.length, 0);
  const items = doc.chapters.flatMap((c) => c.lessons.map((l) => `${num.get(l.slug)} ${l.short}`)).join(" · ");
  return `- เลขบทในไฟล์นี้ใช้เลขแบบบท.หัวข้อ สร้างด้วย \`npm run reindex\` จาก \`web/data/chapters.json\` (${doc.chapters.length} บท ${n} หัวข้อ; ประวัติการเลื่อนเลขอยู่ใน checkpoint): ${items}`;
}

export function rebuildReference(src, doc, num, m, log) {
  const lines = src.split("\n");
  let inSourceTable = false, usedCol = -1;
  return lines.map((line) => {
    if (line.startsWith("- เลขบทในไฟล์นี้ใช้เลขแบบบท.หัวข้อ")) return referenceList(doc, num);
    if (line.startsWith("#")) return line;
    if (line.startsWith("| ref |") && line.includes("ใช้ในบท")) {
      inSourceTable = true;
      usedCol = line.split("|").findIndex((c) => c.trim() === "ใช้ในบท");
      return line;
    }
    if (inSourceTable) {
      if (!line.startsWith("|")) { inSourceTable = false; return line; }
      const cells = line.split("|");
      if (cells[usedCol] !== undefined) cells[usedCol] = remapText(cells[usedCol], m, log);
      return cells.join("|");
    }
    if (/บท|เสนอ:/.test(line)) return remapText(line, m, log);
    return line;
  }).join("\n");
}

export function readmeBlock(doc, num) {
  const n = doc.chapters.reduce((s, c) => s + c.lessons.length, 0);
  const last = Math.max(...doc.chapters.flatMap((c) => c.lessons.map((l) => parseInt(l.file, 10))));
  const intro = (doc.readme_intro || "").replace(/\{#ch:([a-z0-9-]+)\}/g, (_, id) =>
    String(doc.chapters.findIndex((c) => c.id === id) + 1 || "?"));
  const rows = doc.chapters.flatMap((c, ci) => c.lessons.map((l, li) =>
    `| ${li === 0 ? `${ci + 1} ${c.title}` : ""} | ${num.get(l.slug)} | ${l.readme} | \`${l.file}\` |`));
  return [
    "<!-- chapters:start (สร้างด้วย npm run reindex จาก web/data/chapters.json ห้ามแก้ตรงนี้) -->",
    intro, "",
    `${doc.chapters.length} บท ${n} หัวข้อ`, "",
    "| บท | หัวข้อ | เรื่อง | ไฟล์ |", "|---|---|---|---|", ...rows, "",
    `เลขหน้าไฟล์ (\`01_\`…\`${String(last).padStart(2, "0")}_\`) คือลำดับที่เขียนไฟล์ ไม่ใช่ลำดับบท ลำดับบทและหมวด (บท) กำหนดใน \`web/data/chapters.json\` ที่เดียว แก้แล้วรัน \`npm run reindex\``,
    "<!-- chapters:end -->",
  ].join("\n");
}

export function rebuildReadme(src, doc, num) {
  const re = /<!-- chapters:start[\s\S]*?<!-- chapters:end -->/;
  if (!re.test(src)) throw new Error("README.md: markers <!-- chapters:start --> / <!-- chapters:end --> not found");
  return src.replace(re, () => readmeBlock(doc, num));
}

export function rebuildLlms(src, doc, num) {
  const head = "numbered chapter.topic: ";
  const last = Math.max(...doc.chapters.flatMap((c) => c.lessons.map((l) => parseInt(l.file, 10))));
  const list = doc.chapters.map((c, ci) =>
    `${ci + 1} ${c.en} (${c.lessons.map((l) => `${num.get(l.slug)} ${l.llms}`).join(", ")})`).join(" | ");
  const tail = ` File prefixes (01_…${String(last).padStart(2, "0")}_) are creation order; chapters and order live in web/data/chapters.json (edit it, then run \`npm run reindex\`).`;
  let hit = false;
  const out = src.split("\n").map((line) => {
    if (!line.startsWith("- Lessons (") || !line.includes(head)) return line;
    hit = true;
    return line.slice(0, line.indexOf(head) + head.length) + list + "." + tail;
  }).join("\n");
  if (!hit) throw new Error(`llms.txt: no "- Lessons (... ${head}" line`);
  return out;
}

function lockOf(doc, num) {
  return {
    _how: "Written by npm run reindex. The numbering the docs had at the last reindex; used to map old -> new. Do not edit by hand.",
    chapters: Object.fromEntries(doc.chapters.map((c, ci) => [c.id, ci + 1])),
    numbers: Object.fromEntries([...num]),
  };
}

function main() {
  const doc = JSON.parse(readFileSync(P("web/data/chapters.json"), "utf8"));
  const lock = JSON.parse(readFileSync(P("web/data/chapters.lock.json"), "utf8"));
  const { num, chapterNo, errors } = plan(doc);
  for (const c of doc.chapters) for (const l of c.lessons) {
    if (!existsSync(P(`web/lessons/${l.file}.js`))) errors.push(`missing web/lessons/${l.file}.js`);
    for (const [d, ext] of [["js", "js"], ["py", "py"], ["cpp", "cpp"]])
      if (!existsSync(P(`examples/${d}/${l.file}.${ext}`))) errors.push(`missing examples/${d}/${l.file}.${ext}`);
  }
  if (errors.length) { console.error(errors.join("\n")); process.exit(1); }

  const m = mapper(lock, num, chapterNo);
  const log = [];
  const files = {
    "README.md": (s) => rebuildReadme(s, doc, num),
    "llms.txt": (s) => rebuildLlms(s, doc, num),
    "REFERENCE.md": (s) => rebuildReference(s, doc, num, m, log),
    "web/data/chapters.lock.json": () => JSON.stringify(lockOf(doc, num), null, 2) + "\n",
  };
  const stale = [];
  for (const [f, fn] of Object.entries(files)) {
    const before = readFileSync(P(f), "utf8");
    const after = fn(before);
    if (after === before) continue;
    stale.push(f);
    if (!CHECK && !DRY) writeFileSync(P(f), after);
  }
  if (DRY) console.log(log.join("\n"));
  for (const w of new Set(m.warn)) console.warn("warn:", w);
  const n = [...num].length;
  if (CHECK) {
    if (stale.length) { console.error("out of date (run npm run reindex): " + stale.join(", ")); process.exit(1); }
    console.log(`reindex: up to date (${doc.chapters.length} chapters, ${n} topics)`);
  } else {
    console.log(`reindex: ${doc.chapters.length} chapters, ${n} topics; ${DRY ? "would change" : "changed"}: ${stale.join(", ") || "nothing"}; ${log.length} REFERENCE numbers remapped`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
