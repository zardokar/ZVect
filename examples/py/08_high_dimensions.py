# 08 High dimensions: with many dimensions, every point is almost the same distance away
# 200 random points in [0, 1]^d and one random query; how spread out are the distances?
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import cosine, distance, fmt

# tiny seeded random numbers (same in JS / Python / C++): x = x * 48271 mod (2^31 - 1)
seed = 7
def rand():
    global seed
    seed = (seed * 48271) % 2147483647
    return seed / 2147483647

# the first few numbers after a small seed are tiny, so start() throws 10 away
def start(s):
    global seed
    seed = s
    for _ in range(10):
        rand()

def point(d):
    return [rand() for _ in range(d)]

for d in [2, 10, 100, 1000]:
    start(7)
    q = point(d)
    ds, cs = [], []
    for i in range(200):
        p = point(d)
        ds.append(distance(q, p))
        cs.append(cosine(q, p))
    lo, hi = min(ds), max(ds)
    print("d=" + str(d) + "  distance " + fmt(lo) + " .. " + fmt(hi) + "  spread " + fmt((hi - lo) / lo) +
          "  cosine " + fmt(min(cs)) + " .. " + fmt(max(cs)))
