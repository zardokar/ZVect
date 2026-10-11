# 13 Vector search: a small 2-layer graph walk (the idea behind HNSW) instead of measuring every point.
# top layer = 3 hubs (one per group), bottom layer = each point linked to its M nearest points.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import distance, fmt

P = [
    [0.9, 0.1, 0.0], [0.8, 0.2, 0.1], [1.0, 0.0, 0.1], [0.7, 0.1, 0.2], [0.9, 0.3, 0.0], [0.6, 0.2, 0.1], [0.8, 0.0, 0.3], [0.55, 0.45, 0.0],
    [0.1, 0.9, 0.0], [0.2, 0.8, 0.1], [0.0, 1.0, 0.1], [0.1, 0.7, 0.2], [0.3, 0.9, 0.0], [0.2, 0.6, 0.1], [0.0, 0.8, 0.3], [0.4, 0.6, 0.05],
    [0.0, 0.1, 0.9], [0.1, 0.2, 0.8], [0.1, 0.0, 1.0], [0.2, 0.1, 0.7], [0.0, 0.3, 0.9], [0.1, 0.2, 0.6], [0.3, 0.0, 0.8], [0.05, 0.4, 0.6],
]
def name(i): return "fat"[i // 8] + str(i % 8 + 1)   # f1..f8 food, a1..a8 animal, t1..t8 tech
HUBS = [0, 8, 16]

def graph(M):                      # link each point to its M nearest, both ways
    nb = [set() for _ in P]
    for i, p in enumerate(P):
        near = sorted((distance(p, q), j) for j, q in enumerate(P) if j != i)[:M]
        for _, j in near: nb[i].add(j); nb[j].add(i)
    return [sorted(s) for s in nb]

def walk(q, nb):                   # greedy: keep moving to a closer neighbour, stop when none is closer
    seen = {}
    def d(i):
        if i not in seen: seen[i] = distance(q, P[i])
        return seen[i]
    cur = HUBS[0]
    for h in HUBS:                 # top layer
        if d(h) < d(cur): cur = h
    path = [cur]
    while True:                    # bottom layer
        best = cur
        for j in nb[cur]:
            if d(j) < d(best): best = j
        if best == cur: break
        cur = best; path.append(cur)
    return cur, len(seen), path

q = [0.5, 0.7, 0.1]
b = 0
for i, p in enumerate(P):
    if distance(q, p) < distance(q, P[b]): b = i
print("query = " + fmt(q))
print("measure all 24 points -> " + name(b) + " " + fmt(distance(q, P[b])))
for M in [1, 2, 3]:
    cur, count, path = walk(q, graph(M))
    print("graph M=" + str(M) + ": measured " + str(count) + " points, path " + " > ".join(name(i) for i in path) +
          " -> " + name(cur) + " " + fmt(distance(q, P[cur])) + ("  (same)" if cur == b else "  (missed)"))
