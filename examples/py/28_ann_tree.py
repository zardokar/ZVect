# 28 ANN with a random-split tree (Annoy-style, as in the Serengil clip):
# split by the line halfway between two random points, repeat until a group has <= 5 points; walk down to search.
import sys, os, math; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import dot, sub, add, scale, distance, fmt

LEAF = 5
def minstd(seed):                             # tiny repeatable random, same in JS / Python / C++
    state = [seed]
    def r():
        state[0] = (state[0] * 48271) % 2147483647
        return state[0] / 2147483647
    for _ in range(10):
        r()
    return r

def make_points(n, seed):                     # n points in [0, 100), two decimals
    r, P = minstd(seed), []
    for _ in range(n):
        x = math.floor(r() * 10000) / 100; y = math.floor(r() * 10000) / 100
        P.append([x, y])
    return P

# normal n = v1 - v2, constant c = n . (v1 + v2) / 2 ; right if n . v > c, else left
def plane(v1, v2):
    n = sub(v1, v2)
    return n, dot(n, scale(add(v1, v2), 0.5))
def side(h, v): return "right" if dot(h[0], v) > h[1] else "left"

def build(vs, r):
    if len(vs) <= LEAF:
        return {"value": vs}
    i = j = 0
    while i == j:
        i = math.floor(r() * len(vs)); j = math.floor(r() * len(vs))
    h = plane(vs[i], vs[j])
    L = [v for v in vs if side(h, v) == "left"]; R = [v for v in vs if side(h, v) == "right"]
    if not L or not R:
        return {"value": vs}
    return {"h": h, "value": vs, "left": build(L, r), "right": build(R, r)}

P = make_points(1000, 42)
tree = build(P, minstd(1))
for q in [[50, 50], [30, 30]]:
    t, sizes = tree, []
    while "h" in t:
        sizes.append(len(t["value"])); t = t["left"] if side(t["h"], q) == "left" else t["right"]
    best, truth = t["value"][0], P[0]
    for v in t["value"]:
        if distance(q, v) < distance(q, best): best = v
    for v in P:
        if distance(q, v) < distance(q, truth): truth = v
    print("query " + fmt(q) + ": " + str(len(sizes)) + " steps, group sizes " + " > ".join(map(str, sizes)) + " > " + str(len(t["value"])))
    print("  tree answer " + fmt(best) + " dist " + fmt(distance(q, best)) + " | true nearest " + fmt(truth) + " dist " + fmt(distance(q, truth)))
    print("  measured " + str(len(sizes) + len(t["value"])) + " instead of " + str(len(P)) + ("  (found the true nearest)" if best is truth else "  (missed)"))
