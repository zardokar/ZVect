# 30 HNSW beam (efSearch): on the bottom layer keep the ef closest points found so far instead of one.
# Top layer: start at the closest of 3 hubs. Wider beam = more points measured, fewer misses.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import distance, fmt

P = [
    [0.9, 0.1, 0.0], [0.8, 0.2, 0.1], [1.0, 0.0, 0.1], [0.7, 0.1, 0.2], [0.9, 0.3, 0.0], [0.6, 0.2, 0.1], [0.8, 0.0, 0.3], [0.55, 0.45, 0.0],
    [0.1, 0.9, 0.0], [0.2, 0.8, 0.1], [0.0, 1.0, 0.1], [0.1, 0.7, 0.2], [0.3, 0.9, 0.0], [0.2, 0.6, 0.1], [0.0, 0.8, 0.3], [0.4, 0.6, 0.05],
    [0.0, 0.1, 0.9], [0.1, 0.2, 0.8], [0.1, 0.0, 1.0], [0.2, 0.1, 0.7], [0.0, 0.3, 0.9], [0.1, 0.2, 0.6], [0.3, 0.0, 0.8], [0.05, 0.4, 0.6],
]
def name(i): return "fat"[i // 8] + str(i % 8 + 1)   # f1..f8 food, a1..a8 animal, t1..t8 tech

def graph(M):                          # link each point to its M nearest, both ways
    nb = [set() for _ in P]
    for i, p in enumerate(P):
        near = sorted((distance(p, q), j) for j, q in enumerate(P) if j != i)[:M]
        for _, j in near: nb[i].add(j); nb[j].add(i)
    return [sorted(s) for s in nb]

HUBS = [0, 8, 16]

def search(q, nb, ef):
    seen = {}
    def d(i):
        if i not in seen: seen[i] = distance(q, P[i])
        return seen[i]
    key = lambda i: (d(i), i)
    start = HUBS[0]
    for h in HUBS:                                   # top layer
        if d(h) < d(start): start = h
    visited = {start}
    cand, keep = [start], [start]                    # bottom layer: beam of width ef
    while cand:
        cand.sort(key=key)
        c = cand.pop(0)                              # closest point not expanded yet
        if d(c) > d(keep[-1]): break                 # farther than the worst kept: stop
        for e in nb[c]:
            if e in visited: continue
            visited.add(e)
            if len(keep) < ef or d(e) < d(keep[-1]):
                cand.append(e); keep.append(e); keep.sort(key=key)
                if len(keep) > ef: keep.pop()
    return keep[0], keep, len(seen)

nb = graph(2)
q = [0.5, 0.7, 0.1]
b = 0
for i, p in enumerate(P):
    if distance(q, p) < distance(q, P[b]): b = i
print("query = " + fmt(q) + ", true nearest = " + name(b))
for ef in [1, 2, 4, 8]:
    best, keep, measured = search(q, nb, ef)
    print("ef = " + str(ef) + ": answer " + name(best) + ", kept " + " ".join(name(i) for i in keep) + ", measured " + str(measured) + " of " + str(len(P)) +
          ("  (found it)" if best == b else "  (missed)"))
