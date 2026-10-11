# 29 ANN with a one-layer neighbour graph: link each point to its M nearest, then walk greedily from a start point:
# step to the neighbour closest to q while it is closer; stop when no neighbour is closer.
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

def walk(q, nb, start):                # greedy walk; seen = every point we measured
    seen = {}
    def d(i):
        if i not in seen: seen[i] = distance(q, P[i])
        return seen[i]
    cur = start
    d(cur)
    path = [cur]
    while True:
        best = cur
        for j in nb[cur]:
            if d(j) < d(best): best = j
        if best == cur: break
        cur = best; path.append(cur)
    return cur, len(seen), path

nb = graph(2)
q = [0.2, 0.75, 0.1]
b = 0
for i, p in enumerate(P):
    if distance(q, p) < distance(q, P[b]): b = i
print("query = " + fmt(q) + ", true nearest = " + name(b))
for start in [8, 0, 16]:               # a1, f1, t1
    cur, count, path = walk(q, nb, start)
    print("start " + name(start) + ": path " + " -> ".join(name(i) for i in path) + ", measured " + str(count) + " of " + str(len(P)) +
          ("  (found it)" if cur == b else "  (stopped at the wrong point)"))
