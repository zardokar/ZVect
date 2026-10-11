# 32 Filtering during the search: keep only the points that pass a filter, walk only on them.
# With k links per point the graph falls apart when fewer than about 1/k of the points pass (Qdrant talk).
import math

def minstd(seed):                                # tiny repeatable random, same in JS / Python / C++
    state = [seed]
    def r():
        state[0] = (state[0] * 48271) % 2147483647
        return state[0] / 2147483647
    for _ in range(10):
        r()
    return r

N = 2000
ru = minstd(9)
keep_u = [ru() for _ in range(N)]                # point i passes the filter if keep_u[i] < kept fraction

def make_graph(k):                               # random links: each point adds k/2 links (both ways) -> about k per point
    r, nb = minstd(5), [set() for _ in range(N)]
    for i in range(N):
        for _ in range(k // 2):
            j = math.floor(r() * N)
            if j == i: j = (j + 1) % N
            nb[i].add(j); nb[j].add(i)
    return nb

def largest_share(nb, f):                        # share of the kept points inside the largest connected group
    kept = {i for i in range(N) if keep_u[i] < f}
    seen, big = set(), 0
    for s in kept:
        if s in seen: continue
        size, stack = 0, [s]; seen.add(s)
        while stack:
            x = stack.pop(); size += 1
            for y in nb[x]:
                if y in kept and y not in seen: seen.add(y); stack.append(y)
        big = max(big, size)
    return math.floor(100 * big / len(kept) + 0.5)

for k in [4, 8, 16]:
    nb = make_graph(k)
    row = [f"{f * 100:g}% kept -> {largest_share(nb, f)}%" for f in [0.5, 0.25, 0.125, 0.0625]]
    print("k = " + str(k) + " (1/k = " + f"{100 / k:.2f}" + "%): " + ", ".join(row))
