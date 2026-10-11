// chapters.js — chapters and lesson order come from web/data/chapters.json (owner, 2026-10-11 22:56: reindex and new
// categories by editing JSON, not code). Lessons are loaded from the file names listed there. Each lesson is numbered
// chapter.topic by its place in the JSON; lesson text writes {#slug} instead of a number, and resolve() fills in the
// current number, so moving a lesson never leaves a stale "บท 3.7" behind. Docs are renumbered by `npm run reindex`.
const doc = await fetch(new URL("../data/chapters.json", import.meta.url)).then((r) => {
  if (!r.ok) throw new Error("chapters.json " + r.status);
  return r.json();
});
const modules = await Promise.all(doc.chapters.map((c) => Promise.all(c.lessons.map((l) => import(`../lessons/${l.file}.js`)))));

export const GROUPS = doc.chapters.map((c, ci) => ({ id: c.id, title: c.title, lessons: modules[ci].map((m) => m.default) }));
export const NUM = new Map(GROUPS.flatMap((g, gi) => g.lessons.map((l, li) => [l, `${gi + 1}.${li + 1}`])));
export const CHAPTER = new Map(GROUPS.flatMap((g, gi) => g.lessons.map((l) => [l, `${gi + 1} ${g.title}`])));
export const LESSONS = GROUPS.flatMap((g) => g.lessons);
const BY_SLUG = new Map(LESSONS.map((l) => [l.slug, NUM.get(l)]));

// "{#token-id}" → "3.4" (an unknown slug shows "?" so a typo is visible on the page)
export const resolve = (s) => (typeof s === "string" ? s.replace(/\{#([a-z0-9-]+)\}/g, (_, slug) => BY_SLUG.get(slug) ?? "?") : s);
// every string inside a lesson object (arrays and plain objects too; functions are left alone)
function resolveDeep(v) {
  if (typeof v === "string") return resolve(v);
  if (Array.isArray(v)) return v.map(resolveDeep);
  if (v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype) {
    for (const k of Object.keys(v)) if (typeof v[k] !== "function") v[k] = resolveDeep(v[k]);
  }
  return v;
}
for (const l of LESSONS) resolveDeep(l);
