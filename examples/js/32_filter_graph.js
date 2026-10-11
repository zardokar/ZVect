// 32 Filtering during the search: keep only the points that pass a filter, walk only on them.
// With k links per point the graph falls apart when fewer than about 1/k of the points pass (Qdrant talk).
function minstd(seed) {                          // tiny repeatable random, same in JS / Python / C++
  const r = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  for (let i = 0; i < 10; i++) r();
  return r;
}
const N = 2000;
const ru = minstd(9), keepU = [];
for (let i = 0; i < N; i++) keepU.push(ru());   // point i passes the filter if keepU[i] < kept fraction

function makeGraph(k) {                          // random links: each point adds k/2 links (both ways) -> about k per point
  const r = minstd(5), nb = [];
  for (let i = 0; i < N; i++) nb.push(new Set());
  for (let i = 0; i < N; i++) for (let t = 0; t < k / 2; t++) {
    let j = Math.floor(r() * N);
    if (j === i) j = (j + 1) % N;
    nb[i].add(j); nb[j].add(i);
  }
  return nb;
}
function largestShare(nb, f) {                   // share of the kept points inside the largest connected group
  const kept = new Set(), seen = new Set();
  for (let i = 0; i < N; i++) if (keepU[i] < f) kept.add(i);
  let big = 0;
  for (const s of kept) {
    if (seen.has(s)) continue;
    let size = 0; const stack = [s]; seen.add(s);
    while (stack.length) { const x = stack.pop(); size++; for (const y of nb[x]) if (kept.has(y) && !seen.has(y)) { seen.add(y); stack.push(y); } }
    if (size > big) big = size;
  }
  return Math.round((100 * big) / kept.size);
}

for (const k of [4, 8, 16]) {
  const nb = makeGraph(k);
  const row = [0.5, 0.25, 0.125, 0.0625].map((f) => f * 100 + "% kept -> " + largestShare(nb, f) + "%");
  console.log("k = " + k + " (1/k = " + (100 / k).toFixed(2) + "%): " + row.join(", "));
}
